/**
 * Cloudflare Worker API Routes for Pashto Bible Search
 * Provides API endpoints for database queries and audio access via D1 + R2
 */

export interface Env {
  DB: D1Database;
  AUDIO_BUCKET: R2Bucket;
}

// ========================================
// Helper Functions
// ========================================

function jsonResponse(data: any, status: number = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

function errorResponse(message: string, status: number = 500): Response {
  return jsonResponse({ error: message }, status);
}

// Helper to parse JSON safely from SQLite TEXT columns
function parseJsonSafe<T>(jsonString: string | null, defaultValue: T): T {
  if (!jsonString) return defaultValue;
  try {
    return JSON.parse(jsonString) as T;
  } catch {
    return defaultValue;
  }
}

// ========================================
// API Routes
// ========================================

/**
 * Search verses by text query
 */
async function searchVerses(
  env: Env,
  query: string,
  options: {
    translation?: 'afghan2023' | 'yousafzai2019';
    testament?: 'OT' | 'NT';
    limit?: number;
  } = {}
): Promise<Response> {
  const { translation = 'afghan2023', testament, limit = 100 } = options;
  const table = translation === 'yousafzai2019' ? 'verses_yousafzai' : 'verses_afghan2023';

  try {
    let sql = `SELECT * FROM ${table} WHERE text LIKE ?`;
    const params: any[] = [`%${query}%`];

    if (testament) {
      sql += ` AND testament = ?`;
      params.push(testament);
    }

    sql += ` ORDER BY book, chapter, verse LIMIT ?`;
    params.push(limit);

    const result = await env.DB.prepare(sql).bind(...params).all();

    // Convert SQLite timestamps to ISO strings
    const verses = result.results?.map((verse: any) => ({
      ...verse,
      created_at: verse.created_at ? new Date(verse.created_at * 1000).toISOString() : null,
      updated_at: verse.updated_at ? new Date(verse.updated_at * 1000).toISOString() : null,
      tags: verse.tags ? parseJsonSafe(verse.tags, []) : [],
    })) || [];

    return jsonResponse({ verses, count: verses.length });
  } catch (error: any) {
    return errorResponse(`Search failed: ${error.message}`, 500);
  }
}

/**
 * Get verses by book and chapter
 */
async function getVersesByChapter(
  env: Env,
  book: string,
  chapter: number,
  translation: 'afghan2023' | 'yousafzai2019' = 'afghan2023'
): Promise<Response> {
  const table = translation === 'yousafzai2019' ? 'verses_yousafzai' : 'verses_afghan2023';

  try {
    const result = await env.DB.prepare(
      `SELECT * FROM ${table} WHERE book = ? AND chapter = ? ORDER BY verse`
    )
      .bind(book, chapter)
      .all();

    const verses = result.results?.map((verse: any) => ({
      ...verse,
      created_at: verse.created_at ? new Date(verse.created_at * 1000).toISOString() : null,
      updated_at: verse.updated_at ? new Date(verse.updated_at * 1000).toISOString() : null,
      tags: verse.tags ? parseJsonSafe(verse.tags, []) : [],
    })) || [];

    return jsonResponse({ verses, count: verses.length });
  } catch (error: any) {
    return errorResponse(`Failed to get verses: ${error.message}`, 500);
  }
}

/**
 * Get verse by reference
 */
async function getVerseByRef(
  env: Env,
  ref: string,
  translation: 'afghan2023' | 'yousafzai2019' = 'afghan2023'
): Promise<Response> {
  const table = translation === 'yousafzai2019' ? 'verses_yousafzai' : 'verses_afghan2023';

  try {
    const result = await env.DB.prepare(`SELECT * FROM ${table} WHERE ref = ?`)
      .bind(ref)
      .first();

    if (!result) {
      return errorResponse('Verse not found', 404);
    }

    const verse = {
      ...result,
      created_at: result.created_at ? new Date(result.created_at * 1000).toISOString() : null,
      updated_at: result.updated_at ? new Date(result.updated_at * 1000).toISOString() : null,
      tags: result.tags ? parseJsonSafe(result.tags, []) : [],
    };

    return jsonResponse({ verse });
  } catch (error: any) {
    return errorResponse(`Failed to get verse: ${error.message}`, 500);
  }
}

/**
 * Search word occurrences
 */
async function searchWordOccurrences(
  env: Env,
  word: string,
  translation: 'afghan2023' | 'yousafzai2019' = 'afghan2023',
  limit: number = 100
): Promise<Response> {
  try {
    const result = await env.DB.prepare(
      `SELECT * FROM word_occurrence_index WHERE word = ? AND translation_key = ? ORDER BY frequency DESC LIMIT ?`
    )
      .bind(word, translation, limit)
      .all();

    const occurrences = result.results?.map((occ: any) => ({
      ...occ,
      verse_refs: parseJsonSafe(occ.verse_refs, []),
      tf_idf_scores: parseJsonSafe(occ.tf_idf_scores, []),
      created_at: occ.created_at ? new Date(occ.created_at * 1000).toISOString() : null,
      updated_at: occ.updated_at ? new Date(occ.updated_at * 1000).toISOString() : null,
    })) || [];

    return jsonResponse({ occurrences, count: occurrences.length });
  } catch (error: any) {
    return errorResponse(`Search failed: ${error.message}`, 500);
  }
}

/**
 * Get audio URL from R2
 */
async function getAudioUrl(env: Env, r2Key: string): Promise<Response> {
  try {
    // Try to get public URL (if bucket is public) or generate signed URL
    const object = await env.AUDIO_BUCKET.get(r2Key);

    if (!object) {
      return errorResponse('Audio file not found', 404);
    }

    // For public buckets, construct public URL
    // For private buckets, generate signed URL (requires custom domain or signed URL generation)
    const publicUrl = `https://pub-${env.AUDIO_BUCKET.accountId}.r2.dev/${r2Key}`;

    // Alternatively, serve directly through worker (better for private buckets)
    return jsonResponse({
      url: publicUrl,
      contentType: object.httpMetadata?.contentType || 'audio/mpeg',
      size: object.size,
    });
  } catch (error: any) {
    return errorResponse(`Failed to get audio URL: ${error.message}`, 500);
  }
}

/**
 * Stream audio file from R2
 */
async function streamAudio(env: Env, r2Key: string, request: Request): Promise<Response> {
  try {
    const object = await env.AUDIO_BUCKET.get(r2Key);

    if (!object) {
      return errorResponse('Audio file not found', 404);
    }

    // Handle range requests for audio seeking
    const range = request.headers.get('Range');
    if (range && object.range) {
      const match = range.match(/bytes=(\d+)-(\d*)/);
      if (match) {
        const start = parseInt(match[1]);
        const end = match[2] ? parseInt(match[2]) : object.size - 1;
        const rangeObject = await env.AUDIO_BUCKET.get(r2Key, {
          range: { offset: start, length: end - start + 1 },
        });

        if (rangeObject) {
          return new Response(rangeObject.body, {
            status: 206,
            headers: {
              'Content-Type': object.httpMetadata?.contentType || 'audio/mpeg',
              'Content-Range': `bytes ${start}-${end}/${object.size}`,
              'Accept-Ranges': 'bytes',
              'Content-Length': (end - start + 1).toString(),
              'Access-Control-Allow-Origin': '*',
            },
          });
        }
      }
    }

    // Full file response
    return new Response(object.body, {
      headers: {
        'Content-Type': object.httpMetadata?.contentType || 'audio/mpeg',
        'Content-Length': object.size.toString(),
        'Accept-Ranges': 'bytes',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=31536000',
      },
    });
  } catch (error: any) {
    return errorResponse(`Failed to stream audio: ${error.message}`, 500);
  }
}

// ========================================
// Lexicon API Routes
// ========================================

/**
 * Get all inflections for a base word
 * GET /api/inflections?base_word={word}
 */
async function getInflections(env: Env, baseWord: string): Promise<Response> {
  try {
    const result = await env.DB.prepare(
      `SELECT * FROM inflections WHERE base_word = ? ORDER BY frequency DESC`
    )
      .bind(baseWord)
      .all();

    const inflections = result.results?.map((inf: any) => ({
      id: inf.id,
      base_word: inf.base_word,
      inflected_form: inf.inflected_form,
      grammatical_info: parseJsonSafe(inf.grammatical_info, {}),
      frequency: inf.frequency,
      examples: parseJsonSafe(inf.examples, []),
      created_at: inf.created_at ? new Date(inf.created_at * 1000).toISOString() : null,
      updated_at: inf.updated_at ? new Date(inf.updated_at * 1000).toISOString() : null,
    })) || [];

    return jsonResponse({ inflections, count: inflections.length });
  } catch (error: any) {
    return errorResponse(`Failed to get inflections: ${error.message}`, 500);
  }
}

/**
 * Find base word from inflected form (reverse lookup)
 * GET /api/inflections/reverse?form={form}
 */
async function getInflectionBase(env: Env, form: string): Promise<Response> {
  try {
    // First try form_to_root table
    const rootResult = await env.DB.prepare(
      `SELECT root_word FROM form_to_root WHERE word_form = ? ORDER BY frequency DESC LIMIT 1`
    )
      .bind(form)
      .first();

    if (rootResult) {
      return jsonResponse({ base_word: rootResult.root_word, form, source: 'form_to_root' });
    }

    // Fallback to inflections table
    const inflectionResult = await env.DB.prepare(
      `SELECT base_word FROM inflections WHERE inflected_form = ? ORDER BY frequency DESC LIMIT 1`
    )
      .bind(form)
      .first();

    if (inflectionResult) {
      return jsonResponse({ base_word: inflectionResult.base_word, form, source: 'inflections' });
    }

    return errorResponse('Base word not found', 404);
  } catch (error: any) {
    return errorResponse(`Failed to get base word: ${error.message}`, 500);
  }
}

/**
 * Get verb conjugation data
 * GET /api/verbs/{root}
 */
async function getVerbData(env: Env, root: string): Promise<Response> {
  try {
    // Try irregular_verbs first
    let result = await env.DB.prepare(
      `SELECT * FROM irregular_verbs WHERE verb_root = ? LIMIT 1`
    )
      .bind(root)
      .first();

    if (result) {
      return jsonResponse({
        verb: {
          ...result,
          stems: parseJsonSafe(result.stems, null),
          roots: parseJsonSafe(result.roots, null),
          romanization: parseJsonSafe(result.romanization, null),
          examples: parseJsonSafe(result.examples, []),
          created_at: result.created_at ? new Date(result.created_at * 1000).toISOString() : null,
          updated_at: result.updated_at ? new Date(result.updated_at * 1000).toISOString() : null,
        },
        type: 'irregular',
      });
    }

    // Try regular verbs_lexicon
    result = await env.DB.prepare(
      `SELECT * FROM verbs_lexicon WHERE verb_root = ? LIMIT 1`
    )
      .bind(root)
      .first();

    if (result) {
      return jsonResponse({
        verb: {
          ...result,
          stems: parseJsonSafe(result.stems, null),
          roots: parseJsonSafe(result.roots, null),
          romanization: parseJsonSafe(result.romanization, null),
          examples: parseJsonSafe(result.examples, []),
          created_at: result.created_at ? new Date(result.created_at * 1000).toISOString() : null,
          updated_at: result.updated_at ? new Date(result.updated_at * 1000).toISOString() : null,
        },
        type: 'regular',
      });
    }

    return errorResponse('Verb not found', 404);
  } catch (error: any) {
    return errorResponse(`Failed to get verb data: ${error.message}`, 500);
  }
}

/**
 * Get noun lexicon data
 * GET /api/nouns/{word}
 */
async function getNounData(env: Env, word: string): Promise<Response> {
  try {
    const result = await env.DB.prepare(
      `SELECT * FROM nouns_lexicon WHERE pashto_word = ? LIMIT 1`
    )
      .bind(word)
      .first();

    if (!result) {
      return errorResponse('Noun not found', 404);
    }

    return jsonResponse({
      noun: {
        ...result,
        plural_forms: parseJsonSafe(result.plural_forms, null),
        examples: parseJsonSafe(result.examples, []),
        created_at: result.created_at ? new Date(result.created_at * 1000).toISOString() : null,
        updated_at: result.updated_at ? new Date(result.updated_at * 1000).toISOString() : null,
      },
    });
  } catch (error: any) {
    return errorResponse(`Failed to get noun data: ${error.message}`, 500);
  }
}

/**
 * Get form occurrences (verse references) for a word form
 * GET /api/form-occurrences?form={form}&translation={translation}
 */
async function getFormOccurrences(
  env: Env,
  form: string,
  translation: 'afghan2023' | 'yousafzai2019' | null
): Promise<Response> {
  try {
    let query = env.DB.prepare(
      `SELECT pashto_form, verse_refs, frequency FROM form_occurrences WHERE pashto_form = ?`
    ).bind(form);

    if (translation) {
      query = env.DB.prepare(
        `SELECT pashto_form, verse_refs, frequency FROM form_occurrences 
         WHERE pashto_form = ? AND (translation_key = ? OR translation_key IS NULL)`
      ).bind(form, translation);
    }

    const result = await query.first();

    if (!result) {
      return errorResponse('Form not found', 404);
    }

    const verseRefs = typeof result.verse_refs === 'string' 
      ? JSON.parse(result.verse_refs) 
      : result.verse_refs || [];

    return jsonResponse({
      form: result.pashto_form,
      verse_refs: verseRefs,
      frequency: result.frequency || 0,
      translation: translation || null,
    });
  } catch (error: any) {
    return errorResponse(`Failed to get form occurrences: ${error.message}`, 500);
  }
}

/**
 * Get inflection reasons for a form or base word
 * GET /api/inflection-reasons?form={form}&base_word={base_word}&translation={translation}
 */
async function getInflectionReasons(
  env: Env,
  form: string | null,
  baseWord: string | null,
  translation: 'afghan2023' | 'yousafzai2019' | null
): Promise<Response> {
  try {
    let query: any;
    
    if (form) {
      query = env.DB.prepare(
        `SELECT * FROM inflection_reasons WHERE pashto_form = ?`
      ).bind(form);
      
      if (translation) {
        query = env.DB.prepare(
          `SELECT * FROM inflection_reasons 
           WHERE pashto_form = ? AND (translation_key = ? OR translation_key IS NULL)
           ORDER BY frequency DESC`
        ).bind(form, translation);
      }
    } else if (baseWord) {
      query = env.DB.prepare(
        `SELECT * FROM inflection_reasons WHERE base_word = ?`
      ).bind(baseWord);
      
      if (translation) {
        query = env.DB.prepare(
          `SELECT * FROM inflection_reasons 
           WHERE base_word = ? AND (translation_key = ? OR translation_key IS NULL)
           ORDER BY frequency DESC`
        ).bind(baseWord, translation);
      }
    } else {
      return errorResponse('Must provide form or base_word', 400);
    }

    const result = await query.all();
    const reasons = result.results?.map((r: any) => ({
      pashto_form: r.pashto_form,
      base_word: r.base_word,
      verse_ref: r.verse_ref,
      inflection_type: r.inflection_type,
      is_plural: r.is_plural === 1,
      is_in_sandwich: r.is_in_sandwich === 1,
      sandwich_type: r.sandwich_type,
      is_subject_transitive_past: r.is_subject_transitive_past === 1,
      context_sentence: r.context_sentence,
      word_position: r.word_position,
      translation_key: r.translation_key,
    })) || [];

    // Aggregate reasons by form
    const aggregated: Record<string, {
      form: string;
      base_word: string;
      reasons: {
        plural: number;
        sandwich: number;
        transitive_past: number;
        sandwich_types: string[];
      };
      total_occurrences: number;
    }> = {};

    for (const reason of reasons) {
      if (!aggregated[reason.pashto_form]) {
        aggregated[reason.pashto_form] = {
          form: reason.pashto_form,
          base_word: reason.base_word,
          reasons: {
            plural: 0,
            sandwich: 0,
            transitive_past: 0,
            sandwich_types: [],
          },
          total_occurrences: 0,
        };
      }
      
      const agg = aggregated[reason.pashto_form];
      agg.total_occurrences++;
      if (reason.is_plural) agg.reasons.plural++;
      if (reason.is_in_sandwich) {
        agg.reasons.sandwich++;
        if (reason.sandwich_type && !agg.reasons.sandwich_types.includes(reason.sandwich_type)) {
          agg.reasons.sandwich_types.push(reason.sandwich_type);
        }
      }
      if (reason.is_subject_transitive_past) agg.reasons.transitive_past++;
    }

    return jsonResponse({
      form: form || null,
      base_word: baseWord || null,
      reasons: Object.values(aggregated),
      total: reasons.length,
    });
  } catch (error: any) {
    return errorResponse(`Failed to get inflection reasons: ${error.message}`, 500);
  }
}

/**
 * Get related forms for a query
 * GET /api/related-forms?query={query}
 */
async function getRelatedForms(env: Env, query: string): Promise<Response> {
  try {
    // First, try to find base word from query
    const baseWordResult = await env.DB.prepare(
      `SELECT root_word FROM form_to_root WHERE word_form = ? ORDER BY frequency DESC LIMIT 1`
    )
      .bind(query)
      .first();

    const baseWord = baseWordResult ? baseWordResult.root_word : query;

    // Get all inflections for base word
    const inflectionsResult = await env.DB.prepare(
      `SELECT * FROM inflections WHERE base_word = ? ORDER BY frequency DESC`
    )
      .bind(baseWord)
      .all();

    const inflections = inflectionsResult.results?.map((inf: any) => ({
      form: inf.inflected_form,
      grammatical_info: parseJsonSafe(inf.grammatical_info, {}),
      frequency: inf.frequency,
    })) || [];

    return jsonResponse({
      query,
      base_word: baseWord,
      inflections,
      count: inflections.length,
    });
  } catch (error: any) {
    return errorResponse(`Failed to get related forms: ${error.message}`, 500);
  }
}

// ========================================
// Topics API Routes
// ========================================

/**
 * Get all word categories with verse counts
 * GET /api/topics/categories
 */
async function getTopicsCategories(env: Env): Promise<Response> {
  try {
    // Get all categories with verse counts
    const result = await env.DB.prepare(
      `SELECT 
        wc.category_key,
        wc.category_name,
        wc.description,
        wc.parent_category,
        COUNT(DISTINCT cvm.verse_ref) as verse_count,
        COUNT(DISTINCT cvm.pashto_word) as word_count
      FROM word_categories wc
      LEFT JOIN category_verse_mappings cvm ON wc.category_key = cvm.category_key
      GROUP BY wc.category_key, wc.category_name, wc.description, wc.parent_category
      HAVING verse_count > 0
      ORDER BY verse_count DESC, wc.category_name ASC`
    ).all();

    const categories = result.results?.map((cat: any) => ({
      category_key: cat.category_key,
      category_name: cat.category_name || cat.category_key.split('_').map((w: string) => 
        w.charAt(0).toUpperCase() + w.slice(1)
      ).join(' '),
      description: cat.description,
      parent_category: cat.parent_category,
      verse_count: cat.verse_count || 0,
      word_count: cat.word_count || 0,
    })) || [];

    return jsonResponse({ categories, count: categories.length });
  } catch (error: any) {
    return errorResponse(`Failed to get categories: ${error.message}`, 500);
  }
}

/**
 * Get verses for a specific category
 * GET /api/topics/verses?category={category_key}&limit={limit}
 */
async function getTopicsVerses(
  env: Env,
  categoryKey: string,
  limit: number = 200,
  request?: Request
): Promise<Response> {
  try {
    if (!categoryKey) {
      return errorResponse('Missing category parameter', 400);
    }

    // Get verses for the category, joining with verse tables to get text and audio,
    // and word_frequencies to get English translation and romanization
    const result = await env.DB.prepare(
      `SELECT DISTINCT
        cvm.verse_ref,
        cvm.book,
        cvm.chapter,
        cvm.verse,
        cvm.pashto_word,
        cvm.translation_key,
        cvm.testament,
        CASE 
          WHEN cvm.translation_key = 'afghan2023' THEN v_afghan.text
          WHEN cvm.translation_key = 'yousafzai2019' THEN v_yousafzai.text
          ELSE NULL
        END as text,
        CASE 
          WHEN cvm.translation_key = 'afghan2023' THEN v_afghan.audio_r2_key
          WHEN cvm.translation_key = 'yousafzai2019' THEN v_yousafzai.audio_r2_key
          ELSE NULL
        END as audio_r2_key,
        CASE 
          WHEN cvm.translation_key = 'afghan2023' THEN v_afghan.audio_public_url
          WHEN cvm.translation_key = 'yousafzai2019' THEN v_yousafzai.audio_public_url
          ELSE NULL
        END as audio_public_url,
        wf.english_translation,
        wf.romanization
      FROM category_verse_mappings cvm
      LEFT JOIN verses_afghan2023 v_afghan ON 
        cvm.translation_key = 'afghan2023' AND 
        cvm.book = v_afghan.book AND 
        cvm.chapter = v_afghan.chapter AND 
        cvm.verse = v_afghan.verse
      LEFT JOIN verses_yousafzai v_yousafzai ON 
        cvm.translation_key = 'yousafzai2019' AND 
        cvm.book = v_yousafzai.book AND 
        cvm.chapter = v_yousafzai.chapter AND 
        cvm.verse = v_yousafzai.verse
      LEFT JOIN word_frequencies wf ON 
        cvm.pashto_word = wf.pashto_word AND
        (wf.translation_key = cvm.translation_key OR wf.translation_key IS NULL)
      WHERE cvm.category_key = ?
      ORDER BY cvm.book, cvm.chapter, cvm.verse
      LIMIT ?`
    )
      .bind(categoryKey, limit)
      .all();

    // Build base URL for audio streaming
    const baseUrl = request 
      ? new URL(request.url).origin 
      : 'https://pashtobiblesearch.jeremy-samuels17.workers.dev';

    const verses = result.results?.map((verse: any) => {
      // Build audio URL from R2 key if available
      let audioUrl = verse.audio_public_url || null;
      if (!audioUrl && verse.audio_r2_key) {
        // Use the worker's audio streaming endpoint
        audioUrl = `${baseUrl}/api/audio/stream/${encodeURIComponent(verse.audio_r2_key)}`;
      }

      return {
        verse_ref: verse.verse_ref,
        book: verse.book,
        chapter: verse.chapter,
        verse: verse.verse,
        pashto_word: verse.pashto_word,
        english_translation: verse.english_translation || null,
        romanization: verse.romanization || null,
        translation_key: verse.translation_key,
        testament: verse.testament,
        text: verse.text || null,
        audio_r2_key: verse.audio_r2_key || null,
        audio_url: audioUrl,
      };
    }) || [];

    return jsonResponse({
      category: categoryKey,
      verses,
      count: verses.length,
    });
  } catch (error: any) {
    return errorResponse(`Failed to get verses: ${error.message}`, 500);
  }
}

// ========================================
// Main Request Handler
// ========================================

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      });
    }

    // Route handlers
    if (path === '/api/search' && request.method === 'GET') {
      const query = url.searchParams.get('q') || '';
      const translation = (url.searchParams.get('translation') as any) || 'afghan2023';
      const testament = url.searchParams.get('testament') as 'OT' | 'NT' | undefined;
      const limit = parseInt(url.searchParams.get('limit') || '100');

      return searchVerses(env, query, { translation, testament, limit });
    }

    if (path === '/api/chapter' && request.method === 'GET') {
      const book = url.searchParams.get('book');
      const chapter = parseInt(url.searchParams.get('chapter') || '1');
      const translation = (url.searchParams.get('translation') as any) || 'afghan2023';

      if (!book) {
        return errorResponse('Missing book parameter', 400);
      }

      return getVersesByChapter(env, book, chapter, translation);
    }

    if (path === '/api/verse' && request.method === 'GET') {
      const ref = url.searchParams.get('ref');
      const translation = (url.searchParams.get('translation') as any) || 'afghan2023';

      if (!ref) {
        return errorResponse('Missing ref parameter', 400);
      }

      return getVerseByRef(env, ref, translation);
    }

    if (path === '/api/word-occurrences' && request.method === 'GET') {
      const word = url.searchParams.get('word');
      const translation = (url.searchParams.get('translation') as any) || 'afghan2023';
      const limit = parseInt(url.searchParams.get('limit') || '100');

      if (!word) {
        return errorResponse('Missing word parameter', 400);
      }

      return searchWordOccurrences(env, word, translation, limit);
    }

    if (path.startsWith('/api/audio/url/') && request.method === 'GET') {
      const r2Key = path.replace('/api/audio/url/', '');
      return getAudioUrl(env, decodeURIComponent(r2Key));
    }

    if (path.startsWith('/api/audio/stream/') && request.method === 'GET') {
      const r2Key = path.replace('/api/audio/stream/', '');
      return streamAudio(env, decodeURIComponent(r2Key), request);
    }

    // Lexicon API routes
    if (path === '/api/inflections' && request.method === 'GET') {
      const baseWord = url.searchParams.get('base_word');
      if (!baseWord) {
        return errorResponse('Missing base_word parameter', 400);
      }
      return getInflections(env, baseWord);
    }

    if (path === '/api/inflections/reverse' && request.method === 'GET') {
      const form = url.searchParams.get('form');
      if (!form) {
        return errorResponse('Missing form parameter', 400);
      }
      return getInflectionBase(env, form);
    }

    if (path.startsWith('/api/verbs/') && request.method === 'GET') {
      const root = path.replace('/api/verbs/', '');
      if (!root) {
        return errorResponse('Missing verb root', 400);
      }
      return getVerbData(env, decodeURIComponent(root));
    }

    if (path.startsWith('/api/nouns/') && request.method === 'GET') {
      const word = path.replace('/api/nouns/', '');
      if (!word) {
        return errorResponse('Missing noun word', 400);
      }
      return getNounData(env, decodeURIComponent(word));
    }

    if (path === '/api/form-occurrences' && request.method === 'GET') {
      const form = url.searchParams.get('form');
      const translation = url.searchParams.get('translation') as 'afghan2023' | 'yousafzai2019' | null;
      
      if (!form) {
        return errorResponse('Missing form parameter', 400);
      }
      return getFormOccurrences(env, form, translation);
    }

    if (path === '/api/inflection-reasons' && request.method === 'GET') {
      const form = url.searchParams.get('form');
      const baseWord = url.searchParams.get('base_word');
      const translation = url.searchParams.get('translation') as 'afghan2023' | 'yousafzai2019' | null;
      
      if (!form && !baseWord) {
        return errorResponse('Missing form or base_word parameter', 400);
      }
      return getInflectionReasons(env, form || null, baseWord || null, translation);
    }

    if (path === '/api/related-forms' && request.method === 'GET') {
      const query = url.searchParams.get('query');
      if (!query) {
        return errorResponse('Missing query parameter', 400);
      }
      return getRelatedForms(env, query);
    }

    // Topics API routes
    if (path === '/api/topics/categories' && request.method === 'GET') {
      return getTopicsCategories(env);
    }

    if (path === '/api/topics/verses' && request.method === 'GET') {
      const category = url.searchParams.get('category');
      const limit = Math.min(200, Math.max(10, parseInt(url.searchParams.get('limit') || '200')));
      
      if (!category) {
        return errorResponse('Missing category parameter', 400);
      }
      return getTopicsVerses(env, category, limit, request);
    }

    return errorResponse('Not found', 404);
  },
};



