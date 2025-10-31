import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import { writeFile, unlink, readFile, stat } from 'fs/promises';
import { join } from 'path';
import FormData from 'form-data';

const execAsync = promisify(exec);
const CLOUDFLARE_WORKER_URL = process.env.NEXT_PUBLIC_CLOUDFLARE_WORKER_URL || 'https://pashtobiblesearch.jeremy-samuels17.workers.dev';

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

interface VideoProcessingRequest {
  youtubeUrl: string;
  apiKeys?: {
    elevenlabs?: string;
    assemblyai?: string;
    huggingface?: string;
    deepseek?: string;
  };
}

/**
 * Download YouTube video audio using yt-dlp
 */
async function downloadVideoAudio(youtubeUrl: string, videoId: string): Promise<string> {
  const tempDir = join(process.cwd(), 'temp');
  const outputPath = join(tempDir, `${videoId}.mp3`);
  
  try {
    await execAsync(`mkdir -p "${tempDir}"`);
    
    const cmd = `yt-dlp --extract-audio --audio-format mp3 --output "${outputPath}" "${youtubeUrl}"`;
    await execAsync(cmd, { timeout: 300000 });
    
    return outputPath;
  } catch (error: any) {
    throw new Error(`Failed to download video: ${error.message}`);
  }
}

/**
 * Transcribe audio with ElevenLabs (better Pashto support)
 */
async function transcribeWithElevenLabs(audioFile: string, apiKey: string): Promise<string> {
  const fileStats = await stat(audioFile);
  const maxSize = 25 * 1024 * 1024; // 25MB
  
  let finalAudioFile = audioFile;
  
  // Compress if needed
  if (fileStats.size > maxSize) {
    const compressedPath = audioFile.replace('.mp3', '_compressed.mp3');
    await execAsync(`ffmpeg -i "${audioFile}" -b:a 64k -y "${compressedPath}"`, { timeout: 120000 });
    finalAudioFile = compressedPath;
  }
  
  // Read file and create FormData for ElevenLabs
  const audioBuffer = await readFile(finalAudioFile);
  
  // Use form-data library for proper multipart encoding
  const formData = new FormData();
  formData.append('file', audioBuffer, {
    filename: 'audio.mp3',
    contentType: 'audio/mpeg',
  });
  formData.append('language', 'ps');
  formData.append('model_id', 'scribe_v1');
  
  const response = await fetch('https://api.elevenlabs.io/v1/speech-to-text', {
    method: 'POST',
    headers: {
      'xi-api-key': apiKey,
      ...formData.getHeaders(),
    },
    body: formData as any,
  });
  
  if (finalAudioFile !== audioFile) {
    await unlink(finalAudioFile);
  }
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`ElevenLabs error: ${response.status} - ${errorText}`);
  }
  
  const result = await response.json();
  return result.text || '';
}

/**
 * Get video duration using ffprobe
 */
async function getVideoDuration(audioFile: string): Promise<number> {
  try {
    const { stdout } = await execAsync(
      `ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${audioFile}"`,
      { timeout: 30000 }
    );
    return parseFloat(stdout.trim()) || 0;
  } catch (error) {
    console.warn('Failed to get video duration, using estimated:', error);
    return 0;
  }
}

/**
 * Segment transcript by sentences with proper duration distribution
 * Ensures segments cover the full video duration
 */
