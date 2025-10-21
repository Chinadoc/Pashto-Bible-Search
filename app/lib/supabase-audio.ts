import type { AudioMap } from '@/types';
import { supabase } from '@/app/utils/supabase';
import { canonicalBookFromSlug, refToFilename, filenameVariants } from './audio-map';

const AUDIO_BUCKET = 'audio';
const PAGE_SIZE = 1000;

async function listFilesRecursive(prefix = ''): Promise<string[]> {
  let results: string[] = [];
  let page = 0;

  while (true) {
    const offset = page * PAGE_SIZE;
    const { data, error } = await supabase.storage.from(AUDIO_BUCKET).list(prefix, {
      limit: PAGE_SIZE,
      offset,
      sortBy: { column: 'name', order: 'asc' },
    });

    if (error) {
      throw error;
    }

    if (!data || data.length === 0) {
      break;
    }

    for (const entry of data) {
      if (!entry?.name) continue;
      const isFolder =
        !entry.name.toLowerCase().endsWith('.mp3') &&
        (!entry.metadata || typeof (entry.metadata as any).size === 'undefined');

      if (isFolder) {
        const nestedPrefix = prefix ? `${prefix}/${entry.name}` : entry.name;
        const nestedFiles = await listFilesRecursive(nestedPrefix);
        results = results.concat(nestedFiles);
        continue;
      }

      if (entry.name.toLowerCase().endsWith('.mp3')) {
        const path = prefix ? `${prefix}/${entry.name}` : entry.name;
        results.push(path);
      }
    }

    if (data.length < PAGE_SIZE) {
      break;
    }

    page += 1;
  }

  return results;
}

function addEntry(target: AudioMap, ref: string, url: string) {
  if (!ref || !url) return;

  if (!target[ref]) {
    target[ref] = url;
  }

  const filename = refToFilename(ref);
  if (filename) {
    if (!target[filename]) {
      target[filename] = url;
    }
    const lower = filename.toLowerCase();
    if (!target[lower]) {
      target[lower] = url;
    }
  }

  const variants = filenameVariants(ref);
  for (const variant of variants) {
    if (!target[variant]) {
      target[variant] = url;
    }
    const lower = variant.toLowerCase();
    if (!target[lower]) {
      target[lower] = url;
    }
  }
}

function filenameToReference(filename: string): string | null {
  const base = filename.includes('/') ? filename.split('/').pop()! : filename;
  const match = base.match(/^([a-z0-9-]+?)(\d+)_verse_(\d+)\.mp3$/i);
  if (!match) return null;

  const [, slug, chapterStr, verseStr] = match;
  const book = canonicalBookFromSlug(slug);
  if (!book) return null;

  const chapter = Number(chapterStr);
  const verse = Number(verseStr);
  if (!Number.isFinite(chapter) || !Number.isFinite(verse)) return null;

  return `${book} ${chapter}:${verse}`;
}

export async function loadSupabaseAudioMap(): Promise<AudioMap> {
  const map: AudioMap = {};

  try {
    const files = await listFilesRecursive();
    for (const filePath of files) {
      const ref = filenameToReference(filePath);
      if (!ref) continue;

      const { data } = supabase.storage.from(AUDIO_BUCKET).getPublicUrl(filePath);
      const publicUrl = data?.publicUrl;
      if (!publicUrl) continue;

      addEntry(map, ref, publicUrl);
    }

    return map;
  } catch (error) {
    console.warn('Failed to load Supabase audio map:', error);
    return map;
  }
}
