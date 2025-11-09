/**
 * Script to link R2 audio files to verses in D1 database
 * 
 * This script:
 * 1. Lists all audio files in R2 bucket
 * 2. Parses filenames to extract book/chapter/verse
 * 3. Updates verses_afghan2023 and verses_yousafzai tables with audio_r2_key
 * 
 * Run via: npx tsx scripts/link-r2-audio-to-verses.ts
 * Or via Cloudflare Worker API endpoint
 */

import { Env } from '../cloudflare/worker-api';

interface R2Object {
  key: string;
  size: number;
  uploaded: Date;
}

/**
 * Parse R2 key to extract book, chapter, verse, translation
 * Format: {translation}/{testament}/{book}{chapter}_verse_{verse:03d}.mp3
 * Example: afghan2023/nt/acts10_verse_001.mp3
 */
function parseR2Key(key: string): {
  translation: 'afghan2023' | 'yousafzai2019';
  testament: 'OT' | 'NT';
  book: string;
  chapter: number;
  verse: number;
} | null {
  // Remove leading slash if present
  const cleanKey = key.startsWith('/') ? key.slice(1) : key;
  
  // Match pattern: {translation}/{testament}/{book}{chapter}_verse_{verse}.mp3
  const match = cleanKey.match(/^(afghan2023|yousafzai2019)\/(ot|nt)\/(.+?)(\d+)_verse_(\d+)\.mp3$/i);
  
  if (!match) {
    return null;
  }
  
  const [, translation, testament, book, chapter, verse] = match;
  
  return {
    translation: translation.toLowerCase() === 'yousafzai2019' ? 'yousafzai2019' : 'afghan2023',
    testament: testament.toUpperCase() === 'OT' ? 'OT' : 'NT',
    book: book.trim(),
    chapter: parseInt(chapter, 10),
    verse: parseInt(verse, 10),
  };
}

/**
 * Normalize book name to match database format
 * Handles variations like "acts" -> "Acts", "2john" -> "2 John"
 */
function normalizeBookName(bookSlug: string): string {
  // Remove numbers from start/end temporarily
  const hasLeadingNumber = /^\d+/.test(bookSlug);
  const hasTrailingNumber = /\d+$/.test(bookSlug);
  
  let baseName = bookSlug;
  let leadingNum = '';
  let trailingNum = '';
  
  if (hasLeadingNumber) {
    const match = bookSlug.match(/^(\d+)(.+)/);
    if (match) {
      leadingNum = match[1];
      baseName = match[2];
    }
  }
  
  if (hasTrailingNumber && !hasLeadingNumber) {
    const match = baseName.match(/^(.+?)(\d+)$/);
    if (match) {
      baseName = match[1];
      trailingNum = match[2];
    }
  }
  
  // Capitalize first letter
  const capitalized = baseName.charAt(0).toUpperCase() + baseName.slice(1);
  
  // Common book name mappings
  const bookMap: Record<string, string> = {
    'acts': 'Acts',
    'matthew': 'Matthew',
    'mark': 'Mark',
    'luke': 'Luke',
    'john': 'John',
    'romans': 'Romans',
    'corinthians': '1 Corinthians',
    'corinthians1': '1 Corinthians',
    'corinthians2': '2 Corinthians',
    'galatians': 'Galatians',
    'ephesians': 'Ephesians',
    'philippians': 'Philippians',
    'colossians': 'Colossians',
    'thessalonians': '1 Thessalonians',
    'thessalonians1': '1 Thessalonians',
    'thessalonians2': '2 Thessalonians',
    'timothy': '1 Timothy',
    'timothy1': '1 Timothy',
    'timothy2': '2 Timothy',
    'titus': 'Titus',
    'philemon': 'Philemon',
    'hebrews': 'Hebrews',
    'james': 'James',
    'peter': '1 Peter',
    'peter1': '1 Peter',
    'peter2': '2 Peter',
    'jude': 'Jude',
    'revelation': 'Revelation',
    'psalms': 'Psalms',
    'proverbs': 'Proverbs',
    'song': 'Song of Solomon',
    'songofsolomon': 'Song of Solomon',
  };
  
  // Try exact match first
  if (bookMap[baseName.toLowerCase()]) {
    return bookMap[baseName.toLowerCase()];
  }
  
  // Try with leading number
  if (leadingNum && bookMap[baseName.toLowerCase()]) {
    return `${leadingNum} ${bookMap[baseName.toLowerCase()]}`;
  }
  
  // Try common patterns
  if (baseName.toLowerCase().includes('john')) {
    if (leadingNum) return `${leadingNum} John`;
    if (trailingNum) return `${trailingNum} John`;
    return 'John';
  }
  
  if (baseName.toLowerCase().includes('peter')) {
    if (leadingNum) return `${leadingNum} Peter`;
    if (trailingNum) return `${trailingNum} Peter`;
    return '1 Peter';
  }
  
  if (baseName.toLowerCase().includes('corinthians')) {
    if (leadingNum) return `${leadingNum} Corinthians`;
    if (trailingNum) return `${trailingNum} Corinthians`;
    return '1 Corinthians';
  }
  
  // Default: return capitalized with numbers
  if (leadingNum) return `${leadingNum} ${capitalized}`;
  if (trailingNum) return `${trailingNum} ${capitalized}`;
  return capitalized;
}

