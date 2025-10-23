import { NextRequest, NextResponse } from 'next/server';

/**
 * Audio Proxy Endpoint
 * 
 * Fetches audio from Google Drive and streams it back with proper CORS headers
 * This bypasses the CORS restriction that prevents direct playback
 * 
 * Usage: GET /api/audio/proxy?id=GOOGLE_DRIVE_FILE_ID
 * Or: GET /api/audio/proxy?url=FULL_GOOGLE_DRIVE_URL
 */

async function fetchFromGoogleDrive(fileId: string): Promise<Response> {
  const url = `https://drive.google.com/uc?id=${fileId}&export=download`;
  
  console.log(`🎵 Proxying audio: ${fileId}`);
  
  try {
    // Fetch the audio from Google Drive
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    if (!response.ok) {
      console.error(`❌ Google Drive returned ${response.status}`);
      return NextResponse.json(
        { error: `Failed to fetch audio: ${response.statusText}` },
        { status: response.status }
      );
    }

    // Get the content type and size
    const contentType = response.headers.get('content-type') || 'audio/mpeg';
    const contentLength = response.headers.get('content-length');

    console.log(`✅ Got audio: ${contentType}, ${contentLength} bytes`);

    // Stream the response back with CORS headers
    return new NextResponse(response.body, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Length': contentLength || '',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Range',
        'Access-Control-Expose-Headers': 'Content-Length, Content-Type',
        'Cache-Control': 'public, max-age=86400', // Cache for 24 hours
        'Accept-Ranges': 'bytes',
      }
    });

  } catch (error) {
    console.error('❌ Audio proxy error:', error);
    return NextResponse.json(
      { error: 'Failed to proxy audio' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  
  // Get file ID from query params
  let fileId = searchParams.get('id');
  const fullUrl = searchParams.get('url');

  // If full URL provided, extract file ID
  if (fullUrl && !fileId) {
    const match = fullUrl.match(/id=([a-zA-Z0-9_-]+)/);
    fileId = match?.[1];
  }

  if (!fileId) {
    return NextResponse.json(
      { error: 'Missing audio file ID or URL' },
      { status: 400 }
    );
  }

  return fetchFromGoogleDrive(fileId);
}

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Range',
    }
  });
}
