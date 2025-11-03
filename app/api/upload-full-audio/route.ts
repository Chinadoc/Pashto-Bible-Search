import { NextRequest, NextResponse } from 'next/server';

const VIDEO_PROCESSOR_SERVICE_URL = process.env.VIDEO_PROCESSOR_SERVICE_URL || process.env.PROCESSING_SERVICE_URL || 'https://pashto-video-processor-production.up.railway.app';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { videoId, youtubeUrl } = body;

    if (!videoId || !youtubeUrl) {
      return NextResponse.json({ success: false, error: 'Missing required fields: videoId, youtubeUrl' }, { status: 400 });
    }

    console.log(`📤 Uploading full audio for video ${videoId}`);
    console.log(`   Service URL: ${VIDEO_PROCESSOR_SERVICE_URL}`);

    const response = await fetch(`${VIDEO_PROCESSOR_SERVICE_URL}/upload-full-audio`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ videoId, youtubeUrl }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ Upload failed: ${response.status} ${errorText}`);
      return NextResponse.json({ success: false, error: `Upload failed: ${response.status}`, details: errorText }, { status: response.status });
    }

    const result = await response.json();

    if (result.success) {
      console.log(`✅ Full audio uploaded: ${result.r2Key}`);
      return NextResponse.json({ success: true, ...result });
    } else {
      return NextResponse.json({ success: false, error: result.error || 'Failed to upload full audio', details: result.details }, { status: 500 });
    }
  } catch (error: any) {
    console.error('Error in /api/upload-full-audio:', error);
    return NextResponse.json({ success: false, error: 'Internal server error', details: error.message }, { status: 500 });
  }
}

