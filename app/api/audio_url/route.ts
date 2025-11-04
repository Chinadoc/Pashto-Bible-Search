import { NextRequest, NextResponse } from 'next/server';
import { getVerseByRef, resolveAudioUrlFromVerse } from '@/app/lib/cloudflare-d1';

export const runtime = 'nodejs';

/**
 * GET /api/audio_url?ref={verseRef}&translation={translation}
 * Resolve audio URL for a verse reference from Cloudflare D1/R2
 */
export async function GET(request: NextRequest) {
  const ref = request.nextUrl.searchParams.get('ref');
  const translation = (request.nextUrl.searchParams.get('translation') as 'afghan2023' | 'yousafzai2019') || 'afghan2023';
  
  if (!ref) {
    return NextResponse.json({ error: 'Missing ref parameter' }, { status: 400 });
  }

  try {
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
            r2_key: fallbackVerse.audio_r2_key || null,
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

    console.log(`✅ Audio URL resolved from D1/R2 for ${ref}`);
    return NextResponse.json({
      ref,
      url: audioUrl,
      source: 'd1-r2',
      r2_key: verse.audio_r2_key || null,
    });
  } catch (error) {
    console.error('Failed to resolve audio URL:', error);
    return NextResponse.json(
      {
        error: 'Failed to resolve audio URL',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}

/**
 * POST /api/audio_url
 * Batch resolve audio URLs for multiple verse references
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const refs: unknown = body?.refs;
    const translation = (body?.translation as 'afghan2023' | 'yousafzai2019') || 'afghan2023';
    
    if (!Array.isArray(refs) || refs.length === 0) {
      return NextResponse.json({ error: 'Expected refs array with at least one item' }, { status: 400 });
    }

    const stringRefs = refs.map((item) => String(item)).filter(Boolean);
    if (stringRefs.length === 0) {
      return NextResponse.json({ error: 'Refs array contained no usable values' }, { status: 400 });
    }

    console.log(`🔊 Batch resolving ${stringRefs.length} audio URLs from D1/R2`);

    const urls: Record<string, string | null> = {};

    // Process in parallel (limit concurrent requests)
    const batchSize = 10;
    for (let i = 0; i < stringRefs.length; i += batchSize) {
      const batch = stringRefs.slice(i, i + batchSize);
      
      await Promise.all(
        batch.map(async (ref: string) => {
          try {
            const verse = await getVerseByRef(ref, translation);
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

    return NextResponse.json({ urls });
  } catch (error) {
    console.error('Failed to batch resolve audio URLs:', error);
    return NextResponse.json(
      {
        error: 'Failed to resolve audio URLs',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
