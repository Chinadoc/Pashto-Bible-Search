/**
 * Curate Topics Entries - Comprehensive Bible Concordance Curation
 *
 * This script analyzes and curates the top 100 entries for each topic category,
 * ensuring >90% semantic fit, word diversity, and biblical relevance.
 *
 * Process:
 * 1. Analyze current category-verse mappings
 * 2. Score each entry for semantic relevance to category
 * 3. Filter entries with <90% fit threshold
 * 4. Ensure word diversity (different words, 1-2 verses max per word)
 * 5. Select top 100 highest-quality entries per category
 * 6. Generate cleanup SQL for database optimization
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';

const execAsync = promisify(exec);

// Comprehensive category definitions with keywords (same as create-word-categories.ts)
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
};

interface CategoryVerseMapping {
  category_key: string;
  pashto_word: string;
  verse_id: number;
  verse_ref: string;
  translation_key: string;
  testament: string;
  book: string;
  chapter: number;
  verse: number;
  english_translation?: string;
  romanization?: string;
}

interface CuratedEntry {
  category_key: string;
  pashto_word: string;
  verse_id: number;
  verse_ref: string;
  translation_key: string;
  testament: string;
  book: string;
  chapter: number;
  verse: number;
  relevance_score: number;
  word_frequency: number;
  verse_context_score: number;
}

/**
 * Calculate semantic relevance score for a word-translation pair to a category
 * Returns score from 0-1, where 1.0 = perfect fit, 0.0 = no fit
 */
function calculateRelevanceScore(
  englishTranslation: string,
  categoryKey: string,
  pashtoWord: string
): number {
  const categoryKeywords = CATEGORIES[categoryKey];
  if (!categoryKeywords) return 0;

  const translation = englishTranslation.toLowerCase();
  const words = translation.split(/[,;]\s*|\s+/).map(w => w.trim()).filter(w => w.length > 0);

  let totalScore = 0;
  let matches = 0;

  // Exact word matches get highest score
  for (const word of words) {
    for (const keyword of categoryKeywords) {
      if (word === keyword.toLowerCase()) {
        totalScore += 1.0; // Perfect match
        matches++;
        break;
      }
    }
  }

  // Partial matches (word boundaries) get medium score
  for (const word of words) {
    if (matches >= words.length) break; // All words already matched

    for (const keyword of categoryKeywords) {
      const keywordLower = keyword.toLowerCase();
      const regex = new RegExp(`\\b${keywordLower}\\b`, 'i');
      if (regex.test(word) && !words.some(w => w === keywordLower)) {
        totalScore += 0.8; // Good partial match
        matches++;
        break;
      }
    }
  }

  // Related concept matches get lower score
  const relatedConcepts: Record<string, string[]> = {
    'religious_concepts': ['god', 'lord', 'heaven', 'angel', 'spirit', 'holy', 'divine', 'eternal'],
    'emotions_positive': ['love', 'joy', 'peace', 'hope', 'mercy', 'grace', 'kindness', 'happiness'],
    'leadership': ['king', 'ruler', 'leader', 'judge', 'prophet', 'priest'],
    'family_general': ['father', 'mother', 'son', 'daughter', 'brother', 'sister', 'parent', 'child'],
  };

  if (relatedConcepts[categoryKey]) {
    for (const concept of relatedConcepts[categoryKey]) {
      if (translation.includes(concept)) {
        totalScore += 0.6; // Related concept match
        break;
      }
    }
  }

  // Normalize by number of words in translation (avoid over-weighting long translations)
  const normalizedScore = Math.min(totalScore / Math.max(words.length, 1), 1.0);

  return normalizedScore;
}

/**
 * Calculate verse context score based on biblical context and word frequency
 */
function calculateVerseContextScore(
  book: string,
  testament: string,
  wordFrequency: number,
  categoryKey: string
): number {
  let contextScore = 0.5; // Base score

  // Old Testament books tend to have more concrete/earthly content
  if (testament === 'OT') {
    if (categoryKey.includes('nature_') || categoryKey.includes('body_parts') || categoryKey.includes('food')) {
      contextScore += 0.2;
    }
  }

  // New Testament books tend to have more abstract/spiritual content
  if (testament === 'NT') {
    if (categoryKey.includes('religious_') || categoryKey.includes('abstract_') || categoryKey.includes('emotions_')) {
      contextScore += 0.2;
    }
  }

  // Moderate frequency words are preferred (not too rare, not too common)
  if (wordFrequency > 10 && wordFrequency < 500) {
    contextScore += 0.1;
  } else if (wordFrequency <= 10) {
    contextScore -= 0.1; // Too rare
  }

  return Math.max(0, Math.min(1, contextScore));
}

