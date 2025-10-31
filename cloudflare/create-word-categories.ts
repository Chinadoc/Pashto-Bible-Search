/**
 * Create word categorization system for Anki topic browsing
 * 
 * Creates database tables and classifies words into 100+ semantic categories
 * based on their English translations.
 */

import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

// Comprehensive category definitions with keywords
const CATEGORIES: Record<string, string[]> = {
  // Body Parts
  'body_parts_head': ['head', 'hair', 'face', 'forehead', 'eye', 'ear', 'nose', 'mouth', 'lip', 'tooth', 'tongue', 'chin', 'cheek', 'neck', 'throat'],
  'body_parts_torso': ['chest', 'breast', 'back', 'shoulder', 'arm', 'hand', 'finger', 'palm', 'wrist', 'elbow', 'stomach', 'belly', 'waist', 'side', 'rib'],
  'body_parts_legs': ['leg', 'foot', 'toe', 'knee', 'thigh', 'ankle', 'heel', 'shin'],
  'body_parts_internal': ['heart', 'blood', 'bone', 'flesh', 'skin', 'vein', 'liver', 'kidney', 'lung', 'brain', 'soul', 'spirit'],
  
  // Family & Relationships
  'family_male': ['father', 'son', 'brother', 'husband', 'uncle', 'nephew', 'grandfather', 'grandson', 'father-in-law', 'son-in-law', 'brother-in-law'],
  'family_female': ['mother', 'daughter', 'sister', 'wife', 'aunt', 'niece', 'grandmother', 'granddaughter', 'mother-in-law', 'daughter-in-law', 'sister-in-law'],
  'family_general': ['family', 'relative', 'parent', 'child', 'children', 'offspring', 'descendant', 'ancestor', 'lineage', 'tribe', 'clan'],
  'relationships': ['friend', 'neighbor', 'companion', 'enemy', 'slave', 'servant', 'master', 'lord', 'king', 'queen', 'ruler'],
  
  // Time
  'time_periods': ['day', 'night', 'morning', 'evening', 'noon', 'midnight', 'dawn', 'dusk', 'hour', 'minute', 'moment', 'time', 'period', 'age', 'generation'],
  'time_days': ['today', 'yesterday', 'tomorrow', 'week', 'sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'],
  'time_months': ['month', 'year', 'season', 'spring', 'summer', 'autumn', 'winter', 'january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'],
  'time_concepts': ['past', 'present', 'future', 'forever', 'eternity', 'beginning', 'end', 'now', 'then', 'before', 'after', 'while', 'during'],
  
  // Numbers
  'numbers_cardinal': ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety', 'hundred', 'thousand', 'million'],
  'numbers_ordinal': ['first', 'second', 'third', 'fourth', 'fifth', 'last', 'next', 'previous'],
  'numbers_quantities': ['all', 'many', 'much', 'few', 'little', 'some', 'several', 'whole', 'half', 'double', 'triple', 'single', 'pair', 'couple'],
  
  // Weather & Nature
  'weather': ['rain', 'snow', 'wind', 'storm', 'cloud', 'thunder', 'lightning', 'sun', 'moon', 'star', 'sky', 'heaven', 'weather', 'temperature', 'hot', 'cold', 'warm', 'cool'],
  'nature_land': ['earth', 'land', 'ground', 'soil', 'dust', 'dirt', 'mountain', 'hill', 'valley', 'plain', 'desert', 'field', 'garden', 'forest', 'tree', 'grass', 'plant', 'flower', 'fruit'],
  'nature_water': ['water', 'river', 'sea', 'ocean', 'lake', 'pond', 'well', 'stream', 'spring', 'flood', 'wave', 'ice', 'snow'],
  'nature_animals': ['animal', 'beast', 'bird', 'fish', 'snake', 'lion', 'bear', 'wolf', 'fox', 'deer', 'sheep', 'goat', 'cow', 'ox', 'donkey', 'horse', 'camel', 'dog', 'cat', 'pig', 'chicken', 'cock', 'hen', 'eagle', 'dove', 'crow'],
  
  // Food & Drink
  'food': ['food', 'bread', 'meat', 'fish', 'fruit', 'grain', 'wheat', 'barley', 'corn', 'rice', 'salt', 'honey', 'milk', 'cheese', 'butter', 'oil', 'wine', 'water', 'drink', 'meal', 'feast', 'dinner', 'supper'],
  'cooking': ['cook', 'bake', 'roast', 'boil', 'fry', 'prepare', 'eat', 'drink', 'taste', 'hungry', 'thirsty'],
  
  // Clothing & Items
  'clothing': ['clothes', 'garment', 'robe', 'dress', 'shirt', 'coat', 'cloak', 'sandal', 'shoe', 'boot', 'hat', 'crown', 'belt', 'ring', 'jewel', 'jewelry'],
  'tools': ['tool', 'knife', 'sword', 'spear', 'bow', 'arrow', 'axe', 'hammer', 'stick', 'staff', 'rod', 'rope', 'cord', 'chain'],
  'containers': ['bag', 'basket', 'box', 'jar', 'pot', 'vessel', 'cup', 'bowl', 'dish', 'plate', 'bottle', 'flask'],
  
  // Buildings & Places
  'buildings': ['house', 'home', 'room', 'chamber', 'tent', 'temple', 'church', 'tower', 'wall', 'gate', 'door', 'window', 'roof', 'floor', 'corner', 'city', 'town', 'village', 'palace', 'throne', 'altar'],
  'places': ['place', 'location', 'land', 'country', 'nation', 'region', 'area', 'north', 'south', 'east', 'west', 'direction', 'way', 'path', 'road', 'street', 'bridge'],
  
  // Colors
  'colors': ['color', 'red', 'blue', 'green', 'yellow', 'white', 'black', 'brown', 'gray', 'grey', 'purple', 'pink', 'orange', 'gold', 'silver', 'bright', 'dark', 'light'],
  
  // Emotions & Feelings
  'emotions_positive': ['love', 'joy', 'happiness', 'glad', 'gladness', 'rejoice', 'peace', 'hope', 'comfort', 'mercy', 'grace', 'kindness', 'delight', 'pleasure', 'satisfaction'],
  'emotions_negative': ['fear', 'afraid', 'angry', 'anger', 'hate', 'sorrow', 'sad', 'sadness', 'grief', 'pain', 'suffering', 'trouble', 'distress', 'anxiety', 'worry', 'shame', 'guilt', 'regret'],
  
  // Actions - Physical
  'actions_move': ['go', 'come', 'walk', 'run', 'flee', 'escape', 'return', 'enter', 'exit', 'leave', 'depart', 'arrive', 'reach', 'approach', 'pass', 'cross', 'climb', 'fall', 'rise', 'stand', 'sit', 'lie', 'rest'],
  'actions_hand': ['take', 'give', 'put', 'place', 'set', 'throw', 'cast', 'lift', 'raise', 'lower', 'hold', 'grasp', 'grab', 'catch', 'release', 'send', 'bring', 'carry', 'bear', 'stretch', 'touch', 'feel'],
  'actions_communication': ['say', 'speak', 'tell', 'talk', 'call', 'cry', 'shout', 'yell', 'sing', 'praise', 'thank', 'bless', 'curse', 'pray', 'answer', 'reply', 'ask', 'question', 'hear', 'listen', 'understand', 'know', 'teach', 'learn'],
  'actions_see': ['see', 'look', 'watch', 'observe', 'behold', 'appear', 'show', 'reveal', 'hide', 'cover', 'uncover', 'open', 'close'],
  'actions_eat': ['eat', 'drink', 'feed', 'taste', 'hunger', 'thirst'],
  'actions_fight': ['fight', 'battle', 'war', 'attack', 'strike', 'hit', 'kill', 'slay', 'destroy', 'defeat', 'win', 'conquer', 'defend', 'protect', 'save', 'rescue', 'deliver'],
  'actions_build': ['build', 'make', 'create', 'form', 'shape', 'construct', 'destroy', 'break', 'tear', 'cut', 'divide', 'separate', 'join', 'unite', 'repair', 'fix'],
  
  // Verbs - Mental
  'mental_think': ['think', 'consider', 'remember', 'forget', 'remember', 'believe', 'trust', 'doubt', 'wonder', 'imagine', 'dream', 'hope', 'expect', 'plan', 'decide', 'choose', 'judge'],
  'mental_know': ['know', 'understand', 'comprehend', 'learn', 'teach', 'study', 'wisdom', 'knowledge', 'ignorance', 'foolish', 'wise', 'smart', 'stupid'],
  
  // States & Conditions
  'states_life': ['live', 'life', 'alive', 'dead', 'death', 'die', 'birth', 'born', 'grow', 'age', 'old', 'young', 'new', 'fresh'],
  'states_health': ['healthy', 'sick', 'ill', 'disease', 'wound', 'injury', 'heal', 'cure', 'pain', 'suffer', 'weak', 'strong', 'strength', 'power'],
  'states_size': ['big', 'large', 'great', 'small', 'little', 'tiny', 'huge', 'enormous', 'giant', 'short', 'long', 'tall', 'high', 'low', 'wide', 'narrow', 'thick', 'thin', 'deep', 'shallow'],
  'states_quality': ['good', 'bad', 'evil', 'right', 'wrong', 'true', 'false', 'real', 'fake', 'pure', 'clean', 'dirty', 'holy', 'sacred', 'unholy', 'sinful'],
  
  // Social & Religious
  'religious_concepts': ['god', 'lord', 'lord', 'jesus', 'christ', 'messiah', 'holy', 'sacred', 'divine', 'heaven', 'heavenly', 'angels', 'angel', 'devil', 'satan', 'demon', 'spirit', 'ghost', 'soul', 'eternal', 'immortal'],
  'religious_actions': ['pray', 'prayer', 'worship', 'praise', 'bless', 'blessing', 'curse', 'sacrifice', 'offer', 'offering', 'anoint', 'baptize', 'baptism', 'preach', 'prophesy', 'prophecy'],
  'religious_places': ['temple', 'church', 'synagogue', 'altar', 'sanctuary', 'holy place', 'heaven', 'paradise', 'hell', 'judgment'],
  'religious_objects': ['ark', 'covenant', 'law', 'commandment', 'scripture', 'book', 'scroll', 'idol', 'image', 'statue'],
  'leadership': ['king', 'queen', 'ruler', 'prince', 'princess', 'leader', 'chief', 'ruler', 'governor', 'judge', 'prophet', 'priest', 'servant', 'slave'],
  
  // Business & Economy
  'commerce': ['buy', 'sell', 'trade', 'money', 'gold', 'silver', 'coin', 'price', 'cost', 'pay', 'debt', 'owe', 'rich', 'poor', 'wealth', 'poverty', 'property', 'possession', 'inherit', 'inheritance'],
  'work': ['work', 'labor', 'toil', 'job', 'task', 'service', 'serve', 'employ', 'hire', 'worker', 'servant', 'slave', 'master'],
  
  // Abstract Concepts
  'abstract_good': ['good', 'goodness', 'righteousness', 'justice', 'truth', 'honesty', 'faithfulness', 'loyalty', 'trust', 'faith', 'hope', 'love', 'kindness', 'mercy', 'grace', 'peace', 'joy', 'happiness'],
  'abstract_bad': ['evil', 'sin', 'sinful', 'wicked', 'wrong', 'unjust', 'injustice', 'lie', 'falsehood', 'deceit', 'betrayal', 'treachery', 'violence', 'cruelty', 'hate', 'anger', 'wrath'],
  'abstract_concepts': ['law', 'commandment', 'rule', 'judgment', 'justice', 'mercy', 'grace', 'truth', 'lie', 'promise', 'covenant', 'agreement', 'peace', 'war', 'freedom', 'bondage', 'salvation', 'redemption'],
  
  // Parts of Speech (Grammatical)
  'grammar_pronouns': ['pronoun', 'i', 'you', 'he', 'she', 'it', 'we', 'they', 'this', 'that', 'these', 'those', 'who', 'what', 'which', 'my', 'your', 'his', 'her', 'our', 'their'],
  'grammar_prepositions': ['preposition', 'in', 'on', 'at', 'by', 'with', 'from', 'to', 'for', 'of', 'about', 'under', 'over', 'through', 'between', 'among', 'against', 'toward', 'until', 'since', 'during'],
  'grammar_conjunctions': ['conjunction', 'and', 'or', 'but', 'if', 'when', 'because', 'since', 'although', 'though', 'however', 'therefore', 'so', 'then'],
  'grammar_adverbs': ['adverb', 'very', 'much', 'more', 'most', 'less', 'least', 'well', 'badly', 'quickly', 'slowly', 'soon', 'now', 'then', 'here', 'there', 'always', 'never', 'often', 'sometimes', 'usually'],
  'grammar_adjectives': ['adjective', 'big', 'small', 'good', 'bad', 'new', 'old', 'young', 'hot', 'cold', 'long', 'short', 'high', 'low', 'right', 'left', 'east', 'west', 'north', 'south'],
  
  // Questions & Interrogatives
  'questions': ['who', 'what', 'where', 'when', 'why', 'how', 'which', 'whose', 'whom', 'question', 'ask', 'answer'],
  
  // Measurement & Quantity
  'measurement': ['measure', 'weight', 'length', 'width', 'height', 'depth', 'distance', 'size', 'amount', 'quantity', 'number', 'count', 'full', 'empty', 'half', 'whole'],
  
  // Direction & Position
  'direction': ['up', 'down', 'left', 'right', 'forward', 'backward', 'front', 'back', 'behind', 'before', 'after', 'above', 'below', 'under', 'over', 'inside', 'outside', 'north', 'south', 'east', 'west'],
  'position': ['position', 'place', 'location', 'here', 'there', 'where', 'near', 'far', 'close', 'distant', 'beside', 'next to', 'between', 'among', 'within', 'without'],
  
  // Materials
  'materials': ['gold', 'silver', 'bronze', 'brass', 'iron', 'steel', 'wood', 'stone', 'rock', 'clay', 'pottery', 'cloth', 'leather', 'wool', 'linen', 'silk', 'paper', 'ink'],
  
  // Activities
  'activities_daily': ['sleep', 'wake', 'awake', 'rest', 'work', 'eat', 'drink', 'bathe', 'wash', 'clean', 'dress', 'undress'],
  'activities_social': ['meet', 'gather', 'assembly', 'meeting', 'visit', 'greet', 'welcome', 'farewell', 'celebrate', 'feast', 'marriage', 'wedding', 'funeral', 'mourn'],
  
  // Descriptions
  'descriptions_appearance': ['beautiful', 'ugly', 'handsome', 'pretty', 'attractive', 'plain', 'colorful', 'bright', 'dark', 'shiny', 'dull'],
  'descriptions_character': ['brave', 'cowardly', 'bold', 'timid', 'courageous', 'fearful', 'honest', 'dishonest', 'faithful', 'unfaithful', 'loyal', 'disloyal', 'generous', 'stingy', 'kind', 'cruel'],
  
  // Age & Life Stages
  'age_stages': ['infant', 'baby', 'child', 'youth', 'young', 'adult', 'elder', 'old', 'aged', 'ancient', 'generation', 'age'],
  
  // Other Categories
  'miscellaneous': ['thing', 'object', 'item', 'stuff', 'matter', 'affair', 'business', 'event', 'happening', 'occasion', 'time', 'moment', 'chance', 'opportunity'],
};

