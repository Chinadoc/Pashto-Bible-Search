/**
 * Fix testament classifications and normalize book names for Afghan 2023 verses
 * Handles duplicates by merging/deduplicating before normalization
 */

import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

function normalizeBookName(bookSlug: string): string {
  const numberedMatch = bookSlug.match(/^(\d+)([a-z]+)$/i);
  if (numberedMatch) {
    const [, num, name] = numberedMatch;
    const normalizedName = normalizeBookName(name);
    return `${num} ${normalizedName}`;
  }
  
  const bookMap: Record<string, string> = {
    'genesis': 'Genesis', 'exodus': 'Exodus', 'leviticus': 'Leviticus', 'numbers': 'Numbers',
    'deuteronomy': 'Deuteronomy', 'joshua': 'Joshua', 'judges': 'Judges', 'ruth': 'Ruth',
    'samuel': 'Samuel', 'kings': 'Kings', 'chronicles': 'Chronicles',
    'ezra': 'Ezra', 'nehemiah': 'Nehemiah', 'esther': 'Esther', 'job': 'Job',
    'psalms': 'Psalms', 'proverbs': 'Proverbs', 'ecclesiastes': 'Ecclesiastes',
    'song-of-songs': 'Song of Solomon', 'songofsongs': 'Song of Solomon',
    'isaiah': 'Isaiah', 'jeremiah': 'Jeremiah', 'lamentations': 'Lamentations',
    'ezekiel': 'Ezekiel', 'daniel': 'Daniel', 'hosea': 'Hosea', 'joel': 'Joel',
    'amos': 'Amos', 'obadiah': 'Obadiah', 'jonah': 'Jonah', 'micah': 'Micah',
    'nahum': 'Nahum', 'habakkuk': 'Habakkuk', 'zephaniah': 'Zephaniah',
    'haggai': 'Haggai', 'zechariah': 'Zechariah', 'malachi': 'Malachi',
  };
  
  const lower = bookSlug.toLowerCase().replace(/-/g, '').trim();
  return bookMap[lower] || bookSlug.charAt(0).toUpperCase() + bookSlug.slice(1).toLowerCase();
}

function getTestament(book: string): 'OT' | 'NT' {
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
  return 'NT';
}

