import { NextRequest, NextResponse } from 'next/server';

const RAILWAY_PROCESSOR_URL = process.env.RAILWAY_PROCESSOR_URL || 'https://pashto-video-processor-production.up.railway.app';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { videoId, youtubeUrl } = body;

    if (!videoId || !youtubeUrl) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: videoId, youtubeUrl' },
        { status: 400 }
      );
    }

    // Forward to Railway processor service for silence detection
    const response = await fetch(`${RAILWAY_PROCESSOR_URL}/detect-silence`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        videoId,
        youtubeUrl,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { success: false, error: result.error || 'Failed to detect silence' },
        { status: response.status }
      );
    }

    return NextResponse.json({
      success: true,
      segments: result.segments,
    });
  } catch (error) {
    console.error('Error detecting silence:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

