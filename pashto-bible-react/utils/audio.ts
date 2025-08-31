import type { AudioMap } from "@/types";

function normalizeBookNameToSlug(bookName: string): string {
  return bookName.toLowerCase().replace(/\s+/g, "").replace(/[^a-z0-9]/g, "");
}

function parseRef(ref: string): { book: string; chapter: number; verse: number } | null {
  if (!ref) return null;
  // This regex is designed to be very forgiving for refs like "1 Chronicles1 5:29"
  const match = ref.match(/^((\d\s)?[a-zA-Z\s]+?)\s*(\d+):(\d+)$/);
  if (!match) return null;

  const book = match[1].trim().replace(/([a-zA-Z])(\d+)$/, '$1'); // Clean "1 Chronicles1" -> "1 Chronicles"
  const chapter = Number(match[3]);
  const verse = Number(match[4]);

  if (!book || isNaN(chapter) || isNaN(verse)) return null;

  return { book, chapter, verse };
}

export function refToFilename(ref: string): string | null {
  const parsed = parseRef(ref);
  if (!parsed) return null;
  const { book, chapter, verse } = parsed;
  const slug = normalizeBookNameToSlug(book);
  return `${slug}${chapter}_verse_${verse}.mp3`;
}

export function audioUrlFromRef(ref: string, map: AudioMap): string {
  if (!ref || !map) return "";

  // 1) Direct mapping by verse reference (preferred when API returns ref->URL)
  if (map[ref]) return map[ref];

  // 2) Mapping by audio filename (legacy maps)
  const filename = refToFilename(ref);
  if (filename) {
    const val = map[filename] || map[decodeURIComponent(filename)];
    if (val) {
      // If value already looks like a URL, return it; otherwise treat as Drive ID.
      if (/^https?:\/\//i.test(val)) return val;
      return `https://drive.google.com/uc?export=download&id=${val}`;
    }
  }

  return "";
}
