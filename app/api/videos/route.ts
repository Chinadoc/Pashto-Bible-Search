import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/app/utils/supabase';

export async function GET(request: NextRequest) {
  try {
    // Get all video transcripts from Supabase
    const { data, error } = await supabase
      .from('audio_mappings')
      .select('*')
      .like('verse_reference', 'video_%')
      .order('verse_reference');

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }

    // Group transcripts by video and create video objects
    const videoMap = new Map();
    
    data?.forEach((item) => {
      // Extract video ID from verse_reference format: video_{video_id}_segment_{number}
      const match = item.verse_reference.match(/^video_(.+)_segment_(\d+)$/);
      if (!match) return;
      
      const videoId = match[1]; // Full video ID (e.g., "Xqn_-onV9DQ")
      const segmentNumber = parseInt(match[2]);
      
      if (!videoMap.has(videoId)) {
        videoMap.set(videoId, {
          id: videoId,
          title: `Afghanistan - Pakistan War | Torkham Durand Line | د افغانستان پاکستان جنګ`,
          youtubeUrl: `https://www.youtube.com/watch?v=${videoId}`,
          segments: [],
          totalSegments: 0,
          totalDuration: 0
        });
      }
      
      const video = videoMap.get(videoId);
      video.segments.push({
        segmentNumber,
        startTime: item.start_time_seconds || (segmentNumber - 1) * 300,
        endTime: item.end_time_seconds || segmentNumber * 300,
        transcript: item.audio_path, // This contains our transcript
        audioFilename: item.audio_filename,
        duration: item.duration_seconds || 300
      });
      
      video.totalSegments++;
      video.totalDuration += item.duration_seconds || 300;
    });

    // Convert map to array and sort segments
    const videos = Array.from(videoMap.values()).map(video => ({
      ...video,
      segments: video.segments.sort((a: any, b: any) => a.segmentNumber - b.segmentNumber)
    }));

    return NextResponse.json({
      success: true,
      videos,
      count: videos.length
    });

  } catch (error) {
    console.error('Error fetching videos:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch videos' },
      { status: 500 }
    );
  }
}
