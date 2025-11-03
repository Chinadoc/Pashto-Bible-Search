/**
 * Label Pattern 5 & 5.5 Noun Inflections in Word Frequency List
 * 
 * According to https://grammar.lingdocs.com/inflection/inflection-patterns/:
 * 
 * Pattern 5: Shorter words that squish
 * - These words compress the 1st masculine inflection and take just an ه - -u on the end
 * - Examples: غل (ghul/thief), خر (khur/donkey), مل (mal/companion), شين (sheen/green)
 * 
 * Inflections:
 * - Masculine Plain: base form (e.g., غل)
 * - Masculine 1st: base + ه (e.g., غله)
 * - Masculine 2nd: base + و (e.g., غلو)
 * - Feminine Plain: base + ه (e.g., غله)
 * - Feminine 1st: base + ي (e.g., غلي)
 * - Feminine 2nd: (typically empty)
 * 
 * Pattern 5.5: Extra half pattern - Inanimate feminine nouns ending in ي - ee
 * - Only works for inanimate feminine nouns ending in ي - ee
 * - Examples: آزادي (aazaadée/freedom), پاکوالي (paakwaalée/cleanliness)
 * 
 * Inflections (Feminine only):
 * - Plain: base form ending in ي (e.g., آزادي)
 * - 1st: base ending changes to ۍ (e.g., آزادي → آزادي)
 * - 2nd: base + یو (e.g., آزادیو)
 */

const { readFileSync, writeFileSync } = require('fs');
const { join } = require('path');

// Known Pattern 5 examples from grammar guide
const PATTERN5_EXAMPLES = ['غل', 'خر', 'مل', 'شين'];

// Known Pattern 5.5 examples from grammar guide
const PATTERN5_5_EXAMPLES = ['آزادي', 'پاکوالي'];

/**
 * Generate Pattern 5 inflections (short squish pattern)
 * Based on Python function: feminine 1st uses ې not ي
 */
function generatePattern5Inflections(baseWord) {
  return {
    plain_m: baseWord,
    inflection_1_m: baseWord + 'ه',
    inflection_2_m: baseWord + 'و',
    plain_f: baseWord + 'ه',
    inflection_1_f: baseWord + 'ې', // Uses ې not ي
    inflection_2_f: null, // Typically empty for Pattern 5
  };
}

/**
 * Generate Pattern 5.5 inflections (inanimate feminine nouns ending in ي - ee)
 */
function generatePattern5_5Inflections(baseWord) {
  // Remove final ي to get stem
  const stem = baseWord.endsWith('ي') ? baseWord.slice(0, -1) : baseWord;
  
  return {
    plain_f: baseWord, // Still ends in ي
    inflection_1_f: stem + 'ۍ', // Change ي to ۍ
    inflection_2_f: stem + 'یو', // Add یو
  };
}

/**
 * Main function to label Pattern 5 & 5.5 noun inflections
 */
