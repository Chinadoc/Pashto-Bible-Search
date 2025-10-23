const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function debug() {
  console.log('\n🔍 DEBUGGING WORD INDEX\n');

  try {
    // Check if the high-frequency words are in the index
    const testWords = ['د', 'چې', 'په', 'هغه', 'ته', 'یې'];

    console.log('Looking for high-frequency words:\n');
    
    for (const word of testWords) {
      const { data, error } = await supabase
        .from('word_occurrence_index')
        .select('word, frequency, verse_refs')
        .eq('word', word)
        .limit(1);

      if (data && data.length > 0) {
        console.log(`✅ Found: ${word}`);
        console.log(`   Frequency: ${data[0].frequency}`);
        console.log(`   Verses: ${data[0].verse_refs?.length || 0}\n`);
      } else {
        console.log(`❌ NOT found: ${word}\n`);
      }
    }

    // Get sample words from the index
    console.log('\nSample words from index:\n');
    const { data: sample } = await supabase
      .from('word_occurrence_index')
      .select('word, frequency')
      .order('frequency', { ascending: false })
      .limit(20);

    if (sample) {
      sample.forEach(w => {
        console.log(`   ${w.word} - freq: ${w.frequency}`);
      });
    }

    // Get statistics
    console.log('\n\nIndex statistics:\n');
    const { data: stats } = await supabase
      .from('word_occurrence_index')
      .select('frequency')
      .order('frequency', { ascending: false })
      .limit(1);

    const { data: minStats } = await supabase
      .from('word_occurrence_index')
      .select('frequency')
      .order('frequency', { ascending: true })
      .limit(1);

    if (stats && minStats) {
      console.log(`   Highest frequency: ${stats[0]?.frequency}`);
      console.log(`   Lowest frequency: ${minStats[0]?.frequency}`);
    }

  } catch (error) {
    console.error('Error:', error.message);
  }
}

debug();
