import { NextRequest, NextResponse } from 'next/server';
import Fuse from 'fuse.js';

  import { getData, getLightweightData, getSearchData, hybridSearch, warmCaches } from '@/app/lib/data/load';
import { createClient } from '@supabase/supabase-js';
import { loadAudioMap as loadDriveAudioMap } from '@/app/lib/audio-map';
import { loadSupabaseAudioMap } from '@/app/lib/supabase-audio';
import { generateNounVariants } from '@/app/utils/noun_variants';
import { generateVerbVariants } from '@/app/utils/verb_variants';
import { audioUrlFromRef } from '@/utils/audio';
import { searchVerses as searchVersesD1, getAudioStreamUrl, searchVersesByForms, getVerseByRef } from '@/app/lib/cloudflare-d1';
// Removed supabase import due to file corruption
import { normalizeVerses } from '@/app/utils/normalize-results';
import { PashtoDisambiguator, type DisambiguationResult } from '@/utils/enhanced_disambiguation';

// ============================================================================
// SUPABASE SEARCH (NEW - Optimized for speed)
// ============================================================================

async function supabaseSearch(
  query: string,
  scope: Scope = 'all',
  translation: 'afghan2023' | 'yousafzai2019' = 'afghan2023',
  limit: number = 100
) {
  const startTime = Date.now();
  
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // Map translation to table name
    const versesTable = translation === 'yousafzai2019' ? 'Yousafzai Verses' : 'Afghan 2023 Verses';

    // Try full-text search first
    const { data: verses, error: searchError } = await supabase
      .from(versesTable)
      .select('id, ref, book, chapter, verse, text, testament, audio_url, audio_public_url, audio_verse_url, translation_key')
      .ilike('text', `%${query}%`)
      .limit(limit);

    if (searchError) {
      console.log(`⏱️  Supabase search for "${query}": ${Date.now() - startTime}ms (error)`);
      return { results: [], frequency: 0 };
    }

    // Apply scope filter
    let filtered = verses || [];
    if (scope === 'ot') {
      filtered = filtered.filter(v => v.testament?.toLowerCase() === 'ot');
    } else if (scope === 'nt') {
      filtered = filtered.filter(v => v.testament?.toLowerCase() === 'nt');
    }

    const elapsed = Date.now() - startTime;
    console.log(`⏱️  Supabase search: ${elapsed}ms (${filtered.length} results)`);

    return { results: filtered, frequency: filtered.length };

  } catch (error) {
    console.error('Supabase search error:', error);
    return { results: [], frequency: 0 };
  }
}

  // Romanized to Pashto conversion utility
  function romanizedToPashto(romanized: string): string {
    // Basic romanized to Pashto conversion map
    const romanizedToPashtoMap: Record<string, string> = {
      // Vowels
      'aa': 'ا', 'a': 'ا', 'á': 'ا',
      'ee': 'ې', 'e': 'ې', 'é': 'ې',
      'oo': 'و', 'o': 'و', 'ó': 'و',
      'uu': 'و', 'u': 'و', 'ú': 'و',
      'ai': 'ی', 'ei': 'ی',
      // Consonants
      'b': 'ب', 'p': 'پ',
      't': 'ت', 'ṭ': 'ط',
      's': 'س', 'ṣ': 'ص',
      'j': 'ج', 'ch': 'چ',
      'kh': 'خ', 'x': 'خ',
      'd': 'د', 'ḍ': 'ض',
      'z': 'ز', 'ẓ': 'ظ',
      'r': 'ر',
      'zh': 'ژ',
      'sh': 'ش',
      'gh': 'غ', 'ġ': 'غ',
      'f': 'ف',
      'q': 'ق',
      'k': 'ک', 'g': 'گ',
      'l': 'ل',
      'm': 'م',
      'n': 'ن',
      'h': 'ه', 'ḥ': 'ح',
      'y': 'ی', 'ý': 'ی',
      'w': 'و',
      // Special combinations for bread/food
      'DoD': 'ډوډ', 'dod': 'ډوډ', 'dodu': 'ډوډۍ',
      // Verb forms
      'wahul': 'وهل', 'wahel': 'وهل',
      // Common patterns
      'aan': 'ان', 'iin': 'ین', 'oon': 'ون',
    };

    let result = romanized;

    // Apply special patterns first (longest to shortest)
    const sortedPatterns = Object.keys(romanizedToPashtoMap).sort((a, b) => b.length - a.length);

    for (const pattern of sortedPatterns) {
      const replacement = romanizedToPashtoMap[pattern];
      result = result.replace(new RegExp(pattern, 'g'), replacement);
    }

    return result;
  }

  function normalizeRomanizedInput(value: string): string {
    return value
      .normalize('NFD')
      .replace(/[^A-Za-z'\-\s]/g, '')
      .toLowerCase()
      .trim();
  }

// Helper function to search with multiple terms
async function searchWithMultipleTerms(terms: string[], scope: Scope, strategy: 'auto' | 'trigram' | 'fulltext' | 'hybrid' = 'auto') {
  const allResults = new Map<string, any>();

  for (const term of terms) {
    try {
      const results = await hybridSearch(term, { scope });
      if (results && Array.isArray(results)) {
        for (const result of results) {
          // Use ref as key to deduplicate
          allResults.set(result.ref, result);
        }
      }
    } catch (error) {
      console.warn(`Search failed for term "${term}":`, error);
    }
  }

  // Convert back to array and sort by relevance (if we had scoring) or just return as-is
  return Array.from(allResults.values());
}

export const runtime = 'nodejs';

type Scope = 'all' | 'ot' | 'nt';

type SearchRequest = {
  query: string;
  scope?: Scope;
  includeRelated?: boolean;
  variants?: string[];
  enableFuzzy?: boolean;
  language?: 'pashto' | 'english' | 'anki';
  bookFilter?: string[];
  limit?: number;
  translation?: 'afghan2023' | 'yousafzai2019';
};

type Variant = {
  form: string;
  label: string;
  pos: 'noun'|'verb'|'adjective'|'other';
  score?: number;
  count?: number;
  romanized?: string;
  flags?: string[];
};

type Processed = {
  original: string;
  normalized: string;
  variants: string[];
    searchType: 'fast' | 'fuzzy' | 'enhanced' | 'hybrid' | 'occurrence' | 'supabase' | 'no_results' | 'video_transcript';
  pos?: 'noun' | 'verb' | 'adjective' | 'other';
  variantGroups?: { nouns?: Variant[]; verbs?: Variant[]; other?: Variant[] };
  variantDetails?: any;
  frequency?: number;
  romanization?: string;
  root?: string;
  fuzzyResults?: any;
  language?: 'pashto' | 'english' | 'anki';
  englishMatches?: Array<{ english: string; pashto: string; romanized?: string; pos?: string; forms?: string[] }>;
  variantsSearched?: string[];
  disambiguation?: any;
};

type ApiResult = {
  ref: string;
  text: string;
  testament?: string;
  translation: string | null;
  dialect: string | null;
  tags: any[][];
  audio_verse_url: string | null;
  id: number;
};

const YOUSAFZAI_BOOKS = new Set(['Psalms', 'Proverbs', 'Song of Solomon']);

const COMPOUND_HELPERS = new Set(['وهل', 'کول', 'کېدل', 'کړل', 'اخیستل', 'ساتل']);
const helperVariantCache = new Map<string, string[]>();

// Global audio map cache
let audioMapCache: Record<string, string> | null = null;
let audioMapCacheTime: number = 0;
const AUDIO_MAP_CACHE_TTL = 3600000; // 1 hour in milliseconds

// Audio map loading optimization - avoid redundant loads
let audioMapLoadingPromise: Promise<Record<string, string>> | null = null;

// Search result cache
interface SearchCacheKey {
  query: string;
  scope: string;
  includeRelated: boolean;
  enableFuzzy: boolean;
  searchLanguage: string;
}

interface SearchCacheEntry {
  results: any[];
  relatedForms: any;
  processed: any;
  timestamp: number;
  hitCount: number;
}

// Enhanced search result cache with better performance
const searchResultCache = new Map<string, SearchCacheEntry>();
const SEARCH_CACHE_TTL = 14400000; // 4 hours in milliseconds (increased from 2 hours)
const MAX_CACHE_ENTRIES = 1000; // Increased cache size for better hit rate

// Pre-computed common search results for instant loading
const INSTANT_RESULTS_CACHE = new Map<string, SearchCacheEntry>();

// Ultra-fast word index cache for common words
const WORD_INDEX_CACHE = new Map<string, any>();

// Cache performance tracking
let cacheHitCount = 0;
let cacheMissCount = 0;

  // Warm caches on startup (only in production)
  if (typeof window === 'undefined' && process.env.NODE_ENV === 'production') {
    // Warm caches asynchronously on module load (but don't block)
    setTimeout(() => {
      warmCaches().catch(console.error);
    }, 1000); // Wait 1 second after startup
  }

function generateCacheKey(query: string, scope: string, includeRelated: boolean, enableFuzzy: boolean, searchLanguage: string): string {
    // Create a more efficient cache key by normalizing query first
    const normalizedQuery = query.trim().toLowerCase();
    return `${normalizedQuery}:${scope}:${includeRelated}:${enableFuzzy}:${searchLanguage}`;
  }

  // Enhanced cache key that includes more context for better hit rates
  function generateEnhancedCacheKey(query: string, scope: string, includeRelated: boolean, enableFuzzy: boolean, searchLanguage: string, translation?: string): string {
    const normalizedQuery = query.trim().toLowerCase();
    const translationKey = translation || 'afghan2023';
    return `${normalizedQuery}:${scope}:${includeRelated}:${enableFuzzy}:${searchLanguage}:${translationKey}`;
  }

  // Check instant cache first (for common queries)
  function getInstantCachedSearch(cacheKey: string): SearchCacheEntry | null {
    const cached = INSTANT_RESULTS_CACHE.get(cacheKey);
    if (cached) {
      cacheHitCount++;
      return cached;
    }
    return null;
}

function getCachedSearch(cacheKey: string): SearchCacheEntry | null {
  const cached = searchResultCache.get(cacheKey);
  if (!cached) {
    cacheMissCount++;
    return null;
  }

  const now = Date.now();
  if ((now - cached.timestamp) > SEARCH_CACHE_TTL) {
    searchResultCache.delete(cacheKey);
    cacheMissCount++;
    return null;
  }

  // Update hit count
  cached.hitCount++;
  cacheHitCount++;
  return cached;
}

function setCachedSearch(cacheKey: string, results: any[], relatedForms: any, processed: any): void {
  // Clean up old entries if cache is full
  if (searchResultCache.size >= MAX_CACHE_ENTRIES) {
    // Remove oldest entries (by timestamp)
    const entries = Array.from(searchResultCache.entries());
    entries.sort((a, b) => a[1].timestamp - b[1].timestamp);

    const toRemove = entries.slice(0, Math.floor(MAX_CACHE_ENTRIES * 0.2)); // Remove 20% oldest
    toRemove.forEach(([key]) => searchResultCache.delete(key));
  }

  searchResultCache.set(cacheKey, {
    results,
    relatedForms,
    processed,
    timestamp: Date.now(),
    hitCount: 1,
  });
}

  // Preload common search results for instant loading
  async function preloadCommonSearches(): Promise<void> {
    console.log('🚀 Preloading common search results...');

    const commonQueries = [
      'خدا', 'عيسی', 'روح', 'ايمان', 'محبت', 'صلاة', 'كتاب', 'مسيح', 'انجيل', 'رب',
      'dodu', 'khuda', 'jesus', 'god', 'love', 'faith', 'prayer', 'bible', 'christ'
    ];

    for (const query of commonQueries) {
      try {
        const cacheKey = generateEnhancedCacheKey(query, 'all', false, false, 'pashto');

        // Only preload if not already cached
        if (!getInstantCachedSearch(cacheKey) && !getCachedSearch(cacheKey)) {
          console.log(`📚 Preloading: ${query}`);

          // This would trigger a search and cache the result
          await fetch(`${process.env.VERCEL_URL || 'http://localhost:3000'}/api/search`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              query,
              scope: 'all',
              includeRelated: false,
              enableFuzzy: false,
              language: 'pashto'
            }),
          });
        }
      } catch (error) {
        console.warn(`Failed to preload ${query}:`, error);
      }
    }

    console.log('✅ Common searches preloaded');
}

