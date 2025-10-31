#!/usr/bin/env node
/**
 * Simplified test script to process YouTube video locally
 * Uses the Next.js API route and Cloudflare Worker
 */

const YOUTUBE_URL = 'https://www.youtube.com/watch?v=u9sU5l92Th4';
const API_URL = 'http://localhost:3000';

const API_KEYS = {
  elevenlabs: 'sk_b3f632622b08afb9a26b2fb912be9d1baa2548414f430543',
  assemblyai: '4c15846aff03429e99207a86450addae',
  huggingface: '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',
  deepseek: 'sk-9d567276d4ad41a08a074a0a83de1a67',
};

async function testVideoProcessing() {
  console.log('🎬 Testing video processing workflow...\n');
  console.log(`📺 Video URL: ${YOUTUBE_URL}\n`);

  try {
    console.log('📡 Calling /api/process-video-cloudflare...');
    
    const response = await fetch(`${API_URL}/api/process-video-cloudflare`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        youtubeUrl: YOUTUBE_URL,
        apiKeys: API_KEYS,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ API Error:', response.status, errorText);
      return;
    }

    const result = await response.json();
    
    if (result.success) {
      console.log('\n✅ Video processing successful!');
      console.log(`\n📊 Results:`);
      console.log(`   Video ID: ${result.videoId}`);
      console.log(`   Transcript preview: ${result.transcript?.substring(0, 200)}...`);
      console.log(`   Segments: ${result.segments?.length || 0}`);
      console.log(`   R2 Keys: ${result.r2Keys?.length || 0}`);
      console.log(`\n🌐 Metadata stored in Cloudflare D1`);
      console.log(`📁 Audio clips ready for R2: ${result.r2Keys?.join(', ') || 'none'}`);
    } else {
      console.error('❌ Processing failed:', result.error);
    }

  } catch (error: any) {
    if (error.code === 'ECONNREFUSED') {
      console.error('❌ Connection refused. Make sure:');
      console.error('   1. Next.js dev server is running: npm run dev');
      console.error('   2. Cloudflare Worker is deployed or running: wrangler dev');
    } else {
      console.error('❌ Error:', error.message);
    }
  }
}

testVideoProcessing();

