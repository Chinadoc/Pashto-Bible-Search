import { NextRequest, NextResponse } from 'next/server';
import type { D1Database } from '@/utils/d1';

export const runtime = 'edge';

// Type definitions for D1 query results
interface VerbLexiconRow {
  lemma: string;
  verb_type?: string;
  helper?: string;
  transitivity?: string;
  romanization?: string;
  english_translation?: string;
  lingdocs_id?: string;
  stems?: string;
  examples?: string;
  verb_root?: string;
}

interface VerbFormRow {
  lemma: string;
  form: string;
  tense?: string;
  person?: string;
  voice?: string;
  verb_type?: string;
  helper?: string;
  transitivity?: string;
  romanization?: string;
  english_translation?: string;
  lingdocs_id?: string;
}

interface CountRow {
  count: number;
}

interface RootLookupRow {
  root_word: string;
  frequency?: number;
}

interface NounLexiconRow {
  pashto_word: string;
  gender?: string;
  animacy?: string;
  plural_type?: string;
  romanization?: string;
  english_translation?: string;
}

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
 * - Pattern-based inference (medium confidence)
 */

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const term = searchParams.get('term');

  if (!term || term.trim().length === 0) {
    return NextResponse.json(
      { error: 'Missing term parameter' },
      { status: 400 }
    );
  }

  try {
    // Get D1 database from Cloudflare Pages binding
    const db = (process.env as any).DB as D1Database;

    if (!db) {
      console.warn('D1 database not available, skipping dictionary term detection');
      return NextResponse.json({ term: null });
    }

    const cleanTerm = term.trim();

    // Step 1: Check if it's a verb lemma (exact match)
    const verbLemma = await db
      .prepare(
        `SELECT
          lemma, verb_type, helper, transitivity,
          romanization, english_translation, lingdocs_id,
          stems, examples
        FROM verbs_lexicon
        WHERE lemma = ? OR verb_root = ?
        LIMIT 1`
      )
      .bind(cleanTerm, cleanTerm)
      .first() as VerbLexiconRow | null;

    if (verbLemma) {
      // Count conjugations
      const formsCount = await db
        .prepare(
          `SELECT COUNT(*) as count FROM verb_forms WHERE lemma = ?`
        )
        .bind(verbLemma.lemma)
        .first() as CountRow | null;

      const lingdocsUrl = verbLemma.lingdocs_id
        ? `https://dictionary.lingdocs.com/word?id=${verbLemma.lingdocs_id}`
        : undefined;

      return NextResponse.json({
        term: {
          lemma: verbLemma.lemma,
          romanization: verbLemma.romanization,
          englishTranslation: verbLemma.english_translation,
          pos: 'verb' as const,
          verbType: verbLemma.verb_type as 'simple' | 'dynamic_compound' | 'stative_compound' | undefined,
          helper: verbLemma.helper,
          transitivity: verbLemma.transitivity as 'transitive' | 'intransitive' | undefined,
          lingdocsId: verbLemma.lingdocs_id,
          lingdocsUrl,
          totalForms: formsCount?.count || 0,
          verbs: formsCount?.count || 0,
          confidence: 'high' as const,
          source: 'd1_verified' as const,
        },
      });
    }

    // Step 2: Check if it's an inflected verb form (reverse lookup)
    const inflectedForm = await db
      .prepare(
        `SELECT
          vf.lemma, vf.form, vf.tense, vf.person, vf.voice,
          vl.verb_type, vl.helper, vl.transitivity,
          vl.romanization, vl.english_translation, vl.lingdocs_id
        FROM verb_forms vf
        LEFT JOIN verbs_lexicon vl ON vf.lemma = vl.lemma
        WHERE vf.form = ?
        LIMIT 1`
      )
      .bind(cleanTerm)
      .first() as VerbFormRow | null;

    if (inflectedForm) {
      // Count total conjugations for the lemma
      const formsCount = await db
        .prepare(
          `SELECT COUNT(*) as count FROM verb_forms WHERE lemma = ?`
        )
        .bind(inflectedForm.lemma)
        .first() as CountRow | null;

      const lingdocsUrl = inflectedForm.lingdocs_id
        ? `https://dictionary.lingdocs.com/word?id=${inflectedForm.lingdocs_id}`
        : undefined;

      return NextResponse.json({
        term: {
          lemma: inflectedForm.lemma,
          romanization: inflectedForm.romanization,
          englishTranslation: inflectedForm.english_translation,
          pos: 'verb' as const,
          verbType: inflectedForm.verb_type as 'simple' | 'dynamic_compound' | 'stative_compound' | undefined,
          helper: inflectedForm.helper,
          transitivity: inflectedForm.transitivity as 'transitive' | 'intransitive' | undefined,
          lingdocsId: inflectedForm.lingdocs_id,
          lingdocsUrl,
          totalForms: formsCount?.count || 0,
          verbs: formsCount?.count || 0,
          confidence: 'high' as const,
          source: 'd1_verified' as const,
          matchedForm: {
            form: inflectedForm.form,
            tense: inflectedForm.tense,
            person: inflectedForm.person,
            voice: inflectedForm.voice,
          },
        },
      });
    }

    // Step 3: Check form_to_root table (legacy fallback)
    const rootLookup = await db
      .prepare(
        `SELECT root_word, frequency FROM form_to_root WHERE word_form = ? LIMIT 1`
      )
      .bind(cleanTerm)
      .first() as RootLookupRow | null;

    if (rootLookup) {
      // Try to get metadata for the root
      const rootMetadata = await db
        .prepare(
          `SELECT
            lemma, verb_type, helper, transitivity,
            romanization, english_translation, lingdocs_id
          FROM verbs_lexicon
          WHERE lemma = ?
          LIMIT 1`
        )
        .bind(rootLookup.root_word)
        .first() as VerbLexiconRow | null;

      if (rootMetadata) {
        const formsCount = await db
          .prepare(
            `SELECT COUNT(*) as count FROM verb_forms WHERE lemma = ?`
          )
          .bind(rootMetadata.lemma)
          .first() as CountRow | null;

        const lingdocsUrl = rootMetadata.lingdocs_id
          ? `https://dictionary.lingdocs.com/word?id=${rootMetadata.lingdocs_id}`
          : undefined;

        return NextResponse.json({
          term: {
            lemma: rootMetadata.lemma,
            romanization: rootMetadata.romanization,
            englishTranslation: rootMetadata.english_translation,
            pos: 'verb' as const,
            verbType: rootMetadata.verb_type as 'simple' | 'dynamic_compound' | 'stative_compound' | undefined,
            helper: rootMetadata.helper,
            transitivity: rootMetadata.transitivity as 'transitive' | 'intransitive' | undefined,
            lingdocsId: rootMetadata.lingdocs_id,
            lingdocsUrl,
            totalForms: formsCount?.count || 0,
            verbs: formsCount?.count || 0,
            confidence: 'medium' as const,
            source: 'd1_inferred' as const,
          },
        });
      }
    }

    // Step 4: Check nouns_lexicon
    const nounLemma = await db
      .prepare(
        `SELECT
          pashto_word, gender, animacy, plural_type,
          romanization, english_translation
        FROM nouns_lexicon
        WHERE pashto_word = ?
        LIMIT 1`
      )
      .bind(cleanTerm)
      .first() as NounLexiconRow | null;

    if (nounLemma) {
      // Count inflections (if we have an inflections table for nouns)
      const inflectionsCount = (await db
        .prepare(
          `SELECT COUNT(*) as count FROM inflections WHERE base_word = ?`
        )
        .bind(nounLemma.pashto_word)
        .first()
        .catch(() => ({ count: 0 }))) as CountRow;

      return NextResponse.json({
        term: {
          lemma: nounLemma.pashto_word,
          romanization: nounLemma.romanization,
          englishTranslation: nounLemma.english_translation,
          pos: 'noun' as const,
          gender: nounLemma.gender,
          pluralType: nounLemma.plural_type,
          totalForms: inflectionsCount?.count || 0,
          nouns: inflectionsCount?.count || 0,
          confidence: 'high' as const,
          source: 'd1_verified' as const,
        },
      });
    }

    // No match found
    return NextResponse.json({ term: null });
  } catch (error) {
    console.error('Dictionary term detection error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
