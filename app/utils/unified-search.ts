/**
 * Unified Search - LingDocs-Verified Multi-Source Search
 *
 * This module implements elegant search integration across all D1 tables:
 * - Uses verb_forms (verified against LingDocs) for instant conjugation lookup
 * - Handles dynamic compound verbs with helper metadata
 * - Searches Bible verses, video transcripts, and topics in one query
 * - Returns rich grammatical metadata for educational tooltips
 *
 * Search Flow:
 * 1. Term Analysis → Detect POS, verb type, helper from verbs_lexicon
 * 2. Variant Expansion → Fast lookup from verb_forms (pre-computed from LingDocs)
 * 3. Multi-Source Search → Query verses, videos, topics with variants
 * 4. Result Enrichment → Add frequency, grammar explanations, LingDocs links
 */

import type { D1Database } from '../../utils/d1';

// ============================================================================
// Types
// ============================================================================

export interface SearchQuery {
  term: string;
  translation?: 'afghan2023' | 'yousafzai2019';
  testament?: 'OT' | 'NT';
  topics?: string[];
  includeVideos?: boolean;
  includeTopics?: boolean;
  posFilter?: string[]; // 'verb', 'noun', 'adjective'
  limit?: number;
}

export interface TermAnalysis {
  originalTerm: string;
  normalizedTerm: string;
  pos?: string;
  verbMetadata?: {
    verbType: 'dynamic_compound' | 'stative_compound' | 'simple';
    transitivity?: 'transitive' | 'intransitive';
    helper?: string;
    stems?: {
      imperfective?: string;
      perfective?: string;
    };
  };
  sourceWordId?: number;
  lingdocsUrl?: string;
}

// Database query result types
interface VerbLexiconRow {
  pashto_word: string;
  verb_type?: string;
  transitivity?: string;
  helper?: string;
  imperfective_stem?: string;
  perfective_stem?: string;
  source_word_id?: number;
  romanization?: string;
}

interface NounLexiconRow {
  pashto_word: string;
  gender?: string;
  inflection_pattern?: string;
}

interface VerbFormRow {
  base_verb: string;
  form: string;
  form_type?: string;
  tense?: string;
  person?: string;
  number?: string;
  gender?: string;
  aspect?: string;
  source_word_id?: number;
  frequency?: number;
}

interface D1Result<T> {
  results: T[];
  success: boolean;
  meta?: any;
}

interface NounInflectionRow {
  base_form: string;
  inflected_form: string;
  grammatical_info?: string;
  frequency?: number;
}

interface VerseRow {
  id?: number;
  ref: string;
  text: string;
  testament?: string;
  translation?: string;
  book?: string;
  chapter?: number;
  verse?: number;
}

interface VideoRow {
  id: string;
  title: string;
  transcript?: string;
  timestamp?: number;
}

interface VideoWordMappingRow {
  video_id: string;
  pashto_word: string;
  frequency: number;
  audio_r2_key?: string;
  video_title?: string;
  youtube_url?: string;
  segments?: string | any[];
}

interface TopicRow {
  category_key: string;
  category_name: string;
  verse_refs?: string;
  matched_words?: string;
}

interface InflectionReasonRow {
  pashto_form: string;
  base_word: string;
  inflection_type: string;
  grammatical_context: string;
  source_word_id?: number;
}

export interface Variant {
  form: string;
  baseWord: string;
  romanized?: string;
  label: string; // e.g., "1sg Present", "Past Participle"
  pos: string;
  metadata?: {
    tense?: string;
    person?: string;
    number?: string;
    gender?: string;
    aspect?: string;
  };
  frequency?: number;
  source: 'lingdocs' | 'd1' | 'generated';
}

export interface VerseResult {
  id: string;
  ref: string;
  book: string;
  chapter: number;
  verse: number;
  text: string;
  translation: string;
  testament: 'OT' | 'NT';
  matchedForms: string[];
  relevanceScore: number;
  topics?: string[];
}

export interface VideoResult {
  videoId: string;
  title: string;
  youtubeUrl: string;
  matchedWord: string;
  wordFrequency: number;
  segments: Array<{
    text: string;
    startTime: number;
    endTime: number;
    timestampUrl: string;
  }>;
  audioUrl?: string;
}

export interface TopicResult {
  categoryKey: string;
  categoryName: string;
  verseRefs: string[];
  matchedWords: string[];
}

