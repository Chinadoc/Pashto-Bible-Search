import { NextRequest, NextResponse } from 'next/server';

const CLOUDFLARE_WORKER_URL = process.env.NEXT_PUBLIC_CLOUDFLARE_WORKER_URL || 
    'https://pashtobiblesearch.jeremy-samuels17.workers.dev';

interface WordFrequency {
  word: string;
  count: number;
  videos: string[];
}

/**
 * GET /api/video-word-frequency
 * 
 * Returns word frequency data from video transcripts
 */
export async function GET(request: NextRequest) {
    try {
        const url = new URL(request.url);
        const categorize = url.searchParams.get('categorize') === 'true';
        const limit = parseInt(url.searchParams.get('limit') || '100');

        // Fetch all videos from Cloudflare Worker
        const response = await fetch(`${CLOUDFLARE_WORKER_URL}/api/videos`);
        
        if (!response.ok) {
            return NextResponse.json(
                { success: false, error: 'Failed to fetch videos' },
                { status: 500 }
            );
        }

        const data = await response.json();
        const videos = data.videos || [];

        if (videos.length === 0) {
            return NextResponse.json({
                success: true,
                totalWords: 0,
                uniqueWords: 0,
                words: [],
                message: 'No videos found'
            });
        }

        // Extract all words from all video segments
        const wordCounts = new Map<string, { count: number; videos: Set<string> }>();
        
        for (const video of videos) {
            const videoId = video.id || video.video_id;
            const segments = video.segments || [];
            
            for (const segment of segments) {
                const text = segment.text || segment.transcript || '';
                // Extract Pashto words
                const words = text.match(/[\u0600-\u06FF]+/g) || [];
                
                for (const word of words) {
                    const cleanWord = word.replace(/[.,!?؟،؛\[\](){}«»]/g, '').trim();
                    if (cleanWord.length > 0) {
                        if (!wordCounts.has(cleanWord)) {
                            wordCounts.set(cleanWord, { count: 0, videos: new Set() });
                        }
                        const entry = wordCounts.get(cleanWord)!;
                        entry.count++;
                        entry.videos.add(videoId);
                    }
                }
            }
        }

        // Convert to array and sort by frequency
        const wordList: WordFrequency[] = Array.from(wordCounts.entries())
            .map(([word, data]) => ({
                word,
                count: data.count,
                videos: Array.from(data.videos)
            }))
            .sort((a, b) => b.count - a.count);

        const totalWords = wordList.reduce((sum, w) => sum + w.count, 0);

        if (categorize) {
            // Categorize words (simplified - in production would use dictionary lookup)
            const categories = categorizeWords(wordList.slice(0, limit));
            
            return NextResponse.json({
                success: true,
                totalWords,
                uniqueWords: wordList.length,
                videoCount: videos.length,
                categories,
                topWords: wordList.slice(0, 20),
            });
        }

        return NextResponse.json({
            success: true,
            totalWords,
            uniqueWords: wordList.length,
            videoCount: videos.length,
            words: wordList.slice(0, limit),
        });

    } catch (error) {
        console.error('Video word frequency error:', error);
        return NextResponse.json(
            { 
                success: false, 
                error: error instanceof Error ? error.message : 'Failed to get word frequency' 
            },
            { status: 500 }
        );
    }
}

/**
 * Categorize words into grammatical categories
 * This is a simplified version - ideally would use dictionary lookup
 */
function categorizeWords(words: WordFrequency[]) {
    // Common Pashto function words (particles, pronouns, etc.)
    const functionWords = new Set([
        'د', 'په', 'له', 'ته', 'چې', 'او', 'دا', 'هغه', 'زه', 'ته', 'مونږ', 'تاسو',
        'دی', 'ده', 'دي', 'وي', 'شي', 'کړي', 'يې', 'ورته', 'پر', 'تر', 'نه', 'که',
        'ولې', 'څه', 'څوک', 'کله', 'چېرته', 'څنګه', 'خو', 'بس', 'هم', 'یا', 'لکه',
        'سره', 'کې', 'باندې', 'لاندې', 'پورې', 'راته', 'ورته', 'ورسره',
    ]);
    
    // Common verb endings/patterns
    const verbEndings = ['ول', 'ېدل', 'وم', 'ې', 'ي', 'و', 'ئ', 'کړم', 'کړې', 'کړي', 'شم', 'شې', 'شي'];
    
    const categories: {
        functionWords: WordFrequency[];
        verbs: WordFrequency[];
        contentWords: WordFrequency[];
    } = {
        functionWords: [],
        verbs: [],
        contentWords: [],
    };
    
    for (const wordData of words) {
        if (functionWords.has(wordData.word)) {
            categories.functionWords.push(wordData);
        } else if (verbEndings.some(ending => wordData.word.endsWith(ending))) {
            categories.verbs.push(wordData);
        } else {
            categories.contentWords.push(wordData);
        }
    }
    
    return categories;
}