// Prioritize results for Anki export (focus on dictionary entries with audio)
function prioritizeAnkiResults(results: any[]): any[] {
  if (!results.length) return results;

  // Group results by whether they have dictionary matches with audio
  const withAudio = [];
  const withoutAudio = [];

  for (const result of results) {
    const hasAudioMatch = checkIfResultHasAudioMatch(result);
    if (hasAudioMatch) {
      withAudio.push(result);
    } else {
      withoutAudio.push(result);
    }
  }

  // Return audio matches first, then others
  return [...withAudio, ...withoutAudio];
}

// Check if a result has a dictionary entry with audio
function checkIfResultHasAudioMatch(result: any): boolean {
  // This is a simplified check - in practice, you'd want more sophisticated matching
  // For now, we'll assume results with shorter, more common words are more likely to have dictionary entries
  const text = result.text || '';
  const words = text.split(/\s+/);

  // Look for short words that are likely to be dictionary entries
  for (const word of words) {
    if (word.length > 2 && word.length < 10 && !/\d/.test(word)) {
      // Check if this word might exist in dictionary (simplified heuristic)
      // In practice, you'd query the dictionary database here
      return true; // For now, assume most short words have dictionary entries
    }
  }

  return false;
}

async function getAudioMap(): Promise<Record<string, string>> {
  const now = Date.now();

  // Return cached version if still valid
  if (audioMapCache && (now - audioMapCacheTime) < AUDIO_MAP_CACHE_TTL) {
    return audioMapCache;
  }

  // If already loading, return the existing promise to avoid duplicate loads
  if (audioMapLoadingPromise) {
    return audioMapLoadingPromise;
  }

  // Start loading process
  audioMapLoadingPromise = loadAudioMapData();
  
  try {
    const result = await audioMapLoadingPromise;
    return result;
  } finally {
    audioMapLoadingPromise = null;
  }
}

async function loadAudioMapData(): Promise<Record<string, string>> {
  try {
    const [driveMap, supabaseMap] = await Promise.all([
      loadDriveAudioMap(),
      loadSupabaseAudioMap(),
    ]);

    const merged: Record<string, string> = { ...driveMap };
    let supabaseAdded = 0;
    for (const [key, value] of Object.entries(supabaseMap)) {
      if (!merged[key]) {
        merged[key] = value;
        supabaseAdded++;
      }
    }

    audioMapCache = merged;
    audioMapCacheTime = Date.now();
    console.log(
      `✅ Audio map cached: ${Object.keys(merged).length} entries (Drive ${Object.keys(driveMap).length}, Supabase added ${supabaseAdded})`,
    );

    return merged;
  } catch (error) {
    console.error('Failed to load audio map data:', error);
    audioMapCache = {};
    audioMapCacheTime = Date.now();
    return {};
  }
}

async function getHelperVariants(helper: string): Promise<string[]> {
  if (!helper || !COMPOUND_HELPERS.has(helper)) return [];
  if (helperVariantCache.has(helper)) return helperVariantCache.get(helper)!;

  try {
    const variants = await generateVerbVariants(helper, { cap: 60, includeCompound: true });
    const forms = Array.from(new Set(variants.map(v => v.form).filter(Boolean)));
    helperVariantCache.set(helper, forms);
    return forms;
  } catch (error) {
    console.warn(`Failed to expand helper verb "${helper}":`, error);
    helperVariantCache.set(helper, []);
    return [];
  }
}

async function expandDictionaryEntryForms(entry: any): Promise<string[]> {
  const forms: string[] = [];
  if (!entry || typeof entry.pashto !== 'string') return forms;

  const base = entry.pashto.trim();
  if (!base) return forms;

  const seen = new Set<string>();
  const addForm = (text: string) => {
    const normalized = text.replace(/\s+/g, ' ').trim();
    if (!normalized || seen.has(normalized)) return;
    seen.add(normalized);
    forms.push(normalized);
  };

  addForm(base);

  const parts = base.split(/\s+/);
  if (parts.length > 1) {
    const helper = parts[parts.length - 1];
    const prefix = parts.slice(0, -1).join(' ');

    const helperForms = await getHelperVariants(helper);
    if (helperForms.length > 0) {
      for (const helperForm of helperForms) {
        addForm(`${prefix} ${helperForm}`);
      }
    }
  }

  return forms;
}

function normaliseScope(scope?: string): Scope {
  if (scope === 'ot' || scope === 'nt') return scope;
  return 'all';
}

function isLatinOnly(s: string): boolean {
  return !/[ا-ی]/u.test(s);
}

function containsPashto(s: string): boolean {
  return /[ا-ی]/u.test(s);
}