async function executeD1Sql(sql: string): Promise<void> {
  const fs = await import('fs/promises');
  const path = await import('path');
  const tempFile = path.join(process.cwd(), `.temp-fix-${Date.now()}.sql`);
  
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
  console.log('🔧 Fixing Testament Classifications & Book Names\n');
  console.log('='.repeat(70));
  
  try {
    // Step 1: Delete duplicate rows (keep the properly formatted ones)
    console.log('\n📋 Step 1: Removing duplicate entries...');
    
    // Find duplicates where normalized book names would conflict
    const { stdout: duplicatesRaw } = await execAsync(
      `npx wrangler d1 execute pashto-bible-db --remote --command="
        SELECT 
          CASE 
            WHEN book LIKE '1chronicles' OR book LIKE '1 Chronicles' THEN '1 Chronicles'
            WHEN book LIKE '1kings' OR book LIKE '1 Kings' THEN '1 Kings'
            WHEN book LIKE '2chronicles' OR book LIKE '2 Chronicles' THEN '2 Chronicles'
            WHEN book LIKE '2kings' OR book LIKE '2 Kings' THEN '2 Kings'
            WHEN book LIKE '1samuel' OR book LIKE '1 Samuel' THEN '1 Samuel'
            WHEN book LIKE '2samuel' OR book LIKE '2 Samuel' THEN '2 Samuel'
            ELSE book
          END as normalized_book,
          chapter,
          verse,
          COUNT(*) as count
        FROM verses 
        WHERE translation_key = 'afghan2023'
        GROUP BY normalized_book, chapter, verse
        HAVING COUNT(*) > 1;
      " --json`,
      { maxBuffer: 50 * 1024 * 1024, cwd: '/Users/jeremysamuels/Documents/pashto-bible-search' }
    );
    
    // Delete duplicates - keep the properly formatted ones (with spaces)
    const deleteDuplicatesSQL = `
      DELETE FROM verses 
      WHERE translation_key = 'afghan2023'
      AND id IN (
        SELECT id FROM verses v1
        WHERE translation_key = 'afghan2023'
        AND (
          book = '1chronicles' OR book = '1kings' OR book = '2chronicles' OR book = '2kings' OR
          book = '1samuel' OR book = '2samuel'
        )
        AND EXISTS (
          SELECT 1 FROM verses v2
          WHERE v2.translation_key = 'afghan2023'
          AND (
            (v1.book = '1chronicles' AND v2.book = '1 Chronicles') OR
            (v1.book = '1kings' AND v2.book = '1 Kings') OR
            (v1.book = '2chronicles' AND v2.book = '2 Chronicles') OR
            (v1.book = '2kings' AND v2.book = '2 Kings') OR
            (v1.book = '1samuel' AND v2.book = '1 Samuel') OR
            (v1.book = '2samuel' AND v2.book = '2 Samuel')
          )
          AND v2.chapter = v1.chapter
          AND v2.verse = v1.verse
        )
      );
    `;
    
    await executeD1Sql(deleteDuplicatesSQL);
    console.log('   ✅ Removed duplicate entries');
    
    // Step 2: Fix book names and testament classifications
    console.log('\n📋 Step 2: Fixing book names and testament classifications...');
    
    const { stdout: versesRaw } = await execAsync(
      `npx wrangler d1 execute pashto-bible-db --remote --command="SELECT id, ref, book, testament FROM verses WHERE translation_key = 'afghan2023' ORDER BY book, chapter, verse;" --json`,
      { maxBuffer: 50 * 1024 * 1024, cwd: '/Users/jeremysamuels/Documents/pashto-bible-search' }
    );
    
    const versesResult = JSON.parse(versesRaw);
    const data = Array.isArray(versesResult) ? versesResult[0] : versesResult;
    const verses = data.results || [];
    
    console.log(`   Found ${verses.length} Afghan 2023 verses`);
    
    const fixes: Array<{id: number; oldBook: string; newBook: string; oldTestament: string; newTestament: string}> = [];
    
    for (const verse of verses) {
      const normalizedBook = normalizeBookName(verse.book);
      const correctTestament = getTestament(verse.book);
      
      if (normalizedBook !== verse.book || correctTestament !== verse.testament) {
        fixes.push({
          id: verse.id,
          oldBook: verse.book,
          newBook: normalizedBook,
          oldTestament: verse.testament,
          newTestament: correctTestament
        });
      }
    }
    
    console.log(`   Found ${fixes.length} verses needing fixes`);
    
    if (fixes.length === 0) {
      console.log('\n✅ No fixes needed!');
      return;
    }
    
    // Step 3: Apply fixes in batches
    console.log('\n📝 Step 3: Applying fixes...');
    
    const batchSize = 100;
    const batches: Array<typeof fixes> = [];
    
    for (let i = 0; i < fixes.length; i += batchSize) {
      batches.push(fixes.slice(i, i + batchSize));
    }
    
    console.log(`   Processing ${batches.length} batches...`);
    
    for (let i = 0; i < batches.length; i++) {
      const batch = batches[i];
      const updates = batch.map(fix => {
        const escape = (str: string) => str.replace(/'/g, "''");
        return `UPDATE verses SET book = '${escape(fix.newBook)}', testament = '${fix.newTestament}', updated_at = strftime('%s', 'now') WHERE id = ${fix.id};`;
      });
      
      const sql = updates.join('\n');
      await executeD1Sql(sql);
      process.stdout.write(`\r   Fixed batch ${i + 1}/${batches.length} (${(i + 1) * batchSize} verses)...`);
    }
    
    // Step 4: Update refs
    console.log('\n📝 Step 4: Updating refs...');
    
    const refUpdateSQL = `
      UPDATE verses
      SET ref = book || ' ' || chapter || ':' || verse,
          updated_at = strftime('%s', 'now')
      WHERE translation_key = 'afghan2023'
      AND (ref != (book || ' ' || chapter || ':' || verse));
    `;
    
    await executeD1Sql(refUpdateSQL);
    console.log('   ✅ Updated refs');
    
    console.log(`\n✅ Fixed ${fixes.length} verses`);
    
    // Final summary
    const { stdout: summaryRaw } = await execAsync(
      `npx wrangler d1 execute pashto-bible-db --remote --command="SELECT translation_key, testament, COUNT(*) as count FROM verses WHERE translation_key = 'afghan2023' GROUP BY translation_key, testament ORDER BY testament;" --json`,
      { maxBuffer: 10 * 1024 * 1024, cwd: '/Users/jeremysamuels/Documents/pashto-bible-search' }
    );
    
    const summaryResult = JSON.parse(summaryRaw);
    const summaryData = Array.isArray(summaryResult) ? summaryResult[0] : summaryResult;
    
    console.log('\n📊 Final Counts:');
    if (summaryData.results) {
      summaryData.results.forEach((row: any) => {
        console.log(`   ${row.testament}: ${row.count.toLocaleString()} verses`);
      });
    }
    
  } catch (error: any) {
    console.error(`\n❌ Error: ${error.message}`);
    process.exit(1);
  }
}

main().catch(console.error);
