/**
 * Re-migrate Incomplete Afghan 2023 NT Books
 * 
 * Focuses on books that only have chapter 1:
 * - 1-corinthians (should have 16 chapters)
 * - 2-corinthians (should have 13 chapters)
 * - 1-john (should have 5 chapters)
 * - 1-peter (should have 5 chapters)
 * - 2-peter (should have 3 chapters)
 * - 1-timothy (should have 6 chapters)
 * - 2-timothy (should have 4 chapters)
 * - 1-thessalonians (should have 5 chapters)
 * - 2-thessalonians (should have 3 chapters)
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

const INCOMPLETE_BOOKS = [
  '1-corinthians',
  '2-corinthians',
  '1-john',
  '1-peter',
  '2-peter',
  '1-timothy',
  '2-timothy',
  '1-thessalonians',
  '2-thessalonians',
];

function normalizeBookName(bookSlug: string): string {
  const bookMap: Record<string, string> = {
    '1-corinthians': '1 Corinthians',
    '2-corinthians': '2 Corinthians',
    '1-john': '1 John',
    '2-john': '2 John',
    '3-john': '3 John',
    '1-peter': '1 Peter',
    '2-peter': '2 Peter',
    '1-timothy': '1 Timothy',
    '2-timothy': '2 Timothy',
    '1-thessalonians': '1 Thessalonians',
    '2-thessalonians': '2 Thessalonians',
  };
  
  return bookMap[bookSlug.toLowerCase()] || bookSlug;
}

function getTestament(book: string): 'OT' | 'NT' {
  // All incomplete books are NT
  return 'NT';
}

function parseTextFile(content: string, bookSlug: string, chapter: number): Verse[] {
  const verses: Verse[] = [];
  const lines = content.split('\n');
  
  let currentVerse: { num: number; text: string } | null = null;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    // Check if line is a verse number
    const verseMatch = line.match(/^([0-9\u06F0-\u06F9\u0660-\u0669]+)$/);
    if (verseMatch) {
      // Save previous verse if exists
      if (currentVerse && currentVerse.text.trim()) {
        const book = normalizeBookName(bookSlug);
        verses.push({
          book,
          chapter,
          verse: currentVerse.num,
          text: currentVerse.text.trim(),
          ref: `${book} ${chapter}:${currentVerse.num}`,
        });
      }
      
      // Parse verse number
      const verseNumStr = verseMatch[1];
      const verseNum = parseInt(verseNumStr.replace(/[\u06F0-\u06F9\u0660-\u0669]/g, (char) => {
        const map: Record<string, string> = {
          '\u0660': '0', '\u0661': '1', '\u0662': '2', '\u0663': '3', '\u0664': '4',
          '\u0665': '5', '\u0666': '6', '\u0667': '7', '\u0668': '8', '\u0669': '9',
          '\u06F0': '0', '\u06F1': '1', '\u06F2': '2', '\u06F3': '3', '\u06F4': '4',
          '\u06F5': '5', '\u06F6': '6', '\u06F7': '7', '\u06F8': '8', '\u06F9': '9',
        };
        return map[char] || char;
      }), 10);
      
      // Read next line as verse text
      const verseText = i + 1 < lines.length ? lines[i + 1].trim() : '';
      currentVerse = { num: verseNum, text: verseText };
      i++; // Skip next line since we consumed it
    } else if (currentVerse) {
      // Continue reading multi-line verse text
      currentVerse.text += ' ' + line;
    }
  }
  
  // Save last verse
  if (currentVerse && currentVerse.text.trim()) {
    const book = normalizeBookName(bookSlug);
    verses.push({
      book,
      chapter,
      verse: currentVerse.num,
      text: currentVerse.text.trim(),
      ref: `${book} ${chapter}:${currentVerse.num}`,
    });
  }
  
  return verses;
}

function getR2AudioKey(book: string, chapter: number, verse: number): string | null {
  // Normalize book name for R2 key
  const normalizeBookSlug = (book: string): string => {
    let cleaned = book.toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9]/g, '');
    const numberedMatch = cleaned.match(/^(\d+)([a-z]+)$/);
    if (numberedMatch) {
      const [, num, name] = numberedMatch;
      return `${name}${num}`;
    }
    return cleaned;
  };
  
  const bookSlug = normalizeBookSlug(book);
  const testament = getTestament(book);
  const chapterStr = chapter.toString().padStart(3, '0');
  const verseStr = verse.toString().padStart(3, '0');
  
  return `afghan2023/${testament}/${bookSlug}${chapterStr}_verse_${verseStr}.mp3`;
}

async function migrateIncompleteBooks(): Promise<void> {
  console.log('🔄 Re-migrating Incomplete Afghan 2023 NT Books\n');
  console.log('='.repeat(70));
  
  const ntDir = join(process.cwd(), 'all_txt_copies');
  const allVerses: Verse[] = [];
  
  // Process each incomplete book
  for (const bookSlug of INCOMPLETE_BOOKS) {
    console.log(`\n📖 Processing ${bookSlug}...`);
    
    // Find all chapter files for this book
    const files = await readdir(ntDir);
    const bookFiles = files
      .filter(f => f.startsWith(bookSlug) && f.endsWith('_pashto.txt'))
      .sort((a, b) => {
        // Extract chapter numbers
        const aMatch = a.match(new RegExp(`${bookSlug.replace(/-/g, '-')}(\\d+)_pashto\\.txt`));
        const bMatch = b.match(new RegExp(`${bookSlug.replace(/-/g, '-')}(\\d+)_pashto\\.txt`));
        const aCh = aMatch ? parseInt(aMatch[1]) : 0;
        const bCh = bMatch ? parseInt(bMatch[1]) : 0;
        return aCh - bCh;
      });
    
    console.log(`   Found ${bookFiles.length} chapter files`);
    
    for (const file of bookFiles) {
      const chapterMatch = file.match(new RegExp(`${bookSlug.replace(/-/g, '-')}(\\d+)_pashto\\.txt`));
      if (!chapterMatch) continue;
      
      const chapter = parseInt(chapterMatch[1]);
      const filePath = join(ntDir, file);
      
      try {
        const content = await readFile(filePath, 'utf-8');
        const verses = parseTextFile(content, bookSlug, chapter);
        
        console.log(`   Chapter ${chapter}: ${verses.length} verses`);
        allVerses.push(...verses);
      } catch (error: any) {
        console.error(`   ⚠️  Error reading ${file}: ${error.message}`);
      }
    }
  }
  
  console.log(`\n✅ Parsed ${allVerses.length} total verses`);
  
  // Delete existing verses for these books first
  console.log('\n🗑️  Deleting existing incomplete verses...');
  for (const bookSlug of INCOMPLETE_BOOKS) {
    const bookName = normalizeBookName(bookSlug);
    try {
      await execAsync(
        `npx wrangler d1 execute pashto-bible-db --remote --command="DELETE FROM verses_afghan2023 WHERE testament = 'NT' AND LOWER(REPLACE(book, ' ', '-')) = '${bookSlug}';"`
      );
      console.log(`   ✅ Deleted existing ${bookName} verses`);
    } catch (error: any) {
      console.log(`   ⚠️  Error deleting ${bookName}: ${error.message}`);
    }
  }
  
  // Insert new verses in batches
  console.log('\n💾 Inserting verses...');
  const batchSize = 100;
  let inserted = 0;
  
  for (let i = 0; i < allVerses.length; i += batchSize) {
    const batch = allVerses.slice(i, i + batchSize);
    
    const values = batch.map(v => {
      const audioR2Key = getR2AudioKey(v.book, v.chapter, v.verse);
      const testament = getTestament(v.book);
      const timestamp = Math.floor(Date.now() / 1000);
      const escape = (str: any) => str === null || str === undefined ? 'NULL' : `'${String(str).replace(/'/g, "''")}'`;
      
      return `(
        ${escape(v.ref)},
        ${escape(v.book)},
        ${v.chapter},
        ${v.verse},
        ${escape(v.text)},
        ${escape(null)},
        ${escape(null)},
        ${escape(testament)},
        'afghan2023',
        'afghan',
        '[]',
        ${escape(audioR2Key)},
        NULL,
        ${timestamp},
        ${timestamp}
      )`;
    });
    
    const insertSQL = `
INSERT OR REPLACE INTO verses_afghan2023
  (ref, book, chapter, verse, text, text_normalized, text_html, testament, translation_key, dialect, tags, audio_r2_key, audio_public_url, created_at, updated_at)
VALUES
${values.join(',\n')};
`;
    
    const fs = await import('fs/promises');
    const path = await import('path');
    const tempFile = path.join(process.cwd(), `.temp-remigrate-${i}.sql`);
    await fs.writeFile(tempFile, insertSQL, 'utf-8');
    
    try {
      await execAsync(
        `npx wrangler d1 execute pashto-bible-db --remote --file=${tempFile}`,
        { maxBuffer: 50 * 1024 * 1024, timeout: 120000 }
      );
      inserted += batch.length;
      process.stdout.write(`\r   Inserted ${inserted}/${allVerses.length} verses...`);
    } catch (error: any) {
      console.error(`\n   ⚠️  Error inserting batch ${i / batchSize + 1}: ${error.message}`);
    } finally {
      await fs.unlink(tempFile).catch(() => {});
    }
  }
  
  console.log(`\n✅ Inserted ${inserted} verses`);
  
  // Verify counts
  console.log('\n📊 Verifying counts...');
  const { stdout } = await execAsync(
    `npx wrangler d1 execute pashto-bible-db --remote --command="SELECT book, COUNT(DISTINCT chapter) as chapters, COUNT(*) as verses FROM verses_afghan2023 WHERE testament = 'NT' AND book IN ('1 Corinthians', '2 Corinthians', '1 John', '1 Peter', '2 Peter', '1 Timothy', '2 Timothy', '1 Thessalonians', '2 Thessalonians') GROUP BY book ORDER BY book;" --json`,
    { maxBuffer: 10 * 1024 * 1024 }
  );
  
  const result = JSON.parse(stdout);
  const data = Array.isArray(result) ? result[0] : result;
  const books = data.results || [];
  
  console.log('\n📚 Updated book counts:');
  for (const book of books) {
    console.log(`   ${book.book}: ${book.chapters} chapters, ${book.verses} verses`);
  }
  
  // Final NT total
  const { stdout: totalOut } = await execAsync(
    `npx wrangler d1 execute pashto-bible-db --remote --command="SELECT COUNT(*) as total FROM verses_afghan2023 WHERE testament = 'NT';" --json`,
    { maxBuffer: 10 * 1024 * 1024 }
  );
  
  const totalResult = JSON.parse(totalOut);
  const totalData = Array.isArray(totalResult) ? totalResult[0] : totalResult;
  const total = totalData.results?.[0]?.total || 0;
  
  console.log(`\n📊 Total Afghan 2023 NT verses: ${total} (expected 7,957)`);
  console.log(`   Difference: ${total - 7957}`);
}

if (require.main === module) {
  migrateIncompleteBooks()
    .then(() => {
      console.log('\n✅ Re-migration complete!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Error:', error);
      process.exit(1);
    });
}

export { migrateIncompleteBooks };

