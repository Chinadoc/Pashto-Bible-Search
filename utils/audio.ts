import type { AudioMap } from "@/types";

function normalizeBookNameToSlug(bookName: string): string {
  return bookName.toLowerCase().replace(/\s+/g, "").replace(/[^a-z0-9]/g, "");
}

function parseRef(ref: string): { book: string; chapter: number; verse: number } | null {
  // Parse ref like "1 Corinthians 13:4" or "John 3:16"
  if (!ref || typeof ref !== 'string') return null;

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

export async function resolveAudioUrl(ref: string, entry?: any): Promise<string | null> {
  if (!ref) return null;

  // 1) If entry is already a string URL (from audio map), return it directly
  if (typeof entry === 'string' && /^https?:\/\//i.test(entry)) {
    return entry;
  }

  // 2) If entry is a Google Drive file ID (long string, no http), use proxy directly
  if (typeof entry === 'string' && entry.length > 20 && !entry.startsWith('http')) {
    return `/api/audio_proxy?fileId=${encodeURIComponent(entry)}&ref=${encodeURIComponent(ref)}`;
  }

  // 3) Prefer Supabase storage via signer API for other cases
  try {
    const r = await fetch(`/api/audio_url?ref=${encodeURIComponent(ref)}`, { cache: 'no-store' });
    if (r.ok) {
      const { url } = await r.json();
      if (url && (url.startsWith('/') || /^https?:\/\//i.test(url))) {
        return url; // short-lived signed URL from Supabase or proxy URL
      }
    }
  } catch (error) {
    console.warn(`Failed to get signed URL for ${ref}:`, error);
  }

  // 4) If signer couldn't find it, fall back to audio map "direct" URL as last resort
  // (these are often old Google Drive links that may fail)
  if (entry?.direct && /^https?:\/\//i.test(entry.direct)) {
    console.warn(`Using fallback direct URL for ${ref}:`, entry.direct);
    return entry.direct;
  }

  return null;
}

export function audioUrlFromRef(ref: string, map: AudioMap): string {
  // First try to find the verse reference directly in the audio map
  const target = map[ref];
  if (target) {
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

  // Fallback: try filename-based lookup for backward compatibility
  const filename = refToFilename(ref);
  if (!filename) return "";
  // The Firestore map sometimes uses just the verse filename
  // Ensure both exact and lowercase keys are checked
  const filenameTarget = map[filename] || map[filename.toLowerCase()];
  if (!filenameTarget) return "";

  // Handle filename-based target the same way
  if (typeof filenameTarget === 'string' && /^https?:\/\//i.test(filenameTarget)) {
    return filenameTarget;
  }
  if (typeof filenameTarget === 'string' && filenameTarget.startsWith('gs://')) {
    const PUBLIC_BASE = process.env.NEXT_PUBLIC_STORAGE_PUBLIC_BASE;
    if (PUBLIC_BASE) {
      const withoutScheme = filenameTarget.replace(/^gs:\/\//, '').split('/');
      const bucket = withoutScheme.shift();
      const path = withoutScheme.join('/');
      if (bucket && PUBLIC_BASE.includes(bucket)) {
        return `${PUBLIC_BASE}/${path}`;
      }
      if (bucket) {
        return `${PUBLIC_BASE.replace(/\/$/, '')}/${bucket}/${path}`;
      }
    }
  }
  // Otherwise treat it as a Google Drive file ID
  const driveId = String(filenameTarget);
  return `https://drive.google.com/uc?export=download&id=${driveId}`;
}


