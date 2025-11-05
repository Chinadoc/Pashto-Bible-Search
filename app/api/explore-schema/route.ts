import { NextRequest, NextResponse } from 'next/server';
import { getD1Database, D1Client } from '@/utils/d1';

export async function GET(request: NextRequest) {
  try {
    const results: any = {};

    const d1Db = getD1Database();
    if (!d1Db) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
    }
    const db = new D1Client(d1Db);

    // Check verses_afghan2023 table
    try {
      const verses = await db.query<any>(
        `SELECT * FROM verses_afghan2023 LIMIT 1`
      );

      if (verses && verses.length > 0) {
        results.verses_afghan2023 = {
          columns: Object.keys(verses[0]),
          sample: verses[0]
        };
      }
    } catch (error) {
      console.warn('Could not query verses_afghan2023:', error);
    }

    // Check verses_yousafzai table
    try {
      const verses = await db.query<any>(
        `SELECT * FROM verses_yousafzai LIMIT 1`
      );

      if (verses && verses.length > 0) {
        results.verses_yousafzai = {
          columns: Object.keys(verses[0]),
          sample: verses[0]
        };
      }
    } catch (error) {
      console.warn('Could not query verses_yousafzai:', error);
    }

    // Check word_frequencies table
    try {
      const freq = await db.query<any>(
        `SELECT * FROM word_frequencies LIMIT 1`
      );

      if (freq && freq.length > 0) {
        results.word_frequencies = {
          columns: Object.keys(freq[0]),
          sample: freq[0]
        };
      }
    } catch (error) {
      console.warn('Could not query word_frequencies:', error);
    }

    // Check form_occurrences table
    try {
      const formOcc = await db.query<any>(
        `SELECT * FROM form_occurrences LIMIT 1`
      );

      if (formOcc && formOcc.length > 0) {
        results.form_occurrences = {
          columns: Object.keys(formOcc[0]),
          sample: formOcc[0]
        };
      }
    } catch (error) {
      console.warn('Could not query form_occurrences:', error);
    }

    // Check form_to_root table
    try {
      const formRoots = await db.query<any>(
        `SELECT * FROM form_to_root LIMIT 1`
      );

      if (formRoots && formRoots.length > 0) {
        results.form_to_root = {
          columns: Object.keys(formRoots[0]),
          sample: formRoots[0]
        };
      }
    } catch (error) {
      console.warn('Could not query form_to_root:', error);
    }

    // Check inflections table
    try {
      const inflections = await db.query<any>(
        `SELECT * FROM inflections LIMIT 1`
      );

      if (inflections && inflections.length > 0) {
        results.inflections = {
          columns: Object.keys(inflections[0]),
          sample: inflections[0]
        };
      }
    } catch (error) {
      console.warn('Could not query inflections:', error);
    }

    // Check nouns_lexicon table
    try {
      const nouns = await db.query<any>(
        `SELECT * FROM nouns_lexicon LIMIT 1`
      );

      if (nouns && nouns.length > 0) {
        results.nouns_lexicon = {
          columns: Object.keys(nouns[0]),
          sample: nouns[0]
        };
      }
    } catch (error) {
      console.warn('Could not query nouns_lexicon:', error);
    }

    // Check verbs_lexicon table
    try {
      const verbs = await db.query<any>(
        `SELECT * FROM verbs_lexicon LIMIT 1`
      );

      if (verbs && verbs.length > 0) {
        results.verbs_lexicon = {
          columns: Object.keys(verbs[0]),
          sample: verbs[0]
        };
      }
    } catch (error) {
      console.warn('Could not query verbs_lexicon:', error);
    }

    // Check word_verse_mapping table
    try {
      const mapping = await db.query<any>(
        `SELECT * FROM word_verse_mapping LIMIT 1`
      );

      if (mapping && mapping.length > 0) {
        results.word_verse_mapping = {
          columns: Object.keys(mapping[0]),
          sample: mapping[0]
        };
      }
    } catch (error) {
      console.warn('Could not query word_verse_mapping:', error);
    }

    return NextResponse.json({ success: true, schema: results });
  } catch (error) {
    console.error('Error exploring schema:', error);
    return NextResponse.json(
      { error: 'Failed to explore schema' },
      { status: 500 }
    );
  }
}
