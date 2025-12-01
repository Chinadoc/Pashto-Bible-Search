/**
 * Populate inflection_reasons table with comprehensive analysis
 * 
 * Based on LingDocs grammar (https://grammar.lingdocs.com/inflection/inflection-intro/)
 * There are 3 basic reasons to inflect a word:
 * 1. It's plural
 * 2. It's in a sandwich (adpositional phrase)
 * 3. It's the subject of a transitive past tense verb (ergative)
 * 
 * This script analyzes all verses in both translations and identifies:
 * - Inflected nouns
 * - The reason(s) for inflection
 * - Double inflections (e.g., plural + sandwich)
 */

const WORKER_URL = 'https://pashtobiblesearch.jeremy-samuels17.workers.dev';

// Common Pashto sandwich constructions (adpositions)
const SANDWICH_PATTERNS = [
  // په ... کې constructions
  { start: 'په', end: 'کې', type: 'locative_in' },
  { start: 'په', end: 'باندې', type: 'locative_on' },
  { start: 'په', end: 'سره', type: 'comitative' },
  
  // د ... constructions (genitive/possessive)
  { start: 'د', end: null, type: 'genitive' },
  
  // له ... سره/نه constructions
  { start: 'له', end: 'سره', type: 'comitative_from' },
  { start: 'له', end: 'نه', type: 'ablative' },
  { start: 'له', end: 'څخه', type: 'ablative_from' },
  
  // ته (dative)
  { start: null, end: 'ته', type: 'dative' },
  
  // Other sandwiches
  { start: 'تر', end: 'پورې', type: 'terminative' },
  { start: 'تر', end: 'لاندې', type: 'below' },
  { start: 'تر', end: 'مخې', type: 'before' },
];

// Common masculine inflection endings
const MASC_INFLECTION_ENDINGS = [
  { base: 'ی', inflected: 'ي', reason: 'oblique_singular' },
  { base: 'ی', inflected: 'یو', reason: 'oblique_plural' },
  { base: 'ی', inflected: 'یان', reason: 'direct_plural_animate' },
  { base: 'ی', inflected: 'یانو', reason: 'oblique_plural_animate' },
  { base: '', inflected: 'ان', reason: 'direct_plural_animate' },
  { base: '', inflected: 'انو', reason: 'oblique_plural_animate' },
  { base: '', inflected: 'ونه', reason: 'direct_plural_inanimate' },
  { base: '', inflected: 'ونو', reason: 'oblique_plural_inanimate' },
  { base: '', inflected: 'و', reason: 'oblique_plural' },
];

// Common feminine inflection endings
const FEM_INFLECTION_ENDINGS = [
  { base: 'ه', inflected: 'ې', reason: 'oblique_singular' },
  { base: 'ه', inflected: 'ې', reason: 'direct_plural' },
  { base: 'ه', inflected: 'و', reason: 'oblique_plural' },
  { base: 'ا', inflected: 'ا', reason: 'no_change' },
  { base: 'ا', inflected: 'وې', reason: 'direct_plural' },
  { base: 'ا', inflected: 'وو', reason: 'oblique_plural' },
];

// Past tense transitive verb markers
const PAST_TENSE_MARKERS = ['ل', 'لو', 'له', 'لې', 'لم', 'لې', 'لئ'];

interface InflectionReason {
  pashto_form: string;
  base_word: string | null;
  verse_ref: string;
  inflection_type: string;
  is_plural: boolean;
  is_in_sandwich: boolean;
  sandwich_type: string | null;
  is_subject_transitive_past: boolean;
  context_sentence: string;
  word_position: number;
  translation_key: string;
}

interface NounLexiconEntry {
  pashto_word: string;
  gender: string;
  plural_type: string;
  animacy: string;
}

interface Verse {
  ref: string;
  text: string;
  book: string;
  chapter: number;
  verse: number;
  translation_key: string;
}

/**
 * Check if a word appears in a sandwich construction
 */
