import { getD1Database, D1Client } from '@/utils/d1';

export function getD1ClientOrThrow(): D1Client {
  const d1Db = getD1Database();
  if (!d1Db) {
    throw new Error('Database not configured');
  }
  return new D1Client(d1Db);
}

export function parseVerseRef(ref: string): { book: string; chapter: number; verse: number } | null {
  if (!ref) return null;
  const match = ref.match(/^(.+?)\s+(\d+):(\d+)$/);
  if (!match) return null;
  const [, book, chapterStr, verseStr] = match;
  const chapter = Number.parseInt(chapterStr, 10);
  const verse = Number.parseInt(verseStr, 10);

  if (Number.isNaN(chapter) || Number.isNaN(verse)) {
    return null;
  }

  return { book, chapter, verse };
}

export function parseD1Json<T>(value: string | T | null | undefined, fallback: T): T {
  if (value == null) return fallback;
  if (typeof value === 'string') {
    try {
      return JSON.parse(value) as T;
    } catch {
      return fallback;
    }
  }
  return value as T;
}

export function getVersesTableName(translation: 'afghan2023' | 'yousafzai2019'): string {
  return translation === 'yousafzai2019' ? 'verses_yousafzai' : 'verses_afghan2023';
}

export async function fetchVerseByRef(
  db: D1Client,
  ref: string,
  translation: 'afghan2023' | 'yousafzai2019'
): Promise<any | null> {
  const parsed = parseVerseRef(ref);
  if (!parsed) return null;

  const table = getVersesTableName(translation);

  try {
    const verse = await db.queryFirst<any>(
      `SELECT book, chapter, verse, text, text_normalized, testament, translation_key, dialect, audio_public_url, audio_r2_key FROM ${table} WHERE book = ? AND chapter = ? AND verse = ? LIMIT 1`,
      [parsed.book, parsed.chapter, parsed.verse]
    );
    if (verse) {
      return verse;
    }
  } catch (error) {
    console.warn(`Failed to fetch verse ${ref} from ${table}:`, error);
  }

  return null;
}

export async function getFormOccurrencesFromD1(
  db: D1Client,
  form: string,
  translation?: 'afghan2023' | 'yousafzai2019'
): Promise<{ form: string; verseRefs: string[]; frequency: number } | null> {
  if (!form) return null;

  try {
    const rows = await db.query<{ pashto_form: string; verse_refs: string; frequency: number; translation_key?: string | null }>(
      `SELECT pashto_form, verse_refs, frequency, translation_key FROM form_occurrences WHERE pashto_form = ?`,
      [form]
    );

    if (!rows || rows.length === 0) {
      return null;
    }

    const verseSet = new Set<string>();
    let totalFrequency = 0;

    for (const row of rows) {
      if (translation && row.translation_key && row.translation_key !== translation) {
        continue;
      }

      const refs = parseD1Json<string[]>(row.verse_refs, []);
      refs.forEach((ref) => {
        if (typeof ref === 'string' && ref.trim().length > 0) {
          verseSet.add(ref.trim());
        }
      });
      totalFrequency += row.frequency || refs.length;
    }

    if (verseSet.size === 0) {
      return null;
    }

    return {
      form,
      verseRefs: Array.from(verseSet),
      frequency: totalFrequency,
    };
  } catch (error) {
    console.warn(`Failed to query form_occurrences for ${form}:`, error);
    return null;
  }
}

export async function getWordVerseRefs(
  db: D1Client,
  word: string,
  translation: 'afghan2023' | 'yousafzai2019'
): Promise<string[]> {
  try {
    const rows = await db.query<{ verse_ref: string }>(
      `SELECT verse_ref FROM word_verse_mapping WHERE pashto_word = ? AND translation_key = ?`,
      [word, translation]
    );

    if (!rows || rows.length === 0) {
      return [];
    }

    const refs = new Set<string>();
    rows.forEach((row) => {
      if (row.verse_ref) {
        refs.add(row.verse_ref);
      }
    });
    return Array.from(refs);
  } catch (error) {
    console.warn(`Failed to query word_verse_mapping for ${word}:`, error);
    return [];
  }
}

export async function getWordFrequency(
  db: D1Client,
  word: string
): Promise<{ frequency: number; rank?: number; translationTotals?: Record<string, number> } | null> {
  try {
    const row = await db.queryFirst<{
      frequency_total?: number;
      frequency_rank?: number;
      frequency_afghan2023_ot?: number;
      frequency_afghan2023_nt?: number;
      frequency_yousafzai2019_ot?: number;
      frequency_yousafzai2019_nt?: number;
    }>(
      `SELECT frequency_total, frequency_rank, frequency_afghan2023_ot, frequency_afghan2023_nt, frequency_yousafzai2019_ot, frequency_yousafzai2019_nt FROM word_frequencies WHERE pashto_word = ? LIMIT 1`,
      [word]
    );

    if (!row) {
      return null;
    }

    return {
      frequency: row.frequency_total ?? 0,
      rank: row.frequency_rank ?? undefined,
      translationTotals: {
        afghan2023_ot: row.frequency_afghan2023_ot ?? 0,
        afghan2023_nt: row.frequency_afghan2023_nt ?? 0,
        yousafzai2019_ot: row.frequency_yousafzai2019_ot ?? 0,
        yousafzai2019_nt: row.frequency_yousafzai2019_nt ?? 0,
      },
    };
  } catch (error) {
    console.warn(`Failed to query word_frequencies for ${word}:`, error);
    return null;
  }
}


