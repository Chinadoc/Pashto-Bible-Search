import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/app/utils/supabase';

export async function POST(request: NextRequest) {
  try {
    const {
      videoId,
      videoUrl,
      transcript,
      segments,
      audioSegments,
      metadata = {}
    } = await request.json();

    if (!videoId || !transcript) {
      return NextResponse.json({ error: 'Video ID and transcript are required' }, { status: 400 });
    }

    // Store the video transcript in Supabase
    const { data, error } = await supabase
      .from('video_transcripts')
      .insert({
        video_id: videoId,
        video_url: videoUrl || null,
        transcript: transcript,
        segments: segments || null,
        audio_segments: audioSegments || null,
        metadata: metadata,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select();

    if (error) {
      console.error('Supabase error storing video transcript:', error);
      return NextResponse.json({ error: 'Failed to store transcript' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      transcriptId: data?.[0]?.id,
      storedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('Video transcript storage error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
