import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/utils/supabase';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query = '', limit = 100 } = body;

    console.log(`🔍 Lexicon search for: "${query}" (limit: ${limit})`);

    // If no query, return top frequent words
    if (!query || query.trim().length === 0) {
      const { data, error } = await supabase
        .from('dictionary')
        .select('pashto, romanized, pos, english, frequency')
        .order('frequency', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Lexicon fetch error:', error);
        return NextResponse.json(
          { error: 'Failed to fetch lexicon', details: error.message },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        results: data || [],
        metadata: {
          query: '',
          total: data?.length || 0,
          limit,
          source: 'dictionary-frequency'
        }
      });
    }

    // Search by romanization (primary)
    const searchTerm = `%${query.trim()}%`;
    
    const { data: romanMatches, error: romanError } = await supabase
      .from('dictionary')
      .select('pashto, romanized, pos, english, frequency')
      .ilike('romanized', searchTerm)
      .order('frequency', { ascending: false })
      .limit(limit);

    if (romanError) {
      console.error('Lexicon romanization search error:', romanError);
      return NextResponse.json(
        { error: 'Lexicon search failed', details: romanError.message },
        { status: 500 }
      );
    }

    let results = romanMatches || [];

    // If no romanization matches, try Pashto search
    if (results.length === 0) {
      const { data: pashtoMatches, error: pashtoError } = await supabase
        .from('dictionary')
        .select('pashto, romanized, pos, english, frequency')
        .ilike('pashto', searchTerm)
        .order('frequency', { ascending: false })
        .limit(limit);

      if (pashtoError) {
        console.error('Lexicon Pashto search error:', pashtoError);
      } else {
        results = pashtoMatches || [];
      }
    }

    // Try English search if still no results
    if (results.length === 0) {
      const { data: englishMatches, error: englishError } = await supabase
        .from('dictionary')
        .select('pashto, romanized, pos, english, frequency')
        .ilike('english', searchTerm)
        .order('frequency', { ascending: false })
        .limit(limit);

      if (englishError) {
        console.error('Lexicon English search error:', englishError);
      } else {
        results = englishMatches || [];
      }
    }

    console.log(`✅ Lexicon search found ${results.length} matches`);

    return NextResponse.json({
      success: true,
      results,
      metadata: {
        query: query.trim(),
        total: results.length,
        limit,
        source: 'dictionary'
      }
    });

  } catch (error) {
    console.error('Lexicon search error:', error);
    return NextResponse.json(
      { error: 'Search failed', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
