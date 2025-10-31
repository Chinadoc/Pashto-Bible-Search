#!/usr/bin/env node
/**
 * Simplified Topics Curation Script
 * Targets 100 unique words per category with maximum diversity
 * Uses existing curated entries but ensures 100 unique words per category
 */

const { execSync } = require('child_process');

// Get all current curated entries and reorganize to ensure 100 unique words per category
async function reorganizeTo100UniqueWords() {
  console.log('🚀 Reorganizing Topics to Target 100 Unique Words per Category\n');
  console.log('='.repeat(70));

  try {
    // Get all current category-verse mappings
    console.log('📊 Fetching current category-verse mappings...\n');
    
    const query = `
      SELECT
        cvm.category_key,
        cvm.pashto_word,
        cvm.verse_id,
        cvm.verse_ref,
        cvm.translation_key,
        cvm.testament,
        cvm.book,
        cvm.chapter,
        cvm.verse,
        wf.english_translation,
        wf.romanization
      FROM category_verse_mappings cvm
      LEFT JOIN word_frequencies wf ON cvm.pashto_word = wf.pashto_word
      ORDER BY cvm.category_key, cvm.pashto_word, cvm.verse_ref
    `;

    const result = execSync(
      `npx wrangler d1 execute pashto-bible-db --remote --command="${query.replace(/"/g, '\\"')}" --json`,
      { encoding: 'utf8', maxBuffer: 50 * 1024 * 1024 }
    );

    if (!result || result.trim().length === 0) {
      throw new Error('Empty response from database');
    }

    let data;
    try {
      data = JSON.parse(result);
    } catch (e) {
      console.error('Failed to parse JSON:', result.substring(0, 500));
      throw e;
    }

    const allMappings = Array.isArray(data) ? data[0]?.results || [] : data.results || [];

    console.log(`📊 Found ${allMappings.length} total mappings\n`);

    // Group by category, then by word
    const categoryMap = new Map();
    for (const mapping of allMappings) {
      if (!categoryMap.has(mapping.category_key)) {
        categoryMap.set(mapping.category_key, new Map());
      }
      const wordMap = categoryMap.get(mapping.category_key);
      if (!wordMap.has(mapping.pashto_word)) {
        wordMap.set(mapping.pashto_word, []);
      }
      wordMap.get(mapping.pashto_word).push(mapping);
    }

    console.log(`📊 Processing ${categoryMap.size} categories...\n`);

    // Select top 100 unique words per category (1-2 verses each)
    const curated = [];
    for (const [categoryKey, wordMap] of categoryMap) {
      const words = Array.from(wordMap.entries())
        .map(([word, entries]) => ({
          word,
          entries: entries.slice(0, 2) // Max 2 verses per word
        }))
        .slice(0, 100); // Top 100 unique words

      console.log(`📝 ${categoryKey}: ${words.length} unique words (${words.reduce((sum, w) => sum + w.entries.length, 0)} entries)`);

      for (const { word, entries } of words) {
        for (const entry of entries) {
          curated.push({
            category_key: categoryKey,
            pashto_word: word,
            verse_id: entry.verse_id,
            verse_ref: entry.verse_ref,
            translation_key: entry.translation_key,
            testament: entry.testament,
            book: entry.book,
            chapter: entry.chapter,
            verse: entry.verse
          });
        }
      }
    }

    // Generate SQL
    console.log('\n📝 Generating cleanup SQL...\n');
    
    const categories = Array.from(categoryMap.keys());
    let sql = '-- =========================================\n';
    sql += '-- CURATED TOPICS ENTRIES - 100 UNIQUE WORDS PER CATEGORY\n';
    sql += '-- Generated: ' + new Date().toISOString() + '\n';
    sql += '-- =========================================\n\n';

    sql += '-- Clear existing mappings for curated categories\n';
    sql += `DELETE FROM category_verse_mappings WHERE category_key IN (${categories.map(c => `'${c}'`).join(', ')});\n\n`;

    sql += '-- Insert curated entries (100 unique words per category, 1-2 verses each)\n';
    
    const byCategory = new Map();
    for (const entry of curated) {
      if (!byCategory.has(entry.category_key)) {
        byCategory.set(entry.category_key, []);
      }
      byCategory.get(entry.category_key).push(entry);
    }

    for (const [categoryKey, entries] of byCategory) {
      const uniqueWords = new Set(entries.map(e => e.pashto_word)).size;
      sql += `-- ${categoryKey} (${uniqueWords} unique words, ${entries.length} entries)\n`;
      sql += 'INSERT INTO category_verse_mappings (\n';
      sql += '  category_key, pashto_word, verse_id, verse_ref, translation_key, testament, book, chapter, verse\n';
      sql += ') VALUES\n';

      const values = entries.map(entry =>
        `('${entry.category_key}', '${entry.pashto_word.replace(/'/g, "''")}', ${entry.verse_id}, '${entry.verse_ref}', '${entry.translation_key}', '${entry.testament}', '${entry.book}', ${entry.chapter}, ${entry.verse})`
      );

      sql += values.join(',\n') + ';\n\n';
    }

    const sqlFilename = `curated_topics_100_words_${new Date().toISOString().split('T')[0]}.sql`;
    require('fs').writeFileSync(sqlFilename, sql);

    console.log('='.repeat(70));
    console.log('📊 REORGANIZATION SUMMARY:');
    console.log(`  Total entries: ${curated.length}`);
    const totalUniqueWords = new Set(curated.map(e => e.pashto_word)).size;
    console.log(`  Total unique words: ${totalUniqueWords}`);
    console.log(`  Categories: ${categories.length}`);
    console.log(`  SQL file: ${sqlFilename}`);
    console.log('='.repeat(70));

    console.log('\n✅ Reorganization completed!');
    console.log(`\n🎯 Next step: Execute ${sqlFilename} to apply changes.`);

    return sqlFilename;
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    throw error;
  }
}

if (require.main === module) {
  reorganizeTo100UniqueWords()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

module.exports = { reorganizeTo100UniqueWords };
