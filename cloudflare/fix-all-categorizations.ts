/**
 * Comprehensive fix for incorrect categorizations
 * Reclassifies all words using the improved word boundary matching logic
 * and removes clearly incorrect categorizations
 */

import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

// Import category definitions from create-word-categories.ts
// Key categories to check for common misclassifications
const CATEGORY_KEYWORDS: Record<string, string[]> = {
  'weather': ['rain', 'snow', 'wind', 'storm', 'cloud', 'thunder', 'lightning', 'sun', 'moon', 'star', 'sky', 'heaven', 'weather', 'temperature', 'hot', 'cold', 'warm', 'cool'],
  'time_concepts': ['past', 'present', 'future', 'forever', 'eternity', 'beginning', 'end', 'now', 'then', 'before', 'after', 'while', 'during', 'start'],
  'light_dark': ['light', 'dark', 'darkness', 'bright', 'shine', 'glow', 'lamp', 'candle', 'torch', 'flame', 'illumination'],
  'nature_animals': ['animal', 'beast', 'bird', 'fish', 'snake', 'lion', 'bear', 'wolf', 'fox', 'deer', 'sheep', 'goat', 'cow', 'ox', 'donkey', 'horse', 'camel', 'dog', 'cat', 'pig', 'chicken', 'cock', 'hen', 'eagle', 'dove', 'crow'],
  'animals_wild': ['wild', 'beast', 'animal', 'lion', 'bear', 'wolf', 'fox', 'deer', 'rabbit'],
  'relationships_family': ['twin', 'brother', 'sister', 'pair', 'couple', 'match', 'double', 'duplicate'],
  'numbers_quantities': ['all', 'many', 'much', 'few', 'little', 'some', 'several', 'whole', 'half', 'double', 'triple', 'single', 'pair', 'couple'],
  'medical': ['doctor', 'heal', 'cure', 'medicine', 'sick', 'ill', 'disease', 'wound', 'injury', 'pain', 'circumcision', 'circumcise', 'sunna'],
  'food': ['food', 'bread', 'meat', 'fish', 'fruit', 'grain', 'wheat', 'barley', 'corn', 'rice', 'salt', 'honey', 'milk', 'cheese', 'butter', 'oil', 'wine', 'water', 'drink', 'meal', 'feast', 'dinner', 'supper', 'grains', 'cereal', 'ration'],
  'buildings': ['house', 'home', 'room', 'chamber', 'tent', 'temple', 'church', 'tower', 'wall', 'gate', 'door', 'window', 'roof', 'floor', 'corner', 'city', 'town', 'village', 'palace', 'throne', 'altar'],
  'direction': ['up', 'down', 'left', 'right', 'forward', 'backward', 'front', 'back', 'behind', 'before', 'after', 'above', 'below', 'under', 'over', 'inside', 'outside', 'north', 'south', 'east', 'west'],
  'places': ['place', 'location', 'land', 'country', 'nation', 'region', 'area', 'north', 'south', 'east', 'west', 'direction', 'way', 'path', 'road', 'street', 'bridge'],
  'containers': ['bag', 'basket', 'box', 'jar', 'pot', 'vessel', 'cup', 'bowl', 'dish', 'plate', 'bottle', 'flask', 'bin', 'storehouse'],
  'tools': ['tool', 'knife', 'sword', 'spear', 'bow', 'arrow', 'axe', 'hammer', 'stick', 'staff', 'rod', 'rope', 'cord', 'chain'],
  'education': ['teach', 'learn', 'student', 'teacher', 'school', 'knowledge', 'wisdom', 'understand', 'training', 'learning', 'education', 'instruction'],
  'actions_move': ['go', 'come', 'walk', 'run', 'flee', 'escape', 'return', 'enter', 'exit', 'leave', 'depart', 'arrive', 'reach', 'approach', 'pass', 'cross', 'climb', 'fall', 'rise', 'stand', 'sit', 'lie', 'rest'],
};

/**
 * Check if a word should be in a category using word boundary matching
 */
