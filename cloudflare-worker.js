// Cloudflare Worker CORS Proxy for Google Drive Audio
export default {
  async fetch(request, env, ctx) {
    return handleRequest(request);
  },
};

async function handleRequest(request) {
  // Handle OPTIONS for CORS preflight
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
        'Access-Control-Allow-Headers': 'Range, Content-Type',
        'Access-Control-Max-Age': '86400',
      },
    });
  }

  // Only allow GET requests
  if (request.method !== 'GET') {
    return new Response('Method not allowed', { status: 405 });
  }

  const url = new URL(request.url);
  const fileId = url.searchParams.get('id');
  
  if (!fileId) {
    return new Response('Missing id parameter', { status: 400 });
  }

  // Construct Google Drive URL - try the direct download endpoint first
  const driveUrl = `https://drive.usercontent.google.com/download?id=${fileId}&export=download&confirm=t&uuid=&at=`;

  try {
    // Fetch from Google Drive with proper headers
    const response = await fetch(driveUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'audio/mpeg, audio/*;q=0.9, */*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Referer': 'https://drive.google.com/',
      },
    });

    if (!response.ok) {
      return new Response(`Google Drive returned ${response.status}`, { 
        status: response.status,
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    // Pass through the Range header if present (for audio seeking)
    const rangeHeader = request.headers.get('Range');
    const headers = new Headers({
      'Content-Type': 'audio/mpeg',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
      'Access-Control-Allow-Headers': 'Range',
      'Accept-Ranges': 'bytes',
      'Cache-Control': 'public, max-age=86400',
    });

    // If Range header is present, handle partial content
    if (rangeHeader) {
      const range = rangeHeader.replace('bytes=', '');
      const [start, end] = range.split('-');
      
      // Fetch only the requested range from Google Drive
      const rangeHeaders = new Headers({
        'Range': `bytes=${start}-${end || ''}`,
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'audio/mpeg, audio/*;q=0.9, */*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Referer': 'https://drive.google.com/',
      });
      
      const rangeResponse = await fetch(driveUrl, {
        headers: rangeHeaders,
      });

      if (rangeResponse.status === 206) {
        headers.set('Content-Range', rangeResponse.headers.get('Content-Range') || '');
        headers.set('Content-Length', rangeResponse.headers.get('Content-Length') || '');
        return new Response(rangeResponse.body, {
          status: 206,
          headers: headers,
        });
      }
    }

    // Create new response with CORS headers and stream the body
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: headers,
    });
  } catch (error) {
    return new Response(`Error: ${error.message}`, { 
      status: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
}
