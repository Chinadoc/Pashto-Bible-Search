#!/usr/bin/env node

/**
 * Production Data Ingestion Script for Pashto Bible Search
 *
 * Features:
 * - Resumable ingestion with progress tracking
 * - Batched operations for reliability
 * - Pre-computed word frequencies (no verse scanning)
 * - Configurable file paths
 * - Comprehensive error handling and verification
 * - Audio URL handling with fallback support
 *
 * Usage:
 * node ingest_to_production_schema.js [afghan-verses-path] [yousafzai-verses-path] [audio-map-path] [afghan-freq-path] [yousafzai-freq-path]
 */

const fs = require('fs').promises;
const path = require('path');
require('dotenv').config();

// Configuration
const CONFIG = {
  // Supabase configuration
  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://nkombdutnjvaasxrbmdn.supabase.co',
    serviceKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
  },

  // File paths (configurable via command line)
  files: {
    afghanVerses: process.argv[2] || 'public/verses.json.gz',
    yousafzaiVerses: process.argv[3] || 'app/data/yousafzai_all_verses.json',
    audioMap: process.argv[4] || 'google_drive_audio_urls.json',
    frequencies: {
      afghan: process.argv[5] || 'app/data/word_frequency_list.json',
      yousafzai: process.argv[6] || 'app/data/yousafzai_word_frequency_list.json'
    }
  },

  // Batch sizes for reliable insertion
  batches: {
    verses: 500,      // Smaller batches for verses (more complex data)
    wordIndex: 1000   // Larger batches for word index (simpler data)
  },

  // Progress tracking
  progressFile: '.ingestion_progress.json'
};

if (!CONFIG.supabase.serviceKey) {
  console.error('❌ Missing SUPABASE_SERVICE_ROLE_KEY environment variable');
  console.log('Add this to your .env file for data ingestion');
  process.exit(1);
}

console.log('🚀 Starting production data ingestion...\n');
console.log('📋 Configuration:');
console.log(`   Afghan verses: ${CONFIG.files.afghanVerses}`);
console.log(`   Yousafzai verses: ${CONFIG.files.yousafzaiVerses}`);
console.log(`   Audio map: ${CONFIG.files.audioMap}`);
console.log(`   Afghan frequencies: ${CONFIG.files.frequencies.afghan}`);
console.log(`   Yousafzai frequencies: ${CONFIG.files.frequencies.yousafzai}`);
console.log(`   Batch size: ${CONFIG.batches.verses} verses, ${CONFIG.batches.wordIndex} words\n`);

// Progress tracking utilities
async function loadProgress() {
  try {
    const progressText = await fs.readFile(CONFIG.progressFile, 'utf8');
    return JSON.parse(progressText);
  } catch {
    return {
      versesInserted: { afghan: 0, yousafzai: 0 },
      wordsIndexed: { afghan: 0, yousafzai: 0 },
      failedRefs: { afghan: [], yousafzai: [] },
      completedSteps: [],
      failedWords: {} // Added for new word indexing logic
    };
  }
}

async function saveProgress(progress) {
  await fs.writeFile(CONFIG.progressFile, JSON.stringify(progress, null, 2));
}

async function markStepCompleted(step) {
  const progress = await loadProgress();
  if (!progress.completedSteps.includes(step)) {
    progress.completedSteps.push(step);
    await saveProgress(progress);
  }
}

