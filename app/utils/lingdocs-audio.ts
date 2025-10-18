// Stub file for LingDocs audio utilities
// These functions are not currently implemented but are needed for build

export async function fetchLingDocsAudio(word: string): Promise<string | null> {
  // Stub implementation - returns null for now
  console.warn(`fetchLingDocsAudio called for ${word} - not implemented`);
  return null;
}

export function generateAudioFilename(wordId: string, word: string): string {
  // Stub implementation - returns a placeholder filename
  // Use wordId if provided, otherwise fall back to word
  const identifier = wordId || word;
  return `audio_${identifier.replace(/[^a-zA-Z0-9]/g, '_')}.mp3`;
}
