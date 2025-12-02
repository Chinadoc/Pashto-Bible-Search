#!/usr/bin/env node
/**
 * Local YouTube Video Processor
 * 
 * Downloads YouTube audio locally (bypassing bot detection) and uploads to Cloudflare for transcription.
 * 
 * Usage:
 *   node scripts/process-local-video.js "https://www.youtube.com/watch?v=VIDEO_ID"
 * 
 * Requirements:
 *   - yt-dlp installed: brew install yt-dlp
 *   - ffmpeg installed: brew install ffmpeg
 *   - Node.js installed
 *   - Environment variables in .env.local:
 *     - CLOUDFLARE_ACCOUNT_ID
 *     - CLOUDFLARE_R2_ACCESS_KEY_ID  
 *     - CLOUDFLARE_R2_SECRET_ACCESS_KEY
 *     - CLOUDFLARE_WORKER_URL (optional, defaults to production)
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

// Load environment variables
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });

const CLOUDFLARE_ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID || '3ac1a6fafce90adf6b1c8f1280dfc94d';
const CLOUDFLARE_R2_ACCESS_KEY_ID = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID;
const CLOUDFLARE_R2_SECRET_ACCESS_KEY = process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY;
const CLOUDFLARE_WORKER_URL = process.env.CLOUDFLARE_WORKER_URL || 'https://pashtobiblesearch.jeremy-samuels17.workers.dev';
const R2_BUCKET = 'pashto-bible-audio';

/**
 * Extract video ID from YouTube URL
 */
