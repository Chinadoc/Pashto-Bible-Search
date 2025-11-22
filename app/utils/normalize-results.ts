import { Verse } from '@/types';

// Type for API results from search route
type ApiResult = {
  ref: string;
  text: string;
  testament?: string;
  translation: string | null;
  dialect: string | null;
  tags: any[][];
  audio_verse_url: string | null;
  id: number;
  matchedForms?: string[]; // Forms that were matched in this verse
};

/**
 * Normalize search results to ensure consistent formatting
 */
export function normalizeSearchResults(results: Verse[]): Verse[] {
  return results.map(result => ({
    ...result,
    text: normalizeText(result.text),
    ref: normalizeRef(result.ref),
    // Ensure consistent formatting
    translation: result.translation || null,
    dialect: result.dialect || null,
    tags: Array.isArray(result.tags) ? result.tags : [],
    audio_verse_url: result.audio_verse_url || null,
    matchedForms: result.matchedForms || undefined, // Preserve matched forms
  }));
}

/**
 * Normalize verse text
 */
function normalizeText(text: string | undefined): string {
  if (!text) return '';

  return text
    .trim()
    .replace(/\s+/g, ' ') // Normalize whitespace
    .replace(/\u200B/g, '') // Remove zero-width spaces
    .replace(/\u200C/g, '') // Remove zero-width non-joiners
    .replace(/\u200D/g, '') // Remove zero-width joiners
    .replace(/\uFEFF/g, ''); // Remove BOM
}

/**
 * Normalize verse reference
 */
function normalizeRef(ref: string): string {
  if (!ref) return '';

  return ref
    .trim()
    .replace(/\s+/g, ' ') // Normalize whitespace
    .replace(/^(\d+)\s*([A-Za-z]+)\s*(\d+):(\d+)$/, '$1$2 $3:$4') // Fix spacing in references
    .replace(/([A-Za-z]+)\s*(\d+):(\d+)/, '$1 $2:$3'); // Ensure space before chapter:verse
}

/**
 * Normalize audio URL
 */
export function normalizeAudioUrl(url: string | null | undefined): string | null {
  if (!url) return null;

  // Remove query parameters and fragments for consistency
  try {
    const urlObj = new URL(url);
    return `${urlObj.protocol}//${urlObj.host}${urlObj.pathname}`;
  } catch {
    return url;
  }
}

/**
 * Validate verse data integrity
 */
export function validateVerse(verse: Verse): boolean {
  return !!(
    verse.ref &&
    verse.text &&
    typeof verse.ref === 'string' &&
    typeof verse.text === 'string' &&
    verse.ref.trim().length > 0 &&
    verse.text.trim().length > 0
  );
}

/**
 * Filter out invalid verses
 */
export function filterValidVerses(verses: Verse[]): Verse[] {
  return verses.filter(validateVerse);
}

/**
 * Deduplicate verses by reference
 */
export function deduplicateVerses(verses: Verse[]): Verse[] {
  const seen = new Set<string>();
  const unique: Verse[] = [];

  for (const verse of verses) {
    const key = verse.ref.toLowerCase().trim();
    if (!seen.has(key)) {
      seen.add(key);
      unique.push(verse);
    }
  }

  return unique;
}

/**
 * Sort verses by book order
 */
export function sortVersesByBook(verses: Verse[]): Verse[] {
  const bookOrder = [
    'Genesis', 'Exodus', 'Leviticus', 'Numbers', 'Deuteronomy',
    'Joshua', 'Judges', 'Ruth', '1 Samuel', '2 Samuel',
    '1 Kings', '2 Kings', '1 Chronicles', '2 Chronicles', 'Ezra',
    'Nehemiah', 'Esther', 'Job', 'Psalms', 'Proverbs',
    'Ecclesiastes', 'Song of Solomon', 'Isaiah', 'Jeremiah', 'Lamentations',
    'Ezekiel', 'Daniel', 'Hosea', 'Joel', 'Amos',
    'Obadiah', 'Jonah', 'Micah', 'Nahum', 'Habakkuk',
    'Zephaniah', 'Haggai', 'Zechariah', 'Malachi',
    'Matthew', 'Mark', 'Luke', 'John', 'Acts',
    'Romans', '1 Corinthians', '2 Corinthians', 'Galatians', 'Ephesians',
    'Philippians', 'Colossians', '1 Thessalonians', '2 Thessalonians', '1 Timothy',
    '2 Timothy', 'Titus', 'Philemon', 'Hebrews', 'James',
    '1 Peter', '2 Peter', '1 John', '2 John', '3 John',
    'Jude', 'Revelation'
  ];

  return verses.sort((a, b) => {
    const bookA = a.ref.split(' ')[0];
    const bookB = b.ref.split(' ')[0];

    const indexA = bookOrder.indexOf(bookA);
    const indexB = bookOrder.indexOf(bookB);

    if (indexA === -1 && indexB === -1) return 0;
    if (indexA === -1) return 1;
    if (indexB === -1) return -1;

    if (indexA !== indexB) return indexA - indexB;

    // Same book, sort by chapter:verse
    const [, chapterA, verseA] = a.ref.match(/(\d+):(\d+)/) || ['', '0', '0'];
    const [, chapterB, verseB] = b.ref.match(/(\d+):(\d+)/) || ['', '0', '0'];

    const chapterNumA = parseInt(chapterA, 10);
    const chapterNumB = parseInt(chapterB, 10);
    const verseNumA = parseInt(verseA, 10);
    const verseNumB = parseInt(verseB, 10);

    if (chapterNumA !== chapterNumB) return chapterNumA - chapterNumB;
    return verseNumA - verseNumB;
  });
}

/**
 * Convert ApiResult to Verse format
 */
function convertApiResultToVerse(apiResult: ApiResult): Verse {
  return {
    ref: apiResult.ref,
    text: apiResult.text,
    translation: apiResult.translation,
    dialect: apiResult.dialect,
    tags: apiResult.tags,
    audio_verse_url: apiResult.audio_verse_url,
    testament: apiResult.testament as 'OT' | 'NT' | undefined,
    matchedForms: apiResult.matchedForms, // Preserve matched forms!
  };
}

/**
 * Complete normalization pipeline for ApiResult[]
 */
export function normalizeVerses(apiResults: ApiResult[]): Verse[] {
  const verses = apiResults.map(convertApiResultToVerse);
  return sortVersesByBook(
    deduplicateVerses(
      normalizeSearchResults(
        filterValidVerses(verses)
      )
    )
  );
}
