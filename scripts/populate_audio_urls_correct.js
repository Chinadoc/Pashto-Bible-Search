#!/usr/bin/env node

/**
 * CORRECT audio URL population using structured audio map
 * Audio map: { filename: { book, chapter, verse, google_drive_url } }
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

// Book code to name mapping
const BOOKS = {
  'genesis': 'Genesis', 'exodus': 'Exodus', 'leviticus': 'Leviticus',
  'numbers': 'Numbers', 'deuteronomy': 'Deuteronomy', 'joshua': 'Joshua',
  'judges': 'Judges', '1samuel': '1 Samuel', '2samuel': '2 Samuel',
  '1kings': '1 Kings', '2kings': '2 Kings', '1chronicles': '1 Chronicles',
  '2chronicles': '2 Chronicles', 'ezra': 'Ezra', 'nehemiah': 'Nehemiah',
  'esther': 'Esther', 'job': 'Job', 'psalms': 'Psalms', 'proverbs': 'Proverbs',
  'ecclesiastes': 'Ecclesiastes', 'isaiah': 'Isaiah', 'jeremiah': 'Jeremiah',
  'lamentations': 'Lamentations', 'ezekiel': 'Ezekiel', 'daniel': 'Daniel',
  'hosea': 'Hosea', 'joel': 'Joel', 'amos': 'Amos', 'obadiah': 'Obadiah',
  'jonah': 'Jonah', 'micah': 'Micah', 'nahum': 'Nahum', 'habakkuk': 'Habakkuk',
  'zephaniah': 'Zephaniah', 'haggai': 'Haggai', 'zechariah': 'Zechariah',
  'malachi': 'Malachi', 'matthew': 'Matthew', 'mark': 'Mark', 'luke': 'Luke',
  'john': 'John', 'acts': 'Acts', 'romans': 'Romans', '1corinthians': '1 Corinthians',
  '2corinthians': '2 Corinthians', 'galatians': 'Galatians', 'ephesians': 'Ephesians',
  'philippians': 'Philippians', 'colossians': 'Colossians', '1thessalonians': '1 Thessalonians',
  '2thessalonians': '2 Thessalonians', '1timothy': '1 Timothy', '2timothy': '2 Timothy',
  'titus': 'Titus', 'philemon': 'Philemon', 'hebrews': 'Hebrews', 'james': 'James',
  '1peter': '1 Peter', '2peter': '2 Peter', '1john': '1 John', '2john': '2 John',
  '3john': '3 John', 'jude': 'Jude', 'revelation': 'Revelation'
};

async function populateAudioUrls() {
  console.log('\n🎵 AUDIO URL POPULATION (CORRECT - Structured Map)\n');

  try {
    const audioMapPath = path.join(process.cwd(), 'google_drive_audio_urls.json');
    console.log('📖 Loading audio map...');
    const audioMapRaw = JSON.parse(fs.readFileSync(audioMapPath, 'utf8'));
    
    console.log('   ✅ Loaded ' + Object.keys(audioMapRaw).length + ' mappings\n');

    // Convert structured audio map to ref→url mapping
    const refAudioMap = {};
    let validEntries = 0;

    for (const [filename, data] of Object.entries(audioMapRaw)) {
      if (!data || !data.book || !data.chapter || !data.verse || !data.google_drive_url) {
        continue;
      }

      const bookName = BOOKS[data.book];
      if (!bookName) {
        console.log('⚠️  Unknown book: ' + data.book);
        continue;
      }

      const ref = bookName + ' ' + data.chapter + ':' + data.verse;
      refAudioMap[ref] = data.google_drive_url;
      validEntries++;
    }

    console.log('📊 Converted to ' + validEntries + ' verse refs\n');

    // Split by translation
    const afghanRefs = [];
    const yousafzaiRefs = [];

    // Fetch verses and match
    console.log('📥 Fetching verses from Supabase...');
    const { data: afghans } = await supabase
      .from('verses').select('ref, translation_key').order('id');
    const { data: yousafzais } = await supabase
      .from('verses_yousafzai').select('ref, translation_key').order('id');

    console.log('   Afghan: ' + afghans.length);
    console.log('   Yousafzai: ' + yousafzais.length + '\n');

    // Build lists of matches
    let afghanMatches = 0;
    let yousafzaiMatches = 0;

    afghans.forEach(v => {
      if (refAudioMap[v.ref]) {
        afghanRefs.push({ ref: v.ref, audio_url: refAudioMap[v.ref], audio_source: 'google_drive' });
        afghanMatches++;
      }
    });

    yousafzais.forEach(v => {
      if (refAudioMap[v.ref]) {
        yousafzaiRefs.push({ ref: v.ref, audio_url: refAudioMap[v.ref], audio_source: 'google_drive' });
        yousafzaiMatches++;
      }
    });

    console.log('🔗 Matched verses:');
    console.log('   Afghan: ' + afghanMatches);
    console.log('   Yousafzai: ' + yousafzaiMatches + '\n');

    // Update with 20 worker pool
    const POOL = 20;

    console.log('🇦🇫 Updating Afghan verses (parallel)...');
    let afghanUpdated = 0;
    
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
      afghanUpdated += successCount;

      const pct = Math.round(((i + POOL) / afghanRefs.length) * 100);
      process.stdout.write('\r   ' + pct + '% (' + afghanUpdated + '/' + afghanRefs.length + ')');
    }
    console.log('\n   ✅ Updated: ' + afghanUpdated + '/' + afghanRefs.length + '\n');

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
    console.log('\n   ✅ Updated: ' + yousafzaiUpdated + '/' + yousafzaiRefs.length + '\n');

    // Verify
    console.log('📊 FINAL VERIFICATION:');
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

    const { data: genesis } = await supabase
      .from('verses').select('ref, audio_url').eq('ref', 'Genesis 1:1').single();
    
    console.log('🔍 Spot check - Genesis 1:1:');
    if (genesis?.audio_url) {
      console.log('   ✅ Audio URL: ' + genesis.audio_url.substring(0, 80) + '...');
    } else {
      console.log('   ❌ No audio URL');
    }

    console.log('\n✅ COMPLETE!\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

populateAudioUrls();
