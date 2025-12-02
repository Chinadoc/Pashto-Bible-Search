import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/process-video
 * 
 * Processes a YouTube video with ElevenLabs Scribe v2.
 * Accepts both 'url' and 'youtubeUrl' for compatibility.
 * 1. Extracts audio from YouTube (cloud-compatible)
 * 2. Transcribes using ElevenLabs Scribe v2 (Pashto: ps)
 * 3. Returns transcript with word-level timestamps
 * 
 * This is the main entry point for video processing.
 */

interface ProcessVideoRequest {
    url?: string;
    youtubeUrl?: string;
}

// Extract video ID from YouTube URL
function extractVideoId(url: string): string | null {
    const patterns = [
        /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
        /youtube\.com\/shorts\/([^&\n?#]+)/,
    ];
    
    for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match) return match[1];
    }
    return null;
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json() as ProcessVideoRequest;
        
        console.log('📨 Received request body:', JSON.stringify(body));
        
        // Accept both 'url' and 'youtubeUrl' for compatibility
        const youtubeUrl = body.youtubeUrl || body.url;
        
        console.log('🔗 Extracted YouTube URL:', youtubeUrl);
        
        if (!youtubeUrl) {
            console.error('❌ No YouTube URL found in request body');
            return NextResponse.json(
                { success: false, error: 'YouTube URL is required', receivedBody: body },
                { status: 400 }
            );
        }
        
        const videoId = extractVideoId(youtubeUrl);
        if (!videoId) {
            return NextResponse.json(
                { success: false, error: 'Invalid YouTube URL' },
                { status: 400 }
            );
        }

        console.log(`🎬 Processing video: ${videoId}`);

        // Check for ElevenLabs API key
        const apiKey = process.env.ELEVENLABS_API_KEY;
        if (!apiKey) {
            return NextResponse.json({
                success: false,
                error: 'ElevenLabs API key not configured',
                message: 'Please set ELEVENLABS_API_KEY in Vercel environment variables',
                setup: {
                    step1: 'Go to Vercel Dashboard → Your Project → Settings → Environment Variables',
                    step2: 'Add ELEVENLABS_API_KEY with your API key',
                    step3: 'Redeploy the application',
                    getKey: 'https://elevenlabs.io/app/settings/api-keys'
                },
                videoId,
            });
        }

        // Step 1: Get audio URL from YouTube
        console.log(`📥 Fetching audio for video: ${videoId}`);
        const audioUrl = await getYouTubeAudioUrl(videoId);
        
        if (!audioUrl) {
            return NextResponse.json({
                success: false,
                error: 'Could not extract audio from YouTube video',
                message: 'YouTube blocks direct extraction in serverless environments. Please try one of these alternatives:',
                alternatives: [
                    '1. Upload an audio file directly using the File Upload tab',
                    '2. Use a YouTube to MP3 converter and upload the resulting file',
                    '3. Try a different video (some videos have stricter protection)'
                ],
                videoId,
                help: 'YouTube actively blocks automated extraction. For reliable processing, download the audio locally and upload it.'
            });
        }

        // Step 2: Download and transcribe with Scribe v2
        console.log(`🎙️ Transcribing with ElevenLabs Scribe v2...`);
        const transcription = await transcribeWithScribeV2(audioUrl, apiKey);

        if (!transcription.success) {
            return NextResponse.json({
                success: false,
                error: transcription.error || 'Transcription failed',
                videoId
            });
        }

        // Step 3: Store the video
        const videoData = {
            video_id: videoId,
            youtube_url: youtubeUrl,
            transcript: transcription.transcript,
            language_code: transcription.language_code,
            language_confidence: transcription.language_confidence,
            segments: transcription.segments,
            words: transcription.words,
            total_segments: transcription.segments?.length || 0,
            total_duration: transcription.segments?.length 
                ? transcription.segments[transcription.segments.length - 1].end_time 
                : 0,
            transcription_service: 'elevenlabs_scribe_v2',
            processed_at: new Date().toISOString()
        };

        // Try to store in D1 via Cloudflare Worker
        await storeVideoInD1(videoData);

        console.log(`✅ Video processed successfully:`);
        console.log(`   Segments: ${videoData.total_segments}`);
        console.log(`   Duration: ${videoData.total_duration.toFixed(1)}s`);

        return NextResponse.json({
            success: true,
            ...videoData,
            totalChunks: videoData.total_segments,
            successfulTranscriptions: videoData.total_segments
        });
        
    } catch (error) {
        console.error('Process video error:', error);
        return NextResponse.json(
            { 
                success: false, 
                error: error instanceof Error ? error.message : 'Failed to process video' 
            },
            { status: 500 }
        );
    }
}

/**
 * Get audio URL from YouTube video (cloud-compatible)
 * Uses multiple methods for reliability
 */
