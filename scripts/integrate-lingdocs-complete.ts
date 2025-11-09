/**
 * Complete LingDocs Integration Script
 *
 * Implements the full workflow from the Python simulation:
 * 1. Pull canonical word payloads from LingDocs with checksum
 * 2. Normalize into D1 tables (verbs_lexicon, verb_forms, inflection_reasons, categories)
 * 3. Wire search to metadata with validation/fallback
 * 4. Handle dynamic compounds (helper + participle expansion)
 * 5. Multi-source result assembly (verses + videos + topics)
 * 6. Ongoing verification with drift detection
 *
 * Usage:
 *   npx tsx scripts/integrate-lingdocs-complete.ts 1527815399
 *   npx tsx scripts/integrate-lingdocs-complete.ts --batch 1527815399,1527812507,1527811609
 */

import crypto from 'crypto';
import fs from 'fs/promises';
import path from 'path';

// ============================================================================
// 1. Pull Canonical Word Payloads
// ============================================================================

interface LingDocsWordPayload {
  i: number; // word ID
  p: string; // Pashto
  f: string; // romanization
  g: string; // pronunciation guide
  e: string; // English
  c: string; // category (e.g., "v. dyn. comp. trans.")
  ts: number; // timestamp

  // Verb fields
  psp?: string; // past stem perfective
  psf?: string; // past stem romanization
  prp?: string; // present stem
  prf?: string; // present romanization

  // Conjugation data
  conjugation?: {
    imperfective?: any;
    perfective?: any;
    participle?: any;
    modal?: any;
  };

  // Links
  l?: number; // linked entry (for compounds)
}

/**
 * Compute SHA256 checksum for drift detection
 */
function computeChecksum(data: any): string {
  const normalized = JSON.stringify(data, Object.keys(data).sort());
  return crypto.createHash('sha256').update(normalized).digest('hex').slice(0, 16);
}

/**
 * Pull word payload from LingDocs with caching
 */
async function pullWordPayload(wordId: number): Promise<{ data: LingDocsWordPayload; checksum: string } | null> {
  const url = `https://storage.lingdocs.com/dictionary/words/${wordId}.json`;
  const cacheDir = path.join(process.cwd(), 'app/data/lingdocs/words');
  const cachePath = path.join(cacheDir, `${wordId}.json`);

  try {
    // Try to fetch from LingDocs
    console.log(`📡 Fetching word ${wordId} from ${url}...`);
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    const checksum = computeChecksum(data);

    // Cache locally
    await fs.mkdir(cacheDir, { recursive: true });
    await fs.writeFile(cachePath, JSON.stringify({ data, checksum, fetchedAt: Date.now() }, null, 2));

    console.log(`✅ Fetched and cached word "${data.p}" (checksum: ${checksum})`);
    return { data, checksum };

  } catch (error) {
    console.warn(`⚠️  Fetch failed:`, error);

    // Try to use cached version
    try {
      const cached = JSON.parse(await fs.readFile(cachePath, 'utf-8'));
      console.log(`📦 Using cached version from ${new Date(cached.fetchedAt).toISOString()}`);
      return { data: cached.data, checksum: cached.checksum };
    } catch {
      console.error(`❌ No cache available for word ${wordId}`);
      return null;
    }
  }
}

// ============================================================================
// 2. Normalize Into D1 Tables
// ============================================================================

interface VerbLexiconRow {
  lemma: string;
  verb_type: 'dynamic_compound' | 'stative_compound' | 'simple';
  helper?: string;
  transitivity?: 'transitive' | 'intransitive';
  imperfective_stem?: string;
  perfective_stem?: string;
  lingdocs_id: number;
  source_checksum: string;
}

interface VerbFormRow {
  lemma: string;
  form: string;
  tense?: string;
  person?: string;
  voice?: string;
  gender?: string;
  helper?: string;
  confidence?: number;
  source_word_id: number;
}

interface InflectionReasonRow {
  pashto_form: string;
  base_word: string;
  reason_key: string;
  description: string;
  source_word_id: number;
}

interface WordCategoryRow {
  pashto_word: string;
  category_key: string;
  confidence: number;
}

/**
 * Extract verb metadata from LingDocs payload
 */
function extractVerbMetadata(payload: LingDocsWordPayload): VerbLexiconRow {
  const category = payload.c || '';

  let verbType: VerbLexiconRow['verb_type'] = 'simple';
  if (category.includes('dyn. comp.')) verbType = 'dynamic_compound';
  else if (category.includes('stat. comp.')) verbType = 'stative_compound';

  let transitivity: VerbLexiconRow['transitivity'] | undefined;
  if (category.includes('trans.') && !category.includes('intrans.')) transitivity = 'transitive';
  else if (category.includes('intrans.')) transitivity = 'intransitive';

  const checksum = computeChecksum(payload);

  return {
    lemma: payload.p,
    verb_type: verbType,
    helper: payload.conjugation?.imperfective?.['long']?.['1']?.[0]?.[0]?.['p'], // Extract helper if present
    transitivity,
    imperfective_stem: payload.prp,
    perfective_stem: payload.psp,
    lingdocs_id: payload.i,
    source_checksum: checksum,
  };
}

