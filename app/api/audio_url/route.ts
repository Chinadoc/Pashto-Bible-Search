import { NextRequest, NextResponse } from 'next/server';

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
    // Get audio URL from D1/R2 via Cloudflare Worker
    const cloudflareWorkerUrl = process.env.NEXT_PUBLIC_CLOUDFLARE_WORKER_URL;
    
    if (!cloudflareWorkerUrl) {
      return NextResponse.json(
        {
          error: 'Cloudflare Worker not configured',
          ref,
        },
        { status: 503 },
      );
    }

    try {
      const d1Response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/d1-audio?ref=${encodeURIComponent(ref)}&translation=${translation}`);
      
      if (d1Response.ok) {
        const d1Data = await d1Response.json();
        if (d1Data.url) {
          console.log(`✅ Audio URL resolved from D1/R2 for ${ref}`);
          return NextResponse.json({
            ref,
            url: d1Data.url,
            source: 'd1-r2',
            r2_key: d1Data.r2_key || null,
          });
        }
      }
      
      // If D1 doesn't have the verse or audio, return not found
      return NextResponse.json(
        {
          error: 'Audio not found',
          ref,
        },
        { status: 404 },
      );
    } catch (d1Error) {
      console.error(`❌ D1 audio resolution failed for ${ref}:`, d1Error);
      return NextResponse.json(
        {
          error: 'Failed to resolve audio URL',
          details: d1Error instanceof Error ? d1Error.message : String(d1Error),
        },
        { status: 500 },
      );
    }
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

    // Use batch endpoint from d1-audio API
    const cloudflareWorkerUrl = process.env.NEXT_PUBLIC_CLOUDFLARE_WORKER_URL;
    if (!cloudflareWorkerUrl) {
      return NextResponse.json({ error: 'Cloudflare Worker not configured' }, { status: 503 });
    }

    try {
      const batchResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/d1-audio`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refs: stringRefs, translation }),
      });

      if (batchResponse.ok) {
        const batchData = await batchResponse.json();
        return NextResponse.json({ urls: batchData.urls || {} });
      }
    } catch (error) {
      console.error('Batch audio resolution failed:', error);
    }

    // Fallback: return null for all if batch fails
    const urls: Record<string, string | null> = {};
    for (const ref of stringRefs) {
      urls[ref] = null;
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
