import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

/**
 * Detect Dictionary Term API
 * 
 * Queries D1 tables to determine if a search term matches a LingDocs dictionary entry.
 * Returns metadata about the term to show intelligent search expansion options.
 * 
 * Queries:
 * 1. verbs_lexicon → Check if it's a verb lemma
 * 2. verb_forms → Count conjugations, check if it's an inflected form
 * 3. nouns_lexicon → Check if it's a noun
 * 4. form_to_root → Reverse lookup for inflected forms
 * 
 * Priority:
 * - Exact lemma match (high confidence)
 * - Inflected form with known root (high confidence)
 * - Form-to-root mapping (medium confidence)
 * - Noun lookup (high confidence)
 */

interface DetectionResult {
  found: boolean;
  term?: {
    lemma: string;
    searchedForm: string;
    romanization?: string;
    english?: string;
    pos: 'verb' | 'noun' | 'adjective' | 'other';
    verbType?: 'dynamic' | 'stative' | 'dynamic_compound' | 'stative_compound';
    helper?: string;
    transitivity?: 'transitive' | 'intransitive' | 'both';
    totalForms: number;
    searchedFormIsLemma: boolean;
    lingdocsId?: number;
    confidence: 'high' | 'medium' | 'low';
    source: string;
  };
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const term = searchParams.get('term');

  if (!term || term.trim().length < 2) {
    return NextResponse.json({
      found: false,
      error: 'Term too short',
    });
  }

  const normalized = term.trim();
  