/**
 * Main function to link R2 audio files to verses
 */
async function linkR2AudioToVerses(env: Env): Promise<{
  processed: number;
  updated: number;
  errors: number;
  unmatched: string[];
}> {
  const stats = {
    processed: 0,
    updated: 0,
    errors: 0,
    unmatched: [] as string[],
  };
  
  console.log('🔍 Listing all audio files in R2...');
  
  // List all objects in R2 bucket
  const allObjects: R2Object[] = [];
  let cursor: string | undefined;
  
  do {
    const listResult = await env.AUDIO_BUCKET.list({
      limit: 1000,
      cursor,
    });
    
    if (listResult.objects) {
      allObjects.push(...listResult.objects.map(obj => ({
        key: obj.key,
        size: obj.size,
        uploaded: obj.uploaded,
      })));
    }
    
    cursor = listResult.cursor;
  } while (cursor);
  
  console.log(`📦 Found ${allObjects.length} objects in R2`);
  
  // Filter to only .mp3 files
  const audioFiles = allObjects.filter(obj => obj.key.endsWith('.mp3'));
  console.log(`🎵 Found ${audioFiles.length} audio files`);
  
  // Process each audio file
  for (const audioFile of audioFiles) {
    stats.processed++;
    
    const parsed = parseR2Key(audioFile.key);
    
    if (!parsed) {
      console.warn(`⚠️  Could not parse R2 key: ${audioFile.key}`);
      stats.unmatched.push(audioFile.key);
      continue;
    }
    
    const { translation, testament, book, chapter, verse } = parsed;
    const normalizedBook = normalizeBookName(book);
    
    // Determine table name
    const tableName = translation === 'yousafzai2019' 
      ? 'verses_yousafzai' 
      : 'verses_afghan2023';
    
    try {
      // Check if verse exists
      const verseCheck = await env.DB.prepare(
        `SELECT id, audio_r2_key FROM ${tableName} 
         WHERE book = ? AND chapter = ? AND verse = ? 
         LIMIT 1`
      ).bind(normalizedBook, chapter, verse).first();
      
      if (!verseCheck) {
        console.warn(`⚠️  Verse not found: ${normalizedBook} ${chapter}:${verse} (from ${audioFile.key})`);
        stats.unmatched.push(audioFile.key);
        continue;
      }
      
      // Skip if already linked
      if (verseCheck.audio_r2_key === audioFile.key) {
        continue;
      }
      
      // Update verse with audio_r2_key
      await env.DB.prepare(
        `UPDATE ${tableName} 
         SET audio_r2_key = ?, updated_at = strftime('%s', 'now')
         WHERE id = ?`
      ).bind(audioFile.key, verseCheck.id).run();
      
      stats.updated++;
      
      if (stats.updated % 100 === 0) {
        console.log(`✅ Updated ${stats.updated} verses...`);
      }
      
    } catch (error: any) {
      console.error(`❌ Error processing ${audioFile.key}:`, error.message);
      stats.errors++;
    }
  }
  
  return stats;
}

/**
 * Cloudflare Worker endpoint handler
 */
export async function handleLinkR2Audio(request: Request, env: Env): Promise<Response> {
  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }
  
  try {
    console.log('🚀 Starting R2 audio linking process...');
    const stats = await linkR2AudioToVerses(env);
    
    return new Response(JSON.stringify({
      success: true,
      stats,
      message: `Processed ${stats.processed} files, updated ${stats.updated} verses`,
    }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('❌ Linking failed:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message,
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

// For standalone execution (if running via tsx)
if (import.meta.url === `file://${process.argv[1]}`) {
  console.log('⚠️  This script must be run via Cloudflare Worker API endpoint');
  console.log('   Add this route to worker-api.ts:');
  console.log('   if (path === "/api/link-r2-audio" && request.method === "POST") {');
  console.log('     return handleLinkR2Audio(request, env);');
  console.log('   }');
  process.exit(1);
}