async function getYouTubeAudioUrl(videoId: string): Promise<string | null> {
    console.log(`🔍 Attempting to extract audio for video: ${videoId}`);
    
    // Method 1: Try YouTube's innertube API with iOS client (most reliable)
    try {
        const innertubeResponse = await fetch(
            'https://www.youtube.com/youtubei/v1/player?prettyPrint=false',
            {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'User-Agent': 'com.google.ios.youtube/19.29.1 (iPhone16,2; U; CPU iOS 17_5_1 like Mac OS X;)',
                    'X-Goog-Api-Key': 'AIzaSyB-63vPrdThhKuerbB2N_l7Kwwcxj6yUAc',
                },
                body: JSON.stringify({
                    context: {
                        client: {
                            clientName: 'IOS',
                            clientVersion: '19.29.1',
                            deviceMake: 'Apple',
                            deviceModel: 'iPhone16,2',
                            hl: 'en',
                            osName: 'iPhone',
                            osVersion: '17.5.1.21F90',
                            timeZone: 'UTC',
                            utcOffsetMinutes: 0,
                        }
                    },
                    videoId: videoId,
                    playbackContext: {
                        contentPlaybackContext: {
                            signatureTimestamp: 20073
                        }
                    },
                    racyCheckOk: true,
                    contentCheckOk: true,
                }),
            }
        );

        if (innertubeResponse.ok) {
            const data = await innertubeResponse.json();
            console.log(`📡 Innertube response status: ${data.playabilityStatus?.status}`);
            
            const formats = data.streamingData?.adaptiveFormats || [];
            // Prefer mp4 audio format
            const audioFormat = formats.find((f: any) => 
                f.mimeType?.startsWith('audio/mp4') && f.url
            ) || formats.find((f: any) => 
                f.mimeType?.startsWith('audio/') && f.url
            );
            
            if (audioFormat?.url) {
                console.log(`✅ Got audio URL via iOS innertube API`);
                return audioFormat.url;
            } else {
                console.log(`⚠️ No audio URL in formats. Available: ${formats.length} formats`);
            }
        }
    } catch (e) {
        console.warn('iOS innertube failed:', e);
    }

    // Method 2: Try with ANDROID client
    try {
        const androidResponse = await fetch(
            'https://www.youtube.com/youtubei/v1/player?prettyPrint=false',
            {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'User-Agent': 'com.google.android.youtube/19.29.37 (Linux; U; Android 14)',
                },
                body: JSON.stringify({
                    context: {
                        client: {
                            clientName: 'ANDROID',
                            clientVersion: '19.29.37',
                            androidSdkVersion: 34,
                            hl: 'en',
                            timeZone: 'UTC',
                        }
                    },
                    videoId: videoId,
                    racyCheckOk: true,
                    contentCheckOk: true,
                }),
            }
        );

        if (androidResponse.ok) {
            const data = await androidResponse.json();
            const formats = data.streamingData?.adaptiveFormats || [];
            const audioFormat = formats.find((f: any) => 
                f.mimeType?.startsWith('audio/') && f.url
            );
            
            if (audioFormat?.url) {
                console.log(`✅ Got audio URL via Android innertube API`);
                return audioFormat.url;
            }
        }
    } catch (e) {
        console.warn('Android innertube failed:', e);
    }

    // Method 3: Try cobalt.tools API
    try {
        const cobaltResponse = await fetch('https://api.cobalt.tools/api/json', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                url: `https://www.youtube.com/watch?v=${videoId}`,
                vCodec: 'h264',
                vQuality: '720',
                aFormat: 'mp3',
                isAudioOnly: true,
                filenamePattern: 'basic',
            }),
        });

        if (cobaltResponse.ok) {
            const data = await cobaltResponse.json();
            if (data.url) {
                console.log(`✅ Got audio URL via Cobalt API`);
                return data.url;
            }
        }
    } catch (e) {
        console.warn('Cobalt API failed:', e);
    }

    // Method 4: Try y2mate style API
    try {
        const invidious = await fetch(`https://inv.nadeko.net/api/v1/videos/${videoId}`);
        if (invidious.ok) {
            const data = await invidious.json();
            const audioFormats = data.adaptiveFormats?.filter((f: any) => 
                f.type?.startsWith('audio/')
            ) || [];
            
            if (audioFormats.length > 0) {
                console.log(`✅ Got audio URL via Invidious API`);
                return audioFormats[0].url;
            }
        }
    } catch (e) {
        console.warn('Invidious API failed:', e);
    }

    console.error(`❌ All extraction methods failed for video: ${videoId}`);
    return null;
}

/**
 * Transcribe audio using ElevenLabs Scribe v2
 */
