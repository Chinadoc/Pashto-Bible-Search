import { NextRequest, NextResponse } from 'next/server';
import { getVersesByChapter } from '@/app/lib/cloudflare-d1';

export const runtime = 'nodejs';

/**
 * API endpoint to fetch a range of verses for the Scripture Typer
 * GET /api/typer/verses?book=Matthew&chapter=6&start=9&end=13
 */
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);

        const book = searchParams.get('book');
        const chapter = searchParams.get('chapter');
        const start = searchParams.get('start');
        const end = searchParams.get('end');
        const translation = searchParams.get('translation') || 'afghan2023';

        // Validate required parameters
        if (!book || !chapter || !start || !end) {
            return NextResponse.json(
                { error: 'Missing required parameters: book, chapter, start, end' },
                { status: 400 }
            );
        }

        const chapterNum = parseInt(chapter);
        const startVerse = parseInt(start);
        const endVerse = parseInt(end);

        // Validate numbers
        if (isNaN(chapterNum) || isNaN(startVerse) || isNaN(endVerse)) {
            return NextResponse.json(
                { error: 'Chapter, start, and end must be valid numbers' },
                { status: 400 }
            );
        }

        if (startVerse > endVerse) {
            return NextResponse.json(
                { error: 'Start verse must be less than or equal to end verse' },
                { status: 400 }
            );
        }

        // Fetch all verses for the chapter
        const allVerses = await getVersesByChapter(
            book,
            chapterNum,
            translation as 'afghan2023' | 'yousafzai2019'
        );

        // Filter to the requested verse range
        const filteredVerses = allVerses.filter(verse => {
            return verse.verse >= startVerse && verse.verse <= endVerse;
        });

        if (filteredVerses.length === 0) {
            return NextResponse.json(
                { error: 'No verses found for the specified range' },
                { status: 404 }
            );
        }

        // Transform to include only necessary fields
        const verses = filteredVerses.map(verse => ({
            ref: verse.ref,
            verseNumber: verse.verse,
            text: verse.text,
            audio_url: verse.audio_r2_key ?
                `${process.env.NEXT_PUBLIC_CLOUDFLARE_WORKER_URL}/api/audio/stream/${encodeURIComponent(verse.audio_r2_key)}` :
                null,
        }));

        return NextResponse.json({
            book,
            chapter: chapterNum,
            startVerse,
            endVerse,
            translation,
            verses,
            count: verses.length,
        });
    } catch (error: any) {
        console.error('Failed to fetch verses for typer:', error);
        return NextResponse.json(
            { error: 'Failed to fetch verses', message: error?.message },
            { status: 500 }
        );
    }
}
