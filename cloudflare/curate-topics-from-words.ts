/**
 * Build Topics from Words - Bottom-Up Approach
 * 
 * This script builds topic categories from words that appear in the Bible/videos:
 * 1. Starts with all words in word_frequencies (words that appear in Bible/videos)
 * 2. For each word, matches its dictionary definition to category keywords
 * 3. Assigns words to MULTIPLE categories where they semantically fit
 * 4. Finds verses for each word-category combination
 * 5. Randomizes translations and limits to 1-2 verses per word per category
 * 
 * Example: "love" (مینه) should appear in:
 * - emotions (positive emotions)
 * - religious (fruits of the Holy Spirit)
 * - abstract_good (virtues)
 * - relationships (love between people)
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';

const execAsync = promisify(exec);

// Comprehensive category definitions with keywords
const CATEGORIES: Record<string, string[]> = {
  // Body Parts
  'body_parts_head': ['head', 'hair', 'face', 'forehead', 'eye', 'ear', 'nose', 'mouth', 'lip', 'tooth', 'tongue', 'chin', 'cheek', 'neck', 'throat'],
  'body_parts_torso': ['chest', 'breast', 'back', 'shoulder', 'arm', 'hand', 'finger', 'palm', 'wrist', 'elbow', 'stomach', 'belly', 'waist', 'side', 'rib'],
  'body_parts_legs': ['leg', 'foot', 'toe', 'knee', 'thigh', 'ankle', 'heel', 'shin'],
  'body_parts_internal': ['heart', 'blood', 'bone', 'flesh', 'skin', 'vein', 'liver', 'kidney', 'lung', 'brain', 'soul', 'spirit'],
  'body_parts': ['head', 'hair', 'face', 'forehead', 'eye', 'ear', 'nose', 'mouth', 'lip', 'tooth', 'tongue', 'chin', 'cheek', 'neck', 'throat', 'chest', 'breast', 'back', 'shoulder', 'arm', 'hand', 'finger', 'palm', 'wrist', 'elbow', 'stomach', 'belly', 'waist', 'side', 'rib', 'leg', 'foot', 'toe', 'knee', 'thigh', 'ankle', 'heel', 'shin', 'heart', 'blood', 'bone', 'flesh', 'skin', 'vein', 'liver', 'kidney', 'lung', 'brain', 'soul', 'spirit'],
  
  // Family & Relationships
  'family_male': ['father', 'son', 'brother', 'husband', 'uncle', 'nephew', 'grandfather', 'grandson', 'father-in-law', 'son-in-law', 'brother-in-law'],
  'family_female': ['mother', 'daughter', 'sister', 'wife', 'aunt', 'niece', 'grandmother', 'granddaughter', 'mother-in-law', 'daughter-in-law', 'sister-in-law'],
  'family_general': ['family', 'relative', 'parent', 'child', 'children', 'offspring', 'descendant', 'ancestor', 'lineage', 'tribe', 'clan'],
  'family': ['father', 'son', 'brother', 'husband', 'mother', 'daughter', 'sister', 'wife', 'uncle', 'aunt', 'nephew', 'niece', 'grandfather', 'grandmother', 'grandson', 'granddaughter', 'family', 'relative', 'parent', 'child', 'children', 'offspring', 'descendant', 'ancestor', 'lineage', 'tribe', 'clan'],
  'relationships': ['friend', 'neighbor', 'companion', 'enemy', 'slave', 'servant', 'master', 'lord', 'king', 'queen', 'ruler'],
  
  // Time
  'time_periods': ['day', 'night', 'morning', 'evening', 'noon', 'midnight', 'dawn', 'dusk', 'hour', 'minute', 'moment', 'time', 'period', 'generation'],
  'time_days': ['today', 'yesterday', 'tomorrow', 'week', 'sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'],
  'time_months': ['month', 'year', 'season', 'spring', 'summer', 'autumn', 'winter', 'january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'],
  'time_concepts': ['past', 'present', 'future', 'forever', 'eternity', 'beginning', 'end', 'now', 'then', 'before', 'after', 'while', 'during'],
  'time': ['day', 'night', 'morning', 'evening', 'noon', 'midnight', 'dawn', 'dusk', 'hour', 'minute', 'moment', 'time', 'period', 'generation', 'today', 'yesterday', 'tomorrow', 'week', 'sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'month', 'year', 'season', 'spring', 'summer', 'autumn', 'winter', 'past', 'present', 'future', 'forever', 'eternity', 'beginning', 'end', 'now', 'then', 'before', 'after', 'while', 'during'],
  
  // Numbers
  'numbers_cardinal': ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety', 'hundred', 'thousand', 'million'],
  'numbers_ordinal': ['first', 'second', 'third', 'fourth', 'fifth', 'last', 'next', 'previous'],
  'numbers_quantities': ['all', 'many', 'much', 'few', 'little', 'some', 'several', 'whole', 'half', 'double', 'triple', 'single', 'pair', 'couple'],
  'numbers': ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety', 'hundred', 'thousand', 'million', 'first', 'second', 'third', 'fourth', 'fifth', 'last', 'next', 'previous', 'all', 'many', 'much', 'few', 'little', 'some', 'several', 'whole', 'half', 'double', 'triple', 'single', 'pair', 'couple'],
  
  // Weather & Nature
  'weather': ['rain', 'snow', 'wind', 'storm', 'cloud', 'thunder', 'lightning', 'sun', 'moon', 'star', 'sky', 'heaven', 'weather', 'temperature', 'hot', 'cold', 'warm', 'cool'],
  'nature_land': ['earth', 'land', 'ground', 'soil', 'dust', 'dirt', 'mountain', 'hill', 'valley', 'plain', 'desert', 'field', 'garden', 'forest', 'tree', 'grass', 'plant', 'flower', 'fruit'],
  'nature_water': ['water', 'river', 'sea', 'ocean', 'lake', 'pond', 'well', 'stream', 'spring', 'flood', 'wave', 'ice', 'snow'],
  'nature_animals': ['animal', 'beast', 'bird', 'fish', 'snake', 'lion', 'bear', 'wolf', 'fox', 'deer', 'sheep', 'goat', 'cow', 'ox', 'donkey', 'horse', 'camel', 'dog', 'cat', 'pig', 'chicken', 'cock', 'hen', 'eagle', 'dove', 'crow'],
  'nature': ['earth', 'land', 'ground', 'soil', 'dust', 'dirt', 'mountain', 'hill', 'valley', 'plain', 'desert', 'field', 'garden', 'forest', 'tree', 'grass', 'plant', 'flower', 'fruit', 'water', 'river', 'sea', 'ocean', 'lake', 'pond', 'well', 'stream', 'spring', 'flood', 'wave', 'ice', 'snow', 'animal', 'beast', 'bird', 'fish', 'snake', 'lion', 'bear', 'wolf', 'fox', 'deer', 'sheep', 'goat', 'cow', 'ox', 'donkey', 'horse', 'camel', 'dog', 'cat', 'pig', 'chicken', 'cock', 'hen', 'eagle', 'dove', 'crow'],
  
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
  'emotions': ['love', 'joy', 'happiness', 'glad', 'gladness', 'rejoice', 'peace', 'hope', 'comfort', 'mercy', 'grace', 'kindness', 'delight', 'pleasure', 'satisfaction', 'fear', 'afraid', 'angry', 'anger', 'hate', 'sorrow', 'sad', 'sadness', 'grief', 'pain', 'suffering', 'trouble', 'distress', 'anxiety', 'worry', 'shame', 'guilt', 'regret'],
  
  // Actions - Physical
  'actions_move': ['go', 'come', 'walk', 'run', 'flee', 'escape', 'return', 'enter', 'exit', 'leave', 'depart', 'arrive', 'reach', 'approach', 'pass', 'cross', 'climb', 'fall', 'rise', 'stand', 'sit', 'lie', 'rest'],
  'actions_hand': ['take', 'give', 'put', 'place', 'set', 'throw', 'cast', 'lift', 'raise', 'lower', 'hold', 'grasp', 'grab', 'catch', 'release', 'send', 'bring', 'carry', 'bear', 'stretch', 'touch', 'feel'],
  'actions_communication': ['say', 'speak', 'tell', 'talk', 'call', 'cry', 'shout', 'yell', 'sing', 'praise', 'thank', 'bless', 'curse', 'pray', 'answer', 'reply', 'ask', 'question', 'hear', 'listen', 'understand', 'know', 'teach', 'learn'],
  'actions_see': ['see', 'look', 'watch', 'observe', 'behold', 'appear', 'show', 'reveal', 'hide', 'cover', 'uncover', 'open', 'close'],
  'actions_eat': ['eat', 'drink', 'feed', 'taste', 'hunger', 'thirst'],
  'actions_fight': ['fight', 'battle', 'war', 'attack', 'strike', 'hit', 'kill', 'slay', 'destroy', 'defeat', 'win', 'conquer', 'defend', 'protect', 'save', 'rescue', 'deliver'],
  'actions_build': ['build', 'make', 'create', 'form', 'shape', 'construct', 'destroy', 'break', 'tear', 'cut', 'divide', 'separate', 'join', 'unite', 'repair', 'fix'],
  'actions': ['go', 'come', 'walk', 'run', 'flee', 'escape', 'return', 'enter', 'exit', 'leave', 'depart', 'arrive', 'reach', 'approach', 'pass', 'cross', 'climb', 'fall', 'rise', 'stand', 'sit', 'lie', 'rest', 'take', 'give', 'put', 'place', 'set', 'throw', 'cast', 'lift', 'raise', 'lower', 'hold', 'grasp', 'grab', 'catch', 'release', 'send', 'bring', 'carry', 'bear', 'stretch', 'touch', 'feel', 'build', 'make', 'create', 'form', 'shape', 'construct', 'destroy', 'break', 'tear', 'cut', 'divide', 'separate', 'join', 'unite', 'repair', 'fix'],
  
  // Verbs - Mental
  'mental_think': ['think', 'consider', 'remember', 'forget', 'believe', 'trust', 'doubt', 'wonder', 'imagine', 'dream', 'hope', 'expect', 'plan', 'decide', 'choose', 'judge'],
  'mental_know': ['know', 'understand', 'comprehend', 'learn', 'teach', 'study', 'wisdom', 'knowledge', 'ignorance', 'foolish', 'wise', 'smart', 'stupid'],
  
  // States & Conditions
  'states_life': ['live', 'life', 'alive', 'dead', 'death', 'die', 'birth', 'born', 'grow', 'old', 'young', 'new', 'fresh'],
  'states_health': ['healthy', 'sick', 'ill', 'disease', 'wound', 'injury', 'heal', 'cure', 'pain', 'suffer', 'weak', 'strong', 'strength', 'power'],
  'states_size': ['big', 'large', 'great', 'small', 'little', 'tiny', 'huge', 'enormous', 'giant', 'short', 'long', 'tall', 'high', 'low', 'wide', 'narrow', 'thick', 'thin', 'deep', 'shallow'],
  'states_quality': ['good', 'bad', 'evil', 'right', 'wrong', 'true', 'false', 'real', 'fake', 'pure', 'clean', 'dirty', 'holy', 'sacred', 'unholy', 'sinful'],
  'states': ['live', 'life', 'alive', 'dead', 'death', 'die', 'birth', 'born', 'grow', 'old', 'young', 'new', 'fresh', 'healthy', 'sick', 'ill', 'disease', 'wound', 'injury', 'heal', 'cure', 'pain', 'suffer', 'weak', 'strong', 'strength', 'power', 'big', 'large', 'great', 'small', 'little', 'tiny', 'huge', 'enormous', 'giant', 'short', 'long', 'tall', 'high', 'low', 'wide', 'narrow', 'thick', 'thin', 'deep', 'shallow', 'good', 'bad', 'evil', 'right', 'wrong', 'true', 'false', 'real', 'fake', 'pure', 'clean', 'dirty', 'holy', 'sacred', 'unholy', 'sinful'],
  
  // Social & Religious
  'religious_concepts': ['god', 'lord', 'jesus', 'christ', 'messiah', 'holy', 'sacred', 'divine', 'heaven', 'heavenly', 'angels', 'angel', 'devil', 'satan', 'demon', 'spirit', 'ghost', 'soul', 'eternal', 'immortal'],
  'religious_actions': ['pray', 'prayer', 'worship', 'praise', 'bless', 'blessing', 'curse', 'sacrifice', 'offer', 'offering', 'anoint', 'baptize', 'baptism', 'preach', 'prophesy', 'prophecy'],
  'religious_places': ['temple', 'church', 'synagogue', 'altar', 'sanctuary', 'holy place', 'heaven', 'paradise', 'hell', 'judgment'],
  'religious_objects': ['ark', 'covenant', 'law', 'commandment', 'scripture', 'book', 'scroll', 'idol', 'image', 'statue'],
  'religious': ['god', 'lord', 'jesus', 'christ', 'messiah', 'holy', 'sacred', 'divine', 'heaven', 'heavenly', 'angels', 'angel', 'devil', 'satan', 'demon', 'spirit', 'ghost', 'soul', 'eternal', 'immortal', 'pray', 'prayer', 'worship', 'praise', 'bless', 'blessing', 'curse', 'sacrifice', 'offer', 'offering', 'anoint', 'baptize', 'baptism', 'preach', 'prophesy', 'prophecy', 'temple', 'church', 'synagogue', 'altar', 'sanctuary', 'holy place', 'heaven', 'paradise', 'hell', 'judgment', 'ark', 'covenant', 'law', 'commandment', 'scripture', 'book', 'scroll', 'idol', 'image', 'statue'],
  
  // Fruits of the Holy Spirit (special category)
  'fruits_holy_spirit': ['love', 'joy', 'peace', 'patience', 'kindness', 'goodness', 'faithfulness', 'gentleness', 'self-control'],
  
  // Leadership
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
  'grammar': ['pronoun', 'i', 'you', 'he', 'she', 'it', 'we', 'they', 'this', 'that', 'these', 'those', 'who', 'what', 'which', 'my', 'your', 'his', 'her', 'our', 'their', 'preposition', 'in', 'on', 'at', 'by', 'with', 'from', 'to', 'for', 'of', 'about', 'under', 'over', 'through', 'between', 'among', 'against', 'toward', 'until', 'since', 'during', 'conjunction', 'and', 'or', 'but', 'if', 'when', 'because', 'since', 'although', 'though', 'however', 'therefore', 'so', 'then', 'adverb', 'very', 'much', 'more', 'most', 'less', 'least', 'well', 'badly', 'quickly', 'slowly', 'soon', 'now', 'then', 'here', 'there', 'always', 'never', 'often', 'sometimes', 'usually'],
  
  // Questions & Interrogatives
  'questions': ['who', 'what', 'where', 'when', 'why', 'how', 'which', 'whose', 'whom', 'question', 'ask', 'answer'],
  
  // Measurement & Quantity
  'measurement': ['measure', 'weight', 'length', 'width', 'height', 'depth', 'distance', 'size', 'amount', 'quantity', 'number', 'count', 'full', 'empty', 'half', 'whole'],
  
  // Direction & Position
  'direction': ['up', 'down', 'left', 'right', 'forward', 'backward', 'front', 'back', 'behind', 'before', 'after', 'above', 'below', 'under', 'over', 'inside', 'outside', 'north', 'south', 'east', 'west'],
  'position': ['position', 'place', 'location', 'here', 'there', 'where', 'near', 'far', 'close', 'distant', 'beside', 'next to', 'between', 'among', 'within', 'without'],
  'spatial': ['up', 'down', 'left', 'right', 'forward', 'backward', 'front', 'back', 'behind', 'before', 'after', 'above', 'below', 'under', 'over', 'inside', 'outside', 'north', 'south', 'east', 'west', 'position', 'place', 'location', 'here', 'there', 'where', 'near', 'far', 'close', 'distant', 'beside', 'next to', 'between', 'among', 'within', 'without'],
  
  // Materials
  'materials': ['gold', 'silver', 'bronze', 'brass', 'iron', 'steel', 'wood', 'stone', 'rock', 'clay', 'pottery', 'cloth', 'leather', 'wool', 'linen', 'silk', 'paper', 'ink'],
  
  // Activities
  'activities_daily': ['sleep', 'wake', 'awake', 'rest', 'work', 'eat', 'drink', 'bathe', 'wash', 'clean', 'dress', 'undress'],
  'activities_social': ['meet', 'gather', 'assembly', 'meeting', 'visit', 'greet', 'welcome', 'farewell', 'celebrate', 'feast', 'marriage', 'wedding', 'funeral', 'mourn'],
  'activities': ['sleep', 'wake', 'awake', 'rest', 'work', 'eat', 'drink', 'bathe', 'wash', 'clean', 'dress', 'undress', 'meet', 'gather', 'assembly', 'meeting', 'visit', 'greet', 'welcome', 'farewell', 'celebrate', 'feast', 'marriage', 'wedding', 'funeral', 'mourn'],
  
  // Descriptions
  'descriptions_appearance': ['beautiful', 'ugly', 'handsome', 'pretty', 'attractive', 'plain', 'colorful', 'bright', 'dark', 'shiny', 'dull'],
  'descriptions_character': ['brave', 'cowardly', 'bold', 'timid', 'courageous', 'fearful', 'honest', 'dishonest', 'faithful', 'unfaithful', 'loyal', 'disloyal', 'generous', 'stingy', 'kind', 'cruel'],
  
  // Age & Life Stages
  'age_stages': ['infant', 'baby', 'child', 'youth', 'young', 'adult', 'elder', 'old', 'aged', 'ancient', 'generation', 'age'],
  
  // Other Categories
  'miscellaneous': ['thing', 'object', 'item', 'stuff', 'matter', 'affair', 'business', 'event', 'happening', 'occasion', 'time', 'moment', 'chance', 'opportunity'],
};

interface WordData {
  pashto_word: string;
  english_translation: string;
  romanization?: string;
  frequency_total: number;
  base_form?: string;
}

interface VerseMapping {
  verse_id: number;
  verse_ref: string;
  translation_key: string;
  testament: string;
  book: string;
  chapter: number;
  verse: number;
}

interface CategoryMatch {
  category_key: string;
  relevance_score: number;
  matches: string[];
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
}

/**
 * Match English translation to category keywords
 * Returns array of category matches with relevance scores
 */
