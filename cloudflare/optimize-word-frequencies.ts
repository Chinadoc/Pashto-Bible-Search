/**
 * Optimize Word Frequencies: Add verse_count column and ensure consistency
 * 
 * Adds verse_count column to word_frequencies that matches word_verse_mapping
 * This allows quick verification that frequency_total matches actual verse occurrences
 * without storing all verse refs in word_frequencies (too large)
 */

import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function optimizeWordFrequencies(): Promise<void> {
  console.log('⚡ Optimizing Word Frequencies Table\n');
  console.log('='.repeat(70));
  
  // Step 1: Add verse_count column if it doesn't exist
  console.log('\n📝 Step 1: Adding verse_count column...');
  
  try {
    // Check if column exists
    const { stdout: tableInfo } = await execAsync(
      `npx wrangler d1 execute pashto-bible-db --remote --command="PRAGMA table_info(word_frequencies);" --json`,
      { maxBuffer: 10 * 1024 * 1024 }
    );
    
    const info = JSON.parse(tableInfo);
    const data = Array.isArray(info) ? info[0] : info;
    const columns = data.results || [];
    const hasVerseCount = columns.some((col: any) => col.name === 'verse_count');
    
    if (!hasVerseCount) {
      await execAsync(
        `npx wrangler d1 execute pashto-bible-db --remote --command="ALTER TABLE word_frequencies ADD COLUMN verse_count INTEGER DEFAULT 0;"`
      );
      console.log('   ✅ Added verse_count column');
    } else {
      console.log('   ✅ verse_count column already exists');
    }
    
    // Add index for fast lookups
    await execAsync(
      `npx wrangler d1 execute pashto-bible-db --remote --command="CREATE INDEX IF NOT EXISTS idx_word_freq_verse_count ON word_frequencies(verse_count);"`
    );
    
  } catch (error: any) {
    console.log(`   ⚠️  Error: ${error.message}`);
  }
  
  // Step 2: Update verse_count from word_verse_mapping
  console.log('\n📊 Step 2: Updating verse_count from word_verse_mapping...');
  
  // Get counts in batches
  const batchSize = 1000;
  let offset = 0;
  let updated = 0;
  
  while (true) {
    try {
      // Get batch of words
      const { stdout } = await execAsync(
        `npx wrangler d1 execute pashto-bible-db --remote --command="SELECT pashto_word FROM word_frequencies LIMIT ${batchSize} OFFSET ${offset};" --json`,
        { maxBuffer: 10 * 1024 * 1024 }
      );
      
      const result = JSON.parse(stdout);
      const data = Array.isArray(result) ? result[0] : result;
      const words = data.results || [];
      
      if (words.length === 0) break;
      
      // Update verse_count for each word
      for (const wordRow of words) {
        const word = wordRow.pashto_word;
        const escape = (str: string) => str.replace(/'/g, "''");
        
        // Count unique verses for this word (including base_form matches)
        const { stdout: countOut } = await execAsync(
          `npx wrangler d1 execute pashto-bible-db --remote --command="SELECT COUNT(DISTINCT verse_ref) as count FROM word_verse_mapping WHERE pashto_word = '${escape(word)}' OR base_form = '${escape(word)}';" --json`,
          { maxBuffer: 10 * 1024 * 1024 }
        );
        
        const countResult = JSON.parse(countOut);
        const countData = Array.isArray(countResult) ? countResult[0] : countResult;
        const verseCount = countData.results?.[0]?.count || 0;
        
        // Update word_frequencies
        await execAsync(
          `npx wrangler d1 execute pashto-bible-db --remote --command="UPDATE word_frequencies SET verse_count = ${verseCount} WHERE pashto_word = '${escape(word)}';"`
        );
        
        updated++;
        
        if (updated % 100 === 0) {
          process.stdout.write(`\r   Updated ${updated} words...`);
        }
      }
      
      offset += batchSize;
      
    } catch (error: any) {
      console.error(`\n   ⚠️  Error at offset ${offset}: ${error.message}`);
      break;
    }
  }
  
  console.log(`\n✅ Updated verse_count for ${updated} words`);
  
  // Step 3: Verify consistency
  console.log('\n🔍 Step 3: Verifying consistency...');
  
  try {
    const { stdout } = await execAsync(
      `npx wrangler d1 execute pashto-bible-db --remote --command="SELECT pashto_word, frequency_total, verse_count FROM word_frequencies WHERE frequency_total > 1000 ORDER BY frequency_total DESC LIMIT 10;" --json`,
      { maxBuffer: 10 * 1024 * 1024 }
    );
    
    const result = JSON.parse(stdout);
    const data = Array.isArray(result) ? result[0] : result;
    const words = data.results || [];
    
    console.log('\n📊 Sample words (frequency_total vs verse_count):');
    for (const word of words) {
      const match = word.frequency_total === word.verse_count ? '✅' : '⚠️';
      console.log(`   ${match} ${word.pashto_word}: ${word.frequency_total} occurrences in ${word.verse_count} verses`);
    }
    
  } catch (error: any) {
    console.log(`   ⚠️  Error: ${error.message}`);
  }
  
  console.log('\n' + '='.repeat(70));
  console.log('✅ Optimization complete!');
  console.log('\n💡 Usage:');
  console.log('   - word_frequencies: Metadata (frequencies, linguistic data, verse_count)');
  console.log('   - word_verse_mapping: Fast verse lookups (indexed by pashto_word and base_form)');
  console.log('   - Query: SELECT * FROM word_verse_mapping WHERE pashto_word = ? OR base_form = ?');
}

if (require.main === module) {
  optimizeWordFrequencies()
    .then(() => {
      console.log('\n✅ Script complete!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Error:', error);
      process.exit(1);
    });
}

export { optimizeWordFrequencies };

