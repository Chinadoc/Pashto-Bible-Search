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

    // Check for Yousafzai verses in D1
    const verses = await db.query<any>(
      `SELECT * FROM verses_yousafzai LIMIT 10`
    );

    // Also check total count
    const countData = await db.query<{ count: number }>(
      `SELECT COUNT(*) as count FROM verses_yousafzai`
    );
    const count = countData && countData.length > 0 ? countData[0].count : 0;

    return NextResponse.json({
      status: 'OK',
      yousafzaiVersesCount: count,
      sampleVerses: verses || [],
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
