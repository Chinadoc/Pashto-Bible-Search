import { NextRequest, NextResponse } from 'next/server';
import { getD1ClientOrThrow } from '@/utils/d1-helpers';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query = '', limit = 100 } = body;

    console.log(`🔍 Lexicon search for: "${query}" (limit: ${limit})`);

    const db = getD1ClientOrThrow();

    // If no query, return most frequent words
    if (!query || query.trim().length === 0) {
      const rows = await db.query<{ pashto_word: string; frequency_total?: number; romanization?: string; pos?: string; english_translation?: string }>(
        `SELECT pashto_word, frequency_total, romanization, pos, english_translation FROM word_frequencies ORDER BY frequency_total DESC LIMIT ?`,
        [limit]
      );

      return NextResponse.json({
        success: true,
        results: (rows || []).map((row) => ({
          pashto: row.pashto_word,
          romanized: row.romanization,
          pos: row.pos,
          english: row.english_translation,
          frequency: row.frequency_total ?? 0,
        })),
        metadata: {
          query: '',
          total: rows?.length || 0,
          limit,
          source: 'word_frequencies',
        },
      });
    }

    const searchTerm = `%${query.trim()}%`;

    const rows = await db.query<{ pashto_word: string; frequency_total?: number; romanization?: string; pos?: string; english_translation?: string }>(
      `SELECT pashto_word, frequency_total, romanization, pos, english_translation FROM word_frequencies
       WHERE pashto_word LIKE ? OR romanization LIKE ? OR english_translation LIKE ?
       ORDER BY frequency_total DESC
       LIMIT ?`,
      [searchTerm, searchTerm, searchTerm, limit]
    );

    const results = (rows || []).map((row) => ({
      pashto: row.pashto_word,
      romanized: row.romanization,
      pos: row.pos,
      english: row.english_translation,
      frequency: row.frequency_total ?? 0,
    }));

    console.log(`✅ Lexicon search found ${results.length} matches`);

    return NextResponse.json({
      success: true,
      results,
      metadata: {
        query: query.trim(),
        total: results.length,
        limit,
        source: 'word_frequencies',
      },
    });
  } catch (error) {
    console.error('Lexicon search error:', error);
    return NextResponse.json(
      { error: 'Search failed', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
