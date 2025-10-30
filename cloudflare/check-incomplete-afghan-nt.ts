/**
 * Fix Afghan 2023 NT Missing Chapters
 * 
 * The scraper only captured chapter 1 for many NT books.
 * Need to re-scrape these books with all chapters.
 */

import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

// Books that only have chapter 1 (need re-scraping)
const INCOMPLETE_BOOKS = [
  '1-corinthians',  // Should have 16 chapters
  '2-corinthians', // Should have 13 chapters
  '1-john',        // Should have 5 chapters
  '2-john',        // Should have 1 chapter (OK)
  '3-john',        // Should have 1 chapter (OK)
  '1-peter',       // Should have 5 chapters
  '2-peter',       // Should have 3 chapters
  '1-timothy',     // Should have 6 chapters
  '2-timothy',     // Should have 4 chapters
  '1-thessalonians', // Should have 5 chapters
  '2-thessalonians', // Should have 3 chapters
];

async function checkIncompleteBooks(): Promise<void> {
  console.log('🔍 Checking Incomplete Afghan 2023 NT Books\n');
  console.log('='.repeat(70));
  
  for (const bookSlug of INCOMPLETE_BOOKS) {
    const bookName = bookSlug.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
    
    const { stdout } = await execAsync(
      `npx wrangler d1 execute pashto-bible-db --remote --command="SELECT COUNT(DISTINCT chapter) as chapters, COUNT(*) as verses FROM verses_afghan2023 WHERE testament = 'NT' AND LOWER(REPLACE(book, ' ', '-')) = '${bookSlug}' GROUP BY book;" --json`,
      { maxBuffer: 10 * 1024 * 1024 }
    );
    
    const result = JSON.parse(stdout);
    const data = Array.isArray(result) ? result[0] : result;
    const bookData = data.results?.[0];
    
    if (bookData) {
      const chapters = bookData.chapters;
      const verses = bookData.verses;
      
      // Expected chapter counts
      const expectedChapters: Record<string, number> = {
        '1-corinthians': 16,
        '2-corinthians': 13,
        '1-john': 5,
        '2-john': 1,
        '3-john': 1,
        '1-peter': 5,
        '2-peter': 3,
        '1-timothy': 6,
        '2-timothy': 4,
        '1-thessalonians': 5,
        '2-thessalonians': 3,
      };
      
      const expected = expectedChapters[bookSlug] || 0;
      const status = chapters === expected ? '✅' : chapters === 1 && expected > 1 ? '❌' : '⚠️';
      
      console.log(`${status} ${bookName}: ${chapters} chapters, ${verses} verses (expected ${expected} chapters)`);
    } else {
      console.log(`❓ ${bookName}: Not found in database`);
    }
  }
  
  console.log('\n' + '='.repeat(70));
  console.log('📋 Action Required:');
  console.log('   1. Re-scrape incomplete books from afghanbibles.org');
  console.log('   2. Re-migrate scraped text to verses_afghan2023 table');
  console.log('   3. Verify all 7,957 NT verses are present');
}

if (require.main === module) {
  checkIncompleteBooks()
    .then(() => {
      console.log('\n✅ Check complete!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Error:', error);
      process.exit(1);
    });
}

export { checkIncompleteBooks };

