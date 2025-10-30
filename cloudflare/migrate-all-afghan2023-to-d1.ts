/**
 * Migrate ALL Afghan 2023 verses from scraped text files to D1
 * Handles both NT and OT books
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

function normalizeBookName(bookSlug: string, isNT: boolean): string {
  // Handle numbered books (1chronicles, 2samuel, etc.)
  const numberedMatch = bookSlug.match(/^(\d+)([a-z]+)$/i);
  if (numberedMatch) {
    const [, num, name] = numberedMatch;
    const normalizedName = normalizeBookName(name, isNT);
    return `${num} ${normalizedName}`;
  }
  
  // Convert slug to proper book name
  const bookMap: Record<string, string> = {
    // OT
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
    // NT
    'matthew': 'Matthew',
    'mark': 'Mark',
    'luke': 'Luke',
    'john': 'John',
    'acts': 'Acts',
    'romans': 'Romans',
    'corinthians': 'Corinthians',
    'galatians': 'Galatians',
    'ephesians': 'Ephesians',
    'philippians': 'Philippians',
    'colossians': 'Colossians',
    'thessalonians': 'Thessalonians',
    'timothy': 'Timothy',
    'titus': 'Titus',
    'philemon': 'Philemon',
    'hebrews': 'Hebrews',
    'james': 'James',
    'peter': 'Peter',
    'jude': 'Jude',
    'revelation': 'Revelation',
  };
  
  const lower = bookSlug.toLowerCase().replace(/-/g, '');
  
  // Handle numbered NT books
  if (isNT) {
    if (lower.match(/^1corinthians/)) return '1 Corinthians';
    if (lower.match(/^2corinthians/)) return '2 Corinthians';
    if (lower.match(/^1thessalonians/)) return '1 Thessalonians';
    if (lower.match(/^2thessalonians/)) return '2 Thessalonians';
    if (lower.match(/^1timothy/)) return '1 Timothy';
    if (lower.match(/^2timothy/)) return '2 Timothy';
    if (lower.match(/^1peter/)) return '1 Peter';
    if (lower.match(/^2peter/)) return '2 Peter';
    if (lower.match(/^1john/)) return '1 John';
    if (lower.match(/^2john/)) return '2 John';
    if (lower.match(/^3john/)) return '3 John';
  }
  
  return bookMap[lower] || bookSlug.charAt(0).toUpperCase() + bookSlug.slice(1).toLowerCase();
}

function getTestament(book: string): 'OT' | 'NT' {
  const normalized = normalizeBookName(book, false);
  
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
  return 'NT';
}

function normalizeBookSlug(book: string): string {
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

function parseTextFile(content: string, bookSlug: string, chapter: number, isNT: boolean): Verse[] {
  const verses: Verse[] = [];
  const lines = content.split('\n');
  
  // Handle format: verse number on one line, text on next line
  // OR format: verse number and text on same line
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    // Check if line starts with verse number (Arabic/Indic/Western digits)
    const verseMatch = line.match(/^([0-9\u06F0-\u06F9\u0660-\u0669]+)(?:\s+(.+))?$/);
    
    if (verseMatch) {
      const verseNumStr = verseMatch[1];
      let verseText = verseMatch[2] || '';
      
      // Parse verse number
      const verseNum = parseInt(verseNumStr.replace(/[\u06F0-\u06F9\u0660-\u0669]/g, (char) => {
        // Convert Arabic-Indic digits to Western
        const map: Record<string, string> = {
          '\u0660': '0', '\u0661': '1', '\u0662': '2', '\u0663': '3', '\u0664': '4',
          '\u0665': '5', '\u0666': '6', '\u0667': '7', '\u0668': '8', '\u0669': '9',
          '\u06F0': '0', '\u06F1': '1', '\u06F2': '2', '\u06F3': '3', '\u06F4': '4',
          '\u06F5': '5', '\u06F6': '6', '\u06F7': '7', '\u06F8': '8', '\u06F9': '9',
        };
        return map[char] || char;
      }), 10);
      
      // If no text on same line, check next line
      if (!verseText && i + 1 < lines.length) {
        const nextLine = lines[i + 1].trim();
        if (nextLine && !nextLine.match(/^[0-9\u06F0-\u06F9\u0660-\u0669]+/)) {
          verseText = nextLine;
          i++; // Skip next line since we consumed it
        }
      }
      
      // Continue reading lines until we hit another verse number or empty line
      while (i + 1 < lines.length) {
        const nextLine = lines[i + 1].trim();
        if (!nextLine) break;
        // Check if next line is a verse number
        if (nextLine.match(/^[0-9\u06F0-\u06F9\u0660-\u0669]+/)) break;
        verseText += ' ' + nextLine;
        i++;
      }
      
      if (verseNum > 0 && verseText.trim()) {
        const book = normalizeBookName(bookSlug, isNT);
        verses.push({
          book,
          chapter,
          verse: verseNum,
          text: verseText.trim(),
          ref: `${book} ${chapter}:${verseNum}`,
        });
      }
    }
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
  
  const sql = `INSERT OR REPLACE INTO verses (ref, book, chapter, verse, text, text_normalized, text_html, testament, translation_key, dialect, tags, audio_r2_key, audio_public_url, created_at, updated_at) VALUES\n${values.join(',\n')};`;
  
  // Write to temp file
  const fs = await import('fs/promises');
  const path = await import('path');
  const tempFile = path.join(process.cwd(), `.temp-afghan-batch-${batchNum}.sql`);
  
  await fs.writeFile(tempFile, sql, 'utf-8');
  
  try {
    const { stdout, stderr } = await execAsync(
      `npx wrangler d1 execute pashto-bible-db --remote --file=${tempFile}`,
      { maxBuffer: 50 * 1024 * 1024 }
    );
    
    if (stderr && !stderr.includes('warning')) {
      console.error(`   ⚠️  Batch ${batchNum}/${totalBatches}: ${stderr}`);
    }
  } catch (error: any) {
    console.error(`   ❌ Batch ${batchNum}/${totalBatches} failed: ${error.message}`);
    throw error;
  } finally {
    await fs.unlink(tempFile).catch(() => {});
  }
}

async function migrateDirectory(dirPath: string, isNT: boolean): Promise<void> {
  const files = await readdir(dirPath);
  const txtFiles = files.filter(f => f.endsWith('_pashto.txt'));
  
  console.log(`\n📚 Processing ${txtFiles.length} files from ${isNT ? 'NT' : 'OT'} directory...`);
  
  const allVerses: Verse[] = [];
  
  for (const file of txtFiles.sort()) {
    const match = file.match(/^(.+?)(\d+)_pashto\.txt$/);
    if (!match) continue;
    
    const [, bookSlug, chapterStr] = match;
    const chapter = parseInt(chapterStr, 10);
    
    try {
      const content = await readFile(join(dirPath, file), 'utf-8');
      const verses = parseTextFile(content, bookSlug, chapter, isNT);
      allVerses.push(...verses);
      
      if (verses.length > 0) {
        process.stdout.write(`\r   Processed ${file}: ${verses.length} verses`);
      }
    } catch (error: any) {
      console.error(`\n   ⚠️  Error processing ${file}: ${error.message}`);
    }
  }
  
  console.log(`\n   Total verses: ${allVerses.length}`);
  
  // Insert in batches
  const batchSize = 100;
  const batches: Verse[][] = [];
  
  for (let i = 0; i < allVerses.length; i += batchSize) {
    batches.push(allVerses.slice(i, i + batchSize));
  }
  
  console.log(`\n💾 Inserting ${batches.length} batches into D1...`);
  
  for (let i = 0; i < batches.length; i++) {
    await executeD1Batch(batches[i], i + 1, batches.length);
    process.stdout.write(`\r   Inserted batch ${i + 1}/${batches.length}...`);
    
    // Small delay to avoid rate limiting
    if ((i + 1) % 10 === 0) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  
  console.log(`\n✅ Inserted ${allVerses.length} verses from ${isNT ? 'NT' : 'OT'}`);
}

async function main() {
  console.log('🚀 Migrating Afghan 2023 Verses to D1\n');
  console.log('='.repeat(70));
  
  try {
    // Migrate NT
    const ntDir = join(process.cwd(), 'all_txt_copies');
    await migrateDirectory(ntDir, true);
    
    // Migrate OT
    const otDir = join(process.cwd(), 'ot_txt_copies');
    await migrateDirectory(otDir, false);
    
    // Summary
    console.log('\n' + '='.repeat(70));
    console.log('✅ Migration complete!');
    console.log('='.repeat(70));
    
    const { stdout } = await execAsync(
      `npx wrangler d1 execute pashto-bible-db --remote --command="SELECT translation_key, testament, COUNT(*) as count FROM verses WHERE translation_key = 'afghan2023' GROUP BY translation_key, testament ORDER BY testament;" --json`,
      { maxBuffer: 10 * 1024 * 1024 }
    );
    
    const result = JSON.parse(stdout);
    const data = Array.isArray(result) ? result[0] : result;
    
    console.log('\n📊 Final counts:');
    if (data.results) {
      data.results.forEach((row: any) => {
        console.log(`   ${row.testament}: ${row.count.toLocaleString()} verses`);
      });
    }
    
  } catch (error: any) {
    console.error(`\n❌ Migration failed: ${error.message}`);
    process.exit(1);
  }
}

main().catch(console.error);

