/**
 * Advanced Topics Curation with Pashto Linguistic Analysis
 * 
 * This script performs deep linguistic analysis to ensure >90% semantic fit:
 * 1. Fetches actual verse text for context verification
 * 2. Analyzes Pashto word semantics using dictionary definitions
 * 3. Validates category fit based on actual word meaning in context
 * 4. Removes false positives (e.g., "ټول" / "all" under "activities_social")
 * 5. Ensures word diversity and biblical relevance
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';

const execAsync = promisify(exec);

// Known problematic word-category mismatches
// These are words that should NEVER appear in certain categories regardless of context
const KNOWN_MISMATCHES: Record<string, string[]> = {
  'activities_social': ['ټول', 'تول', 'د', 'په', 'او', 'چې', 'کې'], // "all" and common particles don't belong in social activities
  'measurement': ['ټول', 'تول'], // "all" is not a measurement term
  'actions_communication': ['ټول', 'تول'], // "all" is not a communication verb
  'actions_move': ['ټول', 'تول'], // "all" is not a movement verb
  'actions_see': ['ټول', 'تول'], // "all" is not a sight verb
  'body_parts_head': ['ټول', 'تول'], // "all" is not a body part
  'body_parts_torso': ['ټول', 'تول'], // "all" is not a body part
  'body_parts_legs': ['ټول', 'تول'], // "all" is not a body part
  'food': ['ټول', 'تول'], // "all" is not food
  'clothing': ['ټول', 'تول'], // "all" is not clothing
  'buildings': ['ټول', 'تول'], // "all" is not a building
  'nature_animals': ['ټول', 'تول'], // "all" is not an animal
  'weather': ['ټول', 'تول'], // "all" is not weather
};

// Words that require extra context verification even if translation matches
const CONTEXT_REQUIRED_WORDS: string[] = ['ټول', 'تول']; // "all" needs verse context to verify semantic fit

// Comprehensive category definitions with keywords (from create-word-categories.ts)
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
  verse_text?: string;
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
  context_verified: boolean;
}

/**
 * Check if Pashto word appears in verse text with proper context
 */
function wordInVerseContext(verseText: string, pashtoWord: string): boolean {
  if (!verseText || !pashtoWord) return false;
  
  // Check if word appears in verse (handling variations)
  const normalizedWord = pashtoWord.trim();
  const normalizedVerse = verseText.trim();
  
  // Simple substring match (can be enhanced with word boundaries)
  return normalizedVerse.includes(normalizedWord);
}

/**
 * Calculate semantic relevance using Pashto word analysis
 * Returns score 0-1, where >0.9 = acceptable fit
 */
function calculatePashtoSemanticRelevance(
  pashtoWord: string,
  englishTranslation: string,
  categoryKey: string,
  verseText?: string
): number {
  const categoryKeywords = CATEGORIES[categoryKey];
  if (!categoryKeywords) return 0;

  // Check for known mismatches FIRST - these are absolute exclusions
  if (KNOWN_MISMATCHES[categoryKey]?.includes(pashtoWord)) {
    return 0; // Explicit mismatch - immediate rejection
  }

  // For context-required words, we need verse text to verify
  if (CONTEXT_REQUIRED_WORDS.includes(pashtoWord) && !verseText) {
    return 0; // Reject if context required but not available
  }

  const translation = (englishTranslation || '').toLowerCase();
  const words = translation.split(/[,;]\s*|\s+/).map(w => w.trim()).filter(w => w.length > 0);

  // If no translation available, can't verify semantic fit
  if (words.length === 0) {
    return 0;
  }

  let totalScore = 0;
  let matches = 0;

  // Exact word matches
  for (const word of words) {
    for (const keyword of categoryKeywords) {
      if (word === keyword.toLowerCase()) {
        totalScore += 1.0;
        matches++;
        break;
      }
    }
  }

  // Word boundary matches
  for (const word of words) {
    if (matches >= words.length) break;

    for (const keyword of categoryKeywords) {
      const keywordLower = keyword.toLowerCase();
      const regex = new RegExp(`\\b${keywordLower}\\b`, 'i');
      if (regex.test(word) && !words.some(w => w === keywordLower)) {
        totalScore += 0.8;
        matches++;
        break;
      }
    }
  }

  // If no matches found, reject - we need explicit semantic match
  if (matches === 0) {
    return 0; // Very conservative - reject if no translation match
  }

  // Normalize score
  const normalizedScore = Math.min(totalScore / Math.max(words.length, 1), 1.0);

  // Additional penalty for common words that might be false positives
  const commonWords = ['ټول', 'تول', 'د', 'په', 'او', 'چې', 'کې']; // Common Pashto words
  if (commonWords.includes(pashtoWord)) {
    // For common words, require perfect match AND context verification
    if (normalizedScore < 0.95) {
      return 0; // Reject if not perfect match
    }
    if (!verseText) {
      return 0; // Reject if no context available
    }
  }

  return normalizedScore;
}

