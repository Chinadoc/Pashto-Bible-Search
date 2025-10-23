#!/usr/bin/env node

/**
 * Parallel audio URL population using worker pools
 * Uses Promise.all to update multiple verses concurrently
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

const WORKER_POOL_SIZE = 20; // Concurrent updates

async function populateAudioUrlsParallel() {
  console.log('\n🎵 PARALLEL AUDIO URL POPULATION (20 workers)\n');

  try {
    const audioMapPath = path.join(process.cwd(), 'google_drive_audio_urls.json');
    console.log('📖 Loading audio map...');
    const audioMap = JSON.parse(fs.readFileSync(audioMapPath, 'utf8'));
    const totalMappings = Object.keys(audioMap).length;
    console.log('   ✅ Loaded ' + totalMappings + ' mappings\n');

    const refs = Object.keys(audioMap).filter(r => audioMap[r]);
    const afghanRefs = refs.filter(r => !r.toLowerCase().includes('yousafzai'));
    const yousafzaiRefs = refs.filter(r => r.toLowerCase().includes('yousafzai'));

    console.log('📊 Split:');
    console.log('   Afghan: ' + afghanRefs.length);
    console.log('   Yousafzai: ' + yousafzaiRefs.length + '\n');

    // Worker pool executor
    async function executeWithPool(tableName, refs) {
      console.log('🇦🇫 Updating ' + tableName + ' (' + refs.length + ' refs)...');
      
      let successful = 0;
      const startTime = Date.now();

      for (let i = 0; i < refs.length; i += WORKER_POOL_SIZE) {
        const batch = refs.slice(i, i + WORKER_POOL_SIZE);
        
        // Execute up to WORKER_POOL_SIZE updates in parallel
        const promises = batch.map(ref =>
          supabase
            .from(tableName)
            .update({
              audio_url: audioMap[ref],
              audio_source: 'google_drive'
            })
            .eq('ref', ref)
        );

        try {
          const results = await Promise.all(promises);
          const successCount = results.filter(r => !r.error).length;
          successful += successCount;
        } catch (error) {
          console.error('   ⚠️  Batch error:', error.message);
        }

        const pct = Math.min(100, Math.round(((i + WORKER_POOL_SIZE) / refs.length) * 100));
        const elapsed = Date.now() - startTime;
        const rate = Math.round((successful * 1000) / elapsed);
        process.stdout.write('\r   Progress: ' + pct + '% (' + successful + '/' + refs.length + ' @ ' + rate + '/sec)');
      }

      const elapsed = Date.now() - startTime;
      console.log('\n   ✅ Complete: ' + successful + '/' + refs.length + ' in ' + (elapsed / 1000).toFixed(1) + 's (' + Math.round((successful / (elapsed / 1000))) + '/sec)\n');
      return successful;
    }

    // Run both in parallel
    const [afghanCount, yousafzaiCount] = await Promise.all([
      executeWithPool('verses', afghanRefs),
      executeWithPool('verses_yousafzai', yousafzaiRefs)
    ]);

    // Verify
    console.log('📊 FINAL VERIFICATION:');
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

populateAudioUrlsParallel();
