/**
 * Fix misclassified Afghan 2023 NT books
 * Some OT books and lowercase entries got classified as NT
 */

import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function executeD1Sql(sql: string): Promise<string> {
  try {
    const { stdout } = await execAsync(
      `npx wrangler d1 execute pashto-bible-db --remote --command="${sql.replace(/"/g, '\\"')}"`,
      { maxBuffer: 50 * 1024 * 1024, timeout: 120000 }
    );
    return stdout;
  } catch (error: any) {
    throw new Error(`D1 SQL Error: ${error.message}`);
  }
}

async function fixMisclassifiedBooks(): Promise<void> {
  console.log('🔧 Fixing Misclassified Afghan 2023 Books\n');
  console.log('='.repeat(70));
  
  // Books that are misclassified as NT but should be OT
  const otBooks = ['2 Chronicles', '2 Kings', '2 Samuel', 'Song of Solomon'];
  const fixes = [
    { wrong: '2 Chronicles', correct: '2 Chronicles', testament: 'OT' },
    { wrong: '2 Kings', correct: '2 Kings', testament: 'OT' },
    { wrong: '2 Samuel', correct: '2 Samuel', testament: 'OT' },
    { wrong: 'Song of solomon', correct: 'Song of Solomon', testament: 'OT' },
    { wrong: '2 john', correct: '2 John', testament: 'NT' },
    { wrong: '3 john', correct: '3 John', testament: 'NT' },
  ];
  
  for (const fix of fixes) {
    console.log(`\n📖 Fixing ${fix.wrong} → ${fix.correct} (${fix.testament})`);
    
    const updateSQL = `
UPDATE verses_afghan2023 
SET book = '${fix.correct}', testament = '${fix.testament}'
WHERE LOWER(book) = '${fix.wrong.toLowerCase()}' AND book != '${fix.correct}';
`;
    
    try {
      await executeD1Sql(updateSQL);
      console.log(`   ✅ Updated`);
    } catch (error: any) {
      console.error(`   ⚠️  Error: ${error.message}`);
    }
  }
  
  // Verify the fix
  console.log('\n📊 Verifying fixes...');
  const { stdout } = await execAsync(
    `npx wrangler d1 execute pashto-bible-db --remote --command="SELECT testament, COUNT(*) as count FROM verses_afghan2023 GROUP BY testament ORDER BY testament;" --json`,
    { maxBuffer: 10 * 1024 * 1024 }
  );
  
  const result = JSON.parse(stdout);
  const data = Array.isArray(result) ? result[0] : result;
  const stats = data.results || [];
  
  console.log('\n📊 Afghan 2023 Total (after fix):');
  for (const row of stats) {
    console.log(`   ${row.testament}: ${row.count.toLocaleString()} verses`);
  }
  
  const total = stats.reduce((sum: number, row: any) => sum + row.count, 0);
  console.log(`   Total: ${total.toLocaleString()} verses`);
  
  // Check specific misclassified books
  console.log('\n✅ Checking fixed books:');
  const { stdout: bookCheck } = await execAsync(
    `npx wrangler d1 execute pashto-bible-db --remote --command="SELECT testament, book, COUNT(*) as count FROM verses_afghan2023 WHERE book IN ('2 Chronicles', '2 Kings', '2 Samuel', 'Song of Solomon', '2 John', '3 John') GROUP BY testament, book;" --json`,
    { maxBuffer: 10 * 1024 * 1024 }
  );
  
  const bookResult = JSON.parse(bookCheck);
  const bookData = Array.isArray(bookResult) ? bookResult[0] : bookResult;
  const books = bookData.results || [];
  
  if (books.length === 0) {
    console.log('   ✅ No more misclassified books found!');
  } else {
    for (const book of books) {
      console.log(`   ${book.testament}: ${book.book} - ${book.count} verses`);
    }
  }
}

if (require.main === module) {
  fixMisclassifiedBooks()
    .then(() => {
      console.log('\n✅ Fix complete!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Error:', error);
      process.exit(1);
    });
}

export { fixMisclassifiedBooks };