/**
 * Fetch verse text from database
 */
async function fetchVerseText(
  book: string,
  chapter: number,
  verse: number,
  translationKey: string
): Promise<string | null> {
  try {
    const tableName = translationKey === 'afghan2023' 
      ? 'verses_afghan2023' 
      : 'verses_yousafzai';

    const query = `
      SELECT text 
      FROM ${tableName}
      WHERE book = '${book.replace(/'/g, "''")}' 
        AND chapter = ${chapter} 
        AND verse = ${verse}
      LIMIT 1
    `;

    const { stdout } = await execAsync(
      `npx wrangler d1 execute pashto-bible-db --remote --command="${query.replace(/"/g, '\\"')}" --json`,
      { maxBuffer: 10 * 1024 * 1024, timeout: 30000 }
    );

    const result = JSON.parse(stdout);
    const data = Array.isArray(result) ? result[0] : result;
    const rows = data.results || [];
    
    return rows.length > 0 ? rows[0].text : null;
  } catch (error) {
    console.error(`Error fetching verse text for ${book} ${chapter}:${verse}:`, error);
    return null;
  }
}

/**
 * Curate entries with linguistic validation
 */
async function curateWithLinguisticAnalysis(
  mappings: CategoryVerseMapping[],
  categoryKey: string,
  maxUniqueWords: number = 100
): Promise<CuratedEntry[]> {
  const curated: CuratedEntry[] = [];

  // Group by word for diversity enforcement
  const wordGroups = new Map<string, CategoryVerseMapping[]>();
  for (const mapping of mappings) {
    if (!wordGroups.has(mapping.pashto_word)) {
      wordGroups.set(mapping.pashto_word, []);
    }
    wordGroups.get(mapping.pashto_word)!.push(mapping);
  }

  // Score all words first, then select top unique words
  const wordScores: Array<{
    pashtoWord: string;
    bestScore: number;
    bestEntries: CuratedEntry[];
  }> = [];

  // Process each word group
  for (const [pashtoWord, wordMappings] of wordGroups) {
    // Check exclusions FIRST before fetching verse text
    const isExcluded = KNOWN_MISMATCHES[categoryKey]?.includes(pashtoWord);
    if (isExcluded) {
      continue; // Skip this word entirely - it's explicitly excluded
    }

    // Fetch verse texts only for context-required words or when needed for verification
    const mappingsWithText = await Promise.all(
      wordMappings.map(async (mapping) => {
        // Only fetch verse text if word requires context verification
        const needsContext = CONTEXT_REQUIRED_WORDS.includes(pashtoWord) || 
                           ['ټول', 'تول', 'د', 'په', 'او', 'چې', 'کې'].includes(pashtoWord);
        const verseText = needsContext 
          ? await fetchVerseText(
              mapping.book,
              mapping.chapter,
              mapping.verse,
              mapping.translation_key
            )
          : null;
        return { ...mapping, verse_text: verseText };
      })
    );

    // Score each mapping
    const scoredMappings = mappingsWithText.map(mapping => {
      const relevanceScore = calculatePashtoSemanticRelevance(
        pashtoWord,
        mapping.english_translation || '',
        categoryKey,
        mapping.verse_text || undefined
      );

      const contextVerified = mapping.verse_text 
        ? wordInVerseContext(mapping.verse_text, pashtoWord)
        : false;

      return {
        ...mapping,
        relevance_score: relevanceScore,
        context_verified: contextVerified,
        total_score: relevanceScore * (contextVerified ? 1.1 : 1.0) // Bonus for context verification
      };
    }).filter(m => m.relevance_score >= 0.9) // Only >90% matches
      .sort((a, b) => b.total_score - a.total_score);

    // Take top 1-2 entries per word (as requested)
    const entriesToTake = Math.min(scoredMappings.length, 2);
    const bestEntries: CuratedEntry[] = [];
    
    for (let i = 0; i < entriesToTake; i++) {
      const entry = scoredMappings[i];
      bestEntries.push({
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
        context_verified: entry.context_verified
      });
    }

    if (bestEntries.length > 0) {
      wordScores.push({
        pashtoWord,
        bestScore: bestEntries[0].relevance_score,
        bestEntries
      });
    }
  }

  // Sort words by best score and take top unique words
  wordScores.sort((a, b) => b.bestScore - a.bestScore);

  // Take top N unique words (each with 1-2 verses)
  const selectedWords = wordScores.slice(0, maxUniqueWords);
  
  // Add all entries from selected words
  for (const wordData of selectedWords) {
    curated.push(...wordData.bestEntries);
  }

  return curated;
}

