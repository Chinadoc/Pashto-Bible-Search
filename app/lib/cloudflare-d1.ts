/**
 * Cloudflare D1 Database Client for Pashto Bible Search
 * Provides functions to query D1 database via Cloudflare Workers API
 */

import type {
  Verse,
  VerseYousafzai,
  WordOccurrence,
  SearchVersesResponse,
  GetVersesByChapterResponse,
  GetVerseByRefResponse,
  SearchWordOccurrencesResponse,
} from '../../cloudflare/types';

const CLOUDFLARE_WORKER_URL =
  process.env.NEXT_PUBLIC_CLOUDFLARE_WORKER_URL ||
  'https://pashtobiblesearch.workers.dev';

/**
 * Search verses by text query
 */
export async function searchVerses(
  query: string,
  options: {
    translation?: 'afghan2023' | 'yousafzai2019';
    testament?: 'OT' | 'NT';
    limit?: number;
  } = {}
): Promise<Verse[]> {
  const params = new URLSearchParams({
    q: query,
    translation: options.translation || 'afghan2023',
    limit: String(options.limit || 100),
  });

  if (options.testament) {
    params.append('testament', options.testament);
  }

  const response = await fetch(`${CLOUDFLARE_WORKER_URL}/api/search?${params}`);
  
  if (!response.ok) {
    // If worker is not available, return empty array (will fallback to Supabase)
    if (response.status === 404 || response.status >= 500) {
      console.warn(`D1 Worker unavailable (${response.status}), falling back to Supabase`);
      return [];
    }
    throw new Error(`Search failed: ${response.statusText}`);
  }

  const data: SearchVersesResponse = await response.json();
  return data.verses || [];
}

/**
 * Get verses by book and chapter
 */
export async function getVersesByChapter(
  book: string,
  chapter: number,
  translation: 'afghan2023' | 'yousafzai2019' = 'afghan2023'
): Promise<Verse[]> {
  const params = new URLSearchParams({
    book,
    chapter: String(chapter),
    translation,
  });

  const response = await fetch(`${CLOUDFLARE_WORKER_URL}/api/chapter?${params}`);
  
  if (!response.ok) {
    // If worker is not available, return empty array (will fallback to Supabase)
    if (response.status === 404 || response.status >= 500) {
      console.warn(`D1 Worker unavailable (${response.status}), falling back to Supabase`);
      return [];
    }
    throw new Error(`Failed to get verses: ${response.statusText}`);
  }

  const data: GetVersesByChapterResponse = await response.json();
  return data.verses || [];
}

/**
 * Get verse by reference
 */
export async function getVerseByRef(
  ref: string,
  translation: 'afghan2023' | 'yousafzai2019' = 'afghan2023'
): Promise<Verse | null> {
  const params = new URLSearchParams({
    ref,
    translation,
  });

  const response = await fetch(`${CLOUDFLARE_WORKER_URL}/api/verse?${params}`);
  
  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    // If worker is not available, return null (will fallback to Supabase)
    if (response.status >= 500) {
      console.warn(`D1 Worker unavailable (${response.status}), falling back to Supabase`);
      return null;
    }
    throw new Error(`Failed to get verse: ${response.statusText}`);
  }

  const data: GetVerseByRefResponse = await response.json();
  return data.verse || null;
}

/**
 * Search word occurrences
 */
export async function searchWordOccurrences(
  word: string,
  translation: 'afghan2023' | 'yousafzai2019' = 'afghan2023',
  limit: number = 100
): Promise<WordOccurrence[]> {
  const params = new URLSearchParams({
    word,
    translation,
    limit: String(limit),
  });

  const response = await fetch(`${CLOUDFLARE_WORKER_URL}/api/word-occurrences?${params}`);
  
  if (!response.ok) {
    throw new Error(`Search failed: ${response.statusText}`);
  }

  const data: SearchWordOccurrencesResponse = await response.json();
  return data.occurrences;
}

/**
 * Get audio URL from R2
 */
export async function getAudioUrl(r2Key: string): Promise<string> {
  const encodedKey = encodeURIComponent(r2Key);
  const response = await fetch(`${CLOUDFLARE_WORKER_URL}/api/audio/url/${encodedKey}`);
  
  if (!response.ok) {
    throw new Error(`Failed to get audio URL: ${response.statusText}`);
  }

  const data = await response.json();
  return data.url;
}

/**
 * Get audio stream URL from R2
 * Use this URL directly in <audio> tag
 */
export function getAudioStreamUrl(r2Key: string): string {
  const encodedKey = encodeURIComponent(r2Key);
  return `${CLOUDFLARE_WORKER_URL}/api/audio/stream/${encodedKey}`;
}

/**
 * Resolve audio URL from verse R2 key
 */
export async function resolveAudioUrlFromVerse(verse: Verse): Promise<string | null> {
  if (!verse.audio_r2_key) {
    return verse.audio_public_url || null;
  }

  try {
    return getAudioStreamUrl(verse.audio_r2_key);
  } catch (error) {
    console.warn(`Failed to resolve audio URL for verse ${verse.ref}:`, error);
    return verse.audio_public_url || null;
  }
}



