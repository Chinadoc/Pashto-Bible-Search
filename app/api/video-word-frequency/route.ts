import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/app/utils/supabase';

// Helper function to analyze Pashto text and count words
function analyzePashtoText(text: string): { wordCount: number, uniqueWords: string[], wordFreq: Record<string, number> } {
  // Remove punctuation and normalize text
  const cleanText = text
    .replace(/[^\u0600-\u06FF\s]/g, ' ') // Keep only Pashto characters and spaces
    .replace(/\s+/g, ' ') // Normalize whitespace
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

// Function to categorize transcript quality
function categorizeTranscriptQuality(transcript: string): 'pashto' | 'mixed' | 'non-pashto' | 'music' | 'empty' {
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
    return 'non-pashto';
  }

  if (pashtoChars && (englishChars || nonPashtoChars)) {
    return 'mixed';
  }

  if (pashtoChars) {
    return 'pashto';
  }

  return 'non-pashto';
}

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const includeCategorization = url.searchParams.get('categorize') === 'true';
    const limit = parseInt(url.searchParams.get('limit') || '100');

    // Get all video transcripts from Supabase
    const { data, error } = await supabase
      .from('audio_mappings')
      .select('*')
      .like('verse_reference', 'video_%')
      .order('verse_reference');

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }

    // Aggregate all transcripts for word frequency analysis
    const allTranscripts = data?.map(item => item.audio_path).join(' ') || '';

    if (!allTranscripts.trim()) {
      return NextResponse.json({
        success: true,
        wordFrequency: {
          totalWords: 0,
          uniqueWords: 0,
          wordFrequency: []
        },
        categorization: includeCategorization ? {
          pashto: [],
          mixed: [],
          nonPashto: [],
          music: [],
          empty: []
        } : null
      });
    }

    const analysis = analyzePashtoText(allTranscripts);

    // Convert word frequency to sorted array
    const wordFrequencyArray = Object.entries(analysis.wordFreq)
      .map(([word, frequency]) => ({ word, frequency }))
      .sort((a, b) => b.frequency - a.frequency)
      .slice(0, limit);

    type CategorizationType = {
      pashto: Array<{verseReference: string, transcript: string, category: string}>;
      mixed: Array<{verseReference: string, transcript: string, category: string}>;
      nonPashto: Array<{verseReference: string, transcript: string, category: string}>;
      music: Array<{verseReference: string, transcript: string, category: string}>;
      empty: Array<{verseReference: string, transcript: string, category: string}>;
    } | null;

    let categorization: CategorizationType = null;
    if (includeCategorization) {
      categorization = {
        pashto: [],
        mixed: [],
        nonPashto: [],
        music: [],
        empty: []
      };

      data?.forEach((item) => {
        const category = categorizeTranscriptQuality(item.audio_path);
        const transcriptData = {
          verseReference: item.verse_reference,
          transcript: item.audio_path,
          category: category
        };

        if (categorization) {
          switch (category) {
            case 'pashto':
              categorization.pashto.push(transcriptData);
              break;
            case 'mixed':
              categorization.mixed.push(transcriptData);
              break;
            case 'non-pashto':
              categorization.nonPashto.push(transcriptData);
              break;
            case 'music':
              categorization.music.push(transcriptData);
              break;
            case 'empty':
              categorization.empty.push(transcriptData);
              break;
          }
        }
      });
    }

    return NextResponse.json({
      success: true,
      wordFrequency: {
        totalWords: analysis.wordCount,
        uniqueWords: analysis.uniqueWords.length,
        wordFrequency: wordFrequencyArray
      },
      categorization: categorization as CategorizationType
    });

  } catch (error) {
    console.error('Error analyzing video word frequency:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to analyze word frequency' },
      { status: 500 }
    );
  }
}
