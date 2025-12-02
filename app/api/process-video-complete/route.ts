import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/process-video-complete
 * 
 * Complete video processing pipeline:
 * 1. Download audio from YouTube
 * 2. Transcribe using ElevenLabs Scribe v2 with word-level timestamps
 * 3. Store transcript segments with precise timing for audio sync
 * 
 * ElevenLabs Scribe v2:
 * - Superior Pashto support (language_code: 'ps')
 * - Word-level timestamps for perfect audio synchronization
 * - Speaker diarization for multi-speaker content
 * - ~150ms latency, 93.5% accuracy
 */

interface ProcessVideoRequest {
    youtubeUrl: string;
    enableDiarization?: boolean;
}

interface Word {
    text: string;
    start: number;
    end: number;
}

interface TranscriptSegment {
    segment_number: number;
    text: string;
    start_time: number;
    end_time: number;
    duration: number;
    words: Word[];
    confidence: number;
    speaker_id?: string;
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
        const { youtubeUrl, enableDiarization = false }: ProcessVideoRequest = await request.json();

        if (!youtubeUrl) {
            return NextResponse.json(
                { success: false, error: 'YouTube URL is required' },
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

        console.log(`🎬 Starting video processing for: ${videoId}`);

        // Check for ElevenLabs API key
        const apiKey = process.env.ELEVENLABS_API_KEY;
        if (!apiKey) {
            return NextResponse.json({
                success: false,
                error: 'ElevenLabs API key not configured',
                message: 'Set ELEVENLABS_API_KEY environment variable to enable Scribe v2 transcription',
            });
        }

        // Step 1: Get audio from YouTube
        // For cloud deployment, we use a third-party service or YouTube's audio URL
        console.log(`📥 Fetching audio for video: ${videoId}`);
        
        // Try to get audio URL via YouTube audio extraction service
        // This uses a serverless approach compatible with Vercel
        const audioUrl = await getYouTubeAudioUrl(videoId);
        
        if (!audioUrl) {
            return NextResponse.json({
                success: false,
                error: 'Could not extract audio from YouTube video',
                message: 'The video may be private, age-restricted, or unavailable',
                videoId
            });
        }

        // Step 2: Download audio and transcribe with Scribe v2
        console.log(`🎙️ Transcribing with ElevenLabs Scribe v2...`);
        
        const transcriptionResult = await transcribeWithScribeV2(
            audioUrl, 
            apiKey,
            enableDiarization
        );

        if (!transcriptionResult.success) {
            return NextResponse.json({
                success: false,
                error: transcriptionResult.error || 'Transcription failed',
                videoId
            });
        }

        // Step 3: Process segments with word-level timestamps
        const segments: TranscriptSegment[] = transcriptionResult.segments.map((seg, index) => ({
            segment_number: index + 1,
            text: seg.text,
            start_time: seg.start_time,
            end_time: seg.end_time,
            duration: seg.end_time - seg.start_time,
            words: seg.words || [],
            confidence: seg.confidence || 0.95,
            speaker_id: seg.speaker_id
        }));

        // Calculate total duration
        const totalDuration = segments.length > 0 
            ? segments[segments.length - 1].end_time 
            : 0;

        console.log(`✅ Video processed successfully:`);
        console.log(`   Segments: ${segments.length}`);
        console.log(`   Total duration: ${totalDuration.toFixed(1)}s`);
        console.log(`   Total words: ${transcriptionResult.words?.length || 0}`);

        return NextResponse.json({
            success: true,
            videoId,
            youtubeUrl,
            transcript: transcriptionResult.transcript,
            language_code: transcriptionResult.language_code,
            language_confidence: transcriptionResult.language_confidence,
            segments,
            words: transcriptionResult.words,
            total_segments: segments.length,
            total_duration: totalDuration,
            transcription_service: 'elevenlabs_scribe_v2',
            processed_at: new Date().toISOString()
        });

    } catch (error) {
        console.error('Process video complete error:', error);
        return NextResponse.json(
            { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}

/**
 * Get audio URL from YouTube video
 * Uses multiple fallback methods for cloud compatibility
 */
async function getYouTubeAudioUrl(videoId: string): Promise<string | null> {
    try {
        // Method 1: Try YouTube's innertube API for audio stream
        const innertubeResponse = await fetch(
            'https://www.youtube.com/youtubei/v1/player?key=AIzaSyAO_FJ2SlqU8Q4STEHLGCilw_Y9_11qcW8',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    context: {
                        client: {
                            clientName: 'ANDROID',
                            clientVersion: '17.31.35',
                            androidSdkVersion: 30,
                        }
                    },
                    videoId: videoId,
                }),
            }
        );

        if (innertubeResponse.ok) {
            const data = await innertubeResponse.json();
            
            // Look for audio-only format
            const formats = data.streamingData?.adaptiveFormats || [];
            const audioFormat = formats.find((f: any) => 
                f.mimeType?.startsWith('audio/') && f.url
            );
            
            if (audioFormat?.url) {
                console.log(`📡 Got audio URL via innertube API`);
                return audioFormat.url;
            }
        }

        // Method 2: Use a third-party extraction service
        // This is a fallback for when innertube doesn't work
        const extractionServices = [
            `https://api.cobalt.tools/api/json`,
        ];

        for (const serviceUrl of extractionServices) {
            try {
                const response = await fetch(serviceUrl, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        url: `https://www.youtube.com/watch?v=${videoId}`,
                        aFormat: 'mp3',
                        isAudioOnly: true,
                    }),
                });

                if (response.ok) {
                    const data = await response.json();
                    if (data.url) {
                        console.log(`📡 Got audio URL via extraction service`);
                        return data.url;
                    }
                }
            } catch (e) {
                console.warn(`Extraction service failed:`, e);
            }
        }

        return null;
    } catch (error) {
        console.error('Error getting YouTube audio URL:', error);
        return null;
    }
}

