/**
 * Comprehensive Word Frequency Builder
 * 
 * Handles:
 * 1. Compound words (e.g., "مرسته کول")
 * 2. Future tense forms (e.g., "به کوم")
 * 3. Mini pronouns (e.g., "ورته", "یې", "دې", "مې", "مو")
 * 4. Words separated by mini pronouns (e.g., "کول یې" should also count as "کول")
 * 
 * Ensures all words are well-categorized with base_form, word_type, inflection_type, etc.
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import { readFile } from 'fs/promises';
import { join } from 'path';

const execAsync = promisify(exec);

// Mini pronouns that can attach or separate from words
// Based on: https://grammar.lingdocs.com/pronouns/pronouns-mini/
const MINI_PRONOUNS = new Set([
  'مې', 'me',      // 1st person singular
  'دې', 'de',      // 2nd person singular
  'مو', 'mU',      // 1st/2nd person plural
  'یې', 'ye',      // 3rd person
  'به', 'ba',      // future particle
  'ورته', 'wăr-ta', 'werta',  // to him/her/them
  'راته', 'raa-ta', 'rata',   // to me/us
  'درته', 'dăr-ta', 'drata',  // to you
  'په', 'pa',      // preposition
  'ته', 'ta',      // to
  'ور', 'wăr',     // to him/her
  'را', 'raa',     // to me
  'در', 'dăr',     // to you
]);

// Compound verb helpers
const COMPOUND_HELPERS = new Set([
  'کول', 'kawul',
  'کړل', 'kRul',
  'وهل', 'wahul',
  'کېدل', 'kedul',
  'اخیستل', 'akhistal',
  'ساتل', 'satal',
]);

interface WordFrequency {
  pashto_word: string;
  frequency_total: number;
  frequency_afghan2023_ot: number;
  frequency_afghan2023_nt: number;
  frequency_yousafzai2019_ot: number;
  frequency_yousafzai2019_nt: number;
  base_form?: string;
  word_type?: string;
  pos?: string;
  inflection_type?: string;
  compound_type?: string;
  romanization?: string;
  dictionary_id?: number;
  english_translation?: string;
  has_issues?: number;
  issue_flags?: string;
}

/**
 * Advanced tokenization that handles:
 * - Compound words (keeps spaces)
 * - Future tense ("به" + verb)
 * - Mini pronouns (counts both attached and separated forms)
 */
function tokenizePashtoAdvanced(text: string): {
  words: string[];
  compoundWords: string[];
  futureForms: string[];
} {
  const words: string[] = [];
  const compoundWords: string[] = [];
  const futureForms: string[] = [];
  
  // First, normalize whitespace
  const normalized = text.replace(/\s+/g, ' ').trim();
  
  // Split into words (preserving spaces for compound detection)
  const tokens = normalized.split(/\s+/).filter(t => t.length > 0);
  
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i].trim();
    if (!token) continue;
    
    let processed = false;
    
    // Check if current token is "به" (future particle) followed by a verb
    if (token === 'به' && i + 1 < tokens.length) {
      const nextToken = tokens[i + 1].trim();
      const futureForm = `${token} ${nextToken}`;
      futureForms.push(futureForm);
      words.push(futureForm); // Count "به + verb" as one unit
      words.push(nextToken);  // Also count verb separately
      i++; // Skip next token since we processed it
      processed = true;
    }
    
    // Check if current token + next token form a compound verb
    if (!processed && i + 1 < tokens.length) {
      const nextToken = tokens[i + 1].trim();
      if (COMPOUND_HELPERS.has(nextToken)) {
        const compoundForm = `${token} ${nextToken}`;
        compoundWords.push(compoundForm);
        words.push(compoundForm); // Count compound as one unit
        words.push(token);        // Also count noun/adjective part
        words.push(nextToken);    // Also count helper verb
        i++; // Skip next token
        processed = true;
      }
    }
    
    // Check if next token is a mini pronoun (separated)
    if (!processed && i + 1 < tokens.length) {
      const nextToken = tokens[i + 1].trim();
      if (MINI_PRONOUNS.has(nextToken)) {
        // Count word separately
        words.push(token);
        // Also count "word + pronoun" as phrase
        words.push(`${token} ${nextToken}`);
        i++; // Skip pronoun token
        processed = true;
      }
    }
    
    // Check if token ends with a mini pronoun (attached)
    if (!processed) {
      let hasAttachedPronoun = false;
      for (const pronoun of MINI_PRONOUNS) {
        if (token.endsWith(pronoun) && token.length > pronoun.length) {
          const baseWord = token.slice(0, -pronoun.length);
          words.push(baseWord); // Count base word
          words.push(token);    // Count with attached pronoun
          hasAttachedPronoun = true;
          processed = true;
          break;
        }
      }
      
      // Regular word (if not already processed)
      if (!hasAttachedPronoun) {
        words.push(token);
      }
    }
  }
  
  return { words, compoundWords, futureForms };
}

