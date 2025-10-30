/**
 * Populate Base Forms from LingDocs
 * 
 * Main script that uses all the helper modules to:
 * 1. Build reverse index from cache and LingDocs
 * 2. Classify compound verbs
 * 3. Identify inflection types
 * 4. Populate word_frequencies and word_verse_mapping tables
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { buildReverseIndex } from './build-reverse-inflection-index';
import { buildEnhancedReverseIndex } from './enhance-with-lingdocs';
import { classifyCompoundVerb, isCompoundVerb } from './classify-compound-verbs';
import { identifyInflectionType } from './identify-inflection-types';

const execAsync = promisify(exec);

interface DictionaryEntry {
  p?: string;
  f?: string;
  c?: string;
  c_norm?: string;
  pos_family?: string;
  e?: string;
  ts?: number;
}

async function executeD1Sql(sql: string): Promise<void> {
  const fs = await import('fs/promises');
  const path = await import('path');
  const tempFile = path.join(process.cwd(), `.temp-populate-${Date.now()}.sql`);
  
  await fs.writeFile(tempFile, sql, 'utf-8');
  
  try {
    const { stdout, stderr } = await execAsync(
      `npx wrangler d1 execute pashto-bible-db --remote --file=${tempFile}`,
      { maxBuffer: 50 * 1024 * 1024, cwd: '/Users/jeremysamuels/Documents/pashto-bible-search' }
    );
    
    if (stderr && !stderr.includes('warning')) {
      console.error(`   ⚠️  ${stderr}`);
    }
  } catch (error: any) {
    console.error(`   ❌ Error: ${error.message}`);
    throw error;
  } finally {
    await fs.unlink(tempFile).catch(() => {});
  }
}

async function loadDictionary(): Promise<Map<string, DictionaryEntry>> {
  const dictPath = join(process.cwd(), 'app/data/full_dictionary_enriched.json');
  const content = await readFile(dictPath, 'utf-8');
  const data = JSON.parse(content);
  
  const entries = Array.isArray(data) ? data : (data.entries || []);
  const dictMap = new Map<string, DictionaryEntry>();
  
  for (const entry of entries) {
    if (entry.p) {
      if (!dictMap.has(entry.p)) {
        dictMap.set(entry.p, entry);
      }
    }
  }
  
  return dictMap;
}

function classifyPos(entry: DictionaryEntry): 'verb' | 'noun' | 'adjective' | 'other' {
  const pos = [
    entry.c,
    entry.c_norm,
    entry.pos_family
  ].join(' ').toLowerCase();
  
  if (pos.includes('verb') || /\bv\./.test(pos)) return 'verb';
  if (pos.includes('noun') || /\bn\./.test(pos)) return 'noun';
  if (pos.includes('adj')) return 'adjective';
  return 'other';
}

function determineWordType(
  entry: DictionaryEntry,
  form: string,
  baseForm: string
): 'simple' | 'compound_dynamic' | 'compound_stative' | 'inflected' | 'conjugated' {
  if (isCompoundVerb(entry)) {
    const type = classifyCompoundVerb(entry, form);
    if (type === 'stative') return 'compound_stative';
    if (type === 'dynamic') return 'compound_dynamic';
  }
  
  if (form !== baseForm) {
    const pos = classifyPos(entry);
    return pos === 'verb' ? 'conjugated' : 'inflected';
  }
  
  return 'simple';
}

async function updateWordFrequencies(
  reverseIndex: Map<string, string>,
  dictionary: Map<string, DictionaryEntry>,
  batchSize: number = 500
): Promise<void> {
  console.log('\n📊 Updating word_frequencies table...');
  
  // Get all words from word_frequencies
  const { stdout: wordsRaw } = await execAsync(
    `npx wrangler d1 execute pashto-bible-db --remote --command="SELECT pashto_word FROM word_frequencies;" --json`,
    { maxBuffer: 50 * 1024 * 1024, cwd: '/Users/jeremysamuels/Documents/pashto-bible-search' }
  );
  
  const wordsResult = JSON.parse(wordsRaw);
  const wordsData = Array.isArray(wordsResult) ? wordsResult[0] : wordsResult;
  const words = (wordsData.results || []).map((row: any) => row.pashto_word);
  
  console.log(`   Processing ${words.length.toLocaleString()} words...`);
  
  const updates: Array<{
    word: string;
    baseForm: string;
    wordType: string;
    pos: string;
  }> = [];
  
  for (const word of words) {
    const baseForm = reverseIndex.get(word) || word;
    const dictEntry = dictionary.get(baseForm) || dictionary.get(word);
    
    const wordType = dictEntry ? determineWordType(dictEntry, word, baseForm) : 'simple';
    const pos = dictEntry?.c || dictEntry?.c_norm || '';
    
    updates.push({
      word,
      baseForm,
      wordType,
      pos
    });
  }
  
  // Update in batches
  for (let i = 0; i < updates.length; i += batchSize) {
    const batch = updates.slice(i, i + batchSize);
    const sql = batch.map(update => {
      const escape = (str: any) => str === null || str === undefined ? 'NULL' : `'${String(str).replace(/'/g, "''")}'`;
      
      const dictEntry = dictionary.get(update.baseForm) || dictionary.get(update.word);
      const inflectionInfo = identifyInflectionType(update.word, update.baseForm, dictEntry?.c);
      const inflectionType = inflectionInfo?.type || 'base';
      const compoundType = isCompoundVerb(dictEntry || {}) && update.wordType.includes('compound')
        ? classifyCompoundVerb(dictEntry || {}, update.word)
        : null;
      
      return `UPDATE word_frequencies SET 
        base_form = ${escape(update.baseForm)},
        word_type = ${escape(update.wordType)},
        pos = ${escape(update.pos)},
        inflection_type = ${escape(inflectionType === 'base' ? null : inflectionType)},
        compound_type = ${escape(compoundType === 'unknown' ? null : compoundType)},
        updated_at = strftime('%s', 'now')
      WHERE pashto_word = ${escape(update.word)};`;
    }).join('\n');
    
    await executeD1Sql(sql);
    
    process.stdout.write(`\r   Updated ${Math.min(i + batchSize, updates.length).toLocaleString()}/${updates.length} words...`);
    
    if ((i + batchSize) % 1000 === 0) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  
  console.log(`\n✅ Updated ${updates.length.toLocaleString()} word_frequencies entries`);
}

async function updateWordVerseMapping(
  reverseIndex: Map<string, string>,
  dictionary: Map<string, DictionaryEntry>,
  batchSize: number = 500
): Promise<void> {
  console.log('\n📊 Updating word_verse_mapping table...');
  
  // Get distinct words from word_verse_mapping
  const { stdout: wordsRaw } = await execAsync(
    `npx wrangler d1 execute pashto-bible-db --remote --command="SELECT DISTINCT pashto_word FROM word_verse_mapping;" --json`,
    { maxBuffer: 50 * 1024 * 1024, cwd: '/Users/jeremysamuels/Documents/pashto-bible-search' }
  );
  
  const wordsResult = JSON.parse(wordsRaw);
  const wordsData = Array.isArray(wordsResult) ? wordsResult[0] : wordsResult;
  const words = (wordsData.results || []).map((row: any) => row.pashto_word);
  
  console.log(`   Processing ${words.length.toLocaleString()} words...`);
  
  const updates: Array<{word: string; baseForm: string}> = [];
  
  for (const word of words) {
    const baseForm = reverseIndex.get(word) || word;
    updates.push({ word, baseForm });
  }
  
  // Update in batches
  for (let i = 0; i < updates.length; i += batchSize) {
    const batch = updates.slice(i, i + batchSize);
    const sql = batch.map(update => {
      const escape = (str: any) => str === null || str === undefined ? 'NULL' : `'${String(str).replace(/'/g, "''")}'`;
      
      return `UPDATE word_verse_mapping SET 
        base_form = ${escape(update.baseForm)}
      WHERE pashto_word = ${escape(update.word)};`;
    }).join('\n');
    
    await executeD1Sql(sql);
    
    process.stdout.write(`\r   Updated ${Math.min(i + batchSize, updates.length).toLocaleString()}/${updates.length} words...`);
    
    if ((i + batchSize) % 1000 === 0) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  
  console.log(`\n✅ Updated ${updates.length.toLocaleString()} word_verse_mapping entries`);
}

async function main() {
  console.log('🚀 Populating Base Forms from LingDocs\n');
  console.log('='.repeat(70));
  
  try {
    // Step 1: Build complete reverse index (from cache + dictionary patterns)
    console.log('\n📖 Step 1: Building complete reverse index...');
    const { buildCompleteReverseIndex } = await import('./generate-inflections-from-dictionary');
    const reverseIndex = await buildCompleteReverseIndex();
    
    // Step 2: Load dictionary
    console.log('\n📚 Step 2: Loading dictionary...');
    const dictionary = await loadDictionary();
    console.log(`   Loaded ${dictionary.size} dictionary entries`);
    
    // Step 3: Update word_frequencies
    await updateWordFrequencies(reverseIndex, dictionary);
    
    // Step 4: Update word_verse_mapping
    await updateWordVerseMapping(reverseIndex, dictionary);
    
    // Step 5: Summary
    console.log('\n' + '='.repeat(70));
    console.log('✅ Base form population complete!');
    console.log('='.repeat(70));
    
    // Test queries
    console.log('\n🧪 Testing base form lookups:');
    const testWords = ['ټول', 'ټوله', 'ټولې', 'ټولو', 'وهل', 'وهم'];
    for (const word of testWords) {
      const base = reverseIndex.get(word);
      console.log(`   ${word} → ${base || 'NOT FOUND'}`);
    }
    
  } catch (error: any) {
    console.error(`\n❌ Population failed: ${error.message}`);
    process.exit(1);
  }
}

main().catch(console.error);

