/**
 * Script to re-extract and upload video audio segments to R2
 * This script downloads the video, extracts segments based on D1 metadata, and uploads to R2
 * 
 * Usage: node scripts/re-upload-video-audio.js <videoId>
 * Example: node scripts/re-upload-video-audio.js u9sU5l92Th4
 */

const { exec } = require('child_process');
const { promisify } = require('util');
const { readFile, writeFile, unlink, stat, mkdir } = require('fs/promises');
const { join } = require('path');
const execAsync = promisify(exec);

const CLOUDFLARE_WORKER_URL = process.env.NEXT_PUBLIC_CLOUDFLARE_WORKER_URL || 'https://pashtobiblesearch.jeremy-samuels17.workers.dev';

async function getVideoMetadata(videoId) {
  console.log(`\n📡 Fetching video metadata for ${videoId}...`);
  
  const response = await fetch(`${CLOUDFLARE_WORKER_URL}/api/video/list`);
  const data = await response.json();
  
  const video = data.videos?.find(v => v.video_id === videoId);
  
  if (!video) {
    throw new Error(`Video ${videoId} not found in database`);
  }
  
  console.log(`✅ Found video:`);
  console.log(`   YouTube URL: ${video.youtube_url}`);
  console.log(`   Segments: ${video.segments?.length || 0}`);
  
  return video;
}

async function downloadVideoAudio(youtubeUrl, videoId) {
  console.log(`\n📥 Downloading video audio...`);
  
  const tempDir = join(process.cwd(), 'temp');
  await mkdir(tempDir, { recursive: true });
  
  const outputPath = join(tempDir, `${videoId}.mp3`);
  
  try {
    const cmd = `yt-dlp --extract-audio --audio-format mp3 --output "${outputPath}" "${youtubeUrl}"`;
    await execAsync(cmd, { timeout: 300000 });
    
    const stats = await stat(outputPath);
    console.log(`✅ Audio downloaded: ${(stats.size / 1024 / 1024).toFixed(2)} MB`);
    
    return outputPath;
  } catch (error) {
    throw new Error(`Failed to download video: ${error.message}`);
  }
}

async function extractAudioSegments(audioFile, segments, videoId) {
  console.log(`\n✂️ Extracting ${segments.length} audio segments...`);
  
  const tempDir = join(process.cwd(), 'temp');
  const segmentFiles = [];
  
  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i];
    const outputPath = join(tempDir, `${videoId}_segment_${i + 1}.mp3`);
    
    try {
      const start = Math.floor(segment.startTime);
      const duration = Math.ceil(segment.endTime - segment.startTime);
      
      await execAsync(
        `ffmpeg -i "${audioFile}" -ss ${start} -t ${duration} -acodec copy "${outputPath}" -y`,
        { timeout: 60000 }
      );
      
      segmentFiles.push(outputPath);
      
      if ((i + 1) % 10 === 0) {
        console.log(`   ✅ Extracted ${i + 1}/${segments.length} segments`);
      }
    } catch (error) {
      console.warn(`   ⚠️ Failed to extract segment ${i + 1}: ${error.message}`);
    }
  }
  
  console.log(`✅ Extracted ${segmentFiles.length} segments`);
  return segmentFiles;
}

async function uploadToR2(segmentFiles, videoId) {
  console.log(`\n☁️ Uploading ${segmentFiles.length} segments to R2...`);
  
  const r2Keys = [];
  let successCount = 0;
  let failCount = 0;
  
  for (let i = 0; i < segmentFiles.length; i++) {
    const segmentFile = segmentFiles[i];
    const r2Key = `videos/${videoId}/segment_${i + 1}.mp3`;
    
    try {
      // Read file as buffer
      const fileBuffer = await readFile(segmentFile);
      
      // Upload to R2 via Cloudflare Worker
      const uploadResponse = await fetch(`${CLOUDFLARE_WORKER_URL}/api/r2/upload`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          key: r2Key,
          data: fileBuffer.toString('base64'),
        }),
      });
      
      if (uploadResponse.ok) {
        r2Keys.push(r2Key);
        successCount++;
        
        if (successCount % 10 === 0) {
          console.log(`   ✅ Uploaded ${successCount}/${segmentFiles.length} segments`);
        }
      } else {
        const errorText = await uploadResponse.text();
        console.warn(`   ❌ Failed to upload segment ${i + 1}: ${uploadResponse.status} - ${errorText}`);
        failCount++;
      }
    } catch (error) {
      console.warn(`   ❌ Failed to upload segment ${i + 1}: ${error.message}`);
      failCount++;
    }
  }
  
  console.log(`\n📊 Upload Summary:`);
  console.log(`   ✅ Successful: ${successCount}`);
  console.log(`   ❌ Failed: ${failCount}`);
  console.log(`   📁 Total: ${segmentFiles.length}`);
  
  return r2Keys;
}

async function cleanup(files) {
  console.log(`\n🧹 Cleaning up temporary files...`);
  
  for (const file of files) {
    try {
      await unlink(file);
    } catch (error) {
      // Ignore cleanup errors
    }
  }
  
  console.log(`✅ Cleanup complete`);
}

async function main() {
  const videoId = process.argv[2];
  
  if (!videoId) {
    console.error('Usage: node scripts/re-upload-video-audio.js <videoId>');
    console.error('Example: node scripts/re-upload-video-audio.js u9sU5l92Th4');
    process.exit(1);
  }
  
  let audioFile = null;
  let segmentFiles = [];
  
  try {
    // Step 1: Get video metadata
    const video = await getVideoMetadata(videoId);
    
    if (!video.segments || video.segments.length === 0) {
      throw new Error('No segments found in video metadata');
    }
    
    // Step 2: Download video audio
    audioFile = await downloadVideoAudio(video.youtube_url, videoId);
    
    // Step 3: Extract audio segments
    segmentFiles = await extractAudioSegments(audioFile, video.segments, videoId);
    
    if (segmentFiles.length === 0) {
      throw new Error('No segments extracted');
    }
    
    // Step 4: Upload to R2
    const r2Keys = await uploadToR2(segmentFiles, videoId);
    
    if (r2Keys.length === 0) {
      throw new Error('No segments uploaded successfully');
    }
    
    console.log(`\n✅ Successfully uploaded ${r2Keys.length} segments to R2!`);
    console.log(`\n📁 Files are stored at:`);
    console.log(`   videos/${videoId}/segment_1.mp3 through segment_${r2Keys.length}.mp3`);
    
  } catch (error) {
    console.error(`\n❌ Error: ${error.message}`);
    process.exit(1);
  } finally {
    // Cleanup
    const filesToClean = audioFile ? [audioFile, ...segmentFiles] : segmentFiles;
    await cleanup(filesToClean);
  }
}

main().catch(console.error);