/**
 * Extract conjugated forms from LingDocs conjugation data
 */
function extractConjugatedForms(payload: LingDocsWordPayload): VerbFormRow[] {
  const forms: VerbFormRow[] = [];

  if (!payload.conjugation) {
    console.warn(`No conjugation data for "${payload.p}"`);
    return forms;
  }

  const { conjugation } = payload;

  // Helper to recursively extract forms
  const extractFromBlock = (
    block: any,
    context: { aspect?: string; tense?: string; person?: string; voice?: string }
  ): void => {
    if (!block) return;

    // Base case: Pashto string object
    if (typeof block === 'object' && block.p && typeof block.p === 'string') {
      forms.push({
        lemma: payload.p,
        form: block.p.trim(),
        tense: context.tense,
        person: context.person,
        voice: context.voice,
        source_word_id: payload.i,
        confidence: 1.0,
      });
      return;
    }

    // Handle arrays (person conjugations)
    if (Array.isArray(block)) {
      const personLabels = ['1sg', '2sg', '3sg', '1pl', '2pl', '3pl'];
      block.forEach((item, idx) => {
        extractFromBlock(item, { ...context, person: personLabels[idx] });
      });
      return;
    }

    // Handle objects (tense/aspect/voice nesting)
    if (typeof block === 'object') {
      for (const [key, value] of Object.entries(block)) {
        let newContext = { ...context };

        if (key === 'imperfective') newContext.aspect = 'imperfective';
        else if (key === 'perfective') newContext.aspect = 'perfective';
        else if (key === 'nonImperative') newContext.tense = 'non-imperative';
        else if (key === 'imperative') newContext.tense = 'imperative';
        else if (key === 'long') newContext.voice = 'long';
        else if (key === 'short') newContext.voice = 'short';

        extractFromBlock(value, newContext);
      }
    }
  };

  // Extract all conjugations
  extractFromBlock(conjugation, {});

  console.log(`📊 Extracted ${forms.length} conjugated forms from LingDocs`);
  return forms;
}

/**
 * Generate inflection reasons (for tooltips)
 */
function generateInflectionReasons(payload: LingDocsWordPayload, forms: VerbFormRow[]): InflectionReasonRow[] {
  const reasons: InflectionReasonRow[] = [];

  const metadata = extractVerbMetadata(payload);

  for (const form of forms) {
    let reasonKey = 'verb_conjugation';
    let description = `Conjugated form of ${payload.p}`;

    if (metadata.verb_type === 'dynamic_compound') {
      reasonKey = 'dynamic_compound';
      description = `Dynamic compound verb with helper ${metadata.helper}. ${form.tense || 'Form'} ${form.person || ''}`.trim();
    } else if (metadata.verb_type === 'stative_compound') {
      reasonKey = 'stative_compound';
      description = `Stative compound verb. ${form.tense || 'Form'} ${form.person || ''}`.trim();
    } else {
      description = `${form.tense || 'Form'} ${form.person || ''} conjugation`.trim();
    }

    reasons.push({
      pashto_form: form.form,
      base_word: payload.p,
      reason_key: reasonKey,
      description,
      source_word_id: payload.i,
    });
  }

  return reasons;
}

/**
 * Extract categories/tags from LingDocs data
 */
function extractCategories(payload: LingDocsWordPayload): WordCategoryRow[] {
  const categories: WordCategoryRow[] = [];

  // Parse category string (e.g., "v. dyn. comp. trans.")
  const categoryStr = payload.c || '';

  const tags: string[] = [];
  if (categoryStr.includes('trans.')) tags.push('transitive_verbs');
  if (categoryStr.includes('dyn.')) tags.push('dynamic_verbs');
  if (categoryStr.includes('comp.')) tags.push('compound_verbs');

  // Also check English definition for semantic tags
  const english = (payload.e || '').toLowerCase();
  if (english.includes('hit') || english.includes('strike')) tags.push('action');
  if (english.includes('violence') || english.includes('beat')) tags.push('violence');

  for (const tag of tags) {
    categories.push({
      pashto_word: payload.p,
      category_key: tag,
      confidence: 0.9,
    });
  }

  return categories;
}

/**
 * Ingest LingDocs word into D1 database
 */
