#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('❌ Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

function convertToProxyUrl(googleDriveUrl) {
  if (!googleDriveUrl) return null;
  
  let fileId = null;
  
  // Format 1: https://drive.google.com/file/d/{ID}/preview
  let match = googleDriveUrl.match(/\/file\/d\/([a-zA-Z0-9-_]+)\//);
  if (match) {
    fileId = match[1];
  }
  
  // Format 2: https://drive.google.com/uc?id={ID}&export=...
  if (!fileId) {
    match = googleDriveUrl.match(/[?&]id=([a-zA-Z0-9-_]+)/);
    if (match) {
      fileId = match[1];
    }
  }
  
  if (!fileId) return googleDriveUrl;
  
  return `https://pashto-bible-search.vercel.app/api/audio-proxy?id=${fileId}&export=download`;
}

async function fixAllAudioUrls() {
  console.log('🔧 Fixing ALL audio URLs to use proxy...\n');
  
  try {
    // Fix verses_yousafzai
    console.log('📝 Updating verses_yousafzai table...');
    const { data: yousafzaiRows } = await supabase
      .from('verses_yousafzai')
      .select('id, audio_public_url')
      .not('audio_public_url', 'is', null)
      .limit(5000);
    
    if (yousafzaiRows && yousafzaiRows.length > 0) {
      for (let i = 0; i < yousafzaiRows.length; i++) {
        const row = yousafzaiRows[i];
        if (!row.audio_public_url.includes('pashto-bible-search.vercel.app')) {
          const newUrl = convertToProxyUrl(row.audio_public_url);
          await supabase
            .from('verses_yousafzai')
            .update({ audio_public_url: newUrl })
            .eq('id', row.id);
        }
      }
      console.log(`✅ Updated ${yousafzaiRows.length} verses_yousafzai records`);
    }
    
    // Fix verses (Afghan 2023)
    console.log('📝 Updating verses table...');
    const { data: afghanRows } = await supabase
      .from('verses')
      .select('id, audio_public_url')
      .not('audio_public_url', 'is', null)
      .limit(5000);
    
    if (afghanRows && afghanRows.length > 0) {
      for (let i = 0; i < afghanRows.length; i++) {
        const row = afghanRows[i];
        if (!row.audio_public_url.includes('pashto-bible-search.vercel.app')) {
          const newUrl = convertToProxyUrl(row.audio_public_url);
          await supabase
            .from('verses')
            .update({ audio_public_url: newUrl })
            .eq('id', row.id);
        }
      }
      console.log(`✅ Updated ${afghanRows.length} verses records`);
    }
    
    console.log('\n🎉 All audio URLs updated to use proxy!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

fixAllAudioUrls();
