import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/index-transcript
 * 
 * Index transcript words into the word frequency system.
 * This enables:
 * - Searching transcripts alongside Bible text
 * - Word frequency analysis across videos
 * - Cross-referencing transcript words with Bible occurrences
 */

const WORKER_URL = process.env.NEXT_PUBLIC_CLOUDFLARE_WORKER_URL || 
    'https://pashtobiblesearch.jeremy-samuels17.workers.dev';

interface IndexRequest {
    videoId: string;
    transcript: string;
    segments?: Array<{
        text: string;
        start_time: number;
        end_time: number;
        words?: Array<{
            text: string;
            start: number;
            end: number;
        }>;
    }>;
}

interface WordFrequency {
    word: string;
    count: number;
    positions: Array<{
        segment_index: number;
        word_index: number;
        start_time: number;
        end_time: number;
    }>;
}

/**
 * Tokenize Pashto text into words
 * Handles Pashto/Arabic script properly
 */
function tokenizePashtoText(text: string): string[] {
    if (!text) return [];
    
    // Match Pashto/Arabic words (including diacritics and tatweel)
    const words = text.match(/[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]+/gu) || [];
    
    // Clean and filter
    return words
        .map(word => word.replace(/\u0640/g, '').trim()) // Remove tatweel
        .filter(word => word.length > 1); // Skip single chars
}

/**
 * Calculate word frequencies from transcript
 */
function calculateWordFrequencies(
    transcript: string,
    segments?: Array<{
        text: string;
        start_time: number;
        end_time: number;
        words?: Array<{ text: string; start: number; end: number }>;
    }>
): Map<string, WordFrequency> {
    const frequencies = new Map<string, WordFrequency>();
    
    if (segments && segments.length > 0) {
        // Process word-by-word with timestamps from segments
        segments.forEach((segment, segIndex) => {
            if (segment.words) {
                // Use word-level timestamps
                segment.words.forEach((word, wordIndex) => {
                    const cleanWord = word.text.replace(/\u0640/g, '').trim();
                    if (cleanWord.length <= 1) return;
                    
                    const existing = frequencies.get(cleanWord) || {
                        word: cleanWord,
                        count: 0,
                        positions: []
                    };
                    
                    existing.count++;
                    existing.positions.push({
                        segment_index: segIndex,
                        word_index: wordIndex,
                        start_time: word.start,
                        end_time: word.end
                    });
                    
                    frequencies.set(cleanWord, existing);
                });
            } else {
                // Fall back to segment text
                const words = tokenizePashtoText(segment.text);
                words.forEach((word, wordIndex) => {
                    const existing = frequencies.get(word) || {
                        word,
                        count: 0,
                        positions: []
                    };
                    
                    existing.count++;
                    existing.positions.push({
                        segment_index: segIndex,
                        word_index: wordIndex,
                        start_time: segment.start_time,
                        end_time: segment.end_time
                    });
                    
                    frequencies.set(word, existing);
                });
            }
        });
    } else {
        // Process full transcript without timestamps
        const words = tokenizePashtoText(transcript);
        words.forEach((word, index) => {
            const existing = frequencies.get(word) || {
                word,
                count: 0,
                positions: []
            };
            
            existing.count++;
            existing.positions.push({
                segment_index: 0,
                word_index: index,
                start_time: 0,
                end_time: 0
            });
            
            frequencies.set(word, existing);
        });
    }
    
    return frequencies;
}

export async function POST(request: NextRequest) {
    try {
        const body: IndexRequest = await request.json();
        const { videoId, transcript, segments } = body;
        
        if (!videoId || !transcript) {
            return NextResponse.json(
                { success: false, error: 'videoId and transcript are required' },
                { status: 400 }
            );
        }
        
        console.log(`📝 Indexing transcript for video: ${videoId}`);
        
        // Calculate word frequencies
        const frequencies = calculateWordFrequencies(transcript, segments);
        
        console.log(`   Found ${frequencies.size} unique words`);
        
        // Convert to array sorted by frequency
        const wordList = Array.from(frequencies.values())
            .sort((a, b) => b.count - a.count);
        
        // Try to store in Cloudflare D1 via worker
        let storedInD1 = false;
        try {
            const d1Response = await fetch(`${WORKER_URL}/api/store-transcript-words`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    videoId,
                    words: wordList.slice(0, 1000), // Limit for storage
                    totalWords: wordList.reduce((sum, w) => sum + w.count, 0),
                    uniqueWords: frequencies.size,
                }),
            });
            
            if (d1Response.ok) {
                storedInD1 = true;
                console.log(`   ✅ Stored in Cloudflare D1`);
            }
        } catch (e) {
            console.warn(`   ⚠️ D1 storage skipped:`, e);
        }
        
        // Return analysis results
        const topWords = wordList.slice(0, 50).map(w => ({
            word: w.word,
            count: w.count,
            firstOccurrence: w.positions[0]
        }));
        
        // Calculate some stats
        const totalWords = wordList.reduce((sum, w) => sum + w.count, 0);
        const avgWordLength = wordList.reduce((sum, w) => sum + w.word.length * w.count, 0) / totalWords;
        
        return NextResponse.json({
            success: true,
            videoId,
            stats: {
                totalWords,
                uniqueWords: frequencies.size,
                avgWordLength: avgWordLength.toFixed(1),
                storedInD1
            },
            topWords,
            // For integration with existing word frequency system
            frequencyMap: Object.fromEntries(
                wordList.map(w => [w.word, w.count])
            )
        });
        
    } catch (error) {
        console.error('Index transcript error:', error);
        return NextResponse.json(
            { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}

/**
 * GET /api/index-transcript?videoId=xxx
 * 
 * Get indexed words for a specific video
 */
export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const videoId = searchParams.get('videoId');
    
    if (!videoId) {
        return NextResponse.json(
            { success: false, error: 'videoId is required' },
            { status: 400 }
        );
    }
    
    try {
        // Try to fetch from D1
        const response = await fetch(`${WORKER_URL}/api/transcript-words?videoId=${videoId}`);
        
        if (response.ok) {
            const data = await response.json();
            return NextResponse.json({
                success: true,
                videoId,
                ...data
            });
        }
        
        return NextResponse.json({
            success: false,
            error: 'No indexed data found for this video'
        });
        
    } catch (error) {
        console.error('Get transcript words error:', error);
        return NextResponse.json(
            { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}

