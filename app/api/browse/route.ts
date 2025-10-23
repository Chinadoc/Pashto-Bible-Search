import { NextRequest, NextResponse } from 'next/server';
import { getData } from '@/app/lib/data/load';
import { parseVerseRef, generateChapterVerses } from '@/app/utils/verse-parser';
import { normalizeVerses } from '@/app/utils/normalize-results';

export const runtime = 'nodejs';

type BrowseRequest = {
  book?: string;
  chapter?: number;
  translation?: 'afghan2023' | 'yousafzai2019';
};

export async function POST(request: NextRequest) {
  const startedAt = Date.now();

  try {
    const body = await request.json() as BrowseRequest;
    const { book, chapter, translation = 'afghan2023' } = body;

    if (!book) {
      return NextResponse.json({ error: 'Book is required' }, { status: 400 });
    }

    console.log(`📖 Browse request: ${book}${chapter ? ` chapter ${chapter}` : ' (all chapters)'}`);

    // Load search data
    const { searchIndex } = await getData();

    // Filter verses by book
    let matchingVerses = searchIndex.verses.filter((verse: any) => {
      const parsed = parseVerseRef(verse.ref);
      return parsed && parsed.book === book;
    });

    // If chapter is specified, filter by chapter too
    if (chapter && chapter > 0) {
      matchingVerses = matchingVerses.filter((verse: any) => {
        const parsed = parseVerseRef(verse.ref);
        return parsed && parsed.chapter === chapter;
      });
    }

    if (matchingVerses.length === 0) {
      return NextResponse.json({
        results: [],
        book,
        chapter,
        totalVerses: 0,
        ms: Date.now() - startedAt,
      });
    }

    // Sort verses by reference to ensure proper order
    matchingVerses.sort((a: any, b: any) => {
      const parsedA = parseVerseRef(a.ref);
      const parsedB = parseVerseRef(b.ref);

      if (!parsedA || !parsedB) return 0;

      if (parsedA.chapter !== parsedB.chapter) {
        return parsedA.chapter - parsedB.chapter;
      }

      return parsedA.verse - parsedB.verse;
    });

    // Transform results to match expected format
    const transformed = matchingVerses.map((verse: any, index: number) => ({
      ref: verse.ref,
      text: verse.text,
      testament: verse.testament || 'NT',
      translation: translation === 'yousafzai2019' ? 'Yousafzai 2019' : null,
      dialect: translation === 'yousafzai2019' ? 'Yousafzai' : null,
      tags: [] as any[][],
      audio_verse_url: null, // Will be populated by client if needed
      id: index + 1,
    }));

    // Group by chapters if no specific chapter was requested
    let chapterGroups: any[] = [];
    if (!chapter) {
      const chaptersMap = new Map<number, any[]>();

      for (const verse of transformed) {
        const parsed = parseVerseRef(verse.ref);
        if (parsed) {
          if (!chaptersMap.has(parsed.chapter)) {
            chaptersMap.set(parsed.chapter, []);
          }
          chaptersMap.get(parsed.chapter)!.push(verse);
        }
      }

      chapterGroups = Array.from(chaptersMap.entries())
        .sort(([a], [b]) => a - b)
        .map(([chapterNum, verses]) => ({
          chapter: chapterNum,
          verses: verses,
          count: verses.length
        }));
    }

    return NextResponse.json({
      results: normalizeVerses(transformed),
      book,
      chapter,
      totalVerses: transformed.length,
      chapters: chapterGroups,
      ms: Date.now() - startedAt,
    });

  } catch (error) {
    console.error('Browse API error:', error);
    return NextResponse.json(
      { error: 'Browse failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const book = searchParams.get('book');
  const chapter = searchParams.get('chapter');
  const translation = searchParams.get('translation') || 'afghan2023';

  if (!book) {
    return NextResponse.json({ error: 'Book parameter is required' }, { status: 400 });
  }

  // Convert to POST format for consistency
  const body: BrowseRequest = {
    book,
    translation: translation as 'afghan2023' | 'yousafzai2019'
  };

  if (chapter) {
    body.chapter = parseInt(chapter, 10);
  }

  // Create a new request object for POST
  const postRequest = new NextRequest(request.url, {
    method: 'POST',
    headers: request.headers,
    body: JSON.stringify(body),
  });

  return POST(postRequest);
}
