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
      inflection_type,
      base_form,
      compound_type,
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
    
    // Inflection pattern filter - map dropdown values to inflection_type
    if (inflectionPattern && inflectionPattern !== 'any') {
      // Map pattern values to actual inflection_type values
      // For now, we'll filter by inflection_type values that match patterns
      // This might need adjustment based on how patterns are stored
      conditions.push(`inflection_type IS NOT NULL`);
    }
    
    // Inflection label filter (1st/2nd inflection) - map to inflection_type
    if (inflectionLabel && inflectionLabel !== 'any') {
      // Map dropdown values to inflection_type values
      let inflectionTypeFilter = '';
      if (inflectionLabel === 'plain') {
        inflectionTypeFilter = "plain";
      } else if (inflectionLabel === 'masc_1st') {
        inflectionTypeFilter = "1st";
      } else if (inflectionLabel === 'masc_2nd') {
        inflectionTypeFilter = "2nd";
      } else if (inflectionLabel === 'fem_1st') {
        inflectionTypeFilter = "1st";
      } else if (inflectionLabel === 'fem_2nd') {
        inflectionTypeFilter = "2nd";
      } else {
        inflectionTypeFilter = inflectionLabel.replace('masc_', '').replace('fem_', '');
      }
      if (inflectionTypeFilter) {
        // Use exact match for better accuracy
        conditions.push(`inflection_type = '${inflectionTypeFilter.replace(/'/g, "''")}'`);
      }
    }
    
    // Word type filter
    if (wordType && wordType !== 'any') {
      conditions.push(`word_type = '${wordType.replace(/'/g, "''")}'`);
    }
    
    // Compound type filter
    if (compoundType && compoundType !== 'any') {
      conditions.push(`compound_type = '${compoundType.replace(/'/g, "''")}'`);
    }
    
    // Search query
    if (searchQuery) {
      conditions.push(`(pashto_word LIKE '%${searchQuery.replace(/'/g, "''")}%' OR romanization LIKE '%${searchQuery.replace(/'/g, "''")}%')`);
    }
    
    // Add conditions to SQL
    if (conditions.length > 0) {
      sql += ' AND ' + conditions.join(' AND ');
    }
    
    console.log('Final SQL query:', sql);
    console.log('Conditions:', conditions);
    
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
    console.log('Executing SQL:', sql.substring(0, 200));
    const workerResponse = await fetch(`${CLOUDFLARE_WORKER_URL}/api/d1/query`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sql }),
    });
    
    console.log('Worker response status:', workerResponse.status);
    
    if (workerResponse.ok) {
      const result = await workerResponse.json();
      const rows = result.results || [];
      console.log('Got', rows.length, 'rows from D1');
      
      // Transform rows to match expected format
      const items = rows.map((row: any) => ({
        form: row.pashto_word,
        frequency: row.frequency_total || 0,
        rank: row.frequency_rank || 0,
        root: row.base_form || null,
        pos: row.pos || null,
        romanization: row.romanization || null,
        wordType: row.word_type || null,
        inflectionPattern: null, // Pattern not stored directly, would need to derive from base_form
        inflectionLabel: row.inflection_type || null,
        inflectionType: row.inflection_type || null,
        compoundType: row.compound_type || null,
        hasIssues: row.has_issues || 0,
        issueFlags: row.issue_flags ? (typeof row.issue_flags === 'string' ? JSON.parse(row.issue_flags) : row.issue_flags) : [],
        dictionary: row.romanization ? {
          romanized: row.romanization,
          pos: row.pos,
        } : undefined,
      }));
      
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
    
    // If D1 query fails, return empty result
    console.warn('D1 query failed:', workerResponse.status, workerResponse.statusText);
    const errorText = await workerResponse.text().catch(() => 'Unknown error');
    console.warn('Error details:', errorText);
    return NextResponse.json({ items: [], total: 0, error: 'D1 query failed', details: errorText });
    
  } catch (error: any) {
    console.error('Lexicon API error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
