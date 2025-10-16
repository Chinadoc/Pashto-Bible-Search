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

// Enhanced function to categorize word types based on Pashto grammar rules
function categorizeWordType(word: string): { type: string; confidence: number; reason: string } {
  if (!word || word.trim().length === 0) {
    return { type: 'unknown', confidence: 0, reason: 'Empty word' };
  }

  const cleanWord = word.trim();

  // Common Pashto particles and conjunctions (او is a conjunction, not a verb)
  const particles = ['او', 'اوو', 'یا', 'او یا', 'که', 'چې', 'خو', 'نو', 'پس', 'ځکه', 'چېرته', 'کله', 'څنګه'];
  if (particles.includes(cleanWord)) {
    return { type: 'particle', confidence: 0.9, reason: 'Common Pashto particle/conjunction' };
  }

  // Pronouns
  const pronouns = ['زما', 'ستا', 'دده', 'زمونږ', 'ستاسو', 'ددوی', 'زه', 'ته', 'هغه', 'مونږ', 'تاسو', 'هغوی'];
  if (pronouns.includes(cleanWord)) {
    return { type: 'pronoun', confidence: 0.9, reason: 'Pashto pronoun' };
  }

  // Prepositions
  const prepositions = ['په', 'له', 'سره', 'پورې', 'نه', 'ته', 'څخه', 'کې', 'پورې', 'لاندې', 'پورته', 'شاته'];
  if (prepositions.includes(cleanWord)) {
    return { type: 'preposition', confidence: 0.9, reason: 'Pashto preposition' };
  }

  // Numbers
  const pashtoNumbers = ['یو', 'دوه', 'درې', 'څلور', 'پنځه', 'شپږ', 'اووه', 'اته', 'نهه', 'لس'];
  if (pashtoNumbers.includes(cleanWord)) {
    return { type: 'number', confidence: 0.9, reason: 'Pashto number' };
  }

  // Common adjectives
  const adjectives = ['ښه', 'بد', 'لوی', 'کوچنی', 'سپین', 'تور', 'سرخ', 'شنه', 'آبی', 'ژېړ'];
  if (adjectives.includes(cleanWord)) {
    return { type: 'adjective', confidence: 0.7, reason: 'Common Pashto adjective' };
  }

  // Enhanced verb detection for Pashto verb forms (like ويل - wayúl)
  // Check for common Pashto verb patterns and forms
  const verbPatterns = [
    // Present tense endings
    'يږي', 'وي', 'يږي', 'وي', 'وي', 'وي', 'يږي', 'وي', 'يږي', 'وي',
    // Past tense patterns
    'و', 'ه', 'ه', 'ه', 'ه', 'ه',
    // Imperfective stems (like wayúl)
    'يل', 'ول', 'ال', 'ول', 'ال', 'ول',
    // Common verb roots and stems
    'ويل', 'وول', 'وال', 'کول', 'کېدل', 'راوړل', 'تلل', 'راتلل', 'موندل'
  ];

  // Check if word ends with verb patterns or contains verb stems
  const isVerb = verbPatterns.some(pattern => cleanWord.includes(pattern) || cleanWord.endsWith(pattern));

  // Special case for words like "ويل" (wayúl) - should be verb (connected to wayul root)
  if (cleanWord === 'ويل' || cleanWord.startsWith('و') && (cleanWord.includes('يل') || cleanWord.includes('ول'))) {
    return { type: 'verb', confidence: 0.9, reason: 'Pashto verb form - matches LingDocs conjugation patterns (wayul root)' };
  }

  if (isVerb) {
    return { type: 'verb', confidence: 0.8, reason: 'Matches Pashto verb patterns and stems' };
  }

  // Legacy verb ending patterns (kept for compatibility)
  const verbEndings = ['يږي', 'وي', 'يږي', 'وي', 'وي', 'وي', 'يږي', 'وي', 'يږي', 'وي'];
  const isLegacyVerb = verbEndings.some(ending => cleanWord.endsWith(ending));

  if (isLegacyVerb) {
    return { type: 'verb', confidence: 0.6, reason: 'Matches Pashto verb ending patterns' };
  }

  // Enhanced noun patterns (common Pashto noun endings)
  const nounEndings = ['ی', 'ه', 'ون', 'ان', 'ګان', 'ګانو', 'ونه', 'انه', 'ستان', 'وند'];
  const isNoun = nounEndings.some(ending => cleanWord.endsWith(ending));

  if (isNoun) {
    return { type: 'noun', confidence: 0.7, reason: 'Matches Pashto noun ending patterns' };
  }

  // Check for LingDocs-style verb forms that might be missed
  // Words that contain common verb roots
  const verbRoots = ['و', 'ک', 'ر', 'ت', 'م', 'ل', 'ش', 'خ', 'غ', 'ق'];
  const hasVerbRoot = verbRoots.some(root => cleanWord.startsWith(root));

  if (hasVerbRoot && cleanWord.length >= 3) {
    return { type: 'verb', confidence: 0.5, reason: 'Contains Pashto verb root patterns' };
  }

  // Default categorization based on length and structure
  if (cleanWord.length <= 2) {
    return { type: 'particle', confidence: 0.3, reason: 'Short word, likely particle' };
  }

  if (cleanWord.length >= 5) {
    return { type: 'noun', confidence: 0.4, reason: 'Longer word, likely noun' };
  }

  return { type: 'unknown', confidence: 0.1, reason: 'Could not determine type' };
}

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const includeCategorization = url.searchParams.get('categorize') === 'true';
    const limit = parseInt(url.searchParams.get('limit') || '100');
    const videoId = url.searchParams.get('videoId');

    // Get video transcripts - either from specific video or all videos
    let query = supabase
      .from('audio_mappings')
      .select('*')
      .like('verse_reference', 'video_%')
      .order('verse_reference');

    if (videoId) {
      // Filter for specific video ID
      query = query.like('verse_reference', `video_${videoId}_%`);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }

    // Aggregate transcripts for word frequency analysis
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

    // Convert word frequency to sorted array with enhanced type information
    const wordFrequencyArray = Object.entries(analysis.wordFreq)
      .map(([word, frequency]) => {
        const typeInfo = categorizeWordType(word);
        return {
          word,
          frequency,
          type: typeInfo.type,
          confidence: typeInfo.confidence,
          reason: typeInfo.reason
        };
      })
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
      categorization: categorization as CategorizationType,
      wordTypeStats: {
        verbs: wordFrequencyArray.filter(w => w.type === 'verb').length,
        nouns: wordFrequencyArray.filter(w => w.type === 'noun').length,
        particles: wordFrequencyArray.filter(w => w.type === 'particle').length,
        pronouns: wordFrequencyArray.filter(w => w.type === 'pronoun').length,
        prepositions: wordFrequencyArray.filter(w => w.type === 'preposition').length,
        adjectives: wordFrequencyArray.filter(w => w.type === 'adjective').length,
        numbers: wordFrequencyArray.filter(w => w.type === 'number').length,
        unknown: wordFrequencyArray.filter(w => w.type === 'unknown').length
      }
    });

  } catch (error) {
    console.error('Error analyzing video word frequency:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to analyze word frequency' },
      { status: 500 }
    );
  }
}
