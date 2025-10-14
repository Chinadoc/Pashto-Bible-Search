#!/usr/bin/env node
/**
 * Generate comprehensive LingDocs inflection cache
 *
 * This script uses the actual LingDocs library to generate verb conjugations
 * and noun inflections for all words in the dictionary, creating a cache
 * that matches the official LingDocs output exactly.
 */

const fs = require('fs');
const path = require('path');

// Import the real LingDocs library
const lingdocsPath = path.join(__dirname, 'pashto-inflector/src/lib/dist/lib/library.cjs');
const lingdocs = require(lingdocsPath);

// Import dictionary data
async function loadDictionary() {
  // Load dictionary data directly from JSON files
  const dictionaryPath = path.join(__dirname, 'app/data/full_dictionary_enriched.json');
  const dictionaryData = JSON.parse(fs.readFileSync(dictionaryPath, 'utf8'));
  const dictionary = dictionaryData.entries;

  // Create maps for lookup
  const dictionaryByPashto = new Map();
  dictionary.forEach((entry, index) => {
    if (entry.p) {
      dictionaryByPashto.set(entry.p, {
        ...entry,
        i: index + 1,
        ts: Date.now(),
        // Ensure required fields
        p: entry.p,
        f: entry.f || entry.p,
        g: entry.g || entry.p,
        e: entry.e || '',
        c: entry.c || 'unknown'
      });
    }
  });

  return { dictionary, dictionaryByPashto };
}

function isVerbEntry(entry) {
  const pos = (entry.pos || entry.c || '').toLowerCase();
  return pos.includes('verb') || pos.includes('v.');
}

function isNounEntry(entry) {
  const pos = (entry.pos || entry.c || '').toLowerCase();
  return pos.includes('noun') || pos.includes('n.');
}

function isAdjectiveEntry(entry) {
  const pos = (entry.pos || entry.c || '').toLowerCase();
  return pos.includes('adjective') || pos.includes('adj.');
}

/**
 * Recursively extract forms from LingDocs nested structure
 */
function extractFormsFromLingDocs(obj, forms = []) {
  if (!obj) return forms;

  if (Array.isArray(obj)) {
    obj.forEach(item => extractFormsFromLingDocs(item, forms));
  } else if (typeof obj === 'object' && obj.p && obj.f) {
    // This is a form object with p (pashto) and f (phonetics)
    forms.push({
      form: obj.p,
      romanization: obj.f || obj.p,
      category: 'verb'
    });
  } else if (typeof obj === 'object') {
    // Recursively search nested objects
    Object.values(obj).forEach(value => extractFormsFromLingDocs(value, forms));
  }

  return forms;
}

/**
 * Convert LingDocs conjugation output to our cache format
 */
function lingDocsConjugationToCacheForms(conjugation, baseForm) {
  const forms = [];

  // Add base form
  forms.push({
    form: baseForm,
    romanization: baseForm, // Will be overridden if we find phonetics
    category: 'verb'
  });

  // Extract all forms from the conjugation structure
  if (conjugation.imperfective) {
    extractFormsFromLingDocs(conjugation.imperfective, forms);
  }

  if (conjugation.perfective) {
    extractFormsFromLingDocs(conjugation.perfective, forms);
  }

  if (conjugation.participle) {
    extractFormsFromLingDocs(conjugation.participle, forms);
  }

  if (conjugation.perfect) {
    extractFormsFromLingDocs(conjugation.perfect, forms);
  }

  if (conjugation.modal) {
    extractFormsFromLingDocs(conjugation.modal, forms);
  }

  if (conjugation.hypothetical) {
    extractFormsFromLingDocs(conjugation.hypothetical, forms);
  }

  if (conjugation.passive) {
    extractFormsFromLingDocs(conjugation.passive, forms);
  }

  return forms;
}

/**
 * Convert LingDocs inflection output to our cache format
 */
function lingDocsInflectionToCacheForms(inflection, baseForm) {
  const forms = [];

  // Add base form
  forms.push({
    form: baseForm,
    romanization: baseForm,
    category: 'noun'
  });

  // Extract all forms from the inflection structure
  extractFormsFromLingDocs(inflection, forms);

  return forms;
}

/**
 * Generate comprehensive cache using real LingDocs
 */
async function generateLingDocsCache() {
  console.log('🚀 Generating LingDocs inflection cache...');

  const { dictionary, dictionaryByPashto } = await loadDictionary();
  const cache = {};

  let processedCount = 0;
  let successCount = 0;
  let errorCount = 0;

  for (const [pashtoWord, entry] of dictionaryByPashto.entries()) {
    processedCount++;
    if (processedCount % 100 === 0) {
      console.log(`📊 Processed ${processedCount} words...`);
    }

    try {
      if (isVerbEntry(entry)) {
        // Generate verb conjugations
        const conjugation = lingdocs.conjugateVerb(entry);
        if (conjugation) {
          const forms = lingDocsConjugationToCacheForms(conjugation, pashtoWord);
          if (forms.length > 0) {
            cache[pashtoWord] = forms;
            successCount++;
          }
        }
      } else if (isNounEntry(entry) || isAdjectiveEntry(entry)) {
        // Generate noun/adjective inflections
        const inflection = lingdocs.inflectWord(entry);
        if (inflection) {
          const forms = lingDocsInflectionToCacheForms(inflection, pashtoWord);
          if (forms.length > 0) {
            cache[pashtoWord] = forms;
            successCount++;
          }
        }
      }
    } catch (error) {
      errorCount++;
      console.warn(`❌ Failed to process "${pashtoWord}":`, error.message);
    }
  }

  console.log(`\n📈 Generation complete:`);
  console.log(`   Processed: ${processedCount} words`);
  console.log(`   Success: ${successCount} words`);
  console.log(`   Errors: ${errorCount} words`);
  console.log(`   Coverage: ${((successCount / processedCount) * 100).toFixed(1)}%`);

  return cache;
}

/**
 * Save cache to file
 */
function saveCache(cache) {
  const cachePath = path.join(__dirname, 'app/data/inflections_cache.json');

  // Create backup of existing cache
  if (fs.existsSync(cachePath)) {
    const backupPath = cachePath + '.backup';
    fs.copyFileSync(cachePath, backupPath);
    console.log(`💾 Created backup: ${backupPath}`);
  }

  // Write new cache
  fs.writeFileSync(cachePath, JSON.stringify(cache, null, 2));
  console.log(`💾 Saved new cache with ${Object.keys(cache).length} entries`);
}

/**
 * Main execution
 */
async function main() {
  try {
    console.log('🎯 Starting LingDocs cache generation...\n');

    const cache = await generateLingDocsCache();
    saveCache(cache);

    console.log('\n✅ LingDocs cache generation complete!');
    console.log('🎉 Your app now has real LingDocs inflection data');

  } catch (error) {
    console.error('❌ Cache generation failed:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { generateLingDocsCache, saveCache };