/**
 * Transcribe audio using ElevenLabs Scribe v2
 */
async function transcribeWithScribeV2(
    audioUrl: string, 
    apiKey: string,
    enableDiarization: boolean
): Promise<{
    success: boolean;
    error?: string;
    transcript?: string;
    language_code?: string;
    language_confidence?: number;
    segments?: Array<{
        text: string;
        start_time: number;
        end_time: number;
        words: Word[];
        confidence: number;
        speaker_id?: string;
    }>;
    words?: Word[];
}> {
    try {
        // Download audio from URL
        console.log(`📥 Downloading audio from URL...`);
        const audioResponse = await fetch(audioUrl);
        
        if (!audioResponse.ok) {
            return { 
                success: false, 
                error: `Failed to download audio: ${audioResponse.statusText}` 
            };
        }

        const audioBuffer = await audioResponse.arrayBuffer();
        const audioBlob = new Blob([audioBuffer], { type: 'audio/mp3' });
        
        console.log(`📦 Audio size: ${(audioBuffer.byteLength / 1024 / 1024).toFixed(2)} MB`);

        // Check if audio is too large (ElevenLabs has limits)
        const MAX_SIZE_MB = 100; // 100MB limit for Scribe v2
        if (audioBuffer.byteLength > MAX_SIZE_MB * 1024 * 1024) {
            return {
                success: false,
                error: `Audio file too large (${(audioBuffer.byteLength / 1024 / 1024).toFixed(1)}MB). Maximum is ${MAX_SIZE_MB}MB.`
            };
        }

        // Call ElevenLabs Scribe v2 API
        const formData = new FormData();
        formData.append('file', audioBlob, 'audio.mp3');
        formData.append('model_id', 'scribe_v2');
        formData.append('language_code', 'ps'); // Pashto
        formData.append('timestamps_granularity', 'word'); // Word-level timestamps

        if (enableDiarization) {
            formData.append('diarize', 'true');
        }

        console.log(`🎙️ Sending to ElevenLabs Scribe v2...`);
        
        const response = await fetch('https://api.elevenlabs.io/v1/speech-to-text', {
            method: 'POST',
            headers: {
                'xi-api-key': apiKey,
            },
            body: formData,
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Scribe v2 error:', errorText);
            return {
                success: false,
                error: `ElevenLabs Scribe v2 error: ${response.status} ${response.statusText}`
            };
        }

        const data = await response.json();
        
        console.log(`✅ Transcription complete:`);
        console.log(`   Language: ${data.language_code} (${(data.language_probability * 100).toFixed(1)}% confidence)`);
        console.log(`   Words: ${data.words?.length || 0}`);

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
        console.error('Scribe v2 transcription error:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown transcription error'
        };
    }
}

/**
 * Process word-level timestamps into natural segments
 */
function processWordsIntoSegments(
    words: Array<{ text: string; start: number; end: number; type: string; speaker_id?: string }>,
    fullText: string
): Array<{
    text: string;
    start_time: number;
    end_time: number;
    words: Word[];
    confidence: number;
    speaker_id?: string;
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
        words: Word[];
        confidence: number;
        speaker_id?: string;
    }> = [];

    let currentSegment: {
        words: Array<{ text: string; start: number; end: number; speaker_id?: string }>;
        start: number;
        end: number;
        speaker_id?: string;
    } = {
        words: [],
        start: 0,
        end: 0
    };

    const PAUSE_THRESHOLD = 1.0; // Start new segment after 1s pause
    const MAX_SEGMENT_DURATION = 20; // Max 20s per segment

    for (let i = 0; i < words.length; i++) {
        const word = words[i];
        const prevWord = i > 0 ? words[i - 1] : null;
        
        if (word.type !== 'word') continue;

        const shouldStartNewSegment = 
            (prevWord && word.start - prevWord.end > PAUSE_THRESHOLD) ||
            (currentSegment.words.length > 0 && word.end - currentSegment.start > MAX_SEGMENT_DURATION) ||
            (prevWord && word.speaker_id !== prevWord.speaker_id && word.speaker_id);

        if (shouldStartNewSegment && currentSegment.words.length > 0) {
            segments.push({
                text: currentSegment.words.map(w => w.text).join(' '),
                start_time: currentSegment.start,
                end_time: currentSegment.end,
                words: currentSegment.words.map(w => ({
                    text: w.text,
                    start: w.start,
                    end: w.end
                })),
                confidence: 0.95,
                speaker_id: currentSegment.speaker_id
            });

            currentSegment = {
                words: [],
                start: word.start,
                end: word.end,
                speaker_id: word.speaker_id
            };
        }

        if (currentSegment.words.length === 0) {
            currentSegment.start = word.start;
        }
        currentSegment.words.push({
            text: word.text,
            start: word.start,
            end: word.end,
            speaker_id: word.speaker_id
        });
        currentSegment.end = word.end;
        if (word.speaker_id) {
            currentSegment.speaker_id = word.speaker_id;
        }
    }

    if (currentSegment.words.length > 0) {
        segments.push({
            text: currentSegment.words.map(w => w.text).join(' '),
            start_time: currentSegment.start,
            end_time: currentSegment.end,
            words: currentSegment.words.map(w => ({
                text: w.text,
                start: w.start,
                end: w.end
            })),
            confidence: 0.95,
            speaker_id: currentSegment.speaker_id
        });
    }

    return segments;
}
