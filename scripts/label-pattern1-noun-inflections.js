/**
 * Label Pattern 1 Noun Inflections in Word Frequency List
 * 
 * According to https://grammar.lingdocs.com/inflection/inflection-patterns/:
 * Pattern 1 Basic nouns:
 * - Masculine: ends in consonant or shwa (ـه - -u vowel)
 * - Feminine: ends in ـه - -a
 * 
 * Inflections:
 * - Masculine Plain/1st: same as base
 * - Masculine 2nd: base + و
 * - Feminine Plain: base + ه (if not already ending in ه)
 * - Feminine 1st: base + ې
 * - Feminine 2nd: base + و
 * 
 * Exceptions: Feminine nouns without -a ending (see exceptions list)
 */

const { readFileSync, writeFileSync } = require('fs');
const { join } = require('path');

// Pattern 1 exceptions: feminine nouns without -a ending
const PATTERN1_FEMININE_EXCEPTIONS = [
  'لار', 'ورځ', 'میاشت', 'غیږ', 'څنګل', 'برستن', 'زمنځ', 'ستن', 'لمن', 
  'څرمن', 'توشک', 'کنځل', 'لوېشت', 'منګل', 'وریځ'
];

/**
 * Check if a word ends in a consonant or shwa (ـه - -u vowel)
 */
function endsInConsonantOrShwa(word) {
  if (!word) return false;
  // Check if ends in ه (could be shwa or consonant)
  if (word.endsWith('ه')) {
    // Check if it's a feminine ending (would be -a sound)
    // This is heuristic - we'll check dictionary for gender
    return false; // ه ending is typically feminine -a
  }
  // Ends in consonant (not ا, و, ی, ي, ې, ۍ)
  const lastChar = word[word.length - 1];
  const vowels = ['ا', 'و', 'ی', 'ي', 'ې', 'ۍ', 'ئ'];
  return !vowels.includes(lastChar);
}

/**
 * Check if a word ends in -a (feminine ending)
 */
function endsInA(word) {
  return word.endsWith('ه');
}

/**
 * Generate Pattern 1 inflections
 */
function generatePattern1Inflections(baseWord, isMasculine) {
  let base_m;
  let base_f;

  if (baseWord.endsWith('ه')) {
    // If ending in ه, assume it's feminine base
    base_m = baseWord.slice(0, -1); // Remove ه
    base_f = baseWord;
  } else {
    // Consonant ending - masculine base
    base_m = baseWord;
    base_f = baseWord + 'ه';
  }

  return {
    plain_m: base_m,
    inflection_1_m: base_m, // Same as plain
    inflection_2_m: base_m + 'و',
    plain_f: base_f,
    inflection_1_f: base_m + 'ې',
    inflection_2_f: base_m + 'و',
  };
}

/**
 * Main function to label Pattern 1 noun inflections
 */
async function labelPattern1Inflections() {
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

  // Create frequency map for quick lookup
  const freqMap = new Map();
  for (const entry of frequencyData) {
    freqMap.set(entry.pashto, entry);
  }

  // Find Pattern 1 nouns in dictionary
  console.log('🔍 Finding Pattern 1 nouns...\n');
  const pattern1Nouns = new Map();

  for (const entry of dictionary) {
    const pos = ((entry.c_norm || entry.c || '').toLowerCase());
    const gender = entry.gender || '';
    
    // Check if it's a noun
    if (!pos.includes('n') && !pos.includes('noun')) {
      continue;
    }

    const pashto = entry.p || '';
    if (!pashto) continue;

    // Check if it matches Pattern 1:
    // Masculine: ends in consonant or shwa (ـه - -u vowel)
    // Feminine: ends in ـه - -a OR is in exceptions list
    const isMasculine = gender.startsWith('m') || (!gender && endsInConsonantOrShwa(pashto));
    const isFeminine = gender.startsWith('f') || endsInA(pashto) || PATTERN1_FEMININE_EXCEPTIONS.includes(pashto);

    if (isMasculine || isFeminine) {
      // Generate inflections
      const inflections = generatePattern1Inflections(pashto, isMasculine);
      pattern1Nouns.set(pashto, { entry, inflections });
    }
  }

  console.log(`   Found ${pattern1Nouns.size} Pattern 1 nouns\n`);

  // Now label frequency entries with inflection information
  console.log('🏷️  Labeling frequency entries...\n');
  let labeledCount = 0;
  let foundInFreqCount = 0;

  for (const [baseWord, { entry, inflections }] of pattern1Nouns.entries()) {
    // Check all inflected forms
    const formsToCheck = [
      { form: inflections.plain_m, label: 'masc_plain', base: baseWord },
      { form: inflections.inflection_1_m, label: 'masc_1st', base: baseWord },
      { form: inflections.inflection_2_m, label: 'masc_2nd', base: baseWord },
      { form: inflections.plain_f, label: 'fem_plain', base: baseWord },
      { form: inflections.inflection_1_f, label: 'fem_1st', base: baseWord },
      { form: inflections.inflection_2_f, label: 'fem_2nd', base: baseWord },
    ];

    for (const { form, label, base } of formsToCheck) {
      if (freqMap.has(form)) {
        const freqEntry = freqMap.get(form);
        if (!freqEntry.inflection_label) {
          freqEntry.inflection_label = label;
          freqEntry.base_word = base;
          freqEntry.pattern = 'pattern1';
          labeledCount++;
        }
        foundInFreqCount++;
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
    pattern1_nouns_found: pattern1Nouns.size,
    frequency_entries_labeled: labeledCount,
    inflected_forms_found: foundInFreqCount,
    labeled_by_type: {
      masc_plain: frequencyData.filter(e => e.inflection_label === 'masc_plain').length,
      masc_1st: frequencyData.filter(e => e.inflection_label === 'masc_1st').length,
      masc_2nd: frequencyData.filter(e => e.inflection_label === 'masc_2nd').length,
      fem_plain: frequencyData.filter(e => e.inflection_label === 'fem_plain').length,
      fem_1st: frequencyData.filter(e => e.inflection_label === 'fem_1st').length,
      fem_2nd: frequencyData.filter(e => e.inflection_label === 'fem_2nd').length,
    }
  };

  console.log('📊 Summary:');
  console.log(JSON.stringify(summary, null, 2));
}

// Run the script
labelPattern1Inflections().catch(console.error);

