/**
 * Migrate Afghan 2023 verses from scraped text files to D1
 * Links verses with uploaded audio files in R2
 */

import { readdir, readFile } from 'fs/promises';
import { join, basename } from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

interface Verse {
  book: string;
  chapter: number;
  verse: number;
  text: string;
  ref: string;
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
  // Normalize book name first
  const normalized = normalizeBookName(book);
  
  const otBooks = new Set([
    'Genesis', 'Exodus', 'Leviticus', 'Numbers', 'Deuteronomy',
    'Joshua', 'Judges', 'Ruth', '1 Samuel', '2 Samuel', '1 Kings', '2 Kings',
    '1 Chronicles', '2 Chronicles', 'Ezra', 'Nehemiah', 'Esther',
    'Job', 'Psalms', 'Proverbs', 'Ecclesiastes', 'Song of Solomon',
    'Isaiah', 'Jeremiah', 'Lamentations', 'Ezekiel', 'Daniel',
    'Hosea', 'Joel', 'Amos', 'Obadiah', 'Jonah', 'Micah', 'Nahum', 'Habakkuk',
    'Zephaniah', 'Haggai', 'Zechariah', 'Malachi'
  ]);
  
  if (otBooks.has(normalized)) return 'OT';
  
  // Handle numbered books (e.g., "1chronicles" -> "1 Chronicles")
  const numberedMatch = normalized.match(/^(\d+)\s+(.+)$/);
  if (numberedMatch) {
    const numberedBook = `${numberedMatch[1]} ${numberedMatch[2]}`;
    if (otBooks.has(numberedBook)) return 'OT';
  }
  
  // Also check lowercase variations
  const lowerNormalized = normalized.toLowerCase();
  const otLower = Array.from(otBooks).map(b => b.toLowerCase());
  if (otLower.includes(lowerNormalized)) return 'OT';
  
  return 'NT';
}

function normalizeBookSlug(book: string): string {
  // Remove spaces and special characters
  let cleaned = book.toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9]/g, '');
  
  // Handle numbered books: "1 Chronicles" -> "chronicles1", "1 Samuel" -> "samuel1"
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

function parseTextFile(content: string, bookSlug: string, chapter: number): Verse[] {
  const verses: Verse[] = [];
  const lines = content.split('\n');
  
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    
    // Match verse number at start (Arabic/Indic/Western digits)
    const verseMatch = trimmed.match(/^([0-9\u06F0-\u06F9\u0660-\u0669]+)\s+(.+)$/);
    if (!verseMatch) continue;
    
    const verseNum = parseInt(verseMatch[1].replace(/[\u06F0-\u06F9\u0660-\u0669]/g, (char) => {
      // Convert Arabic-Indic digits to Western
      const map: Record<string, string> = {
        '\u0660': '0', '\u0661': '1', '\u0662': '2', '\u0663': '3', '\u0664': '4',
        '\u0665': '5', '\u0666': '6', '\u0667': '7', '\u0668': '8', '\u0669': '9',
        '\u06F0': '0', '\u06F1': '1', '\u06F2': '2', '\u06F3': '3', '\u06F4': '4',
        '\u06F5': '5', '\u06F6': '6', '\u06F7': '7', '\u06F8': '8', '\u06F9': '9',
      };
      return map[char] || char;
    }), 10);
    
    if (isNaN(verseNum) || verseNum <= 0) continue;
    
    const text = verseMatch[2].trim();
    if (!text) continue;
    
    const book = normalizeBookName(bookSlug);
    const ref = `${book} ${chapter}:${verseNum}`;
    
    verses.push({
      book,
      chapter,
      verse: verseNum,
      text,
      ref,
    });
  }
  
  return verses;
}

function escapeSql(str: string | null | undefined): string {
  if (!str) return "''";
  return `'${str.replace(/'/g, "''")}'`;
}

