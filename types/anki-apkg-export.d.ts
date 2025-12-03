declare module 'anki-apkg-export' {
  export default class AnkiExport {
    constructor(deckName: string);
    addCard(front: string, back: string, tags?: { tags?: string[] }): void;
    addMedia(filename: string, data: Blob | ArrayBuffer | string): void;
    save(): Promise<Blob>;
  }
}

