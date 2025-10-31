import { NextRequest, NextResponse } from 'next/server';

const CLOUDFLARE_WORKER_URL =
  process.env.NEXT_PUBLIC_CLOUDFLARE_WORKER_URL ||
  'https://pashtobiblesearch.workers.dev';

/**
 * GET /api/topics/categories
 * Returns all word categories with counts
 */
export async function GET(request: NextRequest) {
  try {
    // Try Cloudflare Worker first
    try {
      const response = await fetch(`${CLOUDFLARE_WORKER_URL}/api/topics/categories`);
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
      categories: [],
      message: 'Topics endpoints need to be added to Cloudflare Worker',
    });
  } catch (error: any) {
    console.error('Topics categories API error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to load categories' },
      { status: 500 }
    );
  }
}

