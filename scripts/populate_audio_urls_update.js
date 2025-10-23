#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

async function populateAudioUrlsUpdate() {
  console.log('\n🎵 POPULATING AUDIO URLS (UPDATE Strategy)\n');

  try {
    const audioMapPath = path.join(process.cwd(), 'google_drive_audio_urls.json');
    console.log('📖 Loading audio map...');
    const audioMap = JSON.parse(fs.readFileSync(audioMapPath, 'utf8'));
    const totalMappings = Object.keys(audioMap).length;
    console.log('   ✅ Loaded ' + totalMappings + ' mappings\n');

    const refs = Object.keys(audioMap).filter(r => audioMap[r]);
    
    // Split by translation
    const afghanRefs = refs.filter(r => !r.toLowerCase().includes('yousafzai'));
    const yousafzaiRefs = refs.filter(r => r.toLowerCase().includes('yousafzai'));

    console.log('📊 Split:');
    console.log('   Afghan: ' + afghanRefs.length);
    console.log('   Yousafzai: ' + yousafzaiRefs.length + '\n');

    const BATCH_SIZE = 100;

    // UPDATE Afghan verses
    console.log('🇦🇫 Updating Afghan verses...');
    let afghantCount = 0;
    for (let i = 0; i < afghanRefs.length; i += BATCH_SIZE) {
      const batch = afghanRefs.slice(i, i + BATCH_SIZE);
      
      for (const ref of batch) {
        const { error } = await supabase
          .from('verses')
          .update({ 
            audio_url: audioMap[ref],
            audio_source: 'google_drive'
          })
          .eq('ref', ref);

        if (!error) afghantCount++;
      }

      const pct = Math.min(100, Math.round(((i + BATCH_SIZE) / afghanRefs.length) * 100));
      process.stdout.write('\r   Progress: ' + pct + '% (' + afghantCount + '/' + afghanRefs.length + ')');
    }
    console.log('\n   ✅ Afghan: ' + afghantCount + '/' + afghanRefs.length + '\n');

    // UPDATE Yousafzai verses
    console.log('🇦🇫 Updating Yousafzai verses...');
    let yousafzaiCount = 0;
    for (let i = 0; i < yousafzaiRefs.length; i += BATCH_SIZE) {
      const batch = yousafzaiRefs.slice(i, i + BATCH_SIZE);
      
      for (const ref of batch) {
        const { error } = await supabase
          .from('verses_yousafzai')
          .update({ 
            audio_url: audioMap[ref],
            audio_source: 'google_drive'
          })
          .eq('ref', ref);

        if (!error) yousafzaiCount++;
      }

      const pct = Math.min(100, Math.round(((i + BATCH_SIZE) / yousafzaiRefs.length) * 100));
      process.stdout.write('\r   Progress: ' + pct + '% (' + yousafzaiCount + '/' + yousafzaiRefs.length + ')');
    }
    console.log('\n   ✅ Yousafzai: ' + yousafzaiCount + '/' + yousafzaiRefs.length + '\n');

    // Verify
    console.log('📊 VERIFICATION:');
    const { count: afghanAudioCount } = await supabase
      .from('verses').select('*', { count: 'exact', head: true })
      .not('audio_url', 'is', null);
    const { count: yousafzaiAudioCount } = await supabase
      .from('verses_yousafzai').select('*', { count: 'exact', head: true })
      .not('audio_url', 'is', null);
    const { count: afghantotal } = await supabase
      .from('verses').select('*', { count: 'exact', head: true });
    const { count: yousafzaitotal } = await supabase
      .from('verses_yousafzai').select('*', { count: 'exact', head: true });

    console.log('   Afghan: ' + afghanAudioCount + '/' + afghantotal + ' (' + ((afghanAudioCount/afghantotal)*100).toFixed(1) + '%)');
    console.log('   Yousafzai: ' + yousafzaiAudioCount + '/' + yousafzaitotal + ' (' + ((yousafzaiAudioCount/yousafzaitotal)*100).toFixed(1) + '%)\n');

    const { data: genesis } = await supabase
      .from('verses').select('audio_url').eq('ref', 'Genesis 1:1').single();
    console.log('🔍 Genesis 1:1: ' + (genesis?.audio_url ? '✅' : '❌') + '\n');

    console.log('✅ COMPLETE!\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

populateAudioUrlsUpdate();
