#!/usr/bin/env node
/**
 * Scrape Yousafzai Psalms from afghanbibles.org and import to D1
 * 
 * Source: https://afghanbibles.org/eng/pashto-bible/psalms/psalms-{chapter}?prefdialect=yusufzai
 * 
 * Usage:
 *   node scripts/scrape-yousafzai-psalms.js
 *   node scripts/scrape-yousafzai-psalms.js --book Proverbs --chapters 31
 */

const https = require('https');
const http = require('http');

// Configuration
const CLOUDFLARE_WORKER_URL = process.env.CLOUDFLARE_WORKER_URL || 'https://pashtobiblesearch.jeremy-samuels17.workers.dev';

// Book configurations with chapter counts
const BOOKS_CONFIG = {
  'Genesis': 50,
  'Exodus': 40,
  'Leviticus': 27,
  'Numbers': 36,
  'Deuteronomy': 34,
  'Joshua': 24,
  'Judges': 21,
  'Ruth': 4,
  '1-Samuel': 31,
  '2-Samuel': 24,
  '1-Kings': 22,
  '2-Kings': 25,
  '1-Chronicles': 29,
  '2-Chronicles': 36,
  'Ezra': 10,
  'Nehemiah': 13,
  'Esther': 10,
  'Job': 42,
  'Psalms': 150,
  'Proverbs': 31,
  'Ecclesiastes': 12,
  'Song-of-Songs': 8,
  'Isaiah': 66,
  'Jeremiah': 52,
  'Lamentations': 5,
  'Ezekiel': 48,
  'Daniel': 12,
  'Hosea': 14,
  'Joel': 3,
  'Amos': 9,
  'Obadiah': 1,
  'Jonah': 4,
  'Micah': 7,
  'Nahum': 3,
  'Habakkuk': 3,
  'Zephaniah': 3,
  'Haggai': 2,
  'Zechariah': 14,
  'Malachi': 4,
  'Matthew': 28,
  'Mark': 16,
  'Luke': 24,
  'John': 21,
  'Acts': 28,
  'Romans': 16,
  '1-Corinthians': 16,
  '2-Corinthians': 13,
  'Galatians': 6,
  'Ephesians': 6,
  'Philippians': 4,
  'Colossians': 4,
  '1-Thessalonians': 5,
  '2-Thessalonians': 3,
  '1-Timothy': 6,
  '2-Timothy': 4,
  'Titus': 3,
  'Philemon': 1,
  'Hebrews': 13,
  'James': 5,
  '1-Peter': 5,
  '2-Peter': 3,
  '1-John': 5,
  '2-John': 1,
  '3-John': 1,
  'Jude': 1,
  'Revelation': 22,
};

// Old Testament books
const OT_BOOKS = new Set([
  'Genesis', 'Exodus', 'Leviticus', 'Numbers', 'Deuteronomy', 'Joshua', 'Judges', 'Ruth',
  '1-Samuel', '2-Samuel', '1-Kings', '2-Kings', '1-Chronicles', '2-Chronicles',
  'Ezra', 'Nehemiah', 'Esther', 'Job', 'Psalms', 'Proverbs', 'Ecclesiastes', 'Song-of-Songs',
  'Isaiah', 'Jeremiah', 'Lamentations', 'Ezekiel', 'Daniel', 'Hosea', 'Joel', 'Amos',
  'Obadiah', 'Jonah', 'Micah', 'Nahum', 'Habakkuk', 'Zephaniah', 'Haggai', 'Zechariah', 'Malachi'
]);

/**
 * Fetch HTML from URL
 */
function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    protocol.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        'Accept': 'text/html,application/xhtml+xml',
      }
    }, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        // Follow redirect
        fetchUrl(res.headers.location).then(resolve).catch(reject);
        return;
      }
      
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
      res.on('error', reject);
    }).on('error', reject);
  });
}

/**
 * Parse verses from afghanbibles.org HTML
 * The structure is:
 * <p class="swv q1">
 *   <span class="verseno c" id="v1" data-name="Psa.1.1">۱</span>
 *   نو هغه بختور دے او بختور به وى
 * </p>
 */
