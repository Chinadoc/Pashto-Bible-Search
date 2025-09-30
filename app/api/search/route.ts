import { NextRequest, NextResponse } from 'next/server';
import Fuse from 'fuse.js';

import { getData, getLightweightData, hybridSearch } from '@/app/lib/data/load';
import { generateNounVariants } from '@/app/utils/noun_variants';
import { generateVerbVariants as generateVerbVariantsUtil } from '@/app/utils/verb_variants';
import { refToFilename, audioUrlFromRef } from '@/utils/audio';
import { searchVersesEnhanced, searchVersesFast, getSearchSuggestions } from '@/utils/supabase';

export const runtime = 'nodejs';

type Scope = 'all' | 'ot' | 'nt';

type SearchRequest = {
  query: string;
  scope?: Scope;
  includeRelated?: boolean;
  variants?: string[];
  enableFuzzy?: boolean;
  limit?: number;
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
};

type ApiResult = {
  ref: string;
  text: string;
  testament?: string;
  translation: string | null;
  dialect: string | null;
  tags: string[];
  audio_verse_url: string | null;
  id: number;
};

const YOUSAFZAI_BOOKS = new Set(['Psalms', 'Proverbs', 'Song of Solomon']);

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
      tags: [],
      audio_verse_url: audioUrl,
      id: index + 1,
    };
  });
}

