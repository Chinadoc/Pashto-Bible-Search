import type { AudioMap } from '@/types';

function normalizeRef(ref: string): string {
  return ref.trim().replace(/\s+/g, ' ');
}

function normalizeBookNameToSlug(bookName: string): string {
  return bookName.toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9]/g, '');
}

function parseRef(ref: string): { book: string; chapter: number; verse: number } | null {
  if (!ref || typeof ref !== 'string') return null;
  const match = ref.match(/^(.+?)\s+(\d+):(\d+)$/);
  if (!match) return null;
  const book = match[1].trim();
  const chapter = Number(match[2]);
  const verse = Number(match[3]);
  if (!book || Number.isNaN(chapter) || Number.isNaN(verse)) return null;
  return { book, chapter, verse };
}

export function refToFilename(ref: string): string | null {
  const parsed = parseRef(ref);
  if (!parsed) return null;
  const { book, chapter, verse } = parsed;
  const slug = normalizeBookNameToSlug(book);
  return `${slug}${chapter}_verse_${verse}.mp3`;
}

function filenameVariants(ref: string): string[] {
  const parsed = parseRef(ref);
  if (!parsed) return [];
  const { book, chapter, verse } = parsed;
  const slug = normalizeBookNameToSlug(book);
  const chapterStr = String(chapter);
  const verseStr = String(verse);
  const chapterPad3 = chapterStr.padStart(3, '0');
  const versePad3 = verseStr.padStart(3, '0');
  const chapterPad2 = chapterStr.padStart(2, '0');
  const versePad2 = verseStr.padStart(2, '0');
  const variants = new Set<string>([
    `${slug}${chapterStr}_verse_${verseStr}.mp3`,
    `${slug}${chapterPad3}_verse_${versePad3}.mp3`,
    `${slug}${chapterPad2}_verse_${versePad2}.mp3`,
  ]);
  const numericMatch = slug.match(/^(\d)([a-z].*)$/);
  if (numericMatch) {
    const [, leading, rest] = numericMatch;
    variants.add(`${rest}${leading}${chapterStr}_verse_${verseStr}.mp3`);
    variants.add(`${rest}${leading}${chapterPad3}_verse_${versePad3}.mp3`);
    variants.add(`${rest}${leading}${chapterPad2}_verse_${versePad2}.mp3`);
  }
  return Array.from(variants);
}

function collectCandidateKeys(ref: string): string[] {
  const trimmed = normalizeRef(ref);
  const candidates = new Set<string>([ref, trimmed, trimmed.toLowerCase()]);

  const filename = refToFilename(trimmed);
  if (filename) {
    candidates.add(filename);
    candidates.add(filename.toLowerCase());
  }

  for (const variant of filenameVariants(trimmed)) {
    candidates.add(variant);
    candidates.add(variant.toLowerCase());
  }

  return Array.from(candidates);
}

function extractEntryValue(raw: unknown): string | null {
  if (!raw) return null;
  if (typeof raw === 'string') return raw;
  if (typeof raw !== 'object') return null;

  const record = raw as Record<string, unknown>;
  const priorityKeys = [
    'direct',
    'url',
    'publicUrl',
    'public_url',
    'r2_key',
    'audio_r2_key',
  ];

  for (const key of priorityKeys) {
    const value = record[key];
    if (typeof value === 'string' && value.length > 0) {
      return value;
    }
  }

  return null;
}

function isPlaceholder(value: string): boolean {
  const upper = value.toUpperCase();
  return upper.includes('TEST_ID') || upper.includes('PLACEHOLDER') || upper.includes('FILE_ID');
}

export function audioUrlFromRef(ref: string, audioMap?: AudioMap | null): string | null {
  if (!ref || !audioMap) return null;

  const candidates = collectCandidateKeys(ref);
  for (const key of candidates) {
    const raw = audioMap[key];
    const value = extractEntryValue(raw);
    if (!value || isPlaceholder(value)) {
      continue;
    }
    const resolved = audioEntryToUrl(value);
    if (resolved) {
      return resolved;
    }
  }

  return null;
}

export async function resolveAudioUrl(ref: string, entry?: unknown): Promise<string | null> {
  if (!ref) return null;
  if (typeof entry === 'string' && /^https?:\/\//i.test(entry)) {
    return entry;
  }
  try {
    const response = await fetch(`/api/audio_url?ref=${encodeURIComponent(ref)}`, {
      method: 'GET',
      cache: 'no-store',
    });
    if (response.ok) {
      const payload = await response.json();
      if (payload?.url && (payload.url.startsWith('/') || /^https?:\/\//i.test(payload.url))) {
        return payload.url;
      }
    }
  } catch (error) {
    console.warn(`Failed to resolve audio URL for ${ref}:`, error);
  }
  if (entry && typeof entry === 'object' && entry !== null) {
    const maybeDirect = (entry as Record<string, unknown>).direct;
    if (typeof maybeDirect === 'string' && /^https?:\/\//i.test(maybeDirect)) {
      return maybeDirect;
    }
  }
  if (typeof entry === 'string') {
    return audioEntryToUrl(entry);
  }
  if (entry) {
    const value = extractEntryValue(entry);
    if (value) {
      return audioEntryToUrl(value);
    }
  }
  return null;
}

function audioEntryToUrl(entry: string): string {
  if (!entry) return '';

  // If it's already a full URL, return as-is
  if (entry.startsWith('http://') || entry.startsWith('https://')) {
    return entry;
  }

  // If it's an R2 key, construct Cloudflare Worker streaming URL
  // Format: afghan2023/nt/matthew1_verse_001.mp3 or yousafzai2019/ot/genesis1_verse_001.mp3
  if (entry.includes('/') && (entry.startsWith('afghan2023/') || entry.startsWith('yousafzai2019/'))) {
    const workerUrl = process.env.NEXT_PUBLIC_CLOUDFLARE_WORKER_URL || 'https://pashtobiblesearch.workers.dev';
    return `${workerUrl}/api/audio/stream/${encodeURIComponent(entry)}`;
  }

  // Fallback: assume it's an R2 key and construct URL
  const workerUrl = process.env.NEXT_PUBLIC_CLOUDFLARE_WORKER_URL || 'https://pashtobiblesearch.workers.dev';
  return `${workerUrl}/api/audio/stream/${encodeURIComponent(entry)}`;
}
