import 'server-only';
import fs from 'node:fs/promises';
import path from 'node:path';
import { gunzipSync } from 'node:zlib';
import { createClient } from '@supabase/supabase-js';

type DictionaryEntry = {
  pashto: string;
  romanized: string;
  pos?: string;
};

type FrequencyRow = {
  pashto: string;
  frequency: number;
};

type InflectionRow = {
  form: string;
  romanization?: string;
  category?: string;
};

type OccurrenceRow = {
  count: number;
  verses?: string[];
};

export type VerseRecord = {
  ref: string;
  book: string;
  chapter?: number;
  verse?: number;
  text: string;
  textNormalized?: string;
  textLower: string;
  textNormalizedLower?: string;
  testament?: 'OT' | 'NT';
  source?: string;
};

// Create a search index for faster lookups
export type SearchIndex = {
  verses: VerseRecord[];
  byTextLower: Map<string, VerseRecord[]>;
  byTextNormalizedLower: Map<string, VerseRecord[]>;
};

type DataCache = {
  dictionary: DictionaryEntry[];
  dictionaryByPashto: Map<string, DictionaryEntry>;
  dictionaryByRomanized: Map<string, DictionaryEntry[]>;
  frequencyMap: Map<string, number>;
  inflectionsByBase: Map<string, InflectionRow[]>;
  formsByRoot: Map<string, string[]>;
  formToRoot: Record<string, string[]>;
  occurrenceMap: Map<string, OccurrenceRow>;
  verses: VerseRecord[];
  searchIndex: SearchIndex;
  unaccent: (input: string) => string;
};

const globalForLoader = globalThis as unknown as { __PBS_DATA__?: Promise<DataCache>; __PBS_DATA_CACHE__?: DataCache };

const PASHTO_BOOKS_OT = new Set<string>([
  'Genesis', 'Exodus', 'Leviticus', 'Numbers', 'Deuteronomy', 'Joshua', 'Judges', 'Ruth',
  '1-Samuel', '2-Samuel', '1-Kings', '2-Kings', '1-Chronicles', '2-Chronicles', 'Ezra',
  'Nehemiah', 'Esther', 'Job', 'Psalms', 'Proverbs', 'Ecclesiastes', 'Song-of-Solomon',
  'Isaiah', 'Jeremiah', 'Lamentations', 'Ezekiel', 'Daniel', 'Hosea', 'Joel', 'Amos',
  'Obadiah', 'Jonah', 'Micah', 'Nahum', 'Habakkuk', 'Zephaniah', 'Haggai', 'Zechariah',
  'Malachi'
]);

function normaliseBook(book: string): string {
  return book.replace(/_/g, '-');
}

function splitRef(ref: string): { book: string; chapter?: number; verse?: number } {
  const [bookPart, versePart] = ref.split(' ');
  const [chapterStr, verseStr] = (versePart ?? '').split(':');
  return {
    book: bookPart,
    chapter: chapterStr ? Number.parseInt(chapterStr, 10) : undefined,
    verse: verseStr ? Number.parseInt(verseStr, 10) : undefined,
  };
}

async function readJson<T>(relativePath: string, encoding: BufferEncoding = 'utf8'): Promise<T> {
  // In production, files are in public directory
  const isProduction = process.env.NODE_ENV === 'production';
  const basePath = isProduction ? 'public' : 'app/data';
  const filePath = path.join(process.cwd(), basePath, relativePath);
  const raw = await fs.readFile(filePath, { encoding });
  return JSON.parse(raw) as T;
}

// Pre-compute verses data to avoid repeated decompression
let versesCache: VerseRecord[] | null = null;

