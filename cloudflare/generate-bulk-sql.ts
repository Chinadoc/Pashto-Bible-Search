/**
 * Generate large SQL files for bulk import to D1
 * Avoids API rate limits by creating fewer, larger files
 */

import { readFileSync, writeFileSync } from 'fs';

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

function getTestament(book: string): 'OT' | 'NT' {
  const otBooks = new Set([
    'Genesis', 'Exodus', 'Leviticus', 'Numbers', 'Deuteronomy',
    'Joshua', 'Judges', 'Ruth', 'Psalms', 'Proverbs', 'Isaiah',
    'Jeremiah', 'Lamentations', 'Ezekiel', 'Daniel', 'Hosea', 'Joel',
    'Amos', 'Obadiah', 'Jonah', 'Micah', 'Nahum', 'Habakkuk',
    'Zephaniah', 'Haggai', 'Zechariah', 'Malachi', 'Job', 'Esther',
    'Ezra', 'Nehemiah', 'Ecclesiastes', 'Song of Solomon', 'Songofsongs'
  ]);
  return otBooks.has(book) ? 'OT' : 'NT';
}

console.log('🚀 Generating bulk SQL files...\n');

// Load data
const yousafzaiData = JSON.parse(readFileSync('yousafzai_all_verses.json', 'utf-8'));
console.log(`   Loaded ${yousafzaiData.length} Yousafzai verses`);

const zlib = require('zlib');
const compressed = readFileSync('cache/verses.json.gz');
const decompressed = zlib.gunzipSync(compressed);
const afghanData = JSON.parse(decompressed.toString('utf-8'));
const afghanVerses = Object.values(afghanData);
console.log(`   Loaded ${afghanVerses.length} Afghan verses`);

// Generate Yousafzai SQL in chunks of 5000 (to keep files manageable)
const chunkSize = 5000;
let currentId = 1;

console.log('\n📝 Generating Yousafzai SQL files...');
for (let fileNum = 0; fileNum < Math.ceil(yousafzaiData.length / chunkSize); fileNum++) {
  const chunk = yousafzaiData.slice(fileNum * chunkSize, (fileNum + 1) * chunkSize);
  const values = chunk.map(v => {
    const ref = `${v.book} ${v.chapter}:${v.verse}`;
    const testament = getTestament(v.book);
    const audioR2Key = v.audio_storage_filename 
      ? `yousafzai/${testament.toLowerCase()}/${v.audio_storage_filename}`
      : null;
    
    return `(${currentId++}, ${escapeSql(ref)}, ${escapeSql(v.book)}, ${v.chapter}, ${v.verse}, ${escapeSql(v.text)}, ${escapeSql(null)}, ${escapeSql(v.text_html || null)}, ${escapeSql(testament)}, 'yousafzai2019', 'yousafzai', ${toJsonSql(v.tags || [])}, ${escapeSql(audioR2Key)}, ${escapeSql(v.audio_verse_url || null)}, ${Math.floor(Date.now()/1000)}, ${Math.floor(Date.now()/1000)})`;
  });
  
  const sql = `-- Yousafzai 2019 verses (file ${fileNum + 1} of ${Math.ceil(yousafzaiData.length / chunkSize)})\nINSERT OR IGNORE INTO verses (id, ref, book, chapter, verse, text, text_normalized, text_html, testament, translation_key, dialect, tags, audio_r2_key, audio_public_url, created_at, updated_at) VALUES\n${values.join(',\n')};`;
  
  const filename = `cloudflare/bulk-yousafzai-part${fileNum + 1}.sql`;
  writeFileSync(filename, sql, 'utf-8');
  console.log(`   ✅ ${filename} (${chunk.length} verses)`);
}

// Generate Afghan SQL
console.log('\n📝 Generating Afghan SQL files...');
for (let fileNum = 0; fileNum < Math.ceil(afghanVerses.length / chunkSize); fileNum++) {
  const chunk = afghanVerses.slice(fileNum * chunkSize, (fileNum + 1) * chunkSize);
  const values = chunk.map((v: any) => {
    const ref = v.ref || '';
    const parsed = ref.match(/^(.+?)\s+(\d+):(\d+)$/);
    if (!parsed) return null;
    
    const book = parsed[1];
    const chapter = parseInt(parsed[2]);
    const verseNum = parseInt(parsed[3]);
    const testament = getTestament(book);
    const audioR2Key = `afghan2023/${testament.toLowerCase()}/${book.toLowerCase().replace(/\s+/g,'')}${chapter}_verse_${verseNum.toString().padStart(3, '0')}.mp3`;
    
    return `(${currentId++}, ${escapeSql(ref)}, ${escapeSql(book)}, ${chapter}, ${verseNum}, ${escapeSql(v.text || '')}, ${escapeSql(null)}, ${escapeSql(null)}, ${escapeSql(testament)}, 'afghan2023', 'afghan', '[]', ${escapeSql(audioR2Key)}, NULL, ${Math.floor(Date.now()/1000)}, ${Math.floor(Date.now()/1000)})`;
  }).filter(v => v !== null);
  
  const sql = `-- Afghan 2023 verses (file ${fileNum + 1} of ${Math.ceil(afghanVerses.length / chunkSize)})\nINSERT OR IGNORE INTO verses (id, ref, book, chapter, verse, text, text_normalized, text_html, testament, translation_key, dialect, tags, audio_r2_key, audio_public_url, created_at, updated_at) VALUES\n${values.join(',\n')};`;
  
  const filename = `cloudflare/bulk-afghan-part${fileNum + 1}.sql`;
  writeFileSync(filename, sql, 'utf-8');
  console.log(`   ✅ ${filename} (${values.length} verses)`);
}

console.log('\n✅ SQL files generated!');
console.log('\n📋 To import manually:');
console.log('   1. Go to Cloudflare Dashboard → D1');
console.log('   2. Select pashto-bible-db');
console.log('   3. Use Console to run each file');
console.log('\nOr use wrangler (one file at a time with delay):');
console.log('   bash cloudflare/upload-bulk-sql.sh');