function findSandwichContext(text: string, wordIndex: number, word: string): { inSandwich: boolean; sandwichType: string | null } {
  const words = text.split(/\s+/);
  
  for (const pattern of SANDWICH_PATTERNS) {
    // Check for patterns like "په X کې"
    if (pattern.start && pattern.end) {
      for (let i = 0; i < words.length; i++) {
        if (words[i] === pattern.start) {
          // Look for the end marker
          for (let j = i + 1; j < words.length && j < i + 6; j++) {
            if (words[j] === pattern.end) {
              // Check if our word is between start and end
              if (wordIndex > i && wordIndex < j) {
                return { inSandwich: true, sandwichType: pattern.type };
              }
            }
          }
        }
      }
    }
    
    // Check for patterns like "د X" (no end marker)
    if (pattern.start && !pattern.end) {
      for (let i = 0; i < words.length - 1; i++) {
        if (words[i] === pattern.start && i + 1 === wordIndex) {
          return { inSandwich: true, sandwichType: pattern.type };
        }
      }
    }
    
    // Check for patterns like "X ته" (no start marker)
    if (!pattern.start && pattern.end) {
      for (let i = 1; i < words.length; i++) {
        if (words[i] === pattern.end && i - 1 === wordIndex) {
          return { inSandwich: true, sandwichType: pattern.type };
        }
      }
    }
  }
  
  return { inSandwich: false, sandwichType: null };
}

/**
 * Check if word is likely the subject of a transitive past tense verb
 * In Pashto ergative alignment, the subject of a transitive past tense verb
 * is marked with oblique case
 */
function isSubjectOfTransitivePast(text: string, wordIndex: number): boolean {
  const words = text.split(/\s+/);
  
  // Look for past tense transitive verbs in the sentence
  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    // Check if word ends with past tense marker
    for (const marker of PAST_TENSE_MARKERS) {
      if (word.endsWith(marker) && word.length > marker.length + 2) {
        // Found a potential past tense verb
        // The subject would typically be before the verb in oblique case
        if (wordIndex < i) {
          return true;
        }
      }
    }
  }
  
  return false;
}

/**
 * Detect if a word is inflected based on common patterns
 */
function detectInflection(word: string): { isInflected: boolean; isPlural: boolean; inflectionType: string | null } {
  // Check for plural/oblique endings
  const pluralObliqueEndings = ['انو', 'یانو', 'ونو', 'و'];
  const pluralDirectEndings = ['ان', 'یان', 'ونه', 'ې'];
  const obliqueEndings = ['ي', 'ې', 'و'];
  
  for (const ending of pluralObliqueEndings) {
    if (word.endsWith(ending) && word.length > ending.length + 1) {
      return { isInflected: true, isPlural: true, inflectionType: 'oblique_plural' };
    }
  }
  
  for (const ending of pluralDirectEndings) {
    if (word.endsWith(ending) && word.length > ending.length + 1) {
      return { isInflected: true, isPlural: true, inflectionType: 'direct_plural' };
    }
  }
  
  // Single و at end could be oblique singular or plural
  if (word.endsWith('و') && word.length > 2) {
    return { isInflected: true, isPlural: false, inflectionType: 'oblique' };
  }
  
  return { isInflected: false, isPlural: false, inflectionType: null };
}

/**
 * Fetch all verses from a translation
 */
