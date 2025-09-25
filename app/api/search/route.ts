import { NextRequest, NextResponse } from 'next/server';
import { searchVerses, supabase } from '../../../utils/supabase';

type SearchRequest = {
  query: string;
  scope?: 'all'|'ot'|'nt';
  includeRelated?: boolean;
  variants?: string[]; // NEW: multiple search terms for OR search
};

// Server-side search API route
export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as SearchRequest;
    const { query, scope, includeRelated, variants } = body;

    if (!query || typeof query !== 'string') {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 });
    }

    // If variants provided, do OR search with multiple terms
    if (Array.isArray(variants) && variants.length > 0) {
      const needles = Array.from(new Set(variants.filter(Boolean))).slice(0, 30); // Max 30 variants
      console.log('DEBUG: Search API received variants:', needles);

      // Perform multi-term search (OR logic)
      let allResults: Array<{ref: string; text: string; testament?: string}> = [];
      for (const term of needles) {
        console.log(`DEBUG: Searching for term: "${term}"`);
        const termResults = await searchVerses(term, scope || 'all');
        console.log(`DEBUG: Found ${termResults.length} results for "${term}"`);
        allResults = [...allResults, ...termResults];
      }

      // Deduplicate results
      const uniqueResults = new Map();
      const duplicates = new Map();
      allResults.forEach((result) => {
        if (uniqueResults.has(result.ref)) {
          // Track duplicates for debugging
          if (!duplicates.has(result.ref)) {
            duplicates.set(result.ref, [uniqueResults.get(result.ref)]);
          }
          duplicates.get(result.ref).push(result);
        } else {
          uniqueResults.set(result.ref, result);
        }
      });

      const deduplicatedResults = Array.from(uniqueResults.values());

      // Log duplicates for debugging
      if (duplicates.size > 0) {
        console.log('Found duplicates:', Array.from(duplicates.entries()).map(([ref, results]) => ({
          ref,
          count: results.length,
          firstText: results[0].text?.substring(0, 50)
        })));
      }

      // Transform results to match expected format
      const transformedResults = deduplicatedResults.map((result, index) => {
        // Determine translation based on book
        const book = result.ref.split(' ')[0];
        const isPsalms = book === 'Psalms';
        const isProverbs = book === 'Proverbs';
        const isSongOfSolomon = book === 'Song of Solomon';

        let translation = null;
        let dialect = null;

        // Show Yousafzai for Psalms, Proverbs, and Song of Solomon
        if (isPsalms || isProverbs || isSongOfSolomon) {
          translation = 'Yousafzai 2019';
          dialect = 'Yousafzai';
        }

        return {
          ref: result.ref,
          text: result.text,
          testament: result.testament || 'NT',
          translation,
          dialect,
          tags: [],
          audio_verse_url: null,
          id: index + 1
        };
      });

      // Create processed data for highlighting
      const processedData = {
        original: query,
        normalized: query,
        variants: needles, // Include all search terms for highlighting
      };

      return NextResponse.json({
        results: transformedResults,
        relatedForms: null, // No related forms for filtered searches
        processed: processedData,
        count: transformedResults.length
      });
    }

    // Single query search (original logic)
    const searchResults = await searchVerses(query.trim(), scope || 'all');
    console.log(`DEBUG: Direct search for "${query.trim()}" returned ${searchResults.length} results`);

    // Additional deduplication to ensure no duplicates even if database returns them
    const uniqueSearchResults = new Map();
    searchResults.forEach((result, index) => {
      if (!uniqueSearchResults.has(result.ref)) {
        uniqueSearchResults.set(result.ref, result);
      }
    });
    const deduplicatedResults = Array.from(uniqueSearchResults.values());

    // Transform results to match expected format
    const transformedResults = deduplicatedResults.map((result, index) => {
      // Determine translation based on book
      const book = result.ref.split(' ')[0];
      const isPsalms = book === 'Psalms';
      const isProverbs = book === 'Proverbs';
      const isSongOfSolomon = book === 'Song of Solomon';

      let translation = null;
      let dialect = null;

      // Show Yousafzai for Psalms, Proverbs, and Song of Solomon
      if (isPsalms || isProverbs || isSongOfSolomon) {
        translation = 'Yousafzai 2019';
        dialect = 'Yousafzai';
      }

      return {
        ref: result.ref,
        text: result.text,
        testament: result.testament || 'NT',
        translation,
        dialect,
        tags: [],
        audio_verse_url: null,
        id: index + 1
      };
    });

    // Get related forms if requested
    let relatedForms = null;
    if (includeRelated && query.trim()) {
      try {
        const relatedResponse = await fetch(`${request.nextUrl.origin}/api/related_forms`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: query.trim() }),
        });

        if (relatedResponse.ok) {
          relatedForms = await relatedResponse.json();
          console.log('DEBUG: Related forms data:', {
            root: relatedForms?.root,
            total: relatedForms?.total,
            variantDetailsCount: relatedForms?.variantDetails?.length || 0,
            sampleVariants: relatedForms?.variantDetails?.[0]?.groups?.[0]?.items?.slice(0, 3) || []
          });
        }
      } catch (error) {
        console.error('Error fetching related forms:', error);
      }
    }

    // Fallback: If no results and we have related forms data with variants, search using variants
    let finalResults = transformedResults;
    if (transformedResults.length === 0 && relatedForms && relatedForms.variantDetails) {
      console.log('DEBUG: No results from direct search, trying variant fallback');

      // Extract variants from related forms data
      const variantForms: string[] = [];
      if (relatedForms.variantDetails) {
        for (const block of relatedForms.variantDetails) {
          for (const group of (block.groups || [])) {
            for (const item of group.items) {
              variantForms.push(item.form);
            }
          }
        }
      }

      if (variantForms.length > 0) {
        const needles = Array.from(new Set(variantForms.filter(Boolean))).slice(0, 20);
        console.log(`DEBUG: Variant fallback searching with ${needles.length} terms:`, needles.slice(0, 5));

        // Perform OR search with variants
        let allVariantResults: Array<{ref: string; text: string; testament?: string}> = [];
        for (const term of needles) {
          const termResults = await searchVerses(term, scope || 'all');
          allVariantResults = [...allVariantResults, ...termResults];
        }

        // Deduplicate results
        const uniqueVariantResults = new Map();
        allVariantResults.forEach((result) => {
          if (!uniqueVariantResults.has(result.ref)) {
            uniqueVariantResults.set(result.ref, result);
          }
        });

        const deduplicatedVariantResults = Array.from(uniqueVariantResults.values());
        console.log(`DEBUG: Variant fallback found ${deduplicatedVariantResults.length} results`);

        if (deduplicatedVariantResults.length > 0) {
          finalResults = deduplicatedVariantResults.map((result, index) => {
            const book = result.ref.split(' ')[0];
            const isPsalms = book === 'Psalms';
            const isProverbs = book === 'Proverbs';
            const isSongOfSolomon = book === 'Song of Solomon';

            let translation = null;
            let dialect = null;

            if (isPsalms || isProverbs || isSongOfSolomon) {
              translation = 'Yousafzai 2019';
              dialect = 'Yousafzai';
            }

            return {
              ref: result.ref,
              text: result.text,
              testament: result.testament || 'NT',
              translation,
              dialect,
              tags: [],
              audio_verse_url: null,
              id: index + 1
            };
          });
        }
      }
    }

    // Create processed data for highlighting
    const processedData = {
      original: query.trim(),
      normalized: query.trim(),
      variants: includeRelated ? [] : [], // Could be populated with variant data if available
    };

    // Fallback: If no results and we have related forms data with variants, search using variants
    if (transformedResults.length === 0 && relatedForms && relatedForms.variantDetails) {
      console.log('DEBUG: No results from direct search, trying variant fallback');
      const variantForms: string[] = [];
      if (relatedForms.variantDetails) {
        for (const block of relatedForms.variantDetails) {
          for (const group of (block.groups || [])) {
            for (const item of group.items) {
              variantForms.push(item.form);
            }
          }
        }
      }
      if (variantForms.length > 0) {
        const needles = Array.from(new Set(variantForms.filter(Boolean))).slice(0, 20);
        console.log(`DEBUG: Variant fallback searching with ${needles.length} terms:`, needles.slice(0, 5));
        let allVariantResults: Array<{ref: string; text: string; testament?: string}> = [];
        for (const term of needles) {
          const termResults = await searchVerses(term, scope || 'all');
          allVariantResults = [...allVariantResults, ...termResults];
        }
        const uniqueVariantResults = new Map();
        allVariantResults.forEach((result) => {
          if (!uniqueVariantResults.has(result.ref)) {
            uniqueVariantResults.set(result.ref, result);
          }
        });
        const deduplicatedVariantResults = Array.from(uniqueVariantResults.values());
        console.log(`DEBUG: Variant fallback found ${deduplicatedVariantResults.length} results`);
        if (deduplicatedVariantResults.length > 0) {
          finalResults = deduplicatedVariantResults.map((result, index) => {
            const book = result.ref.split(' ')[0];
            const isPsalms = book === 'Psalms';
            const isProverbs = book === 'Proverbs';
            const isSongOfSolomon = book === 'Song of Solomon';
            let translation = null;
            let dialect = null;
            if (isPsalms || isProverbs || isSongOfSolomon) {
              translation = 'Yousafzai 2019';
              dialect = 'Yousafzai';
            }
            return {
              ref: result.ref,
              text: result.text,
              testament: result.testament || 'NT',
              translation,
              dialect,
              tags: [],
              audio_verse_url: null,
              id: index + 1
            };
          });
        }
      }
    }

    console.log(`DEBUG: Final search results: ${finalResults.length} (after variant fallback if applicable)`);

    return NextResponse.json({
      results: finalResults,
      relatedForms,
      processed: processedData,
      count: finalResults.length
    });

  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json(
      { error: 'Search failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