async function loadVerses(): Promise<VerseRecord[]> {
  if (versesCache) {
    return versesCache;
  }

  // In production, load from public directory
  const isProduction = process.env.NODE_ENV === 'production';
  const filePath = isProduction
    ? path.join(process.cwd(), 'public', 'verses.json.gz')
    : path.join(process.cwd(), 'app', 'data', 'verses.json');

  let raw: Record<string, any>;
  if (isProduction) {
    const compressed = await fs.readFile(filePath);
    const jsonText = gunzipSync(compressed).toString('utf8');
    raw = JSON.parse(jsonText) as Record<string, any>;
  } else {
    // In development, load from app/data/verses.json (not compressed)
    const rawText = await fs.readFile(filePath, 'utf8');
    raw = JSON.parse(rawText) as Record<string, any>;
  }
  const verses: VerseRecord[] = [];

  for (const [ref, value] of Object.entries(raw)) {
    if (!value || typeof value !== 'object') continue;
    const text: string | undefined = value.text;
    if (!ref || !text) continue;

    const { book, chapter, verse } = splitRef(ref);
    const normalizedBook = normaliseBook(book);
    const plainBook = normalizedBook.replace(/-/g, ' ');
    const canonicalBook = plainBook.replace(/\s+/g, ' ').trim();
    const testament = PASHTO_BOOKS_OT.has(normalizedBook) || PASHTO_BOOKS_OT.has(canonicalBook)
      ? 'OT'
      : 'NT';

    const textLower = text.toLowerCase();
    const textNormalized: string | undefined = typeof value.text_normalized === 'string' ? value.text_normalized : undefined;

    verses.push({
      ref,
      book: canonicalBook,
      chapter,
      verse,
      text,
      textNormalized,
      textLower,
      textNormalizedLower: textNormalized ? textNormalized.toLowerCase() : undefined,
      testament,
      source: typeof value.source === 'string' ? value.source : undefined,
    });
  }

  versesCache = verses;
  return verses;
}

function extractRomanized(entry: any): string | undefined {
  const candidates = [entry.f_primary, entry.f, entry.g, entry.romanized, entry.pronunciation]
    .flat()
    .filter((value) => typeof value === 'string') as string[];

  if (!candidates.length) return undefined;
  const candidate = candidates.find((value) => value.trim().length > 0) ?? candidates[0];
  return candidate.split(',')[0]?.trim();
}

function buildDictionaryEntries(dictionaryRaw: any): DictionaryEntry[] {
  const entries = Array.isArray(dictionaryRaw?.entries) ? dictionaryRaw.entries : [];
  const output: DictionaryEntry[] = [];

  for (const entry of entries) {
    if (!entry) continue;
    const pashto: string | undefined = entry.p_norm || entry.p;
    const romanized = extractRomanized(entry);
    if (!pashto || !romanized) continue;

    const pos: string | undefined = entry.c || entry.c_norm || entry.pos_family;
    output.push({ pashto: pashto.trim(), romanized, pos: pos?.trim() });
  }

  return output;
}

function buildFormsByRoot(formToRoot: Record<string, string[]>): Map<string, string[]> {
  const map = new Map<string, Set<string>>();

  for (const [form, roots] of Object.entries(formToRoot)) {
    if (!Array.isArray(roots)) continue;
    for (const root of roots) {
      if (!root) continue;
      if (!map.has(root)) map.set(root, new Set<string>());
      map.get(root)!.add(form);
    }
  }

  const finalMap = new Map<string, string[]>();
  for (const [root, forms] of map.entries()) {
    finalMap.set(root, Array.from(forms));
  }

  return finalMap;
}

