/**
 * D1 Audio API Route - Resolve audio URLs from R2 via Cloudflare Worker
 * This replaces Google Drive and Supabase audio URL resolution
 */

import { NextRequest, NextResponse } from 'next/server';
import { getAudioStreamUrl, resolveAudioUrlFromVerse } from '@/app/lib/cloudflare-d1';
import { getVerseByRef } from '@/app/lib/cloudflare-d1';

export const runtime = 'nodejs';

/**
 * GET /api/d1-audio?ref={verseRef}&translation={translation}
 * Resolve audio URL for a verse reference
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const ref = searchParams.get('ref');
    const translation = (searchParams.get('translation') as 'afghan2023' | 'yousafzai2019') || 'afghan2023';

    if (!ref) {
      return NextResponse.json({ error: 'Ref parameter is required' }, { status: 400 });
    }

    console.log(`🔊 Resolving audio URL for ${ref} from D1/R2`);

    // Fetch verse from D1 to get audio_r2_key
    const verse = await getVerseByRef(ref, translation);

    if (!verse) {
      // Try fallback translation
      if (translation === 'afghan2023') {
        const fallbackVerse = await getVerseByRef(ref, 'yousafzai2019');
        if (fallbackVerse) {
          const audioUrl = await resolveAudioUrlFromVerse(fallbackVerse);
          return NextResponse.json({
            ref,
            url: audioUrl,
            translation: 'yousafzai2019',
            source: 'd1-r2',
          });
        }
      }
      return NextResponse.json({ error: 'Verse not found' }, { status: 404 });
    }

    // Resolve audio URL from verse (uses R2 via Cloudflare Worker)
    const audioUrl = await resolveAudioUrlFromVerse(verse);

    if (!audioUrl) {
      return NextResponse.json(
        { error: 'Audio not available for this verse', ref },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ref,
      url: audioUrl,
      translation,
      source: 'd1-r2',
      r2_key: verse.audio_r2_key || null,
    });
  } catch (error) {
    console.error('Error resolving audio URL from D1/R2:', error);
    return NextResponse.json(
      { error: 'Failed to resolve audio URL', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

/**
 * POST /api/d1-audio/batch
 * Batch resolve audio URLs for multiple verse references
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { refs, translation = 'afghan2023' } = body;

    if (!Array.isArray(refs) || refs.length === 0) {
      return NextResponse.json({ error: 'Refs array is required' }, { status: 400 });
    }

    console.log(`🔊 Batch resolving ${refs.length} audio URLs from D1/R2`);

    const urls: Record<string, string | null> = {};

    // Process in parallel (limit concurrent requests)
    const batchSize = 10;
    for (let i = 0; i < refs.length; i += batchSize) {
      const batch = refs.slice(i, i + batchSize);
      
      await Promise.all(
        batch.map(async (ref: string) => {
          try {
            const verse = await getVerseByRef(ref, translation as 'afghan2023' | 'yousafzai2019');
            if (verse) {
              const audioUrl = await resolveAudioUrlFromVerse(verse);
              urls[ref] = audioUrl;
            } else {
              urls[ref] = null;
            }
          } catch (error) {
            console.warn(`Failed to resolve audio for ${ref}:`, error);
            urls[ref] = null;
          }
        })
      );
    }

    return NextResponse.json({ urls, translation });
  } catch (error) {
    console.error('Error batch resolving audio URLs:', error);
    return NextResponse.json(
      { error: 'Failed to batch resolve audio URLs', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}







