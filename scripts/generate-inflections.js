#!/usr/bin/env node
/**
 * Generate inflections for all dictionary entries based on LingDocs patterns
 * 
 * Inflection Patterns for Nouns/Adjectives:
 * Pattern #1: Basic (consonant ending)
 * Pattern #2: Unstressed ی ending
 * Pattern #3: Stressed ی ending  
 * Pattern #4: "Pashtun" pattern (-ون/-ان)
 * Pattern #5: Short ending ("squish" - ه)
 * Pattern #6: Feminine ي/ۍ ending
 * 
 * Based on: https://grammar.lingdocs.com/inflection/inflection-patterns/
 */

const fs = require('fs');
const path = require('path');

// Load dictionary
const dictPath = path.join(__dirname, '../data/lingdocs-dictionary.json');
const dict = JSON.parse(fs.readFileSync(dictPath, 'utf8'));

console.log(`Processing ${dict.entries.length} dictionary entries...`);

// Inflection pattern detection and generation
function detectPattern(entry) {
  const { p, c, infap, infaf, infbp, infbf, noInf } = entry;
  
  // Skip if explicitly marked as non-inflecting
  if (noInf) return null;
  
  // Has irregular inflection data
  if (infap || infbp) {
    return { pattern: 'irregular', infap, infaf, infbp, infbf };
  }
  
  const pos = c || '';
  const isFeminine = pos.includes('f.');
  const isMasculine = pos.includes('m.');
  const isAdjective = pos.includes('adj');
  const isNoun = pos.includes('n.');
  const isAnimateUnisex = pos.includes('anim. unisex');
  
  // Only inflect nouns and adjectives
  if (!isNoun && !isAdjective) return null;
  
  // Detect pattern based on ending
  if (p.endsWith('ی')) {
    // Could be Pattern #2 or #3 (stressed vs unstressed)
    // For simplicity, treat all as #3 (stressed) which is more common
    return { pattern: isFeminine ? 'p3f' : 'p3m', gender: isFeminine ? 'f' : 'm' };
  }
  
  if (p.endsWith('ي') || p.endsWith('ۍ')) {
    // Pattern #6: Feminine ي/ۍ
    return { pattern: 'p6', gender: 'f' };
  }
  
  if (p.endsWith('ه') && isFeminine) {
    // Pattern #5: Feminine with ه ending
    return { pattern: 'p5f', gender: 'f' };
  }
  
  if (p.endsWith('ه') && isMasculine) {
    // Pattern #5: Masculine with ه ending
    return { pattern: 'p5m', gender: 'm' };
  }
  
  if (p.endsWith('ا') && isMasculine) {
    // Pattern #1 with ا ending
    return { pattern: 'p1a', gender: 'm' };
  }
  
  if (p.endsWith('و') && isMasculine) {
    // Pattern #1 with و ending
    return { pattern: 'p1o', gender: 'm' };
  }
  
  // Animate unisex (Pattern #4)
  if (isAnimateUnisex) {
    return { pattern: 'p4', gender: 'unisex' };
  }
  
  // Default Pattern #1: Basic consonant ending
  if (isMasculine) {
    return { pattern: 'p1m', gender: 'm' };
  }
  if (isFeminine) {
    return { pattern: 'p1f', gender: 'f' };
  }
  
  // Adjectives default to masculine singular
  if (isAdjective) {
    return { pattern: 'adj', gender: 'unisex' };
  }
  
  return null;
}

