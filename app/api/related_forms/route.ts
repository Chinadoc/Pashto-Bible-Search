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
      // Try exact match first
      let pick = dictionaryByRomanized.get(root.toLowerCase())?.[0];
      
      // If no exact match, try accent-normalized match
      if (!pick) {
        const normalizedRoot = root.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        for (const [key, entries] of dictionaryByRomanized.entries()) {
          const normalizedKey = key.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
          if (normalizedKey === normalizedRoot) {
            pick = entries[0];
            break;
          }
        }
      }
      
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

    // Generate variants based on POS (using enhanced LingDocs adapter)
    const groups: { nouns?: Variant[]; verbs?: Variant[]; other?: Variant[] } = {};

    console.log(`🔍 Generating variants for "${normalized}" (POS: ${posGuess})`);

    if (posGuess === "noun") {
      groups.nouns = await generateNounVariants(normalized, { cap: 30 });
      console.log(`✅ Generated ${groups.nouns?.length || 0} noun forms`);
    } else if (posGuess === "verb") {
      // Use enhanced generation with higher cap for verbs
      groups.verbs = await generateVerbVariantsUtil(normalized, { cap: 60, includeCompound: true });
      console.log(`✅ Generated ${groups.verbs?.length || 0} verb forms`);
    } else {
      // Try both for ambiguous terms
      const [nouns, verbs] = await Promise.all([
        generateNounVariants(normalized, { cap: 20 }),
        generateVerbVariantsUtil(normalized, { cap: 40, includeCompound: true }),
      ]);
      if (nouns.length) groups.nouns = nouns;
      if (verbs.length) groups.verbs = verbs;
      console.log(`✅ Generated ${nouns.length} nouns, ${verbs.length} verbs`);
    }

    // Build forms array and enrich with frequency data
    let forms: Variant[] = [];
    for (const group of Object.values(groups)) {
      if (group) {
        forms.push(...group);
      }
    }

    // Enrich with frequency counts from Bible occurrences
    console.log(`📊 Enriching ${forms.length} forms with occurrence data...`);
    forms = forms.map(f => {
      const occurrenceCount = frequencyMap.get(f.form) ?? 0;
      if (occurrenceCount > 0) {
        console.log(`  ✅ ${f.form} found ${occurrenceCount} times in Bible`);
      }
      return {
        ...f,
        count: occurrenceCount || f.count || 0,
        score: occurrenceCount || f.score || 0,
      };
    });

    // Sort by frequency (most common first)
    forms = forms.sort((a, b) => (b.count ?? 0) - (a.count ?? 0));

    const total = forms.length;

    // Update groups with enriched counts
    const enrichedGroups: typeof groups = {};
    if (groups.nouns) enrichedGroups.nouns = forms.filter(f => f.pos === 'noun');
    if (groups.verbs) enrichedGroups.verbs = forms.filter(f => f.pos === 'verb');
    if (groups.other) enrichedGroups.other = forms.filter(f => f.pos !== 'noun' && f.pos !== 'verb');

    const variantDetails = {
      root: normalized,
      forms: enrichedGroups,
      total,
    };

    const payload: RelatedFormsResponse = {
      root: normalized,
      forms: enrichedGroups,
      total,
      variantDetails,
      ms: Date.now() - startedAt,
    };

    console.log(`✅ Returning ${total} forms with occurrence counts (${Date.now() - startedAt}ms)`);

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
