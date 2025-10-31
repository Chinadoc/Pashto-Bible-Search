/**
 * Analyze Inflection Reasons in Pashto Bible Verses
 * 
 * Based on: https://grammar.lingdocs.com/sandwiches/sandwiches/
 * 
 * There are 3 reasons to inflect a word:
 * 1. It's plural
 * 2. It's in a sandwich (adpositional phrase)
 * 3. It's the subject of a transitive past tense verb
 * 
 * This script:
 * 1. Queries D1 for ALL verses via Cloudflare Worker API (batched by chapter)
 * 2. Uses Worker API to get base word mappings for each form
 * 3. Identifies inflected forms vs base forms
 * 4. Determines WHY each inflected form is inflected
 * 5. Stores analysis in D1 inflection_reasons table
 */

import { writeFileSync } from 'fs';
import { join } from 'path';
import { execSync } from 'child_process';

const CLOUDFLARE_WORKER_URL = process.env.NEXT_PUBLIC_CLOUDFLARE_WORKER_URL || 'https://pashtobiblesearch.jeremy-samuels17.workers.dev';

// Common Pashto sandwich patterns (circumpositions)
const SANDWICH_PATTERNS = [
  { before: 'په', after: 'کې', name: 'in' },           // په ... کې (in)
  { before: 'په', after: 'باندې', name: 'on' },       // په ... باندې (on)
  { before: 'له', after: 'سره', name: 'with' },        // له ... سره (with)
  { before: 'پر', after: 'باندې', name: 'on' },        // پر ... باندې (on)
  { before: 'د', after: 'په اړه', name: 'about' },     // د ... په اړه (about)
  { before: 'د', after: 'په بارې کې', name: 'about' }, // د ... په بارې کې (about)
  { before: 'د', after: 'دپاره', name: 'for' },        // د ... دپاره (for)
  { before: 'د', after: 'لپاره', name: 'for' },        // د ... لپاره (for)
  { before: 'له', after: 'نه', name: 'from' },         // له ... نه (from)
  { before: 'تر', after: 'پورې', name: 'until' },      // تر ... پورې (until)
  { before: 'د', after: 'په منځ کې', name: 'among' },  // د ... په منځ کې (among)
];

// Prepositions (only before)
const PREPOSITIONS = ['د', 'په', 'له', 'ته', 'پر', 'تر', 'ور', 'بې'];

// Postpositions (only after)
const POSTPOSITIONS = ['کې', 'سره', 'باندې', 'لاندې', 'پورې', 'لپاره', 'نه', 'ته'];

// Plural markers/suffixes
const PLURAL_MARKERS = ['ونه', 'ان', 'ګان', 'ګانې', 'یان', 'یانې', 'ونو', 'انو', 'ګانو'];

// Past tense transitive verb markers
const PAST_TRANSITIVE_MARKERS = [
  'و', 'ول', 'له', 'وخ', 'کړ', 'کړل', 'کړې', 'کړو', 'کړه',
  'وړ', 'وړل', 'وړې', 'وړو', 'وړه',
  'وته', 'وتل', 'وتې', 'وتو', 'تله',
  'شو', 'شول', 'شوې', 'شوو', 'شوه',
];

// Inflection endings (1st and 2nd inflection)
const FIRST_INFLECTION_ENDINGS = ['ې', 'ي', 'ه'];
const SECOND_INFLECTION_ENDINGS = ['و', 'یو', 'يو'];

interface Verse {
  ref: string;
  text: string;
  book: string;
  chapter: number;
  verse: number;
  translation_key?: string;
}

interface InflectionAnalysis {
  word: string;
  baseWord: string;
  position: number;
  inflectionType: '1st' | '2nd' | 'none';
  reasons: {
    isPlural: boolean;
    isInSandwich: boolean;
    sandwichType?: string;
    isSubjectOfTransitivePast: boolean;
  };
  context: {
    verseRef: string;
    sentence: string;
    surroundingWords: string[];
  };
}

