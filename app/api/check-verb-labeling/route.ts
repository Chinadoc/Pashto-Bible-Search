import { NextRequest, NextResponse } from 'next/server';
import { getD1ClientOrThrow } from '@/utils/d1-helpers';

export const runtime = 'nodejs';

/**
 * Diagnostic endpoint to check verbs_lexicon and word_frequencies tables
 * GET /api/check-verb-labeling?verb=وهل
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const verbRoot = searchParams.get('verb');
    
    const db = getD1ClientOrThrow();
    
    const results: any = {
      verb: verbRoot || 'all',
      timestamp: new Date().toISOString(),
      verbs_lexicon: {},
      word_frequencies: {},
      specific_forms: {},
      consistency: {},
      missing_pos: {},
    };
    
    // 1. Check verbs_lexicon
    if (verbRoot) {
      const verbs = await db.query<{
        id: number;
        verb_root: string;
        infinitive: string;
        imperfective_stem: string;
        perfective_stem: string;
        perfective_root: string;
        past_participle: string;
        pos: string;
        transitivity: string;
        verb_type: string;
        romanization: string;
      }>(
        `SELECT 
          id, verb_root, infinitive, imperfective_stem, perfective_stem,
          perfective_root, past_participle, pos, transitivity, verb_type, romanization
        FROM verbs_lexicon
        WHERE verb_root LIKE ? OR infinitive LIKE ?
        LIMIT 20`,
        [`%${verbRoot}%`, `%${verbRoot}%`]
      );
      
      results.verbs_lexicon = {
        count: verbs.length,
        entries: verbs,
      };
    } else {
      const totalCount = await db.queryFirst<{ count: number }>(
        `SELECT COUNT(*) as count FROM verbs_lexicon`
      );
      
      const samples = await db.query<{
        verb_root: string;
        infinitive: string;
        pos: string;
      }>(
        `SELECT verb_root, infinitive, pos FROM verbs_lexicon LIMIT 10`
      );
      
      results.verbs_lexicon = {
        total: totalCount?.count || 0,
        samples: samples,
      };
    }
    
    // 2. Check word_frequencies for verbs
    if (verbRoot) {
      const freqEntries = await db.query<{
        id: number;
        pashto_word: string;
        frequency_count: number;
        frequency_total: number;
        pos: string;
        romanization: string;
      }>(
        `SELECT id, pashto_word, 
        COALESCE(frequency_count, frequency_total, frequency_t, 0) as frequency_count,
        pos, romanization
        FROM word_frequencies
        WHERE (pos LIKE '%verb%' OR pos LIKE '%v.%') 
        AND (pashto_word LIKE ? OR pashto_word = ?)
        LIMIT 20`,
        [`%${verbRoot}%`, verbRoot]
      );
      
      results.word_frequencies = {
        count: freqEntries.length,
        entries: freqEntries,
      };
    } else {
      const verbCount = await db.queryFirst<{ count: number }>(
        `SELECT COUNT(*) as count FROM word_frequencies WHERE pos LIKE '%verb%' OR pos LIKE '%v.%'`
      );
      
      const samples = await db.query<{
        pashto_word: string;
        frequency_count: number;
        pos: string;
      }>(
        `SELECT pashto_word, 
        COALESCE(frequency_count, frequency_total, frequency_t, 0) as frequency_count,
        pos 
        FROM word_frequencies 
        WHERE pos LIKE '%verb%' OR pos LIKE '%v.%'
        LIMIT 10`
      );
      
      results.word_frequencies = {
        total: verbCount?.count || 0,
        samples: samples,
      };
    }
    
    // 3. Check specific forms for وهل
    if (verbRoot === 'وهل' || !verbRoot) {
      const forms = ['وهل', 'وهم', 'وهو', 'وهې', 'وهي', 'وهئ'];
      const formResults: any = {};
      
      for (const form of forms) {
        const freqEntry = await db.queryFirst<{
          pashto_word: string;
          frequency_count: number;
          pos: string;
        }>(
          `SELECT pashto_word, 
          COALESCE(frequency_count, frequency_total, frequency_t, 0) as frequency_count,
          pos 
          FROM word_frequencies 
          WHERE pashto_word = ? LIMIT 1`,
          [form]
        );
        
        const inflection = await db.queryFirst<{
          inflected_form: string;
          base_word: string;
          grammatical_info: string;
          pos: string;
        }>(
          `SELECT inflected_form, base_word, grammatical_info, pos 
          FROM inflections 
          WHERE inflected_form = ? LIMIT 1`,
          [form]
        );
        
        formResults[form] = {
          in_word_frequencies: !!freqEntry,
          frequency: freqEntry?.frequency_count || null,
          freq_pos: freqEntry?.pos || null,
          in_inflections: !!inflection,
          base_word: inflection?.base_word || null,
          inflection_pos: inflection?.pos || null,
          grammatical_info: inflection?.grammatical_info ? 
            (typeof inflection.grammatical_info === 'string' ? 
              JSON.parse(inflection.grammatical_info) : 
              inflection.grammatical_info) : null,
        };
      }
      
      results.specific_forms = formResults;
    }
    
    // 4. Consistency check
    if (verbRoot) {
      const verbLexiconEntry = await db.queryFirst<{
        verb_root: string;
        infinitive: string;
        pos: string;
      }>(
        `SELECT verb_root, infinitive, pos 
        FROM verbs_lexicon 
        WHERE verb_root = ? OR infinitive = ? LIMIT 1`,
        [verbRoot, verbRoot]
      );
      
      const freqEntry = await db.queryFirst<{
        pashto_word: string;
        pos: string;
      }>(
        `SELECT pashto_word, pos 
        FROM word_frequencies 
        WHERE pashto_word = ? LIMIT 1`,
        [verbRoot]
      );
      
      results.consistency = {
        in_verbs_lexicon: !!verbLexiconEntry,
        verbs_lexicon_pos: verbLexiconEntry?.pos || null,
        in_word_frequencies: !!freqEntry,
        word_frequencies_pos: freqEntry?.pos || null,
        pos_match: verbLexiconEntry?.pos && freqEntry?.pos && 
          (verbLexiconEntry.pos.toLowerCase().includes('verb') || verbLexiconEntry.pos.toLowerCase().includes('v.')) &&
          (freqEntry.pos.toLowerCase().includes('verb') || freqEntry.pos.toLowerCase().includes('v.')),
      };
    }
    
    // 5. Check for missing POS labels
    const missingPosVerbs = await db.query<{ verb_root: string; pos: string }>(
      `SELECT verb_root, pos 
      FROM verbs_lexicon 
      WHERE pos IS NULL OR pos = '' 
      LIMIT 20`
    );
    
    const missingPosFreq = await db.query<{ pashto_word: string; pos: string }>(
      `SELECT pashto_word, pos 
      FROM word_frequencies 
      WHERE (pos IS NULL OR pos = '') 
      AND (pashto_word LIKE '%ل' OR pashto_word LIKE '%ول' OR pashto_word LIKE '%ېدل')
      LIMIT 20`
    );
    
    results.missing_pos = {
      verbs_lexicon_count: missingPosVerbs.length,
      verbs_lexicon_samples: missingPosVerbs.slice(0, 10).map(v => v.verb_root),
      word_frequencies_count: missingPosFreq.length,
      word_frequencies_samples: missingPosFreq.slice(0, 10).map(e => e.pashto_word),
    };
    
    return NextResponse.json(results, { status: 200 });
  } catch (error: any) {
    console.error('Error checking verb labeling:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to check verb labeling' },
      { status: 500 }
    );
  }
}

