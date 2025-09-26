import 'server-only';
import fs from 'node:fs/promises';
import path from 'node:path';
import { gunzipSync } from 'node:zlib';

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

type DataCache = {
  dictionary: DictionaryEntry[];
  dictionaryByPashto: Map<string, DictionaryEntry>;
  dictionaryByRomanized: Map<string, DictionaryEntry[]>;
  frequencyMap: Map<string, number>;
  inflectionsByBase: Map<string, InflectionRow[]>;
  formsByRoot: Map<string, string[]>;
  occurrenceMap: Map<string, OccurrenceRow>;
  verses: VerseRecord[];
  unaccent: (input: string) => string;
};

const globalForLoader = globalThis as unknown as { __PBS_DATA__?: Promise<DataCache> };

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
  const basePath = isProduction ? 'public' : '.';
  const filePath = path.join(process.cwd(), basePath, relativePath);
  const raw = await fs.readFile(filePath, { encoding });
  return JSON.parse(raw) as T;
}

async function loadVerses(): Promise<VerseRecord[]> {
  // In production, load from public directory
  const isProduction = process.env.NODE_ENV === 'production';
  const filePath = isProduction
    ? path.join(process.cwd(), 'public', 'verses.json.gz')
    : path.join(process.cwd(), 'cache', 'verses.json.gz');

  const compressed = await fs.readFile(filePath);
  const jsonText = gunzipSync(compressed).toString('utf8');
  const raw = JSON.parse(jsonText) as Record<string, any>;
  const verses: VerseRecord[] = [];

  for (const value of Object.values(raw)) {
    if (!value || typeof value !== 'object') continue;
    const ref: string | undefined = value.ref;
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
  const [dictionaryRaw, frequencies, inflections, formToRoot, occurrences] = await Promise.all([
    readJson<any>('full_dictionary_enriched.json'),
    readJson<FrequencyRow[]>('word_frequency_list.json'),
    readJson<Record<string, InflectionRow[]>>('inflections_cache.json'),
    readJson<Record<string, string[]>>('form_to_root_map.json'),
    readJson<Record<string, OccurrenceRow>>('form_occurrence_index.json'),
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
    occurrenceMap,
    verses,
    unaccent,
  };
}

export async function getData(): Promise<DataCache> {
  if (!globalForLoader.__PBS_DATA__) {
    globalForLoader.__PBS_DATA__ = loadData();
  }
  return globalForLoader.__PBS_DATA__;
}