/**
 * Script: Expand word_occurrence_index with all inflected forms
 * 
 * Purpose: Add all inflected/conjugated forms to the word_occurrence_index
 * so that searching for conjugations is fast (Supabase) instead of slow (JSON fallback)
 * 
 * Data source: app/data/inflections_cache.json (pre-computed inflections)
 * Target: Supabase word_occurrence_index table
 */

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function expandWordIndex() {
  console.log('\n📚 EXPANDING WORD_OCCURRENCE_INDEX WITH INFLECTIONS\n');

  try {
    // Step 1: Load inflections cache
    console.log('📖 Step 1: Loading inflections cache...\n');
    
    const inflectionsCachePath = path.join(process.cwd(), 'app/data/inflections_cache.json');
    
    if (!fs.existsSync(inflectionsCachePath)) {
      throw new Error(`Inflections cache not found at ${inflectionsCachePath}`);
    }

    const fileSize = fs.statSync(inflectionsCachePath).size;
    console.log(`   File size: ${(fileSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`   Loading...`);

    const inflectionsCache = JSON.parse(fs.readFileSync(inflectionsCachePath, 'utf8'));
    
    console.log(`   ✅ Loaded inflections for ${Object.keys(inflectionsCache).length} base words\n`);

    // Step 2: Load frequency data to get counts for base words
    console.log('📊 Step 2: Loading frequency data...\n');
    
    const afghanFreq = JSON.parse(fs.readFileSync('app/data/word_frequency_list_enriched.json', 'utf8'));
    const yousafzaiFreq = JSON.parse(fs.readFileSync('app/data/yousafzai_word_frequency_list_enriched.json', 'utf8'));
    
    console.log(`   Afghan: ${Object.keys(afghanFreq).length} words`);
    console.log(`   Yousafzai: ${Object.keys(yousafzaiFreq).length} words\n`);

    // Step 3: Prepare inflection records
    console.log('🔨 Step 3: Preparing inflection records...\n');

    const inflectionRecords = [];
    let inflectionCount = 0;
    let skippedCount = 0;

    for (const [baseWord, inflectionsArray] of Object.entries(inflectionsCache)) {
      if (!Array.isArray(inflectionsArray)) continue;

      for (const inflection of inflectionsArray) {
        // Handle the actual structure: { form, romanization, category }
        const inflectedForm = inflection.form || inflection;
        if (!inflectedForm || typeof inflectedForm !== 'string') {
          skippedCount++;
          continue;
        }

        // Add inflections for BOTH translations (we want all forms searchable)
        // This ensures conjugations like وویل are findable via Supabase
        
        inflectionRecords.push({
          word: inflectedForm,
          translation_key: 'afghan2023',
          frequency: 0, // Inflected forms get 0 frequency (they're derived)
          is_inflected: true,
          base_word: baseWord,
          verse_refs: [], // Will be empty - we're just indexing the word
        });

        // Also add for Yousafzai translation
        inflectionRecords.push({
          word: inflectedForm,
          translation_key: 'yousafzai2019',
          frequency: 0, // Inflected forms get 0 frequency
          is_inflected: true,
          base_word: baseWord,
          verse_refs: [],
        });

        inflectionCount++;
        if (inflectionCount % 50000 === 0) {
          console.log(`   Processing: ${inflectionCount} inflections prepared...`);
        }
      }
    }

    console.log(`   ✅ Prepared ${inflectionRecords.length} inflection records`);
    console.log(`   ℹ️  Skipped ${skippedCount} invalid entries\n`);

    // Step 4: Get unique words to avoid duplicates
    console.log('🎯 Step 4: Deduplicating records...\n');

    const uniqueByWordAndTranslation = new Map();
    
    for (const record of inflectionRecords) {
      const key = `${record.word}:::${record.translation_key}`;
      if (!uniqueByWordAndTranslation.has(key)) {
        uniqueByWordAndTranslation.set(key, record);
      }
    }

    const finalRecords = Array.from(uniqueByWordAndTranslation.values());
    console.log(`   ✅ Deduplicated to ${finalRecords.length} unique records\n`);

    // Step 5: Check current index size
    console.log('📊 Step 5: Checking current index...\n');

    const { count: currentCount } = await supabase
      .from('word_occurrence_index')
      .select('*', { count: 'exact', head: true });

    console.log(`   Current word_occurrence_index size: ${currentCount} records\n`);

    // Step 6: Insert inflection records in batches
    console.log('🚀 Step 6: Inserting inflection records...\n');

    const batchSize = 1000;
    let insertedCount = 0;
    let failedCount = 0;
    let skippedDuplicates = 0;

    for (let i = 0; i < finalRecords.length; i += batchSize) {
      const batch = finalRecords.slice(i, Math.min(i + batchSize, finalRecords.length));
      
      try {
        // Use upsert to handle duplicates
        const { data, error } = await supabase
          .from('word_occurrence_index')
          .upsert(batch, { onConflict: 'word,translation_key' });

        if (error) {
          console.error(`   ❌ Batch ${Math.floor(i / batchSize) + 1} error:`, error.message);
          failedCount += batch.length;
        } else {
          insertedCount += batch.length;
          console.log(`   ✅ Batch ${Math.floor(i / batchSize) + 1}: ${batch.length} records (total: ${insertedCount})`);
        }

      } catch (error) {
        console.error(`   ❌ Batch error:`, error.message);
        failedCount += batch.length;
      }

      // Progress check
      if ((i + batchSize) % 10000 === 0) {
        console.log(`      Progress: ${i + batchSize}/${finalRecords.length} records processed\n`);
      }
    }

    // Step 7: Verify
    console.log('\n✅ VERIFICATION\n');

    const { count: newCount } = await supabase
      .from('word_occurrence_index')
      .select('*', { count: 'exact', head: true });

    console.log(`   Before: ${currentCount} records`);
    console.log(`   After: ${newCount} records`);
    console.log(`   Added: ${newCount - currentCount} records`);
    console.log(`   Inserted: ${insertedCount}`);
    console.log(`   Failed: ${failedCount}\n`);

    // Test a few inflections
    console.log('🧪 Testing inflections:\n');
    
    const testWords = ['وویل', 'ویل', 'ویې', 'خدای', 'خدایت'];
    
    for (const testWord of testWords) {
      const { data, error } = await supabase
        .from('word_occurrence_index')
        .select('word, translation_key, is_inflected')
        .eq('word', testWord)
        .limit(2);

      if (data && data.length > 0) {
        console.log(`   ✅ ${testWord}: Found ${data.length} record(s)`);
      } else {
        console.log(`   ❌ ${testWord}: Not found`);
      }
    }

    console.log('\n✨ EXPANSION COMPLETE\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

expandWordIndex();
