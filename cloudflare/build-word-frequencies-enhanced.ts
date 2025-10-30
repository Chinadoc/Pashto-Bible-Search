/**
 * Enhanced Word Frequency Builder with LingDocs Integration
 * 
 * Features:
 * - Compound verb detection (dynamic/stative)
 * - Verb conjugation generation (all forms)
 * - Noun inflection generation
 * - Dictionary matching with confidence
 * - Links all forms to base forms
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import { readFile } from 'fs/promises';
import { join } from 'path';

const execAsync = promisify(exec);

interface WordFrequency {
  pashto_word: string;
  base_form?: string; // For inflected/conjugated forms
  word_type?: 'simple' | 'compound_dynamic' | 'compound_stative' | 'inflected' | 'conjugated';
  frequency_total: number;
  frequency_afghan2023_ot: number;
  frequency_afghan2023_nt: number;
  frequency_yousafzai2019_ot: number;
  frequency_yousafzai2019_nt: number;
  romanization?: string;
  pos?: string;
  dictionary_id?: number;
  english_translation?: string;
  confidence_score?: number; // 0-1 for dictionary matching
}

// Helper verbs for compound verb detection
const COMPOUND_HELPERS = new Set(['وهل', 'کول', 'کېدل', 'ېدل', 'کړل']);
const STATIVE_HELPERS = new Set(['کېدل', 'ېدل']);

// Update schema to include base forms and word types
const UPDATE_SCHEMA_SQL = `
CREATE TABLE IF NOT EXISTS word_frequencies_enhanced (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  pashto_word TEXT NOT NULL UNIQUE,
  base_form TEXT,
  word_type TEXT CHECK(word_type IN ('simple', 'compound_dynamic', 'compound_stative', 'inflected', 'conjugated')),
  frequency_total INTEGER NOT NULL DEFAULT 0,
  frequency_afghan2023_ot INTEGER DEFAULT 0,
  frequency_afghan2023_nt INTEGER DEFAULT 0,
  frequency_yousafzai2019_ot INTEGER DEFAULT 0,
  frequency_yousafzai2019_nt INTEGER DEFAULT 0,
  frequency_rank INTEGER NOT NULL DEFAULT 0,
  romanization TEXT,
  pos TEXT,
  dictionary_id INTEGER,
  english_translation TEXT,
  confidence_score REAL DEFAULT 1.0,
  created_at INTEGER DEFAULT (strftime('%s', 'now')),
  updated_at INTEGER DEFAULT (strftime('%s', 'now'))
);

CREATE INDEX IF NOT EXISTS idx_word_freq_word_enh ON word_frequencies_enhanced(pashto_word);
CREATE INDEX IF NOT EXISTS idx_word_freq_base_enh ON word_frequencies_enhanced(base_form);
CREATE INDEX IF NOT EXISTS idx_word_freq_type_enh ON word_frequencies_enhanced(word_type);
CREATE INDEX IF NOT EXISTS idx_word_freq_frequency_enh ON word_frequencies_enhanced(frequency_total DESC);
CREATE INDEX IF NOT EXISTS idx_word_freq_dict_enh ON word_frequencies_enhanced(dictionary_id);
`;

function tokenizePashto(text: string): string[] {
  const pashtoWordRegex = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]+/g;
  const matches = text.match(pashtoWordRegex) || [];
  return matches.map(word => word.trim()).filter(word => word.length > 0);
}

/**
 * Detect compound verbs in text
 * Returns: [{compound: "منډه وهل", type: "dynamic", base: "منډه وهل"}, ...]
 */
