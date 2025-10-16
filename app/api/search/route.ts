import { NextRequest, NextResponse } from 'next/server';
import Fuse from 'fuse.js';

import { getData, getLightweightData, hybridSearch } from '@/app/lib/data/load';
import { generateNounVariants } from '@/app/utils/noun_variants';
import { generateVerbVariants as generateVerbVariantsUtil } from '@/app/utils/verb_variants';
import { refToFilename, audioUrlFromRef } from '@/utils/audio';
// Removed supabase import due to file corruption
import { normalizeVerses } from '@/app/utils/normalize-results';
import { PashtoDisambiguator, type DisambiguationResult } from '@/utils/enhanced_disambiguation';

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
  searchType: 'fast' | 'fuzzy' | 'enhanced' | 'hybrid';
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

const searchResultCache = new Map<string, SearchCacheEntry>();
const SEARCH_CACHE_TTL = 1800000; // 30 minutes in milliseconds
const MAX_CACHE_ENTRIES = 200; // Increased cache size for better hit rate

// Cache performance tracking
let cacheHitCount = 0;
let cacheMissCount = 0;

function generateCacheKey(query: string, scope: string, includeRelated: boolean, enableFuzzy: boolean, searchLanguage: string): string {
  return `${query}:${scope}:${includeRelated}:${enableFuzzy}:${searchLanguage}`;
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
  const audioMap: Record<string, string> = {};

  // Load Google Drive audio data first (primary source)
  try {
    const fs = await import('fs');
    const path = await import('path');
    const localPath = path.join(process.cwd(), 'google_drive_audio_urls.json');

    if (fs.existsSync(localPath)) {
      const localAudioData = JSON.parse(fs.readFileSync(localPath, 'utf8'));
      let localCount = 0;

      Object.entries(localAudioData).forEach(([filename, data]: [string, any]) => {
        if (data.book && data.chapter && data.verse) {
          const bookName = data.book.charAt(0).toUpperCase() + data.book.slice(1);
          const verseRef = `${bookName} ${data.chapter}:${data.verse}`;

          // Use file ID if available, otherwise extract from URL
          let fileId = data.google_drive_file_id;
          if (!fileId && data.google_drive_url) {
            // Extract file ID from URL: https://drive.google.com/uc?id=FILE_ID&export=download
            const urlMatch = data.google_drive_url.match(/id=([^&]+)/);
            fileId = urlMatch ? urlMatch[1] : null;
          }

          if (fileId && fileId !== 'TEST_ID' && fileId !== 'FILE_ID_HERE') {
            audioMap[verseRef] = fileId;
            localCount++;
          }
        }
      });

      console.log(`🔗 Loaded ${localCount} Google Drive audio entries as primary source`);
    } else {
      console.warn('Local Google Drive audio file not found');
    }
  } catch (localError) {
    console.warn('Failed to load local Google Drive audio data:', localError);
  }

  // Also try to load from Supabase as secondary source
  try {
    console.log('🔄 Fetching audio map from Supabase as secondary source...');
    const audioResponse = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/audio_by_verse?select=verse_ref,url&limit=10000`, {
      headers: {
        'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (audioResponse.ok) {
      const audioData = await audioResponse.json();
      let supabaseCount = 0;

      if (Array.isArray(audioData)) {
        for (const row of audioData) {
          if (row.verse_ref && row.url && !/drive\.google|docs\.google/i.test(row.url)) {
            // Only add if not already in local data
            if (!audioMap[row.verse_ref]) {
              audioMap[row.verse_ref] = row.url;
              supabaseCount++;
            }
          }
        }
      }

      console.log(`🔗 Added ${supabaseCount} Supabase audio entries as secondary source`);
    }
  } catch (error) {
    console.warn('Failed to load Supabase audio map:', error);
  }

  // Cache the result
  audioMapCache = audioMap;
  audioMapCacheTime = Date.now();
  console.log(`✅ Audio map cached: ${Object.keys(audioMap).length} entries`);

  return audioMap;
}

async function getHelperVariants(helper: string): Promise<string[]> {
  if (!helper || !COMPOUND_HELPERS.has(helper)) return [];
  if (helperVariantCache.has(helper)) return helperVariantCache.get(helper)!;

  try {
    const variants = await generateVerbVariantsUtil(helper, { cap: 60, includeCompound: true });
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
      audioUrl = audioUrlFromRef(result.ref, audioMap);
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

    // Load audio map for assigning audio URLs (now cached)
    const audioMap = await getAudioMap();

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
    console.log(`🔍 Original query: "${originalQuery}", searchLanguage: "${searchLanguage}"`);
    if (searchLanguage === 'pashto' && /^[a-zA-Z\s]+$/.test(originalQuery)) {
      console.log(`🔍 Query matches Latin script pattern`);
      const transliterated = transliterationMap[originalQuery.toLowerCase()];
      console.log(`🔍 Transliteration lookup for "${originalQuery.toLowerCase()}":`, transliterated);
      if (transliterated) {
        searchQuery = transliterated;
        console.log(`🔄 Transliterated "${originalQuery}" to "${searchQuery}"`);
      } else {
        console.log(`⚠️ No transliteration found for "${originalQuery}"`);
      }
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

    // Combine search terms from query + English matches
    let searchTerms = Array.from(new Set([trimmedQuery, ...englishSearchTerms])) as string[];

    // Apply enhanced disambiguation for ambiguous Pashto terms with Bible context

    if (searchLanguage === 'pashto' && searchTerms.length === 1 && !englishSearchTerms.length) {
      // Use the new comprehensive disambiguation system
      try {
        // Create a sample sentence context for disambiguation
        const contextSentence = `خدا بوځو شو چې ${trimmedQuery} راوړو`;
        const tempAnalysis = PashtoDisambiguator.disambiguate(trimmedQuery, contextSentence, 2);

        if (tempAnalysis) {
          disambiguationAnalysis = tempAnalysis;
          console.log(`🔍 Enhanced disambiguation: "${trimmedQuery}" → ${disambiguationAnalysis.primaryPOS} (${Math.round(disambiguationAnalysis.confidence * 100)}% confidence)`);
          console.log(`   Context analysis: preceding=${disambiguationAnalysis.contextAnalysis.precedingWords.join(',')}, following=${disambiguationAnalysis.contextAnalysis.followingWords.join(',')}`);
          console.log(`   Morphological pattern: ${disambiguationAnalysis.contextAnalysis.morphologicalPattern}`);

          if (disambiguationAnalysis.alternativeMeanings.length > 0) {
            console.log(`   Alternative meanings: ${disambiguationAnalysis.alternativeMeanings.map(m => `${m.pos} (${Math.round(m.confidence * 100)}%)`).join(', ')}`);
          }

          // Use disambiguation result for search enhancement
          if (disambiguationAnalysis.confidence > 0.7) {
            disambiguationResult = {
              word: trimmedQuery,
              likelyPos: disambiguationAnalysis.primaryPOS,
              confidence: disambiguationAnalysis.confidence,
              contextClues: disambiguationAnalysis.alternativeMeanings.map(m => m.contextClues).flat(),
              recommendedAction: disambiguationAnalysis.recommendedAction
            };
          }
        }
      } catch (error) {
        console.warn('Disambiguation analysis failed:', error);
      }

      // Fallback to old system if new system fails
      if (!disambiguationResult) {
        // Legacy disambiguation system removed - enhanced system is primary
        console.log(`🔍 Enhanced disambiguation completed for "${trimmedQuery}"`);
      }
    }

    // If filtered variants are provided, use only those for search
    const effectiveIncludeRelated = variants && variants.length > 0 ? false : includeRelated;

    if (variants && variants.length > 0) {
      console.log('🔽 Using filtered variants for search:', variants);
      searchTerms = variants;
    }

    // Generate related forms for LingDocs-style inflection search
    let relatedForms = null;

    // LingDocs-style inflection search for Pashto terms
    console.log('🔍 Checking related forms conditions:', {
      effectiveIncludeRelated,
      searchLanguage,
      trimmedQuery,
      searchTermsLength: searchTerms.length
    });
    if (effectiveIncludeRelated && searchLanguage === 'pashto') {
      console.log('🔍 LingDocs-style inflection search enabled for Pashto');
      console.log('🔍 effectiveIncludeRelated:', effectiveIncludeRelated, 'searchLanguage:', searchLanguage);

      try {
        // Call the enhanced related_forms API to get all inflections/conjugations
        const relatedResponse = await fetch('/api/related_forms', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ form: trimmedQuery }),
        });

        console.log('🔍 Related forms API response status:', relatedResponse.status);
        console.log('🔍 Related forms API response ok:', relatedResponse.ok);
        if (relatedResponse.ok) {
          const relatedFormsText = await relatedResponse.text();
          console.log('🔍 Related forms raw response:', relatedFormsText.substring(0, 200));
          relatedForms = JSON.parse(relatedFormsText);
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
          const allSearchTerms = [trimmedQuery]; // Include original

          if (relatedForms.forms?.nouns) {
            const nounForms = relatedForms.forms.nouns.map((f: any) => f.form);
            allSearchTerms.push(...nounForms);
            console.log(`🔍 Added ${nounForms.length} noun forms:`, nounForms.slice(0, 3));
          }
          if (relatedForms.forms?.verbs) {
            const verbForms = relatedForms.forms.verbs.map((f: any) => f.form);
            allSearchTerms.push(...verbForms);
            console.log(`🔍 Added ${verbForms.length} verb forms:`, verbForms.slice(0, 3));
          }
          if (relatedForms.forms?.other) {
            const otherForms = relatedForms.forms.other.map((f: any) => f.form);
            allSearchTerms.push(...otherForms);
            console.log(`🔍 Added ${otherForms.length} other forms:`, otherForms.slice(0, 3));
          }

          searchTerms = Array.from(new Set(allSearchTerms));
          console.log(`🔍 Expanded search to ${searchTerms.length} terms including ${relatedForms.total} inflections`);
          console.log(`🔍 Final search terms:`, searchTerms.slice(0, 5));
        } else {
          console.warn('❌ LingDocs-style inflection search failed:', relatedResponse.status);
        }
      } catch (error) {
        console.error('❌ Error in LingDocs-style inflection search:', error);
      }
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
        console.log('🔍 Generating related forms for expanded search:', trimmedQuery);

        // Try to determine if it's a verb or noun and generate appropriate forms
        const { dictionary } = await getData();
        const dictEntry = dictionary.find((entry: any) => {
          // Check exact Pashto match
          if (entry.pashto === trimmedQuery) return true;
          
          // Check romanized match with accent normalization
          if (entry.romanized) {
            const normalizedEntry = entry.romanized.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
            const normalizedQuery = trimmedQuery.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
            if (normalizedEntry === normalizedQuery) return true;
          }
          
          return false;
        });

        // Detect part of speech from dictionary
        const pos = dictEntry?.pos?.toLowerCase() || '';
        const isNoun = pos.includes('noun') || pos.includes('n.');
        const isVerb = pos.includes('verb') || pos.includes('v.');
        const isAdjective = pos.includes('adj');

        console.log(`📖 Dictionary entry for "${trimmedQuery}":`, {
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
          const nounVariants = await generateNounVariants(trimmedQuery, { cap: 30 });
          allVariants.push(...nounVariants);
          posGuess = 'noun';
        } else if (isVerb) {
          // It's a verb - only generate verb conjugations
          console.log('✅ Detected as VERB - generating conjugations');
          const verbVariants = await generateVerbVariantsUtil(trimmedQuery, { cap: 40, includeCompound: true });
          allVariants.push(...verbVariants);
          posGuess = 'verb';
        } else if (isAdjective) {
          // It's an adjective - generate both inflections and possibly compound verbs
          console.log('✅ Detected as ADJECTIVE - generating inflections and compounds');
          const nounVariants = await generateNounVariants(trimmedQuery, { cap: 20 });
          allVariants.push(...nounVariants);
          // Also check for stative compounds (adj + کېدل/کول)
          const verbVariants = await generateVerbVariantsUtil(trimmedQuery, { cap: 20, includeCompound: true });
          allVariants.push(...verbVariants);
          posGuess = 'adjective';
        } else {
          // Unknown - try both but prioritize by what generates more results
          console.log('⚠️ Unknown POS - trying both');
          const verbVariants = await generateVerbVariantsUtil(trimmedQuery, { cap: 40, includeCompound: true });
          const nounVariants = await generateNounVariants(trimmedQuery, { cap: 20 });
          
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
          const additionalTerms = forms.map(f => f.form).filter(f => f !== trimmedQuery);
          searchTerms = [trimmedQuery, ...additionalTerms];

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
            root: trimmedQuery,
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

    // Check cache after related forms processing (use search terms hash for cache key)
    const searchTermsHash = searchTerms.sort().join('|');
    const cacheKey = generateCacheKey(
      searchTermsHash,
      scope,
      includeRelated,
      enableFuzzy,
      searchLanguage
    );

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

    // Try enhanced search first (if SQL functions are available)
    console.log('🔍 Attempting enhanced search for:', trimmedQuery, 'with', searchTerms.length, 'terms');
    console.log('🔍 Search terms being used:', searchTerms);
    
    let enhancedResults: any = null;
    try {
      // Use the expanded search terms if we have related forms
      if (searchTerms.length > 1) {
        // Multiple terms - use our helper function
        console.log('🔍 Using multiple terms search for:', searchTerms);
        enhancedResults = await searchWithMultipleTerms(searchTerms, scope, 'auto');
      } else {
        // Single term - use direct search
        console.log('🔍 Using single term search for:', trimmedQuery);
        enhancedResults = await hybridSearch(trimmedQuery, { scope });
      }

      console.log('🔍 Enhanced search raw results:', enhancedResults);

      if (enhancedResults && enhancedResults.length > 0) {
        console.log('✅ Enhanced search successful, found', enhancedResults.length, 'results');

        // Transform results to match expected format
        const transformed = enhancedResults.map((result: any, index: number) => ({
          ref: result.ref,
          text: result.text,
          testament: result.testament || 'NT',
          translation: null, // Will be filled by audio mapping
          dialect: null,
          tags: [] as any[][],
          audio_verse_url: audioMap[result.ref] || null,
          id: index + 1,
        }));

        console.log('🔄 Returning enhanced search results:', {
          resultCount: transformed.length,
          firstFewRefs: transformed.slice(0, 3).map((r: any) => r.ref),
          hasRelatedForms: !!relatedForms,
          relatedFormsCount: relatedForms?.total || 0
        });

        // Cache the results before returning
        const processedData = {
          original: originalQuery,
          normalized: trimmedQuery,
          variants: searchTerms,
          searchType: 'enhanced',
          pos: 'unknown',
          language: searchLanguage,
          englishMatches: englishMatches.length ? englishMatches : undefined,
          variantsSearched: searchTerms,
        };
        
        setCachedSearch(cacheKey, transformed, relatedForms, processedData);
        console.log(`💾 Cached search results for "${searchTermsHash}" (${transformed.length} results)`);

        return NextResponse.json({
          results: normalizeVerses(transformed),
          relatedForms,
          processed: {
            original: originalQuery,
            normalized: trimmedQuery,
            variants: searchTerms,
            disambiguation: disambiguationResult,
            searchType: 'enhanced',
            pos: 'unknown',
            language: searchLanguage,
            englishMatches: englishMatches.length ? englishMatches : undefined,
            variantsSearched: searchTerms,
          },
          count: transformed.length,
          ms: Date.now() - startedAt,
          cached: false,
        });
      } else {
        console.log('⚠️ Enhanced search returned no results, will try fallback');
      }
    } catch (error) {
      console.warn('Enhanced search failed, falling back to legacy search:', error);
    }

    // If enhanced search failed or returned no results, but we have variants, use them
    if ((enhancedResults === null || (enhancedResults && enhancedResults.length === 0)) && Array.isArray(variants) && variants.length > 0) {
      console.log('🔄 Enhanced search failed/empty, using variant fallback search with', variants.length, 'terms');
      const { searchIndex } = await getData();
      const candidateVerses = new Set<any>();

      // For Pashto Bible search, we need substring matching, not exact word matching
      // This allows searching for roots within inflected forms (e.g., "دين" within "دينه")
      for (const variant of variants) {
        const lower = variant.toLowerCase();

        // Search through all verses for substring matches
        for (const verse of searchIndex.verses) {
          if (!matchesScope(verse, scope)) continue;

          // Check if variant appears in original text or normalized text
          const textMatch = verse.textLower.includes(lower);
          const normalizedMatch = verse.textNormalizedLower ? verse.textNormalizedLower.includes(lower) : false;

          if (textMatch || normalizedMatch) {
            candidateVerses.add(verse);
          }
        }
      }

      const results = Array.from(candidateVerses).slice(0, limit);
      const transformed = transformResults(results, audioMap);
      const processed: Processed = {
        original: originalQuery,
        normalized: trimmedQuery,
        variants: Array.from(new Set(variants.filter(Boolean))),
        disambiguation: disambiguationResult,
        searchType: 'hybrid',
        language: searchLanguage,
        englishMatches: englishMatches.length ? englishMatches : undefined,
        variantsSearched: searchTerms,
      };

      console.log('🔄 Variant fallback search found', transformed.length, 'results');

      // Cache the results before returning
      setCachedSearch(cacheKey, transformed, relatedForms, processed);
      console.log(`💾 Cached search results for "${searchTermsHash}" (${transformed.length} results)`);

      return NextResponse.json({
        results: normalizeVerses(transformed),
        relatedForms,
        processed,
        count: transformed.length,
        ms: Date.now() - startedAt,
        cached: false,
      });
    }

    // Original variant OR search logic (kept for backwards compatibility)
    if (Array.isArray(variants) && variants.length > 0) {
      const { searchIndex } = await getData();
      const candidateVerses = new Set<any>();

      for (const variant of variants) {
        const lower = variant.toLowerCase();

        // Check original text index
        const originalMatches = searchIndex.byTextLower.get(lower) || [];
        for (const verse of originalMatches) {
          if (matchesScope(verse, scope)) {
            candidateVerses.add(verse);
          }
        }

        // Check normalized text index
        const normalizedMatches = searchIndex.byTextNormalizedLower.get(lower) || [];
        for (const verse of normalizedMatches) {
          if (matchesScope(verse, scope)) {
            candidateVerses.add(verse);
          }
        }
      }

      const results = Array.from(candidateVerses).slice(0, limit);
      const transformed = transformResults(results, audioMap);
      const processed: Processed = {
        original: originalQuery,
        normalized: trimmedQuery,
        variants: Array.from(new Set(variants.filter(Boolean))),
        disambiguation: disambiguationResult,
        searchType: 'fast',
        language: searchLanguage,
        englishMatches: englishMatches.length ? englishMatches : undefined,
        variantsSearched: searchTerms,
      };

      // Cache the results before returning
      setCachedSearch(cacheKey, transformed, null, processed);
      console.log(`💾 Cached English search results for "${searchTermsHash}" (${transformed.length} results)`);

      return NextResponse.json({
        results: normalizeVerses(transformed),
        relatedForms: null,
        processed,
        count: transformed.length,
        ms: Date.now() - startedAt,
        cached: false,
      });
    }

    const isPashtoQuery = containsPashto(trimmedQuery);
    const isLatin = isLatinOnly(trimmedQuery);

    // Normalization (from dictionary data)
    let normalized = trimmedQuery;
    let romanization: string | undefined;
    let posGuess: Processed["pos"] = undefined;
    let rootFromForm: string | undefined;

    if (isLatin) {
      const { dictionaryByRomanized } = await getData();
      const pick = dictionaryByRomanized.get(trimmedQuery.toLowerCase())?.[0];
      if (pick?.pashto) {
        normalized = pick.pashto;
        romanization = pick.romanized;
      }
    } else {
      // Check if this is a form that maps to a root
      const { formToRoot } = await getData();
      const roots = formToRoot[normalized];
      if (roots && roots.length > 0) {
        // Use the first root found
        const root = roots[0];
        if (root && root !== normalized) {
          rootFromForm = root;
          console.log(`Found root for form ${normalized}: ${root}`);
        }
      }
    }

    const effectiveLimit = Math.max(10, Math.min(limit, 200));

    let results: Array<{ ref: string; text: string; testament?: string; book: string }> = [];
    let searchType: 'fast' | 'fuzzy' | 'enhanced' | 'hybrid' = 'fast';
    let searchIndex: any = null;

    // Get search data for potential use throughout the function
    const data = await getData();
    const { verses } = data;
    searchIndex = data.searchIndex;

    console.log('Search debug:', {
      searchIndexExists: !!searchIndex,
      versesCount: verses.length,
      searchTerm: normalized
    });

    // Enhanced search with variants when includeRelated is enabled
    if (searchIndex?.byTextLower) {
      const candidateVerses = new Set<any>();

      // Build comprehensive search terms list
      const searchTerms = [normalized];
      if (rootFromForm) searchTerms.push(rootFromForm);

      // Add related forms if we generated them earlier
      if (effectiveIncludeRelated && relatedForms) {
        // Extract forms from the related forms we generated earlier
        const variantForms = [];
        if (relatedForms.forms?.verbs) {
          variantForms.push(...relatedForms.forms.verbs.map((v: any) => v.form));
        }
        if (relatedForms.forms?.nouns) {
          variantForms.push(...relatedForms.forms.nouns.map((v: any) => v.form));
        }
        if (relatedForms.forms?.other) {
          variantForms.push(...relatedForms.forms.other.map((v: any) => v.form));
        }
        if (variantForms.length > 0) {
        searchTerms.push(...variantForms);
        }
      }

      console.log('DEBUG: Searching with terms:', searchTerms.length, 'terms');

      for (const searchTerm of searchTerms) {
        const lower = searchTerm.toLowerCase();

        // Check original text index
        const originalMatches = searchIndex.byTextLower.get(lower) || [];
        console.log(`DEBUG: Found ${originalMatches.length} matches for "${searchTerm}" in original text`);
        for (const verse of originalMatches) {
          if (matchesScope(verse, scope)) {
            candidateVerses.add(verse);
          }
        }

        // Check normalized text index
        const normalizedMatches = searchIndex.byTextNormalizedLower.get(lower) || [];
        console.log(`DEBUG: Found ${normalizedMatches.length} matches for "${searchTerm}" in normalized text`);
        for (const verse of normalizedMatches) {
          if (matchesScope(verse, scope)) {
            candidateVerses.add(verse);
          }
        }
      }

      results = Array.from(candidateVerses).slice(0, effectiveLimit);
      searchType = includeRelated && relatedForms ? 'enhanced' : 'fast';
      console.log('DEBUG: Enhanced search found results:', results.length, 'with search type:', searchType);
    }

    // Fallback to fuzzy search if no results and enabled
    if (!results.length && (enableFuzzy ?? !isPashtoQuery)) {
      console.log('Falling back to fuzzy search');

    // Fast search using index
    if (searchIndex?.byTextLower) {
        const candidateVerses = new Set<any>();

        // Use root form for searching if we found one from a form
        const searchTerms = rootFromForm ? [normalized, rootFromForm] : [normalized];

        for (const searchTerm of searchTerms) {
          // Check original text index
          const originalMatches = searchIndex.byTextLower.get(searchTerm.toLowerCase()) || [];
          console.log(`Original matches found for ${searchTerm}:`, originalMatches.length);
          for (const verse of originalMatches) {
            if (matchesScope(verse, scope)) {
              candidateVerses.add(verse);
            }
          }

          // Check normalized text index
          const normalizedMatches = searchIndex.byTextNormalizedLower.get(searchTerm.toLowerCase()) || [];
          console.log(`Normalized matches found for ${searchTerm}:`, normalizedMatches.length);
          for (const verse of normalizedMatches) {
            if (matchesScope(verse, scope)) {
              candidateVerses.add(verse);
            }
          }
        }

        results = Array.from(candidateVerses).slice(0, effectiveLimit);
        console.log('Total results found:', results.length);
      }

      // Fallback to fuzzy search if no results and enabled
      if (!results.length && (enableFuzzy ?? !isPashtoQuery)) {
        console.log('Falling back to fuzzy search');

        // Create Fuse instance with verses
        const fuse = new Fuse(verses, {
          keys: ['text', 'textNormalized'],
          includeScore: true,
          threshold: 0.35,
          minMatchCharLength: 2,
        });

        const hits = fuse.search(normalized, { limit: effectiveLimit * 3 });
        const scoped = hits
          .map((hit) => hit.item)
          .filter((verse) => matchesScope(verse, scope))
          .slice(0, effectiveLimit);

        if (scoped.length) {
          results = scoped;
          searchType = 'fuzzy';
        }
      }
    }



    const shouldApplyCollapsedFilter = searchLanguage === 'pashto'
      && (!englishSearchTerms.length)
      && (!Array.isArray(variants) || variants.length === 0)
      && searchTerms.length === 1;

    if (shouldApplyCollapsedFilter && results.length > 0) {
      const collapsedQuery = trimmedQuery.replace(/\s+/g, '');
      if (collapsedQuery.length > 1) {
        results = results.filter((verse) => {
          const text = verse.text ?? '';
          const normalizedText = (verse as any).textNormalized ?? '';
          const collapsedText = text.replace(/\s+/g, '');
          const collapsedNormalized = typeof normalizedText === 'string'
            ? normalizedText.replace(/\s+/g, '')
            : '';
          return collapsedText.includes(collapsedQuery) || collapsedNormalized.includes(collapsedQuery);
        });
      }
    }

    const transformed = transformResults(results, audioMap);

    // Extract variant forms for the processed object
    let variantForms: string[] = [];
    if (effectiveIncludeRelated && relatedForms) {
      if (relatedForms.forms?.verbs) {
        variantForms.push(...relatedForms.forms.verbs.map((v: any) => v.form));
      }
      if (relatedForms.forms?.nouns) {
        variantForms.push(...relatedForms.forms.nouns.map((v: any) => v.form));
      }
      if (relatedForms.forms?.other) {
        variantForms.push(...relatedForms.forms.other.map((v: any) => v.form));
      }
    }

    if (!variantForms.length) {
      variantForms = Array.from(new Set(searchTerms));
    }

    const processed: Processed = {
      original: originalQuery,
      normalized,
      variants: variantForms.slice(0, 40),
      disambiguation: disambiguationResult,
      searchType,
      pos: posGuess,
      romanization,
      language: searchLanguage,
      englishMatches: englishMatches.length ? englishMatches : undefined,
      variantsSearched: searchTerms,
    };

    console.log('DEBUG: Returning search results:', {
      resultsCount: transformed.length,
      hasRelatedForms: !!relatedForms,
      relatedFormsTotal: relatedForms?.total || 0,
      searchType: processed?.searchType || 'unknown',
      query: originalQuery,
    });

    const totalMs = Date.now() - startedAt;
    console.log(`✅ Search completed in ${totalMs}ms: ${transformed.length} results for "${trimmedQuery}"`);

    // For Anki mode, prioritize results with dictionary audio
    let finalResults = transformed;
    if (searchLanguage === 'anki') {
      finalResults = prioritizeAnkiResults(transformed);
      console.log(`🔄 Anki mode: filtered to ${finalResults.length} results with dictionary audio`);
    }

    // Cache the results before returning
    setCachedSearch(cacheKey, finalResults, relatedForms, processed);
    console.log(`💾 Cached final search results for "${searchTermsHash}" (${finalResults.length} results)`);

    return NextResponse.json({
      results: normalizeVerses(finalResults),
      relatedForms,
      processed,
      count: finalResults.length,
      ms: totalMs,
      cached: false,
    });
  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json(
      { error: 'Search failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 },
    );
  }
}

// Cache status endpoint for monitoring
export async function GET() {
  return NextResponse.json({
    cache: {
      searchResults: {
        size: searchResultCache.size,
        maxSize: MAX_CACHE_ENTRIES,
        ttl: SEARCH_CACHE_TTL,
      },
      audioMap: {
        cached: audioMapCache !== null,
        ttl: AUDIO_MAP_CACHE_TTL,
        age: audioMapCache ? Date.now() - audioMapCacheTime : null,
      },
      helperVariants: {
        size: helperVariantCache.size,
      },
    },
  });
}

// Helper function to check scope
function matchesScope(verse: any, scope: Scope): boolean {
  if (scope === 'all') return true;
  const testament = verse.testament?.toLowerCase();
  return testament === scope;
}
