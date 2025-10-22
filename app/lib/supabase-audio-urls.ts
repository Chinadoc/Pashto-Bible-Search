import { supabase } from '@/utils/supabase';

/**
 * Get audio URLs from Supabase audio_mappings and audio_files tables
 * This is much faster than loading audio maps from JSON files
 */

interface AudioMappingRow {
  verse_ref: string;
  audio_url: string;
  source?: string;
}

// Cache audio URLs in memory for the duration of the server process
const audioCache = new Map<string, string>();
let cacheInitialized = false;

/**
 * Initialize audio cache from Supabase
 * This loads all audio mappings once and caches them
 */
async function initializeAudioCache(): Promise<void> {
  if (cacheInitialized) return;

  console.log('🔊 Initializing audio cache from Supabase...');
  const start = Date.now();

  try {
    // Load from audio_mappings table
    const { data: mappings, error } = await supabase
      .from('audio_mappings')
      .select('verse_ref, audio_url, source')
      .returns<AudioMappingRow[]>();

    if (error) {
      console.error('Error loading audio mappings:', error);
      return;
    }

    if (mappings) {
      for (const mapping of mappings) {
        if (mapping.verse_ref && mapping.audio_url) {
          audioCache.set(mapping.verse_ref, mapping.audio_url);
        }
      }

      console.log(`✅ Loaded ${audioCache.size} audio mappings in ${Date.now() - start}ms`);
      cacheInitialized = true;
    }
  } catch (error) {
    console.error('Failed to initialize audio cache:', error);
  }
}

/**
 * Get audio URL for a single verse reference
 */
export async function getAudioUrl(verseRef: string): Promise<string | null> {
  if (!cacheInitialized) {
    await initializeAudioCache();
  }

  // Normalize the reference
  const normalizedRef = verseRef.trim();

  // Check cache first
  if (audioCache.has(normalizedRef)) {
    return audioCache.get(normalizedRef)!;
  }

  // Try lowercase
  const lowerRef = normalizedRef.toLowerCase();
  if (audioCache.has(lowerRef)) {
    return audioCache.get(lowerRef)!;
  }

  // If not in cache, query database directly
  const { data, error } = await supabase
    .from('audio_mappings')
    .select('audio_url')
    .eq('verse_ref', normalizedRef)
    .returns<Pick<AudioMappingRow, 'audio_url'>>()
    .single();

  if (data && data.audio_url) {
    // Add to cache
    audioCache.set(normalizedRef, data.audio_url);
    return data.audio_url;
  }

  return null;
}

/**
 * Get audio URLs for multiple verse references (batch)
 */
export async function getAudioUrls(verseRefs: string[]): Promise<Record<string, string>> {
  if (!cacheInitialized) {
    await initializeAudioCache();
  }

  const result: Record<string, string> = {};

  for (const ref of verseRefs) {
    const url = await getAudioUrl(ref);
    if (url) {
      result[ref] = url;
    }
  }

  return result;
}

/**
 * Warm up the audio cache (call this on server start)
 */
export async function warmAudioCache(): Promise<void> {
  await initializeAudioCache();
}
