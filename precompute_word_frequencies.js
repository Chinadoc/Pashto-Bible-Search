#!/usr/bin/env node

/**
 * Precompute Word Frequencies with Verse References and TF-IDF Scores
 * 
 * Transforms legacy frequency format:
 *   { "word": frequency }
 * Into production-ready format:
 *   {
 *     "word": {
 *       "frequency": 500,
 *       "verse_refs": ["Genesis 1:1", "Genesis 1:3", ...],
 *       "tf_idf_scores": [0.95, 0.92, ...]
 *     }
 *   }
 * 
 * Usage:
 *   node precompute_word_frequencies.js > app/data/word_frequency_list.json
 *   node precompute_word_frequencies.js --yousafzai > app/data/yousafzai_word_frequency_list.json
 * 
 * Runtime: ~10-20 minutes for full dataset (first run only)
 */

const fs = require('fs').promises;
const path = require('path');

// Configuration
const isYousafzai = process.argv.includes('--yousafzai');
const CONFIG = {
  versesFile: isYousafzai
    ? 'app/data/yousafzai_all_verses.json'
    : 'public/verses.json.gz',
  frequencyFile: isYousafzai
    ? 'app/data/yousafzai_word_frequency_list.json'
    : 'app/data/word_frequency_list.json',
  translation: isYousafzai ? 'yousafzai2019' : 'afghan2023',
  output: null // Set later
};

console.log(`\n🚀 Preprocessing word frequencies for ${CONFIG.translation}...\n`);

// ============================================================================
// LOAD VERSES
// ============================================================================

async function loadVerses() {
  console.log('📖 Loading verses data...');

  try {
    if (CONFIG.versesFile.endsWith('.gz')) {
      // Decompress gzipped verses
      const { gunzipSync } = require('zlib');
      const compressedPath = path.join(process.cwd(), CONFIG.versesFile);
      const compressed = await fs.readFile(compressedPath);
      const jsonText = gunzipSync(compressed).toString('utf8');
      const verses = JSON.parse(jsonText);

      // Convert object format to array for consistent processing
      const versesArray = [];
      for (const [ref, data] of Object.entries(verses)) {
        if (data && typeof data === 'object' && data.text) {
          versesArray.push({
            ref,
            text: data.text,
            text_normalized: data.text_normalized || data.text
          });
        }
      }

      console.log(`   ✅ Loaded ${versesArray.length} Afghan verses\n`);
      return versesArray;
    } else {
      // Plain JSON verses
      const versesPath = path.join(process.cwd(), CONFIG.versesFile);
      const jsonText = await fs.readFile(versesPath, 'utf8');
      const versesArray = JSON.parse(jsonText);

      console.log(`   ✅ Loaded ${versesArray.length} Yousafzai verses\n`);
      return versesArray;
    }
  } catch (error) {
    console.error(`❌ Error loading verses: ${error.message}`);
    process.exit(1);
  }
}

// ============================================================================
// LOAD LEGACY FREQUENCIES
// ============================================================================

async function loadLegacyFrequencies() {
  console.log('📊 Loading legacy frequency data...');

  try {
    const freqPath = path.join(process.cwd(), CONFIG.frequencyFile);
    const jsonText = await fs.readFile(freqPath, 'utf8');
    const freqArray = JSON.parse(jsonText);

    // Convert array format to object keyed by word
    const frequencies = {};
    for (const item of freqArray) {
      if (item.pashto && typeof item.frequency === 'number') {
        frequencies[item.pashto] = item.frequency;
      }
    }

    console.log(`   ✅ Loaded ${Object.keys(frequencies).length} words\n`);
    return frequencies;
  } catch (error) {
    console.error(`❌ Error loading frequencies: ${error.message}`);
    process.exit(1);
  }
}

// ============================================================================
// COMPUTE TF-IDF AND POSTING LISTS
// ============================================================================

function normalizeText(text) {
  if (!text) return '';
  return text.toLowerCase().trim();
}

function tokenize(text) {
  // Simple tokenization: split on whitespace and common punctuation
  // For Pashto, words are typically separated by spaces
  const normalized = normalizeText(text);
  return normalized.split(/\s+/).filter(w => w.length > 0);
}

