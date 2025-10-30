/**
 * Clean up duplicate book names by deleting duplicates and keeping the primary variant
 * Handles ref conflicts by deleting duplicate verses
 */

import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

function normalizeBookName(book: string): string {
  // Remove all hyphens and normalize spaces
  let normalized = book.replace(/-/g, ' ').trim();
  
  // Title case: capitalize first letter of each word
  normalized = normalized.split(' ').map(word => {
    if (word.length === 0) return word;
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  }).join(' ');
  
  // Special handling for numbered books
  const numberedMatch = normalized.match(/^(\d+)\s+(.+)$/);
  if (numberedMatch) {
    const [, num, name] = numberedMatch;
    return `${num} ${name}`;
  }
  
  return normalized;
}

async function executeD1Sql(sql: string): Promise<void> {
  const fs = await import('fs/promises');
  const path = await import('path');
  const tempFile = path.join(process.cwd(), `.temp-cleanup-${Date.now()}.sql`);
  
  await fs.writeFile(tempFile, sql, 'utf-8');
  
  try {
    const { stdout, stderr } = await execAsync(
      `npx wrangler d1 execute pashto-bible-db --remote --file=${tempFile}`,
      { maxBuffer: 50 * 1024 * 1024, cwd: '/Users/jeremysamuels/Documents/pashto-bible-search' }
    );
    
    if (stderr && !stderr.includes('warning')) {
      console.error(`   ⚠️  ${stderr}`);
    }
  } catch (error: any) {
    console.error(`   ❌ Error: ${error.message}`);
    throw error;
  } finally {
    await fs.unlink(tempFile).catch(() => {});
  }
}

async function main() {
  console.log('🧹 Cleaning Up Duplicate Book Names\n');
  console.log('='.repeat(70));
  
  try {
    // Step 1: Get all unique book names
    const { stdout: booksRaw } = await execAsync(
      `npx wrangler d1 execute pashto-bible-db --remote --command="SELECT DISTINCT book, testament FROM verses WHERE translation_key = 'afghan2023' ORDER BY book;" --json`,
      { maxBuffer: 10 * 1024 * 1024, cwd: '/Users/jeremysamuels/Documents/pashto-bible-search' }
    );
    
    const booksResult = JSON.parse(booksRaw);
    const data = Array.isArray(booksResult) ? booksResult[0] : booksResult;
    const books = data.results || [];
    
    console.log(`\n📋 Found ${books.length} unique book names`);
    
    // Step 2: Group books by normalized name
    const bookGroups = new Map<string, Array<{book: string; testament: string}>>();
    
    for (const { book, testament } of books) {
      const normalized = normalizeBookName(book);
      if (!bookGroups.has(normalized)) {
        bookGroups.set(normalized, []);
      }
      bookGroups.get(normalized)!.push({ book, testament });
    }
    
    // Step 3: Find duplicates
    const duplicates: Array<{normalized: string; variants: Array<{book: string; testament: string}>}> = [];
    
    for (const [normalized, variants] of bookGroups.entries()) {
      if (variants.length > 1) {
        duplicates.push({ normalized, variants });
      }
    }
    
    console.log(`\n📊 Found ${duplicates.length} books with duplicate naming variants:`);
    duplicates.forEach(({ normalized, variants }) => {
      console.log(`   ${normalized}: ${variants.map(v => v.book).join(', ')}`);
    });
    
    if (duplicates.length === 0) {
      console.log('\n✅ No duplicates found!');
      return;
    }
    
    // Step 4: For each duplicate group, keep the one with most verses, delete others
    console.log('\n🗑️  Removing duplicate entries...');
    
    for (const { normalized, variants } of duplicates) {
      // Get verse counts for each variant
      const verseCounts = await Promise.all(
        variants.map(async ({ book, testament }) => {
          const { stdout } = await execAsync(
            `npx wrangler d1 execute pashto-bible-db --remote --command="SELECT COUNT(*) as count FROM verses WHERE translation_key = 'afghan2023' AND book = '${book.replace(/'/g, "''")}' AND testament = '${testament}';" --json`,
            { maxBuffer: 10 * 1024 * 1024, cwd: '/Users/jeremysamuels/Documents/pashto-bible-search' }
          );
          const result = JSON.parse(stdout);
          const data = Array.isArray(result) ? result[0] : result;
          return { book, testament, count: data.results?.[0]?.count || 0 };
        })
      );
      
      verseCounts.sort((a, b) => b.count - a.count);
      const primaryVariant = verseCounts[0];
      const duplicatesToDelete = verseCounts.slice(1);
      
      console.log(`   ${normalized}: Keeping "${primaryVariant.book}" (${primaryVariant.count} verses)`);
      
      // Update primary variant to normalized name (but don't update ref yet to avoid conflicts)
      if (primaryVariant.book !== normalized) {
        const updateSql = `
          UPDATE verses 
          SET book = '${normalized.replace(/'/g, "''")}',
              updated_at = strftime('%s', 'now')
          WHERE translation_key = 'afghan2023'
          AND book = '${primaryVariant.book.replace(/'/g, "''")}'
          AND testament = '${primaryVariant.testament}';
        `;
        
        await executeD1Sql(updateSql);
        console.log(`     ✅ Updated primary variant to "${normalized}"`);
      }
      
      // Delete duplicate variants BEFORE updating refs
      for (const { book, testament, count } of duplicatesToDelete) {
        console.log(`     🗑️  Deleting "${book}" (${count} verses)`);
        
        const deleteSql = `
          DELETE FROM verses
          WHERE translation_key = 'afghan2023'
          AND book = '${book.replace(/'/g, "''")}'
          AND testament = '${testament}';
        `;
        
        await executeD1Sql(deleteSql);
      }
    }
    
    // Step 5: Update all refs to use normalized book names
    console.log('\n📝 Updating refs...');
    
    const updateRefsSql = `
      UPDATE verses
      SET ref = book || ' ' || chapter || ':' || verse,
          updated_at = strftime('%s', 'now')
      WHERE translation_key = 'afghan2023'
      AND ref != (book || ' ' || chapter || ':' || verse);
    `;
    
    await executeD1Sql(updateRefsSql);
    console.log('   ✅ Updated all refs');
    
    // Final summary
    const { stdout: finalRaw } = await execAsync(
      `npx wrangler d1 execute pashto-bible-db --remote --command="SELECT translation_key, testament, COUNT(DISTINCT book) as book_count, COUNT(*) as verse_count FROM verses WHERE translation_key = 'afghan2023' GROUP BY translation_key, testament ORDER BY testament;" --json`,
      { maxBuffer: 10 * 1024 * 1024, cwd: '/Users/jeremysamuels/Documents/pashto-bible-search' }
    );
    
    const finalResult = JSON.parse(finalRaw);
    const finalData = Array.isArray(finalResult) ? finalResult[0] : finalResult;
    
    console.log('\n📊 Final counts:');
    if (finalData.results) {
      finalData.results.forEach((row: any) => {
        console.log(`   ${row.testament}: ${row.verse_count.toLocaleString()} verses, ${row.book_count} unique books`);
      });
    }
    
    console.log('\n✅ Cleanup complete!');
    
  } catch (error: any) {
    console.error(`\n❌ Error: ${error.message}`);
    process.exit(1);
  }
}

main().catch(console.error);

