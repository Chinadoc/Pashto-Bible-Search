/**
 * Fix categorization issues:
 * 1. Remove "awlaad" (اولاد) from incorrect categories like "abstract_bad"
 * 2. Ensure it's only in appropriate categories like "family_general" and "age_stages"
 */

import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function fixAwlaadCategorization(): Promise<void> {
  console.log('🔧 Fixing categorization for "awlaad" (اولاد)...\n');
  
  // Correct categories for "awlaad" (child, offspring)
  const correctCategories = [
    'family_general',
    'age_stages',
  ];
  
  // Incorrect categories to remove
  const incorrectCategories = [
    'abstract_bad',
    'actions_communication',
    'clothing',
    'grammar_conjunctions',
    'grammar_prepositions',
    'grammar_pronouns',
    'music_instruments',
    'nature_water',
    'seasons',
    'time_months',
    'water_related',
  ];
  
  const pashtoWord = 'اولاد';
  
  // Remove from incorrect categories
  console.log('🗑️  Removing from incorrect categories...\n');
  for (const category of incorrectCategories) {
    try {
      await execAsync(
        `npx wrangler d1 execute pashto-bible-db --remote --command="DELETE FROM word_category_mappings WHERE pashto_word = '${pashtoWord.replace(/'/g, "''")}' AND category_key = '${category.replace(/'/g, "''")}';"`,
        { timeout: 30000 }
      );
      console.log(`   ✅ Removed from ${category}`);
    } catch (error: any) {
      console.error(`   ⚠️  Error removing from ${category}: ${error.message}`);
    }
  }
  
  // Ensure it's in correct categories
  console.log('\n✅ Ensuring correct categories...\n');
  for (const category of correctCategories) {
    try {
      await execAsync(
        `npx wrangler d1 execute pashto-bible-db --remote --command="INSERT OR IGNORE INTO word_category_mappings (pashto_word, category_key) VALUES ('${pashtoWord.replace(/'/g, "''")}', '${category.replace(/'/g, "''")}');"`,
        { timeout: 30000 }
      );
      console.log(`   ✅ Ensured in ${category}`);
    } catch (error: any) {
      console.error(`   ⚠️  Error adding to ${category}: ${error.message}`);
    }
  }
  
  // Update category_verse_mappings to remove incorrect entries
  console.log('\n🔄 Updating category_verse_mappings...\n');
  for (const category of incorrectCategories) {
    try {
      await execAsync(
        `npx wrangler d1 execute pashto-bible-db --remote --command="DELETE FROM category_verse_mappings WHERE pashto_word = '${pashtoWord.replace(/'/g, "''")}' AND category_key = '${category.replace(/'/g, "''")}';"`,
        { timeout: 60000 }
      );
      console.log(`   ✅ Removed verse mappings from ${category}`);
    } catch (error: any) {
      console.error(`   ⚠️  Error removing verse mappings from ${category}: ${error.message}`);
    }
  }
  
  console.log('\n✅ Fixed categorization for "awlaad"\n');
}

fixAwlaadCategorization().catch(console.error);




