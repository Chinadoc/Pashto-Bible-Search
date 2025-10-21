import { NextRequest, NextResponse } from 'next/server';
import type { AudioMap } from '@/types';

export const runtime = 'nodejs';

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

function refToFilename(ref: string): string | null {
  const parsed = parseRef(ref);
  if (!parsed) return null;
  const { book, chapter, verse } = parsed;
  const slug = normalizeBookNameToSlug(book);
  return `${slug}${chapter}_verse_${verse}.mp3`;
}

function filenameVariants(ref: string): string[] {
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

function lookupAudioEntry(ref: string, audioMap: AudioMap): { key: string; value: string } | null {
  const candidates = new Set<string>();
  candidates.add(ref);

  const trimmed = normalizeRef(ref);
  candidates.add(trimmed);
  candidates.add(trimmed.toLowerCase());

  const filename = refToFilename(trimmed);
  if (filename) {
    candidates.add(filename);
    candidates.add(filename.toLowerCase());
    for (const variant of filenameVariants(trimmed)) {
      candidates.add(variant);
      candidates.add(variant.toLowerCase());
    }
  }

  for (const key of candidates) {
    const value = audioMap[key];
    if (typeof value === 'string' && value.length > 0) {
      return { key, value };
    }
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

export async function GET(request: NextRequest) {
  const ref = request.nextUrl.searchParams.get('ref');
  if (!ref) {
    return NextResponse.json({ error: 'Missing ref parameter' }, { status: 400 });
  }

  try {
    // Load audio map from the get_audio_map API
    const audioMapResponse = await fetch(`${request.nextUrl.origin}/api/get_audio_map`, {
      method: 'GET',
      cache: 'no-store',
    });
    
    if (!audioMapResponse.ok) {
      throw new Error(`Failed to load audio map: ${audioMapResponse.status}`);
    }
    
    const audioMap = await audioMapResponse.json();
    const match = lookupAudioEntry(ref, audioMap);
    if (!match) {
      return NextResponse.json(
        {
          error: 'Audio not found',
          ref,
        },
        { status: 404 },
      );
    }

    const url = audioEntryToUrl(match.value);
    if (!url) {
      return NextResponse.json(
        {
          error: 'Unable to resolve audio URL',
          ref,
          key: match.key,
        },
        { status: 502 },
      );
    }

    return NextResponse.json({
      ref,
      url,
      key: match.key,
      source: 'audio-map',
      isSigned: false,
    });
  } catch (error) {
    console.error('Failed to resolve audio URL:', error);
    return NextResponse.json(
      {
        error: 'Failed to resolve audio URL',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const refs: unknown = body?.refs;
    if (!Array.isArray(refs) || refs.length === 0) {
      return NextResponse.json({ error: 'Expected refs array with at least one item' }, { status: 400 });
    }

    const stringRefs = refs.map((item) => String(item)).filter(Boolean);
    if (stringRefs.length === 0) {
      return NextResponse.json({ error: 'Refs array contained no usable values' }, { status: 400 });
    }

    // Load audio map from the get_audio_map API
    const audioMapResponse = await fetch(`${request.nextUrl.origin}/api/get_audio_map`, {
      method: 'GET',
      cache: 'no-store',
    });
    
    if (!audioMapResponse.ok) {
      throw new Error(`Failed to load audio map: ${audioMapResponse.status}`);
    }
    
    const audioMap = await audioMapResponse.json();
    const urls: Record<string, string | null> = {};

    for (const ref of stringRefs) {
      const match = lookupAudioEntry(ref, audioMap);
      if (!match) {
        urls[ref] = null;
        continue;
      }
      const url = audioEntryToUrl(match.value);
      urls[ref] = url || null;
    }

    return NextResponse.json({ urls });
  } catch (error) {
    console.error('Failed to batch resolve audio URLs:', error);
    return NextResponse.json(
      {
        error: 'Failed to resolve audio URLs',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
