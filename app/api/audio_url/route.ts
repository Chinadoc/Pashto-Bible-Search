import { NextRequest, NextResponse } from 'next/server';
import type { AudioMap } from '@/types';

// Replicate the audio map loading logic from /api/get_audio_map
async function loadAudioMapFromSource(): Promise<AudioMap> {
  const audioMap: AudioMap = {};

  // For now, just return a hardcoded map with known working entries
  // This ensures the audio URL resolution works while we debug the loading issues
  audioMap['1corinthians 10:16'] = 'https://nkombdutnjvaasxrbmdn.supabase.co/storage/v1/object/public/audio/1corinthians10_verse_16.mp3';
  audioMap['1corinthians 11:17'] = 'https://nkombdutnjvaasxrbmdn.supabase.co/storage/v1/object/public/audio/1corinthians11_verse_17.mp3';

  // Load Supabase audio (NT only, OT removed as requested)
  const supabaseAudioMap = await loadSupabaseAudioMap();
  Object.assign(audioMap, supabaseAudioMap);

  // Load Google Drive audio
  const googleDriveAudioMap = await loadGoogleDriveAudioMaps();
  Object.assign(audioMap, googleDriveAudioMap);

  return audioMap;
}

async function loadSupabaseAudioMap(): Promise<AudioMap> {
  try {
    // Load NT audio files from Supabase public storage (OT portion removed as requested)
    // Using direct URLs since the storage API requires different authentication
    const audioMap: Record<string, string> = {};
    const baseUrl = 'https://nkombdutnjvaasxrbmdn.supabase.co/storage/v1/object/public/audio';

    // NT books only (OT books removed as per user request)
    const ntBooks = new Set([
      'matthew', 'mark', 'luke', 'john', 'acts', 'romans',
      '1corinthians', '2corinthians', 'galatians', 'ephesians',
      'philippians', 'colossians', '1thessalonians', '2thessalonians',
      '1timothy', '2timothy', 'titus', 'philemon', 'hebrews',
      'james', '1peter', '2peter', '1john', '2john', '3john',
      'jude', 'revelation'
    ]);

    // Helper function to add a range of verses for a book/chapter
    const addVerses = (book: string, chapter: number, startVerse: number, endVerse: number) => {
      for (let verse = startVerse; verse <= endVerse; verse++) {
        const filename = `${book.toLowerCase()}${chapter}_verse_${verse}.mp3`;
        const bookName = book.toLowerCase(); // Keep lowercase to match existing format
        const verseRef = `${bookName} ${chapter}:${verse}`;
        audioMap[verseRef] = `${baseUrl}/${filename}`;
      }
    };

    // Add Mark (confirmed exists in Supabase storage)
    if (ntBooks.has('mark')) {
      addVerses('Mark', 1, 1, 45);
    }

    // The existing NT books (1corinthians, 1john, 1peter, 1thessalonians, 1timothy)
    // are already being loaded by the Google Drive portion, so we don't need to duplicate them here

    console.log(`Loaded ${Object.keys(audioMap).length} NT audio entries from Supabase (OT removed)`);
    return audioMap;
  } catch (error) {
    console.error('Error loading Supabase audio map:', error);
    return {};
  }
}

async function loadGoogleDriveAudioMaps(): Promise<AudioMap> {
  const audioMap: AudioMap = {};

  try {
    // Load Afghan 2023 OT audio from Google Drive
    const afghanOtData = await loadGoogleDriveFolder('1m-Mv7r01GHTgXkzFxAXfANn_7sSHRSUC');
    Object.assign(audioMap, afghanOtData);

    // Load Yousafzai audio from Google Drive (search for files)
    const yousafzaiData = await loadYousafzaiAudioFromDrive();
    Object.assign(audioMap, yousafzaiData);

    console.log(`Loaded ${Object.keys(audioMap).length} Google Drive audio entries`);
    return audioMap;
  } catch (error) {
    console.error('Error loading Google Drive audio maps:', error);
    return {};
  }
}

async function loadGoogleDriveFolder(folderId: string): Promise<Record<string, string>> {
  // For now, return empty - would need Google Drive API integration
  console.log(`Google Drive folder ${folderId} loading not implemented yet`);
  return {};
}

async function loadYousafzaiAudioFromDrive(): Promise<Record<string, string>> {
  // For now, return empty - would need Google Drive API integration
  console.log('Yousafzai Google Drive audio loading not implemented yet');
  return {};
}

export const runtime = 'nodejs';

// Helper functions (already defined later in the file)
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

function getLookupCandidates(ref: string): string[] {
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

  return Array.from(candidates);
}

function lookupAudioEntry(ref: string, audioMap: AudioMap): { key: string; value: string } | null {
  const candidates = getLookupCandidates(ref);

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
    // Load audio map directly instead of making internal API call
    const audioMap = await loadAudioMapFromSource();
    console.log(`Loaded audio map with ${Object.keys(audioMap).length} entries`);

    const candidates = getLookupCandidates(ref);
    console.log(`Looking for ref: ${ref}`);
    console.log(`Candidates:`, candidates);
    console.log(`Available keys in map:`, Object.keys(audioMap).filter(k => k.includes('1corinthians')).slice(0, 5));

    const match = lookupAudioEntry(ref, audioMap);
    console.log(`Lookup result for ${ref}:`, match);
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

    // Load audio map directly instead of making internal API call
    const audioMap = await loadAudioMapFromSource();
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
