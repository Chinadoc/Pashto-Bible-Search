/**
 * Comprehensive rebuild of category-verse mappings
 * Ensures we have at least 2 verses per word/category combination
 * Processes ALL word-verse mappings (not just first 10,000)
 * Handles verses with multiple categorized words properly
 */

import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

/**
 * Rebuild category-verse mappings with full coverage
 */
async function rebuildCategoryVerseMappings(): Promise<void> {
  console.log('🔗 Rebuilding category-verse mappings with full coverage...\n');
  
  // First, clear existing mappings
  console.log('🧹 Clearing existing category-verse mappings...\n');
  try {
    await execAsync(
      `npx wrangler d1 execute pashto-bible-db --remote --command="DELETE FROM category_verse_mappings;"`,
      { timeout: 60000 }
    );
    console.log('✅ Cleared existing mappings\n');
  } catch (error: any) {
    console.error(`⚠️  Error clearing mappings: ${error.message}`);
  }
  
  // Get ALL word-verse mappings (no limit!)
  console.log('📊 Fetching ALL word-verse mappings...\n');
  const { stdout } = await execAsync(
    `npx wrangler d1 execute pashto-bible-db --remote --command="SELECT pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse FROM word_verse_mapping ORDER BY verse_id, pashto_word;" --json`,
    { maxBuffer: 100 * 1024 * 1024, timeout: 300000 }
  );
  
  const result = JSON.parse(stdout);
  const data = Array.isArray(result) ? result[0] : result;
  const verseMappings = data.results || [];
  
  console.log(`📊 Found ${verseMappings.length.toLocaleString()} total word-verse mappings\n`);
  
  // Get word categories
  console.log('📊 Fetching word categories...\n');
  const { stdout: catStdout } = await execAsync(
    `npx wrangler d1 execute pashto-bible-db --remote --command="SELECT pashto_word, category_key FROM word_category_mappings;" --json`,
    { maxBuffer: 50 * 1024 * 1024, timeout: 120000 }
  );
  
  const catResult = JSON.parse(catStdout);
  const catData = Array.isArray(catResult) ? catResult[0] : catResult;
  const wordCategories = catData.results || [];
  
  // Build word -> categories map
  const wordToCategories = new Map<string, string[]>();
  for (const wc of wordCategories) {
    if (!wordToCategories.has(wc.pashto_word)) {
      wordToCategories.set(wc.pashto_word, []);
    }
    wordToCategories.get(wc.pashto_word)!.push(wc.category_key);
  }
  
  console.log(`📊 Found categories for ${wordToCategories.size.toLocaleString()} words\n`);
  
  // Group verse mappings by word-category combination
  // This helps us ensure we get multiple verses per word/category
  const wordCategoryVerses = new Map<string, Array<typeof verseMappings[0]>>();
  
  for (const vm of verseMappings) {
    const categories = wordToCategories.get(vm.pashto_word) || [];
    for (const category of categories) {
      const key = `${vm.pashto_word}|${category}`;
      if (!wordCategoryVerses.has(key)) {
        wordCategoryVerses.set(key, []);
      }
      wordCategoryVerses.get(key)!.push(vm);
    }
  }
  
  console.log(`📊 Found ${wordCategoryVerses.size.toLocaleString()} word-category combinations\n`);
  
  // Create category-verse mappings
  // For each word-category combination, include at least 2 verses (or all if fewer than 2)
  const categoryVerses: Array<{
    category_key: string;
    pashto_word: string;
    verse_id: number;
    verse_ref: string;
    translation_key: string;
    testament: string;
    book: string;
    chapter: number;
    verse: number;
  }> = [];
  
  let processed = 0;
  for (const [key, verses] of wordCategoryVerses.entries()) {
    const [pashtoWord, category] = key.split('|');
    
    // For each word-category, include ALL verses (not just 2)
    // This ensures comprehensive coverage
    for (const vm of verses) {
      categoryVerses.push({
        category_key: category,
        pashto_word: pashtoWord,
        verse_id: vm.verse_id,
        verse_ref: vm.verse_ref,
        translation_key: vm.translation_key,
        testament: vm.testament,
        book: vm.book,
        chapter: vm.chapter,
        verse: vm.verse,
      });
    }
    
    processed++;
    if (processed % 1000 === 0) {
      process.stdout.write(`\r  Processed ${processed}/${wordCategoryVerses.size} word-category combinations...`);
    }
  }
  
  console.log(`\n📊 Generated ${categoryVerses.length.toLocaleString()} category-verse mappings\n`);
  
  // Remove duplicates (same verse can appear multiple times if it has multiple categorized words)
  // But we want to keep all entries because a verse can have multiple words from the same category
  const uniqueMappings = new Map<string, typeof categoryVerses[0]>();
  for (const cv of categoryVerses) {
    const key = `${cv.category_key}|${cv.pashto_word}|${cv.verse_id}`;
    uniqueMappings.set(key, cv);
  }
  
  const finalMappings = Array.from(uniqueMappings.values());
  console.log(`📊 After deduplication: ${finalMappings.length.toLocaleString()} unique mappings\n`);
  
  // Insert in batches
  const batchSize = 500; // Larger batches for efficiency
  let inserted = 0;
  
  console.log('💾 Inserting category-verse mappings...\n');
  
  for (let i = 0; i < finalMappings.length; i += batchSize) {
    const batch = finalMappings.slice(i, i + batchSize);
    const values = batch.map(cv => 
      `('${cv.category_key.replace(/'/g, "''")}', '${cv.pashto_word.replace(/'/g, "''")}', ${cv.verse_id}, '${cv.verse_ref.replace(/'/g, "''")}', '${cv.translation_key.replace(/'/g, "''")}', '${cv.testament.replace(/'/g, "''")}', '${cv.book.replace(/'/g, "''")}', ${cv.chapter}, ${cv.verse})`
    ).join(',\n');
    
    const insertSQL = `
INSERT OR IGNORE INTO category_verse_mappings (
  category_key, pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse
)
VALUES ${values};
`;
    
    try {
      await execAsync(
        `npx wrangler d1 execute pashto-bible-db --remote --command="${insertSQL.replace(/"/g, '\\"')}"`,
        { timeout: 120000 }
      );
      inserted += batch.length;
      process.stdout.write(`\r  Inserted ${inserted.toLocaleString()}/${finalMappings.length.toLocaleString()} mappings...`);
    } catch (error: any) {
      console.error(`\n⚠️  Error inserting batch ${i}-${i + batchSize}: ${error.message}`);
      // Try smaller batches if this fails
      if (error.message.includes('timeout') || error.message.includes('too large')) {
        console.log(`   Trying smaller batch size...`);
        // Retry with smaller batch
        const smallerBatch = batch.slice(0, Math.floor(batch.length / 2));
        const smallerValues = smallerBatch.map(cv => 
          `('${cv.category_key.replace(/'/g, "''")}', '${cv.pashto_word.replace(/'/g, "''")}', ${cv.verse_id}, '${cv.verse_ref.replace(/'/g, "''")}', '${cv.translation_key.replace(/'/g, "''")}', '${cv.testament.replace(/'/g, "''")}', '${cv.book.replace(/'/g, "''")}', ${cv.chapter}, ${cv.verse})`
        ).join(',\n');
        const smallerSQL = `
INSERT OR IGNORE INTO category_verse_mappings (
  category_key, pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse
)
VALUES ${smallerValues};
`;
        try {
          await execAsync(
            `npx wrangler d1 execute pashto-bible-db --remote --command="${smallerSQL.replace(/"/g, '\\"')}"`,
            { timeout: 120000 }
          );
          inserted += smallerBatch.length;
        } catch (error2: any) {
          console.error(`   ⚠️  Still failed with smaller batch: ${error2.message}`);
        }
      }
    }
  }
  
  console.log(`\n✅ Linked ${inserted.toLocaleString()} verses to categories\n`);
  
  // Show some statistics
  console.log('📊 Category statistics:\n');
  try {
    const { stdout: stats } = await execAsync(
      `npx wrangler d1 execute pashto-bible-db --remote --command="SELECT category_key, COUNT(*) as verse_count FROM category_verse_mappings GROUP BY category_key ORDER BY verse_count DESC LIMIT 10;" --json`,
      { timeout: 60000 }
    );
    const statsResult = JSON.parse(stats);
    const statsData = Array.isArray(statsResult) ? statsResult[0] : statsResult;
    const topCategories = statsData.results || [];
    
    for (const cat of topCategories) {
      console.log(`   ${cat.category_key}: ${cat.verse_count.toLocaleString()} verses`);
    }
  } catch (error: any) {
    console.error(`⚠️  Error getting statistics: ${error.message}`);
  }
}

// Run the rebuild
rebuildCategoryVerseMappings().catch(console.error);

