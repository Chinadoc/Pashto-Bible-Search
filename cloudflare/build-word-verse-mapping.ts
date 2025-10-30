/**
 * Integrate verses into word frequency for fast searches
 * Creates word_verse_mapping table linking words to verse IDs with translation tags
 */

import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function executeD1Sql(sql: string): Promise<void> {
  const fs = await import('fs/promises');
  const path = await import('path');
  const tempFile = path.join(process.cwd(), `.temp-word-verse-${Date.now()}.sql`);
  
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

function tokenizePashto(text: string): string[] {
  const pashtoWordRegex = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]+/g;
  const matches = text.match(pashtoWordRegex) || [];
  return matches.map(word => word.trim()).filter(word => word.length > 0);
}

async function createMappingTable(): Promise<void> {
  console.log('📝 Creating word_verse_mapping table...');
  
  const createTableSql = `
CREATE TABLE IF NOT EXISTS word_verse_mapping (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  pashto_word TEXT NOT NULL,
  verse_id INTEGER NOT NULL,
  verse_ref TEXT NOT NULL,
  translation_key TEXT NOT NULL CHECK(translation_key IN ('afghan2023', 'yousafzai2019')),
  testament TEXT NOT NULL CHECK(testament IN ('OT', 'NT')),
  book TEXT NOT NULL,
  chapter INTEGER NOT NULL,
  verse INTEGER NOT NULL,
  word_position INTEGER, -- Position of word in verse (for relevance ranking)
  created_at INTEGER DEFAULT (strftime('%s', 'now')),
  UNIQUE(pashto_word, verse_id)
);

CREATE INDEX IF NOT EXISTS idx_word_verse_word ON word_verse_mapping(pashto_word);
CREATE INDEX IF NOT EXISTS idx_word_verse_translation ON word_verse_mapping(translation_key);
CREATE INDEX IF NOT EXISTS idx_word_verse_ref ON word_verse_mapping(verse_ref);
CREATE INDEX IF NOT EXISTS idx_word_verse_id ON word_verse_mapping(verse_id);
CREATE INDEX IF NOT EXISTS idx_word_verse_testament ON word_verse_mapping(testament);
CREATE INDEX IF NOT EXISTS idx_word_verse_composite ON word_verse_mapping(pashto_word, translation_key, testament);
`;
  
  await executeD1Sql(createTableSql);
  console.log('✅ Mapping table created');
}

