import 'server-only';
import { getData } from './data/load';

const PASHTO_CHAR_RE = /[\u0600-\u06FF]/;

export type NormalizedQuery = {
  normalized: string;
  romanization?: string;
  detectedPos?: string;
  usedDictionary: boolean;
};

const romanSanitise = (value: string): string => value
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .replace(/[^A-Za-z'\-\s]/g, '')
  .toLowerCase()
  .trim();

export async function normalizeQuery(input: string): Promise<NormalizedQuery> {
  const query = input.trim();
  if (!query) {
    return { normalized: '', usedDictionary: false };
  }

  if (PASHTO_CHAR_RE.test(query)) {
    return { normalized: query, usedDictionary: false };
  }

  const { dictionary, dictionaryByRomanized, frequencyMap, unaccent } = await getData();
  const key = romanSanitise(query);
  if (!key) {
    return { normalized: query, usedDictionary: false };
  }

  const candidates = dictionaryByRomanized.get(key) ?? dictionary.filter((entry) => {
    const entryKey = romanSanitise(entry.romanized);
    return entryKey.includes(key);
  });

  if (!candidates.length) {
    return { normalized: query, romanization: query, usedDictionary: false };
  }

  const scored = candidates
    .map((entry) => {
      const pashto = entry.pashto;
      const romanized = entry.romanized;
      const pos = entry.pos?.toLowerCase() ?? '';
      const pashtoTokens = pashto.split(/\s+/).filter(Boolean).length;
      const romanTokens = romanized.split(/\s+/).filter(Boolean).length;
      const exactRoman = romanSanitise(romanized) === key;
      const frequency = frequencyMap.get(pashto) ?? 0;
      const isVerb = pos.startsWith('v');
      const isTransitiveVerb = isVerb && pos.includes('trans');

      let score = 0;
      if (exactRoman) score += 200;
      if (romanTokens === 1) score += 40;
      if (pashtoTokens === 1) score += 40;
      if (isTransitiveVerb) score += 30;
      else if (isVerb) score += 20;
      if (romanTokens > 1) score -= romanTokens * 10;

      if (frequency > 0) {
        score += Math.min(50, Math.log10(1 + frequency) * 12);
      }

      // Prefer the bare helper verb وهل when matching "wahul"
      if (pashto === 'وهل') score += 120;

      // Secondary boost using similarity of romanised string
      const overlap = unaccent(romanized).includes(unaccent(query)) ? 10 : 0;
      score += overlap;

      return { entry, score };
    })
    .sort((a, b) => b.score - a.score);

  const best = scored[0].entry;
  return {
    normalized: best.pashto,
    romanization: best.romanized,
    detectedPos: best.pos,
    usedDictionary: true,
  };
}

export function containsPashto(input: string): boolean {
  return PASHTO_CHAR_RE.test(input);
}