import { NextRequest, NextResponse } from 'next/server';
import { getData } from '@/app/lib/data/load';

export async function GET(request: NextRequest) {
  try {
    const data = await getData();

    // Test search
    const testResults = [];
    const searchTerm = 'خدای';

    if (data.searchIndex?.byTextLower) {
      const matches = data.searchIndex.byTextLower.get(searchTerm.toLowerCase()) || [];
      testResults.push(`Found ${matches.length} matches for "${searchTerm}" in search index`);
    } else {
      testResults.push('Search index not available');
    }

    // Test direct search
    let directCount = 0;
    for (const verse of data.verses.slice(0, 100)) {
      if (verse.text && verse.text.includes(searchTerm)) {
        directCount++;
      }
    }
    testResults.push(`Found ${directCount} matches for "${searchTerm}" in direct search (first 100 verses)`);

    return NextResponse.json({
      status: 'OK',
      searchIndexExists: !!data.searchIndex,
      versesCount: data.verses.length,
      testResults,
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