async function fetchAllVerses(translation: 'afghan2023' | 'yousafzai2019'): Promise<Verse[]> {
  const allVerses: Verse[] = [];
  const books = [
    'Genesis', 'Exodus', 'Leviticus', 'Numbers', 'Deuteronomy',
    'Joshua', 'Judges', 'Ruth', '1 Samuel', '2 Samuel', '1 Kings', '2 Kings',
    '1 Chronicles', '2 Chronicles', 'Ezra', 'Nehemiah', 'Esther', 'Job',
    'Psalms', 'Proverbs', 'Ecclesiastes', 'Song of Solomon',
    'Isaiah', 'Jeremiah', 'Lamentations', 'Ezekiel', 'Daniel',
    'Hosea', 'Joel', 'Amos', 'Obadiah', 'Jonah', 'Micah', 'Nahum',
    'Habakkuk', 'Zephaniah', 'Haggai', 'Zechariah', 'Malachi',
    'Matthew', 'Mark', 'Luke', 'John', 'Acts', 'Romans',
    '1 Corinthians', '2 Corinthians', 'Galatians', 'Ephesians',
    'Philippians', 'Colossians', '1 Thessalonians', '2 Thessalonians',
    '1 Timothy', '2 Timothy', 'Titus', 'Philemon', 'Hebrews',
    'James', '1 Peter', '2 Peter', '1 John', '2 John', '3 John', 'Jude', 'Revelation'
  ];
  
  console.log(`📖 Fetching verses from ${translation}...`);
  
  for (const book of books) {
    try {
      // Fetch chapter by chapter
      for (let chapter = 1; chapter <= 150; chapter++) {
        const url = `${WORKER_URL}/api/chapter?book=${encodeURIComponent(book)}&chapter=${chapter}&translation=${translation}`;
        const response = await fetch(url);
        
        if (!response.ok) {
          if (response.status === 404) break; // No more chapters
          continue;
        }
        
        const data = await response.json();
        if (data.verses && Array.isArray(data.verses)) {
          for (const verse of data.verses) {
            allVerses.push({
              ref: `${book} ${chapter}:${verse.verse}`,
              text: verse.text,
              book,
              chapter,
              verse: verse.verse,
              translation_key: translation,
            });
          }
        } else {
          break; // No more chapters
        }
        
        // Rate limiting
        await new Promise(r => setTimeout(r, 50));
      }
      
      console.log(`  ✓ ${book}: ${allVerses.filter(v => v.book === book).length} verses`);
    } catch (error) {
      console.error(`  ✗ Error fetching ${book}:`, error);
    }
  }
  
  return allVerses;
}

/**
 * Fetch noun lexicon for base form lookups
 */
async function fetchNounLexicon(): Promise<Map<string, NounLexiconEntry>> {
  const lexicon = new Map<string, NounLexiconEntry>();
  
  try {
    // This would query the nouns_lexicon table
    // For now, we'll build inflection patterns without base form lookup
    console.log('📚 Note: Base form lookup from nouns_lexicon not implemented yet');
  } catch (error) {
    console.error('Error fetching noun lexicon:', error);
  }
  
  return lexicon;
}

/**
 * Analyze a single verse for inflected nouns
 */
function analyzeVerse(verse: Verse): InflectionReason[] {
  const reasons: InflectionReason[] = [];
  const words = verse.text.split(/\s+/);
  
  for (let i = 0; i < words.length; i++) {
    const word = words[i].replace(/[،.؟!؛:«»\-]/g, ''); // Remove punctuation
    if (word.length < 2) continue;
    
    const { isInflected, isPlural, inflectionType } = detectInflection(word);
    
    if (isInflected) {
      const { inSandwich, sandwichType } = findSandwichContext(verse.text, i, word);
      const isTransitivePastSubject = isSubjectOfTransitivePast(verse.text, i);
      
      // Determine the primary reason for inflection
      let primaryReason = 'unknown';
      if (isPlural && inSandwich) {
        primaryReason = 'double_inflection_plural_sandwich';
      } else if (isPlural && isTransitivePastSubject) {
        primaryReason = 'double_inflection_plural_ergative';
      } else if (inSandwich && isTransitivePastSubject) {
        primaryReason = 'double_inflection_sandwich_ergative';
      } else if (isPlural) {
        primaryReason = 'plural';
      } else if (inSandwich) {
        primaryReason = 'sandwich';
      } else if (isTransitivePastSubject) {
        primaryReason = 'ergative_subject';
      }
      
      reasons.push({
        pashto_form: word,
        base_word: null, // Would be looked up from nouns_lexicon
        verse_ref: verse.ref,
        inflection_type: inflectionType || primaryReason,
        is_plural: isPlural,
        is_in_sandwich: inSandwich,
        sandwich_type: sandwichType,
        is_subject_transitive_past: isTransitivePastSubject,
        context_sentence: verse.text,
        word_position: i,
        translation_key: verse.translation_key,
      });
    }
  }
  
  return reasons;
}

