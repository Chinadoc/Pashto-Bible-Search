import 'server-only';
import fs from 'node:fs/promises';
import path from 'node:path';
import { gunzipSync } from 'node:zlib';

type DictionaryEntry = {
  pashto: string;
  romanized: string;
  pos?: string;
  c?: string;
  english?: string;
  // LingDocs properties
  ts?: number;
  p?: string;
  f?: string;
  e?: string;
  r?: number;
  a?: number;
  i?: number;
  g?: string;
  c_norm?: string;
  pos_family?: string;
  gender?: string;
  f_primary?: string;
  p_norm?: string;
  l?: number;
  infap?: string;
  infaf?: string;
  infbp?: string;
  infbf?: string;
  infcp?: string;
  infcf?: string;
  app?: string;
  apf?: string;
  tppp?: string;
  tppf?: string;
  ec?: string;
  ep?: string;
  a_norm?: number;
  i_norm?: number;
  // Additional LingDocs properties
  ppp?: string;
  ppf?: string;
  psp?: string;
  psf?: string;
  ssp?: string;
  ssf?: string;
  prp?: string;
  prf?: string;
  pprtp?: string;
  pprtf?: string;
  noInf?: boolean;
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

export type TranslationKey = 'afghan2023' | 'yousafzai2019';

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
  translationKey?: TranslationKey;
  translationLabel?: string;
  dialect?: string | null;
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
  yousafzaiFrequencyMap: Map<string, number>;
  inflectionsByBase: Map<string, InflectionRow[]>;
  formsByRoot: Map<string, string[]>;
  formToRoot: Record<string, string[]>;
  occurrenceMap: Map<string, OccurrenceRow>;
  verses: VerseRecord[];
  searchIndex: SearchIndex;
  unaccent: (input: string) => string;
};

// Global data cache with improved TTL
const globalForLoader = globalThis as unknown as {
  __PBS_DATA__?: Promise<DataCache>;
  __PBS_DATA_CACHE__?: DataCache;
  __PBS_DATA_CACHE_TIME__?: number;
};

const DATA_CACHE_TTL = 7200000; // 2 hours (increased for better performance)

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
const versesCache = new Map<TranslationKey, VerseRecord[]>();

async function loadVerses(translation: TranslationKey = 'afghan2023'): Promise<VerseRecord[]> {
  if (versesCache.has(translation)) {
    return versesCache.get(translation)!;
  }

  if (translation === 'afghan2023') {
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
        translationKey: 'afghan2023',
        translationLabel: 'Afghan 2023',
        dialect: (typeof value.dialect === 'string' ? value.dialect : undefined) ?? 'afghan',
      });
    }

    versesCache.set(translation, verses);
    return verses;
  }

  const candidatePaths = [
    path.join(process.cwd(), 'public', 'yousafzai_all_verses.json'),
    path.join(process.cwd(), 'app', 'data', 'yousafzai_all_verses.json'),
    path.join(process.cwd(), 'yousafzai_all_verses.json'),
  ];

  let jsonText: string | null = null;
  for (const candidate of candidatePaths) {
    try {
      jsonText = await fs.readFile(candidate, 'utf8');
      if (jsonText) break;
    } catch {
      continue;
    }
  }

  if (!jsonText) {
    throw new Error('Yousafzai verses dataset not found (yousafzai_all_verses.json)');
  }

  const parsed = JSON.parse(jsonText) as Array<Record<string, any>>;
  const verses: VerseRecord[] = [];

  for (const entry of parsed) {
    if (!entry) continue;
    const bookRaw = typeof entry.book === 'string' ? entry.book.trim() : '';
    if (!bookRaw) continue;
    const chapter = Number.parseInt(String(entry.chapter ?? 0), 10) || 0;
    const verseNumber = Number.parseInt(String(entry.verse ?? 0), 10) || 0;
    const ref = `${bookRaw} ${chapter}:${verseNumber}`;

    const rawText = typeof entry.text === 'string' ? entry.text : '';
    const htmlText = typeof entry.text_html === 'string' ? entry.text_html : rawText;
    const cleanText = rawText.replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
    const normalized = htmlText.replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim() || cleanText;

    if (!cleanText) continue;

    const textLower = cleanText.toLowerCase();
    const textNormalizedLower = normalized ? normalized.toLowerCase() : undefined;
    const canonicalBook = bookRaw.replace(/\s+/g, ' ').trim();
    const testament = PASHTO_BOOKS_OT.has(canonicalBook) ? 'OT' : 'NT';

    verses.push({
      ref,
      book: canonicalBook,
      chapter,
      verse: verseNumber,
      text: cleanText,
      textNormalized: normalized,
      textLower,
      textNormalizedLower,
      testament,
      source: 'yousafzai_all_verses.json',
      translationKey: 'yousafzai2019',
      translationLabel: typeof entry.translation === 'string' ? entry.translation : 'Yousafzai 2019',
      dialect: typeof entry.dialect === 'string' ? entry.dialect : 'yousafzai',
    });
  }

  versesCache.set(translation, verses);
  return verses;
}

