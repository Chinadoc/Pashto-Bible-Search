#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('❌ Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

function convertToStreamingUrl(downloadUrl) {
  // Extract file ID from either /preview or /uc?id= format
  let match = downloadUrl.match(/\/file\/d\/([a-zA-Z0-9-_]+)/);
  if (!match) {
    match = downloadUrl.match(/[?&]id=([a-zA-Z0-9-_]+)/);
  }
  if (!match) return downloadUrl;
  
  const fileId = match[1];
  
  // Convert to direct download format (works with HTML5 audio players)
  return `https://drive.google.com/uc?id=${fileId}&export=download`;
}

async function fixTableUrls(tableName, batchSize = 1000) {
  console.log(`📝 Processing ${tableName}...`);
  
  let totalUpdated = 0;
  let hasMore = true;
  let offset = 0;
  
  while (hasMore) {
    const { data: rows, error } = await supabase
      .from(tableName)
      .select('id, audio_public_url')
      .not('audio_public_url', 'is', null)
      .range(offset, offset + batchSize - 1);
    
    if (error) {
      console.error(`❌ Error fetching from ${tableName}:`, error.message);
      return totalUpdated;
    }
    
    if (!rows || rows.length === 0) {
      hasMore = false;
      break;
    }
    
    console.log(`  📦 Batch at offset ${offset}: Processing ${rows.length} records...`);
    
    for (const row of rows) {
      if (row.audio_public_url && row.audio_public_url.includes('drive.google.com')) {
        const newUrl = convertToStreamingUrl(row.audio_public_url);
        
        // Only update if URL actually changed
        if (newUrl !== row.audio_public_url) {
          const { error: updateError } = await supabase
            .from(tableName)
            .update({ audio_public_url: newUrl })
            .eq('id', row.id);
          
          if (updateError) {
            console.error(`  ❌ Error updating ID ${row.id}:`, updateError.message);
          } else {
            totalUpdated++;
          }
        }
      }
    }
    
    offset += batchSize;
  }
  
  console.log(`✅ Updated ${totalUpdated} ${tableName} records\n`);
  return totalUpdated;
}

async function fixAudioUrls() {
  console.log('🔧 Fixing Google Drive audio URLs for streaming...\n');
  
  try {
    const yTotal = await fixTableUrls('verses_yousafzai', 500);
    const aTotal = await fixTableUrls('verses', 500);
    
    console.log('🎉 All audio URLs fixed!');
    console.log(`📊 Total updated: ${yTotal + aTotal} records`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

fixAudioUrls();