export interface GrammarTooltip {
  form: string;
  baseWord: string;
  inflectionType: string;
  grammaticalContext: string;
  explanation: string;
  lingdocsUrl: string;
}

export interface UnifiedSearchResult {
  query: SearchQuery;
  termAnalysis: TermAnalysis;
  variants: Variant[];
  results: {
    verses: VerseResult[];
    videos: VideoResult[];
    topics: TopicResult[];
  };
  grammarTooltips: Map<string, GrammarTooltip>;
  metadata: {
    totalVariants: number;
    totalResults: number;
    searchTimeMs: number;
    sourcesQueried: string[];
  };
}

// ============================================================================
// Step 1: Term Analysis (using verbs_lexicon + dictionary)
// ============================================================================

export async function analyzeSearchTerm(
  db: D1Database,
  term: string
): Promise<TermAnalysis> {
  const normalized = term.trim();

  // Query verbs_lexicon for verb metadata
  const verbRow = await db.prepare(`
    SELECT
      pashto_word, verb_type, transitivity, helper,
      imperfective_stem, perfective_stem,
      source_word_id, romanization
    FROM verbs_lexicon
    WHERE pashto_word = ?
    LIMIT 1
  `).bind(normalized).first() as VerbLexiconRow | null;

  if (verbRow) {
    return {
      originalTerm: term,
      normalizedTerm: normalized,
      pos: 'verb',
      verbMetadata: {
        verbType: verbRow.verb_type as any,
        transitivity: verbRow.transitivity as any,
        helper: verbRow.helper,
        stems: {
          imperfective: verbRow.imperfective_stem,
          perfective: verbRow.perfective_stem,
        },
      },
      sourceWordId: verbRow.source_word_id,
      lingdocsUrl: verbRow.source_word_id
        ? `https://dictionary.lingdocs.com/word?id=${verbRow.source_word_id}`
        : undefined,
    };
  }

  // Fallback: check nouns_lexicon
  const nounRow = await db.prepare(`
    SELECT pashto_word, gender, inflection_pattern
    FROM nouns_lexicon
    WHERE pashto_word = ?
    LIMIT 1
  `).bind(normalized).first() as NounLexiconRow | null;

  if (nounRow) {
    return {
      originalTerm: term,
      normalizedTerm: normalized,
      pos: 'noun',
    };
  }

  // Unknown POS
  return {
    originalTerm: term,
    normalizedTerm: normalized,
  };
}

// ============================================================================
// Step 2: Variant Expansion (using verb_forms - LingDocs verified!)
// ============================================================================

export async function getVerbVariantsFromD1(
  db: D1Database,
  baseVerb: string,
  limit: number = 100
): Promise<Variant[]> {
  console.log(`🔍 Fetching verb variants from D1 for: ${baseVerb}`);

  const rows = await db.prepare(`
    SELECT
      vf.base_verb,
      vf.form,
      vf.form_type,
      vf.tense,
      vf.person,
      vf.number,
      vf.gender,
      vf.aspect,
      vf.source_word_id,
      wf.frequency_total as frequency
    FROM verb_forms vf
    LEFT JOIN word_frequencies wf ON vf.form = wf.pashto_word
    WHERE vf.base_verb = ?
    ORDER BY wf.frequency_total DESC NULLS LAST
    LIMIT ?
  `).bind(baseVerb, limit).all() as D1Result<VerbFormRow>;

  const variants: Variant[] = [];

  for (const row of rows.results || []) {
    // Build label from metadata
    const labelParts: string[] = [];
    if (row.person && row.number) labelParts.push(`${row.person}${row.number}`);
    if (row.tense) labelParts.push(row.tense);
    if (row.aspect) labelParts.push(row.aspect);

    const label = labelParts.length > 0 ? labelParts.join(' ') : 'Form';

    variants.push({
      form: row.form,
      baseWord: row.base_verb,
      label: label,
      pos: 'verb',
      metadata: {
        tense: row.tense,
        person: row.person,
        number: row.number,
        gender: row.gender,
        aspect: row.aspect,
      },
      frequency: row.frequency || 0,
      source: 'lingdocs', // These are pre-computed from LingDocs!
    });
  }

  console.log(`✅ Found ${variants.length} verb variants from D1 (LingDocs-verified)`);
  return variants;
}

