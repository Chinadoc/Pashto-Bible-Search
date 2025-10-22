import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/utils/supabase';

export async function GET(request: NextRequest) {
  try {
    const results: any = {};

    // Check verses table
    const { data: verses } = await supabase
      .from('verses')
      .select('*')
      .limit(1);

    if (verses && verses[0]) {
      results.verses = {
        columns: Object.keys(verses[0]),
        sample: verses[0]
      };
    }

    // Check audio_files table
    const { data: audio } = await supabase
      .from('audio_files')
      .select('*')
      .limit(1);

    if (audio && audio[0]) {
      results.audio_files = {
        columns: Object.keys(audio[0]),
        sample: audio[0]
      };
    }

    // Check audio_mappings table
    const { data: mappings } = await supabase
      .from('audio_mappings')
      .select('*')
      .limit(1);

    if (mappings && mappings[0]) {
      results.audio_mappings = {
        columns: Object.keys(mappings[0]),
        sample: mappings[0]
      };
    }

    // Check word_frequencies table
    const { data: freq } = await supabase
      .from('word_frequencies')
      .select('*')
      .limit(1);

    if (freq && freq[0]) {
      results.word_frequencies = {
        columns: Object.keys(freq[0]),
        sample: freq[0]
      };
    }

    // Check form_occurrences table
    const { data: formOcc } = await supabase
      .from('form_occurrences')
      .select('*')
      .limit(1);

    if (formOcc && formOcc[0]) {
      results.form_occurrences = {
        columns: Object.keys(formOcc[0]),
        sample: formOcc[0]
      };
    }

    // Check form_roots table
    const { data: formRoots } = await supabase
      .from('form_roots')
      .select('*')
      .limit(1);

    if (formRoots && formRoots[0]) {
      results.form_roots = {
        columns: Object.keys(formRoots[0]),
        sample: formRoots[0]
      };
    }

    // Check word_forms_master table
    const { data: master } = await supabase
      .from('word_forms_master')
      .select('*')
      .limit(1);

    if (master && master[0]) {
      results.word_forms_master = {
        columns: Object.keys(master[0]),
        sample: master[0]
      };
    }

    return NextResponse.json({ success: true, schema: results });
  } catch (error) {
    console.error('Error exploring schema:', error);
    return NextResponse.json(
      { error: 'Failed to explore schema' },
      { status: 500 }
    );
  }
}
