const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function clearBadInflections() {
  console.log('🗑️  Removing inflections with empty verse_refs...\n');

  // Get count before
  const { count: countBefore } = await supabase
    .from('word_occurrence_index')
    .select('*', { count: 'exact', head: true });

  console.log(`📊 Before: ${countBefore} records`);

  // Delete inflections with frequency=0 AND empty verse_refs
  // We'll fetch them and delete manually
  const { data: toDelete } = await supabase
    .from('word_occurrence_index')
    .select('word, translation_key')
    .eq('frequency', 0)
    .limit(10000);

  if (!toDelete || toDelete.length === 0) {
    console.log('✅ No records to delete');
    return;
  }

  console.log(`Found ${toDelete.length} records with frequency=0`);

  // Delete in batches
  let deleted = 0;
  for (let i = 0; i < toDelete.length; i += 100) {
    const batch = toDelete.slice(i, i + 100);
    
    for (const record of batch) {
      const { error } = await supabase
        .from('word_occurrence_index')
        .delete()
        .eq('word', record.word)
        .eq('translation_key', record.translation_key)
        .eq('frequency', 0);
      
      if (!error) deleted++;
    }
  }

  // Get count after
  const { count: countAfter } = await supabase
    .from('word_occurrence_index')
    .select('*', { count: 'exact', head: true });

  console.log(`📊 After: ${countAfter} records`);
  console.log(`🗑️  Removed: ${countBefore - countAfter} bad inflection records\n`);
}

clearBadInflections().catch(console.error);