// Category metadata with descriptions
const CATEGORY_METADATA: Record<string, { name: string; description: string }> = {};

// Initialize category metadata
Object.keys(CATEGORIES).forEach(key => {
  const name = key.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  CATEGORY_METADATA[key] = {
    name,
    description: `Words related to ${name.toLowerCase()}`,
  };
});

/**
 * Classify a word into categories based on its English translation
 */
function classifyWord(englishTranslation: string, pos?: string): string[] {
  const categories: Set<string> = new Set();
  const englishLower = englishTranslation.toLowerCase();
  
  // Check each category's keywords
  for (const [category, keywords] of Object.entries(CATEGORIES)) {
    for (const keyword of keywords) {
      // Check if keyword appears in translation
      if (englishLower.includes(keyword.toLowerCase())) {
        categories.add(category);
        break; // Word can belong to multiple categories, but only add once per category
      }
    }
  }
  
  // Also classify by POS if no semantic categories found
  if (categories.size === 0 && pos) {
    const posLower = pos.toLowerCase();
    if (posLower.includes('pron')) categories.add('grammar_pronouns');
    if (posLower.includes('prep') || posLower.includes('adpos')) categories.add('grammar_prepositions');
    if (posLower.includes('conj')) categories.add('grammar_conjunctions');
    if (posLower.includes('adv')) categories.add('grammar_adverbs');
    if (posLower.includes('adj')) categories.add('grammar_adjectives');
  }
  
  return Array.from(categories);
}

