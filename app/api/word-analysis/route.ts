import { NextRequest, NextResponse } from 'next/server';
import { getD1ClientOrThrow, getFormOccurrencesFromD1, getWordFrequency, parseD1Json } from '@/utils/d1-helpers';

// Word analysis endpoint - returns rich linguistic information
export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    const { word } = await request.json();

    if (!word?.trim()) {
      return NextResponse.json({ error: 'Word parameter required' }, { status: 400 });
    }

    const db = getD1ClientOrThrow();
    const normalizedWord = word.trim();

    // Determine compound elements
    const isCompoundPhrase = normalizedWord.includes(' ');
    const wordParts = isCompoundPhrase ? normalizedWord.split(' ').filter(Boolean) : [normalizedWord];
    const auxiliaryVerb = isCompoundPhrase ? wordParts[wordParts.length - 1] : null;
    const compoundNoun = isCompoundPhrase && wordParts.length >= 2 ? wordParts.slice(0, -1).join(' ') : null;

    // Helper to query nouns_lexicon
    const nounRow = await db.queryFirst<{
      pashto_word: string;
      plural_forms?: string;
      inflection_pattern?: number;
      gender?: string;
    }>(
      `SELECT pashto_word, plural_forms, inflection_pattern, gender FROM nouns_lexicon WHERE pashto_word = ? LIMIT 1`,
      [normalizedWord]
    );

    // Helper to query verbs_lexicon
    const verbCandidate = auxiliaryVerb || normalizedWord;
    const verbRow = await db.queryFirst<{
      pashto_word: string;
      imperfective_stem?: string;
      perfective_stem?: string;
      perfective_root?: string;
      past_participle?: string;
      romanization?: string;
      english?: string;
    }>(
      `SELECT pashto_word, imperfective_stem, perfective_stem, perfective_root, past_participle, romanization, english FROM verbs_lexicon WHERE pashto_word = ? LIMIT 1`,
      [verbCandidate]
    );

    const irregularRow = await db.queryFirst<{
      root?: string;
      past_participle?: string;
      notes?: string;
    }>(
      `SELECT root, past_participle, notes FROM irregular_verbs WHERE root = ? LIMIT 1`,
      [verbCandidate]
    );

    // Related forms via form_to_root
    const formRoots = await db.query<{ form: string; root: string }>(
      `SELECT form, root FROM form_to_root WHERE form = ? OR root = ? LIMIT 50`,
      [normalizedWord, normalizedWord]
    );

    // Inflections for conjugations/variants
    const inflectionRows = await db.query<{ inflected_form: string; grammatical_info?: string }>(
      `SELECT inflected_form, grammatical_info FROM inflections WHERE base_form = ? LIMIT 200`,
      [verbCandidate]
    );

    // Build analysis object
    const analysis: any = {
      word: normalizedWord,
      timestamp: Date.now(),
      categories: [],
    };

    // Verb handling
    if (verbRow || irregularRow) {
      const stems = {
        imperfective: verbRow?.imperfective_stem || '',
        perfective: verbRow?.perfective_stem || '',
      };
      const roots = {
        imperfective: verbRow?.perfective_root || verbCandidate,
        perfective: verbRow?.perfective_root || '',
      };

      // Build conjugation map from inflections
      const conjugations: Record<string, Record<string, string>> = {};
      if (inflectionRows) {
        for (const row of inflectionRows) {
          const forms = parseD1Json<any[]>(row.inflected_form, []);
          const info = parseD1Json<Record<string, any>>(row.grammatical_info ?? '{}', {});
          const tense = info.tense || info.label;
          const person = info.person || 'third';
          const number = info.number || 'singular';
          if (!tense) continue;
          if (!conjugations[tense]) conjugations[tense] = {};
          forms.forEach((item) => {
          if (item?.form) {
              conjugations[tense][`${person}_${number}`] = item.form;
            }
          });
        }
      }

      analysis.categories.push({
        type: isCompoundPhrase ? 'compound_verb' : irregularRow ? 'irregular_verb' : 'regular_verb',
        part_of_speech: 'verb',
        stems,
        roots,
        compound_info: isCompoundPhrase
          ? {
              full_phrase: normalizedWord,
              noun_part: compoundNoun,
              auxiliary_verb: auxiliaryVerb,
            }
          : null,
        past_participle: verbRow?.past_participle || irregularRow?.past_participle || '',
        romanization: verbRow?.romanization || '',
        english: verbRow?.english || irregularRow?.notes || '',
        conjugations,
      });
    }

    // Noun handling
    if (nounRow) {
      analysis.categories.push({
        type: 'noun',
        part_of_speech: 'noun',
        gender: nounRow.gender || 'unknown',
        plural_forms: parseD1Json<string[]>(nounRow.plural_forms, []),
        inflection_pattern: nounRow.inflection_pattern ?? null,
      });
    }

    // Related forms
    const relatedForms = new Set<string>();
    if (formRoots) {
      formRoots.forEach((row) => {
        if (row.form) relatedForms.add(row.form);
        if (row.root) relatedForms.add(row.root);
      });
    }

    if (relatedForms.size > 0) {
      analysis.related_forms = Array.from(relatedForms).slice(0, 50);
    }

    // Frequency info
    const frequencyInfo = await getWordFrequency(db, normalizedWord);
    if (frequencyInfo) {
      analysis.frequency = {
        count: frequencyInfo.frequency,
        rank: frequencyInfo.rank ?? 0,
        translation_breakdown: frequencyInfo.translationTotals,
      };
    }

    // Occurrence references
    const occurrenceInfo = await getFormOccurrencesFromD1(db, normalizedWord);
    if (occurrenceInfo) {
      analysis.occurrences = {
        count: occurrenceInfo.frequency,
        verse_refs: occurrenceInfo.verseRefs,
      };
    }

    return NextResponse.json({
      analysis,
      ms: Date.now() - startTime,
    });
  } catch (error) {
    console.error('Word analysis error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze word' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Word analysis endpoint. Use POST with {"word": "your_word"}',
  });
}
