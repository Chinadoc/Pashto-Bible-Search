const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkProperly() {
  console.log('\n🔍 CHECKING WORD INDEX PROPERLY\n');

  try {
    // Test specific high-frequency words
    const testWords = [
      'د',           // 12,701 frequency
      'چې',          // 8,259
      'او',          // 7,550
      'وهل',         // from your screenshot
      'خدا',         // common word
    ];

    console.log('Testing specific words:\n');
    
    for (const word of testWords) {
      // Query WITHOUT limit to see actual count
      const { data, error, count } = await supabase
        .from('word_occurrence_index')
        .select('word, frequency', { count: 'exact' })
        .eq('word', word);

      console.log(`${word}:`);
      if (data && data.length > 0) {
        console.log(`  ✅ Found ${data.length} record(s)`);
        console.log(`     Frequency: ${data.map(d => d.frequency).join(', ')}`);
      } else {
        console.log(`  ❌ NOT found`);
      }
    }

    // Try getting ALL records without limit
    console.log('\n\nGetting ALL records from index...\n');
    
    let allWords = [];
    let offset = 0;
    const pageSize = 1000;

    while (true) {
      const { data, error } = await supabase
        .from('word_occurrence_index')
        .select('word')
        .range(offset, offset + pageSize - 1);

      if (!data || data.length === 0) break;
      
      allWords = allWords.concat(data);
      offset += pageSize;
      console.log(`  Fetched ${allWords.length} records so far...`);
    }

    const uniqueWords = new Set(allWords.map(w => w.word));
    console.log(`\n✅ Total records: ${allWords.length}`);
    console.log(`✅ Unique words: ${uniqueWords.size}`);

  } catch (error) {
    console.error('Error:', error.message);
  }
}

checkProperly();