function normaliseRomanized(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[^A-Za-z'\-\s]/g, '')
    .toLowerCase()
    .trim();
}

async function loadData(): Promise<DataCache> {
  // Load smaller files first for faster parallel processing
  const [frequencies, inflections, formToRoot, occurrences, dictionaryRaw] = await Promise.all([
    readJson<FrequencyRow[]>('word_frequency_list.json'),
    readJson<Record<string, InflectionRow[]>>('inflections_cache.json'),
    readJson<Record<string, string[]>>('form_to_root_map.json'),
    readJson<Record<string, OccurrenceRow>>('form_occurrence_index.json'),
    readJson<any>('full_dictionary_enriched.json'),
  ]);

  const dictionary = buildDictionaryEntries(dictionaryRaw);
  const dictionaryByPashto = new Map<string, DictionaryEntry>();
  const dictionaryByRomanized = new Map<string, DictionaryEntry[]>();

  for (const entry of dictionary) {
    if (!dictionaryByPashto.has(entry.pashto)) {
      dictionaryByPashto.set(entry.pashto, entry);
    }

    const romanKey = normaliseRomanized(entry.romanized);
    if (!romanKey) continue;

    const bucket = dictionaryByRomanized.get(romanKey) ?? [];
    bucket.push(entry);
    dictionaryByRomanized.set(romanKey, bucket);
  }

  const frequencyMap = new Map<string, number>();
  for (const row of frequencies) {
    if (!row?.pashto) continue;
    const value = typeof row.frequency === 'number' ? row.frequency : Number.parseInt(String(row.frequency ?? 0), 10) || 0;
    frequencyMap.set(row.pashto, value);
  }

  const inflectionsByBase = new Map<string, InflectionRow[]>();
  for (const [base, rows] of Object.entries(inflections)) {
    if (!Array.isArray(rows)) continue;
    const cleaned = rows
      .filter((row) => row && typeof row.form === 'string' && row.form.trim().length > 0)
      .map((row) => ({
        form: row.form.trim(),
        romanization: row.romanization,
        category: row.category,
      }));

    if (cleaned.length) {
      inflectionsByBase.set(base.trim(), cleaned);
    }
  }

  const occurrenceMap = new Map<string, OccurrenceRow>();
  for (const [form, payload] of Object.entries(occurrences)) {
    if (!payload) continue;
    const count = typeof payload.count === 'number'
      ? payload.count
      : typeof (payload as any).frequency === 'number'
        ? (payload as any).frequency
        : 0;

    occurrenceMap.set(form, { count, verses: Array.isArray(payload.verses) ? payload.verses : undefined });
  }

  const verses = await loadVerses();
  const formsByRoot = buildFormsByRoot(formToRoot);

  // Create search index for faster lookups
  const byTextLower = new Map<string, VerseRecord[]>();
  const byTextNormalizedLower = new Map<string, VerseRecord[]>();

  for (const verse of verses) {
    // Index by original text (lowercased)
    const words = verse.textLower.split(/\s+/);
    for (const word of words) {
      if (word.length > 0) {
        const bucket = byTextLower.get(word) ?? [];
        bucket.push(verse);
        byTextLower.set(word, bucket);
      }
    }

    // Index by normalized text (if available)
    if (verse.textNormalizedLower) {
      const normWords = verse.textNormalizedLower.split(/\s+/);
      for (const normWord of normWords) {
        if (normWord.length > 0) {
          const bucket = byTextNormalizedLower.get(normWord) ?? [];
          bucket.push(verse);
          byTextNormalizedLower.set(normWord, bucket);
        }
      }
    }
  }

  const searchIndex: SearchIndex = {
    verses,
    byTextLower,
    byTextNormalizedLower,
  };

  const unaccent = (input: string): string => input
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();

  return {
    dictionary,
    dictionaryByPashto,
    dictionaryByRomanized,
    frequencyMap,
    inflectionsByBase,
    formsByRoot,
    formToRoot,
    occurrenceMap,
    verses,
    searchIndex,
    unaccent,
  };
}

// Lightweight data for endpoints that only need dictionary and frequency
type LightweightData = {
  dictionaryByPashto: Map<string, DictionaryEntry>;
  dictionaryByRomanized: Map<string, DictionaryEntry[]>;
  frequencyMap: Map<string, number>;
  formToRoot: Record<string, string[]>;
  formsByRoot: Map<string, string[]>;
  occurrenceMap: Map<string, OccurrenceRow>;
  inflectionsByBase: Map<string, InflectionRow[]>;
  unaccent: (input: string) => string;
};

const lightweightCache = globalThis as unknown as { __PBS_LIGHTWEIGHT_CACHE__?: Promise<LightweightData>; __PBS_LIGHTWEIGHT_DATA__?: LightweightData };

// Search data for endpoints that need full search capability
type SearchData = {
  verses: VerseRecord[];
  searchIndex: SearchIndex;
  indexesLoaded: boolean;
};

const searchCache = globalThis as unknown as { __PBS_SEARCH_CACHE__?: Promise<SearchData>; __PBS_SEARCH_DATA__?: SearchData };

// Lazy-loaded search data that builds indexes only when needed
type LazySearchData = {
  verses: VerseRecord[];
  searchIndex?: SearchIndex;
  indexesLoaded: boolean;
};

const lazySearchCache = globalThis as unknown as { __PBS_LAZY_SEARCH_CACHE__?: Promise<LazySearchData>; __PBS_LAZY_SEARCH_DATA__?: LazySearchData };

async function loadLightweightData(): Promise<LightweightData> {
  const [frequencies, inflections, formToRoot, occurrences, dictionaryRaw] = await Promise.all([
    readJson<FrequencyRow[]>('word_frequency_list.json'),
    readJson<Record<string, InflectionRow[]>>('inflections_cache.json'),
    readJson<Record<string, string[]>>('form_to_root_map.json'),
    readJson<Record<string, OccurrenceRow>>('form_occurrence_index.json'),
    readJson<any>('full_dictionary_enriched.json'),
  ]);

  const dictionary = buildDictionaryEntries(dictionaryRaw);
  const dictionaryByPashto = new Map<string, DictionaryEntry>();
  const dictionaryByRomanized = new Map<string, DictionaryEntry[]>();

  for (const entry of dictionary) {
    if (!dictionaryByPashto.has(entry.pashto)) {
      dictionaryByPashto.set(entry.pashto, entry);
    }

    const romanKey = normaliseRomanized(entry.romanized);
    if (!romanKey) continue;

    const bucket = dictionaryByRomanized.get(romanKey) ?? [];
    bucket.push(entry);
    dictionaryByRomanized.set(romanKey, bucket);
  }

  const frequencyMap = new Map<string, number>();
  for (const row of frequencies) {
    if (!row?.pashto) continue;
    const value = typeof row.frequency === 'number' ? row.frequency : Number.parseInt(String(row.frequency ?? 0), 10) || 0;
    frequencyMap.set(row.pashto, value);
  }

  const inflectionsByBase = new Map<string, InflectionRow[]>();
  for (const [base, rows] of Object.entries(inflections)) {
    if (!Array.isArray(rows)) continue;
    const cleaned = rows
      .filter((row) => row && typeof row.form === 'string' && row.form.trim().length > 0)
      .map((row) => ({
        form: row.form.trim(),
        romanization: row.romanization,
        category: row.category,
      }));

    if (cleaned.length) {
      inflectionsByBase.set(base.trim(), cleaned);
    }
  }

  const occurrenceMap = new Map<string, OccurrenceRow>();
  for (const [form, payload] of Object.entries(occurrences)) {
    if (!payload) continue;
    const count = typeof payload.count === 'number'
      ? payload.count
      : typeof (payload as any).frequency === 'number'
        ? (payload as any).frequency
        : 0;

    occurrenceMap.set(form, { count, verses: Array.isArray(payload.verses) ? payload.verses : undefined });
  }

  const formsByRoot = buildFormsByRoot(formToRoot);

  const unaccent = (input: string): string => input
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();

  return {
    dictionaryByPashto,
    dictionaryByRomanized,
    frequencyMap,
    formToRoot,
    formsByRoot,
    occurrenceMap,
    inflectionsByBase,
    unaccent,
  };
}

async function loadLazyLoadedVerses(): Promise<LazySearchData> {
  const verses = await loadVerses();

  return {
    verses,
    indexesLoaded: false,
  };
}

async function loadSearchData(): Promise<SearchData> {
  const verses = await loadVerses();

  // Create search index for faster lookups
  const byTextLower = new Map<string, VerseRecord[]>();
  const byTextNormalizedLower = new Map<string, VerseRecord[]>();

  for (const verse of verses) {
    // Index by original text (lowercased)
    const words = verse.textLower.split(/\s+/);
    for (const word of words) {
      if (word.length > 0) {
        const bucket = byTextLower.get(word) ?? [];
        bucket.push(verse);
        byTextLower.set(word, bucket);
      }
    }

    // Index by normalized text (if available)
    if (verse.textNormalizedLower) {
      const normWords = verse.textNormalizedLower.split(/\s+/);
      for (const normWord of normWords) {
        if (normWord.length > 0) {
          const bucket = byTextNormalizedLower.get(normWord) ?? [];
          bucket.push(verse);
          byTextNormalizedLower.set(normWord, bucket);
        }
      }
    }
  }

  const searchIndex: SearchIndex = {
    verses,
    byTextLower,
    byTextNormalizedLower,
  };

  return {
    verses,
    searchIndex,
    indexesLoaded: true,
  };
}

export async function getLightweightData(): Promise<LightweightData> {
  // Use resolved cache if available
  if (lightweightCache.__PBS_LIGHTWEIGHT_DATA__) {
    return lightweightCache.__PBS_LIGHTWEIGHT_DATA__;
  }

  // If loading is in progress, wait for it
  if (lightweightCache.__PBS_LIGHTWEIGHT_CACHE__) {
    return lightweightCache.__PBS_LIGHTWEIGHT_CACHE__;
  }

  // Start loading and cache the promise
  const loadingPromise = loadLightweightData();
  lightweightCache.__PBS_LIGHTWEIGHT_CACHE__ = loadingPromise;

  try {
    const data = await loadingPromise;
    // Cache the resolved data for future requests
    lightweightCache.__PBS_LIGHTWEIGHT_DATA__ = data;
    // Clear the loading promise
    lightweightCache.__PBS_LIGHTWEIGHT_CACHE__ = undefined;
    return data;
  } catch (error) {
    // Clear the failed promise
    lightweightCache.__PBS_LIGHTWEIGHT_CACHE__ = undefined;
    throw error;
  }
}

export async function getSearchData(): Promise<SearchData> {
  // Use resolved cache if available
  if (searchCache.__PBS_SEARCH_DATA__) {
    return searchCache.__PBS_SEARCH_DATA__;
  }

  // If loading is in progress, wait for it
  if (searchCache.__PBS_SEARCH_CACHE__) {
    return searchCache.__PBS_SEARCH_CACHE__;
  }

  // Start loading and cache the promise
  const loadingPromise = loadSearchData();
  searchCache.__PBS_SEARCH_CACHE__ = loadingPromise;

  try {
    const data = await loadingPromise;
    // Cache the resolved data for future requests
    searchCache.__PBS_SEARCH_DATA__ = data;
    // Clear the loading promise
    searchCache.__PBS_SEARCH_CACHE__ = undefined;
    return data;
  } catch (error) {
    // Clear the failed promise
    searchCache.__PBS_SEARCH_CACHE__ = undefined;
    throw error;
  }
}

export async function getLazyLoadedSearchData(): Promise<LazySearchData> {
  // Use resolved cache if available
  if (lazySearchCache.__PBS_LAZY_SEARCH_DATA__) {
    return lazySearchCache.__PBS_LAZY_SEARCH_DATA__;
  }

  // If loading is in progress, wait for it
  if (lazySearchCache.__PBS_LAZY_SEARCH_CACHE__) {
    return lazySearchCache.__PBS_LAZY_SEARCH_CACHE__;
  }

  // Start loading and cache the promise
  const loadingPromise = loadLazyLoadedVerses();
  lazySearchCache.__PBS_LAZY_SEARCH_CACHE__ = loadingPromise;

  try {
    const data = await loadingPromise;
    // Cache the resolved data for future requests
    lazySearchCache.__PBS_LAZY_SEARCH_DATA__ = data;
    // Clear the loading promise
    lazySearchCache.__PBS_LAZY_SEARCH_CACHE__ = undefined;
    return data;
  } catch (error) {
    // Clear the failed promise
    lazySearchCache.__PBS_LAZY_SEARCH_CACHE__ = undefined;
    throw error;
  }
}

// Build search indexes on demand from lazy-loaded data
export async function buildSearchIndexes(lazyData: LazySearchData): Promise<SearchData> {
  if (lazyData.indexesLoaded && lazyData.searchIndex) {
    return {
      verses: lazyData.verses,
      searchIndex: lazyData.searchIndex,
      indexesLoaded: true,
    };
  }

  // Create search index for faster lookups
  const byTextLower = new Map<string, VerseRecord[]>();
  const byTextNormalizedLower = new Map<string, VerseRecord[]>();

  for (const verse of lazyData.verses) {
    // Index by original text (lowercased)
    const words = verse.textLower.split(/\s+/);
    for (const word of words) {
      if (word.length > 0) {
        const bucket = byTextLower.get(word) ?? [];
        bucket.push(verse);
        byTextLower.set(word, bucket);
      }
    }

    // Index by normalized text (if available)
    if (verse.textNormalizedLower) {
      const normWords = verse.textNormalizedLower.split(/\s+/);
      for (const normWord of normWords) {
        if (normWord.length > 0) {
          const bucket = byTextNormalizedLower.get(normWord) ?? [];
          bucket.push(verse);
          byTextNormalizedLower.set(normWord, bucket);
        }
      }
    }
  }

  const searchIndex: SearchIndex = {
    verses: lazyData.verses,
    byTextLower,
    byTextNormalizedLower,
  };

  return {
    verses: lazyData.verses,
    searchIndex,
    indexesLoaded: true,
  };
}

// Hybrid search function that uses JSON for fast results and database for complex queries
export async function hybridSearch(
  query: string,
  options: {
    scope?: 'all' | 'ot' | 'nt';
    includeRelated?: boolean;
    limit?: number;
    enableFuzzy?: boolean;
    variants?: string[];
  } = {}
): Promise<{
  results: any[];
  relatedForms?: any;
  processed: any;
  count: number;
  ms: number;
}> {
  const startTime = Date.now();
  const { scope = 'all', includeRelated = false, limit = 100, enableFuzzy = false, variants = [] } = options;

  try {
    // First, try fast JSON-based search
    const { searchIndex, verses } = await getSearchData();
    let results: any[] = [];

    // Generate search terms including variants if available
    let searchTerms = [query.toLowerCase()];
    if (includeRelated && variants.length > 0) {
      searchTerms.push(...variants.map(v => v.toLowerCase()));
    }

    // Fast exact match search using JSON index
    if (searchIndex?.byTextLower) {
      const candidateVerses = new Set();

      for (const searchTerm of searchTerms) {
        // Check original text index
        const originalMatches = searchIndex.byTextLower.get(searchTerm) || [];
        for (const verse of originalMatches) {
          if (matchesScope(verse, scope)) {
            candidateVerses.add(verse);
          }
        }

        // Check normalized text index
        const normalizedMatches = searchIndex.byTextNormalizedLower.get(searchTerm) || [];
        for (const verse of normalizedMatches) {
          if (matchesScope(verse, scope)) {
            candidateVerses.add(verse);
          }
        }
      }

      results = Array.from(candidateVerses).slice(0, limit);

      // If no exact matches and fuzzy search is enabled, try database
      if (!results.length && enableFuzzy) {
        const supabase = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );

        // Try fuzzy search in database
        const { data: dbResults } = await supabase
          .from('verses')
          .select('*')
          .textSearch('text', query)
          .limit(limit);

        if (dbResults) {
          results = dbResults.map((verse, index) => ({
            ref: verse.ref,
            text: verse.text,
            testament: verse.testament,
            book: verse.book || '',
          }));
        }
      }
    }

    // If still no results, fall back to database for complex queries
    if (!results.length) {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );

      const queryBuilder = supabase
        .from('verses')
        .select('*')
        .or(`text.ilike.%${query}%,text_normalized.ilike.%${query}%`)
        .limit(limit);

      const { data: dbResults } = await queryBuilder;
      if (dbResults) {
        results = dbResults.map((verse, index) => ({
          ref: verse.ref,
          text: verse.text,
          testament: verse.testament,
          book: verse.book || '',
        }));
      }
    }

    // Generate related forms if requested
    let relatedForms = null;
    if (includeRelated) {
      relatedForms = await generateRelatedForms(query);
    }

    return {
      results,
      relatedForms,
      processed: {
        original: query,
        normalized: query,
        searchType: results.length > 0 ? 'hybrid' : 'database',
      },
      count: results.length,
      ms: Date.now() - startTime,
    };
  } catch (error) {
    console.error('Hybrid search error:', error);
    throw error;
  }
}

