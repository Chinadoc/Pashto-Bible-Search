/**
 * Script to process a video via the Next.js API route
 * This will use the new WhisperX pathway (ElevenLabs + WhisperX alignment)
 */

const videoUrl = process.argv[2] || 'https://www.youtube.com/watch?v=u9sU5l92Th4';
const customTitle = process.argv[3] || `Video Comparison - WhisperX Enhanced (${new Date().toISOString().split('T')[0]})`;

const API_URL = process.env.NEXT_PUBLIC_URL || 'https://pashto-bible-search.vercel.app';

async function processVideo() {
  console.log(`\n🎬 Processing video with WhisperX pathway:`);
  console.log(`   URL: ${videoUrl}`);
  console.log(`   Title: ${customTitle}`);
  console.log(`   API: ${API_URL}/api/process-video-cloudflare`);
  console.log(`\n📡 Sending request...\n`);

  try {
    const response = await fetch(`${API_URL}/api/process-video-cloudflare`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        youtubeUrl: videoUrl,
        title: customTitle,
        apiKeys: {
          elevenlabs: process.env.ELEVENLABS_API_KEY || 'sk_b3f632622b08afb9a26b2fb912be9d1baa2548414f430543'
        }
      })
    });

    const result = await response.json();

    if (response.ok && result.success) {
      console.log(`\n✅ Video processed successfully!`);
      console.log(`   Video ID: ${result.videoId}`);
      console.log(`   Segments: ${result.segments?.length || 0}`);
      console.log(`   Transcript length: ${result.transcript?.length || 0} chars`);
      console.log(`\n📊 Video will appear in the UI with title: "${customTitle}"`);
      console.log(`\n🌐 View it at: ${API_URL}/videos`);
    } else {
      console.error(`\n❌ Processing failed:`);
      console.error(`   Status: ${response.status}`);
      console.error(`   Error: ${result.error || 'Unknown error'}`);
      console.error(`   Details: ${result.details || 'No details provided'}`);
      console.error(`\n📋 Check logs:`);
      console.error(`   - Vercel: https://vercel.com/dashboard`);
      console.error(`   - Railway: https://railway.app`);
      process.exit(1);
    }
  } catch (error) {
    console.error(`\n❌ Request failed:`, error.message);
    process.exit(1);
  }
}

processVideo();

