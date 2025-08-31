import type { AudioMap } from "@/types";

function normalizeBookNameToSlug(bookName: string): string {
  return bookName.toLowerCase().replace(/\s+/g, "").replace(/[^a-z0-9]/g, "");
}

function parseRef(ref: string): { book: string; chapter: number; verse: number } | null {
  if (!ref) return null;
  // Accept forms like "1-Corinthians 11:34", "1 John 2:8", "Acts 10:1"
  const m = ref.match(/^(.+?)\s+(\d+):(\d+)$/);
  if (!m) return null;
  const book = m[1].trim();
  const chapter = Number(m[2]);
  const verse = Number(m[3]);
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

function altNumericBookSlug(bookSlug: string): string {
  // Convert 1john -> john1, 2corinthians -> corinthians2, etc.
  const m = bookSlug.match(/^(\d)([a-z].*)$/);
  if (!m) return bookSlug;
  const num = m[1];
  const rest = m[2];
  return `${rest}${num}`;
}

function candidateFilenames(ref: string): string[] {
  const parsed = parseRef(ref);
  if (!parsed) return [];
  const { book, chapter, verse } = parsed;
  const slug = normalizeBookNameToSlug(book);
  const primary = `${slug}${chapter}_verse_${verse}.mp3`;
  const alt = `${altNumericBookSlug(slug)}${chapter}_verse_${verse}.mp3`;
  return [...new Set([primary, alt])];
}

export function audioUrlFromRef(ref: string, map: AudioMap): string {
  if (!ref || !map) return "";

  // 1) Direct mapping by verse reference (preferred when API returns ref->URL)
  if (map[ref]) {
    const val = map[ref];
    // Normalize Google Drive host to direct media host
    if (/^https?:\/\//i.test(val) && /drive\.google\.com|docs\.google\.com/i.test(val)) {
      const idMatch = val.match(/[?&](?:id|ids)=([^&]+)/) || val.match(/\/d\/([^/]+)/);
      if (idMatch && idMatch[1]) return `https://drive.usercontent.google.com/uc?export=download&id=${idMatch[1]}`;
    }
    return val;
  }

  // 2) Mapping by audio filename (support numeric book swaps)
  const candidates = candidateFilenames(ref);
  for (const filename of candidates) {
    const val = map[filename] || map[decodeURIComponent(filename)];
    if (val) {
      // If value already looks like a URL, normalize Drive hosts; otherwise treat as Drive ID.
      if (/^https?:\/\//i.test(val)) {
        if (/drive\.google\.com|docs\.google\.com/i.test(val)) {
          const idMatch = val.match(/[?&](?:id|ids)=([^&]+)/) || val.match(/\/d\/([^/]+)/);
          if (idMatch && idMatch[1]) return `https://drive.usercontent.google.com/uc?export=download&id=${idMatch[1]}`;
        }
        return val;
      }
      return `https://drive.usercontent.google.com/uc?export=download&id=${val}`;
    }
  }

  return "";
}
