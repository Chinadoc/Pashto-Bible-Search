import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const fileId = searchParams.get('id');
  const export_type = searchParams.get('export') || 'download';

  if (!fileId) {
    return NextResponse.json(
      { error: 'Missing file ID' },
      { status: 400 }
    );
  }

  try {
    // Construct the Google Drive URL - use direct download endpoint
    const driveUrl = `https://drive.usercontent.google.com/download?id=${fileId}&export=download&confirm=t&uuid=&at=`;

    // Check for Range header (for audio seeking)
    const rangeHeader = request.headers.get('Range');
    
    const headers: HeadersInit = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      'Accept': 'audio/mpeg, audio/*;q=0.9, */*;q=0.8',
      'Referer': 'https://drive.google.com/',
    };

    // Add Range header if present
    if (rangeHeader) {
      headers['Range'] = rangeHeader;
    }

    // Fetch the file from Google Drive
    const response = await fetch(driveUrl, {
      headers,
    });

    if (!response.ok) {
      console.error(`Google Drive returned ${response.status} for file ${fileId}`);
      return NextResponse.json(
        { error: `Google Drive returned ${response.status}` },
        { status: response.status }
      );
    }

    // Get response headers
    const responseHeaders = new Headers({
      'Content-Type': 'audio/mpeg',
      'Cache-Control': 'public, max-age=86400',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
      'Access-Control-Allow-Headers': 'Range',
      'Accept-Ranges': 'bytes',
    });

    // If partial content, pass through Content-Range and Content-Length
    if (response.status === 206) {
      const contentRange = response.headers.get('Content-Range');
      const contentLength = response.headers.get('Content-Length');
      if (contentRange) responseHeaders.set('Content-Range', contentRange);
      if (contentLength) responseHeaders.set('Content-Length', contentLength);
    } else {
      // For full content, set Content-Length from response
      const contentLength = response.headers.get('Content-Length');
      if (contentLength) responseHeaders.set('Content-Length', contentLength);
    }

    console.log(`✅ Successfully proxied audio file ${fileId}, status: ${response.status}`);

    // Return the response body with streaming
    return new NextResponse(response.body, {
      status: response.status,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error('Audio proxy error:', error);
    return NextResponse.json(
      { error: 'Failed to proxy audio file', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// Handle OPTIONS for CORS preflight
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Range',
      'Access-Control-Max-Age': '86400',
    },
  });
}
