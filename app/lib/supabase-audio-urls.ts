import { supabase } from '@/utils/supabase';

interface AudioMappingRow {
  verse_ref: string;
  audio_url: string;
  source?: string;
}

const audioCache = new Map<string, string>();
let cacheInitialized = false;

async function initializeAudioCache(): Promise<void> {
  if (cacheInitialized) return;

  console.log('🔊 Initializing audio cache from Supabase…');
  const start = Date.now();

  try {
    const { data: mappings, error } = await supabase
      .from('audio_mappings')
      .select('verse_ref, audio_url, source');

    if (error) {
      console.error('Error loading audio mappings:', error);
      return;
    }

    mappings?.forEach((row) => {
      if (row.verse_ref && row.audio_url) {
        audioCache.set(row.verse_ref, row.audio_url);
      }
    });

    cacheInitialized = true;
    console.log(`✅ Loaded ${audioCache.size} audio mappings in ${Date.now() - start}ms`);
  } catch (error) {
    console.error('Failed to initialize audio cache:', error);
  }
}

export async function getAudioUrl(verseRef: string): Promise<string | null> {
  if (!cacheInitialized) {
    await initializeAudioCache();
  }

  const normalized = verseRef.trim();
  if (audioCache.has(normalized)) return audioCache.get(normalized)!;
  if (audioCache.has(normalized.toLowerCase())) return audioCache.get(normalized.toLowerCase())!;

  const { data, error } = await supabase
    .from('audio_mappings')
    .select('audio_url')
    .eq('verse_ref', normalized)
    .single<Pick<AudioMappingRow, 'audio_url'>>();

  if (error && error.code !== 'PGRST116') {
    console.error('Audio lookup error:', error);
  }

  if (data?.audio_url) {
    audioCache.set(normalized, data.audio_url);
    return data.audio_url;
  }

  return null;
}

export async function getAudioUrls(verseRefs: string[]): Promise<Record<string, string>> {
  if (!cacheInitialized) {
    await initializeAudioCache();
  }

  const result: Record<string, string> = {};
  for (const ref of verseRefs) {
    const url = await getAudioUrl(ref);
    if (url) result[ref] = url;
  }
  return result;
}

export async function warmAudioCache(): Promise<void> {
  await initializeAudioCache();
}
