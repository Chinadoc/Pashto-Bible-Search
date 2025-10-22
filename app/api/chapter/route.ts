import { NextRequest, NextResponse } from 'next/server';
import { getLazyLoadedSearchData } from '@/app/lib/data/load';

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

    if (!book) {
      return NextResponse.json({ error: 'Book parameter is required' }, { status: 400 });
    }

    // Get all chapter counts if no chapter specified
    if (!chapterParam) {
      const chapterCount = CHAPTER_COUNTS[book] || 0;
      return NextResponse.json({ book, chapterCount, chapters: Array.from({ length: chapterCount }, (_, i) => i + 1) });
    }

    const chapter = parseInt(chapterParam, 10);
    if (isNaN(chapter) || chapter < 1) {
      return NextResponse.json({ error: 'Invalid chapter number' }, { status: 400 });
    }

    // Load verses data
    const { verses } = await getLazyLoadedSearchData();

    // Filter verses by book and chapter
    const chapterVerses = verses
      .filter(v => v.book === book && v.chapter === chapter)
      .sort((a, b) => (a.verse || 0) - (b.verse || 0));

    if (chapterVerses.length === 0) {
      return NextResponse.json({ error: 'No verses found for this chapter' }, { status: 404 });
    }

    // Format verses for response
    const formattedVerses = chapterVerses.map(v => ({
      ref: v.ref,
      book: v.book,
      chapter: v.chapter,
      verse: v.verse,
      text: v.text,
      testament: v.testament,
      dialect: v.dialect,
    }));

    return NextResponse.json({
      book,
      chapter,
      verses: formattedVerses,
      totalVerses: formattedVerses.length,
    });
  } catch (error) {
    console.error('Error fetching chapter verses:', error);
    return NextResponse.json(
      { error: 'Failed to fetch chapter verses' },
      { status: 500 }
    );
  }
}
