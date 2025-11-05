import { NextRequest, NextResponse } from 'next/server';
import {
  getD1ClientOrThrow,
  getFormOccurrencesFromD1,
  getWordVerseRefs,
} from '@/utils/d1-helpers';

type TranslationKey = 'afghan2023' | 'yousafzai2019';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { word = 'وهل', translations = ['afghan2023', 'yousafzai2019'] }: {
      word?: string;
      translations?: TranslationKey[];
    } = body;

    console.log(`🔍 Testing search for word: "${word}"`);
    console.log(`🔍 Testing translations: ${translations.join(', ')}`);

    const db = getD1ClientOrThrow();

    // Check form_occurrences diagnostics
    console.log('\n📖 CHECKING FORM_OCCURRENCES:');
    const formData = await getFormOccurrencesFromD1(db, word);
    if (formData) {
      console.log(`✅ Found ${formData.verseRefs.length} refs in form_occurrences (frequency=${formData.frequency})`);
      console.log('   Sample refs:', formData.verseRefs.slice(0, 5));
    } else {
      console.log('❌ No entries in form_occurrences');
    }

    // Inspect per translation
    for (const translation of translations) {
      console.log(`\n🔎 Checking word_verse_mapping for ${translation}`);
      const verseRefs = await getWordVerseRefs(db, word, translation);
      if (verseRefs.length > 0) {
        console.log(`✅ Mapping table returned ${verseRefs.length} refs`);
        console.log('   Sample refs:', verseRefs.slice(0, 5));
      } else {
        console.log('❌ No refs in word_verse_mapping');
      }

      // Count entries per translation
      const countRow = await db.queryFirst<{ count: number }>(
        `SELECT COUNT(*) as count FROM word_verse_mapping WHERE translation_key = ?`,
        [translation]
      );
      console.log(`📊 Total mapping rows for ${translation}: ${countRow?.count ?? 0}`);
    }

    return NextResponse.json({
      success: true,
      message: 'Diagnostics logged to console',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Test error:', error);
    return NextResponse.json(
      { error: 'Test failed', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