// Helper function to check scope
function matchesScope(verse: any, scope: string): boolean {
  if (scope === 'all') return true;
  const testament = verse.testament?.toLowerCase();
  return testament === scope;
}

async function generateRelatedForms(word: string): Promise<any> {
  const { dictionaryByPashto, frequencyMap } = await getLightweightData();

  const dictEntry = dictionaryByPashto.get(word);
  let posGuess: 'noun' | 'verb' | 'adjective' | 'other' = 'other';

  if (dictEntry?.pos) {
    const posLower = dictEntry.pos.toLowerCase();
    if (posLower.startsWith("verb")) posGuess = "verb";
    else if (posLower.startsWith("noun")) posGuess = "noun";
    else if (posLower.startsWith("adj")) posGuess = "adjective";
    else posGuess = "other";
  }

  return {
    root: word,
    forms: {},
    total: 0,
    ms: 0,
  };
}

export async function getData(): Promise<DataCache> {
  // Use resolved cache if available
  if (globalForLoader.__PBS_DATA_CACHE__) {
    return globalForLoader.__PBS_DATA_CACHE__;
  }

  // If loading is in progress, wait for it
  if (globalForLoader.__PBS_DATA__) {
    return globalForLoader.__PBS_DATA__;
  }

  // Start loading and cache the promise
  const loadingPromise = loadData();
  globalForLoader.__PBS_DATA__ = loadingPromise;

  try {
    const data = await loadingPromise;
    // Cache the resolved data for future requests
    globalForLoader.__PBS_DATA_CACHE__ = data;
    // Clear the loading promise
    globalForLoader.__PBS_DATA__ = undefined;
    return data;
  } catch (error) {
    // Clear the failed promise
    globalForLoader.__PBS_DATA__ = undefined;
    throw error;
  }
}