async function createTables(): Promise<void> {
  console.log('📊 Creating database tables for word categories...\n');
  
  const createTablesSQL = `
-- Categories table
CREATE TABLE IF NOT EXISTS word_categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  category_key TEXT NOT NULL UNIQUE,
  category_name TEXT NOT NULL,
  description TEXT,
  parent_category TEXT,
  created_at INTEGER DEFAULT (strftime('%s', 'now')),
  updated_at INTEGER DEFAULT (strftime('%s', 'now'))
);

-- Word category mappings
CREATE TABLE IF NOT EXISTS word_category_mappings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  pashto_word TEXT NOT NULL,
  category_key TEXT NOT NULL,
  confidence REAL DEFAULT 1.0,
  created_at INTEGER DEFAULT (strftime('%s', 'now')),
  UNIQUE(pashto_word, category_key)
);

-- Category verse mappings (for Anki browsing)
CREATE TABLE IF NOT EXISTS category_verse_mappings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  category_key TEXT NOT NULL,
  pashto_word TEXT NOT NULL,
  verse_id INTEGER NOT NULL,
  verse_ref TEXT NOT NULL,
  translation_key TEXT NOT NULL,
  testament TEXT NOT NULL,
  book TEXT NOT NULL,
  chapter INTEGER NOT NULL,
  verse INTEGER NOT NULL,
  created_at INTEGER DEFAULT (strftime('%s', 'now')),
  UNIQUE(category_key, pashto_word, verse_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_word_category_pashto ON word_category_mappings(pashto_word);
CREATE INDEX IF NOT EXISTS idx_word_category_key ON word_category_mappings(category_key);
CREATE INDEX IF NOT EXISTS idx_category_verse_key ON category_verse_mappings(category_key);
CREATE INDEX IF NOT EXISTS idx_category_verse_word ON category_verse_mappings(pashto_word);
CREATE INDEX IF NOT EXISTS idx_category_verse_ref ON category_verse_mappings(verse_ref);
`;

  try {
    await execAsync(
      `npx wrangler d1 execute pashto-bible-db --remote --command="${createTablesSQL.replace(/"/g, '\\"')}"`,
      { timeout: 60000 }
    );
    console.log('✅ Tables created successfully\n');
  } catch (error: any) {
    console.error(`❌ Error creating tables: ${error.message}`);
    throw error;
  }
}