async function transcribeWithScribeV2(audioUrl: string, apiKey: string): Promise<{
    success: boolean;
    error?: string;
    transcript?: string;
    language_code?: string;
    language_confidence?: number;
    segments?: Array<{
        text: string;
        start_time: number;
        end_time: number;
        words: Array<{ text: string; start: number; end: number }>;
        confidence: number;
    }>;
    words?: Array<{ text: string; start: number; end: number }>;
}> {
    try {
        // Download audio
        console.log(`📥 Downloading audio...`);
        const audioResponse = await fetch(audioUrl);
        
        if (!audioResponse.ok) {
            return { success: false, error: `Failed to download audio: ${audioResponse.statusText}` };
        }

        const audioBuffer = await audioResponse.arrayBuffer();
        console.log(`📦 Audio size: ${(audioBuffer.byteLength / 1024 / 1024).toFixed(2)} MB`);

        // Check size limit (100MB)
        if (audioBuffer.byteLength > 100 * 1024 * 1024) {
            return { success: false, error: 'Audio file too large (max 100MB)' };
        }

        // Call ElevenLabs Scribe v2
        const formData = new FormData();
        formData.append('file', new Blob([audioBuffer], { type: 'audio/mp3' }), 'audio.mp3');
        formData.append('model_id', 'scribe_v2');
        formData.append('language_code', 'ps'); // Pashto
        formData.append('timestamps_granularity', 'word');

        console.log(`🎙️ Sending to ElevenLabs Scribe v2...`);
        
        const response = await fetch('https://api.elevenlabs.io/v1/speech-to-text', {
            method: 'POST',
            headers: { 'xi-api-key': apiKey },
            body: formData,
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Scribe v2 error:', errorText);
            return { success: false, error: `Transcription failed: ${response.status}` };
        }

        const data = await response.json();
        
        console.log(`✅ Transcription complete: ${data.words?.length || 0} words`);

        // Process words into segments
        const segments = processWordsIntoSegments(data.words || [], data.text);

        return {
            success: true,
            transcript: data.text,
            language_code: data.language_code,
            language_confidence: data.language_probability,
            segments,
            words: data.words?.filter((w: any) => w.type === 'word').map((w: any) => ({
                text: w.text,
                start: w.start,
                end: w.end
            }))
        };

    } catch (error) {
        console.error('Transcription error:', error);
        return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
}

/**
 * Process words into segments
 */
function processWordsIntoSegments(
    words: Array<{ text: string; start: number; end: number; type: string }>,
    fullText: string
): Array<{
    text: string;
    start_time: number;
    end_time: number;
    words: Array<{ text: string; start: number; end: number }>;
    confidence: number;
}> {
    if (!words || words.length === 0) {
        return [{
            text: fullText || '',
            start_time: 0,
            end_time: 0,
            words: [],
            confidence: 0.9
        }];
    }

    const segments: Array<{
        text: string;
        start_time: number;
        end_time: number;
        words: Array<{ text: string; start: number; end: number }>;
        confidence: number;
    }> = [];

    let currentSegment: {
        words: Array<{ text: string; start: number; end: number }>;
        start: number;
        end: number;
    } = { words: [], start: 0, end: 0 };

    const PAUSE_THRESHOLD = 1.0;
    const MAX_SEGMENT_DURATION = 15;

    for (let i = 0; i < words.length; i++) {
        const word = words[i];
        const prevWord = i > 0 ? words[i - 1] : null;
        
        if (word.type !== 'word') continue;

        const shouldStartNewSegment = 
            (prevWord && word.start - prevWord.end > PAUSE_THRESHOLD) ||
            (currentSegment.words.length > 0 && word.end - currentSegment.start > MAX_SEGMENT_DURATION);

        if (shouldStartNewSegment && currentSegment.words.length > 0) {
            segments.push({
                text: currentSegment.words.map(w => w.text).join(' '),
                start_time: currentSegment.start,
                end_time: currentSegment.end,
                words: currentSegment.words,
                confidence: 0.95
            });

            currentSegment = { words: [], start: word.start, end: word.end };
        }

        if (currentSegment.words.length === 0) {
            currentSegment.start = word.start;
        }
        currentSegment.words.push({ text: word.text, start: word.start, end: word.end });
        currentSegment.end = word.end;
    }

    if (currentSegment.words.length > 0) {
        segments.push({
            text: currentSegment.words.map(w => w.text).join(' '),
            start_time: currentSegment.start,
            end_time: currentSegment.end,
            words: currentSegment.words,
            confidence: 0.95
        });
    }

    return segments;
}

/**
 * Store video in Cloudflare D1
 */
async function storeVideoInD1(videoData: any): Promise<void> {
    const workerUrl = process.env.NEXT_PUBLIC_CLOUDFLARE_WORKER_URL || 
        'https://pashtobiblesearch.jeremy-samuels17.workers.dev';

    try {
        const response = await fetch(`${workerUrl}/api/store-video`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(videoData),
        });

        if (response.ok) {
            console.log(`✅ Video stored in Cloudflare D1`);
        } else {
            console.warn(`⚠️ D1 storage returned ${response.status}`);
        }
    } catch (e) {
        console.warn('D1 storage failed:', e);
    }
}
