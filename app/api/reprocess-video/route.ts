import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/reprocess-video
 * 
 * Re-processes an existing video's transcript to create more sentence-level segments.
 * Uses the existing transcript and words but re-segments them.
 */

const WORKER_URL = process.env.NEXT_PUBLIC_CLOUDFLARE_WORKER_URL || 
    'https://pashtobiblesearch.jeremy-samuels17.workers.dev';

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

        console.log(`📊 Found ${existingWords.length} existing words`);

        if (existingWords.length === 0) {
            return NextResponse.json({
                success: false,
                error: 'No word data available to re-segment',
                existingSegments: existingSegments.length
            });
        }

        // Re-segment using sentence-level logic
        const newSegments = processWordsIntoSentenceSegments(existingWords);

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

        return NextResponse.json({
            success: true,
            videoId,
            previousSegmentCount: existingSegments.length,
            newSegmentCount: newSegments.length,
            segments: newSegments,
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
 * Process words into SENTENCE-LEVEL segments
 * Creates more segments by splitting on:
 * 1. Pashto sentence-ending punctuation (. ؟ ۔ ! ?)
 * 2. Long pauses (> 0.8 seconds)
 * 3. Maximum segment duration (8 seconds)
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

    // Pashto sentence-ending punctuation
    const sentenceEnders = new Set(['.', '؟', '۔', '!', '?', '،', '؛']);
    
    let currentSentenceWords: Array<{ text: string; start: number; end: number }> = [];
    let sentenceCount = 0;

    for (let i = 0; i < words.length; i++) {
        const word = words[i];
        currentSentenceWords.push(word);
        
        // Check if this word ends a sentence
        const wordText = word.text.trim();
        const lastChar = wordText.slice(-1);
        const endsWithPunctuation = sentenceEnders.has(lastChar);
        
        // Also check for pauses (> 0.8 second) as potential sentence breaks
        const hasLongPause = i < words.length - 1 && 
            (words[i + 1].start - word.end) > 0.8;
        
        // Check for commas as potential breaks (for longer phrases)
        const endsWithComma = lastChar === '،' || lastChar === ',';
        
        if (endsWithPunctuation || hasLongPause) {
            sentenceCount++;
            
            // Create a segment every 1-2 sentences OR if segment is > 8 seconds
            const segmentDuration = currentSentenceWords[currentSentenceWords.length - 1].end - 
                                    currentSentenceWords[0].start;
            
            // Create segment if: we have 1+ sentences, segment is > 5 seconds, or it's the last word
            // More aggressive segmentation for more clips
            if (sentenceCount >= 1 || segmentDuration > 5 || i === words.length - 1) {
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
                    currentSentenceWords = [];
                    sentenceCount = 0;
                }
            }
        } else if (endsWithComma && currentSentenceWords.length > 5) {
            // Break at commas if we have enough words
            const segmentDuration = currentSentenceWords[currentSentenceWords.length - 1].end - 
                                    currentSentenceWords[0].start;
            if (segmentDuration > 4) {
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
                currentSentenceWords = [];
                sentenceCount = 0;
            }
        }
        
        // Fallback: create segment if too long (max 10 seconds without punctuation)
        if (currentSentenceWords.length > 0) {
            const currentDuration = word.end - currentSentenceWords[0].start;
            if (currentDuration > 10 && i < words.length - 1) {
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
                sentenceCount = 0;
            }
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

