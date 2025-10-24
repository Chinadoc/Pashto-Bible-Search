const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function rebuildWordIndex() {
  console.log('🚀 REBUILDING WORD INDEX FROM VERSE TEXT\n');

  // Step 1: Load all verses
  console.log('📚 Loading all verses...');
  let allVerses = [];
  let offset = 0;
  const pageSize = 5000;

  while (true) {
    const { data: versesAfghan } = await supabase
      .from('verses')
      .select('ref, text, translation_key')
      .range(offset, offset + pageSize - 1);

    if (!versesAfghan || versesAfghan.length === 0) break;
    
    allVerses = allVerses.concat(
      versesAfghan.map(v => ({ ...v, translation: 'afghan2023' }))
    );
    
    offset += pageSize;
    console.log(`  ✓ Loaded ${allVerses.length} verses (Afghan)...`);
  }

  offset = 0;
  while (true) {
    const { data: versesYousafzai } = await supabase
      .from('verses_yousafzai')
      .select('ref, text, translation_key')
      .range(offset, offset + pageSize - 1);

    if (!versesYousafzai || versesYousafzai.length === 0) break;
    
    allVerses = allVerses.concat(
      versesYousafzai.map(v => ({ ...v, translation: 'yousafzai2019' }))
    );
    
    offset += pageSize;
    console.log(`  ✓ Loaded ${allVerses.length} verses (all)...`);
  }

  console.log(`✅ Loaded ${allVerses.length} total verses\n`);

  // Step 2: Build word->verses index from actual text
  console.log('🔄 Building word occurrence index from verse text...');
  const wordIndex = {};
  
  for (const verse of allVerses) {
    if (!verse.text) continue;
    
    // Split by whitespace and clean punctuation
    const words = verse.text.split(/\s+/).filter(w => w.length > 0);
    
    for (const word of words) {
      // Remove Pashto punctuation but keep the word
      const cleanWord = word.replace(/[،۔؛؍"""'']/g, '');
      
      if (cleanWord.length === 0) continue;
      
      const key = `${cleanWord}|${verse.translation}`;
      
      if (!wordIndex[key]) {
        wordIndex[key] = {
          word: cleanWord,
          translation_key: verse.translation,
          verses: []
        };
      }
      
      // Only add if not already in list
      if (!wordIndex[key].verses.includes(verse.ref)) {
        wordIndex[key].verses.push(verse.ref);
      }
    }
  }

  console.log(`✅ Built index with ${Object.keys(wordIndex).length} unique word+translation combinations\n`);

  // Step 3: Convert to records and upsert
  console.log('📤 Converting to records and upserting...');
  const records = Object.values(wordIndex).map(item => ({
    word: item.word,
    translation_key: item.translation_key,
    frequency: item.verses.length,
    verse_refs: item.verses,
    tf_idf_scores: Array(item.verses.length).fill(0.01),
    base_word: item.word,  // For now, treat each word as its own base
    is_inflected: false
  }));

  console.log(`📊 Upserting ${records.length} records in batches...\n`);

  // First, truncate the table
  console.log('🗑️  Clearing old word_occurrence_index...');
  const { error: clearError } = await supabase
    .from('word_occurrence_index')
    .delete()
    .gte('id', 0);

  if (clearError) {
    console.error(`⚠️  Clear warning: ${clearError.message}`);
  } else {
    console.log('✅ Cleared\n');
  }

  // Upsert in batches
  const batchSize = 1000;
  let batchNum = 0;
  let totalSuccess = 0;

  for (let i = 0; i < records.length; i += batchSize) {
    batchNum++;
    const batch = records.slice(i, i + batchSize);
    
    const { error, count } = await supabase
      .from('word_occurrence_index')
      .upsert(batch, { onConflict: 'word,translation_key' });

    if (error) {
      console.error(`❌ Batch ${batchNum}: ${error.message}`);
    } else {
      totalSuccess += batch.length;
      if (batchNum % 10 === 0) {
        console.log(`✅ Batch ${batchNum}: Upserted ${batch.length} records (total: ${totalSuccess})`);
      }
    }
  }

  console.log(`\n✨ COMPLETE: Upserted ${totalSuccess} records\n`);

  // Verify
  console.log('🧪 Testing searches:\n');
  
  const testWords = ['وویل', 'ویل', 'وهل', 'خدا', 'خدای', 'د', 'و'];
  
  for (const word of testWords) {
    const { data } = await supabase
      .from('word_occurrence_index')
      .select('word, frequency, verse_refs')
      .eq('word', word)
      .limit(2);

    if (data && data.length > 0) {
      for (const row of data) {
        const verses = row.verse_refs || [];
        console.log(`✅ "${row.word}" (${row.translation_key}): ${row.frequency} occurrences, sample: ${verses.slice(0, 2).join(', ')}`);
      }
    } else {
      console.log(`❌ "${word}": Not found`);
    }
  }

  const { count } = await supabase
    .from('word_occurrence_index')
    .select('*', { count: 'exact', head: true });
  
  console.log(`\n📊 Total words in index: ${count}`);
}

rebuildWordIndex().catch(console.error);
