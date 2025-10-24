/**
 * Script: Expand word_occurrence_index with inflections (SIMPLIFIED)
 * 
 * This version uses ONLY the required columns:
 * - word (required)
 * - translation_key (required)
 * - frequency (optional, will be 0)
 * - verse_refs (optional, will be [])
 */

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function expandWordIndexSimple() {
  console.log('\n📚 EXPANDING WORD_OCCURRENCE_INDEX WITH INFLECTIONS (SIMPLIFIED)\n');

  try {
    // Load inflections cache
    console.log('📖 Loading inflections cache...');
    const inflectionsCachePath = path.join(process.cwd(), 'app/data/inflections_cache.json');
    
    if (!fs.existsSync(inflectionsCachePath)) {
      throw new Error(`Inflections cache not found at ${inflectionsCachePath}`);
    }

    const fileSize = fs.statSync(inflectionsCachePath).size;
    console.log(`   Size: ${(fileSize / 1024 / 1024).toFixed(2)} MB`);

    const inflectionsCache = JSON.parse(fs.readFileSync(inflectionsCachePath, 'utf8'));
    console.log(`   ✅ Loaded inflections for ${Object.keys(inflectionsCache).length} base words\n`);

    // Prepare records
    console.log('🔨 Preparing inflection records...\n');

    const inflectionRecords = [];
    let processedCount = 0;

    for (const [baseWord, inflectionsArray] of Object.entries(inflectionsCache)) {
      if (!Array.isArray(inflectionsArray)) continue;

      for (const inflection of inflectionsArray) {
        const inflectedForm = inflection.form || inflection;
        if (!inflectedForm || typeof inflectedForm !== 'string') continue;

        // Add for both translations (minimal fields)
        inflectionRecords.push({
          word: inflectedForm,
          translation_key: 'afghan2023',
          frequency: 0,
          verse_refs: [],
        });

        inflectionRecords.push({
          word: inflectedForm,
          translation_key: 'yousafzai2019',
          frequency: 0,
          verse_refs: [],
        });

        processedCount++;
        if (processedCount % 100000 === 0) {
          console.log(`   ${processedCount} inflections prepared...`);
        }
      }
    }

    console.log(`   ✅ Prepared ${inflectionRecords.length} records\n`);

    // Deduplicate
    console.log('🎯 Deduplicating...\n');
    
    const uniqueByWordAndTranslation = new Map();
    
    for (const record of inflectionRecords) {
      const key = `${record.word}:::${record.translation_key}`;
      if (!uniqueByWordAndTranslation.has(key)) {
        uniqueByWordAndTranslation.set(key, record);
      }
    }

    const finalRecords = Array.from(uniqueByWordAndTranslation.values());
    console.log(`   ✅ Deduplicated to ${finalRecords.length} unique records\n`);

    // Check current size
    console.log('📊 Current index size...\n');
    const { count: currentCount } = await supabase
      .from('word_occurrence_index')
      .select('*', { count: 'exact', head: true });

    console.log(`   Current: ${currentCount} records\n`);

    // Insert in batches (using parallel processes)
    console.log('🚀 Inserting records with parallel batching...\n');

    const batchSize = 500; // Smaller batches for stability
    const maxConcurrent = 3; // 3 concurrent batches at a time

    let insertedCount = 0;
    let failedCount = 0;
    let batchNum = 0;

    // Process in chunks with concurrency limit
    for (let i = 0; i < finalRecords.length; i += batchSize * maxConcurrent) {
      const concurrentBatches = [];

      for (let j = 0; j < maxConcurrent && (i + j * batchSize) < finalRecords.length; j++) {
        const startIdx = i + j * batchSize;
        const endIdx = Math.min(startIdx + batchSize, finalRecords.length);
        const batch = finalRecords.slice(startIdx, endIdx);

        batchNum++;

        concurrentBatches.push(
          (async () => {
            try {
              const { data, error } = await supabase
                .from('word_occurrence_index')
                .upsert(batch, { onConflict: 'word,translation_key' });

              if (error) {
                console.error(`   ❌ Batch ${batchNum}: ${error.message}`);
                failedCount += batch.length;
              } else {
                insertedCount += batch.length;
                console.log(`   ✅ Batch ${batchNum}: +${batch.length} records (total: ${insertedCount})`);
              }
            } catch (error) {
              console.error(`   ❌ Batch ${batchNum} exception: ${error.message}`);
              failedCount += batch.length;
            }
          })()
        );
      }

      // Wait for all concurrent batches to finish
      await Promise.all(concurrentBatches);

      if ((i + batchSize * maxConcurrent) % 10000 <= batchSize * maxConcurrent) {
        const progress = Math.min(i + batchSize * maxConcurrent, finalRecords.length);
        console.log(`\n   Progress: ${progress}/${finalRecords.length} (${((progress/finalRecords.length)*100).toFixed(1)}%)\n`);
      }
    }

    // Verify
    console.log('\n✅ VERIFICATION\n');

    const { count: newCount } = await supabase
      .from('word_occurrence_index')
      .select('*', { count: 'exact', head: true });

    console.log(`   Before: ${currentCount}`);
    console.log(`   After: ${newCount}`);
    console.log(`   Added: ${newCount - currentCount}`);
    console.log(`   Inserted: ${insertedCount}`);
    console.log(`   Failed: ${failedCount}\n`);

    // Test
    console.log('🧪 Testing key conjugations:\n');
    
    const testWords = ['وویل', 'ویل', 'ویې', 'خدای', 'خدایت'];
    let foundCount = 0;
    
    for (const testWord of testWords) {
      const { data } = await supabase
        .from('word_occurrence_index')
        .select('word, translation_key')
        .eq('word', testWord)
        .limit(1);

      if (data && data.length > 0) {
        console.log(`   ✅ ${testWord}`);
        foundCount++;
      } else {
        console.log(`   ❌ ${testWord}`);
      }
    }

    console.log(`\n   Found: ${foundCount}/${testWords.length} test words\n`);

    if (newCount > currentCount) {
      console.log('✨ SUCCESS! Inflections added to Supabase\n');
    } else {
      console.log('⚠️  No records added (may need to check for conflicts)\n');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

expandWordIndexSimple();
