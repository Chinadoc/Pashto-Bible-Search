import { getAudioStreamUrl } from './cloudflare-d1';

/**
 * Generate R2 audio key from book, chapter, verse, and translation
 * Pattern: {translation}_{book_slug}{chapter_padded}_verse_{verse_padded}.mp3
 * Example: yousafzai_amos001_verse_001.mp3
 */
export function generateR2AudioKey(
  book: string,
  chapter: number,
  verse: number,
  translation: 'afghan2023' | 'yousafzai2019'
): string {
  // Normalize book name to slug (lowercase, remove spaces, handle numeric prefixes)
  const bookSlug = book
    .toLowerCase()
    .replace(/\s+/g, '')
    .replace(/[^a-z0-9]/g, '');
  
  // Pad chapter and verse to 3 digits
  const chapterPadded = String(chapter).padStart(3, '0');
  const versePadded = String(verse).padStart(3, '0');
  
  // Determine translation prefix
  const translationPrefix = translation === 'yousafzai2019' ? 'yousafzai' : 'afghan';
  
  // Generate R2 key
  return `${translationPrefix}_${bookSlug}${chapterPadded}_verse_${versePadded}.mp3`;
}

/**
 * Generate R2 audio URL for a verse
 * Uses the Cloudflare Worker stream endpoint
 */
export function generateR2AudioUrl(
  book: string,
  chapter: number,
  verse: number,
  translation: 'afghan2023' | 'yousafzai2019'
): string {
  const r2Key = generateR2AudioKey(book, chapter, verse, translation);
  return getAudioStreamUrl(r2Key);
}

/**
 * Batch generate R2 audio URLs for all verses in a chapter
 */
export function generateChapterAudioUrls(
  book: string,
  chapter: number,
  verses: Array<{ verse: number }>,
  translation: 'afghan2023' | 'yousafzai2019'
): Map<number, string> {
  const audioUrls = new Map<number, string>();
  
  for (const verseData of verses) {
    const url = generateR2AudioUrl(book, chapter, verseData.verse, translation);
    audioUrls.set(verseData.verse, url);
  }
  
  return audioUrls;
}

