#!/usr/bin/env node

/**
 * Data Ingestion Script for Pashto Bible Search
 * Loads JSON data into optimized Supabase tables for production performance
 */

const fs = require('fs').promises;
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
const { gunzipSync } = require('zlib');

// Load environment variables
require('dotenv').config();

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://nkombdutnjvaasxrbmdn.supabase.co';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_ANON_KEY) {
  console.error('❌ Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable');
  process.exit(1);
}

console.log('🚀 Starting data ingestion for Pashto Bible Search...\n');

// Initialize Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function loadVersesData() {
  console.log('📖 Loading verses data...');

  // Load Afghan 2023 verses (compressed)
  const afghanPath = path.join(process.cwd(), 'public', 'verses.json.gz');
  let afghanData;

  try {
    console.log('   Loading Afghan 2023 verses...');
    const compressed = await fs.readFile(afghanPath);
    const jsonText = gunzipSync(compressed).toString('utf8');
    afghanData = JSON.parse(jsonText);
    console.log(`   ✅ Loaded ${Object.keys(afghanData).length} Afghan verses`);
  } catch (error) {
    console.log(`   ⚠️ Could not load Afghan verses: ${error.message}`);
    afghanData = {};
  }

  // Load Yousafzai 2019 verses
  const yousafzaiPath = path.join(process.cwd(), 'app', 'data', 'yousafzai_all_verses.json');
  let yousafzaiData;

  try {
    console.log('   Loading Yousafzai 2019 verses...');
    const jsonText = await fs.readFile(yousafzaiPath, 'utf8');
    yousafzaiData = JSON.parse(jsonText);
    console.log(`   ✅ Loaded ${yousafzaiData.length} Yousafzai verses`);
  } catch (error) {
    console.log(`   ⚠️ Could not load Yousafzai verses: ${error.message}`);
    yousafzaiData = [];
  }

  return { afghanData, yousafzaiData };
}

async function loadAudioMapping() {
  console.log('🎵 Loading audio mapping...');

  const audioPaths = [
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

  console.log('   ⚠️ No audio mapping found, will use empty mapping');
  return {};
}

async function loadFrequencyData() {
  console.log('📊 Loading frequency data...');

  const frequencyFiles = [
    'word_frequency_list.json',
    'yousafzai_word_frequency_list.json'
  ];

  const frequencyData = {};

  for (const filename of frequencyFiles) {
    const translation = filename.includes('yousafzai') ? 'yousafzai2019' : 'afghan2023';

    try {
      console.log(`   Loading ${filename}...`);
      const filePath = path.join(process.cwd(), 'app', 'data', filename);
      const jsonText = await fs.readFile(filePath, 'utf8');
      const frequencies = JSON.parse(jsonText);

      frequencyData[translation] = {};
      let totalFreq = 0;

      for (const item of frequencies) {
        if (item?.pashto && typeof item.frequency === 'number') {
          frequencyData[translation][item.pashto] = item.frequency;
          totalFreq += item.frequency;
        }
      }

      console.log(`   ✅ Loaded ${Object.keys(frequencyData[translation]).length} frequencies for ${translation} (total: ${totalFreq})`);
    } catch (error) {
      console.log(`   ⚠️ Could not load ${filename}: ${error.message}`);
      frequencyData[translation] = {};
    }
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

async function insertVerses(afghanData, yousafzaiData, audioMap) {
  console.log('\n💾 Inserting verses into database...');

  const afghanVerses = [];
  const yousafzaiVerses = [];

  // Process Afghan verses
  console.log('   Processing Afghan verses...');
  for (const [ref, data] of Object.entries(afghanData)) {
    if (!data || typeof data !== 'object' || !data.text) continue;

    const { book, chapter, verse } = parseVerseRef(ref);
    const testament = determineTestament(book);

    // Generate audio URL from mapping
    let audioUrl = audioMap[ref];
    let audioStoragePath = null;

    if (audioUrl) {
      // Extract storage path from public URL
      if (audioUrl.includes('supabase.co/storage/v1/object/public/')) {
        audioStoragePath = audioUrl.split('supabase.co/storage/v1/object/public/')[1];
      }
    }

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
      audio_storage_path: audioStoragePath,
      audio_public_url: audioUrl || null
    });
  }

  // Process Yousafzai verses
  console.log('   Processing Yousafzai verses...');
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
      audio_storage_path: item.audio_path || null,
      audio_public_url: item.audio_url || null
    });
  }

  console.log(`   Prepared ${afghanVerses.length} Afghan verses and ${yousafzaiVerses.length} Yousafzai verses`);

  // Batch insert Afghan verses
  if (afghanVerses.length > 0) {
    console.log('   Inserting Afghan verses...');
    const { error } = await supabase
      .from('verses')
      .insert(afghanVerses);

    if (error) {
      console.error('   ❌ Error inserting Afghan verses:', error);
    } else {
      console.log('   ✅ Successfully inserted Afghan verses');
    }
  }

  // Batch insert Yousafzai verses
  if (yousafzaiVerses.length > 0) {
    console.log('   Inserting Yousafzai verses...');
    const { error } = await supabase
      .from('verses_yousafzai')
      .insert(yousafzaiVerses);

    if (error) {
      console.error('   ❌ Error inserting Yousafzai verses:', error);
    } else {
      console.log('   ✅ Successfully inserted Yousafzai verses');
    }
  }

  return { afghanCount: afghanVerses.length, yousafzaiCount: yousafzaiVerses.length };
}

