import { promises as fs } from 'fs';
import path from 'path';
import type { AudioMap } from '@/types';

type AudioMapCache = {
  data: AudioMap;
  timestamp: number;
};

const CACHE_TTL_MS = 30 * 60 * 1000; // 30 minutes
let cache: AudioMapCache | null = null;

const LOCAL_VERSE_MAP_CANDIDATES = [
  ['verse_audio_map.json'],
  ['audio_map.json'],
  ['Pashto-Bible-Search', 'verse_audio_map.json'],
  ['Pashto-Bible-Search', 'audio_map.json'],
];

const LOCAL_PROCESSED_MAP_CANDIDATES = [
  ['processed_audio_map.json'],
  ['Pashto-Bible-Search', 'processed_audio_map.json'],
];

const LOCAL_GOOGLE_DRIVE_CANDIDATES = [
  ['google_drive_audio_urls.json'],
  ['google_drive_audio_urls_backup.json'],
  ['google_drive_audio_urls_backup2.json'],
  ['yousafzai_google_drive_audio_urls.json'],
  ['Pashto-Bible-Search', 'google_drive_audio_urls.json'],
  ['Pashto-Bible-Search', 'google_drive_audio_urls_backup.json'],
  ['Pashto-Bible-Search', 'google_drive_audio_urls_backup2.json'],
];

const BOOK_NAMES = [
  'Genesis', 'Exodus', 'Leviticus', 'Numbers', 'Deuteronomy', 'Joshua', 'Judges', 'Ruth',
  '1 Samuel', '2 Samuel', '1 Kings', '2 Kings', '1 Chronicles', '2 Chronicles',
  'Ezra', 'Nehemiah', 'Esther', 'Job', 'Psalms', 'Proverbs', 'Ecclesiastes', 'Song of Solomon',
  'Isaiah', 'Jeremiah', 'Lamentations', 'Ezekiel', 'Daniel', 'Hosea', 'Joel', 'Amos',
  'Obadiah', 'Jonah', 'Micah', 'Nahum', 'Habakkuk', 'Zephaniah', 'Haggai', 'Zechariah', 'Malachi',
  'Matthew', 'Mark', 'Luke', 'John', 'Acts', 'Romans', '1 Corinthians', '2 Corinthians',
  'Galatians', 'Ephesians', 'Philippians', 'Colossians', '1 Thessalonians', '2 Thessalonians',
  '1 Timothy', '2 Timothy', 'Titus', 'Philemon', 'Hebrews', 'James', '1 Peter', '2 Peter',
  '1 John', '2 John', '3 John', 'Jude', 'Revelation',
];

const BOOK_NAME_LOOKUP = new Map<string, string>();
for (const name of BOOK_NAMES) {
  const normalized = normalizeKey(name);
  BOOK_NAME_LOOKUP.set(normalized, name);

  const numericMatch = normalized.match(/^(\d)(.+)$/);
  if (numericMatch) {
    BOOK_NAME_LOOKUP.set(normalizeKey(`${numericMatch[2]}${numericMatch[1]}`), name);
    BOOK_NAME_LOOKUP.set(normalizeKey(`${numericMatch[1]} ${numericMatch[2]}`), name);
    BOOK_NAME_LOOKUP.set(normalizeKey(`${numericMatch[2]} ${numericMatch[1]}`), name);
  }

  const hyphenAlias = normalizeKey(name.replace(/\s+/g, '-'));
  BOOK_NAME_LOOKUP.set(hyphenAlias, name);
}

function normalizeKey(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]/g, '');
}

export function canonicalBookFromSlug(value: string): string | null {
  return BOOK_NAME_LOOKUP.get(normalizeKey(value)) ?? null;
}

function toVerseRef(book: string, chapter: number | string, verse: number | string): string | null {
  const normalized = normalizeKey(book);
  const canonical = BOOK_NAME_LOOKUP.get(normalized);
  if (!canonical) return null;

  const chapterNum = Number(chapter);
  const verseNum = Number(verse);
  if (!Number.isFinite(chapterNum) || !Number.isFinite(verseNum)) {
    return null;
  }

  return `${canonical} ${chapterNum}:${verseNum}`;
}