/**
 * Main curation process with linguistic analysis
 */
async function curateTopicsWithLinguistics(): Promise<void> {
  console.log('🚀 Starting Advanced Topics Curation with Pashto Linguistic Analysis\n');
  console.log('='.repeat(70));

  try {
    // Get all current category-verse mappings
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
        wf.romanization
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

    console.log(`📊 Found ${allMappings.length} total mappings\n`);

    // Group by category
    const categoryMappings = new Map<string, CategoryVerseMapping[]>();
    for (const mapping of allMappings) {
      if (!categoryMappings.has(mapping.category_key)) {
        categoryMappings.set(mapping.category_key, []);
      }
      categoryMappings.get(mapping.category_key)!.push(mapping);
    }

    console.log(`📊 Processing ${categoryMappings.size} categories with linguistic analysis...\n`);

    // Curate each category
    const allCuratedEntries: CuratedEntry[] = [];
    let totalOriginal = 0;
    let totalCurated = 0;

    for (const [categoryKey, mappings] of categoryMappings) {
      console.log(`🔍 Curating ${categoryKey} (${mappings.length} entries)...`);

      const curated = await curateWithLinguisticAnalysis(mappings, categoryKey, 100);
      allCuratedEntries.push(...curated);

      totalOriginal += mappings.length;
      totalCurated += curated.length;

      if (curated.length > 0) {
        const avgRelevance = curated.reduce((sum, e) => sum + e.relevance_score, 0) / curated.length;
        const uniqueWords = new Set(curated.map(e => e.pashto_word)).size;
        const contextVerified = curated.filter(e => e.context_verified).length;
        console.log(`   → Curated: ${curated.length} entries from ${uniqueWords} unique words (target: 100)`);
        console.log(`   → Avg relevance: ${(avgRelevance * 100).toFixed(1)}%, Context verified: ${contextVerified}`);
      } else {
        console.log(`   → No entries passed >90% threshold`);
      }
      console.log('');
    }

    // Generate cleanup SQL
    console.log('📝 Generating cleanup SQL...\n');
    const cleanupSQL = generateCleanupSQL(allCuratedEntries);

    // Write to file
    const sqlFilename = `curated_topics_linguistic_${new Date().toISOString().split('T')[0]}.sql`;
    fs.writeFileSync(sqlFilename, cleanupSQL);

    console.log('='.repeat(70));
    console.log('📊 CURATION SUMMARY:');
    console.log(`  Original entries: ${totalOriginal}`);
    console.log(`  Curated entries: ${totalCurated}`);
    const uniqueWordsTotal = new Set(allCuratedEntries.map(e => e.pashto_word)).size;
    console.log(`  Unique words: ${uniqueWordsTotal} (target: 100 per category)`);
    console.log(`  Reduction: ${(((totalOriginal - totalCurated) / totalOriginal) * 100).toFixed(1)}%`);
    console.log(`  Categories processed: ${categoryMappings.size}`);
    console.log(`  SQL file generated: ${sqlFilename}`);
    console.log('='.repeat(70));

    console.log('\n✅ Topics curation with linguistic analysis completed!');
    console.log(`\n🎯 Next step: Review and execute ${sqlFilename} to apply changes.`);

  } catch (error: any) {
    console.error('\n❌ Error during curation:', error);
    throw error;
  }
}

/**
 * Generate SQL to replace category_verse_mappings with curated entries
 */
function generateCleanupSQL(curatedEntries: CuratedEntry[]): string {
  if (curatedEntries.length === 0) return '';

  const byCategory = new Map<string, CuratedEntry[]>();
  for (const entry of curatedEntries) {
    if (!byCategory.has(entry.category_key)) {
      byCategory.set(entry.category_key, []);
    }
    byCategory.get(entry.category_key)!.push(entry);
  }

  let sql = '-- =========================================\n';
  sql += '-- CURATED TOPICS ENTRIES - LINGUISTIC ANALYSIS\n';
  sql += '-- Generated with Pashto semantic analysis and verse context verification\n';
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

// Export functions
export {
  calculatePashtoSemanticRelevance,
  curateWithLinguisticAnalysis,
  generateCleanupSQL
};

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  curateTopicsWithLinguistics()
    .then(() => {
      console.log('\n✅ Script completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Error:', error);
      process.exit(1);
    });
}