function transformResults(results: Array<{ ref: string; text: string; testament?: string; book: string }>, audioMap: Record<string, string> = {}): ApiResult[] {
  return results.map((result, index) => {
    const book = result.book;
    const usesYousafzai = YOUSAFZAI_BOOKS.has(book);

    // Get audio URL for this verse
    let audioUrl = null;
    try {
      const driveUrl = audioUrlFromRef(result.ref, audioMap);
      audioUrl = convertAudioUrlToProxy(driveUrl);
    } catch (error) {
      console.warn(`Failed to get audio URL for ${result.ref}:`, error);
    }

    return {
      ref: result.ref,
      text: result.text,
      testament: result.testament ?? 'NT',
      translation: usesYousafzai ? 'Yousafzai 2019' : null,
      dialect: usesYousafzai ? 'Yousafzai' : null,
      tags: [] as any[][],
      audio_verse_url: audioUrl,
      id: index + 1,
    };
  });
}

export async function POST(request: NextRequest) {
  const startedAt = Date.now();

  try {
    console.log(`🔍 Search request started at ${new Date().toISOString()}`);
    const body = await request.json() as SearchRequest;
    const {
      query,
      includeRelated = false,
      variants = [],
      enableFuzzy = false,
      language = 'pashto',
      limit = 100,
      translation = 'afghan2023',
    } = body;
    const scope = normaliseScope(body.scope);

    // Initialize disambiguation variables at the top
    let disambiguationResult: any = null;
    let disambiguationAnalysis: DisambiguationResult | null = null;

      // Search video transcripts from Cloudflare D1
    const CLOUDFLARE_WORKER_URL = process.env.NEXT_PUBLIC_CLOUDFLARE_WORKER_URL || 'https://pashtobiblesearch.jeremy-samuels17.workers.dev';
    let videoTranscriptResults: any[] = [];
    
    try {
      const videoResponse = await fetch(`${CLOUDFLARE_WORKER_URL}/api/video/list`);
      if (videoResponse.ok) {
        const videoData = await videoResponse.json();
        const videos = videoData.videos || [];
        
        // Search in video transcripts
        videos.forEach((video: any) => {
          const transcript = video.transcript || '';
          const segments = video.segments || [];
          
          // Check if query matches transcript or any segment
          const transcriptMatch = transcript.toLowerCase().includes(query.toLowerCase());
          const segmentMatches = segments.filter((seg: any) => 
            seg.text?.toLowerCase().includes(query.toLowerCase())
          );
          
          if (transcriptMatch || segmentMatches.length > 0) {
            videoTranscriptResults.push({
              ref: `video:${video.video_id}`,
              text: transcript,
              video_id: video.video_id,
              youtube_url: video.youtube_url,
              segments: segmentMatches.length > 0 ? segmentMatches : [],
              source: 'video_transcript',
              translation: null,
              dialect: null,
              testament: undefined,
            });
          }
        });
      }
    } catch (error) {
      console.warn('Failed to search video transcripts:', error);
    }

    if (!query || typeof query !== 'string' || !query.trim()) {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 });
    }

    const originalQuery = query.trim();
    const searchLanguage: 'pashto' | 'english' | 'anki' = language === 'anki' ? 'anki' : language === 'english' ? 'english' : 'pashto';

    // Add transliteration support for common Pashto words
    const transliterationMap: Record<string, string> = {
      'weenum': 'وینم',
      'winam': 'وینم', 
      'wina': 'وینا',
      'kawum': 'کوم',
      'kawam': 'کوم',
      'kawel': 'کول',
      'kawedal': 'کېدل',
      'kawral': 'کړل',
      'akhistal': 'اخیستل',
      'satal': 'ساتل',
      'khuda': 'خدا',
      'khudai': 'خدای',
      'khuday': 'خدای',
      'dunya': 'دنیا',
      'zindagi': 'ژوند',
      'malik': 'مالک',
      'padar': 'پلار',
      'mor': 'مور',
      'wror': 'ورور',
      'khor': 'خور',
      'zama': 'زما',
      'sta': 'ستا',
      'da': 'دا',
      'hagha': 'هغه',
      'mung': 'مونږ',
      'tasu': 'تاسو',
      'dasi': 'داسي',
      'hasi': 'هاسي'
    };

    // Try transliteration if query is in English/Latin script
    let searchQuery = originalQuery;
      let romanizedDictionaryMatch: { pashto: string; romanized: string } | null = null;
    console.log(`🔍 Original query: "${originalQuery}", searchLanguage: "${searchLanguage}"`);
      const isLatinScriptQuery = searchLanguage === 'pashto' && isLatinOnly(originalQuery);

      if (isLatinScriptQuery) {
        try {
          const normalizedRoman = normalizeRomanizedInput(originalQuery);
          console.log(`🔍 Normalized romanized key: "${normalizedRoman}"`);

          if (normalizedRoman) {
            const { dictionaryByRomanized, frequencyMap } = await getLightweightData();
            let candidates = dictionaryByRomanized.get(normalizedRoman);

            if (!candidates || candidates.length === 0) {
              const accentlessKey = normalizedRoman.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
              if (accentlessKey && accentlessKey !== normalizedRoman) {
                candidates = dictionaryByRomanized.get(accentlessKey);
              }
            }

            if (!candidates || candidates.length === 0) {
              for (const [key, entries] of dictionaryByRomanized.entries()) {
                if (key === normalizedRoman) continue;
                if (key.normalize('NFD').replace(/[\u0300-\u036f]/g, '') === normalizedRoman) {
                  candidates = entries;
                  break;
                }
              }
            }

            if (candidates && candidates.length > 0) {
              let bestEntry = candidates[0] as any;
              let bestScore = Number.NEGATIVE_INFINITY;

              for (const candidate of candidates) {
                if (!candidate?.pashto) continue;
                const candidateRoman = typeof candidate.romanized === 'string' ? normalizeRomanizedInput(candidate.romanized) : '';
                const candidateG = typeof candidate.g === 'string' ? normalizeRomanizedInput(candidate.g) : '';
                const freq = frequencyMap.get(candidate.pashto) ?? 0;
                const posField = [candidate.pos, candidate.c, candidate.pos_family]
                  .map((value: unknown) => (typeof value === 'string' ? value.toLowerCase() : ''))
                  .join(' ');

                let score = freq > 0 ? Math.log10(freq + 1) * 25 : 0;
                if (candidateRoman === normalizedRoman) score += 40;
                if (candidateG === normalizedRoman) score += 30;
                if (posField.includes('verb')) score += 12;
                else if (posField.includes('noun')) score += 6;
                if (typeof candidate.pashto === 'string' && candidate.pashto.length) {
                  score += Math.max(0, 8 - candidate.pashto.length);
                }

                if (score > bestScore) {
                  bestScore = score;
                  bestEntry = candidate;
                }
              }

              romanizedDictionaryMatch = {
                pashto: bestEntry.pashto,
                romanized: typeof bestEntry.romanized === 'string' ? bestEntry.romanized : originalQuery,
              };
              searchQuery = bestEntry.pashto;
              console.log(
                `✅ Dictionary romanized lookup matched "${originalQuery}" → "${searchQuery}" (score=${Number.isFinite(bestScore) ? bestScore.toFixed(1) : 'n/a'})`,
              );
            } else {
              console.log(`⚠️ Dictionary romanized lookup had no match for "${normalizedRoman}"`);
            }
          }
        } catch (error) {
          console.warn('⚠️ Dictionary romanized lookup failed:', error);
        }
      }

      if (!romanizedDictionaryMatch && searchLanguage === 'pashto' && /^[a-zA-Z\s]+$/.test(originalQuery)) {
        console.log(`🔍 Query matches Latin script pattern (fallback transliteration)`);
      const transliterated = transliterationMap[originalQuery.toLowerCase()];
      console.log(`🔍 Transliteration lookup for "${originalQuery.toLowerCase()}":`, transliterated);
      if (transliterated) {
        searchQuery = transliterated;
          console.log(`🔄 Transliterated "${originalQuery}" to "${searchQuery}" via fallback map`);
      } else {
          console.log(`⚠️ No transliteration found for "${originalQuery}" in fallback map`);
      }
      } else if (romanizedDictionaryMatch) {
        console.log('🔄 Using dictionary-backed romanized conversion result');
    } else {
      console.log(`🔍 Query does not match transliteration conditions`);
    }

    // For Anki mode, prioritize dictionary entries with audio
    if (searchLanguage === 'anki') {
      console.log('🔄 Anki mode: prioritizing dictionary entries with audio');
    }
    let trimmedQuery = searchQuery;
    let englishSearchTerms: string[] = [];
    let englishMatches: Array<{ english: string; pashto: string; romanized?: string; pos?: string }> = [];

