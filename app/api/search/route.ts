import { NextRequest, NextResponse } from 'next/server';
import { supabase, TABLES } from '../../../utils/supabase';

interface SearchRequest {
  query: string;
  scope: 'all' | 'ot' | 'nt';
}

interface Verse {
  ref: string;
  text: string;
}

interface Coverage {
  book: string;
  count: number;
}

export async function POST(request: NextRequest) {
  try {
    const { query, scope }: SearchRequest = await request.json();

    if (!query?.trim()) {
      return NextResponse.json({
        results: [],
        coverage: [],
      });
    }

    const trimmedQuery = query.trim();
    let allResults: Verse[] = [];

    // Basic romanized → Pashto mapping fallback (works even if Edge Function not deployed)
    const convertLatinToPashto = (latinInput: string): string => {
      const map: Record<string, string> = {
        'leedul': 'لېدل',
        'kawul': 'کول',
        'kawl': 'کول',
        'kawal': 'کول',
        'khustul': 'خستل',
        'khustl': 'خستل',
        'wakhtul': 'وختل',
        'wakhtl': 'وختل',
        'raztul': 'رازتل',
        'raztl': 'رازتل',
      };
      const key = latinInput.toLowerCase();
      return map[key] || latinInput;
    };

    // Normalize common Yeh variants
    const normalizePashto = (text: string): string =>
      text
        .normalize('NFC')
        .replace(/[يىئ]/g, 'ی')
        .replace(/[\u200E\u200F]/g, '');

    // If input is Latin, convert to Pashto best-effort first
    const hasPashtoChars = /[\u0600-\u06FF]/.test(trimmedQuery);
    const baseQuery = hasPashtoChars ? trimmedQuery : convertLatinToPashto(trimmedQuery);

    // Get Pashto variants using Edge Function (handles romanized input too)
    let variants: string[] = [trimmedQuery];
    try {
      const { data: processorData, error: processorError } = await supabase
        .functions
        .invoke('pashto-processor', { body: { formPs: baseQuery } });

      if (!processorError && processorData?.variants?.length) {
        variants = Array.from(new Set<string>(processorData.variants.map((v: string) => normalizePashto(v.trim())).filter(Boolean)));
      } else {
        variants = [normalizePashto(baseQuery)];
      }
    } catch {
      // Silent fallback if processor unavailable
      variants = [normalizePashto(baseQuery)];
    }

    // Build Supabase query based on scope and variants
    const orFilter = variants
      .map((v) => `text.ilike.%${v.replace(/%/g, '')}%`)
      .join(',');

    let supabaseQuery = supabase
      .from(TABLES.VERSES)
      .select('book, chapter, verse, text, testament')
      .or(orFilter);

    if (scope === 'ot') {
      supabaseQuery = supabaseQuery.eq('testament', 'OT');
    } else if (scope === 'nt') {
      supabaseQuery = supabaseQuery.eq('testament', 'NT');
    }

    const { data, error } = await supabaseQuery.limit(100);

    if (error) {
      console.error('Supabase search error:', error);
      return NextResponse.json({
        results: [],
        coverage: [],
        error: 'Search failed'
      }, { status: 500 });
    }

    // Transform results to expected format
    allResults = (data || []).map((verse: { book: string; chapter: number; verse: number; text: string }) => ({
      ref: `${verse.book} ${verse.chapter}:${verse.verse}`,
      text: verse.text,
    }));

    // Calculate coverage
    const coverageMap = new Map<string, number>();
    allResults.forEach((result) => {
      try {
        if (!result.ref || typeof result.ref !== 'string') {
          console.warn('Skipping result with invalid ref in search route:', result);
          return;
        }

        const parts = result.ref.trim().split(' ');
        if (parts.length === 0) {
          console.warn('Skipping result with empty ref in search route:', result);
          return;
        }

        // Handle multi-word book names like "1 Corinthians"
        const book = parts.length > 1 ? parts.slice(0, -1).join(' ') : parts[0];
        if (book) {
          coverageMap.set(book, (coverageMap.get(book) || 0) + 1);
        }
      } catch (err) {
        console.warn('Error processing result for coverage in search route:', result, err);
      }
    });

    const coverage: Coverage[] = Array.from(coverageMap.entries())
      .map(([book, count]) => ({ book, count }))
      .sort((a, b) => b.count - a.count);

    return NextResponse.json({
      results: allResults,
      coverage,
    });

  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json(
      {
        results: [],
        coverage: [],
        error: 'Internal server error'
      },
      { status: 500 }
    );
  }
}