function normalizeBookNameToSlug(bookName: string): string {
  return bookName.toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9]/g, '');
}

export function refToFilename(ref: string): string | null {
  const match = ref.match(/^(.+?)\s+(\d+):(\d+)$/);
  if (!match) return null;
  const [, book, chapterStr, verseStr] = match;
  const chapter = Number(chapterStr);
  const verse = Number(verseStr);
  if (Number.isNaN(chapter) || Number.isNaN(verse)) {
    return null;
  }
  const slug = normalizeBookNameToSlug(book);
  return `${slug}${chapter}_verse_${verse}.mp3`;
}

export function filenameVariants(ref: string): string[] {
  const match = ref.match(/^(.+?)\s+(\d+):(\d+)$/);
  if (!match) return [];
  const [, book, chapterStr, verseStr] = match;
  const slug = normalizeBookNameToSlug(book);
  const chapter = Number(chapterStr);
  const verse = Number(verseStr);
  if (Number.isNaN(chapter) || Number.isNaN(verse)) return [];

  const chapterPadded3 = String(chapter).padStart(3, '0');
  const versePadded3 = String(verse).padStart(3, '0');
  const chapterPadded2 = String(chapter).padStart(2, '0');
  const versePadded2 = String(verse).padStart(2, '0');

  const base = `${slug}${chapter}_verse_${verse}.mp3`;
  const padded = `${slug}${chapterPadded3}_verse_${versePadded3}.mp3`;
  const padded2 = `${slug}${chapterPadded2}_verse_${versePadded2}.mp3`;

  const variants = new Set<string>([base, padded, padded2]);

  const numericMatch = slug.match(/^(\d)([a-z].*)$/);
  if (numericMatch) {
    const [, leading, rest] = numericMatch;
    variants.add(`${rest}${leading}${chapter}_verse_${verse}.mp3`);
    variants.add(`${rest}${leading}${chapterPadded3}_verse_${versePadded3}.mp3`);
    variants.add(`${rest}${leading}${chapterPadded2}_verse_${versePadded2}.mp3`);
  }

  return Array.from(variants);
}

async function readJsonIfExists(fileSegments: string[]): Promise<any | null> {
  const resolved = path.join(process.cwd(), ...fileSegments);
  try {
    const content = await fs.readFile(resolved, 'utf8');
    return JSON.parse(content);
  } catch (error: any) {
    if (error?.code === 'ENOENT') {
      return null;
    }
    console.warn(`Failed to read ${resolved}:`, error);
    return null;
  }
}

function addEntry(map: AudioMap, ref: string, value: string) {
  if (!ref || !value) return;
  if (!map[ref]) {
    map[ref] = value;
  }

  const filename = refToFilename(ref);
  if (filename && !map[filename]) {
    map[filename] = value;
  }
  if (filename) {
    const lower = filename.toLowerCase();
    if (!map[lower]) {
      map[lower] = value;
    }
  }

  const variants = filenameVariants(ref);
  for (const variant of variants) {
    if (!map[variant]) {
      map[variant] = value;
    }
    const lower = variant.toLowerCase();
    if (!map[lower]) {
      map[lower] = value;
    }
  }
}

async function loadLocalVerseMaps(target: AudioMap) {
  for (const segments of LOCAL_VERSE_MAP_CANDIDATES) {
    const data = await readJsonIfExists(segments);
    if (!data) continue;
    const entries = Object.entries(data as Record<string, unknown>);
    for (const [ref, value] of entries) {
      if (typeof value === 'string') {
        addEntry(target, ref, value);
      }
    }
  }
}

async function loadProcessedMaps(target: AudioMap) {
  for (const segments of LOCAL_PROCESSED_MAP_CANDIDATES) {
    const data = await readJsonIfExists(segments);
    if (!data) continue;
    const entries = Object.entries(data as Record<string, unknown>);
    for (const [key, value] of entries) {
      if (typeof value !== 'string') {
        continue;
      }
      const match = key.match(/^([a-z0-9]+?)(\d{1,3})_(\d{1,3})$/i);
      if (!match) {
        if (!target[key]) {
          target[key] = value;
        }
        continue;
      }
      const [, slug, chapterPart, versePart] = match;
      const canonical = BOOK_NAME_LOOKUP.get(normalizeKey(slug));
      if (canonical) {
        const chapter = Number(chapterPart);
        const verse = Number(versePart);
        const ref = `${canonical} ${chapter}:${verse}`;
        addEntry(target, ref, value);
      } else if (!target[key]) {
        target[key] = value;
      }
    }
  }
}

