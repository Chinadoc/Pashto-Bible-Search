#!/usr/bin/env node

/**
 * Fast audio URL population with filename→ref mapping
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

// Book name mapping
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
  console.log('\n🎵 AUDIO URL POPULATION (Filename→Ref Mapping)\n');

  try {
    const audioMapPath = path.join(process.cwd(), 'google_drive_audio_urls.json');
    console.log('📖 Loading audio map...');
    const audioMap = JSON.parse(fs.readFileSync(audioMapPath, 'utf8'));
    console.log('   ✅ Loaded ' + Object.keys(audioMap).length + ' mappings\n');

    // Parse filenames to ref format
    console.log('🔄 Converting filenames to verse refs...');
    const refAudioMap = {};
    for (const [filename, url] of Object.entries(audioMap)) {
      // Extract: "amos001_verse_001.mp3" → "amos", "001", "001"
      const match = filename.match(/^([a-z0-9]+?)(\d+)_verse_(\d+)/);
      if (!match) continue;

      const [, bookCode, chapter, verse] = match;
      const bookName = BOOKS[bookCode];
      
      if (!bookName) {
        console.log('   ⚠️  Unknown book: ' + bookCode);
        continue;
      }

      const ref = bookName + ' ' + parseInt(chapter) + ':' + parseInt(verse);
      refAudioMap[ref] = url;
    }

    console.log('   ✅ Converted to ' + Object.keys(refAudioMap).length + ' refs\n');

    // Fetch all verses to match
    console.log('📥 Fetching verses from Supabase...');
    const { data: afghans, count: afghantotal } = await supabase
      .from('verses').select('id, ref', { count: 'exact' });
    const { data: yousafzais, count: yousafzaitotal } = await supabase
      .from('verses_yousafzai').select('id, ref', { count: 'exact' });

    console.log('   Afghan: ' + afghantotal + ' verses');
    console.log('   Yousafzai: ' + yousafzaitotal + ' verses\n');

    // Match and update Afghan
    console.log('🇦🇫 Updating Afghan verses...');
    const POOL = 20;
    let afghantUpdated = 0;
    
    for (let i = 0; i < afghans.length; i += POOL) {
      const batch = afghans.slice(i, i + POOL);
      const promises = batch.map(verse => {
        if (refAudioMap[verse.ref]) {
          afghantUpdated++;
          return supabase
            .from('verses')
            .update({ audio_url: refAudioMap[verse.ref], audio_source: 'google_drive' })
            .eq('ref', verse.ref);
        }
        return Promise.resolve();
      });

      await Promise.all(promises);
      const pct = Math.round(((i + POOL) / afghans.length) * 100);
      process.stdout.write('\r   ' + pct + '% (' + afghantUpdated + '/' + afghans.length + ')');
    }
    console.log('\n   ✅ Updated: ' + afghantUpdated + '\n');

    // Match and update Yousafzai
    console.log('🇦🇫 Updating Yousafzai verses...');
    let yousafzaiUpdated = 0;
    
    for (let i = 0; i < yousafzais.length; i += POOL) {
      const batch = yousafzais.slice(i, i + POOL);
      const promises = batch.map(verse => {
        if (refAudioMap[verse.ref]) {
          yousafzaiUpdated++;
          return supabase
            .from('verses_yousafzai')
            .update({ audio_url: refAudioMap[verse.ref], audio_source: 'google_drive' })
            .eq('ref', verse.ref);
        }
        return Promise.resolve();
      });

      await Promise.all(promises);
      const pct = Math.round(((i + POOL) / yousafzais.length) * 100);
      process.stdout.write('\r   ' + pct + '% (' + yousafzaiUpdated + '/' + yousafzais.length + ')');
    }
    console.log('\n   ✅ Updated: ' + yousafzaiUpdated + '\n');

    // Verify
    console.log('📊 VERIFICATION:');
    const { count: afghantAudioCount } = await supabase
      .from('verses').select('*', { count: 'exact', head: true })
      .not('audio_url', 'is', null);
    const { count: yousafzaiAudioCount } = supabase
      .from('verses_yousafzai').select('*', { count: 'exact', head: true })
      .not('audio_url', 'is', null);

    console.log('   Afghan: ' + afghantAudioCount + '/' + afghantotal + ' (' + ((afghantAudioCount/afghantotal)*100).toFixed(1) + '%)');
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

populateAudioUrls();