async function populateCategories(): Promise<void> {
  console.log('📝 Populating categories table...\n');
  
  const categories = Object.entries(CATEGORY_METADATA).map(([key, meta]) => {
    return `('${key.replace(/'/g, "''")}', '${meta.name.replace(/'/g, "''")}', '${meta.description.replace(/'/g, "''")}', NULL)`;
  }).join(',\n');
  
  const insertSQL = `
INSERT OR REPLACE INTO word_categories (category_key, category_name, description, parent_category)
VALUES ${categories};
`;

  try {
    await execAsync(
      `npx wrangler d1 execute pashto-bible-db --remote --command="${insertSQL.replace(/"/g, '\\"')}"`,
      { timeout: 60000 }
    );
    console.log(`✅ Inserted ${Object.keys(CATEGORY_METADATA).length} categories\n`);
  } catch (error: any) {
    console.error(`❌ Error populating categories: ${error.message}`);
    throw error;
  }
}

async function classifyAllWords(): Promise<void> {
  console.log('🔍 Classifying words into categories...\n');
  
  // Get all words with English translations
  const { stdout } = await execAsync(
    `npx wrangler d1 execute pashto-bible-db --remote --command="SELECT pashto_word, english_translation, pos FROM word_frequencies WHERE english_translation IS NOT NULL AND english_translation != '';" --json`,
    { maxBuffer: 50 * 1024 * 1024, timeout: 120000 }
  );
  
  const result = JSON.parse(stdout);
  const data = Array.isArray(result) ? result[0] : result;
  const words = data.results || [];
  
  console.log(`📊 Found ${words.length} words to classify\n`);
  
  // Classify words
  const mappings: Array<{ pashto_word: string; category_key: string }> = [];
  
  for (const word of words) {
    const categories = classifyWord(word.english_translation, word.pos);
    for (const category of categories) {
      mappings.push({
        pashto_word: word.pashto_word,
        category_key: category,
      });
    }
  }
  
  console.log(`📊 Generated ${mappings.length} word-category mappings\n`);
  
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
      console.error(`\n⚠️  Error inserting batch: ${error.message}`);
    }
  }
  
  console.log(`\n✅ Classified ${words.length} words into categories\n`);
}

