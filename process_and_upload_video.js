import { exec } from 'child_process';
import { promisify } from 'util';
import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const execAsync = promisify(exec);

async function processVideo(youtubeUrl) {
  console.log('🎬 Complete Video Processing Pipeline\n');
  console.log(`📺 Video URL: ${youtubeUrl}\n`);
  
  const videoId = youtubeUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)?.[1];
  
  if (!videoId) {
    console.error('❌ Invalid YouTube URL');
    process.exit(1);
  }
  
  console.log(`📋 Video ID: ${videoId}\n`);
  
  try {
    // Step 1: Use API to process video (simpler, avoids Python dependency issues)
    console.log('1️⃣ Processing video via API...\n');
    console.log('   - Downloading video...');
    console.log('   - Transcribing with Eleven Labs...\n');
    
    const formData = new FormData();
    formData.append('youtubeUrl', youtubeUrl);
    
    const response = await fetch('http://localhost:3000/api/transcribe-audio', {
      method: 'POST',
      body: formData
    });
    
    const result = await response.json();
    
    if (!response.ok || !result.success) {
      throw new Error(result.error || 'Transcription failed');
    }
    
    console.log('✅ Transcription complete!');
    console.log(`   Transcript: ${result.transcript.substring(0, 100)}...`);
    console.log(`   Validation: ${result.validation.confidence * 100}% confidence\n`);
    
    // Step 2: Store in Supabase
    console.log('2️⃣ Storing transcript in Supabase...\n');
    
    const storeResponse = await fetch('http://localhost:3000/api/store-video-transcript', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        videoId: videoId,
        videoUrl: youtubeUrl,
        transcript: result.transcript,
        segments: [],
        audioSegments: [],
        metadata: {
          validation: result.validation,
          source: 'elevenlabs'
        }
      })
    });
    
    const storeResult = await storeResponse.json();
    
    if (!storeResponse.ok) {
      throw new Error(storeResult.error || 'Failed to store transcript');
    }
    
    console.log('✅ Transcript stored successfully!\n');
    
    console.log('✅ Complete workflow finished!\n');
    console.log(`📊 Summary:`);
    console.log(`   Video ID: ${videoId}`);
    console.log(`   Transcript: ${result.transcript.substring(0, 100)}...`);
    console.log(`   Validation: ${result.validation.confidence * 100}% confidence`);
    console.log(`   Transcript ID: ${storeResult.transcriptId}`);
    console.log(`\n📊 View in Videos tab: http://localhost:3000`);
    
  } catch (error) {
    console.error('❌ Processing failed:', error.message);
    console.log('\n💡 Alternative: Try using the Videos tab in the app UI');
    process.exit(1);
  }
}

// Get YouTube URL from command line
const youtubeUrl = process.argv[2] || 'https://www.youtube.com/watch?v=ZmM_DQ0aRvk';

processVideo(youtubeUrl);

