import { NextRequest, NextResponse } from 'next/server';

const DEFAULT_BACKEND_BASE_URL = 'http://localhost:8000';

function getBackendUrl(path: string): string {
  const base = process.env.BACKEND_BASE_URL || DEFAULT_BACKEND_BASE_URL;
  const normalizedBase = base.endsWith('/') ? base.slice(0, -1) : base;
  return `${normalizedBase}${path}`;
}

export async function POST(request: NextRequest) {
  try {
    const { youtubeUrl, selectedSegments, driveFileId, videoId } = await request.json();

    if (!selectedSegments || !Array.isArray(selectedSegments) || selectedSegments.length === 0) {
      return NextResponse.json({ error: 'Selected segments are required' }, { status: 400 });
    }

    const payload: Record<string, unknown> = {
      selectedSegments,
      driveFileId,
      videoId,
    };

    if (youtubeUrl) {
      payload.youtubeUrl = youtubeUrl;
    }

    const backendResponse = await fetch(getBackendUrl('/videos/segments'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const result = await backendResponse.json().catch(() => ({}));

    if (!backendResponse.ok || !result?.success) {
      const message =
        typeof result?.detail === 'string'
          ? result.detail
          : typeof result?.error === 'string'
            ? result.error
            : 'Failed to extract audio segments';
      return NextResponse.json({ error: message }, { status: backendResponse.status || 500 });
    }

    const segments = Array.isArray(result.segments) ? result.segments : [];

    return NextResponse.json({
      success: true,
      videoId: result.videoId ?? videoId ?? null,
      totalSegments: result.totalSegments ?? segments.length,
      extractedSegments: segments.map((segment: Record<string, unknown>) => ({
        segmentIndex: segment.segmentIndex ?? 0,
        start: segment.start ?? 0,
        end: segment.end ?? 0,
        duration: segment.duration ?? 0,
        size: segment.size ?? 0,
        audioBase64: typeof segment.audioBase64 === 'string' ? segment.audioBase64 : null,
        driveFileId: segment.driveFileId ?? null,
        driveUrl: segment.driveUrl ?? null,
      })),
    });
  } catch (error) {
    console.error('Segment extraction proxy error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
