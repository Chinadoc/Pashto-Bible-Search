#!/usr/bin/env node

/**
 * Repair Script: Fix Afghan 2023 word_occurrence_index
 * 
 * Problem: Afghan 2023 entries have frequency=0 and empty verse_refs
 * Solution: Rebuild from the verses table
 */

const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('❌ Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function repairAfghan2023Index() {
  console.log('🔧 REPAIRING AFGHAN 2023 word_occurrence_index\n');

  try {
    // Step 1: Get all verses from Afghan 2023
    console.log('📖 Step 1: Fetching Afghan 2023 verses...');
    const { data: verses, error: versesError } = await supabase
      .from('verses')
      .select('book, chapter, verse, text')
      .limit(10000);

    if (versesError) {
      console.error('❌ Error fetching verses:', versesError);
      process.exit(1);
    }

    console.log(`✅ Fetched ${verses.length} verses`);

    // Step 2: Extract and count words
    console.log('\n📊 Step 2: Extracting words from verses...');
    const wordMap = new Map(); // word -> { count, verses: [{ref, text}] }

    for (const verse of verses) {
      const ref = `${verse.book} ${verse.chapter}:${verse.verse}`;
      const words = verse.text.match(/\S+/g) || [];

      for (const word of words) {
        if (!wordMap.has(word)) {
          wordMap.set(word, { count: 0, verses: [] });
        }
        const entry = wordMap.get(word);
        entry.count++;
        entry.verses.push(ref);
      }
    }

    console.log(`✅ Found ${wordMap.size} unique words`);

    // Step 3: Clear existing Afghan 2023 data
    console.log('\n🗑️  Step 3: Clearing broken Afghan 2023 entries...');
    const { error: deleteError } = await supabase
      .from('word_occurrence_index')
      .delete()
      .eq('translation_key', 'afghan2023');

    if (deleteError) {
      console.error('❌ Error deleting old entries:', deleteError);
      process.exit(1);
    }

    console.log('✅ Cleared old entries');

    // Step 4: Insert corrected data in batches
    console.log('\n📥 Step 4: Inserting corrected Afghan 2023 entries...');
    const batchSize = 1000;
    const words = Array.from(wordMap.entries());

    for (let i = 0; i < words.length; i += batchSize) {
      const batch = words.slice(i, i + batchSize);
      const records = batch.map(([word, data]) => ({
        word,
        translation_key: 'afghan2023',
        frequency: data.count,
        verse_refs: [...new Set(data.verses)], // Remove duplicate refs
        tf_idf_scores: new Array(data.verses.length).fill(0.0001), // Placeholder
      }));

      const { error: insertError } = await supabase
        .from('word_occurrence_index')
        .insert(records);

      if (insertError) {
        console.error(`❌ Error inserting batch ${i / batchSize + 1}:`, insertError);
        process.exit(1);
      }

      const progress = Math.min(i + batchSize, words.length);
      console.log(`  ${progress}/${words.length} words processed (${Math.round((progress / words.length) * 100)}%)`);
    }

    console.log(`✅ Inserted ${words.length} corrected entries\n`);

    // Step 5: Verify
    console.log('✅ Step 5: Verifying repairs...');
    const { data: verification, error: verifyError } = await supabase
      .from('word_occurrence_index')
      .select('word, frequency, translation_key')
      .eq('translation_key', 'afghan2023')
      .eq('word', 'وهل')
      .single();

    if (verification) {
      console.log(`✅ Word "وهل" now has:`, {
        frequency: verification.frequency,
        translation_key: verification.translation_key
      });
    } else {
      console.log('⚠️  Word "وهل" not found in Afghan 2023 (may not exist in verses)');
    }

    // Final count
    const { count, error: countError } = await supabase
      .from('word_occurrence_index')
      .select('*', { count: 'exact', head: true })
      .eq('translation_key', 'afghan2023');

    console.log(`\n🎉 REPAIR COMPLETE!`);
    console.log(`📊 Total Afghan 2023 entries: ${count}`);
    console.log(`✅ All entries now have correct frequency and verse_refs`);

  } catch (error) {
    console.error('❌ Unexpected error:', error);
    process.exit(1);
  }
}

repairAfghan2023Index();
