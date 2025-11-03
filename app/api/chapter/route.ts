import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/utils/supabase';
import { getVersesByChapter } from '@/app/lib/cloudflare-d1';

// Type definition for verse from Supabase
interface VerseRow {
  book: string;
  chapter: number;
  verse: number;
  text: string;
  testament?: string;
  dialect?: string | null;
  translation_key?: string | null;
  audio_storage_path?: string | null;
  audio_public_url?: string | null;
}

// Helper function to decode HTML entities
function decodeHtmlEntities(text: string): string {
  const entities: Record<string, string> = {
    '&nbsp;': ' ',
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#39;': "'",
    '&apos;': "'",
  };
  
  let decoded = text;
  for (const [entity, char] of Object.entries(entities)) {
    decoded = decoded.replace(new RegExp(entity, 'g'), char);
  }
  return decoded;
}

// Helper function to ensure URL is in Google Drive download format
function normalizeGoogleDriveUrl(googleDriveUrl: string | null): string | null {
  if (!googleDriveUrl) return null;
  
  // Extract file ID from various Google Drive URL formats
  let fileId: string | null = null;
  
  // Format 1: https://drive.google.com/file/d/{ID}/preview or /view
  let match = googleDriveUrl.match(/\/file\/d\/([a-zA-Z0-9-_]+)\//);
  if (match) {
    fileId = match[1];
  }
  
  // Format 2: https://drive.google.com/uc?id={ID}&export=...
  if (!fileId) {
    match = googleDriveUrl.match(/[?&]id=([a-zA-Z0-9-_]+)/);
    if (match) {
      fileId = match[1];
    }
  }
  
  if (!fileId) return googleDriveUrl; // Return original if we can't parse
  
  // Return Google Drive file URL in a format that can be used for downloads
  return `https://drive.google.com/file/d/${fileId}/view`;
}

// Define chapter counts for each book
const CHAPTER_COUNTS: Record<string, number> = {
  // Old Testament
  'Genesis': 50, 'Exodus': 40, 'Leviticus': 27, 'Numbers': 36, 'Deuteronomy': 34,
  'Joshua': 24, 'Judges': 21, 'Ruth': 4, '1 Samuel': 31, '2 Samuel': 24,
  '1 Kings': 22, '2 Kings': 25, '1 Chronicles': 29, '2 Chronicles': 36,
  'Ezra': 10, 'Nehemiah': 13, 'Esther': 10, 'Job': 42, 'Psalms': 150,
  'Proverbs': 31, 'Ecclesiastes': 12, 'Song of Solomon': 8, 'Isaiah': 66,
  'Jeremiah': 52, 'Lamentations': 5, 'Ezekiel': 48, 'Daniel': 12, 'Hosea': 14,
  'Joel': 3, 'Amos': 9, 'Obadiah': 1, 'Jonah': 4, 'Micah': 7, 'Nahum': 3,
  'Habakkuk': 3, 'Zephaniah': 3, 'Haggai': 2, 'Zechariah': 14, 'Malachi': 4,
  // New Testament
  'Matthew': 28, 'Mark': 16, 'Luke': 24, 'John': 21, 'Acts': 28, 'Romans': 16,
  '1 Corinthians': 16, '2 Corinthians': 13, 'Galatians': 6, 'Ephesians': 6,
  'Philippians': 4, 'Colossians': 4, '1 Thessalonians': 5, '2 Thessalonians': 3,
  '1 Timothy': 6, '2 Timothy': 4, 'Titus': 3, 'Philemon': 1, 'Hebrews': 13,
  'James': 5, '1 Peter': 5, '2 Peter': 3, '1 John': 5, '2 John': 1, '3 John': 1,
  'Jude': 1, 'Revelation': 22
};

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const book = searchParams.get('book');
    const chapterParam = searchParams.get('chapter');
    const translation = searchParams.get('translation') || 'afghan2023'; // Default to Afghan 2023

    if (!book) {
      return NextResponse.json({ error: 'Book parameter is required' }, { status: 400 });
    }

    // Get all chapter counts if no chapter specified
    if (!chapterParam) {
      const chapterCount = CHAPTER_COUNTS[book] || 0;
      const response = NextResponse.json({ book, chapterCount, chapters: Array.from({ length: chapterCount }, (_, i) => i + 1) });
      // Cache chapter counts for 1 week (they don't change)
      response.headers.set('Cache-Control', 'public, max-age=604800, immutable');
      return response;
    }

    const chapter = parseInt(chapterParam, 10);
    if (isNaN(chapter) || chapter < 1) {
      return NextResponse.json({ error: 'Invalid chapter number' }, { status: 400 });
    }

    // Try D1 first (Cloudflare), fallback to Supabase if unavailable
    let verses: any[] | null = null;
    let useD1 = false;

    // Check if Cloudflare Worker URL is configured
    const cloudflareWorkerUrl = process.env.NEXT_PUBLIC_CLOUDFLARE_WORKER_URL;
    
    if (cloudflareWorkerUrl) {
      try {
        console.log(`📖 Fetching ${book} ${chapter} from D1 (translation: ${translation})`);
        const d1Verses = await getVersesByChapter(book, chapter, translation as 'afghan2023' | 'yousafzai2019');
        
        if (d1Verses && d1Verses.length > 0) {
          verses = d1Verses.map((v) => ({
            book: v.book,
            chapter: v.chapter,
            verse: v.verse,
            text: v.text,
            testament: v.testament,
            audio_storage_path: v.audio_r2_key,
            audio_public_url: v.audio_public_url,
            audio_url: v.audio_public_url, // For compatibility
            audio_r2_key: v.audio_r2_key,
          }));
          useD1 = true;
          console.log(`✅ D1 query returned ${verses.length} verses`);
        }
      } catch (d1Error) {
        console.warn(`⚠️ D1 query failed, falling back to Supabase:`, d1Error);
      }
    }

    // Fallback to Supabase if D1 didn't return results
    if (!verses || verses.length === 0) {
      const tableName = translation === 'yousafzai2019' ? 'Yousafzai Verses' : 'Afghan 2023 Verses';
      console.log(`📖 Fetching ${book} ${chapter} from ${tableName} (translation: ${translation})`);

      const { data: supabaseVerses, error } = await supabase
        .from(tableName)
        .select('book, chapter, verse, text, testament, audio_storage_path, audio_public_url, audio_url')
        .eq('book', book)
        .eq('chapter', chapter)
        .order('verse', { ascending: true });

      if (error) {
        console.error(`❌ Supabase query error for ${tableName}:`, error);
        return NextResponse.json(
          { error: 'Database query failed', details: error.message },
          { status: 500 }
        );
      }

      // Map Supabase verses to include audio_r2_key if available in audio_storage_path
      verses = supabaseVerses?.map((v: any) => ({
        ...v,
        audio_r2_key: v.audio_storage_path && v.audio_storage_path.startsWith('audio/') 
          ? v.audio_storage_path 
          : null,
      })) || [];
      console.log(`✅ Supabase query returned ${verses?.length || 0} verses from ${tableName}`);
    }

    // DEBUG: Check audio data in multiple verses
    if (verses && verses.length > 0) {
      console.log(`📝 Sample verse audio data (first 5 verses):`);
      verses.slice(0, 5).forEach((v: any, idx: number) => {
        console.log(`  Verse ${idx + 1}: ${v.book} ${v.chapter}:${v.verse}`, {
          audio_url: v.audio_url,
          audio_public_url: v.audio_public_url,
          audio_storage_path: v.audio_storage_path,
          normalizedUrl: normalizeGoogleDriveUrl(v.audio_url || v.audio_public_url)
        });
      });
    }

    if (!verses || verses.length === 0) {
      // If Afghan 2023 is empty, try Yousafzai as fallback
      if (translation === 'afghan2023') {
        console.log(`⚠️  No verses found in D1 for ${book} ${chapter}, trying Yousafzai Verses as fallback...`);
        const { data: fallbackVerses, error: fallbackError } = await supabase
          .from('Yousafzai Verses')
          .select('book, chapter, verse, text, testament, audio_storage_path, audio_public_url, audio_url')
          .eq('book', book)
          .eq('chapter', chapter)
          .order('verse', { ascending: true });

        if (fallbackError) {
          console.error('❌ Fallback query also failed:', fallbackError);
          return NextResponse.json({ error: 'No verses found for this chapter in any translation' }, { status: 404 });
        }

        if (fallbackVerses && fallbackVerses.length > 0) {
          console.log(`✅ Found ${fallbackVerses.length} verses in Yousafzai as fallback`);
          const formattedVerses = fallbackVerses.map((v: any) => ({
            ref: `${v.book} ${v.chapter}:${v.verse}`,
            book: v.book,
            chapter: v.chapter,
            verse: v.verse,
            text: decodeHtmlEntities(v.text),
            testament: v.testament,
            dialect: 'yousafzai',
            audio_storage_path: v.audio_storage_path,
            audio_public_url: normalizeGoogleDriveUrl(v.audio_url || v.audio_public_url), // Normalize Google Drive URL
          }));

          const response = NextResponse.json({
            book,
            chapter,
            translation: 'yousafzai2019',
            verses: formattedVerses,
            totalVerses: formattedVerses.length,
            note: 'Afghan 2023 not available, showing Yousafzai 2019 instead'
          });
          // Cache verse data for 24 hours + serve stale for 7 days
          response.headers.set('Cache-Control', 'public, max-age=86400, stale-while-revalidate=604800');
          return response;
        }
      }

      return NextResponse.json({ error: 'No verses found for this chapter' }, { status: 404 });
    }

    // Format verses for response
    const formattedVerses = verses.map((v: any) => {
      let finalAudioUrl: string | null = null;
      const cloudflareWorkerUrl = process.env.NEXT_PUBLIC_CLOUDFLARE_WORKER_URL || 'https://pashtobiblesearch.jeremy-samuels17.workers.dev';
      
      // Priority 1: Use R2 audio if audio_r2_key is available (from D1 or Supabase)
      if (v.audio_r2_key) {
        finalAudioUrl = `${cloudflareWorkerUrl}/api/audio/stream/${encodeURIComponent(v.audio_r2_key)}`;
      } 
      // Priority 2: Check if audio_storage_path looks like an R2 path
      else if (v.audio_storage_path && (v.audio_storage_path.startsWith('audio/') || v.audio_storage_path.startsWith('verses/'))) {
        finalAudioUrl = `${cloudflareWorkerUrl}/api/audio/stream/${encodeURIComponent(v.audio_storage_path)}`;
      }
      // Priority 3: Fallback to Supabase URL if available
      else if (v.audio_public_url && v.audio_public_url.includes('supabase.co')) {
        finalAudioUrl = v.audio_public_url;
      }
      // Priority 4: Last resort - Google Drive (should be deprecated)
      else {
        const rawAudioUrl = v.audio_url || v.audio_public_url;
        if (rawAudioUrl && rawAudioUrl.includes('drive.google.com')) {
          console.warn(`⚠️ Using Google Drive fallback for ${v.book} ${v.chapter}:${v.verse} - consider migrating to R2`);
          finalAudioUrl = normalizeGoogleDriveUrl(rawAudioUrl);
        }
      }
      
      return {
        ref: `${v.book} ${v.chapter}:${v.verse}`,
        book: v.book,
        chapter: v.chapter,
        verse: v.verse,
        text: decodeHtmlEntities(v.text),
        testament: v.testament,
        dialect: translation === 'yousafzai2019' ? 'yousafzai' : 'afghan',
        audio_storage_path: v.audio_storage_path || v.audio_r2_key,
        audio_public_url: finalAudioUrl,
        audio_r2_key: v.audio_r2_key || v.audio_storage_path || null,
      };
    });

    const response = NextResponse.json({
      book,
      chapter,
      translation,
      verses: formattedVerses,
      totalVerses: formattedVerses.length,
    });
    
    // Cache verse data for 24 hours + serve stale for 7 days
    response.headers.set('Cache-Control', 'public, max-age=86400, stale-while-revalidate=604800');
    return response;
  } catch (error) {
    console.error('Error fetching chapter verses:', error);
    return NextResponse.json(
      { error: 'Failed to fetch chapter verses' },
      { status: 500 }
    );
  }
}