// Generate inflection forms based on pattern
function generateInflections(entry, patternInfo) {
  if (!patternInfo) return null;
  
  const { p, f } = entry;
  const { pattern } = patternInfo;
  
  const inflections = {
    pattern: pattern,
    forms: []
  };
  
  switch (pattern) {
    case 'irregular':
      // Use provided irregular forms
      inflections.forms = [
        { type: 'plain', p: p, f: f },
        { type: '1st_m', p: patternInfo.infap || p, f: patternInfo.infaf || f },
        { type: '2nd', p: patternInfo.infbp || p, f: patternInfo.infbf || f },
      ];
      break;
      
    case 'p1m':
      // Pattern #1 Masculine: consonant ending - add و for oblique
      inflections.forms = [
        { type: 'plain_m', p: p, f: f },
        { type: '1st_m', p: p, f: f },
        { type: '2nd', p: p + 'و', f: f + 'o' },
      ];
      break;
      
    case 'p1f':
      // Pattern #1 Feminine: consonant ending - add ې for 1st, و for 2nd
      inflections.forms = [
        { type: 'plain_f', p: p, f: f },
        { type: '1st_f', p: p + 'ې', f: f + 'e' },
        { type: '2nd', p: p + 'و', f: f + 'o' },
      ];
      break;
      
    case 'p3m':
      // Pattern #3 Masculine: ی ending → ي (1st) → یو (2nd)
      const stem3m = p.slice(0, -1);
      const fstem3m = f.slice(0, -1);
      inflections.forms = [
        { type: 'plain_m', p: p, f: f },
        { type: '1st_m', p: stem3m + 'ي', f: fstem3m + 'ee' },
        { type: '2nd', p: stem3m + 'یو', f: fstem3m + 'iyo' },
        { type: 'plain_f', p: stem3m + 'ې', f: fstem3m + 'e' },
        { type: '1st_f', p: stem3m + 'ې', f: fstem3m + 'e' },
      ];
      break;
      
    case 'p3f':
      // Pattern #3 Feminine: ی ending (rare in feminine)
      const stem3f = p.slice(0, -1);
      const fstem3f = f.slice(0, -1);
      inflections.forms = [
        { type: 'plain_f', p: p, f: f },
        { type: '1st_f', p: stem3f + 'ۍ', f: fstem3f + 'úy' },
        { type: '2nd', p: stem3f + 'یو', f: fstem3f + 'iyo' },
      ];
      break;
      
    case 'p5m':
      // Pattern #5 Masculine: ه ending → ه (stays same) or adds و
      const stem5m = p.slice(0, -1);
      const fstem5m = f.replace(/a$/, '');
      inflections.forms = [
        { type: 'plain_m', p: p, f: f },
        { type: '1st_m', p: p, f: f },
        { type: '2nd', p: stem5m + 'و', f: fstem5m + 'o' },
      ];
      break;
      
    case 'p5f':
      // Pattern #5 Feminine: ه ending → ې (1st) → و (2nd)
      const stem5f = p.slice(0, -1);
      const fstem5f = f.replace(/a$/, '');
      inflections.forms = [
        { type: 'plain_f', p: p, f: f },
        { type: '1st_f', p: stem5f + 'ې', f: fstem5f + 'e' },
        { type: '2nd', p: stem5f + 'و', f: fstem5f + 'o' },
      ];
      break;
      
    case 'p6':
      // Pattern #6: Feminine ي ending → ۍ (1st) → یو (2nd)
      // Example: فقیري → فقیرۍ → فقیریو
      const stem6 = p.slice(0, -1); // Remove final ي or ۍ
      const fstem6 = f.replace(/ée$|éy$|úy$|ee$/, ''); // Remove phonetic ending
      inflections.forms = [
        { type: 'plain', p: p.endsWith('ۍ') ? stem6 + 'ي' : p, f: fstem6 + 'ée' },
        { type: '1st', p: stem6 + 'ۍ', f: fstem6 + 'úy' },
        { type: '2nd', p: stem6 + 'یو', f: fstem6 + 'úyo' },
      ];
      break;
      
    case 'p4':
      // Pattern #4: Animate unisex (Pashtun pattern)
      // Example: پښتون → پښتانه (m.pl) / پښتنه (f.sg)
      // This is complex - for now just store base
      inflections.forms = [
        { type: 'plain_m', p: p, f: f },
        { type: 'plain_f', p: p, f: f }, // Would need lookup table
      ];
      break;
      
    case 'adj':
      // Adjective: masculine ← → feminine forms
      // Many adjectives have ه ending for feminine
      if (p.endsWith('ی')) {
        const stemAdj = p.slice(0, -1);
        const fstemAdj = f.slice(0, -1);
        inflections.forms = [
          { type: 'plain_m', p: p, f: f },
          { type: '1st_m', p: stemAdj + 'ي', f: fstemAdj + 'ee' },
          { type: 'plain_f', p: stemAdj + 'ې', f: fstemAdj + 'e' },
          { type: '1st_f', p: stemAdj + 'ې', f: fstemAdj + 'e' },
          { type: '2nd', p: stemAdj + 'یو', f: fstemAdj + 'iyo' },
        ];
      } else {
        inflections.forms = [
          { type: 'plain_m', p: p, f: f },
          { type: 'plain_f', p: p + 'ه', f: f + 'a' },
          { type: '1st_f', p: p + 'ې', f: f + 'e' },
          { type: '2nd', p: p + 'و', f: f + 'o' },
        ];
      }
      break;
      
    default:
      return null;
  }
  
  return inflections;
}

