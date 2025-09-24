import { NextRequest, NextResponse } from 'next/server';
import { searchVerses } from '../../../utils/supabase';

// Server-side search API route
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query, scope, includeRelated } = body;

    if (!query || typeof query !== 'string') {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 });
    }

    // Perform the search on the server side
    const searchResults = await searchVerses(query.trim(), scope || 'all');

    // Transform results to match expected format
    const transformedResults = searchResults.map((result, index) => ({
      ref: result.ref,
      text: result.text,
      testament: 'NT', // Default, could be enhanced later
      translation: 'Yousafzai 2019',
      dialect: 'Yousafzai',
      tags: [],
      audio_verse_url: null,
      id: index + 1
    }));

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
        }
      } catch (error) {
        console.error('Error fetching related forms:', error);
      }
    }

    return NextResponse.json({
      results: transformedResults,
      relatedForms,
      count: transformedResults.length
    });

  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json(
      { error: 'Search failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
