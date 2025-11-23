import { NextRequest, NextResponse } from 'next/server';
import Fuse from 'fuse.js';

import { getData, getLightweightData, getSearchData, hybridSearch, warmCaches } from '@/app/lib/data/load';
import { generateNounVariants } from '@/app/utils/noun_variants';
import { generateVerbVariants } from '@/app/utils/verb_variants';
import { audioUrlFromRef } from '@/utils/audio';
import { searchVerses as searchVersesD1, getAudioStreamUrl, searchVersesByForms, getVerseByRef, fetchVerbFormsFromD1 } from '@/app/lib/cloudflare-d1';
import { normalizeVerses } from '@/app/utils/normalize-results';
import { PashtoDisambiguator, type DisambiguationResult } from '@/utils/enhanced_disambiguation';
import type { POSFilters, PartOfSpeech, POSSummary, VariantWithPOS } from '@/types/search';

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

/**
 * Get verb variants - prioritizes D1 pre-computed forms, falls back to runtime generation
 * D1 has 237K+ LingDocs-verified conjugations (67% faster, 57% more complete)
 */
async function getVerbVariantsWithD1Fallback(
  lemma: string,
  opts?: { cap?: number; includeCompound?: boolean }
): Promise<Variant[]> {
  const cap = opts?.cap ?? 60;

  // Try D1 first (pre-computed, fast, complete)
  console.log(`[VERB_VARIANTS] Checking D1 for "${lemma}" (cap: ${cap})`);
  const d1Forms = await fetchVerbFormsFromD1(lemma, { cap });

  if (d1Forms.length > 0) {
    console.log(`[VERB_VARIANTS] ✓ Found ${d1Forms.length} D1 forms for "${lemma}"`);

    // Transform D1 forms to Variant format
    return d1Forms.map(form => ({
      form: form.form,
      label: form.tense && form.person
        ? `${form.tense} ${form.person}`
        : form.tense || 'verb',
      pos: 'verb' as const,
      score: form.confidence || 1.0,
    }));
  }

  // Fallback to runtime generation if D1 has no data
  console.log(`[VERB_VARIANTS] ⚠️ No D1 forms for "${lemma}", falling back to generation`);
  return await generateVerbVariants(lemma, opts);
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
  posFilters?: POSFilters;  // NEW: POS filtering support
  morphologicalFilters?: MorphologicalFilters;  // NEW: Morphological filtering for verbs
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
    searchType: 'fast' | 'fuzzy' | 'enhanced' | 'hybrid' | 'occurrence' | 'd1' | 'no_results' | 'video_transcript';
  pos?: PartOfSpeech;
  variantGroups?: { nouns?: Variant[]; verbs?: Variant[]; other?: Variant[] };
  variantDetails?: any;
  frequency?: number;
  romanization?: string;
  root?: string;
  fuzzyResults?: any;
  language?: 'pashto' | 'english' | 'anki';
  englishMatches?: Array<{ english: string; pashto: string; romanized?: string; pos?: string; forms?: string[] }>;
  variantsSearched?: string[];
  posSummary?: POSSummary;  // NEW: POS summary from related forms
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

function buildPosSummary(variants: VariantWithPOS[]): POSSummary {
  const summary: POSSummary = {};

  for (const variant of variants) {
    const posKey = variant.pos;
    if (!summary[posKey]) {
      summary[posKey] = {
        count: 0,
        sources: { lingdocs: 0, d1: 0 },
      };
    }

    summary[posKey].count += 1;

    if (variant.sources?.includes('lingdocs')) {
      summary[posKey].sources.lingdocs += 1;
    }
    if (variant.sources?.includes('d1')) {
      summary[posKey].sources.d1 += 1;
    }
  }

  return summary;
}

async function buildInlineRelatedForms(
  word: string,
  translation: 'afghan2023' | 'yousafzai2019',
  posFilters?: POSFilters
): Promise<{ relatedForms: any; searchTerms: string[] } | null> {
  const normalized = word?.trim();
  if (!normalized) {
    return null;
  }

  console.log(`🔍 [BUILD_INLINE] Starting for "${normalized}" (translation: ${translation})`);

  try {
    const [verbVariants, nounVariants] = await Promise.all([
      getVerbVariantsWithD1Fallback(normalized, { cap: 60, includeCompound: true }),
      generateNounVariants(normalized, { cap: 40 }),
    ]);

    console.log(`🔍 [BUILD_INLINE] Generated variants:`, {
      verbCount: verbVariants.length,
      nounCount: nounVariants.length,
      verbSample: verbVariants.slice(0, 3).map(v => ({ form: v.form, label: v.label })),
    });

    const combined = [...verbVariants, ...nounVariants];
    if (!combined.length) {
      console.warn(`⚠️ [BUILD_INLINE] No variants generated for "${normalized}"`);
      return null;
    }

    const uniqueVariants = new Map<string, typeof combined[number]>();
    for (const variant of combined) {
      if (!variant?.form) continue;
      const existing = uniqueVariants.get(variant.form);
      if (!existing || (variant.count ?? 0) > (existing.count ?? 0)) {
        uniqueVariants.set(variant.form, variant);
      }
    }

    let consolidated = Array.from(uniqueVariants.values());
    console.log(`🔍 [BUILD_INLINE] After deduplication: ${consolidated.length} unique variants`);

    if (posFilters?.include?.length) {
      const includeSet = new Set(posFilters.include);
      const before = consolidated.length;
      consolidated = consolidated.filter((variant) => includeSet.has((variant.pos || 'other') as PartOfSpeech));
      console.log(`🔍 [BUILD_INLINE] POS include filter: ${before} → ${consolidated.length} variants`);
    }
    if (posFilters?.exclude?.length) {
      const excludeSet = new Set(posFilters.exclude);
      const before = consolidated.length;
      consolidated = consolidated.filter((variant) => !excludeSet.has((variant.pos || 'other') as PartOfSpeech));
      console.log(`🔍 [BUILD_INLINE] POS exclude filter: ${before} → ${consolidated.length} variants`);
    }

    if (!consolidated.length) {
      console.warn(`⚠️ [BUILD_INLINE] No variants after POS filtering`);
      return null;
    }

    const toSimple = (variant: typeof consolidated[number]) => ({
      form: variant.form,
      label: variant.label,
      pos: variant.pos,
      count: variant.count ?? 0,
      score: variant.score ?? 0,
      romanized: variant.romanized,
      flags: variant.flags,
    });

    const verbs = consolidated.filter((variant) => variant.pos === 'verb').map(toSimple);
    const nouns = consolidated.filter((variant) => variant.pos === 'noun').map(toSimple);
    const adjectives = consolidated.filter((variant) => variant.pos === 'adjective').map(toSimple);
    const other = consolidated
      .filter((variant) => !['verb', 'noun', 'adjective'].includes(variant.pos as string))
      .map(toSimple);

    console.log(`🔍 [BUILD_INLINE] Categorized:`, {
      verbs: verbs.length,
      nouns: nouns.length,
      adjectives: adjectives.length,
      other: other.length,
      verbLabels: verbs.slice(0, 5).map(v => v.label),
    });

    const variantsWithPos: VariantWithPOS[] = consolidated.map((variant) => ({
      form: variant.form,
      label: variant.label,
      pos: (variant.pos || 'other') as PartOfSpeech,
      sources: ['lingdocs'],
      count: variant.count,
      score: variant.score,
      romanized: variant.romanized,
      flags: variant.flags,
    }));

    const posSummary = buildPosSummary(variantsWithPos);

    const posGuess =
      verbs.length > 0
        ? 'verb'
        : nouns.length > 0
          ? 'noun'
          : adjectives.length > 0
            ? 'adjective'
            : 'other';

    console.log(`✅ [BUILD_INLINE] POS guess: ${posGuess} (verbs: ${verbs.length}, nouns: ${nouns.length})`);

    const relatedForms = {
      root: normalized,
      total: consolidated.length,
      verbs,
      nouns,
      adjectives,
      other,
      forms: {
        verbs,
        nouns,
        adjectives,
        other,
      },
      posGuess,
      translation,
      posSummary,
      metadata: {
        hasMultiplePos: [verbs.length, nouns.length, adjectives.length, other.length].filter(Boolean).length > 1,
        primaryPos: posGuess,
        generationStrategy: 'inline',
        source: 'lingdocs',
      },
    };

    const searchTerms = Array.from(
      new Set([normalized, ...consolidated.map((variant) => variant.form).filter(Boolean)])
    );

    console.log(`✅ [BUILD_INLINE] Complete: ${searchTerms.length} search terms generated`);

    return { relatedForms, searchTerms };
  } catch (error) {
    console.error(`❌ [BUILD_INLINE] Failed for "${word}":`, error);
    return null;
  }
}

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
  // Audio is now handled entirely by D1/R2 via Cloudflare Worker
  // No need for local audio map caching
  audioMapCache = {};
  audioMapCacheTime = Date.now();
  return {};
}

