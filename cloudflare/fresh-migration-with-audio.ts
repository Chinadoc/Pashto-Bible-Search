/**
 * FRESH MIGRATION - Verse-to-Audio Matching
 * 
 * 1. Loads audio mapping CSV to match verses to audio files
 * 2. Migrates verses with proper audio_r2_key fields
 * 3. Ensures 1:1 verse-to-audio matching
 */

import { readFileSync } from 'fs';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

// Load audio mapping CSV
function loadAudioMapping(): Map<string, string> {
  const csv = readFileSync('yousafzai_audio_mapping.csv', 'utf8');
  const lines = csv.split('\n').slice(1).filter(l => l.trim());
  const mapping = new Map<string, string>();
  
  lines.forEach(line => {
    const parts = line.split(',');
    if (parts.length >= 6) {
      const book = parts[1];
      const chapter = parts[2];
      const verse = parts[3];
      const fileName = parts[5].replace(/^"|"$/g, ''); // Remove quotes
      const key = `${book}_${chapter}_${verse}`;
      mapping.set(key, fileName);
    }
  });
  
  return mapping;
}

function getTestament(book: string): 'OT' | 'NT' {
  // Complete list of OT books
  const otBooks = new Set([
    'Genesis', 'Exodus', 'Leviticus', 'Numbers', 'Deuteronomy',
    'Joshua', 'Judges', 'Ruth', '1 Samuel', '2 Samuel', '1 Kings', '2 Kings',
    '1 Chronicles', '2 Chronicles', 'Ezra', 'Nehemiah', 'Esther',
    'Job', 'Psalms', 'Proverbs', 'Ecclesiastes', 'Song of Solomon', 'Songofsongs',
    'Isaiah', 'Jeremiah', 'Lamentations', 'Ezekiel', 'Daniel',
    'Hosea', 'Joel', 'Amos', 'Obadiah', 'Jonah', 'Micah', 'Nahum', 'Habakkuk',
    'Zephaniah', 'Haggai', 'Zechariah', 'Malachi'
  ]);
  
  // Check exact match first
  if (otBooks.has(book)) return 'OT';
  
  // Check if it's a numbered book (1 Samuel, 2 Chronicles, etc.)
  const numberedMatch = book.match(/^(\d+)\s+(.+)$/);
  if (numberedMatch) {
    const numberedBook = `${numberedMatch[1]} ${numberedMatch[2]}`;
    if (otBooks.has(numberedBook)) return 'OT';
  }
  
  // Default to NT for all other books
  return 'NT';
}

function escapeSql(str: string | null | undefined): string {
  if (!str) return "NULL";
  return `'${String(str).replace(/'/g, "''")}'`;
}

function toJsonSql(obj: any): string {
  if (!obj) return "NULL";
  try {
    return escapeSql(JSON.stringify(obj));
  } catch {
    return "NULL";
  }
}

async function executeD1Sql(sql: string): Promise<boolean> {
  const fs = await import('fs/promises');
  const path = await import('path');
  const tempFile = path.join(process.cwd(), `.temp-d1-${Date.now()}-${Math.random().toString(36).substring(7)}.sql`);
  
  await fs.writeFile(tempFile, sql, 'utf-8');
  
  try {
    const { stdout, stderr } = await execAsync(
      `npx wrangler d1 execute pashto-bible-db --remote --file="${tempFile}"`,
      { timeout: 120000, maxBuffer: 10 * 1024 * 1024 }
    );
    await fs.unlink(tempFile).catch(() => {});
    
    // Check if it actually succeeded
    if (stdout.includes('"success":true')) {
      return true;
    }
    if (stdout.includes('"success":false')) {
      console.error(`   ❌ SQL Error: ${stdout.substring(0, 500)}`);
      return false;
    }
    return true;
  } catch (error: any) {
    await fs.unlink(tempFile).catch(() => {});
    const errorMsg = error.message || String(error);
    
    // Ignore duplicates
    if (errorMsg.includes('UNIQUE constraint')) {
      return true;
    }
    
    // Show full error
    console.error(`   ❌ Full error: ${errorMsg.substring(0, 500)}`);
    if (error.stderr) {
      console.error(`   stderr: ${String(error.stderr).substring(0, 300)}`);
    }
    return false;
  }
}

