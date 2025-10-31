/**
 * Fix categorization to use word-boundary matching instead of substring matching
 * This prevents words like "beginning" from matching "inside" or "light" from matching incorrectly
 */

import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

/**
 * Classify a word into categories based on its English translation
 * Uses word boundary matching instead of substring matching
 */
function classifyWordFixed(englishTranslation: string, pos?: string): string[] {
  const categories: Set<string> = new Set();
  const englishLower = englishTranslation.toLowerCase();
  
  // Split translation into words (handle commas, semicolons, etc.)
  const words = englishLower.split(/[,;]\s*|\s+/).map(w => w.trim()).filter(w => w.length > 0);
  
  // Load all categories from the database
  // For now, we'll use a more precise matching approach
  // Check if any keyword appears as a whole word in the translation
  
  // Define categories with their keywords
  const CATEGORIES: Record<string, string[]> = {
    'direction': ['up', 'down', 'left', 'right', 'forward', 'backward', 'front', 'back', 'behind', 'before', 'after', 'above', 'below', 'under', 'over', 'inside', 'outside', 'north', 'south', 'east', 'west'],
    'time_concepts': ['time', 'day', 'night', 'morning', 'evening', 'hour', 'minute', 'year', 'month', 'week', 'season', 'beginning', 'end', 'start', 'finish'],
    'light_dark': ['light', 'dark', 'darkness', 'bright', 'shine', 'glow', 'lamp', 'candle', 'torch', 'flame', 'illumination'],
    'animals_wild': ['wild', 'beast', 'animal', 'lion', 'bear', 'wolf', 'fox', 'deer', 'rabbit'],
    'relationships_family': ['twin', 'brother', 'sister', 'pair', 'couple', 'match', 'double', 'duplicate'],
    // Add more categories as needed
  };
  
  // Check each category's keywords
  for (const [category, keywords] of Object.entries(CATEGORIES)) {
    for (const keyword of keywords) {
      // Check if keyword appears as a whole word in any of the translation words
      for (const word of words) {
        // Use word boundary matching - keyword must match exactly or be at word boundaries
        const regex = new RegExp(`\\b${keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
        if (regex.test(word)) {
          categories.add(category);
          break; // Found a match for this category, move to next category
        }
      }
      if (categories.has(category)) break; // Already found this category
    }
  }
  
  return Array.from(categories);
}

/**
 * Reclassify words that are incorrectly categorized
 */
async function fixCategorization(): Promise<void> {
  console.log('🔍 Fixing word categorization...\n');
  
  // Get words that are incorrectly categorized as "direction"
  const problematicWords = ['رنا', 'شروع', 'جوره', 'خاور'];
  
  console.log(`📝 Reclassifying ${problematicWords.length} problematic words...\n`);
  
  for (const pashtoWord of problematicWords) {
    // Get the English translation
    const { stdout } = await execAsync(
      `npx wrangler d1 execute pashto-bible-db --remote --command="SELECT english_translation, pos FROM word_frequencies WHERE pashto_word = '${pashtoWord.replace(/'/g, "''")}';" --json`,
      { timeout: 30000 }
    );
    
    const result = JSON.parse(stdout);
    const data = Array.isArray(result) ? result[0] : result;
    const words = data.results || [];
    
    if (words.length === 0) {
      console.log(`⚠️  Word "${pashtoWord}" not found in database`);
      continue;
    }
    
    const word = words[0];
    const englishTranslation = word.english_translation || '';
    const pos = word.pos || '';
    
    // Get correct categories
    const correctCategories = classifyWordFixed(englishTranslation, pos);
    
    console.log(`\n📖 Word: ${pashtoWord}`);
    console.log(`   Translation: ${englishTranslation}`);
    console.log(`   Correct categories: ${correctCategories.join(', ')}`);
    
    // Remove incorrect "direction" category if it's not in correct categories
    if (!correctCategories.includes('direction')) {
      console.log(`   ❌ Removing incorrect "direction" category`);
      
      try {
        await execAsync(
          `npx wrangler d1 execute pashto-bible-db --remote --command="DELETE FROM word_category_mappings WHERE pashto_word = '${pashtoWord.replace(/'/g, "''")}' AND category_key = 'direction';"`,
          { timeout: 30000 }
        );
        
        // Also remove from category_verse_mappings
        await execAsync(
          `npx wrangler d1 execute pashto-bible-db --remote --command="DELETE FROM category_verse_mappings WHERE pashto_word = '${pashtoWord.replace(/'/g, "''")}' AND category_key = 'direction';"`,
          { timeout: 30000 }
        );
        
        console.log(`   ✅ Removed "direction" category`);
      } catch (error: any) {
        console.error(`   ❌ Error removing category: ${error.message}`);
      }
    }
    
    // Add correct categories if missing
    for (const category of correctCategories) {
      try {
        await execAsync(
          `npx wrangler d1 execute pashto-bible-db --remote --command="INSERT OR IGNORE INTO word_category_mappings (pashto_word, category_key) VALUES ('${pashtoWord.replace(/'/g, "''")}', '${category.replace(/'/g, "''")}');"`,
          { timeout: 30000 }
        );
      } catch (error: any) {
        console.error(`   ⚠️  Error adding category ${category}: ${error.message}`);
      }
    }
  }
  
  console.log('\n✅ Categorization fix complete!\n');
}

// Run the fix
fixCategorization().catch(console.error);

