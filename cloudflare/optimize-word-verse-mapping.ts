/**
 * Optimize word_verse_mapping for efficient base_form searches
 * Adds base_form column and populates it from word_frequencies
 * This allows single-query lookups for all inflected forms of a word
 */

import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function executeD1Sql(sql: string): Promise<void> {
  const fs = await import('fs/promises');
  const path = await import('path');
  const tempFile = path.join(process.cwd(), `.temp-optimize-${Date.now()}.sql`);
  
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
  console.log('⚡ Optimizing word_verse_mapping for Efficient Base Form Searches\n');
  console.log('='.repeat(70));
  
  try {
    // Step 1: Add base_form column to word_verse_mapping
    console.log('\n📝 Step 1: Adding base_form column to word_verse_mapping...');
    
    const addBaseFormColumn = `
      -- Check if column exists first
      -- SQLite doesn't support IF NOT EXISTS for ALTER TABLE ADD COLUMN
      -- So we'll try to add it and catch errors if it already exists
      
      ALTER TABLE word_verse_mapping ADD COLUMN base_form TEXT;
      
      CREATE INDEX IF NOT EXISTS idx_word_verse_base_form ON word_verse_mapping(base_form);
      CREATE INDEX IF NOT EXISTS idx_word_verse_base_translation ON word_verse_mapping(base_form, translation_key);
      CREATE INDEX IF NOT EXISTS idx_word_verse_base_testament ON word_verse_mapping(base_form, testament);
    `;
    
    try {
      await executeD1Sql(addBaseFormColumn);
      console.log('   ✅ Added base_form column and indexes');
    } catch (error: any) {
      if (error.message.includes('duplicate column')) {
        console.log('   ℹ️  base_form column already exists');
      } else {
        throw error;
      }
    }
    
    // Step 2: Populate base_form from word_frequencies
    console.log('\n📊 Step 2: Populating base_form from word_frequencies...');
    
    const populateBaseForm = `
      UPDATE word_verse_mapping
      SET base_form = (
        SELECT base_form
        FROM word_frequencies
        WHERE word_frequencies.pashto_word = word_verse_mapping.pashto_word
        AND word_frequencies.base_form IS NOT NULL
        LIMIT 1
      )
      WHERE base_form IS NULL;
    `;
    
    await executeD1Sql(populateBaseForm);
    
    // Check how many were updated
    const { stdout: countRaw } = await execAsync(
      `npx wrangler d1 execute pashto-bible-db --remote --command="SELECT COUNT(*) as total, COUNT(base_form) as with_base FROM word_verse_mapping;" --json`,
      { maxBuffer: 10 * 1024 * 1024, cwd: '/Users/jeremysamuels/Documents/pashto-bible-search' }
    );
    
    const countResult = JSON.parse(countRaw);
    const countData = Array.isArray(countResult) ? countResult[0] : countResult;
    const total = countData.results?.[0]?.total || 0;
    const withBase = countData.results?.[0]?.with_base || 0;
    
    console.log(`   ✅ Updated ${withBase.toLocaleString()} mappings with base_form (out of ${total.toLocaleString()} total)`);
    
    // Step 3: Handle words where base_form = pashto_word (words that are their own base form)
    console.log('\n🔄 Step 3: Setting base_form for words that are their own base form...');
    
    const setSelfBaseForm = `
      UPDATE word_verse_mapping
      SET base_form = pashto_word
      WHERE base_form IS NULL
      AND pashto_word IN (
        SELECT pashto_word
        FROM word_frequencies
        WHERE base_form IS NULL OR base_form = pashto_word
      );
    `;
    
    await executeD1Sql(setSelfBaseForm);
    
    const { stdout: finalCountRaw } = await execAsync(
      `npx wrangler d1 execute pashto-bible-db --remote --command="SELECT COUNT(*) as total, COUNT(base_form) as with_base FROM word_verse_mapping;" --json`,
      { maxBuffer: 10 * 1024 * 1024, cwd: '/Users/jeremysamuels/Documents/pashto-bible-search' }
    );
    
    const finalCountResult = JSON.parse(finalCountRaw);
    const finalCountData = Array.isArray(finalCountResult) ? finalCountResult[0] : finalCountResult;
    const finalTotal = finalCountData.results?.[0]?.total || 0;
    const finalWithBase = finalCountData.results?.[0]?.with_base || 0;
    
    console.log(`   ✅ Now ${finalWithBase.toLocaleString()} mappings have base_form (out of ${finalTotal.toLocaleString()} total)`);
    
    // Step 4: Example query demonstration
    console.log('\n' + '='.repeat(70));
    console.log('✅ Optimization complete!');
    console.log('='.repeat(70));
    
    console.log('\n📖 Example Usage:\n');
    console.log('-- Find all verses containing "ټول" (Tol) and its inflections:');
    console.log('SELECT DISTINCT verse_ref, translation_key, testament');
    console.log('FROM word_verse_mapping');
    console.log("WHERE base_form = 'ټول';");
    console.log('\n-- Or find all inflected forms of "ټول" that appear in verses:');
    console.log('SELECT DISTINCT pashto_word, COUNT(*) as verse_count');
    console.log('FROM word_verse_mapping');
    console.log("WHERE base_form = 'ټول'");
    console.log('GROUP BY pashto_word');
    console.log('ORDER BY verse_count DESC;');
    
    // Step 5: Test query for "ټول"
    console.log('\n🧪 Testing query for "ټول"...');
    
    const { stdout: testRaw } = await execAsync(
      `npx wrangler d1 execute pashto-bible-db --remote --command="SELECT DISTINCT pashto_word, COUNT(*) as verse_count FROM word_verse_mapping WHERE base_form = 'ټول' GROUP BY pashto_word ORDER BY verse_count DESC LIMIT 10;" --json`,
      { maxBuffer: 10 * 1024 * 1024, cwd: '/Users/jeremysamuels/Documents/pashto-bible-search' }
    );
    
    const testResult = JSON.parse(testRaw);
    const testData = Array.isArray(testResult) ? testResult[0] : testResult;
    
    if (testData.results && testData.results.length > 0) {
      console.log('\n   Found inflected forms:');
      testData.results.forEach((row: any) => {
        console.log(`      ${row.pashto_word}: ${row.verse_count.toLocaleString()} verses`);
      });
    } else {
      console.log('   ⚠️  No results found. This might mean base_form needs to be populated for this word.');
    }
    
  } catch (error: any) {
    console.error(`\n❌ Optimization failed: ${error.message}`);
    process.exit(1);
  }
}

main().catch(console.error);

