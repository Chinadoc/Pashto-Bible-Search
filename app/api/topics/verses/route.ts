import { NextRequest, NextResponse } from 'next/server';

const CLOUDFLARE_WORKER_URL =
  process.env.NEXT_PUBLIC_CLOUDFLARE_WORKER_URL ||
  'https://pashtobiblesearch.workers.dev';

/**
 * GET /api/topics/verses?category=CATEGORY_KEY&limit=50
 * Returns verses for a specific category
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryKey = searchParams.get('category');
    const limit = Math.min(100, Math.max(10, parseInt(searchParams.get('limit') || '50')));

    if (!categoryKey) {
      return NextResponse.json(
        { error: 'Category parameter required' },
        { status: 400 }
      );
    }

    // Try Cloudflare Worker first
    try {
      const params = new URLSearchParams({
        category: categoryKey,
        limit: String(limit),
      });
      const response = await fetch(`${CLOUDFLARE_WORKER_URL}/api/topics/verses?${params}`);
      if (response.ok) {
        const data = await response.json();
        return NextResponse.json(data);
      }
    } catch (workerError) {
      console.warn('Cloudflare Worker not available, using fallback:', workerError);
    }

    // Fallback: Return empty array for now (worker endpoints need to be added)
    // TODO: Add topics endpoints to Cloudflare Worker
    return NextResponse.json({
      category: categoryKey,
      verses: [],
      count: 0,
      message: 'Topics endpoints need to be added to Cloudflare Worker',
    });
  } catch (error: any) {
    console.error('Topics verses API error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to load verses' },
      { status: 500 }
    );
  }
}