async function segmentTranscriptBySentences(
  text: string,
  videoDuration: number
): Promise<Array<{ text: string; startTime: number; endTime: number }>> {
  const segments: Array<{ text: string; startTime: number; endTime: number }> = [];
  const sentences = text.split(/[.!?؟]+\s+/).filter(s => s.trim());
  
  if (sentences.length === 0) return segments;
  
  // If we have video duration, distribute time proportionally
  if (videoDuration > 0) {
    const totalWords = sentences.reduce((sum, s) => sum + s.split(/\s+/).length, 0);
    let currentTime = 0;
    
    // First pass: distribute proportionally
    for (const sentence of sentences) {
      if (!sentence.trim()) continue;
      
      const wordCount = sentence.split(/\s+/).length;
      const proportion = totalWords > 0 ? wordCount / totalWords : 1 / sentences.length;
      const duration = Math.max(2, videoDuration * proportion);
      
      segments.push({
        text: sentence.trim(),
        startTime: Math.round(currentTime * 10) / 10,
        endTime: Math.round((currentTime + duration) * 10) / 10,
      });
      
      currentTime += duration;
    }
    
    // Normalize: ensure segments cover full video duration
    if (segments.length > 0) {
      const lastEndTime = segments[segments.length - 1].endTime;
      const actualDuration = lastEndTime;
      
      // If segments don't cover full duration, scale them
      if (actualDuration < videoDuration - 1) {
        const scaleFactor = videoDuration / actualDuration;
        let normalizedTime = 0;
        
        for (let i = 0; i < segments.length; i++) {
          const originalDuration = segments[i].endTime - segments[i].startTime;
          const scaledDuration = originalDuration * scaleFactor;
          
          segments[i].startTime = Math.round(normalizedTime * 10) / 10;
          segments[i].endTime = Math.round((normalizedTime + scaledDuration) * 10) / 10;
          normalizedTime += scaledDuration;
        }
      }
      
      // Ensure last segment ends exactly at video duration
      segments[segments.length - 1].endTime = Math.round(videoDuration * 10) / 10;
      
      // If segments exceed duration, compress them
      if (segments[segments.length - 1].endTime > videoDuration) {
        const compressionFactor = videoDuration / segments[segments.length - 1].endTime;
        let compressedTime = 0;
        
        for (let i = 0; i < segments.length; i++) {
          const originalDuration = segments[i].endTime - segments[i].startTime;
          const compressedDuration = originalDuration * compressionFactor;
          
          segments[i].startTime = Math.round(compressedTime * 10) / 10;
          segments[i].endTime = Math.round((compressedTime + compressedDuration) * 10) / 10;
          compressedTime += compressedDuration;
        }
        
        // Ensure last segment ends at video duration
        segments[segments.length - 1].endTime = Math.round(videoDuration * 10) / 10;
      }
    }
  } else {
    // Fallback to estimated duration
    let currentTime = 0;
    for (const sentence of sentences) {
      if (!sentence.trim()) continue;
      
      const wordCount = sentence.split(/\s+/).length;
      const estimatedDuration = Math.max(3, Math.min(15, wordCount * 0.4));
      
      segments.push({
        text: sentence.trim(),
        startTime: currentTime,
        endTime: currentTime + estimatedDuration,
      });
      
      currentTime += estimatedDuration;
    }
  }
  
  return segments;
}

/**
 * Extract audio segments using ffmpeg
 */
async function extractAudioSegments(
  audioFile: string,
  segments: Array<{ startTime: number; endTime: number }>,
  videoId: string
): Promise<string[]> {
  const tempDir = join(process.cwd(), 'temp');
  const segmentFiles: string[] = [];
  
  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i];
    const outputPath = join(tempDir, `${videoId}_segment_${i + 1}.mp3`);
    
    try {
      const start = Math.floor(segment.startTime);
      const duration = Math.floor(segment.endTime - segment.startTime);
      
      await execAsync(
        `ffmpeg -i "${audioFile}" -ss ${start} -t ${duration} -acodec copy "${outputPath}" -y`,
        { timeout: 60000 }
      );
      
      segmentFiles.push(outputPath);
    } catch (error) {
      console.warn(`Failed to extract segment ${i + 1}:`, error);
    }
  }
  
  return segmentFiles;
}

/**
 * Upload audio segments to Cloudflare R2
 */
async function uploadToR2(segmentFiles: string[], videoId: string): Promise<void> {
  for (let i = 0; i < segmentFiles.length; i++) {
    const segmentFile = segmentFiles[i];
    const r2Key = `videos/${videoId}/segment_${i + 1}.mp3`;
    
    try {
      await execAsync(
        `wrangler r2 object put "pashto-bible-audio/${r2Key}" --file "${segmentFile}"`,
        { timeout: 60000 }
      );
    } catch (error) {
      console.warn(`Failed to upload segment ${i + 1}:`, error);
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: VideoProcessingRequest = await request.json();
    const { youtubeUrl, apiKeys } = body;

    if (!youtubeUrl) {
      return NextResponse.json(
        { error: 'YouTube URL is required' },
        { status: 400 }
      );
    }

    // Check if processing service URL is configured
    const processingServiceUrl = process.env.PROCESSING_SERVICE_URL;
    
    if (processingServiceUrl) {
      // Use external processing service (Railway/Render/etc.)
      console.log(`🎬 Forwarding to processing service: ${processingServiceUrl}`);
      
      const response = await fetch(`${processingServiceUrl}/process-video`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ youtubeUrl, apiKeys }),
        signal: AbortSignal.timeout(600000), // 10 minute timeout
      });

      if (!response.ok) {
        const errorText = await response.text();
        return NextResponse.json(
          { error: 'Processing service error', details: errorText },
          { status: response.status }
        );
      }

      const result = await response.json();
      return NextResponse.json(result);
    } else {
      // Fallback to local processing (for development)
      console.log('⚠️ PROCESSING_SERVICE_URL not set, using local processing');
      console.log('⚠️ This will only work if yt-dlp and ffmpeg are available locally');
      
      return NextResponse.json(
        { 
          error: 'Processing service not configured',
          message: 'Please set PROCESSING_SERVICE_URL environment variable to your Railway/Render service URL',
          instructions: 'See video-processor-service/RAILWAY_SETUP.md for setup instructions'
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Video processing error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}
