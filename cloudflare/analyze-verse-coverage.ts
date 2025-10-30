/**
 * Analyze verse coverage and identify missing books
 */

import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

const EXPECTED_NT_BOOKS = [
  'Matthew', 'Mark', 'Luke', 'John', 'Acts', 'Romans', '1 Corinthians', '2 Corinthians',
  'Galatians', 'Ephesians', 'Philippians', 'Colossians', '1 Thessalonians', '2 Thessalonians',
  '1 Timothy', '2 Timothy', 'Titus', 'Philemon', 'Hebrews', 'James', '1 Peter', '2 Peter',
  '1 John', '2 John', '3 John', 'Jude', 'Revelation'
];

const EXPECTED_OT_BOOKS = [
  'Genesis', 'Exodus', 'Leviticus', 'Numbers', 'Deuteronomy', 'Joshua', 'Judges', 'Ruth',
  '1 Samuel', '2 Samuel', '1 Kings', '2 Kings', '1 Chronicles', '2 Chronicles', 'Ezra', 'Nehemiah',
  'Esther', 'Job', 'Psalms', 'Proverbs', 'Ecclesiastes', 'Song of Solomon', 'Isaiah', 'Jeremiah',
  'Lamentations', 'Ezekiel', 'Daniel', 'Hosea', 'Joel', 'Amos', 'Obadiah', 'Jonah', 'Micah',
  'Nahum', 'Habakkuk', 'Zephaniah', 'Haggai', 'Zechariah', 'Malachi'
];

function normalizeBookName(book: string): string {
  // Normalize variations
  const normalized = book
    .replace(/^(\d+)([a-z]+)$/i, '$1 $2') // "1chronicles" -> "1 Chronicles"
    .replace(/^([a-z]+)(\d+)$/i, '$1 $2') // "chronicles1" -> "Chronicles 1"
    .replace(/^(\d+)\s*([a-z]+)$/i, '$1 $2') // "1 chronicles" -> "1 Chronicles"
    .replace(/\b(\w)/g, (m) => m.toUpperCase()); // Title case
  
  // Map common variations
  const mappings: Record<string, string> = {
    '1chronicles': '1 Chronicles',
    '2chronicles': '2 Chronicles',
    '1kings': '1 Kings',
    '2kings': '2 Kings',
    '1samuel': '1 Samuel',
    '2samuel': '2 Samuel',
    'Song of Songs': 'Song of Solomon',
    'songofsongs': 'Song of Solomon',
    'song-of-songs': 'Song of Solomon',
  };
  
  return mappings[book.toLowerCase()] || normalized;
}

async function getActualBooks(translation: string, testament: string): Promise<Set<string>> {
  const { stdout } = await execAsync(
    `npx wrangler d1 execute pashto-bible-db --remote --command="SELECT DISTINCT book FROM verses WHERE translation_key = '${translation}' AND testament = '${testament}' ORDER BY book;" --json`,
    { maxBuffer: 10 * 1024 * 1024, cwd: '/Users/jeremysamuels/Documents/pashto-bible-search' }
  );
  
  const result = JSON.parse(stdout);
  const data = Array.isArray(result) ? result[0] : result;
  const books = new Set<string>();
  
  if (data.results) {
    for (const row of data.results) {
      const normalized = normalizeBookName(row.book);
      books.add(normalized);
    }
  }
  
  return books;
}

async function getBookCounts(translation: string, testament: string): Promise<Map<string, number>> {
  const { stdout } = await execAsync(
    `npx wrangler d1 execute pashto-bible-db --remote --command="SELECT book, COUNT(*) as count FROM verses WHERE translation_key = '${translation}' AND testament = '${testament}' GROUP BY book ORDER BY book;" --json`,
    { maxBuffer: 10 * 1024 * 1024, cwd: '/Users/jeremysamuels/Documents/pashto-bible-search' }
  );
  
  const result = JSON.parse(stdout);
  const data = Array.isArray(result) ? result[0] : result;
  const counts = new Map<string, number>();
  
  if (data.results) {
    for (const row of data.results) {
      const normalized = normalizeBookName(row.book);
      counts.set(normalized, (counts.get(normalized) || 0) + row.count);
    }
  }
  
  return counts;
}