async function buildWordOccurrenceIndex(frequencyData) {
  console.log('\n🔍 Building word occurrence index...');

  const wordIndexData = [];

  // Process each translation
  for (const [translation, frequencies] of Object.entries(frequencyData)) {
    console.log(`   Processing ${translation}...`);

    // Get all verses for this translation
    let verseQuery = supabase.from('verses').select('id, ref, text');
    if (translation === 'yousafzai2019') {
      verseQuery = supabase.from('verses_yousafzai').select('id, ref, text');
    }

    const { data: verses, error } = await verseQuery;
    if (error) {
      console.error(`   ❌ Error fetching ${translation} verses:`, error);
      continue;
    }

    if (!verses || verses.length === 0) {
      console.log(`   ⚠️ No verses found for ${translation}`);
      continue;
    }

    // Create verse lookup map
    const verseMap = new Map();
    verses.forEach(verse => {
      verseMap.set(verse.ref, verse.id);
    });

    let processedWords = 0;
    const wordOccurrences = new Map();

    // Build word occurrence index
    for (const [word, frequency] of Object.entries(frequencies)) {
      const verseIds = [];
      const verseRefs = [];

      // Find all verses containing this word
      for (const verse of verses) {
        if (verse.text.toLowerCase().includes(word.toLowerCase())) {
          verseIds.push(verse.id);
          verseRefs.push(verse.ref);
        }
      }

      if (verseIds.length > 0) {
        // Calculate TF-IDF scores (simplified)
        const tfIdfScores = new Array(verseIds.length).fill(1.0);

        wordOccurrences.set(word, {
          word,
          translation_key: translation,
          frequency,
          verse_ids: verseIds,
          verse_refs: verseRefs,
          tf_idf_scores: tfIdfScores,
          primary_verse_id: verseIds[0]
        });

        processedWords++;
      }
    }

    // Convert to array and insert in batches
    const occurrences = Array.from(wordOccurrences.values());
    console.log(`   Found ${occurrences.length} words with occurrences for ${translation}`);

    if (occurrences.length > 0) {
      console.log('   Inserting word occurrences...');
      const { error } = await supabase
        .from('word_occurrence_index')
        .insert(occurrences);

      if (error) {
        console.error(`   ❌ Error inserting ${translation} word occurrences:`, error);
      } else {
        console.log(`   ✅ Successfully inserted ${translation} word occurrences`);
      }
    }
  }

  return wordIndexData;
}

async function buildVariantIndex() {
  console.log('\n🔄 Building variant index...');

  // Load inflection data
  const inflectionsPath = path.join(process.cwd(), 'app', 'data', 'inflections_cache.json');

  try {
    console.log('   Loading inflections cache...');
    const inflectionsText = await fs.readFile(inflectionsPath, 'utf8');
    const inflectionsData = JSON.parse(inflectionsText);

    console.log(`   Found ${Object.keys(inflectionsData).length} base words with inflections`);

    // Load full dictionary for POS information
    const dictionaryPath = path.join(process.cwd(), 'app', 'data', 'full_dictionary_enriched.json');
    let dictionaryData = [];

    try {
      const dictText = await fs.readFile(dictionaryPath, 'utf8');
      const rawDict = JSON.parse(dictText);
      dictionaryData = rawDict.entries || rawDict;
      console.log(`   Loaded ${dictionaryData.length} dictionary entries`);
    } catch (error) {
      console.log('   ⚠️ Could not load dictionary data');
    }

    // Build variant index
    const variantEntries = [];

    for (const [baseWord, variants] of Object.entries(inflectionsData)) {
      if (!Array.isArray(variants) || variants.length === 0) continue;

      // Find POS from dictionary
      let pos = 'unknown';
      const dictEntry = dictionaryData.find(entry =>
        entry.pashto === baseWord ||
        entry.p_norm === baseWord ||
        entry.p === baseWord
      );

      if (dictEntry) {
        pos = dictEntry.pos || dictEntry.c || dictEntry.pos_family || 'unknown';
      }

      // Get all verse IDs containing any variant
      const allVerseIds = new Set();

      for (const variant of variants) {
        if (!variant?.form) continue;

        // Search for this variant in both translations
        const { data: afghanVerses } = await supabase
          .from('verses')
          .select('id')
          .ilike('text', `%${variant.form}%`);

        const { data: yousafzaiVerses } = await supabase
          .from('verses_yousafzai')
          .select('id')
          .ilike('text', `%${variant.form}%`);

        if (afghanVerses) afghanVerses.forEach(v => allVerseIds.add(v.id));
        if (yousafzaiVerses) yousafzaiVerses.forEach(v => allVerseIds.add(v.id));
      }

      if (allVerseIds.size > 0) {
        // Format variants as JSONB array
        const variantsArray = variants.map(v => ({
          form: v.form,
          romanization: v.romanization || null,
          category: v.category || null,
          frequency: v.frequency || 0
        }));

        variantEntries.push({
          base_word: baseWord,
          translation_key: 'afghan2023', // Default to Afghan for now
          pos,
          variants: variantsArray,
          verse_ids: Array.from(allVerseIds),
          total_occurrences: allVerseIds.size
        });
      }
    }

    console.log(`   Prepared ${variantEntries.length} variant entries`);

    if (variantEntries.length > 0) {
      console.log('   Inserting variant index...');
      const { error } = await supabase
        .from('variant_index')
        .insert(variantEntries);

      if (error) {
        console.error('   ❌ Error inserting variant index:', error);
      } else {
        console.log('   ✅ Successfully inserted variant index');
      }
    }

  } catch (error) {
    console.error('   ❌ Error building variant index:', error);
  }
}

