import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { readFileSync } from 'fs';
import { join } from 'path';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY || "sk_b3f632622b08afb9a26b2fb912be9d1baa2548414f430543";
const ELEVENLABS_API_URL = "https://api.elevenlabs.io/v1/speech-to-text";

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function retryTranscription(clipId, googleDriveUrl) {
  console.log(`🔄 Retrying transcription for clip ${clipId}...`);
  
  try {
    // Download audio from Google Drive
    const response = await fetch(googleDriveUrl);
    if (!response.ok) {
      throw new Error(`Failed to download audio: ${response.status}`);
    }
    
    const audioBuffer = await response.arrayBuffer();
    
    // Create form data
    const formData = new FormData();
    formData.append('file', new Blob([audioBuffer]), 'audio.wav');
    formData.append('language', 'ps'); // Pashto
    formData.append('model_id', 'scribe_v1');
    
    // Send to Eleven Labs
    const transcribeResponse = await fetch(ELEVENLABS_API_URL, {
      method: 'POST',
      headers: {
        'xi-api-key': ELEVENLABS_API_KEY,
      },
      body: formData,
    });
    
    if (!transcribeResponse.ok) {
      throw new Error(`Eleven Labs API error: ${transcribeResponse.status}`);
    }
    
    const result = await transcribeResponse.json();
    const newTranscript = result.text || '';
    
    // Update in Supabase
    const { error } = await supabase
      .from('video_transcripts')
      .update({
        transcript_text: newTranscript,
        retry_count: supabase.raw('retry_count + 1'),
        needs_retry: false,
        updated_at: new Date().toISOString()
      })
      .eq('id', clipId);
    
    if (error) {
      throw new Error(`Supabase update failed: ${error.message}`);
    }
    
    console.log(`✅ Retry successful`);
    console.log(`   New transcript: ${newTranscript.substring(0, 100)}...`);
    
    return { success: true, transcript: newTranscript };
    
  } catch (error) {
    console.error(`❌ Retry failed:`, error.message);
    return { success: false, error: error.message };
  }
}

async function retryAllNeedingRetry(videoId) {
  console.log(`🔄 Retrying transcriptions for video: ${videoId}\n`);
  
  const { data: clips, error } = await supabase
    .from('video_transcripts')
    .select('*')
    .eq('video_id', videoId)
    .eq('needs_retry', true);
  
  if (error) {
    console.error('❌ Failed to fetch clips:', error.message);
    return;
  }
  
  if (!clips || clips.length === 0) {
    console.log('No clips need retry');
    return;
  }
  
  console.log(`📊 Found ${clips.length} clips needing retry\n`);
  
  let successCount = 0;
  let failCount = 0;
  
  for (const clip of clips) {
    const result = await retryTranscription(clip.id, clip.google_drive_url);
    
    if (result.success) {
      successCount++;
    } else {
      failCount++;
    }
    
    // Rate limiting
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log('\n📊 Retry Summary:');
  console.log(`   ✅ Successful: ${successCount}`);
  console.log(`   ❌ Failed: ${failCount}`);
  console.log(`   📊 Total: ${clips.length}\n`);
}

async function main() {
  const videoId = process.argv[2];
  
  if (!videoId) {
    console.error('Usage: node retry_transcription.js <video_id>');
    process.exit(1);
  }
  
  await retryAllNeedingRetry(videoId);
}

main().catch(console.error);