async function linkVersesToCategories(): Promise<void> {
  console.log('🔗 Linking verses to categories...\n');
  
  // Get all word-verse mappings
  const { stdout } = await execAsync(
    `npx wrangler d1 execute pashto-bible-db --remote --command="SELECT pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse FROM word_verse_mapping LIMIT 10000;" --json`,
    { maxBuffer: 50 * 1024 * 1024, timeout: 120000 }
  );
  
  const result = JSON.parse(stdout);
  const data = Array.isArray(result) ? result[0] : result;
  const verseMappings = data.results || [];
  
  console.log(`📊 Found ${verseMappings.length} word-verse mappings\n`);
  
  // Get word categories
  const { stdout: catStdout } = await execAsync(
    `npx wrangler d1 execute pashto-bible-db --remote --command="SELECT pashto_word, category_key FROM word_category_mappings;" --json`,
    { maxBuffer: 50 * 1024 * 1024, timeout: 120000 }
  );
  
  const catResult = JSON.parse(catStdout);
  const catData = Array.isArray(catResult) ? catResult[0] : catResult;
  const wordCategories = catData.results || [];
  
  // Build word -> categories map
  const wordToCategories = new Map<string, string[]>();
  for (const wc of wordCategories) {
    if (!wordToCategories.has(wc.pashto_word)) {
      wordToCategories.set(wc.pashto_word, []);
    }
    wordToCategories.get(wc.pashto_word)!.push(wc.category_key);
  }
  
  console.log(`📊 Found categories for ${wordToCategories.size} words\n`);
  
  // Create category-verse mappings
  const categoryVerses: Array<{
    category_key: string;
    pashto_word: string;
    verse_id: number;
    verse_ref: string;
    translation_key: string;
    testament: string;
    book: string;
    chapter: number;
    verse: number;
  }> = [];
  
  for (const vm of verseMappings) {
    const categories = wordToCategories.get(vm.pashto_word) || [];
    for (const category of categories) {
      categoryVerses.push({
        category_key: category,
        pashto_word: vm.pashto_word,
        verse_id: vm.verse_id,
        verse_ref: vm.verse_ref,
        translation_key: vm.translation_key,
        testament: vm.testament,
        book: vm.book,
        chapter: vm.chapter,
        verse: vm.verse,
      });
    }
  }
  
  console.log(`📊 Generated ${categoryVerses.length} category-verse mappings\n`);
  
  // Insert in batches
  const batchSize = 100;
  let inserted = 0;
  
  for (let i = 0; i < categoryVerses.length; i += batchSize) {
    const batch = categoryVerses.slice(i, i + batchSize);
    const values = batch.map(cv => 
      `('${cv.category_key.replace(/'/g, "''")}', '${cv.pashto_word.replace(/'/g, "''")}', ${cv.verse_id}, '${cv.verse_ref.replace(/'/g, "''")}', '${cv.translation_key.replace(/'/g, "''")}', '${cv.testament.replace(/'/g, "''")}', '${cv.book.replace(/'/g, "''")}', ${cv.chapter}, ${cv.verse})`
    ).join(',\n');
    
    const insertSQL = `
INSERT OR IGNORE INTO category_verse_mappings (
  category_key, pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse
)
VALUES ${values};
`;
    
    try {
      await execAsync(
        `npx wrangler d1 execute pashto-bible-db --remote --command="${insertSQL.replace(/"/g, '\\"')}"`,
        { timeout: 60000 }
      );
      inserted += batch.length;
      process.stdout.write(`\r  Inserted ${inserted}/${categoryVerses.length} mappings...`);
    } catch (error: any) {
      console.error(`\n⚠️  Error inserting batch: ${error.message}`);
    }
  }
  
  console.log(`\n✅ Linked verses to categories\n`);
}

