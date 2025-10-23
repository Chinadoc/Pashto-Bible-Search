const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function verify() {
  console.log('\n📊 WORD DICTIONARY VERIFICATION\n');

  // Total count
  const { count } = await supabase
    .from('word_dictionary')
    .select('*', { count: 'exact', head: true });

  console.log(`Total words in table: ${count}`);

  // By source
  const { data: allRows } = await supabase
    .from('word_dictionary')
    .select('source')
    .limit(10000);

  const sources = {};
  allRows?.forEach(row => {
    sources[row.source] = (sources[row.source] || 0) + 1;
  });

  console.log('\nBy source:');
  Object.entries(sources).forEach(([src, cnt]) => {
    console.log(`  ${src}: ${cnt}`);
  });

  // Sample from LingDocs
  const { data: lingdocsSample } = await supabase
    .from('word_dictionary')
    .select('pashto_word, english, pos, source')
    .eq('source', 'lingdocs')
    .limit(3);

  console.log('\nSample from LingDocs:');
  lingdocsSample?.forEach(row => {
    console.log(`  ${row.pashto_word} (${row.english}) - POS: ${row.pos}`);
  });

  // Sample from inferred
  const { data: inferredSample } = await supabase
    .from('word_dictionary')
    .select('pashto_word, english, pos, source')
    .eq('source', 'inferred')
    .limit(3);

  console.log('\nSample from inferred:');
  inferredSample?.forEach(row => {
    console.log(`  ${row.pashto_word} - english: ${row.english || '(null)'}, pos: ${row.pos || '(null)'}`);
  });

  console.log('\n✅ Verification complete!\n');
}

verify().catch(console.error);
