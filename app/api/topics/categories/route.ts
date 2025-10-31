import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/topics/categories
 * Returns all word categories with counts
 */
export async function GET(request: NextRequest) {
  try {
    // Query Cloudflare D1 for categories with word and verse counts
    const { exec } = require('child_process');
    const { promisify } = require('util');
    const execAsync = promisify(exec);

    // Get categories with word counts
    const { stdout } = await execAsync(
      `npx wrangler d1 execute pashto-bible-db --remote --command="
        SELECT 
          wc.category_key,
          wc.category_name,
          wc.description,
          COUNT(DISTINCT wcm.pashto_word) as word_count,
          COUNT(DISTINCT cvm.verse_id) as verse_count
        FROM word_categories wc
        LEFT JOIN word_category_mappings wcm ON wc.category_key = wcm.category_key
        LEFT JOIN category_verse_mappings cvm ON wc.category_key = cvm.category_key
        GROUP BY wc.category_key, wc.category_name, wc.description
        ORDER BY wc.category_name;
      " --json`,
      { maxBuffer: 10 * 1024 * 1024, timeout: 30000 }
    );

    const result = JSON.parse(stdout);
    const data = Array.isArray(result) ? result[0] : result;
    const categories = data.results || [];

    return NextResponse.json({
      categories: categories.map((cat: any) => ({
        category_key: cat.category_key,
        category_name: cat.category_name,
        description: cat.description,
        word_count: cat.word_count || 0,
        verse_count: cat.verse_count || 0,
      })),
    });
  } catch (error: any) {
    console.error('Topics categories API error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to load categories' },
      { status: 500 }
    );
  }
}

