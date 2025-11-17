import { NextResponse } from 'next/server';
import { getD1Database, queryD1 } from '@/utils/d1';
import type { MorphologyFacetBucket, MorphologyFacets } from '@/types';

function bucketize(rows: Array<{ value?: string | null; count?: number }>, fallbackLabel: string): MorphologyFacetBucket[] {
  const map = new Map<string, number>();

  for (const row of rows) {
    const raw = row.value ?? fallbackLabel;
    const value = raw && typeof raw === 'string' ? raw.trim() : fallbackLabel;
    if (!value) continue;
    map.set(value, (map.get(value) || 0) + (row.count || 0));
  }

  return Array.from(map.entries())
    .map(([value, count]) => ({ value, count }))
    .sort((a, b) => b.count - a.count || a.value.localeCompare(b.value));
}

export async function GET() {
  try {
    const db = getD1Database();
    if (!db) {
      return NextResponse.json({
        inflectionCategories: [],
        inflectionCases: [],
        inflectionNumbers: [],
        inflectionGenders: [],
        nounLexiconGenders: [],
        nounPluralTypes: [],
      } as MorphologyFacets);
    }

    const [categories, cases, numbers, inflectGenders, nounGenders, pluralTypes] = await Promise.all([
      queryD1<{ value: string | null; count: number }>(
        db,
        `SELECT COALESCE(json_extract(grammatical_info, '$.category'), 'unspecified') AS value, COUNT(*) AS count
         FROM inflections
         GROUP BY value
         ORDER BY count DESC
         LIMIT 30`
      ),
      queryD1<{ value: string | null; count: number }>(
        db,
        `SELECT COALESCE(json_extract(grammatical_info, '$.case'), json_extract(grammatical_info, '$.state'), 'unspecified') AS value, COUNT(*) AS count
         FROM inflections
         GROUP BY value
         ORDER BY count DESC
         LIMIT 30`
      ),
      queryD1<{ value: string | null; count: number }>(
        db,
        `SELECT COALESCE(json_extract(grammatical_info, '$.number'), 'unspecified') AS value, COUNT(*) AS count
         FROM inflections
         GROUP BY value
         ORDER BY count DESC
         LIMIT 20`
      ),
      queryD1<{ value: string | null; count: number }>(
        db,
        `SELECT COALESCE(json_extract(grammatical_info, '$.gender'), 'unspecified') AS value, COUNT(*) AS count
         FROM inflections
         GROUP BY value
         ORDER BY count DESC
         LIMIT 10`
      ),
      queryD1<{ value: string | null; count: number }>(
        db,
        `SELECT LOWER(COALESCE(gender, 'unspecified')) AS value, COUNT(*) AS count
         FROM nouns_lexicon
         GROUP BY value
         ORDER BY count DESC`
      ),
      queryD1<{ value: string | null; count: number }>(
        db,
        `SELECT COALESCE(plural_type, 'unspecified') AS value, COUNT(*) AS count
         FROM nouns_lexicon
         GROUP BY value
         ORDER BY count DESC`
      ),
    ]);

    const payload: MorphologyFacets = {
      inflectionCategories: bucketize(categories, 'unspecified'),
      inflectionCases: bucketize(cases, 'unspecified'),
      inflectionNumbers: bucketize(numbers, 'unspecified'),
      inflectionGenders: bucketize(inflectGenders, 'unspecified'),
      nounLexiconGenders: bucketize(nounGenders, 'unspecified'),
      nounPluralTypes: bucketize(pluralTypes, 'unspecified'),
    };

    return NextResponse.json(payload);
  } catch (error) {
    console.error('Failed to load morphology facets', error);
    return NextResponse.json({ error: 'Failed to load morphology facets' }, { status: 500 });
  }
}
