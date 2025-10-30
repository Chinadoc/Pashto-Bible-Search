/**
 * Update Afghan 2023 verses with correct book names and R2 audio keys
 * Fixes migration issues where book names weren't normalized correctly
 */

import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function executeD1Sql(sql: string): Promise<void> {
  const fs = await import('fs/promises');
  const path = await import('path');
  const tempFile = path.join(process.cwd(), '.temp-update-afghan.sql');
  
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

function normalizeBookName(bookSlug: string): string {
  // Handle numbered books (1chronicles, 2samuel, etc.)
  const numberedMatch = bookSlug.match(/^(\d+)([a-z]+)$/i);
  if (numberedMatch) {
    const [, num, name] = numberedMatch;
    const normalizedName = normalizeBookName(name);
    return `${num} ${normalizedName}`;
  }
  
  // Convert slug to proper book name
  const bookMap: Record<string, string> = {
    'genesis': 'Genesis',
    'exodus': 'Exodus',
    'leviticus': 'Leviticus',
    'numbers': 'Numbers',
    'deuteronomy': 'Deuteronomy',
    'joshua': 'Joshua',
    'judges': 'Judges',
    'ruth': 'Ruth',
    'samuel': 'Samuel',
    'kings': 'Kings',
    'chronicles': 'Chronicles',
    'ezra': 'Ezra',
    'nehemiah': 'Nehemiah',
    'esther': 'Esther',
    'job': 'Job',
    'psalms': 'Psalms',
    'proverbs': 'Proverbs',
    'ecclesiastes': 'Ecclesiastes',
    'song-of-songs': 'Song of Solomon',
    'songofsongs': 'Song of Solomon',
    'isaiah': 'Isaiah',
    'jeremiah': 'Jeremiah',
    'lamentations': 'Lamentations',
    'ezekiel': 'Ezekiel',
    'daniel': 'Daniel',
    'hosea': 'Hosea',
    'joel': 'Joel',
    'amos': 'Amos',
    'obadiah': 'Obadiah',
    'jonah': 'Jonah',
    'micah': 'Micah',
    'nahum': 'Nahum',
    'habakkuk': 'Habakkuk',
    'zephaniah': 'Zephaniah',
    'haggai': 'Haggai',
    'zechariah': 'Zechariah',
    'malachi': 'Malachi',
  };
  
  const lower = bookSlug.toLowerCase().replace(/-/g, '');
  return bookMap[lower] || bookSlug.charAt(0).toUpperCase() + bookSlug.slice(1).toLowerCase();
}

function getTestament(book: string): 'OT' | 'NT' {
  const otBooks = new Set([
    'Genesis', 'Exodus', 'Leviticus', 'Numbers', 'Deuteronomy',
    'Joshua', 'Judges', 'Ruth', '1 Samuel', '2 Samuel', '1 Kings', '2 Kings',
    '1 Chronicles', '2 Chronicles', 'Ezra', 'Nehemiah', 'Esther',
    'Job', 'Psalms', 'Proverbs', 'Ecclesiastes', 'Song of Solomon',
    'Isaiah', 'Jeremiah', 'Lamentations', 'Ezekiel', 'Daniel',
    'Hosea', 'Joel', 'Amos', 'Obadiah', 'Jonah', 'Micah', 'Nahum', 'Habakkuk',
    'Zephaniah', 'Haggai', 'Zechariah', 'Malachi'
  ]);
  
  if (otBooks.has(book)) return 'OT';
  
  const numberedMatch = book.match(/^(\d+)\s+(.+)$/);
  if (numberedMatch) {
    const numberedBook = `${numberedMatch[1]} ${numberedMatch[2]}`;
    if (otBooks.has(numberedBook)) return 'OT';
  }
  
  return 'NT';
}

function normalizeBookSlug(book: string): string {
  let cleaned = book.toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9]/g, '');
  
  const numberedMatch = cleaned.match(/^(\d+)([a-z]+)$/);
  if (numberedMatch) {
    const [, num, name] = numberedMatch;
    return `${name}${num}`;
  }
  
  return cleaned;
}

function getR2AudioKey(book: string, chapter: number, verse: number): string {
  const cleanBook = normalizeBookSlug(book);
  const testament = getTestament(book).toLowerCase();
  return `afghan2023/${testament}/${cleanBook}${chapter}_verse_${verse.toString().padStart(3, '0')}.mp3`;
}

