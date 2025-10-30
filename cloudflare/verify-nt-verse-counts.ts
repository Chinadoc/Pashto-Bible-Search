/**
 * Verify New Testament Verse Counts
 * 
 * Expected: 7,957 verses in NT (KJV standard)
 * Check if all books have correct chapter/verse counts
 */

import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

// Expected NT verse counts (KJV standard)
const EXPECTED_NT_VERSES: Record<string, number> = {
  'Matthew': 1071,
  'Mark': 678,
  'Luke': 1151,
  'John': 879,
  'Acts': 1007,
  'Romans': 433,
  '1 Corinthians': 437,
  '2 Corinthians': 257,
  'Galatians': 149,
  'Ephesians': 155,
  'Philippians': 104,
  'Colossians': 95,
  '1 Thessalonians': 89,
  '2 Thessalonians': 47,
  '1 Timothy': 113,
  '2 Timothy': 83,
  'Titus': 46,
  'Philemon': 25,
  'Hebrews': 303,
  'James': 108,
  '1 Peter': 105,
  '2 Peter': 61,
  '1 John': 105,
  '2 John': 13,
  '3 John': 14,
  'Jude': 25,
  'Revelation': 404,
};

const EXPECTED_TOTAL_NT = 7957;

async function verifyNTVerses(): Promise<void> {
  console.log('📖 Verifying New Testament Verse Counts\n');
  console.log('='.repeat(70));
  console.log(`Expected total: ${EXPECTED_TOTAL_NT} verses (KJV standard)\n`);
  
  // Check Afghan 2023
  console.log('📚 Afghan 2023 NT:');
  const { stdout: afghanNT } = await execAsync(
    `npx wrangler d1 execute pashto-bible-db --remote --command="SELECT book, COUNT(DISTINCT chapter) as chapters, COUNT(*) as verses FROM verses_afghan2023 WHERE testament = 'NT' GROUP BY book ORDER BY MIN(id);" --json`,
    { maxBuffer: 10 * 1024 * 1024 }
  );
  
  const afghanResult = JSON.parse(afghanNT);
  const afghanData = Array.isArray(afghanResult) ? afghanResult[0] : afghanResult;
  const afghanBooks = afghanData.results || [];
  
  let afghanTotal = 0;
  const afghanIssues: string[] = [];
  
  for (const book of afghanBooks) {
    const bookName = book.book;
    const normalizedName = bookName.charAt(0).toUpperCase() + bookName.slice(1).toLowerCase();
    const expected = EXPECTED_NT_VERSES[normalizedName] || EXPECTED_NT_VERSES[bookName];
    const actual = book.verses;
    const chapters = book.chapters;
    
    afghanTotal += actual;
    
    if (expected) {
      const diff = actual - expected;
      const status = diff === 0 ? '✅' : diff > 0 ? '⚠️' : '❌';
      if (diff !== 0) {
        afghanIssues.push(`${status} ${bookName}: ${actual} verses (expected ${expected}, diff: ${diff}), ${chapters} chapters`);
      } else {
        console.log(`   ✅ ${bookName}: ${actual} verses, ${chapters} chapters`);
      }
    } else {
      console.log(`   ❓ ${bookName}: ${actual} verses, ${chapters} chapters (unknown expected count)`);
    }
  }
  
  if (afghanIssues.length > 0) {
    console.log('\n⚠️  Issues found:');
    afghanIssues.forEach(issue => console.log(`   ${issue}`));
  }
  
  console.log(`\n   Total: ${afghanTotal} verses (expected ${EXPECTED_TOTAL_NT}, diff: ${afghanTotal - EXPECTED_TOTAL_NT})`);
  
  // Check Yousafzai 2019
  console.log('\n📚 Yousafzai 2019 NT:');
  const { stdout: yousafzaiNT } = await execAsync(
    `npx wrangler d1 execute pashto-bible-db --remote --command="SELECT book, COUNT(DISTINCT chapter) as chapters, COUNT(*) as verses FROM verses_yousafzai WHERE testament = 'NT' GROUP BY book ORDER BY MIN(id);" --json`,
    { maxBuffer: 10 * 1024 * 1024 }
  );
  
  const yousafzaiResult = JSON.parse(yousafzaiNT);
  const yousafzaiData = Array.isArray(yousafzaiResult) ? yousafzaiResult[0] : yousafzaiResult;
  const yousafzaiBooks = yousafzaiData.results || [];
  
  let yousafzaiTotal = 0;
  const yousafzaiIssues: string[] = [];
  
  for (const book of yousafzaiBooks) {
    const bookName = book.book;
    const normalizedName = bookName.charAt(0).toUpperCase() + bookName.slice(1).toLowerCase();
    const expected = EXPECTED_NT_VERSES[normalizedName] || EXPECTED_NT_VERSES[bookName];
    const actual = book.verses;
    const chapters = book.chapters;
    
    yousafzaiTotal += actual;
    
    if (expected) {
      const diff = actual - expected;
      const status = diff === 0 ? '✅' : diff > 0 ? '⚠️' : '❌';
      if (diff !== 0) {
        yousafzaiIssues.push(`${status} ${bookName}: ${actual} verses (expected ${expected}, diff: ${diff}), ${chapters} chapters`);
      } else {
        console.log(`   ✅ ${bookName}: ${actual} verses, ${chapters} chapters`);
      }
    } else {
      console.log(`   ❓ ${bookName}: ${actual} verses, ${chapters} chapters (unknown expected count)`);
    }
  }
  
  if (yousafzaiIssues.length > 0) {
    console.log('\n⚠️  Issues found:');
    yousafzaiIssues.forEach(issue => console.log(`   ${issue}`));
  }
  
  console.log(`\n   Total: ${yousafzaiTotal} verses (expected ${EXPECTED_TOTAL_NT}, diff: ${yousafzaiTotal - EXPECTED_TOTAL_NT})`);
  
  // Summary
  console.log('\n' + '='.repeat(70));
  console.log('📊 Summary:');
  console.log(`   Afghan 2023 NT: ${afghanTotal} verses (${afghanTotal - EXPECTED_TOTAL_NT > 0 ? '+' : ''}${afghanTotal - EXPECTED_TOTAL_NT})`);
  console.log(`   Yousafzai 2019 NT: ${yousafzaiTotal} verses (${yousafzaiTotal - EXPECTED_TOTAL_NT > 0 ? '+' : ''}${yousafzaiTotal - EXPECTED_TOTAL_NT})`);
  console.log(`   Expected: ${EXPECTED_TOTAL_NT} verses`);
  
  if (afghanTotal !== EXPECTED_TOTAL_NT || yousafzaiTotal !== EXPECTED_TOTAL_NT) {
    console.log('\n⚠️  WARNING: Verse counts do not match expected values!');
    console.log('   Possible causes:');
    console.log('   - Missing verses');
    console.log('   - Duplicate verses');
    console.log('   - Incorrect verse numbering');
    console.log('   - Translation differences');
  } else {
    console.log('\n✅ All verse counts match expected values!');
  }
}

if (require.main === module) {
  verifyNTVerses()
    .then(() => {
      console.log('\n✅ Verification complete!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Error:', error);
      process.exit(1);
    });
}

export { verifyNTVerses };