async function main() {
  console.log('📊 Analyzing Verse Coverage\n');
  console.log('='.repeat(70));
  
  try {
    // Afghan 2023 analysis
    console.log('\n📖 Afghan 2023 Analysis:\n');
    
    const afghanNTBooks = await getActualBooks('afghan2023', 'NT');
    const afghanOTBooks = await getActualBooks('afghan2023', 'OT');
    const afghanNTCounts = await getBookCounts('afghan2023', 'NT');
    const afghanOTCounts = await getBookCounts('afghan2023', 'OT');
    
    console.log(`New Testament:`);
    console.log(`   Expected: ${EXPECTED_NT_BOOKS.length} books`);
    console.log(`   Actual: ${afghanNTBooks.size} unique books`);
    console.log(`   Missing: ${EXPECTED_NT_BOOKS.filter(b => !afghanNTBooks.has(b)).length} books`);
    
    const missingNT = EXPECTED_NT_BOOKS.filter(b => !afghanNTBooks.has(b));
    if (missingNT.length > 0) {
      console.log(`   ⚠️  Missing books: ${missingNT.join(', ')}`);
    }
    
    if (afghanNTCounts.size > 0) {
      console.log(`\n   Books present:`);
      Array.from(afghanNTCounts.entries()).forEach(([book, count]) => {
        console.log(`     - ${book}: ${count} verses`);
      });
    }
    
    console.log(`\nOld Testament:`);
    console.log(`   Expected: ${EXPECTED_OT_BOOKS.length} books`);
    console.log(`   Actual: ${afghanOTBooks.size} unique books`);
    
    // OT books that might be missing (Song of Solomon, Job mentioned by user)
    const missingOT = EXPECTED_OT_BOOKS.filter(b => !afghanOTBooks.has(b));
    if (missingOT.length > 0) {
      console.log(`   Missing: ${missingOT.join(', ')}`);
    } else {
      console.log(`   ✅ All expected OT books present`);
    }
    
    // Yousafzai 2019 analysis
    console.log('\n📖 Yousafzai 2019 Analysis:\n');
    
    const yousafzaiNTBooks = await getActualBooks('yousafzai2019', 'NT');
    const yousafzaiOTBooks = await getActualBooks('yousafzai2019', 'OT');
    
    console.log(`New Testament:`);
    console.log(`   Expected: ${EXPECTED_NT_BOOKS.length} books`);
    console.log(`   Actual: ${yousafzaiNTBooks.size} unique books`);
    const missingYousafzaiNT = EXPECTED_NT_BOOKS.filter(b => !yousafzaiNTBooks.has(b));
    if (missingYousafzaiNT.length > 0) {
      console.log(`   ⚠️  Missing: ${missingYousafzaiNT.join(', ')}`);
    }
    
    console.log(`\nOld Testament:`);
    console.log(`   Expected: ${EXPECTED_OT_BOOKS.length} books`);
    console.log(`   Actual: ${yousafzaiOTBooks.size} unique books`);
    const missingYousafzaiOT = EXPECTED_OT_BOOKS.filter(b => !yousafzaiOTBooks.has(b));
    if (missingYousafzaiOT.length > 0) {
      console.log(`   ⚠️  Missing: ${missingYousafzaiOT.join(', ')}`);
    }
    
    // Summary
    console.log('\n' + '='.repeat(70));
    console.log('\n📋 Summary & Recommendations:\n');
    
    console.log('❌ Issues Found:');
    if (afghanNTBooks.size < EXPECTED_NT_BOOKS.length) {
      console.log(`   1. Afghan 2023 NT: Only ${afghanNTBooks.size}/${EXPECTED_NT_BOOKS.length} books`);
      console.log(`      Missing: ${missingNT.join(', ')}`);
    }
    
    if (afghanOTBooks.size < EXPECTED_OT_BOOKS.length) {
      console.log(`   2. Afghan 2023 OT: Only ${afghanOTBooks.size}/${EXPECTED_OT_BOOKS.length} books`);
      console.log(`      Missing: ${missingOT.join(', ')}`);
    }
    
    console.log('\n💡 Next Steps:');
    console.log('   1. Fix Afghan 2023 NT - migrate missing books');
    console.log('   2. Fix Afghan 2023 OT - migrate missing books if available');
    console.log('   3. Normalize book names (fix duplicates like "1 Chronicles" vs "1chronicles")');
    
  } catch (error: any) {
    console.error(`\n❌ Error: ${error.message}`);
    process.exit(1);
  }
}

main().catch(console.error);

