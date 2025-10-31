import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const CLOUDFLARE_WORKER_URL = process.env.NEXT_PUBLIC_CLOUDFLARE_WORKER_URL || 'https://pashtobiblesearch.jeremy-samuels17.workers.dev';

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET(request: NextRequest) {
  try {
    // Fetch from Cloudflare D1 first
    let cloudflareVideos: any[] = [];
    try {
      const workerResponse = await fetch(`${CLOUDFLARE_WORKER_URL}/api/video/list`);
      if (workerResponse.ok) {
        const workerData = await workerResponse.json();
        cloudflareVideos = workerData.videos || [];
      }
    } catch (error) {
      console.warn('Failed to fetch from Cloudflare D1:', error);
    }

    // Also fetch from Supabase (legacy)
    const { data: transcripts, error } = await supabase
      .from('video_transcripts')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100);

    if (error) {
      console.error('Supabase error:', error);
    }

    // Combine and deduplicate by video_id
    const videosMap = new Map();
    
    // Add Cloudflare videos (with segments from D1)
    cloudflareVideos.forEach(video => {
      const segments = video.segments || [];
      videosMap.set(video.video_id, {
        video_id: video.video_id,
        video_title: `Video ${video.video_id}`,
        youtube_url: video.youtube_url,
        transcript: video.transcript,
        total_clips: segments.length,
        clips: segments.map((segment: any, index: number) => ({
          segment_number: index + 1,
          transcript_text: segment.text,
          start_time_seconds: Math.round(segment.startTime),
          end_time_seconds: Math.round(segment.endTime),
          duration: segment.endTime - segment.startTime,
          r2_key: `videos/${video.video_id}/segment_${index + 1}.mp3`,
          audio_url: `${CLOUDFLARE_WORKER_URL}/api/video/${video.video_id}/audio?segment=${index + 1}`,
        })),
        created_at: video.created_at,
        updated_at: video.updated_at,
        source: 'cloudflare',
        transcription_service: video.transcription_service,
      });
    });
    
    // Add Supabase videos (if not already present)
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
          updated_at: transcript.updated_at,
          source: 'supabase',
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