/**
 * Get base form using reverse inflection index
 */
async function getBaseForm(word: string, reverseIndex: Map<string, string>): Promise<string> {
  return reverseIndex.get(word) || word;
}

/**
 * Classify word type
 */
function classifyWordType(word: string, dictEntry: any): string {
  if (!dictEntry) return 'unknown';
  
  const pos = [
    dictEntry.c,
    dictEntry.c_norm,
    dictEntry.pos_family
  ].join(' ').toLowerCase();
  
  if (word.includes(' ')) {
    // Compound word
    if (pos.includes('compound') || pos.includes('comp.')) {
      if (pos.includes('stat.') || pos.includes('stative')) {
        return 'compound_stative';
      }
      if (pos.includes('dyn.') || pos.includes('dynamic')) {
        return 'compound_dynamic';
      }
      return 'compound';
    }
    return 'phrase';
  }
  
  if (pos.includes('verb') || /\bv\./.test(pos)) {
    return 'verb';
  }
  if (pos.includes('noun') || /\bn\./.test(pos)) {
    return 'noun';
  }
  if (pos.includes('adj')) {
    return 'adjective';
  }
  if (MINI_PRONOUNS.has(word)) {
    return 'pronoun_mini';
  }
  
  return 'other';
}

/**
 * Classify compound verb type
 */
function classifyCompoundType(word: string, dictEntry: any): string | null {
  if (!word.includes(' ')) return null;
  
  const pos = [
    dictEntry?.c,
    dictEntry?.c_norm,
    dictEntry?.pos_family
  ].join(' ').toLowerCase();
  
  if (pos.includes('stat.') || pos.includes('stative')) {
    return 'stative';
  }
  if (pos.includes('dyn.') || pos.includes('dynamic')) {
    return 'dynamic';
  }
  
  return null;
}

/**
 * Identify inflection type
 */
function identifyInflectionType(word: string, baseForm: string, dictEntry: any): string | null {
  if (word === baseForm) return null;
  
  // Basic pattern matching for common inflections
  if (word.endsWith('ه') && !baseForm.endsWith('ه')) {
    return 'inflected';
  }
  if (word.endsWith('ې') && !baseForm.endsWith('ې')) {
    return 'inflected';
  }
  if (word.endsWith('و') && !baseForm.endsWith('و')) {
    return 'inflected';
  }
  if (word.endsWith('ی') && !baseForm.endsWith('ی')) {
    return 'inflected';
  }
  
  return 'inflected';
}

async function loadDictionary(): Promise<Map<string, any>> {
  const dictPath = join(process.cwd(), 'app/data/full_dictionary_enriched.json');
  
  try {
    const content = await readFile(dictPath, 'utf-8');
    const data = JSON.parse(content);
    
    const entries = Array.isArray(data) 
      ? data 
      : (data.entries || []);
    
    const dictMap = new Map<string, any>();
    
    if (Array.isArray(entries)) {
      for (const entry of entries) {
        if (entry.p) {
          if (!dictMap.has(entry.p)) {
            dictMap.set(entry.p, entry);
          }
        }
      }
    }
    
    console.log(`📚 Loaded ${dictMap.size} dictionary entries`);
    return dictMap;
  } catch (error: any) {
    console.warn(`⚠️  Could not load dictionary: ${error.message}`);
    return new Map();
  }
}

