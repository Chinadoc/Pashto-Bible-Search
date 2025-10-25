import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/utils/supabase';

// Type definition for verse from Supabase
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

// Helper function to decode HTML entities
function decodeHtmlEntities(text: string): string {
  const entities: Record<string, string> = {
    '&nbsp;': ' ',
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#39;': "'",
    '&apos;': "'",
  };
  
  let decoded = text;
  for (const [entity, char] of Object.entries(entities)) {
    decoded = decoded.replace(new RegExp(entity, 'g'), char);
  }
  return decoded;
}

// Define chapter counts for each book
const CHAPTER_COUNTS: Record<string, number> = {
  // Old Testament
  'Genesis': 50, 'Exodus': 40, 'Leviticus': 27, 'Numbers': 36, 'Deuteronomy': 34,
  'Joshua': 24, 'Judges': 21, 'Ruth': 4, '1 Samuel': 31, '2 Samuel': 24,
  '1 Kings': 22, '2 Kings': 25, '1 Chronicles': 29, '2 Chronicles': 36,
  'Ezra': 10, 'Nehemiah': 13, 'Esther': 10, 'Job': 42, 'Psalms': 150,
  'Proverbs': 31, 'Ecclesiastes': 12, 'Song of Solomon': 8, 'Isaiah': 66,
  'Jeremiah': 52, 'Lamentations': 5, 'Ezekiel': 48, 'Daniel': 12, 'Hosea': 14,
  'Joel': 3, 'Amos': 9, 'Obadiah': 1, 'Jonah': 4, 'Micah': 7, 'Nahum': 3,
  'Habakkuk': 3, 'Zephaniah': 3, 'Haggai': 2, 'Zechariah': 14, 'Malachi': 4,
  // New Testament
  'Matthew': 28, 'Mark': 16, 'Luke': 24, 'John': 21, 'Acts': 28, 'Romans': 16,
  '1 Corinthians': 16, '2 Corinthians': 13, 'Galatians': 6, 'Ephesians': 6,
  'Philippians': 4, 'Colossians': 4, '1 Thessalonians': 5, '2 Thessalonians': 3,
  '1 Timothy': 6, '2 Timothy': 4, 'Titus': 3, 'Philemon': 1, 'Hebrews': 13,
  'James': 5, '1 Peter': 5, '2 Peter': 3, '1 John': 5, '2 John': 1, '3 John': 1,
  'Jude': 1, 'Revelation': 22
};

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const book = searchParams.get('book');
    const chapterParam = searchParams.get('chapter');
    const translation = searchParams.get('translation') || 'afghan2023'; // Default to Afghan 2023

    if (!book) {
      return NextResponse.json({ error: 'Book parameter is required' }, { status: 400 });
    }

    // Get all chapter counts if no chapter specified
    if (!chapterParam) {
      const chapterCount = CHAPTER_COUNTS[book] || 0;
      return NextResponse.json({ book, chapterCount, chapters: Array.from({ length: chapterCount }, (_, i) => i + 1) });
    }

    const chapter = parseInt(chapterParam, 10);
    if (isNaN(chapter) || chapter < 1) {
      return NextResponse.json({ error: 'Invalid chapter number' }, { status: 400 });
    }

    // Query Supabase verses table directly - much faster than loading all verses
    const tableName = translation === 'yousafzai2019' ? 'verses_yousafzai' : 'verses';

    console.log(`📖 Fetching ${book} ${chapter} from ${tableName} (translation: ${translation})`);

    const { data: verses, error } = await supabase
      .from(tableName)
      .select('book, chapter, verse, text, testament, audio_storage_path, audio_public_url')
      .eq('book', book)
      .eq('chapter', chapter)
      .order('verse', { ascending: true });

    if (error) {
      console.error(`❌ Supabase query error for ${tableName}:`, error);
      return NextResponse.json(
        { error: 'Database query failed', details: error.message },
        { status: 500 }
      );
    }

    console.log(`✅ Query returned ${verses?.length || 0} verses from ${tableName}`);

    // DEBUG: Check audio data in first verse
    if (verses && verses.length > 0) {
      const firstVerse = verses[0] as VerseRow;
      console.log(`📝 First verse audio data:`, {
        ref: `${firstVerse.book} ${firstVerse.chapter}:${firstVerse.verse}`,
        audio_storage_path: firstVerse.audio_storage_path,
        audio_public_url: firstVerse.audio_public_url
      });
    }

    if (!verses || verses.length === 0) {
      // If Afghan 2023 is empty, try Yousafzai as fallback
      if (translation === 'afghan2023') {
        console.log(`⚠️  No verses found in ${tableName}, trying verses_yousafzai as fallback...`);
        const { data: fallbackVerses, error: fallbackError } = await supabase
          .from('verses_yousafzai')
          .select('book, chapter, verse, text, testament, audio_storage_path, audio_public_url')
          .eq('book', book)
          .eq('chapter', chapter)
          .order('verse', { ascending: true });

        if (fallbackError) {
          console.error('❌ Fallback query also failed:', fallbackError);
          return NextResponse.json({ error: 'No verses found for this chapter in any translation' }, { status: 404 });
        }

        if (fallbackVerses && fallbackVerses.length > 0) {
          console.log(`✅ Found ${fallbackVerses.length} verses in Yousafzai as fallback`);
          const formattedVerses = fallbackVerses.map((v: any) => ({
            ref: `${v.book} ${v.chapter}:${v.verse}`,
            book: v.book,
            chapter: v.chapter,
            verse: v.verse,
            text: decodeHtmlEntities(v.text),
            testament: v.testament,
            dialect: 'yousafzai',
            audio_storage_path: v.audio_storage_path,
            audio_public_url: v.audio_public_url,
          }));

          return NextResponse.json({
            book,
            chapter,
            translation: 'yousafzai2019',
            verses: formattedVerses,
            totalVerses: formattedVerses.length,
            note: 'Afghan 2023 not available, showing Yousafzai 2019 instead'
          });
        }
      }

      return NextResponse.json({ error: 'No verses found for this chapter' }, { status: 404 });
    }

    // Format verses for response
    const formattedVerses = verses.map((v: any) => ({
      ref: `${v.book} ${v.chapter}:${v.verse}`,
      book: v.book,
      chapter: v.chapter,
      verse: v.verse,
      text: decodeHtmlEntities(v.text),
      testament: v.testament,
      dialect: translation === 'yousafzai2019' ? 'yousafzai' : 'afghan',
      audio_storage_path: v.audio_storage_path,
      audio_public_url: v.audio_public_url,
    }));

    return NextResponse.json({
      book,
      chapter,
      translation,
      verses: formattedVerses,
      totalVerses: formattedVerses.length,
    });
  } catch (error) {
    console.error('Error fetching chapter verses:', error);
    return NextResponse.json(
      { error: 'Failed to fetch chapter verses' },
      { status: 500 }
    );
  }
}
