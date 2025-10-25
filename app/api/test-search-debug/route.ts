import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/utils/supabase';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { word = 'وهل', translations = ['afghan2023', 'yousafzai2019'] } = body;

    console.log(`🔍 Testing search for word: "${word}"`);
    console.log(`🔍 Testing translations: ${translations.join(', ')}`);

    // First, check dictionary
    console.log('\n📖 CHECKING DICTIONARY:');
    const { data: dictData, error: dictError } = await supabase
      .from('dictionary')
      .select('pashto, romanized, pos, english')
      .ilike('romanized', word)
      .limit(5);

    console.log(`Dictionary results for romanization "${word}":`, dictData?.length || 0);
    if (dictData && dictData.length > 0) {
      console.log('Sample:', dictData[0]);
    }

    // For each translation, check word_occurrence_index
    for (const translation of translations) {
      console.log(`\n🔎 CHECKING word_occurrence_index FOR: ${translation}`);

      // First, try the word as-is
      const { data: direct, error: directError } = await supabase
        .from('word_occurrence_index')
        .select('word, frequency, translation_key, verse_refs')
        .eq('word', word)
        .eq('translation_key', translation)
        .single();

      if (direct) {
        console.log(`✅ Direct match found:`, {
          word: direct.word,
          frequency: direct.frequency,
          translation_key: direct.translation_key,
          verse_refs_count: direct.verse_refs?.length || 0
        });
      } else if (directError?.code !== 'PGRST116') {
        console.log(`❌ Error:`, directError);
      } else {
        console.log(`❌ No direct match`);
      }

      // Check what keys exist for this translation
      console.log(`\n📊 Checking sample entries for translation: ${translation}`);
      const { data: sample, error: sampleError } = await supabase
        .from('word_occurrence_index')
        .select('word, translation_key')
        .eq('translation_key', translation)
        .limit(5);

      if (sample && sample.length > 0) {
        console.log(`Found ${sample.length} entries. Sample words:`, sample.map(s => s.word));
      } else {
        console.log(`No entries found for translation: ${translation}`);
        if (sampleError) {
          console.log('Error:', sampleError);
        }
      }

      // Get count of entries per translation
      const { count, error: countError } = await supabase
        .from('word_occurrence_index')
        .select('*', { count: 'exact', head: true })
        .eq('translation_key', translation);

      if (!countError) {
        console.log(`Total entries for ${translation}: ${count}`);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Debug info logged to console',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Test error:', error);
    return NextResponse.json(
      { error: 'Test failed', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