function extractVideoId(url) {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/shorts\/([^&\n?#]+)/,
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

/**
 * Download audio from YouTube using yt-dlp
 */
function downloadAudio(youtubeUrl, videoId, outputDir) {
  const outputPath = path.join(outputDir, `${videoId}.mp3`);
  
  console.log('📥 Downloading audio with yt-dlp...');
  
  try {
    execSync(
      `yt-dlp -x --audio-format mp3 --audio-quality 128K -o "${outputPath.replace('.mp3', '.%(ext)s')}" "${youtubeUrl}"`,
      { stdio: 'inherit' }
    );
    
    // Find the actual output file (might have different extension before conversion)
    const files = fs.readdirSync(outputDir);
    const audioFile = files.find(f => f.startsWith(videoId) && (f.endsWith('.mp3') || f.endsWith('.m4a') || f.endsWith('.webm')));
    
    if (audioFile) {
      const fullPath = path.join(outputDir, audioFile);
      const stats = fs.statSync(fullPath);
      console.log(`✅ Downloaded: ${audioFile} (${(stats.size / 1024 / 1024).toFixed(2)}MB)`);
      return fullPath;
    }
  } catch (error) {
    console.error('❌ Download failed:', error.message);
  }
  
  return null;
}

/**
 * Upload file to Cloudflare R2 using AWS SDK v4 signing
 */
async function uploadToR2(filePath, r2Key) {
  const AWS = require('@aws-sdk/client-s3');
  
  const s3Client = new AWS.S3Client({
    region: 'auto',
    endpoint: `https://${CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: CLOUDFLARE_R2_ACCESS_KEY_ID,
      secretAccessKey: CLOUDFLARE_R2_SECRET_ACCESS_KEY,
    },
  });
  
  const fileContent = fs.readFileSync(filePath);
  
  console.log(`📤 Uploading to R2: ${r2Key}...`);
  
  const command = new AWS.PutObjectCommand({
    Bucket: R2_BUCKET,
    Key: r2Key,
    Body: fileContent,
    ContentType: 'audio/mpeg',
  });
  
  await s3Client.send(command);
  console.log(`✅ Uploaded to R2: ${r2Key}`);
  
  return r2Key;
}

/**
 * Trigger transcription via Cloudflare Worker
 */
async function transcribe(videoId, r2Key, youtubeUrl, title) {
  console.log('🎙️ Triggering transcription...');
  
  const response = await fetch(`${CLOUDFLARE_WORKER_URL}/api/transcribe-r2-audio`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      video_id: videoId,
      r2_key: r2Key,
      youtube_url: youtubeUrl,
      title: title || `Video ${videoId}`,
    }),
  });
  
  const result = await response.json();
  
  if (result.success) {
    console.log('✅ Transcription complete!');
    console.log(`   Words: ${result.totalWords}`);
    console.log(`   Segments: ${result.totalSegments}`);
    console.log(`   Duration: ${result.duration?.toFixed(1)}s`);
    return result;
  } else {
    console.error('❌ Transcription failed:', result.error);
    return null;
  }
}

/**
 * Get video metadata
 */
function getVideoMetadata(youtubeUrl) {
  try {
    const output = execSync(
      `yt-dlp --dump-json --no-download "${youtubeUrl}"`,
      { encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 }
    );
    return JSON.parse(output);
  } catch {
    return null;
  }
}

/**
 * Main processing function
 */
async function processVideo(youtubeUrl) {
  console.log('\n🎬 Processing YouTube Video\n');
  console.log(`URL: ${youtubeUrl}\n`);
  
  // Extract video ID
  const videoId = extractVideoId(youtubeUrl);
  if (!videoId) {
    console.error('❌ Invalid YouTube URL');
    process.exit(1);
  }
  console.log(`Video ID: ${videoId}`);
  
  // Get metadata
  console.log('\n📋 Getting video metadata...');
  const metadata = getVideoMetadata(youtubeUrl);
  const title = metadata?.title || `Video ${videoId}`;
  console.log(`Title: ${title}`);
  console.log(`Duration: ${metadata?.duration || 'unknown'}s`);
  
  // Create temp directory
  const tempDir = path.join(__dirname, '..', 'temp_audio');
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }
  
  // Download audio
  console.log('\n--- Step 1: Download Audio ---');
  let audioFile = path.join(tempDir, `${videoId}.mp3`);
  
  if (fs.existsSync(audioFile)) {
    console.log(`✅ Audio file already exists: ${audioFile}`);
  } else {
    audioFile = downloadAudio(youtubeUrl, videoId, tempDir);
    if (!audioFile) {
      console.error('❌ Failed to download audio');
      process.exit(1);
    }
  }
  
  // Upload to R2
  console.log('\n--- Step 2: Upload to Cloudflare R2 ---');
  const r2Key = `videos/${videoId}/audio.mp3`;
  
  if (!CLOUDFLARE_R2_ACCESS_KEY_ID || !CLOUDFLARE_R2_SECRET_ACCESS_KEY) {
    console.error('❌ Missing R2 credentials. Set CLOUDFLARE_R2_ACCESS_KEY_ID and CLOUDFLARE_R2_SECRET_ACCESS_KEY in .env.local');
    process.exit(1);
  }
  
  await uploadToR2(audioFile, r2Key);
  
  // Transcribe
  console.log('\n--- Step 3: Transcribe with ElevenLabs ---');
  const result = await transcribe(videoId, r2Key, youtubeUrl, title);
  
  if (result) {
    console.log('\n✅ Video processed successfully!');
    console.log(`\nView at: https://pashto-bible-search.vercel.app/videos`);
    
    // Show sample of transcript
    if (result.transcript) {
      console.log('\n📝 Transcript preview:');
      console.log(result.transcript.substring(0, 500) + '...');
    }
  }
  
  // Cleanup
  // console.log('\n🧹 Cleaning up temp files...');
  // fs.unlinkSync(audioFile);
  
  return result;
}

// Run if called directly
if (require.main === module) {
  const url = process.argv[2];
  
  if (!url) {
    console.log(`
📹 Local YouTube Video Processor

Usage:
  node scripts/process-local-video.js "https://www.youtube.com/watch?v=VIDEO_ID"

This script:
1. Downloads audio using yt-dlp (runs locally, bypasses bot detection)
2. Uploads to Cloudflare R2 storage
3. Transcribes with ElevenLabs Scribe v2
4. Stores results in D1 database

Requirements:
  brew install yt-dlp ffmpeg
  
Environment variables needed in .env.local:
  CLOUDFLARE_R2_ACCESS_KEY_ID=xxx
  CLOUDFLARE_R2_SECRET_ACCESS_KEY=xxx
`);
    process.exit(0);
  }
  
  processVideo(url).catch(console.error);
}

module.exports = { processVideo, extractVideoId, downloadAudio };

