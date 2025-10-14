import { NextRequest, NextResponse } from 'next/server';
import { getData } from '@/app/lib/data/load';
import { formatAnkiCards } from '@/app/utils/anki-formatter';
import { fetchLingDocsAudio, generateAudioFilename } from '@/app/utils/lingdocs-audio';

interface AnkiCard {
  front: string;
  back: string;
  audio?: string;
  tags?: string[];
}

interface AnkiDeck {
  name: string;
  cards: AnkiCard[];
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query, results } = body;

    if (!query || !results) {
      return NextResponse.json({ error: 'Query and results are required' }, { status: 400 });
    }

    console.log(`🔄 Generating Anki deck for "${query}" with ${results.length} results`);

    // Generate Anki cards from search results
    const cards = await generateAnkiCards(query, results);

    // Generate Anki deck format
    const deck = await createAnkiDeck(query, cards);

    console.log(`✅ Generated Anki deck with ${cards.length} cards`);

    return NextResponse.json({
      deck,
      cards,
      count: cards.length,
    });

  } catch (error) {
    console.error('Anki export API error:', error);
    return NextResponse.json(
      { error: 'Failed to generate Anki deck', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

async function generateAnkiCards(query: string, results: any[]): Promise<AnkiCard[]> {
  const cardsData = [];

  for (const result of results.slice(0, 50)) { // Limit to 50 cards for performance
    try {
      const cardData = await generateSingleCardData(result);
      if (cardData) {
        cardsData.push(cardData);
      }
    } catch (error) {
      console.warn(`Failed to generate card data for result ${result.ref}:`, error);
    }
  }

  // Use LLM formatter to create properly formatted cards
  const formattedCards = await formatAnkiCards(cardsData);

  return formattedCards;
}

async function generateSingleCardData(result: any): Promise<any> {
  // Extract the word from the result (this is a simplified approach)
  // In a real implementation, you'd want more sophisticated word extraction
  const text = result.text || '';
  const ref = result.ref || '';

  // For now, use the reference as a proxy for the word
  // In practice, you'd want to extract the highlighted word or search term
  const word = ref.split(' ')[1] || ref; // Get the word part

  if (!word || !text) return null;

  // Fetch LingDocs audio for this word
  const lingDocsAudio = await fetchLingDocsAudio(word);

  // Generate audio filename for Anki
  const audioFilename = generateAudioFilename(
    (lingDocsAudio as any)?.wordId || `bible_${word}`,
    word
  );

  return {
    word,
    verseRef: ref,
    verseText: text,
    audio: `[sound:${audioFilename}]`,
    lingDocsInfo: lingDocsAudio,
  };
}

async function createAnkiDeck(query: string, cards: AnkiCard[]): Promise<AnkiDeck> {
  const deckName = `Pashto_${query.replace(/[^a-zA-Z0-9]/g, '_')}`;

  return {
    name: deckName,
    cards,
  };
}

// Helper function to fetch audio from LingDocs (placeholder for now)
async function fetchLocalAudio(wordId: string): Promise<string | null> {
  try {
    // This would fetch audio from LingDocs dictionary pages
    // For now, return null as placeholder
    console.log(`Would fetch audio for word ID: ${wordId}`);
    return null;
  } catch (error) {
    console.warn(`Failed to fetch LingDocs audio for ${wordId}:`, error);
    return null;
  }
}
