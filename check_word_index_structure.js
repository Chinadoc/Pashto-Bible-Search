const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function check() {
  console.log('🔍 Checking word_occurrence_index structure...\n');

  // Get a sample of words with verse_refs populated
  const { data: withVerses } = await supabase
    .from('word_occurrence_index')
    .select('word, frequency, verse_refs')
    .not('verse_refs', 'is', null)
    .gt('frequency', 0)
    .limit(3);

  console.log('✅ Words WITH verse_refs and frequency > 0:');
  withVerses?.forEach(w => {
    const verseCount = w.verse_refs ? w.verse_refs.length : 0;
    console.log(`   ${w.word}: freq=${w.frequency}, verses=${verseCount}`);
  });

  // Get words with empty verse_refs
  const { data: emptyVerses } = await supabase
    .from('word_occurrence_index')
    .select('word, frequency, verse_refs')
    .eq('verse_refs', '[]')
    .limit(5);

  console.log('\n❌ Words with EMPTY verse_refs:');
  emptyVerses?.forEach(w => {
    console.log(`   ${w.word}: freq=${w.frequency}`);
  });

  // Check if ویل base form exists
  const { data: baseForm } = await supabase
    .from('word_occurrence_index')
    .select('*')
    .eq('word', 'ویل')
    .limit(1);

  console.log('\nش Checking base form "ویل":');
  if (baseForm && baseForm.length > 0) {
    console.log(`   Found in index:`, JSON.stringify(baseForm[0], null, 2));
  } else {
    console.log('   Not found');
  }
}

check().catch(console.error);
