import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseKey);

interface VideoTranscriptRequest {
  videoId: string;
  videoUrl: string;
  transcript: string;
  segments?: Array<{ text: string; start: number; end: number }>;
  audioSegments?: Array<{ audioUrl: string; text: string }>;
  metadata?: {
    validation?: { confidence: number; isValid: boolean };
    source?: string;
  };
}

export async function POST(request: NextRequest) {
  try {
    const body: VideoTranscriptRequest = await request.json();
    
    const {
      videoId,
      videoUrl,
      transcript,
      segments = [],
      audioSegments = [],
      metadata = {}
    } = body;

    if (!videoId || !videoUrl || !transcript) {
      return NextResponse.json(
        { error: 'Missing required fields: videoId, videoUrl, transcript' },
        { status: 400 }
      );
    }

    // Extract video title from URL if possible
    const videoTitle = new URL(videoUrl).searchParams.get('v') || videoId;

    // Calculate validation score
    const validation = metadata.validation || { confidence: 0.5, isValid: true };
    const validationScore = Math.round(validation.confidence * 100);

    // Determine if retry is needed (low confidence)
    const needsRetry = validationScore < 70;

    // Store in Supabase
    const { data, error } = await supabase
      .from('video_transcripts')
      .insert([
        {
          video_id: videoId,
          video_title: videoTitle,
          video_url: videoUrl,
          transcript_text: transcript,
          segments: segments.length > 0 ? segments : null,
          validation_score: validationScore,
          needs_retry: needsRetry,
          retry_reason: needsRetry ? 'Low confidence transcription' : null,
          retry_count: 0,
          transcription_service: metadata.source || 'elevenlabs',
          google_drive_url: null, // Will be set after upload
          google_drive_file_id: null, // Will be set after upload
          audio_file_path: null, // Will be set after upload
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to store transcript: ' + error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      transcriptId: data?.id,
      videoId: data?.video_id,
      validationScore: validationScore,
      needsRetry: needsRetry,
      message: needsRetry
        ? 'Transcript stored but flagged for review (low confidence)'
        : 'Transcript stored successfully'
    });

  } catch (error) {
    console.error('Store transcript API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
