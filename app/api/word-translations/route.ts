import { NextRequest, NextResponse } from 'next/server';
import { getD1ClientOrThrow } from '@/utils/d1-helpers';

export const runtime = 'nodejs';

/**
 * Get translations for Pashto words
 */
export async function POST(request: NextRequest) {
  try {
    const { words } = await request.json();

    if (!Array.isArray(words) || words.length === 0) {
      return NextResponse.json({ translations: {} });
    }

    const db = getD1ClientOrThrow();
    const translations: Record<string, string> = {};

    const placeholders = words.map(() => '?').join(',');
    const rows = await db.query<{
      pashto_word: string;
      english_translation?: string | null;
    }>(
      `SELECT pashto_word, english_translation FROM word_frequencies WHERE pashto_word IN (${placeholders})`,
      words
    );

    rows?.forEach((row) => {
      if (row.english_translation) {
        translations[row.pashto_word] = row.english_translation;
      }
    });

    return NextResponse.json({ translations });
  } catch (error) {
    console.error('Word translations API error:', error);
    return NextResponse.json({ translations: {} }, { status: 500 });
  }
}
