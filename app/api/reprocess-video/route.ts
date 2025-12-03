import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/reprocess-video
 * 
 * Re-processes an existing video's transcript to create more sentence-level segments.
 * Uses the existing transcript and words but re-segments them.
 * Also triggers audio clip splitting via Modal.com.
 */

const WORKER_URL = process.env.NEXT_PUBLIC_CLOUDFLARE_WORKER_URL || 
    'https://pashtobiblesearch.jeremy-samuels17.workers.dev';

const MODAL_WEBHOOK_URL = process.env.NEXT_PUBLIC_MODAL_WEBHOOK_URL || '';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { videoId } = body;
        
        if (!videoId) {
            return NextResponse.json(
                { success: false, error: 'Video ID is required' },
                { status: 400 }
            );
        }

        console.log(`🔄 Re-processing video: ${videoId}`);

        // Fetch existing video data from D1
        const response = await fetch(`${WORKER_URL}/api/videos/${videoId}`);
        
        if (!response.ok) {
            return NextResponse.json(
                { success: false, error: 'Video not found' },
                { status: 404 }
            );
        }

        const videoData = await response.json();
        
        if (!videoData.video) {
            return NextResponse.json(
                { success: false, error: 'Video data not found' },
                { status: 404 }
            );
        }

        const video = videoData.video;
        
        // Parse existing segments/words
        let existingWords: Array<{ text: string; start: number; end: number }> = [];
        let existingSegments: any[] = [];
        
        if (video.segments) {
            try {
                existingSegments = typeof video.segments === 'string' 
                    ? JSON.parse(video.segments) 
                    : video.segments;
                
                // Extract all words from segments
                for (const seg of existingSegments) {
                    if (seg.words && Array.isArray(seg.words)) {
                        existingWords.push(...seg.words.map((w: any) => ({
                            text: w.text,
                            start: w.start || w.start_time || 0,
                            end: w.end || w.end_time || 0
                        })));
                    }
                }
            } catch (e) {
                console.error('Failed to parse existing segments:', e);
            }
        }

        console.log(`📊 Found ${existingWords.length} existing words from ${existingSegments.length} segments`);

        let newSegments: any[];

        if (existingWords.length > 0) {
            // Re-segment using word-level data
            newSegments = processWordsIntoSentenceSegments(existingWords);
        } else if (existingSegments.length > 0 && video.transcript) {
            // No word data - split transcript text based on existing segment boundaries
            console.log(`📝 No word data available, splitting transcript text by punctuation`);
            newSegments = splitTranscriptByPunctuation(video.transcript, existingSegments);
        } else {
            return NextResponse.json({
                success: false,
                error: 'No segment or transcript data available to re-segment',
                existingSegments: existingSegments.length
            });
        }

        console.log(`📝 Created ${newSegments.length} new sentence-level segments (was ${existingSegments.length})`);

        // Update video in D1
        const updateResponse = await fetch(`${WORKER_URL}/api/store-video`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                video_id: videoId,
                youtube_url: video.youtube_url,
                transcript: video.transcript,
                segments: newSegments,
                transcription_service: video.transcription_service || 'elevenlabs_scribe_v2',
                title: video.title,
            }),
        });

        if (!updateResponse.ok) {
            console.warn(`⚠️ D1 update returned ${updateResponse.status}`);
        }

        // Trigger audio clip splitting via Modal.com
        let audioClipsResult = null;
        if (MODAL_WEBHOOK_URL) {
            console.log(`✂️ Triggering audio clip splitting for ${newSegments.length} segments...`);
            try {
                // Get the Modal split audio endpoint (same base URL, different path)
                const modalBaseUrl = MODAL_WEBHOOK_URL.replace('/process_video_webhook', '');
                const splitAudioUrl = `${modalBaseUrl}/split_audio_webhook`;
                
                const clipResponse = await fetch(splitAudioUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        video_id: videoId,
                        segments: newSegments.map(s => ({
                            segmentNumber: s.segmentNumber,
                            startTime: s.startTime,
                            endTime: s.endTime,
                        })),
                    }),
                });
                
                if (clipResponse.ok) {
                    audioClipsResult = await clipResponse.json();
                    console.log(`✅ Audio clips created: ${audioClipsResult.clips_created || 0}`);
                    
                    // Update segments with clip URLs if available
                    if (audioClipsResult.clip_urls) {
                        for (const segment of newSegments) {
                            const clipKey = audioClipsResult.clip_urls[segment.segmentNumber];
                            if (clipKey) {
                                segment.audioUrl = clipKey;
                            }
                        }
                        
                        // Update D1 again with audio URLs
                        await fetch(`${WORKER_URL}/api/store-video`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                video_id: videoId,
                                youtube_url: video.youtube_url,
                                transcript: video.transcript,
                                segments: newSegments,
                                transcription_service: video.transcription_service || 'elevenlabs_scribe_v2',
                                title: video.title,
                            }),
                        });
                    }
                } else {
                    console.warn(`⚠️ Audio clip splitting failed: ${clipResponse.status}`);
                }
            } catch (clipError) {
                console.warn(`⚠️ Audio clip splitting error:`, clipError);
            }
        }

        return NextResponse.json({
            success: true,
            videoId,
            previousSegmentCount: existingSegments.length,
            newSegmentCount: newSegments.length,
            segments: newSegments,
            audioClipsCreated: audioClipsResult?.clips_created || 0,
            message: `Re-segmented from ${existingSegments.length} to ${newSegments.length} segments`
        });
        
    } catch (error) {
        console.error('Re-process video error:', error);
        return NextResponse.json(
            { 
                success: false, 
                error: error instanceof Error ? error.message : 'Failed to re-process video' 
            },
            { status: 500 }
        );
    }
}

