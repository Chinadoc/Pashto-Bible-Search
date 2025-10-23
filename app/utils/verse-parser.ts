// Utility functions for parsing and working with Bible verse references

export interface ParsedVerseRef {
  book: string;
  chapter: number;
  verse: number;
  fullRef: string;
}

export interface ChapterVerses {
  book: string;
  chapter: number;
  verses: number[];
  totalVerses: number;
}

/**
 * Parse a verse reference like "Mark 1:1" into its components
 */
export function parseVerseRef(ref: string): ParsedVerseRef | null {
  if (!ref || typeof ref !== 'string') return null;

  // Remove extra whitespace and normalize
  const normalized = ref.trim();

  // Split by spaces to separate book from chapter:verse
  const parts = normalized.split(/\s+/);
  if (parts.length < 2) return null;

  // Extract book name (could be multiple words like "1 Corinthians")
  const chapterVersePart = parts[parts.length - 1];
  const bookPart = parts.slice(0, -1).join(' ');

  // Parse chapter:verse part
  const chapterVerseMatch = chapterVersePart.match(/^(\d+):(\d+)$/);
  if (!chapterVerseMatch) return null;

  const chapter = parseInt(chapterVerseMatch[1], 10);
  const verse = parseInt(chapterVerseMatch[2], 10);

  if (isNaN(chapter) || isNaN(verse) || chapter < 1 || verse < 1) {
    return null;
  }

  return {
    book: bookPart,
    chapter,
    verse,
    fullRef: normalized
  };
}

/**
 * Generate all verse references for a given chapter
 */
export function generateChapterVerses(book: string, chapter: number, totalVerses: number): string[] {
  const verses: string[] = [];
  for (let verse = 1; verse <= totalVerses; verse++) {
    verses.push(`${book} ${chapter}:${verse}`);
  }
  return verses;
}

/**
 * Check if a verse reference belongs to a specific chapter
 */
export function isVerseInChapter(verseRef: string, book: string, chapter: number): boolean {
  const parsed = parseVerseRef(verseRef);
  return parsed !== null &&
         parsed.book === book &&
         parsed.chapter === chapter;
}

/**
 * Extract unique chapters from a list of verse references
 */
export function extractChapters(verseRefs: string[]): ChapterVerses[] {
  const chaptersMap = new Map<string, Set<number>>();

  for (const ref of verseRefs) {
    const parsed = parseVerseRef(ref);
    if (parsed) {
      const key = parsed.book;
      if (!chaptersMap.has(key)) {
        chaptersMap.set(key, new Set());
      }
      chaptersMap.get(key)!.add(parsed.chapter);
    }
  }

  return Array.from(chaptersMap.entries()).map(([book, chapters]) => {
    const verses = Array.from(chapters).sort((a, b) => a - b);
    return {
      book,
      chapter: verses[0], // This function returns one chapter per book, but we need to update it
      verses,
      totalVerses: verses.length
    };
  });
}

/**
 * Group verse references by book and chapter
 */
export function groupVersesByChapter(verseRefs: string[]): Map<string, Map<number, string[]>> {
  const result = new Map<string, Map<number, string[]>>();

  for (const ref of verseRefs) {
    const parsed = parseVerseRef(ref);
    if (parsed) {
      if (!result.has(parsed.book)) {
        result.set(parsed.book, new Map());
      }

      const bookChapters = result.get(parsed.book)!;
      if (!bookChapters.has(parsed.chapter)) {
        bookChapters.set(parsed.chapter, []);
      }

      bookChapters.get(parsed.chapter)!.push(ref);
    }
  }

  return result;
}

/**
 * Get all verse references for a specific book and chapter
 */
export function getChapterVerses(verseRefs: string[], book: string, chapter: number): string[] {
  return verseRefs.filter(ref => isVerseInChapter(ref, book, chapter));
}

/**
 * Format a verse reference for display
 */
export function formatVerseRef(ref: string): string {
  return ref; // For now, just return as-is since parsing handles the formatting
}

/**
 * Get the next verse reference in sequence
 */
export function getNextVerse(ref: string): string | null {
  const parsed = parseVerseRef(ref);
  if (!parsed) return null;

  // For now, just increment the verse number
  // In a real implementation, you'd need to know the actual verse counts per chapter
  return `${parsed.book} ${parsed.chapter}:${parsed.verse + 1}`;
}

/**
 * Get the previous verse reference in sequence
 */
export function getPreviousVerse(ref: string): string | null {
  const parsed = parseVerseRef(ref);
  if (!parsed || parsed.verse <= 1) return null;

  return `${parsed.book} ${parsed.chapter}:${parsed.verse - 1}`;
}