function detectCompoundVerbs(words: string[]): Array<{compound: string; type: 'dynamic' | 'stative'; base: string}> {
  const compounds: Array<{compound: string; type: 'dynamic' | 'stative'; base: string}> = [];
  
  for (let i = 0; i < words.length - 1; i++) {
    const word1 = words[i];
    const word2 = words[i + 1];
    
    // Check if word2 is a helper verb
    if (COMPOUND_HELPERS.has(word2)) {
      const compound = `${word1} ${word2}`;
      const isStative = STATIVE_HELPERS.has(word2);
      compounds.push({
        compound,
        type: isStative ? 'stative' : 'dynamic',
        base: compound
      });
    }
    
    // Also check fused forms (e.g., "منډهوهل" without space)
    if (word2 && word2.length > 2) {
      for (const helper of COMPOUND_HELPERS) {
        if (word2.endsWith(helper)) {
          const mainPart = word2.slice(0, -helper.length);
          if (mainPart.length > 0) {
            const compound = `${word1} ${mainPart}${helper}`;
            const isStative = STATIVE_HELPERS.has(helper);
            compounds.push({
              compound: `${word1} ${helper}`, // Normalized form
              type: isStative ? 'stative' : 'dynamic',
              base: `${word1} ${helper}`
            });
          }
        }
      }
    }
  }
  
  return compounds;
}

/**
 * Generate all conjugated forms for a verb using LingDocs patterns
 * Based on https://grammar.lingdocs.com/compound-verbs/ and https://dictionary.lingdocs.com/
 * References: https://dictionary.lingdocs.com/word?id=1527812939 (compound verbs)
 *             https://dictionary.lingdocs.com/word?id=1527815399 (verb conjugations)
 */
