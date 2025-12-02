import { NextRequest, NextResponse } from 'next/server';

/**
 * Transcribe Audio API - ElevenLabs Scribe v2
 * 
 * POST /api/transcribe-audio
 * 
 * Uses ElevenLabs Scribe v2 for high-quality Pashto transcription
 * with word-level timestamps for precise audio synchronization.
 * 
 * Scribe v2 Features:
 * - 99 language support including Pashto (ps)
 * - Word-level timestamps for perfect audio sync
 * - Speaker diarization
 * - ~150ms latency in realtime mode
 * - Superior accuracy for low-resource languages
 */

interface Word {
    text: string;
    start: number;
    end: number;
    type: 'word' | 'spacing' | 'punctuation';
    speaker_id?: string;
}

interface ScribeV2Response {
    language_code: string;
    language_probability: number;
    text: string;
    words: Word[];
}

interface TranscriptSegment {
    text: string;
    start_time: number;
    end_time: number;
    words: Array<{
        text: string;
        start: number;
        end: number;
    }>;
    confidence: number;
    speaker_id?: string;
}

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const audioFile = formData.get('audio') as File;
        const languageCode = formData.get('language') as string || 'ps'; // Default to Pashto
        const enableDiarization = formData.get('diarization') === 'true';
        const tagAudioEvents = formData.get('tag_events') === 'true';

        if (!audioFile) {
            return NextResponse.json(
                { success: false, error: 'No audio file provided' },
                { status: 400 }
            );
        }

        const apiKey = process.env.ELEVENLABS_API_KEY;
        if (!apiKey) {
            return NextResponse.json(
                { success: false, error: 'ElevenLabs API key not configured' },
                { status: 500 }
            );
        }

        // Convert File to Blob/Buffer for sending to ElevenLabs
        const arrayBuffer = await audioFile.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        console.log(`🎙️ Starting Scribe v2 transcription for ${audioFile.name} (${buffer.length} bytes)`);

        // ElevenLabs Scribe v2 API - Speech to Text
        // https://elevenlabs.io/docs/api-reference/speech-to-text/convert
        const elevenLabsFormData = new FormData();
        elevenLabsFormData.append('file', new Blob([buffer]), audioFile.name);
        elevenLabsFormData.append('model_id', 'scribe_v2'); // Scribe v2 model
        elevenLabsFormData.append('language_code', languageCode); // Pashto = 'ps'
        
        // Enable word-level timestamps (critical for audio sync)
        elevenLabsFormData.append('timestamps_granularity', 'word');
        
        // Optional: Speaker diarization for multi-speaker videos
        if (enableDiarization) {
            elevenLabsFormData.append('diarize', 'true');
        }
        
        // Optional: Tag audio events (laughter, music, applause)
        if (tagAudioEvents) {
            elevenLabsFormData.append('tag_audio_events', 'true');
        }

        const response = await fetch('https://api.elevenlabs.io/v1/speech-to-text', {
            method: 'POST',
            headers: {
                'xi-api-key': apiKey,
            },
            body: elevenLabsFormData,
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('ElevenLabs Scribe v2 Error:', errorText);
            return NextResponse.json(
                { 
                    success: false, 
                    error: `ElevenLabs error: ${response.statusText}`, 
                    details: errorText 
                },
                { status: response.status }
            );
        }

        const data: ScribeV2Response = await response.json();
        
        console.log(`✅ Scribe v2 transcription complete:`);
        console.log(`   Language: ${data.language_code} (confidence: ${(data.language_probability * 100).toFixed(1)}%)`);
        console.log(`   Words: ${data.words?.length || 0}`);
        console.log(`   Text length: ${data.text?.length || 0} chars`);

        // Process words into segments with timestamps
        const segments = processWordsIntoSegments(data.words || [], data.text);

        return NextResponse.json({
            success: true,
            transcript: data.text,
            language_code: data.language_code,
            language_confidence: data.language_probability,
            words: data.words?.filter(w => w.type === 'word').map(w => ({
                text: w.text,
                start: w.start,
                end: w.end,
                speaker_id: w.speaker_id
            })) || [],
            segments,
            service: 'elevenlabs_scribe_v2',
            validation: { 
                confidence: data.language_probability || 0.9,
                word_count: data.words?.filter(w => w.type === 'word').length || 0
            }
        });

    } catch (error) {
        console.error('Transcription error:', error);
        return NextResponse.json(
            { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}

/**
 * Process word-level timestamps into sentence/phrase segments
 * Groups words into natural segments based on pauses and punctuation
 */
function processWordsIntoSegments(words: Word[], fullText: string): TranscriptSegment[] {
    if (!words || words.length === 0) {
        return [{
            text: fullText || '',
            start_time: 0,
            end_time: 0,
            words: [],
            confidence: 0.9
        }];
    }

    const segments: TranscriptSegment[] = [];
    let currentSegment: {
        words: Word[];
        text: string;
        start: number;
        end: number;
        speaker_id?: string;
    } = {
        words: [],
        text: '',
        start: 0,
        end: 0
    };

    const PAUSE_THRESHOLD = 0.8; // Seconds - start new segment after this pause
    const MAX_SEGMENT_DURATION = 15; // Max seconds per segment

    for (let i = 0; i < words.length; i++) {
        const word = words[i];
        const prevWord = i > 0 ? words[i - 1] : null;
        
        // Skip non-word tokens for segment text (but keep for timing)
        if (word.type !== 'word') continue;

        // Check if we should start a new segment
        const shouldStartNewSegment = 
            // Long pause between words
            (prevWord && word.start - prevWord.end > PAUSE_THRESHOLD) ||
            // Segment too long
            (currentSegment.words.length > 0 && word.end - currentSegment.start > MAX_SEGMENT_DURATION) ||
            // Speaker change (if diarization enabled)
            (prevWord && word.speaker_id !== prevWord.speaker_id && word.speaker_id);

        if (shouldStartNewSegment && currentSegment.words.length > 0) {
            // Save current segment
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

            // Start new segment
            currentSegment = {
                words: [],
                text: '',
                start: word.start,
                end: word.end,
                speaker_id: word.speaker_id
            };
        }

        // Add word to current segment
        if (currentSegment.words.length === 0) {
            currentSegment.start = word.start;
        }
        currentSegment.words.push(word);
        currentSegment.end = word.end;
        if (word.speaker_id) {
            currentSegment.speaker_id = word.speaker_id;
        }
    }

    // Don't forget the last segment
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

    console.log(`📝 Processed ${words.length} words into ${segments.length} segments`);
    return segments;
}