/**
 * Curate entries for a single category
 */
function curateCategoryEntries(
  mappings: CategoryVerseMapping[],
  categoryKey: string,
  maxEntries: number = 100
): CuratedEntry[] {
  const curated: CuratedEntry[] = [];

  // Group by word to enforce diversity
  const wordGroups = new Map<string, CategoryVerseMapping[]>();
  for (const mapping of mappings) {
    if (!wordGroups.has(mapping.pashto_word)) {
      wordGroups.set(mapping.pashto_word, []);
    }
    wordGroups.get(mapping.pashto_word)!.push(mapping);
  }

  // Process each word group
  for (const [pashtoWord, wordMappings] of wordGroups) {
    // Sort mappings by relevance score
    const scoredMappings = wordMappings.map(mapping => {
      const relevanceScore = calculateRelevanceScore(
        mapping.english_translation || '',
        categoryKey,
        pashtoWord
      );

      // Mock word frequency (would need actual frequency data)
      const wordFrequency = Math.floor(Math.random() * 1000) + 1;

      const contextScore = calculateVerseContextScore(
        mapping.book,
        mapping.testament,
        wordFrequency,
        categoryKey
      );

      const totalScore = (relevanceScore * 0.7) + (contextScore * 0.3);

      return {
        ...mapping,
        relevance_score: relevanceScore,
        word_frequency: wordFrequency,
        verse_context_score: contextScore,
        total_score: totalScore
      };
    }).sort((a, b) => b.total_score - a.total_score);

    // Take only top 1-2 entries per word (as requested)
    const entriesToTake = Math.min(scoredMappings.length, 2);
    for (let i = 0; i < entriesToTake; i++) {
      const entry = scoredMappings[i];
      if (entry.relevance_score >= 0.9) { // >90% threshold
        curated.push({
          category_key: categoryKey,
          pashto_word: pashtoWord,
          verse_id: entry.verse_id,
          verse_ref: entry.verse_ref,
          translation_key: entry.translation_key,
          testament: entry.testament,
          book: entry.book,
          chapter: entry.chapter,
          verse: entry.verse,
          relevance_score: entry.relevance_score,
          word_frequency: entry.word_frequency,
          verse_context_score: entry.verse_context_score
        });
      }
    }
  }

  // Sort by relevance score and take top entries
  return curated
    .sort((a, b) => b.relevance_score - a.relevance_score)
    .slice(0, maxEntries);
}

/**
 * Generate SQL to replace category_verse_mappings with curated entries
 */
function generateCleanupSQL(curatedEntries: CuratedEntry[]): string {
  if (curatedEntries.length === 0) return '';

  // Group by category for better organization
  const byCategory = new Map<string, CuratedEntry[]>();
  for (const entry of curatedEntries) {
    if (!byCategory.has(entry.category_key)) {
      byCategory.set(entry.category_key, []);
    }
    byCategory.get(entry.category_key)!.push(entry);
  }

  let sql = '-- =========================================\n';
  sql += '-- CURATED TOPICS ENTRIES CLEANUP SQL\n';
  sql += '-- Generated for highly curated Bible concordance\n';
  sql += '-- =========================================\n\n';

  sql += '-- Clear existing mappings for curated categories\n';
  const categories = Array.from(byCategory.keys());
  sql += `DELETE FROM category_verse_mappings WHERE category_key IN (${categories.map(c => `'${c}'`).join(', ')});\n\n`;

  // Insert curated entries
  sql += '-- Insert curated entries\n';
  for (const [categoryKey, entries] of byCategory) {
    sql += `-- ${categoryKey} (${entries.length} entries)\n`;
    sql += 'INSERT INTO category_verse_mappings (\n';
    sql += '  category_key, pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse\n';
    sql += ') VALUES\n';

    const values = entries.map(entry =>
      `('${entry.category_key}', '${entry.pashto_word.replace(/'/g, "''")}', ${entry.verse_id}, '${entry.verse_ref}', '${entry.translation_key}', '${entry.testament}', '${entry.book}', ${entry.chapter}, ${entry.verse})`
    );

    sql += values.join(',\n') + ';\n\n';
  }

  return sql;
}

/**
 * Main curation process
 */
