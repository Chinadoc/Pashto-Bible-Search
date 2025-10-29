#!/usr/bin/env node

/**
 * Build Word Occurrence Index for Yousafzai
 * 
 * Reads all verses from verses_yousafzai table
 * Builds word frequency index
 * Populates word_occurrence_index table
 */

const { createClient } = require('@supabase/supabase-js');
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://nkombdutnjvaasxrbmdn.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_KEY) {
  console.error('❌ Missing SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function buildYousafzaiWordIndex() {
  console.log('🔨 Building Yousafzai word occurrence index...\n');

  try {
    // Step 1: Fetch all Yousafzai verses
    console.log('📖 Step 1: Fetching all Yousafzai verses...');
    const { data: verses, error: fetchError } = await supabase
      .from('verses_yousafzai')
      .select('ref, text, book, chapter, verse');

    if (fetchError || !verses) {
      throw new Error(`Failed to fetch verses: ${fetchError?.message}`);
    }

    console.log(`✅ Found ${verses.length} Yousafzai verses\n`);

    // Step 2: Build word index
    console.log('🔤 Step 2: Building word frequency map...');
    const wordIndex = {};
    let totalWords = 0;

    for (const verse of verses) {
      const words = verse.text.toLowerCase().split(/\s+/);
      for (const word of words) {
        const cleanWord = word.replace(/[،۔؟]/g, '').trim(); // Remove Pashto punctuation
        if (!cleanWord || cleanWord.length < 2) continue; // Skip empty/single-char words

        if (!wordIndex[cleanWord]) {
          wordIndex[cleanWord] = {
            word: cleanWord,
            translation_key: 'yousafzai2019',
            verse_refs: [],
            frequency: 0,
            tf_idf_scores: []
          };
        }

        // Track verse refs only once per verse
        if (!wordIndex[cleanWord].verse_refs.includes(verse.ref)) {
          wordIndex[cleanWord].verse_refs.push(verse.ref);
          wordIndex[cleanWord].tf_idf_scores.push(1); // Simplified TF-IDF
        }

        wordIndex[cleanWord].frequency += 1;
        totalWords++;
      }
    }

    console.log(`✅ Indexed ${Object.keys(wordIndex).length} unique words (${totalWords} total occurrences)\n`);

    // Step 3: Clear existing Yousafzai entries
    console.log('🗑️  Step 3: Clearing old Yousafzai entries...');
    const { error: deleteError } = await supabase
      .from('word_occurrence_index')
      .delete()
      .eq('translation_key', 'yousafzai2019');

    if (deleteError) {
      throw new Error(`Failed to delete old entries: ${deleteError.message}`);
    }
    console.log('✅ Cleared old entries\n');

    // Step 4: Insert new word index entries in batches
    console.log('📝 Step 4: Inserting word index entries...');
    const BATCH_SIZE = 100;
    const words = Object.values(wordIndex);
    const totalBatches = Math.ceil(words.length / BATCH_SIZE);

    for (let i = 0; i < totalBatches; i++) {
      const start = i * BATCH_SIZE;
      const end = Math.min(start + BATCH_SIZE, words.length);
      const batch = words.slice(start, end);

      const { error: insertError } = await supabase
        .from('word_occurrence_index')
        .insert(batch);

      if (insertError) {
        console.warn(`⚠️  Batch ${i + 1}/${totalBatches} had errors: ${insertError.message}`);
      }

      const progress = ((i + 1) / totalBatches * 100).toFixed(1);
      console.log(`  [${progress}%] Batch ${i + 1}/${totalBatches}`);
    }

    console.log('\n✅ Word index build complete!');
    console.log(`📊 Summary:`);
    console.log(`   - Total unique words: ${Object.keys(wordIndex).length}`);
    console.log(`   - Total word occurrences: ${totalWords}`);
    console.log(`   - Translation: Yousafzai 2019`);
    console.log(`   - Verses indexed: ${verses.length}`);

  } catch (error) {
    console.error(`\n❌ Error: ${error.message}`);
    process.exit(1);
  }
}

buildYousafzaiWordIndex();
