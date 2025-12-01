import { saveAs } from 'file-saver';
// @ts-expect-error - No types available for anki-apkg-export
import AnkiExport from 'anki-apkg-export';

export interface AnkiCardData {
    verseRef: string;
    verseText: string;
    verseTextHighlighted?: string; // Verse with highlighted search term
    searchWord?: string; // The word being searched (e.g., مرسته)
    searchWordRomanized?: string; // Romanization of search word (e.g., mrasta)
    definition: string;
    romanization: string;
    audioUrl?: string | null;
}

/**
 * Generate an Anki deck with proper fields:
 * 1. Word (the searched term)
 * 2. Definition/Romanization
 * 3. Bible verse (with highlighting)
 * 4. Audio (embedded in package)
 */
export async function generateAnkiDeck(cards: AnkiCardData[], deckName: string = 'Pashto Bible Verses') {
    const apkg = new AnkiExport(deckName);

    for (const card of cards) {
        // Front: Show the search word prominently with definition hint
        const front = `
<div style="text-align: center; direction: rtl;">
    <div style="font-family: 'Noto Naskh Arabic', serif; font-size: 48px; font-weight: bold; color: #2563eb; margin-bottom: 15px;">
        ${card.searchWord || ''}
    </div>
    ${card.searchWordRomanized ? `
    <div style="font-size: 18px; color: #64748b; font-style: italic; margin-bottom: 10px;">
        ${card.searchWordRomanized}
    </div>
    ` : ''}
    ${card.definition ? `
    <div style="font-size: 16px; color: #4b5563; margin-bottom: 20px;">
        ${card.definition}
    </div>
    ` : ''}
    <hr style="border-color: #e5e7eb; margin: 20px 0;">
    <div style="font-size: 14px; color: #9ca3af;">
        Find this word in the verse below:
    </div>
</div>
        `;

        // Back: Show the verse with highlighting and audio
        const verseDisplay = card.verseTextHighlighted || card.verseText;
        const back = `
<div style="text-align: center; direction: rtl;">
    <div style="font-family: 'Noto Naskh Arabic', serif; font-size: 28px; line-height: 1.8; margin-bottom: 20px;">
        ${verseDisplay}
    </div>
    
    <hr style="border-color: #e5e7eb; margin: 20px 0;">
    
    <div style="display: flex; justify-content: center; align-items: center; gap: 20px; flex-wrap: wrap;">
        <div style="font-size: 16px; font-weight: bold; color: #1e40af;">
            📖 ${card.verseRef}
        </div>
        ${card.audioUrl ? `
        <div style="font-size: 14px; color: #16a34a;">
            🔊 [sound:${card.verseRef.replace(/[: ]/g, '_')}.mp3]
        </div>
        ` : ''}
    </div>
</div>

<style>
    .highlight {
        background-color: #fef08a;
        padding: 2px 4px;
        border-radius: 4px;
        font-weight: bold;
    }
</style>
        `;

        apkg.addCard(front, back);

        // Download and embed audio if available
        if (card.audioUrl) {
            try {
                const response = await fetch(card.audioUrl);
                if (response.ok) {
                    const blob = await response.blob();
                    apkg.addMedia(`${card.verseRef.replace(/[: ]/g, '_')}.mp3`, blob);
                }
            } catch (e) {
                console.error(`Failed to download audio for ${card.verseRef}`, e);
            }
        }
    }

    const zip = await apkg.save();
    saveAs(zip, `${deckName.replace(/\s+/g, '_')}.apkg`);
}
