#!/usr/bin/env node

/**
 * Production Data Ingestion Script for Pashto Bible Search
 * 
 * Features:
 * - Resumable ingestion with progress tracking (by word key, not count)
 * - Batched operations for reliability (configurable sizes)
 * - Pre-computed word frequencies with verse_refs (no verse scanning!)
 * - Configurable file paths via CLI arguments
 * - Comprehensive verification: counts, audio coverage, spot-checks
 * - Optional --no-truncate flag for incremental runs
 * - Detailed error tracking and resumability
 * 
 * Usage:
 * node ingest_to_production_schema.js [--no-truncate] [afghan-verses-path] [yousafzai-verses-path] [audio-map-path] [afghan-freq-path] [yousafzai-freq-path]
 */

const fs = require('fs').promises;
const path = require('path');
require('dotenv').config();

// Configuration
const CONFIG = {
  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://nkombdutnjvaasxrbmdn.supabase.co',
    serviceKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
  },

  // Parse CLI flags and file paths
  flags: {
    noTruncate: process.argv.includes('--no-truncate'),
  },

  files: {
    afghanVerses: process.argv.find((arg, i) => 
      i > 2 && !arg.startsWith('--') && !process.argv[i-1]?.startsWith('--')) || 'public/verses.json.gz',
    yousafzaiVerses: process.argv.find((arg, i) => 
      i > 3 && !arg.startsWith('--')) || 'app/data/yousafzai_all_verses.json',
    audioMap: process.argv[4] || 'google_drive_audio_urls.json',
    frequencies: {
      afghan: process.argv[5] || 'app/data/word_frequency_list_enriched.json',
      yousafzai: process.argv[6] || 'app/data/yousafzai_word_frequency_list_enriched.json'
    }
  },

  batches: {
    verses: 500,
    wordIndex: 1000
  },

  progressFile: '.ingestion_progress.json'
};

// Validate service key
if (!CONFIG.supabase.serviceKey) {
  console.error('❌ Missing SUPABASE_SERVICE_ROLE_KEY environment variable');
  console.log('Add this to your .env file for data ingestion');
  process.exit(1);
}

console.log('🚀 Starting production data ingestion...\n');
console.log('📋 Configuration:');
console.log(`   Flags: ${CONFIG.flags.noTruncate ? '--no-truncate' : 'truncate before insert'}`);
console.log(`   Afghan verses: ${CONFIG.files.afghanVerses}`);
console.log(`   Yousafzai verses: ${CONFIG.files.yousafzaiVerses}`);
console.log(`   Audio map: ${CONFIG.files.audioMap}`);
console.log(`   Afghan frequencies: ${CONFIG.files.frequencies.afghan}`);
console.log(`   Yousafzai frequencies: ${CONFIG.files.frequencies.yousafzai}`);
console.log(`   Batch size: ${CONFIG.batches.verses} verses, ${CONFIG.batches.wordIndex} words\n`);

// ============================================================================
// PROGRESS TRACKING (by word key, not count, for consistent resumption)
// ============================================================================

