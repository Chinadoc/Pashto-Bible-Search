import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/utils/supabase';

export const runtime = 'nodejs';

type Scope = 'all' | 'ot' | 'nt';

interface WordFrequency {
  word: string;
  frequency: number;
  testament?: string;
}

interface FormOccurrence {
  form: string;
  verse_refs: string[];
  occurrence_count: number;
}

interface FormRoot {
  form: string;
  root: string;
  related_forms: string[];
}

interface VerseRow {
  book: string;
  chapter: number;
  verse: number;
  text: string;
  testament?: string;
  dialect?: string | null;
  translation?: string | null;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      query,
      scope = 'all',
      translation = 'afghan2023',
      includeRelated = true,
    } = body;

    if (!query || typeof query !== 'string') {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 });
    }

    const searchTerm = query.trim();
    const startTime = Date.now();

    console.log(`🔍 Indexed search for: "${searchTerm}" (${translation}, ${scope})`);

    const {
      data: frequencyData,
      error: freqError,
    } = await supabase
      .from('word_frequencies')
      .select('word, frequency, testament')
      .eq('word', searchTerm)
      .single<WordFrequency>();

    if (freqError && freqError.code !== 'PGRST116') {
      console.error('Frequency lookup error:', freqError);
    } else if (frequencyData) {
      console.log(`✅ Found in word_frequencies: ${frequencyData.frequency} occurrences`);
    }

    const { data: occurrencesData, error: occError } = await supabase
      .from('form_occurrences')
      .select('form, verse_refs, occurrence_count')
      .eq('form', searchTerm);

    if (occError) {
      console.error('Occurrence lookup error:', occError);
    }

    let verseRefs: string[] = [];
    const occurrences = occurrencesData as FormOccurrence[] | null;
    if (occurrences?.length) {
      verseRefs = occurrences[0].verse_refs ?? [];
      console.log(`✅ Found ${verseRefs.length} verse references in form_occurrences`);
    }

    let relatedForms: string[] = [];
    if (includeRelated) {
      const { data: rootData, error: rootErr } = await supabase
        .from('form_roots')
        .select('form, root, related_forms')
        .eq('form', searchTerm)
        .single<FormRoot>();

      if (rootErr && rootErr.code !== 'PGRST116') {
        console.error('Related forms lookup error:', rootErr);
      }

      if (rootData?.related_forms) {
        relatedForms = Array.isArray(rootData.related_forms)
          ? rootData.related_forms
          : [];
        console.log(`✅ Found ${relatedForms.length} related forms`);

        for (const relatedForm of relatedForms.slice(0, 10)) {
          const { data: relatedOcc } = await supabase
            .from('form_occurrences')
            .select('verse_refs')
            .eq('form', relatedForm)
            .single<Pick<FormOccurrence, 'verse_refs'>>();

          if (relatedOcc?.verse_refs) {
            verseRefs.push(...relatedOcc.verse_refs);
          }
        }
      }
    }

    verseRefs = Array.from(new Set(verseRefs));
    const versesTable = translation === 'yousafzai2019' ? 'verses_yousafzai' : 'verses';
    const verses: Array<{ ref: string } & VerseRow> = [];

    for (const ref of verseRefs.slice(0, 500)) {
      const match = ref.match(/^(.+?)\s+(\d+):(\d+)$/);
      if (!match) continue;

      const [, book, chapterRaw, verseRaw] = match;
      const chapter = Number(chapterRaw);
      const verse = Number(verseRaw);

      const { data: verseData } = await supabase
        .from(versesTable)
        .select('book, chapter, verse, text, testament, dialect, translation')
        .eq('book', book)
        .eq('chapter', chapter)
        .eq('verse', verse)
        .single<VerseRow>();

      if (!verseData) continue;
      if (scope !== 'all') {
        const testament = verseData.testament?.toLowerCase();
        if (scope === 'ot' && testament !== 'ot') continue;
        if (scope === 'nt' && testament !== 'nt') continue;
      }

      verses.push({ ref, ...verseData });
    }

    const queryTime = Date.now() - startTime;
    console.log(`⚡ Indexed search completed in ${queryTime}ms`);

    return NextResponse.json({
      success: true,
      results: verses,
      metadata: {
        query: searchTerm,
        scope,
        translation,
        frequency: frequencyData?.frequency ?? 0,
        totalMatches: verseRefs.length,
        returnedResults: verses.length,
        relatedFormsCount: relatedForms.length,
        queryTimeMs: queryTime,
        source: 'supabase-indexed',
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