function matchWordToCategories(
  englishTranslation: string,
  pashtoWord: string
): CategoryMatch[] {
  const translation = (englishTranslation || '').toLowerCase();
  const words = translation.split(/[,;]\s*|\s+/).map(w => w.trim()).filter(w => w.length > 0);
  
  if (words.length === 0) {
    return [];
  }

  const categoryMatches: CategoryMatch[] = [];

  // Check each category
  for (const [categoryKey, keywords] of Object.entries(CATEGORIES)) {
    let totalScore = 0;
    let exactMatches = 0;
    const matchedKeywords: string[] = [];

    // Check for exact matches
    for (const word of words) {
      for (const keyword of keywords) {
        if (word === keyword.toLowerCase()) {
          totalScore += 1.0;
          exactMatches++;
          matchedKeywords.push(keyword);
          break;
        }
      }
    }

    // Check for partial matches (word boundaries)
    if (exactMatches === 0) {
      for (const word of words) {
        for (const keyword of keywords) {
          const keywordLower = keyword.toLowerCase();
          const regex = new RegExp(`\\b${keywordLower}\\b`, 'i');
          if (regex.test(word) && !matchedKeywords.includes(keyword)) {
            totalScore += 0.7;
            matchedKeywords.push(keyword);
            break;
          }
        }
      }
    }

    // Calculate normalized score
    if (totalScore > 0) {
      const normalizedScore = exactMatches > 0
        ? Math.min(totalScore / Math.max(words.length, 1), 1.0)
        : Math.min(totalScore / Math.max(words.length, 1), 0.85);
      
      // Require at least 90% match for inclusion (allow multiple categories)
      if (normalizedScore >= 0.9) {
        categoryMatches.push({
          category_key: categoryKey,
          relevance_score: normalizedScore,
          matches: matchedKeywords
        });
      }
    }
  }

  // Sort by relevance score (highest first)
  return categoryMatches.sort((a, b) => b.relevance_score - a.relevance_score);
}

