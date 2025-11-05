import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json();
    
    if (!query || typeof query !== 'string' || !query.trim()) {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 });
    }

    const searchTerm = query.trim();
    
    // Query Supabase dictionary for all entries matching this word
    const supabase = await import('@supabase/supabase-js').then(m => m.createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    ));

    // Try exact match first
    const { data: exactMatches, error: exactError } = await supabase
      .from('dictionary')
      .select('pashto, romanized, pos, english')
      .eq('pashto', searchTerm)
      .limit(20);

    if (exactError) {
      console.warn('Dictionary lookup error:', exactError);
    }

    // Also try normalized variants
    const normalized = searchTerm.replace(/ي/g, 'ی').replace(/ى/g, 'ی');
    let normalizedMatches: any[] = [];
    
    if (normalized !== searchTerm) {
      const { data: normData } = await supabase
        .from('dictionary')
        .select('pashto, romanized, pos, english')
        .eq('pashto', normalized)
        .limit(20);
      
      if (normData) {
        normalizedMatches = normData;
      }
    }

    // Combine and deduplicate results
    const allMatches = new Map<string, any>();
    
    (exactMatches || []).forEach((entry: any) => {
      const key = `${entry.pashto}|${entry.pos || ''}`;
      if (!allMatches.has(key)) {
        allMatches.set(key, entry);
      }
    });
    
    normalizedMatches.forEach((entry: any) => {
      const key = `${entry.pashto}|${entry.pos || ''}`;
      if (!allMatches.has(key)) {
        allMatches.set(key, entry);
      }
    });

    const results = Array.from(allMatches.values());

    // Group by POS for disambiguation
    const groupedByPos: Record<string, any[]> = {};
    results.forEach((entry: any) => {
      const pos = entry.pos || 'unknown';
      if (!groupedByPos[pos]) {
        groupedByPos[pos] = [];
      }
      groupedByPos[pos].push(entry);
    });

    return NextResponse.json({
      query: searchTerm,
      results,
      groupedByPos,
      count: results.length,
    });
  } catch (error) {
    console.error('Dictionary lookup error:', error);
    return NextResponse.json(
      { error: 'Dictionary lookup failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}




