import { NextRequest, NextResponse } from 'next/server';
import { writeFile, unlink } from 'fs/promises';
import { join } from 'path';
import { randomUUID } from 'crypto';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY || "sk_b3f632622b08afb9a26b2fb912be9d1baa2548414f430543";
const ELEVENLABS_API_URL = "https://api.elevenlabs.io/v1/speech-to-text";

async function downloadAndCompressYouTubeAudio(youtubeUrl: string): Promise<{ audioBuffer: ArrayBuffer; originalSize: number; compressedSize: number } | null> {
  try {
    // Extract video ID from YouTube URL
    const videoIdMatch = youtubeUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/);
    if (!videoIdMatch) {
      throw new Error('Invalid YouTube URL');
    }
    const videoId = videoIdMatch[1];

    // Create temporary directory for processing
    const tempDir = join(process.cwd(), 'temp');
    const tempVideoPath = join(tempDir, `${videoId}_original.mp4`);
    const tempAudioPath = join(tempDir, `${videoId}_compressed.mp3`);

    try {
      // Download video using yt-dlp
      console.log(`Downloading YouTube video: ${videoId}`);
      const downloadCmd = `yt-dlp --extract-audio --audio-format mp3 --output "${tempVideoPath}" "${youtubeUrl}"`;
      await execAsync(downloadCmd, { timeout: 300000 }); // 5 minute timeout

      // Check if file exists
      try {
        await writeFile(join(tempDir, '.gitkeep'), ''); // Ensure temp dir exists
      } catch {
        // Directory might already exist
      }

      // Get original file size
      const originalStats = await import('fs').then(fs => fs.promises.stat(tempVideoPath));
      const originalSize = originalStats.size;

      // Compress audio to ensure it's under 25MB
      console.log(`Compressing audio from ${originalSize} bytes`);
      let targetBitrate = 128; // Start with 128kbps

      // If original file is too large, progressively reduce bitrate
      const maxSize = 25 * 1024 * 1024; // 25MB
      let compressedSize = originalSize;

      while (compressedSize > maxSize && targetBitrate > 32) {
        const compressCmd = `ffmpeg -i "${tempVideoPath}" -b:a ${targetBitrate}k -y "${tempAudioPath}"`;
        await execAsync(compressCmd, { timeout: 120000 });

        const compressedStats = await import('fs').then(fs => fs.promises.stat(tempAudioPath));
        compressedSize = compressedStats.size;
        console.log(`Compressed to ${compressedSize} bytes at ${targetBitrate}kbps`);

        if (compressedSize <= maxSize) {
          break;
        }

        targetBitrate -= 16; // Reduce bitrate
      }

      // Read the compressed audio file
      const audioBuffer = await import('fs').then(fs => fs.promises.readFile(tempAudioPath));

      // Clean up temporary files
      try {
        await unlink(tempVideoPath);
        await unlink(tempAudioPath);
      } catch (error) {
        console.warn('Failed to clean up temp files:', error);
      }

      return {
        audioBuffer: audioBuffer.slice(0),
        originalSize,
        compressedSize
      };

    } catch (error) {
      // Clean up temp files if they exist
      try {
        await unlink(tempVideoPath);
        await unlink(tempAudioPath);
      } catch {
        // Files might not exist
      }
      throw error;
    }

  } catch (error) {
    console.error('Error processing YouTube video:', error);
    return null;
  }
}

async function transcribeWithElevenLabs(audioBuffer: ArrayBuffer): Promise<string | null> {
  try {
    const formData = new FormData();
    formData.append('file', new Blob([new Uint8Array(audioBuffer)]), 'audio.wav');
    formData.append('language', 'ps'); // Pashto
    formData.append('model_id', 'scribe_v1');

    const response = await fetch(ELEVENLABS_API_URL, {
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

async function validatePashtoTranscription(transcript: string): Promise<{ isValid: boolean; confidence: number; reason: string }> {
  try {
    // Basic Pashto validation - check for common Pashto words and scripts
    const commonPashtoWords = [
      'او', 'او', 'او', 'او', 'او', 'او', 'او', 'او', 'او', 'او', // Common Pashto particles and words
      'څه', 'چې', 'چې', 'چې', 'چې', 'چې', 'چې', 'چې', 'چې', 'چې',
      'خدای', 'عیسی', 'پیغمبر', 'کتاب', 'تورات', 'انجیل', 'زبور'
    ];

    const hasPashtoScript = /[\u0600-\u06FF]/.test(transcript); // Arabic script range includes Pashto
    const hasCommonWords = commonPashtoWords.some(word => transcript.includes(word));
    const wordCount = transcript.split(/\s+/).length;

    // Calculate confidence score
    let confidence = 0;
    if (hasPashtoScript) confidence += 0.4;
    if (hasCommonWords) confidence += 0.3;
    if (wordCount > 3) confidence += 0.2;
    if (transcript.length > 10) confidence += 0.1;

    const isValid = confidence >= 0.3; // Lower threshold since we're being permissive

    return {
      isValid,
      confidence,
      reason: isValid
        ? 'Transcription appears to be in Pashto'
        : 'Transcription may not be in Pashto or quality is too low'
    };
  } catch (error) {
    console.error('Error validating Pashto transcription:', error);
    return {
      isValid: true, // Default to valid if validation fails
      confidence: 0.5,
      reason: 'Validation error, assuming valid'
    };
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('audio') as File | null;
    const youtubeUrl = formData.get('youtubeUrl') as string | null;

    let audioBuffer: ArrayBuffer;
    let fileSize: number;
    let fileType: string;
    let originalSize: number | undefined;
    let compressedSize: number | undefined;

    if (youtubeUrl) {
      // Handle YouTube URL
      if (!youtubeUrl.includes('youtube.com') && !youtubeUrl.includes('youtu.be')) {
        return NextResponse.json({ error: 'Invalid YouTube URL' }, { status: 400 });
      }

      const result = await downloadAndCompressYouTubeAudio(youtubeUrl);
      if (!result) {
        return NextResponse.json({ error: 'Failed to download and compress YouTube audio' }, { status: 500 });
      }

      audioBuffer = result.audioBuffer;
      fileSize = result.compressedSize;
      fileType = 'audio/mp3';
      originalSize = result.originalSize;
      compressedSize = result.compressedSize;

    } else if (file) {
      // Handle file upload
      if (!file.type.startsWith('audio/')) {
        return NextResponse.json({ error: 'File must be an audio file' }, { status: 400 });
      }

      if (file.size > 25 * 1024 * 1024) {
        return NextResponse.json({ error: 'File size must be less than 25MB' }, { status: 400 });
      }

      audioBuffer = await file.arrayBuffer();
      fileSize = file.size;
      fileType = file.type;

    } else {
      return NextResponse.json({ error: 'No audio file or YouTube URL provided' }, { status: 400 });
    }

    // Transcribe with ElevenLabs
    const transcript = await transcribeWithElevenLabs(audioBuffer);

    if (!transcript) {
      return NextResponse.json({ error: 'Failed to transcribe audio' }, { status: 500 });
    }

    // Validate that it's Pashto
    const validation = await validatePashtoTranscription(transcript);

    if (!validation.isValid && validation.confidence < 0.2) {
      return NextResponse.json({
        error: 'Transcription does not appear to be in Pashto',
        reason: validation.reason,
        transcript: transcript
      }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      transcript: transcript,
      validation: validation,
      fileSize,
      fileType,
      ...(youtubeUrl && { originalSize, compressedSize, source: 'youtube' }),
      ...(file && { source: 'upload' })
    });

  } catch (error) {
    console.error('Transcription API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