async function loadProgress() {
  try {
    const progressText = await fs.readFile(CONFIG.progressFile, 'utf8');
    return JSON.parse(progressText);
  } catch {
    return {
      versesInserted: { afghan: 0, yousafzai: 0 },
      lastProcessedWordKey: { afghan2023: null, yousafzai2019: null }, // Track by key, not count
      failedRefs: { afghan: [], yousafzai: [] },
      failedWords: { afghan2023: [], yousafzai2019: [] },
      completedSteps: []
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

// ============================================================================
// SUPABASE CLIENT
// ============================================================================

async function createSupabaseClient() {
  const { createClient } = await import('@supabase/supabase-js');
  return createClient(CONFIG.supabase.url, CONFIG.supabase.serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false }
  });
}

// ============================================================================
// TABLE CLEARING (with --no-truncate support)
// ============================================================================

async function clearTables(supabase) {
  if (CONFIG.flags.noTruncate) {
    console.log('⏭️  Skipping table clear (--no-truncate flag set)\n');
    return;
  }

  console.log('🧹 Clearing existing data...');

  try {
    // Skip exec_sql RPC, go straight to sequential delete (which works)
    console.log('   Using sequential delete (more compatible)...');
    await supabase.from('word_occurrence_index').delete().gte('id', 0);
    await supabase.from('verses_yousafzai').delete().gte('id', 0);
    await supabase.from('verses').delete().gte('id', 0);

    console.log('   ✅ Tables cleared\n');
    await markStepCompleted('clear_tables');
  } catch (error) {
    console.error('   ❌ Error clearing tables:', error);
    console.log('   💡 Alternative: Run this SQL in Supabase console:');
    console.log('   TRUNCATE public.word_occurrence_index, public.verses_yousafzai, public.verses RESTART IDENTITY CASCADE;');
    throw error;
  }
}

// ============================================================================
// DATA LOADING
// ============================================================================

async function loadVersesData() {
  console.log('📖 Loading verses data...');

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

  const yousafzaiPath = path.join(process.cwd(), CONFIG.files.yousafzaiVerses);
  let yousafzaiData;

  try {
    console.log(`   Loading Yousafzai 2019 verses from ${CONFIG.files.yousafzaiVerses}...`);
    const jsonText = await fs.readFile(yousafzaiPath, 'utf8');
    yousafzaiData = JSON.parse(jsonText);
    console.log(`   ✅ Loaded ${yousafzaiData.length} Yousafzai verses\n`);
  } catch (error) {
    console.error(`   ❌ Could not load Yousafzai verses: ${error.message}`);
    throw new Error(`Failed to load Yousafzai verses from ${yousafzaiPath}: ${error.message}`);
  }

  return { afghanData, yousafzaiData };
}

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
      console.log(`   ✅ Loaded ${Object.keys(audioMap).length} audio mappings\n`);
      return audioMap;
    } catch (error) {
      console.log(`   ⚠️  Could not load from ${audioPath}`);
    }
  }

  console.log('   ⚠️  No audio mapping found, verses will be inserted without audio URLs\n');
  return {};
}

async function loadFrequencyData() {
  console.log('📊 Loading frequency data...');

  const frequencyData = {};

  // Load Afghan frequencies
  try {
    console.log(`   Loading Afghan frequencies from ${CONFIG.files.frequencies.afghan}...`);
    const filePath = path.join(process.cwd(), CONFIG.files.frequencies.afghan);
    const jsonText = await fs.readFile(filePath, 'utf8');
    const frequencies = JSON.parse(jsonText);

    frequencyData.afghan2023 = frequencies;
    const wordCount = Object.keys(frequencies).length;
    console.log(`   ✅ Loaded ${wordCount} Afghan word entries`);
    
    // Warn if verse_refs are missing
    const sampleWord = Object.entries(frequencies)[0];
    if (sampleWord && typeof sampleWord[1] === 'number') {
      console.log(`   ⚠️  WARNING: Frequency data missing verse_refs (found simple count format)`);
      console.log(`   💡 Recommend: Run preprocessing to generate rich format with verse_refs`);
    }
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

    frequencyData.yousafzai2019 = frequencies;
    const wordCount = Object.keys(frequencies).length;
    console.log(`   ✅ Loaded ${wordCount} Yousafzai word entries\n`);

    const sampleWord = Object.entries(frequencies)[0];
    if (sampleWord && typeof sampleWord[1] === 'number') {
      console.log(`   ⚠️  WARNING: Frequency data missing verse_refs (found simple count format)`);
      console.log(`   💡 Recommend: Run preprocessing to generate rich format with verse_refs\n`);
    }
  } catch (error) {
    console.error(`   ❌ Could not load Yousafzai frequencies: ${error.message}`);
    throw new Error(`Failed to load Yousafzai frequencies from ${CONFIG.files.frequencies.yousafzai}: ${error.message}`);
  }

  return frequencyData;
}

// ============================================================================
// VERSE INSERTION
// ============================================================================

function parseVerseRef(ref) {
  const [bookPart, versePart] = ref.split(' ');
  const [chapter, verse] = versePart.split(':').map(n => parseInt(n, 10));
  return { book: bookPart, chapter, verse };
}