function buildSearchIndex(verses: VerseRecord[]): SearchIndex {
  const byTextLower = new Map<string, VerseRecord[]>();
  const byTextNormalizedLower = new Map<string, VerseRecord[]>();

  for (const verse of verses) {
    const words = verse.textLower.split(/\s+/);
    for (const word of words) {
      if (!word) continue;
      const bucket = byTextLower.get(word) ?? [];
      bucket.push(verse);
      byTextLower.set(word, bucket);
    }

    if (verse.textNormalizedLower) {
      const normWords = verse.textNormalizedLower.split(/\s+/);
      for (const normWord of normWords) {
        if (!normWord) continue;
        const bucket = byTextNormalizedLower.get(normWord) ?? [];
        bucket.push(verse);
        byTextNormalizedLower.set(normWord, bucket);
      }
    }
  }

  return {
    verses,
    byTextLower,
    byTextNormalizedLower,
  };
}

function extractRomanized(entry: any): string | undefined {
  const candidates = [entry.f_primary, entry.f, entry.g, entry.romanized, entry.pronunciation]
    .flat()
    .filter((value) => typeof value === 'string') as string[];

  if (!candidates.length) return undefined;
  const candidate = candidates.find((value) => value.trim().length > 0) ?? candidates[0];
  return candidate.split(',')[0]?.trim();
}

