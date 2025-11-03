/**
 * Label Pattern 2 & 3 Noun Inflections in Word Frequency List
 * 
 * According to https://grammar.lingdocs.com/inflection/inflection-patterns/:
 * 
 * Pattern 2: Words ending in an unstressed ی - ay
 * - Masculine Plain: ends in ی
 * - Masculine 1st: ends in ي  
 * - Masculine 2nd: ends in یو
 * - Feminine Plain: ends in ې
 * - Feminine 1st: ends in ې (same as plain)
 * - Feminine 2nd: (empty/variant)
 * 
 * Pattern 3: Words ending in a stressed ي - áy
 * - Masculine Plain: ends in ی
 * - Masculine 1st: ends in ي
 * - Masculine 2nd: ends in یو
 * - Feminine Plain: ends in ۍ
 * - Feminine 1st: ends in ۍ (same as plain)
 * - Feminine 2nd: (empty/variant)
 */

const { readFileSync, writeFileSync } = require('fs');
const { join } = require('path');

/**
 * Check if a word ends in unstressed ی (Pattern 2)
 * Heuristic: If it ends in ی and is not in stressed_ay pattern list
 */
function endsInUnstressedY(word) {
  return word.endsWith('ی') && !word.endsWith('ۍ');
}

/**
 * Check if a word ends in stressed ی (Pattern 3)
 * This is harder to detect - we'll rely on dictionary pattern field or romanization
 */
function endsInStressedAy(word, entry) {
  // Check if entry has pattern field
  if (entry && (entry.pattern === 'stressed_ay' || entry.pattern === 'pattern3')) {
    return true;
  }
  // Check romanization for stressed áy pattern
  const rom = (entry?.g || entry?.f || '').toLowerCase();
  // Look for stressed áy patterns: áy, Ay, áY, etc.
  if (rom.includes('áy') || rom.includes('ay') && (rom.includes('á') || rom.includes('Á'))) {
    // Additional check: stressed áy usually appears at end of word
    const romLower = rom.toLowerCase();
    if (romLower.endsWith('ay') || romLower.endsWith('áy') || romLower.endsWith('áy')) {
      return true;
    }
  }
  // Common Pattern 3 examples from grammar guide
  const pattern3Examples = ['لومړی', 'بېړنی', 'بریالی', 'زلمی'];
  if (pattern3Examples.includes(word)) {
    return true;
  }
  return false;
}

/**
 * Generate Pattern 2 inflections (unstressed ی)
 */
function generatePattern2Inflections(baseWord) {
  // Remove final ی to get stem
  const stem = baseWord.endsWith('ی') ? baseWord.slice(0, -1) : baseWord;
  
  return {
    plain_m: stem + 'ی',
    inflection_1_m: stem + 'ي',
    inflection_2_m: stem + 'یو',
    plain_f: stem + 'ې',
    inflection_1_f: stem + 'ې', // Same as plain
    inflection_2_f: null, // Typically empty for Pattern 2
  };
}

/**
 * Generate Pattern 3 inflections (stressed ي - áy)
 */
function generatePattern3Inflections(baseWord) {
  // Remove final ی to get stem
  const stem = baseWord.endsWith('ی') ? baseWord.slice(0, -1) : baseWord;
  
  return {
    plain_m: stem + 'ی',
    inflection_1_m: stem + 'ي',
    inflection_2_m: stem + 'یو',
    plain_f: stem + 'ۍ',
    inflection_1_f: stem + 'ۍ', // Same as plain
    inflection_2_f: null, // Typically empty for Pattern 3
  };
}

/**
 * Main function to label Pattern 2 & 3 noun inflections
 */
