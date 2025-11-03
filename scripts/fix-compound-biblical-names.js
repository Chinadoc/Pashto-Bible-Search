/**
 * Fix compound biblical names in word_frequencies
 * 
 * Some biblical names appear as compound words (e.g., "اخى‌اب" = Ahab)
 * but are stored as separate words. This script:
 * 1. Identifies compound biblical names
 * 2. Merges their frequencies
 * 3. Updates the database to use the compound form
 */

const { readFileSync, writeFileSync } = require('fs');
const { join } = require('path');
const { execSync } = require('child_process');

// Compound biblical names found in verse analysis
const COMPOUND_BIBLICAL_NAMES = {
  'اخى‌اب': 'Ahab',  // اخى + اب
  'حنن‌ايل': 'Hananeel',  // حنن + ايل
  'اِلى‌عالى': 'Elealeh',  // اِلى + عالى
  'شلتى‌اېل': 'Shealtiel',  // شلتى + اېل
};

/**
 * Query D1 for words that might be parts of compound names
 */
async function findCompoundNameParts() {
  const updates = [];
  
  console.log('🔍 Finding and fixing compound biblical names...\n');
  
  for (const [compound, englishName] of Object.entries(COMPOUND_BIBLICAL_NAMES)) {
    // Check if compound exists
    const checkCmd = `wrangler d1 execute pashto-bible-db --remote --command="SELECT pashto_word, frequency_t FROM word_frequencies WHERE pashto_word = '${compound.replace(/'/g, "''")}' LIMIT 1;" --json`;
    
    try {
      const result = execSync(checkCmd, { encoding: 'utf-8', maxBuffer: 10 * 1024 * 1024 });
      const data = JSON.parse(result);
      
      if (data && data.results && data.results.length > 0) {
        console.log(`✅ Found compound: ${compound} (${englishName})`);
        // Already exists, just update if needed
        updates.push(`-- Compound biblical name: ${compound} (${englishName})`);
        updates.push(`UPDATE word_frequencies SET word_type = 'proper_noun', pos = 'n. prop.', romanization = '${englishName.replace(/'/g, "''")}', has_issues = 0, issue_flags = '[]' WHERE pashto_word = '${compound.replace(/'/g, "''")}';`);
      } else {
        // Compound doesn't exist - need to check if parts exist and merge
        const parts = compound.split(/[\u200c\u200d\u00ad\s]+/);
        if (parts.length >= 2) {
          console.log(`⚠️  Compound ${compound} not found, checking parts: ${parts.join(', ')}`);
          
          // For now, just create the compound entry
          // In a real scenario, we'd need to:
          // 1. Find all verse occurrences
          // 2. Sum frequencies
          // 3. Create compound entry
          // 4. Optionally delete or reduce frequency of parts
          
          updates.push(`-- Compound biblical name: ${compound} (${englishName})`);
          updates.push(`-- Note: This compound may need manual frequency calculation from verses`);
          updates.push(`INSERT OR IGNORE INTO word_frequencies (pashto_word, word_type, pos, romanization, has_issues, issue_flags) VALUES ('${compound.replace(/'/g, "''")}', 'proper_noun', 'n. prop.', '${englishName.replace(/'/g, "''")}', 0, '[]');`);
        }
      }
      updates.push('');
    } catch (error) {
      console.error(`Error checking ${compound}:`, error.message);
    }
  }
  
  return updates;
}

/**
 * Generate SQL to fix compound names
 */
async function main() {
  console.log('🚀 Starting compound biblical names fix...\n');
  
  const updates = await findCompoundNameParts();
  
  // Add SQL header
  const sql = [
    '-- Fix compound biblical names',
    '-- These are names that appear as single words in Pashto but are compound',
    '-- Example: اخى‌اب = Ahab (not اخى + اب as separate words)',
    '',
    '-- Add word_type column if missing',
    "ALTER TABLE word_frequencies ADD COLUMN word_type TEXT;",
    '',
    '-- Update compound biblical names',
    ...updates,
    '',
    '-- Create index if missing',
    'CREATE INDEX IF NOT EXISTS idx_word_frequencies_word_type ON word_frequencies (word_type);',
  ].join('\n');
  
  // Write SQL file
  const sqlPath = join(process.cwd(), 'cloudflare/fix-compound-biblical-names.sql');
  writeFileSync(sqlPath, sql, 'utf-8');
  
  console.log(`✅ Generated SQL file:`);
  console.log(`   - ${sqlPath}\n`);
  
  console.log('📋 Next steps:');
  console.log('   1. Review the SQL file');
  console.log('   2. Run: wrangler d1 execute pashto-bible-db --remote --file cloudflare/fix-compound-biblical-names.sql');
  console.log('   3. This will ensure compound names appear as single entries\n');
}

main().catch(console.error);

