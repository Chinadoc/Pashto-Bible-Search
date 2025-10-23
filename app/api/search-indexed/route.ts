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

/**
 * Ultra-fast indexed search using pre-computed Supabase tables
 * This endpoint uses:
 * 1. word_frequencies - to check if word exists and get frequency
 * 2. form_occurrences - to get verse references directly
 * 3. form_roots - to get related forms
 * 4. verses - to fetch the actual verse text
 * 5. audio_mappings - to get audio URLs
 *
 * This is much faster than loading all verses into memory
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query, scope = 'all', translation = 'afghan2023', includeRelated = true } = body;

    if (!query || typeof query !== 'string') {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 });
    }

    const searchTerm = query.trim();
    const startTime = Date.now();

    console.log(`🔍 Indexed search for: "${searchTerm}" (${translation}, ${scope})`);

    // Step 1: Check word_frequencies to see if this word exists
    const freqTable = translation === 'yousafzai2019' ? 'word_frequencies' : 'word_frequencies';
    const {
      data: rawFrequencyData,
      error: freqError
    } = await supabase
      .from(freqTable)
      .select('word, frequency, testament')
      .eq('word', searchTerm)
      .single();

    const frequencyData: WordFrequency | null = rawFrequencyData;

    if (freqError && freqError.code !== 'PGRST116') { // PGRST116 = not found
      console.error('Frequency lookup error:', freqError);
    }

    if (frequencyData) {
      console.log(`✅ Found in word_frequencies: ${frequencyData.frequency} occurrences`);
    }

    // Step 2: Get verse references from form_occurrences
    const { data: rawOccurrences, error: occError } = await supabase
      .from('form_occurrences')
      .select('form, verse_refs, occurrence_count')
      .eq('form', searchTerm);

    const occurrences = rawOccurrences as FormOccurrence[] | null;

    let verseRefs: string[] = [];
    if (occurrences && occurrences.length > 0) {
      verseRefs = occurrences[0].verse_refs || [];
      console.log(`✅ Found ${verseRefs.length} verse references in form_occurrences`);
    }

    // Step 3: Get related forms if requested
    let relatedForms: string[] = [];
    if (includeRelated) {
      const { data: rawRootData } = await supabase
        .from('form_roots')
        .select('root, related_forms')
        .eq('form', searchTerm)
        .single();

      const rootData = rawRootData as FormRoot | null;

      if (rootData && rootData.related_forms) {
        relatedForms = Array.isArray(rootData.related_forms)
          ? rootData.related_forms
          : [];
        console.log(`✅ Found ${relatedForms.length} related forms`);

        // Get occurrences for related forms too
        for (const relatedForm of relatedForms.slice(0, 10)) { // Limit to avoid too many queries
          const { data: rawRelatedOcc } = await supabase
            .from('form_occurrences')
            .select('verse_refs')
            .eq('form', relatedForm)
            .single();

          const relatedOcc = rawRelatedOcc as Pick<FormOccurrence, 'verse_refs'> | null;

          if (relatedOcc && relatedOcc.verse_refs) {
            verseRefs.push(...relatedOcc.verse_refs);
          }
        }
      }
    }

    // Remove duplicates
    verseRefs = Array.from(new Set(verseRefs));

    // Step 4: Fetch actual verses from the verses table
    const versesTable = translation === 'yousafzai2019' ? 'verses_yousafzai' : 'verses';

    // Parse verse references and fetch verses
    // Format: "Genesis 1:1", "Mark 10:45", etc.
    const verses = [];

    for (const ref of verseRefs.slice(0, 500)) { // Limit to 500 verses
      // Parse ref like "Genesis 1:1"
      const match = ref.match(/^(.+?)\s+(\d+):(\d+)$/);
      if (!match) continue;

      const [, book, chapterStr, verseStr] = match;
      const chapter = parseInt(chapterStr, 10);
      const verse = parseInt(verseStr, 10);

      const { data: rawVerseData } = await supabase
        .from(versesTable)
        .select('book, chapter, verse, text, testament, dialect, translation')
        .eq('book', book)
        .eq('chapter', chapter)
        .eq('verse', verse)
        .single();

      const verseData = rawVerseData as VerseRow | null;

      if (verseData) {
        // Apply scope filter
        if (scope !== 'all') {
          const testament = verseData.testament?.toLowerCase();
          if (scope === 'ot' && testament !== 'ot') continue;
          if (scope === 'nt' && testament !== 'nt') continue;
        }

        verses.push({
          ref,
          ...verseData
        });
      }
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
        source: 'supabase-indexed'
      }
    });

  } catch (error) {
    console.error('Indexed search error:', error);
    return NextResponse.json(
      { error: 'Search failed', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
