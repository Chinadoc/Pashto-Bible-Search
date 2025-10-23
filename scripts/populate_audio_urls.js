#!/usr/bin/env node

/**
 * Populate audio_url columns in Supabase from google_drive_audio_urls.json
 * 
 * This script loads the audio mapping JSON and updates verses/verses_yousafzai
 * tables with the corresponding URLs.
 * 
 * Usage:
 *   node scripts/populate_audio_urls.js
 */

const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

async function populateAudioUrls() {
  console.log('\n🎵 POPULATING AUDIO URLS FROM google_drive_audio_urls.json\n');

  try {
    // Load the audio mapping
    const audioMapPath = path.join(process.cwd(), 'google_drive_audio_urls.json');
    console.log('📖 Loading audio map from:', audioMapPath);
    const audioMap = JSON.parse(fs.readFileSync(audioMapPath, 'utf8'));
    const totalMappings = Object.keys(audioMap).length;
    console.log('   ✅ Loaded ' + totalMappings + ' audio mappings\n');

    // Update Afghan verses
    console.log('🇦🇫 Updating Afghan verses...');
    let afghantUpdated = 0;
    let afghanProcessed = 0;
    const afghanRefs = Object.keys(audioMap).filter(ref => !ref.includes('yousafzai'));
    
    for (const ref of afghanRefs) {
      const audioUrl = audioMap[ref];
      if (!audioUrl) continue;

      const { error } = await supabase
        .from('verses')
        .update({ 
          audio_url: audioUrl,
          audio_source: 'google_drive'
        })
        .eq('ref', ref);

      if (!error) {
        afghantUpdated++;
      } else if (error.code !== 'PGRST116') {
        console.log('   ⚠️  Error updating ' + ref + ':', error.message);
      }

      afghanProcessed++;
      if (afghanProcessed % 1000 === 0) {
        process.stdout.write('\r   Progress: ' + afghanProcessed + '/' + afghanRefs.length);
      }
    }
    console.log('\r   ✅ Updated ' + afghantUpdated + '/' + afghanRefs.length + ' Afghan verses\n');

    // Update Yousafzai verses
    console.log('🇦🇫 Updating Yousafzai verses...');
    let yousafzaiUpdated = 0;
    let yousafzaiProcessed = 0;
    const yousafzaiRefs = Object.keys(audioMap).filter(ref => ref.includes('yousafzai'));
    
    for (const ref of yousafzaiRefs) {
      const audioUrl = audioMap[ref];
      if (!audioUrl) continue;

      const { error } = await supabase
        .from('verses_yousafzai')
        .update({ 
          audio_url: audioUrl,
          audio_source: 'google_drive'
        })
        .eq('ref', ref);

      if (!error) {
        yousafzaiUpdated++;
      } else if (error.code !== 'PGRST116') {
        console.log('   ⚠️  Error updating ' + ref + ':', error.message);
      }

      yousafzaiProcessed++;
      if (yousafzaiProcessed % 1000 === 0) {
        process.stdout.write('\r   Progress: ' + yousafzaiProcessed + '/' + yousafzaiRefs.length);
      }
    }
    console.log('\r   ✅ Updated ' + yousafzaiUpdated + '/' + yousafzaiRefs.length + ' Yousafzai verses\n');

    // Verify
    console.log('📊 VERIFICATION:');
    const { count: afghanAudioCount } = await supabase
      .from('verses')
      .select('*', { count: 'exact', head: true })
      .not('audio_url', 'is', null);

    const { count: yousafzaiAudioCount } = await supabase
      .from('verses_yousafzai')
      .select('*', { count: 'exact', head: true })
      .not('audio_url', 'is', null);

    const { count: afghanTotal } = await supabase
      .from('verses')
      .select('*', { count: 'exact', head: true });

    const { count: yousafzaiTotal } = await supabase
      .from('verses_yousafzai')
      .select('*', { count: 'exact', head: true });

    console.log('   Afghan: ' + afghanAudioCount + '/' + afghanTotal + ' verses have audio (' + 
      ((afghanAudioCount/afghanTotal)*100).toFixed(1) + '%)');
    console.log('   Yousafzai: ' + yousafzaiAudioCount + '/' + yousafzaiTotal + ' verses have audio (' + 
      ((yousafzaiAudioCount/yousafzaiTotal)*100).toFixed(1) + '%)\n');

    // Spot check
    console.log('🔍 SPOT CHECK:');
    const { data: genesisAfghan } = await supabase
      .from('verses')
      .select('ref, text, audio_url')
      .eq('ref', 'Genesis 1:1')
      .single();

    if (genesisAfghan?.audio_url) {
      console.log('   ✅ Genesis 1:1 (Afghan): ' + genesisAfghan.audio_url.substring(0, 60) + '...');
    } else {
      console.log('   ❌ Genesis 1:1 (Afghan): No audio URL');
    }

    console.log('\n✅ Audio URL population complete!\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

populateAudioUrls();
