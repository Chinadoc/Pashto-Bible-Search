#!/usr/bin/env node

const https = require('https');

const youtubeUrl = process.argv[2] || 'https://www.youtube.com/watch?v=ZmM_DQ0aRvk';

console.log('🎬 Starting video processing...\n');
console.log(`📺 Video URL: ${youtubeUrl}\n`);

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/process-video-complete',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  }
};

const req = https.request(options, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
    process.stdout.write('.');
  });

  res.on('end', () => {
    console.log('\n\n✅ Processing Complete!\n');
    try {
      const result = JSON.parse(data);
      if (result.success) {
        console.log('📊 Results:');
        console.log(`   Video ID: ${result.videoId}`);
        console.log(`   Clips Created: ${result.clipsCreated}`);
        console.log(`   Transcript: ${result.transcript.substring(0, 100)}...`);
        console.log(`   Message: ${result.message}\n`);
        console.log('💾 Saved to Supabase!');
        console.log('📱 Check Videos tab to view results\n');
      } else {
        console.log('❌ Error:', result.error);
      }
    } catch (error) {
      console.log('Response:', data);
    }
  });
});

req.on('error', (e) => {
  console.error(`❌ Error: ${e.message}`);
  console.log('\n💡 Make sure:');
  console.log('   1. Dev server is running: npm run dev');
  console.log('   2. You have internet connection');
  console.log('   3. AssemblyAI API key is configured');
});

const payload = JSON.stringify({ youtubeUrl });
req.write(payload);
req.end();
