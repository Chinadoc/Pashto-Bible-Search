const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase env vars');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testSearch() {
  console.log('🔍 Testing word index searches...\n');

  const testWords = ['وویل', 'ویل', 'وهل', 'خدا', 'خدای'];

  for (const word of testWords) {
    console.log(`\n📌 Searching for: ${word}`);
    
    // Test word_occurrence_index
    const { data, error } = await supabase
      .from('word_occurrence_index')
      .select('word, frequency, translation_key, verse_refs')
      .eq('word', word)
      .limit(3);

    if (error) {
      console.error(`❌ Error: ${error.message}`);
      continue;
    }

    if (!data || data.length === 0) {
      console.log(`   ❌ Not found in word_occurrence_index`);
      
      // Try to find similar words
      const { data: similar } = await supabase
        .from('word_occurrence_index')
        .select('word, frequency')
        .ilike('word', `${word}%`)
        .limit(5);
      
      if (similar && similar.length > 0) {
        console.log(`   📚 Similar words found:`);
        similar.forEach(w => console.log(`      - ${w.word} (freq: ${w.frequency})`));
      } else {
        console.log(`   📚 No similar words found`);
      }
    } else {
      data.forEach(row => {
        const verseCount = row.verse_refs ? row.verse_refs.length : 0;
        console.log(`   ✅ Found: frequency=${row.frequency}, verses=${verseCount}, translation=${row.translation_key}`);
      });
    }
  }

  // Check table stats
  console.log('\n\n📊 Word Index Statistics:');
  const { count: totalCount } = await supabase
    .from('word_occurrence_index')
    .select('*', { count: 'exact', head: true });

  console.log(`   Total records: ${totalCount}`);

  const { data: topWords } = await supabase
    .from('word_occurrence_index')
    .select('word, frequency')
    .order('frequency', { ascending: false })
    .limit(5);

  console.log(`   Top 5 most frequent words:`);
  topWords?.forEach(w => console.log(`      - ${w.word}: ${w.frequency}`));
}

testSearch().catch(console.error);
