import { NextResponse } from 'next/server';

/**
 * GET /api/audio-clips
 * Returns available audio clips (placeholder for now)
 * This endpoint can be extended to fetch from Cloudflare R2 or database
 */
export async function GET() {
  try {
    // For now, return empty array
    // In the future, this could fetch from Cloudflare R2 or database
    return NextResponse.json({
      success: true,
      clips: [],
      message: 'Audio clips system - coming soon'
    });
  } catch (error) {
    console.error('Error fetching audio clips:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch audio clips' },
      { status: 500 }
    );
  }
}

