/**
 * Fix incorrectly categorized words by removing them from the "direction" category
 * and reclassifying them properly
 */

import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

/**
 * Reclassify words that were incorrectly categorized as "direction"
 */
async function fixIncorrectCategorizations(): Promise<void> {
  console.log('🔍 Fixing incorrect categorizations...\n');
  
  // Words that should NOT be in "direction" category
  const problematicWords = [
    { pashto: 'رنا', english: 'light, glory, brightness, illumination', correctCategories: ['light_dark'] },
    { pashto: 'شروع', english: 'beginning, start, undertaking', correctCategories: ['time_concepts'] },
    { pashto: 'جوره', english: 'pair, match, couple, double, twin, duplicate', correctCategories: ['relationships_family', 'numbers_quantities'] },
    { pashto: 'خاور', english: 'wild beast; animal', correctCategories: ['nature_animals', 'animals_wild'] },
  ];
  
  console.log(`📝 Processing ${problematicWords.length} words...\n`);
  
  for (const wordInfo of problematicWords) {
    const { pashto, english, correctCategories } = wordInfo;
    
    console.log(`\n📖 Word: ${pashto}`);
    console.log(`   Translation: ${english}`);
    console.log(`   Removing from "direction" category...`);
    
    try {
      // Remove from word_category_mappings
      await execAsync(
        `npx wrangler d1 execute pashto-bible-db --remote --command="DELETE FROM word_category_mappings WHERE pashto_word = '${pashto.replace(/'/g, "''")}' AND category_key = 'direction';"`,
        { timeout: 30000 }
      );
      
      // Remove from category_verse_mappings
      await execAsync(
        `npx wrangler d1 execute pashto-bible-db --remote --command="DELETE FROM category_verse_mappings WHERE pashto_word = '${pashto.replace(/'/g, "''")}' AND category_key = 'direction';"`,
        { timeout: 30000 }
      );
      
      console.log(`   ✅ Removed from "direction" category`);
      
      // Add correct categories
      for (const category of correctCategories) {
        try {
          await execAsync(
            `npx wrangler d1 execute pashto-bible-db --remote --command="INSERT OR IGNORE INTO word_category_mappings (pashto_word, category_key) VALUES ('${pashto.replace(/'/g, "''")}', '${category.replace(/'/g, "''")}');"`,
            { timeout: 30000 }
          );
          console.log(`   ✅ Added to "${category}" category`);
        } catch (error: any) {
          console.error(`   ⚠️  Error adding category ${category}: ${error.message}`);
        }
      }
    } catch (error: any) {
      console.error(`   ❌ Error: ${error.message}`);
    }
  }
  
  console.log('\n✅ Fix complete!\n');
}

// Run the fix
fixIncorrectCategorizations().catch(console.error);

