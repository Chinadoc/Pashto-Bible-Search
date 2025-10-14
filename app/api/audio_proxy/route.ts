import { NextRequest, NextResponse } from 'next/server'

/**
 * Proxy Google Drive audio files to avoid CORS issues
 * Usage: GET /api/audio_proxy?fileId=DRIVE_FILE_ID&ref=Ezekiel%207:14
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const fileId = searchParams.get('fileId')
    const ref = searchParams.get('ref')

    if (!fileId) {
      return NextResponse.json({ error: 'Missing fileId parameter' }, { status: 400 })
    }

    // Construct Google Drive download URL
    const driveUrl = `https://drive.google.com/uc?export=download&id=${fileId}`

    console.log(`Proxying audio for ${ref}: ${driveUrl}`)

    // Fetch the audio file from Google Drive
    const response = await fetch(driveUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; PashtoBibleAudioProxy/1.0)',
      },
    })

    if (!response.ok) {
      console.error(`Failed to fetch audio from Google Drive: ${response.status} ${response.statusText}`)
      return NextResponse.json(
        { error: `Failed to fetch audio: ${response.status} ${response.statusText}` },
        { status: response.status }
      )
    }

    // Stream the audio data instead of loading into memory
    const headers = new Headers()
    headers.set('Content-Type', 'audio/mpeg')
    headers.set('Cache-Control', 'public, max-age=3600') // Cache for 1 hour
    headers.set('Accept-Ranges', 'bytes')
    
    // Copy relevant headers from Google Drive response
    if (response.headers.get('content-length')) {
      headers.set('Content-Length', response.headers.get('content-length')!)
    }
    if (response.headers.get('content-range')) {
      headers.set('Content-Range', response.headers.get('content-range')!)
    }

    // Return the audio data as a stream
    return new NextResponse(response.body, {
      status: 200,
      headers,
    })

  } catch (error) {
    console.error('Audio proxy error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}


