import { NextRequest, NextResponse } from 'next/server';
import {
  getD1ClientOrThrow,
  getFormOccurrencesFromD1,
  getWordVerseRefs,
  fetchVerseByRef,
  getWordFrequency,
} from '@/utils/d1-helpers';

export const runtime = 'nodejs';

type Scope = 'all' | 'ot' | 'nt';

type TranslationKey = 'afghan2023' | 'yousafzai2019';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      query,
      scope = 'all',
      translation = 'afghan2023',
      includeRelated = true,
      fuzzySearch = false,
    }: {
      query: string;
      scope?: Scope;
      translation?: TranslationKey;
      includeRelated?: boolean;
      fuzzySearch?: boolean;
    } = body;

    if (!query || typeof query !== 'string') {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 });
    }

    const searchTerm = query.trim();
    const startTime = Date.now();

    console.log(`🔍 Indexed search for: "${searchTerm}" (${translation}, ${scope}, fuzzy=${fuzzySearch})`);

    let db;
    try {
      db = getD1ClientOrThrow();
    } catch (error) {
      return NextResponse.json(
        { error: error instanceof Error ? error.message : String(error) },
        { status: 500 }
      );
    }

    // --------------------------------------------------------------------------
    // STEP 1: Dictionary lookup (best-effort) to normalise romanisation → Pashto
    // --------------------------------------------------------------------------
    let dictionaryMatches: Array<{ pashto: string; romanized?: string; pos?: string; english?: string }> = [];
    let lookupWords: string[] = [];

    try {
      const dictRows = await db.query<{
        word: string;
        romanization?: string;
        pos?: string;
        definition?: string;
      }>(
        `SELECT word, romanization, pos, definition FROM dictionary WHERE word = ? OR romanization LIKE ? LIMIT 20`,
        [searchTerm, `%${searchTerm}%`]
      );

      if (dictRows && dictRows.length > 0) {
        dictionaryMatches = dictRows.map((row) => ({
          pashto: row.word,
          romanized: row.romanization,
          pos: row.pos,
          english: row.definition,
        }));
        lookupWords = dictRows.map((row) => row.word).filter(Boolean);
      }
    } catch (error) {
      console.warn('Dictionary lookup failed (continuing without dictionary):', error);
    }

    if (lookupWords.length === 0) {
      lookupWords = [searchTerm];
    }

    // --------------------------------------------------------------------------
    // STEP 2: Gather verse references from form_occurrences and word_verse_mapping
    // --------------------------------------------------------------------------
    const verseSet = new Set<string>();
    let primaryFrequency: number | null = null;

    for (const word of lookupWords) {
      const occurrences = await getFormOccurrencesFromD1(db, word, translation);
      if (occurrences) {
        occurrences.verseRefs.forEach((ref) => verseSet.add(ref));
        if (primaryFrequency == null) {
          primaryFrequency = occurrences.frequency;
        }
      }

      const mappingRefs = await getWordVerseRefs(db, word, translation);
      mappingRefs.forEach((ref) => verseSet.add(ref));
    }

    console.log(`📊 Total unique verse refs found: ${verseSet.size}`);

    // --------------------------------------------------------------------------
    // STEP 3: Expand with related forms (inflections)
    // --------------------------------------------------------------------------
    const relatedForms: string[] = [];
    if (includeRelated && fuzzySearch) {
      try {
        const inflectionRows = await db.query<{ inflected_form: string }>(
          `SELECT inflected_form FROM inflections WHERE base_word = ? LIMIT 200`,
          [searchTerm]
        );
        if (inflectionRows) {
          inflectionRows.forEach((row) => {
            try {
              const forms = JSON.parse(row.inflected_form);
              if (Array.isArray(forms)) {
                forms.forEach((item) => {
                  if (item && typeof item.form === 'string') {
                    relatedForms.push(item.form);
                  }
                });
              }
            } catch (error) {
              console.warn('Failed to parse inflected_form JSON:', error);
            }
          });
        }
      } catch (error) {
        console.warn('Failed to fetch inflection data:', error);
      }

      const uniqueRelated = Array.from(new Set(relatedForms)).slice(0, 20);
      for (const form of uniqueRelated) {
        const occurrences = await getFormOccurrencesFromD1(db, form, translation);
        if (occurrences) {
          occurrences.verseRefs.forEach((ref) => verseSet.add(ref));
        }
      }
    }

    const verseRefs = Array.from(verseSet);

    // --------------------------------------------------------------------------
    // STEP 4: Retrieve verse data
    // --------------------------------------------------------------------------
    const verses = [];
    for (const ref of verseRefs.slice(0, 500)) {
      const verseData = await fetchVerseByRef(db, ref, translation);
      if (!verseData) continue;

      if (scope !== 'all') {
        const testament = verseData.testament?.toLowerCase();
        if (scope === 'ot' && testament !== 'ot') continue;
        if (scope === 'nt' && testament !== 'nt') continue;
      }

      verses.push({ ref, ...verseData });
    }

    const queryTime = Date.now() - startTime;
    const frequencyInfo = primaryFrequency ?? (await getWordFrequency(db, searchTerm))?.frequency ?? 0;

    return NextResponse.json({
      success: true,
      results: verses,
      dictionary: dictionaryMatches,
      metadata: {
        query: searchTerm,
        scope,
        translation,
        frequency: frequencyInfo,
        totalMatches: verseRefs.length,
        returnedResults: verses.length,
        dictionaryMatches: dictionaryMatches.length,
        relatedFormsCount: relatedForms.length,
        queryTimeMs: queryTime,
        source: 'd1-indexed',
        searchPriority: verseRefs.length > 0 ? 'word-occurrence' : 'no-results',
      },
    });
  } catch (error) {
    console.error('Indexed search error:', error);
    return NextResponse.json(
      { error: 'Search failed', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
