// Anki card formatting utilities with LLM assistance

export interface AnkiCardData {
  front: string;
  back: string;
  audio?: string;
  tags?: string[];
  word: string;
  verseRef: string;
  verseText: string;
  lingDocsInfo?: {
    wordId: string;
    audioUrl?: string;
    pronunciation?: string;
    definition?: string;
  };
}

export interface FormattedAnkiCard {
  front: string;
  back: string;
  audio?: string;
  tags: string[];
}

/**
 * Format a single Anki card with LLM assistance for better formatting
 */
export async function formatAnkiCard(cardData: AnkiCardData): Promise<FormattedAnkiCard> {
  const { word, verseRef, verseText, lingDocsInfo } = cardData;

  // Enhanced front with better formatting
  const front = await formatCardFront(word, verseRef, lingDocsInfo);

  // Enhanced back with highlighted verse and audio reference
  const back = formatCardBack(verseText, word, verseRef);

  // Generate appropriate tags
  const tags = generateCardTags(word, verseRef);

  return {
    front,
    back,
    audio: cardData.audio,
    tags,
  };
}

/**
 * Format the front of the Anki card using LLM assistance
 */
async function formatCardFront(word: string, verseRef: string, lingDocsInfo?: any): Promise<string> {
  // In a real implementation, this would call an LLM API
  // For now, provide intelligent formatting based on word characteristics

  const isVerb = checkIfVerb(word);
  const isNoun = checkIfNoun(word);

  let front = '';

  // Include LingDocs pronunciation if available
  const pronunciation = lingDocsInfo?.pronunciation || word;

  if (isVerb) {
    front = `${word}<br><small><em>${pronunciation}</em></small><br><br><small><em>Verb</em> • ${verseRef}</small>`;
  } else if (isNoun) {
    front = `${word}<br><small><em>${pronunciation}</em></small><br><br><small><em>Noun</em> • ${verseRef}</small>`;
  } else {
    front = `${word}<br><small><em>${pronunciation}</em></small><br><br><small>${verseRef}</small>`;
  }

  return front;
}

/**
 * Format the back of the Anki card with highlighted verse
 */
function formatCardBack(verseText: string, word: string, verseRef: string): string {
  // Highlight the target word in the verse
  const highlightedVerse = highlightWordInVerse(verseText, word);

  // Add audio reference
  const audioRef = `[sound:${verseRef.replace(/[^a-zA-Z0-9]/g, '_')}.mp3]`;

  return `${highlightedVerse}<br><br><small>📖 ${verseRef}<br>🔊 ${audioRef}</small>`;
}

/**
 * Generate appropriate tags for the card
 */
function generateCardTags(word: string, verseRef: string): string[] {
  const tags = ['pashto', 'bible'];

  // Extract book from reference (e.g., "Genesis 1:1" -> "genesis")
  const bookMatch = verseRef.match(/^([A-Za-z]+)/);
  if (bookMatch) {
    tags.push(bookMatch[1].toLowerCase());
  }

  // Add word length category
  if (word.length <= 3) {
    tags.push('short-word');
  } else if (word.length <= 6) {
    tags.push('medium-word');
  } else {
    tags.push('long-word');
  }

  // Add character-based tags for Pashto script
  if (/[\u0600-\u06FF]/.test(word)) {
    tags.push('pashto-script');
  }

  return tags;
}

/**
 * Simple heuristic to check if a word is likely a verb
 */
function checkIfVerb(word: string): boolean {
  // Pashto verb patterns (simplified)
  const verbEndings = ['ل', 'ول', 'ېدل', 'ولد', 'کول', 'کیدل'];
  return verbEndings.some(ending => word.endsWith(ending));
}

/**
 * Simple heuristic to check if a word is likely a noun
 */
function checkIfNoun(word: string): boolean {
  // Pashto noun patterns (simplified)
  const nounEndings = ['ی', 'ه', 'ګی', 'توب', 'وال'];
  return nounEndings.some(ending => word.endsWith(ending));
}

/**
 * Highlight a word in the verse text
 */
function highlightWordInVerse(verseText: string, word: string): string {
  // Create a case-insensitive regex for the word
  const regex = new RegExp(`(${word})`, 'gi');
  return verseText.replace(regex, '<mark>$1</mark>');
}

/**
 * Batch format multiple cards with LLM assistance
 */
export async function formatAnkiCards(cardsData: AnkiCardData[]): Promise<FormattedAnkiCard[]> {
  const formattedCards: FormattedAnkiCard[] = [];

  for (const cardData of cardsData) {
    try {
      const formatted = await formatAnkiCard(cardData);
      formattedCards.push(formatted);
    } catch (error) {
      console.warn(`Failed to format card for ${cardData.word}:`, error);
      // Fallback to basic formatting
      formattedCards.push({
        front: cardData.word,
        back: cardData.verseText,
        audio: cardData.audio,
        tags: ['pashto', 'bible'],
      });
    }
  }

  return formattedCards;
}

/**
 * Generate a complete Anki deck with formatted cards
 */
export async function generateAnkiDeck(deckName: string, cardsData: AnkiCardData[]): Promise<any> {
  console.log(`🔄 Formatting ${cardsData.length} cards for Anki deck: ${deckName}`);

  const formattedCards = await formatAnkiCards(cardsData);

  const deck = {
    name: deckName,
    cards: formattedCards,
  };

  console.log(`✅ Formatted ${formattedCards.length} cards for Anki export`);

  return deck;
}