// Pashto Bible books with chapter counts
const BIBLE_BOOKS: Array<{ name: string; chapters: number }> = [
  { name: 'Genesis', chapters: 50 },
  { name: 'Exodus', chapters: 40 },
  { name: 'Leviticus', chapters: 27 },
  { name: 'Numbers', chapters: 36 },
  { name: 'Deuteronomy', chapters: 34 },
  { name: 'Joshua', chapters: 24 },
  { name: 'Judges', chapters: 21 },
  { name: 'Ruth', chapters: 4 },
  { name: '1-Samuel', chapters: 31 },
  { name: '2-Samuel', chapters: 24 },
  { name: '1-Kings', chapters: 22 },
  { name: '2-Kings', chapters: 25 },
  { name: '1-Chronicles', chapters: 29 },
  { name: '2-Chronicles', chapters: 36 },
  { name: 'Ezra', chapters: 10 },
  { name: 'Nehemiah', chapters: 10 },
  { name: 'Esther', chapters: 10 },
  { name: 'Job', chapters: 42 },
  { name: 'Psalms', chapters: 150 },
  { name: 'Proverbs', chapters: 31 },
  { name: 'Ecclesiastes', chapters: 12 },
  { name: 'Song-of-Solomon', chapters: 8 },
  { name: 'Isaiah', chapters: 66 },
  { name: 'Jeremiah', chapters: 52 },
  { name: 'Lamentations', chapters: 5 },
  { name: 'Ezekiel', chapters: 48 },
  { name: 'Daniel', chapters: 12 },
  { name: 'Hosea', chapters: 14 },
  { name: 'Joel', chapters: 2 },
  { name: 'Amos', chapters: 9 },
  { name: 'Obadiah', chapters: 1 },
  { name: 'Jonah', chapters: 4 },
  { name: 'Micah', chapters: 7 },
  { name: 'Nahum', chapters: 3 },
  { name: 'Habakkuk', chapters: 3 },
  { name: 'Zephaniah', chapters: 3 },
  { name: 'Haggai', chapters: 2 },
  { name: 'Zechariah', chapters: 14 },
  { name: 'Malachi', chapters: 4 },
  { name: 'Matthew', chapters: 28 },
  { name: 'Mark', chapters: 16 },
  { name: 'Luke', chapters: 24 },
  { name: 'John', chapters: 21 },
  { name: 'Acts', chapters: 28 },
  { name: 'Romans', chapters: 16 },
  { name: '1-Corinthians', chapters: 16 },
  { name: '2-Corinthians', chapters: 13 },
  { name: 'Galatians', chapters: 6 },
  { name: 'Ephesians', chapters: 6 },
  { name: 'Philippians', chapters: 4 },
  { name: 'Colossians', chapters: 4 },
  { name: '1-Thessalonians', chapters: 5 },
  { name: '2-Thessalonians', chapters: 3 },
  { name: '1-Timothy', chapters: 6 },
  { name: '2-Timothy', chapters: 4 },
  { name: 'Titus', chapters: 3 },
  { name: 'Philemon', chapters: 1 },
  { name: 'Hebrews', chapters: 13 },
  { name: 'James', chapters: 5 },
  { name: '1-Peter', chapters: 5 },
  { name: '2-Peter', chapters: 3 },
  { name: '1-John', chapters: 5 },
  { name: '2-John', chapters: 1 },
  { name: '3-John', chapters: 1 },
  { name: 'Jude', chapters: 1 },
  { name: 'Revelation', chapters: 22 },
];

/**
 * Query D1 for verses via Cloudflare Worker API (batched by chapter)
 */