function parseVersesFromHtml(html, book, chapter) {
  const verses = [];
  
  // Match verse patterns - they're in <p> tags with class containing "swv" or "q1" or "q2"
  // The verse number is in a <span class="verseno"> tag
  const versePattern = /<p[^>]*class="[^"]*(?:swv|q[12])[^"]*"[^>]*>[\s\S]*?<span[^>]*class="[^"]*verseno[^"]*"[^>]*id="v(\d+)"[^>]*>[^<]*<\/span>([\s\S]*?)<\/p>/gi;
  
  let match;
  const versesMap = new Map();
  
  while ((match = versePattern.exec(html)) !== null) {
    const verseNum = parseInt(match[1], 10);
    let text = match[2]
      .replace(/<[^>]+>/g, '') // Remove HTML tags
      .replace(/&nbsp;/g, ' ')
      .replace(/&[a-z]+;/gi, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    
    if (text && verseNum) {
      // Accumulate text for verses that span multiple <p> tags
      if (versesMap.has(verseNum)) {
        versesMap.set(verseNum, versesMap.get(verseNum) + ' ' + text);
      } else {
        versesMap.set(verseNum, text);
      }
    }
  }
  
  // Also try alternative pattern for verses without swv class
  const altPattern = /<span[^>]*class="[^"]*verseno[^"]*"[^>]*id="v(\d+)"[^>]*data-name="[^"]*"[^>]*>[^<]*<\/span>([^<]+)/gi;
  
  while ((match = altPattern.exec(html)) !== null) {
    const verseNum = parseInt(match[1], 10);
    let text = match[2]
      .replace(/&nbsp;/g, ' ')
      .replace(/&[a-z]+;/gi, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    
    if (text && verseNum && !versesMap.has(verseNum)) {
      versesMap.set(verseNum, text);
    }
  }
  
  // Convert map to array
  for (const [verseNum, text] of versesMap) {
    const bookName = book.replace(/-/g, ' '); // Convert "1-Samuel" to "1 Samuel"
    verses.push({
      book: bookName,
      chapter,
      verse: verseNum,
      text,
      testament: OT_BOOKS.has(book) ? 'OT' : 'NT',
      audio_r2_key: `yousafzai/${OT_BOOKS.has(book) ? 'ot' : 'nt'}/yousafzai_${book.toLowerCase().replace(/-/g, '')}${String(chapter).padStart(3, '0')}_verse_${String(verseNum).padStart(3, '0')}.mp3`
    });
  }
  
  return verses.sort((a, b) => a.verse - b.verse);
}

/**
 * Store verses in D1 via Cloudflare Worker
 */
async function storeVersesInD1(verses) {
  if (verses.length === 0) return { success: true, count: 0 };
  
  const response = await fetch(`${CLOUDFLARE_WORKER_URL}/api/import-yousafzai-verses`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ verses })
  });
  
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Failed to store verses: ${response.status} - ${text}`);
  }
  
  return response.json();
}

/**
 * Check if chapter exists in D1
 */
async function checkChapterExists(book, chapter) {
  const bookName = book.replace(/-/g, ' ');
  const url = `${CLOUDFLARE_WORKER_URL}/api/verses?book=${encodeURIComponent(bookName)}&chapter=${chapter}&table=verses_yousafzai`;
  
  const response = await fetch(url);
  if (!response.ok) return false;
  
  const data = await response.json();
  return data.count > 0;
}

/**
 * Scrape a single chapter
 */
async function scrapeChapter(book, chapter) {
  const urlBook = book.toLowerCase();
  const url = `https://afghanbibles.org/eng/pashto-bible/${urlBook}/${urlBook}-${chapter}?prefdialect=yusufzai`;
  
  console.log(`  Fetching ${url}...`);
  
  try {
    const html = await fetchUrl(url);
    const verses = parseVersesFromHtml(html, book, chapter);
    
    if (verses.length === 0) {
      console.log(`  ⚠️  No verses found for ${book} ${chapter}`);
      return [];
    }
    
    console.log(`  ✓ Parsed ${verses.length} verses`);
    return verses;
  } catch (err) {
    console.error(`  ✗ Error fetching ${book} ${chapter}:`, err.message);
    return [];
  }
}

/**
 * Main function
 */
async function main() {
  const args = process.argv.slice(2);
  
  // Parse arguments
  let targetBook = null;
  let maxChapters = null;
  let forceRescrape = false;
  
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--book' && args[i + 1]) {
      targetBook = args[i + 1];
      i++;
    } else if (args[i] === '--chapters' && args[i + 1]) {
      maxChapters = parseInt(args[i + 1], 10);
      i++;
    } else if (args[i] === '--force') {
      forceRescrape = true;
    }
  }
  
  // Default to Psalms if no book specified
  if (!targetBook) {
    targetBook = 'Psalms';
  }
  
  const totalChapters = maxChapters || BOOKS_CONFIG[targetBook] || 1;
  
  console.log(`\n🔍 Scraping Yousafzai ${targetBook} (${totalChapters} chapters) from afghanbibles.org\n`);
  
  let totalVerses = 0;
  let chaptersProcessed = 0;
  let chaptersSkipped = 0;
  const allVerses = [];
  
  for (let chapter = 1; chapter <= totalChapters; chapter++) {
    // Check if chapter already exists (unless force rescrape)
    if (!forceRescrape) {
      const exists = await checkChapterExists(targetBook, chapter);
      if (exists) {
        console.log(`  ⏭️  ${targetBook} ${chapter} already exists, skipping`);
        chaptersSkipped++;
        continue;
      }
    }
    
    const verses = await scrapeChapter(targetBook, chapter);
    
    if (verses.length > 0) {
      allVerses.push(...verses);
      totalVerses += verses.length;
      chaptersProcessed++;
    }
    
    // Rate limiting - wait 500ms between requests
    await new Promise(r => setTimeout(r, 500));
    
    // Batch upload every 10 chapters
    if (allVerses.length >= 200) {
      console.log(`\n  📤 Uploading batch of ${allVerses.length} verses...`);
      try {
        const result = await storeVersesInD1(allVerses);
        console.log(`  ✓ Uploaded: ${result.inserted || result.count || allVerses.length} verses\n`);
        allVerses.length = 0; // Clear the array
      } catch (err) {
        console.error(`  ✗ Upload failed:`, err.message);
      }
    }
  }
  
  // Upload remaining verses
  if (allVerses.length > 0) {
    console.log(`\n  📤 Uploading final batch of ${allVerses.length} verses...`);
    try {
      const result = await storeVersesInD1(allVerses);
      console.log(`  ✓ Uploaded: ${result.inserted || result.count || allVerses.length} verses`);
    } catch (err) {
      console.error(`  ✗ Upload failed:`, err.message);
    }
  }
  
  console.log(`\n✅ Complete!`);
  console.log(`   Chapters processed: ${chaptersProcessed}`);
  console.log(`   Chapters skipped (already exist): ${chaptersSkipped}`);
  console.log(`   Total verses scraped: ${totalVerses}`);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});