async function buildWordVerseMapping(): Promise<void> {
  console.log('\n📊 Building word-verse mappings...');
  
  // Get all verses in batches
  const pageSize = 5000;
  let offset = 0;
  let totalProcessed = 0;
  let totalMappings = 0;
  
  while (true) {
    const { stdout } = await execAsync(
      `npx wrangler d1 execute pashto-bible-db --remote --command="SELECT id, ref, text, translation_key, testament, book, chapter, verse FROM verses WHERE text IS NOT NULL AND text != '' LIMIT ${pageSize} OFFSET ${offset};" --json`,
      { maxBuffer: 10 * 1024 * 1024 }
    );
    
    const output = JSON.parse(stdout);
    const result = Array.isArray(output) ? output[0] : output;
    
    if (!result.results || result.results.length === 0) {
      break;
    }
    
    const verses = result.results;
    
    // Process verses and build mappings
    const mappings: Array<{
      pashto_word: string;
      verse_id: number;
      verse_ref: string;
      translation_key: string;
      testament: string;
      book: string;
      chapter: number;
      verse: number;
      word_position: number;
    }> = [];
    
    for (const verse of verses) {
      const words = tokenizePashto(verse.text);
      const wordSet = new Set<string>(); // Track unique words per verse
      
      words.forEach((word, position) => {
        if (!wordSet.has(word)) {
          wordSet.add(word);
          mappings.push({
            pashto_word: word,
            verse_id: verse.id,
            verse_ref: verse.ref,
            translation_key: verse.translation_key,
            testament: verse.testament,
            book: verse.book,
            chapter: verse.chapter,
            verse: verse.verse,
            word_position: position
          });
        }
      });
    }
    
    // Insert mappings in batches
    if (mappings.length > 0) {
      const batchSize = 100; // Reduced from 1000 to avoid SQLITE_TOOBIG
      for (let i = 0; i < mappings.length; i += batchSize) {
        const batch = mappings.slice(i, i + batchSize);
        const values = batch.map(m => {
          const escape = (str: any) => str === null || str === undefined ? 'NULL' : `'${String(str).replace(/'/g, "''")}'`;
          
          return `(
            ${escape(m.pashto_word)},
            ${m.verse_id},
            ${escape(m.verse_ref)},
            ${escape(m.translation_key)},
            ${escape(m.testament)},
            ${escape(m.book)},
            ${m.chapter},
            ${m.verse},
            ${m.word_position},
            strftime('%s', 'now')
          )`;
        });
        
        const insertSql = `
INSERT OR IGNORE INTO word_verse_mapping 
  (pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse, word_position, created_at)
VALUES
${values.join(',\n')};
`;
        
        await executeD1Sql(insertSql);
        totalMappings += batch.length;
        
        if ((i + batchSize) % 1000 === 0) {
          process.stdout.write(`\r   Processed ${totalProcessed} verses, created ${totalMappings.toLocaleString()} mappings...`);
        }
      }
    }
    
    totalProcessed += verses.length;
    offset += pageSize;
    
    process.stdout.write(`\r   Processed ${totalProcessed} verses, created ${totalMappings.toLocaleString()} mappings...`);
    
    if (verses.length < pageSize) {
      break;
    }
  }
  
  console.log(`\n✅ Created ${totalMappings.toLocaleString()} word-verse mappings from ${totalProcessed} verses`);
}

async function addVerseCountsToWordFrequencies(): Promise<void> {
  console.log('\n📈 Adding verse counts to word_frequencies...');
  
  // Check existing columns first
  const { stdout: columnsInfo } = await execAsync(
    `npx wrangler d1 execute pashto-bible-db --remote --command="PRAGMA table_info(word_frequencies);" --json`
  );
  
  const columnsResult = JSON.parse(columnsInfo);
  const existingColumns = new Set<string>();
  if (columnsResult.results) {
    columnsResult.results.forEach((col: any) => {
      existingColumns.add(col.name.toLowerCase());
    });
  }
  
  const columnsToAdd: Array<{name: string; sql: string}> = [];
  
  if (!existingColumns.has('verse_count_total')) {
    columnsToAdd.push({ name: 'verse_count_total', sql: 'ALTER TABLE word_frequencies ADD COLUMN verse_count_total INTEGER DEFAULT 0;' });
  }
  if (!existingColumns.has('verse_count_afghan2023')) {
    columnsToAdd.push({ name: 'verse_count_afghan2023', sql: 'ALTER TABLE word_frequencies ADD COLUMN verse_count_afghan2023 INTEGER DEFAULT 0;' });
  }
  if (!existingColumns.has('verse_count_yousafzai2019')) {
    columnsToAdd.push({ name: 'verse_count_yousafzai2019', sql: 'ALTER TABLE word_frequencies ADD COLUMN verse_count_yousafzai2019 INTEGER DEFAULT 0;' });
  }
  
  if (columnsToAdd.length > 0) {
    console.log(`   Adding ${columnsToAdd.length} columns...`);
    for (const col of columnsToAdd) {
      try {
        await executeD1Sql(col.sql);
        console.log(`   ✅ Added ${col.name}`);
      } catch (error: any) {
        if (!error.message.includes('duplicate column')) {
          console.log(`   ⚠️  Could not add ${col.name}: ${error.message}`);
        }
      }
    }
  } else {
    console.log('   ✅ All columns already exist');
  }
  
  // Update verse counts
  const updateSql = `
UPDATE word_frequencies
SET 
  verse_count_total = (
    SELECT COUNT(DISTINCT verse_id) 
    FROM word_verse_mapping 
    WHERE word_verse_mapping.pashto_word = word_frequencies.pashto_word
  ),
  verse_count_afghan2023 = (
    SELECT COUNT(DISTINCT verse_id) 
    FROM word_verse_mapping 
    WHERE word_verse_mapping.pashto_word = word_frequencies.pashto_word
      AND word_verse_mapping.translation_key = 'afghan2023'
  ),
  verse_count_yousafzai2019 = (
    SELECT COUNT(DISTINCT verse_id) 
    FROM word_verse_mapping 
    WHERE word_verse_mapping.pashto_word = word_frequencies.pashto_word
      AND word_verse_mapping.translation_key = 'yousafzai2019'
  )
WHERE EXISTS (
  SELECT 1 FROM word_verse_mapping 
  WHERE word_verse_mapping.pashto_word = word_frequencies.pashto_word
);
`;
  
  await executeD1Sql(updateSql);
  console.log('✅ Verse counts added to word_frequencies');
}

