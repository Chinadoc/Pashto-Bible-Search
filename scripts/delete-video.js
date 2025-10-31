/**
 * Script to delete video data from Cloudflare D1 and R2
 * Usage: node scripts/delete-video.js <videoId>
 * Example: node scripts/delete-video.js u9sU5l92Th4
 */

const CLOUDFLARE_WORKER_URL = process.env.NEXT_PUBLIC_CLOUDFLARE_WORKER_URL || 'https://pashtobiblesearch.jeremy-samuels17.workers.dev';

async function deleteVideo(videoId) {
  console.log(`\n🗑️  Deleting video: ${videoId}\n`);
  
  // Step 1: Get video metadata to find all segments
  console.log('📡 Step 1: Fetching video metadata...');
  const videoResponse = await fetch(`${CLOUDFLARE_WORKER_URL}/api/video/list`);
  const videoData = await videoResponse.json();
  
  const video = videoData.videos?.find(v => v.video_id === videoId);
  
  if (!video) {
    console.log(`⚠️  Video ${videoId} not found in database`);
    return;
  }
  
  console.log(`✅ Found video:`);
  console.log(`   YouTube URL: ${video.youtube_url}`);
  console.log(`   Segments: ${video.segments?.length || 0}`);
  
  // Step 2: Delete from D1 and R2 via worker (handles both)
  console.log(`\n🗑️  Step 2: Deleting video from D1 and R2...`);
  let deleteResponse;
  try {
    deleteResponse = await fetch(`${CLOUDFLARE_WORKER_URL}/api/video/${videoId}`, {
      method: 'DELETE',
    });
    
    if (deleteResponse.ok) {
      const result = await deleteResponse.json();
      console.log(`✅ Video deleted successfully:`);
      console.log(`   ✅ Deleted from D1: Yes`);
      console.log(`   ✅ R2 files deleted: ${result.r2FilesDeleted || 0}`);
      console.log(`   ⚠️  R2 files failed: ${result.r2FilesFailed || 0}`);
      console.log(`\n✅ Video ${videoId} successfully deleted!`);
    } else {
      const errorText = await deleteResponse.text();
      console.error(`❌ Failed to delete: ${deleteResponse.status} - ${errorText}`);
    }
  } catch (error) {
    console.error(`❌ Error deleting video:`, error.message);
  }
}

// Get video ID from command line
const videoId = process.argv[2];

if (!videoId) {
  console.error('Usage: node scripts/delete-video.js <videoId>');
  console.error('Example: node scripts/delete-video.js u9sU5l92Th4');
  process.exit(1);
}

deleteVideo(videoId).catch(console.error);