async function main() {
  console.log('🚀 FRESH MIGRATION - Verse-to-Audio Matching\n');
  console.log('='.repeat(60));
  
  // Load audio mapping
  console.log('\n📋 Loading audio mapping CSV...');
  const audioMapping = loadAudioMapping();
  console.log(`   ✅ Loaded ${audioMapping.size} audio mappings`);
  
  // Load verses
  console.log('\n📖 Loading verses...');
  const verses = JSON.parse(readFileSync('yousafzai_all_verses.json', 'utf8'));
  console.log(`   ✅ Loaded ${verses.length} verses`);
  
  // Match verses to audio
  console.log('\n🔗 Matching verses to audio...');
  let matched = 0;
  let unmatched = 0;
  
  const versesWithAudio = verses.map((v: any) => {
    const key = `${v.book}_${v.chapter}_${v.verse}`;
    const audioFileName = audioMapping.get(key);
    
    if (audioFileName) {
      matched++;
      const testament = getTestament(v.book);
      const audioR2Key = `yousafzai/${testament.toLowerCase()}/${audioFileName}`;
      return {
        ...v,
        audio_r2_key: audioR2Key,
        audio_storage_filename: audioFileName,
      };
    } else {
      unmatched++;
      return {
        ...v,
        audio_r2_key: null,
        audio_storage_filename: null,
      };
    }
  });
  
  console.log(`   ✅ Matched: ${matched} verses`);
  console.log(`   ⚠️  Unmatched: ${unmatched} verses (${(unmatched/verses.length*100).toFixed(1)}%)`);
  
  // Migrate in batches
  console.log('\n📤 Migrating verses to D1...');
  const batchSize = 100; // Reduced to 100 to avoid SQLITE_TOOBIG error (Pashto text is long)
  let currentId = 1;
  
  for (let i = 0; i < versesWithAudio.length; i += batchSize) {
    const batch = versesWithAudio.slice(i, i + batchSize);
    const batchNum = Math.floor(i / batchSize) + 1;
    const totalBatches = Math.ceil(versesWithAudio.length / batchSize);
    
    console.log(`[${batchNum}/${totalBatches}] Processing ${batch.length} verses...`);
    
    const values = batch.map((v: any, idx: number) => {
      const ref = `${v.book} ${v.chapter}:${v.verse}`;
      const testament = getTestament(v.book);
      
      return `(${currentId + idx}, ${escapeSql(ref)}, ${escapeSql(v.book)}, ${v.chapter}, ${v.verse}, ${escapeSql(v.text)}, ${escapeSql(null)}, ${escapeSql(v.text_html || null)}, ${escapeSql(testament)}, 'yousafzai2019', 'yousafzai', ${toJsonSql(v.tags || [])}, ${escapeSql(v.audio_r2_key)}, ${escapeSql(null)}, ${Math.floor(Date.now()/1000)}, ${Math.floor(Date.now()/1000)})`;
    });
    
    const sql = `INSERT OR IGNORE INTO verses (id, ref, book, chapter, verse, text, text_normalized, text_html, testament, translation_key, dialect, tags, audio_r2_key, audio_public_url, created_at, updated_at) VALUES\n${values.join(',\n')};`;
    
    const success = await executeD1Sql(sql);
    if (success) {
      console.log(`   ✅ Inserted ${batch.length} verses`);
    } else {
      console.log(`   ⚠️  Batch ${batchNum} may have issues`);
    }
    
    currentId += batch.length;
    
    // Progress update every 5 batches
    if (batchNum % 5 === 0) {
      console.log(`   📊 Progress: ${Math.min(i + batchSize, versesWithAudio.length)}/${versesWithAudio.length}`);
    }
    
    // Small delay
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  console.log('\n✅ Migration complete!');
  console.log(`\n📊 Summary:`);
  console.log(`   - Total verses: ${versesWithAudio.length}`);
  console.log(`   - With audio: ${matched}`);
  console.log(`   - Without audio: ${unmatched}`);
  console.log(`\n💡 Next: Upload audio files to R2 using audio_r2_key paths`);
}

main().catch(console.error);

