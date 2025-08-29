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

    // Build Supabase query based on scope
    let supabaseQuery = supabase
      .from(TABLES.VERSES)
      .select('book, chapter, verse, text, testament')
      .ilike('text', `%${trimmedQuery}%`);

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
      const book = result.ref.split(' ')[0];
      coverageMap.set(book, (coverageMap.get(book) || 0) + 1);
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
