import { NextRequest, NextResponse } from 'next/server';
import { getD1ClientOrThrow } from '@/utils/d1-helpers';

interface AudioMapping {
  verse_ref: string;
  audio_url: string;
}

/**
 * Batch fetch audio URLs from D1 verses tables
 * Much faster than individual lookups or loading from JSON
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { refs } = body;

    if (!Array.isArray(refs) || refs.length === 0) {
      return NextResponse.json({ error: 'refs array is required' }, { status: 400 });
    }

    const startTime = Date.now();

    let db;
    try {
      db = getD1ClientOrThrow();
    } catch (error) {
      return NextResponse.json({ error: error instanceof Error ? error.message : String(error) }, { status: 500 });
    }

    // Parse verse references and query D1 verses tables
    const audioUrls: Record<string, string> = {};
    
    for (const ref of refs) {
      const match = ref.match(/^(.+?)\s+(\d+):(\d+)$/);
      if (!match) continue;

      const [, book, chapterStr, verseStr] = match;
      const chapter = parseInt(chapterStr, 10);
      const verse = parseInt(verseStr, 10);

      try {
        // Try verses_afghan2023 first
        const verseData = await db.queryFirst<{ audio_public_url?: string; audio_r2_key?: string }>(
          `SELECT audio_public_url, audio_r2_key FROM verses_afghan2023 WHERE book = ? AND chapter = ? AND verse = ? LIMIT 1`,
          [book, chapter, verse]
        );

        if (verseData) {
          const audioUrl = verseData.audio_r2_key 
            ? `https://pashtobiblesearch.workers.dev/api/audio/stream/${encodeURIComponent(verseData.audio_r2_key)}`
            : verseData.audio_public_url;
          
          if (audioUrl) {
            audioUrls[ref] = audioUrl;
          }
        } else {
          // Try verses_yousafzai
          const yousafzaiData = await db.queryFirst<{ audio_public_url?: string; audio_r2_key?: string }>(
            `SELECT audio_public_url, audio_r2_key FROM verses_yousafzai WHERE book = ? AND chapter = ? AND verse = ? LIMIT 1`,
            [book, chapter, verse]
          );

          if (yousafzaiData) {
            const audioUrl = yousafzaiData.audio_r2_key 
              ? `https://pashtobiblesearch.workers.dev/api/audio/stream/${encodeURIComponent(yousafzaiData.audio_r2_key)}`
              : yousafzaiData.audio_public_url;
            
            if (audioUrl) {
              audioUrls[ref] = audioUrl;
            }
          }
        }
      } catch (error) {
        console.warn(`Failed to fetch audio for ${ref}:`, error);
      }
    }

    const queryTime = Date.now() - startTime;
    console.log(`⚡ Fetched ${Object.keys(audioUrls).length}/${refs.length} audio URLs in ${queryTime}ms`);

    return NextResponse.json({
      success: true,
      audioUrls,
      metadata: {
        requested: refs.length,
        found: Object.keys(audioUrls).length,
        queryTimeMs: queryTime,
        source: 'd1-verses'
      }
    });

  } catch (error) {
    console.error('Audio batch fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch audio URLs' },
      { status: 500 }
    );
  }
}
