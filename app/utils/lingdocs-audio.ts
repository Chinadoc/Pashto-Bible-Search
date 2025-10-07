// LingDocs audio fetching utilities

export interface LingDocsAudioInfo {
  wordId: string;
  audioUrl?: string;
  pronunciation?: string;
  definition?: string;
}

/**
 * Fetch audio information for a word from LingDocs dictionary
 */
export async function fetchLingDocsAudio(word: string): Promise<LingDocsAudioInfo | null> {
  try {
    console.log(`🔍 Searching LingDocs for audio: "${word}"`);

    // In a real implementation, this would:
    // 1. Search the LingDocs dictionary for the word
    // 2. Extract the word ID from the search results
    // 3. Fetch the word page and extract audio URL

    // For now, return a placeholder that demonstrates the structure
    // This would be replaced with actual web scraping logic
    const mockWordId = `mock_${word.replace(/[^a-zA-Z0-9]/g, '_')}`;

    return {
      wordId: mockWordId,
      audioUrl: `https://dictionary.lingdocs.com/audio/${mockWordId}.mp3`,
      pronunciation: word, // Would be extracted from the page
      definition: `Definition for ${word}`, // Would be extracted from the page
    };

  } catch (error) {
    console.warn(`Failed to fetch LingDocs audio for "${word}":`, error);
    return null;
  }
}

/**
 * Batch fetch audio for multiple words
 */
export async function fetchLingDocsAudioBatch(words: string[]): Promise<LingDocsAudioInfo[]> {
  const results: LingDocsAudioInfo[] = [];

  for (const word of words) {
    try {
      const audioInfo = await fetchLingDocsAudio(word);
      if (audioInfo) {
        results.push(audioInfo);
      }

      // Add small delay to avoid overwhelming the server
      await new Promise(resolve => setTimeout(resolve, 100));
    } catch (error) {
      console.warn(`Failed to fetch audio for "${word}":`, error);
    }
  }

  return results;
}

/**
 * Extract word ID from LingDocs URL
 */
export function extractWordIdFromUrl(url: string): string | null {
  try {
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split('/');

    // LingDocs URLs typically have format: /word?id=1234567890
    const idParam = urlObj.searchParams.get('id');
    if (idParam) {
      return idParam;
    }

    return null;
  } catch (error) {
    console.warn('Failed to extract word ID from URL:', error);
    return null;
  }
}

/**
 * Generate audio filename for Anki import
 */
export function generateAudioFilename(wordId: string, originalWord: string): string {
  // Create a safe filename for the audio file
  const safeWord = originalWord.replace(/[^a-zA-Z0-9]/g, '_');
  return `${wordId}_${safeWord}.mp3`;
}

/**
 * Download audio file and prepare for Anki
 */
export async function downloadAudioForAnki(audioUrl: string, filename: string): Promise<string | null> {
  try {
    console.log(`🔄 Downloading audio: ${audioUrl} -> ${filename}`);

    // In a real implementation, this would download the audio file
    // For now, return the URL as a placeholder
    return audioUrl;

  } catch (error) {
    console.warn(`Failed to download audio ${audioUrl}:`, error);
    return null;
  }
}

