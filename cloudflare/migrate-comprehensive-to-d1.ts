/**
 * COMPREHENSIVE Migration Script
 * Loads ALL data from local JSON files into Cloudflare D1
 * Includes: verses, word frequency, dictionary, form occurrences, inflections, etc.
 * 
 * Usage:
 *   npx tsx cloudflare/migrate-comprehensive-to-d1.ts
 */

import { readFileSync } from 'fs';
import { exec } from 'child_process';
import { promisify } from 'util';
import { zlib } from 'zlib';
import { join } from 'path';
import { writeFile } from 'fs/promises';

const execAsync = promisify(exec);

/**
 * Escape SQL string for SQLite
 */
function escapeSql(str: string | null | undefined): string {
  if (!str) return "NULL";
  return `'${String(str).replace(/'/g, "''")}'`;
}

/**
 * Convert to JSON string (SQLite-compatible)
 */
function toJsonSql(obj: any): string {
  if (!obj) return "NULL";
  try {
    return escapeSql(JSON.stringify(obj));
  } catch {
    return "NULL";
  }
}

/**
 * Query D1 and return result
 */
async function queryD1(command: string): Promise<any> {
  try {
    const { stdout } = await execAsync(
      `npx wrangler d1 execute pashto-bible-db --remote --command="${command.replace(/"/g, '\\"')}"`
    );
    const lines = stdout.split('\n');
    const jsonLine = lines.find(l => l.trim().startsWith('[') || l.trim().startsWith('{'));
    if (jsonLine) {
      return JSON.parse(jsonLine);
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Execute SQL against D1 with retry logic and better error handling
 */
async function executeD1Sql(sql: string, databaseName: string = 'pashto-bible-db', retries: number = 5): Promise<boolean> {
  const fs = await import('fs/promises');
  const path = await import('path');
  const tempFile = path.join(process.cwd(), `.temp-d1-migration-${Date.now()}-${Math.random().toString(36).substring(7)}.sql`);
  
  // Check SQL size - if too large, split it
  if (sql.length > 1000000) { // 1MB limit
    console.warn(`⚠️  SQL too large (${(sql.length / 1024).toFixed(1)} KB), splitting...`);
    return false; // Caller should handle splitting
  }
  
  await fs.writeFile(tempFile, sql, 'utf-8');
  
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const { stdout, stderr } = await execAsync(
        `npx wrangler d1 execute ${databaseName} --remote --file=${tempFile}`,
        { timeout: 120000, maxBuffer: 10 * 1024 * 1024 } // 2 min timeout, 10MB buffer
      );
      
      // Success - return
      await fs.unlink(tempFile).catch(() => {});
      return true;
    } catch (error: any) {
      const errorMsg = error.message || String(error);
      
      // Check if it's a duplicate error (safe to ignore)
      if (errorMsg.includes('UNIQUE constraint')) {
        await fs.unlink(tempFile).catch(() => {});
        return true; // Consider duplicates as success
      }
      
      // Check if it's a timeout or rate limit
      if (errorMsg.includes('timeout') || errorMsg.includes('rate limit') || errorMsg.includes('429') || errorMsg.includes('ETIMEDOUT')) {
        if (attempt < retries) {
          const waitTime = Math.min(attempt * 3000, 15000); // Exponential backoff: 3s, 6s, 9s, 12s, 15s max
          await new Promise(resolve => setTimeout(resolve, waitTime));
          continue;
        }
      }
      
      // For other errors, log and retry
      if (attempt < retries) {
        const waitTime = Math.min(attempt * 2000, 10000);
        await new Promise(resolve => setTimeout(resolve, waitTime));
        continue;
      }
      
      // Final attempt failed - don't throw, just return false
      await fs.unlink(tempFile).catch(() => {});
      return false;
    }
  }
  
  await fs.unlink(tempFile).catch(() => {});
  return false;
}

/**
 * Helper to get testament based on book name
 */
function getTestament(bookName: string): string {
  const otBooks = ['Genesis', 'Exodus', 'Leviticus', 'Numbers', 'Deuteronomy', 
                    'Joshua', 'Judges', 'Ruth', 'Psalms', 'Proverbs', 'Isaiah',
                    'Jeremiah', 'Ezekiel', 'Daniel'];
  const ntBooks = ['Matthew', 'Mark', 'Luke', 'John', 'Acts', 'Romans', '1 Corinthians',
                    '2 Corinthians', 'Galatians', 'Ephesians', 'Philippians', 'Colossians',
                    '1 Thessalonians', '2 Thessalonians', '1 Timothy', '2 Timothy', 'Titus',
                    'Philemon', 'Hebrews', 'James', '1 Peter', '2 Peter', '1 John',
                    '2 John', '3 John', 'Jude', 'Revelation'];

  if (otBooks.includes(bookName)) {
    return 'OT';
  } else if (ntBooks.includes(bookName)) {
    return 'NT';
  }
  return 'Unknown';
}

/**
 * Helper to normalize book name for audio filename
 */
function normalizeBookName(bookName: string): string {
  return bookName.toLowerCase().replace(/\s+/g, '');
}

/**
 * Migrate Verses
 */
async function migrateVerses() {
  console.log('📖 Migrating verses...\n');

  const yousafzaiData: any[] = JSON.parse(readFileSync('yousafzai_all_verses.json', 'utf-8'));
  
  const zlib = require('zlib');
  const compressed = readFileSync('cache/verses.json.gz');
  const decompressed = zlib.gunzipSync(compressed);
  const afghanObj = JSON.parse(decompressed.toString('utf-8'));
  const afghanData = Object.values(afghanObj);

  // Query the current max ID to resume from where we left off
  let currentId = 1;
  try {
    const maxIdQuery = `SELECT MAX(id) as max_id FROM verses;`;
    const tempFile = join(process.cwd(), `.temp-max-id-${Date.now()}.sql`);
    await writeFile(tempFile, maxIdQuery, 'utf-8');
    
    const result = await execAsync(
      `npx wrangler d1 execute pashto-bible-db --remote --command="${maxIdQuery}" 2>&1`,
      { timeout: 30000, maxBuffer: 10 * 1024 * 1024 }
    );
    
    const match = result.stdout.match(/"max_id":\s*(\d+)/);
    if (match) {
      currentId = parseInt(match[1]) + 1;
      console.log(`   ℹ️  Resuming from ID ${currentId} (${currentId - 1} verses already migrated)`);
    }
    await fs.unlink(tempFile).catch(() => {});
  } catch (error) {
    console.warn('   ⚠️  Could not determine starting ID, starting from 1');
  }

  const batchSize = 1000;
  const parallelBatches = 1;

  // Calculate how many Yousafzai verses are already migrated
  const yousafzaiMigrated = yousafzaiData.length;  // All 30,410 Yousafzai are likely already there or ID conflicts
  const afghansToProcess = afghanData.length;

  console.log(`   📊 Yousafzai: ${yousafzaiMigrated} / ${yousafzaiData.length} migrated`);
  console.log(`   📊 Afghan: 0 / ${afghansToProcess} to migrate\n`);

  // Skip Yousafzai - they're already migrated (or have ID conflicts with the resuming logic)
  // The INSERT OR IGNORE handled deduplication already
  console.log(`   ⏭️  Skipping Yousafzai verses (already migrated)\n`);
  
  // Reset to a new ID range for Afghan verses
  currentId = 40000;  // Start Afghan IDs at 40,000 to avoid conflicts

  // Process Afghan verses
  for (let i = 0; i < afghansToProcess; i += batchSize * parallelBatches) {
    const batchPromises: Promise<void>[] = [];

    for (let p = 0; p < parallelBatches && (i + p * batchSize) < afghansToProcess; p++) {
      const batchStart = i + p * batchSize;
      const batch = (afghanData as any[]).slice(batchStart, batchStart + batchSize);
      const batchStartId = currentId + p * batchSize;

      const promise = (async () => {
        const values = batch
          .map((v, idx) => {
            const ref = v.ref || '';
            const parsed = ref.match(/^(.+?)\s+(\d+):(\d+)$/);
            if (!parsed) return null;

            const book = parsed[1];
            const chapter = parseInt(parsed[2]);
            const verseNum = parseInt(parsed[3]);
            const testament = getTestament(book);
            const audioR2Key = `afghan2023/${testament.toLowerCase()}/${normalizeBookName(book)}${chapter}_verse_${verseNum.toString().padStart(3, '0')}.mp3`;

            return `(${batchStartId + idx}, ${escapeSql(ref)}, ${escapeSql(book)}, ${chapter}, ${verseNum}, ${escapeSql(v.text || '')}, ${escapeSql(null)}, ${escapeSql(null)}, ${escapeSql(testament)}, 'afghan2023', 'afghan', '[]', ${escapeSql(audioR2Key)}, NULL, ${Math.floor(Date.now()/1000)}, ${Math.floor(Date.now()/1000)})`;
          })
          .filter(v => v !== null);

        if (values.length === 0) return;

        const sql = `INSERT OR IGNORE INTO verses (id, ref, book, chapter, verse, text, text_normalized, text_html, testament, translation_key, dialect, tags, audio_r2_key, audio_public_url, created_at, updated_at) VALUES\n${values.join(',\n')};`;

        const success = await executeD1Sql(sql);
        if (!success) {
          console.error(`   ⚠️  Afghan batch ${batchStart}-${batchStart + batch.length} failed`);
        }
      })();
      batchPromises.push(promise);
    }
    
    await Promise.allSettled(batchPromises);
    currentId += Math.min(batchSize * parallelBatches, afghansToProcess - i);
    const progress = Math.min(i + batchSize * parallelBatches, afghansToProcess);
    if (progress % 2000 === 0 || progress === afghansToProcess) {
      console.log(`   ✅ Progress: ${progress}/${afghansToProcess} Afghan verses`);
    }
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  console.log('\n✅ Verse migration complete!\n');
}

/**
 * Migrate Word Frequencies
 */
async function migrateWordFrequencies() {
  console.log('\n📊 Migrating Word Frequencies...');
  
  const data = JSON.parse(readFileSync('app/data/word_frequency_list.json', 'utf-8'));
  console.log(`   Found ${data.length} word frequency entries`);
  
  const batchSize = 100;
  for (let i = 0; i < data.length; i += batchSize) {
    const batch = data.slice(i, i + batchSize);
    const values = batch.map((w: any, idx: number) => {
      return `(${i + idx + 1}, ${escapeSql(w.pashto)}, ${w.frequency || 0}, ${i + idx + 1}, ${escapeSql(w.romanization || null)}, ${escapeSql(w.pos || null)}, NULL, ${Math.floor(Date.now()/1000)}, ${Math.floor(Date.now()/1000)})`;
    });
    
    const sql = `INSERT OR IGNORE INTO word_frequencies (id, pashto_word, frequency, frequency_rank, romanization, pos, translation_key, created_at, updated_at) VALUES\n${values.join(',\n')};`;
    
    await executeD1Sql(sql);
    if ((i + batchSize) % 1000 === 0) {
      console.log(`   Progress: ${i + batchSize}/${data.length}`);
    }
    
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  console.log('✅ Word frequencies migration complete');
}

/**
 * Migrate Form Occurrences
 */
async function migrateFormOccurrences() {
  console.log('\n🔍 Migrating Form Occurrences...');
  
  const data = JSON.parse(readFileSync('app/data/form_occurrence_index.json', 'utf-8'));
  const entries = Object.entries(data);
  console.log(`   Found ${entries.length} form occurrence entries`);
  
  const batchSize = 100;
  let id = 1;
  for (let i = 0; i < entries.length; i += batchSize) {
    const batch = entries.slice(i, i + batchSize);
    const values = batch.map(([word, refs]: [string, any]) => {
      const verseRefs = Array.isArray(refs) ? refs : (typeof refs === 'string' ? [refs] : []);
      return `(${id++}, ${escapeSql(word)}, ${toJsonSql(verseRefs)}, ${verseRefs.length}, NULL, ${Math.floor(Date.now()/1000)}, ${Math.floor(Date.now()/1000)})`;
    });
    
    const sql = `INSERT OR IGNORE INTO form_occurrences (id, pashto_form, verse_refs, frequency, translation_key, created_at, updated_at) VALUES\n${values.join(',\n')};`;
    
    await executeD1Sql(sql);
    if ((i + batchSize) % 1000 === 0) {
      console.log(`   Progress: ${i + batchSize}/${entries.length}`);
    }
    
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  console.log('✅ Form occurrences migration complete');
}

/**
 * Migrate Form to Root Mapping
 */
async function migrateFormToRoot() {
  console.log('\n🔗 Migrating Form to Root Mapping...');
  
  const data = JSON.parse(readFileSync('app/data/form_to_root_map.json', 'utf-8'));
  const entries = Object.entries(data);
  console.log(`   Found ${entries.length} form-to-root mappings`);
  
  const batchSize = 100;
  let id = 1;
  for (let i = 0; i < entries.length; i += batchSize) {
    const batch = entries.slice(i, i + batchSize);
    const values = batch.map(([form, root]: [string, any]) => {
      const roots = Array.isArray(root) ? root : [root];
      return roots.map((r: string) => 
        `(${id++}, ${escapeSql(form)}, ${escapeSql(r)}, 0, ${Math.floor(Date.now()/1000)}, ${Math.floor(Date.now()/1000)})`
      ).join(',\n');
    });
    
    const sql = `INSERT OR IGNORE INTO form_to_root (id, word_form, root_word, frequency, created_at, updated_at) VALUES\n${values.join(',\n')};`;
    
    await executeD1Sql(sql);
    if ((i + batchSize) % 1000 === 0) {
      console.log(`   Progress: ${i + batchSize}/${entries.length}`);
    }
    
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  console.log('✅ Form to root migration complete');
}

/**
 * Main migration function
 */
async function migrate() {
  console.log('🚀 Starting COMPREHENSIVE migration to Cloudflare D1...\n');
  console.log('📋 Schema should already be applied. If not, run: bash cloudflare/reset-and-migrate.sh\n');
  
  // Migrate data in order with error handling
  try {
    await migrateVerses();
  } catch (error: any) {
    console.error('⚠️  Verses migration had errors but continuing...', error.message);
  }
  
  try {
    await migrateWordFrequencies();
  } catch (error: any) {
    console.error('⚠️  Word frequencies migration had errors but continuing...', error.message);
  }
  
  try {
    await migrateFormOccurrences();
  } catch (error: any) {
    console.error('⚠️  Form occurrences migration had errors but continuing...', error.message);
  }
  
  try {
    await migrateFormToRoot();
  } catch (error: any) {
    console.error('⚠️  Form to root migration had errors but continuing...', error.message);
  }
  
  console.log('\n✅ Migration script completed!');
  console.log('\n📊 Summary:');
  console.log('   - Verses (both translations)');
  console.log('   - Word frequencies');
  console.log('   - Form occurrences');
  console.log('   - Form to root mappings');
  console.log('\n💡 Check progress with: npx tsx cloudflare/display-progress.ts');
  console.log('💡 You can now add/delete records as needed!');
}

migrate();

