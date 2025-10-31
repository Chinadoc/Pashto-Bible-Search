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
 * Extract audio segments using ffmpeg with precise timing and padding
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
      // Use precise decimal times (not Math.floor)
      // Add small padding before start to avoid clipping words
      const paddingStart = 0.15; // 150ms before
      const paddingEnd = 0.25;   // 250ms after
      
      const start = Math.max(0, segment.startTime - paddingStart);
      const end = segment.endTime + paddingEnd;
      const duration = end - start;
      
      // Use precise decimal format for ffmpeg
      // Re-encode instead of copy to get precise cuts (not just keyframe cuts)
      const ffmpegCmd = `ffmpeg -ss ${start.toFixed(3)} -i "${audioFile}" -t ${duration.toFixed(3)} -c:a libmp3lame -ar 44100 -ac 1 -q:a 4 -af aresample=async=1:first_pts=0 "${outputPath}" -y`;
      
      await execAsync(ffmpegCmd, { timeout: 60000 });
      
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
  const startTime = Date.now();
  console.log(`\n🎬 ========== VIDEO PROCESSING REQUEST STARTED ==========`);
  console.log(`Timestamp: ${new Date().toISOString()}`);
  
  try {
    const body: VideoProcessingRequest = await request.json();
    const { youtubeUrl, apiKeys } = body;

    console.log(`📥 Received request:`);
    console.log(`   YouTube URL: ${youtubeUrl}`);
    console.log(`   Has API keys: ${!!apiKeys}`);
    console.log(`   ElevenLabs key: ${apiKeys?.elevenlabs ? '✅ Set' : '❌ Missing'}`);

    if (!youtubeUrl) {
      console.error(`❌ Missing YouTube URL`);
      return NextResponse.json(
        { error: 'YouTube URL is required' },
        { status: 400 }
      );
    }

    // Extract video ID for logging
    const videoIdMatch = youtubeUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/);
    const videoId = videoIdMatch ? videoIdMatch[1] : 'unknown';
    console.log(`🎯 Extracted video ID: ${videoId}`);

    // Check if processing service URL is configured
    const processingServiceUrl = process.env.PROCESSING_SERVICE_URL;
    
    console.log(`\n🔍 Checking processing service configuration:`);
    console.log(`   PROCESSING_SERVICE_URL: ${processingServiceUrl ? '✅ Set' : '❌ Not set'}`);
    
    if (processingServiceUrl) {
      // Use external processing service (Railway/Render/etc.)
      console.log(`\n📡 Forwarding to processing service:`);
      console.log(`   Service URL: ${processingServiceUrl}`);
      console.log(`   Endpoint: ${processingServiceUrl}/process-video`);
      
      const requestBody = { youtubeUrl, apiKeys };
      console.log(`   Request body keys: ${Object.keys(requestBody).join(', ')}`);
      
      try {
        const requestStartTime = Date.now();
        const response = await fetch(`${processingServiceUrl}/process-video`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'User-Agent': 'Pashto-Bible-Search/1.0'
          },
          body: JSON.stringify(requestBody),
          signal: AbortSignal.timeout(600000), // 10 minute timeout
        });

        const requestDuration = ((Date.now() - requestStartTime) / 1000).toFixed(2);
        console.log(`\n📨 Processing service response:`);
        console.log(`   Status: ${response.status} ${response.statusText}`);
        console.log(`   Duration: ${requestDuration}s`);
        console.log(`   Headers:`, Object.fromEntries(response.headers.entries()));

        if (!response.ok) {
          const errorText = await response.text();
          console.error(`\n❌ Processing service error:`);
          console.error(`   Status: ${response.status}`);
          console.error(`   Error text: ${errorText}`);
          console.error(`   This usually means:`);
          console.error(`   - The service is not running`);
          console.error(`   - The service encountered an error`);
          console.error(`   - Network connectivity issue`);
          
          return NextResponse.json(
            { 
              error: 'Processing service error', 
              details: errorText,
              status: response.status,
              serviceUrl: processingServiceUrl
            },
            { status: response.status }
          );
        }

        const result = await response.json();
        const totalDuration = ((Date.now() - startTime) / 1000).toFixed(2);
        
        console.log(`\n✅ ========== VIDEO PROCESSING SUCCESS ==========`);
        console.log(`   Total duration: ${totalDuration}s`);
        console.log(`   Video ID: ${result.videoId || videoId}`);
        console.log(`   Segments created: ${result.segments?.length || 0}`);
        console.log(`   Transcript length: ${result.transcript?.length || 0} chars`);
        console.log(`========================================\n`);
        
        return NextResponse.json(result);
      } catch (fetchError: any) {
        const totalDuration = ((Date.now() - startTime) / 1000).toFixed(2);
        console.error(`\n❌ ========== FETCH ERROR ==========`);
        console.error(`   Duration: ${totalDuration}s`);
        console.error(`   Error: ${fetchError.message}`);
        console.error(`   Type: ${fetchError.name}`);
        console.error(`   Stack: ${fetchError.stack}`);
        console.error(`==================================\n`);
        
        return NextResponse.json(
          { 
            error: 'Failed to connect to processing service',
            details: fetchError.message,
            type: fetchError.name,
            serviceUrl: processingServiceUrl
          },
          { status: 500 }
        );
      }
    } else {
      // Fallback to local processing (for development)
      console.warn(`\n⚠️ ========== PROCESSING SERVICE NOT CONFIGURED ==========`);
      console.warn(`   PROCESSING_SERVICE_URL environment variable is not set`);
      console.warn(`   This endpoint requires an external processing service (Railway/Render)`);
      console.warn(`   See video-processor-service/RAILWAY_SETUP.md for setup instructions`);
      console.warn(`==========================================================\n`);
      
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
    const totalDuration = ((Date.now() - startTime) / 1000).toFixed(2);
    console.error(`\n❌ ========== INTERNAL SERVER ERROR ==========`);
    console.error(`   Duration: ${totalDuration}s`);
    console.error(`   Error:`, error);
    console.error(`   Message: ${error instanceof Error ? error.message : String(error)}`);
    console.error(`   Stack: ${error instanceof Error ? error.stack : 'N/A'}`);
    console.error(`==========================================\n`);
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}
