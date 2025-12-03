/**
 * Cloudflare Worker API Routes for Pashto Bible Search
 * Provides API endpoints for database queries and audio access via D1 + R2
 */

export interface Env {
  DB: D1Database;
  AUDIO_BUCKET: R2Bucket;
  ELEVENLABS_API_KEY: string;
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
  AUTH_SECRET: string;
}

import { updateAudioUrls } from './update-audio-urls';
import { handleGoogleCallback, handleGetSession, handleSignOut } from './auth-handlers';

// ========================================
// Video Processing Types
// ========================================

interface TranscriptWord {
  text: string;
  start_time: number;
  end_time: number;
  confidence?: number;
}

interface TranscriptSegment {
  segment_number: number;
  text: string;
  start_time: number;
  end_time: number;
  duration: number;
  words: TranscriptWord[];
  confidence: number;
  speaker_id?: string;
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

/**
 * Extract Pashto words from text
 */
function extractPashtoWords(text: string): string[] {
  const words = text.match(/[\u0600-\u06FF]+/g) || [];
  return words.map(w => w.trim()).filter(w => w.length > 0);
}

/**
 * Clean word by removing punctuation
 */
function cleanWord(word: string): string {
  return word
    .replace(/[.,!?؟،[\](){}«»]/g, '')
    .trim();
}

/**
 * Infer verb root from form (simplified version for Worker)
 */
function inferVerbRootFromForm(form: string): {
  root: string | null;
  isTransitive: boolean;
  isPerfective: boolean;
  confidence: 'high' | 'medium' | 'low';
} {
  let prefix: string | null = null;
  let stem = form;

  // Remove verb prefixes (check longer prefixes first)
  if (form.startsWith('به')) {
    prefix = 'به';
    stem = form.slice(2);
  } else if (form.startsWith('تر')) {
    prefix = 'تر';
    stem = form.slice(2);
  } else if (form.startsWith('و')) {
    prefix = 'و';
    stem = form.slice(1);
  }

  const isPerfective = prefix === 'و';
  let isTransitive = false;
  let confidence: 'high' | 'medium' | 'low' = 'low';
  let root: string | null = null;

  // Check for verb endings (person/mood markers)
  const verbEndings = ['م', 'ې', 'ي', 'و', 'ئ', 'ه', 'ل'];
  let foundEnding = false;

  for (const ending of verbEndings) {
    if (stem.endsWith(ending) && stem.length > ending.length + 1) {
      const potentialStem = stem.slice(0, -ending.length);
      // Only remove ending if remaining part looks valid
      if (potentialStem.length >= 2) {
        stem = potentialStem;
        foundEnding = true;
        confidence = prefix ? 'high' : 'medium';
        break;
      }
    }
  }

  // Check for verb root markers to infer the base root
  if (stem.endsWith('ول')) {
    // Transitive verb root: e.g., "فرمايول"
    root = stem; // Keep the full root with "ول"
    isTransitive = true;
    confidence = 'high';
  } else if (stem.endsWith('ېدل') || stem.endsWith('یدل')) {
    // Intransitive verb root: e.g., "نومېدل"
    root = stem; // Keep the full root with "ېدل"
    isTransitive = false;
    confidence = 'high';
  } else if (stem.endsWith('کول')) {
    // Causative transitive: e.g., "کول"
    root = stem;
    isTransitive = true;
    confidence = 'high';
  } else if (stem.endsWith('کېدل')) {
    // Causative intransitive: e.g., "کېدل"
    root = stem;
    isTransitive = false;
    confidence = 'high';
  } else if (foundEnding || prefix) {
    // We found a prefix or ending, so it's likely a verb form
    // Try to construct root by adding "ول" (common transitive marker)
    // This handles cases like "وفرمایي" → "فرمايول"
    if (stem.length >= 3) {
      // Common pattern: stem + "ول" for transitive verbs
      root = stem + 'ول';
      isTransitive = true;
      confidence = prefix ? 'high' : 'medium';
    } else {
      root = stem;
      confidence = prefix ? 'medium' : 'low';
    }
  }

  // If we couldn't find a clear root and no prefix, return null
  if (!root && !prefix && !foundEnding) {
    return {
      root: null,
      isTransitive: false,
      isPerfective: false,
      confidence: 'low',
    };
  }

  return {
    root: root || stem || form,
    isTransitive,
    isPerfective,
    confidence,
  };
}

/**
 * Extract words from video transcript and add to word_frequencies with categorization
 */
async function extractWordsFromVideoTranscript(env: Env, videoId: string, transcript: string): Promise<void> {
  // Extract words
  const words = extractPashtoWords(transcript);

  // Count words
  const wordCounts = new Map<string, number>();
  for (const word of words) {
    const cleaned = cleanWord(word);
    if (cleaned && cleaned.length > 0) {
      wordCounts.set(cleaned, (wordCounts.get(cleaned) || 0) + 1);
    }
  }

  if (wordCounts.size === 0) {
    console.log(`   No words extracted from transcript`);
    return;
  }

  // Ensure video_word_mappings table exists
  await env.DB.prepare(`
    CREATE TABLE IF NOT EXISTS video_word_mappings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      video_id TEXT NOT NULL,
      pashto_word TEXT NOT NULL,
      frequency INTEGER DEFAULT 1,
      audio_r2_key TEXT,
      created_at INTEGER DEFAULT (strftime('%s', 'now')),
      updated_at INTEGER DEFAULT (strftime('%s', 'now')),
      UNIQUE(video_id, pashto_word)
    )
  `).run();

  await env.DB.prepare(`
    CREATE INDEX IF NOT EXISTS idx_video_word_video ON video_word_mappings(video_id)
  `).run().catch(() => { });

  await env.DB.prepare(`
    CREATE INDEX IF NOT EXISTS idx_video_word_word ON video_word_mappings(pashto_word)
  `).run().catch(() => { });

  // Get dictionary metadata for words (POS, inflections, etc.)
  const allWords = Array.from(wordCounts.keys());
  const wordMetadata = new Map<string, any>();

  // Query dictionary for metadata in batches
  const batchSize = 100;
  for (let i = 0; i < allWords.length; i += batchSize) {
    const batch = allWords.slice(i, i + batchSize);
    const placeholders = batch.map(() => '?').join(',');

    try {
      // First, try direct lookup
      const dictResults = await env.DB.prepare(`
        SELECT pashto_word, pos, word_type, inflection_type, compound_type,
               base_form, romanization, english_translation
        FROM word_frequencies
        WHERE pashto_word IN (${placeholders})
      `).bind(...batch).all();

      for (const row of dictResults.results || []) {
        wordMetadata.set(row.pashto_word as string, row);
      }

      // For words not found, try inferring base form and looking that up
      // This handles cases like "وفرمایيل" → "فرمایل" (LingDocs dictionary entry)
      const notFound = batch.filter(w => !wordMetadata.has(w));
      if (notFound.length > 0) {
        const inferredRoots = new Map<string, string[]>(); // form -> [possible_roots]

        for (const form of notFound) {
          const analysis = inferVerbRootFromForm(form);
          const possibleRoots: string[] = [];

          if (analysis.root && analysis.confidence !== 'low' && analysis.root !== form) {
            possibleRoots.push(analysis.root);

            // Also try removing "ول" suffix to get potential base form
            // e.g., "فرمایيول" → "فرمایي" → try "فرمایل" (LingDocs form)
            if (analysis.root.endsWith('ول') && analysis.root.length > 2) {
              const withoutOl = analysis.root.slice(0, -2);
              // Try adding "ل" to match LingDocs forms like "فرمایل"
              if (withoutOl.length >= 3) {
                possibleRoots.push(withoutOl + 'ل');
              }
            }

            // Try the stem directly (might match LingDocs imperfective root)
            if (form.startsWith('و')) {
              const stem = form.slice(1);
              // Remove common endings to get closer to root
              const cleanStem = stem.replace(/[مېيوئه]$/, '');
              if (cleanStem.length >= 3 && cleanStem !== form) {
                possibleRoots.push(cleanStem);
                // Also try with 'ل' ending (common verb root ending)
                if (!cleanStem.endsWith('ل')) {
                  possibleRoots.push(cleanStem + 'ل');
                }
              }
            }
          }

          if (possibleRoots.length > 0) {
            inferredRoots.set(form, [...new Set(possibleRoots)]); // Remove duplicates
          }
        }

        // Look up all possible roots
        if (inferredRoots.size > 0) {
          const allRoots = new Set<string>();
          for (const roots of inferredRoots.values()) {
            roots.forEach(r => allRoots.add(r));
          }

          const rootsToLookup = Array.from(allRoots);
          const rootPlaceholders = rootsToLookup.map(() => '?').join(',');

          const rootResults = await env.DB.prepare(`
            SELECT pashto_word, pos, word_type, inflection_type, compound_type,
                   base_form, romanization, english_translation
            FROM word_frequencies
            WHERE pashto_word IN (${rootPlaceholders})
          `).bind(...rootsToLookup).all();

          // Map roots back to forms (prefer exact matches, then try variations)
          const rootMap = new Map<string, any>();
          for (const row of rootResults.results || []) {
            rootMap.set(row.pashto_word as string, row);
          }

          // Associate root metadata with original forms
          for (const [form, roots] of inferredRoots.entries()) {
            // Try roots in order (most specific first)
            for (const root of roots) {
              const rootData = rootMap.get(root);
              if (rootData) {
                // Use root's metadata but keep the form's base_form as the root
                wordMetadata.set(form, {
                  ...rootData,
                  base_form: root, // The inferred root is the base form
                });
                break; // Use first match found
              }
            }
          }
        }
      }
    } catch (error) {
      console.warn(`   Failed to fetch metadata for batch: ${error}`);
    }
  }

  // Process words in batches
  let processed = 0;

  for (let i = 0; i < allWords.length; i += batchSize) {
    const batch = allWords.slice(i, i + batchSize);

    for (const word of batch) {
      const count = wordCounts.get(word) || 0;
      const metadata = wordMetadata.get(word);

      try {
        // Get or create audio R2 key for this word in this video
        // Use the segment where the word appears most frequently
        const audioKey = `videos/${videoId}/full.mp3`; // Full video audio for now

        // Update or insert word_frequencies with metadata preservation
        if (metadata) {
          // Word exists in dictionary - update frequency, preserve all metadata (pos, inflection_type, etc.)
          await env.DB.prepare(`
            UPDATE word_frequencies
            SET 
              frequency_total = frequency_total + ?,
              updated_at = strftime('%s', 'now')
            WHERE pashto_word = ?
          `).bind(count, word).run();
        } else {
          // New word from video - try to infer verb metadata if it looks like a verb
          let inferredPos: string | null = null;
          let inferredWordType: string | null = null;
          let inferredInflectionType: string | null = null;
          let inferredBaseForm: string | null = null;

          // Simple verb detection: check for verb markers
          if (word.match(/^(و|به|تر)/) || word.match(/(ول|ېدل|یدل|کول|کېدل)$/) ||
            word.match(/(م|ې|ي|و|ئ)$/)) {
            // Looks like a verb - try to infer root
            const verbAnalysis = inferVerbRootFromForm(word);
            if (verbAnalysis.root && verbAnalysis.confidence !== 'low') {
              inferredPos = verbAnalysis.isTransitive ? 'v. trans.' : 'v. intrans.';
              inferredWordType = 'verb';
              inferredInflectionType = verbAnalysis.isPerfective ? 'perfective_past' :
                word.startsWith('به') ? 'future_subjunctive' : 'imperfective_present';
              inferredBaseForm = verbAnalysis.root;
            }
          }

          // Insert with inferred metadata if available
          await env.DB.prepare(`
            INSERT INTO word_frequencies (
              pashto_word, frequency_total, frequency_afghan2023_ot, frequency_afghan2023_nt,
              frequency_yousafzai2019_ot, frequency_yousafzai2019_nt, frequency_rank,
              pos, word_type, inflection_type, base_form,
              created_at, updated_at
            )
            VALUES (?, ?, 0, 0, 0, 0, 0, ?, ?, ?, ?, strftime('%s', 'now'), strftime('%s', 'now'))
            ON CONFLICT(pashto_word) DO UPDATE SET
              frequency_total = frequency_total + ?,
              pos = COALESCE(pos, ?),
              word_type = COALESCE(word_type, ?),
              inflection_type = COALESCE(inflection_type, ?),
              base_form = COALESCE(base_form, ?),
              updated_at = strftime('%s', 'now')
          `).bind(
            word, count,
            inferredPos, inferredWordType, inferredInflectionType, inferredBaseForm,
            count, inferredPos, inferredWordType, inferredInflectionType, inferredBaseForm
          ).run();
        }

        // Insert video_word_mappings with audio reference
        await env.DB.prepare(`
          INSERT OR REPLACE INTO video_word_mappings 
          (video_id, pashto_word, frequency, audio_r2_key, updated_at)
          VALUES (?, ?, ?, ?, strftime('%s', 'now'))
        `).bind(videoId, word, count, audioKey).run();

        processed++;
      } catch (error: any) {
        console.warn(`   Failed to process word "${word}": ${error.message}`);
      }
    }
  }

  // Update frequency_video for all words affected by this video
  if (processed > 0) {
    const affectedWords = Array.from(wordCounts.keys());
    const placeholders = affectedWords.map(() => '?').join(',');

    // Update frequency_video from video_word_mappings
    await env.DB.prepare(`
      UPDATE word_frequencies
      SET frequency_video = (
        SELECT COALESCE(SUM(frequency), 0)
        FROM video_word_mappings
        WHERE video_word_mappings.pashto_word = word_frequencies.pashto_word
      )
      WHERE pashto_word IN (${placeholders})
    `).bind(...affectedWords).run().catch((err) => {
      console.warn(`   Failed to update frequency_video: ${err.message}`);
    });

    // Recalculate frequency_total (Bible + video)
    await env.DB.prepare(`
      UPDATE word_frequencies
      SET frequency_total = COALESCE(frequency_afghan2023_ot, 0) + 
                            COALESCE(frequency_afghan2023_nt, 0) + 
                            COALESCE(frequency_yousafzai2019_ot, 0) + 
                            COALESCE(frequency_yousafzai2019_nt, 0) + 
                            COALESCE(frequency_video, 0)
      WHERE pashto_word IN (${placeholders})
    `).bind(...affectedWords).run().catch((err) => {
      console.warn(`   Failed to update frequency_total: ${err.message}`);
    });
  }

  // Recalculate ranks (do this once at the end)
  if (processed > 0) {
    await env.DB.prepare(`
      UPDATE word_frequencies
      SET frequency_rank = (
        SELECT COUNT(*) + 1
        FROM word_frequencies wf2
        WHERE wf2.frequency_total > word_frequencies.frequency_total
      )
    `).run().catch(() => { });
  }

  console.log(`   Processed ${processed} unique words from video ${videoId}`);
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
 * BATCH SEARCH: Search verses for MULTIPLE forms in ONE query
 * POST /api/search-batch
 * Body: { forms: string[], translation?: string, testament?: string, limit?: number }
 * 
 * Uses a single SQL query with OR conditions - MUCH faster than multiple calls!
 */
async function searchVersesBatch(
  env: Env,
  forms: string[],
  options: {
    translation?: 'afghan2023' | 'yousafzai2019';
    testament?: 'OT' | 'NT';
    limit?: number;
  } = {}
): Promise<Response> {
  const { translation = 'afghan2023', testament, limit = 600 } = options;
  const table = translation === 'yousafzai2019' ? 'verses_yousafzai' : 'verses_afghan2023';

  if (!forms || forms.length === 0) {
    return jsonResponse({ verses: [], count: 0, forms: [] });
  }

  // Limit forms to prevent SQL query size explosion
  const formsToSearch = forms.slice(0, 100);
  const startTime = Date.now();

  try {
    // Build OR conditions for all forms
    const conditions = formsToSearch.map(() => `text LIKE ?`).join(' OR ');
    const params: any[] = formsToSearch.map(f => `%${f}%`);

    let sql = `SELECT * FROM ${table} WHERE (${conditions})`;

    if (testament) {
      sql += ` AND testament = ?`;
      params.push(testament);
    }

    sql += ` ORDER BY book, chapter, verse LIMIT ?`;
    params.push(limit);

    const result = await env.DB.prepare(sql).bind(...params).all();

    // Convert SQLite timestamps and determine which forms matched each verse
    const verses = result.results?.map((verse: any) => {
      const matchedForms = formsToSearch.filter(form =>
        verse.text && verse.text.includes(form)
      );

      // Generate audio_r2_key if not present in DB (same logic as getVersesByChapter)
      let audioR2Key: string | null = verse.audio_r2_key || null;
      if (!audioR2Key && verse.book && verse.chapter && verse.verse) {
        audioR2Key = generateR2AudioKey(verse.book, verse.chapter, verse.verse, translation);
      }

      return {
        ...verse,
        audio_r2_key: audioR2Key,
        matchedForms,
        created_at: verse.created_at ? new Date(verse.created_at * 1000).toISOString() : null,
        updated_at: verse.updated_at ? new Date(verse.updated_at * 1000).toISOString() : null,
        tags: verse.tags ? parseJsonSafe(verse.tags, []) : [],
      };
    }) || [];

    const queryTime = Date.now() - startTime;

    return jsonResponse({
      verses,
      count: verses.length,
      formsSearched: formsToSearch.length,
      queryTime,
    });
  } catch (error: any) {
    return errorResponse(`Batch search failed: ${error.message}`, 500);
  }
}

// NT books for testament detection
const NT_BOOKS = new Set([
  'matthew', 'mark', 'luke', 'john', 'acts', 'romans',
  '1corinthians', '2corinthians', 'galatians', 'ephesians',
  'philippians', 'colossians', '1thessalonians', '2thessalonians',
  '1timothy', '2timothy', 'titus', 'philemon', 'hebrews',
  'james', '1peter', '2peter', '1john', '2john', '3john', 'jude', 'revelation'
]);

/**
 * Generate R2 audio key from book, chapter, verse
 * Format: afghan2023/{ot|nt}/{bookname}{chapter}_verse_{verse:03d}.mp3
 * Example: afghan2023/nt/matthew27_verse_002.mp3
 */
function generateR2AudioKey(book: string, chapter: number, verse: number, translation: 'afghan2023' | 'yousafzai2019' = 'afghan2023'): string {
  // Normalize book name: lowercase, remove spaces
  // Handle numbered books: "1 John" -> "1john", "Philippians" -> "philippians"
  let bookSlug = book.toLowerCase().replace(/\s+/g, '');

  // Determine testament based on book name
  const testament = NT_BOOKS.has(bookSlug) ? 'nt' : 'ot';

  return `${translation}/${testament}/${bookSlug}${chapter}_verse_${String(verse).padStart(3, '0')}.mp3`;
}

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

    const workerUrl = 'https://pashtobiblesearch.jeremy-samuels17.workers.dev';

    const verses = result.results?.map((verse: any) => {
      let audioPublicUrl: string | null = null;
      let audioR2Key: string | null = verse.audio_r2_key || null;

      // If no audio_r2_key in DB, try to generate it and check if it exists in R2
      if (!audioR2Key) {
        const generatedKey = generateR2AudioKey(verse.book, verse.chapter, verse.verse, translation);
        // Don't set it here - we'll verify it exists before using it
        audioR2Key = generatedKey;
      }

      // Build audio URL from R2 key if we have one
      if (audioR2Key) {
        // Verify the file exists in R2 before creating URL
        // (We'll check in parallel, but for now just create the URL)
        audioPublicUrl = `${workerUrl}/api/audio/stream/${encodeURIComponent(audioR2Key)}`;
      }

      return {
        ref: `${verse.book} ${verse.chapter}:${verse.verse}`,
        book: verse.book,
        chapter: verse.chapter,
        verse: verse.verse,
        text: verse.text,
        testament: verse.testament,
        dialect: translation === 'yousafzai2019' ? 'yousafzai' : 'afghan',
        audio_public_url: audioPublicUrl,
        audio_r2_key: audioR2Key,
        created_at: verse.created_at ? new Date(verse.created_at * 1000).toISOString() : null,
        updated_at: verse.updated_at ? new Date(verse.updated_at * 1000).toISOString() : null,
        tags: verse.tags ? parseJsonSafe(verse.tags, []) : [],
      };
    }) || [];

    return jsonResponse({ book, chapter, translation, verses, count: verses.length });
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
  // Try to get the object using the Worker binding first
  try {
    const object = await env.AUDIO_BUCKET.get(r2Key);

    if (object) {
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
    }
  } catch (error: any) {
    console.warn(`Worker binding failed for ${r2Key}:`, error);
  }

  // Fallback: Use R2 API directly with credentials
  // Note: This requires proper AWS S3 signing which is complex
  // For now, return an error indicating the issue
  return errorResponse('Audio streaming requires bucket access policy configuration. Worker can list files but not retrieve them due to R2 access restrictions.', 503);
}

/**
 * Upload file to R2
 * POST /api/r2/upload
 */
async function uploadToR2(env: Env, request: Request): Promise<Response> {
  try {
    const body = await request.json();
    const { key, data } = body;

    if (!key || !data) {
      return errorResponse('Missing key or data', 400);
    }

    // Decode base64 data
    const buffer = Uint8Array.from(atob(data), c => c.charCodeAt(0));

    console.log(`Uploading to R2: key=${key}, size=${buffer.length} bytes`);

    // Upload to R2
    await env.AUDIO_BUCKET.put(key, buffer, {
      httpMetadata: {
        contentType: 'audio/mpeg',
      },
    });

    // Verify the upload by trying to get it back
    const verify = await env.AUDIO_BUCKET.get(key);
    if (verify === null) {
      console.error(`❌ Upload verification failed: file not found after upload`);
      return errorResponse('Upload verification failed', 500);
    }

    console.log(`✅ Successfully uploaded and verified: ${key} (${verify.size} bytes)`);

    return jsonResponse({ success: true, key, size: buffer.length });
  } catch (error: any) {
    console.error(`Upload error: ${error.message}`, error);
    return errorResponse(`Failed to upload to R2: ${error.message}`, 500);
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
 * Get verb conjugated forms from verb_forms table
 * GET /api/verb-forms?lemma={lemma}&cap={cap}
 * 
 * D1 Schema: verb_forms(id, base_verb, form, form_type, tense, person, created_at)
 * - form_type: present, past, subjunctive, imperative, ability, perfect, past_participle, root
 * - tense: present, past, simple_past, continuous, continuous_past, imperfective, perfective, etc.
 * - person: 1sg, 1pl, 2sg, 2pl, 3sg, 3pl, 3sg_m, 3sg_f
 */
async function getVerbForms(env: Env, lemma: string, cap: number = 200): Promise<Response> {
  try {
    // D1 uses "base_verb" not "lemma"
    const result = await env.DB.prepare(
      `SELECT form, form_type, tense, person
       FROM verb_forms
       WHERE base_verb = ?
       ORDER BY 
         CASE form_type 
           WHEN 'present' THEN 1
           WHEN 'past' THEN 2
           WHEN 'perfect' THEN 3
           WHEN 'subjunctive' THEN 4
           WHEN 'imperative' THEN 5
           WHEN 'ability' THEN 6
           WHEN 'past_participle' THEN 7
           WHEN 'root' THEN 8
           ELSE 9
         END,
         person
       LIMIT ?`
    )
      .bind(lemma, cap)
      .all();

    if (!result.results || result.results.length === 0) {
      return jsonResponse({
        lemma,
        forms: [],
        count: 0,
        source: 'd1_verified',
      });
    }

    // Map D1 form_type/tense to unified grammatical categories
    const forms = result.results.map((row: any) => ({
      form: row.form,
      // Unify tense: use form_type as primary, tense as secondary
      tense: mapToUnifiedTense(row.form_type, row.tense),
      person: row.person,
      // Infer aspect from form_type/tense
      aspect: inferAspectFromFormType(row.form_type, row.tense),
      // Infer mood from form_type
      mood: inferMoodFromFormType(row.form_type),
      // Keep original values for debugging
      _form_type: row.form_type,
      _tense: row.tense,
    }));

    return jsonResponse({
      lemma,
      forms,
      count: forms.length,
      source: 'd1_verified',
    });
  } catch (error: any) {
    return errorResponse(`Failed to get verb forms: ${error.message}`, 500);
  }
}

/**
 * Map D1 form_type/tense to unified tense values for UI
 */
function mapToUnifiedTense(formType: string, tense: string): string {
  // form_type is more reliable for UI categories
  switch (formType) {
    case 'present':
      return 'present';
    case 'past':
    case 'simple_past':
      return 'past';
    case 'perfect':
    case 'past_participle':
      return 'perfect';
    case 'subjunctive':
      return 'subjunctive';
    case 'imperative':
      return 'imperative';
    case 'ability':
      return 'ability';
    case 'root':
      return 'root';
    default:
      // Fall back to tense field
      if (tense?.includes('present')) return 'present';
      if (tense?.includes('past') && !tense?.includes('participle')) return 'past';
      if (tense?.includes('perfect') || tense?.includes('participle')) return 'perfect';
      if (tense?.includes('continuous')) return 'present'; // continuous is present-based
      if (tense?.includes('imperfective')) return 'present';
      if (tense?.includes('perfective')) return 'past';
      return formType || tense || 'unknown';
  }
}

/**
 * Infer aspect from form_type/tense
 */
function inferAspectFromFormType(formType: string, tense: string): string {
  // Present tenses are generally imperfective
  if (formType === 'present' || tense?.includes('present') || tense?.includes('imperfective')) {
    return 'imperfective';
  }
  // Past, perfect, and subjunctive are generally perfective
  if (formType === 'past' || formType === 'perfect' || formType === 'subjunctive' ||
    tense?.includes('past') || tense?.includes('perfective') || tense?.includes('perfect')) {
    return 'perfective';
  }
  // Ability and imperative can be either
  return 'imperfective';
}

/**
 * Infer mood from form_type
 */
function inferMoodFromFormType(formType: string): string {
  switch (formType) {
    case 'imperative':
      return 'imperative';
    case 'subjunctive':
      return 'subjunctive';
    case 'ability':
      return 'ability';
    default:
      return 'indicative';
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
           ORDER BY verse_ref`
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
           ORDER BY pashto_form, verse_ref`
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

// Common Pashto sandwich patterns for inflection detection
const SANDWICH_PATTERNS = [
  { start: 'په', end: 'کې', type: 'locative_in' },
  { start: 'په', end: 'باندې', type: 'locative_on' },
  { start: 'په', end: 'سره', type: 'comitative' },
  { start: 'د', end: null, type: 'genitive' },
  { start: 'له', end: 'سره', type: 'comitative_from' },
  { start: 'له', end: 'نه', type: 'ablative' },
  { start: 'له', end: 'څخه', type: 'ablative_from' },
  { start: null, end: 'ته', type: 'dative' },
  { start: 'تر', end: 'پورې', type: 'terminative' },
];

// Plural/oblique noun endings
const NOUN_INFLECTION_ENDINGS = [
  { ending: 'انو', type: 'oblique_plural_animate', isPlural: true },
  { ending: 'یانو', type: 'oblique_plural_animate', isPlural: true },
  { ending: 'ونو', type: 'oblique_plural_inanimate', isPlural: true },
  { ending: 'ان', type: 'direct_plural_animate', isPlural: true },
  { ending: 'یان', type: 'direct_plural_animate', isPlural: true },
  { ending: 'ونه', type: 'direct_plural_inanimate', isPlural: true },
  { ending: 'ې', type: 'oblique_or_plural_feminine', isPlural: false },
  { ending: 'و', type: 'oblique', isPlural: false },
];

// Past tense verb patterns (for ergative detection)
const PAST_TENSE_MARKERS = ['ل', 'لو', 'له', 'لې', 'لم', 'لئ'];

interface InflectedWord {
  word: string;
  position: number;
  isInflected: boolean;
  isPlural: boolean;
  inflectionType: string | null;
  isInSandwich: boolean;
  sandwichType: string | null;
  isSubjectTransitivePast: boolean;
  baseWord: string | null;
  explanation: string;
}

/**
 * Analyze a verse text for inflected words
 * POST /api/analyze-inflections
 * Body: { text: string, verse_ref?: string, translation?: string }
 */
async function analyzeInflections(
  env: Env,
  text: string,
  verseRef: string | null,
  translation: 'afghan2023' | 'yousafzai2019' | null
): Promise<Response> {
  try {
    const words = text.split(/\s+/).map(w => w.replace(/[،.؟!؛:«»\-]/g, ''));
    const results: InflectedWord[] = [];

    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      if (word.length < 2) continue;

      // Check for inflection endings
      let isInflected = false;
      let isPlural = false;
      let inflectionType: string | null = null;

      for (const ending of NOUN_INFLECTION_ENDINGS) {
        if (word.endsWith(ending.ending) && word.length > ending.ending.length + 1) {
          isInflected = true;
          isPlural = ending.isPlural;
          inflectionType = ending.type;
          break;
        }
      }

      if (!isInflected) continue;

      // Check if word is in a sandwich construction
      let isInSandwich = false;
      let sandwichType: string | null = null;

      for (const pattern of SANDWICH_PATTERNS) {
        if (pattern.start && pattern.end) {
          // Look for start before and end after current word
          for (let j = 0; j < i; j++) {
            if (words[j] === pattern.start) {
              for (let k = i + 1; k < words.length && k < i + 6; k++) {
                if (words[k] === pattern.end) {
                  isInSandwich = true;
                  sandwichType = pattern.type;
                  break;
                }
              }
            }
            if (isInSandwich) break;
          }
        } else if (pattern.start && !pattern.end) {
          // Word follows pattern start (e.g., "د X")
          if (i > 0 && words[i - 1] === pattern.start) {
            isInSandwich = true;
            sandwichType = pattern.type;
          }
        } else if (!pattern.start && pattern.end) {
          // Word precedes pattern end (e.g., "X ته")
          if (i < words.length - 1 && words[i + 1] === pattern.end) {
            isInSandwich = true;
            sandwichType = pattern.type;
          }
        }
        if (isInSandwich) break;
      }

      // Check if word is subject of transitive past tense verb
      let isSubjectTransitivePast = false;
      for (let j = i + 1; j < words.length; j++) {
        const potentialVerb = words[j];
        for (const marker of PAST_TENSE_MARKERS) {
          if (potentialVerb.endsWith(marker) && potentialVerb.length > marker.length + 2) {
            isSubjectTransitivePast = true;
            break;
          }
        }
        if (isSubjectTransitivePast) break;
      }

      // Try to find base word from D1
      let baseWord: string | null = null;
      try {
        const baseResult = await env.DB.prepare(
          `SELECT root_word FROM form_to_root WHERE word_form = ? LIMIT 1`
        ).bind(word).first();
        if (baseResult) {
          baseWord = baseResult.root_word as string;
        }
      } catch (e) {
        // Ignore lookup errors
      }

      // Build explanation based on LingDocs 3 reasons
      const reasons: string[] = [];
      if (isPlural) {
        reasons.push('plural (جمع)');
      }
      if (isInSandwich) {
        const sandwichNames: Record<string, string> = {
          'locative_in': 'په...کې (in)',
          'locative_on': 'په...باندې (on)',
          'comitative': 'په...سره (with)',
          'genitive': 'د (of)',
          'comitative_from': 'له...سره (with)',
          'ablative': 'له...نه (from)',
          'ablative_from': 'له...څخه (from)',
          'dative': 'ته (to)',
          'terminative': 'تر...پورې (until)',
        };
        reasons.push(`in sandwich: ${sandwichNames[sandwichType || ''] || sandwichType}`);
      }
      if (isSubjectTransitivePast && !isPlural && !isInSandwich) {
        reasons.push('subject of transitive past verb (ergative)');
      }

      const explanation = reasons.length > 0
        ? `Inflected because: ${reasons.join('; ')}`
        : 'Inflected form (reason unclear)';

      results.push({
        word,
        position: i,
        isInflected,
        isPlural,
        inflectionType,
        isInSandwich,
        sandwichType,
        isSubjectTransitivePast,
        baseWord,
        explanation,
      });
    }

    return jsonResponse({
      verse_ref: verseRef,
      translation,
      text,
      inflected_words: results,
      count: results.length,
    });
  } catch (error: any) {
    return errorResponse(`Failed to analyze inflections: ${error.message}`, 500);
  }
}

/**
 * Bulk analyze verses and store inflection reasons in D1
 * POST /api/populate-inflection-reasons
 * Body: { book?: string, chapter?: number, limit?: number, translation?: string }
 * 
 * Uses D1 batch API to avoid 500 subrequest limit
 */
async function populateInflectionReasons(
  env: Env,
  book: string | null,
  chapter: number | null,
  limit: number,
  translation: 'afghan2023' | 'yousafzai2019'
): Promise<Response> {
  try {
    const table = translation === 'yousafzai2019' ? 'verses_yousafzai' : 'verses_afghan2023';

    // Build query based on filters
    let sql = `SELECT book, chapter, verse, text FROM ${table}`;
    const params: any[] = [];

    if (book) {
      sql += ` WHERE book = ?`;
      params.push(book);
      if (chapter) {
        sql += ` AND chapter = ?`;
        params.push(chapter);
      }
    }

    sql += ` ORDER BY book, chapter, verse LIMIT ?`;
    params.push(limit);

    const versesResult = await env.DB.prepare(sql).bind(...params).all();
    const verses = versesResult.results || [];

    // Pre-fetch all base words in one query to reduce subrequests
    const allWords = new Set<string>();
    for (const verse of verses) {
      const text = verse.text as string;
      const words = text.split(/\s+/).map(w => w.replace(/[،.؟!؛:«»\-]/g, ''));
      words.forEach(w => { if (w.length >= 2) allWords.add(w); });
    }

    // Batch lookup base words (max 100 per query to stay safe)
    const wordToBase = new Map<string, string>();
    const wordArray = Array.from(allWords);
    const BATCH_SIZE = 100;

    for (let i = 0; i < wordArray.length; i += BATCH_SIZE) {
      const batch = wordArray.slice(i, i + BATCH_SIZE);
      const placeholders = batch.map(() => '?').join(',');
      try {
        const baseResults = await env.DB.prepare(
          `SELECT word_form, root_word FROM form_to_root WHERE word_form IN (${placeholders})`
        ).bind(...batch).all();

        for (const row of (baseResults.results || [])) {
          wordToBase.set(row.word_form as string, row.root_word as string);
        }
      } catch (e) {
        // Ignore lookup errors
      }
    }

    // Collect all inflections to insert
    interface InflectionRecord {
      word: string;
      baseWord: string;
      verseRef: string;
      inflectionType: string | null;
      isPlural: boolean;
      isInSandwich: boolean;
      sandwichType: string | null;
      isSubjectTransitivePast: boolean;
      position: number;
    }

    const inflectionsToInsert: InflectionRecord[] = [];

    for (const verse of verses) {
      const verseRef = `${verse.book} ${verse.chapter}:${verse.verse}`;
      const text = verse.text as string;
      const words = text.split(/\s+/).map(w => w.replace(/[،.؟!؛:«»\-]/g, ''));

      for (let i = 0; i < words.length; i++) {
        const word = words[i];
        if (word.length < 2) continue;

        // Check for inflection
        let isInflected = false;
        let isPlural = false;
        let inflectionType: string | null = null;

        for (const ending of NOUN_INFLECTION_ENDINGS) {
          if (word.endsWith(ending.ending) && word.length > ending.ending.length + 1) {
            isInflected = true;
            isPlural = ending.isPlural;
            inflectionType = ending.type;
            break;
          }
        }

        if (!isInflected) continue;

        // Check sandwich
        let isInSandwich = false;
        let sandwichType: string | null = null;

        for (const pattern of SANDWICH_PATTERNS) {
          if (pattern.start && pattern.end) {
            for (let j = 0; j < i; j++) {
              if (words[j] === pattern.start) {
                for (let k = i + 1; k < words.length && k < i + 6; k++) {
                  if (words[k] === pattern.end) {
                    isInSandwich = true;
                    sandwichType = pattern.type;
                    break;
                  }
                }
              }
              if (isInSandwich) break;
            }
          } else if (pattern.start && !pattern.end) {
            if (i > 0 && words[i - 1] === pattern.start) {
              isInSandwich = true;
              sandwichType = pattern.type;
            }
          } else if (!pattern.start && pattern.end) {
            if (i < words.length - 1 && words[i + 1] === pattern.end) {
              isInSandwich = true;
              sandwichType = pattern.type;
            }
          }
          if (isInSandwich) break;
        }

        // Check ergative
        let isSubjectTransitivePast = false;
        for (let j = i + 1; j < words.length; j++) {
          for (const marker of PAST_TENSE_MARKERS) {
            if (words[j].endsWith(marker) && words[j].length > marker.length + 2) {
              isSubjectTransitivePast = true;
              break;
            }
          }
          if (isSubjectTransitivePast) break;
        }

        // Get base word from pre-fetched map or strip ending
        let baseWord = wordToBase.get(word);
        if (!baseWord) {
          // Strip the inflection ending to guess the base
          for (const ending of NOUN_INFLECTION_ENDINGS) {
            if (word.endsWith(ending.ending) && word.length > ending.ending.length + 1) {
              baseWord = word.slice(0, -ending.ending.length);
              break;
            }
          }
        }
        if (!baseWord) baseWord = word;

        inflectionsToInsert.push({
          word,
          baseWord,
          verseRef,
          inflectionType,
          isPlural,
          isInSandwich,
          sandwichType,
          isSubjectTransitivePast,
          position: i,
        });
      }
    }

    // Use D1 batch API to insert all at once (max 1000 statements per batch)
    let insertedCount = 0;
    const errors: string[] = [];
    const INSERT_BATCH_SIZE = 100; // D1 batch limit is lower for complex statements

    for (let i = 0; i < inflectionsToInsert.length; i += INSERT_BATCH_SIZE) {
      const batch = inflectionsToInsert.slice(i, i + INSERT_BATCH_SIZE);

      try {
        const statements = batch.map(inf =>
          env.DB.prepare(
            `INSERT OR REPLACE INTO inflection_reasons 
             (pashto_form, base_word, verse_ref, inflection_type, is_plural, is_in_sandwich, 
              sandwich_type, is_subject_transitive_past, word_position, translation_key)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
          ).bind(
            inf.word,
            inf.baseWord,
            inf.verseRef,
            inf.inflectionType,
            inf.isPlural ? 1 : 0,
            inf.isInSandwich ? 1 : 0,
            inf.sandwichType,
            inf.isSubjectTransitivePast ? 1 : 0,
            inf.position,
            translation
          )
        );

        await env.DB.batch(statements);
        insertedCount += batch.length;
      } catch (e: any) {
        errors.push(`Batch ${Math.floor(i / INSERT_BATCH_SIZE)}: ${e.message}`);
      }
    }

    return jsonResponse({
      success: true,
      verses_analyzed: verses.length,
      inflections_found: inflectionsToInsert.length,
      inflections_stored: insertedCount,
      errors: errors.slice(0, 10),
      errors_total: errors.length,
    });
  } catch (error: any) {
    return errorResponse(`Failed to populate inflection reasons: ${error.message}`, 500);
  }
}

/**
 * Validate that forms belong to a specific verb lemma
 * POST /api/validate-verb-forms
 * Body: { lemma: string, forms: string[] }
 * 
 * Returns which forms are actually conjugations of the given verb.
 * This prevents false positives like پوهه (from پوهېدل) matching وهل.
 */
async function validateVerbForms(
  env: Env,
  lemma: string,
  forms: string[]
): Promise<Response> {
  try {
    if (!lemma || !forms || forms.length === 0) {
      return jsonResponse({ valid: [], invalid: [] });
    }

    // Get all known forms for this verb from verb_forms table
    const knownFormsResult = await env.DB.prepare(
      `SELECT DISTINCT form FROM verb_forms WHERE base_verb = ?`
    ).bind(lemma).all();

    const knownForms = new Set(
      (knownFormsResult.results || []).map((r: any) => r.form as string)
    );

    // Also add the lemma itself
    knownForms.add(lemma);

    // Classify forms
    const valid: string[] = [];
    const invalid: string[] = [];

    for (const form of forms) {
      if (knownForms.has(form)) {
        valid.push(form);
      } else {
        invalid.push(form);
      }
    }

    return jsonResponse({
      lemma,
      valid,
      invalid,
      known_forms_count: knownForms.size,
    });
  } catch (error: any) {
    return errorResponse(`Failed to validate verb forms: ${error.message}`, 500);
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
// Video Processing Functions
// ========================================

/**
 * Process YouTube video: download, transcribe, store in R2/D1
 */
async function processVideo(env: Env, request: Request): Promise<Response> {
  try {
    const body = await request.json();
    const { youtubeUrl, videoId, apiKeys, transcript, words, segments, transcription_service, title } = body;

    if (!youtubeUrl || !videoId) {
      return errorResponse('Missing youtubeUrl or videoId', 400);
    }

    console.log(`Processing video ${videoId}...`);

    let finalTranscript: string;
    let finalWords: Array<{ start: number; end: number; text: string }>;
    let finalSegments: Array<{ text: string; startTime: number; endTime: number }>;
    let service = transcription_service || 'elevenlabs';

    // If transcript and segments are already provided (from Next.js API polling), use them
    if (transcript && segments) {
      console.log('Using provided transcript and segments');
      finalTranscript = transcript;
      finalWords = words || [];
      finalSegments = segments;
    } else {
      // Otherwise, return error (transcription should happen in Next.js API)
      return errorResponse('Transcription must be done in Next.js API, then send transcript and segments here', 400);
    }

    // Store metadata in D1
    const metadata = {
      video_id: videoId,
      youtube_url: youtubeUrl,
      transcript: finalTranscript,
      segments: finalSegments,
      transcription_service: service,
      created_at: new Date().toISOString(),
    };

    // Store in D1 (table should already exist, but create if needed)
    try {
      await env.DB.prepare(`
        CREATE TABLE IF NOT EXISTS video_transcripts (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          video_id TEXT UNIQUE NOT NULL,
          youtube_url TEXT NOT NULL,
          transcript TEXT,
          segments TEXT,
          transcription_service TEXT,
          r2_audio_key TEXT,
          title TEXT,
          created_at TEXT,
          updated_at TEXT
        )
      `).run();

      // Try to add title column if it doesn't exist (SQLite doesn't support IF NOT EXISTS for ALTER TABLE)
      try {
        await env.DB.prepare(`ALTER TABLE video_transcripts ADD COLUMN title TEXT`).run();
      } catch (alterError: any) {
        // Column might already exist, that's okay - ignore duplicate column errors
        if (!alterError.message?.includes('duplicate column') && !alterError.message?.includes('no such column')) {
          console.warn('Warning: Could not add title column:', alterError.message);
        }
      }

      // Ensure segments JSON is properly stringified (don't truncate!)
      const segmentsJson = JSON.stringify(finalSegments);

      // Generate R2 keys for all segments (comma-separated)
      const r2Keys = finalSegments.map((_, index) => `videos/${videoId}/segment_${index + 1}.mp3`).join(',');

      // Check if title column exists, if not we'll handle it gracefully
      const titleValue = title || null;

      await env.DB.prepare(`
        INSERT OR REPLACE INTO video_transcripts 
        (video_id, youtube_url, transcript, segments, transcription_service, r2_audio_key, title, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(
        videoId,
        youtubeUrl,
        finalTranscript,
        segmentsJson, // Properly stringified JSON - full length
        service,
        r2Keys, // Store R2 keys as comma-separated string
        titleValue,
        metadata.created_at,
        metadata.created_at
      ).run();

      console.log(`✅ Stored ${finalSegments.length} segments in D1`);
      console.log(`✅ Segments JSON length: ${segmentsJson.length} characters`);
    } catch (dbError: any) {
      console.error('D1 database error:', dbError);
      return errorResponse(`Database error: ${dbError.message}`, 500);
    }

    // Extract words from transcript and add to word_frequencies
    try {
      console.log(`📝 Extracting words from transcript...`);
      await extractWordsFromVideoTranscript(env, videoId, finalTranscript);
      console.log(`✅ Words extracted and added to word_frequencies`);
    } catch (wordError: any) {
      console.warn(`⚠️ Word extraction failed (non-critical): ${wordError.message}`);
      // Don't fail the whole request if word extraction fails
    }

    // Generate audio clips metadata
    const audioClips = finalSegments.map((segment, index) => ({
      segment_number: index + 1,
      text: segment.text,
      start_time: segment.startTime,
      end_time: segment.endTime,
      duration: segment.endTime - segment.startTime,
      r2_key: `videos/${videoId}/segment_${index + 1}.mp3`,
    }));

    return jsonResponse({
      success: true,
      videoId,
      transcript: finalTranscript,
      segments: finalSegments,
      audioClips: audioClips,
      r2Keys: audioClips.map(clip => clip.r2_key),
      message: `Processed ${finalSegments.length} segments`,
    });

  } catch (error: any) {
    console.error('Video processing error:', error);
    return errorResponse(`Video processing failed: ${error.message}`, 500);
  }
}

/**
 * List all processed videos
 */
async function listVideos(env: Env): Promise<Response> {
  try {
    const result = await env.DB.prepare(
      `SELECT * FROM video_transcripts ORDER BY created_at DESC LIMIT 100`
    ).all();

    const videos = result.results?.map((video: any) => {
      // Parse segments JSON properly
      let segments: any[] = [];
      try {
        if (video.segments) {
          if (typeof video.segments === 'string') {
            segments = JSON.parse(video.segments);
          } else {
            segments = video.segments;
          }
        }
      } catch (e) {
        console.error('Failed to parse segments:', e);
        segments = [];
      }

      return {
        video_id: video.video_id,
        youtube_url: video.youtube_url,
        transcript: video.transcript,
        segments: segments,
        transcription_service: video.transcription_service,
        r2_audio_key: video.r2_audio_key,
        title: video.title || null,
        created_at: video.created_at,
        updated_at: video.updated_at,
      };
    }) || [];

    return jsonResponse({ videos, count: videos.length });
  } catch (error: any) {
    return errorResponse(`Failed to list videos: ${error.message}`, 500);
  }
}

/**
 * Delete video from D1 and R2
 * DELETE /api/video/:videoId
 */
async function deleteVideo(env: Env, videoId: string): Promise<Response> {
  try {
    // First, get the video to find segment count
    const videoResult = await env.DB.prepare(
      `SELECT * FROM video_transcripts WHERE video_id = ?`
    ).bind(videoId).first();

    if (!videoResult) {
      return errorResponse('Video not found', 404);
    }

    // Delete R2 audio files
    const r2Keys = videoResult.r2_audio_key ? videoResult.r2_audio_key.split(',') : [];
    let deletedCount = 0;
    let failedCount = 0;

    for (const r2Key of r2Keys) {
      try {
        const key = r2Key.trim();
        if (!key) continue;

        // Try multiple possible paths
        const possiblePaths = [
          key,
          `pashto-bible-audio/${key}`,
          key.toLowerCase(),
          `pashto-bible-audio/${key.toLowerCase()}`,
        ];

        let deleted = false;
        for (const path of possiblePaths) {
          const object = await env.AUDIO_BUCKET.get(path);
          if (object !== null) {
            await env.AUDIO_BUCKET.delete(path);
            deleted = true;
            deletedCount++;
            break;
          }
        }

        if (!deleted) {
          failedCount++;
        }
      } catch (error) {
        failedCount++;
        console.warn(`Failed to delete R2 key ${r2Key}:`, error);
      }
    }

    // Delete video_word_mappings and update frequency_video
    // First, get all words affected by this video
    const videoWordsResult = await env.DB.prepare(
      `SELECT pashto_word, frequency FROM video_word_mappings WHERE video_id = ?`
    ).bind(videoId).all();

    const affectedWords: string[] = [];
    if (videoWordsResult.results && videoWordsResult.results.length > 0) {
      // Decrement frequency_video for each word
      for (const mapping of videoWordsResult.results as any[]) {
        affectedWords.push(mapping.pashto_word);

        await env.DB.prepare(`
          UPDATE word_frequencies 
          SET frequency_video = MAX(0, COALESCE(frequency_video, 0) - ?),
              frequency_total = MAX(0, COALESCE(frequency_total, 0) - ?)
          WHERE pashto_word = ?
        `).bind(mapping.frequency, mapping.frequency, mapping.pashto_word).run().catch((err) => {
          console.warn(`Failed to update frequency_video for ${mapping.pashto_word}: ${err.message}`);
        });
      }

      // Recalculate frequency_total for affected words (safety check)
      if (affectedWords.length > 0) {
        const placeholders = affectedWords.map(() => '?').join(',');
        await env.DB.prepare(`
          UPDATE word_frequencies
          SET frequency_total = COALESCE(frequency_afghan2023_ot, 0) + 
                                COALESCE(frequency_afghan2023_nt, 0) + 
                                COALESCE(frequency_yousafzai2019_ot, 0) + 
                                COALESCE(frequency_yousafzai2019_nt, 0) + 
                                COALESCE(frequency_video, 0)
          WHERE pashto_word IN (${placeholders})
        `).bind(...affectedWords).run().catch((err) => {
          console.warn(`Failed to recalculate frequency_total: ${err.message}`);
        });
      }
    }

    // Delete video_word_mappings entries
    await env.DB.prepare(`DELETE FROM video_word_mappings WHERE video_id = ?`)
      .bind(videoId)
      .run();

    // Delete video_transcripts entry
    await env.DB.prepare(`DELETE FROM video_transcripts WHERE video_id = ?`)
      .bind(videoId)
      .run();

    return jsonResponse({
      success: true,
      videoId,
      deletedFromD1: true,
      r2FilesDeleted: deletedCount,
      r2FilesFailed: failedCount,
      message: `Video ${videoId} deleted. ${deletedCount} R2 files deleted.`,
    });
  } catch (error: any) {
    console.error(`Error deleting video: ${error.message}`, error);
    return errorResponse(`Failed to delete video: ${error.message}`, 500);
  }
}

/**
 * Delete R2 object
 * POST /api/r2/delete
 */
async function deleteR2Object(env: Env, request: Request): Promise<Response> {
  try {
    const body = await request.json();
    const { key } = body;

    if (!key) {
      return errorResponse('Missing key', 400);
    }

    // Try multiple possible paths
    const possiblePaths = [
      key,
      `pashto-bible-audio/${key}`,
      key.toLowerCase(),
      `pashto-bible-audio/${key.toLowerCase()}`,
    ];

    for (const path of possiblePaths) {
      const object = await env.AUDIO_BUCKET.get(path);
      if (object !== null) {
        await env.AUDIO_BUCKET.delete(path);
        return jsonResponse({ success: true, key: path, deleted: true });
      }
    }

    return errorResponse(`Object not found: ${key}`, 404);
  } catch (error: any) {
    return errorResponse(`Failed to delete R2 object: ${error.message}`, 500);
  }
}

/**
 * Get full video audio stream from R2 (for waveform visualization)
 * GET /api/video/:videoId/audio-full
 */
async function getVideoAudioFull(env: Env, videoId: string, request: Request): Promise<Response> {
  try {
    // Try multiple possible paths for full audio
    // Note: R2 bucket name is NOT part of the key path
    const possiblePaths = [
      `videos/${videoId}/full.mp3`,  // Standard path
      `videos/${videoId}/audio.mp3`,
      `videos/${videoId.toLowerCase()}/full.mp3`,  // Lowercase video ID
    ];

    console.log(`Requesting full audio for video ${videoId}`);

    for (const r2Key of possiblePaths) {
      try {
        console.log(`Trying R2 path: ${r2Key}`);
        const object = await env.AUDIO_BUCKET.get(r2Key);

        if (object !== null) {
          console.log(`✅ Found full audio at: ${r2Key}`);
          return streamAudio(env, r2Key, request);
        } else {
          console.log(`Path ${r2Key} not found (null), trying next...`);
        }
      } catch (pathError) {
        console.log(`Path ${r2Key} error: ${pathError.message}, trying next...`);
      }
    }

    // If full audio not found, try to concatenate segments or return error
    console.warn(`⚠️ Full audio not found for video ${videoId}`);
    console.warn(`Tried paths: ${possiblePaths.join(', ')}`);
    return errorResponse(`Full audio file not found for video ${videoId}. Tried: ${possiblePaths.join(', ')}`, 404);
  } catch (error: any) {
    console.error(`Error getting full video audio: ${error.message}`, error);
    return errorResponse(`Failed to get full video audio: ${error.message}`, 500);
  }
}

/**
 * Get video audio stream from R2
 */
async function getVideoAudio(env: Env, videoId: string, segment: number, request: Request): Promise<Response> {
  try {
    // Try multiple possible paths - the bucket name might be included in the path
    const possiblePaths = [
      `videos/${videoId}/segment_${segment}.mp3`,  // Standard path
      `pashto-bible-audio/videos/${videoId}/segment_${segment}.mp3`,  // With bucket prefix
      `videos/${videoId.toLowerCase()}/segment_${segment}.mp3`,  // Lowercase video ID
      `pashto-bible-audio/videos/${videoId.toLowerCase()}/segment_${segment}.mp3`,  // Lowercase with prefix
    ];

    console.log(`Requesting audio for video ${videoId}, segment ${segment}`);

    for (const r2Key of possiblePaths) {
      try {
        console.log(`Trying R2 path: ${r2Key}`);
        const object = await env.AUDIO_BUCKET.get(r2Key);

        // Check if object exists (get() returns null if not found)
        if (object !== null) {
          console.log(`✅ Found audio at: ${r2Key}`);
          return streamAudio(env, r2Key, request);
        } else {
          console.log(`Path ${r2Key} not found (null), trying next...`);
        }
      } catch (pathError) {
        // Continue to next path
        console.log(`Path ${r2Key} error: ${pathError.message}, trying next...`);
      }
    }

    // None of the paths worked
    console.error(`❌ Audio file not found for video ${videoId}, segment ${segment}`);
    console.error(`Tried paths: ${possiblePaths.join(', ')}`);
    return errorResponse(`Audio file not found for segment ${segment}. Tried paths: ${possiblePaths.join(', ')}`, 404);
  } catch (error: any) {
    console.error(`Error getting video audio: ${error.message}`, error);
    return errorResponse(`Failed to get video audio: ${error.message}`, 500);
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
        cvm.pashto_word = wf.pashto_word
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
// YouTube Audio Extraction (Cloudflare Worker)
// ========================================

/**
 * Extract audio URL from YouTube video using multiple methods
 * Cloudflare Workers have different IP ranges, better success rate
 */
async function getYouTubeAudioUrl(videoId: string): Promise<string | null> {
  console.log(`🔍 [CF Worker] Extracting audio for video: ${videoId}`);

  // Method 1: iOS innertube client (most reliable)
  try {
    const iosResponse = await fetch(
      'https://www.youtube.com/youtubei/v1/player?prettyPrint=false',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'com.google.ios.youtube/19.29.1 (iPhone16,2; U; CPU iOS 17_5_1 like Mac OS X;)',
          'X-Goog-Api-Key': 'AIzaSyB-63vPrdThhKuerbB2N_l7Kwwcxj6yUAc',
        },
        body: JSON.stringify({
          context: {
            client: {
              clientName: 'IOS',
              clientVersion: '19.29.1',
              deviceMake: 'Apple',
              deviceModel: 'iPhone16,2',
              hl: 'en',
              osName: 'iPhone',
              osVersion: '17.5.1.21F90',
              timeZone: 'UTC',
              utcOffsetMinutes: 0,
            }
          },
          videoId: videoId,
          playbackContext: {
            contentPlaybackContext: {
              signatureTimestamp: 20073
            }
          },
          racyCheckOk: true,
          contentCheckOk: true,
        }),
      }
    );

    if (iosResponse.ok) {
      const data = await iosResponse.json() as any;
      console.log(`📡 iOS innertube status: ${data.playabilityStatus?.status}`);

      const formats = data.streamingData?.adaptiveFormats || [];
      const audioFormat = formats.find((f: any) =>
        f.mimeType?.startsWith('audio/mp4') && f.url
      ) || formats.find((f: any) =>
        f.mimeType?.startsWith('audio/') && f.url
      );

      if (audioFormat?.url) {
        console.log(`✅ [CF Worker] Got audio via iOS client`);
        return audioFormat.url;
      }
    }
  } catch (e) {
    console.warn('[CF Worker] iOS innertube failed:', e);
  }

  // Method 2: Android client
  try {
    const androidResponse = await fetch(
      'https://www.youtube.com/youtubei/v1/player?prettyPrint=false',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'com.google.android.youtube/19.29.37 (Linux; U; Android 14)',
        },
        body: JSON.stringify({
          context: {
            client: {
              clientName: 'ANDROID',
              clientVersion: '19.29.37',
              androidSdkVersion: 34,
              hl: 'en',
              timeZone: 'UTC',
            }
          },
          videoId: videoId,
          racyCheckOk: true,
          contentCheckOk: true,
        }),
      }
    );

    if (androidResponse.ok) {
      const data = await androidResponse.json() as any;
      const formats = data.streamingData?.adaptiveFormats || [];
      const audioFormat = formats.find((f: any) =>
        f.mimeType?.startsWith('audio/') && f.url
      );

      if (audioFormat?.url) {
        console.log(`✅ [CF Worker] Got audio via Android client`);
        return audioFormat.url;
      }
    }
  } catch (e) {
    console.warn('[CF Worker] Android innertube failed:', e);
  }

  // Method 3: TV embedded client (sometimes works when others don't)
  try {
    const tvResponse = await fetch(
      'https://www.youtube.com/youtubei/v1/player?prettyPrint=false',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          context: {
            client: {
              clientName: 'TVHTML5_SIMPLY_EMBEDDED_PLAYER',
              clientVersion: '2.0',
              hl: 'en',
              timeZone: 'UTC',
            },
            thirdParty: {
              embedUrl: 'https://www.youtube.com/'
            }
          },
          videoId: videoId,
        }),
      }
    );

    if (tvResponse.ok) {
      const data = await tvResponse.json() as any;
      const formats = data.streamingData?.adaptiveFormats || [];
      const audioFormat = formats.find((f: any) =>
        f.mimeType?.startsWith('audio/') && f.url
      );

      if (audioFormat?.url) {
        console.log(`✅ [CF Worker] Got audio via TV client`);
        return audioFormat.url;
      }
    }
  } catch (e) {
    console.warn('[CF Worker] TV client failed:', e);
  }

  // Method 4: Invidious API as fallback
  try {
    const invidiousInstances = [
      'https://inv.nadeko.net',
      'https://invidious.snopyta.org',
      'https://yewtu.be'
    ];

    for (const instance of invidiousInstances) {
      try {
        const response = await fetch(`${instance}/api/v1/videos/${videoId}`, {
          headers: { 'Accept': 'application/json' }
        });

        if (response.ok) {
          const data = await response.json() as any;
          const audioFormats = data.adaptiveFormats?.filter((f: any) =>
            f.type?.startsWith('audio/')
          ) || [];

          if (audioFormats.length > 0) {
            console.log(`✅ [CF Worker] Got audio via Invidious (${instance})`);
            return audioFormats[0].url;
          }
        }
      } catch {
        continue;
      }
    }
  } catch (e) {
    console.warn('[CF Worker] Invidious failed:', e);
  }

  console.error(`❌ [CF Worker] All extraction methods failed for: ${videoId}`);
  return null;
}

/**
 * Extract video ID from YouTube URL
 */
function extractYouTubeVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /^([a-zA-Z0-9_-]{11})$/
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

/**
 * Fetch YouTube video metadata
 */
async function getYouTubeMetadata(videoId: string): Promise<{ title: string; description: string; thumbnail: string } | null> {
  try {
    const response = await fetch(
      'https://www.youtube.com/youtubei/v1/player',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          context: {
            client: {
              clientName: 'WEB',
              clientVersion: '2.20231219.04.00',
            }
          },
          videoId: videoId,
        }),
      }
    );

    if (response.ok) {
      const data = await response.json() as any;
      return {
        title: data.videoDetails?.title || `Video ${videoId}`,
        description: data.videoDetails?.shortDescription || '',
        thumbnail: data.videoDetails?.thumbnail?.thumbnails?.[0]?.url || `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
      };
    }
  } catch (e) {
    console.warn('Failed to get YouTube metadata:', e);
  }

  return {
    title: `Video ${videoId}`,
    description: '',
    thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
  };
}

// ========================================
// ElevenLabs Scribe v2 Transcription
// ========================================

interface ElevenLabsTranscriptionResult {
  transcript: string;
  words: TranscriptWord[];
  segments: TranscriptSegment[];
  language_code: string;
  language_probability: number;
}

/**
 * Transcribe audio using ElevenLabs Scribe v2
 * Returns result with detailed error info if failed
 */
async function transcribeWithElevenLabs(
  audioUrl: string,
  apiKey: string
): Promise<{ success: true; result: ElevenLabsTranscriptionResult } | { success: false; error: string }> {
  console.log(`🎙️ [CF Worker] Starting ElevenLabs Scribe v2 transcription`);

  try {
    // First, download the audio to send to ElevenLabs
    console.log(`📥 Downloading audio from URL...`);

    // Use streaming to handle large files more efficiently
    const audioResponse = await fetch(audioUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
      }
    });

    if (!audioResponse.ok) {
      return { success: false, error: `Failed to download audio: HTTP ${audioResponse.status}` };
    }

    // Get content type and size
    const contentType = audioResponse.headers.get('content-type') || 'audio/mp4';
    const contentLength = audioResponse.headers.get('content-length');
    console.log(`📥 Audio content-type: ${contentType}, size: ${contentLength || 'unknown'}`);

    // Read up to 50MB of audio
    const maxSize = 50 * 1024 * 1024;
    const reader = audioResponse.body?.getReader();
    if (!reader) {
      return { success: false, error: 'Could not read audio stream' };
    }

    const chunks: Uint8Array[] = [];
    let totalSize = 0;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      if (totalSize + value.length > maxSize) {
        // Take only what we need to reach maxSize
        const remaining = maxSize - totalSize;
        chunks.push(value.slice(0, remaining));
        totalSize = maxSize;
        console.log(`⚠️ Audio truncated at ${maxSize / 1024 / 1024}MB`);
        break;
      }

      chunks.push(value);
      totalSize += value.length;
    }

    // Combine chunks into a single buffer
    const audioData = new Uint8Array(totalSize);
    let offset = 0;
    for (const chunk of chunks) {
      audioData.set(chunk, offset);
      offset += chunk.length;
    }

    console.log(`📥 Downloaded ${(totalSize / 1024 / 1024).toFixed(2)}MB of audio`);

    // Create blob with appropriate content type
    const audioBlob = new Blob([audioData], { type: contentType });

    // Determine file extension from content type
    let extension = 'mp4';
    if (contentType.includes('audio/webm')) extension = 'webm';
    else if (contentType.includes('audio/mpeg')) extension = 'mp3';
    else if (contentType.includes('audio/wav')) extension = 'wav';

    // Create form data for ElevenLabs API
    const formData = new FormData();
    formData.append('file', audioBlob, `audio.${extension}`);
    formData.append('model_id', 'scribe_v2');
    formData.append('language_code', 'ps'); // Pashto
    formData.append('timestamps_granularity', 'word');
    formData.append('diarize', 'true');

    console.log(`📤 Sending ${(totalSize / 1024 / 1024).toFixed(2)}MB to ElevenLabs Scribe v2...`);
    const transcribeResponse = await fetch(
      'https://api.elevenlabs.io/v1/speech-to-text',
      {
        method: 'POST',
        headers: {
          'xi-api-key': apiKey,
        },
        body: formData,
      }
    );

    if (!transcribeResponse.ok) {
      const errorText = await transcribeResponse.text();
      console.error(`❌ ElevenLabs API error: ${transcribeResponse.status}`, errorText);
      return {
        success: false,
        error: `ElevenLabs API error: ${transcribeResponse.status} - ${errorText}`
      };
    }

    const result = await transcribeResponse.json() as any;
    console.log(`✅ [CF Worker] Transcription complete. Text length: ${result.text?.length || 0}`);

    // Process the ElevenLabs response into our format
    const words: TranscriptWord[] = (result.words || []).map((w: any) => ({
      text: w.text || w.word,
      start_time: w.start || w.start_time || 0,
      end_time: w.end || w.end_time || 0,
      confidence: w.confidence || 0.95,
    }));

    // Create SINGLE-SENTENCE segments from the transcription
    // Each segment = 1 sentence (max ~6 seconds) for Anki-friendly clips
    const segments: TranscriptSegment[] = [];
    
    // Pashto sentence-ending punctuation (comprehensive)
    const sentenceEnders = new Set(['.', '؟', '۔', '!', '?', '،', '؛', ':', '»']);
    
    if (words.length > 0) {
      let currentSentenceWords: TranscriptWord[] = [];
      
      for (let i = 0; i < words.length; i++) {
        currentSentenceWords.push(words[i]);
        
        // Check if this word ends a sentence
        const wordText = words[i].text.trim();
        const lastChar = wordText.slice(-1);
        const endsWithPunctuation = sentenceEnders.has(lastChar);
        
        // Check for pauses (> 0.5 seconds) as sentence breaks
        const hasLongPause = i < words.length - 1 && 
          (words[i + 1].start_time - words[i].end_time) > 0.5;
        
        // Calculate current segment duration
        const segmentDuration = currentSentenceWords.length > 0 
          ? words[i].end_time - currentSentenceWords[0].start_time 
          : 0;
        
        // Create segment immediately when: sentence ends, long pause, or max 6 seconds
        const shouldCreateSegment = endsWithPunctuation || hasLongPause || segmentDuration > 6;
        
        if (shouldCreateSegment && currentSentenceWords.length > 0) {
          segments.push({
            segment_number: segments.length + 1,
            text: currentSentenceWords.map(w => w.text).join(' '),
            start_time: currentSentenceWords[0].start_time,
            end_time: words[i].end_time,
            duration: words[i].end_time - currentSentenceWords[0].start_time,
            words: [...currentSentenceWords],
            confidence: 0.95,
          });
          currentSentenceWords = [];
        }
      }
      
      // Don't forget any remaining words
      if (currentSentenceWords.length > 0) {
        segments.push({
          segment_number: segments.length + 1,
          text: currentSentenceWords.map(w => w.text).join(' '),
          start_time: currentSentenceWords[0].start_time,
          end_time: currentSentenceWords[currentSentenceWords.length - 1].end_time,
          duration: currentSentenceWords[currentSentenceWords.length - 1].end_time - 
                   currentSentenceWords[0].start_time,
          words: [...currentSentenceWords],
          confidence: 0.95,
        });
      }
    }
    
    console.log(`📝 Created ${segments.length} single-sentence segments from transcription`);

    return {
      success: true,
      result: {
        transcript: result.text || words.map(w => w.text).join(' '),
        words,
        segments,
        language_code: result.language_code || 'ps',
        language_probability: result.language_probability || 0.95,
      }
    };

  } catch (error) {
    console.error(`❌ [CF Worker] Transcription error:`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown transcription error'
    };
  }
}

// ========================================
// Video Processing Handler
// ========================================

async function handleProcessVideo(request: Request, env: Env): Promise<Response> {
  try {
    const body = await request.json() as { youtubeUrl?: string; url?: string };
    const youtubeUrl = body.youtubeUrl || body.url;

    if (!youtubeUrl) {
      return errorResponse('YouTube URL is required', 400);
    }

    // Extract video ID
    const videoId = extractYouTubeVideoId(youtubeUrl);
    if (!videoId) {
      return errorResponse('Invalid YouTube URL', 400);
    }

    console.log(`🎬 [CF Worker] Processing video: ${videoId}`);

    // Check if API key is configured
    if (!env.ELEVENLABS_API_KEY) {
      return errorResponse('ElevenLabs API key not configured', 500);
    }

    // Get video metadata
    const metadata = await getYouTubeMetadata(videoId);

    // Extract audio URL
    const audioUrl = await getYouTubeAudioUrl(videoId);

    if (!audioUrl) {
      return jsonResponse({
        success: false,
        error: 'Could not extract audio from YouTube video',
        message: 'YouTube blocks direct extraction from servers. Please upload an audio file instead.',
        suggestion: 'Use a YouTube to MP3 converter (like y2mate.com or ytmp3.cc) to download the audio, then upload it using the File Upload tab.',
        videoId,
        metadata,
      }, 400);
    }

    console.log(`🔊 [CF Worker] Got audio URL: ${audioUrl.substring(0, 100)}...`);

    console.log(`🔊 [CF Worker] Got audio URL, starting transcription...`);

    // Transcribe with ElevenLabs Scribe v2
    const transcriptionResponse = await transcribeWithElevenLabs(audioUrl, env.ELEVENLABS_API_KEY);

    if (!transcriptionResponse.success) {
      // Check if the error is due to IP restrictions
      const errorMsg = transcriptionResponse.error;
      if (errorMsg.includes('403') || errorMsg.includes('Forbidden')) {
        return jsonResponse({
          success: false,
          error: 'YouTube audio URL is IP-restricted',
          message: 'YouTube restricts audio downloads to specific IP addresses. Server-side extraction is blocked.',
          suggestion: 'Please download the audio using a YouTube to MP3 converter (y2mate.com, ytmp3.cc) and upload it using the File Upload tab.',
          videoId,
          metadata,
        }, 400);
      }

      return jsonResponse({
        success: false,
        error: 'Transcription failed',
        message: transcriptionResponse.error,
        videoId,
        metadata,
      }, 500);
    }

    const transcription = transcriptionResponse.result;

    // Store in D1 database
    const now = new Date().toISOString();

    try {
      // Create videos table if not exists
      await env.DB.prepare(`
        CREATE TABLE IF NOT EXISTS videos (
          video_id TEXT PRIMARY KEY,
          youtube_url TEXT,
          title TEXT,
          description TEXT,
          thumbnail_url TEXT,
          transcript_text TEXT,
          segments_json TEXT,
          words_json TEXT,
          duration REAL,
          language_code TEXT,
          status TEXT DEFAULT 'completed',
          created_at TEXT,
          updated_at TEXT
        )
      `).run();

      // Insert or update video
      await env.DB.prepare(`
        INSERT OR REPLACE INTO videos 
        (video_id, youtube_url, title, description, thumbnail_url, transcript_text, 
         segments_json, words_json, duration, language_code, status, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'completed', ?, ?)
      `).bind(
        videoId,
        youtubeUrl,
        metadata?.title || '',
        metadata?.description || '',
        metadata?.thumbnail || '',
        transcription.transcript,
        JSON.stringify(transcription.segments),
        JSON.stringify(transcription.words),
        transcription.segments.length > 0
          ? transcription.segments[transcription.segments.length - 1].end_time
          : 0,
        transcription.language_code,
        now,
        now
      ).run();

      console.log(`💾 [CF Worker] Video saved to D1`);

    } catch (dbError) {
      console.error('Database error:', dbError);
      // Continue even if DB save fails - return the transcription
    }

    return jsonResponse({
      success: true,
      videoId,
      youtubeUrl,
      title: metadata?.title,
      thumbnail: metadata?.thumbnail,
      transcript: transcription.transcript,
      segments: transcription.segments,
      words: transcription.words,
      totalSegments: transcription.segments.length,
      totalWords: transcription.words.length,
      duration: transcription.segments.length > 0
        ? transcription.segments[transcription.segments.length - 1].end_time
        : 0,
      languageCode: transcription.language_code,
    });

  } catch (error) {
    console.error('[CF Worker] Process video error:', error);
    return errorResponse(error instanceof Error ? error.message : 'Failed to process video', 500);
  }
}

/**
 * Store/update video data in videos table (for re-processing)
 */
async function handleStoreVideo(request: Request, env: Env): Promise<Response> {
  try {
    const body = await request.json() as {
      video_id: string;
      youtube_url?: string;
      transcript?: string;
      segments?: any[];
      transcription_service?: string;
      title?: string;
    };
    
    const { video_id, youtube_url, transcript, segments, title } = body;
    
    if (!video_id) {
      return errorResponse('video_id is required', 400);
    }
    
    console.log(`💾 Updating video ${video_id} segments in videos table...`);
    
    const now = new Date().toISOString();
    const segmentsJson = segments ? JSON.stringify(segments) : null;
    
    // Update the videos table (same table used by handleGetVideo)
    const result = await env.DB.prepare(`
      UPDATE videos 
      SET segments_json = ?, updated_at = ?
      WHERE video_id = ?
    `).bind(segmentsJson, now, video_id).run();
    
    if (result.meta.changes === 0) {
      return errorResponse(`Video ${video_id} not found in videos table`, 404);
    }
    
    console.log(`✅ Updated ${video_id} with ${segments?.length || 0} segments`);
    
    return jsonResponse({
      success: true,
      video_id,
      segments_updated: segments?.length || 0,
      message: `Updated video with ${segments?.length || 0} segments`
    });

  } catch (error) {
    console.error('[CF Worker] Store video error:', error);
    return errorResponse(error instanceof Error ? error.message : 'Failed to store video', 500);
  }
}

/**
 * LEGACY: Store video data in video_transcripts table (kept for backwards compatibility)
 */
async function handleStoreVideoLegacy(request: Request, env: Env): Promise<Response> {
  try {
    const body = await request.json() as {
      video_id: string;
      youtube_url?: string;
      transcript?: string;
      segments?: any[];
      transcription_service?: string;
      title?: string;
    };
    
    const { video_id, youtube_url, transcript, segments, transcription_service, title } = body;
    
    if (!video_id) {
      return errorResponse('video_id is required', 400);
    }
    
    console.log(`💾 Storing/updating video ${video_id} in video_transcripts (legacy)...`);
    
    const now = new Date().toISOString();
    const segmentsJson = segments ? JSON.stringify(segments) : '[]';
    const r2Keys = segments 
      ? segments.map((_, index) => `videos/${video_id}/segment_${index + 1}.mp3`).join(',')
      : '';
    
    // Create table if needed
    await env.DB.prepare(`
      CREATE TABLE IF NOT EXISTS video_transcripts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        video_id TEXT UNIQUE NOT NULL,
        youtube_url TEXT NOT NULL,
        transcript TEXT,
        segments TEXT,
        transcription_service TEXT,
        r2_audio_key TEXT,
        title TEXT,
        created_at TEXT,
        updated_at TEXT
      )
    `).run();
    
    // Check if video exists
    const existing = await env.DB.prepare(
      `SELECT video_id, created_at FROM video_transcripts WHERE video_id = ?`
    ).bind(video_id).first();
    
    if (existing) {
      // Update existing video
      await env.DB.prepare(`
        UPDATE video_transcripts 
        SET transcript = ?, segments = ?, transcription_service = ?, r2_audio_key = ?, 
            title = COALESCE(?, title), updated_at = ?
        WHERE video_id = ?
      `).bind(
        transcript || '',
        segmentsJson,
        transcription_service || 'elevenlabs_scribe_v2',
        r2Keys,
        title || null,
        now,
        video_id
      ).run();
      
      console.log(`✅ Updated video ${video_id} with ${segments?.length || 0} segments`);
    } else {
      // Insert new video
      await env.DB.prepare(`
        INSERT INTO video_transcripts 
        (video_id, youtube_url, transcript, segments, transcription_service, r2_audio_key, title, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(
        video_id,
        youtube_url || '',
        transcript || '',
        segmentsJson,
        transcription_service || 'elevenlabs_scribe_v2',
        r2Keys,
        title || null,
        now,
        now
      ).run();
      
      console.log(`✅ Inserted video ${video_id} with ${segments?.length || 0} segments`);
    }
    
    return jsonResponse({
      success: true,
      videoId: video_id,
      segmentCount: segments?.length || 0,
      message: existing ? 'Video updated' : 'Video created',
    });
    
  } catch (error) {
    console.error('[CF Worker] Store video error:', error);
    return errorResponse(error instanceof Error ? error.message : 'Failed to store video', 500);
  }
}

/**
 * Save video with transcript (for local processing workflow)
 */
async function handleSaveVideo(request: Request, env: Env): Promise<Response> {
  try {
    const body = await request.json() as {
      video_id: string;
      youtube_url?: string;
      title?: string;
      description?: string;
      thumbnail_url?: string;
      transcript_text: string;
      segments?: any[];
      words?: any[];
      duration?: number;
      language_code?: string;
    };
    
    const { video_id, youtube_url, title, description, thumbnail_url, transcript_text, segments, words, duration, language_code } = body;
    
    if (!video_id || !transcript_text) {
      return errorResponse('video_id and transcript_text are required', 400);
    }
    
    console.log(`💾 Saving video ${video_id} to D1...`);
    
    const now = new Date().toISOString();
    
    // Create videos table if not exists
    await env.DB.prepare(`
      CREATE TABLE IF NOT EXISTS videos (
        video_id TEXT PRIMARY KEY,
        youtube_url TEXT,
        title TEXT,
        description TEXT,
        thumbnail_url TEXT,
        transcript_text TEXT,
        segments_json TEXT,
        words_json TEXT,
        r2_audio_key TEXT,
        duration REAL,
        language_code TEXT,
        status TEXT DEFAULT 'completed',
        created_at TEXT,
        updated_at TEXT
      )
    `).run();
    
    // Insert or update video
    await env.DB.prepare(`
      INSERT OR REPLACE INTO videos 
      (video_id, youtube_url, title, description, thumbnail_url, transcript_text, 
       segments_json, words_json, duration, language_code, status, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'completed', ?, ?)
    `).bind(
      video_id,
      youtube_url || '',
      title || `Video ${video_id}`,
      description || '',
      thumbnail_url || `https://img.youtube.com/vi/${video_id}/maxresdefault.jpg`,
      transcript_text,
      JSON.stringify(segments || []),
      JSON.stringify(words || []),
      duration || 0,
      language_code || 'ps',
      now,
      now
    ).run();
    
    console.log(`✅ Video ${video_id} saved to D1`);
    
    return jsonResponse({
      success: true,
      videoId: video_id,
      message: 'Video saved successfully',
      totalSegments: segments?.length || 0,
      totalWords: words?.length || 0,
    });
    
  } catch (error) {
    console.error('[CF Worker] Save video error:', error);
    return errorResponse(error instanceof Error ? error.message : 'Failed to save video', 500);
  }
}

/**
 * Get all stored videos
 */
async function handleGetVideos(env: Env): Promise<Response> {
  try {
    // Check if table exists
    const tableCheck = await env.DB.prepare(
      `SELECT name FROM sqlite_master WHERE type='table' AND name='videos'`
    ).first();

    if (!tableCheck) {
      return jsonResponse({ success: true, videos: [], total: 0 });
    }

    const result = await env.DB.prepare(`
      SELECT video_id, youtube_url, title, description, thumbnail_url, 
             transcript_text, segments_json, duration, language_code, 
             status, created_at, updated_at
      FROM videos
      ORDER BY created_at DESC
      LIMIT 50
    `).all();

    const videos = (result.results || []).map((v: any) => {
      const segments = parseJsonSafe(v.segments_json, []);
      return {
        // Both snake_case and camelCase for compatibility
        id: v.video_id,
        video_id: v.video_id,
        youtubeUrl: v.youtube_url,
        youtube_url: v.youtube_url,
        title: v.title || `Video ${v.video_id}`,
        description: v.description,
        thumbnail: v.thumbnail_url,
        transcript: v.transcript_text,
        // Segments for ClientHome.tsx
        segments: segments.map((seg: any, i: number) => ({
          segmentNumber: seg.segment_number || i + 1,
          segment_number: seg.segment_number || i + 1,
          text: seg.text,
          transcript: seg.text,
          transcript_text: seg.text,
          startTime: seg.start_time,
          start_time: seg.start_time,
          endTime: seg.end_time,
          end_time: seg.end_time,
          duration: seg.duration || (seg.end_time - seg.start_time),
          type: 'segment',
        })),
        // Clips for VideosPanel.tsx
        clips: segments.map((seg: any, i: number) => ({
          segment_number: seg.segment_number || i + 1,
          transcript_text: seg.text,
          start_time: seg.start_time,
          end_time: seg.end_time,
          duration: seg.duration || (seg.end_time - seg.start_time),
        })),
        totalSegments: segments.length,
        total_clips: segments.length,
        totalDuration: v.duration || 0,
        total_duration: v.duration || 0,
        duration: v.duration || 0,
        language_code: v.language_code,
        status: v.status,
        updated_at: v.updated_at,
        source: 'cloudflare' as const,
      };
    });

    return jsonResponse({ success: true, videos, total: videos.length });

  } catch (error) {
    console.error('[CF Worker] Get videos error:', error);
    return errorResponse(error instanceof Error ? error.message : 'Failed to get videos', 500);
  }
}

/**
 * Get a single video by ID
 */
async function handleGetVideo(videoId: string, env: Env): Promise<Response> {
  try {
    const result = await env.DB.prepare(`
      SELECT video_id, youtube_url, title, description, thumbnail_url, 
             transcript_text, segments_json, words_json, duration, language_code, 
             status, created_at, updated_at
      FROM videos
      WHERE video_id = ?
    `).bind(videoId).first();

    if (!result) {
      return errorResponse('Video not found', 404);
    }

    return jsonResponse({
      videoId: result.video_id,
      youtubeUrl: result.youtube_url,
      title: result.title,
      description: result.description,
      thumbnail: result.thumbnail_url,
      transcript: result.transcript_text,
      segments: parseJsonSafe(result.segments_json as string, []),
      words: parseJsonSafe(result.words_json as string, []),
      duration: result.duration,
      languageCode: result.language_code,
      status: result.status,
      createdAt: result.created_at,
      updatedAt: result.updated_at,
    });

  } catch (error) {
    console.error('[CF Worker] Get video error:', error);
    return errorResponse(error instanceof Error ? error.message : 'Failed to get video', 500);
  }
}

/**
 * Transcribe uploaded audio file
 */
async function handleTranscribeAudio(request: Request, env: Env): Promise<Response> {
  try {
    if (!env.ELEVENLABS_API_KEY) {
      return errorResponse('ElevenLabs API key not configured', 500);
    }

    // Get the audio file from the request
    const formData = await request.formData();
    const audioFile = formData.get('file') as Blob | null;

    if (!audioFile) {
      return errorResponse('No audio file provided', 400);
    }

    console.log(`🎙️ [CF Worker] Transcribing uploaded file (${(audioFile.size / 1024 / 1024).toFixed(2)}MB)`);

    // Create form data for ElevenLabs API
    const elevenLabsForm = new FormData();
    elevenLabsForm.append('file', audioFile, 'audio.mp3');
    elevenLabsForm.append('model_id', 'scribe_v2');
    elevenLabsForm.append('language_code', 'ps');
    elevenLabsForm.append('timestamps_granularity', 'word');
    elevenLabsForm.append('diarize', 'true');

    const response = await fetch(
      'https://api.elevenlabs.io/v1/speech-to-text',
      {
        method: 'POST',
        headers: {
          'xi-api-key': env.ELEVENLABS_API_KEY,
        },
        body: elevenLabsForm,
      }
    );
    
    if (!response.ok) {
      const errorText = await response.text();
      return errorResponse(`Transcription failed: ${errorText}`, response.status);
    }
    
    const result = await response.json() as any;
    
    // Process words - ElevenLabs returns words with start/end times
    const words: TranscriptWord[] = (result.words || []).filter((w: any) => w.type === 'word').map((w: any) => ({
      text: w.text,
      start_time: w.start || 0,
      end_time: w.end || 0,
      confidence: w.confidence || 0.95,
    }));
    
    return jsonResponse({
      success: true,
      transcript: result.text || '',
      words,
      languageCode: result.language_code || 'ps',
      languageProbability: result.language_probability || 0.95,
    });

  } catch (error) {
    console.error('[CF Worker] Transcribe audio error:', error);
    return errorResponse(error instanceof Error ? error.message : 'Failed to transcribe audio', 500);
  }
}

/**
 * Transcribe audio from R2 storage (triggered by Modal VM)
 * This endpoint receives audio that was uploaded to R2 by the Modal worker
 */
async function handleTranscribeR2Audio(request: Request, env: Env): Promise<Response> {
  try {
    if (!env.ELEVENLABS_API_KEY) {
      return errorResponse('ElevenLabs API key not configured', 500);
    }

    const body = await request.json() as {
      video_id: string;
      r2_key: string;
      youtube_url?: string;
      title?: string;
    };

    const { video_id, r2_key, youtube_url, title } = body;

    if (!video_id || !r2_key) {
      return errorResponse('video_id and r2_key are required', 400);
    }

    console.log(`🎙️ [CF Worker] Transcribing R2 audio: ${r2_key}`);

    // Get audio from R2
    const audioObject = await env.AUDIO_BUCKET.get(r2_key);

    if (!audioObject) {
      return errorResponse(`Audio not found in R2: ${r2_key}`, 404);
    }

    const audioBlob = await audioObject.blob();
    console.log(`📦 Audio size: ${(audioBlob.size / 1024 / 1024).toFixed(2)}MB`);

    // Create form data for ElevenLabs API
    const elevenLabsForm = new FormData();
    elevenLabsForm.append('file', audioBlob, 'audio.mp3');
    elevenLabsForm.append('model_id', 'scribe_v2');
    elevenLabsForm.append('language_code', 'ps');
    elevenLabsForm.append('timestamps_granularity', 'word');
    elevenLabsForm.append('diarize', 'true');

    console.log(`📤 Sending to ElevenLabs Scribe v2...`);
    const response = await fetch(
      'https://api.elevenlabs.io/v1/speech-to-text',
      {
        method: 'POST',
        headers: {
          'xi-api-key': env.ELEVENLABS_API_KEY,
        },
        body: elevenLabsForm,
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ ElevenLabs error: ${errorText}`);
      return errorResponse(`Transcription failed: ${errorText}`, response.status);
    }

    const result = await response.json() as any;
    console.log(`✅ Transcription complete. Text length: ${result.text?.length || 0}`);

    // Process words
    const words: TranscriptWord[] = (result.words || []).map((w: any) => ({
      text: w.text || w.word,
      start_time: w.start || w.start_time || 0,
      end_time: w.end || w.end_time || 0,
      confidence: w.confidence || 0.95,
    }));

    // Create segments from words
    const segments: TranscriptSegment[] = [];
    let currentSegment: TranscriptWord[] = [];
    let segmentStart = words[0]?.start_time || 0;

    for (let i = 0; i < words.length; i++) {
      currentSegment.push(words[i]);

      const segmentDuration = words[i].end_time - segmentStart;
      const hasLongPause = i < words.length - 1 &&
        (words[i + 1].start_time - words[i].end_time) > 1.5;

      if (segmentDuration >= 30 || hasLongPause || i === words.length - 1) {
        segments.push({
          segment_number: segments.length + 1,
          text: currentSegment.map(w => w.text).join(' '),
          start_time: segmentStart,
          end_time: words[i].end_time,
          duration: words[i].end_time - segmentStart,
          words: currentSegment,
          confidence: 0.95,
        });

        if (i < words.length - 1) {
          currentSegment = [];
          segmentStart = words[i + 1].start_time;
        }
      }
    }

    // Store in D1 database
    const now = new Date().toISOString();

    try {
      // Create videos table if not exists
      await env.DB.prepare(`
        CREATE TABLE IF NOT EXISTS videos (
          video_id TEXT PRIMARY KEY,
          youtube_url TEXT,
          title TEXT,
          description TEXT,
          thumbnail_url TEXT,
          transcript_text TEXT,
          segments_json TEXT,
          words_json TEXT,
          r2_audio_key TEXT,
          duration REAL,
          language_code TEXT,
          status TEXT DEFAULT 'completed',
          created_at TEXT,
          updated_at TEXT
        )
      `).run();

      // Insert or update video
      await env.DB.prepare(`
        INSERT OR REPLACE INTO videos 
        (video_id, youtube_url, title, transcript_text, segments_json, words_json, 
         r2_audio_key, duration, language_code, status, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'completed', ?, ?)
      `).bind(
        video_id,
        youtube_url || '',
        title || `Video ${video_id}`,
        result.text || '',
        JSON.stringify(segments),
        JSON.stringify(words),
        r2_key,
        segments.length > 0 ? segments[segments.length - 1].end_time : 0,
        result.language_code || 'ps',
        now,
        now
      ).run();

      console.log(`💾 Video saved to D1: ${video_id}`);

    } catch (dbError) {
      console.error('Database error:', dbError);
      // Continue - return transcription even if DB save fails
    }

    return jsonResponse({
      success: true,
      videoId: video_id,
      transcript: result.text || '',
      words,
      segments,
      totalWords: words.length,
      totalSegments: segments.length,
      duration: segments.length > 0 ? segments[segments.length - 1].end_time : 0,
      languageCode: result.language_code || 'ps',
      r2Key: r2_key
    });

  } catch (error) {
    console.error('[CF Worker] Transcribe R2 audio error:', error);
    return errorResponse(error instanceof Error ? error.message : 'Failed to transcribe R2 audio', 500);
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

    // ========================================
    // VIDEO PROCESSING ROUTES (Cloudflare Worker)
    // ========================================

    // Process YouTube video - extract audio and transcribe
    if (path === '/api/process-video' && request.method === 'POST') {
      return handleProcessVideo(request, env);
    }

    // Get all videos
    if (path === '/api/videos' && request.method === 'GET') {
      return handleGetVideos(env);
    }
    
    // Save video with transcript (for local processing)
    if (path === '/api/videos' && request.method === 'POST') {
      return handleSaveVideo(request, env);
    }

    // Get single video by ID
    if (path.startsWith('/api/videos/') && request.method === 'GET') {
      const videoId = path.replace('/api/videos/', '');
      return handleGetVideo(videoId, env);
    }

    // Transcribe uploaded audio file
    if (path === '/api/transcribe-audio' && request.method === 'POST') {
      return handleTranscribeAudio(request, env);
    }

    // Transcribe audio from R2 storage (called by Modal VM)
    if (path === '/api/transcribe-r2-audio' && request.method === 'POST') {
      return handleTranscribeR2Audio(request, env);
    }

    // Store/update video data (for re-processing)
    if (path === '/api/store-video' && request.method === 'POST') {
      return handleStoreVideo(request, env);
    }

    // ========================================
    // AUTHENTICATION ROUTES
    // ========================================

    // Google OAuth callback
    if (path === '/api/auth/callback/google' && request.method === 'POST') {
      return handleGoogleCallback(request, env);
    }

    // Get session
    if (path === '/api/auth/session' && request.method === 'GET') {
      return handleGetSession(request, env);
    }

    // Sign out
    if (path === '/api/auth/signout' && request.method === 'POST') {
      return handleSignOut(request, env);
    }

    // ========================================
    // EXISTING ROUTES
    // ========================================

    // Route handlers
    if (path === '/api/search' && request.method === 'GET') {
      const query = url.searchParams.get('q') || '';
      const translation = (url.searchParams.get('translation') as any) || 'afghan2023';
      const testament = url.searchParams.get('testament') as 'OT' | 'NT' | undefined;
      const limit = parseInt(url.searchParams.get('limit') || '100');

      return searchVerses(env, query, { translation, testament, limit });
    }

    // BATCH SEARCH: Search for multiple forms in ONE query (POST)
    if (path === '/api/search-batch' && request.method === 'POST') {
      try {
        const body = await request.json() as {
          forms?: string[];
          translation?: 'afghan2023' | 'yousafzai2019';
          testament?: 'OT' | 'NT';
          limit?: number;
        };

        if (!body.forms || !Array.isArray(body.forms)) {
          return errorResponse('Missing or invalid forms array', 400);
        }

        return searchVersesBatch(env, body.forms, {
          translation: body.translation,
          testament: body.testament,
          limit: body.limit,
        });
      } catch (error: any) {
        return errorResponse(`Invalid request body: ${error.message}`, 400);
      }
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

    // Get verses with optional filtering by book, chapter, testament
    if (path === '/api/verses' && request.method === 'GET') {
      const translation = (url.searchParams.get('translation') as any) || 'afghan2023';
      const table = url.searchParams.get('table'); // Allow direct table name for flexibility
      const book = url.searchParams.get('book');
      const chapter = url.searchParams.get('chapter');
      const testament = url.searchParams.get('testament') as 'OT' | 'NT' | undefined;
      const limit = parseInt(url.searchParams.get('limit') || '10000');

      try {
        // Use table param if provided, otherwise derive from translation
        const tableName = table || `verses_${translation}`;
        let query = `SELECT book, chapter, verse, text, testament, audio_r2_key FROM ${tableName}`;
        const params: any[] = [];
        const conditions: string[] = [];

        // Filter by book if specified
        if (book) {
          conditions.push(`book = ?`);
          params.push(book);
        }

        // Filter by chapter if specified
        if (chapter) {
          conditions.push(`chapter = ?`);
          params.push(parseInt(chapter));
        }

        // Filter by testament if specified
        if (testament) {
          conditions.push(`testament = ?`);
          params.push(testament);
        }

        if (conditions.length > 0) {
          query += ` WHERE ` + conditions.join(' AND ');
        }

        query += ` ORDER BY verse ASC LIMIT ?`;
        params.push(limit);

        const result = await env.DB.prepare(query).bind(...params).all();

        return jsonResponse({
          verses: result.results || [],
          count: result.results?.length || 0,
          book: book || 'all',
          chapter: chapter ? parseInt(chapter) : 'all',
          testament: testament || 'all',
          translation: table ? table.replace('verses_', '') : translation,
        });
      } catch (error: any) {
        return errorResponse(`Failed to fetch verses: ${error.message}`, 500);
      }
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

    if (path === '/api/verb-forms' && request.method === 'GET') {
      const lemma = url.searchParams.get('lemma');
      const cap = parseInt(url.searchParams.get('cap') || '200', 10);

      if (!lemma) {
        return errorResponse('Missing lemma parameter', 400);
      }
      return getVerbForms(env, decodeURIComponent(lemma), cap);
    }

    // Word frequency lookup for word analysis
    if (path === '/api/word-frequency' && request.method === 'GET') {
      const word = url.searchParams.get('word');
      if (!word) {
        return errorResponse('Missing word parameter', 400);
      }

      try {
        const result = await env.DB.prepare(
          `SELECT pashto_word, pos, word_type, base_form, romanization, english_translation, frequency_total
           FROM word_frequencies WHERE pashto_word = ? LIMIT 1`
        ).bind(word).first();

        if (!result) {
          return jsonResponse({ found: false, word });
        }

        return jsonResponse(result);
      } catch (error: any) {
        return errorResponse(`Word frequency lookup failed: ${error.message}`, 500);
      }
    }

    // Form to verb lookup (find which verb a conjugated form belongs to)
    if (path === '/api/form-to-verb' && request.method === 'GET') {
      const form = url.searchParams.get('form');
      if (!form) {
        return errorResponse('Missing form parameter', 400);
      }

      try {
        const result = await env.DB.prepare(
          `SELECT base_verb, form, form_type, tense, person, aspect, mood, voice, gender, helper, confidence
           FROM verb_forms WHERE form = ? LIMIT 1`
        ).bind(form).first();

        if (!result) {
          return jsonResponse({ found: false, form });
        }

        return jsonResponse({
          found: true,
          form: result.form,
          base_verb: result.base_verb,
          tense: result.tense || result.form_type,
          person: result.person,
          aspect: result.aspect,
          mood: result.mood,
          voice: result.voice,
          gender: result.gender,
          helper: result.helper,
          confidence: result.confidence || 0.8,
        });
      } catch (error: any) {
        return errorResponse(`Form to verb lookup failed: ${error.message}`, 500);
      }
    }

    // Form to base word lookup (for noun inflections)
    if (path === '/api/form-to-base' && request.method === 'GET') {
      const form = url.searchParams.get('form');
      if (!form) {
        return errorResponse('Missing form parameter', 400);
      }

      try {
        // Try inflections table first
        let result = await env.DB.prepare(
          `SELECT base_word, inflected_form, grammatical_info, frequency
           FROM inflections WHERE inflected_form = ? LIMIT 1`
        ).bind(form).first();

        if (!result) {
          // Try form_to_root table
          result = await env.DB.prepare(
            `SELECT root_word as base_word, word_form as inflected_form, frequency
             FROM form_to_root WHERE word_form = ? LIMIT 1`
          ).bind(form).first();
        }

        if (!result) {
          return jsonResponse({ found: false, form });
        }

        // Parse grammatical_info if it's a string
        let grammaticalInfo = null;
        if (result.grammatical_info) {
          try {
            grammaticalInfo = typeof result.grammatical_info === 'string'
              ? JSON.parse(result.grammatical_info)
              : result.grammatical_info;
          } catch (e) {
            grammaticalInfo = { raw: result.grammatical_info };
          }
        }

        return jsonResponse({
          found: true,
          form,
          base_word: result.base_word,
          grammatical_info: grammaticalInfo,
          frequency: result.frequency || 0,
        });
      } catch (error: any) {
        return errorResponse(`Form to base lookup failed: ${error.message}`, 500);
      }
    }

    // Get all inflections for a noun base form
    if (path === '/api/noun-inflections' && request.method === 'GET') {
      const base = url.searchParams.get('base');
      if (!base) {
        return errorResponse('Missing base parameter', 400);
      }

      try {
        const results = await env.DB.prepare(
          `SELECT inflected_form as form, grammatical_info, frequency
           FROM inflections WHERE base_word = ?
           ORDER BY frequency DESC
           LIMIT 20`
        ).bind(base).all();

        const inflections = (results.results || []).map((row: any) => {
          let label = 'inflection';
          if (row.grammatical_info) {
            try {
              const gi = typeof row.grammatical_info === 'string'
                ? JSON.parse(row.grammatical_info)
                : row.grammatical_info;
              label = gi.label || gi.case || gi.number || 'inflection';
            } catch (e) {
              // ignore
            }
          }
          return {
            form: row.form,
            label,
            frequency: row.frequency || 0,
          };
        });

        return jsonResponse({
          base,
          inflections,
          count: inflections.length,
        });
      } catch (error: any) {
        return errorResponse(`Noun inflections lookup failed: ${error.message}`, 500);
      }
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

    // Analyze inflections in a verse text (real-time)
    if (path === '/api/analyze-inflections' && request.method === 'POST') {
      try {
        const body = await request.json() as {
          text: string;
          verse_ref?: string;
          translation?: 'afghan2023' | 'yousafzai2019';
        };

        if (!body.text) {
          return errorResponse('Missing text in request body', 400);
        }

        return analyzeInflections(
          env,
          body.text,
          body.verse_ref || null,
          body.translation || 'afghan2023'
        );
      } catch (e: any) {
        return errorResponse(`Invalid request body: ${e.message}`, 400);
      }
    }

    // Bulk populate inflection reasons from D1 verses
    if (path === '/api/populate-inflection-reasons' && request.method === 'POST') {
      try {
        const body = await request.json() as {
          book?: string;
          chapter?: number;
          limit?: number;
          translation?: 'afghan2023' | 'yousafzai2019';
        };

        return populateInflectionReasons(
          env,
          body.book || null,
          body.chapter || null,
          body.limit || 100,
          body.translation || 'afghan2023'
        );
      } catch (e: any) {
        return errorResponse(`Invalid request body: ${e.message}`, 400);
      }
    }

    // Validate that forms belong to a specific verb (disambiguation)
    if (path === '/api/validate-verb-forms' && request.method === 'POST') {
      try {
        const body = await request.json() as {
          lemma: string;
          forms: string[];
        };

        if (!body.lemma) {
          return errorResponse('Missing lemma in request body', 400);
        }

        return validateVerbForms(env, body.lemma, body.forms || []);
      } catch (e: any) {
        return errorResponse(`Invalid request body: ${e.message}`, 400);
      }
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

    // Video processing routes
    if (path === '/api/video/process' && request.method === 'POST') {
      return processVideo(env, request);
    }

    if (path === '/api/video/list' && request.method === 'GET') {
      return listVideos(env);
    }

    // Get full video audio endpoint
    if (path.startsWith('/api/video/') && path.endsWith('/audio-full') && request.method === 'GET') {
      // Path format: /api/video/{videoId}/audio-full
      const pathParts = path.split('/');
      const videoId = pathParts[pathParts.length - 2];

      if (!videoId) {
        return errorResponse('Missing video ID', 400);
      }
      return getVideoAudioFull(env, videoId, request);
    }

    // Get video audio endpoint
    if (path.startsWith('/api/video/') && path.endsWith('/audio') && request.method === 'GET') {
      // Path format: /api/video/{videoId}/audio?segment={segmentNumber}
      const pathParts = path.split('/');
      const videoId = pathParts[pathParts.length - 2];
      const segment = parseInt(url.searchParams.get('segment') || '1');

      if (!videoId) {
        return errorResponse('Missing video ID', 400);
      }
      return getVideoAudio(env, videoId, segment, request);
    }

    // Delete video endpoint
    if (path.startsWith('/api/video/') && !path.endsWith('/audio') && request.method === 'DELETE') {
      // Path format: /api/video/{videoId}
      const pathParts = path.split('/');
      const videoId = pathParts[pathParts.length - 1];

      if (!videoId) {
        return errorResponse('Missing video ID', 400);
      }
      return deleteVideo(env, videoId);
    }

    // R2 upload endpoint
    if (path === '/api/r2/upload' && request.method === 'POST') {
      return uploadToR2(env, request);
    }

    // R2 delete endpoint
    if (path === '/api/r2/delete' && request.method === 'POST') {
      return deleteR2Object(env, request);
    }

    // R2 list endpoint (for debugging and population scripts)
    if (path === '/api/r2/list' && request.method === 'GET') {
      const prefix = url.searchParams.get('prefix') || '';
      const cursor = url.searchParams.get('cursor') || undefined;
      const limit = parseInt(url.searchParams.get('limit') || '1000');

      try {
        const listResult = await env.AUDIO_BUCKET.list({
          prefix,
          limit,
          cursor,
        });

        const objects = listResult.objects.map((obj: any) => ({
          key: obj.key,
          size: obj.size,
          uploaded: obj.uploaded,
        }));

        return jsonResponse({
          prefix,
          count: objects.length,
          objects,
          cursor: listResult.cursor, // Return cursor for next page
          truncated: listResult.truncated,
        });
      } catch (error: any) {
        return errorResponse(`Failed to list R2 objects: ${error.message}`, 500);
      }
    }

    if (path === '/api/update-audio-urls' && request.method === 'POST') {
      try {
        const result = await updateAudioUrls(env);
        return jsonResponse(result);
      } catch (error: any) {
        return errorResponse(`Failed to update audio URLs: ${error.message}`, 500);
      }
    }

    // Generic D1 query endpoint for lexicon and other queries
    if (path === '/api/d1/query' && request.method === 'POST') {
      try {
        const body = await request.json();
        const { sql } = body;

        if (!sql || typeof sql !== 'string') {
          return errorResponse('Missing or invalid SQL query', 400);
        }

        // Security: Only allow SELECT queries
        const sqlUpper = sql.trim().toUpperCase();
        if (!sqlUpper.startsWith('SELECT')) {
          return errorResponse('Only SELECT queries are allowed', 400);
        }

        // Execute query
        const result = await env.DB.prepare(sql).all();

        return jsonResponse({
          success: true,
          results: result.results || [],
          meta: result.meta || {},
        });
      } catch (error: any) {
        return errorResponse(`Query failed: ${error.message}`, 500);
      }
    }

    // Top words by frequency for lexicon
    if (path === '/api/top-words' && request.method === 'GET') {
      const limit = parseInt(url.searchParams.get('limit') || '100');
      const pos = url.searchParams.get('pos') || '';

      try {
        let query = `
          SELECT pashto_word, pos, word_type, romanization, english_translation, frequency_total
          FROM word_frequencies
        `;
        const params: any[] = [];

        // Apply POS filter
        if (pos && pos !== 'all') {
          if (pos === 'verb') {
            query += ` WHERE (word_type LIKE '%verb%' OR pos LIKE '%v%')`;
          } else if (pos === 'noun') {
            query += ` WHERE (word_type LIKE '%noun%' OR pos LIKE '%n.%')`;
          } else if (pos === 'adj') {
            query += ` WHERE (word_type LIKE '%adj%' OR pos LIKE '%adj%')`;
          }
        }

        query += ` ORDER BY frequency_total DESC LIMIT ?`;
        params.push(Math.min(limit, 500)); // Max 500 to prevent abuse

        const result = await env.DB.prepare(query).bind(...params).all();

        return jsonResponse({
          words: result.results || [],
          total: result.results?.length || 0,
        });
      } catch (error: any) {
        return errorResponse(`Top words query failed: ${error.message}`, 500);
      }
    }

    // Dictionary search
    if (path === '/api/dictionary/search' && request.method === 'GET') {
      const query = url.searchParams.get('q') || '';
      const limit = parseInt(url.searchParams.get('limit') || '20');

      if (!query || query.length < 2) {
        return jsonResponse({ entries: [] });
      }

      try {
        // Check if query is romanized (starts with ASCII letter)
        const isRomanized = /^[a-zA-Z]/.test(query);

        let sql: string;
        let params: any[];

        if (isRomanized) {
          // Search in romanization
          sql = `
            SELECT pashto_word as pashto, romanization, english_translation as english, 
                   pos, word_type, frequency_total as frequency
            FROM word_frequencies 
            WHERE romanization LIKE ? OR english_translation LIKE ?
            ORDER BY frequency_total DESC
            LIMIT ?
          `;
          params = [`%${query}%`, `%${query}%`, limit];
        } else {
          // Search in Pashto
          sql = `
            SELECT pashto_word as pashto, romanization, english_translation as english, 
                   pos, word_type, frequency_total as frequency
            FROM word_frequencies 
            WHERE pashto_word LIKE ?
            ORDER BY 
              CASE WHEN pashto_word = ? THEN 0 ELSE 1 END,
              frequency_total DESC
            LIMIT ?
          `;
          params = [`%${query}%`, query, limit];
        }

        const result = await env.DB.prepare(sql).bind(...params).all();

        const entries = (result.results || []).map((r: any) => ({
          id: r.pashto,
          pashto: r.pashto,
          romanization: r.romanization || '',
          english: r.english || '',
          pos: r.pos || r.word_type || '',
          frequency: r.frequency || 0,
        }));

        return jsonResponse({ entries, total: entries.length });
      } catch (error: any) {
        return errorResponse(`Dictionary search failed: ${error.message}`, 500);
      }
    }

    // Noun inflections lookup
    if (path === '/api/noun-inflections' && request.method === 'GET') {
      const base = url.searchParams.get('base');
      if (!base) {
        return errorResponse('Missing base parameter', 400);
      }

      try {
        const result = await env.DB.prepare(
          `SELECT base_word, inflected_form, inflection_type, grammatical_info, frequency
           FROM inflections 
           WHERE base_word = ?
           ORDER BY inflection_type`
        ).bind(base).all();

        return jsonResponse({
          base,
          inflections: result.results || [],
        });
      } catch (error: any) {
        return errorResponse(`Noun inflections lookup failed: ${error.message}`, 500);
      }
    }

    return errorResponse('Not found', 404);
  },
};



