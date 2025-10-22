import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/utils/supabase';

interface AudioMapping {
  verse_ref: string;
  audio_url: string;
}

/**
 * Batch fetch audio URLs from Supabase audio_mappings table
 * Much faster than individual lookups or loading from JSON
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { refs } = body;

    if (!Array.isArray(refs) || refs.length === 0) {
      return NextResponse.json({ error: 'refs array is required' }, { status: 400 });
    }

    const startTime = Date.now();

    // Query Supabase for all audio mappings in one go
    const { data: mappings, error } = await supabase
      .from('audio_mappings')
      .select('verse_ref, audio_url')
      .in('verse_ref', refs)
      .returns<AudioMapping[]>();

    if (error) {
      console.error('Audio mappings query error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch audio mappings' },
        { status: 500 }
      );
    }

    // Build result map
    const audioUrls: Record<string, string> = {};
    if (mappings) {
      for (const mapping of mappings) {
        if (mapping.verse_ref && mapping.audio_url) {
          audioUrls[mapping.verse_ref] = mapping.audio_url;
        }
      }
    }

    const queryTime = Date.now() - startTime;
    console.log(`⚡ Fetched ${Object.keys(audioUrls).length}/${refs.length} audio URLs in ${queryTime}ms`);

    return NextResponse.json({
      success: true,
      audioUrls,
      metadata: {
        requested: refs.length,
        found: Object.keys(audioUrls).length,
        queryTimeMs: queryTime,
        source: 'supabase-audio-mappings'
      }
    });

  } catch (error) {
    console.error('Audio batch fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch audio URLs' },
      { status: 500 }
    );
  }
}
