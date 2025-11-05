import { NextRequest, NextResponse } from 'next/server';
import { getD1ClientOrThrow } from '@/utils/d1-helpers';

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
      metadata = {},
    } = body;

    if (!videoId || !videoUrl || !transcript) {
      return NextResponse.json(
        { error: 'Missing required fields: videoId, videoUrl, transcript' },
        { status: 400 }
      );
    }

    let db;
    try {
      db = getD1ClientOrThrow();
    } catch (error) {
      return NextResponse.json({ error: error instanceof Error ? error.message : String(error) }, { status: 500 });
    }

    const transcriptionService = metadata.source || 'elevenlabs';
    const segmentsJson = segments.length > 0 ? JSON.stringify(segments) : null;

    try {
      await db.query(
        `INSERT OR REPLACE INTO video_transcripts (video_id, youtube_url, transcript, segments, transcription_service, r2_audio_key, title, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          videoId,
          videoUrl,
          transcript,
          segmentsJson,
          transcriptionService,
          null,
          `Video ${videoId}`,
          new Date().toISOString(),
          new Date().toISOString(),
        ]
      );

      return NextResponse.json({
        success: true,
        transcriptId: videoId,
        videoId,
        message: 'Transcript stored successfully',
      });
    } catch (error) {
      console.error('D1 error:', error);
      return NextResponse.json(
        { error: 'Failed to store transcript: ' + (error instanceof Error ? error.message : String(error)) },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Store transcript API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