async function ingestLingdocsWord(
  db: any,
  wordId: number,
  payload: LingDocsWordPayload,
  checksum: string
): Promise<void> {
  console.log(`\n📝 Ingesting "${payload.p}" into D1...`);

  // 1. Upsert into verbs_lexicon
  const metadata = extractVerbMetadata(payload);

  await db.prepare(`
    INSERT OR REPLACE INTO verbs_lexicon (
      pashto_word, verb_type, helper, transitivity,
      imperfective_stem, perfective_stem, romanization, english,
      source_word_id, source_checksum, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
  `).bind(
    metadata.lemma,
    metadata.verb_type,
    metadata.helper,
    metadata.transitivity,
    metadata.imperfective_stem,
    metadata.perfective_stem,
    payload.f,
    payload.e,
    metadata.lingdocs_id,
    metadata.source_checksum
  ).run();

  console.log(`  ✅ verbs_lexicon: ${metadata.verb_type} (helper: ${metadata.helper || 'none'})`);

  // 2. Insert verb_forms
  const forms = extractConjugatedForms(payload);

  // Delete existing forms
  await db.prepare(`DELETE FROM verb_forms WHERE base_verb = ? AND source_word_id = ?`)
    .bind(payload.p, wordId)
    .run();

  for (const form of forms) {
    await db.prepare(`
      INSERT INTO verb_forms (
        base_verb, form, form_type, tense, person, number, gender, aspect, source_word_id, source_checksum
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      form.lemma,
      form.form,
      form.voice, // Using 'voice' as 'form_type'
      form.tense,
      form.person?.match(/^\d/)?.[0], // Extract person number
      form.person?.match(/(sg|pl)$/)?.[0], // Extract number
      null, // gender
      null, // aspect
      form.source_word_id,
      checksum
    ).run();
  }

  console.log(`  ✅ verb_forms: ${forms.length} conjugations`);

  // 3. Insert inflection_reasons
  const reasons = generateInflectionReasons(payload, forms);

  await db.prepare(`DELETE FROM inflection_reasons WHERE base_word = ? AND source_word_id = ?`)
    .bind(payload.p, wordId)
    .run();

  for (const reason of reasons) {
    await db.prepare(`
      INSERT INTO inflection_reasons (
        pashto_form, base_word, inflection_type, grammatical_context, source_word_id
      ) VALUES (?, ?, ?, ?, ?)
    `).bind(
      reason.pashto_form,
      reason.base_word,
      reason.reason_key,
      reason.description,
      reason.source_word_id
    ).run();
  }

  console.log(`  ✅ inflection_reasons: ${reasons.length} explanations`);

  // 4. Insert word_category_mappings
  const categories = extractCategories(payload);

  for (const cat of categories) {
    await db.prepare(`
      INSERT OR REPLACE INTO word_category_mappings (
        pashto_word, category_key, confidence
      ) VALUES (?, ?, ?)
    `).bind(cat.pashto_word, cat.category_key, cat.confidence).run();
  }

  console.log(`  ✅ word_category_mappings: ${categories.length} tags`);
}

// ============================================================================
// 3. Verification and Drift Detection
// ============================================================================

/**
 * Verify LingDocs sync for a word
 */
async function verifyLingdocsSync(db: any, wordId: number): Promise<boolean> {
  console.log(`\n🔍 Verifying sync for word ${wordId}...`);

  // Fetch fresh from LingDocs
  const fresh = await pullWordPayload(wordId);
  if (!fresh) {
    console.error(`❌ Cannot fetch word ${wordId} from LingDocs`);
    return false;
  }

  const { data, checksum: freshChecksum } = fresh;

  // Get stored checksum from D1
  const stored = await db.prepare(`
    SELECT source_checksum
    FROM verbs_lexicon
    WHERE source_word_id = ?
    LIMIT 1
  `).bind(wordId).first();

  if (!stored) {
    console.log(`⚠️  Word ${wordId} not in D1. Needs initial import.`);
    return false;
  }

  const storedChecksum = stored.source_checksum;

  if (freshChecksum === storedChecksum) {
    console.log(`✅ In sync! Checksums match: ${freshChecksum}`);
    return true;
  } else {
    console.log(`❌ Drift detected!`);
    console.log(`   Stored:  ${storedChecksum}`);
    console.log(`   Fresh:   ${freshChecksum}`);
    console.log(`   LingDocs data has changed. Re-ingest recommended.`);
    return false;
  }
}

/**
 * Multi-source lookup example (for search integration)
 */
async function multiSourceLookup(db: any, variant: string, wordId: number) {
  console.log(`\n🔍 Multi-source lookup for: ${variant}`);

  // 1. Bible verses
  const verses = await db.prepare(`
    SELECT v.ref, v.text, v.book
    FROM word_verse_mapping wvm
    JOIN verses_afghan2023 v ON wvm.verse_ref = v.ref
    WHERE wvm.pashto_word = ?
    LIMIT 5
  `).bind(variant).all();

  console.log(`  📖 Verses: ${verses.results?.length || 0}`);

  // 2. Videos
  const videos = await db.prepare(`
    SELECT vwm.video_id, vwm.frequency, vt.video_title
    FROM video_word_mappings vwm
    JOIN video_transcripts vt ON vwm.video_id = vt.video_id
    WHERE vwm.pashto_word = ?
    LIMIT 5
  `).bind(variant).all();

  console.log(`  🎥 Videos: ${videos.results?.length || 0}`);

  // 3. Topics
  const topics = await db.prepare(`
    SELECT wc.category_name
    FROM word_category_mappings wcm
    JOIN word_categories wc ON wcm.category_key = wc.category_key
    WHERE wcm.pashto_word = ?
  `).bind(variant).all();

  console.log(`  🏷️  Topics: ${topics.results?.length || 0}`);

  return {
    verses: verses.results || [],
    videos: videos.results || [],
    topics: topics.results || [],
    source: { lingdocsId: wordId },
  };
}

// ============================================================================
// Main Execution
// ============================================================================

async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.error(`❌ Usage: npx tsx scripts/integrate-lingdocs-complete.ts <wordId>`);
    console.error(`   Or:     npx tsx scripts/integrate-lingdocs-complete.ts --batch <id1>,<id2>,...`);
    console.error(`\n   Examples:`);
    console.error(`     npx tsx scripts/integrate-lingdocs-complete.ts 1527815399`);
    console.error(`     npx tsx scripts/integrate-lingdocs-complete.ts --batch 1527815399,1527812507`);
    console.error(`     npx tsx scripts/integrate-lingdocs-complete.ts --verify 1527815399`);
    process.exit(1);
  }

  let wordIds: number[] = [];
  let verifyOnly = false;

  // Parse arguments
  if (args[0] === '--batch') {
    wordIds = args[1].split(',').map(id => parseInt(id.trim(), 10));
  } else if (args[0] === '--verify') {
    wordIds = [parseInt(args[1], 10)];
    verifyOnly = true;
  } else {
    wordIds = [parseInt(args[0], 10)];
  }

  console.log(`🚀 LingDocs Integration: ${wordIds.length} word(s)`);
  console.log(`   Mode: ${verifyOnly ? 'Verify Only' : 'Full Integration'}\n`);

  // Connect to D1
  const { getD1Database } = await import('../utils/d1');
  const db = getD1Database();

  if (!db) {
    console.error(`❌ D1 database not available`);
    process.exit(1);
  }

  // Process each word
  for (const wordId of wordIds) {
    console.log(`\n${'='.repeat(80)}`);
    console.log(`Processing word ID: ${wordId}`);
    console.log(`${'='.repeat(80)}`);

    if (verifyOnly) {
      // Just verify sync
      await verifyLingdocsSync(db, wordId);
    } else {
      // Full integration

      // 1. Pull from LingDocs
      const result = await pullWordPayload(wordId);
      if (!result) {
        console.error(`❌ Failed to fetch word ${wordId}`);
        continue;
      }

      const { data, checksum } = result;

      console.log(`\n📚 Word: "${data.p}" (${data.f})`);
      console.log(`   Category: ${data.c}`);
      console.log(`   English: ${data.e}`);
      console.log(`   Checksum: ${checksum}`);

      // 2. Ingest into D1
      await ingestLingdocsWord(db, wordId, data, checksum);

      // 3. Verify ingestion
      const inSync = await verifyLingdocsSync(db, wordId);

      // 4. Demo multi-source lookup
      const firstForm = data.p; // Use lemma as example
      await multiSourceLookup(db, firstForm, wordId);

      if (inSync) {
        console.log(`\n✅ Successfully integrated word ${wordId}!`);
      } else {
        console.log(`\n⚠️  Warning: Verification failed after ingestion`);
      }
    }
  }

  console.log(`\n${'='.repeat(80)}`);
  console.log(`✅ LingDocs Integration Complete!`);
  console.log(`${'='.repeat(80)}\n`);

  console.log(`📊 Next steps:`);
  console.log(`   1. Visualize conjugation:`);
  console.log(`      npx tsx scripts/visualize-conjugation.ts ${wordIds[0]}`);
  console.log(`\n   2. Test search integration:`);
  console.log(`      Use unifiedSearch() in your app with the ingested words`);
  console.log(`\n   3. View in LingDocs:`);
  console.log(`      https://dictionary.lingdocs.com/word?id=${wordIds[0]}`);
}

// Run
if (require.main === module) {
  main().catch(error => {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  });
}

export {
  pullWordPayload,
  computeChecksum,
  extractVerbMetadata,
  extractConjugatedForms,
  ingestLingdocsWord,
  verifyLingdocsSync,
  multiSourceLookup,
};