async function getVersesFromD1(
  translation: 'afghan2023' | 'yousafzai2019' = 'afghan2023',
  maxVerses: number = 10000
): Promise<Verse[]> {
  const allVerses: Verse[] = [];
  let totalFetched = 0;
  
  console.log(`   🌩️  Fetching verses from Worker API (${CLOUDFLARE_WORKER_URL})...`);
  
  // Normalize book name for API (replace spaces and dashes)
  function normalizeBookName(book: string): string {
    return book.replace(/\s+/g, '').replace(/-/g, '');
  }
  
  for (const book of BIBLE_BOOKS) {
    if (totalFetched >= maxVerses) break;
    
    const bookName = normalizeBookName(book.name);
    console.log(`   📖 Fetching ${book.name} (${book.chapters} chapters)...`);
    
    for (let chapter = 1; chapter <= book.chapters; chapter++) {
      if (totalFetched >= maxVerses) break;
      
      try {
        const response = await fetch(
          `${CLOUDFLARE_WORKER_URL}/api/chapter?book=${encodeURIComponent(bookName)}&chapter=${chapter}&translation=${translation}`,
          { 
            signal: AbortSignal.timeout(10000) // 10 second timeout
          }
        );
        
        if (response.ok) {
          const data = await response.json();
          if (data.verses && Array.isArray(data.verses)) {
            const verses = data.verses.map((v: any) => ({
              ref: `${v.book} ${v.chapter}:${v.verse}`,
              text: v.text,
              book: v.book,
              chapter: v.chapter,
              verse: v.verse,
              translation_key: translation,
            }));
            allVerses.push(...verses);
            totalFetched += verses.length;
            
            if (verses.length > 0 && chapter % 10 === 0) {
              console.log(`      ✅ ${book.name} ${chapter}: ${verses.length} verses (total: ${totalFetched})`);
            }
          }
        } else {
          console.warn(`      ⚠️  ${book.name} ${chapter}: HTTP ${response.status}`);
        }
      } catch (error) {
        console.warn(`      ⚠️  ${book.name} ${chapter}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
      
      // Rate limiting: small delay between requests
      await new Promise(resolve => setTimeout(resolve, 50));
    }
  }
  
  console.log(`   ✅ Loaded ${allVerses.length} verses total`);
  return allVerses;
}

/**
 * Get inflection type and base word from word_frequencies via D1
 */
async function getWordInfo(form: string): Promise<{ inflection_type: 'plain' | '1st' | '2nd' | null; base_word: string | null }> {
  try {
    const result = execSync(
      `wrangler d1 execute pashto-bible-db --remote --command="SELECT inflection_type, base_form FROM word_frequencies WHERE pashto_word = '${form.replace(/'/g, "''")}' LIMIT 1" --json`,
      { encoding: 'utf-8', cwd: process.cwd() }
    );
    
    const data = JSON.parse(result);
    if (data[0]?.results && data[0].results.length > 0) {
      const row = data[0].results[0];
      return {
        inflection_type: row.inflection_type as 'plain' | '1st' | '2nd' | null,
        base_word: row.base_form || null,
      };
    }
  } catch (error) {
    // Silently fail
  }
  
  return { inflection_type: null, base_word: null };
}

/**
 * Load word info cache (inflection type and base word) from D1
 */
async function loadWordInfoMap(uniqueForms: Set<string>): Promise<Map<string, { inflection_type: 'plain' | '1st' | '2nd' | null; base_word: string }>> {
  const map = new Map<string, { inflection_type: 'plain' | '1st' | '2nd' | null; base_word: string }>();
  const forms = Array.from(uniqueForms);
  
  console.log(`   🔍 Looking up word info for ${forms.length} unique forms from D1...`);
  
  // Query in batches to avoid command line length limits
  const batchSize = 100;
  let processed = 0;
  
  for (let i = 0; i < forms.length; i += batchSize) {
    const batch = forms.slice(i, i + batchSize);
    const formList = batch.map(f => `'${f.replace(/'/g, "''")}'`).join(',');
    
    try {
      const result = execSync(
        `wrangler d1 execute pashto-bible-db --remote --command="SELECT pashto_word, inflection_type, base_form FROM word_frequencies WHERE pashto_word IN (${formList})" --json`,
        { encoding: 'utf-8', cwd: process.cwd() }
      );
      
      const data = JSON.parse(result);
      if (data[0]?.results) {
        for (const row of data[0].results) {
          const baseWord = row.base_form || row.pashto_word; // Use base_form if available, otherwise assume word is its own base
          map.set(row.pashto_word, {
            inflection_type: row.inflection_type as 'plain' | '1st' | '2nd' | null,
            base_word: baseWord,
          });
        }
      }
    } catch (error) {
      console.warn(`   ⚠️  Batch ${i}-${i + batchSize} failed:`, error instanceof Error ? error.message : error);
    }
    
    processed += batch.length;
    if (processed % 500 === 0) {
      console.log(`      ✅ Processed ${processed}/${forms.length} forms`);
    }
  }
  
  console.log(`   ✅ Found ${map.size} word info entries`);
  return map;
}

/**
 * Tokenize Pashto text into words
 */
function tokenizePashto(text: string): string[] {
  // Remove punctuation but keep spaces
  const cleaned = text.replace(/[،۔؛؟!()\[\]{}\"]/g, ' ');
  // Split by spaces and filter empty
  return cleaned.split(/\s+/).filter(w => w.trim().length > 0);
}

/**
 * Check if word is plural
 */
function isPlural(word: string, baseWord: string): boolean {
  // Check for plural markers
  for (const marker of PLURAL_MARKERS) {
    if (word.endsWith(marker) || baseWord.endsWith(marker)) {
      return true;
    }
  }
  
  // Check if word ends with plural endings (و, ان, etc.)
  if (word.endsWith('و') && !word.endsWith('وو')) {
    // Could be plural, but also could be 2nd inflection
    // Check if base ends with و
    if (!baseWord.endsWith('و')) {
      return true;
    }
  }
  
  return false;
}

/**
 * Check if word is in a sandwich (adpositional phrase)
 */
function isInSandwich(
  words: string[],
  wordIndex: number,
  word: string
): { isInSandwich: boolean; sandwichType?: string } {
  // Check circumpositions (sandwiches with before and after)
  for (const pattern of SANDWICH_PATTERNS) {
    // Look backward for 'before' word
    let beforeIndex = -1;
    for (let i = wordIndex - 1; i >= 0 && i >= wordIndex - 5; i--) {
      if (words[i] === pattern.before) {
        beforeIndex = i;
        break;
      }
    }
    
    if (beforeIndex >= 0) {
      // Look forward for 'after' word
      for (let i = wordIndex + 1; i < words.length && i <= wordIndex + 5; i++) {
        if (words[i] === pattern.after || words[i].startsWith(pattern.after)) {
          return { isInSandwich: true, sandwichType: pattern.name };
        }
      }
    }
  }
  
  // Check prepositions (only before)
  for (let i = wordIndex - 1; i >= 0 && i >= wordIndex - 3; i--) {
    if (PREPOSITIONS.includes(words[i])) {
      return { isInSandwich: true, sandwichType: 'preposition' };
    }
  }
  
  // Check postpositions (only after)
  for (let i = wordIndex + 1; i < words.length && i <= wordIndex + 3; i++) {
    if (POSTPOSITIONS.includes(words[i])) {
      return { isInSandwich: true, sandwichType: 'postposition' };
    }
  }
  
  return { isInSandwich: false };
}

/**
 * Check if word is subject of transitive past tense verb
 */
function isSubjectOfTransitivePast(
  words: string[],
  wordIndex: number
): boolean {
  // Look forward for transitive past tense markers
  for (let i = wordIndex + 1; i < words.length && i <= wordIndex + 5; i++) {
    const word = words[i];
    for (const marker of PAST_TRANSITIVE_MARKERS) {
      if (word.includes(marker) || word === marker) {
        return true;
      }
    }
  }
  
  return false;
}

/**
 * Determine inflection type (1st or 2nd)
 */
function getInflectionType(word: string, baseWord: string): '1st' | '2nd' | 'none' {
  if (word === baseWord) return 'none';
  
  // Check 2nd inflection endings (usually "و")
  for (const ending of SECOND_INFLECTION_ENDINGS) {
    if (word.endsWith(ending) && !baseWord.endsWith(ending)) {
      return '2nd';
    }
  }
  
  // Check 1st inflection endings
  for (const ending of FIRST_INFLECTION_ENDINGS) {
    if (word.endsWith(ending) && !baseWord.endsWith(ending)) {
      return '1st';
    }
  }
  
  return 'none';
}

/**
 * Analyze a verse for inflection reasons
 */
function analyzeVerse(
  text: string,
  verseRef: string,
  wordInfoMap: Map<string, { inflection_type: 'plain' | '1st' | '2nd' | null; base_word: string }>
): InflectionAnalysis[] {
  const words = tokenizePashto(text);
  const analyses: InflectionAnalysis[] = [];
  
  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    const wordInfo = wordInfoMap.get(word);
    
    // Skip if word not found in database
    if (!wordInfo) continue;
    
    // Skip if plain (not inflected)
    if (wordInfo.inflection_type === 'plain' || wordInfo.inflection_type === null) continue;
    
    // Skip if word is same as base (not inflected)
    const baseWord = wordInfo.base_word;
    if (word === baseWord) continue;
    
    // Use inflection type from database
    const inflectionType = wordInfo.inflection_type === '1st' ? '1st' : wordInfo.inflection_type === '2nd' ? '2nd' : 'none';
    
    // Skip if not inflected
    if (inflectionType === 'none') continue;
    
    // Determine reasons
    const isPluralReason = isPlural(word, baseWord);
    const sandwich = isInSandwich(words, i, word);
    const isTransitivePast = isSubjectOfTransitivePast(words, i);
    
    // Only include if at least one reason is found
    if (isPluralReason || sandwich.isInSandwich || isTransitivePast) {
      analyses.push({
        word,
        baseWord,
        position: i,
        inflectionType,
        reasons: {
          isPlural: isPluralReason,
          isInSandwich: sandwich.isInSandwich,
          sandwichType: sandwich.sandwichType,
          isSubjectOfTransitivePast: isTransitivePast,
        },
        context: {
          verseRef,
          sentence: text,
          surroundingWords: words.slice(Math.max(0, i - 2), Math.min(words.length, i + 3)),
        },
      });
    }
  }
  
  return analyses;
}

/**
 * Main analysis function
 */
async function main() {
  console.log('🚀 Analyzing Inflection Reasons in Pashto Bible Verses\n');
  console.log('Based on: https://grammar.lingdocs.com/sandwiches/sandwiches/\n');
  
  const translation: 'afghan2023' | 'yousafzai2019' = 'afghan2023';
  const maxVerses = process.argv.includes('--all') ? Infinity : 500; // Default: 500 verses for testing
  
  // Step 1: Load verses from D1
  console.log('📖 Step 1: Loading verses from D1...');
  const verses = await getVersesFromD1(translation, maxVerses);
  
  if (verses.length === 0) {
    console.error('❌ No verses found. Make sure D1 is accessible.');
    return;
  }
  
  // Step 2: Extract unique word forms
  console.log('\n📖 Step 2: Extracting unique word forms...');
  const uniqueForms = new Set<string>();
  for (const verse of verses) {
    const words = tokenizePashto(verse.text);
    for (const word of words) {
      if (word.length > 1) { // Skip single character words
        uniqueForms.add(word);
      }
    }
  }
  console.log(`   Found ${uniqueForms.size} unique forms`);
  
  // Step 3: Load word info (inflection type and base word) from D1
  console.log('\n📖 Step 3: Loading word info (inflection type and base word) from D1...');
  const wordInfoMap = await loadWordInfoMap(uniqueForms);
  
  // Step 4: Analyze verses
  console.log(`\n🔍 Step 4: Analyzing ${verses.length} verses...`);
  const allAnalyses: InflectionAnalysis[] = [];
  
  let analyzed = 0;
  for (const verse of verses) {
    const analyses = analyzeVerse(verse.text, verse.ref, wordInfoMap);
    allAnalyses.push(...analyses);
    
    analyzed++;
    if (analyzed % 100 === 0) {
      console.log(`   ✅ Analyzed ${analyzed}/${verses.length} verses (${allAnalyses.length} inflected words found)`);
    }
  }
  
  console.log(`\n📊 Summary:`);
  console.log(`   Total verses analyzed: ${verses.length}`);
  console.log(`   Total inflected words found: ${allAnalyses.length}`);
  
  const reasonCounts = {
    plural: 0,
    sandwich: 0,
    transitivePast: 0,
    unknown: 0,
  };
  
  for (const analysis of allAnalyses) {
    if (analysis.reasons.isPlural) reasonCounts.plural++;
    if (analysis.reasons.isInSandwich) reasonCounts.sandwich++;
    if (analysis.reasons.isSubjectOfTransitivePast) reasonCounts.transitivePast++;
    if (!analysis.reasons.isPlural && !analysis.reasons.isInSandwich && !analysis.reasons.isSubjectOfTransitivePast) {
      reasonCounts.unknown++;
    }
  }
  
  console.log(`   Plural: ${reasonCounts.plural}`);
  console.log(`   In sandwich: ${reasonCounts.sandwich}`);
  console.log(`   Subject of transitive past: ${reasonCounts.transitivePast}`);
  console.log(`   Unknown: ${reasonCounts.unknown}`);
  
  // Step 5: Generate SQL
  console.log(`\n📝 Step 5: Generating SQL...`);
  
  const sql: string[] = [];
  sql.push('-- Inflection Reason Analysis');
  sql.push(`-- Generated: ${new Date().toISOString()}`);
  sql.push(`-- Verses analyzed: ${verses.length}`);
  sql.push(`-- Inflected words found: ${allAnalyses.length}`);
  sql.push('-- Based on: https://grammar.lingdocs.com/sandwiches/sandwiches/');
  sql.push('');
  
  // Generate INSERT statements
  for (const analysis of allAnalyses) {
    sql.push(`INSERT INTO inflection_reasons (`);
    sql.push(`  pashto_form,`);
    sql.push(`  base_word,`);
    sql.push(`  verse_ref,`);
    sql.push(`  inflection_type,`);
    sql.push(`  is_plural,`);
    sql.push(`  is_in_sandwich,`);
    sql.push(`  sandwich_type,`);
    sql.push(`  is_subject_transitive_past,`);
    sql.push(`  context_sentence,`);
    sql.push(`  word_position,`);
    sql.push(`  translation_key`);
    sql.push(`) VALUES (`);
    sql.push(`  '${analysis.word.replace(/'/g, "''")}',`);
    sql.push(`  '${analysis.baseWord.replace(/'/g, "''")}',`);
    sql.push(`  '${analysis.context.verseRef}',`);
    sql.push(`  '${analysis.inflectionType}',`);
    sql.push(`  ${analysis.reasons.isPlural ? 1 : 0},`);
    sql.push(`  ${analysis.reasons.isInSandwich ? 1 : 0},`);
    sql.push(`  ${analysis.reasons.sandwichType ? `'${analysis.reasons.sandwichType.replace(/'/g, "''")}'` : 'NULL'},`);
    sql.push(`  ${analysis.reasons.isSubjectOfTransitivePast ? 1 : 0},`);
    sql.push(`  '${analysis.context.sentence.replace(/'/g, "''")}',`);
    sql.push(`  ${analysis.position},`);
    sql.push(`  '${translation}'`);
    sql.push(`);`);
    sql.push('');
  }
  
  const sqlPath = join(process.cwd(), '.temp-inflection-reasons.sql');
  writeFileSync(sqlPath, sql.join('\n'), 'utf-8');
  
  console.log(`✅ SQL file created: ${sqlPath}`);
  console.log(`   ${allAnalyses.length} INSERT statements`);
  console.log(`\n🚀 To execute:`);
  console.log(`   wrangler d1 execute pashto-bible-db --remote --file=${sqlPath}`);
  console.log(`\n💡 Tip: Use --all flag to analyze all verses:`);
  console.log(`   npx tsx cloudflare/analyze-inflection-reasons.ts --all`);
}

main().catch(console.error);
