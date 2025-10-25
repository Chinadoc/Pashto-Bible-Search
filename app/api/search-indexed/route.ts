import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/utils/supabase';

export const runtime = 'nodejs';

type Scope = 'all' | 'ot' | 'nt';

interface WordFrequency {
  word: string;
  frequency: number;
  translation_key?: string;
  verse_refs?: string[];
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
  translation_key?: string | null;
  audio_storage_path?: string | null;
  audio_public_url?: string | null;
}

/**
 * Ultra-fast indexed search using pre-computed Supabase tables
 * This endpoint uses:
 * 1. word_occurrence_index - to check if word exists and get frequency + verse references
 * 2. dictionary - to get romanization matches (PRIMARY PRIORITY)
 * 3. variant_index - to get related forms/inflections (SECONDARY)
 * 4. verses/verses_yousafzai - to fetch the actual verse text
 * 5. Built-in audio URLs from verse tables
 *
 * Search Priority:
 * 1. EXACT ROMANIZATION MATCH (highest priority)
 * 2. EXACT PASHTO MATCH 
 * 3. FUZZY/PARTIAL MATCHES (only if enabled)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query, scope = 'all', translation = 'afghan2023', includeRelated = true, fuzzySearch = false } = body;

    if (!query || typeof query !== 'string') {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 });
    }

    const searchTerm = query.trim();
    const startTime = Date.now();

    console.log(`🔍 Indexed search for: "${searchTerm}" (${translation}, ${scope}, fuzzy=${fuzzySearch})`);

    // ============================================================================
    // STEP 1: CHECK DICTIONARY FOR ROMANIZATION MATCHES (HIGHEST PRIORITY)
    // ============================================================================
    
    let dictionaryMatches: any[] = [];
    
    // Try exact romanization match first
    const { data: exactRomanMatch, error: romanError } = await supabase
      .from('dictionary')
      .select('pashto, romanized, pos, english')
      .ilike('romanized', searchTerm)
      .limit(20);
      
    if (exactRomanMatch && exactRomanMatch.length > 0) {
      dictionaryMatches = exactRomanMatch;
      console.log(`✅ Found ${exactRomanMatch.length} romanization matches in dictionary`);
    } else {
      // Try exact Pashto match
      const { data: pashtoMatch, error: pashtoError } = await supabase
        .from('dictionary')
        .select('pashto, romanized, pos, english')
        .eq('pashto', searchTerm)
        .limit(20);
        
      if (pashtoMatch && pashtoMatch.length > 0) {
        dictionaryMatches = pashtoMatch;
        console.log(`✅ Found ${pashtoMatch.length} exact Pashto matches in dictionary`);
      }
    }

    // ============================================================================
    // STEP 2: GET VERSE REFERENCES FROM WORD_OCCURRENCE_INDEX
    // ============================================================================
    
    const {
      data: rawFrequencyData,
      error: freqError
    } = await supabase
      .from('word_occurrence_index')
      .select('word, frequency, translation_key, verse_refs')
      .eq('word', searchTerm)
      .eq('translation_key', translation)
      .single();

    const frequencyData: WordFrequency | null = (rawFrequencyData as WordFrequency) || null;

    if (freqError && freqError.code !== 'PGRST116') {
      console.error('Frequency lookup error:', freqError);
    }

    if (frequencyData) {
      console.log(`✅ Found in word_occurrence_index: ${frequencyData.frequency} occurrences`);
    }

    // Step 2: Get verse references from word_occurrence_index (already have this data)
    let verseRefs: string[] = [];
    if (frequencyData) {
      verseRefs = frequencyData.verse_refs || [];
      console.log(`✅ Found ${verseRefs.length} verse references in word_occurrence_index`);
    }

    // ============================================================================
    // STEP 3: GET RELATED FORMS/INFLECTIONS (SECONDARY)
    // ============================================================================
    
    let relatedForms: string[] = [];
    if (includeRelated && fuzzySearch) {
      const { data: rawVariantData } = await supabase
        .from('variant_index')
        .select('base_word, variants')
        .eq('base_word', searchTerm)
        .eq('translation_key', translation)
        .single();

      if (rawVariantData && rawVariantData.variants) {
        const variants = rawVariantData.variants as any[];
        if (Array.isArray(variants)) {
          relatedForms = variants.map(v => v.form || v).filter(Boolean);
          console.log(`✅ Found ${relatedForms.length} related forms in variant_index`);

          // Get occurrences for related forms too
          for (const relatedForm of relatedForms.slice(0, 10)) {
            const { data: rawRelatedOcc } = await supabase
              .from('word_occurrence_index')
              .select('verse_refs')
              .eq('word', relatedForm)
              .eq('translation_key', translation)
              .single();

            if (rawRelatedOcc && rawRelatedOcc.verse_refs) {
              verseRefs.push(...rawRelatedOcc.verse_refs);
            }
          }
        }
      }
    }

    // Remove duplicates
    verseRefs = Array.from(new Set(verseRefs));

    // ============================================================================
    // STEP 4: FETCH ACTUAL VERSES FROM THE VERSES TABLE
    // ============================================================================
    
    const versesTable = translation === 'yousafzai2019' ? 'verses_yousafzai' : 'verses';

    // Parse verse references and fetch verses
    // Format: "Genesis 1:1", "Mark 10:45", etc.
    const verses = [];

    for (const ref of verseRefs.slice(0, 500)) {
      // Parse ref like "Genesis 1:1"
      const match = ref.match(/^(.+?)\s+(\d+):(\d+)$/);
      if (!match) continue;

      const [, book, chapterStr, verseStr] = match;
      const chapter = parseInt(chapterStr, 10);
      const verse = parseInt(verseStr, 10);

      const { data: rawVerseData } = await supabase
        .from(versesTable)
        .select('book, chapter, verse, text, testament, dialect, translation_key, audio_storage_path, audio_public_url')
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
      dictionary: dictionaryMatches,
      metadata: {
        query: searchTerm,
        scope,
        translation,
        frequency: frequencyData?.frequency ?? 0,
        totalMatches: verseRefs.length,
        returnedResults: verses.length,
        dictionaryMatches: dictionaryMatches.length,
        relatedFormsCount: relatedForms.length,
        queryTimeMs: queryTime,
        source: 'supabase-indexed',
        searchPriority: dictionaryMatches.length > 0 ? 'dictionary-romanization' : 'word-occurrence'
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
