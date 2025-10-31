import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/topics/verses?category=CATEGORY_KEY&limit=50
 * Returns verses for a specific category
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryKey = searchParams.get('category');
    const limit = Math.min(100, Math.max(10, parseInt(searchParams.get('limit') || '50')));

    if (!categoryKey) {
      return NextResponse.json(
        { error: 'Category parameter required' },
        { status: 400 }
      );
    }

    // Query Cloudflare D1 for verses in this category
    const { exec } = require('child_process');
    const { promisify } = require('util');
    const execAsync = promisify(exec);

    const { stdout } = await execAsync(
      `npx wrangler d1 execute pashto-bible-db --remote --command="
        SELECT DISTINCT
          cvm.verse_ref,
          cvm.book,
          cvm.chapter,
          cvm.verse,
          cvm.pashto_word,
          cvm.translation_key,
          cvm.testament,
          CASE 
            WHEN cvm.translation_key = 'afghan2023' THEN af.text
            WHEN cvm.translation_key = 'yousafzai2019' THEN yz.text
            ELSE NULL
          END as text
        FROM category_verse_mappings cvm
        LEFT JOIN verses_afghan2023 af ON 
          cvm.translation_key = 'afghan2023' 
          AND cvm.book = af.book 
          AND cvm.chapter = af.chapter 
          AND cvm.verse = af.verse
        LEFT JOIN verses_yousafzai yz ON 
          cvm.translation_key = 'yousafzai2019' 
          AND cvm.book = yz.book 
          AND cvm.chapter = yz.chapter 
          AND cvm.verse = yz.verse
        WHERE cvm.category_key = '${categoryKey.replace(/'/g, "''")}'
        ORDER BY cvm.book, cvm.chapter, cvm.verse
        LIMIT ${limit};
      " --json`,
      { maxBuffer: 10 * 1024 * 1024, timeout: 30000 }
    );

    const result = JSON.parse(stdout);
    const data = Array.isArray(result) ? result[0] : result;
    const verses = data.results || [];

    return NextResponse.json({
      category: categoryKey,
      verses: verses.map((v: any) => ({
        verse_ref: v.verse_ref,
        book: v.book,
        chapter: v.chapter,
        verse: v.verse,
        pashto_word: v.pashto_word,
        translation_key: v.translation_key,
        testament: v.testament,
        text: v.text,
      })),
      count: verses.length,
    });
  } catch (error: any) {
    console.error('Topics verses API error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to load verses' },
      { status: 500 }
    );
  }
}