/**
 * Fetch verses for a word by searching verse text directly
 * Uses word_frequencies as source of truth, then queries verses containing the word
 */
async function fetchVersesForWord(pashtoWord: string, baseForm?: string): Promise<VerseMapping[]> {
  try {
    const escapedWord = pashtoWord.replace(/'/g, "''");
    
    // Try both afghan2023 and yousafzai2019 translations
    const queries = [
      // Afghan 2023
      `
        SELECT DISTINCT
          id as verse_id,
          ref as verse_ref,
          'afghan2023' as translation_key,
          testament,
          book,
          chapter,
          verse
        FROM verses_afghan2023
        WHERE text LIKE '%${escapedWord}%'
        ORDER BY RANDOM()
        LIMIT 10
      `,
      // Yousafzai 2019
      `
        SELECT DISTINCT
          id as verse_id,
          ref as verse_ref,
          'yousafzai2019' as translation_key,
          testament,
          book,
          chapter,
          verse
        FROM verses_yousafzai
        WHERE text LIKE '%${escapedWord}%'
        ORDER BY RANDOM()
        LIMIT 10
      `
    ];

    const allVerses: VerseMapping[] = [];

    for (const query of queries) {
      try {
        const { stdout } = await execAsync(
          `npx wrangler d1 execute pashto-bible-db --remote --command="${query.replace(/"/g, '\\"')}" --json`,
          { maxBuffer: 10 * 1024 * 1024, timeout: 30000 }
        );

        const result = JSON.parse(stdout);
        const data = Array.isArray(result) ? result[0] : result;
        const rows = data.results || [];

        for (const row of rows) {
          allVerses.push({
            verse_id: row.verse_id,
            verse_ref: row.verse_ref,
            translation_key: row.translation_key,
            testament: row.testament,
            book: row.book,
            chapter: row.chapter,
            verse: row.verse
          });
        }
      } catch (error) {
        console.error(`Error fetching verses for ${pashtoWord} from ${query.includes('afghan2023') ? 'afghan2023' : 'yousafzai2019'}:`, error);
      }
    }

    // If no results and we have base_form, try that
    if (allVerses.length === 0 && baseForm && baseForm !== pashtoWord) {
      const escapedBaseForm = baseForm.replace(/'/g, "''");
      const baseQueries = [
        `
          SELECT DISTINCT
            id as verse_id,
            ref as verse_ref,
            'afghan2023' as translation_key,
            testament,
            book,
            chapter,
            verse
          FROM verses_afghan2023
          WHERE text LIKE '%${escapedBaseForm}%'
          ORDER BY RANDOM()
          LIMIT 10
        `,
        `
          SELECT DISTINCT
            id as verse_id,
            ref as verse_ref,
            'yousafzai2019' as translation_key,
            testament,
            book,
            chapter,
            verse
          FROM verses_yousafzai
          WHERE text LIKE '%${escapedBaseForm}%'
          ORDER BY RANDOM()
          LIMIT 10
        `
      ];

      for (const query of baseQueries) {
        try {
          const { stdout } = await execAsync(
            `npx wrangler d1 execute pashto-bible-db --remote --command="${query.replace(/"/g, '\\"')}" --json`,
            { maxBuffer: 10 * 1024 * 1024, timeout: 30000 }
          );

          const result = JSON.parse(stdout);
          const data = Array.isArray(result) ? result[0] : result;
          const rows = data.results || [];

          for (const row of rows) {
            allVerses.push({
              verse_id: row.verse_id,
              verse_ref: row.verse_ref,
              translation_key: row.translation_key,
              testament: row.testament,
              book: row.book,
              chapter: row.chapter,
              verse: row.verse
            });
          }
        } catch (error) {
          // Continue if one query fails
        }
      }
    }

    // Remove duplicates and randomize
    const uniqueVerses = Array.from(
      new Map(allVerses.map(v => [`${v.verse_ref}-${v.translation_key}`, v])).values()
    );
    
    return uniqueVerses.sort(() => Math.random() - 0.5).slice(0, 10);
  } catch (error) {
    console.error(`Error fetching verses for ${pashtoWord}:`, error);
    return [];
  }
}

/**
 * Main curation process - build from words
 */
async function curateTopicsFromWords(): Promise<void> {
  console.log('🚀 Starting Topics Curation from Words (Bottom-Up Approach)\n');
  console.log('='.repeat(70));

  try {
    // Step 1: Get all words from word_frequencies that have translations
    console.log('📊 Step 1: Fetching words from word_frequencies...\n');

    const query = `
      SELECT DISTINCT
        pashto_word,
        english_translation,
        romanization,
        frequency_total,
        base_form
      FROM word_frequencies
      WHERE english_translation IS NOT NULL 
        AND english_translation != ''
        AND frequency_total > 0
      ORDER BY frequency_total DESC
    `;

    const { stdout } = await execAsync(
      `npx wrangler d1 execute pashto-bible-db --remote --command="${query.replace(/"/g, '\\"')}" --json`,
      { maxBuffer: 50 * 1024 * 1024, timeout: 300000 }
    );

    const result = JSON.parse(stdout);
    const data = Array.isArray(result) ? result[0] : result;
    const words: WordData[] = data.results || [];

    console.log(`📊 Found ${words.length} words with translations\n`);

    // Step 2: Match each word to categories
    console.log('🔍 Step 2: Matching words to categories...\n');

    const allCuratedEntries: CuratedEntry[] = [];
    const categoryStats = new Map<string, { words: Set<string>, entries: number }>();

    let processed = 0;
    const totalWords = words.length;

    for (const word of words) {
      processed++;
      if (processed % 100 === 0) {
        console.log(`   Processed ${processed}/${totalWords} words...`);
      }

      // Match word to categories
      const categoryMatches = matchWordToCategories(word.english_translation, word.pashto_word);

      if (categoryMatches.length === 0) {
        continue; // Skip words that don't match any category
      }

      // Fetch verses for this word
      const verses = await fetchVersesForWord(word.pashto_word, word.base_form || undefined);

      if (verses.length === 0) {
        continue; // Skip words without verses
      }

      // For each matching category, add 1-2 verses (randomizing translations)
      for (const match of categoryMatches) {
        // Initialize category stats
        if (!categoryStats.has(match.category_key)) {
          categoryStats.set(match.category_key, { words: new Set(), entries: 0 });
        }

        const stats = categoryStats.get(match.category_key)!;

        // Skip if we already have 100+ unique words for this category
        if (stats.words.size >= 100) {
          continue;
        }

        // Randomize verses and take 1-2 per word per category
        const shuffledVerses = [...verses].sort(() => Math.random() - 0.5);
        const versesToTake = Math.min(shuffledVerses.length, 2);

        for (let i = 0; i < versesToTake; i++) {
          const verse = shuffledVerses[i];
          
          allCuratedEntries.push({
            category_key: match.category_key,
            pashto_word: word.pashto_word,
            verse_id: verse.verse_id,
            verse_ref: verse.verse_ref,
            translation_key: verse.translation_key,
            testament: verse.testament,
            book: verse.book,
            chapter: verse.chapter,
            verse: verse.verse
          });

          stats.words.add(word.pashto_word);
          stats.entries++;
        }
      }
    }

    console.log(`\n✅ Processed ${processed} words\n`);

    // Step 3: Generate SQL
    console.log('📝 Step 3: Generating SQL...\n');

    const cleanupSQL = generateCleanupSQL(allCuratedEntries);

    // Write to file
    const sqlFilename = `curated_topics_from_words_${new Date().toISOString().split('T')[0]}.sql`;
    fs.writeFileSync(sqlFilename, cleanupSQL);

    // Print summary
    console.log('='.repeat(70));
    console.log('📊 CURATION SUMMARY:');
    console.log(`  Total words processed: ${processed}`);
    console.log(`  Total curated entries: ${allCuratedEntries.length}`);
    console.log(`  Categories populated: ${categoryStats.size}`);
    console.log('\n  Category breakdown:');
    
    const sortedCategories = Array.from(categoryStats.entries())
      .sort((a, b) => b[1].words.size - a[1].words.size);
    
    for (const [categoryKey, stats] of sortedCategories.slice(0, 30)) {
      console.log(`    ${categoryKey}: ${stats.words.size} unique words, ${stats.entries} entries`);
    }

    console.log(`\n  SQL file generated: ${sqlFilename}`);
    console.log('='.repeat(70));

    console.log('\n✅ Topics curation from words completed!');
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
  sql += '-- CURATED TOPICS ENTRIES - BUILT FROM WORDS\n';
  sql += '-- Generated by matching words from word_frequencies to categories\n';
  sql += '-- Words can belong to multiple categories\n';
  sql += '-- =========================================\n\n';

  sql += '-- Clear existing mappings\n';
  sql += 'DELETE FROM category_verse_mappings;\n\n';

  // Insert curated entries
  sql += '-- Insert curated entries\n';
  for (const [categoryKey, entries] of byCategory) {
    sql += `-- ${categoryKey} (${entries.length} entries from ${new Set(entries.map(e => e.pashto_word)).size} unique words)\n`;
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
  matchWordToCategories,
  fetchVersesForWord,
  generateCleanupSQL
};

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  curateTopicsFromWords()
    .then(() => {
      console.log('\n✅ Script completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Error:', error);
      process.exit(1);
    });
}

