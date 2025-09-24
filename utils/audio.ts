import type { AudioMap } from "@/types";

function normalizeBookNameToSlug(bookName: string): string {
  return bookName.toLowerCase().replace(/\s+/g, "").replace(/[^a-z0-9]/g, "");
}

function parseRef(ref: string): { book: string; chapter: number; verse: number } | null {
  // Example ref: "1 Chronicles 1:1" or "John 3:16"
  if (!ref || typeof ref !== 'string') return null;

  const lastSpaceIndex = ref.lastIndexOf(" ");
  if (lastSpaceIndex === -1) return null;
  const book = ref.slice(0, lastSpaceIndex).trim();
  const chapterVerse = ref.slice(lastSpaceIndex + 1).trim();
  const [chapterStr, verseStr] = chapterVerse.split(":");
  const chapter = Number(chapterStr);
  const verse = Number(verseStr);
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

export async function resolveAudioUrl(ref: string, entry?: any): Promise<string | null> {
  if (!ref) return null;

  // 1) Prefer Supabase storage via signer API FIRST
  try {
    const r = await fetch(`/api/audio_url?ref=${encodeURIComponent(ref)}`, { cache: 'no-store' });
    if (r.ok) {
      const { url } = await r.json();
      if (url && /^https?:\/\//i.test(url)) {
        return url; // short-lived signed URL from Supabase
      }
    }
  } catch (error) {
    console.warn(`Failed to get signed URL for ${ref}:`, error);
  }

  // 2) If signer couldn't find it, fall back to audio map "direct" URL as last resort
  // (these are often old Google Drive links that may fail)
  if (entry?.direct && /^https?:\/\//i.test(entry.direct)) {
    console.warn(`Using fallback direct URL for ${ref}:`, entry.direct);
    return entry.direct;
  }

  return null;
}

export function audioUrlFromRef(ref: string, map: AudioMap): string {
  const filename = refToFilename(ref);
  if (!filename) return "";
  // The Firestore map sometimes uses just the verse filename
  // Ensure both exact and lowercase keys are checked
  const target = map[filename] || map[filename.toLowerCase()];
  if (!target) return "";
  // If the map already contains a full URL (Drive link, Storage signed URL, CDN, etc.), return it directly
  if (typeof target === 'string' && /^https?:\/\//i.test(target)) {
    return target;
  }
  // If the value is a gs:// path, convert using a public bucket base if provided
  if (typeof target === 'string' && target.startsWith('gs://')) {
    const PUBLIC_BASE = process.env.NEXT_PUBLIC_STORAGE_PUBLIC_BASE; // e.g., https://storage.googleapis.com/your-bucket
    if (PUBLIC_BASE) {
      const withoutScheme = target.replace(/^gs:\/\//, '').split('/');
      const bucket = withoutScheme.shift();
      const path = withoutScheme.join('/');
      // If PUBLIC_BASE already includes bucket, don't duplicate it
      if (bucket && PUBLIC_BASE.includes(bucket)) {
        return `${PUBLIC_BASE}/${path}`;
      }
      if (bucket) {
        return `${PUBLIC_BASE.replace(/\/$/, '')}/${bucket}/${path}`;
      }
    }
  }
  // Otherwise treat it as a Google Drive file ID
  const driveId = String(target);
  return `https://drive.google.com/uc?export=download&id=${driveId}`;
}


