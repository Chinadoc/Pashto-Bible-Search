import { describe, expect, it } from 'vitest';
import { planClips, clipKey } from '../cloudflare/clip-planner';

const word = (text: string, start: number, end: number, type = 'word') => ({ text, start, end, type });

describe('planClips', () => {
  it('returns nothing for no words', () => {
    expect(planClips([])).toEqual([]);
  });

  it('keeps one clip while speech is continuous and short', () => {
    const clips = planClips([word('a', 0, 1), word('b', 1.2, 2)]);
    expect(clips).toHaveLength(1);
    expect(clips[0]).toMatchObject({ segment_number: 1, start_time: 0, end_time: 2, duration: 2, text: 'a b' });
  });

  it('cuts at a pause longer than 0.5 seconds', () => {
    const clips = planClips([word('a', 0, 1), word('b', 1.6, 2), word('c', 2.1, 3)]);
    expect(clips.map(c => [c.start_time, c.end_time])).toEqual([[0, 1], [1.6, 3]]);
    expect(clips.map(c => c.segment_number)).toEqual([1, 2]);
  });

  it('does not cut at a pause of exactly 0.5 seconds', () => {
    expect(planClips([word('a', 0, 1), word('b', 1.5, 2)])).toHaveLength(1);
  });

  it.each(['.', '؟', '۔', '!', '?', '،', '؛', ':', '»'])('cuts after a word ending in %s', (mark) => {
    const clips = planClips([word(`a${mark}`, 0, 1), word('b', 1.1, 2)]);
    expect(clips.map(c => c.text)).toEqual([`a${mark}`, 'b']);
  });

  it('cuts once a clip passes 6 seconds', () => {
    const words = Array.from({ length: 10 }, (_, i) => word(`w${i}`, i, i + 1));
    const clips = planClips(words);
    expect(clips[0].end_time).toBe(7);
    expect(clips[1].start_time).toBe(7);
    expect(clips[1].end_time).toBe(10);
  });

  it('ignores spacing, audio events and words with no timing', () => {
    const clips = planClips([
      word('a', 0, 1),
      word(' ', 1, 1.1, 'spacing'),
      word('(music)', 1.1, 9, 'audio_event'),
      { text: 'x', start: null, end: null, type: 'word' },
      word('b', 1.2, 2),
    ]);
    expect(clips).toHaveLength(1);
    expect(clips[0].text).toBe('a b');
    expect(clips[0].words).toHaveLength(2);
  });

  it('keeps every clip inside the word timestamps, in order, with no overlap', () => {
    const words = Array.from({ length: 200 }, (_, i) => word(`w${i}`, i * 0.7, i * 0.7 + 0.5));
    const clips = planClips(words);
    for (let i = 1; i < clips.length; i++) expect(clips[i].start_time).toBeGreaterThanOrEqual(clips[i - 1].end_time);
    expect(clips.flatMap(c => c.words)).toHaveLength(200);
  });

  it('names clips the way R2 stores them', () => {
    expect(clipKey('abc', 7)).toBe('videos/abc/clips/clip_007.mp3');
  });
});
