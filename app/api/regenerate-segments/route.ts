import { NextRequest, NextResponse } from 'next/server';

const RAILWAY_PROCESSOR_URL = process.env.RAILWAY_PROCESSOR_URL || 'https://pashto-video-processor-production.up.railway.app';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { videoId, youtubeUrl, segments } = body;

    if (!videoId || !youtubeUrl || !segments || !Array.isArray(segments)) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: videoId, youtubeUrl, segments' },
        { status: 400 }
      );
    }

    // Forward to Railway processor service
    const response = await fetch(`${RAILWAY_PROCESSOR_URL}/regenerate-segments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        videoId,
        youtubeUrl,
        segments,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { success: false, error: result.error || 'Failed to regenerate segments' },
        { status: response.status }
      );
    }

    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error('Error regenerating segments:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