/**
 * Insert inflection reasons into D1 via Worker API
 */
async function insertInflectionReasons(reasons: InflectionReason[]): Promise<number> {
  // For now, we'll output to console/file since we can't directly insert into D1
  // In production, this would call a Worker API endpoint to batch insert
  
  console.log(`\n📝 Found ${reasons.length} inflection instances`);
  
  // Group by reason type for summary
  const byType: Record<string, number> = {};
  const doubleInflections: InflectionReason[] = [];
  
  for (const reason of reasons) {
    const type = reason.inflection_type;
    byType[type] = (byType[type] || 0) + 1;
    
    // Track double inflections
    if (reason.inflection_type.startsWith('double_')) {
      doubleInflections.push(reason);
    }
  }
  
  console.log('\n📊 Inflection Type Summary:');
  for (const [type, count] of Object.entries(byType).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${type}: ${count}`);
  }
  
  console.log(`\n🔥 Double Inflections Found: ${doubleInflections.length}`);
  if (doubleInflections.length > 0) {
    console.log('  Examples:');
    for (const di of doubleInflections.slice(0, 10)) {
      console.log(`    ${di.pashto_form} in ${di.verse_ref} (${di.inflection_type})`);
    }
  }
  
  return reasons.length;
}

/**
 * Main execution
 */
async function main() {
  console.log('🚀 Starting Inflection Reasons Analysis');
  console.log('=' .repeat(50));
  
  const allReasons: InflectionReason[] = [];
  
  // Process Afghan 2023 translation
  console.log('\n📖 Processing Afghan 2023 Translation...');
  const afghanVerses = await fetchAllVerses('afghan2023');
  console.log(`  Found ${afghanVerses.length} verses`);
  
  for (const verse of afghanVerses) {
    const reasons = analyzeVerse(verse);
    allReasons.push(...reasons);
  }
  
  // Process Yousafzai 2019 translation  
  console.log('\n📖 Processing Yousafzai 2019 Translation...');
  const yousafzaiVerses = await fetchAllVerses('yousafzai2019');
  console.log(`  Found ${yousafzaiVerses.length} verses`);
  
  for (const verse of yousafzaiVerses) {
    const reasons = analyzeVerse(verse);
    allReasons.push(...reasons);
  }
  
  // Insert/analyze results
  const totalInserted = await insertInflectionReasons(allReasons);
  
  console.log('\n' + '=' .repeat(50));
  console.log(`✅ Analysis Complete!`);
  console.log(`   Total verses analyzed: ${afghanVerses.length + yousafzaiVerses.length}`);
  console.log(`   Total inflection instances: ${totalInserted}`);
  
  // Output SQL for manual insertion
  console.log('\n📄 SQL Insert Statements (first 20):');
  for (const reason of allReasons.slice(0, 20)) {
    console.log(`INSERT INTO inflection_reasons (pashto_form, base_word, verse_ref, inflection_type, is_plural, is_in_sandwich, sandwich_type, is_subject_transitive_past, translation_key) VALUES ('${reason.pashto_form}', ${reason.base_word ? `'${reason.base_word}'` : 'NULL'}, '${reason.verse_ref}', '${reason.inflection_type}', ${reason.is_plural ? 1 : 0}, ${reason.is_in_sandwich ? 1 : 0}, ${reason.sandwich_type ? `'${reason.sandwich_type}'` : 'NULL'}, ${reason.is_subject_transitive_past ? 1 : 0}, '${reason.translation_key}');`);
  }
}

main().catch(console.error);