async function loadReverseInflectionIndex(): Promise<Map<string, string>> {
  try {
    // Use cached reverse index first (faster)
    const { buildReverseIndex } = await import('./build-reverse-inflection-index');
    const cacheIndex = await buildReverseIndex();
    console.log(`   Loaded ${cacheIndex.size} mappings from cache`);
    return cacheIndex;
  } catch (error: any) {
    console.warn(`⚠️  Could not load reverse index: ${error.message}`);
    return new Map();
  }
}

async function getVersesFromD1(): Promise<Array<{
  text: string;
  translation_key: string;
  testament: string;
}>> {
  console.log('📖 Fetching verses from D1 (paginated)...');
  
  const verses: Array<{ text: string; translation_key: string; testament: string }> = [];
  const pageSize = 5000;
  let offset = 0;
  let hasMore = true;
  
  while (hasMore) {
    try {
      const { stdout } = await execAsync(
        `npx wrangler d1 execute pashto-bible-db --remote --command="SELECT text, translation_key, testament FROM verses_afghan2023 WHERE text IS NOT NULL AND text != '' UNION ALL SELECT text, translation_key, testament FROM verses_yousafzai WHERE text IS NOT NULL AND text != '' LIMIT ${pageSize} OFFSET ${offset};" --json`,
        { maxBuffer: 10 * 1024 * 1024 }
      );
      
      const result = JSON.parse(stdout);
      const data = Array.isArray(result) ? result[0] : result;
      const pageVerses = data.results || [];
      
      if (pageVerses.length === 0) {
        hasMore = false;
        break;
      }
      
      verses.push(...pageVerses);
      offset += pageSize;
      
      process.stdout.write(`\r   Fetched ${verses.length} verses...`);
      
      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));
      
    } catch (error: any) {
      console.error(`\n⚠️  Error fetching verses: ${error.message}`);
      hasMore = false;
    }
  }
  
  console.log(`\n✅ Fetched ${verses.length} total verses`);
  return verses;
}

