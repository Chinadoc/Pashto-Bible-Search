import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/app/utils/supabase';
import fs from 'fs';
import path from 'path';

// Helper function to analyze Pashto text and count words
function analyzePashtoText(text: string): { wordCount: number, uniqueWords: string[], wordFreq: Record<string, number> } {
  // Remove punctuation and normalize text
  const cleanText = text
    .replace(/[^\u0600-\u06FF\s]/g, ' ') // Keep only Pashto characters and spaces
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim();

  const words = cleanText.split(' ').filter(word => word.length > 0);

  const wordFreq: Record<string, number> = {};
  for (const word of words) {
    wordFreq[word] = (wordFreq[word] || 0) + 1;
  }

  return {
    wordCount: words.length,
    uniqueWords: Object.keys(wordFreq).sort(),
    wordFreq
  };
}

// Helper function to load local video data from JSON files
async function loadLocalVideoData(): Promise<any[]> {
  try {
    const processedDir = path.join(process.cwd(), 'processed_videos');
    const videos: any[] = [];

    if (!fs.existsSync(processedDir)) {
      return videos;
    }

    const files = fs.readdirSync(processedDir).filter(f => f.endsWith('_results.json'));

    for (const file of files) {
      const filePath = path.join(processedDir, file);
      const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

      if (data.video_id && data.segments) {
        // Extract video ID from the URL to get the correct title
        const youtubeUrl = data.video_url || `https://www.youtube.com/watch?v=${data.video_id}`;
        const urlMatch = youtubeUrl.match(/[?&]v=([^&]+)/);
        const actualVideoId = urlMatch ? urlMatch[1] : data.video_id;

        const video: any = {
          id: actualVideoId,
          title: `Processed Video ${actualVideoId}`,
          youtubeUrl: youtubeUrl,
          segments: [],
          totalSegments: data.total_segments || data.segments.length,
          totalDuration: 0
        };

        // Process segments
        data.segments.forEach((segment: any, index: number) => {
          if (segment.sentence_clips && segment.sentence_clips.length > 0) {
            // Add segment-level entry
            video.segments.push({
              segmentNumber: index + 1,
              startTime: segment.start_time || index * 300,
              endTime: segment.end_time || (index + 1) * 300,
              transcript: segment.transcript || '',
              audioFilename: segment.filename,
              duration: segment.duration || 300,
              type: 'segment'
            });

            // Add sentence-level entries
            segment.sentence_clips.forEach((sentence: any, sentenceIndex: number) => {
              video.segments.push({
                segmentNumber: index + 1,
                sentenceNumber: sentenceIndex + 1,
                startTime: sentence.start_time || (index * 300 + sentenceIndex * 15),
                endTime: sentence.end_time || (index * 300 + (sentenceIndex + 1) * 15),
                transcript: sentence.sentence || '',
                audioFilename: sentence.audio_filename,
                duration: sentence.duration || 15,
                type: 'sentence'
              });
            });
          } else {
            // No sentence clips, just add the segment
            video.segments.push({
              segmentNumber: index + 1,
              startTime: segment.start_time || index * 300,
              endTime: segment.end_time || (index + 1) * 300,
              transcript: segment.transcript || '',
              audioFilename: segment.filename,
              duration: segment.duration || 300,
              type: 'segment'
            });
          }
        });

        video.totalDuration = data.segments.reduce((total: number, segment: any) =>
          total + (segment.duration || 300), 0);

        videos.push(video);
      }
    }

    return videos;
  } catch (error) {
    console.error('Error loading local video data:', error);
    return [];
  }
}

