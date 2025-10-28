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
    // Step 1: Process video with Python (download, transcribe, create clips)
    console.log('1️⃣ Processing video with Python...\n');
    console.log('   - Downloading video...');
    console.log('   - Extracting audio...');
    console.log('   - Transcribing with Eleven Labs...');
    console.log('   - Creating sentence clips...\n');
    
    const pythonScript = `python3 process_video_offline.py`;
    const { stdout, stderr } = await execAsync(`echo "${youtubeUrl}" | ${pythonScript}`, {
      timeout: 600000, // 10 minutes
      env: { ...process.env }
    });
    
    console.log(stdout);
    if (stderr) console.error(stderr);
    
    // Step 2: Check if results file exists
    const resultsFile = join(process.cwd(), 'processed_videos', `${videoId}_results.json`);
    console.log(`\n2️⃣ Checking results...`);
    
    try {
      const results = JSON.parse(readFileSync(resultsFile, 'utf8'));
      console.log(`   ✅ Found ${results.total_clips} sentence clips\n`);
      
      // Step 3: Upload clips to Google Drive and save to Supabase
      console.log('3️⃣ Uploading clips to Google Drive and saving to Supabase...\n');
      console.log('   This will take a few minutes...\n');
      
      // Run the upload script
      const { stdout: uploadOutput } = await execAsync('npm run upload-video-clips', {
        timeout: 3600000, // 1 hour for large batches
        env: { ...process.env }
      });
      
      console.log(uploadOutput);
      
      console.log('\n✅ Complete workflow finished!\n');
      console.log(`📊 Summary:`);
      console.log(`   Video ID: ${videoId}`);
      console.log(`   Clips created: ${results.total_clips}`);
      console.log(`   Transcript: ${results.transcription.transcript.substring(0, 100)}...`);
      console.log(`   Is Pashto: ${results.transcription.is_pashto}`);
      console.log(`\n🔗 View clips: https://drive.google.com/drive/folders/1Wb09vyqP2HqEMRQ2B-SViEgxmVkuKMgN`);
      console.log(`📊 Metadata saved to Supabase`);
      
    } catch (error) {
      console.error('❌ Results file not found:', error.message);
      console.log('\n⚠️ Video processing may have failed or is still running');
      console.log(`   Check: ${resultsFile}`);
      process.exit(1);
    }
    
  } catch (error) {
    console.error('❌ Processing failed:', error.message);
    process.exit(1);
  }
}

// Get YouTube URL from command line
const youtubeUrl = process.argv[2] || 'https://www.youtube.com/watch?v=ZmM_DQ0aRvk';

processVideo(youtubeUrl);

