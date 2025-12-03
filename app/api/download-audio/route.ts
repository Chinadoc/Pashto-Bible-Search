import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/download-audio
 * 
 * Downloads audio from YouTube using Modal and uploads to R2.
 * This ensures the full audio is available for clip splitting.
 */

const MODAL_PROCESS_URL = process.env.NEXT_PUBLIC_MODAL_WEBHOOK_URL || 
    'https://chinadoc--pashto-youtube-processor-process-video-webhook.modal.run';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { youtubeUrl, videoId } = body;
        
        if (!youtubeUrl && !videoId) {
            return NextResponse.json(
                { success: false, error: 'YouTube URL or video ID is required' },
                { status: 400 }
            );
        }

        const url = youtubeUrl || `https://www.youtube.com/watch?v=${videoId}`;
        console.log(`📥 Downloading audio for: ${url}`);

        // Call Modal to download and upload audio to R2
        const response = await fetch(MODAL_PROCESS_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ youtube_url: url }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Modal download failed:', errorText);
            return NextResponse.json(
                { success: false, error: `Modal download failed: ${response.status}` },
                { status: 500 }
            );
        }

        const result = await response.json();
        
        return NextResponse.json({
            success: result.success,
            videoId: result.video_id,
            r2Key: result.r2_key,
            message: result.success 
                ? 'Audio downloaded and uploaded to R2' 
                : 'Download failed',
            error: result.error,
        });
        
    } catch (error) {
        console.error('Download audio error:', error);
        return NextResponse.json(
            { 
                success: false, 
                error: error instanceof Error ? error.message : 'Failed to download audio' 
            },
            { status: 500 }
        );
    }
}

