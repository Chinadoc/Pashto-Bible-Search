import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import { writeFile, unlink } from 'fs/promises';
import { join } from 'path';
import { randomUUID } from 'crypto';

const execAsync = promisify(exec);

interface AudioSegment {
  start: number;
  end: number;
  duration: number;
  hasSpeech: boolean;
  confidence: number;
}

async function downloadYouTubeAudio(youtubeUrl: string): Promise<string | null> {
  try {
    // Extract video ID from YouTube URL
    const videoIdMatch = youtubeUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/);
    if (!videoIdMatch) {
      throw new Error('Invalid YouTube URL');
    }
    const videoId = videoIdMatch[1];

    // Create temporary directory for processing
    const tempDir = join(process.cwd(), 'temp');
    const tempAudioPath = join(tempDir, `${videoId}_audio.wav`);

    try {
      // Download audio using yt-dlp
      console.log(`Downloading YouTube audio: ${videoId}`);
      const downloadCmd = `yt-dlp --extract-audio --audio-format wav --output "${tempAudioPath}" "${youtubeUrl}"`;
      await execAsync(downloadCmd, { timeout: 300000 }); // 5 minute timeout

      return tempAudioPath;

    } catch (error) {
      // Clean up temp file if it exists
      try {
        await unlink(tempAudioPath);
      } catch {
        // File might not exist
      }
      throw error;
    }

  } catch (error) {
    console.error('Error downloading YouTube audio:', error);
    return null;
  }
}

async function analyzeAudioSegments(audioPath: string): Promise<AudioSegment[]> {
  try {
    // Use ffmpeg to detect silence and generate segments
    const outputPath = audioPath.replace('.wav', '_segments.json');

    // First, get audio duration and basic info
    const infoCmd = `ffprobe -v quiet -print_format json -show_format -show_streams "${audioPath}"`;
    const { stdout: infoOutput } = await execAsync(infoCmd);
    const info = JSON.parse(infoOutput);

    const duration = parseFloat(info.format.duration);
    const sampleRate = parseInt(info.streams[0].sample_rate);

    // Use silencedetect to find audio segments
    const silenceCmd = `ffmpeg -i "${audioPath}" -af silencedetect=noise=-30dB:d=0.5 -f null - 2>&1 | grep "silencedetect"`;

    console.log(`Analyzing audio segments for ${duration}s audio`);
    const { stdout: silenceOutput } = await execAsync(silenceCmd);

    // Parse silence detection output to find speech segments
    const segments: AudioSegment[] = [];
    let currentStart = 0;

    const silenceMatches = silenceOutput.match(/silencedetect.*?: (-?\d+(?:\.\d+)?)/g);

    if (silenceMatches) {
      for (let i = 0; i < silenceMatches.length; i += 2) {
        const startSilence = parseFloat(silenceMatches[i].match(/(-?\d+(?:\.\d+)?)/)?.[1] || '0');
        const endSilence = i + 1 < silenceMatches.length
          ? parseFloat(silenceMatches[i + 1].match(/(-?\d+(?:\.\d+)?)/)?.[1] || duration.toString())
          : duration;

        // Add speech segment before silence
        if (startSilence > currentStart) {
          segments.push({
            start: currentStart,
            end: startSilence,
            duration: startSilence - currentStart,
            hasSpeech: true,
            confidence: 0.8 // High confidence for segments between silences
          });
        }

        currentStart = endSilence;
      }

      // Add final segment if there's audio after last silence
      if (currentStart < duration) {
        segments.push({
          start: currentStart,
          end: duration,
          duration: duration - currentStart,
          hasSpeech: true,
          confidence: 0.8
        });
      }
    } else {
      // If no silence detected, treat entire audio as one segment
      segments.push({
        start: 0,
        end: duration,
        duration,
        hasSpeech: true,
        confidence: 0.6 // Lower confidence when no silence boundaries detected
      });
    }

    // Filter out very short segments (< 1 second) as they're likely noise
    const filteredSegments = segments.filter(segment => segment.duration > 1.0);

    // Merge very short gaps between segments
    const mergedSegments: AudioSegment[] = [];
    let currentSegment: AudioSegment | null = null;

    for (const segment of filteredSegments) {
      if (currentSegment && segment.start - currentSegment.end < 0.5) {
        // Merge segments with small gaps
        currentSegment.end = segment.end;
        currentSegment.duration = currentSegment.end - currentSegment.start;
      } else {
        if (currentSegment) {
          mergedSegments.push(currentSegment);
        }
        currentSegment = { ...segment };
      }
    }

    if (currentSegment) {
      mergedSegments.push(currentSegment);
    }

    console.log(`Found ${mergedSegments.length} audio segments`);
    return mergedSegments;

  } catch (error) {
    console.error('Error analyzing audio segments:', error);

    // Fallback: return single segment for entire audio
    const infoCmd = `ffprobe -v quiet -print_format json -show_format "${audioPath}"`;
    const { stdout: infoOutput } = await execAsync(infoCmd);
    const info = JSON.parse(infoOutput);
    const duration = parseFloat(info.format.duration);

    return [{
      start: 0,
      end: duration,
      duration,
      hasSpeech: true,
      confidence: 0.5 // Low confidence fallback
    }];
  }
}

export async function POST(request: NextRequest) {
  try {
    const { youtubeUrl } = await request.json();

    if (!youtubeUrl) {
      return NextResponse.json({ error: 'YouTube URL is required' }, { status: 400 });
    }

    // Validate YouTube URL
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/;
    if (!youtubeRegex.test(youtubeUrl)) {
      return NextResponse.json({ error: 'Invalid YouTube URL' }, { status: 400 });
    }

    // Download YouTube audio
    const audioPath = await downloadYouTubeAudio(youtubeUrl);
    if (!audioPath) {
      return NextResponse.json({ error: 'Failed to download YouTube audio' }, { status: 500 });
    }

    try {
      // Analyze audio segments
      const segments = await analyzeAudioSegments(audioPath);

      // Get basic audio info
      const infoCmd = `ffprobe -v quiet -print_format json -show_format -show_streams "${audioPath}"`;
      const { stdout: infoOutput } = await execAsync(infoCmd);
      const info = JSON.parse(infoOutput);

      const audioInfo = {
        duration: parseFloat(info.format.duration),
        size: parseInt(info.format.size),
        bitrate: parseInt(info.format.bit_rate),
        sampleRate: parseInt(info.streams[0].sample_rate),
        channels: parseInt(info.streams[0].channels)
      };

      return NextResponse.json({
        success: true,
        segments,
        audioInfo,
        videoId: youtubeUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)?.[1] || 'unknown'
      });

    } finally {
      // Clean up temporary audio file
      try {
        await unlink(audioPath);
      } catch (error) {
        console.warn('Failed to clean up temp audio file:', error);
      }
    }

  } catch (error) {
    console.error('Audio analysis error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