  try {
    const { getD1Database, queryD1, queryD1First } = await import('@/utils/d1');
    const db = getD1Database();

    if (!db) {
      return NextResponse.json({
        found: false,
        error: 'Database not available',
      });
    }

    // Priority 1: Check verbs_lexicon for exact lemma match
    const verbLemma = await queryD1First<{
      verb_root?: string;
      infinitive?: string;
      lingdocs_id?: number;
      verb_type?: string;
      helper?: string;
      transitivity?: string;
      romanization?: string;
      english?: string;
    }>(
      db,
      `SELECT verb_root, infinitive, lingdocs_id, verb_type, helper, transitivity, romanization, english
       FROM verbs_lexicon 
       WHERE verb_root = ? OR COALESCE(infinitive, verb_root) = ?
       LIMIT 1`,
      [normalized, normalized]
    );

    if (verbLemma?.verb_root) {
      // Count total forms for this verb
      const formCount = await queryD1First<{ count: number }>(
        db,
        `SELECT COUNT(DISTINCT form) as count 
         FROM verb_forms 
         WHERE verb_root = ? OR base_verb = ? OR root = ?
         LIMIT 1`,
        [verbLemma.verb_root, verbLemma.verb_root, verbLemma.verb_root]
      );

      return NextResponse.json({
        found: true,
        term: {
          lemma: verbLemma.verb_root,
          searchedForm: normalized,
          romanization: verbLemma.romanization || undefined,
          english: verbLemma.english || undefined,
          pos: 'verb',
          verbType: verbLemma.verb_type as any,
          helper: verbLemma.helper || undefined,
          transitivity: verbLemma.transitivity as any,
          totalForms: formCount?.count || 0,
          searchedFormIsLemma: normalized === verbLemma.verb_root,
          lingdocsId: verbLemma.lingdocs_id || undefined,
          confidence: 'high',
          source: 'd1_verbs_lexicon',
        },
      } as DetectionResult);
    }

    // Priority 2: Check verb_forms for inflected form
    const verbForm = await queryD1First<{
      verb_root?: string;
      base_verb?: string;
      root?: string;
      form: string;
    }>(
      db,
      `SELECT DISTINCT 
         COALESCE(verb_root, base_verb, root) as verb_root,
         form
       FROM verb_forms 
       WHERE form = ?
       LIMIT 1`,
      [normalized]
    );

    if (verbForm?.verb_root) {
      // Get full verb info from lexicon
      const verbInfo = await queryD1First<{
        verb_root?: string;
        lingdocs_id?: number;
        verb_type?: string;
        helper?: string;
        transitivity?: string;
        romanization?: string;
        english?: string;
      }>(
        db,
        `SELECT verb_root, lingdocs_id, verb_type, helper, transitivity, romanization, english
         FROM verbs_lexicon 
         WHERE verb_root = ?
         LIMIT 1`,
        [verbForm.verb_root]
      );

      // Count total forms
      const formCount = await queryD1First<{ count: number }>(
        db,
        `SELECT COUNT(DISTINCT form) as count 
         FROM verb_forms 
         WHERE verb_root = ? OR base_verb = ? OR root = ?
         LIMIT 1`,
        [verbForm.verb_root, verbForm.verb_root, verbForm.verb_root]
      );

      if (verbInfo?.verb_root) {
        return NextResponse.json({
          found: true,
          term: {
            lemma: verbInfo.verb_root,
            searchedForm: normalized,
            romanization: verbInfo.romanization || undefined,
            english: verbInfo.english || undefined,
            pos: 'verb',
            verbType: verbInfo.verb_type as any,
            helper: verbInfo.helper || undefined,
            transitivity: verbInfo.transitivity as any,
            totalForms: formCount?.count || 0,
            searchedFormIsLemma: false,
            lingdocsId: verbInfo.lingdocs_id || undefined,
            confidence: 'high',
            source: 'd1_verb_forms',
          },
        } as DetectionResult);
      }
    }

    // Priority 3: Check form_to_root mapping
    const rootMapping = await queryD1First<{ root: string }>(
      db,
      `SELECT root FROM form_to_root WHERE form = ? LIMIT 1`,
      [normalized]
    );

    if (rootMapping?.root) {
      // Check if root is in verbs_lexicon
      const verbInfo = await queryD1First<{
        verb_root?: string;
        lingdocs_id?: number;
        verb_type?: string;
        helper?: string;
        transitivity?: string;
        romanization?: string;
        english?: string;
      }>(
        db,
        `SELECT verb_root, lingdocs_id, verb_type, helper, transitivity, romanization, english
         FROM verbs_lexicon 
         WHERE verb_root = ?
         LIMIT 1`,
        [rootMapping.root]
      );

      if (verbInfo?.verb_root) {
        const formCount = await queryD1First<{ count: number }>(
          db,
          `SELECT COUNT(DISTINCT form) as count 
           FROM verb_forms 
           WHERE verb_root = ? OR base_verb = ? OR root = ?
           LIMIT 1`,
          [verbInfo.verb_root, verbInfo.verb_root, verbInfo.verb_root]
        );

        return NextResponse.json({
          found: true,
          term: {
            lemma: verbInfo.verb_root,
            searchedForm: normalized,
            romanization: verbInfo.romanization || undefined,
            english: verbInfo.english || undefined,
            pos: 'verb',
            verbType: verbInfo.verb_type as any,
            helper: verbInfo.helper || undefined,
            transitivity: verbInfo.transitivity as any,
            totalForms: formCount?.count || 0,
            searchedFormIsLemma: false,
            lingdocsId: verbInfo.lingdocs_id || undefined,
            confidence: 'medium',
            source: 'd1_form_to_root',
          },
        } as DetectionResult);
      }
    }

    // Priority 4: Check nouns_lexicon
    const nounInfo = await queryD1First<{
      pashto_word?: string;
      plural_forms?: string;
      gender?: string;
    }>(
      db,
      `SELECT pashto_word, plural_forms, gender
       FROM nouns_lexicon 
       WHERE pashto_word = ?
       LIMIT 1`,
      [normalized]
    );

    if (nounInfo?.pashto_word) {
      return NextResponse.json({
        found: true,
        term: {
          lemma: nounInfo.pashto_word,
          searchedForm: normalized,
          pos: 'noun',
          totalForms: 1, // TODO: Count plural forms when available
          searchedFormIsLemma: true,
          confidence: 'high',
          source: 'd1_nouns_lexicon',
        },
      } as DetectionResult);
    }

    // No match found
    return NextResponse.json({
      found: false,
    } as DetectionResult);
  } catch (error: any) {
    console.error('Dictionary term detection failed:', error);
    return NextResponse.json(
      {
        found: false,
        error: error?.message || 'Detection failed',
      },
      { status: 500 }
    );
  }
}

