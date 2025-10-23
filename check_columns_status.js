const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkStatus() {
  try {
    const { data, error } = await supabase.rpc('execute_sql', {
      sql: `SELECT column_name FROM information_schema.columns 
            WHERE table_name = 'word_occurrence_index' 
            ORDER BY ordinal_position`
    });

    if (error) {
      console.log('Cannot check via RPC (expected). Trying direct query...');
      
      // Try a simple query to see what columns exist
      const { data: sample, error: err } = await supabase
        .from('word_occurrence_index')
        .select('*')
        .limit(1);

      if (!err && sample && sample.length > 0) {
        const columns = Object.keys(sample[0]);
        console.log('\nCurrent columns in word_occurrence_index:');
        columns.forEach(c => console.log(`  - ${c}`));

        const hasInflected = columns.includes('is_inflected');
        const hasBaseWord = columns.includes('base_word');

        console.log(`\nis_inflected column: ${hasInflected ? '✅ EXISTS' : '❌ MISSING'}`);
        console.log(`base_word column: ${hasBaseWord ? '✅ EXISTS' : '❌ MISSING'}`);

        if (!hasInflected || !hasBaseWord) {
          console.log('\n⚠️ Need to add columns via SQL Editor');
          console.log('See: ADD_INFLECTION_COLUMNS.md');
        } else {
          console.log('\n✅ Columns ready! Can run expansion script');
        }
      }
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

checkStatus();
