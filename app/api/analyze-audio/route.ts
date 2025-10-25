import { NextRequest, NextResponse } from 'next/server';

const DEFAULT_BACKEND_BASE_URL = 'http://localhost:8000';

function getBackendUrl(path: string): string {
  const base = process.env.BACKEND_BASE_URL || DEFAULT_BACKEND_BASE_URL;
  const normalizedBase = base.endsWith('/') ? base.slice(0, -1) : base;
  return `${normalizedBase}${path}`;
}

export async function POST(request: NextRequest) {
  try {
    const { youtubeUrl } = await request.json();

    if (!youtubeUrl) {
      return NextResponse.json({ error: 'YouTube URL is required' }, { status: 400 });
    }

    const backendResponse = await fetch(getBackendUrl('/videos/analyze'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ youtube_url: youtubeUrl }),
    });

    const result = await backendResponse.json().catch(() => ({}));

    if (!backendResponse.ok || !result?.success) {
      const message =
        typeof result?.detail === 'string'
          ? result.detail
          : typeof result?.error === 'string'
            ? result.error
            : 'Failed to analyze YouTube audio';
      return NextResponse.json({ error: message }, { status: backendResponse.status || 500 });
    }

    return NextResponse.json({
      success: true,
      segments: Array.isArray(result.segments) ? result.segments : [],
      audioInfo: result.audioInfo ?? null,
      videoId: result.videoId ?? null,
      driveFileId: result.driveFileId ?? null,
      driveUrl: result.driveUrl ?? null,
    });
  } catch (error) {
    console.error('Audio analysis proxy error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
