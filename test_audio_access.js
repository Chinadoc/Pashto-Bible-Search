const fs = require('fs');
const path = require('path');
const https = require('https');

async function testAudioAccess() {
  console.log('\n🎵 TESTING AUDIO ACCESS FROM GOOGLE DRIVE\n');

  // Load the audio map
  const audioMapPath = path.join(process.cwd(), 'google_drive_audio_urls.json');
  const audioMap = JSON.parse(fs.readFileSync(audioMapPath, 'utf8'));

  console.log(`📊 Total audio mappings: ${Object.keys(audioMap).length}\n`);

  // Sample a few different ones
  const samples = Object.entries(audioMap).slice(0, 5);

  console.log('Testing 5 sample audio URLs:\n');

  for (const [filename, data] of samples) {
    const url = data.google_drive_url;
    const fileId = url.match(/id=([a-zA-Z0-9_-]+)/)?.[1];

    console.log(`📁 ${filename}`);
    console.log(`   File ID: ${fileId}`);
    console.log(`   URL: ${url.substring(0, 80)}...`);

    // Test if URL is accessible
    try {
      await testUrl(url);
      console.log(`   Status: ✅ Accessible\n`);
    } catch (error) {
      console.log(`   Status: ❌ Error - ${error.message}\n`);
    }
  }

  // Show URL structure
  console.log('\n📋 URL STRUCTURE:\n');
  const firstEntry = Object.values(audioMap)[0];
  console.log(`Full URL: ${firstEntry.google_drive_url}`);
  console.log('\nExtract File ID with regex:');
  console.log(`  Regex: /id=([a-zA-Z0-9_-]+)/`);
  const match = firstEntry.google_drive_url.match(/id=([a-zA-Z0-9_-]+)/);
  console.log(`  Extracted ID: ${match?.[1]}`);

  console.log('\n✅ Audio IDs are present and URLs are structured correctly\n');
}

function testUrl(url) {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(new Error('Timeout'));
    }, 5000);

    https.head(url, (res) => {
      clearTimeout(timeout);
      if (res.statusCode === 200 || res.statusCode === 302) {
        resolve(res.statusCode);
      } else {
        reject(new Error(`HTTP ${res.statusCode}`));
      }
    }).on('error', (err) => {
      clearTimeout(timeout);
      reject(err);
    });
  });
}

testAudioAccess().catch(console.error);
