import { NextRequest, NextResponse } from 'next/server';

/**
 * Videos API
 * 
 * GET /api/videos - List all processed videos with transcripts
 * POST /api/videos - Store a new processed video
 */

const WORKER_URL = process.env.NEXT_PUBLIC_CLOUDFLARE_WORKER_URL || 
    'https://pashtobiblesearch.jeremy-samuels17.workers.dev';

// In-memory storage for videos (for session persistence)
const videoStore = new Map<string, any>();

interface TranscriptSegment {
    segment_number: number;
    text: string;
    start_time: number;
    end_time: number;
    duration: number;
    words?: Array<{
        text: string;
        start: number;
        end: number;
    }>;
    confidence: number;
    speaker_id?: string;
}

/**
 * GET /api/videos
 * Returns all processed videos with transcripts
 */
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const videoId = searchParams.get('videoId');

        const videos: any[] = [];

        // If specific video requested
        if (videoId) {
            // Check local store first
            const localVideo = videoStore.get(videoId);
            if (localVideo) {
                return NextResponse.json({
                    success: true,
                    video: normalizeVideo(localVideo)
                });
            }

            // Try Cloudflare D1
            try {
                const d1Response = await fetch(`${WORKER_URL}/api/video?videoId=${videoId}`, {
                    headers: { 'Accept': 'application/json' },
                });
                if (d1Response.ok) {
                    const data = await d1Response.json();
                    if (data.video) {
                        return NextResponse.json({
                            success: true,
                            video: normalizeVideo(data.video)
                        });
                    }
                }
            } catch (e) {
                console.warn('D1 video fetch failed:', e);
            }

            return NextResponse.json({
                success: false,
                error: 'Video not found'
            }, { status: 404 });
        }

        // Get all videos from local store
        for (const video of videoStore.values()) {
            videos.push(normalizeVideo(video));
        }

        // Try to fetch from Cloudflare D1
        try {
            const d1Response = await fetch(`${WORKER_URL}/api/videos`, {
                headers: { 'Accept': 'application/json' },
            });
            
            if (d1Response.ok) {
                const data = await d1Response.json();
                if (data.videos && Array.isArray(data.videos)) {
                    for (const video of data.videos) {
                        // Avoid duplicates
                        if (!videos.find(v => v.video_id === (video.video_id || video.videoId))) {
                            videos.push(normalizeVideo(video));
                        }
                    }
                }
            }
        } catch (e) {
            console.warn('D1 videos fetch failed:', e);
        }

        return NextResponse.json({
            success: true,
            videos,
            total: videos.length,
            message: videos.length === 0 
                ? 'No videos found. Enter a YouTube URL and click "Process Video" to get started.' 
                : undefined
        });

    } catch (error) {
        console.error('Error fetching videos:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch videos', videos: [] },
            { status: 500 }
        );
    }
}

/**
 * POST /api/videos
 * Store a new processed video
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        
        const videoId = body.video_id || body.videoId;
        if (!videoId) {
            return NextResponse.json(
                { success: false, error: 'video_id is required' },
                { status: 400 }
            );
        }

        const video = {
            video_id: videoId,
            youtube_url: body.youtube_url || body.youtubeUrl || `https://www.youtube.com/watch?v=${videoId}`,
            transcript: body.transcript || '',
            language_code: body.language_code,
            language_confidence: body.language_confidence,
            segments: (body.segments || body.clips || []).map((seg: any, index: number) => ({
                segment_number: seg.segment_number || index + 1,
                text: seg.text || seg.transcript_text || '',
                start_time: seg.start_time || seg.start_time_seconds || 0,
                end_time: seg.end_time || seg.end_time_seconds || 0,
                duration: seg.duration || ((seg.end_time || seg.end_time_seconds || 0) - (seg.start_time || seg.start_time_seconds || 0)),
                words: seg.words,
                confidence: seg.confidence || 0.95,
                speaker_id: seg.speaker_id
            })),
            words: body.words,
            total_segments: body.total_segments || body.segments?.length || 0,
            total_duration: body.total_duration || 0,
            transcription_service: body.transcription_service || 'elevenlabs_scribe_v2',
            processed_at: body.processed_at || new Date().toISOString()
        };

        // Store locally
        videoStore.set(video.video_id, video);
        console.log(`📹 Stored video ${video.video_id} locally (${videoStore.size} total)`);

        // Try to store in Cloudflare D1
        try {
            const d1Response = await fetch(`${WORKER_URL}/api/store-video`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(video),
            });

            if (d1Response.ok) {
                console.log(`✅ Video ${video.video_id} stored in D1`);
            }
        } catch (e) {
            console.warn('D1 video store failed:', e);
        }

        return NextResponse.json({
            success: true,
            video: normalizeVideo(video),
            message: `Video ${video.video_id} stored successfully`
        });

    } catch (error) {
        console.error('Error storing video:', error);
        return NextResponse.json(
            { success: false, error: error instanceof Error ? error.message : 'Failed to store video' },
            { status: 500 }
        );
    }
}

/**
 * Normalize video object for consistent API response
 */
function normalizeVideo(video: any): any {
    const segments = video.segments || video.clips || [];
    const videoId = video.video_id || video.videoId;
    
    return {
        video_id: videoId,
        youtube_url: video.youtube_url || video.youtubeUrl || `https://www.youtube.com/watch?v=${videoId}`,
        transcript: video.transcript,
        language_code: video.language_code,
        language_confidence: video.language_confidence,
        clips: segments.map((seg: any, index: number) => ({
            segment_number: seg.segment_number || index + 1,
            transcript_text: seg.text || seg.transcript_text,
            start_time_seconds: seg.start_time || seg.start_time_seconds || 0,
            end_time_seconds: seg.end_time || seg.end_time_seconds || 0,
            duration: seg.duration || ((seg.end_time || 0) - (seg.start_time || 0)),
            words: seg.words,
            confidence: seg.confidence,
            speaker_id: seg.speaker_id,
            audio_url: seg.audio_url
        })),
        total_clips: video.total_segments || segments.length,
        total_duration: video.total_duration || 0,
        transcription_service: video.transcription_service || 'elevenlabs_scribe_v2',
        updated_at: video.processed_at || video.updated_at,
        source: 'cloudflare'
    };
}