/**
 * Process words into SINGLE-SENTENCE segments
 * Creates one segment per sentence for Anki-friendly clips:
 * 1. Pashto sentence-ending punctuation (. ؟ ۔ ! ? ، etc)
 * 2. Pauses (> 0.5 seconds)
 * 3. Maximum segment duration (6 seconds)
 */
function processWordsIntoSentenceSegments(
    words: Array<{ text: string; start: number; end: number }>
): Array<{
    text: string;
    startTime: number;
    endTime: number;
    duration: number;
    words: Array<{ text: string; start: number; end: number }>;
    segmentNumber: number;
}> {
    if (!words || words.length === 0) {
        return [];
    }

    const segments: Array<{
        text: string;
        startTime: number;
        endTime: number;
        duration: number;
        words: Array<{ text: string; start: number; end: number }>;
        segmentNumber: number;
    }> = [];

    // Pashto sentence-ending punctuation (comprehensive)
    const sentenceEnders = new Set(['.', '؟', '۔', '!', '?', '،', '؛', ':', '»']);
    
    let currentSentenceWords: Array<{ text: string; start: number; end: number }> = [];

    for (let i = 0; i < words.length; i++) {
        const word = words[i];
        currentSentenceWords.push(word);
        
        // Check if this word ends a sentence
        const wordText = word.text.trim();
        const lastChar = wordText.slice(-1);
        const endsWithPunctuation = sentenceEnders.has(lastChar);
        
        // Check for pauses (> 0.5 seconds) as sentence breaks
        const hasLongPause = i < words.length - 1 && 
            (words[i + 1].start - word.end) > 0.5;
        
        // Calculate current segment duration
        const segmentDuration = currentSentenceWords.length > 0 
            ? word.end - currentSentenceWords[0].start 
            : 0;
        
        // Create segment immediately when: sentence ends, pause, or max 6 seconds
        const shouldCreateSegment = endsWithPunctuation || hasLongPause || segmentDuration > 6;
        
        if (shouldCreateSegment && currentSentenceWords.length > 0) {
            const startTime = currentSentenceWords[0].start;
            const endTime = word.end;
            
            segments.push({
                segmentNumber: segments.length + 1,
                text: currentSentenceWords.map(w => w.text).join(' '),
                startTime,
                endTime,
                duration: endTime - startTime,
                words: [...currentSentenceWords],
            });
            currentSentenceWords = [];
        }
    }
    
    // Don't forget any remaining words
    if (currentSentenceWords.length > 0) {
        const startTime = currentSentenceWords[0].start;
        const endTime = currentSentenceWords[currentSentenceWords.length - 1].end;
        
        segments.push({
            segmentNumber: segments.length + 1,
            text: currentSentenceWords.map(w => w.text).join(' '),
            startTime,
            endTime,
            duration: endTime - startTime,
            words: [...currentSentenceWords],
        });
    }

    return segments;
}

