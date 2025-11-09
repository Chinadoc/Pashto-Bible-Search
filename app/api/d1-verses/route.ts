/**
 * D1 Database API Route - Fetch verses from Cloudflare D1
 * This replaces Supabase queries with D1 queries via Cloudflare Worker
 */

import { NextRequest, NextResponse } from 'next/server';
import { getVersesByChapter, searchVerses, getVerseByRef } from '@/app/lib/cloudflare-d1';

export const runtime = 'nodejs';

/**
 * GET /api/d1-verses?book={book}&chapter={chapter}&translation={translation}
 * Fetch verses for a specific book and chapter
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const book = searchParams.get('book');
    const chapterParam = searchParams.get('chapter');
    const translation = (searchParams.get('translation') as 'afghan2023' | 'yousafzai2019') || 'afghan2023';

    if (!book) {
      return NextResponse.json({ error: 'Book parameter is required' }, { status: 400 });
    }

    // If no chapter specified, return chapter count info
    if (!chapterParam) {
      // Chapter counts for each book
      const CHAPTER_COUNTS: Record<string, number> = {
        'Genesis': 50, 'Exodus': 40, 'Leviticus': 27, 'Numbers': 36, 'Deuteronomy': 34,
        'Joshua': 24, 'Judges': 21, 'Ruth': 4, '1 Samuel': 31, '2 Samuel': 24,
        '1 Kings': 22, '2 Kings': 25, '1 Chronicles': 29, '2 Chronicles': 36,
        'Ezra': 10, 'Nehemiah': 13, 'Esther': 10, 'Job': 42, 'Psalms': 150,
        'Proverbs': 31, 'Ecclesiastes': 12, 'Song of Solomon': 8, 'Isaiah': 66,
        'Jeremiah': 52, 'Lamentations': 5, 'Ezekiel': 48, 'Daniel': 12, 'Hosea': 14,
        'Joel': 3, 'Amos': 9, 'Obadiah': 1, 'Jonah': 4, 'Micah': 7, 'Nahum': 3,
        'Habakkuk': 3, 'Zephaniah': 3, 'Haggai': 2, 'Zechariah': 14, 'Malachi': 4,
        'Matthew': 28, 'Mark': 16, 'Luke': 24, 'John': 21, 'Acts': 28, 'Romans': 16,
        '1 Corinthians': 16, '2 Corinthians': 13, 'Galatians': 6, 'Ephesians': 6,
        'Philippians': 4, 'Colossians': 4, '1 Thessalonians': 5, '2 Thessalonians': 3,
        '1 Timothy': 6, '2 Timothy': 4, 'Titus': 3, 'Philemon': 1, 'Hebrews': 13,
        'James': 5, '1 Peter': 5, '2 Peter': 3, '1 John': 5, '2 John': 1, '3 John': 1,
        'Jude': 1, 'Revelation': 22
      };
      
      const chapterCount = CHAPTER_COUNTS[book] || 0;
      const response = NextResponse.json({ 
        book, 
        chapterCount, 
        chapters: Array.from({ length: chapterCount }, (_, i) => i + 1) 
      });
      response.headers.set('Cache-Control', 'public, max-age=604800, immutable');
      return response;
    }

    const chapter = parseInt(chapterParam, 10);
    if (isNaN(chapter) || chapter < 1) {
      return NextResponse.json({ error: 'Invalid chapter number' }, { status: 400 });
    }

    console.log(`📖 Fetching ${book} ${chapter} from D1 (translation: ${translation})`);

    // Fetch verses from D1 via Cloudflare Worker
    const verses = await getVersesByChapter(book, chapter, translation);

    if (!verses || verses.length === 0) {
      // Try fallback translation if Afghan 2023 is empty
      if (translation === 'afghan2023') {
        console.log(`⚠️  No verses found in D1 for ${book} ${chapter}, trying Yousafzai as fallback...`);
        const fallbackVerses = await getVersesByChapter(book, chapter, 'yousafzai2019');
        
        if (fallbackVerses && fallbackVerses.length > 0) {
          const formattedVerses = fallbackVerses.map((v) => ({
            ref: `${v.book} ${v.chapter}:${v.verse}`,
            book: v.book,
            chapter: v.chapter,
            verse: v.verse,
            text: v.text,
            testament: v.testament,
            dialect: 'yousafzai',
            translation: 'yousafzai2019',
            audio_r2_key: v.audio_r2_key,
            audio_public_url: v.audio_public_url,
          }));

          const response = NextResponse.json({
            book,
            chapter,
            translation: 'yousafzai2019',
            verses: formattedVerses,
            totalVerses: formattedVerses.length,
            note: 'Afghan 2023 not available, showing Yousafzai 2019 instead'
          });
          response.headers.set('Cache-Control', 'public, max-age=86400, stale-while-revalidate=604800');
          return response;
        }
      }

      return NextResponse.json({ error: 'No verses found for this chapter' }, { status: 404 });
    }

    // Format verses for response
    const formattedVerses = verses.map((v) => ({
      ref: `${v.book} ${v.chapter}:${v.verse}`,
      book: v.book,
      chapter: v.chapter,
      verse: v.verse,
      text: v.text,
      testament: v.testament,
      dialect: translation === 'yousafzai2019' ? 'yousafzai' : 'afghan',
      translation: translation === 'yousafzai2019' ? 'yousafzai2019' : 'afghan2023',
      audio_r2_key: v.audio_r2_key,
      audio_public_url: v.audio_public_url,
    }));

    console.log(`✅ D1 query returned ${formattedVerses.length} verses`);

    const response = NextResponse.json({
      book,
      chapter,
      translation,
      verses: formattedVerses,
      totalVerses: formattedVerses.length,
    });
    
    response.headers.set('Cache-Control', 'public, max-age=86400, stale-while-revalidate=604800');
    return response;
  } catch (error) {
    console.error('Error fetching verses from D1:', error);
    return NextResponse.json(
      { error: 'Failed to fetch verses from D1', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

/**
 * POST /api/d1-verses/search
 * Search verses by text query
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query, translation = 'afghan2023', testament, limit = 100 } = body;

    if (!query || typeof query !== 'string') {
      return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 });
    }

    console.log(`🔍 Searching D1 for: "${query}" (translation: ${translation})`);

    const verses = await searchVerses(query, {
      translation: translation as 'afghan2023' | 'yousafzai2019',
      testament: testament as 'OT' | 'NT' | undefined,
      limit,
    });

    const formattedVerses = verses.map((v) => ({
      ref: `${v.book} ${v.chapter}:${v.verse}`,
      book: v.book,
      chapter: v.chapter,
      verse: v.verse,
      text: v.text,
      testament: v.testament,
      dialect: translation === 'yousafzai2019' ? 'yousafzai' : 'afghan',
      translation: translation === 'yousafzai2019' ? 'yousafzai2019' : 'afghan2023',
      audio_r2_key: v.audio_r2_key,
      audio_public_url: v.audio_public_url,
    }));

    return NextResponse.json({
      verses: formattedVerses,
      count: formattedVerses.length,
      query,
      translation,
    });
  } catch (error) {
    console.error('Error searching D1:', error);
    return NextResponse.json(
      { error: 'Failed to search D1', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}










