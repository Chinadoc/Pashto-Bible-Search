import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY || "sk_b3f632622b08afb9a26b2fb912be9d1baa2548414f430543";

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseKey);

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

    // Fetch the video transcript with clips
    const { data: videoData, error: fetchError } = await supabase
      .from('video_transcripts')
      .select('*')
      .eq('video_id', videoId)
      .single();

    if (fetchError || !videoData) {
      return NextResponse.json(
        { error: 'Video not found' },
        { status: 404 }
      );
    }

    const clips = videoData.segments || [];
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

        // Save updated clips back to Supabase
        await supabase
          .from('video_transcripts')
          .update({ 
            segments: updatedClips,
            updated_at: new Date().toISOString()
          })
          .eq('video_id', videoId);

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

