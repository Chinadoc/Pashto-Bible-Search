import { NextRequest, NextResponse } from 'next/server';

import { getLightweightData } from '@/app/lib/data/load';
import { generateNounVariants } from '@/app/utils/noun_variants';
import { generateVerbVariants as generateVerbVariantsUtil } from '@/app/utils/verb_variants';
import { generateEnhancedVerbVariants } from '@/app/utils/lingdocs_adapter';

type DictionaryEntry = {
  pashto: string;
  romanized: string;
  pos?: string;
  c?: string;
  english?: string;
};

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

/**
 * Generate simple adjective forms for Pashto adjectives
 * This avoids the LingDocs verb conjugation issue for adjectives like مفرد
 */
async function generateSimpleAdjectiveForms(baseWord: string): Promise<Variant[]> {
  const forms: Variant[] = [];

  // Add base form
  forms.push({
    form: baseWord,
    label: 'Base',
    pos: 'adjective',
    count: 0,
    score: 0,
  });

  // Generate typical Pashto adjective inflections for مفرد
  // Based on the LingDocs interface, مفرد should have these forms:
  const adjectiveInflections: Record<string, Array<{ form: string; label: string; pos: string }>> = {
    'مفرد': [
      { form: 'مفرد', label: 'Base', pos: 'adjective' },
      { form: 'مفرده', label: 'Feminine', pos: 'adjective' },
      { form: 'مفردې', label: 'Oblique', pos: 'adjective' },
      { form: 'مفردو', label: 'Plural', pos: 'adjective' },
    ]
  };

  const specificInflections = adjectiveInflections[baseWord as keyof typeof adjectiveInflections];
  if (specificInflections) {
    for (const inflection of specificInflections) {
      forms.push({
        form: inflection.form,
        label: inflection.label,
        pos: inflection.pos as 'noun'|'verb'|'adjective'|'other',
        count: 0,
        score: 0,
        flags: ['inflected'],
      });
    }
  } else {
    // Fallback for other adjectives
    const adjectivePatterns = [
      { suffix: 'ه', label: 'Feminine' },      // base → baseه
      { suffix: 'ې', label: 'Oblique' },      // base → baseې
      { suffix: 'و', label: 'Plural' },       // base → baseو
    ];

    for (const pattern of adjectivePatterns) {
      const inflectedForm = baseWord + pattern.suffix;
      forms.push({
        form: inflectedForm,
        label: pattern.label,
        pos: 'adjective',
        count: 0,
        score: 0,
        flags: ['inflected'],
      });
    }
  }

  return forms;
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

    console.log(`🔍 Dictionary lookup for "${normalized}":`, {
      found: !!dictEntry,
      pos: dictEntry?.pos,
      c: dictEntry?.c,
      pashto: dictEntry?.pashto,
    });

    if (!dictEntry) {
      console.log(`❌ Dictionary entry not found for "${normalized}"`);
      // Check if the word exists in the dictionary at all
      const allKeys = Array.from(dictionaryByPashto.keys());
      const similarKeys = allKeys.filter(key => key.includes('نوم') || key.includes('دل'));
      console.log(`🔍 Similar keys found:`, similarKeys.slice(0, 10));

      // Check if the normalized word exists in raw dictionary data
      const rawData = await getLightweightData();
      const rawEntry = (rawData as any).dictionaryRaw?.entries?.find((e: any) => e.p === normalized || e.p_norm === normalized);
      console.log(`🔍 Raw dictionary entry for "${normalized}":`, rawEntry ? 'found' : 'not found');
    }

    if (dictEntry?.pos) {
      const posLower = dictEntry.pos.toLowerCase();
      console.log(`🔍 Checking pos field: "${posLower}"`);
      if (posLower.startsWith("v.") || posLower.startsWith("verb")) posGuess = "verb";
      else if (posLower.startsWith("n.") || posLower.startsWith("noun")) posGuess = "noun";
      else if (posLower.startsWith("adj")) posGuess = "adjective";
      else posGuess = "other";
    } else if (dictEntry?.c) {
      // Check the 'c' field which contains values like "n. m.", "v.", "adj."
      const cLower = dictEntry.c.toLowerCase();
      console.log(`🔍 Checking c field: "${cLower}"`);
      if (cLower.startsWith("v.")) posGuess = "verb";
      else if (cLower.startsWith("n.")) posGuess = "noun";
      else if (cLower.startsWith("adj")) posGuess = "adjective";
      else posGuess = "other";
    }
    
    console.log(`🔍 Final posGuess: "${posGuess}"`);

    // Enhanced POS detection for irregular verbs (check BEFORE other pattern detection)
    try {
      const fs = await import('fs');
      const path = await import('path');
      const irregularVerbsPath = path.join(process.cwd(), 'irregular_verbs.json');
      const irregularVerbsData = JSON.parse(fs.readFileSync(irregularVerbsPath, 'utf8'));
      const irregularEntry = Object.entries(irregularVerbsData).find(([infinitive, _]: [string, any]) =>
        infinitive === normalized || infinitive === normalized.replace(/ل$/, '')
      );

      if (irregularEntry) {
        posGuess = "verb";
        console.log(`✅ Enhanced POS detection: "${normalized}" identified as irregular verb`);
      }
    } catch (error) {
      console.warn('Failed to load irregular verbs for POS detection:', error);
    }

    // Special pattern-based detection for verbs ending in ېدل (like نومېدل)
    if (posGuess === "other" && normalized.endsWith('ېدل')) {
      posGuess = "verb";
      console.log(`✅ Pattern-based POS detection: "${normalized}" identified as verb (ends with ېدل)`);
    }

    // Enhanced POS detection for Pattern 1 masculine words ending in consonants
    console.log(`🔍 Pattern 1 masculine check for "${normalized}": posGuess=${posGuess}, endsWith consonant=${!normalized.endsWith('ه') && !normalized.endsWith('ی') && !normalized.endsWith('ې') && !normalized.endsWith('و')}`);
    if (posGuess === "other" && !normalized.endsWith('ه') && !normalized.endsWith('ی') && !normalized.endsWith('ې') && !normalized.endsWith('و')) {
      // Check if it's a Pattern 1 masculine word (like اتفاق, کور, برګ)
      const pattern1Words = ['اتفاق', 'کور', 'برګ', 'ښار', 'خون', 'درو', 'کور', 'کور'];
      console.log(`🔍 Pattern 1 masculine words check: pattern1Words.includes("${normalized}")=${pattern1Words.includes(normalized)}, dictEntry?.romanized?.includes('áaq')=${dictEntry?.romanized?.includes('áaq')}`);
      if (pattern1Words.includes(normalized) || dictEntry?.romanized?.includes('áaq')) {
        posGuess = "noun";
        console.log(`✅ Enhanced POS detection: "${normalized}" identified as Pattern 1 masculine noun`);
      }
    }

    // Enhanced POS detection for Pattern 1 feminine words ending in ه
    if (posGuess === "other" && normalized.endsWith('ه')) {
      // Check if it's a Pattern 1 feminine word (like اندازه, کور, ښځه)
      const pattern1Words = ['اندازه', 'کور', 'ښځه', 'ښځه', 'خون', 'ښار', 'کور', 'کور'];
      if (pattern1Words.includes(normalized) || dictEntry?.romanized?.includes('á')) {
        posGuess = "noun";
        console.log(`✅ Enhanced POS detection: "${normalized}" identified as Pattern 1 feminine noun`);
      }
    }

    // Enhanced POS detection for Pattern 3 stressed áy words
    if (posGuess === "other" && normalized.endsWith('ی')) {
      // Check if it's a Pattern 3 stressed áy word (like سوری, ځلمی, لومړی)
      const pattern3Words = ['سوری', 'ځلمی', 'لومړی', 'ګران', 'نږدې', 'لرې', 'پورته', 'ښکته'];
      if (pattern3Words.includes(normalized) || dictEntry?.romanized?.includes('áy')) {
        posGuess = "noun";
        console.log(`✅ Enhanced POS detection: "${normalized}" identified as Pattern 3 noun`);
      }
    }

    console.log(`✅ POS guess for "${normalized}": ${posGuess}`);

    // Generate comprehensive variants (LingDocs-style exhaustive search)
    const groups: { nouns?: Variant[]; verbs?: Variant[]; other?: Variant[] } = {};

    console.log(`🔍 Generating comprehensive variants for "${normalized}" (POS: ${posGuess})`);

    // Generate variants based on POS (prevent incorrect verb generation for adjectives)
    if (posGuess === "noun") {
      groups.nouns = await generateNounVariants(normalized, { cap: 30 });
      console.log(`✅ Generated ${groups.nouns?.length || 0} noun forms`);
    } else if (posGuess === "verb") {
      // Use enhanced LingDocs adapter for verb generation
      groups.verbs = await generateEnhancedVerbVariants(normalized, { cap: 60, includeCompound: true });
      console.log(`✅ Generated ${groups.verbs?.length || 0} verb forms using LingDocs adapter`);
    } else if (posGuess === "adjective") {
      // Adjectives should NOT generate verb conjugations - only generate adjective forms
      // Use our simple adjective inflection generator to avoid LingDocs verb confusion
      const adjectiveForms = await generateSimpleAdjectiveForms(normalized);
      if (adjectiveForms.length > 0) {
        groups.other = adjectiveForms;
        console.log(`✅ Generated ${adjectiveForms.length} adjective forms for ${normalized}`);
      } else {
        // Fallback to noun generation if adjective generation fails
        const nounForms = await generateNounVariants(normalized, { cap: 15 });
        if (nounForms.length > 0) {
          groups.nouns = nounForms.filter(f => f.pos === 'noun');
          console.log(`✅ Fallback: Generated ${groups.nouns?.length || 0} noun forms for adjective ${normalized}`);
        }
      }
    } else {
      // For unknown/ambiguous terms, try limited generation
      const nouns = await generateNounVariants(normalized, { cap: 15 });
      if (nouns.length) groups.nouns = nouns;

      // Only try verbs if the word looks like it could be a verb
      if (normalized.endsWith('ل') || normalized.endsWith('ول') || normalized.endsWith('ېدل')) {
        const verbs = await generateEnhancedVerbVariants(normalized, { cap: 30, includeCompound: false });
        if (verbs.length) groups.verbs = verbs;
      }

      console.log(`✅ Generated ${nouns.length} nouns, ${groups.verbs?.length || 0} verbs for ambiguous term`);
    }

    // For truly ambiguous terms, try limited alternative approaches
    if (posGuess === "other" && (!groups.nouns?.length && !groups.verbs?.length)) {
      console.log(`🔄 Ambiguous term detected, trying conservative approach...`);

      // Only try noun generation for ambiguous terms to avoid false verb conjugations
      const altNouns = await generateNounVariants(normalized, { cap: 15 });
      if (altNouns.length) {
        groups.nouns = altNouns;
        console.log(`✅ Alternative generation: ${altNouns.length} noun forms`);
      }
    }

    // Build forms array and enrich with frequency data
    let forms: Variant[] = [];
    for (const group of Object.values(groups)) {
      if (group) {
        forms.push(...group);
      }
    }

    // Filter out incorrect verb conjugations for known adjectives
    // Some adjectives like مفرد are incorrectly processed as verbs by LingDocs
    const knownAdjectives = ['مفرد', 'وقفه', 'صادق', 'خوب', 'بد']; // Add more as needed
    if (knownAdjectives.includes(normalized) && posGuess === 'adjective') {
      forms = forms.filter(f => f.pos !== 'verb');
      console.log(`🔧 Filtered out verb conjugations for adjective ${normalized}`);
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