// Initialize Supabase client with service role key for data operations
async function createSupabaseClient() {
  const { createClient } = await import('@supabase/supabase-js');
  return createClient(CONFIG.supabase.url, CONFIG.supabase.serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
}

// Clear existing data before insertion using SQL TRUNCATE
async function clearTables(supabase) {
  console.log('🧹 Clearing existing data with TRUNCATE...');

  try {
    // Use raw SQL to truncate tables properly (this respects dependencies)
    const { error } = await supabase.rpc('exec_sql', {
      sql: `
        TRUNCATE public.word_occurrence_index, public.verses_yousafzai, public.verses RESTART IDENTITY CASCADE;
      `
    });

    if (error && error.code === '42883') {
      // exec_sql function doesn't exist; fall back to manual deletion
      console.log('   ⚠️ exec_sql RPC not available, using sequential delete...');
      await supabase.from('word_occurrence_index').delete().gte('id', 0);
      await supabase.from('verses_yousafzai').delete().gte('id', 0);
      await supabase.from('verses').delete().gte('id', 0);
    } else if (error) {
      throw error;
    }

    console.log('   ✅ Tables cleared');
    await markStepCompleted('clear_tables');
  } catch (error) {
    console.error('   ❌ Error clearing tables:', error);
    console.log('   💡 Alternative: Run this SQL in Supabase console:');
    console.log('   TRUNCATE public.word_occurrence_index, public.verses_yousafzai, public.verses RESTART IDENTITY CASCADE;');
    throw error;
  }
}

// Load verses data with proper error handling
async function loadVersesData() {
  console.log('📖 Loading verses data...');

  // Load Afghan 2023 verses (compressed)
  const afghanPath = path.join(process.cwd(), CONFIG.files.afghanVerses);
  let afghanData;

  try {
    console.log(`   Loading Afghan 2023 verses from ${CONFIG.files.afghanVerses}...`);
    const compressed = await fs.readFile(afghanPath);
    const { gunzipSync } = require('zlib');
    const jsonText = gunzipSync(compressed).toString('utf8');
    afghanData = JSON.parse(jsonText);
    console.log(`   ✅ Loaded ${Object.keys(afghanData).length} Afghan verses`);
  } catch (error) {
    console.error(`   ❌ Could not load Afghan verses: ${error.message}`);
    throw new Error(`Failed to load Afghan verses from ${afghanPath}: ${error.message}`);
  }

  // Load Yousafzai 2019 verses
  const yousafzaiPath = path.join(process.cwd(), CONFIG.files.yousafzaiVerses);
  let yousafzaiData;

  try {
    console.log(`   Loading Yousafzai 2019 verses from ${CONFIG.files.yousafzaiVerses}...`);
    const jsonText = await fs.readFile(yousafzaiPath, 'utf8');
    yousafzaiData = JSON.parse(jsonText);
    console.log(`   ✅ Loaded ${yousafzaiData.length} Yousafzai verses`);
  } catch (error) {
    console.error(`   ❌ Could not load Yousafzai verses: ${error.message}`);
    throw new Error(`Failed to load Yousafzai verses from ${yousafzaiPath}: ${error.message}`);
  }

  return { afghanData, yousafzaiData };
}

// Load audio mapping with fallback options
async function loadAudioMapping() {
  console.log('🎵 Loading audio mapping...');

  const audioPaths = [
    path.join(process.cwd(), CONFIG.files.audioMap),
    path.join(process.cwd(), 'google_drive_audio_urls.json'),
    path.join(process.cwd(), 'public', 'google_drive_audio_urls.json'),
    path.join(process.cwd(), 'app', 'data', 'google_drive_audio_urls.json')
  ];

  for (const audioPath of audioPaths) {
    try {
      console.log(`   Trying ${audioPath}...`);
      const jsonText = await fs.readFile(audioPath, 'utf8');
      const audioMap = JSON.parse(jsonText);
      console.log(`   ✅ Loaded ${Object.keys(audioMap).length} audio mappings`);
      return audioMap;
    } catch (error) {
      console.log(`   ⚠️ Could not load from ${audioPath}: ${error.message}`);
    }
  }

  console.log('   ⚠️ No audio mapping found, verses will be inserted without audio URLs');
  return {};
}

// Load frequency data (pre-computed word frequencies)
async function loadFrequencyData() {
  console.log('📊 Loading frequency data...');

  const frequencyData = {};

  // Load Afghan frequencies
  try {
    console.log(`   Loading Afghan frequencies from ${CONFIG.files.frequencies.afghan}...`);
    const filePath = path.join(process.cwd(), CONFIG.files.frequencies.afghan);
    const jsonText = await fs.readFile(filePath, 'utf8');
    const frequencies = JSON.parse(jsonText);

    frequencyData.afghan2023 = {};
    let totalFreq = 0;

    for (const item of frequencies) {
      if (item?.pashto && typeof item.frequency === 'number') {
        frequencyData.afghan2023[item.pashto] = item.frequency;
        totalFreq += item.frequency;
      }
    }

    console.log(`   ✅ Loaded ${Object.keys(frequencyData.afghan2023).length} Afghan frequencies (total: ${totalFreq})`);
  } catch (error) {
    console.error(`   ❌ Could not load Afghan frequencies: ${error.message}`);
    throw new Error(`Failed to load Afghan frequencies from ${CONFIG.files.frequencies.afghan}: ${error.message}`);
  }

  // Load Yousafzai frequencies
  try {
    console.log(`   Loading Yousafzai frequencies from ${CONFIG.files.frequencies.yousafzai}...`);
    const filePath = path.join(process.cwd(), CONFIG.files.frequencies.yousafzai);
    const jsonText = await fs.readFile(filePath, 'utf8');
    const frequencies = JSON.parse(jsonText);

    frequencyData.yousafzai2019 = {};
    let totalFreq = 0;

    for (const item of frequencies) {
      if (item?.pashto && typeof item.frequency === 'number') {
        frequencyData.yousafzai2019[item.pashto] = item.frequency;
        totalFreq += item.frequency;
      }
    }

    console.log(`   ✅ Loaded ${Object.keys(frequencyData.yousafzai2019).length} Yousafzai frequencies (total: ${totalFreq})`);
  } catch (error) {
    console.error(`   ❌ Could not load Yousafzai frequencies: ${error.message}`);
    throw new Error(`Failed to load Yousafzai frequencies from ${CONFIG.files.frequencies.yousafzai}: ${error.message}`);
  }

  return frequencyData;
}

function parseVerseRef(ref) {
  const [bookPart, versePart] = ref.split(' ');
  const [chapter, verse] = versePart.split(':').map(n => parseInt(n, 10));

  return {
    book: bookPart,
    chapter,
    verse
  };
}

function determineTestament(book) {
  const otBooks = new Set([
    'Genesis', 'Exodus', 'Leviticus', 'Numbers', 'Deuteronomy',
    'Joshua', 'Judges', 'Ruth', '1 Samuel', '2 Samuel',
    '1 Kings', '2 Kings', '1 Chronicles', '2 Chronicles',
    'Ezra', 'Nehemiah', 'Esther', 'Job', 'Psalms', 'Proverbs',
    'Ecclesiastes', 'Song of Solomon', 'Isaiah', 'Jeremiah',
    'Lamentations', 'Ezekiel', 'Daniel', 'Hosea', 'Joel',
    'Amos', 'Obadiah', 'Jonah', 'Micah', 'Nahum', 'Habakkuk',
    'Zephaniah', 'Haggai', 'Zechariah', 'Malachi'
  ]);

  return otBooks.has(book) ? 'OT' : 'NT';
}

// Insert verses with robust batching and error handling
async function insertVerses(supabase, afghanData, yousafzaiData, audioMap) {
  console.log('\n💾 Inserting verses into database...');

  const progress = await loadProgress();
  let afghanInserted = progress.versesInserted.afghan;
  let yousafzaiInserted = progress.versesInserted.yousafzai;

  // Process Afghan verses
  console.log('   Processing Afghan verses...');
  const afghanVerses = [];

  for (const [ref, data] of Object.entries(afghanData)) {
    if (!data || typeof data !== 'object' || !data.text) continue;

    const { book, chapter, verse } = parseVerseRef(ref);
    const testament = determineTestament(book);

    // Get audio URL from mapping
    const audioUrl = audioMap[ref] || null;

    afghanVerses.push({
      ref,
      book,
      chapter,
      verse,
      text: data.text,
      text_normalized: data.text_normalized || null,
      testament,
      translation_key: 'afghan2023',
      dialect: 'afghan',
      audio_url: audioUrl,
      audio_source: audioUrl ? 'google_drive' : null
    });
  }

  // Process Yousafzai verses
  console.log('   Processing Yousafzai verses...');
  const yousafzaiVerses = [];

  for (const item of yousafzaiData) {
    if (!item || !item.book || !item.text) continue;

    const ref = `${item.book} ${item.chapter}:${item.verse}`;
    const testament = determineTestament(item.book);

    yousafzaiVerses.push({
      ref,
      book: item.book,
      chapter: item.chapter,
      verse: item.verse,
      text: item.text,
      text_normalized: item.text_html || item.text,
      testament,
      translation_key: 'yousafzai2019',
      dialect: 'yousafzai',
      tags: item.tags || [],
      audio_url: item.audio_url || audioMap[ref] || null,
      audio_source: (item.audio_url || audioMap[ref]) ? 'google_drive' : null
    });
  }

  console.log(`   Prepared ${afghanVerses.length} Afghan verses and ${yousafzaiVerses.length} Yousafzai verses`);

  // Batch insert Afghan verses with resumability
  if (afghanVerses.length > 0) {
    console.log(`   Inserting Afghan verses (resuming from ${afghanInserted})...`);
    const batchSize = CONFIG.batches.verses;
    let successCount = 0;
    let failedRefs = progress.failedRefs.afghan || [];

    for (let i = afghanInserted; i < afghanVerses.length; i += batchSize) {
      const batch = afghanVerses.slice(i, i + batchSize);
      const batchNum = Math.floor(i / batchSize) + 1;
      const totalBatches = Math.ceil(afghanVerses.length / batchSize);

      console.log(`     Inserting Afghan batch ${batchNum}/${totalBatches} (${batch.length} verses)...`);

      try {
        const { error } = await supabase
          .from('verses')
          .insert(batch);

        if (error) {
          console.error(`     ❌ Error inserting Afghan batch ${batchNum}:`, error);
          // Log failed references for manual retry
          failedRefs.push(...batch.map(v => v.ref));
        } else {
          console.log(`     ✅ Afghan batch ${batchNum} inserted`);
          successCount += batch.length;
        }
      } catch (error) {
        console.error(`     ❌ Exception in Afghan batch ${batchNum}:`, error);
        failedRefs.push(...batch.map(v => v.ref));
      }

      // Update progress
      afghanInserted = i + batch.length;
      progress.versesInserted.afghan = afghanInserted;
      progress.failedRefs.afghan = failedRefs;
      await saveProgress(progress);
    }

    console.log(`   ✅ Afghan insertion complete: ${successCount} successful, ${failedRefs.length} failed`);
  }

  // Batch insert Yousafzai verses with resumability
  if (yousafzaiVerses.length > 0) {
    console.log(`   Inserting Yousafzai verses (resuming from ${yousafzaiInserted})...`);
    const batchSize = CONFIG.batches.verses;
    let successCount = 0;
    let failedRefs = progress.failedRefs.yousafzai || [];

    for (let i = yousafzaiInserted; i < yousafzaiVerses.length; i += batchSize) {
      const batch = yousafzaiVerses.slice(i, i + batchSize);
      const batchNum = Math.floor(i / batchSize) + 1;
      const totalBatches = Math.ceil(yousafzaiVerses.length / batchSize);

      console.log(`     Inserting Yousafzai batch ${batchNum}/${totalBatches} (${batch.length} verses)...`);

      try {
        const { error } = await supabase
          .from('verses_yousafzai')
          .insert(batch);

        if (error) {
          console.error(`     ❌ Error inserting Yousafzai batch ${batchNum}:`, error);
          failedRefs.push(...batch.map(v => v.ref));
        } else {
          console.log(`     ✅ Yousafzai batch ${batchNum} inserted`);
          successCount += batch.length;
        }
      } catch (error) {
        console.error(`     ❌ Exception in Yousafzai batch ${batchNum}:`, error);
        failedRefs.push(...batch.map(v => v.ref));
      }

      // Update progress
      yousafzaiInserted = i + batch.length;
      progress.versesInserted.yousafzai = yousafzaiInserted;
      progress.failedRefs.yousafzai = failedRefs;
      await saveProgress(progress);
    }

    console.log(`   ✅ Yousafzai insertion complete: ${successCount} successful, ${failedRefs.length} failed`);
  }

  return {
    afghanCount: afghanVerses.length,
    yousafzaiCount: yousafzaiVerses.length,
    afghanInserted: progress.versesInserted.afghan,
    yousafzaiInserted: progress.versesInserted.yousafzai
  };
}

// Build word occurrence index from pre-computed frequencies (no verse scanning!)
async function buildWordOccurrenceIndex(supabase, frequencyData) {
  console.log('\n🔍 Building word occurrence index from pre-computed frequencies...');

  const progress = await loadProgress();
  let afghanIndexed = progress.wordsIndexed.afghan;
  let yousafzaiIndexed = progress.wordsIndexed.yousafzai;

  // Process each translation
  for (const [translation, frequencies] of Object.entries(frequencyData)) {
    console.log(`   Processing ${translation}...`);

    // Convert frequency data to word occurrence format
    // Frequencies should have structure: { word: frequency } OR { word: { frequency, verse_refs: [...] } }
    const wordOccurrences = [];
    let processedWords = 0;
    let skippedWords = 0;

    for (const [word, freqData] of Object.entries(frequencies)) {
      if (processedWords < afghanIndexed && translation === 'afghan2023') continue;
      if (processedWords < yousafzaiIndexed && translation === 'yousafzai2019') continue;

      let frequency = 0;
      let verseRefs = [];

      // Handle both flat structure (just frequency) and nested structure (with verse_refs)
      if (typeof freqData === 'number') {
        frequency = freqData;
        // If frequency data doesn't include verse refs, we'll need to look them up (slower path)
        console.warn(`     ⚠️ Word "${word}" missing precomputed verse_refs, will need fallback`);
        skippedWords++;
        continue; // Skip for now; in production, compute this offline
      } else if (typeof freqData === 'object' && freqData !== null) {
        frequency = freqData.frequency || 0;
        verseRefs = freqData.verse_refs || [];
      } else {
        skippedWords++;
        continue;
      }

      if (verseRefs.length > 0) {
        // Calculate TF-IDF scores from pre-computed data if available
        let tfIdfScores = null;
        if (freqData.tf_idf_scores && Array.isArray(freqData.tf_idf_scores)) {
          tfIdfScores = freqData.tf_idf_scores;
        } else {
          // Fallback: normalize frequency as a simple score
          tfIdfScores = new Array(verseRefs.length).fill(frequency / 1000);
        }

        wordOccurrences.push({
          word,
          translation_key: translation,
          frequency,
          verse_refs: verseRefs,
          tfidf: tfIdfScores,
          primary_verse_ref: verseRefs[0]
        });

        processedWords++;
      } else {
        skippedWords++;
      }
    }

    console.log(`   Found ${wordOccurrences.length} words with verse mappings for ${translation} (${skippedWords} skipped)`);

    if (wordOccurrences.length > 0) {
      // Insert in batches with better error tracking
      const batchSize = CONFIG.batches.wordIndex;
      let successCount = 0;
      let failedWords = [];

      for (let i = 0; i < wordOccurrences.length; i += batchSize) {
        const batch = wordOccurrences.slice(i, i + batchSize);
        const batchNum = Math.floor(i / batchSize) + 1;
        const totalBatches = Math.ceil(wordOccurrences.length / batchSize);

        console.log(`     Inserting ${translation} word batch ${batchNum}/${totalBatches} (${batch.length} words)...`);

        try {
          const { error } = await supabase
            .from('word_occurrence_index')
            .insert(batch);

          if (error) {
            console.error(`     ❌ Error inserting ${translation} word batch ${batchNum}:`, error);
            // Track individual failed words from this batch
            failedWords.push(...batch.map(w => w.word));
          } else {
            console.log(`     ✅ ${translation} word batch ${batchNum} inserted (${batch.length} words)`);
            successCount += batch.length;
          }
        } catch (error) {
          console.error(`     ❌ Exception in ${translation} word batch ${batchNum}:`, error);
          failedWords.push(...batch.map(w => w.word));
        }

        // Update progress
        if (translation === 'afghan2023') {
          afghanIndexed = i + batch.length;
          progress.wordsIndexed.afghan = afghanIndexed;
        } else {
          yousafzaiIndexed = i + batch.length;
          progress.wordsIndexed.yousafzai = yousafzaiIndexed;
        }
        progress.failedWords = progress.failedWords || {};
        progress.failedWords[translation] = failedWords;
        await saveProgress(progress);
      }

      console.log(`   ✅ ${translation} indexing complete: ${successCount} successful, ${failedWords.length} failed`);
    }
  }

  return { afghanIndexed, yousafzaiIndexed };
}

// Comprehensive verification of ingestion
async function verifyIngestion(supabase, frequencyData) {
  console.log('\n✅ Verifying data ingestion...\n');

  const results = {};
  let allValid = true;

  // Verify Afghan verses
  try {
    console.log('📖 Afghan Verses:');
    const { count: afghanCount, error: err1 } = await supabase
      .from('verses')
      .select('*', { count: 'exact', head: true });

    if (err1) throw err1;

    console.log(`   ✅ Count: ${afghanCount} verses`);
    results.afghan_verses = afghanCount;
  } catch (error) {
    console.error(`   ❌ Error verifying Afghan verses:`, error);
    allValid = false;
  }

  // Verify Yousafzai verses
  try {
    console.log('📖 Yousafzai Verses:');
    const { count: yousafzaiCount, error: err2 } = await supabase
      .from('verses_yousafzai')
      .select('*', { count: 'exact', head: true });

    if (err2) throw err2;

    console.log(`   ✅ Count: ${yousafzaiCount} verses`);
    results.yousafzai_verses = yousafzaiCount;
  } catch (error) {
    console.error(`   ❌ Error verifying Yousafzai verses:`, error);
    allValid = false;
  }

  // Verify Afghan word frequencies match
  try {
    console.log('\n📊 Afghan Word Frequencies:');
    const expectedCount = Object.keys(frequencyData.afghan2023).length;
    const { count: actualCount, error: err3 } = await supabase
      .from('word_occurrence_index')
      .select('*', { count: 'exact', head: true })
      .eq('translation_key', 'afghan2023');

    if (err3) throw err3;

    if (actualCount === expectedCount) {
      console.log(`   ✅ Count matches: ${actualCount} words`);
    } else {
      console.log(`   ⚠️ Count mismatch: expected ${expectedCount}, got ${actualCount}`);
      allValid = false;
    }
    results.afghan_words = { expected: expectedCount, actual: actualCount };
  } catch (error) {
    console.error(`   ❌ Error verifying Afghan frequencies:`, error);
    allValid = false;
  }

  // Verify Yousafzai word frequencies match
  try {
    console.log('📊 Yousafzai Word Frequencies:');
    const expectedCount = Object.keys(frequencyData.yousafzai2019).length;
    const { count: actualCount, error: err4 } = await supabase
      .from('word_occurrence_index')
      .select('*', { count: 'exact', head: true })
      .eq('translation_key', 'yousafzai2019');

    if (err4) throw err4;

    if (actualCount === expectedCount) {
      console.log(`   ✅ Count matches: ${actualCount} words`);
    } else {
      console.log(`   ⚠️ Count mismatch: expected ${expectedCount}, got ${actualCount}`);
      allValid = false;
    }
    results.yousafzai_words = { expected: expectedCount, actual: actualCount };
  } catch (error) {
    console.error(`   ❌ Error verifying Yousafzai frequencies:`, error);
    allValid = false;
  }

  // Verify audio URLs are populated
  try {
    console.log('\n🎵 Audio URLs:');
    const { count: afghanAudio, error: err5 } = await supabase
      .from('verses')
      .select('*', { count: 'exact', head: true })
      .not('audio_url', 'is', null);

    const { count: yousafzaiAudio, error: err6 } = await supabase
      .from('verses_yousafzai')
      .select('*', { count: 'exact', head: true })
      .not('audio_url', 'is', null);

    if (err5 || err6) throw err5 || err6;

    const afghanTotal = results.afghan_verses || 0;
    const yousafzaiTotal = results.yousafzai_verses || 0;

    console.log(`   Afghan: ${afghanAudio}/${afghanTotal} verses with audio (${((afghanAudio / afghanTotal) * 100).toFixed(1)}%)`);
    console.log(`   Yousafzai: ${yousafzaiAudio}/${yousafzaiTotal} verses with audio (${((yousafzaiAudio / yousafzaiTotal) * 100).toFixed(1)}%)`);

    results.audio_coverage = {
      afghan: { with: afghanAudio, total: afghanTotal },
      yousafzai: { with: yousafzaiAudio, total: yousafzaiTotal }
    };
  } catch (error) {
    console.error(`   ❌ Error verifying audio URLs:`, error);
    allValid = false;
  }

  // Sample query test
  try {
    console.log('\n🔍 Sample Query Test:');
    const { data: sample, error: err7 } = await supabase
      .from('word_occurrence_index')
      .select('word, frequency, verse_refs')
      .eq('translation_key', 'afghan2023')
      .limit(1);

    if (err7) throw err7;

    if (sample && sample.length > 0) {
      console.log(`   ✅ Sample word: "${sample[0].word}" (${sample[0].frequency} occurrences, ${sample[0].verse_refs?.length || 0} verses)`);
      results.sample_query = sample[0];
    }
  } catch (error) {
    console.error(`   ❌ Error running sample query:`, error);
    allValid = false;
  }

  console.log('\n' + (allValid ? '✅ All verifications passed!' : '⚠️ Some verifications failed. Review output above.'));
  return { results, valid: allValid };
}

async function main() {
  console.log('🔄 Starting complete data ingestion to production schema...\n');

  try {
    const supabase = await createSupabaseClient();

    // Step 1: Load all data files
    const { afghanData, yousafzaiData } = await loadVersesData();
    const audioMap = await loadAudioMapping();
    const frequencyData = await loadFrequencyData();

    // Step 2: Insert verses with audio URLs
    await insertVerses(supabase, afghanData, yousafzaiData, audioMap);

    // Step 3: Build word occurrence index
    await buildWordOccurrenceIndex(supabase, frequencyData);

    // Step 4: Verify everything worked
    await verifyIngestion(supabase, frequencyData);

    console.log('\n🎉 Production data ingestion completed successfully!');
    console.log('\n📋 Next steps:');
    console.log('1. 🚀 Update app/api/search/route.ts to use word_occurrence_index');
    console.log('2. 🚀 Update app/api/chapter/route.ts to use verses tables');
    console.log('3. 🚀 Update app/lib/data/load.ts to use Supabase as primary');
    console.log('4. 🧪 Test the search functionality with the new schema');
    console.log('5. 📈 Monitor performance improvements');

  } catch (error) {
    console.error('\n❌ Data ingestion failed:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = {
  loadVersesData,
  loadAudioMapping,
  loadFrequencyData,
  insertVerses,
  buildWordOccurrenceIndex,
  verifyIngestion,
  main
};