export async function getNounVariantsFromD1(
  db: D1Database,
  baseNoun: string,
  limit: number = 50
): Promise<Variant[]> {
  const rows = await db.prepare(`
    SELECT
      inf.base_form,
      inf.inflected_form,
      inf.grammatical_info,
      wf.frequency_total as frequency
    FROM inflections inf
    LEFT JOIN word_frequencies wf ON inf.inflected_form = wf.pashto_word
    WHERE inf.base_form = ?
    ORDER BY wf.frequency_total DESC NULLS LAST
    LIMIT ?
  `).bind(baseNoun, limit).all() as D1Result<NounInflectionRow>;

  const variants: Variant[] = [];

  for (const row of rows.results || []) {
    // Parse grammatical_info (may be JSON)
    let label = 'Inflection';
    try {
      if (row.grammatical_info) {
        const info = typeof row.grammatical_info === 'string'
          ? JSON.parse(row.grammatical_info)
          : row.grammatical_info;

        label = info.label || info.category || 'Inflection';
      }
    } catch {
      label = row.grammatical_info || 'Inflection';
    }

    variants.push({
      form: row.inflected_form,
      baseWord: row.base_form,
      label: label,
      pos: 'noun',
      frequency: row.frequency || 0,
      source: 'd1',
    });
  }

  console.log(`✅ Found ${variants.length} noun variants from D1`);
  return variants;
}

// ============================================================================
// Step 3: Multi-Source Search (Bible + Videos + Topics)
// ============================================================================

export async function searchVerses(
  db: D1Database,
  variants: Variant[],
  options: {
    translation: string;
    testament?: string;
    topics?: string[];
    limit: number;
  }
): Promise<VerseResult[]> {
  const forms = variants.map(v => v.form);
  const placeholders = forms.map(() => '?').join(',');

  const tableName = options.translation === 'afghan2023'
    ? 'verses_afghan2023'
    : 'verses_yousafzai';

  let sql = `
    SELECT DISTINCT
      v.id, v.ref, v.book, v.chapter, v.verse, v.text, v.testament
    FROM ${tableName} v
    JOIN word_verse_mapping wvm ON v.ref = wvm.verse_ref
    WHERE wvm.pashto_word IN (${placeholders})
  `;

  const bindings: any[] = [...forms];

  // Add testament filter
  if (options.testament) {
    sql += ` AND v.testament = ?`;
    bindings.push(options.testament);
  }

  // Add topic filter (if provided)
  if (options.topics && options.topics.length > 0) {
    const topicPlaceholders = options.topics.map(() => '?').join(',');
    sql += `
      AND EXISTS (
        SELECT 1 FROM category_verse_mappings cvm
        WHERE cvm.book = v.book
          AND cvm.chapter = v.chapter
          AND cvm.verse = v.verse
          AND cvm.category_key IN (${topicPlaceholders})
      )
    `;
    bindings.push(...options.topics);
  }

  sql += ` LIMIT ?`;
  bindings.push(options.limit);

  const rows = await db.prepare(sql).bind(...bindings).all() as D1Result<VerseRow>;

  const verses: VerseResult[] = [];

  for (const row of rows.results || []) {
    // Find which forms matched in this verse
    const matchedForms = forms.filter(form => row.text.includes(form));

    // Calculate relevance score
    const score = calculateRelevanceScore(row.text, matchedForms, variants);

    verses.push({
      id: row.ref, // Use ref as id since it's unique and already a string
      ref: row.ref,
      book: row.book || 'Unknown',
      chapter: row.chapter || 0,
      verse: row.verse || 0,
      text: row.text,
      translation: options.translation,
      testament: (row.testament === 'NT' ? 'NT' : 'OT') as 'OT' | 'NT',
      matchedForms,
      relevanceScore: score,
    });
  }

  // Sort by relevance
  verses.sort((a, b) => b.relevanceScore - a.relevanceScore);

  console.log(`✅ Found ${verses.length} verses`);
  return verses;
}

