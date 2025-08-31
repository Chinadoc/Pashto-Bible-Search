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