async function getHelperVariants(helper: string): Promise<string[]> {
  if (!helper || !COMPOUND_HELPERS.has(helper)) return [];
  if (helperVariantCache.has(helper)) return helperVariantCache.get(helper)!;

  try {
    const variants = await getVerbVariantsWithD1Fallback(helper, { cap: 60, includeCompound: true });
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

    // Audio URLs are now handled directly in search results from D1/R2
    return {
      ref: result.ref,
      text: result.text,
      testament: result.testament ?? 'NT',
      translation: usesYousafzai ? 'Yousafzai 2019' : null,
      dialect: usesYousafzai ? 'Yousafzai' : null,
      tags: [] as any[][],
      audio_verse_url: null, // Audio handled via D1/R2 in search results
      id: index + 1,
    };
  });
}

export async function POST(request: NextRequest) {
  const startedAt = Date.now();
  // Store query at function scope for error handling - initialize with default
  // This variable MUST be accessible in the catch block
  let originalQuery: string = 'unknown';

  try {
    console.log(`🔍 Search request started at ${new Date().toISOString()}`);
    const body = await request.json() as SearchRequest;
    const {
      query,
      includeRelated = false,
      variants = [],
      posFilters,
      morphologicalFilters,
      enableFuzzy = false,
      language = 'pashto',
      limit = 2000,
      translation = 'afghan2023',
    } = body;
    const scope = normaliseScope(body.scope);

    // Validate query first
    if (!query || typeof query !== 'string' || !query.trim()) {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 });
    }

    // Assign the query after validation
    originalQuery = query.trim();
    
    // Initialize disambiguation variables at the top
    let disambiguationResult: any = null;
    let disambiguationAnalysis: DisambiguationResult | null = null;

    // Unified search: Search video transcripts (across all translations)
    const CLOUDFLARE_WORKER_URL = process.env.NEXT_PUBLIC_CLOUDFLARE_WORKER_URL || 'https://pashtobiblesearch.jeremy-samuels17.workers.dev';
    let videoTranscriptResults: any[] = [];
    
    try {
      const videoResponse = await fetch(`${CLOUDFLARE_WORKER_URL}/api/video/list`, {
        signal: AbortSignal.timeout(5000), // 5 second timeout
      });
      if (videoResponse.ok) {
        const videoData = await videoResponse.json();
        const videos = videoData.videos || [];
        
        // Search in video transcripts (unified - searches all videos regardless of translation toggle)
        videos.forEach((video: any) => {
          const transcript = video.transcript || '';
          const segments = video.segments || [];
          
          // Check if query matches transcript or any segment
          const queryLower = originalQuery.toLowerCase();
          const transcriptMatch = transcript.toLowerCase().includes(queryLower);
          const segmentMatches = segments.filter((seg: any) => 
            seg.text?.toLowerCase().includes(queryLower)
          );
          
          if (transcriptMatch || segmentMatches.length > 0) {
            videoTranscriptResults.push({
              ref: `video:${video.video_id}`,
              text: transcript,
              video_id: video.video_id,
              youtube_url: video.youtube_url,
              segments: segmentMatches.length > 0 ? segmentMatches : [],
              source: 'video_transcript',
              translation: null, // Videos are unified - not tied to specific translation
              dialect: null,
              testament: undefined,
            });
          }
        });
      }
    } catch (error) {
      // Don't fail search if video search fails - just log and continue
      console.warn('Failed to search video transcripts (non-fatal):', error);
    }

    // Dictionary lookup for disambiguation (parallel to other searches)
    let dictionaryEntries: any[] = [];
    try {
      const { getD1Database, queryD1 } = await import('@/utils/d1');
      const db = getD1Database();
      
      if (db) {
        // Query D1 dictionary table
        const dictData = await queryD1<{ word: string; romanization: string; pos: string; definition: string }>(
          db,
          `SELECT word as pashto, romanization as romanized, pos, definition as english FROM dictionary WHERE word = ? LIMIT 10`,
          [originalQuery]
        );

        if (dictData && dictData.length > 0) {
          dictionaryEntries = dictData;
        } else {
          // Try normalized variant
          const normalized = originalQuery.replace(/ي/g, 'ی').replace(/ى/g, 'ی');
          if (normalized !== originalQuery) {
            const normData = await queryD1<{ word: string; romanization: string; pos: string; definition: string }>(
              db,
              `SELECT word as pashto, romanization as romanized, pos, definition as english FROM dictionary WHERE word = ? LIMIT 10`,
              [normalized]
            );
            
            if (normData && normData.length > 0) {
              dictionaryEntries = normData;
            }
          }
        }
      }
    } catch (error) {
      console.warn('Dictionary lookup failed (non-fatal):', error);
    }

    const searchLanguage: 'pashto' | 'english' | 'anki' = language === 'anki' ? 'anki' : language === 'english' ? 'english' : 'pashto';

    const debugInfo = {
      env: !!process.env.NEXT_PUBLIC_CLOUDFLARE_WORKER_URL,
      lang: searchLanguage,
      latinOnly: isLatinOnly(searchQuery),
      query: searchQuery,
      workerUrl: process.env.NEXT_PUBLIC_CLOUDFLARE_WORKER_URL
    };

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
    
    console.log(`🔍 DEBUG:`, debugInfo);
    console.log(`🔍 CONDITIONS: env=${!!process.env.NEXT_PUBLIC_CLOUDFLARE_WORKER_URL}, lang=${searchLanguage}, latinOnly=${isLatinOnly(searchQuery)}, query="${searchQuery}"`);

    if (process.env.NEXT_PUBLIC_CLOUDFLARE_WORKER_URL && searchLanguage === 'pashto' && !isLatinOnly(searchQuery)) {
      console.log(`\n🌩️  CLOUDFLARE D1 SEARCH FIRST: "${searchQuery}" (${translation})`);

      // If morphological filters are provided, generate verb forms and filter them
      let morphologicalVariants: string[] = [];
      if (morphologicalFilters && Object.keys(morphologicalFilters).length > 0) {
        console.log(`🔍 [MORPHOLOGICAL FILTERING] STARTING for "${searchQuery}" with filters:`, morphologicalFilters);
        try {
          // Generate all possible verb variants for this root
          const allVariants = await generateVerbVariants(searchQuery, { cap: 200 });

          // Filter variants based on morphological criteria
          morphologicalVariants = allVariants
            .filter(variant => {
              // Check if this variant matches the morphological filters
              // Note: The current variant generation doesn't include morphological tags,
              // so we need to infer them from the variant labels or implement proper tagging
              const label = variant.label.toLowerCase();

              if (morphologicalFilters.person) {
                const personNum = morphologicalFilters.person === '1st' ? '1' :
                                 morphologicalFilters.person === '2nd' ? '2' : '3';
                if (!label.includes(` ${personNum}`) && !label.includes(`${personNum}.`)) return false;
              }

              if (morphologicalFilters.tense) {
                const tenseMap: Record<string, string[]> = {
                  'present': ['present', 'pres', 'non-past'],
                  'past': ['past', 'preterite'],
                  'future': ['future'],
                  'perfect': ['perfect'],
                  'subjunctive': ['subjunctive', 'subj'],
                  'imperative': ['imperative', 'imp'],
                  'ability': ['ability', 'pot'],
                  'habitual': ['habitual', 'hab']
                };
                const tenseTerms = tenseMap[morphologicalFilters.tense] || [];
                if (!tenseTerms.some(term => label.includes(term))) return false;
              }

              if (morphologicalFilters.mood) {
                const moodMap: Record<string, string[]> = {
                  'indicative': ['indicative', 'ind'],
                  'subjunctive': ['subjunctive', 'subj'],
                  'imperative': ['imperative', 'imp'],
                  'ability': ['ability', 'pot']
                };
                const moodTerms = moodMap[morphologicalFilters.mood] || [];
                if (!moodTerms.some(term => label.includes(term))) return false;
              }

              if (morphologicalFilters.aspect) {
                const aspectTerms = morphologicalFilters.aspect === 'perfective' ? ['perfective', 'pfv'] : ['imperfective', 'ipfv'];
                if (!aspectTerms.some(term => label.includes(term))) return false;
              }

              return true;
            })
            .map(variant => variant.form);

          console.log(`✅ [MORPHOLOGICAL FILTERING] Found ${morphologicalVariants.length} matching forms:`, morphologicalVariants.slice(0, 10));
        } catch (error) {
          console.warn('Failed to apply morphological filtering:', error);
        }
      }

  console.log(`🔍 Variants provided:`, variants && variants.length > 0 ? variants.slice(0, 10) : 'none');
  try {
    // Map scope to testament filter
    const testamentFilter = scope === 'ot' ? 'OT' : scope === 'nt' ? 'NT' : undefined;
    
    // Use searchVersesByForms if variants are provided (morphological or regular), otherwise use regular search
    let d1Verses: any[] = [];
    const searchForms = morphologicalVariants.length > 0 ? morphologicalVariants : variants;

    if (searchForms && searchForms.length > 0) {
      console.log(`🔍 [D1 SEARCH] Using searchVersesByForms with ${searchForms.length} forms (${morphologicalVariants.length > 0 ? 'morphological' : 'regular'}):`, searchForms.slice(0, 10));
      d1Verses = await searchVersesByForms(searchForms, {
        translation: translation as 'afghan2023' | 'yousafzai2019',
        testament: testamentFilter,
        limit: limit,
      });
    } else {
      console.log(`🔍 [D1 SEARCH] Using searchVersesD1 with query: "${searchQuery}"`);
      d1Verses = await searchVersesD1(searchQuery, {
        translation: translation as 'afghan2023' | 'yousafzai2019',
        testament: testamentFilter,
        limit: limit,
      });
    }
    
    if (d1Verses && d1Verses.length > 0) {
      const queryTimeMs = Date.now() - startedAt;
      console.log(`✅ D1 hit! ${d1Verses.length} results in ${queryTimeMs}ms`);
      
          // Format D1 results to match expected format with R2 audio support
          const formattedResults = d1Verses.map((verse: any, index: number) => {
            // Generate R2 audio URL if audio_r2_key exists
            let audioUrl = null;
            if (verse.audio_r2_key) {
              audioUrl = getAudioStreamUrl(verse.audio_r2_key);
            }

            // Find which search forms actually appear in this verse
            const matchedForms = searchForms ? searchForms.filter(form =>
              verse.text && verse.text.includes(form)
            ) : undefined;

            return {
              ref: `${verse.book} ${verse.chapter}:${verse.verse}`,
              text: verse.text,
              testament: verse.testament,
              translation: translation === 'yousafzai2019' ? 'yousafzai2019' : 'afghan2023',
              audio_verse_url: audioUrl,
              audio_r2_key: verse.audio_r2_key || null, // Include R2 key for future use
              matchedForms: matchedForms && matchedForms.length > 0 ? matchedForms : undefined,
              id: verse.id || index + 1,
            };
          });

      let relatedFormsData: any = null;
      let relatedFormTerms: string[] | null = null;
      if (includeRelated && searchLanguage === 'pashto') {
        try {
          console.log(`🔍 [D1 FAST PATH] Building inline related forms for "${searchQuery}"`);
          const inlineRelated = await buildInlineRelatedForms(
            searchQuery,
            translation as 'afghan2023' | 'yousafzai2019',
            posFilters,
          );
          if (inlineRelated) {
            relatedFormsData = inlineRelated.relatedForms;
            relatedFormTerms = inlineRelated.searchTerms;
            console.log(`✅ [D1 FAST PATH] Built related forms:`, {
              total: relatedFormsData.total,
              verbsCount: relatedFormsData.forms?.verbs?.length || 0,
              nounsCount: relatedFormsData.forms?.nouns?.length || 0,
              posGuess: relatedFormsData.posGuess,
              searchTermsCount: relatedFormTerms.length,
            });
            console.log(`📋 [D1 FAST PATH] Verb forms sample:`, 
              relatedFormsData.forms?.verbs?.slice(0, 5).map((v: any) => ({ form: v.form, label: v.label }))
            );
          } else {
            console.warn(`⚠️ [D1 FAST PATH] buildInlineRelatedForms returned null for "${searchQuery}"`);
          }
        } catch (error) {
          console.warn('Failed to build inline related forms for D1 search:', error);
        }
      }
      
      console.log(`🔍 [D1 FAST PATH] Final variants:`, {
        providedVariants: variants?.length || 0,
        relatedFormTerms: relatedFormTerms?.length || 0,
        usingVariants: variants?.length ? variants.slice(0, 5) : (relatedFormTerms?.slice(0, 5) || [searchQuery]),
      });

      const d1Result: any = {
        success: true,
        results: formattedResults.slice(0, limit),
        relatedForms: relatedFormsData,
        processed: {
          original: originalQuery,
          normalized: searchQuery,
          variants: variants?.length ? variants : (relatedFormTerms || [searchQuery]),
          variantsSearched: variants?.length ? variants : (relatedFormTerms || [searchQuery]),
          searchType: 'd1',
          frequency: d1Verses.length,
          posSummary: relatedFormsData?.posSummary,
        },
        queryTime: queryTimeMs,
        source: 'd1-r2',
      };

      // Add debug info if requested
      if (req.nextUrl.searchParams.get('debug') === 'true') {
        d1Result.debug = debugInfo;
      }

      return NextResponse.json(d1Result);
    } else {
      console.log(`⚠️ D1 search returned ${d1Verses?.length || 0} results`);
    }
      } catch (d1Error) {
        console.warn(`⚠️ D1 search failed:`, d1Error);
      }
    }

    // English search mode: find ALL Pashto words with this English term
    if (searchLanguage === 'english') {
      console.log('🇬🇧 English search mode enabled for query:', originalQuery);

      try {
        const { dictionary } = await getData().catch((error) => {
          console.warn('Local data loading failed, skipping English search mode:', error.message);
          return { dictionary: [] };
        });
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
                const relatedFormsData = JSON.parse(relatedFormsText);
                
                // Apply POS filters if provided
                if (posFilters && (posFilters.include || posFilters.exclude)) {
                  const allVariants: Array<{ form: string; pos: PartOfSpeech }> = [];
                  
                  // Collect all variants with their POS
                  if (relatedFormsData.forms?.verbs) {
                    relatedFormsData.forms.verbs.forEach((v: any) => {
                      allVariants.push({ form: v.form, pos: v.pos || 'verb' });
                    });
                  }
                  if (relatedFormsData.forms?.nouns) {
                    relatedFormsData.forms.nouns.forEach((v: any) => {
                      allVariants.push({ form: v.form, pos: v.pos || 'noun' });
                    });
                  }
                  if (relatedFormsData.forms?.adjectives) {
                    relatedFormsData.forms.adjectives.forEach((v: any) => {
                      allVariants.push({ form: v.form, pos: v.pos || 'adjective' });
                    });
                  }
                  if (relatedFormsData.forms?.other) {
                    relatedFormsData.forms.other.forEach((v: any) => {
                      allVariants.push({ form: v.form, pos: v.pos || 'other' });
                    });
                  }
                  
                  // Filter variants by POS
                  const filteredVariants = allVariants.filter(v => {
                    if (posFilters.include && posFilters.include.length > 0) {
                      return posFilters.include.includes(v.pos);
                    }
                    if (posFilters.exclude && posFilters.exclude.length > 0) {
                      return !posFilters.exclude.includes(v.pos);
                    }
                    return true;
                  });
                  
                  // Update relatedFormsData with filtered variants
                  const filteredForms: any = {};
                  const posSet = new Set(filteredVariants.map(v => v.pos));
                  const formSet = new Set(filteredVariants.map(v => v.form));
                  
                  if (posSet.has('verb')) {
                    filteredForms.verbs = relatedFormsData.forms?.verbs?.filter((v: any) => formSet.has(v.form)) || [];
                  }
                  if (posSet.has('noun')) {
                    filteredForms.nouns = relatedFormsData.forms?.nouns?.filter((v: any) => formSet.has(v.form)) || [];
                  }
                  if (posSet.has('adjective')) {
                    filteredForms.adjectives = relatedFormsData.forms?.adjectives?.filter((v: any) => formSet.has(v.form)) || [];
                  }
                  if (posSet.has('other')) {
                    filteredForms.other = relatedFormsData.forms?.other?.filter((v: any) => formSet.has(v.form)) || [];
                  }
                  
                  relatedFormsData.forms = filteredForms;
                  relatedFormsData.total = filteredVariants.length;
                  
                  console.log(`✅ Filtered variants by POS: ${allVariants.length} → ${filteredVariants.length}`);
                }
                
                return relatedFormsData;
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

        // Use word_frequencies table to get POS, romanization, and English translation
        let posGuess = 'unknown';
        let romanization: string | undefined;
        let englishTranslation: string | undefined;
        
        try {
          const { getD1Database, queryD1First } = await import('@/utils/d1');
          const db = getD1Database();
          
          if (db) {
            const freqRow = await queryD1First<{ romanization: string; pos: string; english_translation: string }>(
              db,
              `SELECT romanization, pos, english_translation FROM word_frequencies WHERE pashto_word = ? LIMIT 1`,
              [convertedQuery]
            );
            
            if (freqRow) {
              romanization = freqRow.romanization || undefined;
              posGuess = freqRow.pos?.toLowerCase() || 'unknown';
              englishTranslation = freqRow.english_translation || undefined;
              
              console.log(`📊 Word frequency data for "${convertedQuery}":`, {
                pos: freqRow.pos,
                romanization: romanization,
                english: englishTranslation
              });
            }
          }
        } catch (freqError) {
          console.warn('Failed to fetch word frequency data:', freqError);
        }

        // Fallback to dictionary if word_frequencies didn't have data
        const { dictionary } = await getData().catch((error) => {
          console.warn('Local data loading failed, skipping dictionary lookup:', error.message);
          return { dictionary: [] };
        });
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

        // Use word_frequencies POS if available, otherwise fall back to dictionary
        const pos = posGuess !== 'unknown' ? posGuess : (dictEntry?.pos?.toLowerCase() || '');
        const isNoun = pos.includes('noun') || pos.includes('n.');
        const isVerb = pos.includes('verb') || pos.includes('v.');
        const isAdjective = pos.includes('adj');

          console.log(`📖 POS detection for "${convertedQuery}":`, {
          pos: pos,
          source: posGuess !== 'unknown' ? 'word_frequencies' : (dictEntry?.pos ? 'dictionary' : 'unknown'),
          detected: isNoun ? 'noun' : isVerb ? 'verb' : isAdjective ? 'adjective' : 'unknown',
          romanization: romanization || dictEntry?.romanized,
          english: englishTranslation || dictEntry?.english
        });

        let allVariants: any[] = [];
        let finalPosGuess = posGuess !== 'unknown' ? posGuess : 'unknown';

        // Prioritize based on detected POS
        if (isNoun) {
          // It's a noun - only generate noun inflections
          console.log('✅ Detected as NOUN - generating inflections');
            const nounVariants = await generateNounVariants(convertedQuery, { cap: 30 });
          allVariants.push(...nounVariants);
          finalPosGuess = 'noun';
        } else if (isVerb) {
          // It's a verb - only generate verb conjugations
          console.log('✅ Detected as VERB - generating conjugations');
            const verbVariants = await getVerbVariantsWithD1Fallback(convertedQuery, { cap: 40, includeCompound: true });
          allVariants.push(...verbVariants);
          finalPosGuess = 'verb';
        } else if (isAdjective) {
          // It's an adjective - generate both inflections and possibly compound verbs
          console.log('✅ Detected as ADJECTIVE - generating inflections and compounds');
            const nounVariants = await generateNounVariants(convertedQuery, { cap: 20 });
          allVariants.push(...nounVariants);
          // Also check for stative compounds (adj + کېدل/کول)
            const verbVariants = await getVerbVariantsWithD1Fallback(convertedQuery, { cap: 20, includeCompound: true });
          allVariants.push(...verbVariants);
          finalPosGuess = 'adjective';
        } else {
          // Unknown - try both but prioritize by what generates more results
          console.log('⚠️ Unknown POS - trying both');
            const verbVariants = await getVerbVariantsWithD1Fallback(convertedQuery, { cap: 40, includeCompound: true });
            const nounVariants = await generateNounVariants(convertedQuery, { cap: 20 });
          
          if (verbVariants.length > nounVariants.length) {
            allVariants.push(...verbVariants);
            allVariants.push(...nounVariants);
            finalPosGuess = 'verb';
          } else {
            allVariants.push(...nounVariants);
            allVariants.push(...verbVariants);
            finalPosGuess = 'noun';
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
            posGuess: finalPosGuess || dictEntry?.pos || (verbs.length > nouns.length ? 'verb' : 'noun'),
            romanization: romanization || dictEntry?.romanized,
            english: englishTranslation || dictEntry?.english
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
      let searchType: 'fast' | 'fuzzy' | 'enhanced' | 'hybrid' | 'occurrence' | 'd1' | 'no_results' | 'video_transcript' = 'fast';

    // ULTRA-FAST STANDARD SEARCH: Use D1 for instant results
    if (searchTerms.length === 1 && !includeRelated && searchLanguage === 'pashto') {
      console.log('🌩️  Using D1 search for single-term query');
      try {
        // Use D1 searchVersesD1 for fast results
        const testamentFilter = scope === 'ot' ? 'OT' : scope === 'nt' ? 'NT' : undefined;
        const d1Results = await searchVersesD1(convertedQuery, {
          translation: translation as 'afghan2023' | 'yousafzai2019',
          testament: testamentFilter,
          limit: limit,
        });

        if (d1Results && d1Results.length > 0) {
          searchResults = d1Results.map((verse: any) => ({
            ref: `${verse.book} ${verse.chapter}:${verse.verse}`,
            text: verse.text,
            testament: verse.testament,
            book: verse.book,
            chapter: verse.chapter,
            verse: verse.verse,
            audio_verse_url: verse.audio_r2_key ? getAudioStreamUrl(verse.audio_r2_key) : null,
            audio_r2_key: verse.audio_r2_key || null,
          }));
          searchType = 'd1';
          console.log(`✅ D1 search: found ${searchResults.length} results`);
        } else {
          // Fallback to occurrence map if D1 search fails
          console.log('⚡ D1 search returned no results, trying occurrence map');
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
        console.warn('D1 search failed, falling back to enhanced search:', error);
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
              audio_verse_url: verse.audio_r2_key ? getAudioStreamUrl(verse.audio_r2_key) : null,
              audio_r2_key: verse.audio_r2_key || null,
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

      // Check if there are more results available using D1 word_frequencies
      let totalEstimatedCount: number | undefined;
      let hasMoreResults = false;
      
      try {
        const { getD1Database, queryD1First } = await import('@/utils/d1');
        const db = getD1Database();
        
        if (db) {
          const freqRow = await queryD1First<{ frequency_count: number }>(
            db,
            `SELECT frequency_count FROM word_frequencies WHERE pashto_word = ? LIMIT 1`,
            [convertedQuery]
          );
          
          if (freqRow && freqRow.frequency_count) {
            totalEstimatedCount = freqRow.frequency_count;
          }
        }
      } catch (freqError) {
        console.warn('Could not check word frequency for total count:', freqError);
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
          audio_verse_url: result.audio_verse_url || result.audio_r2_key ? getAudioStreamUrl(result.audio_r2_key) : null,
          audio_r2_key: result.audio_r2_key || null,
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
            audio_r2_key: null,
            id: transformed.length + index + 1,
            video_id: video.video_id,
            youtube_url: video.youtube_url,
            segments: video.segments,
            source: 'video_transcript',
          }));
          transformed.push(...videoTransformed);
        }

        // Update hasMoreResults now that transformed is available
        if (totalEstimatedCount !== undefined) {
          hasMoreResults = totalEstimatedCount > transformed.length;
        } else {
          hasMoreResults = transformed.length >= limit;
        }

        // Cache the results
        const processedData: Processed = {
          original: originalQuery,
          normalized: convertedQuery,
          variants: searchTerms,
          searchType,
          pos: relatedForms?.posGuess || 'unknown',
          language: searchLanguage,
          englishMatches: englishMatches.length ? englishMatches : undefined,
          variantsSearched: searchTerms,
          posSummary: relatedForms?.posSummary,  // Include POS summary from related forms
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

        // Group dictionary entries by POS for disambiguation display
        const dictionaryByPos: Record<string, any[]> = {};
        dictionaryEntries.forEach((entry: any) => {
          const pos = entry.pos || 'unknown';
          if (!dictionaryByPos[pos]) {
            dictionaryByPos[pos] = [];
          }
          dictionaryByPos[pos].push(entry);
        });

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
          dictionary: dictionaryEntries.length > 0 ? {
            entries: dictionaryEntries,
            groupedByPos: dictionaryByPos,
            needsDisambiguation: dictionaryEntries.length > 1, // Multiple meanings found
          } : undefined,
          count: transformed.length,
          hasMore: hasMoreResults || transformed.length >= limit, // Indicate if there might be more results
          totalEstimatedCount: totalEstimatedCount, // Estimated total from word_frequencies
          ms: Date.now() - startedAt,
          cached: false,
        });
      }



      // If no results found, check video transcripts and return them
      console.log(`🔄 No Bible results found for query: "${convertedQuery}"`);
      
      // Group dictionary entries by POS for disambiguation display
      const dictionaryByPosForVideo: Record<string, any[]> = {};
      dictionaryEntries.forEach((entry: any) => {
        const pos = entry.pos || 'unknown';
        if (!dictionaryByPosForVideo[pos]) {
          dictionaryByPosForVideo[pos] = [];
        }
        dictionaryByPosForVideo[pos].push(entry);
      });
      
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

        // Group dictionary entries by POS for disambiguation display
        const dictionaryByPosForVideo: Record<string, any[]> = {};
        dictionaryEntries.forEach((entry: any) => {
          const pos = entry.pos || 'unknown';
          if (!dictionaryByPosForVideo[pos]) {
            dictionaryByPosForVideo[pos] = [];
          }
          dictionaryByPosForVideo[pos].push(entry);
        });

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
          dictionary: dictionaryEntries.length > 0 ? {
            entries: dictionaryEntries,
            groupedByPos: dictionaryByPosForVideo,
            needsDisambiguation: dictionaryEntries.length > 1,
          } : undefined,
          count: transformed.length,
          ms: Date.now() - startedAt,
          cached: false,
        });
      }
      
      // No results found (neither Bible nor video) - return empty results with dictionary if available
      const dictionaryByPosFinal: Record<string, any[]> = {};
      dictionaryEntries.forEach((entry: any) => {
        const pos = entry.pos || 'unknown';
        if (!dictionaryByPosFinal[pos]) {
          dictionaryByPosFinal[pos] = [];
        }
        dictionaryByPosFinal[pos].push(entry);
      });
      
      return NextResponse.json({
        results: [],
        relatedForms: null,
        processed: {
          original: originalQuery,
          normalized: convertedQuery,
          variants: searchTerms,
          searchType: 'no_results',
          language: searchLanguage,
          romanization: romanizedDictionaryMatch?.romanized,
          root: romanizedDictionaryMatch?.pashto,
        },
        dictionary: dictionaryEntries.length > 0 ? {
          entries: dictionaryEntries,
          groupedByPos: dictionaryByPosFinal,
          needsDisambiguation: dictionaryEntries.length > 1,
        } : undefined,
        count: 0,
        ms: Date.now() - startedAt,
        cached: false,
      });
    } catch (error) {
      // Error handler - originalQuery is accessible from function scope
      console.error('Search API error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      const errorStack = error instanceof Error ? error.stack : undefined;
      
      // originalQuery is declared at function scope (line 460) and is always accessible here
      const errorQuery: string = originalQuery;
      
      // Log detailed error information for debugging
      console.error('Search error details:', {
        query: errorQuery,
        error: errorMessage,
        stack: errorStack,
        timestamp: new Date().toISOString(),
      });
      
      // Return more informative error response
      return NextResponse.json(
        { 
          error: 'Search failed', 
          details: errorMessage,
          query: errorQuery,
          // Don't expose stack trace in production
          ...(process.env.NODE_ENV === 'development' && { stack: errorStack })
        },
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

    const response: any = {
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
    };

    // Add debug info if requested
    if (req.nextUrl.searchParams.get('debug') === 'true') {
      response.debug = debugInfo;
    }

    return NextResponse.json(response);
  }

// Helper function to check scope
function matchesScope(verse: any, scope: Scope): boolean {
  if (scope === 'all') return true;
  const testament = verse.testament?.toLowerCase();
  return testament === scope;
}