async function computeWordVerseMappings(verses, frequencies) {
  console.log('🔍 Computing word-to-verse mappings (this may take a few minutes)...\n');

  const wordVerseMap = new Map(); // word -> Set<verse_refs>
  const totalVerses = verses.length;
  const words = Object.keys(frequencies);
  const wordCount = words.length;

  // Initialize tracking for each word
  for (const word of words) {
    wordVerseMap.set(word, new Set());
  }

  // Scan each verse
  let processed = 0;
  for (const verse of verses) {
    processed++;
    if (processed % 1000 === 0) {
      const pct = ((processed / totalVerses) * 100).toFixed(1);
      process.stdout.write(`\r   Progress: ${processed}/${totalVerses} verses (${pct}%)`);
    }

    const tokens = tokenize(verse.text_normalized || verse.text);
    const tokenSet = new Set(tokens);

    // Check which words appear in this verse
    for (const word of words) {
      if (tokenSet.has(word.toLowerCase())) {
        wordVerseMap.get(word).add(verse.ref);
      }
    }
  }

  console.log(`\r   Progress: ${processed}/${totalVerses} verses (100%)\n`);

  // Convert Sets to sorted arrays
  const wordVerseRefs = {};
  let wordsFound = 0;
  let wordsNotFound = 0;

  for (const word of words) {
    const refs = Array.from(wordVerseMap.get(word) || new Set()).sort();
    if (refs.length > 0) {
      wordVerseRefs[word] = refs;
      wordsFound++;
    } else {
      wordsNotFound++;
    }
  }

  console.log(`   ✅ Found ${wordsFound} words with verse mappings`);
  console.log(`   ⚠️  ${wordsNotFound} words not found in verses (will be skipped)\n`);

  return wordVerseRefs;
}

function computeTfIdfScores(frequency, verseRefs, totalVerses) {
  const n = verseRefs.length;

  // TF (Term Frequency) = frequency / total words in corpus
  const tf = frequency / (totalVerses * 10); // Rough estimate: 10 words per verse average

  // IDF (Inverse Document Frequency) = log(total_verses / verses_containing_term)
  const idf = Math.log(totalVerses / Math.max(1, n));

  // TF-IDF score per verse (simplified: same score for all verses containing the word)
  const tfidfScore = tf * idf;

  // Return array of scores, one per verse ref
  return new Array(n).fill(tfidfScore);
}

// ============================================================================
// MAIN PREPROCESSING
// ============================================================================

async function main() {
  try {
    // Step 1: Load data
    const verses = await loadVerses();
    const legacyFrequencies = await loadLegacyFrequencies();

    // Step 2: Compute verse mappings
    const wordVerseRefs = await computeWordVerseMappings(verses, legacyFrequencies);

    // Step 3: Build rich frequency format
    console.log('📝 Building rich frequency format...');
    const richFrequencies = {};
    let processed = 0;
    const totalWords = Object.keys(wordVerseRefs).length;

    for (const [word, verseRefs] of Object.entries(wordVerseRefs)) {
      processed++;
      if (processed % 1000 === 0) {
        process.stdout.write(`\r   Progress: ${processed}/${totalWords} words`);
      }

      const frequency = legacyFrequencies[word];
      const tfIdfScores = computeTfIdfScores(frequency, verseRefs, verses.length);

      richFrequencies[word] = {
        frequency,
        verse_refs: verseRefs,
        tf_idf_scores: tfIdfScores.map(v => parseFloat(v.toFixed(4))) // Round to 4 decimals
      };
    }

    console.log(`\r   Progress: ${processed}/${totalWords} words\n`);

    // Step 4: Output JSON
    console.log('💾 Writing output...');
    const output = JSON.stringify(richFrequencies, null, 2);
    console.log(output);

    console.log(`\n✅ Preprocessing complete!`, {
      words: Object.keys(richFrequencies).length,
      verses: verses.length,
      translation: CONFIG.translation
    });
  } catch (error) {
    console.error('\n❌ Preprocessing failed:', error.message);
    process.exit(1);
  }
}

main();
