/**
 * Label Pattern 4 (Pashtoon) Noun Inflections in Word Frequency List
 * 
 * According to https://grammar.lingdocs.com/inflection/inflection-patterns/:
 * Pattern 4: Words with the "Pashtoon" pattern
 * 
 * These words are irregular but have a common pattern:
 * 1. Lengthening the 1st masculine inflection with ا ـ ـه - aa _ u
 * 2. Shortening the other forms and adding the ـه - -a, ـې - -e, ـو - -o endings
 * 
 * Examples:
 * - پښتون (puxtoon) → پښتانه (puxtaanú) for 1st masc
 * - تروش (troosh) → تراشه (traashú) for 1st masc
 * - مېلمه (melmá) → مېلمانه (melmaanú) for 1st masc
 * 
 * Inflections:
 * - Masculine Plain: base form (e.g., پښتون)
 * - Masculine 1st: lengthened with ا and ends in ه (e.g., پښتانه)
 * - Masculine 2nd: shortened + و (e.g., پښتنو)
 * - Feminine Plain: shortened + ه (e.g., پښتنه)
 * - Feminine 1st: shortened + ې (e.g., پښتنې)
 * - Feminine 2nd: shortened + و (e.g., پښتنو)
 */

const { readFileSync, writeFileSync } = require('fs');
const { join } = require('path');

// Known Pattern 4 examples from grammar guide
const PATTERN4_EXAMPLES = ['پښتون', 'تروش', 'مېلمه', 'کوربه'];

/**
 * Generate Pattern 4 inflections (Pashtoon pattern)
 * Based on the pattern in noun_inflector.py and grammar examples
 */
function generatePattern4Inflections(baseWord) {
  let stem = baseWord;
  let femBase;
  
  // Handle words ending in 'ون' (like پښتون)
  if (baseWord.endsWith('ون')) {
    stem = baseWord.slice(0, -2); // Remove 'ون'
    femBase = stem + 'نه';
    
    return {
      plain_m: baseWord,
      inflection_1_m: stem + 'انه',
      inflection_2_m: stem + 'نو',
      plain_f: femBase,
      inflection_1_f: femBase.slice(0, -1) + 'ې', // Remove ه and add ې
      inflection_2_f: stem + 'نو',
    };
  }
  
  // Handle words ending in 'ه' (like مېلمه, کوربه)
  if (baseWord.endsWith('ه')) {
    stem = baseWord.slice(0, -1); // Remove 'ه'
    femBase = baseWord; // Feminine plain stays the same
    
    return {
      plain_m: baseWord,
      inflection_1_m: stem + 'انه', // مېلمه → مېلمانه
      inflection_2_m: stem + 'نو', // مېلمه → مېلمنو
      plain_f: femBase,
      inflection_1_f: stem + 'نې', // مېلمه → مېلمنې
      inflection_2_f: stem + 'نو',
    };
  }
  
  // Handle other words (like تروش)
  // تروش = تر + و + ش
  // تراشه = تر + ا + ش + ه (masc 1st)
  // ترشو = تر + ش + و (masc 2nd)
  // ترشه = تر + ش + ه (fem plain)
  // ترشي = تر + ش + ي (fem 1st from example)
  
  if (baseWord.endsWith('وش')) {
    const stem = baseWord.slice(0, -2) + 'ش'; // تروش → ترش
    return {
      plain_m: baseWord,
      inflection_1_m: baseWord.slice(0, -2) + 'ا' + baseWord.slice(-1) + 'ه', // تر + ا + ش + ه = تراشه
      inflection_2_m: stem + 'و', // ترش + و = ترشو
      plain_f: stem + 'ه', // ترش + ه = ترشه
      inflection_1_f: stem + 'ي', // ترش + ي = ترشي
      inflection_2_f: stem + 'و',
    };
  }
  
  // Default fallback - may need refinement for other Pattern 4 words
  return {
    plain_m: baseWord,
    inflection_1_m: baseWord + 'انه',
    inflection_2_m: baseWord + 'نو',
    plain_f: baseWord + 'ه',
    inflection_1_f: baseWord + 'ې',
    inflection_2_f: baseWord + 'و',
  };
}

/**
 * Main function to label Pattern 4 noun inflections
 */
async function labelPattern4Inflections() {
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

  // Find Pattern 4 nouns in dictionary
  console.log('🔍 Finding Pattern 4 nouns...\n');
  const pattern4Nouns = new Map();
  const pattern4ExampleSet = new Set(PATTERN4_EXAMPLES);

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
    
    // Check if it's a known Pattern 4 example
    if (pattern4ExampleSet.has(pashto)) {
      const inflections = generatePattern4Inflections(pashto);
      pattern4Nouns.set(pashto, { entry, inflections });
      continue;
    }
    
    if (pattern === 'pashtoon' || pattern === 'pattern4') {
      const inflections = generatePattern4Inflections(pashto);
      pattern4Nouns.set(pashto, { entry, inflections });
    } else if (pashto.endsWith('ون')) {
      // Words ending in 'ون' are likely Pattern 4
      // Check if it's a known Pashtoon pattern word
      const inflections = generatePattern4Inflections(pashto);
      pattern4Nouns.set(pashto, { entry, inflections });
    }
  }

  console.log(`   Found ${pattern4Nouns.size} Pattern 4 nouns\n`);

  // Now label frequency entries with inflection information
  console.log('🏷️  Labeling frequency entries...\n');
  let labeledCount = 0;
  let foundInFreqCount = 0;

  // Process Pattern 4
  for (const [baseWord, { entry, inflections }] of pattern4Nouns.entries()) {
    const formsToCheck = [
      { form: inflections.plain_m, label: 'masc_plain', base: baseWord, pattern: 'pattern4' },
      { form: inflections.inflection_1_m, label: 'masc_1st', base: baseWord, pattern: 'pattern4' },
      { form: inflections.inflection_2_m, label: 'masc_2nd', base: baseWord, pattern: 'pattern4' },
      { form: inflections.plain_f, label: 'fem_plain', base: baseWord, pattern: 'pattern4' },
      { form: inflections.inflection_1_f, label: 'fem_1st', base: baseWord, pattern: 'pattern4' },
      { form: inflections.inflection_2_f, label: 'fem_2nd', base: baseWord, pattern: 'pattern4' },
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
    pattern4_nouns_found: pattern4Nouns.size,
    frequency_entries_labeled: labeledCount,
    inflected_forms_found: foundInFreqCount,
    labeled_by_type: {
      pattern4_masc_plain: frequencyData.filter(e => e.pattern === 'pattern4' && e.inflection_label === 'masc_plain').length,
      pattern4_masc_1st: frequencyData.filter(e => e.pattern === 'pattern4' && e.inflection_label === 'masc_1st').length,
      pattern4_masc_2nd: frequencyData.filter(e => e.pattern === 'pattern4' && e.inflection_label === 'masc_2nd').length,
      pattern4_fem_plain: frequencyData.filter(e => e.pattern === 'pattern4' && e.inflection_label === 'fem_plain').length,
      pattern4_fem_1st: frequencyData.filter(e => e.pattern === 'pattern4' && e.inflection_label === 'fem_1st').length,
      pattern4_fem_2nd: frequencyData.filter(e => e.pattern === 'pattern4' && e.inflection_label === 'fem_2nd').length,
    }
  };

  console.log('📊 Summary:');
  console.log(JSON.stringify(summary, null, 2));
}

// Run the script
labelPattern4Inflections().catch(console.error);

