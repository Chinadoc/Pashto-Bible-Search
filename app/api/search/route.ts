import { NextRequest, NextResponse } from 'next/server';
import Fuse from 'fuse.js';

import { getData, getLightweightData, hybridSearch } from '@/app/lib/data/load';
import { generateNounVariants } from '@/app/utils/noun_variants';
import { generateVerbVariants as generateVerbVariantsUtil } from '@/app/utils/verb_variants';
import { refToFilename, audioUrlFromRef } from '@/utils/audio';
import { searchVersesEnhanced, searchVersesFast, getSearchSuggestions } from '@/utils/supabase';

// Helper function to search with multiple terms
async function searchWithMultipleTerms(terms: string[], scope: Scope, strategy: 'auto' | 'trigram' | 'fulltext' | 'hybrid' = 'auto') {
  const allResults = new Map<string, any>();

  for (const term of terms) {
    try {
      const results = await searchVersesEnhanced(term, scope, strategy);
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

    // Generate related forms first if needed (for expanding search)
    let searchTerms = [trimmedQuery];
    let relatedForms = null;

    if (includeRelated) {
      try {
        console.log('🔍 Generating related forms for expanded search:', trimmedQuery);

        // Try to determine if it's a verb or noun and generate appropriate forms
        const { dictionary } = await getData();
        const dictEntry = dictionary.find((entry: any) =>
          entry.pashto === trimmedQuery || entry.romanized?.toLowerCase() === trimmedQuery.toLowerCase()
        );

        let allVariants: any[] = [];

        // Generate verb variants (transitive verbs are most common)
        const verbVariants = await generateVerbVariantsUtil(trimmedQuery, { cap: 40, includeCompound: true });
        if (verbVariants.length > 0) {
          allVariants.push(...verbVariants);
        }

        // Also try noun variants
        const nounVariants = await generateNounVariants(trimmedQuery, { cap: 20 });
        if (nounVariants.length > 0) {
          allVariants.push(...nounVariants);
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
            posGuess: dictEntry?.pos || (verbs.length > nouns.length ? 'verb' : 'noun')
          };
        }
      } catch (error) {
        console.warn('Failed to generate related forms:', error);
      }
    }

    // Try enhanced search first (if SQL functions are available)
    console.log('🔍 Attempting enhanced search for:', trimmedQuery, 'with', searchTerms.length, 'terms');
    try {
      // Use the expanded search terms if we have related forms
      let enhancedResults;
      if (searchTerms.length > 1) {
        // Multiple terms - use our helper function
        enhancedResults = await searchWithMultipleTerms(searchTerms, scope, 'auto');
      } else {
        // Single term - use direct search
        enhancedResults = await searchVersesEnhanced(trimmedQuery, scope, 'auto');
      }

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

        return NextResponse.json({
          results: transformed,
          relatedForms,
          processed: {
            original: trimmedQuery,
            normalized: trimmedQuery,
            variants: searchTerms,
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
      if (includeRelated && relatedForms) {
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



    const transformed = transformResults(results, audioMap);

    // Extract variant forms for the processed object
    let variantForms: string[] = [];
    if (includeRelated && relatedForms) {
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

    const processed: Processed = {
      original: trimmedQuery,
      normalized,
      variants: variantForms.slice(0, 40),
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
