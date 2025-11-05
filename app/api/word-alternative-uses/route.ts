/**
 * API endpoint to find alternative uses of a word
 * GET /api/word-alternative-uses?word=منډه
 * 
 * Returns:
 * - Compound verbs containing the word (if noun/adjective)
 * - Stative compounds containing the word (if adjective)
 * - Other grammatical contexts where the word appears
 */

import { NextRequest, NextResponse } from 'next/server';
import { getD1ClientOrThrow } from '@/utils/d1-helpers';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const word = searchParams.get('word');
    const pos = searchParams.get('pos'); // 'noun', 'adjective', 'verb', etc.

    if (!word) {
      return NextResponse.json(
        { error: 'Missing word parameter' },
        { status: 400 }
      );
    }

    const db = getD1ClientOrThrow();
    const alternativeUses: {
      type: 'compound_verb' | 'stative_compound' | 'other';
      forms: string[];
      description: string;
    }[] = [];

    // If it's a noun or adjective, check for compound verbs
    if (pos === 'noun' || pos === 'adjective' || !pos) {
      // Check verbs_lexicon for compound verbs containing this word
      const compoundVerbs = await db.query<{ verb_root: string; conjugation_pattern?: string }>(
        `SELECT DISTINCT verb_root, conjugation_pattern 
        FROM verbs_lexicon 
        WHERE verb_root LIKE ? OR verb_root LIKE ?
        LIMIT 20`,
        [`%${word} %`, `% ${word}%`]
      );

      if (Array.isArray(compoundVerbs) && compoundVerbs.length > 0) {
        const forms = compoundVerbs
          .map(v => v.verb_root)
          .filter(Boolean)
          .slice(0, 10);
        
        if (forms.length > 0) {
          alternativeUses.push({
            type: 'compound_verb',
            forms,
            description: pos === 'noun' 
              ? 'This noun appears in compound verbs'
              : 'This adjective appears in compound verbs',
          });
        }
      }

      // Check inflections table for compound verbs
      const compoundInflections = await db.query<{ base_word: string }>(
        `SELECT DISTINCT base_word 
        FROM inflections 
        WHERE base_word LIKE ? OR base_word LIKE ?
        LIMIT 20`,
        [`%${word} %`, `% ${word}%`]
      );

      if (Array.isArray(compoundInflections) && compoundInflections.length > 0) {
        const forms = compoundInflections
          .map(i => i.base_word)
          .filter(Boolean)
          .slice(0, 10);
        
        if (forms.length > 0) {
          // Merge with existing compound verbs
          const existing = alternativeUses.find(u => u.type === 'compound_verb');
          if (existing) {
            const newForms = forms.filter(f => !existing.forms.includes(f));
            existing.forms.push(...newForms);
            existing.forms = existing.forms.slice(0, 10);
          } else {
            alternativeUses.push({
              type: 'compound_verb',
              forms,
              description: pos === 'noun' 
                ? 'This noun appears in compound verbs'
                : 'This adjective appears in compound verbs',
            });
          }
        }
      }
    }

    // If it's an adjective, check for stative compounds
    if (pos === 'adjective' || (!pos && word.length < 10)) {
      // Check for stative compounds (adjective + کېدل/کول)
      const stativeVerbs = await db.query<{ verb_root: string }>(
        `SELECT DISTINCT verb_root 
        FROM verbs_lexicon 
        WHERE (verb_root LIKE ? OR verb_root LIKE ?)
        AND (verb_root LIKE '%کېدل' OR verb_root LIKE '%کول')
        LIMIT 10`,
        [`${word} %`, `${word} %`]
      );

      if (Array.isArray(stativeVerbs) && stativeVerbs.length > 0) {
        const forms = stativeVerbs
          .map(v => v.verb_root)
          .filter(Boolean);
        
        if (forms.length > 0) {
          alternativeUses.push({
            type: 'stative_compound',
            forms,
            description: 'This adjective appears in stative compounds',
          });
        }
      }
    }

    // Check form_to_root for related forms
    const relatedRoots = await db.query<{ root: string; form: string }>(
      `SELECT DISTINCT root, form 
      FROM form_to_root 
      WHERE form = ? OR root = ?
      LIMIT 20`,
      [word, word]
    );

    if (Array.isArray(relatedRoots) && relatedRoots.length > 0) {
      const relatedForms = relatedRoots
        .map(r => r.form !== word ? r.form : r.root)
        .filter(Boolean)
        .slice(0, 10);
      
      if (relatedForms.length > 0) {
        alternativeUses.push({
          type: 'other',
          forms: relatedForms,
          description: 'Related forms found',
        });
      }
    }

    return NextResponse.json({
      word,
      pos,
      alternative_uses: alternativeUses,
      total_uses: alternativeUses.reduce((sum, use) => sum + use.forms.length, 0),
    });
  } catch (error: any) {
    console.error('Alternative uses error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to find alternative uses' },
      { status: 500 }
    );
  }
}

