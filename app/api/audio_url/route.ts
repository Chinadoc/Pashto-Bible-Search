import { NextRequest, NextResponse } from 'next/server';

const WORKER_URL = process.env.NEXT_PUBLIC_CLOUDFLARE_WORKER_URL || 'https://pashtobiblesearch.jeremy-samuels17.workers.dev';
const OT_BOOKS = new Set([
  'genesis','exodus','leviticus','numbers','deuteronomy','joshua','judges','ruth','1samuel','2samuel','1kings','2kings','1chronicles','2chronicles','ezra','nehemiah','esther','job','psalms','proverbs','ecclesiastes','songofsongs','songofsolomon','songofsongs','isaiah','jeremiah','lamentations','ezekiel','daniel','hosea','joel','amos','obadiah','jonah','micah','nahum','habakkuk','zephaniah','haggai','zechariah','malachi',
]);

function parseRef(ref: string): { book: string; chapter: number; verse: number } | null {
  const match = ref.match(/^(.+?)\s+(\d+):(\d+)$/);
  if (!match) return null;
  const [, bookRaw, chapterRaw, verseRaw] = match;
  const chapter = Number(chapterRaw);
  const verse = Number(verseRaw);
  if (!bookRaw || Number.isNaN(chapter) || Number.isNaN(verse)) return null;
  return { book: bookRaw.trim(), chapter, verse };
}

function normaliseBookSlug(book: string): string {
  return book.toLowerCase().replace(/\s+/g, '');
}

function inferTestament(book: string, fallback?: string | null): 'ot' | 'nt' {
  if (fallback === 'ot' || fallback === 'nt') return fallback;
  const slug = normaliseBookSlug(book);
  return OT_BOOKS.has(slug) ? 'ot' : 'nt';
}

function buildR2Key(ref: string, translation: 'afghan2023' | 'yousafzai2019', verseMeta?: { book?: string; chapter?: number; verse?: number; testament?: string | null }) {
  const parsed = parseRef(ref);
  const book = verseMeta?.book || parsed?.book;
  const chapter = verseMeta?.chapter ?? parsed?.chapter;
  const verse = verseMeta?.verse ?? parsed?.verse;
  if (!book || !chapter || !verse) return null;

  const testament = inferTestament(book, verseMeta?.testament?.toLowerCase?.());
  const slug = normaliseBookSlug(book);
  const chapterPart = String(chapter);
  const versePart = String(verse).padStart(3, '0');
  return `${translation}/${testament}/${slug}${chapterPart}_verse_${versePart}.mp3`;
}

async function fetchVerse(ref: string, translation: 'afghan2023' | 'yousafzai2019') {
  const url = `${WORKER_URL}/api/verse?ref=${encodeURIComponent(ref)}&translation=${translation}`;
  const response = await fetch(url, { next: { revalidate: 0 } });
  if (!response.ok) return null;
  const payload = await response.json();
  return payload?.verse ?? null;
}

function toStreamUrl(r2Key: string | null | undefined) {
  if (!r2Key) return null;
  return `${WORKER_URL}/api/audio/stream/${encodeURIComponent(r2Key)}`;
}

async function resolveAudioUrl(ref: string, translation: 'afghan2023' | 'yousafzai2019') {
  try {
    const verse = await fetchVerse(ref, translation);
    const derivedKey = buildR2Key(ref, translation, verse);

    if (verse?.audio_public_url) return verse.audio_public_url as string;
    if (verse?.audio_r2_key) return toStreamUrl(verse.audio_r2_key);
    if (derivedKey) return toStreamUrl(derivedKey);
  } catch (error) {
    console.warn(`Failed to resolve audio for ${ref}:`, error);
  }

  const fallbackKey = buildR2Key(ref, translation);
  return fallbackKey ? toStreamUrl(fallbackKey) : null;
}

async function handleSingle(request: NextRequest) {
  const ref = request.nextUrl.searchParams.get('ref');
  const translation = (request.nextUrl.searchParams.get('translation') as 'afghan2023' | 'yousafzai2019') || 'afghan2023';
  if (!ref) {
    return NextResponse.json({ error: 'Missing ref parameter' }, { status: 400 });
  }
  const url = await resolveAudioUrl(ref, translation);
  return NextResponse.json({ url });
}

async function handleBatch(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const refs = Array.isArray(body?.refs) ? body.refs.filter((r: unknown) => typeof r === 'string') as string[] : [];
  const translation = (body?.translation as 'afghan2023' | 'yousafzai2019') || 'afghan2023';

  if (refs.length === 0) {
    return NextResponse.json({ error: 'No refs provided' }, { status: 400 });
  }

  const entries = await Promise.all(
    refs.map(async (ref) => {
      const url = await resolveAudioUrl(ref, translation);
      return [ref, url] as const;
    })
  );

  const urls = Object.fromEntries(entries);
  return NextResponse.json({ urls });
}

export async function GET(request: NextRequest) {
  return handleSingle(request);
}

export async function POST(request: NextRequest) {
  return handleBatch(request);
}
