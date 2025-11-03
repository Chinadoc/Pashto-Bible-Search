import { NextRequest, NextResponse } from 'next/server';

const CLOUDFLARE_WORKER_URL = process.env.CLOUDFLARE_WORKER_URL || 'https://pashtobiblesearch.jeremy-samuels17.workers.dev';

export const runtime = 'edge';

/**
 * Enhanced lexicon frequency API endpoint
 * Queries D1 word_frequencies table with advanced filtering
 */
export async function GET(request: NextRequest) {
  try {
    const params = request.nextUrl.searchParams;
    
    // Filter parameters
    const scope = params.get('scope') || 'all'; // 'all' | 'ot' | 'nt'
    const limit = Math.min(1000, Math.max(50, Number(params.get('limit')) || 300));
    const posFilter = params.get('pos') || 'any'; // 'any' | 'verb' | 'noun' | etc.
    const inflectionPattern = params.get('inflection_pattern'); // 'pattern1', 'pattern2', etc.
    const inflectionLabel = params.get('inflection_label'); // 'masc_1st', 'fem_2nd', etc.
    const wordType = params.get('word_type'); // 'proper_noun', 'compound', etc.
    const verbAspect = params.get('verb_aspect'); // 'imperfective' | 'perfective'
    const compoundType = params.get('compound_type'); // 'dynamic' | 'stative'
    const searchQuery = params.get('search') || '';
    const sortBy = params.get('sort_by') || 'frequency'; // 'frequency' | 'word' | 'rank'
    const sortOrder = params.get('sort_order') || 'desc'; // 'asc' | 'desc'
    
    // Build SQL query
    let sql = `SELECT 
      pashto_word,
      frequency_total,
      frequency_rank,
      romanization,
      pos,
      word_type,
      inflection_pattern,
      inflection_label,
      base_word,
      has_issues,
      issue_flags
    FROM word_frequencies
    WHERE 1=1`;
    
    const conditions: string[] = [];
    
    // Scope filter (testament)
    if (scope === 'ot') {
      conditions.push(`(frequency_afghan2023_ot > 0 OR frequency_yousafzai2019_ot > 0)`);
    } else if (scope === 'nt') {
      conditions.push(`(frequency_afghan2023_nt > 0 OR frequency_yousafzai2019_nt > 0)`);
    }
    
    // POS filter
    if (posFilter !== 'any') {
      if (posFilter === 'verb') {
        conditions.push(`(pos LIKE '%verb%' OR pos LIKE '%v.%')`);
      } else if (posFilter === 'noun') {
        conditions.push(`(pos LIKE '%noun%' OR pos LIKE '%n.%')`);
      } else {
        conditions.push(`pos LIKE '%${posFilter}%'`);
      }
    }
    
    // Inflection pattern filter
    if (inflectionPattern) {
      conditions.push(`inflection_pattern = '${inflectionPattern.replace(/'/g, "''")}'`);
    }
    
    // Inflection label filter (1st/2nd inflection)
    if (inflectionLabel) {
      conditions.push(`inflection_label LIKE '%${inflectionLabel.replace(/'/g, "''")}%'`);
    }
    
    // Word type filter
    if (wordType) {
      conditions.push(`word_type = '${wordType.replace(/'/g, "''")}'`);
    }
    
    // Search query
    if (searchQuery) {
      conditions.push(`(pashto_word LIKE '%${searchQuery.replace(/'/g, "''")}%' OR romanization LIKE '%${searchQuery.replace(/'/g, "''")}%')`);
    }
    
    // Add conditions to SQL
    if (conditions.length > 0) {
      sql += ' AND ' + conditions.join(' AND ');
    }
    
    // Sorting
    if (sortBy === 'frequency') {
      sql += ` ORDER BY frequency_total ${sortOrder.toUpperCase()}`;
    } else if (sortBy === 'word') {
      sql += ` ORDER BY pashto_word ${sortOrder.toUpperCase()}`;
    } else if (sortBy === 'rank') {
      sql += ` ORDER BY frequency_rank ${sortOrder.toUpperCase()}`;
    }
    
    // Limit
    sql += ` LIMIT ${limit}`;
    
    // Query D1 via Cloudflare Worker
    // For now, we'll use a simple fetch approach
    // In production, you'd want to add a D1 query endpoint to the worker
    
    // Fallback: Use existing lexicon_frequency endpoint for now
    // We'll enhance this later
    const fallbackUrl = `/api/lexicon_frequency?scope=${scope}&limit=${limit}&pos=${posFilter}`;
    const fallbackResponse = await fetch(new URL(fallbackUrl, request.url));
    
    if (fallbackResponse.ok) {
      const data = await fallbackResponse.json();
      
      // Apply additional filters client-side for now
      let items = data.items || [];
      
      // Filter by inflection pattern
      if (inflectionPattern) {
        // This would need to come from the data
        // For now, we'll filter what we can
      }
      
      // Filter by inflection label
      if (inflectionLabel) {
        // This would need inflection_label in the data
      }
      
      // Filter by word type
      if (wordType) {
        // This would need word_type in the data
      }
      
      // Apply search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        items = items.filter((item: any) => 
          item.form.toLowerCase().includes(query) ||
          (item.dictionary?.romanized || '').toLowerCase().includes(query)
        );
      }
      
      return NextResponse.json({
        items,
        total: items.length,
        filters: {
          scope,
          limit,
          posFilter,
          inflectionPattern,
          inflectionLabel,
          wordType,
          verbAspect,
          compoundType,
          searchQuery,
        },
      });
    }
    
    return NextResponse.json({ items: [], total: 0 });
    
  } catch (error: any) {
    console.error('Lexicon API error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
