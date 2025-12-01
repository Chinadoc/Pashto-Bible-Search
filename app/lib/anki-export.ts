import { saveAs } from 'file-saver';
// @ts-expect-error - No types available for anki-apkg-export
import AnkiExport from 'anki-apkg-export';

export interface AnkiCardData {
    verseRef: string;
    verseText: string;
    definition: string;
    romanization: string;
    audioUrl?: string | null;
}

export async function generateAnkiDeck(cards: AnkiCardData[], deckName: string = 'Pashto Bible Verses') {
    const apkg = new AnkiExport(deckName);

    for (const card of cards) {
        const front = `<div style="text-align: center; font-family: 'Noto Naskh Arabic', sans-serif; font-size: 24px;">${card.verseText}</div>`;

        const back = `
      <div style="text-align: center; margin-bottom: 20px;">
        <div style="font-weight: bold; color: #4b5563;">${card.definition}</div>
        <div style="font-style: italic; color: #6b7280;">${card.romanization}</div>
      </div>
      <hr>
      <div style="text-align: center; margin-top: 20px;">
        <div style="font-family: 'Noto Naskh Arabic', sans-serif; font-size: 20px; margin-bottom: 10px;">${card.verseRef}</div>
        ${card.audioUrl ? `[sound:${card.verseRef.replace(/[: ]/g, '_')}.mp3]` : ''}
      </div>
    `;

        apkg.addCard(front, back);

        if (card.audioUrl) {
            try {
                const response = await fetch(card.audioUrl);
                const blob = await response.blob();
                apkg.addMedia(`${card.verseRef.replace(/[: ]/g, '_')}.mp3`, blob);
            } catch (e) {
                console.error(`Failed to download audio for ${card.verseRef}`, e);
            }
        }
    }

    const zip = await apkg.save();
    saveAs(zip, `${deckName.replace(/\s+/g, '_')}.apkg`);
}