async function executeD1Batch(
  verses: Verse[],
  batchNum: number,
  totalBatches: number
): Promise<void> {
  const values = verses.map(v => {
    const audioR2Key = getR2AudioKey(v.book, v.chapter, v.verse);
    const testament = getTestament(v.book);
    const timestamp = Math.floor(Date.now() / 1000);
    
    return `(${escapeSql(v.ref)}, ${escapeSql(v.book)}, ${v.chapter}, ${v.verse}, ${escapeSql(v.text)}, ${escapeSql(null)}, ${escapeSql(null)}, ${escapeSql(testament)}, 'afghan2023', 'afghan', '[]', ${escapeSql(audioR2Key)}, NULL, ${timestamp}, ${timestamp})`;
  });
  
  const sql = `INSERT OR IGNORE INTO verses (ref, book, chapter, verse, text, text_normalized, text_html, testament, translation_key, dialect, tags, audio_r2_key, audio_public_url, created_at, updated_at) VALUES\n${values.join(',\n')};`;
  
  // Write to temp file
  const fs = await import('fs/promises');
  const path = await import('path');
  const tempFile = path.join(process.cwd(), `.temp-afghan-batch-${batchNum}.sql`);
  
  await fs.writeFile(tempFile, sql, 'utf-8');
  
  try {
    const { stdout, stderr } = await execAsync(
      `npx wrangler d1 execute pashto-bible-db --remote --file=${tempFile}`
    );
    
    if (stderr && !stderr.includes('warning')) {
      console.error(`   ⚠️  Batch ${batchNum}/${totalBatches}: ${stderr}`);
    }
    
    process.stdout.write(`\r   ✅ Batch ${batchNum}/${totalBatches}: ${verses.length} verses inserted`);
  } catch (error: any) {
    console.error(`\n   ❌ Batch ${batchNum}/${totalBatches} failed: ${error.message}`);
    throw error;
  } finally {
    await fs.unlink(tempFile).catch(() => {});
  }
}

async function main() {
  console.log('🚀 Migrating Afghan 2023 verses from text files to D1\n');
  
  const txtDir = join(process.cwd(), 'ot_txt_copies');
  
  // Get all text files
  const files = await readdir(txtDir);
  const txtFiles = files.filter(f => f.endsWith('_pashto.txt'));
  
  console.log(`📁 Found ${txtFiles.length} text files\n`);
  
  // Parse all verses
  const allVerses: Verse[] = [];
  
  for (const file of txtFiles) {
    const match = file.match(/^(.+?)(\d+)_pashto\.txt$/);
    if (!match) continue;
    
    const [, bookSlug, chapterStr] = match;
    const chapter = parseInt(chapterStr, 10);
    
    if (isNaN(chapter)) continue;
    
    const content = await readFile(join(txtDir, file), 'utf-8');
    const verses = parseTextFile(content, bookSlug, chapter);
    
    allVerses.push(...verses);
    
    if (allVerses.length % 100 === 0) {
      process.stdout.write(`\r   Parsed ${allVerses.length} verses...`);
    }
  }
  
  console.log(`\n\n✅ Parsed ${allVerses.length} verses total`);
  
  // Sort by book, chapter, verse
  allVerses.sort((a, b) => {
    if (a.book !== b.book) return a.book.localeCompare(b.book);
    if (a.chapter !== b.chapter) return a.chapter - b.chapter;
    return a.verse - b.verse;
  });
  
  // Group by book/chapter for reporting
  const byBook: Record<string, number> = {};
  for (const v of allVerses) {
    byBook[v.book] = (byBook[v.book] || 0) + 1;
  }
  
  console.log('\n📊 Verses by book:');
  for (const [book, count] of Object.entries(byBook).sort()) {
    console.log(`   ${book.padEnd(20)} ${count.toLocaleString().padStart(6)} verses`);
  }
  
  // Insert in batches
  const batchSize = 100;
  const batches: Verse[][] = [];
  
  for (let i = 0; i < allVerses.length; i += batchSize) {
    batches.push(allVerses.slice(i, i + batchSize));
  }
  
  console.log(`\n📤 Inserting ${batches.length} batches into D1...\n`);
  
  const startTime = Date.now();
  
  for (let i = 0; i < batches.length; i++) {
    await executeD1Batch(batches[i], i + 1, batches.length);
  }
  
  const duration = ((Date.now() - startTime) / 1000).toFixed(1);
  
  console.log(`\n\n✅ Migration complete!`);
  console.log(`📊 Inserted ${allVerses.length} verses`);
  console.log(`⏱️  Duration: ${duration} seconds`);
  console.log(`\n🔗 All verses linked to audio files in R2 (afghan2023/ot/)`);
}

main().catch(console.error);

