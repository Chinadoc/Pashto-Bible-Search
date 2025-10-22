// Quick script to explore Supabase table schemas
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://nkombdutnjvaasxrbmdn.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function exploreSchema() {
  console.log('📊 Exploring Supabase Schema\n');

  // Check verses table
  console.log('1. VERSES TABLE (Afghan 2023):');
  const { data: verses, error: versesError } = await supabase
    .from('verses')
    .select('*')
    .limit(1);

  if (verses && verses[0]) {
    console.log('Columns:', Object.keys(verses[0]).join(', '));
    console.log('Sample:', verses[0]);
  }
  console.log();

  // Check audio_files table
  console.log('2. AUDIO_FILES TABLE:');
  const { data: audio, error: audioError } = await supabase
    .from('audio_files')
    .select('*')
    .limit(1);

  if (audio && audio[0]) {
    console.log('Columns:', Object.keys(audio[0]).join(', '));
    console.log('Sample:', audio[0]);
  }
  console.log();

  // Check audio_mappings table
  console.log('3. AUDIO_MAPPINGS TABLE:');
  const { data: mappings, error: mappingsError } = await supabase
    .from('audio_mappings')
    .select('*')
    .limit(1);

  if (mappings && mappings[0]) {
    console.log('Columns:', Object.keys(mappings[0]).join(', '));
    console.log('Sample:', mappings[0]);
  }
  console.log();

  // Check word_frequencies table
  console.log('4. WORD_FREQUENCIES TABLE:');
  const { data: freq, error: freqError } = await supabase
    .from('word_frequencies')
    .select('*')
    .limit(1);

  if (freq && freq[0]) {
    console.log('Columns:', Object.keys(freq[0]).join(', '));
    console.log('Sample:', freq[0]);
  }
  console.log();

  // Check form_occurrences table
  console.log('5. FORM_OCCURRENCES TABLE:');
  const { data: formOcc, error: formOccError } = await supabase
    .from('form_occurrences')
    .select('*')
    .limit(1);

  if (formOcc && formOcc[0]) {
    console.log('Columns:', Object.keys(formOcc[0]).join(', '));
    console.log('Sample:', formOcc[0]);
  }
  console.log();

  // Check form_roots table
  console.log('6. FORM_ROOTS TABLE:');
  const { data: formRoots, error: formRootsError } = await supabase
    .from('form_roots')
    .select('*')
    .limit(1);

  if (formRoots && formRoots[0]) {
    console.log('Columns:', Object.keys(formRoots[0]).join(', '));
    console.log('Sample:', formRoots[0]);
  }
  console.log();

  // Check word_forms_master table
  console.log('7. WORD_FORMS_MASTER TABLE:');
  const { data: master, error: masterError } = await supabase
    .from('word_forms_master')
    .select('*')
    .limit(1);

  if (master && master[0]) {
    console.log('Columns:', Object.keys(master[0]).join(', '));
    console.log('Sample:', master[0]);
  }
}

exploreSchema().catch(console.error);
