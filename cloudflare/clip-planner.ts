/**
 * Plans transcript segments and audio clips from ElevenLabs word timestamps.
 */

// One sentence per clip, so clips work as Anki cards.
const MAX_CLIP_SECONDS = 6;
const PAUSE_SECONDS = 0.5;
const SENTENCE_ENDERS = new Set(['.', '؟', '۔', '!', '?', '،', '؛', ':', '»']);

export interface InputWord {
  text?: string;
  word?: string;
  start?: number | null;
  end?: number | null;
  start_time?: number;
  end_time?: number;
  type?: string;
  confidence?: number;
}

export interface PlannedWord {
  text: string;
  start_time: number;
  end_time: number;
  confidence: number;
}

export interface PlannedClip {
  segment_number: number;
  text: string;
  start_time: number;
  end_time: number;
  duration: number;
  words: PlannedWord[];
  confidence: number;
}

export function toPlannedWords(words: InputWord[]): PlannedWord[] {
  const planned: PlannedWord[] = [];
  for (const w of words) {
    if (w.type && w.type !== 'word') continue;
    const start = w.start ?? w.start_time;
    const end = w.end ?? w.end_time;
    if (start == null || end == null) continue;
    planned.push({ text: (w.text || w.word || '').trim(), start_time: start, end_time: end, confidence: w.confidence || 0.95 });
  }
  return planned;
}

export function planClips(input: InputWord[]): PlannedClip[] {
  const words = toPlannedWords(input);
  const clips: PlannedClip[] = [];
  let current: PlannedWord[] = [];

  words.forEach((word, i) => {
    current.push(word);
    const start = current[0].start_time;
    const next = words[i + 1];
    const endsSentence = SENTENCE_ENDERS.has(word.text.slice(-1));
    const tooLong = word.end_time - start > MAX_CLIP_SECONDS;
    const longPause = next !== undefined && next.start_time - word.end_time > PAUSE_SECONDS;
    if (endsSentence || tooLong || longPause || next === undefined) {
      clips.push({
        segment_number: clips.length + 1,
        text: current.map(w => w.text).join(' '),
        start_time: start,
        end_time: word.end_time,
        duration: word.end_time - start,
        words: current,
        confidence: 0.95,
      });
      current = [];
    }
  });

  return clips;
}

export function clipKey(videoId: string, segmentNumber: number): string {
  return `videos/${videoId}/clips/clip_${String(segmentNumber).padStart(3, '0')}.mp3`;
}
