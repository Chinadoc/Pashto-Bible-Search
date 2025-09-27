import { NextRequest, NextResponse } from 'next/server';

import { getLightweightData } from '@/app/lib/data/load';
import { generateNounVariants } from '@/app/utils/noun_variants';
import { generateVerbVariants as generateVerbVariantsUtil } from '@/app/utils/verb_variants';

export const runtime = 'nodejs';

type Payload = {
  form?: string;
  word?: string;
  lemma?: string;
  root?: string;
  query?: string;
};

type Variant = {
  form: string;
  label: string;
  pos: 'noun'|'verb'|'adjective'|'other';
  score?: number;
  count?: number;
  romanized?: string;
  flags?: string[];
};

type RelatedFormsResponse = {
  root: string;
  forms: { nouns?: Variant[]; verbs?: Variant[]; other?: Variant[] };
  total: number;
  variantDetails?: any;
  ms: number;
};

const CACHE = new Map<string, { value: RelatedFormsResponse; until: number }>();
const CACHE_TTL_MS = 15 * 60 * 1000; // 15 minutes

function getCache(key: string): RelatedFormsResponse | null {
  const c = CACHE.get(key);
  if (c && Date.now() < c.until) return c.value;
  CACHE.delete(key);
  return null;
}

function setCache(key: string, value: RelatedFormsResponse) {
  CACHE.set(key, { value, until: Date.now() + CACHE_TTL_MS });
}

function isLatinOnly(s: string): boolean {
  return !/[ا-ی]/u.test(s);
}

export async function POST(req: NextRequest) {
  const startedAt = Date.now();
  try {
    const body = (await req.json().catch(() => ({}))) as Payload;
    const input = body.form ?? body.word ?? body.lemma ?? body.root ?? body.query ?? '';
    const root = input.trim();

    if (!root) {
      return NextResponse.json({ error: 'form is required' }, { status: 400 });
    }

    // Check cache first
    const cacheKey = JSON.stringify({ root });
    const cached = getCache(cacheKey);
    if (cached) {
      return NextResponse.json(cached);
    }

    const { dictionaryByRomanized, dictionaryByPashto, frequencyMap } = await getLightweightData();

    // Normalization (local)
    let normalized = root;
    if (isLatinOnly(root)) {
      const pick = dictionaryByRomanized.get(root.toLowerCase())?.[0];
      normalized = pick?.pashto ?? root;
    }

    // POS guess from dictionary
    let posGuess: 'noun' | 'verb' | 'adjective' | 'other' = 'other';
    const dictEntry = dictionaryByPashto.get(normalized);
    if (dictEntry?.pos) {
      const posLower = dictEntry.pos.toLowerCase();
      if (posLower.startsWith("verb")) posGuess = "verb";
      else if (posLower.startsWith("noun")) posGuess = "noun";
      else if (posLower.startsWith("adj")) posGuess = "adjective";
      else posGuess = "other";
    }

    // Generate variants based on POS
    const groups: { nouns?: Variant[]; verbs?: Variant[]; other?: Variant[] } = {};

    if (posGuess === "noun") {
      groups.nouns = await generateNounVariants(normalized, { cap: 30 });
    } else if (posGuess === "verb") {
      groups.verbs = await generateVerbVariantsUtil(normalized, { cap: 30, includeCompound: true });
    } else {
      // Try both for ambiguous terms
      const [nouns, verbs] = await Promise.all([
        generateNounVariants(normalized, { cap: 20 }),
        generateVerbVariantsUtil(normalized, { cap: 20, includeCompound: true }),
      ]);
      if (nouns.length) groups.nouns = nouns;
      if (verbs.length) groups.verbs = verbs;
    }

    // Build forms array and enrich with frequency data
    let forms: Variant[] = [];
    for (const group of Object.values(groups)) {
      if (group) {
        forms.push(...group);
      }
    }

    // Enrich with frequency counts
    forms = forms.map(f => ({
      ...f,
      count: frequencyMap.get(f.form) ?? f.count,
      score: frequencyMap.get(f.form) ?? f.score ?? 0
    }));

    const total = forms.length;

    const variantDetails = {
      root: normalized,
      forms: groups,
      total,
    };

    const payload: RelatedFormsResponse = {
      root: normalized,
      forms: groups,
      total,
      variantDetails,
      ms: Date.now() - startedAt,
    };

    // Cache the result
    setCache(cacheKey, payload);

    return NextResponse.json(payload);
  } catch (error) {
    console.error('Related forms error', error);
    return NextResponse.json(
      { error: 'Related forms failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 },
    );
  }
}