function generateVerbForms(infinitive: string, dictEntry: any = null, isCompound: boolean = false): string[] {
  const forms: string[] = [infinitive];
  
  if (isCompound) {
    const parts = infinitive.split(' ');
    if (parts.length === 2) {
      const [main, helper] = parts;
      const isStative = STATIVE_HELPERS.has(helper);
      
      if (helper === 'وهل') {
        // Dynamic compound: منډه وهل - múnDa wahúlv. dyn. comp. trans.
        // Based on: https://grammar.lingdocs.com/compound-verbs/dynamic-compounds/
        const imperfectiveStem = helper.replace(/ل$/, '');
        const perfectiveStem = 'و' + imperfectiveStem;
        
        // Present forms (imperfective) - agrees with subject
        const presentEndings = ['م', 'و', 'ې', 'ې', 'ي', 'ي'];
        for (const ending of presentEndings) {
          forms.push(`${main} ${imperfectiveStem}${ending}`); // Spaced
          forms.push(`${main}${imperfectiveStem}${ending}`); // Fused (common)
        }
        
        // Past forms (perfective) - agrees with object
        forms.push(`${main} ${perfectiveStem}${helper.replace(/ل$/, '')}`);
        forms.push(`${main} ${perfectiveStem}${helper.replace(/ل$/, '')}م`);
        forms.push(`${main} ${perfectiveStem}${helper.replace(/ل$/, '')}و`);
        forms.push(`${main} ${perfectiveStem}${helper.replace(/ل$/, '')}لې`);
        forms.push(`${main} ${perfectiveStem}${helper.replace(/ل$/, '')}ل`);
        forms.push(`${main} ${perfectiveStem}${helper.replace(/ل$/, '')}له`);
        
        // Past participle
        forms.push(`${main} ${imperfectiveStem}لی`);
      } else if (helper === 'کول') {
        // Stative or dynamic compound with کول
        const imperfectiveStem = helper.replace(/ل$/, '');
        
        // Present forms
        const presentEndings = ['وم', 'وو', 'وې', 'وې', 'وي', 'وي'];
        for (const ending of presentEndings) {
          forms.push(`${main} ${imperfectiveStem}${ending}`);
          forms.push(`${main}${imperfectiveStem}${ending}`); // Fused
        }
        
        // Past forms
        forms.push(`${main} کړ`);
        forms.push(`${main} کړم`);
        forms.push(`${main} کړو`);
        forms.push(`${main} کړې`);
        forms.push(`${main} کړل`);
        forms.push(`${main} کړه`);
      } else if (STATIVE_HELPERS.has(helper)) {
        // Stative compound: ګرم کېدل
        // Based on: https://grammar.lingdocs.com/compound-verbs/stative-compounds/
        const imperfectiveStem = helper.replace(/ل$/, '');
        
        // Present forms (with کېږم endings)
        const presentEndings = ['ېږم', 'ېږو', 'ېږې', 'ېږې', 'ېږي', 'ېږي'];
        for (const ending of presentEndings) {
          forms.push(`${main} ک${ending}`); // Spaced
          forms.push(`${main}${ending}`); // Fused (common for stative)
        }
        
        // Past forms
        forms.push(`${main} شو`);
        forms.push(`${main} شوه`);
        forms.push(`${main} شول`);
      }
    }
  } else {
    // Simple verb - use dictionary entry if available
    // Based on: https://dictionary.lingdocs.com/word?id=1527815399 (وهل conjugations)
    // Dictionary fields: psp (imperfective stem), ssp (perfective stem), prp (perfective root)
    // Reference: IRREGULAR_VERBS.md and LingDocs patterns
    if (dictEntry) {
      // Use dictionary stems/roots for irregular verbs (e.g., لیدل -> وین-, ووین-)
      const imperfectiveStem = dictEntry.psp || infinitive.replace(/ل$/, '');
      const perfectiveStem = dictEntry.ssp || ('و' + imperfectiveStem);
      const perfectiveRoot = dictEntry.prp || ('و' + infinitive);
      
      // Present forms (imperfective) - agrees with subject
      // Examples: وهم (wahum), وایم (waayum), وینم (weenum)
      const presentEndings = ['م', 'و', 'ې', 'ې', 'ي', 'ي'];
      for (const ending of presentEndings) {
        forms.push(imperfectiveStem + ending);
      }
      
      // Subjunctive forms (perfective stem + present endings) - agrees with subject
      // Examples: ووهم (óowahum), ووایم (óowaayum), ووینم (óoweenum)
      for (const ending of presentEndings) {
        forms.push(perfectiveStem + ending);
      }
      
      // Past forms (continuous past) - agrees with object
      // Uses imperfective root (infinitive minus -ل)
      const imperfectiveRoot = infinitive; // Full infinitive for continuous past
      const pastRoot = infinitive.replace(/ل$/, '');
      const pastEndings = ['لم', 'لو', 'لې', 'لې', 'ل', 'له'];
      for (const ending of pastEndings) {
        forms.push(pastRoot + ending);
      }
      
      // Simple past (perfective) - agrees with object
      // Uses perfective root (often و + root, or irregular like لاړل for تلل)
      const perfectivePastRoot = perfectiveRoot.replace(/ل$/, '') || pastRoot;
      for (const ending of pastEndings) {
        forms.push(perfectivePastRoot + ending);
      }
      
      // Past participles
      forms.push(dictEntry.pprtp || pastRoot + 'لی');
      forms.push(pastRoot + 'لل');
      
      // Imperative
      forms.push(imperfectiveStem + 'ه');
      forms.push(imperfectiveStem + 'ئ');
      
      // Future forms (imperfective future)
      for (const ending of presentEndings) {
        forms.push('به ' + imperfectiveStem + ending);
      }
      
      // Future forms (perfective future)
      for (const ending of presentEndings) {
        forms.push('به ' + perfectiveStem + ending);
      }
    } else {
      // Fallback: basic conjugation for verbs without dictionary entry
      const root = infinitive.replace(/ل$/, '');
      const presentEndings = ['م', 'و', 'ې', 'ې', 'ي', 'ي'];
      for (const ending of presentEndings) {
        forms.push(root + ending);
      }
      forms.push('و' + root + 'م');
      forms.push(root + 'لم');
      forms.push(root + 'لی');
    }
  }
  
  return Array.from(new Set(forms.filter(Boolean))); // Remove duplicates
}

