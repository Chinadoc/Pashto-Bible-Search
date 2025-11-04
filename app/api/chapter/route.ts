import { NextRequest, NextResponse } from 'next/server';
import { getVersesByChapter } from '@/app/lib/cloudflare-d1';
import { generateR2AudioUrl, generateR2AudioKey } from '@/app/lib/chapter-audio';

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

    // Fetch verses from Cloudflare D1 ONLY
    const cloudflareWorkerUrl = process.env.NEXT_PUBLIC_CLOUDFLARE_WORKER_URL;
    
    if (!cloudflareWorkerUrl) {
      return NextResponse.json(
        { error: 'Cloudflare Worker URL not configured' },
        { status: 500 }
      );
    }

    let verses: any[] = [];

    try {
      console.log(`📖 Fetching ${book} ${chapter} from Cloudflare D1 (translation: ${translation})`);
      const d1Verses = await getVersesByChapter(book, chapter, translation as 'afghan2023' | 'yousafzai2019');
      
      if (d1Verses && d1Verses.length > 0) {
        verses = d1Verses.map((v) => ({
          book: v.book,
          chapter: v.chapter,
          verse: v.verse,
          text: v.text,
          testament: v.testament,
          audio_r2_key: v.audio_r2_key,
        }));
        console.log(`✅ D1 query returned ${verses.length} verses`);
      } else {
        // Try alternative translation as fallback
        const altTranslation = translation === 'afghan2023' ? 'yousafzai2019' : 'afghan2023';
        console.log(`⚠️ No verses found for ${translation}, trying ${altTranslation}...`);
        const altVerses = await getVersesByChapter(book, chapter, altTranslation);
        
        if (altVerses && altVerses.length > 0) {
          verses = altVerses.map((v) => ({
            book: v.book,
            chapter: v.chapter,
            verse: v.verse,
            text: v.text,
            testament: v.testament,
            audio_r2_key: v.audio_r2_key,
          }));
          console.log(`✅ Found ${verses.length} verses in ${altTranslation}`);
        }
      }
    } catch (d1Error) {
      console.error(`❌ D1 query failed:`, d1Error);
      return NextResponse.json(
        { error: 'Failed to fetch verses from Cloudflare D1', details: d1Error instanceof Error ? d1Error.message : 'Unknown error' },
        { status: 500 }
      );
    }

    if (verses.length === 0) {
      return NextResponse.json(
        { error: 'No verses found for this chapter in Cloudflare D1' },
        { status: 404 }
      );
    }

    // Import getAudioStreamUrl once
    const { getAudioStreamUrl } = await import('@/app/lib/cloudflare-d1');
    
    // Format verses for response - generate audio URLs efficiently for entire chapter
    const formattedVerses = verses.map((v: any) => {
      // Generate R2 audio URL if we have the verse data
      // Prefer audio_r2_key from D1, but generate if missing
      let audioUrl: string | null = null;
      let r2Key: string | null = null;
      
      if (v.audio_r2_key) {
        // Use existing R2 key to generate stream URL
        r2Key = v.audio_r2_key;
        audioUrl = getAudioStreamUrl(r2Key);
      } else if (v.audio_public_url) {
        // Use existing public URL if available
        audioUrl = v.audio_public_url;
        // Try to extract R2 key from URL or generate it
        r2Key = generateR2AudioKey(v.book, v.chapter, v.verse, translation as 'afghan2023' | 'yousafzai2019');
      } else {
        // Generate R2 key and URL based on book/chapter/verse pattern
        r2Key = generateR2AudioKey(v.book, v.chapter, v.verse, translation as 'afghan2023' | 'yousafzai2019');
        audioUrl = getAudioStreamUrl(r2Key);
      }
      
      return {
        ref: `${v.book} ${v.chapter}:${v.verse}`,
        book: v.book,
        chapter: v.chapter,
        verse: v.verse,
        text: decodeHtmlEntities(v.text), // Text from D1
        testament: v.testament,
        dialect: translation === 'yousafzai2019' ? 'yousafzai' : 'afghan',
        audio_public_url: audioUrl, // Generated or existing audio URL
        audio_r2_key: r2Key, // R2 key for reference
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