async function labelPattern23Inflections() {
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
  const freqMapNormalized = new Map(); // Also create normalized map for ي/ی variants
  for (const entry of frequencyData) {
    freqMap.set(entry.pashto, entry);
    // Normalize ي to ی for lookup
    const normalized = entry.pashto.replace(/ي/g, 'ی');
    if (normalized !== entry.pashto && !freqMapNormalized.has(normalized)) {
      freqMapNormalized.set(normalized, entry);
    }
  }

  // Find Pattern 2 & 3 nouns in dictionary
  console.log('🔍 Finding Pattern 2 & 3 nouns...\n');
  const pattern2Nouns = new Map();
  const pattern3Nouns = new Map();

  // Common Pattern 3 examples from grammar guide
  const pattern3Examples = ['لومړی', 'بېړنی', 'بریالی', 'زلمی'];
  const pattern3ExampleSet = new Set(pattern3Examples);

  for (const entry of dictionary) {
    const pos = ((entry.c_norm || entry.c || '').toLowerCase());
    
    // Check if it's a noun or adjective
    if (!pos.includes('n') && !pos.includes('noun') && !pos.includes('adj')) {
      continue;
    }

    const pashto = entry.p || '';
    if (!pashto || !pashto.endsWith('ی')) continue;

    // Check pattern field first
    const pattern = entry.pattern || '';
    
    // Check if it's a known Pattern 3 example
    if (pattern3ExampleSet.has(pashto)) {
      const inflections = generatePattern3Inflections(pashto);
      pattern3Nouns.set(pashto, { entry, inflections });
      continue;
    }
    
    if (pattern === 'unstressed_y' || pattern === 'pattern2') {
      const inflections = generatePattern2Inflections(pashto);
      pattern2Nouns.set(pashto, { entry, inflections });
    } else if (pattern === 'stressed_ay' || pattern === 'pattern3') {
      const inflections = generatePattern3Inflections(pashto);
      pattern3Nouns.set(pashto, { entry, inflections });
    } else if (endsInStressedAy(pashto, entry)) {
      // Detected via romanization
      const inflections = generatePattern3Inflections(pashto);
      pattern3Nouns.set(pashto, { entry, inflections });
    } else if (endsInUnstressedY(pashto)) {
      // Default to Pattern 2 if ends in ی and no pattern specified
      const inflections = generatePattern2Inflections(pashto);
      pattern2Nouns.set(pashto, { entry, inflections });
    }
  }

  console.log(`   Found ${pattern2Nouns.size} Pattern 2 nouns`);
  console.log(`   Found ${pattern3Nouns.size} Pattern 3 nouns\n`);

  // Now label frequency entries with inflection information
  console.log('🏷️  Labeling frequency entries...\n');
  let labeledCount = 0;
  let foundInFreqCount = 0;

  // Process Pattern 2
  for (const [baseWord, { entry, inflections }] of pattern2Nouns.entries()) {
    const formsToCheck = [
      { form: inflections.plain_m, label: 'masc_plain', base: baseWord, pattern: 'pattern2' },
      { form: inflections.inflection_1_m, label: 'masc_1st', base: baseWord, pattern: 'pattern2' },
      { form: inflections.inflection_2_m, label: 'masc_2nd', base: baseWord, pattern: 'pattern2' },
      { form: inflections.plain_f, label: 'fem_plain', base: baseWord, pattern: 'pattern2' },
      { form: inflections.inflection_1_f, label: 'fem_1st', base: baseWord, pattern: 'pattern2' },
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

  // Process Pattern 3
  for (const [baseWord, { entry, inflections }] of pattern3Nouns.entries()) {
    const formsToCheck = [
      { form: inflections.plain_m, label: 'masc_plain', base: baseWord, pattern: 'pattern3' },
      { form: inflections.inflection_1_m, label: 'masc_1st', base: baseWord, pattern: 'pattern3' },
      { form: inflections.inflection_2_m, label: 'masc_2nd', base: baseWord, pattern: 'pattern3' },
      { form: inflections.plain_f, label: 'fem_plain', base: baseWord, pattern: 'pattern3' },
      { form: inflections.inflection_1_f, label: 'fem_1st', base: baseWord, pattern: 'pattern3' },
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
    pattern2_nouns_found: pattern2Nouns.size,
    pattern3_nouns_found: pattern3Nouns.size,
    frequency_entries_labeled: labeledCount,
    inflected_forms_found: foundInFreqCount,
    labeled_by_type: {
      pattern2_masc_plain: frequencyData.filter(e => e.pattern === 'pattern2' && e.inflection_label === 'masc_plain').length,
      pattern2_masc_1st: frequencyData.filter(e => e.pattern === 'pattern2' && e.inflection_label === 'masc_1st').length,
      pattern2_masc_2nd: frequencyData.filter(e => e.pattern === 'pattern2' && e.inflection_label === 'masc_2nd').length,
      pattern2_fem_plain: frequencyData.filter(e => e.pattern === 'pattern2' && e.inflection_label === 'fem_plain').length,
      pattern2_fem_1st: frequencyData.filter(e => e.pattern === 'pattern2' && e.inflection_label === 'fem_1st').length,
      pattern3_masc_plain: frequencyData.filter(e => e.pattern === 'pattern3' && e.inflection_label === 'masc_plain').length,
      pattern3_masc_1st: frequencyData.filter(e => e.pattern === 'pattern3' && e.inflection_label === 'masc_1st').length,
      pattern3_masc_2nd: frequencyData.filter(e => e.pattern === 'pattern3' && e.inflection_label === 'masc_2nd').length,
      pattern3_fem_plain: frequencyData.filter(e => e.pattern === 'pattern3' && e.inflection_label === 'fem_plain').length,
      pattern3_fem_1st: frequencyData.filter(e => e.pattern === 'pattern3' && e.inflection_label === 'fem_1st').length,
    }
  };

  console.log('📊 Summary:');
  console.log(JSON.stringify(summary, null, 2));
}

// Run the script
labelPattern23Inflections().catch(console.error);

