import { NextRequest, NextResponse } from 'next/server';
import { getD1ClientOrThrow } from '@/utils/d1-helpers';

// Helper function to analyze Pashto text and count words
function analyzePashtoText(text: string): { wordCount: number, uniqueWords: string[], wordFreq: Record<string, number> } {
  const cleanText = text
    .replace(/[^\u0600-\u06FF\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  const words = cleanText.split(' ').filter(word => word.length > 0);

  const wordFreq: Record<string, number> = {};
  for (const word of words) {
    wordFreq[word] = (wordFreq[word] || 0) + 1;
  }

  return {
    wordCount: words.length,
    uniqueWords: Object.keys(wordFreq).sort(),
    wordFreq
  };
}

function categorizeTranscriptQuality(transcript: string): 'pashto' | 'mixed' | 'nonPashto' | 'music' | 'empty' {
  if (!transcript || transcript.trim().length === 0) {
    return 'empty';
  }

  const pashtoChars = /[\u0600-\u06FF]/.test(transcript);
  const musicIndicators = /\b(jazz|rock|music|موسيقى|موزیک|موسیقی)\b/i.test(transcript);
  const englishChars = /[a-zA-Z]/.test(transcript);
  const nonPashtoChars = /[^\u0600-\u06FF\s\(\)\[\].,!?،؛]/.test(transcript);

  if (musicIndicators) {
    return 'music';
  }

  if (!pashtoChars && englishChars) {
    return 'nonPashto';
  }

  if (pashtoChars && (englishChars || nonPashtoChars)) {
    return 'mixed';
  }

  if (pashtoChars) {
    return 'pashto';
  }

  return 'nonPashto';
}

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const includeCategorization = url.searchParams.get('categorize') === 'true';
    const limit = parseInt(url.searchParams.get('limit') || '100');

    let db;
    try {
      db = getD1ClientOrThrow();
    } catch (error) {
      return NextResponse.json({ error: error instanceof Error ? error.message : String(error) }, { status: 500 });
    }

    const rows = await db.query<{ video_id: string; transcript: string }>(
      `SELECT video_id, transcript FROM video_transcripts`
    );

    const allTranscripts = (rows || []).map((item) => item.transcript || '').join(' ');

    if (!allTranscripts.trim()) {
      return NextResponse.json({
        success: true,
        wordFrequency: {
          totalWords: 0,
          uniqueWords: 0,
          wordFrequency: [],
        },
        categorization: includeCategorization
          ? { pashto: [], mixed: [], nonPashto: [], music: [], empty: [] }
          : null,
      });
    }

    const analysis = analyzePashtoText(allTranscripts);

    const wordFrequencyArray = Object.entries(analysis.wordFreq)
      .map(([word, frequency]) => ({ word, frequency }))
      .sort((a, b) => b.frequency - a.frequency)
      .slice(0, limit);

    let categorization: {
      pashto: any[];
      mixed: any[];
      nonPashto: any[];
      music: any[];
      empty: any[];
    } | null = null;

    if (includeCategorization && rows) {
      categorization = { pashto: [], mixed: [], nonPashto: [], music: [], empty: [] };
      rows.forEach((item) => {
        const category = categorizeTranscriptQuality(item.transcript || '');
        categorization?.[category]?.push({
          verseReference: `video_${item.video_id}`,
          transcript: item.transcript,
          category,
        });
      });
    }

    return NextResponse.json({
      success: true,
      wordFrequency: {
        totalWords: analysis.wordCount,
        uniqueWords: analysis.uniqueWords.length,
        wordFrequency: wordFrequencyArray,
      },
      categorization,
    });
  } catch (error) {
    console.error('Error analyzing video word frequency:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to analyze word frequency' },
      { status: 500 }
    );
  }
}