export async function searchVideos(
  db: D1Database,
  variants: Variant[],
  limit: number = 10
): Promise<VideoResult[]> {
  const forms = variants.map(v => v.form);
  const placeholders = forms.map(() => '?').join(',');

  const rows = await db.prepare(`
    SELECT
      vwm.video_id,
      vwm.pashto_word,
      vwm.frequency,
      vwm.audio_r2_key,
      vt.video_title,
      vt.youtube_url,
      vt.segments
    FROM video_word_mappings vwm
    JOIN video_transcripts vt ON vwm.video_id = vt.video_id
    WHERE vwm.pashto_word IN (${placeholders})
    ORDER BY vwm.frequency DESC
    LIMIT ?
  `).bind(...forms, limit).all() as D1Result<VideoWordMappingRow>;

  const videos: VideoResult[] = [];

  for (const row of rows.results || []) {
    // Parse segments JSON to find exact timestamps
    let matchingSegments: any[] = [];
    try {
      const segments = typeof row.segments === 'string'
        ? JSON.parse(row.segments)
        : row.segments || [];

      matchingSegments = segments.filter((seg: any) =>
        seg.text && seg.text.includes(row.pashto_word)
      ).map((seg: any) => ({
        text: seg.text,
        startTime: seg.startTime || 0,
        endTime: seg.endTime || 0,
        timestampUrl: `${row.youtube_url}&t=${Math.floor(seg.startTime || 0)}s`,
      }));
    } catch (err) {
      console.warn(`Failed to parse segments for video ${row.video_id}:`, err);
    }

    videos.push({
      videoId: row.video_id,
      title: row.video_title || 'Untitled Video',
      youtubeUrl: row.youtube_url,
      matchedWord: row.pashto_word,
      wordFrequency: row.frequency || 0,
      segments: matchingSegments,
      audioUrl: row.audio_r2_key
        ? `https://your-r2-domain.com/${row.audio_r2_key}`
        : undefined,
    });
  }

  console.log(`✅ Found ${videos.length} video matches`);
  return videos;
}

export async function searchTopics(
  db: D1Database,
  variants: Variant[],
  limit: number = 20
): Promise<TopicResult[]> {
  const forms = variants.map(v => v.form);
  const placeholders = forms.map(() => '?').join(',');

  const rows = await db.prepare(`
    SELECT
      wcm.category_key,
      wc.category_name,
      GROUP_CONCAT(DISTINCT cvm.verse_ref) as verse_refs,
      GROUP_CONCAT(DISTINCT wcm.pashto_word) as matched_words
    FROM word_category_mappings wcm
    JOIN word_categories wc ON wcm.category_key = wc.category_key
    LEFT JOIN category_verse_mappings cvm ON wcm.category_key = cvm.category_key
    WHERE wcm.pashto_word IN (${placeholders})
    GROUP BY wcm.category_key, wc.category_name
    LIMIT ?
  `).bind(...forms, limit).all() as D1Result<TopicRow>;

  const topics: TopicResult[] = [];

  for (const row of rows.results || []) {
    topics.push({
      categoryKey: row.category_key,
      categoryName: row.category_name,
      verseRefs: row.verse_refs ? row.verse_refs.split(',') : [],
      matchedWords: row.matched_words ? row.matched_words.split(',') : [],
    });
  }

  console.log(`✅ Found ${topics.length} topic matches`);
  return topics;
}

// ============================================================================
// Step 4: Grammar Tooltips (using inflection_reasons)
// ============================================================================

export async function getGrammarTooltips(
  db: D1Database,
  forms: string[]
): Promise<Map<string, GrammarTooltip>> {
  const tooltips = new Map<string, GrammarTooltip>();

  if (forms.length === 0) return tooltips;

  const placeholders = forms.map(() => '?').join(',');

  const rows = await db.prepare(`
    SELECT
      ir.pashto_form,
      ir.base_word,
      ir.inflection_type,
      ir.grammatical_context,
      ir.source_word_id
    FROM inflection_reasons ir
    WHERE ir.pashto_form IN (${placeholders})
  `).bind(...forms).all() as D1Result<InflectionReasonRow>;

  for (const row of rows.results || []) {
    // Build explanation text
    const explanation = `This is a ${row.inflection_type.replace(/_/g, ' ')} form of "${row.base_word}". Used in ${row.grammatical_context}.`;

    const lingdocsUrl = row.source_word_id
      ? `https://dictionary.lingdocs.com/word?id=${row.source_word_id}`
      : `https://dictionary.lingdocs.com/?q=${encodeURIComponent(row.base_word)}`;

    tooltips.set(row.pashto_form, {
      form: row.pashto_form,
      baseWord: row.base_word,
      inflectionType: row.inflection_type,
      grammaticalContext: row.grammatical_context || 'general usage',
      explanation,
      lingdocsUrl,
    });
  }

  console.log(`✅ Generated ${tooltips.size} grammar tooltips`);
  return tooltips;
}

