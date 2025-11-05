import { NextRequest, NextResponse } from 'next/server';
import { getD1ClientOrThrow } from '@/utils/d1-helpers';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json();

    if (!query || typeof query !== 'string' || !query.trim()) {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 });
    }

    const searchTerm = query.trim();
    const db = getD1ClientOrThrow();

    const exactMatches = await db.query<{
      word: string;
      romanization?: string;
      pos?: string;
      definition?: string;
    }>(
      `SELECT word, romanization, pos, definition FROM dictionary WHERE word = ? LIMIT 20`,
      [searchTerm]
    );

    const normalized = searchTerm.replace(/ي/g, 'ی').replace(/ى/g, 'ی');
    let normalizedMatches: typeof exactMatches = [];

    if (normalized !== searchTerm) {
      normalizedMatches = await db.query<{
        word: string;
        romanization?: string;
        pos?: string;
        definition?: string;
      }>(
        `SELECT word, romanization, pos, definition FROM dictionary WHERE word = ? LIMIT 20`,
        [normalized]
      );
    }

    const allMatches = new Map<string, any>();

    const addEntries = (rows?: typeof exactMatches) => {
      rows?.forEach((entry) => {
        const key = `${entry.word}|${entry.pos || ''}`;
        if (!allMatches.has(key)) {
          allMatches.set(key, {
            pashto: entry.word,
            romanized: entry.romanization,
            pos: entry.pos,
            english: entry.definition,
          });
        }
      });
    };

    addEntries(exactMatches);
    addEntries(normalizedMatches);

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
