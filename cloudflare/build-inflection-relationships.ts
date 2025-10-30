/**
 * Build inflection relationships in word_frequencies and word_verse_mapping
 * For words like "ټول" (Tol), link inflections like "ټوله", "ټولې", "ټولو" to the base form
 * 
 * This script:
 * 1. Checks word_frequencies for base forms
 * 2. If a word is missing base_form, checks if it's an inflection of a known base form
 * 3. Updates both word_frequencies and word_verse_mapping
 */

import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function executeD1Sql(sql: string): Promise<void> {
  const fs = await import('fs/promises');
  const path = await import('path');
  const tempFile = path.join(process.cwd(), `.temp-build-inflections-${Date.now()}.sql`);
  
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

// Common Pashto inflection patterns
// For adjectives/nouns: base form + ه/ې/و/ي suffixes
function getPossibleBaseForms(word: string): string[] {
  const bases: string[] = [];
  
  // Remove common inflection suffixes
  // ه (he) - feminine singular
  if (word.endsWith('ه') && word.length > 1) {
    bases.push(word.slice(0, -1));
  }
  
  // ې (ye) - feminine 1st person/possessive
  if (word.endsWith('ې') && word.length > 1) {
    bases.push(word.slice(0, -1));
    // Also try adding ه if removing ې
    const withoutYe = word.slice(0, -1);
    if (!bases.includes(withoutYe + 'ه')) {
      bases.push(withoutYe + 'ه');
    }
  }
  
  // و (waw) - masculine 2nd person/possessive
  if (word.endsWith('و') && word.length > 1) {
    bases.push(word.slice(0, -1));
  }
  
  // ي (ye) - masculine plural/possessive
  if (word.endsWith('ي') && word.length > 1) {
    bases.push(word.slice(0, -1));
  }
  
  // If word itself could be a base form, add it
  bases.push(word);
  
  return [...new Set(bases)]; // Remove duplicates
}

async function main() {
  console.log('🔗 Building Inflection Relationships\n');
  console.log('='.repeat(70));
  
  try {
    // Step 1: For "ټول" specifically, ensure it's set as base_form for its inflections
    console.log('\n📝 Step 1: Setting up "ټول" (Tol) as base form...');
    
    const setupTol = `
      -- First, ensure "ټول" has itself as base_form in word_frequencies
      UPDATE word_frequencies
      SET base_form = 'ټول'
      WHERE pashto_word = 'ټول' AND (base_form IS NULL OR base_form != 'ټول');
      
      -- Now set inflected forms to point to "ټول" as base_form
      UPDATE word_frequencies
      SET base_form = 'ټول'
      WHERE pashto_word IN ('ټوله', 'ټولې', 'ټولو')
      AND (base_form IS NULL OR base_form != 'ټول');
      
      -- Update word_verse_mapping to reflect this
      UPDATE word_verse_mapping
      SET base_form = 'ټول'
      WHERE pashto_word IN ('ټول', 'ټوله', 'ټولې', 'ټولو')
      AND (base_form IS NULL OR base_form != 'ټول');
    `;
    
    await executeD1Sql(setupTol);
    console.log('   ✅ Set "ټول" as base form for its inflections');
    
    // Step 2: For other words, try to find base forms by checking if stripped version exists
    console.log('\n🔍 Step 2: Finding base forms for other inflected words...');
    
    // This is a more complex operation - we'll do it in batches
    // For now, let's handle words that are likely inflections
    const findBases = `
      -- For words ending in common inflection suffixes, try to find base form
      -- SQLite doesn't support UPDATE with table aliases, so we use a subquery approach
      
      UPDATE word_frequencies
      SET base_form = (
        SELECT wf2.pashto_word
        FROM word_frequencies wf2
        WHERE wf2.base_form = wf2.pashto_word  -- wf2 is a known base form
        AND (
          -- Remove ه suffix
          wf2.pashto_word || 'ه' = word_frequencies.pashto_word OR
          -- Remove ې suffix
          wf2.pashto_word || 'ې' = word_frequencies.pashto_word OR
          -- Remove و suffix
          wf2.pashto_word || 'و' = word_frequencies.pashto_word OR
          -- Remove ي suffix
          wf2.pashto_word || 'ي' = word_frequencies.pashto_word OR
          -- Direct match
          wf2.pashto_word = word_frequencies.pashto_word
        )
        LIMIT 1
      )
      WHERE base_form IS NULL OR base_form = pashto_word;
    `;
    
    await executeD1Sql(findBases);
    console.log('   ✅ Attempted to find base forms for inflected words');
    
    // Step 3: Update word_verse_mapping to match word_frequencies
    console.log('\n🔄 Step 3: Syncing word_verse_mapping with word_frequencies...');
    
    const syncMapping = `
      UPDATE word_verse_mapping
      SET base_form = (
        SELECT wf.base_form
        FROM word_frequencies wf
        WHERE wf.pashto_word = word_verse_mapping.pashto_word
        AND wf.base_form IS NOT NULL
        LIMIT 1
      )
      WHERE base_form IS NULL OR base_form = pashto_word;
    `;
    
    await executeD1Sql(syncMapping);
    console.log('   ✅ Synced word_verse_mapping with word_frequencies');
    
    // Step 4: Test query for "ټول"
    console.log('\n🧪 Testing query for "ټول" and all its inflections...');
    
    const { stdout: testRaw } = await execAsync(
      `npx wrangler d1 execute pashto-bible-db --remote --command="SELECT DISTINCT pashto_word, base_form, COUNT(*) as verse_count FROM word_verse_mapping WHERE base_form = 'ټول' GROUP BY pashto_word, base_form ORDER BY verse_count DESC;" --json`,
      { maxBuffer: 10 * 1024 * 1024, cwd: '/Users/jeremysamuels/Documents/pashto-bible-search' }
    );
    
    const testResult = JSON.parse(testRaw);
    const testData = Array.isArray(testResult) ? testResult[0] : testResult;
    
    console.log('\n   Found forms with base_form = "ټول":');
    if (testData.results && testData.results.length > 0) {
      let totalVerses = 0;
      testData.results.forEach((row: any) => {
        console.log(`      ${row.pashto_word}: ${row.verse_count.toLocaleString()} verses`);
        totalVerses += row.verse_count;
      });
      console.log(`   Total verses containing "ټول" or its inflections: ${totalVerses.toLocaleString()}`);
    } else {
      console.log('   ⚠️  No results found');
    }
    
    // Step 5: Show example query
    console.log('\n' + '='.repeat(70));
    console.log('✅ Inflection relationships built!');
    console.log('='.repeat(70));
    
    console.log('\n📖 Example Query:\n');
    console.log('-- Find all verses containing "ټول" (Tol) and its inflections:');
    console.log('SELECT DISTINCT verse_ref, translation_key, testament');
    console.log('FROM word_verse_mapping');
    console.log("WHERE base_form = 'ټول';");
    console.log('\n-- This single query now returns all verses with:');
    console.log('--   • ټول (Tol)');
    console.log('--   • ټوله (Tóla)');
    console.log('--   • ټولې (Tóle)');
    console.log('--   • ټولو (Tólo)');
    
  } catch (error: any) {
    console.error(`\n❌ Building relationships failed: ${error.message}`);
    process.exit(1);
  }
}

main().catch(console.error);