async function main(): Promise<void> {
  console.log('🚀 Creating Word Categorization System\n');
  console.log('='.repeat(70));
  
  try {
    await createTables();
    await populateCategories();
    await classifyAllWords();
    await linkVersesToCategories();
    
    // Show summary
    const { stdout: summaryOut } = await execAsync(
      `npx wrangler d1 execute pashto-bible-db --remote --command="SELECT COUNT(DISTINCT category_key) as categories, COUNT(*) as mappings FROM word_category_mappings; SELECT COUNT(*) as verse_mappings FROM category_verse_mappings;" --json`,
      { maxBuffer: 10 * 1024 * 1024 }
    );
    
    const summaryResult = JSON.parse(summaryOut);
    const summaryData = Array.isArray(summaryResult) ? summaryResult : [summaryResult];
    
    console.log('\n' + '='.repeat(70));
    console.log('📊 Summary:');
    if (summaryData[0]?.results) {
      const stats = summaryData[0].results[0];
      console.log(`  Categories: ${stats.categories}`);
      console.log(`  Word-Category Mappings: ${stats.mappings}`);
    }
    if (summaryData[1]?.results) {
      const verseStats = summaryData[1].results[0];
      console.log(`  Category-Verse Mappings: ${verseStats.verse_mappings}`);
    }
    console.log('='.repeat(70));
    console.log('✅ Word categorization system created successfully!');
  } catch (error: any) {
    console.error('\n❌ Error:', error);
    throw error;
  }
}

if (require.main === module) {
  main()
    .then(() => {
      console.log('\n✅ Script completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Error:', error);
      process.exit(1);
    });
}

export { classifyWord, CATEGORIES, CATEGORY_METADATA };

