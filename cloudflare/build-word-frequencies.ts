/**
 * Build comprehensive word frequency list from D1 verses
 * Includes breakdown by translation (afghan2023/yousafzai2019) and testament (OT/NT)
 * Links to dictionary entries
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import { readFile } from 'fs/promises';
import { join } from 'path';

const execAsync = promisify(exec);

interface WordFrequency {
  pashto_word: string;
  frequency_total: number;
  frequency_afghan2023_ot: number;
  frequency_afghan2023_nt: number;
  frequency_yousafzai2019_ot: number;
  frequency_yousafzai2019_nt: number;
  romanization?: string;
  pos?: string;
  dictionary_id?: number;
  english_translation?: string;
}

// Update schema to support testament breakdown
const UPDATE_SCHEMA_SQL = `
-- Check and add testament-specific frequency columns
-- SQLite doesn't support IF NOT EXISTS in ALTER TABLE, so we check first
CREATE TABLE IF NOT EXISTS word_frequencies_new (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  pashto_word TEXT NOT NULL UNIQUE,
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
  created_at INTEGER DEFAULT (strftime('%s', 'now')),
  updated_at INTEGER DEFAULT (strftime('%s', 'now'))
);

CREATE INDEX IF NOT EXISTS idx_word_freq_word_new ON word_frequencies_new(pashto_word);
CREATE INDEX IF NOT EXISTS idx_word_freq_frequency_new ON word_frequencies_new(frequency_total DESC);
CREATE INDEX IF NOT EXISTS idx_word_freq_dict_new ON word_frequencies_new(dictionary_id);
`;

function tokenizePashto(text: string): string[] {
  // Match Pashto words (Arabic script Unicode range)
  // Include Arabic-Indic digits and Pashto-specific characters
  const pashtoWordRegex = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]+/g;
  const matches = text.match(pashtoWordRegex) || [];
  return matches.map(word => word.trim()).filter(word => word.length > 0);
}

async function loadDictionary(): Promise<Map<string, any>> {
  const dictPath = join(process.cwd(), 'app/data/full_dictionary_enriched.json');
  
  try {
    const content = await readFile(dictPath, 'utf-8');
    const data = JSON.parse(content);
    
    // Handle both array and object with 'entries' or 'info' structure
    const entries = Array.isArray(data) 
      ? data 
      : (data.entries || (data.info && Array.isArray(data.words) ? data.words : []));
    
    // Create map: pashto_word -> dictionary entry
    const dictMap = new Map<string, any>();
    
    if (Array.isArray(entries)) {
      for (const entry of entries) {
        if (entry.p) { // Pashto word field
          // Store first entry or merge if multiple exist
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
      { maxBuffer: 10 * 1024 * 1024 } // 10MB buffer
    );
    
    const output = JSON.parse(stdout);
    
    // Handle both array and object responses from wrangler
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
  
  console.log('\n📊 Processing verses and building frequency map...');
  
  let processed = 0;
  
  for (const verse of verses) {
    const words = tokenizePashto(verse.text);
    
    for (const word of words) {
      if (!wordFreq.has(word)) {
        const dictEntry = dictionary.get(word);
        
        wordFreq.set(word, {
          pashto_word: word,
          frequency_total: 0,
          frequency_afghan2023_ot: 0,
          frequency_afghan2023_nt: 0,
          frequency_yousafzai2019_ot: 0,
          frequency_yousafzai2019_nt: 0,
          romanization: dictEntry?.g || dictEntry?.f_primary || dictEntry?.f || undefined,
          pos: dictEntry?.c || dictEntry?.c_norm || dictEntry?.pos_family || undefined,
          dictionary_id: dictEntry?.ts || undefined,
          english_translation: dictEntry?.e || undefined,
        });
      }
      
      const freq = wordFreq.get(word)!;
      freq.frequency_total++;
      
      // Increment specific counters
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
      process.stdout.write(`\r   Processed ${processed}/${verses.length} verses...`);
    }
  }
  
  console.log(`\n✅ Processed ${processed} verses`);
  console.log(`📊 Found ${wordFreq.size} unique words`);
  
  return wordFreq;
}

async function updateDatabase(wordFreq: Map<string, WordFrequency>): Promise<void> {
  console.log('\n💾 Updating database...');
  
  // Update schema first
  console.log('🔧 Updating schema...');
  await executeD1Sql(UPDATE_SCHEMA_SQL);
  
  // Migrate existing data if needed
  const migrateSql = `
-- Migrate existing data to new structure (if old table exists)
INSERT OR REPLACE INTO word_frequencies_new (
  pashto_word, frequency_total, frequency_rank, romanization, pos, dictionary_id, english_translation,
  frequency_afghan2023_ot, frequency_afghan2023_nt, frequency_yousafzai2019_ot, frequency_yousafzai2019_nt,
  created_at, updated_at
)
SELECT 
  pashto_word,
  COALESCE(SUM(frequency), 0) as frequency_total,
  MIN(frequency_rank) as frequency_rank,
  MAX(romanization) as romanization,
  MAX(pos) as pos,
  NULL as dictionary_id,
  NULL as english_translation,
  0 as frequency_afghan2023_ot,
  0 as frequency_afghan2023_nt,
  COALESCE(SUM(CASE WHEN translation_key = 'yousafzai2019' THEN frequency ELSE 0 END), 0) as frequency_yousafzai2019_ot,
  0 as frequency_yousafzai2019_nt,
  MIN(created_at) as created_at,
  strftime('%s', 'now') as updated_at
FROM word_frequencies
GROUP BY pashto_word
ON CONFLICT(pashto_word) DO UPDATE SET
  frequency_yousafzai2019_ot = excluded.frequency_yousafzai2019_ot,
  updated_at = strftime('%s', 'now');
`;
  
  // Try to migrate if old table exists
  try {
    await executeD1Sql(migrateSql);
  } catch (error: any) {
    // Table might not exist yet, that's OK
    console.log('   (No existing data to migrate)');
  }
  
  // Convert to array and sort by frequency
  const frequencies = Array.from(wordFreq.values());
  frequencies.sort((a, b) => b.frequency_total - a.frequency_total);
  
  // Add frequency rank
  frequencies.forEach((freq, index) => {
    freq.frequency_rank = index + 1;
  });
  
  // Insert/update in batches
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
        strftime('%s', 'now'),
        strftime('%s', 'now')
      )`;
    });
    
    const sql = `
INSERT OR REPLACE INTO word_frequencies_new (
  pashto_word, frequency_total,
  frequency_afghan2023_ot, frequency_afghan2023_nt,
  frequency_yousafzai2019_ot, frequency_yousafzai2019_nt,
  frequency_rank, romanization, pos, dictionary_id, english_translation,
  created_at, updated_at
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
ALTER TABLE word_frequencies_new RENAME TO word_frequencies;

DROP INDEX IF EXISTS idx_word_freq_word;
DROP INDEX IF EXISTS idx_word_freq_frequency;

CREATE INDEX IF NOT EXISTS idx_word_freq_word ON word_frequencies(pashto_word);
CREATE INDEX IF NOT EXISTS idx_word_freq_frequency ON word_frequencies(frequency_total DESC);
CREATE INDEX IF NOT EXISTS idx_word_freq_dict ON word_frequencies(dictionary_id);
`;
  
  await executeD1Sql(replaceSql);
  console.log('✅ Schema updated successfully');
}

async function executeD1Sql(sql: string): Promise<void> {
  const fs = await import('fs/promises');
  const path = await import('path');
  const tempFile = path.join(process.cwd(), `.temp-word-freq-${Date.now()}.sql`);
  
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
  console.log('🚀 Building comprehensive word frequency list\n');
  console.log('='.repeat(60));
  
  try {
    // Load dictionary
    const dictionary = await loadDictionary();
    
    // Get verses from D1
    const verses = await getVersesFromD1();
    
    // Build frequency map
    const wordFreq = buildWordFrequencies(verses, dictionary);
    
    // Update database
    await updateDatabase(wordFreq);
    
    // Summary
    console.log('\n' + '='.repeat(60));
    console.log('\n✅ Word frequency list complete!\n');
    
    // Show sample
    const { stdout } = await execAsync(
      `npx wrangler d1 execute pashto-bible-db --remote --command="SELECT pashto_word, frequency_total, frequency_afghan2023_ot, frequency_afghan2023_nt, frequency_yousafzai2019_ot, frequency_yousafzai2019_nt FROM word_frequencies ORDER BY frequency_total DESC LIMIT 10;" --json`
    );
    
    const result = JSON.parse(stdout);
    if (result.results) {
      console.log('📊 Top 10 most frequent words:');
      console.log('Word'.padEnd(20) + 'Total'.padEnd(10) + 'Afghan OT'.padEnd(12) + 'Afghan NT'.padEnd(12) + 'Yousafzai OT'.padEnd(14) + 'Yousafzai NT');
      console.log('-'.repeat(80));
      for (const word of result.results) {
        console.log(
          (word.pashto_word || '').padEnd(20) +
          String(word.frequency_total || 0).padEnd(10) +
          String(word.frequency_afghan2023_ot || 0).padEnd(12) +
          String(word.frequency_afghan2023_nt || 0).padEnd(12) +
          String(word.frequency_yousafzai2019_ot || 0).padEnd(14) +
          String(word.frequency_yousafzai2019_nt || 0)
        );
      }
    }
    
  } catch (error: any) {
    console.error(`\n❌ Error: ${error.message}`);
    process.exit(1);
  }
}

main().catch(console.error);