async function createFastLookupView(): Promise<void> {
  console.log('\n🔍 Creating fast lookup view...');
  
  const viewSql = `
CREATE VIEW IF NOT EXISTS word_verse_lookup AS
SELECT 
  wf.pashto_word,
  wf.frequency_total,
  wf.translation_key,
  wf.testament,
  GROUP_CONCAT(wvm.verse_id, ',') as verse_ids,
  GROUP_CONCAT(wvm.verse_ref, '|') as verse_refs,
  COUNT(DISTINCT wvm.verse_id) as verse_count
FROM word_frequencies wf
LEFT JOIN word_verse_mapping wvm ON wf.pashto_word = wvm.pashto_word
GROUP BY wf.pashto_word, wf.translation_key, wf.testament;
`;
  
  await executeD1Sql(viewSql);
  console.log('✅ Lookup view created');
}

async function main() {
  console.log('🚀 Integrating Verses into Word Frequency for Fast Search\n');
  console.log('='.repeat(70));
  console.log('📋 This will create:');
  console.log('   1. word_verse_mapping table (links words to verses)');
  console.log('   2. Verse counts in word_frequencies');
  console.log('   3. Fast lookup indexes');
  console.log('='.repeat(70) + '\n');
  
  try {
    // Step 1: Create mapping table
    await createMappingTable();
    
    // Step 2: Build mappings from all verses
    await buildWordVerseMapping();
    
    // Step 3: Add verse counts to word_frequencies
    await addVerseCountsToWordFrequencies();
    
    // Step 4: Create lookup view
    await createFastLookupView();
    
    // Final summary
    console.log('\n' + '='.repeat(70));
    console.log('\n✅ Integration Complete!\n');
    
    const { stdout: stats } = await execAsync(
      `npx wrangler d1 execute pashto-bible-db --remote --command="SELECT COUNT(*) as total_mappings, COUNT(DISTINCT pashto_word) as unique_words, COUNT(DISTINCT verse_id) as unique_verses FROM word_verse_mapping;" --json`
    );
    
    const result = JSON.parse(stats);
    if (result.results && result.results[0]) {
      const s = result.results[0];
      console.log('📊 Mapping Statistics:');
      console.log(`   Total mappings: ${s.total_mappings.toLocaleString()}`);
      console.log(`   Unique words: ${s.unique_words.toLocaleString()}`);
      console.log(`   Unique verses: ${s.unique_verses.toLocaleString()}`);
    }
    
    console.log('\n💡 Usage Examples:');
    console.log('\n   Quick verse lookup by word:');
    console.log('   SELECT verse_ref, translation_key FROM word_verse_mapping');
    console.log('   WHERE pashto_word = \"ويار\" AND translation_key = \"yousafzai2019\";');
    console.log('\n   Fast search with counts:');
    console.log('   SELECT pashto_word, frequency_total, verse_count_total');
    console.log('   FROM word_frequencies WHERE pashto_word LIKE \"%ويار%\";');
    
  } catch (error: any) {
    console.error(`\n❌ Error: ${error.message}`);
    process.exit(1);
  }
}

main().catch(console.error);