function determineTestament(book) {
  const otBooks = new Set([
    'Genesis', 'Exodus', 'Leviticus', 'Numbers', 'Deuteronomy', 'Joshua', 'Judges', 'Ruth',
    '1 Samuel', '2 Samuel', '1 Kings', '2 Kings', '1 Chronicles', '2 Chronicles', 'Ezra',
    'Nehemiah', 'Esther', 'Job', 'Psalms', 'Proverbs', 'Ecclesiastes', 'Isaiah', 'Jeremiah',
    'Lamentations', 'Ezekiel', 'Daniel', 'Hosea', 'Joel', 'Amos', 'Obadiah', 'Jonah', 'Micah',
    'Nahum', 'Habakkuk', 'Zephaniah', 'Haggai', 'Zechariah', 'Malachi'
  ]);

  return otBooks.has(book) ? 'OT' : 'NT';
}

async function insertVerses(supabase, afghanData, yousafzaiData, audioMap) {
  console.log('💾 Inserting verses into database...\n');

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

  console.log(`   Prepared ${afghanVerses.length} Afghan and ${yousafzaiVerses.length} Yousafzai verses`);

  // Insert Afghan verses
  if (afghanVerses.length > 0) {
    console.log(`   Inserting Afghan verses (resuming from ${afghanInserted})...`);
    const batchSize = CONFIG.batches.verses;
    let successCount = 0;
    let failedRefs = progress.failedRefs.afghan || [];

    for (let i = afghanInserted; i < afghanVerses.length; i += batchSize) {
      const batch = afghanVerses.slice(i, i + batchSize);
      const batchNum = Math.floor(i / batchSize) + 1;
      const totalBatches = Math.ceil(afghanVerses.length / batchSize);

      console.log(`     Batch ${batchNum}/${totalBatches}: inserting ${batch.length} verses...`);

      try {
        const { error } = await supabase.from('verses').insert(batch);

        if (error) {
          console.error(`     ❌ Error in batch ${batchNum}:`, error.message);
          failedRefs.push(...batch.map(v => v.ref));
        } else {
          console.log(`     ✅ Batch ${batchNum} inserted`);
          successCount += batch.length;
        }
      } catch (error) {
        console.error(`     ❌ Exception in batch ${batchNum}:`, error);
        failedRefs.push(...batch.map(v => v.ref));
      }

      afghanInserted = i + batch.length;
      progress.versesInserted.afghan = afghanInserted;
      progress.failedRefs.afghan = failedRefs;
      await saveProgress(progress);
    }

    console.log(`   ✅ Afghan: ${successCount} successful, ${failedRefs.length} failed\n`);
  }

  // Insert Yousafzai verses
  if (yousafzaiVerses.length > 0) {
    console.log(`   Inserting Yousafzai verses (resuming from ${yousafzaiInserted})...`);
    const batchSize = CONFIG.batches.verses;
    let successCount = 0;
    let failedRefs = progress.failedRefs.yousafzai || [];

    for (let i = yousafzaiInserted; i < yousafzaiVerses.length; i += batchSize) {
      const batch = yousafzaiVerses.slice(i, i + batchSize);
      const batchNum = Math.floor(i / batchSize) + 1;
      const totalBatches = Math.ceil(yousafzaiVerses.length / batchSize);

      console.log(`     Batch ${batchNum}/${totalBatches}: inserting ${batch.length} verses...`);

      try {
        const { error } = await supabase.from('verses_yousafzai').insert(batch);

        if (error) {
          console.error(`     ❌ Error in batch ${batchNum}:`, error.message);
          failedRefs.push(...batch.map(v => v.ref));
        } else {
          console.log(`     ✅ Batch ${batchNum} inserted`);
          successCount += batch.length;
        }
      } catch (error) {
        console.error(`     ❌ Exception in batch ${batchNum}:`, error);
        failedRefs.push(...batch.map(v => v.ref));
      }

      yousafzaiInserted = i + batch.length;
      progress.versesInserted.yousafzai = yousafzaiInserted;
      progress.failedRefs.yousafzai = failedRefs;
      await saveProgress(progress);
    }

    console.log(`   ✅ Yousafzai: ${successCount} successful, ${failedRefs.length} failed\n`);
  }

  return { afghanVerses, yousafzaiVerses };
}

