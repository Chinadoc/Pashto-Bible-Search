import { NextRequest, NextResponse } from 'next/server';
import { getData } from '@/app/lib/data/load';
import { parseVerseRef } from '@/app/utils/verse-parser';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  const startedAt = Date.now();

  try {
    console.log('📚 Getting chapter information for all books');

    // Load search data
    const { searchIndex } = await getData();

    // Group verses by book and chapter
    const booksMap = new Map<string, Map<number, Set<string>>>();

    for (const verse of searchIndex.verses) {
      const parsed = parseVerseRef(verse.ref);
      if (parsed) {
        if (!booksMap.has(parsed.book)) {
          booksMap.set(parsed.book, new Map());
        }

        const bookChapters = booksMap.get(parsed.book)!;
        if (!bookChapters.has(parsed.chapter)) {
          bookChapters.set(parsed.chapter, new Set());
        }

        bookChapters.get(parsed.chapter)!.add(verse.ref);
      }
    }

    // Convert to the expected format
    const booksInfo = Array.from(booksMap.entries()).map(([bookName, chaptersMap]) => {
      const chapters = Array.from(chaptersMap.entries())
        .sort(([a], [b]) => a - b)
        .map(([chapterNum, verseRefs]) => ({
          book: bookName,
          chapter: chapterNum,
          verseCount: verseRefs.size,
        }));

      return {
        book: bookName,
        chapters,
        totalVerses: chapters.reduce((sum, ch) => sum + ch.verseCount, 0),
      };
    });

    // Sort books in biblical order (OT first, then NT)
    const OT_BOOKS = [
      "Genesis", "Exodus", "Leviticus", "Numbers", "Deuteronomy", "Joshua", "Judges", "Ruth",
      "1 Samuel", "2 Samuel", "1 Kings", "2 Kings", "1 Chronicles", "2 Chronicles", "Ezra", "Nehemiah",
      "Esther", "Job", "Psalms", "Proverbs", "Ecclesiastes", "Song of Solomon", "Isaiah", "Jeremiah",
      "Lamentations", "Ezekiel", "Daniel", "Hosea", "Joel", "Amos", "Obadiah", "Jonah", "Micah",
      "Nahum", "Habakkuk", "Zephaniah", "Haggai", "Zechariah", "Malachi"
    ];

    const NT_BOOKS = [
      "Matthew", "Mark", "Luke", "John", "Acts", "Romans", "1 Corinthians", "2 Corinthians",
      "Galatians", "Ephesians", "Philippians", "Colossians", "1 Thessalonians", "2 Thessalonians",
      "1 Timothy", "2 Timothy", "Titus", "Philemon", "Hebrews", "James", "1 Peter", "2 Peter",
      "1 John", "2 John", "3 John", "Jude", "Revelation"
    ];

    const sortBooks = (books: typeof booksInfo) => {
      return books.sort((a, b) => {
        const aIndex = OT_BOOKS.indexOf(a.book);
        const bIndex = OT_BOOKS.indexOf(b.book);

        if (aIndex !== -1 && bIndex !== -1) {
          return aIndex - bIndex; // Both OT
        }
        if (aIndex !== -1) return -1; // A is OT, B is NT
        if (bIndex !== -1) return 1;  // A is NT, B is OT

        // Both NT or neither in standard lists
        const aNtIndex = NT_BOOKS.indexOf(a.book);
        const bNtIndex = NT_BOOKS.indexOf(b.book);

        if (aNtIndex !== -1 && bNtIndex !== -1) {
          return aNtIndex - bNtIndex;
        }

        return a.book.localeCompare(b.book);
      });
    };

    const sortedBooks = sortBooks(booksInfo);

    return NextResponse.json({
      books: sortedBooks,
      totalBooks: sortedBooks.length,
      ms: Date.now() - startedAt,
    });

  } catch (error) {
    console.error('Chapters API error:', error);
    return NextResponse.json(
      { error: 'Failed to get chapter information', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 },
    );
  }
}