// ============================================================================
// TRY CLOUDFLARE D1 SEARCH FIRST (NEW - prioritized for R2 audio support)
// ============================================================================
if (process.env.NEXT_PUBLIC_CLOUDFLARE_WORKER_URL && searchLanguage === 'pashto' && !isLatinOnly(searchQuery)) {
  console.log(`\n🌩️  CLOUDFLARE D1 SEARCH FIRST: "${searchQuery}" (${translation})`);
  try {
    // Map scope to testament filter
    const testamentFilter = scope === 'ot' ? 'OT' : scope === 'nt' ? 'NT' : undefined;
    
    const d1Verses = await searchVersesD1(searchQuery, {
      translation: translation as 'afghan2023' | 'yousafzai2019',
      testament: testamentFilter,
      limit: limit,
    });
    
    if (d1Verses && d1Verses.length > 0) {
      const queryTimeMs = Date.now() - startedAt;
      console.log(`✅ D1 hit! ${d1Verses.length} results in ${queryTimeMs}ms`);
      
      // Format D1 results to match expected format with R2 audio support
      const formattedResults = d1Verses.map((verse: any, index: number) => {
        // Generate R2 audio URL if audio_r2_key exists
        let audioUrl = null;
        if (verse.audio_r2_key) {
          audioUrl = getAudioStreamUrl(verse.audio_r2_key);
        } else if (verse.audio_public_url) {
          audioUrl = convertAudioUrlToProxy(verse.audio_public_url);
        }
        
        return {
          ref: `${verse.book} ${verse.chapter}:${verse.verse}`,
          text: verse.text,
          testament: verse.testament,
          translation: translation === 'yousafzai2019' ? 'yousafzai2019' : 'afghan2023',
          audio_verse_url: audioUrl,
          audio_r2_key: verse.audio_r2_key || null, // Include R2 key for future use
          id: verse.id || index + 1,
        };
      });

      return NextResponse.json({
        success: true,
        results: formattedResults.slice(0, limit),
        processed: {
          original: originalQuery,
          normalized: searchQuery,
          variants: [],
          searchType: 'd1',
          frequency: d1Verses.length,
        },
        queryTime: queryTimeMs,
        source: 'd1-r2',
      });
    } else {
      console.log(`⚠️ D1 search returned ${d1Verses?.length || 0} results, falling back to Supabase`);
    }
  } catch (d1Error) {
    console.warn(`⚠️ D1 search failed, falling back to Supabase:`, d1Error);
  }
}

// ============================================================================
// FALLBACK TO SUPABASE SEARCH (if D1 unavailable or no results)
// ============================================================================
if (process.env.NEXT_PUBLIC_SUPABASE_URL && searchLanguage === 'pashto' && !isLatinOnly(searchQuery)) {
  console.log(`\n🚀 SUPABASE SEARCH (fallback): "${searchQuery}" (${translation})`);
  try {
    const supabaseResults = await supabaseSearch(searchQuery, scope, translation, limit);
    
    if (supabaseResults.results.length > 0) {
      const queryTimeMs = Date.now() - startedAt;
      console.log(`✅ Supabase hit! ${supabaseResults.results.length} results in ${queryTimeMs}ms`);
      
      // Format Supabase results to match expected format
      // Try to enrich with audio_r2_key from D1 if available
      const enrichedResults = await Promise.all(
        supabaseResults.results.map(async (verse: any) => {
          let audioUrl = null;
          let audioR2Key = null;
          
          // Try to get audio_r2_key from D1 for this verse
          if (process.env.NEXT_PUBLIC_CLOUDFLARE_WORKER_URL) {
            try {
              const d1Verse = await getVerseByRef(verse.ref, translation as 'afghan2023' | 'yousafzai2019');
              if (d1Verse?.audio_r2_key) {
                audioR2Key = d1Verse.audio_r2_key;
                audioUrl = getAudioStreamUrl(d1Verse.audio_r2_key);
              }
            } catch (error) {
              // D1 lookup failed, continue with Supabase audio
              console.debug(`Could not fetch audio_r2_key from D1 for ${verse.ref}`);
            }
          }
          
          // Fallback to Supabase audio if no R2 key found
          if (!audioUrl) {
            audioUrl = convertAudioUrlToProxy(verse.audio_verse_url || verse.audio_url || verse.audio_public_url);
          }
          
          return {
            ref: verse.ref,
            text: verse.text,
            testament: verse.testament,
            translation: translation === 'yousafzai2019' ? 'yousafzai2019' : 'afghan2023',
            audio_verse_url: audioUrl,
            audio_r2_key: audioR2Key,
            id: verse.id,
          };
        })
      );
      
      const formattedResults = enrichedResults;

      return NextResponse.json({
        success: true,
        results: formattedResults.slice(0, limit),
        processed: {
          original: originalQuery,
          normalized: searchQuery,
          variants: [],
          searchType: 'supabase',
          frequency: supabaseResults.frequency || undefined,
        },
        queryTime: queryTimeMs,
        source: 'supabase',
      });
    }
    
    // FALLBACK: If direct search failed, try to generate related forms
    console.log(`⏱️  Direct word not found, generating related forms...`);
    
    try {
      // Try to generate verb conjugations and noun inflections
      console.log(`Attempting to generate verb variants for: "${searchQuery}"`);
      const verbVariants = await generateVerbVariants(searchQuery, { cap: 50, includeCompound: true });
      console.log(`✅ Verb variants generated: ${verbVariants.length} forms`);
      
      console.log(`Attempting to generate noun variants for: "${searchQuery}"`);
      const nounVariants = await generateNounVariants(searchQuery, { cap: 50 });
      console.log(`✅ Noun variants generated: ${nounVariants.length} forms`);
      
      const allVariants = [...verbVariants, ...nounVariants];
      console.log(`Generated ${allVariants.length} total variants for "${searchQuery}": ${allVariants.map(v => v.form).join(', ')}`);
      
      // If no variants generated, try basic synthetic generation based on Pashto morphology
      if (allVariants.length === 0) {
        console.log(`⚠️ No variants generated, trying synthetic generation for "${searchQuery}"`);
        
        // Generate common Pashto verb suffixes for the base form
        const syntheticsToTry = [
          searchQuery,  // base form itself
          searchQuery + 'ی',  // past participle
          searchQuery + 'وی',  // subjunctive
          searchQuery + 'ل',  // past simple
          searchQuery.replace(/ی$/, '') + 'و',  // present plural
          'و' + searchQuery,  // prefixed past
        ];
        
        for (const form of syntheticsToTry) {
          if (form.trim()) {
            allVariants.push({
              form: form.trim(),
              label: 'Synthetic Form',
              pos: 'verb',
            });
          }
        }
        console.log(`Generated ${syntheticsToTry.length} synthetic forms`);
      }
      
      if (allVariants.length > 0) {
        console.log(`✅ Generated ${allVariants.length} related forms, searching...`);
        
        // Search for each variant and collect results
        let allResults: any[] = [];
        const uniqueRefs = new Set();
        const searchedVariants: string[] = [];
        
        for (const variant of allVariants.slice(0, 40)) {
          console.log(`Searching for variant: "${variant.form}"`);
          
          // Try D1 first for variants too
          let variantResults: any[] = [];
          if (process.env.NEXT_PUBLIC_CLOUDFLARE_WORKER_URL) {
            try {
              const testamentFilter = scope === 'ot' ? 'OT' : scope === 'nt' ? 'NT' : undefined;
              const d1VariantVerses = await searchVersesD1(variant.form, {
                translation: translation as 'afghan2023' | 'yousafzai2019',
                testament: testamentFilter,
                limit: 100,
              });
              
              if (d1VariantVerses && d1VariantVerses.length > 0) {
                variantResults = d1VariantVerses.map((v: any, idx: number) => ({
                  ref: `${v.book} ${v.chapter}:${v.verse}`,
                  text: v.text,
                  testament: v.testament,
                  audio_url: v.audio_r2_key ? getAudioStreamUrl(v.audio_r2_key) : v.audio_public_url,
                  audio_r2_key: v.audio_r2_key,
                  id: v.id || idx + 1,
                }));
              }
            } catch (d1Error) {
              console.warn(`D1 variant search failed for "${variant.form}", trying Supabase:`, d1Error);
            }
          }
          
          // Fallback to Supabase if D1 didn't return results
          if (variantResults.length === 0) {
            const supabaseVariantResults = await supabaseSearch(variant.form, scope, translation, 100);
            variantResults = supabaseVariantResults.results;
          }
          
          console.log(`Variant "${variant.form}": ${variantResults.length} results`);
          
          if (variantResults.length > 0) {
            searchedVariants.push(variant.form);
            
            for (const result of variantResults) {
              if (!uniqueRefs.has(result.ref)) {
                uniqueRefs.add(result.ref);
                allResults.push(result);
              }
            }
          }
          
          if (allResults.length >= limit) break;
        }
        
        if (allResults.length > 0) {
          console.log(`✅ Found ${allResults.length} results via related forms (${searchedVariants.length} variants searched)`);
          
          const formattedResults = allResults.slice(0, limit).map((verse: any) => {
            // Use R2 audio URL if available, otherwise fallback to Supabase URL
            // For yousafzai, audio_verse_url is the primary field
            let audioUrl = null;
            if (verse.audio_r2_key) {
              audioUrl = getAudioStreamUrl(verse.audio_r2_key);
            } else if (verse.audio_verse_url || verse.audio_url || verse.audio_public_url) {
              audioUrl = convertAudioUrlToProxy(verse.audio_verse_url || verse.audio_url || verse.audio_public_url);
            }
            
            return {
              ref: verse.ref,
              text: verse.text,
              testament: verse.testament,
              translation: translation === 'yousafzai2019' ? 'yousafzai2019' : 'afghan2023',
              audio_verse_url: audioUrl,
              audio_r2_key: verse.audio_r2_key || null,
              id: verse.id,
            };
          });

          return NextResponse.json({
            success: true,
            results: formattedResults,
            processed: {
              original: originalQuery,
              normalized: searchQuery,
              variants: allVariants.map(v => v.form),
              variantsSearched: searchedVariants,
              searchType: 'd1-with-variants',
              frequency: allResults.length,
            },
            queryTime: Date.now() - startedAt,
            source: 'd1-r2-variants',
            note: `Searched for related forms/conjugations of "${searchQuery}"`,
          });
        } else {
          console.log(`⚠️ Generated ${allVariants.length} variants but none found in index: ${allVariants.map(v => v.form).join(', ')}`);
        }
      }
    } catch (variantError) {
      console.error('❌ Failed to generate variants:', variantError instanceof Error ? variantError.message : variantError);
      console.error('Stack:', variantError instanceof Error ? variantError.stack : 'N/A');
    }
    
  } catch (error) {
    console.error('❌ Supabase search error:', error);
    // Don't fall back to JSON anymore - all inflections are indexed
    // If Supabase fails, return error instead of slow JSON search
    return NextResponse.json({
      success: false,
      error: 'Search service temporarily unavailable',
      results: [],
      queryTime: Date.now() - startedAt,
      source: 'supabase-error',
    }, { status: 503 });
  }
}