async function main() {
  console.log('🔧 Updating Afghan 2023 verses with correct book names and R2 keys...\n');
  
  // Get all Afghan 2023 verses that need updating
  const { stdout } = await execAsync(
    `npx wrangler d1 execute pashto-bible-db --remote --command="SELECT ref, book, chapter, verse FROM verses WHERE translation_key = 'afghan2023' LIMIT 1;" --json`
  );
  
  const result = JSON.parse(stdout);
  if (!result.results || result.results.length === 0) {
    console.log('✅ No Afghan 2023 verses found to update');
    return;
  }
  
  console.log(`📊 Found Afghan 2023 verses. Building update SQL...\n`);
  
  // Build UPDATE statements for each verse
  // We'll update in batches using a CASE statement
  const sql = `
-- Update Afghan 2023 verses with correct book names and R2 keys
UPDATE verses
SET 
  book = CASE 
    WHEN book LIKE '1%' THEN '1 ' || SUBSTR(book, 2)
    WHEN book LIKE '2%' THEN '2 ' || SUBSTR(book, 2)
    WHEN book = 'songofsongs' THEN 'Song of Solomon'
    ELSE INITCAP(book)
  END,
  ref = CASE 
    WHEN book LIKE '1%' THEN '1 ' || SUBSTR(book, 2) || ' ' || chapter || ':' || verse
    WHEN book LIKE '2%' THEN '2 ' || SUBSTR(book, 2) || ' ' || chapter || ':' || verse
    WHEN book = 'songofsongs' THEN 'Song of Solomon ' || chapter || ':' || verse
    ELSE INITCAP(book) || ' ' || chapter || ':' || verse
  END,
  testament = CASE 
    WHEN book LIKE '%genesis%' OR book LIKE '%exodus%' OR book LIKE '%leviticus%' 
         OR book LIKE '%numbers%' OR book LIKE '%deuteronomy%' OR book LIKE '%joshua%'
         OR book LIKE '%judges%' OR book LIKE '%ruth%' OR book LIKE '%samuel%'
         OR book LIKE '%kings%' OR book LIKE '%chronicles%' OR book LIKE '%ezra%'
         OR book LIKE '%nehemiah%' OR book LIKE '%esther%' OR book LIKE '%job%'
         OR book LIKE '%psalms%' OR book LIKE '%proverbs%' OR book LIKE '%ecclesiastes%'
         OR book LIKE '%song%' OR book LIKE '%isaiah%' OR book LIKE '%jeremiah%'
         OR book LIKE '%lamentations%' OR book LIKE '%ezekiel%' OR book LIKE '%daniel%'
         OR book LIKE '%hosea%' OR book LIKE '%joel%' OR book LIKE '%amos%'
         OR book LIKE '%obadiah%' OR book LIKE '%jonah%' OR book LIKE '%micah%'
         OR book LIKE '%nahum%' OR book LIKE '%habakkuk%' OR book LIKE '%zephaniah%'
         OR book LIKE '%haggai%' OR book LIKE '%zechariah%' OR book LIKE '%malachi%'
    THEN 'OT'
    ELSE 'NT'
  END,
  audio_r2_key = 'afghan2023/ot/' || 
    CASE 
      WHEN book LIKE '1%' THEN SUBSTR(book, 2) || '1' || chapter || '_verse_' || PRINTF('%03d', verse) || '.mp3'
      WHEN book LIKE '2%' THEN SUBSTR(book, 2) || '2' || chapter || '_verse_' || PRINTF('%03d', verse) || '.mp3'
      ELSE LOWER(REPLACE(REPLACE(book, ' ', ''), '-', '')) || chapter || '_verse_' || PRINTF('%03d', verse) || '.mp3'
    END,
  updated_at = strftime('%s', 'now')
WHERE translation_key = 'afghan2023';
`;
  
  console.log('📤 Executing update...');
  await executeD1Sql(sql);
  
  console.log('\n✅ Update complete!');
  console.log('\n📊 Verifying results...');
  
  const { stdout: verify } = await execAsync(
    `npx wrangler d1 execute pashto-bible-db --remote --command="SELECT ref, book, audio_r2_key FROM verses WHERE translation_key = 'afghan2023' LIMIT 5;" --json`
  );
  
  const verifyResult = JSON.parse(verify);
  if (verifyResult.results) {
    console.log('\n📝 Sample verses:');
    for (const v of verifyResult.results) {
      console.log(`   ${v.ref} -> ${v.audio_r2_key}`);
    }
  }
}

main().catch(console.error);

