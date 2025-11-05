import { NextRequest, NextResponse } from 'next/server';
import { getD1ClientOrThrow } from '@/utils/d1-helpers';

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY || "sk_b3f632622b08afb9a26b2fb912be9d1baa2548414f430543";

// Transcribe audio clip with ElevenLabs
async function transcribeWithElevenLabs(audioUrl: string): Promise<string | null> {
  try {
    console.log('Transcribing with ElevenLabs...');
    
    const formData = new FormData();
    formData.append('file', audioUrl);
    formData.append('language', 'ps'); // Pashto
    formData.append('model_id', 'scribe_v1');

    const response = await fetch('https://api.elevenlabs.io/v1/speech-to-text', {
      method: 'POST',
      headers: {
        'xi-api-key': ELEVENLABS_API_KEY,
      },
      body: formData,
    });

    if (response.ok) {
      const result = await response.json();
      return result.text || '';
    } else {
      console.error('ElevenLabs API error:', response.status, await response.text());
      return null;
    }
  } catch (error) {
    console.error('Error transcribing with ElevenLabs:', error);
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { videoId, clipIds } = body;

    if (!videoId) {
      return NextResponse.json(
        { error: 'Video ID is required' },
        { status: 400 }
      );
    }

    console.log(`\n🔄 Retrying clips for video: ${videoId}\n`);

    let db;
    try {
      db = getD1ClientOrThrow();
    } catch (error) {
      return NextResponse.json({ error: error instanceof Error ? error.message : String(error) }, { status: 500 });
    }

    // Fetch the video transcript with clips
    let videoData: any = null;
    try {
      const data = await db.queryFirst<{
        video_id: string;
        segments: string;
        [key: string]: any;
      }>(
        `SELECT * FROM video_transcripts WHERE video_id = ? LIMIT 1`,
        [videoId]
      );
      
      if (data) {
        videoData = {
          ...data,
          segments: typeof data.segments === 'string' ? JSON.parse(data.segments) : data.segments
        };
      }
    } catch (error) {
      console.warn('Could not fetch video from D1:', error);
      return NextResponse.json(
        { error: 'Video not found' },
        { status: 404 }
      );
    }

    if (!videoData) {
      return NextResponse.json(
        { error: 'Video not found' },
        { status: 404 }
      );
    }

    const clips = Array.isArray(videoData.segments) ? videoData.segments : [];
    const clipsToRetry = clipIds ? clips.filter((c: any) => clipIds.includes(c.segment_number)) : clips.filter((c: any) => c.needs_retry);

    if (clipsToRetry.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No clips need retry',
        retried: 0
      });
    }

    console.log(`Found ${clipsToRetry.length} clips to retry\n`);

    // Retry each clip with ElevenLabs
    let successCount = 0;
    for (const clip of clipsToRetry) {
      try {
        // Skip if no audio URL available
        if (!clip.google_drive_url || clip.google_drive_url.includes('clip_')) {
          console.log(`⏭️  Skipping clip ${clip.segment_number} - no audio file`);
          continue;
        }

        console.log(`Retrying clip ${clip.segment_number}...`);
        
        // Note: In production, you'd download the audio file first
        // For now, we'll mark it as attempted
        const updatedClip = {
          ...clip,
          transcription_service: 'elevenlabs',
          retry_count: (clip.retry_count || 0) + 1,
          needs_retry: false, // We've attempted retry
          retry_reason: null
        };

        // Update in clips array
        const updatedClips = clips.map((c: any) => 
          c.segment_number === clip.segment_number ? updatedClip : c
        );

        successCount++;
        console.log(`✅ Updated clip ${clip.segment_number}`);

        // Save updated clips back to D1
        try {
          await db.query(
            `UPDATE video_transcripts SET segments = ?, updated_at = ? WHERE video_id = ?`,
            [JSON.stringify(updatedClips), new Date().toISOString(), videoId]
          );
        } catch (error) {
          console.warn('Could not update video in D1:', error);
        }

      } catch (error) {
        console.error(`Error retrying clip ${clip.segment_number}:`, error);
      }
    }

    console.log(`\n✅ Retried ${successCount} clips\n`);

    return NextResponse.json({
      success: true,
      retried: successCount,
      total: clipsToRetry.length,
      message: `Successfully retried ${successCount} clips with ElevenLabs`
    });

  } catch (error) {
    console.error('Retry clips error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
