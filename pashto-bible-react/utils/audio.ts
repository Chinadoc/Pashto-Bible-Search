import type { AudioMap } from "@/types";

function normalizeBookNameToSlug(bookName: string): string {
  return bookName.toLowerCase().replace(/\s+/g, "").replace(/[^a-z0-9]/g, "");
}

function parseRef(ref: string): { book: string; chapter: number; verse: number } | null {
  // Example ref: "1 Chronicles 1:1" or "John 3:16"
  const lastSpaceIndex = ref.lastIndexOf(" ");
  if (lastSpaceIndex === -1) return null;

  let book = ref.slice(0, lastSpaceIndex).trim();
  const chapterVerse = ref.slice(lastSpaceIndex + 1).trim();

  const [chapterStr, verseStr] = chapterVerse.split(":");
  const chapter = Number(chapterStr);
  const verse = Number(verseStr);

  if (!book || Number.isNaN(chapter) || Number.isNaN(verse)) return null;

  // This is a robust fix for malformed book names like "1 Chronicles1"
  // It removes any trailing digits from the book name string.
  book = book.replace(/\d+$/, "");

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
  if (!filename) return "";
  const driveId = map[filename];
  if (!driveId) return "";
  return `https://drive.google.com/uc?export=download&id=${driveId}`;
}
