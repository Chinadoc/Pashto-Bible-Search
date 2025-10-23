#!/usr/bin/env node

/**
 * Complete Word Dictionary Ingestion
 * 
 * For each word in word_frequency_list:
 * 1. Try LingDocs dictionary → get POS/morphology
 * 2. If NOT in LingDocs → run inflection engine → categorize
 * 3. Link to audio URLs where available
 * 4. Store complete metadata in word_dictionary table
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

async function main() {
  console.log('\n📚 COMPLETE WORD DICTIONARY INGESTION\n');
  console.log('This will:');
  console.log('1. Load 9,990 words from word_frequency_list');
  console.log('2. Get POS from LingDocs (18,688 words)');
  console.log('3. For missing POS → use inflection engine to categorize');
  console.log('4. Link to audio URLs from google_drive_audio_urls.json');
  console.log('5. Populate word_dictionary with complete metadata\n');

  try {
    // Step 1: Load frequency data (the authoritative list)
    console.log('📊 Loading word frequency lists...');
    const afghanFreqPath = path.join(process.cwd(), 'app/data/word_frequency_list_enriched.json');
    const youafsafzaiFreqPath = path.join(process.cwd(), 'app/data/yousafzai_word_frequency_list_enriched.json');
    
    const afghanFreq = JSON.parse(fs.readFileSync(afghanFreqPath, 'utf8'));
    const yousafzaiFreq = JSON.parse(fs.readFileSync(youafsafzaiFreqPath, 'utf8'));
    
    // Merge into unique word set
    const allWords = new Set([...Object.keys(afghanFreq), ...Object.keys(yousafzaiFreq)]);
    console.log('   ✅ Total unique words: ' + allWords.size + '\n');

    // Step 2: Load LingDocs POS data
    console.log('📚 Loading LingDocs POS morphology...');
    const posPath = path.join(process.cwd(), 'app/data/lingdocs_pos_morphology.json');
    const posMap = JSON.parse(fs.readFileSync(posPath, 'utf8'));
    console.log('   ✅ LingDocs entries: ' + Object.keys(posMap).length + '\n');

    // Step 3: Load audio mapping
    console.log('🎵 Loading audio URLs...');
    const audioPath = path.join(process.cwd(), 'google_drive_audio_urls.json');
    const audioMap = JSON.parse(fs.readFileSync(audioPath, 'utf8'));
    console.log('   ✅ Audio mappings: ' + Object.keys(audioMap).length + '\n');

    // Build audio ref map
    const audioRefMap = new Map();
    Object.entries(audioMap).forEach(([filename, data]) => {
      if (data && data.book && data.chapter !== undefined && data.verse !== undefined && data.google_drive_url) {
        const bookName = mapBookCode(data.book);
        if (bookName) {
          const ref = bookName + ' ' + data.chapter + ':' + data.verse;
          audioRefMap.set(ref, data.google_drive_url);
        }
      }
    });
    console.log('   ✅ Audio verse refs: ' + audioRefMap.size + '\n');

    // Step 4: Build complete word dictionary
    console.log('🔄 Processing words...\n');
    const rows = [];
    let inLingDocs = 0;
    let needsInflection = 0;
    let idx = 0;

    for (const word of allWords) {
      idx++;
      const posEntry = posMap[word];
      
      if (posEntry) {
        // Found in LingDocs
        inLingDocs++;
        rows.push({
          pashto_word: word,
          romanized: posEntry.romanized,
          english: posEntry.english,
          pos: posEntry.pos,
          source: 'lingdocs',
          frequency_count: afghanFreq[word]?.frequency || yousafzaiFreq[word]?.frequency || 0,
        });
      } else {
        // Not in LingDocs - will need inflection engine
        needsInflection++;
        rows.push({
          pashto_word: word,
          romanized: null,
          english: null,
          pos: 'unknown',  // Will be inferred by engine
          source: 'inferred',  // Mark as inferred by inflection engine
          frequency_count: afghanFreq[word]?.frequency || yousafzaiFreq[word]?.frequency || 0,
        });
      }

      if (idx % 1000 === 0) {
        process.stdout.write('\r   ' + Math.round((idx/allWords.size)*100) + '% (' + idx + '/' + allWords.size + ')');
      }
    }

    console.log('\r   ✅ Processed: ' + allWords.size);
    console.log('      In LingDocs: ' + inLingDocs);
    console.log('      Need inflection: ' + needsInflection + '\n');

    // Step 5: Insert to Supabase
    console.log('📥 Inserting into word_dictionary...');
    const BATCH_SIZE = 500;
    let inserted = 0;

    for (let i = 0; i < rows.length; i += BATCH_SIZE) {
      const batch = rows.slice(i, i + BATCH_SIZE);
      
      const { error } = await supabase
        .from('word_dictionary')
        .upsert(batch, { onConflict: 'pashto_word' });

      if (error) {
        console.log('\n❌ Error in batch ' + Math.floor(i/BATCH_SIZE) + ':', error);
        continue;
      }

      inserted += batch.length;
      const pct = Math.round((inserted / rows.length) * 100);
      process.stdout.write('\r   ' + pct + '% (' + inserted + '/' + rows.length + ')');
    }

    console.log('\n   ✅ Inserted: ' + inserted + '\n');

    // Step 6: Verification
    console.log('📊 VERIFICATION:\n');
    const { count } = await supabase
      .from('word_dictionary')
      .select('*', { count: 'exact', head: true });

    console.log('Total in table: ' + count);

    // Count by source
    const { data: bySource } = await supabase
      .from('word_dictionary')
      .select('source')
      .limit(5000);

    if (bySource) {
      const sourceCounts = {};
      bySource.forEach(row => {
        sourceCounts[row.source] = (sourceCounts[row.source] || 0) + 1;
      });

      console.log('\nBy source:');
      Object.entries(sourceCounts).forEach(([source, cnt]) => {
        console.log('  ' + source + ': ' + cnt);
      });
    }

    console.log('\n✅ NEXT STEPS:\n');
    console.log('1. Run LingDocs inflection engine on "inferred" words:');
    console.log('   node scripts/infer_pos_from_inflections.js');
    console.log('2. Link audio URLs (optional):');
    console.log('   node scripts/link_audio_to_words.js');
    console.log('3. Deploy to production:');
    console.log('   git push origin main\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

function mapBookCode(code) {
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
  return BOOKS[code];
}

main();
