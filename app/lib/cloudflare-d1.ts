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
  'https://pashtobiblesearch.jeremy-samuels17.workers.dev';

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
    // If worker is not available, return empty array so callers can decide how to proceed
    if (response.status === 404 || response.status >= 500) {
      console.warn(`D1 Worker unavailable (${response.status}), returning empty search results`);
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
    // If worker is not available, return empty array so callers can decide how to proceed
    if (response.status === 404 || response.status >= 500) {
      console.warn(`D1 Worker unavailable (${response.status}), returning empty chapter results`);
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
    // If worker is not available, return null so callers can decide how to proceed
    if (response.status >= 500) {
      console.warn(`D1 Worker unavailable (${response.status}), returning null verse result`);
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

/**
 * Get form occurrences (verse references) for a word form from D1
 */
export async function getFormOccurrences(
  form: string,
  translation: 'afghan2023' | 'yousafzai2019' = 'afghan2023'
): Promise<{ form: string; verse_refs: string[]; frequency: number } | null> {
  try {
    const params = new URLSearchParams({
      form: form,
      translation: translation,
    });

    const response = await fetch(`${CLOUDFLARE_WORKER_URL}/api/form-occurrences?${params}`);

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      console.warn(`D1 form-occurrences query failed (${response.status}), falling back`);
      return null;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.warn(`Failed to get form occurrences for "${form}":`, error);
    return null;
  }
}

/**
 * Search verses using form_occurrences table for all related forms
 * This is optimized for inflection/conjugation searches
 */
export async function searchVersesByForms(
  forms: string[],
  options: {
    translation?: 'afghan2023' | 'yousafzai2019';
    testament?: 'OT' | 'NT';
    limit?: number;
  } = {}
): Promise<Verse[]> {
  const translation = options.translation || 'afghan2023';
  const limit = options.limit || 600;

  // Use the NEW batch search endpoint - ONE request for ALL forms!
  try {
    const response = await fetch(`${CLOUDFLARE_WORKER_URL}/api/search-batch`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        forms,
        translation,
        testament: options.testament,
        limit,
      }),
    });

    if (!response.ok) {
      console.warn(`Batch search failed (${response.status}), falling back to sequential`);
      throw new Error('Batch search unavailable');
    }

    const data = await response.json();
    console.log(`✅ Batch search: ${data.count} results for ${data.formsSearched} forms in ${data.queryTime}ms`);
    
    // Convert to Verse format
    return (data.verses || []).map((v: any) => ({
      ref: `${v.book} ${v.chapter}:${v.verse}`,
      text: v.text,
      book: v.book,
      chapter: v.chapter,
      verse: v.verse,
      testament: v.testament,
      translation: v.translation || translation,
      matchedForms: v.matchedForms,
      audio_r2_key: v.audio_r2_key,
    }));
  } catch (error) {
    console.warn('Batch search failed, using fallback:', error);
    
    // Fallback: Single form search for first form only (fast)
    if (forms.length > 0) {
      const firstForm = forms[0];
      return searchVerses(firstForm, {
        translation,
        testament: options.testament,
        limit,
      });
    }
    return [];
  }
}

/**
 * Fetch verb conjugated forms from D1 verb_forms table
 * This uses pre-computed LingDocs-verified conjugations (237K+ forms)
 * Much faster and more complete than runtime generation
 */
export async function fetchVerbFormsFromD1(
  lemma: string,
  options: {
    cap?: number;
  } = {}
): Promise<Array<{
  form: string;
  tense?: string;
  person?: string;
  voice?: string;
  gender?: string;
  helper?: string;
  confidence?: number;
}>> {
  const cap = options.cap || 200;

  try {
    const params = new URLSearchParams({
      lemma,
      cap: String(cap),
    });

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s timeout

    const response = await fetch(`${CLOUDFLARE_WORKER_URL}/api/verb-forms?${params}`, {
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      if (response.status === 404 || response.status >= 500) {
        console.warn(`D1 Worker unavailable for verb-forms (${response.status})`);
        return [];
      }
      throw new Error(`Verb forms fetch failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data.forms || [];
  } catch (error) {
    console.error(`Failed to fetch verb forms for ${lemma}:`, error);
    return [];
  }
}

/**
 * Fetch verb lexicon metadata from D1 verbs_lexicon table
 */
export async function fetchVerbLexicon(
  lemma: string
): Promise<{
  id: number;
  lemma: string;
  romanization?: string;
  english?: string;
  type?: string;
  helper?: string;
  transitivity?: string;
  root?: string;
} | null> {
  try {
    const params = new URLSearchParams({
      lemma,
    });

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s timeout

    const response = await fetch(`${CLOUDFLARE_WORKER_URL}/api/verb-lexicon?${params}`, {
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      console.warn(`D1 Worker unavailable for verb-lexicon (${response.status})`);
      return null;
    }

    const data = await response.json();
    return data.entry || null;
  } catch (error) {
    console.error(`Failed to fetch verb lexicon for ${lemma}:`, error);
    return null;
  }
}



/**
 * Get verb metadata (alias for fetchVerbLexicon)
 * Used by the verb lookup API
 */
export async function getVerbMetadata(word: string) {
  return fetchVerbLexicon(word);
}

/**
 * Get verb conjugations (alias for fetchVerbFormsFromD1)
 * Used by the verb lookup API
 */
export async function getVerbConjugations(word: string) {
  return fetchVerbFormsFromD1(word);
}
