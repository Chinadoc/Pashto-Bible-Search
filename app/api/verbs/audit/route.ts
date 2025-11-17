import { NextResponse } from 'next/server';

import { getD1Database, queryD1, queryD1First } from '@/utils/d1';

type TranslationKey = 'afghan2023' | 'yousafzai2019';

const TRANSLATION_TABLES: Record<TranslationKey, string> = {
  afghan2023: 'verses_afghan2023',
  yousafzai2019: 'verses_yousafzai',
};

function parseRefs(raw: any): string[] {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw as string[];
  if (typeof raw === 'string') {
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
}

async function scanVersesForForm(
  db: any,
  form: string,
  translation: TranslationKey,
  sampleCap: number,
): Promise<{ count: number; sample: string[] }> {
  const table = TRANSLATION_TABLES[translation];

  const countRow = await queryD1First<{ count: number }>(
    db,
    `SELECT COUNT(*) as count FROM ${table} WHERE text LIKE '%' || ? || '%'`,
    [form],
  );

  const sample = await queryD1<{ ref: string }>(
    db,
    `SELECT ref FROM ${table} WHERE text LIKE '%' || ? || '%' LIMIT ?`,
    [form, sampleCap],
  );

  return {
    count: countRow?.count || 0,
    sample: sample.map(row => row.ref),
  };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lemma = (searchParams.get('lemma') || searchParams.get('form') || '').trim();
  const cap = Math.min(Math.max(Number(searchParams.get('cap')) || 120, 20), 500);
  const scanVerses = searchParams.get('scan') === 'true';
  const scanSample = Math.min(Math.max(Number(searchParams.get('sample')) || 10, 5), 50);

  if (!lemma) {
    return NextResponse.json({ error: 'Missing lemma/form query parameter' }, { status: 400 });
  }

  const db = getD1Database();
  if (!db) {
    return NextResponse.json({ error: 'Cloudflare D1 database is not configured' }, { status: 503 });
  }

  // 1) Pull lexicon metadata to anchor the lemma
  const lexiconRows = await queryD1<any>(
    db,
    `SELECT * FROM verbs_lexicon
     WHERE pashto_word = ? OR verb_root = ?
     ORDER BY updated_at DESC
     LIMIT 3`,
    [lemma, lemma],
  );

  const lexicon = lexiconRows[0] || null;
  const canonicalLemma = lexicon?.verb_root || lexicon?.pashto_word || lemma;

  // 2) Frequency rows tied to the lemma or its base form
  const frequencyRows = await queryD1<any>(
    db,
    `SELECT pashto_word, base_form, word_type, pos, frequency_total, translation_key, romanization, english_translation
     FROM word_frequencies
     WHERE pashto_word = ? OR base_form = ?
     ORDER BY frequency_total DESC
     LIMIT ?`,
    [canonicalLemma, canonicalLemma, cap],
  );

  // 3) Conjugated forms from verb_forms
  const verbForms = await queryD1<any>(
    db,
    `SELECT form, tense, person, voice, helper, lemma, base_verb, source_word_id
     FROM verb_forms
     WHERE lemma = ? OR base_verb = ?
     ORDER BY tense, person
     LIMIT ?`,
    [canonicalLemma, canonicalLemma, cap],
  );

  // 4) Occurrences already indexed
  const occurrenceRows = await queryD1<any>(
    db,
    `SELECT pashto_form, base_form, translation_key, frequency, verse_refs
     FROM form_occurrences
     WHERE pashto_form = ? OR base_form = ?
     ORDER BY frequency DESC
     LIMIT ?`,
    [canonicalLemma, canonicalLemma, cap],
  );

  const occurrencesByForm = new Map<string, Array<{ translation: string | null; frequency: number; refs: string[] }>>();
  for (const row of occurrenceRows) {
    const key = row.pashto_form;
    const bucket = occurrencesByForm.get(key) || [];
    bucket.push({
      translation: row.translation_key || null,
      frequency: row.frequency || 0,
      refs: parseRefs(row.verse_refs),
    });
    occurrencesByForm.set(key, bucket);
  }

  // 5) Identify missing conjugations and optionally scan verses tables
  const missingForms: string[] = [];
  const scanned: Array<{
    form: string;
    translation: TranslationKey;
    count: number;
    sample: string[];
  }> = [];

  for (const vf of verbForms) {
    if (!occurrencesByForm.has(vf.form)) {
      missingForms.push(vf.form);
      if (scanVerses) {
        for (const translation of Object.keys(TRANSLATION_TABLES) as TranslationKey[]) {
          const result = await scanVersesForForm(db, vf.form, translation, scanSample);
          scanned.push({ form: vf.form, translation, count: result.count, sample: result.sample });
        }
      }
    }
  }

  return NextResponse.json({
    lemma: canonicalLemma,
    input: lemma,
    lexicon,
    frequencies: frequencyRows,
    verbForms: {
      count: verbForms.length,
      forms: verbForms,
    },
    occurrences: {
      indexed: occurrenceRows.length,
      byForm: Array.from(occurrencesByForm.entries()).map(([form, entries]) => ({ form, entries })),
      missingForms,
      scanned: scanVerses ? scanned : undefined,
    },
  });
}

