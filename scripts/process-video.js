/**
 * Script to process a video and monitor logs
 * Usage: node scripts/process-video.js <youtubeUrl> [elevenlabsApiKey]
 * Example: node scripts/process-video.js "https://www.youtube.com/watch?v=u9sU5l92Th4"
 */

const CLOUDFLARE_WORKER_URL = process.env.NEXT_PUBLIC_CLOUDFLARE_WORKER_URL || 'https://pashtobiblesearch.jeremy-samuels17.workers.dev';
const NEXT_PUBLIC_URL = process.env.NEXT_PUBLIC_URL || 'https://pashto-bible-search.vercel.app';

async function processVideo(youtubeUrl, elevenlabsApiKey) {
  console.log(`\n🎬 ========== PROCESSING VIDEO ==========`);
  console.log(`YouTube URL: ${youtubeUrl}`);
  console.log(`Timestamp: ${new Date().toISOString()}\n`);

  const requestBody = {
    youtubeUrl,
    apiKeys: elevenlabsApiKey ? { elevenlabs: elevenlabsApiKey } : undefined,
  };

  console.log(`📡 Sending request to: ${NEXT_PUBLIC_URL}/api/process-video-cloudflare`);
  console.log(`   This will forward to Railway processing service\n`);

  try {
    const startTime = Date.now();
    const response = await fetch(`${NEXT_PUBLIC_URL}/api/process-video-cloudflare`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    const duration = ((Date.now() - startTime) / 1000).toFixed(2);

    console.log(`\n📨 Response received:`);
    console.log(`   Status: ${response.status} ${response.statusText}`);
    console.log(`   Duration: ${duration}s`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`\n❌ Error:`);
      console.error(errorText);
      console.log(`\n📋 Check logs:`);
      console.log(`   - Vercel: https://vercel.com/dashboard (Project → Logs)`);
      console.log(`   - Railway: https://railway.app (Service → Deployments → View Logs)`);
      return;
    }

    const result = await response.json();
    
    console.log(`\n✅ Processing completed:`);
    console.log(`   Video ID: ${result.videoId}`);
    console.log(`   Segments: ${result.segments?.length || 0}`);
    console.log(`   Transcript length: ${result.transcript?.length || 0} chars`);
    
    if (result.segments && result.segments.length > 0) {
      const lastSegment = result.segments[result.segments.length - 1];
      console.log(`   Last segment end time: ${lastSegment.endTime}s (${formatDuration(lastSegment.endTime)})`);
    }
    
    console.log(`\n📋 To view logs:`);
    console.log(`   - Vercel: https://vercel.com/dashboard (Project → Logs)`);
    console.log(`   - Railway: https://railway.app (Service → Deployments → View Logs)`);
    console.log(`   - Look for: 🎬 ========== VIDEO PROCESSING STARTED ==========`);

  } catch (error) {
    console.error(`\n❌ Request failed:`, error.message);
    console.log(`\n📋 Check logs:`);
    console.log(`   - Vercel: https://vercel.com/dashboard (Project → Logs)`);
    console.log(`   - Railway: https://railway.app (Service → Deployments → View Logs)`);
  }
}

function formatDuration(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// Get URL from command line
const youtubeUrl = process.argv[2];
const elevenlabsApiKey = process.argv[3] || process.env.ELEVENLABS_API_KEY;

if (!youtubeUrl) {
  console.error('Usage: node scripts/process-video.js <youtubeUrl> [elevenlabsApiKey]');
  console.error('Example: node scripts/process-video.js "https://www.youtube.com/watch?v=u9sU5l92Th4"');
  process.exit(1);
}

processVideo(youtubeUrl, elevenlabsApiKey).catch(console.error);