async function curateTopicsEntries(): Promise<void> {
  console.log('🚀 Starting Topics Entries Curation Process\n');
  console.log('='.repeat(70));

  try {
    // Get all current category-verse mappings with English translations
    console.log('📊 Fetching current category-verse mappings...\n');

    const query = `
      SELECT
        cvm.category_key,
        cvm.pashto_word,
        cvm.verse_id,
        cvm.verse_ref,
        cvm.translation_key,
        cvm.testament,
        cvm.book,
        cvm.chapter,
        cvm.verse,
        wf.english_translation,
        wf.romanization,
        wf.frequency_total as word_frequency
      FROM category_verse_mappings cvm
      LEFT JOIN word_frequencies wf ON cvm.pashto_word = wf.pashto_word
      ORDER BY cvm.category_key, cvm.pashto_word, cvm.verse_ref
    `;

    const { stdout } = await execAsync(
      `npx wrangler d1 execute pashto-bible-db --remote --command="${query.replace(/"/g, '\\"')}" --json`,
      { maxBuffer: 50 * 1024 * 1024, timeout: 300000 }
    );

    const result = JSON.parse(stdout);
    const data = Array.isArray(result) ? result[0] : result;
    const allMappings: CategoryVerseMapping[] = data.results || [];

    console.log(`📊 Found ${allMappings.length} total mappings across all categories\n`);

    // Group by category
    const categoryMappings = new Map<string, CategoryVerseMapping[]>();
    for (const mapping of allMappings) {
      if (!categoryMappings.has(mapping.category_key)) {
        categoryMappings.set(mapping.category_key, []);
      }
      categoryMappings.get(mapping.category_key)!.push(mapping);
    }

    console.log(`📊 Processing ${categoryMappings.size} categories...\n`);

    // Curate each category
    const allCuratedEntries: CuratedEntry[] = [];
    let totalOriginal = 0;
    let totalCurated = 0;

    for (const [categoryKey, mappings] of categoryMappings) {
      console.log(`🔍 Curating ${categoryKey} (${mappings.length} entries)...`);

      const curated = curateCategoryEntries(mappings, categoryKey, 100);
      allCuratedEntries.push(...curated);

      totalOriginal += mappings.length;
      totalCurated += curated.length;

      console.log(`   → Curated: ${curated.length}/${mappings.length} entries (${((curated.length / mappings.length) * 100).toFixed(1)}% retained)`);

      // Show top relevance scores for this category
      if (curated.length > 0) {
        const avgRelevance = curated.reduce((sum, e) => sum + e.relevance_score, 0) / curated.length;
        const uniqueWords = new Set(curated.map(e => e.pashto_word)).size;
        console.log(`   → Avg relevance: ${(avgRelevance * 100).toFixed(1)}%, Unique words: ${uniqueWords}`);
      }
      console.log('');
    }

    // Generate cleanup SQL
    console.log('📝 Generating cleanup SQL...\n');
    const cleanupSQL = generateCleanupSQL(allCuratedEntries);

    // Write to file
    const sqlFilename = `curated_topics_cleanup_${new Date().toISOString().split('T')[0]}.sql`;
    fs.writeFileSync(sqlFilename, cleanupSQL);

    console.log('='.repeat(70));
    console.log('📊 CURATION SUMMARY:');
    console.log(`  Original entries: ${totalOriginal}`);
    console.log(`  Curated entries: ${totalCurated}`);
    console.log(`  Reduction: ${(((totalOriginal - totalCurated) / totalOriginal) * 100).toFixed(1)}%`);
    console.log(`  Categories processed: ${categoryMappings.size}`);
    console.log(`  SQL file generated: ${sqlFilename}`);
    console.log('='.repeat(70));

    // Show sample curated entries
    console.log('\n📋 SAMPLE CURATED ENTRIES:');
    const samples = allCuratedEntries.slice(0, 10);
    for (const entry of samples) {
      console.log(`  ${entry.category_key}: "${entry.pashto_word}" in ${entry.verse_ref} (${(entry.relevance_score * 100).toFixed(0)}% fit)`);
    }

    console.log('\n✅ Topics curation completed successfully!');
    console.log(`\n🎯 Next step: Review and execute ${sqlFilename} to apply changes to the database.`);

  } catch (error: any) {
    console.error('\n❌ Error during curation:', error);
    throw error;
  }
}

// Export functions for testing
export {
  calculateRelevanceScore,
  calculateVerseContextScore,
  curateCategoryEntries,
  generateCleanupSQL
};

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  curateTopicsEntries()
    .then(() => {
      console.log('\n✅ Script completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Error:', error);
      process.exit(1);
    });
}
