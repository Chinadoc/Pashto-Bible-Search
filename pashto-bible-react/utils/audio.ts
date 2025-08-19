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
  const filename = refToFilename(ref);
  if (!filename || !map) return "";
  // Firestore keys might have been created from filenames with spaces encoded
  const driveId = map[filename] || map[decodeURIComponent(filename)];
  if (!driveId) return "";
  return `https://drive.google.com/uc?export=download&id=${driveId}`;
}
