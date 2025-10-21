// Stub file for audio utilities
// These functions are not currently implemented but are needed for build
import type { AudioMap } from '@/types';

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
  return null;
}

function audioEntryToUrl(entry: string): string {
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

function candidateKeys(ref: string): string[] {
  const parsed = parseRef(ref);
  if (!parsed) return [ref];
  const { book, chapter, verse } = parsed;
  const slug = normalizeBookNameToSlug(book);
  const chapterStr = String(chapter);
  const verseStr = String(verse);
  const chapterPad3 = chapterStr.padStart(3, '0');
  const versePad3 = verseStr.padStart(3, '0');
  const chapterPad2 = chapterStr.padStart(2, '0');
  const versePad2 = verseStr.padStart(2, '0');
  const variants = new Set<string>([
    ref,
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

