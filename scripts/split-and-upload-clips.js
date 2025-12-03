#!/usr/bin/env node
/**
 * Split Audio into Clips and Upload to Cloudflare R2
 * 
 * This script:
 * 1. Takes a local audio file (the same one you uploaded to ElevenLabs)
 * 2. Fetches segment timestamps from the API
 * 3. Splits the audio using FFmpeg based on timestamps
 * 4. Uploads each clip to Cloudflare R2
 * 
 * Prerequisites:
 * - FFmpeg installed (brew install ffmpeg)
 * - Node.js installed
 * - npm install @aws-sdk/client-s3
 * 
 * Usage:
 * node scripts/split-and-upload-clips.js <video_id> <audio_file.mp3>
 * 
 * Example:
 * node scripts/split-and-upload-clips.js XB8_H29rb4k ~/Downloads/riaz_karar.mp3
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Configuration
const CLOUDFLARE_WORKER_URL = 'https://pashtobiblesearch.jeremy-samuels17.workers.dev';

// R2 credentials - set these as environment variables
const CLOUDFLARE_ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID;
const R2_ACCESS_KEY_ID = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID;
const R2_SECRET_ACCESS_KEY = process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY;
const R2_BUCKET = 'pashto-bible-audio';

async function main() {
  const args = process.argv.slice(2);
  
  if (args.length < 2) {
    console.log(`
📋 Split Audio into Clips and Upload to R2

Usage: node scripts/split-and-upload-clips.js <video_id> <audio_file>

Example:
  node scripts/split-and-upload-clips.js XB8_H29rb4k ~/Downloads/audio.mp3

Prerequisites:
  - FFmpeg installed (brew install ffmpeg)
  - Environment variables set:
    - CLOUDFLARE_ACCOUNT_ID
    - CLOUDFLARE_R2_ACCESS_KEY_ID  
    - CLOUDFLARE_R2_SECRET_ACCESS_KEY
`);
    process.exit(1);
  }

  const videoId = args[0];
  const audioFile = args[1];

  // Check audio file exists
  if (!fs.existsSync(audioFile)) {
    console.error(`❌ Audio file not found: ${audioFile}`);
    process.exit(1);
  }

  // Check FFmpeg is available
  try {
    execSync('ffmpeg -version', { stdio: 'pipe' });
  } catch {
    console.error('❌ FFmpeg not found. Install with: brew install ffmpeg');
    process.exit(1);
  }

  console.log(`🎬 Processing video: ${videoId}`);
  console.log(`🎵 Audio file: ${audioFile}`);

  // Step 1: Fetch segments from API
  console.log('\n📥 Fetching segments from API...');
  const response = await fetch(`${CLOUDFLARE_WORKER_URL}/api/videos/${videoId}`);
  
  if (!response.ok) {
    console.error(`❌ Failed to fetch video: ${response.status}`);
    process.exit(1);
  }

  const video = await response.json();
  const segments = video.segments || [];
  
  console.log(`✅ Found ${segments.length} segments`);

  if (segments.length === 0) {
    console.error('❌ No segments found. Run re-segmentation first.');
    process.exit(1);
  }

  // Step 2: Create temp directory for clips
  const tempDir = path.join('/tmp', `video-clips-${videoId}`);
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }

  // Step 3: Split audio into clips using FFmpeg
  console.log('\n✂️ Splitting audio into clips...');
  const clipFiles = [];

  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i];
    const startTime = segment.start_time || segment.startTime || 0;
    const endTime = segment.end_time || segment.endTime || startTime + 5;
    const duration = endTime - startTime;
    
    // Add small padding (0.1s) to avoid cutting words
    const paddedStart = Math.max(0, startTime - 0.1);
    const paddedDuration = duration + 0.2;
    
    const clipPath = path.join(tempDir, `clip_${String(i + 1).padStart(3, '0')}.mp3`);
    
    try {
      execSync(
        `ffmpeg -i "${audioFile}" -ss ${paddedStart} -t ${paddedDuration} ` +
        `-acodec libmp3lame -ab 128k -ac 1 -ar 44100 -y "${clipPath}"`,
        { stdio: 'pipe' }
      );
      
      clipFiles.push({
        index: i + 1,
        path: clipPath,
        startTime,
        endTime,
        duration,
        text: (segment.text || '').substring(0, 50)
      });
      
      if ((i + 1) % 20 === 0 || i === segments.length - 1) {
        console.log(`  ✅ Created ${i + 1}/${segments.length} clips`);
      }
    } catch (error) {
      console.error(`  ⚠️ Failed to create clip ${i + 1}: ${error.message}`);
    }
  }

  console.log(`\n✅ Created ${clipFiles.length} audio clips in ${tempDir}`);

  // Step 4: Upload to R2 (if credentials are set)
  if (R2_ACCESS_KEY_ID && R2_SECRET_ACCESS_KEY && CLOUDFLARE_ACCOUNT_ID) {
    console.log('\n📤 Uploading clips to Cloudflare R2...');
    
    // Dynamic import for AWS SDK
    const { S3Client, PutObjectCommand } = await import('@aws-sdk/client-s3');
    
    const s3 = new S3Client({
      region: 'auto',
      endpoint: `https://${CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: R2_ACCESS_KEY_ID,
        secretAccessKey: R2_SECRET_ACCESS_KEY,
      },
    });

    let uploaded = 0;
    const clipUrls = {};

    for (const clip of clipFiles) {
      const key = `videos/${videoId}/clips/clip_${String(clip.index).padStart(3, '0')}.mp3`;
      
      try {
        const fileContent = fs.readFileSync(clip.path);
        
        await s3.send(new PutObjectCommand({
          Bucket: R2_BUCKET,
          Key: key,
          Body: fileContent,
          ContentType: 'audio/mpeg',
        }));
        
        clipUrls[clip.index] = key;
        uploaded++;
        
        if (uploaded % 20 === 0 || uploaded === clipFiles.length) {
          console.log(`  ✅ Uploaded ${uploaded}/${clipFiles.length} clips`);
        }
      } catch (error) {
        console.error(`  ⚠️ Failed to upload clip ${clip.index}: ${error.message}`);
      }
    }

    console.log(`\n✅ Uploaded ${uploaded} clips to R2`);

    // Step 5: Update segments with audio URLs
    if (Object.keys(clipUrls).length > 0) {
      console.log('\n💾 Updating segment audio URLs in database...');
      
      // Update each segment with its audio URL
      const updatedSegments = segments.map((seg, i) => ({
        ...seg,
        audioUrl: clipUrls[i + 1] || null,
      }));

      const updateResponse = await fetch(`${CLOUDFLARE_WORKER_URL}/api/store-video`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          video_id: videoId,
          segments: updatedSegments,
        }),
      });

      if (updateResponse.ok) {
        console.log('✅ Database updated with audio URLs');
      } else {
        console.error('⚠️ Failed to update database');
      }
    }
  } else {
    console.log('\n⚠️ R2 credentials not set. Clips saved locally only.');
    console.log('To upload to R2, set these environment variables:');
    console.log('  - CLOUDFLARE_ACCOUNT_ID');
    console.log('  - CLOUDFLARE_R2_ACCESS_KEY_ID');
    console.log('  - CLOUDFLARE_R2_SECRET_ACCESS_KEY');
  }

  // Summary
  console.log('\n' + '='.repeat(50));
  console.log('📋 SUMMARY');
  console.log('='.repeat(50));
  console.log(`Video ID: ${videoId}`);
  console.log(`Segments: ${segments.length}`);
  console.log(`Clips created: ${clipFiles.length}`);
  console.log(`Clips location: ${tempDir}`);
  console.log('\nSample clips:');
  clipFiles.slice(0, 3).forEach(clip => {
    console.log(`  ${clip.index}. [${clip.startTime.toFixed(1)}s-${clip.endTime.toFixed(1)}s] ${clip.text}...`);
  });
}

main().catch(err => {
  console.error('❌ Error:', err);
  process.exit(1);
});

