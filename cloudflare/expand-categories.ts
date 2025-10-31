/**
 * Expand word categories from 68 to 100+
 */

import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

// Additional categories to reach 100+
const ADDITIONAL_CATEGORIES: Record<string, string[]> = {
  'music_instruments': ['music', 'song', 'sing', 'harp', 'flute', 'trumpet', 'horn', 'drum', 'instrument', 'melody', 'sound', 'voice'],
  'writing': ['write', 'writing', 'book', 'scroll', 'letter', 'word', 'document', 'record', 'inscription'],
  'seasons': ['spring', 'summer', 'autumn', 'fall', 'winter', 'season'],
  'geography': ['mountain', 'hill', 'valley', 'river', 'sea', 'ocean', 'lake', 'island', 'coast', 'shore'],
  'transportation': ['cart', 'chariot', 'wagon', 'ship', 'boat', 'ride', 'travel', 'journey'],
  'farming': ['farm', 'field', 'crop', 'harvest', 'plow', 'sow', 'plant', 'seed', 'grain', 'vineyard', 'olive'],
  'military': ['army', 'soldier', 'warrior', 'fight', 'battle', 'war', 'weapon', 'shield', 'helmet', 'armor'],
  'legal': ['law', 'judge', 'judgment', 'court', 'trial', 'witness', 'testimony', 'guilty', 'innocent', 'punish'],
  'education': ['teach', 'learn', 'student', 'teacher', 'school', 'knowledge', 'wisdom', 'understand'],
  'medical': ['doctor', 'heal', 'cure', 'medicine', 'sick', 'ill', 'disease', 'wound', 'injury', 'pain'],
  'religion_people': ['priest', 'prophet', 'apostle', 'disciple', 'saint', 'believer', 'unbeliever'],
  'religion_events': ['resurrection', 'ascension', 'crucifixion', 'birth', 'death', 'burial'],
  'agriculture': ['sheep', 'goat', 'cow', 'ox', 'donkey', 'horse', 'camel', 'flock', 'herd'],
  'time_specific': ['sabbath', 'passover', 'feast', 'festival', 'holiday', 'celebration'],
  'nature_plants': ['tree', 'bush', 'thorn', 'branch', 'leaf', 'root', 'fruit', 'seed'],
  'light_dark': ['light', 'dark', 'darkness', 'bright', 'shine', 'glow', 'lamp', 'candle', 'torch', 'flame'],
  'water_related': ['water', 'drink', 'thirst', 'well', 'spring', 'fountain', 'rain', 'flood'],
  'fire_related': ['fire', 'burn', 'flame', 'smoke', 'ash', 'coal', 'heat', 'hot'],
  'senses': ['see', 'hear', 'smell', 'taste', 'touch', 'feel', 'sight', 'sound', 'voice'],
  'body_actions': ['walk', 'run', 'jump', 'dance', 'sit', 'stand', 'lie', 'sleep', 'wake'],
  'mind_actions': ['think', 'remember', 'forget', 'believe', 'doubt', 'know', 'understand', 'learn'],
  'emotions_extreme': ['terrified', 'astonished', 'amazed', 'overwhelmed', 'desperate', 'hopeless'],
  'relationships_close': ['friend', 'companion', 'partner', 'ally', 'helper', 'supporter'],
  'relationships_conflict': ['enemy', 'foe', 'opponent', 'adversary', 'rival', 'betray'],
  'quantities_large': ['many', 'multitude', 'crowd', 'thousands', 'hundreds', 'countless'],
  'quantities_small': ['few', 'little', 'small', 'single', 'one', 'alone', 'only'],
  'spatial_inside': ['inside', 'within', 'interior', 'inner', 'internal'],
  'spatial_outside': ['outside', 'without', 'exterior', 'outer', 'external'],
  'spatial_up': ['up', 'above', 'over', 'top', 'upper', 'high', 'heaven'],
  'spatial_down': ['down', 'below', 'under', 'bottom', 'lower', 'low', 'ground'],
  'measurement_weight': ['weight', 'heavy', 'light', 'pound', 'talent', 'shekel'],
  'measurement_length': ['length', 'long', 'short', 'cubit', 'foot', 'mile'],
  'measurement_time': ['hour', 'day', 'week', 'month', 'year', 'generation'],
  'materials_metal': ['gold', 'silver', 'bronze', 'brass', 'iron', 'steel', 'copper'],
  'materials_stone': ['stone', 'rock', 'marble', 'gem', 'precious', 'diamond', 'pearl'],
  'materials_organic': ['wood', 'tree', 'log', 'branch', 'leather', 'wool', 'hair'],
  'cloth_types': ['linen', 'wool', 'silk', 'cotton', 'cloth', 'fabric', 'garment'],
};