async function loadGoogleDriveMaps(target: AudioMap) {
  for (const segments of LOCAL_GOOGLE_DRIVE_CANDIDATES) {
    const data = await readJsonIfExists(segments);
    if (!data) continue;
    const entries = Object.entries(data as Record<string, unknown>);
    const isYousafzai = segments.includes('yousafzai');

    for (const [filename, entry] of entries) {
      if (!entry || typeof entry !== 'object') continue;
      const record = entry as Record<string, unknown>;

      // Generate reference from record data or filename
      const ref = toVerseRef(
        String(record.book || record.book_name || record.bookTitle || filename),
        record.chapter as number | string,
        record.verse as number | string,
      );

      if (isYousafzai) {
        // For Yousafzai, generate Supabase storage URLs
        if (ref) {
          const storageUrl = generateYousafzaiStorageUrl(ref, filename);
          if (storageUrl) {
            addEntry(target, ref, storageUrl);
          }
        }
      } else {
        // For Afghan/other, use Google Drive URLs as before
        const value = record.google_drive_file_id ?? record.google_drive_url ?? record.url ?? record.direct_url;
        if (ref && typeof value === 'string') {
          addEntry(target, ref, value);
        }
        if (typeof value === 'string' && !target[filename]) {
          target[filename] = value;
        }
      }
    }
  }
}

function generateYousafzaiStorageUrl(ref: string, filename: string): string | null {
  // Parse the reference to get book, chapter, verse
  const match = ref.match(/^(.+?)\s+(\d+):(\d+)$/);
  if (!match) return null;

  const [, book, chapterStr, verseStr] = match;
  const chapter = Number(chapterStr);
  const verse = Number(verseStr);

  if (Number.isNaN(chapter) || Number.isNaN(verse)) return null;

  // Generate filename in the format expected by Supabase storage
  const bookSlug = normalizeBookNameToSlug(book);
  const chapterPadded = String(chapter).padStart(3, '0');
  const versePadded = String(verse).padStart(3, '0');

  // Return Supabase storage URL for Yousafzai
  return `https://nkombdutnjvaasxrbmdn.supabase.co/storage/v1/object/public/audio/yousafzai/${bookSlug}${chapterPadded}_verse_${versePadded}.mp3`;
}

export async function loadAudioMap(forceRefresh = false): Promise<AudioMap> {
  if (!forceRefresh && cache && Date.now() - cache.timestamp < CACHE_TTL_MS) {
    return cache.data;
  }

  const map: AudioMap = {};
  await loadLocalVerseMaps(map);
  await loadProcessedMaps(map);
  await loadGoogleDriveMaps(map);

  cache = { data: map, timestamp: Date.now() };
  return map;
}

export function audioEntryToUrl(entry: string): string {
  if (!entry) return '';
  if (entry.startsWith('http://') || entry.startsWith('https://')) {
    return entry;
  }
  if (entry.startsWith('gs://')) {
    const publicBase = process.env.NEXT_PUBLIC_STORAGE_PUBLIC_BASE;
    if (publicBase) {
      const withoutScheme = entry.replace(/^gs:\/\//, '');
      const [bucket, ...rest] = withoutScheme.split('/');
      const pathPart = rest.join('/');
      if (!bucket) {
        return `${publicBase.replace(/\/$/, '')}/${pathPart}`;
      }
      if (publicBase.includes(bucket)) {
        return `${publicBase.replace(/\/$/, '')}/${pathPart}`;
      }
      return `${publicBase.replace(/\/$/, '')}/${bucket}/${pathPart}`;
    }
  }

  return `https://drive.google.com/uc?export=download&id=${entry}`;
}