async function refreshMaterializedViews() {
  console.log('\n🔄 Refreshing materialized views...');

  try {
    const { error } = await supabase.rpc('refresh_common_words');
    if (error) {
      console.error('   ❌ Error refreshing materialized views:', error);
    } else {
      console.log('   ✅ Successfully refreshed materialized views');
    }
  } catch (error) {
    console.error('   ❌ Error refreshing materialized views:', error);
  }
}

async function verifyIngestion() {
  console.log('\n✅ Verifying data ingestion...');

  const checks = [
    { name: 'Afghan verses', query: () => supabase.from('verses').select('count').limit(1) },
    { name: 'Yousafzai verses', query: () => supabase.from('verses_yousafzai').select('count').limit(1) },
    { name: 'Word occurrence index', query: () => supabase.from('word_occurrence_index').select('count').limit(1) },
    { name: 'Variant index', query: () => supabase.from('variant_index').select('count').limit(1) },
    { name: 'All verses view', query: () => supabase.from('all_verses').select('count').limit(1) }
  ];

  for (const check of checks) {
    try {
      const { data, error } = await check.query();
      if (error) {
        console.log(`   ❌ ${check.name}: ${error.message}`);
      } else {
        const count = data?.[0]?.count || 0;
        console.log(`   ✅ ${check.name}: ${count} records`);
      }
    } catch (error) {
      console.log(`   ❌ ${check.name}: ${error.message}`);
    }
  }

  // Test a sample search
  console.log('\n🧪 Testing sample searches...');

  try {
    const { data: wordResults } = await supabase
      .from('word_occurrence_index')
      .select('*')
      .eq('word', 'خدا')
      .eq('translation_key', 'afghan2023')
      .limit(1);

    if (wordResults && wordResults.length > 0) {
      console.log(`   ✅ Word search test: Found "خدا" with ${wordResults[0].verse_ids.length} verses`);
    } else {
      console.log('   ⚠️ Word search test: No results for "خدا"');
    }
  } catch (error) {
    console.log(`   ❌ Word search test failed: ${error.message}`);
  }
}

async function main() {
  console.log('🔄 Starting complete data ingestion...\n');

  try {
    // Step 1: Load all data files
    const { afghanData, yousafzaiData } = await loadVersesData();
    const audioMap = await loadAudioMapping();
    const frequencyData = await loadFrequencyData();

    // Step 2: Insert verses
    await insertVerses(afghanData, yousafzaiData, audioMap);

    // Step 3: Build word occurrence index
    await buildWordOccurrenceIndex(frequencyData);

    // Step 4: Build variant index
    await buildVariantIndex();

    // Step 5: Refresh materialized views
    await refreshMaterializedViews();

    // Step 6: Verify everything worked
    await verifyIngestion();

    console.log('\n🎉 Data ingestion completed successfully!');
    console.log('\n📋 Next steps:');
    console.log('1. Update app/api/search/route.ts to use the new tables');
    console.log('2. Update app/lib/data/load.ts to prefer Supabase over JSON');
    console.log('3. Test the search functionality');
    console.log('4. Monitor performance improvements');

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
  buildVariantIndex,
  refreshMaterializedViews,
  verifyIngestion,
  main
};