// ============================================================================
// WORD INDEX INSERTION
// ============================================================================

async function buildWordOccurrenceIndex(supabase, frequencyData) {
  console.log('🔍 Building word occurrence index...\n');

  const progress = await loadProgress();

  for (const translation of ['afghan2023', 'yousafzai2019']) {
    const frequencies = frequencyData[translation];
    if (!frequencies) continue;

    console.log(`   Processing ${translation}...`);

    const wordEntries = Object.entries(frequencies);
    const lastProcessedKey = progress.lastProcessedWordKey?.[translation];
    
    // Find resume point by word key
    let startIdx = 0;
    if (lastProcessedKey) {
      startIdx = wordEntries.findIndex(([key]) => key === lastProcessedKey) + 1;
      console.log(`   Resuming from word index ${startIdx}/${wordEntries.length}`);
    }

    const wordOccurrences = [];
    let skippedWords = 0;

    // Process each word
    for (let idx = startIdx; idx < wordEntries.length; idx++) {
      const [word, freqData] = wordEntries[idx];

      let frequency = 0;
      let verseRefs = [];
      let tfIdfScores = null;

      // Parse frequency data (two formats supported)
      if (typeof freqData === 'number') {
        // Legacy: just a number
        frequency = freqData;
        skippedWords++;
        continue; // Can't use without verse_refs
      } else if (typeof freqData === 'object' && freqData !== null) {
        frequency = freqData.frequency || 0;
        verseRefs = freqData.verse_refs || [];
        tfIdfScores = freqData.tf_idf_scores || null;
      } else {
        skippedWords++;
        continue;
      }

      if (verseRefs.length === 0) {
        skippedWords++;
        continue;
      }

      // Ensure tf_idf_scores matches verse_refs length
      if (!tfIdfScores) {
        tfIdfScores = new Array(verseRefs.length).fill(frequency / 1000);
      } else if (tfIdfScores.length !== verseRefs.length) {
        console.warn(`     ⚠️  Word "${word}": tf_idf_scores length (${tfIdfScores.length}) != verse_refs length (${verseRefs.length})`);
        tfIdfScores = new Array(verseRefs.length).fill(frequency / 1000);
      }

      wordOccurrences.push({
        word,
        translation_key: translation,
        frequency,
        verse_refs: verseRefs,
        tf_idf_scores: tfIdfScores,  // ✅ Correct field name!
        primary_verse_ref: verseRefs[0]
      });

      // Track progress by word key
      progress.lastProcessedWordKey[translation] = word;

      // Insert when batch is full
      if (wordOccurrences.length >= CONFIG.batches.wordIndex) {
        console.log(`     Inserting ${translation} word batch (${wordOccurrences.length} words)...`);

        try {
          const { error } = await supabase.from('word_occurrence_index').insert(wordOccurrences);

          if (error) {
            console.error(`     ❌ Error inserting batch:`, error.message);
            progress.failedWords[translation] = progress.failedWords[translation] || [];
            progress.failedWords[translation].push(...wordOccurrences.map(w => w.word));
          } else {
            console.log(`     ✅ Inserted batch`);
          }
        } catch (error) {
          console.error(`     ❌ Exception:`, error);
          progress.failedWords[translation] = progress.failedWords[translation] || [];
          progress.failedWords[translation].push(...wordOccurrences.map(w => w.word));
        }

        await saveProgress(progress);
        wordOccurrences.length = 0;
      }
    }

    // Insert remaining words
    if (wordOccurrences.length > 0) {
      console.log(`     Inserting final ${translation} word batch (${wordOccurrences.length} words)...`);

      try {
        const { error } = await supabase.from('word_occurrence_index').insert(wordOccurrences);

        if (error) {
          console.error(`     ❌ Error inserting final batch:`, error.message);
          progress.failedWords[translation] = progress.failedWords[translation] || [];
          progress.failedWords[translation].push(...wordOccurrences.map(w => w.word));
        } else {
          console.log(`     ✅ Inserted final batch`);
        }
      } catch (error) {
        console.error(`     ❌ Exception:`, error);
        progress.failedWords[translation] = progress.failedWords[translation] || [];
        progress.failedWords[translation].push(...wordOccurrences.map(w => w.word));
      }
    }

    progress.lastProcessedWordKey[translation] = null; // Mark as complete
    await saveProgress(progress);

    console.log(`   ✅ ${translation} complete (${skippedWords} words skipped - missing verse_refs)\n`);
  }
}