// ============================================================================
// Unified Search Orchestration
// ============================================================================

export async function unifiedSearch(
  db: D1Database,
  query: SearchQuery
): Promise<UnifiedSearchResult> {
  const startTime = Date.now();

  console.log(`🔍 Starting unified search for: "${query.term}"`);

  // Step 1: Analyze term
  const termAnalysis = await analyzeSearchTerm(db, query.term);
  console.log(`📊 Term analysis:`, {
    pos: termAnalysis.pos,
    verbType: termAnalysis.verbMetadata?.verbType,
  });

  // Step 2: Expand to variants
  let variants: Variant[] = [];

  if (termAnalysis.pos === 'verb') {
    variants = await getVerbVariantsFromD1(db, termAnalysis.normalizedTerm, query.limit || 100);
  } else if (termAnalysis.pos === 'noun') {
    variants = await getNounVariantsFromD1(db, termAnalysis.normalizedTerm, query.limit || 50);
  } else {
    // Unknown POS - try both
    const verbVariants = await getVerbVariantsFromD1(db, termAnalysis.normalizedTerm, 50);
    const nounVariants = await getNounVariantsFromD1(db, termAnalysis.normalizedTerm, 50);
    variants = [...verbVariants, ...nounVariants];
  }

  // Add base form to variants if not present
  if (!variants.some(v => v.form === termAnalysis.normalizedTerm)) {
    variants.unshift({
      form: termAnalysis.normalizedTerm,
      baseWord: termAnalysis.normalizedTerm,
      label: 'Base Form',
      pos: termAnalysis.pos || 'unknown',
      source: 'd1',
    });
  }

  // Step 3: Multi-source search
  const sourcesQueried: string[] = ['verses'];

  const verses = await searchVerses(db, variants, {
    translation: query.translation || 'afghan2023',
    testament: query.testament,
    topics: query.topics,
    limit: query.limit || 100,
  });

  let videos: VideoResult[] = [];
  if (query.includeVideos) {
    sourcesQueried.push('videos');
    videos = await searchVideos(db, variants, 10);
  }

  let topics: TopicResult[] = [];
  if (query.includeTopics) {
    sourcesQueried.push('topics');
    topics = await searchTopics(db, variants, 20);
  }

  // Step 4: Grammar tooltips
  const allForms = variants.map(v => v.form);
  const grammarTooltips = await getGrammarTooltips(db, allForms);

  const searchTimeMs = Date.now() - startTime;

  return {
    query,
    termAnalysis,
    variants,
    results: {
      verses,
      videos,
      topics,
    },
    grammarTooltips,
    metadata: {
      totalVariants: variants.length,
      totalResults: verses.length + videos.length + topics.length,
      searchTimeMs,
      sourcesQueried,
    },
  };
}

// ============================================================================
// Helper Functions
// ============================================================================

function calculateRelevanceScore(
  text: string,
  matchedForms: string[],
  variants: Variant[]
): number {
  let score = 0;

  // Base score: number of matches
  score += matchedForms.length * 10;

  // Frequency bonus (rarer words are more significant)
  const avgFrequency = variants
    .filter(v => matchedForms.includes(v.form))
    .reduce((sum, v) => sum + (v.frequency || 0), 0) / matchedForms.length;

  if (avgFrequency < 100) score += 20; // Very rare word
  else if (avgFrequency < 500) score += 10; // Moderately rare

  // Position bonus (earlier in verse = more important)
  const firstMatchIndex = matchedForms.reduce((min, form) => {
    const index = text.indexOf(form);
    return index >= 0 && index < min ? index : min;
  }, Infinity);

  if (firstMatchIndex < 20) score += 15; // Word appears early

  // Multiple occurrence bonus
  const occurrences = matchedForms.reduce((count, form) => {
    const regex = new RegExp(form, 'g');
    const matches = text.match(regex);
    return count + (matches ? matches.length : 0);
  }, 0);

  score += occurrences * 5;

  return score;
}

export default unifiedSearch;
