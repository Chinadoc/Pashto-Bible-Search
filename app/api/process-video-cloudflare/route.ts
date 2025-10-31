import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import { writeFile, unlink, readFile, stat } from 'fs/promises';
import { join } from 'path';
import FormData from 'form-data';

const execAsync = promisify(exec);
const CLOUDFLARE_WORKER_URL = process.env.NEXT_PUBLIC_CLOUDFLARE_WORKER_URL || 'https://pashtobiblesearch.jeremy-samuels17.workers.dev';

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
 * Segment transcript by sentences
 */
function segmentTranscriptBySentences(text: string): Array<{ text: string; startTime: number; endTime: number }> {
  const segments: Array<{ text: string; startTime: number; endTime: number }> = [];
  const sentences = text.split(/[.!?؟]+\s+/).filter(s => s.trim());
  
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
  let audioFile: string | null = null;
  let segmentFiles: string[] = [];
  
  try {
    const body: VideoProcessingRequest = await request.json();
    const { youtubeUrl, apiKeys } = body;

    if (!youtubeUrl) {
      return NextResponse.json(
        { error: 'YouTube URL is required' },
        { status: 400 }
      );
    }

    // Extract video ID
    const videoIdMatch = youtubeUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
    if (!videoIdMatch) {
      return NextResponse.json(
        { error: 'Invalid YouTube URL' },
        { status: 400 }
      );
    }
    const videoId = videoIdMatch[1];

    console.log(`🎬 Processing video ${videoId} with ElevenLabs...`);

    const elevenlabsKey = apiKeys?.elevenlabs || process.env.ELEVENLABS_API_KEY || "sk_b3f632622b08afb9a26b2fb912be9d1baa2548414f430543";

    if (!elevenlabsKey) {
      return NextResponse.json(
        { error: 'ElevenLabs API key is required' },
        { status: 400 }
      );
    }

    // Step 1: Download video audio
    console.log('📥 Downloading video audio...');
    audioFile = await downloadVideoAudio(youtubeUrl, videoId);
    console.log('✅ Audio downloaded');

    // Step 2: Transcribe with ElevenLabs
    console.log('🎤 Transcribing with ElevenLabs...');
    const transcript = await transcribeWithElevenLabs(audioFile, elevenlabsKey);
    console.log('✅ Transcription completed');

    // Step 3: Segment transcript
    console.log('✂️ Segmenting transcript...');
    const segments = segmentTranscriptBySentences(transcript);
    console.log(`✅ Created ${segments.length} segments`);

    // Step 4: Extract audio segments
    console.log('🎵 Extracting audio segments...');
    segmentFiles = await extractAudioSegments(audioFile, segments, videoId);
    console.log(`✅ Extracted ${segmentFiles.length} audio segments`);

    // Step 5: Upload to R2
    console.log('☁️ Uploading to Cloudflare R2...');
    await uploadToR2(segmentFiles, videoId);
    console.log('✅ Uploaded to R2');

    // Step 6: Store metadata in D1
    console.log('💾 Storing metadata in D1...');
    const storeResponse = await fetch(`${CLOUDFLARE_WORKER_URL}/api/video/process`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        youtubeUrl,
        videoId,
        transcript,
        segments,
        transcription_service: 'elevenlabs',
        apiKeys: { elevenlabs: elevenlabsKey },
      }),
    });

    if (!storeResponse.ok) {
      const errorText = await storeResponse.text();
      console.error('Failed to store in D1:', errorText);
      // Continue anyway - R2 uploads succeeded
    } else {
      console.log('✅ Metadata stored in D1');
    }

    // Cleanup
    if (audioFile) {
      await unlink(audioFile).catch(() => {});
    }
    for (const file of segmentFiles) {
      await unlink(file).catch(() => {});
    }

    return NextResponse.json({
      success: true,
      videoId,
      transcript,
      segments,
      audioClips: segments.map((segment, index) => ({
        segment_number: index + 1,
        text: segment.text,
        start_time: segment.startTime,
        end_time: segment.endTime,
        duration: segment.endTime - segment.startTime,
        r2_key: `videos/${videoId}/segment_${index + 1}.mp3`,
      })),
      r2Keys: segments.map((_, index) => `videos/${videoId}/segment_${index + 1}.mp3`),
      message: `✅ Video processed successfully! ${segments.length} segments created.`,
    });

  } catch (error) {
    console.error('Video processing error:', error);
    
    // Cleanup on error
    if (audioFile) {
      await unlink(audioFile).catch(() => {});
    }
    for (const file of segmentFiles) {
      await unlink(file).catch(() => {});
    }
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}
