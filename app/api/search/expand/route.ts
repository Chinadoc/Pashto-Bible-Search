import { NextRequest, NextResponse } from 'next/server';
import { searchVersesByForms, getAudioStreamUrl } from '../../lib/cloudflare-d1';
import { normalizeVerses } from '../../utils/normalize-results';

// Import the getVerbVariants function from search route
// We'll need to duplicate it here or extract to a shared utility
async function getVerbVariants(word: string, opts?: { cap?: number; includeCompound?: boolean }): Promise<any[]> {
  try {
    const { getD1Database, queryD1, queryD1First } = await import('@/utils/d1');
    const db = getD1Database();
    if (!db) return [];

    // Simplified version - just fetch from D1 verb_forms
    const schema = await getVerbFormsSchema(db, queryD1);
    if (!schema) return [];

    const root = await resolveVerbRoot(db, queryD1, queryD1First, word);
    if (!root) return [];

    const cap = Math.max(1, Math.min(opts?.cap ?? 60, 400));
    const hasColumn = (name: string) => schema.availableColumns.has(name);

    const selectParts = [
      'vf.form',
      `${schema.rootColumn} AS verb_root`,
      hasColumn('form_type') ? 'vf.form_type' : 'NULL AS form_type',
      hasColumn('person') ? 'vf.person' : 'NULL AS person',
      hasColumn('number') ? 'vf.number' : 'NULL AS number',
      hasColumn('gender') ? 'vf.gender' : 'NULL AS gender',
      hasColumn('tense') ? 'vf.tense' : 'NULL AS tense',
      hasColumn('mood') ? 'vf.mood' : 'NULL AS mood',
      'wf.frequency_count AS frequency_count',
    ];

    const rows = await queryD1<{
      form: string;
      verb_root?: string;
      form_type?: string;
      person?: string;
      number?: string;
      gender?: string;
      tense?: string;
      mood?: string;
      frequency_count?: number;
    }>(
      db,
      `SELECT ${selectParts.join(', ')}
       FROM verb_forms vf
       LEFT JOIN word_frequencies wf ON wf.pashto_word = vf.form
       WHERE ${schema.rootColumn} = ?
       ORDER BY COALESCE(wf.frequency_count, 0) DESC, vf.form
       LIMIT ?`,
      [root, cap * 4]
    );

    const seen = new Set<string>();
    const variants: Array<{ form: string; label: string; count?: number }> = [];

    for (const row of rows || []) {
      if (!row?.form) continue;
      const form = row.form.trim();
      if (!form || seen.has(form)) continue;

      variants.push({
        form,
        label: `${row.person || ''} ${row.tense || row.form_type || 'Form'}`.trim(),
        count: row.frequency_count ?? undefined,
      });
      seen.add(form);
    }

    return variants.slice(0, cap);
  } catch (error) {
    console.warn(`Failed to fetch verb variants:`, error);
    return [];
  }
}

type QueryD1Fn = <T = any>(db: any, sql: string, params?: any[]) => Promise<T[]>;
type QueryD1FirstFn = <T = any>(db: any, sql: string, params?: any[]) => Promise<T | null>;

async function getVerbFormsSchema(db: any, queryFn: QueryD1Fn): Promise<{ rootColumn: string; availableColumns: Set<string> } | null> {
  try {
    const rows = await queryFn<{ name: string }>(db, `PRAGMA table_info('verb_forms')`);
    const columns = new Set((rows || []).map((row: { name: string }) => (row?.name || '').toLowerCase()).filter(Boolean));
    
    const rootColumn = columns.has('verb_root') ? 'vf.verb_root'
      : columns.has('base_verb') ? 'vf.base_verb'
      : columns.has('root') ? 'vf.root'
      : null;

    if (!rootColumn) return null;

    return { rootColumn, availableColumns: columns };
  } catch {
    return null;
  }
}

async function resolveVerbRoot(db: any, queryFn: QueryD1Fn, queryFirstFn: QueryD1FirstFn, value: string): Promise<string> {
  const normalized = value?.trim();
  if (!normalized) return '';

  try {
    const schema = await getVerbFormsSchema(db, queryFn);
    if (schema?.availableColumns.has('base_verb')) {
      const freqRow = await queryFirstFn<{ base_verb?: string }>(
        db,
        `SELECT base_verb FROM word_frequencies WHERE pashto_word = ? AND base_verb IS NOT NULL LIMIT 1`,
        [normalized]
      );
      if (freqRow?.base_verb) return freqRow.base_verb;
    }
  } catch {}

  try {
    const rootRow = await queryFirstFn<{ root: string }>(
      db,
      `SELECT root FROM form_to_root WHERE form = ? LIMIT 1`,
      [normalized]
    );
    if (rootRow?.root) return rootRow.root;
  } catch {}

  try {
    const lexRow = await queryFirstFn<{ verb_root?: string }>(
      db,
      `SELECT verb_root FROM verbs_lexicon WHERE verb_root = ? LIMIT 1`,
      [normalized]
    );
    if (lexRow?.verb_root) return lexRow.verb_root;
  } catch {}

  return normalized;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { word, root, scope = 'all', limit = 200, translation = 'afghan2023' } = body;

    if (!word && !root) {
      return NextResponse.json({ error: 'Missing word or root parameter' }, { status: 400 });
    }

    const targetWord = root || word;
    console.log(`🔍 Expanding search for dictionary term: "${targetWord}"`);

    // Fetch all variants for this word
    const variants = await getVerbVariants(targetWord, { cap: 60, includeCompound: true });
    
    if (!variants || variants.length === 0) {
      return NextResponse.json({
        error: 'No variants found for this word',
        word: targetWord,
      }, { status: 404 });
    }

    // Extract all variant forms for search
    const searchTerms = variants.map(v => v.form).filter(Boolean);
    console.log(`📝 Found ${variants.length} variants, expanding search to ${searchTerms.length} terms`);

    // Search verses using all variant forms
    const testamentFilter = scope === 'ot' ? 'OT' : scope === 'nt' ? 'NT' : undefined;
    
    const expandedResults = await searchVersesByForms(searchTerms, {
      translation: translation as 'afghan2023' | 'yousafzai2019',
      testament: testamentFilter,
      limit: limit,
    });

    // Transform results
    const transformed = expandedResults.map((verse: any, index: number) => ({
      ref: `${verse.book} ${verse.chapter}:${verse.verse}`,
      text: verse.text,
      testament: verse.testament || 'NT',
      translation: null,
      dialect: null,
      tags: [] as any[][],
      audio_verse_url: verse.audio_r2_key ? getAudioStreamUrl(verse.audio_r2_key) : null,
      audio_r2_key: verse.audio_r2_key || null,
      id: index + 1,
    }));

    return NextResponse.json({
      variants,
      results: normalizeVerses(transformed),
      expandedTerms: searchTerms,
      word: targetWord,
      variantCount: variants.length,
      resultCount: transformed.length,
    });
  } catch (error: any) {
    console.error('Expand search failed:', error);
    return NextResponse.json(
      { error: 'Failed to expand search', message: error?.message },
      { status: 500 }
    );
  }
}