// ============================================================================
// VERIFICATION (with spot checks)
// ============================================================================

async function verifyIngestion(supabase, frequencyData, afghanVerses, yousafzaiVerses, audioMap) {
  console.log('✅ Verifying data ingestion...\n');

  const results = {};
  let allValid = true;

  // Verify Afghan verses
  try {
    const { count: afghanCount } = await supabase
      .from('verses')
      .select('*', { count: 'exact', head: true });

    console.log(`📖 Afghan Verses: ${afghanCount} (expected ${afghanVerses.length})`);
    if (afghanCount === afghanVerses.length) {
      console.log(`   ✅ Count matches`);
    } else {
      console.log(`   ⚠️  Mismatch!`);
      allValid = false;
    }
    results.afghan_verses = { expected: afghanVerses.length, actual: afghanCount };
  } catch (error) {
    console.error(`   ❌ Error:`, error.message);
    allValid = false;
  }

  // Verify Yousafzai verses
  try {
    const { count: yousafzaiCount } = await supabase
      .from('verses_yousafzai')
      .select('*', { count: 'exact', head: true });

    console.log(`📖 Yousafzai Verses: ${yousafzaiCount} (expected ${yousafzaiVerses.length})`);
    if (yousafzaiCount === yousafzaiVerses.length) {
      console.log(`   ✅ Count matches\n`);
    } else {
      console.log(`   ⚠️  Mismatch!\n`);
      allValid = false;
    }
    results.yousafzai_verses = { expected: yousafzaiVerses.length, actual: yousafzaiCount };
  } catch (error) {
    console.error(`   ❌ Error:`, error.message);
    allValid = false;
  }

  // Verify word counts
  for (const [translation, frequencies] of Object.entries(frequencyData)) {
    try {
      const { count: actualCount } = await supabase
        .from('word_occurrence_index')
        .select('*', { count: 'exact', head: true })
        .eq('translation_key', translation);

      const expectedCount = Object.keys(frequencies).filter(w => {
        const freqData = frequencies[w];
        if (typeof freqData === 'number') return false; // Skipped
        return freqData?.verse_refs?.length > 0;
      }).length;

      console.log(`📊 ${translation} Words: ${actualCount} (expected ~${expectedCount})`);
      if (Math.abs(actualCount - expectedCount) < expectedCount * 0.05) { // Allow 5% variance
        console.log(`   ✅ Count acceptable`);
      } else {
        console.log(`   ⚠️  Significant mismatch`);
        allValid = false;
      }
      results[`${translation}_words`] = { expected: expectedCount, actual: actualCount };
    } catch (error) {
      console.error(`   ❌ Error:`, error.message);
      allValid = false;
    }
  }

  // Audio coverage
  try {
    const { count: afghanAudio } = await supabase
      .from('verses')
      .select('*', { count: 'exact', head: true })
      .not('audio_url', 'is', null);

    const { count: yousafzaiAudio } = await supabase
      .from('verses_yousafzai')
      .select('*', { count: 'exact', head: true })
      .not('audio_url', 'is', null);

    const afghanTotal = results.afghan_verses?.actual || 0;
    const yousafzaiTotal = results.yousafzai_verses?.actual || 0;

    console.log(`🎵 Audio Coverage:`);
    console.log(`   Afghan: ${afghanAudio}/${afghanTotal} (${((afghanAudio / afghanTotal) * 100).toFixed(1)}%)`);
    console.log(`   Yousafzai: ${yousafzaiAudio}/${yousafzaiTotal} (${((yousafzaiAudio / yousafzaiTotal) * 100).toFixed(1)}%)\n`);

    results.audio_coverage = {
      afghan: { with: afghanAudio, total: afghanTotal },
      yousafzai: { with: yousafzaiAudio, total: yousafzaiTotal }
    };
  } catch (error) {
    console.error(`   ❌ Error:`, error.message);
    allValid = false;
  }

  // Spot check: Genesis 1:1
  try {
    console.log(`🔍 Spot Check (Genesis 1:1):`);
    
    const { data: afghanVerse } = await supabase
      .from('verses')
      .select('ref, text, audio_url')
      .eq('ref', 'Genesis 1:1')
      .single();

    if (afghanVerse) {
      console.log(`   ✅ Afghan: Found verse`);
      if (afghanVerse.text) console.log(`      Text: "${afghanVerse.text.substring(0, 50)}..."`);
      if (afghanVerse.audio_url) console.log(`      Audio: ${afghanVerse.audio_url.substring(0, 40)}...`);
      else console.log(`      Audio: (none)`);
    } else {
      console.log(`   ❌ Afghan: Genesis 1:1 not found`);
      allValid = false;
    }

    const { data: yousafzaiVerse } = await supabase
      .from('verses_yousafzai')
      .select('ref, text, audio_url')
      .eq('ref', 'Genesis 1:1')
      .single();

    if (yousafzaiVerse) {
      console.log(`   ✅ Yousafzai: Found verse`);
      if (yousafzaiVerse.text) console.log(`      Text: "${yousafzaiVerse.text.substring(0, 50)}..."`);
      if (yousafzaiVerse.audio_url) console.log(`      Audio: ${yousafzaiVerse.audio_url.substring(0, 40)}...`);
      else console.log(`      Audio: (none)`);
    } else {
      console.log(`   ❌ Yousafzai: Genesis 1:1 not found`);
      allValid = false;
    }

    console.log();
  } catch (error) {
    console.error(`   ⚠️  Spot check error:`, error.message);
  }

  // Sample word query
  try {
    console.log(`🔍 Sample Query Test:`);
    
    const { data: sampleWord } = await supabase
      .from('word_occurrence_index')
      .select('word, frequency, verse_refs')
      .eq('translation_key', 'afghan2023')
      .limit(1);

    if (sampleWord && sampleWord.length > 0) {
      const word = sampleWord[0];
      console.log(`   ✅ Sample word: "${word.word}"`);
      console.log(`      Frequency: ${word.frequency}, Verses: ${word.verse_refs?.length || 0}\n`);
      results.sample_query = word;
    }
  } catch (error) {
    console.error(`   ❌ Error:`, error.message);
    allValid = false;
  }

  console.log(allValid ? '✅ All verifications passed!' : '⚠️  Some verifications failed');
  return { results, valid: allValid };
}

