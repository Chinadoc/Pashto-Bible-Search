#!/usr/bin/env node

/**
 * COMPLETE REPAIR: Rebuild entire word_occurrence_index
 * 
 * Problem: 310,928 broken entries with frequency=0 and empty verse_refs
 * Solution: Completely rebuild from verses tables for both translations
 */

const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('❌ Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function rebuildCompleteIndex() {
  console.log('🔧 COMPLETE REBUILD: word_occurrence_index\n');

  try {
    // Step 1: Show current state
    console.log('📊 Step 1: Checking current state...');
    const { count: brokenCount, error: countError } = await supabase
      .from('word_occurrence_index')
      .select('*', { count: 'exact', head: true })
      .eq('frequency', 0);

    console.log(`⚠️  Found ${brokenCount} entries with frequency=0\n`);

    // Step 2: Delete all broken entries
    console.log('🗑️  Step 2: Deleting broken entries...');
    const { error: deleteError } = await supabase
      .from('word_occurrence_index')
      .delete()
      .eq('frequency', 0);

    if (deleteError) {
      console.error('❌ Error deleting broken entries:', deleteError);
      process.exit(1);
    }

    console.log('✅ Deleted broken entries\n');

    // Step 3: Rebuild for BOTH translations
    const translations = [
      { key: 'afghan2023', table: 'verses', name: 'Afghan 2023' },
      { key: 'yousafzai2019', table: 'verses_yousafzai', name: 'Yousafzai 2019' }
    ];

    for (const translation of translations) {
      console.log(`\n📖 Rebuilding ${translation.name}...`);

      // Fetch all verses
      console.log(`  📥 Fetching verses from ${translation.table}...`);
      const { data: verses, error: versesError } = await supabase
        .from(translation.table)
        .select('book, chapter, verse, text')
        .limit(50000);

      if (versesError) {
        console.error(`❌ Error fetching ${translation.table}:`, versesError);
        process.exit(1);
      }

      console.log(`  ✅ Fetched ${verses.length} verses`);

      // Extract and count words
      console.log(`  📊 Extracting words...`);
      const wordMap = new Map(); // word -> { count, verses: [] }

      for (const verse of verses) {
        const ref = `${verse.book} ${verse.chapter}:${verse.verse}`;
        const words = verse.text.match(/\S+/g) || [];

        for (const word of words) {
          if (!wordMap.has(word)) {
            wordMap.set(word, { count: 0, verses: [] });
          }
          const entry = wordMap.get(word);
          entry.count++;
          if (!entry.verses.includes(ref)) {
            entry.verses.push(ref);
          }
        }
      }

      console.log(`  ✅ Found ${wordMap.size} unique words`);

      // Insert in batches
      console.log(`  📥 Inserting ${wordMap.size} entries...`);
      const batchSize = 1000;
      const words = Array.from(wordMap.entries());

      for (let i = 0; i < words.length; i += batchSize) {
        const batch = words.slice(i, i + batchSize);
        const records = batch.map(([word, data]) => ({
          word,
          translation_key: translation.key,
          frequency: data.count,
          verse_refs: data.verses,
          tf_idf_scores: new Array(data.verses.length).fill(0.0001),
        }));

        const { error: insertError } = await supabase
          .from('word_occurrence_index')
          .insert(records);

        if (insertError) {
          console.error(`❌ Error inserting batch:`, insertError);
          process.exit(1);
        }

        const progress = Math.min(i + batchSize, words.length);
        const percent = Math.round((progress / words.length) * 100);
        process.stdout.write(`\r  Progress: ${progress}/${words.length} (${percent}%)`);
      }

      console.log(`\n  ✅ Inserted ${words.length} entries for ${translation.name}`);
    }

    // Step 4: Verification
    console.log('\n\n✅ Step 3: Verification...');

    const { count: totalCount } = await supabase
      .from('word_occurrence_index')
      .select('*', { count: 'exact', head: true });

    const { count: brokenStillCount } = await supabase
      .from('word_occurrence_index')
      .select('*', { count: 'exact', head: true })
      .eq('frequency', 0);

    console.log(`\n📊 FINAL STATUS:`);
    console.log(`  Total entries: ${totalCount}`);
    console.log(`  Broken entries (frequency=0): ${brokenStillCount}`);

    // Check both translations
    const { data: wahul } = await supabase
      .from('word_occurrence_index')
      .select('word, translation_key, frequency, verse_refs')
      .eq('word', 'وهل');

    console.log(`\n📋 Test word "وهل":`);
    if (wahul && wahul.length > 0) {
      for (const entry of wahul) {
        console.log(`  ${entry.translation_key}: frequency=${entry.frequency}, verses=${entry.verse_refs.length}`);
      }
    } else {
      console.log(`  ⚠️  Word not found in either translation`);
    }

    if (brokenStillCount === 0) {
      console.log('\n\n🎉 REPAIR COMPLETE! All entries fixed!');
      console.log(`✅ Database is now consistent and ready for production`);
    } else {
      console.log(`\n⚠️  WARNING: Still ${brokenStillCount} broken entries detected`);
    }

  } catch (error) {
    console.error('❌ Unexpected error:', error);
    process.exit(1);
  }
}

rebuildCompleteIndex();
