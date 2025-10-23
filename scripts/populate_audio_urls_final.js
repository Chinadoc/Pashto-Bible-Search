#!/usr/bin/env node

/**
 * FINAL audio URL population - handles hyphenated book codes
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

// Book code to name mapping (with hyphens)
const BOOKS = {
  'genesis': 'Genesis', 'exodus': 'Exodus', 'leviticus': 'Leviticus',
  'numbers': 'Numbers', 'deuteronomy': 'Deuteronomy', 'joshua': 'Joshua',
  'judges': 'Judges', '1-samuel': '1 Samuel', '2-samuel': '2 Samuel',
  '1-kings': '1 Kings', '2-kings': '2 Kings', '1-chronicles': '1 Chronicles',
  '2-chronicles': '2 Chronicles', 'ezra': 'Ezra', 'nehemiah': 'Nehemiah',
  'esther': 'Esther', 'job': 'Job', 'psalms': 'Psalms', 'proverbs': 'Proverbs',
  'ecclesiastes': 'Ecclesiastes', 'isaiah': 'Isaiah', 'jeremiah': 'Jeremiah',
  'lamentations': 'Lamentations', 'ezekiel': 'Ezekiel', 'daniel': 'Daniel',
  'hosea': 'Hosea', 'joel': 'Joel', 'amos': 'Amos', 'obadiah': 'Obadiah',
  'jonah': 'Jonah', 'micah': 'Micah', 'nahum': 'Nahum', 'habakkuk': 'Habakkuk',
  'zephaniah': 'Zephaniah', 'haggai': 'Haggai', 'zechariah': 'Zechariah',
  'malachi': 'Malachi', 'matthew': 'Matthew', 'mark': 'Mark', 'luke': 'Luke',
  'john': 'John', 'acts': 'Acts', 'romans': 'Romans', '1-corinthians': '1 Corinthians',
  '2-corinthians': '2 Corinthians', 'galatians': 'Galatians', 'ephesians': 'Ephesians',
  'philippians': 'Philippians', 'colossians': 'Colossians', '1-thessalonians': '1 Thessalonians',
  '2-thessalonians': '2 Thessalonians', '1-timothy': '1 Timothy', '2-timothy': '2 Timothy',
  'titus': 'Titus', 'philemon': 'Philemon', 'hebrews': 'Hebrews', 'james': 'James',
  '1-peter': '1 Peter', '2-peter': '2 Peter', '1-john': '1 John', '2-john': '2 John',
  '3-john': '3 John', 'jude': 'Jude', 'revelation': 'Revelation', 'ruth': 'Ruth',
  'song-of-songs': 'Song of Solomon'
};

async function populateAudioUrls() {
  console.log('\n🎵 FINAL AUDIO URL POPULATION (Fixed)\n');

  try {
    const audioMapPath = path.join(process.cwd(), 'google_drive_audio_urls.json');
    console.log('📖 Loading audio map...');
    const audioMapRaw = JSON.parse(fs.readFileSync(audioMapPath, 'utf8'));
    console.log('   ✅ Loaded ' + Object.keys(audioMapRaw).length + ' mappings\n');

    // Convert to ref→url mapping
    const refAudioMap = {};
    let validEntries = 0;

    for (const [filename, data] of Object.entries(audioMapRaw)) {
      if (!data || !data.book || data.chapter === undefined || data.verse === undefined || !data.google_drive_url) {
        continue;
      }

      const bookName = BOOKS[data.book];
      if (!bookName) {
        continue; // Skip unknown books
      }

      const ref = bookName + ' ' + data.chapter + ':' + data.verse;
      refAudioMap[ref] = data.google_drive_url;
      validEntries++;
    }

    console.log('📊 Total valid refs: ' + validEntries + '\n');

    // Fetch ALL verses
    console.log('📥 Fetching ALL verses...');
    const { data: afghans } = await supabase.from('verses').select('ref');
    const { data: yousafzais } = await supabase.from('verses_yousafzai').select('ref');

    console.log('   Afghan: ' + afghans.length);
    console.log('   Yousafzai: ' + yousafzais.length + '\n');

    // Build update lists
    const afghanRefs = [];
    const yousafzaiRefs = [];

    afghans.forEach(v => {
      if (refAudioMap[v.ref]) {
        afghanRefs.push({ ref: v.ref, audio_url: refAudioMap[v.ref], audio_source: 'google_drive' });
      }
    });

    yousafzais.forEach(v => {
      if (refAudioMap[v.ref]) {
        yousafzaiRefs.push({ ref: v.ref, audio_url: refAudioMap[v.ref], audio_source: 'google_drive' });
      }
    });

    console.log('🔗 Matches found:');
    console.log('   Afghan: ' + afghanRefs.length);
    console.log('   Yousafzai: ' + yousafzaiRefs.length + '\n');

    // Update with 50 worker pool
    const POOL = 50;

    console.log('🇦🇫 Updating Afghan verses (parallel)...');
    let afghantUpdated = 0;
    
    for (let i = 0; i < afghanRefs.length; i += POOL) {
      const batch = afghanRefs.slice(i, i + POOL);
      const promises = batch.map(v =>
        supabase
          .from('verses')
          .update({ audio_url: v.audio_url, audio_source: v.audio_source })
          .eq('ref', v.ref)
      );

      const results = await Promise.all(promises);
      const successCount = results.filter(r => !r.error).length;
      afghantUpdated += successCount;

      const pct = Math.round(((i + POOL) / afghanRefs.length) * 100);
      process.stdout.write('\r   ' + pct + '% (' + afghantUpdated + '/' + afghanRefs.length + ')');
    }
    console.log('\n   ✅ Updated: ' + afghantUpdated + '\n');

    console.log('🇦🇫 Updating Yousafzai verses (parallel)...');
    let yousafzaiUpdated = 0;
    
    for (let i = 0; i < yousafzaiRefs.length; i += POOL) {
      const batch = yousafzaiRefs.slice(i, i + POOL);
      const promises = batch.map(v =>
        supabase
          .from('verses_yousafzai')
          .update({ audio_url: v.audio_url, audio_source: v.audio_source })
          .eq('ref', v.ref)
      );

      const results = await Promise.all(promises);
      const successCount = results.filter(r => !r.error).length;
      yousafzaiUpdated += successCount;

      const pct = Math.round(((i + POOL) / yousafzaiRefs.length) * 100);
      process.stdout.write('\r   ' + pct + '% (' + yousafzaiUpdated + '/' + yousafzaiRefs.length + ')');
    }
    console.log('\n   ✅ Updated: ' + yousafzaiUpdated + '\n');

    // Verify
    console.log('📊 FINAL STATUS:');
    const { count: afghantAudioCount } = await supabase
      .from('verses').select('*', { count: 'exact', head: true })
      .not('audio_url', 'is', null);
    const { count: yousafzaiAudioCount } = await supabase
      .from('verses_yousafzai').select('*', { count: 'exact', head: true })
      .not('audio_url', 'is', null);
    const { count: afghantotal } = await supabase
      .from('verses').select('*', { count: 'exact', head: true });
    const { count: yousafzaitotal } = await supabase
      .from('verses_yousafzai').select('*', { count: 'exact', head: true });

    console.log('   Afghan: ' + afghantAudioCount + '/' + afghantotal + ' (' + ((afghantAudioCount/afghantotal)*100).toFixed(1) + '%)');
    console.log('   Yousafzai: ' + yousafzaiAudioCount + '/' + yousafzaitotal + ' (' + ((yousafzaiAudioCount/yousafzaitotal)*100).toFixed(1) + '%)\n');

    // Spot checks
    const { data: genesis } = await supabase
      .from('verses').select('ref, audio_url').eq('ref', 'Genesis 1:1').single();
    const { data: matthew } = await supabase
      .from('verses').select('ref, audio_url').eq('ref', 'Matthew 1:1').single();
    const { data: psalm1 } = await supabase
      .from('verses').select('ref, audio_url').eq('ref', 'Psalms 1:1').single();

    console.log('🔍 SPOT CHECKS:');
    console.log('   Genesis 1:1: ' + (genesis?.audio_url ? '✅' : '❌'));
    console.log('   Matthew 1:1: ' + (matthew?.audio_url ? '✅' : '❌'));
    console.log('   Psalms 1:1: ' + (psalm1?.audio_url ? '✅' : '❌'));

    console.log('\n✅ COMPLETE!\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

populateAudioUrls();
