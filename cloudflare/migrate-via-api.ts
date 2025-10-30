/**
 * Direct D1 migration - Load all local data and call a worker endpoint
 */

import { readFileSync } from 'fs';

const VERCEL_URL = process.env.VERCEL_URL || 'http://localhost:3000';

interface Verse {
  ref: string;
  book: string;
  chapter: number;
  verse: number;
  text: string;
  text_html?: string;
  audio_storage_filename?: string;
  audio_verse_url?: string;
  tags?: any[];
}

function getTestament(book: string): 'OT' | 'NT' {
  const otBooks = new Set([
    'Genesis', 'Exodus', 'Leviticus', 'Numbers', 'Deuteronomy',
    'Joshua', 'Judges', 'Ruth', 'Psalms', 'Proverbs', 'Isaiah',
    'Jeremiah', 'Lamentations', 'Ezekiel', 'Daniel', 'Hosea', 'Joel',
    'Amos', 'Obadiah', 'Jonah', 'Micah', 'Nahum', 'Habakkuk',
    'Zephaniah', 'Haggai', 'Zechariah', 'Malachi', 'Job', 'Esther',
    'Ezra', 'Nehemiah', 'Ecclesiastes', 'Song of Solomon', 'Songofsongs'
  ]);
  return otBooks.has(book) ? 'OT' : 'NT';
}

async function migrateData() {
  console.log('📖 Loading data...\n');

  // Load Yousafzai
  const yousafzaiData: any[] = JSON.parse(readFileSync('yousafzai_all_verses.json', 'utf-8'));
  console.log(`   ✅ Yousafzai: ${yousafzaiData.length} verses`);

  // Load Afghan
  const zlib = require('zlib');
  const compressed = readFileSync('cache/verses.json.gz');
  const decompressed = zlib.gunzipSync(compressed);
  const afghanObj = JSON.parse(decompressed.toString('utf-8'));
  const afghanData = Object.values(afghanObj);
  console.log(`   ✅ Afghan: ${afghanData.length} verses`);

  console.log('\n🔄 Processing data...\n');

  // Process Yousafzai
  const yousafzaiRows: any[] = yousafzaiData.map((v: any) => ({
    ref: `${v.book} ${v.chapter}:${v.verse}`,
    book: v.book,
    chapter: v.chapter,
    verse: v.verse,
    text: v.text,
    text_html: v.text_html || null,
    testament: getTestament(v.book),
    translation_key: 'yousafzai2019',
    dialect: 'yousafzai',
    tags: v.tags || [],
    audio_r2_key: v.audio_storage_filename ? `yousafzai/${getTestament(v.book).toLowerCase()}/${v.audio_storage_filename}` : null,
    audio_public_url: v.audio_verse_url || null,
  }));

  // Process Afghan
  const afghanRows: any[] = (afghanData as any[])
    .map((v: any) => {
      const ref = v.ref || '';
      const parsed = ref.match(/^(.+?)\s+(\d+):(\d+)$/);
      if (!parsed) return null;

      const book = parsed[1];
      const chapter = parseInt(parsed[2]);
      const verseNum = parseInt(parsed[3]);

      return {
        ref: ref,
        book: book,
        chapter: chapter,
        verse: verseNum,
        text: v.text || '',
        text_html: null,
        testament: getTestament(book),
        translation_key: 'afghan2023',
        dialect: 'afghan',
        tags: [],
        audio_r2_key: `afghan2023/${getTestament(book).toLowerCase()}/${book.toLowerCase().replace(/\s+/g, '')}${chapter}_verse_${verseNum.toString().padStart(3, '0')}.mp3`,
        audio_public_url: null,
      };
    })
    .filter(v => v !== null);

  const totalRows = yousafzaiRows.length + afghanRows.length;
  console.log(`   ✅ Yousafzai processed: ${yousafzaiRows.length} rows`);
  console.log(`   ✅ Afghan processed: ${afghanRows.length} rows`);
  console.log(`   📊 Total: ${totalRows} rows to migrate\n`);

  // Upload in batches
  const batchSize = 2000;
  const allRows = [...yousafzaiRows, ...afghanRows];

  console.log('📤 Uploading to D1 via API...\n');

  for (let i = 0; i < allRows.length; i += batchSize) {
    const batch = allRows.slice(i, i + batchSize);
    const batchNum = Math.floor(i / batchSize) + 1;
    const totalBatches = Math.ceil(allRows.length / batchSize);

    console.log(`[${batchNum}/${totalBatches}] Uploading ${batch.length} verses...`);

    try {
      const response = await fetch(`${VERCEL_URL}/api/d1-migrate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ verses: batch }),
      });

      if (!response.ok) {
        const error = await response.text();
        console.error(`   ❌ Error: ${response.status} - ${error}`);
      } else {
        const result = await response.json();
        console.log(`   ✅ ${result.inserted || batch.length} inserted`);
      }
    } catch (error: any) {
      console.error(`   ❌ Network error: ${error.message}`);
    }

    // Delay between batches
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  console.log('\n✅ Migration complete!');
}

migrateData().catch(console.error);
