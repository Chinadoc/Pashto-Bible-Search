const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase env vars (need SUPABASE_SERVICE_ROLE_KEY)');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function ingestInflectionsWithVerses() {
  console.log('🚀 INGESTING INFLECTIONS WITH VERSE REFERENCES\n');

  // Load inflections cache
  const inflectionsPath = path.join(__dirname, '../data/inflections_cache.json');
  if (!fs.existsSync(inflectionsPath)) {
    console.error(`❌ Cannot find ${inflectionsPath}`);
    process.exit(1);
  }

  const inflectionsCache = JSON.parse(fs.readFileSync(inflectionsPath, 'utf-8'));
  console.log(`✅ Loaded ${Object.keys(inflectionsCache).length} base words with inflections`);

  // Load all verses into memory for searching
  console.log('📚 Loading verses into memory...');
  
  const { data: versesAfghan } = await supabase
    .from('verses')
    .select('ref, text')
    .limit(50000);

  const { data: versesYousafzai } = await supabase
    .from('verses_yousafzai')
    .select('ref, text')
    .limit(50000);

  const allVerses = [
    ...(versesAfghan || []).map(v => ({ ...v, translation: 'afghan2023' })),
    ...(versesYousafzai || []).map(v => ({ ...v, translation: 'yousafzai2019' }))
  ];

  console.log(`✅ Loaded ${allVerses.length} verses`);

  // Build word->verses index for fast lookup
  console.log('🔄 Building word-to-verses index...');
  const wordToVerses = {};
  
  for (const verse of allVerses) {
    // Split text into words
    const words = verse.text.split(/\s+/).filter(w => w.length > 0);
    
    for (const word of words) {
      // Clean word (remove punctuation)
      const cleanWord = word.replace(/[،۔؛؍"""'']/g, '');
      
      if (cleanWord.length > 0) {
        if (!wordToVerses[cleanWord]) {
          wordToVerses[cleanWord] = [];
        }
        wordToVerses[cleanWord].push({
          ref: verse.ref,
          translation: verse.translation
        });
      }
    }
  }

  console.log(`✅ Built index for ${Object.keys(wordToVerses).length} unique words`);

  // Now ingest inflections with verse references
  const inflectionRecords = [];
  let processedCount = 0;
  let foundInVersesCount = 0;

  for (const [baseWord, inflectionsArray] of Object.entries(inflectionsCache)) {
    if (!Array.isArray(inflectionsArray)) continue;

    for (const inflection of inflectionsArray) {
      const inflectedForm = inflection.form || inflection;
      
      if (!inflectedForm || typeof inflectedForm !== 'string') continue;

      // Check if this inflection exists in verses
      const verseRefs = wordToVerses[inflectedForm];

      if (verseRefs && verseRefs.length > 0) {
        // Group by translation
        const afghanVerses = verseRefs
          .filter(v => v.translation === 'afghan2023')
          .map(v => v.ref);
        
        const yousafzaiVerses = verseRefs
          .filter(v => v.translation === 'yousafzai2019')
          .map(v => v.ref);

        if (afghanVerses.length > 0) {
          inflectionRecords.push({
            word: inflectedForm,
            translation_key: 'afghan2023',
            frequency: afghanVerses.length,
            verse_refs: afghanVerses,
            base_word: baseWord,
            is_inflected: true,
            tf_idf_scores: Array(afghanVerses.length).fill(0.01)
          });
          foundInVersesCount++;
        }

        if (yousafzaiVerses.length > 0) {
          inflectionRecords.push({
            word: inflectedForm,
            translation_key: 'yousafzai2019',
            frequency: yousafzaiVerses.length,
            verse_refs: yousafzaiVerses,
            base_word: baseWord,
            is_inflected: true,
            tf_idf_scores: Array(yousafzaiVerses.length).fill(0.01)
          });
          foundInVersesCount++;
        }
      }

      processedCount++;
      if (processedCount % 10000 === 0) {
        console.log(`Progress: ${processedCount} inflections processed, ${foundInVersesCount} found in verses`);
      }
    }
  }

  console.log(`\n✅ Processing complete: ${processedCount} inflections, ${foundInVersesCount} found in verses`);
  console.log(`📤 Upserting ${inflectionRecords.length} records to Supabase...\n`);

  // Upsert in batches
  const batchSize = 500;
  let batchCount = 0;
  let totalInserted = 0;
  let totalFailed = 0;

  for (let i = 0; i < inflectionRecords.length; i += batchSize) {
    batchCount++;
    const batch = inflectionRecords.slice(i, i + batchSize);

    const { error, count } = await supabase
      .from('word_occurrence_index')
      .upsert(batch, { onConflict: 'word,translation_key' });

    if (error) {
      console.error(`❌ Batch ${batchCount} error: ${error.message}`);
      totalFailed += batch.length;
    } else {
      totalInserted += batch.length;
      console.log(`✅ Batch ${batchCount}: +${batch.length} records`);
    }
  }

  console.log(`\n✨ INGESTION COMPLETE`);
  console.log(`   Total inserted: ${totalInserted}`);
  console.log(`   Total failed: ${totalFailed}`);

  // Verify
  const { data: testData } = await supabase
    .from('word_occurrence_index')
    .select('word, frequency, verse_refs')
    .eq('word', 'ویل')
    .limit(1);

  console.log(`\n🧪 Verification - searching for "ویل":`);
  if (testData && testData[0]) {
    const verseCount = testData[0].verse_refs ? testData[0].verse_refs.length : 0;
    console.log(`   ✅ Found: ${testData[0].word}, frequency=${testData[0].frequency}, verses=${verseCount}`);
    if (verseCount > 0) {
      console.log(`   First few verses: ${testData[0].verse_refs.slice(0, 3).join(', ')}`);
    }
  } else {
    console.log(`   ❌ Not found`);
  }
}

ingestInflectionsWithVerses().catch(console.error);