function shouldBeInCategory(englishTranslation: string, category: string, keywords: string[]): boolean {
  const englishLower = englishTranslation.toLowerCase();
  const words = englishLower.split(/[,;]\s*|\s+/).map(w => w.trim()).filter(w => w.length > 0);
  
  for (const keyword of keywords) {
    const keywordLower = keyword.toLowerCase();
    
    for (const word of words) {
      // Exact match
      if (word === keywordLower) {
        return true;
      }
      
      // Word boundary match
      const escapedKeyword = keywordLower.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`\\b${escapedKeyword}\\b`, 'i');
      if (regex.test(word)) {
        return true;
      }
    }
  }
  
  return false;
}

/**
 * Fix incorrect categorizations
 */
async function fixAllCategorizations(): Promise<void> {
  console.log('🔍 Fixing all incorrect categorizations...\n');
  
  // Get all words in the "weather" category
  const { stdout: weatherWords } = await execAsync(
    `npx wrangler d1 execute pashto-bible-db --remote --command="SELECT DISTINCT pashto_word FROM word_category_mappings WHERE category_key = 'weather';" --json`,
    { timeout: 60000 }
  );
  
  const weatherResult = JSON.parse(weatherWords);
  const weatherData = Array.isArray(weatherResult) ? weatherResult[0] : weatherResult;
  const words = weatherData.results || [];
  
  console.log(`📊 Found ${words.length} words in "weather" category\n`);
  
  let fixed = 0;
  let removed = 0;
  
  for (const wordRow of words) {
    const pashtoWord = wordRow.pashto_word;
    
    // Get English translation
    const { stdout: wordData } = await execAsync(
      `npx wrangler d1 execute pashto-bible-db --remote --command="SELECT english_translation FROM word_frequencies WHERE pashto_word = '${pashtoWord.replace(/'/g, "''")}' LIMIT 1;" --json`,
      { timeout: 30000 }
    );
    
    const wordResult = JSON.parse(wordData);
    const wordDataObj = Array.isArray(wordResult) ? wordResult[0] : wordResult;
    const translations = wordDataObj.results || [];
    
    if (translations.length === 0) {
      console.log(`⚠️  No translation found for ${pashtoWord}, skipping...`);
      continue;
    }
    
    const englishTranslation = translations[0].english_translation || '';
    
    // Check if it should actually be in weather category
    const shouldBeWeather = shouldBeInCategory(englishTranslation, 'weather', CATEGORY_KEYWORDS['weather']);
    
    if (!shouldBeWeather) {
      console.log(`\n❌ ${pashtoWord}: "${englishTranslation}" incorrectly categorized as weather`);
      
      // Remove from weather category
      try {
        await execAsync(
          `npx wrangler d1 execute pashto-bible-db --remote --command="DELETE FROM word_category_mappings WHERE pashto_word = '${pashtoWord.replace(/'/g, "''")}' AND category_key = 'weather';"`,
          { timeout: 30000 }
        );
        
        await execAsync(
          `npx wrangler d1 execute pashto-bible-db --remote --command="DELETE FROM category_verse_mappings WHERE pashto_word = '${pashtoWord.replace(/'/g, "''")}' AND category_key = 'weather';"`,
          { timeout: 30000 }
        );
        
        removed++;
        console.log(`   ✅ Removed from weather category`);
        
        // Find correct category
        let correctCategory = null;
        for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
          if (category === 'weather') continue;
          if (shouldBeInCategory(englishTranslation, category, keywords)) {
            correctCategory = category;
            break;
          }
        }
        
        if (correctCategory) {
          try {
            await execAsync(
              `npx wrangler d1 execute pashto-bible-db --remote --command="INSERT OR IGNORE INTO word_category_mappings (pashto_word, category_key) VALUES ('${pashtoWord.replace(/'/g, "''")}', '${correctCategory.replace(/'/g, "''")}');"`,
              { timeout: 30000 }
            );
            console.log(`   ✅ Added to "${correctCategory}" category`);
            fixed++;
          } catch (error: any) {
            console.error(`   ⚠️  Error adding to ${correctCategory}: ${error.message}`);
          }
        } else {
          console.log(`   ⚠️  Could not determine correct category`);
        }
      } catch (error: any) {
        console.error(`   ❌ Error fixing ${pashtoWord}: ${error.message}`);
      }
    }
  }
  
  console.log(`\n✅ Fix complete!`);
  console.log(`   Removed ${removed} incorrect categorizations`);
  console.log(`   Fixed ${fixed} categorizations\n`);
}

// Run the fix
fixAllCategorizations().catch(console.error);

