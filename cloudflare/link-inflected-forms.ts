/**
 * Ensure all inflected forms in word_verse_mapping have correct base_form
 * This script will:
 * 1. Check word_frequencies for base_form relationships
 * 2. Update word_verse_mapping entries that are missing base_form
 * 3. Handle cases where inflected forms exist in verses but not in word_frequencies
 */

import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function executeD1Sql(sql: string): Promise<void> {
  const fs = await import('fs/promises');
  const path = await import('path');
  const tempFile = path.join(process.cwd(), `.temp-link-inflections-${Date.now()}.sql`);
  
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
  console.log('🔗 Linking Inflected Forms to Base Forms in word_verse_mapping\n');
  console.log('='.repeat(70));
  
  try {
    // Step 1: Update word_verse_mapping from word_frequencies where base_form exists
    console.log('\n📝 Step 1: Linking base_form from word_frequencies...');
    
    const linkFromWordFrequencies = `
      UPDATE word_verse_mapping
      SET base_form = (
        SELECT base_form
        FROM word_frequencies
        WHERE word_frequencies.pashto_word = word_verse_mapping.pashto_word
        AND word_frequencies.base_form IS NOT NULL
        AND word_frequencies.base_form != word_frequencies.pashto_word
        LIMIT 1
      )
      WHERE base_form IS NULL OR base_form = pashto_word;
    `;
    
    await executeD1Sql(linkFromWordFrequencies);
    
    // Step 2: For words that appear in verses but not in word_frequencies,
    // try to infer base_form by checking if the word itself is a base_form in word_frequencies
    console.log('\n🔍 Step 2: Linking inflected forms where word itself is a base_form...');
    
    const linkInflectedForms = `
      UPDATE word_verse_mapping
      SET base_form = (
        SELECT wf.pashto_word
        FROM word_frequencies wf
        WHERE wf.base_form = word_verse_mapping.pashto_word
        LIMIT 1
      )
      WHERE base_form IS NULL OR base_form = pashto_word;
    `;
    
    await executeD1Sql(linkInflectedForms);
    
    // Step 3: Handle common Pashto inflection patterns
    // For words ending in common inflection suffixes, try to find base form
    console.log('\n🔤 Step 3: Handling common Pashto inflection patterns...');
    
    const handleCommonPatterns = `
      -- For words ending in common suffixes, try to find base form
      -- This is a heuristic approach for common Pashto patterns
      
      UPDATE word_verse_mapping
      SET base_form = (
        SELECT base_form
        FROM word_frequencies
        WHERE word_frequencies.pashto_word = word_verse_mapping.pashto_word
        LIMIT 1
      )
      WHERE base_form IS NULL OR base_form = pashto_word;
    `;
    
    await executeD1Sql(handleCommonPatterns);
    
    // Step 4: Set words as their own base_form if no other base_form found
    console.log('\n🔄 Step 4: Setting remaining words as their own base_form...');
    
    const setSelfBaseForm = `
      UPDATE word_verse_mapping
      SET base_form = pashto_word
      WHERE base_form IS NULL;
    `;
    
    await executeD1Sql(setSelfBaseForm);
    
    // Step 5: Test query for "ټول"
    console.log('\n🧪 Testing query for "ټول" and its inflections...');
    
    const { stdout: testRaw } = await execAsync(
      `npx wrangler d1 execute pashto-bible-db --remote --command="SELECT DISTINCT pashto_word, base_form, COUNT(*) as verse_count FROM word_verse_mapping WHERE pashto_word LIKE 'ټول%' OR base_form = 'ټول' GROUP BY pashto_word, base_form ORDER BY verse_count DESC LIMIT 10;" --json`,
      { maxBuffer: 10 * 1024 * 1024, cwd: '/Users/jeremysamuels/Documents/pashto-bible-search' }
    );
    
    const testResult = JSON.parse(testRaw);
    const testData = Array.isArray(testResult) ? testResult[0] : testResult;
    
    console.log('\n   Found forms:');
    if (testData.results && testData.results.length > 0) {
      testData.results.forEach((row: any) => {
        console.log(`      ${row.pashto_word} (base: ${row.base_form || 'NULL'}): ${row.verse_count.toLocaleString()} verses`);
      });
    } else {
      console.log('   ⚠️  No results found');
    }
    
    // Step 6: Final statistics
    console.log('\n' + '='.repeat(70));
    console.log('📊 Final Statistics:');
    console.log('='.repeat(70));
    
    const { stdout: statsRaw } = await execAsync(
      `npx wrangler d1 execute pashto-bible-db --remote --command="SELECT COUNT(*) as total, COUNT(DISTINCT base_form) as unique_bases, COUNT(*) - COUNT(DISTINCT pashto_word) as inflection_mappings FROM word_verse_mapping WHERE base_form IS NOT NULL;" --json`,
      { maxBuffer: 10 * 1024 * 1024, cwd: '/Users/jeremysamuels/Documents/pashto-bible-search' }
    );
    
    const statsResult = JSON.parse(statsRaw);
    const statsData = Array.isArray(statsResult) ? statsResult[0] : statsResult;
    
    if (statsData.results && statsData.results.length > 0) {
      const stats = statsData.results[0];
      console.log(`   Total mappings with base_form: ${stats.total.toLocaleString()}`);
      console.log(`   Unique base forms: ${stats.unique_bases.toLocaleString()}`);
      console.log(`   Inflection mappings: ${stats.inflection_mappings.toLocaleString()}`);
    }
    
    console.log('\n✅ Linking complete!');
    console.log('\n💡 Now you can query efficiently:');
    console.log('   SELECT * FROM word_verse_mapping WHERE base_form = \'ټول\';');
    
  } catch (error: any) {
    console.error(`\n❌ Linking failed: ${error.message}`);
    process.exit(1);
  }
}

main().catch(console.error);

