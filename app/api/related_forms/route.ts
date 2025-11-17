import { NextResponse } from 'next/server';
import { fetchVerbFormsFromD1 } from '@/app/lib/cloudflare-d1';
import { getD1Database, queryD1, queryD1First } from '@/utils/d1';
import type { RelatedFormVariant, RelatedFormsData } from '@/types';

type GrammaticalInfo = Record<string, any> | null;

const romanizedToPashtoMap: Record<string, string> = {
  wahul: 'وهل',
  wahel: 'وهل',
};

function normalizeRomanizedInput(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[^A-Za-z'\-\s]/g, '')
    .toLowerCase()
    .trim();
}

function normaliseRomanization(value: string): string {
  return value
    .normalize('NFD')
    .replace(/\p{Diacritic}+/gu, '')
    .replace(/[^\p{Letter}\p{Number}]+/gu, '')
    .toLowerCase();
}

function parseGrammaticalInfo(raw: any): GrammaticalInfo {
  if (!raw) return null;
  if (typeof raw === 'object') return raw as Record<string, any>;
  if (typeof raw === 'string') {
    try {
      return JSON.parse(raw);
    } catch {
      return { label: raw } as Record<string, any>;
    }
  }
  return null;
}

function labelFromInfo(info: GrammaticalInfo, fallback: string): string {
  if (!info) return fallback;
  return (
    info.label ||
    info.category ||
    info.case ||
    info.state ||
    info.number ||
    info.gender ||
    fallback
  );
}

function normalisePos(value?: string | null): 'verb' | 'noun' | 'adjective' | 'other' {
  if (!value) return 'other';
  const lower = value.toLowerCase();
  if (lower.includes('verb') || lower.includes('v.')) return 'verb';
  if (lower.includes('noun') || lower.includes('n.')) return 'noun';
  if (lower.includes('adj')) return 'adjective';
  return 'other';
}

function upsertVariant(
  map: Map<string, RelatedFormVariant>,
  variant: RelatedFormVariant,
  source: string,
) {
  if (!variant.form) return;

  const existing = map.get(variant.form);
  if (existing) {
    // Merge metadata while keeping the highest frequency
    map.set(variant.form, {
      ...existing,
      ...variant,
      count: Math.max(existing.count || 0, variant.count || 0),
      flags: Array.from(new Set([...(existing.flags || []), ...(variant.flags || [])])),
    });
    return;
  }

  map.set(variant.form, {
    ...variant,
    flags: variant.flags || [],
    source,
  });
}

async function collectWordFrequencyVariants(
  db: any,
  baseForm: string,
  searchedForm: string,
  limit: number,
) {
  const variants = new Map<string, RelatedFormVariant>();

  const freqRows = await queryD1<{
    pashto_word: string;
    base_form?: string | null;
    word_type?: string | null;
    pos?: string | null;
    romanization?: string | null;
    english_translation?: string | null;
    frequency_total?: number | null;
  }>(
    db,
    `SELECT pashto_word, base_form, word_type, pos, romanization, english_translation, frequency_total
     FROM word_frequencies
     WHERE base_form = ? OR pashto_word = ?
     ORDER BY frequency_total DESC
     LIMIT ?`,
    [baseForm, searchedForm, limit],
  );

  for (const row of freqRows) {
    upsertVariant(
      variants,
      {
        form: row.pashto_word,
        pos: normalisePos(row.pos || row.word_type),
        count: row.frequency_total || 0,
        romanized: row.romanization || undefined,
        label: row.english_translation || undefined,
      },
      'word_frequencies',
    );
  }

  // Also add any rows that reference this form as their base_form
  const reverseRows = await queryD1<{
    pashto_word: string;
    base_form?: string | null;
    word_type?: string | null;
    pos?: string | null;
    romanization?: string | null;
    english_translation?: string | null;
    frequency_total?: number | null;
  }>(
    db,
    `SELECT pashto_word, base_form, word_type, pos, romanization, english_translation, frequency_total
     FROM word_frequencies
     WHERE base_form = ?
     ORDER BY frequency_total DESC
     LIMIT ?`,
    [searchedForm, limit],
  );

  for (const row of reverseRows) {
    upsertVariant(
      variants,
      {
        form: row.pashto_word,
        pos: normalisePos(row.pos || row.word_type),
        count: row.frequency_total || 0,
        romanized: row.romanization || undefined,
        label: row.english_translation || undefined,
      },
      'word_frequencies',
    );
  }

  return variants;
}

async function collectVerbForms(db: any, baseForm: string, limit: number) {
  const variants = new Map<string, RelatedFormVariant>();

  const verbForms = await fetchVerbFormsFromD1(baseForm, { cap: limit });
  for (const vf of verbForms) {
    upsertVariant(
      variants,
      {
        form: vf.form,
        pos: 'verb',
        label: vf.tense && vf.person ? `${vf.tense} ${vf.person}` : vf.tense || 'verb',
        score: vf.confidence,
      },
      'verb_forms',
    );
  }

  // If nothing came back, try using form_to_root to trace the lemma
  if (variants.size === 0) {
    const rooted = await queryD1First<{ root_word: string }>(
      db,
      `SELECT root_word FROM form_to_root WHERE word_form = ? ORDER BY frequency DESC LIMIT 1`,
      [baseForm],
    );

    if (rooted?.root_word && rooted.root_word !== baseForm) {
      const fallbackForms = await fetchVerbFormsFromD1(rooted.root_word, { cap: limit });
      for (const vf of fallbackForms) {
        upsertVariant(
          variants,
          {
            form: vf.form,
            pos: 'verb',
            label: vf.tense && vf.person ? `${vf.tense} ${vf.person}` : vf.tense || 'verb',
            score: vf.confidence,
            flags: ['root-trace'],
          },
          'verb_forms',
        );
      }
    }
  }

  return variants;
}

async function collectNounInflections(
  db: any,
  baseForm: string,
  limit: number,
  lexicon?: { gender?: string | null; plural_type?: string | null },
) {
  const variants = new Map<string, RelatedFormVariant>();

  const rows = await queryD1<{
    inflected_form: string;
    grammatical_info?: any;
    frequency?: number | null;
  }>(
    db,
    `SELECT inflected_form, grammatical_info, frequency
     FROM inflections
     WHERE base_form = ?
     ORDER BY frequency DESC
     LIMIT ?`,
    [baseForm, limit],
  );

  for (const row of rows) {
    const info = parseGrammaticalInfo(row.grammatical_info);
    const label = labelFromInfo(info, 'Inflection');

    upsertVariant(
      variants,
      {
        form: row.inflected_form,
        pos: 'noun',
        count: row.frequency || 0,
        label,
        inflectionType: info?.category || info?.case || undefined,
        inflectionCategory: info?.category,
        grammaticalCase: (info?.case || info?.state)?.toString(),
        grammaticalNumber: info?.number?.toString(),
        gender: info?.gender?.toString() || lexicon?.gender || undefined,
        pluralType: lexicon?.plural_type || undefined,
        lexicalGender: lexicon?.gender || undefined,
        grammaticalInfo: info,
      },
      'inflections',
    );
  }

  return variants;
}

function buildResponse(
  variants: Map<string, RelatedFormVariant>,
  metadata: { baseForm: string; searchedForm: string; posGuess?: string; romanized?: string; english?: string },
): RelatedFormsData {
  const verbs: RelatedFormVariant[] = [];
  const nouns: RelatedFormVariant[] = [];
  const adjectives: RelatedFormVariant[] = [];
  const other: RelatedFormVariant[] = [];

  for (const variant of variants.values()) {
    const bucket = variant.pos || normalisePos(variant.pos);
    if (bucket === 'verb') verbs.push(variant);
    else if (bucket === 'noun') nouns.push(variant);
    else if (bucket === 'adjective') adjectives.push(variant);
    else other.push(variant);
  }

  const total = verbs.length + nouns.length + adjectives.length + other.length;

  const variantDetails = [
    verbs.length > 0
      ? { type: 'verb', count: verbs.length, groups: [{ key: 'verb_forms', label: 'Verb Forms', items: verbs }] }
      : null,
    nouns.length > 0
      ? { type: 'noun', count: nouns.length, groups: [{ key: 'noun_forms', label: 'Noun Forms', items: nouns }] }
      : null,
    adjectives.length > 0
      ? { type: 'adjective', count: adjectives.length, groups: [{ key: 'adjective_forms', label: 'Adjective Forms', items: adjectives }] }
      : null,
    other.length > 0
      ? { type: 'other', count: other.length, groups: [{ key: 'other_forms', label: 'Other Forms', items: other }] }
      : null,
  ].filter(Boolean);

  const forms = {
    verbs,
    nouns,
    adjectives,
    other,
  };

  return {
    root: metadata.baseForm,
    searchedForm: metadata.searchedForm,
    total,
    verbs,
    nouns,
    adjectives,
    other,
    forms,
    variantDetails,
    posGuess: metadata.posGuess,
    romanization: metadata.romanized,
    english: metadata.english,
  };
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const form = (body?.form || '').toString().trim();
    const limit = Math.min(Math.max(Number(body?.limit) || 120, 10), 400);

    if (!form) {
      return NextResponse.json({ error: 'Missing form in request body' }, { status: 400 });
    }

    const db = getD1Database();
    if (!db) {
      return NextResponse.json({ error: 'Cloudflare D1 database is not configured' }, { status: 503 });
    }

    // Find the primary word entry (for metadata and base form)
    let lookupForm = form;

    const normalizedRoman = /^[A-Za-z\s'-]+$/.test(form) ? normalizeRomanizedInput(form) : '';
    if (normalizedRoman && romanizedToPashtoMap[normalizedRoman]) {
      lookupForm = romanizedToPashtoMap[normalizedRoman];
    }

    let primary: {
      pashto_word: string;
      base_form?: string | null;
      word_type?: string | null;
      pos?: string | null;
      romanization?: string | null;
      english_translation?: string | null;
      frequency_total?: number | null;
    } | null =
      (await queryD1First<{
        pashto_word: string;
        base_form?: string | null;
        word_type?: string | null;
        pos?: string | null;
        romanization?: string | null;
        english_translation?: string | null;
        frequency_total?: number | null;
      }>(
        db,
        `SELECT pashto_word, base_form, word_type, pos, romanization, english_translation, frequency_total
         FROM word_frequencies
         WHERE pashto_word = ?
         LIMIT 1`,
        [lookupForm],
      )) || null;

    if (!primary) {
      primary =
        (await queryD1First<{
          pashto_word: string;
          base_form?: string | null;
          word_type?: string | null;
          pos?: string | null;
          romanization?: string | null;
          english_translation?: string | null;
          frequency_total?: number | null;
        }>(
          db,
          `SELECT pashto_word, base_form, word_type, pos, romanization, english_translation, frequency_total
           FROM word_frequencies
           WHERE lower(romanization) = lower(?)
           LIMIT 1`,
          [lookupForm],
        )) || null;
    }

    if (!primary) {
      const fallbackRomanized = normaliseRomanization(form);
      const likeTerm = `%${form}%`;
      const romanizedRows = await queryD1<{
        pashto_word: string;
        base_form?: string | null;
        word_type?: string | null;
        pos?: string | null;
        romanization?: string | null;
        english_translation?: string | null;
        frequency_total?: number | null;
      }>(
        db,
        `SELECT pashto_word, base_form, word_type, pos, romanization, english_translation, frequency_total
         FROM word_frequencies
         WHERE lower(romanization) LIKE lower(?)
         ORDER BY frequency_total DESC
         LIMIT 200`,
        [likeTerm],
      );

      primary =
        romanizedRows.find((row) => {
          const normalisedRow = row.romanization ? normaliseRomanization(row.romanization) : '';
          return normalisedRow.includes(fallbackRomanized) || fallbackRomanized.includes(normalisedRow);
        }) || null;
    }

    const nounLexicon = await queryD1First<{
      gender?: string | null;
      plural_type?: string | null;
      animacy?: string | null;
    }>(
      db,
      `SELECT gender, plural_type, animacy
       FROM nouns_lexicon
       WHERE pashto_word = ? OR pashto_word = ?
       LIMIT 1`,
      [lookupForm, primary?.base_form || primary?.pashto_word || lookupForm],
    );

    // If not found directly, try to trace through form_to_root
    const tracedRoot = !primary
      ? await queryD1First<{ root_word: string }>(
          db,
          `SELECT root_word FROM form_to_root WHERE word_form = ? ORDER BY frequency DESC LIMIT 1`,
          [lookupForm],
        )
      : null;

    const baseForm = primary?.base_form || primary?.pashto_word || tracedRoot?.root_word || lookupForm;
    const posGuess = normalisePos(primary?.pos || primary?.word_type || null);

    const variants = await collectWordFrequencyVariants(db, baseForm, form, limit);

    if (posGuess === 'noun' || Array.from(variants.values()).some(v => v.pos === 'noun')) {
      const nounVariants = await collectNounInflections(db, baseForm, limit, nounLexicon || undefined);
      nounVariants.forEach(v => upsertVariant(variants, v, 'inflections'));
    }

    if (posGuess === 'verb' || Array.from(variants.values()).some(v => v.pos === 'verb')) {
      const verbVariants = await collectVerbForms(db, baseForm, limit);
      verbVariants.forEach(v => upsertVariant(variants, v, 'verb_forms'));
    }

    if (!variants.has(baseForm)) {
      upsertVariant(
        variants,
        {
          form: baseForm,
          pos: posGuess,
          count: primary?.frequency_total || 0,
          romanized: primary?.romanization || undefined,
          label: primary?.english_translation || undefined,
          gender: nounLexicon?.gender || undefined,
          pluralType: nounLexicon?.plural_type || undefined,
          lexicalGender: nounLexicon?.gender || undefined,
        },
        'base_form',
      );
    }

    const response = buildResponse(variants, {
      baseForm,
      searchedForm: form,
      posGuess,
      romanized: primary?.romanization || undefined,
      english: primary?.english_translation || undefined,
    });

    return NextResponse.json(response);
  } catch (error: any) {
    console.error('Failed to get related forms:', error);
    return NextResponse.json({ error: 'Failed to get related forms' }, { status: 500 });
  }
}