// Helper function to process video data and return formatted response
async function processVideoData(includeFrequency: boolean = false): Promise<any> {
  try {
    // Get data from Supabase
    const { data, error } = await supabase
      .from('audio_mappings')
      .select('*')
      .like('verse_reference', 'video_%')
      .order('verse_reference');

    if (error) {
      console.error('Supabase error:', error);
    }

    // Get local video data
    const localVideos = await loadLocalVideoData();

    // Group transcripts by video and create video objects
    const videoMap = new Map();

    // Prioritize local video data over Supabase data
    // Handle local video data first (already structured as video objects)
    localVideos.forEach((video) => {
      videoMap.set(video.id, video);
    });

    // Only add Supabase data if it doesn't conflict with local data
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
          title: `Video ${videoId}`,
          youtubeUrl: `https://www.youtube.com/watch?v=${videoId}`,
          segments: [],
          totalSegments: 0,
          totalDuration: 0
        });
      }

      const video = videoMap.get(videoId);

      if (sentenceNumber) {
        // This is a sentence-level segment
        // Parse timestamps from audio_path if available
        let startTime, endTime, transcript = item.audio_path;
        const duration = item.duration_seconds || 10;

        // Check if timestamps are embedded in the transcript
        const timestampMatch = transcript.match(/\[TIMESTAMPS:start=([\d.]+),end=([\d.]+),duration=([\d.]+)\]/);

        if (timestampMatch) {
          startTime = parseFloat(timestampMatch[1]);
          endTime = parseFloat(timestampMatch[2]);
          // Remove timestamp info from transcript
          transcript = transcript.replace(/\[TIMESTAMPS:[^\]]+\]\s*/, '');
        } else {
          // Fallback to estimation
          startTime = (segmentNumber - 1) * 300 + (sentenceNumber - 1) * 15;
          endTime = startTime + duration;
        }

        video.segments.push({
          segmentNumber,
          sentenceNumber,
          startTime: startTime,
          endTime: endTime,
          transcript: transcript,
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

    let wordFrequencyData = null;
    if (includeFrequency) {
      // Aggregate word frequency across all transcripts
      const allTranscripts = videos.flatMap(video =>
        video.segments.map((segment: any) => segment.transcript)
      ).join(' ');

      const analysis = analyzePashtoText(allTranscripts);

      // Convert word frequency to sorted array for easier consumption
      const wordFrequencyArray = Object.entries(analysis.wordFreq)
        .map(([word, frequency]) => ({ word, frequency }))
        .sort((a, b) => b.frequency - a.frequency);

      wordFrequencyData = {
        totalWords: analysis.wordCount,
        uniqueWords: analysis.uniqueWords.length,
        wordFrequency: wordFrequencyArray
      };
    }

    return {
      success: true,
      videos,
      count: videos.length,
      ...(includeFrequency && { wordFrequency: wordFrequencyData })
    };

  } catch (error) {
    console.error('Error processing video data:', error);
    return {
      success: false,
      error: 'Failed to process video data',
      videos: [],
      count: 0
    };
  }
}

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const includeFrequency = url.searchParams.get('frequency') === 'true';

    // Use the shared processing function
    const result = await processVideoData(includeFrequency);

    return NextResponse.json(result);

  } catch (error) {
    console.error('Error fetching videos:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch videos' },
      { status: 500 }
    );
  }
}

// POST endpoint to sync YouTube video position with transcript segments
export async function POST(request: NextRequest) {
  try {
    const { videoId, currentTime } = await request.json();

    if (!videoId || currentTime === undefined) {
      return NextResponse.json(
        { error: 'Video ID and current time are required' },
        { status: 400 }
      );
    }

    // Get video data using the shared processing function
    const videoData = await processVideoData(false);

    if (!videoData.success) {
      return NextResponse.json(
        { error: 'Failed to fetch video data' },
        { status: 500 }
      );
    }

    const video = videoData.videos.find((v: any) => v.id === videoId);

    if (!video) {
      return NextResponse.json(
        { error: 'Video not found' },
        { status: 404 }
      );
    }

    // Find the current segment based on time
    const currentSegment = video.segments.find((segment: any) => {
      return currentTime >= segment.startTime && currentTime <= segment.endTime;
    });

    if (!currentSegment) {
      return NextResponse.json({
        success: true,
        currentSegment: null,
        nextSegment: null,
        timeUntilNext: null
      });
    }

    // Find the next segment
    const currentIndex = video.segments.findIndex((s: any) => s === currentSegment);
    const nextSegment = currentIndex < video.segments.length - 1 ? video.segments[currentIndex + 1] : null;

    // Calculate time until next segment
    let timeUntilNext = null;
    if (nextSegment) {
      timeUntilNext = Math.max(0, nextSegment.startTime - currentTime);
    }

    return NextResponse.json({
      success: true,
      currentSegment: {
        segmentNumber: currentSegment.segmentNumber,
        sentenceNumber: currentSegment.sentenceNumber,
        startTime: currentSegment.startTime,
        endTime: currentSegment.endTime,
        transcript: currentSegment.transcript,
        type: currentSegment.type
      },
      nextSegment: nextSegment ? {
        segmentNumber: nextSegment.segmentNumber,
        sentenceNumber: nextSegment.sentenceNumber,
        startTime: nextSegment.startTime,
        endTime: nextSegment.endTime,
        transcript: nextSegment.transcript,
        type: nextSegment.type
      } : null,
      timeUntilNext
    });

  } catch (error) {
    console.error('Error syncing video position:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to sync video position' },
      { status: 500 }
    );
  }
}
