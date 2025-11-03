/**
 * Script to upload full audio files for existing videos that don't have them
 * This downloads the video audio and uploads just the full audio file to R2
 */

const videoId = process.argv[2];
const youtubeUrl = process.argv[3] || `https://www.youtube.com/watch?v=${videoId}`;

const CLOUDFLARE_WORKER_URL = process.env.CLOUDFLARE_WORKER_URL || 'https://pashtobiblesearch.jeremy-samuels17.workers.dev';
const VIDEO_PROCESSOR_SERVICE_URL = process.env.VIDEO_PROCESSOR_SERVICE_URL || 'http://localhost:3001';

async function uploadFullAudio() {
  if (!videoId && !youtubeUrl.includes('watch?v=')) {
    console.error('❌ Please provide video ID or YouTube URL');
    console.error('Usage: node scripts/upload-full-audio-for-existing-videos.js <videoId> [youtubeUrl]');
    process.exit(1);
  }

  const extractedVideoId = videoId || youtubeUrl.match(/[?&]v=([^&]+)/)?.[1];
  
  if (!extractedVideoId) {
    console.error('❌ Could not extract video ID from URL');
    process.exit(1);
  }

  console.log(`\n🎵 Uploading full audio for video:`);
  console.log(`   Video ID: ${extractedVideoId}`);
  console.log(`   YouTube URL: ${youtubeUrl}`);
  console.log(`   Processor Service: ${VIDEO_PROCESSOR_SERVICE_URL}`);
  console.log(`   Cloudflare Worker: ${CLOUDFLARE_WORKER_URL}`);
  console.log(`\n📡 Sending request to upload full audio...\n`);

  try {
    const response = await fetch(`${VIDEO_PROCESSOR_SERVICE_URL}/upload-full-audio`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        videoId: extractedVideoId,
        youtubeUrl: youtubeUrl,
      }),
    });

    const result = await response.json();

    if (response.ok && result.success) {
      console.log(`\n✅ Full audio uploaded successfully!`);
      console.log(`   Video ID: ${result.videoId}`);
      console.log(`   R2 Key: ${result.r2Key}`);
      console.log(`   File Size: ${result.fileSizeMB} MB`);
      console.log(`\n🌐 Full audio should now be available at:`);
      console.log(`   ${CLOUDFLARE_WORKER_URL}/api/video/${extractedVideoId}/audio-full`);
    } else {
      console.error(`\n❌ Upload failed:`);
      console.error(`   Status: ${response.status}`);
      console.error(`   Error: ${result.error || 'Unknown error'}`);
      console.error(`   Details: ${result.details || 'No details provided'}`);
      process.exit(1);
    }
  } catch (error) {
    console.error(`\n❌ Request failed:`, error.message);
    process.exit(1);
  }
}

uploadFullAudio();