// Generate verb conjugation forms
function generateVerbForms(entry) {
  const { p, f, c, psp, psf, tppp, tppf, ssp, ssf, ec } = entry;
  
  if (!c || !c.includes('v.')) return null;
  
  const isTransitive = c.includes('trans') && !c.includes('intrans');
  const isCompound = c.includes('comp');
  const isStative = c.includes('stat');
  const isDynamic = c.includes('dyn');
  
  const verbInfo = {
    type: isCompound ? (isStative ? 'stative_compound' : 'dynamic_compound') : 'simple',
    transitivity: isTransitive ? 'transitive' : 'intransitive',
    infinitive: { p, f },
    imperfectiveStem: psp && psf ? { p: psp, f: psf } : null,
    perfectiveStem: ssp && ssf ? { p: ssp, f: ssf } : null,
    pastParticiple: tppp && tppf ? { p: tppp, f: tppf } : null,
    englishConjugation: ec || null,
  };
  
  // Generate basic conjugation forms
  const stem = psp || p.slice(0, -1); // Remove ل
  const fstem = psf || f.replace(/ul$|úl$/, '');
  
  verbInfo.presentForms = [
    { person: '1sg', p: stem + 'م', f: fstem + 'um' },
    { person: '2sg', p: stem + 'ې', f: fstem + 'e' },
    { person: '3sg', p: stem + 'ي', f: fstem + 'ee' },
    { person: '1pl', p: stem + 'و', f: fstem + 'oo' },
    { person: '2pl', p: stem + 'ئ', f: fstem + 'ey' },
    { person: '3pl', p: stem + 'ي', f: fstem + 'ee' },
  ];
  
  return verbInfo;
}

// Process all entries
const inflectedEntries = [];
let verbCount = 0;
let nounAdjCount = 0;

for (const entry of dict.entries) {
  const result = {
    ts: entry.ts,
    pashto: entry.p,
    phonetics: entry.f,
    english: entry.e,
    pos: entry.c,
  };
  
  // Check if it's a verb
  if (entry.c && entry.c.includes('v.')) {
    const verbForms = generateVerbForms(entry);
    if (verbForms) {
      result.verbInfo = verbForms;
      verbCount++;
    }
  } else {
    // Try noun/adjective inflection
    const patternInfo = detectPattern(entry);
    const inflections = generateInflections(entry, patternInfo);
    if (inflections) {
      result.inflections = inflections;
      nounAdjCount++;
    }
  }
  
  inflectedEntries.push(result);
}

console.log(`Generated ${verbCount} verb entries with conjugations`);
console.log(`Generated ${nounAdjCount} noun/adjective entries with inflections`);

// Save the inflected dictionary
const outputPath = path.join(__dirname, '../data/lingdocs-inflected.json');
fs.writeFileSync(outputPath, JSON.stringify({
  info: dict.info,
  entries: inflectedEntries
}, null, 2));

console.log(`Saved to ${outputPath}`);

// Show example output
console.log('\n=== Example: فقیري ===');
const faqeeri = inflectedEntries.find(e => e.ts === 1527819070);
console.log(JSON.stringify(faqeeri, null, 2));

console.log('\n=== Example: لیدل (irregular verb) ===');
const leedul = inflectedEntries.find(e => e.ts === 1527812275);
console.log(JSON.stringify(leedul, null, 2));

