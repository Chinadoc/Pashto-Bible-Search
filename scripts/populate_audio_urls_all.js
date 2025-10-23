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

async function fetchAllWithPagination(table) {
  let allData = [];
  let from = 0;
  const pageSize = 1000;

  while (true) {
    const { data } = await supabase
      .from(table)
      .select('ref')
      .range(from, from + pageSize - 1);

    if (!data || data.length === 0) break;
    allData = allData.concat(data);
    from += pageSize;

    if (data.length < pageSize) break;
  }

  return allData;
}

async function populateAudioUrls() {
  console.log('\n🎵 AUDIO URLS FROM GOOGLE DRIVE - ALL VERSES\n');

  try {
    const audioMapPath = path.join(process.cwd(), 'google_drive_audio_urls.json');
    console.log('📖 Loading audio map...');
    const audioMapRaw = JSON.parse(fs.readFileSync(audioMapPath, 'utf8'));
    console.log('   ✅ Loaded ' + Object.keys(audioMapRaw).length + '\n');

    // Convert to ref→url
    const refAudioMap = {};
    for (const [_, data] of Object.entries(audioMapRaw)) {
      if (!data || !data.book || data.chapter === undefined || data.verse === undefined || !data.google_drive_url) continue;
      const bookName = BOOKS[data.book];
      if (!bookName) continue;
      const ref = bookName + ' ' + data.chapter + ':' + data.verse;
      refAudioMap[ref] = data.google_drive_url;
    }

    console.log('📊 Buildable refs: ' + Object.keys(refAudioMap).length + '\n');

    // Fetch ALL verses with pagination
    console.log('📥 Fetching ALL Afghan verses...');
    const afghans = await fetchAllWithPagination('verses');
    console.log('   ✅ ' + afghans.length);

    console.log('📥 Fetching ALL Yousafzai verses...');
    const yousafzais = await fetchAllWithPagination('verses_yousafzai');
    console.log('   ✅ ' + yousafzais.length + '\n');

    // Build update lists
    const afghanUpdates = [];
    const yousafzaiUpdates = [];

    afghans.forEach(v => {
      if (refAudioMap[v.ref]) {
        afghanUpdates.push({ ref: v.ref, audio_url: refAudioMap[v.ref], audio_source: 'google_drive' });
      }
    });

    yousafzais.forEach(v => {
      if (refAudioMap[v.ref]) {
        yousafzaiUpdates.push({ ref: v.ref, audio_url: refAudioMap[v.ref], audio_source: 'google_drive' });
      }
    });

    console.log('🔗 Matches:');
    console.log('   Afghan: ' + afghanUpdates.length);
    console.log('   Yousafzai: ' + yousafzaiUpdates.length + '\n');

    const POOL = 50;

    console.log('🇦🇫 Updating Afghan...');
    let afghantCount = 0;
    for (let i = 0; i < afghanUpdates.length; i += POOL) {
      const batch = afghanUpdates.slice(i, i + POOL);
      const promises = batch.map(v =>
        supabase
          .from('verses')
          .update({ audio_url: v.audio_url, audio_source: v.audio_source })
          .eq('ref', v.ref)
      );
      const results = await Promise.all(promises);
      afghantCount += results.filter(r => !r.error).length;
      const pct = Math.round(((i + POOL) / afghanUpdates.length) * 100);
      process.stdout.write('\r   ' + pct + '% (' + afghantCount + '/' + afghanUpdates.length + ')');
    }
    console.log('\n   ✅ Updated: ' + afghantCount + '\n');

    console.log('🇦🇫 Updating Yousafzai...');
    let yousafzaiCount = 0;
    for (let i = 0; i < yousafzaiUpdates.length; i += POOL) {
      const batch = yousafzaiUpdates.slice(i, i + POOL);
      const promises = batch.map(v =>
        supabase
          .from('verses_yousafzai')
          .update({ audio_url: v.audio_url, audio_source: v.audio_source })
          .eq('ref', v.ref)
      );
      const results = await Promise.all(promises);
      yousafzaiCount += results.filter(r => !r.error).length;
      const pct = Math.round(((i + POOL) / yousafzaiUpdates.length) * 100);
      process.stdout.write('\r   ' + pct + '% (' + yousafzaiCount + '/' + yousafzaiUpdates.length + ')');
    }
    console.log('\n   ✅ Updated: ' + yousafzaiCount + '\n');

    // Final count
    const { count: afghantWithAudio } = await supabase.from('verses').select('*', { count: 'exact', head: true }).not('audio_url', 'is', null);
    const { count: yousafzaiWithAudio } = await supabase.from('verses_yousafzai').select('*', { count: 'exact', head: true }).not('audio_url', 'is', null);
    const { count: afghantotal } = await supabase.from('verses').select('*', { count: 'exact', head: true });
    const { count: yousafzaitotal } = await supabase.from('verses_yousafzai').select('*', { count: 'exact', head: true });

    console.log('📊 FINAL COVERAGE:');
    console.log('   Afghan: ' + afghantWithAudio + '/' + afghantotal + ' (' + ((afghantWithAudio/afghantotal)*100).toFixed(1) + '%)');
    console.log('   Yousafzai: ' + yousafzaiWithAudio + '/' + yousafzaitotal + ' (' + ((yousafzaiWithAudio/yousafzaitotal)*100).toFixed(1) + '%)\n');

    console.log('✅ DONE!\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

populateAudioUrls();
