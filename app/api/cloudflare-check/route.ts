import { NextRequest, NextResponse } from 'next/server';
import { getVersesByChapter, getVerseByRef } from '@/app/lib/cloudflare-d1';

export const runtime = 'nodejs';

/**
 * Diagnostic endpoint to check Cloudflare D1/R2 connectivity
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const testRef = searchParams.get('ref') || 'Proverbs 11:10';
  const testBook = searchParams.get('book') || 'Proverbs';
  const testChapter = parseInt(searchParams.get('chapter') || '11', 10);

  const results: any = {
    timestamp: new Date().toISOString(),
    config: {
      cloudflareWorkerUrl: process.env.NEXT_PUBLIC_CLOUDFLARE_WORKER_URL || 'NOT SET',
      baseUrl: process.env.NEXT_PUBLIC_BASE_URL || 'NOT SET',
    },
    tests: {},
  };

  // Test 1: Check if Cloudflare Worker URL is configured
  if (!process.env.NEXT_PUBLIC_CLOUDFLARE_WORKER_URL) {
    results.error = 'NEXT_PUBLIC_CLOUDFLARE_WORKER_URL is not set in environment variables';
    return NextResponse.json(results, { status: 200 });
  }

  // Test 2: Try to fetch a verse by reference
  try {
    const verse = await getVerseByRef(testRef, 'afghan2023');
    results.tests.verseByRef = {
      ref: testRef,
      found: !!verse,
      hasAudioR2Key: verse?.audio_r2_key ? true : false,
      audioR2Key: verse?.audio_r2_key || null,
      audioPublicUrl: verse?.audio_public_url || null,
    };
  } catch (error) {
    results.tests.verseByRef = {
      ref: testRef,
      error: error instanceof Error ? error.message : String(error),
    };
  }

  // Test 3: Try to fetch verses by chapter
  try {
    const verses = await getVersesByChapter(testBook, testChapter, 'afghan2023');
    results.tests.versesByChapter = {
      book: testBook,
      chapter: testChapter,
      count: verses?.length || 0,
      hasVerses: (verses?.length || 0) > 0,
      firstVerseHasAudioR2Key: verses?.[0]?.audio_r2_key ? true : false,
      sampleVerse: verses?.[0] ? {
        ref: `${verses[0].book} ${verses[0].chapter}:${verses[0].verse}`,
        audio_r2_key: verses[0].audio_r2_key || null,
        audio_public_url: verses[0].audio_public_url || null,
      } : null,
    };
  } catch (error) {
    results.tests.versesByChapter = {
      book: testBook,
      chapter: testChapter,
      error: error instanceof Error ? error.message : String(error),
    };
  }

  // Test 4: Try direct fetch to Cloudflare Worker
  try {
    const workerUrl = process.env.NEXT_PUBLIC_CLOUDFLARE_WORKER_URL;
    const testUrl = `${workerUrl}/api/chapter?book=${encodeURIComponent(testBook)}&chapter=${testChapter}&translation=afghan2023`;
    const response = await fetch(testUrl, {
      headers: {
        'User-Agent': 'Pashto-Bible-Search-Diagnostic/1.0',
      },
    });
    
    results.tests.workerDirectFetch = {
      url: testUrl,
      status: response.status,
      ok: response.ok,
      statusText: response.statusText,
    };

    if (response.ok) {
      const data = await response.json();
      results.tests.workerDirectFetch.verseCount = data.verses?.length || 0;
      results.tests.workerDirectFetch.sampleVerse = data.verses?.[0] ? {
        ref: `${data.verses[0].book} ${data.verses[0].chapter}:${data.verses[0].verse}`,
        audio_r2_key: data.verses[0].audio_r2_key || null,
      } : null;
    }
  } catch (error) {
    results.tests.workerDirectFetch = {
      error: error instanceof Error ? error.message : String(error),
    };
  }

  return NextResponse.json(results, { status: 200 });
}







