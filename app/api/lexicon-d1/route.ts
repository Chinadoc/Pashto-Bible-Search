import { NextRequest, NextResponse } from 'next/server';

const CLOUDFLARE_ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID || '3ac1a6fafce90adf6b1c8f1280dfc94d';
const CLOUDFLARE_API_TOKEN = process.env.CLOUDFLARE_API_TOKEN;
const D1_DATABASE_ID = '54a972b6-897a-4ae0-ba19-ecf4a6edc3b0';

export const runtime = 'edge';

/**
 * Lexicon API endpoint - queries word_frequencies table directly
 * Uses Cloudflare Worker endpoint (primary) or REST API (fallback) to query D1 database
 * 
 * Environment Variables:
 * - NEXT_PUBLIC_CLOUDFLARE_WORKER_URL: Worker URL (default: https://pashtobiblesearch.jeremy-samuels17.workers.dev)
 * - CLOUDFLARE_API_TOKEN: Optional fallback if Worker unavailable
 */
export async function GET(request: NextRequest) {
  try {
    const params = request.nextUrl.searchParams;
    
    // Filter parameters
    const scope = params.get('scope') || 'all'; // 'all' | 'ot' | 'nt'
    const limit = Math.min(10000, Math.max(50, Number(params.get('limit')) || 1000));
    const posFilter = params.get('pos') || 'all'; // 'any' | 'verb' | 'noun' | etc.
    const inflectionType = params.get('inflection_type'); // 'plain', '1st', '2nd', etc.
    const wordType = params.get('word_type'); // 'noun', 'verb', 'compound', etc.
    const compoundType = params.get('compound_type'); // 'dynamic' | 'stative'
    const searchQuery = params.get('search') || '';
    const sortBy = params.get('sort_by') || 'frequency'; // 'frequency' | 'word' | 'rank'
    const sortOrder = params.get('sort_order') || 'desc'; // 'asc' | 'desc'
    
    // Build SQL query with correct column names
    let sql = `SELECT 
      id,
      pashto_word,
      frequency_total,
      frequency_rank,
      frequency_afghan2023_ot,
      frequency_afghan2023_nt,
      frequency_yousafzai2019_ot,
      frequency_yousafzai2019_nt,
      romanization,
      pos,
      word_type,
      inflection_type,
      compound_type,
      base_form,
      english_translation,
      has_issues,
      issue_flags
    FROM word_frequencies
    WHERE frequency_total > 0`;
    
    const conditions: string[] = [];
    
    // Scope filter (testament)
    if (scope === 'ot') {
      conditions.push(`(frequency_afghan2023_ot > 0 OR frequency_yousafzai2019_ot > 0)`);
    } else if (scope === 'nt') {
      conditions.push(`(frequency_afghan2023_nt > 0 OR frequency_yousafzai2019_nt > 0)`);
    }
    
    // POS filter
    if (posFilter && posFilter !== 'all' && posFilter !== 'any') {
      if (posFilter === 'verb') {
        conditions.push(`(pos LIKE '%verb%' OR pos LIKE '%v.%' OR word_type = 'verb')`);
      } else if (posFilter === 'noun') {
        conditions.push(`(pos LIKE '%noun%' OR pos LIKE '%n.%' OR word_type = 'noun')`);
      } else if (posFilter === 'adj') {
        conditions.push(`(pos LIKE '%adj%' OR pos LIKE '%adjective%' OR word_type = 'adjective')`);
      } else if (posFilter === 'adv') {
        conditions.push(`(pos LIKE '%adv%' OR pos LIKE '%adverb%')`);
      } else {
        conditions.push(`(pos LIKE '%${posFilter.replace(/'/g, "''")}%' OR word_type = '${posFilter.replace(/'/g, "''")}')`);
      }
    }
    
    // Inflection type filter
    if (inflectionType && inflectionType !== 'all' && inflectionType !== 'any') {
      conditions.push(`inflection_type = '${inflectionType.replace(/'/g, "''")}'`);
    }
    
    // Word type filter
    if (wordType && wordType !== 'all' && wordType !== 'any') {
      conditions.push(`word_type = '${wordType.replace(/'/g, "''")}'`);
    }
    
    // Compound type filter
    if (compoundType && compoundType !== 'all' && compoundType !== 'any') {
      conditions.push(`compound_type = '${compoundType.replace(/'/g, "''")}'`);
    }
    
    // Search query
    if (searchQuery) {
      const escapedQuery = searchQuery.replace(/'/g, "''");
      conditions.push(`(pashto_word LIKE '%${escapedQuery}%' OR romanization LIKE '%${escapedQuery}%' OR english_translation LIKE '%${escapedQuery}%')`);
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
    } else {
      sql += ` ORDER BY frequency_total DESC`;
    }
    
    // Limit
    sql += ` LIMIT ${limit}`;
    
    console.log('Querying D1:', sql.substring(0, 200) + '...');
    
    // Try Worker endpoint first (already has D1 access configured)
    // Use default Worker URL if env var not set
    const CLOUDFLARE_WORKER_URL = process.env.NEXT_PUBLIC_CLOUDFLARE_WORKER_URL || 'https://pashtobiblesearch.jeremy-samuels17.workers.dev';
    console.log('Using Worker URL:', CLOUDFLARE_WORKER_URL);
    let rows: any[] = [];
    
    try {
      // Try Worker endpoint first
      const workerUrl = `${CLOUDFLARE_WORKER_URL}/api/d1/query`;
      console.log('Fetching from Worker:', workerUrl);
      
      // Add timeout to prevent hanging
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
      
      try {
        const workerResponse = await fetch(workerUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ sql }),
          signal: controller.signal,
        });
        
        clearTimeout(timeoutId);
        console.log('Worker response status:', workerResponse.status);
        
        if (workerResponse.ok) {
          const result = await workerResponse.json();
          rows = result.results || [];
          console.log('Got', rows.length, 'rows from Worker endpoint');
        } else {
          const errorText = await workerResponse.text().catch(() => 'Unknown error');
          console.warn('Worker endpoint failed:', workerResponse.status, errorText);
          // Fallback to REST API if Worker fails
          throw new Error(`Worker endpoint failed: ${workerResponse.status} - ${errorText}`);
        }
      } catch (fetchError: any) {
        clearTimeout(timeoutId);
        if (fetchError.name === 'AbortError') {
          throw new Error('Worker endpoint timeout after 30 seconds');
        }
        throw fetchError;
      }
    } catch (workerError: any) {
      console.error('Worker endpoint error:', workerError.message || workerError);
      
      // Fallback to Cloudflare REST API if Worker is unavailable
      console.log('Falling back to Cloudflare REST API...');
      
      if (!CLOUDFLARE_API_TOKEN) {
        console.error('No CLOUDFLARE_API_TOKEN available for fallback');
        return NextResponse.json(
          { 
            error: 'Worker endpoint unavailable and no API token configured',
            details: `Worker error: ${workerError.message}. Please ensure NEXT_PUBLIC_CLOUDFLARE_WORKER_URL is set in Vercel or configure CLOUDFLARE_API_TOKEN as fallback.`,
            workerUrl: CLOUDFLARE_WORKER_URL
          },
          { status: 500 }
        );
      }
      
      const apiUrl = `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/d1/database/${D1_DATABASE_ID}/query`;
      
      const apiResponse = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${CLOUDFLARE_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sql }),
      });
      
      if (!apiResponse.ok) {
        const errorText = await apiResponse.text();
        console.error('Cloudflare API error:', apiResponse.status, errorText);
        return NextResponse.json(
          { error: 'Database query failed', details: errorText },
          { status: apiResponse.status }
        );
      }
      
      const result = await apiResponse.json();
      
      // Parse Cloudflare REST API response format
      if (result.success && result.result && Array.isArray(result.result) && result.result.length > 0) {
        rows = result.result[0].results || [];
      }
      console.log('Got', rows.length, 'rows from Cloudflare REST API');
    }
    
    if (rows.length === 0) {
      console.warn('No rows returned from D1');
      return NextResponse.json({
        items: [],
        total: 0,
        filters: {
          scope,
          limit,
          posFilter,
          inflectionType,
          wordType,
          compoundType,
          searchQuery,
        },
      });
    }
    
    // Transform rows to match frontend expectations
    const items = rows.map((row: any) => ({
      id: row.id,
      pashto_word: row.pashto_word,
      frequency_total: row.frequency_total || 0,
      frequency_rank: row.frequency_rank || 0,
      frequency_afghan2023_ot: row.frequency_afghan2023_ot || 0,
      frequency_afghan2023_nt: row.frequency_afghan2023_nt || 0,
      frequency_yousafzai2019_ot: row.frequency_yousafzai2019_ot || 0,
      frequency_yousafzai2019_nt: row.frequency_yousafzai2019_nt || 0,
      romanization: row.romanization || null,
      pos: row.pos || null,
      word_type: row.word_type || null,
      inflection_type: row.inflection_type || null,
      compound_type: row.compound_type || null,
      base_form: row.base_form || null,
      english_translation: row.english_translation || null,
      has_issues: row.has_issues || 0,
      issue_flags: row.issue_flags || null,
    }));
    
    return NextResponse.json({
      items,
      total: items.length,
      filters: {
        scope,
        limit,
        posFilter,
        inflectionType,
        wordType,
        compoundType,
        searchQuery,
        sortBy,
        sortOrder,
      },
    });
    
  } catch (error: any) {
    console.error('Lexicon API error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
