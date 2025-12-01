import { NextResponse } from 'next/server';

/**
 * GET /api/poems
 * Returns available poems (placeholder for now)
 */
export async function GET() {
  try {
    // For now, return empty array
    // In the future, this could fetch from database
    return NextResponse.json({
      success: true,
      poems: [],
      message: 'Poems system - coming soon'
    });
  } catch (error) {
    console.error('Error fetching poems:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch poems' },
      { status: 500 }
    );
  }
}