function extractEnglish(entry: any): string | undefined {
  if (!entry) return undefined;

  // Try direct 'e' field (most common in LingDocs format)
  if (typeof entry.e === 'string') {
    const trimmed = entry.e.trim();
    if (trimmed.length) return trimmed;
  }

  // Try 'english' field (could be string or array)
  if (typeof entry.english === 'string') {
    const trimmed = entry.english.trim();
    if (trimmed.length) return trimmed;
  }

  if (Array.isArray(entry.english)) {
    const parts = entry.english
      .map((value: any) => (typeof value === 'string' ? value.trim() : ''))
      .filter(Boolean);
    if (parts.length) {
      return parts.join(', ');
    }
  }

  // Try 'definition' field as fallback
  if (typeof entry.definition === 'string') {
    const trimmed = entry.definition.trim();
    if (trimmed.length) return trimmed;
  }

  return undefined;
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
    const english = extractEnglish(entry);

    // Extract all LingDocs properties
    output.push({
      pashto: pashto.trim(),
      romanized,
      pos: pos?.trim(),
      c: entry.c?.trim(),
      english: english?.trim(),
      // LingDocs properties
      ts: entry.ts,
      p: entry.p,
      f: entry.f,
      e: entry.e,
      r: entry.r,
      a: entry.a,
      i: entry.i,
      g: entry.g,
      c_norm: entry.c_norm,
      pos_family: entry.pos_family,
      gender: entry.gender,
      f_primary: entry.f_primary,
      p_norm: entry.p_norm,
      l: entry.l,
      infap: entry.infap,
      infaf: entry.infaf,
      infbp: entry.infbp,
      infbf: entry.infbf,
      infcp: entry.infcp,
      infcf: entry.infcf,
      app: entry.app,
      apf: entry.apf,
      tppp: entry.tppp,
      tppf: entry.tppf,
      ec: entry.ec,
      ep: entry.ep,
      a_norm: entry.a_norm,
      i_norm: entry.i_norm,
      // Additional LingDocs properties
      ppp: entry.ppp,
      ppf: entry.ppf,
      psp: entry.psp,
      psf: entry.psf,
      ssp: entry.ssp,
      ssf: entry.ssf,
      prp: entry.prp,
      prf: entry.prf,
      pprtp: entry.pprtp,
      pprtf: entry.pprtf,
      noInf: entry.noInf
    });
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
  const [frequencies, yousafzaiFrequencies, inflections, formToRoot, occurrences, dictionaryRaw] = await Promise.all([
    readJson<FrequencyRow[]>('word_frequency_list.json'),
    readJson<FrequencyRow[]>('yousafzai_word_frequency_list.json').catch(() => []), // Fallback to empty array if file doesn't exist
    readJson<Record<string, InflectionRow[]>>('inflections_cache.json').catch(() => ({})), // Fallback to empty object if file doesn't exist
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

  const yousafzaiFrequencyMap = new Map<string, number>();
  for (const row of yousafzaiFrequencies) {
    if (!row?.pashto) continue;
    const value = typeof row.frequency === 'number' ? row.frequency : Number.parseInt(String(row.frequency ?? 0), 10) || 0;
    yousafzaiFrequencyMap.set(row.pashto, value);
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
    yousafzaiFrequencyMap,
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
  yousafzaiFrequencyMap: Map<string, number>;
  formToRoot: Record<string, string[]>;
  formsByRoot: Map<string, string[]>;
  occurrenceMap: Map<string, OccurrenceRow>;
  inflectionsByBase: Map<string, InflectionRow[]>;
  unaccent: (input: string) => string;
};

const lightweightCache = globalThis as unknown as { __PBS_LIGHTWEIGHT_CACHE__?: Promise<LightweightData>; __PBS_LIGHTWEIGHT_DATA__?: LightweightData; __PBS_LIGHTWEIGHT_CACHE_TIME__?: number };
const LIGHTWEIGHT_CACHE_TTL = 7200000; // 2 hours

// Search data for endpoints that need full search capability
type SearchData = {
  verses: VerseRecord[];
  searchIndex: SearchIndex;
  indexesLoaded: boolean;
};

const searchCache = globalThis as unknown as { __PBS_SEARCH_CACHE__?: Promise<SearchData>; __PBS_SEARCH_DATA__?: SearchData; __PBS_SEARCH_CACHE_TIME__?: number };
const SEARCH_DATA_CACHE_TTL = 7200000; // 2 hours

// Lazy-loaded search data that builds indexes only when needed
type LazySearchData = {
  verses: VerseRecord[];
  searchIndex?: SearchIndex;
  indexesLoaded: boolean;
};

const lazySearchCache = globalThis as unknown as { __PBS_LAZY_SEARCH_CACHE__?: Promise<LazySearchData>; __PBS_LAZY_SEARCH_DATA__?: LazySearchData; __PBS_LAZY_SEARCH_CACHE_TIME__?: number };
const LAZY_SEARCH_CACHE_TTL = 7200000; // 2 hours

async function loadLightweightData(): Promise<LightweightData> {
  const [frequencies, yousafzaiFrequencies, inflections, formToRoot, occurrences, dictionaryRaw] = await Promise.all([
    readJson<FrequencyRow[]>('word_frequency_list.json'),
    readJson<FrequencyRow[]>('yousafzai_word_frequency_list.json').catch(() => []), // Fallback to empty array if file doesn't exist
    readJson<Record<string, InflectionRow[]>>('inflections_cache.json').catch(() => ({})), // Fallback to empty object if file doesn't exist
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

  const yousafzaiFrequencyMap = new Map<string, number>();
  for (const row of yousafzaiFrequencies) {
    if (!row?.pashto) continue;
    const value = typeof row.frequency === 'number' ? row.frequency : Number.parseInt(String(row.frequency ?? 0), 10) || 0;
    yousafzaiFrequencyMap.set(row.pashto, value);
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
    yousafzaiFrequencyMap,
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
  // Check if we have valid cached data with TTL
  if (lightweightCache.__PBS_LIGHTWEIGHT_DATA__ &&
      lightweightCache.__PBS_LIGHTWEIGHT_CACHE_TIME__ &&
      (Date.now() - lightweightCache.__PBS_LIGHTWEIGHT_CACHE_TIME__) < LIGHTWEIGHT_CACHE_TTL) {
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
    // Cache the resolved data for future requests with timestamp
    lightweightCache.__PBS_LIGHTWEIGHT_DATA__ = data;
    lightweightCache.__PBS_LIGHTWEIGHT_CACHE_TIME__ = Date.now();
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
  // Check if we have valid cached data with TTL
  if (searchCache.__PBS_SEARCH_DATA__ &&
      searchCache.__PBS_SEARCH_CACHE_TIME__ &&
      (Date.now() - searchCache.__PBS_SEARCH_CACHE_TIME__) < SEARCH_DATA_CACHE_TTL) {
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
    // Cache the resolved data for future requests with timestamp
    searchCache.__PBS_SEARCH_DATA__ = data;
    searchCache.__PBS_SEARCH_CACHE_TIME__ = Date.now();
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
  // Check if we have valid cached data with TTL
  if (lazySearchCache.__PBS_LAZY_SEARCH_DATA__ &&
      lazySearchCache.__PBS_LAZY_SEARCH_CACHE_TIME__ &&
      (Date.now() - lazySearchCache.__PBS_LAZY_SEARCH_CACHE_TIME__) < LAZY_SEARCH_CACHE_TTL) {
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
    // Cache the resolved data for future requests with timestamp
    lazySearchCache.__PBS_LAZY_SEARCH_DATA__ = data;
    lazySearchCache.__PBS_LAZY_SEARCH_CACHE_TIME__ = Date.now();
    // Clear the loading promise
    lazySearchCache.__PBS_LAZY_SEARCH_CACHE__ = undefined;
    return data;
  } catch (error) {
    // Clear the failed promise
    lazySearchCache.__PBS_LAZY_SEARCH_CACHE__ = undefined;
    throw error;
  }
}

// Cache warming utility for production deployments
export async function warmCaches(): Promise<void> {
  console.log('🔥 Warming up caches...');

  try {
    // Warm up lightweight data cache (dictionary, frequencies, etc.)
    await getLightweightData();
    console.log('✅ Lightweight data cache warmed');

    // Warm up search data cache (verses and indexes)
    await getSearchData();
    console.log('✅ Search data cache warmed');

    // Warm up lazy search data cache (verses only)
    await getLazyLoadedSearchData();
    console.log('✅ Lazy search data cache warmed');

    console.log('🎉 All caches warmed successfully');
  } catch (error) {
    console.error('❌ Failed to warm caches:', error);
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

// Optimized hybrid search function with better performance
export async function hybridSearch(
  query: string,
  options: {
    scope?: 'all' | 'ot' | 'nt';
    includeRelated?: boolean;
    limit?: number;
    enableFuzzy?: boolean;
    variants?: string[];
    useMorphologicalSearch?: boolean;
  } = {}
): Promise<any[]> {
  const {
    scope = 'all',
    limit = 100,
    useMorphologicalSearch = true
  } = options;

  try {
    if (useMorphologicalSearch) {
      // Use morphological search for better accuracy and performance
      const { morphologicalSearch } = await import('../search/index');
      const morphResult = await morphologicalSearch(query, scope as any, {
        limit,
        includeVariants: true,
        includeCompounds: false,
        maxVariants: 20, // Reduced for better performance
      });

      return morphResult.results;
    } else {
      // Fallback to optimized index-based search
      const { searchIndex } = await getSearchData();
      const candidateVerses = new Set();

      const searchTerm = query.toLowerCase();
      if (searchIndex?.verses) {
        for (const verse of searchIndex.verses) {
          if (!matchesScope(verse, scope)) continue;

          const textMatch = verse.textLower.includes(searchTerm);
          const normalizedMatch = verse.textNormalizedLower ? verse.textNormalizedLower.includes(searchTerm) : false;

          if (textMatch || normalizedMatch) {
            candidateVerses.add(verse);
          }
        }
      }

      return Array.from(candidateVerses).slice(0, limit);
    }
  } catch (error) {
    console.error('Hybrid search error:', error);
    return [];
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
  // Check if we have valid cached data
  if (globalForLoader.__PBS_DATA_CACHE__ &&
      globalForLoader.__PBS_DATA_CACHE_TIME__ &&
      (Date.now() - globalForLoader.__PBS_DATA_CACHE_TIME__) < DATA_CACHE_TTL) {
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
    globalForLoader.__PBS_DATA_CACHE_TIME__ = Date.now();
    // Clear the loading promise
    globalForLoader.__PBS_DATA__ = undefined;
    return data;
  } catch (error) {
    // Clear the failed promise
    globalForLoader.__PBS_DATA__ = undefined;
    throw error;
  }
}
