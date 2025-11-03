/**
 * Script to download audio from YouTube videos and upload directly to R2
 * This bypasses the Railway service and uploads directly via Cloudflare Worker
 */

const { exec } = require('child_process');
const { promisify } = require('util');
const { readFile, unlink, mkdir } = require('fs/promises');
const { join } = require('path');
const fetch = require('node-fetch');

const execAsync = promisify(exec);

// Process both videos
const videos = [
  { videoId: 'u9sU5192Th4', youtubeUrl: 'https://www.youtube.com/watch?v=u9sU5l92Th4' },
  { videoId: '935dWX6-c1E', youtubeUrl: 'https://www.youtube.com/watch?v=935dWX6-c1E&t=94s' },
];

const CLOUDFLARE_WORKER_URL = process.env.CLOUDFLARE_WORKER_URL || 'https://pashtobiblesearch.jeremy-samuels17.workers.dev';
const TEMP_DIR = join(process.cwd(), 'temp-audio');

async function downloadAudio(youtubeUrl, videoId) {
  console.log(`\n📥 Downloading audio for ${videoId}...`);
  
  try {
    // Ensure temp directory exists
    await mkdir(TEMP_DIR, { recursive: true });
    
    const outputPath = join(TEMP_DIR, `${videoId}.mp3`);
    
    // Download using yt-dlp
    const cmd = `yt-dlp --extract-audio --audio-format mp3 --output "${outputPath}" --no-warnings "${youtubeUrl}"`;
    
    console.log(`   Running: yt-dlp for ${videoId}...`);
    await execAsync(cmd, { timeout: 300000 }); // 5 minute timeout
    
    console.log(`   ✅ Download complete: ${outputPath}`);
    return outputPath;
  } catch (error) {
    console.error(`   ❌ Download failed: ${error.message}`);
    throw error;
  }
}

async function uploadToR2(audioFile, videoId) {
  console.log(`\n📤 Uploading to R2: videos/${videoId}/full.mp3...`);
  
  try {
    // Read the audio file
    const audioBuffer = await readFile(audioFile);
    const fileSizeMB = (audioBuffer.length / (1024 * 1024)).toFixed(2);
    
    console.log(`   File size: ${fileSizeMB} MB`);
    
    // Convert to base64
    const base64Data = audioBuffer.toString('base64');
    
    // Upload via Cloudflare Worker R2 upload endpoint
    const response = await fetch(`${CLOUDFLARE_WORKER_URL}/api/r2/upload`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        key: `videos/${videoId}/full.mp3`,
        data: base64Data,
      }),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`   ❌ Upload failed: ${response.status} ${errorText}`);
      throw new Error(`Upload failed: ${response.status} ${errorText}`);
    }
    
    const result = await response.json();
    console.log(`   ✅ Upload successful!`);
    console.log(`   R2 Key: videos/${videoId}/full.mp3`);
    console.log(`   File size: ${fileSizeMB} MB`);
    
    return result;
  } catch (error) {
    console.error(`   ❌ Upload failed: ${error.message}`);
    throw error;
  }
}

async function processVideo(video) {
  let audioFile = null;
  
  try {
    console.log(`\n🎵 ========== PROCESSING VIDEO: ${video.videoId} ==========`);
    
    // Step 1: Download audio
    audioFile = await downloadAudio(video.youtubeUrl, video.videoId);
    
    // Step 2: Upload to R2
    await uploadToR2(audioFile, video.videoId);
    
    // Step 3: Cleanup
    if (audioFile) {
      await unlink(audioFile).catch(() => {});
      console.log(`   🧹 Cleaned up temporary file`);
    }
    
    console.log(`\n✅ ========== SUCCESS: ${video.videoId} ==========`);
    console.log(`   Full audio available at: ${CLOUDFLARE_WORKER_URL}/api/video/${video.videoId}/audio-full`);
    
    return true;
  } catch (error) {
    console.error(`\n❌ ========== ERROR: ${video.videoId} ==========`);
    console.error(`   Error: ${error.message}`);
    
    // Cleanup on error
    if (audioFile) {
      await unlink(audioFile).catch(() => {});
    }
    
    return false;
  }
}

async function processAllVideos() {
  console.log(`\n🚀 ========== PROCESSING ${videos.length} VIDEOS ==========\n`);
  
  let successCount = 0;
  let failCount = 0;
  
  for (const video of videos) {
    const success = await processVideo(video);
    if (success) {
      successCount++;
    } else {
      failCount++;
    }
    
    // Wait between videos
    if (video !== videos[videos.length - 1]) {
      console.log(`\n⏳ Waiting 5 seconds before next video...\n`);
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }
  
  console.log(`\n✅ ========== FINAL SUMMARY ==========`);
  console.log(`   Successfully processed: ${successCount}/${videos.length}`);
  console.log(`   Failed: ${failCount}/${videos.length}`);
  console.log(`========================================\n`);
  
  // Cleanup temp directory
  try {
    await execAsync(`rm -rf "${TEMP_DIR}"`);
    console.log(`🧹 Cleaned up temporary directory`);
  } catch {}
}

processAllVideos().catch(error => {
  console.error(`\n❌ Fatal error: ${error.message}`);
  process.exit(1);
});

