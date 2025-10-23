const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function diagnose() {
  console.log('\n🔍 DIAGNOSING THREE ISSUES\n');

  try {
    // Issue 1: What are the 74 unknown words?
    console.log('1️⃣  THE 74 "UNKNOWN" WORDS:\n');
    const { data: unknowns } = await supabase
      .from('word_dictionary')
      .select('pashto_word, pos, frequency_count')
      .eq('pos', 'unknown')
      .limit(100);

    if (unknowns && unknowns.length > 0) {
      console.log(`Found ${unknowns.length} unknown words:\n`);
      unknowns.forEach((w, i) => {
        console.log(`  ${i+1}. ${w.pashto_word} (freq: ${w.frequency_count})`);
      });
    }

    // Issue 2: Audio tags and URLs - are they really there?
    console.log('\n\n2️⃣  AUDIO URL STATUS:\n');
    const { data: audioSample } = await supabase
      .from('verses')
      .select('ref, audio_url')
      .not('audio_url', 'is', null)
      .limit(5);

    console.log('Sample verses WITH audio_url:');
    audioSample?.forEach(v => {
      console.log(`  ${v.ref}`);
      console.log(`    URL: ${v.audio_url?.substring(0, 80)}...`);
    });

    const { data: noAudio } = await supabase
      .from('verses')
      .select('ref, audio_url')
      .is('audio_url', null)
      .limit(5);

    console.log('\nSample verses WITHOUT audio_url:');
    noAudio?.forEach(v => {
      console.log(`  ${v.ref} - audio_url is NULL`);
    });

    // Issue 3: Search performance - is it using Supabase?
    console.log('\n\n3️⃣  SEARCH PERFORMANCE & SUPABASE USAGE:\n');
    
    // Test a word search directly
    const testWord = 'د';
    console.log(`Testing word search for: "${testWord}"\n`);

    const startTime = Date.now();
    const { data: indexData, error: indexError } = await supabase
      .from('word_occurrence_index')
      .select('word, frequency, verse_refs')
      .eq('word', testWord)
      .eq('translation_key', 'afghan2023')
      .single();

    const indexTime = Date.now() - startTime;
    console.log(`⏱️  word_occurrence_index lookup: ${indexTime}ms`);
    console.log(`   Word: "${indexData?.word}"`);
    console.log(`   Frequency: ${indexData?.frequency}`);
    console.log(`   Verses: ${indexData?.verse_refs?.length || 0} results`);

    if (indexData?.verse_refs?.length > 0) {
      const verseTime = Date.now();
      const { data: verses } = await supabase
        .from('verses')
        .select('ref, text, audio_url')
        .in('ref', indexData.verse_refs.slice(0, 10));

      const versesFetchTime = Date.now() - verseTime;
      console.log(`⏱️  Fetching verse details: ${versesFetchTime}ms`);
      console.log(`   Got ${verses?.length} verses`);
      if (verses?.[0]) {
        console.log(`   Example: ${verses[0].ref}`);
        console.log(`   Audio present: ${verses[0].audio_url ? '✅ YES' : '❌ NO'}`);
      }
    }

    // Check search API configuration
    console.log('\n\n🔍 CHECKING SEARCH API CONFIGURATION:\n');
    console.log('Environment variables:');
    console.log(`  NEXT_PUBLIC_SUPABASE_URL: ${process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 50)}...`);
    console.log(`  NEXT_PUBLIC_SUPABASE_ANON_KEY: ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing'}`);

    // The real issue might be in the search/route.ts
    console.log('\n\n⚠️  POSSIBLE ISSUES:\n');
    console.log('1. Audio URLs might be present but not being returned in search results');
    console.log('2. Search API might still be using JSON fallback instead of Supabase');
    console.log('3. Search performance issue might be in the search API logic, not the database');
    console.log('\nLet me check the actual search route...\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

diagnose();
