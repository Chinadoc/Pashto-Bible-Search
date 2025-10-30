/**
 * Fix duplicate book names by merging them into a single normalized name
 * Handles refs carefully to avoid unique constraint violations
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
  const tempFile = path.join(process.cwd(), `.temp-normalize-${Date.now()}.sql`);
  
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
  console.log('🔧 Normalizing Book Names\n');
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
    
    console.log(`\n📋 Found ${books.length} unique book names (before normalization)`);
    
    // Step 2: Group books by normalized name
    const bookGroups = new Map<string, string[]>();
    
    for (const { book } of books) {
      const normalized = normalizeBookName(book);
      if (!bookGroups.has(normalized)) {
        bookGroups.set(normalized, []);
      }
      bookGroups.get(normalized)!.push(book);
    }
    
    // Step 3: Find duplicates
    const duplicates: Array<{normalized: string; variants: string[]}> = [];
    
    for (const [normalized, variants] of bookGroups.entries()) {
      if (variants.length > 1) {
        duplicates.push({ normalized, variants });
      }
    }
    
    console.log(`\n📊 Found ${duplicates.length} books with duplicate naming variants:`);
    duplicates.forEach(({ normalized, variants }) => {
      console.log(`   ${normalized}: ${variants.join(', ')}`);
    });
    
    if (duplicates.length === 0) {
      console.log('\n✅ No duplicates found!');
      return;
    }
    
    // Step 4: Merge duplicates
    console.log('\n📝 Merging duplicates...');
    
    for (const { normalized, variants } of duplicates) {
      // Sort variants by verse count (keep the one with most verses)
      const verseCounts = await Promise.all(
        variants.map(async (variant) => {
          const { stdout } = await execAsync(
            `npx wrangler d1 execute pashto-bible-db --remote --command="SELECT COUNT(*) as count FROM verses WHERE translation_key = 'afghan2023' AND book = '${variant.replace(/'/g, "''")}';" --json`,
            { maxBuffer: 10 * 1024 * 1024, cwd: '/Users/jeremysamuels/Documents/pashto-bible-search' }
          );
          const result = JSON.parse(stdout);
          const data = Array.isArray(result) ? result[0] : result;
          return { variant, count: data.results?.[0]?.count || 0 };
        })
      );
      
      verseCounts.sort((a, b) => b.count - a.count);
      const primaryVariant = verseCounts[0].variant;
      
      console.log(`   Merging ${variants.join(', ')} → ${normalized} (using ${primaryVariant} as primary)`);
      
      // Update all variants to normalized name, but handle ref conflicts
      for (const variant of variants) {
        if (variant === normalized) continue; // Already correct
        
        // Update book name and ref in batches
        const batchSize = 100;
        let offset = 0;
        let hasMore = true;
        
        while (hasMore) {
          const { stdout } = await execAsync(
            `npx wrangler d1 execute pashto-bible-db --remote --command="SELECT id, ref, book, chapter, verse FROM verses WHERE translation_key = 'afghan2023' AND book = '${variant.replace(/'/g, "''")}' LIMIT ${batchSize} OFFSET ${offset};" --json`,
            { maxBuffer: 10 * 1024 * 1024, cwd: '/Users/jeremysamuels/Documents/pashto-bible-search' }
          );
          
          const result = JSON.parse(stdout);
          const verseData = Array.isArray(result) ? result[0] : result;
          const verses = verseData.results || [];
          
          if (verses.length === 0) {
            hasMore = false;
            break;
          }
          
          // Update each verse
          const updates = verses.map((verse: any) => {
            const escape = (str: string) => str.replace(/'/g, "''");
            const newRef = `${normalized} ${verse.chapter}:${verse.verse}`;
            
            return `UPDATE verses SET book = '${escape(normalized)}', ref = '${escape(newRef)}', updated_at = strftime('%s', 'now') WHERE id = ${verse.id};`;
          });
          
          const sql = updates.join('\n');
          
          try {
            await executeD1Sql(sql);
          } catch (error: any) {
            // If unique constraint violation, skip duplicates
            if (error.message.includes('UNIQUE constraint')) {
              console.log(`     ⚠️  Skipping duplicate refs for ${variant}`);
            } else {
              throw error;
            }
          }
          
          offset += batchSize;
          
          if (verses.length < batchSize) {
            hasMore = false;
          }
        }
      }
    }
    
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
    
    console.log('\n✅ Normalization complete!');
    
  } catch (error: any) {
    console.error(`\n❌ Error: ${error.message}`);
    process.exit(1);
  }
}

main().catch(console.error);

