import { NextRequest, NextResponse } from 'next/server';

import { directContains, fuzzySearch, multiTermSearch, Scope } from '@/app/lib/search';
import { normalizeQuery, containsPashto } from '@/app/lib/normalize';
import { collectRelatedForms } from '@/app/lib/variants';

export const runtime = 'nodejs';

type SearchRequest = {
  query: string;
  scope?: Scope;
  includeRelated?: boolean;
  variants?: string[];
  enableFuzzy?: boolean;
  limit?: number;
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
      const variantHits = await multiTermSearch(variants, scope, limit);
      const transformed = transformResults(variantHits);
      const processed = {
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
    const normalized = isPashtoQuery ? { normalized: trimmedQuery, usedDictionary: false } : await normalizeQuery(trimmedQuery);
    const searchTerm = normalized.normalized || trimmedQuery;

    const effectiveLimit = Math.max(10, Math.min(limit, 200));

    let results = await directContains(searchTerm, scope, effectiveLimit);
    let searchType: 'fast' | 'fuzzy' | 'enhanced' = 'fast';

    if (!results.length && searchTerm !== trimmedQuery) {
      results = await directContains(trimmedQuery, scope, effectiveLimit);
    }

    const shouldFuzzy = enableFuzzy ?? !isPashtoQuery;
    if (!results.length && shouldFuzzy) {
      results = await fuzzySearch(searchTerm, scope, Math.min(50, effectiveLimit));
      if (results.length) searchType = 'fuzzy';
    }

    let relatedForms: any = null;
    let variantForms: string[] = [];

    if (includeRelated) {
      const relatedStarted = Date.now();
      const relatedPayload = await collectRelatedForms(searchTerm, { includeRelated: true });
      variantForms = relatedPayload.variantsFlat;
      relatedForms = {
        root: relatedPayload.root,
        forms: relatedPayload.forms,
        total: relatedPayload.total,
        variantDetails: relatedPayload.variantDetails,
        ms: Date.now() - relatedStarted,
      };

      if (!results.length && variantForms.length) {
        const variantHits = await multiTermSearch(variantForms.slice(0, 25), scope, effectiveLimit);
        if (variantHits.length) {
          results = variantHits;
          searchType = 'enhanced';
        }
      }
    }

    const transformed = transformResults(results);

    const processed = {
      original: trimmedQuery,
      normalized: searchTerm,
      variants: includeRelated ? variantForms.slice(0, 40) : [],
      searchType,
      romanization: normalized.usedDictionary ? normalized.romanization : undefined,
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
