import { NextRequest, NextResponse } from 'next/server';
import Fuse from 'fuse.js';

import { getData } from '@/app/lib/data/load';
import { generateNounVariants } from '@/app/utils/noun_variants';
import { generateVerbVariants as generateVerbVariantsUtil } from '@/app/utils/verb_variants';

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
  searchType: 'fast' | 'fuzzy' | 'enhanced';
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

function transformResults(results: Array<{ ref: string; text: string; testament?: string; book: string }>): ApiResult[] {
  return results.map((result, index) => {
    const book = result.book;
    const usesYousafzai = YOUSAFZAI_BOOKS.has(book);
    return {
      ref: result.ref,
      text: result.text,
      testament: result.testament ?? 'NT',
      translation: usesYousafzai ? 'Yousafzai 2019' : null,
      dialect: usesYousafzai ? 'Yousafzai' : null,
      tags: [],
      audio_verse_url: null,
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

    if (!query || typeof query !== 'string' || !query.trim()) {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 });
    }

    const trimmedQuery = query.trim();

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
      const transformed = transformResults(results);
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

    if (isLatin) {
      const { dictionaryByRomanized } = await getData();
      const pick = dictionaryByRomanized.get(trimmedQuery.toLowerCase())?.[0];
      if (pick?.pashto) {
        normalized = pick.pashto;
        romanization = pick.romanized;
      }
    }

    const effectiveLimit = Math.max(10, Math.min(limit, 200));

    // Search using local data
    const data = await getData();
    const { searchIndex, verses } = data;
    let results: Array<{ ref: string; text: string; testament?: string; book: string }> = [];
    let searchType: 'fast' | 'fuzzy' | 'enhanced' = 'fast';

    console.log('Search debug:', {
      searchIndexExists: !!searchIndex,
      versesCount: verses.length,
      searchTerm: normalized
    });

    // Fast search using index
    if (searchIndex?.byTextLower) {
      const candidateVerses = new Set<any>();

      // Check original text index
      const originalMatches = searchIndex.byTextLower.get(normalized.toLowerCase()) || [];
      console.log('Original matches found:', originalMatches.length);
      for (const verse of originalMatches) {
        if (matchesScope(verse, scope)) {
          candidateVerses.add(verse);
        }
      }

      // Check normalized text index
      const normalizedMatches = searchIndex.byTextNormalizedLower.get(normalized.toLowerCase()) || [];
      console.log('Normalized matches found:', normalizedMatches.length);
      for (const verse of normalizedMatches) {
        if (matchesScope(verse, scope)) {
          candidateVerses.add(verse);
        }
      }

      results = Array.from(candidateVerses).slice(0, effectiveLimit);
      console.log('Total results found:', results.length);
    }

    // Fallback to fuzzy search if no results and enabled
    const shouldFuzzy = enableFuzzy ?? !isPashtoQuery;
    if (!results.length && shouldFuzzy) {
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

    let relatedForms: any = null;
    let variantForms: string[] = [];

    // Generate variants locally if requested
    if (includeRelated) {
      const { frequencyMap, dictionaryByPashto } = await getData();
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

      // Generate variants based on POS
      const groups: { nouns?: Variant[]; verbs?: Variant[]; other?: Variant[] } = {};

      if (posGuess === "noun") {
        groups.nouns = await generateNounVariants(normalized, { cap: 30 });
      } else if (posGuess === "verb") {
        groups.verbs = await generateVerbVariantsUtil(normalized, { cap: 30, includeCompound: true });
      } else {
        // Try both for ambiguous terms
        const [nouns, verbs] = await Promise.all([
          generateNounVariants(normalized, { cap: 20 }),
          generateVerbVariantsUtil(normalized, { cap: 20, includeCompound: true }),
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
        ms: Date.now() - relatedStarted,
      };

      // If no direct results but we have variants, try searching with variants
      if (!results.length && variantForms.length) {
        const candidateVerses = new Set<any>();

        for (const variant of variantForms.slice(0, 25)) {
          const lower = variant.toLowerCase();

          const originalMatches = searchIndex.byTextLower.get(lower) || [];
          for (const verse of originalMatches) {
            if (matchesScope(verse, scope)) {
              candidateVerses.add(verse);
            }
          }

          const normalizedMatches = searchIndex.byTextNormalizedLower.get(lower) || [];
          for (const verse of normalizedMatches) {
            if (matchesScope(verse, scope)) {
              candidateVerses.add(verse);
            }
          }
        }

        if (candidateVerses.size > 0) {
          results = Array.from(candidateVerses).slice(0, effectiveLimit);
          searchType = 'enhanced';
        }
      }
    }

    const transformed = transformResults(results);

    const processed: Processed = {
      original: trimmedQuery,
      normalized,
      variants: includeRelated ? variantForms.slice(0, 40) : [],
      searchType,
      pos: posGuess,
      romanization,
    };

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
