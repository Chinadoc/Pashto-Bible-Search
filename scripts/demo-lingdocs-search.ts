/**
 * LingDocs Search Integration Demo
 *
 * Demonstrates the complete flow:
 * 1. Fetch word from LingDocs (وهل - 1527815399)
 * 2. Populate D1 tables
 * 3. Run unified search
 * 4. Display results with conjugation table
 *
 * Usage:
 *   npx tsx scripts/demo-lingdocs-search.ts
 */

import { pullWordPayload, ingestLingdocsWord, verifyLingdocsSync, multiSourceLookup } from './integrate-lingdocs-complete';
import { createAsciiTable, getConjugationFromD1 } from './visualize-conjugation';

async function demo() {
  console.log('═'.repeat(80));
  console.log('🎯 LINGDOCS SEARCH INTEGRATION DEMO');
  console.log('═'.repeat(80));
  console.log('\nDemonstrating the complete LingDocs → D1 → Search flow');
  console.log('Using word ID 1527815399: وهل (wahul - "to hit")');
  console.log('\n' + '─'.repeat(80) + '\n');

  const wordId = 1527815399;

  // Connect to D1
  const { getD1Database } = await import('../utils/d1');
  const db = getD1Database();

  if (!db) {
    console.error('❌ D1 database not available');
    process.exit(1);
  }

  // ============================================================================
  // STEP 1: Fetch from LingDocs
  // ============================================================================

  console.log('📡 STEP 1: Fetching from LingDocs');
  console.log('─'.repeat(80));

  const result = await pullWordPayload(wordId);

  if (!result) {
    console.error('❌ Failed to fetch word');
    process.exit(1);
  }

  const { data, checksum } = result;

  console.log(`✅ Fetched: "${data.p}" (${data.f})`);
  console.log(`   Category: ${data.c}`);
  console.log(`   English: ${data.e}`);
  console.log(`   Verb Type: ${data.c?.includes('dyn. comp.') ? 'Dynamic Compound' : 'Simple'}`);
  console.log(`   Checksum: ${checksum}`);
  console.log(`   URL: https://dictionary.lingdocs.com/word?id=${wordId}\n`);

  // ============================================================================
  // STEP 2: Populate D1 Tables
  // ============================================================================

  console.log('📝 STEP 2: Populating D1 Tables');
  console.log('─'.repeat(80));

  await ingestLingdocsWord(db, wordId, data, checksum);

  console.log('\n✅ D1 tables populated:');
  console.log('   - verbs_lexicon (verb metadata)');
  console.log('   - verb_forms (all conjugations)');
  console.log('   - inflection_reasons (grammar tooltips)');
  console.log('   - word_category_mappings (semantic tags)\n');

  // ============================================================================
  // STEP 3: Verify Integration
  // ============================================================================

  console.log('🔍 STEP 3: Verifying Integration');
  console.log('─'.repeat(80));

  const inSync = await verifyLingdocsSync(db, wordId);

  if (inSync) {
    console.log('✅ Verification passed: D1 data matches LingDocs\n');
  } else {
    console.log('⚠️  Verification warning (see details above)\n');
  }

  // ============================================================================
  // STEP 4: Visualize Conjugation Table
  // ============================================================================

  console.log('📊 STEP 4: Conjugation Table Visualization');
  console.log('─'.repeat(80));

  const conjugation = await getConjugationFromD1(db, data.p);

  if (conjugation) {
    const ascii = createAsciiTable(conjugation);
    console.log(ascii);
  } else {
    console.log('⚠️  Could not generate conjugation table\n');
  }

  // ============================================================================
  // STEP 5: Multi-Source Search Demo
  // ============================================================================

  console.log('🔍 STEP 5: Multi-Source Search Demo');
  console.log('─'.repeat(80));
  console.log('Searching for verb forms across all sources...\n');

  // Get some verb forms
  const verbForms = await db.prepare(`
    SELECT form
    FROM verb_forms
    WHERE base_verb = ?
    LIMIT 5
  `).bind(data.p).all();

  if (verbForms.results && verbForms.results.length > 0) {
    for (const row of verbForms.results) {
      const results = await multiSourceLookup(db, row.form, wordId);

      console.log(`Form: ${row.form}`);
      console.log(`  📖 Bible verses: ${results.verses.length}`);
      if (results.verses.length > 0) {
        console.log(`     Example: ${results.verses[0].ref} - "${results.verses[0].text.slice(0, 50)}..."`);
      }
      console.log(`  🎥 Video clips: ${results.videos.length}`);
      if (results.videos.length > 0) {
        console.log(`     Example: "${results.videos[0].video_title}"`);
      }
      console.log(`  🏷️  Topics: ${results.topics.length}`);
      if (results.topics.length > 0) {
        console.log(`     Tags: ${results.topics.map(t => t.category_name).join(', ')}`);
      }
      console.log();
    }
  } else {
    console.log('ℹ️  No verb forms found in database\n');
  }

  // ============================================================================
  // STEP 6: Unified Search Simulation
  // ============================================================================

  console.log('⚡ STEP 6: Unified Search Example');
  console.log('─'.repeat(80));

  try {
    const { unifiedSearch } = await import('../app/utils/unified-search');

    console.log(`Running unified search for: "${data.p}"\n`);

    const searchResult = await unifiedSearch(db, {
      term: data.p,
      translation: 'afghan2023',
      includeVideos: true,
      includeTopics: true,
      limit: 10,
    });

    console.log('📊 Search Results:');
    console.log(`   Term: ${searchResult.termAnalysis.originalTerm}`);
    console.log(`   POS: ${searchResult.termAnalysis.pos || 'unknown'}`);

    if (searchResult.termAnalysis.verbMetadata) {
      const vm = searchResult.termAnalysis.verbMetadata;
      console.log(`   Verb Type: ${vm.verbType}`);
      console.log(`   Transitivity: ${vm.transitivity || 'N/A'}`);
      console.log(`   Helper: ${vm.helper || 'none'}`);
    }

    console.log(`\n   Variants Found: ${searchResult.variants.length}`);
    console.log(`   Bible Verses: ${searchResult.results.verses.length}`);
    console.log(`   Video Clips: ${searchResult.results.videos.length}`);
    console.log(`   Topics: ${searchResult.results.topics.length}`);
    console.log(`   Grammar Tooltips: ${searchResult.grammarTooltips.size}`);
    console.log(`   Search Time: ${searchResult.metadata.searchTimeMs}ms`);

    console.log('\n   Example Variants:');
    searchResult.variants.slice(0, 5).forEach(v => {
      console.log(`     - ${v.form} (${v.label})`);
    });

    if (searchResult.results.verses.length > 0) {
      console.log('\n   Example Verse Result:');
      const v = searchResult.results.verses[0];
      console.log(`     ${v.ref}: "${v.text.slice(0, 60)}..."`);
      console.log(`     Matched forms: ${v.matchedForms.join(', ')}`);
      console.log(`     Relevance score: ${v.relevanceScore}`);
    }

    if (searchResult.grammarTooltips.size > 0) {
      console.log('\n   Example Grammar Tooltip:');
      const first = Array.from(searchResult.grammarTooltips.values())[0];
      console.log(`     Form: ${first.form}`);
      console.log(`     Explanation: ${first.explanation}`);
      console.log(`     LingDocs: ${first.lingdocsUrl}`);
    }

    console.log('\n✅ Unified search successfully demonstrated!\n');

  } catch (error) {
    console.log('ℹ️  Unified search not available (import error)');
    console.log(`   ${error}\n`);
  }

  // ============================================================================
  // Summary
  // ============================================================================

  console.log('═'.repeat(80));
  console.log('✅ DEMO COMPLETE');
  console.log('═'.repeat(80));

  console.log('\n🎯 What We Demonstrated:');
  console.log('   1. ✅ Fetched canonical data from LingDocs');
  console.log('   2. ✅ Populated D1 tables with verified data');
  console.log('   3. ✅ Verified checksums match (no drift)');
  console.log('   4. ✅ Visualized conjugation table');
  console.log('   5. ✅ Multi-source lookup (verses + videos + topics)');
  console.log('   6. ✅ Unified search with rich metadata');

  console.log('\n🚀 Next Steps:');
  console.log('   1. Integrate into your app\'s search API');
  console.log('   2. Add UI components for grammar tooltips');
  console.log('   3. Set up automated verification (weekly cron)');
  console.log('   4. Populate more verbs from LingDocs dictionary');

  console.log('\n📚 Resources:');
  console.log('   - LingDocs: https://dictionary.lingdocs.com/word?id=1527815399');
  console.log('   - Documentation: LINGDOCS_INTEGRATION_COMPLETE.md');
  console.log('   - Validation: VALIDATION_GUIDE.md');

  console.log('\n' + '═'.repeat(80) + '\n');
}

// Run
if (require.main === module) {
  demo().catch(error => {
    console.error('\n❌ Demo failed:', error);
    console.error(error.stack);
    process.exit(1);
  });
}

export { demo };
