import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/app/utils/supabase';

export async function GET(request: NextRequest) {
  try {
    // Get all video transcripts from Supabase (both segment and sentence level)
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
      // Extract video ID from verse_reference format: 
      // video_{video_id}_segment_{number} or video_{video_id}_sentence_{segment}_{sentence}
      const segmentMatch = item.verse_reference.match(/^video_(.+)_segment_(\d+)$/);
      const sentenceMatch = item.verse_reference.match(/^video_(.+)_sentence_(\d+)_(\d+)$/);
      
      let videoId, segmentNumber, sentenceNumber;
      
      if (segmentMatch) {
        videoId = segmentMatch[1];
        segmentNumber = parseInt(segmentMatch[2]);
        sentenceNumber = null;
      } else if (sentenceMatch) {
        videoId = sentenceMatch[1];
        segmentNumber = parseInt(sentenceMatch[2]);
        sentenceNumber = parseInt(sentenceMatch[3]);
      } else {
        return; // Skip if format doesn't match
      }
      
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
      
          if (sentenceNumber) {
            // This is a sentence-level segment
            const startTime = item.start_time_seconds || (segmentNumber - 1) * 300 + (sentenceNumber - 1) * 10;
            const duration = item.duration_seconds || 10;
            video.segments.push({
              segmentNumber,
              sentenceNumber,
              startTime: startTime,
              endTime: startTime + duration,
              transcript: item.audio_path, // This contains our transcript
              audioFilename: item.audio_filename,
              duration: duration,
              type: 'sentence'
            });
          } else {
            // This is a regular segment
            const startTime = item.start_time_seconds || (segmentNumber - 1) * 300;
            const duration = item.duration_seconds || 300;
            video.segments.push({
              segmentNumber,
              startTime: startTime,
              endTime: startTime + duration,
              transcript: item.audio_path, // This contains our transcript
              audioFilename: item.audio_filename,
              duration: duration,
              type: 'segment'
            });
          }
      
      video.totalSegments++;
      video.totalDuration += item.duration_seconds || 300;
    });

    // Convert map to array and sort segments
    const videos = Array.from(videoMap.values()).map(video => ({
      ...video,
      segments: video.segments.sort((a: any, b: any) => {
        // Sort by segment number first, then by sentence number if available
        if (a.segmentNumber !== b.segmentNumber) {
          return a.segmentNumber - b.segmentNumber;
        }
        if (a.sentenceNumber && b.sentenceNumber) {
          return a.sentenceNumber - b.sentenceNumber;
        }
        return 0;
      })
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
