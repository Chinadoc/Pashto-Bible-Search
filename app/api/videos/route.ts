import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET(request: NextRequest) {
  try {
    // Fetch all video transcripts from Supabase
    const { data: transcripts, error } = await supabase
      .from('video_transcripts')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100);

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: 'Failed to fetch videos' }, { status: 500 });
    }

    // Group transcripts by video_id
    const videosMap = new Map();
    
    transcripts?.forEach(transcript => {
      const videoId = transcript.video_id;
      
      if (!videosMap.has(videoId)) {
        videosMap.set(videoId, {
          video_id: videoId,
          video_title: transcript.video_title || `Video ${videoId}`,
          youtube_url: transcript.video_url || `https://www.youtube.com/watch?v=${videoId}`,
          total_clips: 0,
          clips: [],
          created_at: transcript.created_at,
          updated_at: transcript.updated_at
        });
      }
      
      const video = videosMap.get(videoId);
      video.total_clips++;
      video.clips.push({
        segment_number: transcript.segment_number,
        transcript_text: transcript.transcript_text,
        start_time_seconds: transcript.start_time_seconds,
        end_time_seconds: transcript.end_time_seconds,
        google_drive_url: transcript.google_drive_url,
        audio_file_path: transcript.audio_file_path,
        validation_score: transcript.validation_score,
        needs_retry: transcript.needs_retry
      });
    });

    // Convert map to array
    const videos = Array.from(videosMap.values());

    return NextResponse.json({
      success: true,
      videos: videos,
      total: videos.length
    });

  } catch (error) {
    console.error('Videos API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
