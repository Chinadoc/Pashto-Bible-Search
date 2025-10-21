import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import { writeFile, unlink } from 'fs/promises';
import { join } from 'path';
import { randomUUID } from 'crypto';

const execAsync = promisify(exec);

async function downloadYouTubeVideo(youtubeUrl: string): Promise<string | null> {
  try {
    // Extract video ID from YouTube URL
    const videoIdMatch = youtubeUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/);
    if (!videoIdMatch) {
      throw new Error('Invalid YouTube URL');
    }
    const videoId = videoIdMatch[1];

    // Create temporary directory for processing
    const tempDir = join(process.cwd(), 'temp');
    const tempVideoPath = join(tempDir, `${videoId}_video.mp4`);

    try {
      // Download video using yt-dlp
      console.log(`Downloading YouTube video: ${videoId}`);
      const downloadCmd = `yt-dlp --output "${tempVideoPath}" "${youtubeUrl}"`;
      await execAsync(downloadCmd, { timeout: 600000 }); // 10 minute timeout for video

      return tempVideoPath;

    } catch (error) {
      // Clean up temp file if it exists
      try {
        await unlink(tempVideoPath);
      } catch {
        // File might not exist
      }
      throw error;
    }

  } catch (error) {
    console.error('Error downloading YouTube video:', error);
    return null;
  }
}

async function extractAudioSegment(videoPath: string, startTime: number, endTime: number): Promise<ArrayBuffer | null> {
  try {
    const tempDir = join(process.cwd(), 'temp');
    const outputPath = join(tempDir, `segment_${randomUUID()}.mp3`);

    // Extract audio segment using ffmpeg
    const duration = endTime - startTime;
    const extractCmd = `ffmpeg -i "${videoPath}" -ss ${startTime} -t ${duration} -b:a 128k -y "${outputPath}"`;

    await execAsync(extractCmd, { timeout: 120000 });

    try {
      // Read the extracted audio file
      const audioBuffer = await import('fs').then(fs => fs.promises.readFile(outputPath));

      return audioBuffer.buffer.slice(audioBuffer.byteOffset, audioBuffer.byteOffset + audioBuffer.byteLength);

    } finally {
      // Clean up temp file
      try {
        await unlink(outputPath);
      } catch (error) {
        console.warn('Failed to clean up temp audio segment:', error);
      }
    }

  } catch (error) {
    console.error('Error extracting audio segment:', error);
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    const { youtubeUrl, selectedSegments } = await request.json();

    if (!youtubeUrl) {
      return NextResponse.json({ error: 'YouTube URL is required' }, { status: 400 });
    }

    if (!selectedSegments || !Array.isArray(selectedSegments) || selectedSegments.length === 0) {
      return NextResponse.json({ error: 'Selected segments are required' }, { status: 400 });
    }

    // Validate YouTube URL
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/;
    if (!youtubeRegex.test(youtubeUrl)) {
      return NextResponse.json({ error: 'Invalid YouTube URL' }, { status: 400 });
    }

    // Download YouTube video
    const videoPath = await downloadYouTubeVideo(youtubeUrl);
    if (!videoPath) {
      return NextResponse.json({ error: 'Failed to download YouTube video' }, { status: 500 });
    }

    try {
      const extractedSegments: Array<{
        segmentIndex: number;
        start: number;
        end: number;
        duration: number;
        audioBuffer: ArrayBuffer;
        size: number;
      }> = [];

      // Extract each selected segment
      for (let i = 0; i < selectedSegments.length; i++) {
        const segment = selectedSegments[i];
        const audioBuffer = await extractAudioSegment(videoPath, segment.start, segment.end);

        if (audioBuffer) {
          extractedSegments.push({
            segmentIndex: i,
            start: segment.start,
            end: segment.end,
            duration: segment.end - segment.start,
            audioBuffer,
            size: audioBuffer.byteLength
          });
        }
      }

      if (extractedSegments.length === 0) {
        return NextResponse.json({ error: 'Failed to extract any audio segments' }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        extractedSegments,
        totalSegments: extractedSegments.length,
        videoId: youtubeUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)?.[1] || 'unknown'
      });

    } finally {
      // Clean up temporary video file
      try {
        await unlink(videoPath);
      } catch (error) {
        console.warn('Failed to clean up temp video file:', error);
      }
    }

  } catch (error) {
    console.error('Video splitting error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
