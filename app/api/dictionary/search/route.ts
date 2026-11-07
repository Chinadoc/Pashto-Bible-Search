import { NextRequest, NextResponse } from 'next/server';

interface DictionaryEntry {
  ts: number;
  i: number;
  p: string;  // Pashto
  f: string;  // Phonetics/Romanization
  g: string;  // Gender
  e: string;  // English
  c?: string; // Category/POS
  infap?: string;
  infaf?: string;
  infbp?: string;
  infbf?: string;
  app?: string;
  apf?: string;
  ppp?: string;
  ppf?: string;
}

let dictionaryCache: DictionaryEntry[] | null = null;

async function loadDictionary(): Promise<DictionaryEntry[]> {
  if (dictionaryCache) return dictionaryCache;

  try {
    // Fetch from LingDocs
    const response = await fetch(
      'https://raw.githubusercontent.com/lingdocs/pashto-dictionary/main/dictionary/dictionary.json',
      { next: { revalidate: 86400 } } // Cache for 24 hours
    );

    if (response.ok) {
      const data = await response.json();
      dictionaryCache = data;
      return data;
    }
  } catch (error) {
    console.error('Error loading dictionary:', error);
  }

  return [];
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q') || '';
  const limit = parseInt(searchParams.get('limit') || '20');
  const pos = searchParams.get('pos') || '';

  if (!query || query.length < 2) {
    return NextResponse.json({ entries: [] });
  }

  try {
    const dictionary = await loadDictionary();
    const queryLower = query.toLowerCase();
    const isRomanized = /^[a-zA-Z]/.test(query);

    let results = dictionary.filter((entry) => {
      // POS filter
      if (pos && entry.c && !entry.c.toLowerCase().includes(pos.toLowerCase())) {
        return false;
      }

      // Search in Pashto
      if (entry.p && entry.p.includes(query)) return true;

      // Search in romanization
      if (isRomanized && entry.f && entry.f.toLowerCase().includes(queryLower)) return true;

      // Search in English
      if (entry.e && entry.e.toLowerCase().includes(queryLower)) return true;

      return false;
    });

    // Sort by relevance
    results.sort((a, b) => {
      // Exact Pashto match first
      if (a.p === query && b.p !== query) return -1;
      if (b.p === query && a.p !== query) return 1;

      // Starts with query
      if (a.p?.startsWith(query) && !b.p?.startsWith(query)) return -1;
      if (b.p?.startsWith(query) && !a.p?.startsWith(query)) return 1;

      // For romanized searches
      if (isRomanized) {
        const aMatch = a.f?.toLowerCase().startsWith(queryLower);
        const bMatch = b.f?.toLowerCase().startsWith(queryLower);
        if (aMatch && !bMatch) return -1;
        if (bMatch && !aMatch) return 1;
      }

      return 0;
    });

    // Map to our format
    const entries = results.slice(0, limit).map((entry) => ({
      id: entry.ts?.toString() || entry.i?.toString() || entry.p,
      pashto: entry.p || '',
      romanization: entry.f || '',
      english: entry.e || '',
      pos: entry.c || '',
      gender: entry.g || '',
      lingdocs_id: entry.ts?.toString(),
    }));

    return NextResponse.json({ entries, total: results.length });
  } catch (error) {
    console.error('Dictionary search error:', error);
    return NextResponse.json({ entries: [], error: 'Search failed' }, { status: 500 });
  }
}