async function buildWordFrequencies(): Promise<void> {
  console.log('🚀 Building Comprehensive Word Frequency List\n');
  console.log('='.repeat(70));
  
  // Step 1: Load resources
  console.log('\n📚 Step 1: Loading resources...');
  const dictionary = await loadDictionary();
  const reverseIndex = await loadReverseInflectionIndex();
  console.log(`   Dictionary: ${dictionary.size} entries`);
  console.log(`   Reverse index: ${reverseIndex.size} mappings`);
  
  // Step 2: Fetch verses
  console.log('\n📖 Step 2: Fetching verses from D1...');
  const verses = await getVersesFromD1();
  
  // Step 3: Build frequency map
  console.log('\n📊 Step 3: Building frequency map...');
  const frequencyMap = new Map<string, WordFrequency>();
  
  let processed = 0;
  for (const verse of verses) {
    const { words, compoundWords, futureForms } = tokenizePashtoAdvanced(verse.text);
    
    for (const word of words) {
      if (!word || word.length === 0) continue;
      
      const existing = frequencyMap.get(word) || {
        pashto_word: word,
        frequency_total: 0,
        frequency_afghan2023_ot: 0,
        frequency_afghan2023_nt: 0,
        frequency_yousafzai2019_ot: 0,
        frequency_yousafzai2019_nt: 0,
      };
      
      existing.frequency_total++;
      
      if (verse.translation_key === 'afghan2023') {
        if (verse.testament === 'OT') {
          existing.frequency_afghan2023_ot++;
        } else {
          existing.frequency_afghan2023_nt++;
        }
      } else if (verse.translation_key === 'yousafzai2019') {
        if (verse.testament === 'OT') {
          existing.frequency_yousafzai2019_ot++;
        } else {
          existing.frequency_yousafzai2019_nt++;
        }
      }
      
      frequencyMap.set(word, existing);
    }
    
    processed++;
    if (processed % 1000 === 0) {
      process.stdout.write(`\r   Processed ${processed}/${verses.length} verses...`);
    }
  }
  
  // Collect statistics
  const allCompoundWords = new Set<string>();
  const allFutureForms = new Set<string>();
  
  for (const verse of verses) {
    const { compoundWords, futureForms } = tokenizePashtoAdvanced(verse.text);
    compoundWords.forEach(cw => allCompoundWords.add(cw));
    futureForms.forEach(ff => allFutureForms.add(ff));
  }
  
  console.log(`\n✅ Processed ${verses.length} verses`);
  console.log(`   Found ${frequencyMap.size} unique words`);
  console.log(`   Found ${allCompoundWords.size} unique compound words`);
  console.log(`   Found ${allFutureForms.size} unique future forms`);
  
  // Step 4: Enrich with dictionary and linguistic data
  console.log('\n🔍 Step 4: Enriching with dictionary and linguistic data...');
  
  const enrichedWords: WordFrequency[] = [];
  let enriched = 0;
  
  for (const [word, freq] of frequencyMap.entries()) {
    const dictEntry = dictionary.get(word);
    const baseForm = await getBaseForm(word, reverseIndex);
    const wordType = classifyWordType(word, dictEntry);
    const compoundType = classifyCompoundType(word, dictEntry);
    const inflectionType = identifyInflectionType(word, baseForm, dictEntry);
    
    const enrichedWord: WordFrequency = {
      ...freq,
      base_form: baseForm !== word ? baseForm : undefined,
      word_type: wordType,
      pos: dictEntry?.c || dictEntry?.c_norm || undefined,
      inflection_type: inflectionType || undefined,
      compound_type: compoundType || undefined,
      romanization: dictEntry?.f || dictEntry?.f_primary || undefined,
      dictionary_id: dictEntry?.ts || undefined,
      english_translation: dictEntry?.e || undefined,
      has_issues: 0,
      issue_flags: '[]',
    };
    
    // Check for issues
    const issues: string[] = [];
    if (/[a-zA-Z]/.test(word)) {
      issues.push('has_roman_chars');
    }
    if (!dictEntry) {
      issues.push('no_dictionary_match');
    }
    if (!dictEntry?.c && !dictEntry?.c_norm) {
      issues.push('no_pos');
    }
    
    if (issues.length > 0) {
      enrichedWord.has_issues = 1;
      enrichedWord.issue_flags = JSON.stringify(issues);
    }
    
    enrichedWords.push(enrichedWord);
    enriched++;
    
    if (enriched % 1000 === 0) {
      process.stdout.write(`\r   Enriched ${enriched}/${frequencyMap.size} words...`);
    }
  }
  
  console.log(`\n✅ Enriched ${enrichedWords.length} words`);
  
  // Step 5: Calculate frequency ranks
  console.log('\n📊 Step 5: Calculating frequency ranks...');
  enrichedWords.sort((a, b) => b.frequency_total - a.frequency_total);
  enrichedWords.forEach((word, index) => {
    word.frequency_rank = index + 1;
  });
  
  // Step 6: Update database
  console.log('\n💾 Step 6: Updating database...');
  
  // Create/update schema
  const schemaSQL = `
CREATE TABLE IF NOT EXISTS word_frequencies (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  pashto_word TEXT NOT NULL UNIQUE,
  frequency_total INTEGER NOT NULL DEFAULT 0,
  frequency_afghan2023_ot INTEGER DEFAULT 0,
  frequency_afghan2023_nt INTEGER DEFAULT 0,
  frequency_yousafzai2019_ot INTEGER DEFAULT 0,
  frequency_yousafzai2019_nt INTEGER DEFAULT 0,
  frequency_rank INTEGER NOT NULL DEFAULT 0,
  base_form TEXT,
  word_type TEXT,
  pos TEXT,
  inflection_type TEXT,
  compound_type TEXT,
  romanization TEXT,
  dictionary_id INTEGER,
  english_translation TEXT,
  has_issues INTEGER DEFAULT 0,
  issue_flags TEXT DEFAULT '[]',
  created_at INTEGER DEFAULT (strftime('%s', 'now')),
  updated_at INTEGER DEFAULT (strftime('%s', 'now'))
);

CREATE INDEX IF NOT EXISTS idx_word_freq_word ON word_frequencies(pashto_word);
CREATE INDEX IF NOT EXISTS idx_word_freq_frequency ON word_frequencies(frequency_total DESC);
CREATE INDEX IF NOT EXISTS idx_word_freq_base ON word_frequencies(base_form);
CREATE INDEX IF NOT EXISTS idx_word_freq_type ON word_frequencies(word_type);
CREATE INDEX IF NOT EXISTS idx_word_freq_issues ON word_frequencies(has_issues);
`;
  
  await execAsync(
    `npx wrangler d1 execute pashto-bible-db --remote --command="${schemaSQL.replace(/"/g, '\\"')}"`
  );
  
  // Insert/update in batches
  const batchSize = 100;
  for (let i = 0; i < enrichedWords.length; i += batchSize) {
    const batch = enrichedWords.slice(i, i + batchSize);
    
    const values = batch.map(w => {
      const escape = (str: any) => str === null || str === undefined ? 'NULL' : `'${String(str).replace(/'/g, "''")}'`;
      
      return `(
        ${escape(w.pashto_word)},
        ${w.frequency_total},
        ${w.frequency_afghan2023_ot},
        ${w.frequency_afghan2023_nt},
        ${w.frequency_yousafzai2019_ot},
        ${w.frequency_yousafzai2019_nt},
        ${w.frequency_rank},
        ${escape(w.base_form)},
        ${escape(w.word_type)},
        ${escape(w.pos)},
        ${escape(w.inflection_type)},
        ${escape(w.compound_type)},
        ${escape(w.romanization)},
        ${w.dictionary_id || 'NULL'},
        ${escape(w.english_translation)},
        ${w.has_issues || 0},
        ${escape(w.issue_flags || '[]')},
        strftime('%s', 'now'),
        strftime('%s', 'now')
      )`;
    });
    
    const insertSQL = `
INSERT OR REPLACE INTO word_frequencies (
  pashto_word, frequency_total, frequency_afghan2023_ot, frequency_afghan2023_nt,
  frequency_yousafzai2019_ot, frequency_yousafzai2019_nt, frequency_rank,
  base_form, word_type, pos, inflection_type, compound_type,
  romanization, dictionary_id, english_translation, has_issues, issue_flags,
  created_at, updated_at
) VALUES
${values.join(',\n')};
`;
    
    const fs = await import('fs/promises');
    const path = await import('path');
    const tempFile = path.join(process.cwd(), `.temp-batch-${i}.sql`);
    await fs.writeFile(tempFile, insertSQL, 'utf-8');
    
    await execAsync(
      `npx wrangler d1 execute pashto-bible-db --remote --file=${tempFile}`,
      { maxBuffer: 50 * 1024 * 1024 }
    );
    
    await fs.unlink(tempFile).catch(() => {});
    
    process.stdout.write(`\r   Inserted batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(enrichedWords.length / batchSize)}...`);
  }
  
  console.log(`\n✅ Successfully inserted ${enrichedWords.length} words`);
  
  // Summary
  console.log('\n' + '='.repeat(70));
  console.log('📊 Summary:');
  console.log(`   Total words: ${enrichedWords.length}`);
  console.log(`   Compound words: ${compoundWords.length}`);
  console.log(`   Future forms: ${futureForms.length}`);
  console.log(`   Words with issues: ${enrichedWords.filter(w => w.has_issues).length}`);
  console.log(`   Words with base_form: ${enrichedWords.filter(w => w.base_form).length}`);
  console.log(`   Words with dictionary match: ${enrichedWords.filter(w => w.dictionary_id).length}`);
}

if (require.main === module) {
  buildWordFrequencies()
    .then(() => {
      console.log('\n✅ Word frequency build complete!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Error:', error);
      process.exit(1);
    });
}

export { buildWordFrequencies, tokenizePashtoAdvanced };

