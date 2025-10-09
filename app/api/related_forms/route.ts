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
  posGuess?: string;
  metadata?: {
    hasMultiplePos: boolean;
    primaryPos: string;
    totalFormsByPos: {
      nouns: number;
      verbs: number;
      other: number;
    };
    generationStrategy: string;
  };
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

    // Generate comprehensive variants (LingDocs-style exhaustive search)
    const groups: { nouns?: Variant[]; verbs?: Variant[]; other?: Variant[] } = {};

    console.log(`🔍 Generating comprehensive variants for "${normalized}" (POS: ${posGuess})`);

    // LingDocs-style exhaustive generation - try all categories
    const [nouns, verbs, adjectives] = await Promise.all([
      generateNounVariants(normalized, { cap: 50 }), // Higher cap for comprehensive search
      generateVerbVariantsUtil(normalized, { cap: 100, includeCompound: true }), // Max for verbs
      generateNounVariants(normalized, { cap: 30 }), // Adjectives use noun patterns
    ]);

    // Categorize and deduplicate
    if (nouns.length) {
      groups.nouns = nouns.filter(f => f.pos === 'noun');
      console.log(`✅ Generated ${groups.nouns.length} unique noun forms`);
    }

    if (verbs.length) {
      groups.verbs = verbs.filter(f => f.pos === 'verb');
      console.log(`✅ Generated ${groups.verbs.length} unique verb forms`);
    }

    if (adjectives.length) {
      // Filter for adjective-like forms (could be in nouns or other)
      groups.other = adjectives.filter(f => f.pos === 'adjective' || f.form !== normalized);
      console.log(`✅ Generated ${groups.other?.length || 0} adjective/other forms`);
    }

    // For ambiguous terms, ensure we capture all possibilities
    if (posGuess === "other" && (!groups.nouns?.length && !groups.verbs?.length)) {
      console.log(`🔄 Ambiguous term detected, trying alternative approaches...`);

      // Try generating with different assumptions
      const [altNouns, altVerbs] = await Promise.all([
        generateNounVariants(normalized, { cap: 25 }),
        generateVerbVariantsUtil(normalized, { cap: 50, includeCompound: true }),
      ]);

      if (altNouns.length) groups.nouns = altNouns;
      if (altVerbs.length) groups.verbs = altVerbs;

      console.log(`✅ Alternative generation: ${altNouns.length} nouns, ${altVerbs.length} verbs`);
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

    // LingDocs-style comprehensive response
    const payload: RelatedFormsResponse = {
      root: normalized,
      forms: enrichedGroups,
      total,
      variantDetails,
      ms: Date.now() - startedAt,
      posGuess,
      // Enhanced LingDocs-style metadata
      metadata: {
        hasMultiplePos: Object.keys(enrichedGroups).length > 1,
        primaryPos: posGuess,
        totalFormsByPos: {
          nouns: enrichedGroups.nouns?.length || 0,
          verbs: enrichedGroups.verbs?.length || 0,
          other: enrichedGroups.other?.length || 0,
        },
        generationStrategy: posGuess === "other" ? "ambiguous_exhaustive" : "pos_specific",
      },
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
