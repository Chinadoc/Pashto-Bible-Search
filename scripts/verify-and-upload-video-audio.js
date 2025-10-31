/**
 * Script to verify video audio segments exist in R2 and upload if missing
 * Usage: node scripts/verify-and-upload-video-audio.js <videoId>
 */

const CLOUDFLARE_WORKER_URL = process.env.NEXT_PUBLIC_CLOUDFLARE_WORKER_URL || 'https://pashtobiblesearch.jeremy-samuels17.workers.dev';

async function checkVideoAudio(videoId) {
  console.log(`\n🔍 Checking audio for video: ${videoId}\n`);
  
  // Get video metadata from D1
  const videoResponse = await fetch(`${CLOUDFLARE_WORKER_URL}/api/video/list`);
  const videoData = await videoResponse.json();
  
  const video = videoData.videos?.find(v => v.video_id === videoId);
  
  if (!video) {
    console.error(`❌ Video ${videoId} not found in database`);
    return;
  }
  
  console.log(`✅ Found video: ${video.video_id}`);
  console.log(`   YouTube URL: ${video.youtube_url}`);
  console.log(`   Segments: ${video.segments?.length || 0}`);
  
  if (!video.segments || video.segments.length === 0) {
    console.error(`❌ No segments found for video ${videoId}`);
    return;
  }
  
  // Check each segment
  let missingCount = 0;
  const missingSegments = [];
  
  for (let i = 0; i < video.segments.length; i++) {
    const segmentNum = i + 1;
    const testUrl = `${CLOUDFLARE_WORKER_URL}/api/video/${videoId}/audio?segment=${segmentNum}`;
    
    try {
      const response = await fetch(testUrl, { method: 'HEAD' });
      
      if (response.ok) {
        console.log(`   ✅ Segment ${segmentNum}: Found`);
      } else {
        console.log(`   ❌ Segment ${segmentNum}: Missing (${response.status})`);
        missingCount++;
        missingSegments.push(segmentNum);
      }
    } catch (error) {
      console.log(`   ❌ Segment ${segmentNum}: Error - ${error.message}`);
      missingCount++;
      missingSegments.push(segmentNum);
    }
  }
  
  console.log(`\n📊 Summary:`);
  console.log(`   Total segments: ${video.segments.length}`);
  console.log(`   Found: ${video.segments.length - missingCount}`);
  console.log(`   Missing: ${missingCount}`);
  
  if (missingCount > 0) {
    console.log(`\n⚠️  Missing segments: ${missingSegments.join(', ')}`);
    console.log(`\n💡 To re-upload audio segments:`);
    console.log(`   1. Ensure the video was processed with audio extraction`);
    console.log(`   2. Re-process the video via the UI or API`);
    console.log(`   3. Or manually upload segments using wrangler CLI`);
  }
}

// Get video ID from command line
const videoId = process.argv[2];

if (!videoId) {
  console.error('Usage: node scripts/verify-and-upload-video-audio.js <videoId>');
  console.error('Example: node scripts/verify-and-upload-video-audio.js u9sU5192Th4');
  process.exit(1);
}

checkVideoAudio(videoId).catch(console.error);