/**
 * Match word to dictionary with confidence score
 */
function matchDictionary(word: string, dictionary: Map<string, any>): {
  entry: any;
  confidence: number;
} {
  // Exact match
  if (dictionary.has(word)) {
    return { entry: dictionary.get(word), confidence: 1.0 };
  }
  
  // Try normalized forms (remove diacritics, etc.)
  const normalized = word.replace(/[\u064B-\u065F\u0670]/g, '');
  if (normalized !== word && dictionary.has(normalized)) {
    return { entry: dictionary.get(normalized), confidence: 0.9 };
  }
  
  // No match
  return { entry: null, confidence: 0 };
}

async function loadDictionary(): Promise<Map<string, any>> {
  const dictPath = join(process.cwd(), 'app/data/full_dictionary_enriched.json');
  
  try {
    const content = await readFile(dictPath, 'utf-8');
    const data = JSON.parse(content);
    const entries = Array.isArray(data) ? data : (data.entries || []);
    
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

async function getVersesFromD1(): Promise<Array<{
  text: string;
  translation_key: string;
  testament: string;
}>> {
  console.log('📖 Fetching verses from D1 (paginated)...');
  
  const allVerses: Array<{ text: string; translation_key: string; testament: string }> = [];
  const pageSize = 5000;
  let offset = 0;
  let hasMore = true;
  
  while (hasMore) {
    const { stdout } = await execAsync(
      `npx wrangler d1 execute pashto-bible-db --remote --command="SELECT text, translation_key, testament FROM verses WHERE text IS NOT NULL AND text != '' LIMIT ${pageSize} OFFSET ${offset};" --json`,
      { maxBuffer: 10 * 1024 * 1024 }
    );
    
    const output = JSON.parse(stdout);
    const result = Array.isArray(output) ? output[0] : output;
    
    if (result.results && result.results.length > 0) {
      allVerses.push(...result.results);
      offset += pageSize;
      process.stdout.write(`\r   Fetched ${allVerses.length} verses...`);
      
      if (result.results.length < pageSize) {
        hasMore = false;
      }
    } else {
      hasMore = false;
    }
  }
  
  console.log(`\n✅ Found ${allVerses.length} verses total`);
  return allVerses;
}

function buildWordFrequencies(
  verses: Array<{ text: string; translation_key: string; testament: string }>,
  dictionary: Map<string, any>
): Map<string, WordFrequency> {
  const wordFreq = new Map<string, WordFrequency>();
  
  console.log('\n📊 Processing verses with compound verb detection...');
  
  let processed = 0;
  let compoundsFound = 0;
  
  for (const verse of verses) {
    const words = tokenizePashto(verse.text);
    
    // Detect compound verbs
    const compounds = detectCompoundVerbs(words);
    compoundsFound += compounds.length;
    
    // Process individual words
    for (const word of words) {
      if (!wordFreq.has(word)) {
        const dictMatch = matchDictionary(word, dictionary);
        
        wordFreq.set(word, {
          pashto_word: word,
          frequency_total: 0,
          frequency_afghan2023_ot: 0,
          frequency_afghan2023_nt: 0,
          frequency_yousafzai2019_ot: 0,
          frequency_yousafzai2019_nt: 0,
          romanization: dictMatch.entry?.g || dictMatch.entry?.f_primary || dictMatch.entry?.f,
          pos: dictMatch.entry?.c || dictMatch.entry?.c_norm || dictMatch.entry?.pos_family,
          dictionary_id: dictMatch.entry?.ts,
          english_translation: dictMatch.entry?.e,
          confidence_score: dictMatch.confidence,
          word_type: 'simple'
        });
      }
      
      const freq = wordFreq.get(word)!;
      freq.frequency_total++;
      
      if (verse.translation_key === 'afghan2023') {
        if (verse.testament === 'OT') {
          freq.frequency_afghan2023_ot++;
        } else {
          freq.frequency_afghan2023_nt++;
        }
      } else if (verse.translation_key === 'yousafzai2019') {
        if (verse.testament === 'OT') {
          freq.frequency_yousafzai2019_ot++;
        } else {
          freq.frequency_yousafzai2019_nt++;
        }
      }
    }
    
    // Process compound verbs
    for (const compound of compounds) {
      const compoundKey = compound.compound;
      
      if (!wordFreq.has(compoundKey)) {
        // Try to find compound verb in dictionary
        const dictMatch = matchDictionary(compoundKey, dictionary);
        
        wordFreq.set(compoundKey, {
          pashto_word: compoundKey,
          base_form: compound.base,
          word_type: compound.type === 'dynamic' ? 'compound_dynamic' : 'compound_stative',
          frequency_total: 0,
          frequency_afghan2023_ot: 0,
          frequency_afghan2023_nt: 0,
          frequency_yousafzai2019_ot: 0,
          frequency_yousafzai2019_nt: 0,
          romanization: dictMatch.entry?.g || dictMatch.entry?.f_primary,
          pos: dictMatch.entry?.c || `v. ${compound.type}. comp.`,
          dictionary_id: dictMatch.entry?.ts,
          english_translation: dictMatch.entry?.e,
          confidence_score: dictMatch.confidence
        });
      }
      
      const freq = wordFreq.get(compoundKey)!;
      freq.frequency_total++;
      
      if (verse.translation_key === 'afghan2023') {
        if (verse.testament === 'OT') {
          freq.frequency_afghan2023_ot++;
        } else {
          freq.frequency_afghan2023_nt++;
        }
      } else if (verse.translation_key === 'yousafzai2019') {
        if (verse.testament === 'OT') {
          freq.frequency_yousafzai2019_ot++;
        } else {
          freq.frequency_yousafzai2019_nt++;
        }
      }
    }
    
    processed++;
    if (processed % 1000 === 0) {
      process.stdout.write(`\r   Processed ${processed}/${verses.length} verses, ${compoundsFound} compounds found...`);
    }
  }
  
  console.log(`\n✅ Processed ${processed} verses`);
  console.log(`📊 Found ${wordFreq.size} unique words/phrases`);
  console.log(`🔗 Detected ${compoundsFound} compound verb instances`);
  
  return wordFreq;
}

async function generateConjugatedForms(wordFreq: Map<string, WordFrequency>, dictionary: Map<string, any>): Promise<void> {
  console.log('\n🔄 Generating conjugated/inflected forms...');
  
  let formsGenerated = 0;
  const newForms = new Map<string, WordFrequency>();
  
  for (const [word, freq] of wordFreq.entries()) {
    // Generate verb conjugations
    if (freq.pos?.includes('v.') || freq.word_type?.includes('compound')) {
      const isCompound = freq.word_type?.includes('compound') || false;
      const dictEntry = freq.dictionary_id ? dictionary.get(word) : null;
      const forms = generateVerbForms(word, dictEntry, isCompound);
      
      for (const form of forms) {
        if (form !== word && !wordFreq.has(form) && !newForms.has(form)) {
          newForms.set(form, {
            pashto_word: form,
            base_form: word,
            word_type: 'conjugated',
            frequency_total: 0,
            frequency_afghan2023_ot: 0,
            frequency_afghan2023_nt: 0,
            frequency_yousafzai2019_ot: 0,
            frequency_yousafzai2019_nt: 0,
            romanization: freq.romanization,
            pos: freq.pos,
            dictionary_id: freq.dictionary_id,
            english_translation: freq.english_translation,
            confidence_score: freq.confidence_score ? freq.confidence_score * 0.8 : 0.8 // Lower confidence for generated forms
          });
          formsGenerated++;
        }
      }
    }
    
    // Generate noun inflections (simplified - would use LingDocs inflectWord in production)
    if (freq.pos?.includes('n.') && !freq.word_type) {
      // Basic noun inflections: plural, possessive, etc.
      const inflections: string[] = [];
      
      // Masculine nouns typically add ي for plural/possessive
      if (freq.pos.includes('n. m.')) {
        inflections.push(word + 'ي');
        inflections.push(word + 'یو');
        inflections.push(word + 'و');
      }
      
      // Feminine nouns typically add ې
      if (freq.pos.includes('n. f.')) {
        inflections.push(word + 'ې');
        inflections.push(word + 'یو');
        inflections.push(word + 'و');
      }
      
      for (const inflection of inflections) {
        if (inflection !== word && !wordFreq.has(inflection) && !newForms.has(inflection)) {
          newForms.set(inflection, {
            pashto_word: inflection,
            base_form: word,
            word_type: 'inflected',
            frequency_total: 0,
            frequency_afghan2023_ot: 0,
            frequency_afghan2023_nt: 0,
            frequency_yousafzai2019_ot: 0,
            frequency_yousafzai2019_nt: 0,
            romanization: freq.romanization,
            pos: freq.pos,
            dictionary_id: freq.dictionary_id,
            english_translation: freq.english_translation,
            confidence_score: freq.confidence_score ? freq.confidence_score * 0.8 : 0.8
          });
          formsGenerated++;
        }
      }
    }
  }
  
  console.log(`✅ Generated ${formsGenerated} conjugated/inflected forms`);
  
  // Merge new forms into wordFreq
  for (const [form, freq] of newForms.entries()) {
    wordFreq.set(form, freq);
  }
}

async function updateDatabase(wordFreq: Map<string, WordFrequency>): Promise<void> {
  console.log('\n💾 Updating database...');
  
  // Update schema
  console.log('🔧 Updating schema...');
  await executeD1Sql(UPDATE_SCHEMA_SQL);
  
  // Convert to array and sort by frequency
  const frequencies = Array.from(wordFreq.values());
  frequencies.sort((a, b) => b.frequency_total - a.frequency_total);
  
  frequencies.forEach((freq, index) => {
    freq.frequency_rank = index + 1;
  });
  
  // Insert in batches
  const batchSize = 100;
  const batches: WordFrequency[][] = [];
  
  for (let i = 0; i < frequencies.length; i += batchSize) {
    batches.push(frequencies.slice(i, i + batchSize));
  }
  
  console.log(`📤 Inserting ${batches.length} batches...`);
  
  for (let i = 0; i < batches.length; i++) {
    const batch = batches[i];
    const values = batch.map(freq => {
      const escape = (str: any) => str === null || str === undefined ? 'NULL' : `'${String(str).replace(/'/g, "''")}'`;
      
      return `(
        ${escape(freq.pashto_word)},
        ${escape(freq.base_form)},
        ${escape(freq.word_type)},
        ${freq.frequency_total},
        ${freq.frequency_afghan2023_ot},
        ${freq.frequency_afghan2023_nt},
        ${freq.frequency_yousafzai2019_ot},
        ${freq.frequency_yousafzai2019_nt},
        ${freq.frequency_rank},
        ${escape(freq.romanization)},
        ${escape(freq.pos)},
        ${freq.dictionary_id || 'NULL'},
        ${escape(freq.english_translation)},
        ${freq.confidence_score || 1.0},
        strftime('%s', 'now'),
        strftime('%s', 'now')
      )`;
    });
    
    const sql = `
INSERT OR REPLACE INTO word_frequencies_enhanced (
  pashto_word, base_form, word_type, frequency_total,
  frequency_afghan2023_ot, frequency_afghan2023_nt,
  frequency_yousafzai2019_ot, frequency_yousafzai2019_nt,
  frequency_rank, romanization, pos, dictionary_id, english_translation,
  confidence_score, created_at, updated_at
) VALUES
${values.join(',\n')};
`;
    
    await executeD1Sql(sql);
    
    if ((i + 1) % 10 === 0) {
      process.stdout.write(`\r   Inserted batch ${i + 1}/${batches.length}...`);
    }
  }
  
  console.log(`\n✅ Inserted ${frequencies.length} word frequencies`);
  
  // Replace old table with new one
  console.log('\n🔄 Replacing old table...');
  const replaceSql = `
DROP TABLE IF EXISTS word_frequencies;
ALTER TABLE word_frequencies_enhanced RENAME TO word_frequencies;

DROP INDEX IF EXISTS idx_word_freq_word;
DROP INDEX IF EXISTS idx_word_freq_frequency;

CREATE INDEX IF NOT EXISTS idx_word_freq_word ON word_frequencies(pashto_word);
CREATE INDEX IF NOT EXISTS idx_word_freq_base ON word_frequencies(base_form);
CREATE INDEX IF NOT EXISTS idx_word_freq_type ON word_frequencies(word_type);
CREATE INDEX IF NOT EXISTS idx_word_freq_frequency ON word_frequencies(frequency_total DESC);
CREATE INDEX IF NOT EXISTS idx_word_freq_dict ON word_frequencies(dictionary_id);
`;
  
  await executeD1Sql(replaceSql);
  console.log('✅ Schema updated successfully');
}

async function executeD1Sql(sql: string): Promise<void> {
  const fs = await import('fs/promises');
  const path = await import('path');
  const tempFile = path.join(process.cwd(), `.temp-enhanced-freq-${Date.now()}.sql`);
  
  await fs.writeFile(tempFile, sql, 'utf-8');
  
  try {
    const { stdout, stderr } = await execAsync(
      `npx wrangler d1 execute pashto-bible-db --remote --file=${tempFile}`
    );
    
    if (stderr && !stderr.includes('warning')) {
      console.error(`   ⚠️  ${stderr}`);
    }
  } catch (error: any) {
    console.error(`   ❌ Failed: ${error.message}`);
    throw error;
  } finally {
    await fs.unlink(tempFile).catch(() => {});
  }
}

async function main() {
  console.log('🚀 Building Enhanced Word Frequency List with LingDocs Integration\n');
  console.log('='.repeat(70));
  
  try {
    // Load dictionary
    const dictionary = await loadDictionary();
    
    // Get verses from D1
    const verses = await getVersesFromD1();
    
    // Build frequency map with compound verb detection
    const wordFreq = buildWordFrequencies(verses, dictionary);
    
    // Generate conjugated/inflected forms
    await generateConjugatedForms(wordFreq, dictionary);
    
    // Update database
    await updateDatabase(wordFreq);
    
    // Summary
    console.log('\n' + '='.repeat(70));
    console.log('\n✅ Enhanced word frequency list complete!\n');
    
    // Show sample
    const { stdout } = await execAsync(
      `npx wrangler d1 execute pashto-bible-db --remote --command="SELECT pashto_word, base_form, word_type, frequency_total FROM word_frequencies ORDER BY frequency_total DESC LIMIT 15;" --json`
    );
    
    const result = JSON.parse(stdout);
    if (result.results) {
      console.log('📊 Top words/phrases:');
      console.log('Word'.padEnd(25) + 'Base'.padEnd(25) + 'Type'.padEnd(20) + 'Frequency');
      console.log('-'.repeat(90));
      for (const word of result.results) {
        console.log(
          (word.pashto_word || '').padEnd(25) +
          (word.base_form || '-').padEnd(25) +
          (word.word_type || 'simple').padEnd(20) +
          String(word.frequency_total || 0)
        );
      }
    }
    
  } catch (error: any) {
    console.error(`\n❌ Error: ${error.message}`);
    process.exit(1);
  }
}

main().catch(console.error);