function classifyWord(englishTranslation: string): string[] {
  const categories: Set<string> = new Set();
  const englishLower = englishTranslation.toLowerCase();
  
  // Split translation into words (handle commas, semicolons, spaces)
  const words = englishLower.split(/[,;]\s*|\s+/).map(w => w.trim()).filter(w => w.length > 0);
  
  for (const [category, keywords] of Object.entries(ADDITIONAL_CATEGORIES)) {
    for (const keyword of keywords) {
      const keywordLower = keyword.toLowerCase();
      
      // Check if keyword appears as a whole word
      for (const word of words) {
        // Check exact match first
        if (word === keywordLower) {
          categories.add(category);
          break;
        }
        
        // Check word boundary matching
        const escapedKeyword = keywordLower.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(`\\b${escapedKeyword}\\b`, 'i');
        if (regex.test(word)) {
          categories.add(category);
          break;
        }
      }
      
      if (categories.has(category)) break;
    }
  }
  
  return Array.from(categories);
}

async function expandCategories(): Promise<void> {
  console.log('📊 Expanding categories to 100+\n');
  
  // Insert new categories
  const categoryEntries = Object.entries(ADDITIONAL_CATEGORIES).map(([key, keywords]) => {
    const name = key.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    const description = `Words related to ${name.toLowerCase()}`;
    return `('${key.replace(/'/g, "''")}', '${name.replace(/'/g, "''")}', '${description.replace(/'/g, "''")}', NULL)`;
  }).join(',\n');
  
  const insertSQL = `
INSERT OR IGNORE INTO word_categories (category_key, category_name, description, parent_category)
VALUES ${categoryEntries};
`;

  try {
    await execAsync(
      `npx wrangler d1 execute pashto-bible-db --remote --command="${insertSQL.replace(/"/g, '\\"')}"`,
      { timeout: 60000 }
    );
    console.log(`✅ Inserted ${Object.keys(ADDITIONAL_CATEGORIES).length} additional categories\n`);
  } catch (error: any) {
    console.error(`❌ Error: ${error.message}`);
    throw error;
  }
  
  // Classify words with new categories
  console.log('🔍 Classifying words with new categories...\n');
  
  const { stdout } = await execAsync(
    `npx wrangler d1 execute pashto-bible-db --remote --command="SELECT pashto_word, english_translation FROM word_frequencies WHERE english_translation IS NOT NULL AND english_translation != '';" --json`,
    { maxBuffer: 50 * 1024 * 1024, timeout: 120000 }
  );
  
  const result = JSON.parse(stdout);
  const data = Array.isArray(result) ? result[0] : result;
  const words = data.results || [];
  
  const mappings: Array<{ pashto_word: string; category_key: string }> = [];
  
  for (const word of words) {
    const categories = classifyWord(word.english_translation);
    for (const category of categories) {
      mappings.push({
        pashto_word: word.pashto_word,
        category_key: category,
      });
    }
  }
  
  console.log(`📊 Generated ${mappings.length} additional word-category mappings\n`);
  
  // Insert mappings in batches
  const batchSize = 100;
  let inserted = 0;
  
  for (let i = 0; i < mappings.length; i += batchSize) {
    const batch = mappings.slice(i, i + batchSize);
    const values = batch.map(m => 
      `('${m.pashto_word.replace(/'/g, "''")}', '${m.category_key.replace(/'/g, "''")}')`
    ).join(',\n');
    
    const insertSQL = `
INSERT OR IGNORE INTO word_category_mappings (pashto_word, category_key)
VALUES ${values};
`;
    
    try {
      await execAsync(
        `npx wrangler d1 execute pashto-bible-db --remote --command="${insertSQL.replace(/"/g, '\\"')}"`,
        { timeout: 60000 }
      );
      inserted += batch.length;
      process.stdout.write(`\r  Inserted ${inserted}/${mappings.length} mappings...`);
    } catch (error: any) {
      console.error(`\n⚠️  Error: ${error.message}`);
    }
  }
  
  console.log(`\n✅ Expansion complete!`);
  
  // Show summary
  const { stdout: summaryOut } = await execAsync(
    `npx wrangler d1 execute pashto-bible-db --remote --command="SELECT COUNT(*) as total FROM word_categories; SELECT COUNT(*) as mappings FROM word_category_mappings;" --json`,
    { maxBuffer: 10 * 1024 * 1024 }
  );
  
  const summaryResult = JSON.parse(summaryOut);
  const summaryData = Array.isArray(summaryResult) ? summaryResult : [summaryResult];
  
  console.log('\n📊 Final Summary:');
  if (summaryData[0]?.results) {
    console.log(`  Total Categories: ${summaryData[0].results[0].total}`);
  }
  if (summaryData[1]?.results) {
    console.log(`  Total Word-Category Mappings: ${summaryData[1].results[0].mappings}`);
  }
}

if (require.main === module) {
  expandCategories()
    .then(() => {
      console.log('\n✅ Script completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Error:', error);
      process.exit(1);
    });
}

export { expandCategories };

