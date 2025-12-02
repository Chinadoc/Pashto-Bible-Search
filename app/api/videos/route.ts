import { NextRequest, NextResponse } from 'next/server';

/**
 * Videos API
 * 
 * GET /api/videos - List all processed videos with transcripts
 * POST /api/videos - Store a new processed video
 */

const WORKER_URL = process.env.NEXT_PUBLIC_CLOUDFLARE_WORKER_URL || 
    'https://pashtobiblesearch.jeremy-samuels17.workers.dev';

// In-memory storage for videos (persisted in Cloudflare D1 when available)
const videoStore = new Map<string, ProcessedVideo>();

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

interface ProcessedVideo {
    video_id: string;
    youtube_url: string;
    transcript: string;
    language_code?: string;
    language_confidence?: number;
    segments: TranscriptSegment[];
    words?: Array<{
        text: string;
        start: number;
        end: number;
    }>;
    total_segments: number;
    total_duration: number;
    transcription_service: string;
    processed_at: string;
    indexed?: boolean;
}

/**
 * GET /api/videos
 * Returns all processed videos with transcripts
 */
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const videoId = searchParams.get('videoId');

        // If specific video requested
        if (videoId) {
            // Try Cloudflare D1 first
            try {
                const d1Response = await fetch(`${WORKER_URL}/api/video?videoId=${videoId}`);
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

            // Fall back to local store
            const video = videoStore.get(videoId);
            if (video) {
                return NextResponse.json({
                    success: true,
                    video: normalizeVideo(video)
                });
            }

            return NextResponse.json({
                success: false,
                error: 'Video not found'
            }, { status: 404 });
        }

        // Get all videos
        const videos: ProcessedVideo[] = [];

        // Try Cloudflare D1 first
        try {
            const d1Response = await fetch(`${WORKER_URL}/api/videos`);
            if (d1Response.ok) {
                const data = await d1Response.json();
                if (data.videos && Array.isArray(data.videos)) {
                    videos.push(...data.videos.map(normalizeVideo));
                }
            }
        } catch (e) {
            console.warn('D1 videos fetch failed:', e);
        }

        // Add local store videos (avoiding duplicates)
        for (const video of videoStore.values()) {
            if (!videos.find(v => v.video_id === video.video_id)) {
                videos.push(normalizeVideo(video));
            }
        }

        return NextResponse.json({
            success: true,
            videos,
            total: videos.length,
            message: videos.length === 0 ? 'No videos found. Process a YouTube video to get started.' : undefined
        });

    } catch (error) {
        console.error('Error fetching videos:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch videos' },
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
        
        if (!body.video_id && !body.videoId) {
            return NextResponse.json(
                { success: false, error: 'video_id is required' },
                { status: 400 }
            );
        }

        const video: ProcessedVideo = {
            video_id: body.video_id || body.videoId,
            youtube_url: body.youtube_url || body.youtubeUrl || `https://www.youtube.com/watch?v=${body.video_id || body.videoId}`,
            transcript: body.transcript || '',
            language_code: body.language_code,
            language_confidence: body.language_confidence,
            segments: (body.segments || body.clips || []).map((seg: any, index: number) => ({
                segment_number: seg.segment_number || index + 1,
                text: seg.text || seg.transcript_text || '',
                start_time: seg.start_time || seg.start_time_seconds || 0,
                end_time: seg.end_time || seg.end_time_seconds || 0,
                duration: seg.duration || (seg.end_time - seg.start_time) || 0,
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

        // Auto-index transcript words
        if (video.transcript) {
            try {
                await fetch(`${getBaseUrl(request)}/api/index-transcript`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        videoId: video.video_id,
                        transcript: video.transcript,
                        segments: video.segments
                    }),
                });
                video.indexed = true;
            } catch (e) {
                console.warn('Transcript indexing failed:', e);
            }
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
    
    return {
        video_id: video.video_id || video.videoId,
        youtube_url: video.youtube_url || video.youtubeUrl,
        transcript: video.transcript,
        language_code: video.language_code,
        language_confidence: video.language_confidence,
        clips: segments.map((seg: any, index: number) => ({
            segment_number: seg.segment_number || index + 1,
            transcript_text: seg.text || seg.transcript_text,
            start_time_seconds: seg.start_time || seg.start_time_seconds,
            end_time_seconds: seg.end_time || seg.end_time_seconds,
            duration: seg.duration || (seg.end_time - seg.start_time),
            words: seg.words,
            confidence: seg.confidence,
            speaker_id: seg.speaker_id,
            audio_url: seg.audio_url
        })),
        total_clips: video.total_segments || segments.length,
        total_duration: video.total_duration || 0,
        transcription_service: video.transcription_service,
        updated_at: video.processed_at || video.updated_at,
        indexed: video.indexed,
        source: 'cloudflare'
    };
}

/**
 * Get base URL from request
 */
function getBaseUrl(request: NextRequest): string {
    const host = request.headers.get('host') || 'localhost:3000';
    const protocol = host.includes('localhost') ? 'http' : 'https';
    return `${protocol}://${host}`;
}