/**
 * Split transcript by punctuation when word-level timestamps are not available.
 * Uses existing segment boundaries to interpolate timestamps.
 */
function splitTranscriptByPunctuation(
    transcript: string,
    existingSegments: any[]
): Array<{
    text: string;
    startTime: number;
    endTime: number;
    duration: number;
    segmentNumber: number;
}> {
    if (!transcript || existingSegments.length === 0) {
        return [];
    }

    // Calculate total duration from existing segments
    const totalDuration = Math.max(
        ...existingSegments.map(s => s.endTime || s.end_time || 0)
    );
    
    // Pashto sentence-ending punctuation
    const sentencePattern = /[.؟۔!?،؛]+\s*/g;
    
    // Split transcript into sentences
    const sentences: string[] = [];
    let lastIndex = 0;
    let match;
    
    while ((match = sentencePattern.exec(transcript)) !== null) {
        const sentence = transcript.slice(lastIndex, match.index + match[0].length).trim();
        if (sentence.length > 0) {
            sentences.push(sentence);
        }
        lastIndex = match.index + match[0].length;
    }
    
    // Don't forget remaining text
    if (lastIndex < transcript.length) {
        const remaining = transcript.slice(lastIndex).trim();
        if (remaining.length > 0) {
            sentences.push(remaining);
        }
    }
    
    console.log(`📝 Split transcript into ${sentences.length} sentences`);
    
    // Group sentences into segments (2-3 sentences per segment)
    const segments: Array<{
        text: string;
        startTime: number;
        endTime: number;
        duration: number;
        segmentNumber: number;
    }> = [];
    
    // Calculate words per second for timing estimation
    const totalWords = transcript.split(/\s+/).length;
    const wordsPerSecond = totalWords / totalDuration;
    
    let currentWordCount = 0;
    let currentSentences: string[] = [];
    
    for (let i = 0; i < sentences.length; i++) {
        currentSentences.push(sentences[i]);
        const sentenceWordCount = sentences[i].split(/\s+/).length;
        const newWordCount = currentWordCount + sentenceWordCount;
        
        // Create segment if: 2+ sentences, or duration would be > 8 seconds
        const estimatedDuration = sentenceWordCount / wordsPerSecond;
        const totalSegmentWords = currentSentences.join(' ').split(/\s+/).length;
        const segmentDuration = totalSegmentWords / wordsPerSecond;
        
        if (currentSentences.length >= 2 || segmentDuration > 8 || i === sentences.length - 1) {
            const startTime = currentWordCount / wordsPerSecond;
            const endTime = newWordCount / wordsPerSecond;
            
            segments.push({
                segmentNumber: segments.length + 1,
                text: currentSentences.join(' '),
                startTime: Math.round(startTime * 100) / 100,
                endTime: Math.round(endTime * 100) / 100,
                duration: Math.round((endTime - startTime) * 100) / 100,
            });
            
            currentSentences = [];
        }
        
        currentWordCount = newWordCount;
    }
    
    return segments;
}

