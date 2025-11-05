import { NextRequest, NextResponse } from 'next/server';
import { getD1ClientOrThrow } from '@/utils/d1-helpers';

export async function GET(request: NextRequest) {
  try {
    let db;
    try {
      db = getD1ClientOrThrow();
    } catch (error) {
      return NextResponse.json({
        status: 'ERROR',
        error: error instanceof Error ? error.message : String(error),
        timestamp: new Date().toISOString(),
      }, { status: 500 });
    }

    // Get a sample of verses to see the structure
    const verses = await db.query<any>(
      `SELECT * FROM verses_afghan2023 LIMIT 5`
    );

    // Also get total count
    const countData = await db.query<{ count: number }>(
      `SELECT COUNT(*) as count FROM verses_afghan2023`
    );
    const count = countData && countData.length > 0 ? countData[0].count : 0;

    // Check for any columns that might indicate translation
    const sampleVerse = verses && verses.length > 0 ? verses[0] : null;
    const columns = sampleVerse ? Object.keys(sampleVerse) : [];

    return NextResponse.json({
      status: 'OK',
      totalVersesCount: count,
      sampleVerses: verses || [],
      availableColumns: columns,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    return NextResponse.json({
      status: 'ERROR',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