export async function POST(request: NextRequest) {
  const startedAt = Date.now();

  try {
    const body = await request.json() as SearchRequest;
    const { query, includeRelated = false, variants = [], enableFuzzy, limit = 100 } = body;
    const scope = normaliseScope(body.scope);

    // Load audio map for assigning audio URLs
    let audioMap: Record<string, string> = {};
    try {
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
        if (Array.isArray(audioData)) {
          for (const row of audioData) {
            if (row.verse_ref && row.url && !/drive\.google|docs\.google/i.test(row.url)) {
              audioMap[row.verse_ref] = row.url;
            }
          }
        }
      }
    } catch (error) {
      console.warn('Failed to load audio map:', error);
    }

    if (!query || typeof query !== 'string' || !query.trim()) {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 });
    }

    const trimmedQuery = query.trim();

    // Try enhanced search first (if SQL functions are available)
    console.log('🔍 Attempting enhanced search for:', trimmedQuery);
    try {
      const enhancedResults = await searchVersesEnhanced(trimmedQuery, scope, 'auto');
      if (enhancedResults && enhancedResults.length > 0) {
        console.log('✅ Enhanced search successful, found', enhancedResults.length, 'results');

        // Transform results to match expected format
        const transformed = enhancedResults.map((result, index) => ({
          ref: result.ref,
          text: result.text,
          testament: result.testament || 'NT',
          translation: null, // Will be filled by audio mapping
          dialect: null,
          tags: [],
          audio_verse_url: audioMap[result.ref] || null,
          id: index + 1,
        }));

        // Get related forms if needed
        let relatedForms = null;
        if (includeRelated) {
          try {
            const suggestions = await getSearchSuggestions(trimmedQuery, 10, true);
            if (suggestions && suggestions.length > 0) {
              relatedForms = {
                total: suggestions.length,
                forms: suggestions.slice(0, 20) // Limit to prevent large responses
              };
            }
          } catch (error) {
            console.warn('Failed to get related forms:', error);
          }
        }

        return NextResponse.json({
          results: transformed,
          relatedForms,
          processed: {
            original: trimmedQuery,
            normalized: trimmedQuery,
            variants: [trimmedQuery],
            searchType: 'enhanced',
            pos: 'unknown',
          },
          count: transformed.length,
          ms: Date.now() - startedAt,
        });
      }
    } catch (error) {
      console.warn('Enhanced search failed, falling back to legacy search:', error);
    }

    // Handle variant OR searches explicitly
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
        original: trimmedQuery,
        normalized: trimmedQuery,
        variants: Array.from(new Set(variants.filter(Boolean))),
        searchType: 'fast',
      };

      return NextResponse.json({
        results: transformed,
        relatedForms: null,
        processed,
        count: transformed.length,
        ms: Date.now() - startedAt,
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
    let relatedForms: any = null;
    let variantForms: string[] = [];

    // Get search data for potential use throughout the function
    const data = await getData();
    const { verses } = data;
    searchIndex = data.searchIndex;

    console.log('Search debug:', {
      searchIndexExists: !!searchIndex,
      versesCount: verses.length,
      searchTerm: normalized
    });

    // Generate variants first if needed for enhanced search
    if (includeRelated) {
      console.log('DEBUG: Generating related forms for:', normalized);
      try {
        const { frequencyMap, dictionaryByPashto } = await getLightweightData();
        const relatedStarted = Date.now();

        // POS guess from dictionary
        const dictEntry = dictionaryByPashto.get(normalized);
        if (dictEntry?.pos) {
          const posLower = dictEntry.pos.toLowerCase();
          if (posLower.startsWith("verb")) posGuess = "verb";
          else if (posLower.startsWith("noun")) posGuess = "noun";
          else if (posLower.startsWith("adj")) posGuess = "adjective";
          else posGuess = "other";
          romanization = romanization ?? dictEntry.romanized;
        } else {
          // Fallback POS guess based on common patterns
          posGuess = "other";
        }

        const frequency = frequencyMap.get(normalized) ?? undefined;

        // Generate variants based on POS (use root form if available)
        const variantInput = rootFromForm || normalized;
        const groups: { nouns?: Variant[]; verbs?: Variant[]; other?: Variant[] } = {};

        if (posGuess === "noun") {
          groups.nouns = await generateNounVariants(variantInput, { cap: 30 });
        } else if (posGuess === "verb") {
          groups.verbs = await generateVerbVariantsUtil(variantInput, { cap: 30, includeCompound: true });
        } else {
          // Try both for ambiguous terms
          const [nouns, verbs] = await Promise.all([
            generateNounVariants(variantInput, { cap: 20 }),
            generateVerbVariantsUtil(variantInput, { cap: 20, includeCompound: true }),
          ]);
          if (nouns.length) groups.nouns = nouns;
          if (verbs.length) groups.verbs = verbs;
        }

        // Build variant forms
        variantForms = [];
        for (const group of Object.values(groups)) {
          if (group) {
            variantForms.push(...group.map(v => v.form));
          }
        }

        console.log('DEBUG: Generated variant forms:', variantForms.length, 'forms');

        // Build variant details
        const variantDetails = {
          root: normalized,
          forms: groups,
          total: variantForms.length,
        };

        relatedForms = {
          root: normalized,
          forms: groups,
          total: variantForms.length,
          variantDetails,
          verbs: groups.verbs?.map(v => ({ form: v.form, count: v.count || 0 })) || [],
          nouns: groups.nouns?.map(v => ({ form: v.form, count: v.count || 0 })) || [],
          other: groups.other?.map(v => ({ form: v.form, count: v.count || 0 })) || [],
          ms: Date.now() - relatedStarted,
        };

        console.log('DEBUG: Related forms generated:', {
          total: relatedForms.total,
          verbsCount: relatedForms.verbs.length,
          nounsCount: relatedForms.nouns.length,
          otherCount: relatedForms.other.length
        });
      } catch (error) {
        console.warn('Related forms generation failed:', error);
        relatedForms = null;
        variantForms = [];
      }
    }

    // Enhanced search with variants when includeRelated is enabled
    if (searchIndex?.byTextLower) {
      const candidateVerses = new Set<any>();

      // Build comprehensive search terms list
      const searchTerms = [normalized];
      if (rootFromForm) searchTerms.push(rootFromForm);
      if (includeRelated && variantForms.length > 0) {
        searchTerms.push(...variantForms);
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
      searchType = includeRelated && variantForms.length > 0 ? 'enhanced' : 'fast';
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



    const transformed = transformResults(results, audioMap);

    const processed: Processed = {
      original: trimmedQuery,
      normalized,
      variants: includeRelated ? variantForms.slice(0, 40) : [],
      searchType,
      pos: posGuess,
      romanization,
    };

    console.log('DEBUG: Returning search results:', {
      resultsCount: transformed.length,
      hasRelatedForms: !!relatedForms,
      relatedFormsTotal: relatedForms?.total || 0,
      searchType: processed?.searchType || 'unknown',
      query: trimmedQuery,
    });

    return NextResponse.json({
      results: transformed,
      relatedForms,
      processed,
      count: transformed.length,
      ms: Date.now() - startedAt,
    });
  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json(
      { error: 'Search failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 },
    );
  }
}

// Helper function to check scope
function matchesScope(verse: any, scope: Scope): boolean {
  if (scope === 'all') return true;
  const testament = verse.testament?.toLowerCase();
  return testament === scope;
}
