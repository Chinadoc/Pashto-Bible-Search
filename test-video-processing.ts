#!/usr/bin/env node
/**
 * Test script to process a YouTube video locally
 * - Downloads video audio
 * - Transcribes with AssemblyAI
 * - Creates audio segments
 * - Uploads segments to Cloudflare R2
 * - Stores metadata in Cloudflare D1
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import { readFileSync, writeFileSync, unlinkSync } from 'fs';
import { join } from 'path';
import FormData from 'form-data';
import fetch from 'node-fetch';

const execAsync = promisify(exec);

const YOUTUBE_URL = 'https://www.youtube.com/watch?v=u9sU5l92Th4';
const VIDEO_ID = 'u9sU5l92Th4';

// API Keys
const API_KEYS = {
  assemblyai: '4c15846aff03429e99207a86450addae',
  elevenlabs: 'sk_b3f632622b08afb9a26b2fb912be9d1baa2548414f430543',
};

// Cloudflare Worker URL (use local dev server or deployed)
const CLOUDFLARE_WORKER_URL = process.env.CLOUDFLARE_WORKER_URL || 'http://localhost:8787';

console.log('🎬 Starting local video processing test...\n');
console.log(`📺 Video URL: ${YOUTUBE_URL}`);
console.log(`📋 Video ID: ${VIDEO_ID}\n`);

async function downloadVideoAudio(videoId: string): Promise<string> {
  console.log('📥 Step 1: Downloading video audio...');
  
  const outputPath = join(process.cwd(), 'temp', `${videoId}.mp3`);
  
  try {
    // Create temp directory if it doesn't exist
    await execAsync(`mkdir -p temp`);
    
    // Download audio using yt-dlp
    const cmd = `yt-dlp --extract-audio --audio-format mp3 --output "${outputPath}" "${YOUTUBE_URL}"`;
    await execAsync(cmd, { timeout: 300000 }); // 5 minute timeout
    
    console.log(`✅ Audio downloaded: ${outputPath}`);
    return outputPath;
  } catch (error: any) {
    console.error('❌ Download failed:', error.message);
    throw error;
  }
}

async function transcribeWithAssemblyAI(youtubeUrl: string): Promise<{ text: string; words: Array<{ start: number; end: number; text: string }> }> {
  console.log('\n🎤 Step 2: Transcribing with AssemblyAI...');
  
  // Start transcription
  const startResponse = await fetch('https://api.assemblyai.com/v2/transcript', {
    method: 'POST',
    headers: {
      'Authorization': API_KEYS.assemblyai,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      audio_url: youtubeUrl,
      language_code: 'ps', // Pashto
      language_detection: true,
      word_boost: ['خدای', 'عیسی', 'پیغمبر', 'کتاب', 'تورات', 'انجیل'],
    }),
  });

  if (!startResponse.ok) {
    const errorText = await startResponse.text();
    throw new Error(`AssemblyAI start error: ${startResponse.status} - ${errorText}`);
  }

  const job = await startResponse.json();
  const transcriptId = job.id;
  console.log(`   Transcription job started: ${transcriptId}`);

  // Poll for completion
  let attempt = 0;
  const maxAttempts = 120; // 10 minutes max
  
  while (attempt < maxAttempts) {
    await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds
    
    const statusResponse = await fetch(`https://api.assemblyai.com/v2/transcript/${transcriptId}`, {
      headers: { 'Authorization': API_KEYS.assemblyai },
    });

    if (!statusResponse.ok) {
      throw new Error(`AssemblyAI status error: ${statusResponse.status}`);
    }

    const status = await statusResponse.json();
    
    if (status.status === 'completed') {
      console.log('✅ Transcription completed!');
      console.log(`   Transcript preview: ${status.text.substring(0, 100)}...`);
      return {
        text: status.text,
        words: status.words || [],
      };
    } else if (status.status === 'error') {
      throw new Error(`AssemblyAI error: ${status.error}`);
    }

    attempt++;
    if (attempt % 12 === 0) {
      console.log(`   ⏳ Waiting... (${Math.floor(attempt * 5 / 60)} minutes elapsed)`);
    }
  }

  throw new Error('Transcription timeout after 10 minutes');
}

function segmentTranscript(
  words: Array<{ start: number; end: number; text: string }>
): Array<{ text: string; startTime: number; endTime: number }> {
  console.log('\n✂️ Step 3: Segmenting transcript...');
  
  const segments: Array<{ text: string; startTime: number; endTime: number }> = [];
  let currentSegment: typeof words = [];

  for (const word of words) {
    currentSegment.push(word);
    
    const endOfSentence = word.text.endsWith('.') || word.text.endsWith('؟') || word.text.endsWith('!');
    const tooManyWords = currentSegment.length >= 15;

    if ((endOfSentence && currentSegment.length >= 3) || (tooManyWords && currentSegment.length >= 10)) {
      if (currentSegment.length > 0) {
        const text = currentSegment.map(w => w.text).join(' ');
        const startTime = currentSegment[0].start / 1000;
        const endTime = currentSegment[currentSegment.length - 1].end / 1000;

        segments.push({ text, startTime, endTime });
        currentSegment = [];
      }
    }
  }

  // Add remaining words
  if (currentSegment.length > 0) {
    const text = currentSegment.map(w => w.text).join(' ');
    const startTime = currentSegment[0].start / 1000;
    const endTime = currentSegment[currentSegment.length - 1].end / 1000;
    segments.push({ text, startTime, endTime });
  }

  console.log(`✅ Created ${segments.length} segments`);
  return segments;
}

async function extractAudioSegments(
  audioFile: string,
  segments: Array<{ startTime: number; endTime: number }>,
  videoId: string
): Promise<string[]> {
  console.log('\n🎵 Step 4: Extracting audio segments...');
  
  const segmentFiles: string[] = [];
  
  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i];
    const outputPath = join(process.cwd(), 'temp', `${videoId}_segment_${i + 1}.mp3`);
    
    try {
      // Extract segment using ffmpeg
      const start = Math.floor(segment.startTime);
      const duration = Math.ceil(segment.endTime - segment.startTime);
      
      const cmd = `ffmpeg -i "${audioFile}" -ss ${start} -t ${duration} -acodec copy "${outputPath}" -y`;
      await execAsync(cmd, { timeout: 60000 });
      
      segmentFiles.push(outputPath);
      console.log(`   ✓ Segment ${i + 1}/${segments.length}: ${start}s - ${start + duration}s`);
    } catch (error: any) {
      console.error(`   ✗ Failed to extract segment ${i + 1}:`, error.message);
    }
  }

  console.log(`✅ Extracted ${segmentFiles.length} audio segments`);
  return segmentFiles;
}

async function uploadToCloudflare(segments: Array<{ text: string; startTime: number; endTime: number }>, segmentFiles: string[]): Promise<void> {
  console.log('\n☁️ Step 5: Uploading to Cloudflare...');
  
  // First, store metadata in D1 via Worker
  console.log('   Storing metadata in D1...');
  
  const metadataResponse = await fetch(`${CLOUDFLARE_WORKER_URL}/api/video/process`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      youtubeUrl: YOUTUBE_URL,
      videoId: VIDEO_ID,
      transcript: segments.map(s => s.text).join(' '),
      segments: segments,
      apiKeys: API_KEYS,
    }),
  });

  if (!metadataResponse.ok) {
    const errorText = await metadataResponse.text();
    console.error('❌ Failed to store metadata:', errorText);
    throw new Error(`Metadata storage failed: ${errorText}`);
  }

  const metadataResult = await metadataResponse.json();
  console.log('✅ Metadata stored in D1');

  // For R2 upload, we'd need to use wrangler R2 API or Cloudflare Worker
  // Since we're testing locally, let's use the Worker's R2 binding
  console.log('\n   Uploading audio clips to R2...');
  
  // Note: To upload to R2, we need to either:
  // 1. Use wrangler CLI: wrangler r2 object put videos/${VIDEO_ID}/segment_1.mp3 --file=temp/segment_1.mp3
  // 2. Or create an upload endpoint in the Worker
  
  // For now, let's show how to do it with wrangler CLI
  console.log('   📝 Note: Uploading via wrangler CLI...');
  
  for (let i = 0; i < segmentFiles.length; i++) {
    const segmentFile = segmentFiles[i];
    const r2Key = `videos/${VIDEO_ID}/segment_${i + 1}.mp3`;
    
    try {
      // Use wrangler to upload
      const cmd = `wrangler r2 object put "pashto-bible-audio/${r2Key}" --file="${segmentFile}"`;
      await execAsync(cmd);
      console.log(`   ✓ Uploaded segment ${i + 1} to R2: ${r2Key}`);
    } catch (error: any) {
      console.warn(`   ⚠ Failed to upload segment ${i + 1}:`, error.message);
      console.log(`   💡 Make sure wrangler is configured and R2 bucket exists`);
    }
  }

  console.log('✅ Upload complete!');
}

async function cleanup(files: string[]): Promise<void> {
  console.log('\n🧹 Cleaning up temporary files...');
  
  for (const file of files) {
    try {
      unlinkSync(file);
      console.log(`   ✓ Deleted ${file}`);
    } catch (error) {
      // Ignore cleanup errors
    }
  }
}

async function main() {
  try {
    const audioFile = await downloadVideoAudio(VIDEO_ID);
    const transcription = await transcribeWithAssemblyAI(YOUTUBE_URL);
    const segments = segmentTranscript(transcription.words);
    const segmentFiles = await extractAudioSegments(audioFile, segments, VIDEO_ID);
    
    await uploadToCloudflare(segments, segmentFiles);
    
    console.log('\n✅ Video processing complete!');
    console.log(`\n📊 Summary:`);
    console.log(`   Video ID: ${VIDEO_ID}`);
    console.log(`   Transcript: ${transcription.text.substring(0, 100)}...`);
    console.log(`   Segments: ${segments.length}`);
    console.log(`   Audio clips: ${segmentFiles.length}`);
    console.log(`\n🌐 View in Videos tab or check Cloudflare D1/R2`);
    
    // Cleanup
    await cleanup([audioFile, ...segmentFiles]);
    
  } catch (error: any) {
    console.error('\n❌ Processing failed:', error.message);
    process.exit(1);
  }
}

main();

