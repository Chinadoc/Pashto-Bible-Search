/**
 * Script to upload full audio files for existing videos that don't have them
 * This downloads the video audio and uploads just the full audio file to R2
 */

// Process multiple videos
const videos = [
  { videoId: 'u9sU5192Th4', youtubeUrl: 'https://www.youtube.com/watch?v=u9sU5l92Th4' },
  { videoId: '935dWX6-c1E', youtubeUrl: 'https://www.youtube.com/watch?v=935dWX6-c1E&t=94s' },
];

// Try Vercel API first, fallback to Railway directly
const API_URL = process.env.NEXT_PUBLIC_URL || 'https://pashto-bible-search.vercel.app';
const RAILWAY_URL = process.env.VIDEO_PROCESSOR_SERVICE_URL || process.env.PROCESSING_SERVICE_URL || 'https://pashto-video-processor-production.up.railway.app';
const CLOUDFLARE_WORKER_URL = process.env.CLOUDFLARE_WORKER_URL || 'https://pashtobiblesearch.jeremy-samuels17.workers.dev';

async function uploadFullAudioForVideo(videoId, youtubeUrl) {
  console.log(`\n🎵 Processing video: ${videoId}`);
  console.log(`   YouTube URL: ${youtubeUrl}`);
  console.log(`   Cloudflare Worker: ${CLOUDFLARE_WORKER_URL}`);
  console.log(`\n📡 Sending request to upload full audio...\n`);

  // Try Vercel API first, fallback to Railway directly
  let serviceUrl = `${API_URL}/api/upload-full-audio`;
  let useRailwayDirect = false;

  try {
    const response = await fetch(serviceUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        videoId: videoId,
        youtubeUrl: youtubeUrl,
      }),
    });

    // If Vercel route returns HTML (404), try Railway directly
    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      console.log(`   ⚠️ Vercel route not available, trying Railway directly...`);
      useRailwayDirect = true;
      serviceUrl = `${RAILWAY_URL}/upload-full-audio`;
      
      const railwayResponse = await fetch(serviceUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          videoId: videoId,
          youtubeUrl: youtubeUrl,
        }),
      });

      if (!railwayResponse.ok) {
        const errorText = await railwayResponse.text();
        console.error(`\n❌ Railway upload failed:`);
        console.error(`   Status: ${railwayResponse.status}`);
        console.error(`   Error: ${errorText.substring(0, 200)}`);
        return false;
      }

      const result = await railwayResponse.json();
      
      if (result.success) {
        console.log(`\n✅ Full audio uploaded successfully!`);
        console.log(`   Video ID: ${result.videoId}`);
        console.log(`   R2 Key: ${result.r2Key}`);
        console.log(`   File Size: ${result.fileSizeMB} MB`);
        console.log(`\n🌐 Full audio should now be available at:`);
        console.log(`   ${CLOUDFLARE_WORKER_URL}/api/video/${videoId}/audio-full`);
        return true;
      } else {
        console.error(`\n❌ Upload failed:`);
        console.error(`   Error: ${result.error || 'Unknown error'}`);
        console.error(`   Details: ${result.details || 'No details provided'}`);
        return false;
      }
    }

    const result = await response.json();
    
    if (response.ok && result.success) {
      console.log(`\n✅ Full audio uploaded successfully!`);
      console.log(`   Video ID: ${result.videoId}`);
      console.log(`   R2 Key: ${result.r2Key}`);
      console.log(`   File Size: ${result.fileSizeMB} MB`);
      console.log(`\n🌐 Full audio should now be available at:`);
      console.log(`   ${CLOUDFLARE_WORKER_URL}/api/video/${videoId}/audio-full`);
      return true;
    } else {
      console.error(`\n❌ Upload failed:`);
      console.error(`   Status: ${response.status}`);
      console.error(`   Error: ${result.error || 'Unknown error'}`);
      console.error(`   Details: ${result.details || 'No details provided'}`);
      return false;
    }
  } catch (error) {
    console.error(`\n❌ Request failed:`, error.message);
    
    // Try Railway directly as fallback
    if (!useRailwayDirect) {
      console.log(`   ⚠️ Trying Railway directly as fallback...`);
      try {
        const railwayResponse = await fetch(`${RAILWAY_URL}/upload-full-audio`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ videoId, youtubeUrl }),
        });
        
        if (railwayResponse.ok) {
          const result = await railwayResponse.json();
          if (result.success) {
            console.log(`\n✅ Full audio uploaded successfully via Railway!`);
            console.log(`   Video ID: ${result.videoId}`);
            console.log(`   R2 Key: ${result.r2Key}`);
            console.log(`   File Size: ${result.fileSizeMB} MB`);
            return true;
          }
        }
      } catch (railwayError) {
        console.error(`   Railway fallback also failed: ${railwayError.message}`);
      }
    }
    
    return false;
  }
}

async function uploadAllVideos() {
  console.log(`\n🚀 ========== UPLOADING FULL AUDIO FOR ${videos.length} VIDEOS ==========\n`);
  
  let successCount = 0;
  let failCount = 0;
  
  for (const video of videos) {
    const success = await uploadFullAudioForVideo(video.videoId, video.youtubeUrl);
    if (success) {
      successCount++;
    } else {
      failCount++;
    }
    
    // Wait a bit between videos to avoid rate limiting
    if (video !== videos[videos.length - 1]) {
      console.log(`\n⏳ Waiting 3 seconds before next video...\n`);
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
  }
  
  console.log(`\n✅ ========== SUMMARY ==========`);
  console.log(`   Successfully uploaded: ${successCount}/${videos.length}`);
  console.log(`   Failed: ${failCount}/${videos.length}`);
  console.log(`========================================\n`);
}

uploadAllVideos();