// If we reach here with Supabase enabled and no results, return empty (not found)
if (process.env.NEXT_PUBLIC_SUPABASE_URL && searchLanguage === 'pashto' && !isLatinOnly(searchQuery)) {
  console.log(`ℹ️  Word not found in Supabase index or related forms: "${searchQuery}"`);
  return NextResponse.json({
    success: true,
    results: [],
    processed: {
      original: originalQuery,
      normalized: searchQuery,
      variants: [],
      searchType: 'supabase',
      frequency: 0,
    },
    queryTime: Date.now() - startedAt,
    source: 'supabase',
    message: 'Word not found in index or related forms',
  });
}

// English search mode: find ALL Pashto words with this English term
    if (searchLanguage === 'english') {
      console.log('🇬🇧 English search mode enabled for query:', originalQuery);
      
      try {
        const { dictionary } = await getData();
        const englishLower = originalQuery.toLowerCase();
        
        // Find ALL dictionary entries where English definition matches
        // Use fuzzy matching: split English field by spaces/commas and check each word
        const matchingEntries = dictionary
          .filter((entry: any) => {
            if (typeof entry.english !== 'string') return false;
            const englishField = entry.english.toLowerCase();
            
            // Direct substring match (fastest)
            if (englishField.includes(englishLower)) return true;
            
            // Fuzzy match: check if query matches start of any word
            const words = englishField.split(/[\s,;]+/);
            return words.some((word: string) => word.startsWith(englishLower));
          })
          .slice(0, 12); // Increased from 8 to 12 for better coverage

        if (!matchingEntries.length) {
          console.warn(`❌ No dictionary match found for English "${originalQuery}"`);
          return NextResponse.json({
            results: [],
            relatedForms: null,
          processed: {
            original: originalQuery,
            normalized: originalQuery,
            variants: [],
            disambiguation: disambiguationResult,
            variantsSearched: [],
            searchType: 'fast',
            language: 'english',
            englishMatches: [],
          },
            count: 0,
            ms: Date.now() - startedAt,
          });
        }

        const orderedTerms: string[] = [];
        const addTerm = (term: string) => {
          const normalized = term?.replace(/\s+/g, ' ').trim();
          if (!normalized) return;
          if (!orderedTerms.includes(normalized)) {
            orderedTerms.push(normalized);
          }
        };

        const enrichedMatches: Array<{ english: string; pashto: string; romanized?: string; pos?: string; forms: string[] }> = [];

        for (const entry of matchingEntries) {
          const forms = await expandDictionaryEntryForms(entry);
          forms.forEach(addTerm);

          enrichedMatches.push({
            english: entry.english as string,
            pashto: entry.pashto,
            romanized: entry.romanized,
            pos: entry.pos,
            forms,
          });
        }

        englishMatches = enrichedMatches;
        englishSearchTerms = orderedTerms;

        if (englishSearchTerms.length > 0) {
          trimmedQuery = englishSearchTerms[0];
        }

        console.log('✅ English matches resolved to Pashto terms:', englishSearchTerms);
      } catch (error) {
        console.error('English search translation failed:', error);
      }
    }

      // Apply romanized to Pashto conversion to the main query
      const convertedQuery = romanizedToPashto(trimmedQuery);
      console.log(`🔄 Romanized conversion: "${trimmedQuery}" → "${convertedQuery}"`);

    // Combine search terms from query + English matches
      let searchTerms = Array.from(new Set([convertedQuery, ...englishSearchTerms])) as string[];

    // Apply enhanced disambiguation for ambiguous Pashto terms with Bible context

      // If filtered variants are provided, use only those for search
      const effectiveIncludeRelated = variants && variants.length > 0 ? false : includeRelated;

      // Parallelize disambiguation and related forms operations
      const disambiguationPromise = (searchLanguage === 'pashto' && searchTerms.length === 1 && !englishSearchTerms.length)
        ? Promise.resolve().then(async () => {
            try {
              const contextSentence = `خدا بوځو شو چې ${convertedQuery} راوړو`;
              return await PashtoDisambiguator.disambiguate(convertedQuery, contextSentence, 2);
            } catch (error) {
              console.warn('Disambiguation analysis failed:', error);
              return null;
            }
          })
        : Promise.resolve(null);

      const relatedFormsPromise = (effectiveIncludeRelated && searchLanguage === 'pashto')
        ? Promise.resolve().then(async () => {
            try {
              const relatedResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/related_forms`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                  form: convertedQuery,
                  translation: translation, // Include translation for demarcation
                }),
              });

              if (relatedResponse.ok) {
                const relatedFormsText = await relatedResponse.text();
                return JSON.parse(relatedFormsText);
              }
              return null;
            } catch (error) {
              console.error('Error in D1/LingDocs inflection search:', error);
              return null;
            }
          })
        : Promise.resolve(null);

      // Wait for parallelized operations to complete
      const [tempAnalysis, relatedFormsResult] = await Promise.all([
        disambiguationPromise,
        relatedFormsPromise
      ]);

        if (tempAnalysis) {
          disambiguationAnalysis = tempAnalysis;
        console.log(`🔍 Enhanced disambiguation: "${convertedQuery}" → ${disambiguationAnalysis.primaryPOS} (${Math.round(disambiguationAnalysis.confidence * 100)}% confidence)`);
          console.log(`   Context analysis: preceding=${disambiguationAnalysis.contextAnalysis.precedingWords.join(',')}, following=${disambiguationAnalysis.contextAnalysis.followingWords.join(',')}`);
          console.log(`   Morphological pattern: ${disambiguationAnalysis.contextAnalysis.morphologicalPattern}`);

          if (disambiguationAnalysis.alternativeMeanings.length > 0) {
            console.log(`   Alternative meanings: ${disambiguationAnalysis.alternativeMeanings.map(m => `${m.pos} (${Math.round(m.confidence * 100)}%)`).join(', ')}`);
          }

          // Use disambiguation result for search enhancement
          if (disambiguationAnalysis.confidence > 0.7) {
            disambiguationResult = {
            word: convertedQuery,
              likelyPos: disambiguationAnalysis.primaryPOS,
              confidence: disambiguationAnalysis.confidence,
              contextClues: disambiguationAnalysis.alternativeMeanings.map(m => m.contextClues).flat(),
              recommendedAction: disambiguationAnalysis.recommendedAction
            };
          }
      }

    if (variants && variants.length > 0) {
      console.log('🔽 Using filtered variants for search:', variants);
      searchTerms = variants;
    }

    // Generate related forms for LingDocs-style inflection search
    let relatedForms = null;

      // Handle related forms from parallelized operation
      if (relatedFormsResult) {
        relatedForms = relatedFormsResult;
          console.log(`✅ LingDocs-style search found ${relatedForms.total} related forms`);
          console.log(`🔍 Related forms structure:`, {
            hasNouns: !!relatedForms.forms?.nouns?.length,
            hasVerbs: !!relatedForms.forms?.verbs?.length,
            hasOther: !!relatedForms.forms?.other?.length,
            nounsCount: relatedForms.forms?.nouns?.length || 0,
            verbsCount: relatedForms.forms?.verbs?.length || 0,
            otherCount: relatedForms.forms?.other?.length || 0
          });

          // Add all related forms to search terms for comprehensive Bible search
        const allSearchTerms = [convertedQuery]; // Include original

          if (relatedForms.forms?.nouns) {
          const nounForms = relatedForms.forms.nouns.map((f: any) => {
            const form = f.form;
            const convertedForm = romanizedToPashto(form);
            return convertedForm !== form ? convertedForm : form;
          });
            allSearchTerms.push(...nounForms);
          }
          if (relatedForms.forms?.verbs) {
          const verbForms = relatedForms.forms.verbs.map((f: any) => {
            const form = f.form;
            const convertedForm = romanizedToPashto(form);
            return convertedForm !== form ? convertedForm : form;
          });
            allSearchTerms.push(...verbForms);
          }
          if (relatedForms.forms?.other) {
          const otherForms = relatedForms.forms.other.map((f: any) => {
            const form = f.form;
            const convertedForm = romanizedToPashto(form);
            return convertedForm !== form ? convertedForm : form;
          });
            allSearchTerms.push(...otherForms);
          }

          searchTerms = Array.from(new Set(allSearchTerms));
          console.log(`🔍 Expanded search to ${searchTerms.length} terms including ${relatedForms.total} inflections`);
    }

    // If English search mode, create a special relatedForms object to show all matches
    if (effectiveIncludeRelated && searchLanguage === 'english' && englishMatches.length > 0) {
      const matchForms = englishMatches.map(m => ({
        form: m.pashto,
        label: m.english,
        pos: m.pos || 'unknown',
        romanized: m.romanized,
        count: 0
      }));

      relatedForms = {
        root: originalQuery, // Original English query
        total: matchForms.length,
        verbs: matchForms.filter(f => f.pos?.toLowerCase().includes('verb')),
        nouns: matchForms.filter(f => f.pos?.toLowerCase().includes('noun')),
        other: matchForms.filter(f => !f.pos?.toLowerCase().includes('verb') && !f.pos?.toLowerCase().includes('noun')),
        forms: {
          verbs: matchForms.filter(f => f.pos?.toLowerCase().includes('verb')),
          nouns: matchForms.filter(f => f.pos?.toLowerCase().includes('noun')),
          other: matchForms.filter(f => !f.pos?.toLowerCase().includes('verb') && !f.pos?.toLowerCase().includes('noun'))
        },
        variantDetails: [],
        posGuess: 'english-search'
      };
    } else if (effectiveIncludeRelated) {
      try {
          console.log('🔍 Generating related forms for expanded search:', convertedQuery);

        // Try to determine if it's a verb or noun and generate appropriate forms
        const { dictionary } = await getData();
        const dictEntry = dictionary.find((entry: any) => {
          // Check exact Pashto match
            if (entry.pashto === convertedQuery) return true;
          
          // Check romanized match with accent normalization
          if (entry.romanized) {
            const normalizedEntry = entry.romanized.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
              const normalizedQuery = convertedQuery.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
            if (normalizedEntry === normalizedQuery) return true;
          }
          
          return false;
        });

        // Detect part of speech from dictionary
        const pos = dictEntry?.pos?.toLowerCase() || '';
        const isNoun = pos.includes('noun') || pos.includes('n.');
        const isVerb = pos.includes('verb') || pos.includes('v.');
        const isAdjective = pos.includes('adj');

          console.log(`📖 Dictionary entry for "${convertedQuery}":`, {
          pos: dictEntry?.pos,
          detected: isNoun ? 'noun' : isVerb ? 'verb' : isAdjective ? 'adjective' : 'unknown',
          entry: dictEntry
        });

        let allVariants: any[] = [];
        let posGuess = 'unknown';

        // Prioritize based on detected POS
        if (isNoun) {
          // It's a noun - only generate noun inflections
          console.log('✅ Detected as NOUN - generating inflections');
            const nounVariants = await generateNounVariants(convertedQuery, { cap: 30 });
          allVariants.push(...nounVariants);
          posGuess = 'noun';
        } else if (isVerb) {
          // It's a verb - only generate verb conjugations
          console.log('✅ Detected as VERB - generating conjugations');
            const verbVariants = await generateVerbVariants(convertedQuery, { cap: 40, includeCompound: true });
          allVariants.push(...verbVariants);
          posGuess = 'verb';
        } else if (isAdjective) {
          // It's an adjective - generate both inflections and possibly compound verbs
          console.log('✅ Detected as ADJECTIVE - generating inflections and compounds');
            const nounVariants = await generateNounVariants(convertedQuery, { cap: 20 });
          allVariants.push(...nounVariants);
          // Also check for stative compounds (adj + کېدل/کول)
            const verbVariants = await generateVerbVariants(convertedQuery, { cap: 20, includeCompound: true });
          allVariants.push(...verbVariants);
          posGuess = 'adjective';
        } else {
          // Unknown - try both but prioritize by what generates more results
          console.log('⚠️ Unknown POS - trying both');
            const verbVariants = await generateVerbVariants(convertedQuery, { cap: 40, includeCompound: true });
            const nounVariants = await generateNounVariants(convertedQuery, { cap: 20 });
          
          if (verbVariants.length > nounVariants.length) {
            allVariants.push(...verbVariants);
            allVariants.push(...nounVariants);
            posGuess = 'verb';
          } else {
            allVariants.push(...nounVariants);
            allVariants.push(...verbVariants);
            posGuess = 'noun';
          }
        }

        // De-duplicate based on form
        const uniqueForms = new Map();
        allVariants.forEach(v => {
          if (!uniqueForms.has(v.form)) {
            uniqueForms.set(v.form, v);
          }
        });

        const forms = Array.from(uniqueForms.values());

        if (forms.length > 0) {
          // Add all forms as search terms (excluding the original query)
            const additionalTerms = forms.map(f => f.form).filter(f => f !== convertedQuery);
            searchTerms = [convertedQuery, ...additionalTerms];

          console.log(`✅ Generated ${forms.length} related forms, expanding search to ${searchTerms.length} terms`);

          // Separate verbs and nouns for the component display
          const verbs = forms.filter((f: any) => f.pos === 'verb');
          const nouns = forms.filter((f: any) => f.pos === 'noun');
          const other = forms.filter((f: any) => f.pos !== 'verb' && f.pos !== 'noun');

          // Create structured variantDetails format
          const variantDetails = [];

          if (verbs.length > 0) {
            variantDetails.push({
              type: 'verb',
              count: verbs.length,
              groups: [{
                key: 'verb-conjugations',
                label: 'Verb Conjugations',
                items: verbs
              }]
            });
          }

          if (nouns.length > 0) {
            variantDetails.push({
              type: 'noun',
              count: nouns.length,
              groups: [{
                key: 'noun-inflections',
                label: 'Noun Inflections',
                items: nouns
              }]
            });
          }

          const groupedForms = {
            verbs: verbs.map((f: any) => ({ form: f.form, count: f.count || 0, label: f.label })),
            nouns: nouns.map((f: any) => ({ form: f.form, count: f.count || 0, label: f.label })),
            other: other.map((f: any) => ({ form: f.form, count: f.count || 0, label: f.label })),
          };

          relatedForms = {
              root: convertedQuery,
            total: forms.length,
            verbs: groupedForms.verbs,
            nouns: groupedForms.nouns,
            other: groupedForms.other,
            forms: groupedForms,
            variantDetails,
            posGuess: posGuess || dictEntry?.pos || (verbs.length > nouns.length ? 'verb' : 'noun')
          };
        }
      } catch (error) {
        console.warn('Failed to generate related forms:', error);
      }
    }

      // Check cache after related forms processing (use enhanced cache key)
    const searchTermsHash = searchTerms.sort().join('|');
      const cacheKey = generateEnhancedCacheKey(
      searchTermsHash,
      scope,
      includeRelated,
      enableFuzzy,
        searchLanguage,
        translation
      );

      // Check instant cache first (for ultra-fast responses)
      const instantResult = getInstantCachedSearch(cacheKey);
      if (instantResult) {
        const hitRate = cacheHitCount / (cacheHitCount + cacheMissCount) * 100;
        console.log(`⚡ Instant cache hit for "${searchTermsHash}" (${instantResult.hitCount} hits, ${hitRate.toFixed(1)}% hit rate)`);
        return NextResponse.json({
          results: normalizeVerses(instantResult.results),
          relatedForms: instantResult.relatedForms,
          processed: instantResult.processed,
          count: instantResult.results.length,
          ms: 0, // Instant result
          cached: true,
          instant: true,
        });
      }

    const cachedResult = getCachedSearch(cacheKey);
    if (cachedResult) {
      const hitRate = cacheHitCount / (cacheHitCount + cacheMissCount) * 100;
      console.log(`✅ Cache hit for "${searchTermsHash}" (${cachedResult.hitCount} hits, ${hitRate.toFixed(1)}% hit rate)`);
      return NextResponse.json({
        results: normalizeVerses(cachedResult.results),
        relatedForms: cachedResult.relatedForms,
        processed: cachedResult.processed,
        count: cachedResult.results.length,
        ms: 0, // Cached result
        cached: true,
      });
    }

      // Get audio map now that we need it for result transformation
      const audioMap = await getAudioMap();

      // Optimized search execution - use the most efficient approach based on query characteristics
      console.log('🔍 Executing optimized search for:', convertedQuery, 'with', searchTerms.length, 'terms');

      let searchResults: any[] = [];
      let searchType: 'fast' | 'fuzzy' | 'enhanced' | 'hybrid' | 'occurrence' | 'supabase' | 'no_results' | 'video_transcript' = 'fast';

    // ULTRA-FAST STANDARD SEARCH: Use Supabase word_index for instant results
    if (searchTerms.length === 1 && !includeRelated && searchLanguage === 'pashto') {
      console.log('🚀 Using ultra-fast Supabase word_index lookup for standard search');
      try {
          // First try the ultra-fast Supabase optimized search
          const supabaseResults = await supabaseOptimizedSearch(convertedQuery, scope, limit, translation);

        if (supabaseResults && supabaseResults.length > 0) {
          searchResults = supabaseResults;
          searchType = 'supabase';
          console.log(`🚀 Ultra-fast Supabase search: found ${searchResults.length} results in record time`);
      } else {
          // Fallback to occurrence map if Supabase search fails
          console.log('🚀 Supabase search returned no results, trying occurrence map');
          const { occurrenceMap } = await getLightweightData();
          const verseRefs = occurrenceMap.get(convertedQuery);

          if (verseRefs && verseRefs.verses && verseRefs.verses.length > 0) {
            const { searchIndex } = await getSearchData();
            const candidateVerses = new Set();

            for (const verseRef of verseRefs.verses) {
              const verse = searchIndex.verses.find(v => v.ref === verseRef);
              if (verse && matchesScope(verse, scope)) {
                candidateVerses.add(verse);
              }
            }

            searchResults = Array.from(candidateVerses).slice(0, limit);
            searchType = 'occurrence';
            console.log(`⚡ Found ${searchResults.length} results using occurrence map`);
          } else {
            // Final fallback to enhanced search
            console.log('⚡ No results in occurrence map, using enhanced search');
            searchResults = await hybridSearch(convertedQuery, { scope, limit });
            searchType = 'enhanced';
          }
        }
      } catch (error) {
        console.warn('Ultra-fast Supabase search failed, falling back to enhanced search:', error);
        searchResults = await hybridSearch(convertedQuery, { scope, limit });
        searchType = 'enhanced';
      }
    } else if (searchTerms.length === 1 && !includeRelated) {
        // Single term, no related forms - use direct search
        console.log('🔍 Using direct single-term search');
        try {
          searchResults = await hybridSearch(convertedQuery, { scope, limit });
          searchType = 'enhanced';
        } catch (error) {
          console.warn('Direct search failed, falling back to index search:', error);
          // Fallback to index-based search
          const { searchIndex } = await getSearchData();
          const candidateVerses = new Set();

          for (const searchTerm of searchTerms) {
            const lower = searchTerm.toLowerCase();
            const originalMatches = searchIndex.byTextLower.get(lower) || [];
            for (const verse of originalMatches) {
              if (matchesScope(verse, scope)) candidateVerses.add(verse);
            }
            const normalizedMatches = searchIndex.byTextNormalizedLower?.get(lower) || [];
            for (const verse of normalizedMatches) {
              if (matchesScope(verse, scope)) candidateVerses.add(verse);
            }
          }

          searchResults = Array.from(candidateVerses).slice(0, limit);
          searchType = 'fast';
        }
      } else if (searchTerms.length > 1 && includeRelated) {
        // Multiple terms from inflections/conjugations - use D1 form_occurrences
        console.log(`🌩️  Using D1 form_occurrences for ${searchTerms.length} inflected forms`);
        try {
          const testamentFilter = scope === 'ot' ? 'OT' : scope === 'nt' ? 'NT' : undefined;
          const d1Verses = await searchVersesByForms(searchTerms, {
            translation: translation as 'afghan2023' | 'yousafzai2019',
            testament: testamentFilter,
            limit: limit,
          });
          
          if (d1Verses && d1Verses.length > 0) {
            searchResults = d1Verses.map((verse: any) => ({
              ref: `${verse.book} ${verse.chapter}:${verse.verse}`,
              text: verse.text,
              testament: verse.testament,
              book: verse.book,
              chapter: verse.chapter,
              verse: verse.verse,
            }));
            searchType = 'enhanced';
            console.log(`✅ D1 form_occurrences search: found ${searchResults.length} results`);
          } else {
            // Fallback to multiple terms search
            console.log('⚠️ D1 form_occurrences returned no results, falling back');
            searchResults = await searchWithMultipleTerms(searchTerms, scope, 'auto');
            searchType = 'enhanced';
          }
        } catch (d1Error) {
          console.warn('⚠️ D1 form_occurrences search failed, falling back:', d1Error);
          searchResults = await searchWithMultipleTerms(searchTerms, scope, 'auto');
          searchType = 'enhanced';
        }
      } else if (searchTerms.length > 1) {
        // Multiple terms - use optimized multiple terms search
        console.log('🔍 Using optimized multiple terms search');
        searchResults = await searchWithMultipleTerms(searchTerms, scope, 'auto');
        searchType = 'enhanced';
      } else {
        // Fallback to comprehensive search
        console.log('🔍 Using comprehensive fallback search');
        searchResults = await hybridSearch(convertedQuery, { scope, limit, includeRelated: true });
        searchType = 'hybrid';
      }

      if (searchResults && searchResults.length > 0) {
        console.log('✅ Search successful, found', searchResults.length, 'results');

        // Transform results efficiently
        const transformed = searchResults.map((result: any, index: number) => ({
          ref: result.ref,
          text: result.text,
          testament: result.testament || 'NT',
          translation: null,
          dialect: null,
          tags: [] as any[][],
          audio_verse_url: convertAudioUrlToProxy(audioMap[result.ref] || null),
          id: index + 1,
        }));

        // Add video transcript results to the search results
        if (videoTranscriptResults.length > 0) {
          console.log(`📹 Adding ${videoTranscriptResults.length} video transcript results`);
          const videoTransformed = videoTranscriptResults.map((video: any, index: number) => ({
            ref: video.ref,
            text: video.text,
            testament: undefined,
            translation: null,
            dialect: null,
            tags: [['video_transcript']] as any[][],
            audio_verse_url: null,
            id: transformed.length + index + 1,
            video_id: video.video_id,
            youtube_url: video.youtube_url,
            segments: video.segments,
            source: 'video_transcript',
          }));
          transformed.push(...videoTransformed);
        }

        // Cache the results
        const processedData = {
          original: originalQuery,
          normalized: convertedQuery,
          variants: searchTerms,
          searchType,
          pos: 'unknown',
          language: searchLanguage,
          englishMatches: englishMatches.length ? englishMatches : undefined,
          variantsSearched: searchTerms,
          romanization: romanizedDictionaryMatch?.romanized,
          root: romanizedDictionaryMatch?.pashto,
        };
        
        // Cache the results (both in regular and instant cache for high-frequency queries)
        setCachedSearch(cacheKey, transformed, relatedForms, processedData);

        // Also store in instant cache if this is a high-value result (more than 5 results)
        if (transformed.length > 5) {
          INSTANT_RESULTS_CACHE.set(cacheKey, {
            results: transformed,
            relatedForms,
            processed: processedData,
            timestamp: Date.now(),
            hitCount: 1,
          });
          console.log(`⚡ Stored in instant cache (${transformed.length} results)`);
        }

        return NextResponse.json({
          results: normalizeVerses(transformed),
          relatedForms,
          processed: {
            original: originalQuery,
            normalized: convertedQuery,
            variants: searchTerms,
            disambiguation: disambiguationResult,
            searchType,
            pos: 'unknown',
            language: searchLanguage,
            englishMatches: englishMatches.length ? englishMatches : undefined,
            variantsSearched: searchTerms,
            romanization: romanizedDictionaryMatch?.romanized,
            root: romanizedDictionaryMatch?.pashto,
          },
          count: transformed.length,
          ms: Date.now() - startedAt,
          cached: false,
        });
      }



      // If no results found, check video transcripts and return them
      console.log(`🔄 No Bible results found for query: "${convertedQuery}"`);
      
      // Return video transcript results if available
      if (videoTranscriptResults.length > 0) {
        console.log(`📹 Found ${videoTranscriptResults.length} video transcript matches`);
        const transformed = videoTranscriptResults.map((video: any, index: number) => ({
          ref: video.ref,
          text: video.text,
          testament: undefined,
          translation: null,
          dialect: null,
          tags: [['video_transcript']] as any[][],
          audio_verse_url: null,
          id: index + 1,
          video_id: video.video_id,
          youtube_url: video.youtube_url,
          segments: video.segments,
          source: 'video_transcript',
        }));

        const processed: Processed = {
          original: originalQuery,
          normalized: convertedQuery,
          variants: searchTerms,
          disambiguation: disambiguationResult,
          searchType: 'video_transcript',
          language: searchLanguage,
          englishMatches: englishMatches.length ? englishMatches : undefined,
          variantsSearched: searchTerms,
          romanization: romanizedDictionaryMatch?.romanized,
          root: romanizedDictionaryMatch?.pashto,
        };

        return NextResponse.json({
          results: normalizeVerses(transformed),
          relatedForms,
          processed,
          count: transformed.length,
          ms: Date.now() - startedAt,
          cached: false,
        });
      }
    } catch (error) {
      console.error('Search API error:', error);
      return NextResponse.json(
        { error: 'Search failed', details: error instanceof Error ? error.message : 'Unknown error' },
        { status: 500 },
      );
    }
  }

  // Cache status endpoint for monitoring
  export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    if (action === 'preload') {
      // Preload common searches on demand
      await preloadCommonSearches();
      return NextResponse.json({
        message: 'Common searches preloaded',
        timestamp: new Date().toISOString()
      });
    }

    if (action === 'warm') {
      // Warm up all caches (data + common searches)
      await warmCaches();
      await preloadCommonSearches();
      return NextResponse.json({
        message: 'All caches warmed',
        timestamp: new Date().toISOString()
      });
    }

    if (action === 'clear') {
      // Clear all caches
      searchResultCache.clear();
      INSTANT_RESULTS_CACHE.clear();
      audioMapCache = null;
      audioMapCacheTime = 0;
      helperVariantCache.clear();

      return NextResponse.json({
        message: 'All caches cleared',
        timestamp: new Date().toISOString()
      });
    }

    return NextResponse.json({
      cache: {
        searchResults: {
          size: searchResultCache.size,
          maxSize: MAX_CACHE_ENTRIES,
          ttl: SEARCH_CACHE_TTL,
          instantCacheSize: INSTANT_RESULTS_CACHE.size,
        },
        audioMap: {
          cached: audioMapCache !== null,
          ttl: AUDIO_MAP_CACHE_TTL,
          age: audioMapCache ? Date.now() - audioMapCacheTime : null,
        },
        helperVariants: {
          size: helperVariantCache.size,
        },
        performance: {
          hitRate: cacheHitCount / (cacheHitCount + cacheMissCount) * 100,
          totalHits: cacheHitCount,
          totalMisses: cacheMissCount,
        },
      },
    });
  }

// Ultra-fast search using pre-computed word occurrence index
async function supabaseOptimizedSearch(
  query: string,
  scope: Scope,
  limit: number = 100,
  translation: string = 'afghan2023'
): Promise<any[]> {
  const startTime = Date.now();
  try {
    console.log('🚀 Starting ultra-fast word occurrence search', { query, scope, limit, translation });

    const supabase = await import('@supabase/supabase-js').then(m => m.createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    ));

    // Use word_occurrence_index for ultra-fast lookups
    const { data: occurrenceData, error: occurrenceError } = await supabase
      .from('word_occurrence_index')
      .select('verse_refs, tf_idf_scores, frequency')
      .eq('word', query)
      .eq('translation_key', translation)
      .single();

    if (occurrenceData && !occurrenceError && occurrenceData.verse_refs && occurrenceData.verse_refs.length > 0) {
      console.log(`⚡ Word occurrence index hit`, {
        results: occurrenceData.verse_refs.length,
        frequency: occurrenceData.frequency
      });

      // Get verse details using the fast function (with audio URLs)
      const { data: verses, error: versesError } = await supabase
        .rpc('search_verses_by_word_fast', {
          search_word: query,
          search_translation: translation,
          max_results: limit
        });

      if (verses && !versesError) {
        console.log(`⚡ Ultra-fast Word Occurrence Search`, {
          results: verses.length,
          method: 'word_occurrence_index',
          translation
        });
        return verses;
      } else if (!versesError) {
        // Fallback: manually fetch verses by refs (with audio URLs)
        const { data: fallbackVerses } = await supabase
          .from(translation === 'afghan2023' ? 'verses' : 'verses_yousafzai')
          .select('id, ref, text, testament, book, chapter, verse, audio_url, audio_public_url, audio_verse_url')
          .in('ref', occurrenceData.verse_refs.slice(0, limit));

        if (fallbackVerses) {
          // Sort by TF-IDF scores if available
          let sortedVerses = fallbackVerses;
          if (occurrenceData.tf_idf_scores && Array.isArray(occurrenceData.tf_idf_scores)) {
            sortedVerses = fallbackVerses
              .map((verse, index) => ({
                ...verse,
                score: occurrenceData.tf_idf_scores[index] || 0
              }))
              .sort((a, b) => (b.score || 0) - (a.score || 0));
          }

          console.log(`⚡ Ultra-fast Word Occurrence Search (Fallback)`, {
            results: sortedVerses.length,
            method: 'manual_fetch',
            translation
          });
          return sortedVerses;
        }
      }
    }

    // Fallback to cross-translation search if no specific match
    if (scope === 'all') {
      console.log('🔄 Falling back to cross-translation search');
      const { data: crossResults } = await supabase
        .rpc('search_verses_cross_translation', {
          search_word: query,
          max_results: limit
        });

      if (crossResults) {
        console.log(`⚡ Cross-translation Search`, {
          results: crossResults.length,
          method: 'cross_translation'
        });
        return crossResults;
      }
    }

    console.log(`⚡ Word Occurrence Search (No Results)`, { translation });
    return [];
  } catch (error) {
    console.log(`⚠️ Ultra-fast word occurrence search failed`, { error: error instanceof Error ? error.message : error });
    console.log(`⚡ Word Occurrence Search (Error)`, { error: true, translation });
    return [];
  }
}

// Helper function to check scope
function matchesScope(verse: any, scope: Scope): boolean {
  if (scope === 'all') return true;
  const testament = verse.testament?.toLowerCase();
  return testament === scope;
}

// ============================================================================
// AUDIO PROXY HELPER
// ============================================================================

function convertAudioUrlToProxy(googleDriveUrl: string | null): string | null {
  if (!googleDriveUrl) return null;
  
  // Extract file ID from Google Drive URL
  const match = googleDriveUrl.match(/id=([a-zA-Z0-9_-]+)/);
  if (!match || !match[1]) return null;
  
  // Return proxy URL
  return `/api/audio/proxy?id=${match[1]}`;
}
