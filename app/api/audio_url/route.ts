import { NextRequest, NextResponse } from 'next/server';
import { loadVerses } from '@/app/lib/data/load';

const WORKER_URL = process.env.NEXT_PUBLIC_CLOUDFLARE_WORKER_URL || 'https://pashtobiblesearch.jeremy-samuels17.workers.dev';

const TRANSLATION_CONFIG: Record<
  'afghan2023' | 'yousafzai2019',
  { folderAliases: string[]; filenamePrefixes: string[] }
> = {
  afghan2023: {
    folderAliases: ['afghan2023', 'afghan'],
    filenamePrefixes: ['afghan', 'afghan2023'],
  },
  yousafzai2019: {
    folderAliases: ['yousufzai2019', 'yousafzai2019', 'yousafzai'],
    filenamePrefixes: ['yousafzai', 'yousafzai2019', 'yousufzai2019'],
  },
};

const OT_BOOKS = new Set([
  'genesis', 'exodus', 'leviticus', 'numbers', 'deuteronomy', 'joshua', 'judges', 'ruth', '1samuel', '2samuel', '1kings', '2kings', '1chronicles', '2chronicles', 'ezra', 'nehemiah', 'esther', 'job', 'psalms', 'proverbs', 'ecclesiastes', 'songofsongs', 'songofsolomon', 'songofsongs', 'isaiah', 'jeremiah', 'lamentations', 'ezekiel', 'daniel', 'hosea', 'joel', 'amos', 'obadiah', 'jonah', 'micah', 'nahum', 'habakkuk', 'zephaniah', 'haggai', 'zechariah', 'malachi',
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

const BOOK_SLUG_ALIASES: Record<string, string[]> = {
  '1corinthians': ['1corinthians', '1cor', '1co', 'firstcorinthians', '1_corinthians', 'corinthians1', '1_cor', 'first_corinthians'],
  '2corinthians': ['2corinthians', '2cor', '2co', 'secondcorinthians', '2_corinthians', 'corinthians2', '2_cor', 'second_corinthians'],
  '1thessalonians': ['1thessalonians', '1thess', 'firstthessalonians', '1_thessalonians', 'thessalonians1', '1_thess', 'first_thessalonians'],
  '2thessalonians': ['2thessalonians', '2thess', 'secondthessalonians', '2_thessalonians', 'thessalonians2', '2_thess', 'second_thessalonians'],
  '1timothy': ['1timothy', '1tim', 'firsttimothy', '1_timothy', 'timothy1', '1_tim', 'first_timothy'],
  '2timothy': ['2timothy', '2tim', 'secondtimothy', '2_timothy', 'timothy2', '2_tim', 'second_timothy'],
  '1peter': ['1peter', '1pet', 'firstpeter', '1_peter', 'peter1', '1_pet', 'first_peter'],
  '2peter': ['2peter', '2pet', 'secondpeter', '2_peter', 'peter2', '2_pet', 'second_peter'],
  '1john': ['1john', '1jn', 'firstjohn', '1_john', 'john1', '1_jn', 'first_john'],
  '2john': ['2john', '2jn', 'secondjohn', '2_john', 'john2', '2_jn', 'second_john'],
  '3john': ['3john', '3jn', 'thirdjohn', '3_john', 'john3', '3_jn', 'third_john'],
};

function normaliseBookSlug(book: string): string {
  return book.toLowerCase().replace(/\s+/g, '');
}

function expandBookSlug(book: string): string[] {
  const slug = normaliseBookSlug(book);
  const aliases = BOOK_SLUG_ALIASES[slug] || [slug];
  const withDashes = aliases.map((alias) => alias.replace(/(?<=\d)([a-z])/, '-$1'));
  return Array.from(new Set([...aliases, ...withDashes]));
}

function inferTestament(book: string, fallback?: string | null): 'ot' | 'nt' {
  if (fallback === 'ot' || fallback === 'nt') return fallback;
  const slug = normaliseBookSlug(book);
  return OT_BOOKS.has(slug) ? 'ot' : 'nt';
}

function expandKeyWithAliases(key: string, translation: 'afghan2023' | 'yousafzai2019'): string[] {
  const cleanKey = key.replace(/^\//, '');
  const aliases = TRANSLATION_CONFIG[translation]?.folderAliases ?? [translation];
  const parts = cleanKey.split('/');
  if (parts.length < 2) return [cleanKey];

  const [, ...rest] = parts;
  const restPath = rest.join('/');

  const variants = new Set<string>([cleanKey]);
  for (const alias of aliases) {
    variants.add(`${alias}/${restPath}`);
  }
  return Array.from(variants);
}

const verseOrdinalCache: Partial<Record<'afghan2023' | 'yousafzai2019', Map<string, number>>> = {};

async function getVerseOrdinal(
  book: string,
  chapter: number,
  verse: number,
  translation: 'afghan2023' | 'yousafzai2019',
): Promise<number | null> {
  try {
    if (!verseOrdinalCache[translation]) {
      const verses = await loadVerses(translation);
      const map = new Map<string, number>();
      let ordinal = 1;

      for (const v of verses) {
        const key = `${normaliseBookSlug(v.book)} ${v.chapter}:${v.verse}`;
        if (!map.has(key)) {
          map.set(key, ordinal++);
        }
      }

      verseOrdinalCache[translation] = map;
    }

    const cache = verseOrdinalCache[translation]!;
    const lookupKey = `${normaliseBookSlug(book)} ${chapter}:${verse}`;
    return cache.get(lookupKey) ?? null;
  } catch (error) {
    console.warn('Skipping ordinal lookup (verse dataset unavailable):', error);
    return null;
  }
}

async function buildCandidateKeys(
  ref: string,
  translation: 'afghan2023' | 'yousafzai2019',
  verseMeta?: { book?: string; chapter?: number; verse?: number; testament?: string | null; audio_r2_key?: string | null },
) {
  const candidates = new Set<string>();

  const parsed = parseRef(ref);
  const book = verseMeta?.book || parsed?.book;
  const chapter = verseMeta?.chapter ?? parsed?.chapter;
  const verse = verseMeta?.verse ?? parsed?.verse;

  if (verseMeta?.audio_r2_key) {
    for (const variant of expandKeyWithAliases(verseMeta.audio_r2_key, translation)) {
      candidates.add(variant);
    }
  }

  if (book && chapter && verse) {
    const testament = inferTestament(book, verseMeta?.testament?.toLowerCase?.());
    const slugVariants = expandBookSlug(book);
    const chapterPart3 = String(chapter).padStart(3, '0');
    const versePart3 = String(verse).padStart(3, '0');
    const { folderAliases, filenamePrefixes } = TRANSLATION_CONFIG[translation] ?? { folderAliases: [translation], filenamePrefixes: [translation] };
    const ordinal = await getVerseOrdinal(book, chapter, verse, translation);

    const baseNameVariants = new Set<string>();
    for (const slug of slugVariants) {
      baseNameVariants.add(`${slug}${chapterPart3}_verse_${versePart3}`);
      baseNameVariants.add(`${slug}${chapterPart3}_${versePart3}`);
      baseNameVariants.add(`${slug}_${chapterPart3}_verse_${versePart3}`);
      baseNameVariants.add(`${slug}_${chapterPart3}_${versePart3}`);
      baseNameVariants.add(`${slug}${chapter}_verse_${verse}`);
      baseNameVariants.add(`${slug}${chapter}_${verse}`);
      baseNameVariants.add(`${slug}_${chapter}_verse_${verse}`);
      baseNameVariants.add(`${slug}_${chapter}_${verse}`);
      // Add missing format: unpadded chapter, padded verse (e.g. mark9_verse_024)
      baseNameVariants.add(`${slug}${chapter}_verse_${versePart3}`);

      if (ordinal) {
        const ordinalPad = String(ordinal).padStart(3, '0');
        baseNameVariants.add(`${slug}Verse_${ordinalPad}`);
        baseNameVariants.add(`${slug}Verse_${ordinalPad}-1`);
      }
    }

    for (const folder of folderAliases) {
      for (const base of baseNameVariants) {
        for (const prefix of filenamePrefixes) {
          candidates.add(`${folder}/${testament}/${prefix}_${base}.mp3`);
          candidates.add(`${folder}/${testament}/${prefix}-${base}.mp3`);
          candidates.add(`${folder}/${prefix}_${base}.mp3`);
          candidates.add(`${folder}/${prefix}-${base}.mp3`);
        }
        candidates.add(`${folder}/${testament}/${base}.mp3`);
        candidates.add(`${folder}/${base}.mp3`);
      }
    }

    // Also allow keys without folder prefixes (in case files live at bucket root)
    for (const base of baseNameVariants) {
      candidates.add(`${base}.mp3`);
      // Add variants with just the translation folder but no prefix in filename
      // e.g. afghan2023/mark1_verse_001.mp3
      const { folderAliases } = TRANSLATION_CONFIG[translation] ?? { folderAliases: [translation] };
      for (const folder of folderAliases) {
        candidates.add(`${folder}/${testament}/${base}.mp3`);
        candidates.add(`${folder}/${base}.mp3`);
      }
    }
  }

  return Array.from(candidates);
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

  // Encode the key without escaping path separators so nested folders are preserved
  // const safeKey = encodeURI(r2Key);
  // return `${WORKER_URL}/api/audio/stream/${safeKey}`;

  // Use public R2 URL directly to bypass worker stream issues
  return `https://pub-03f80a5e522e408e9ff0f40c3392140f.r2.dev/${r2Key}`;
}

async function keyExists(r2Key: string | null | undefined) {
  const url = toStreamUrl(r2Key);
  if (!url) return false;

  try {
    // Prefer a HEAD request to avoid transferring the full object
    const headResp = await fetch(url, { method: 'HEAD', cache: 'no-store' });
    if (headResp.ok) return true;

    // Some origins may not support HEAD; fall back to a byte-range GET as a lightweight probe
    if (headResp.status === 405 || headResp.status === 403) {
      const rangeResp = await fetch(url, {
        method: 'GET',
        headers: { Range: 'bytes=0-0' },
        cache: 'no-store',
      });
      return rangeResp.ok;
    }
  } catch (error) {
    console.warn(`Audio existence check failed for ${r2Key}:`, error);
  }

  return false;
}

async function resolveAudioUrl(ref: string, translation: 'afghan2023' | 'yousafzai2019') {
  try {
    const verse = await fetchVerse(ref, translation);

    if (verse?.audio_public_url) return verse.audio_public_url as string;

    const candidates = await buildCandidateKeys(ref, translation, verse);
    for (const candidate of candidates) {
      if (await keyExists(candidate)) {
        const url = toStreamUrl(candidate);
        if (url) return url;
      }
    }
  } catch (error) {
    console.warn(`Failed to resolve audio for ${ref}:`, error);
  }

  const fallbackCandidates = await buildCandidateKeys(ref, translation);
  for (const candidate of fallbackCandidates) {
    if (await keyExists(candidate)) {
      const url = toStreamUrl(candidate);
      if (url) return url;
    }
  }

  // Removed "last resort" fallback to prevent returning 404 URLs
  return null;
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
