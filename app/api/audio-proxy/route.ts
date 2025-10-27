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
    // Construct the Google Drive URL
    const driveUrl = `https://drive.google.com/uc?id=${fileId}&export=${export_type}`;

    // Fetch the file from Google Drive
    const response = await fetch(driveUrl);

    if (!response.ok) {
      return NextResponse.json(
        { error: `Google Drive returned ${response.status}` },
        { status: response.status }
      );
    }

    // Get the audio blob
    const audioBlob = await response.blob();

    // Return with proper CORS and audio headers
    return new NextResponse(audioBlob, {
      status: 200,
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': audioBlob.size.toString(),
        'Cache-Control': 'public, max-age=31536000', // Cache for 1 year
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
        'Accept-Ranges': 'bytes',
      },
    });
  } catch (error) {
    console.error('Audio proxy error:', error);
    return NextResponse.json(
      { error: 'Failed to proxy audio file' },
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