// ============================================================================
// MAIN
// ============================================================================

async function main() {
  try {
    const supabase = await createSupabaseClient();

    // Load all data
    const { afghanData, yousafzaiData } = await loadVersesData();
    const audioMap = await loadAudioMapping();
    const frequencyData = await loadFrequencyData();

    // Clear tables
    await clearTables(supabase);

    // Insert verses
    const { afghanVerses, yousafzaiVerses } = await insertVerses(supabase, afghanData, yousafzaiData, audioMap);

    // Build word index
    await buildWordOccurrenceIndex(supabase, frequencyData);

    // Verify
    const verification = await verifyIngestion(supabase, frequencyData, afghanVerses, yousafzaiVerses, audioMap);

    if (!verification.valid) {
      console.log('\n⚠️  Some checks failed. Review the output above and check .ingestion_progress.json for details.');
      process.exit(1);
    }

    console.log('🎉 Production data ingestion completed successfully!');
  } catch (error) {
    console.error('\n❌ Ingestion failed:', error.message);
    console.log('\n💡 Tips:');
    console.log('   1. Check .ingestion_progress.json for resume point');
    console.log('   2. Verify frequency JSON has verse_refs (not just counts)');
    console.log('   3. Ensure SERVICE_ROLE_KEY is set in .env');
    console.log('   4. Check Supabase logs for detailed errors');
    process.exit(1);
  }
}

main();