async function labelPattern55Inflections() {
  console.log('🔍 Loading data files...\n');

  // Load dictionary
  const dictPath = join(process.cwd(), 'app/data/full_dictionary_enriched.json');
  const dictRaw = JSON.parse(readFileSync(dictPath, 'utf-8'));
  const dictionary = Array.isArray(dictRaw.entries) 
    ? dictRaw.entries 
    : (Array.isArray(dictRaw) ? dictRaw : []);

  console.log(`   Loaded ${dictionary.length} dictionary entries`);

  // Load frequency list
  const freqPath = join(process.cwd(), 'app/data/word_frequency_list.json');
  const frequencyData = JSON.parse(readFileSync(freqPath, 'utf-8'));
  console.log(`   Loaded ${frequencyData.length} frequency entries\n`);

  // Create frequency map for quick lookup (normalize ي/ی)
  const freqMap = new Map();
  const freqMapNormalized = new Map();
  for (const entry of frequencyData) {
    freqMap.set(entry.pashto, entry);
    // Normalize ي to ی for lookup
    const normalized = entry.pashto.replace(/ي/g, 'ی');
    if (normalized !== entry.pashto && !freqMapNormalized.has(normalized)) {
      freqMapNormalized.set(normalized, entry);
    }
  }

  // Find Pattern 5 & 5.5 nouns in dictionary
  console.log('🔍 Finding Pattern 5 & 5.5 nouns...\n');
  const pattern5Nouns = new Map();
  const pattern5_5Nouns = new Map();
  const pattern5ExampleSet = new Set(PATTERN5_EXAMPLES);
  const pattern5_5ExampleSet = new Set(PATTERN5_5_EXAMPLES);

  for (const entry of dictionary) {
    const pos = ((entry.c_norm || entry.c || '').toLowerCase());
    
    // Check if it's a noun or adjective
    if (!pos.includes('n') && !pos.includes('noun') && !pos.includes('adj')) {
      continue;
    }

    const pashto = entry.p || '';
    if (!pashto) continue;

    // Check pattern field first
    const pattern = entry.pattern || '';
    
    // Check if it's a known Pattern 5 example
    if (pattern5ExampleSet.has(pashto)) {
      const inflections = generatePattern5Inflections(pashto);
      pattern5Nouns.set(pashto, { entry, inflections });
      continue;
    }
    
    // Check if it's a known Pattern 5.5 example
    if (pattern5_5ExampleSet.has(pashto)) {
      const inflections = generatePattern5_5Inflections(pashto);
      pattern5_5Nouns.set(pashto, { entry, inflections });
      continue;
    }
    
    if (pattern === 'short_squish' || pattern === 'pattern5') {
      const inflections = generatePattern5Inflections(pashto);
      pattern5Nouns.set(pashto, { entry, inflections });
    } else if (pattern === 'fem_inanim_ee' || pattern === 'pattern5.5') {
      const inflections = generatePattern5_5Inflections(pashto);
      pattern5_5Nouns.set(pashto, { entry, inflections });
    } else if (pashto.endsWith('ي') && pos.includes('f') && pos.includes('inan')) {
      // Inanimate feminine nouns ending in ي might be Pattern 5.5
      const inflections = generatePattern5_5Inflections(pashto);
      pattern5_5Nouns.set(pashto, { entry, inflections });
    } else if (pashto.length <= 3 && !pashto.endsWith('ه') && !pashto.endsWith('ی')) {
      // Short words (3 chars or less) that don't end in ه or ی might be Pattern 5
      // This is a heuristic - may need refinement
      const inflections = generatePattern5Inflections(pashto);
      pattern5Nouns.set(pashto, { entry, inflections });
    }
  }

  console.log(`   Found ${pattern5Nouns.size} Pattern 5 nouns`);
  console.log(`   Found ${pattern5_5Nouns.size} Pattern 5.5 nouns\n`);

  // Now label frequency entries with inflection information
  console.log('🏷️  Labeling frequency entries...\n');
  let labeledCount = 0;
  let foundInFreqCount = 0;

  // Process Pattern 5
  for (const [baseWord, { entry, inflections }] of pattern5Nouns.entries()) {
    const formsToCheck = [
      { form: inflections.plain_m, label: 'masc_plain', base: baseWord, pattern: 'pattern5' },
      { form: inflections.inflection_1_m, label: 'masc_1st', base: baseWord, pattern: 'pattern5' },
      { form: inflections.inflection_2_m, label: 'masc_2nd', base: baseWord, pattern: 'pattern5' },
      { form: inflections.plain_f, label: 'fem_plain', base: baseWord, pattern: 'pattern5' },
      { form: inflections.inflection_1_f, label: 'fem_1st', base: baseWord, pattern: 'pattern5' },
      { form: inflections.inflection_2_f, label: 'fem_2nd', base: baseWord, pattern: 'pattern5' },
    ];

    for (const { form, label, base, pattern } of formsToCheck) {
      if (form) {
        // Check exact match first
        let freqEntry = freqMap.get(form);
        // If not found, try normalized version (ي -> ی)
        if (!freqEntry) {
          const normalizedForm = form.replace(/ي/g, 'ی');
          freqEntry = freqMap.get(normalizedForm) || freqMapNormalized.get(normalizedForm);
        }
        
        if (freqEntry) {
          // Only label if not already labeled OR if pattern is different (update pattern)
          const wasAlreadyLabeled = !!freqEntry.inflection_label;
          if (!freqEntry.inflection_label || freqEntry.pattern !== pattern) {
            freqEntry.inflection_label = label;
            freqEntry.base_word = base;
            freqEntry.pattern = pattern;
            if (!wasAlreadyLabeled) {
              labeledCount++;
            }
          }
          foundInFreqCount++;
        }
      }
    }
  }

  // Process Pattern 5.5 (feminine only)
  for (const [baseWord, { entry, inflections }] of pattern5_5Nouns.entries()) {
    const formsToCheck = [
      { form: inflections.plain_f, label: 'fem_plain', base: baseWord, pattern: 'pattern5.5' },
      { form: inflections.inflection_1_f, label: 'fem_1st', base: baseWord, pattern: 'pattern5.5' },
      { form: inflections.inflection_2_f, label: 'fem_2nd', base: baseWord, pattern: 'pattern5.5' },
    ];

    for (const { form, label, base, pattern } of formsToCheck) {
      if (form) {
        // Check exact match first
        let freqEntry = freqMap.get(form);
        // If not found, try normalized version (ي -> ی)
        if (!freqEntry) {
          const normalizedForm = form.replace(/ي/g, 'ی');
          freqEntry = freqMap.get(normalizedForm) || freqMapNormalized.get(normalizedForm);
        }
        
        if (freqEntry) {
          // Only label if not already labeled OR if pattern is different (update pattern)
          const wasAlreadyLabeled = !!freqEntry.inflection_label;
          if (!freqEntry.inflection_label || freqEntry.pattern !== pattern) {
            freqEntry.inflection_label = label;
            freqEntry.base_word = base;
            freqEntry.pattern = pattern;
            if (!wasAlreadyLabeled) {
              labeledCount++;
            }
          }
          foundInFreqCount++;
        }
      }
    }
  }

  console.log(`   Labeled ${labeledCount} frequency entries`);
  console.log(`   Found ${foundInFreqCount} inflected forms in frequency list\n`);

  // Save updated frequency list
  const outputPath = join(process.cwd(), 'app/data/word_frequency_list.json');
  writeFileSync(outputPath, JSON.stringify(frequencyData, null, 2), 'utf-8');
  console.log(`✅ Saved labeled frequency list to ${outputPath}\n`);

  // Generate summary report
  const summary = {
    pattern5_nouns_found: pattern5Nouns.size,
    pattern5_5_nouns_found: pattern5_5Nouns.size,
    frequency_entries_labeled: labeledCount,
    inflected_forms_found: foundInFreqCount,
    labeled_by_type: {
      pattern5_masc_plain: frequencyData.filter(e => e.pattern === 'pattern5' && e.inflection_label === 'masc_plain').length,
      pattern5_masc_1st: frequencyData.filter(e => e.pattern === 'pattern5' && e.inflection_label === 'masc_1st').length,
      pattern5_masc_2nd: frequencyData.filter(e => e.pattern === 'pattern5' && e.inflection_label === 'masc_2nd').length,
      pattern5_fem_plain: frequencyData.filter(e => e.pattern === 'pattern5' && e.inflection_label === 'fem_plain').length,
      pattern5_fem_1st: frequencyData.filter(e => e.pattern === 'pattern5' && e.inflection_label === 'fem_1st').length,
      pattern5_fem_2nd: frequencyData.filter(e => e.pattern === 'pattern5' && e.inflection_label === 'fem_2nd').length,
      pattern5_5_fem_plain: frequencyData.filter(e => e.pattern === 'pattern5.5' && e.inflection_label === 'fem_plain').length,
      pattern5_5_fem_1st: frequencyData.filter(e => e.pattern === 'pattern5.5' && e.inflection_label === 'fem_1st').length,
      pattern5_5_fem_2nd: frequencyData.filter(e => e.pattern === 'pattern5.5' && e.inflection_label === 'fem_2nd').length,
    }
  };

  console.log('📊 Summary:');
  console.log(JSON.stringify(summary, null, 2));
}

// Run the script
labelPattern55Inflections().catch(console.error);

