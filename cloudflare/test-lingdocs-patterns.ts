/**
 * Verify that LingDocs is applying inflection patterns correctly
 * Tests with a known word that has inflection patterns in dictionary
 */

import { generateNounVariantsLingDocs } from '../app/utils/lingdocs_integration';
import { readFile } from 'fs/promises';
import { join } from 'path';

async function main() {
  console.log('🧪 Testing LingDocs Inflection Pattern Application\n');
  console.log('='.repeat(70));
  
  // Test with "اوږد" (óoGd) which has infap: "اوږده" and infbp: "اوږد"
  const testWord = 'اوږد';
  
  console.log(`\n📖 Testing word: "${testWord}"`);
  console.log('   Expected pattern: infap="اوږده", infbp="اوږد"');
  
  // Load dictionary to check entry
  const dictPath = join(process.cwd(), 'app/data/full_dictionary_enriched.json');
  const content = await readFile(dictPath, 'utf-8');
  const data = JSON.parse(content);
  const entries = Array.isArray(data) ? data : (data.entries || []);
  
  const dictEntry = entries.find((e: any) => e.p === testWord);
  if (dictEntry) {
    console.log(`\n📚 Dictionary entry found:`);
    console.log(`   Base (p): ${dictEntry.p}`);
    console.log(`   infap: ${dictEntry.infap || 'NOT SET'}`);
    console.log(`   infaf: ${dictEntry.infaf || 'NOT SET'}`);
    console.log(`   infbp: ${dictEntry.infbp || 'NOT SET'}`);
    console.log(`   infbf: ${dictEntry.infbf || 'NOT SET'}`);
    console.log(`   POS: ${dictEntry.c || dictEntry.c_norm || 'NOT SET'}`);
  }
  
  // Generate variants using LingDocs
  console.log(`\n🔍 Generating inflections using LingDocs...`);
  try {
    const variants = await generateNounVariantsLingDocs(testWord, { cap: 50 });
    
    console.log(`\n✅ Generated ${variants.length} variants:`);
    variants.slice(0, 10).forEach((variant, i) => {
      console.log(`   ${i + 1}. ${variant.form}${variant.romanized ? ` (${variant.romanized})` : ''} - ${variant.label || 'N/A'}`);
    });
    
    // Check if infap form is in the results
    const expectedInfap = dictEntry?.infap;
    if (expectedInfap) {
      const foundInfap = variants.find(v => v.form === expectedInfap);
      if (foundInfap) {
        console.log(`\n✅ SUCCESS: infap form "${expectedInfap}" found in generated variants!`);
      } else {
        console.log(`\n⚠️  WARNING: infap form "${expectedInfap}" NOT found in generated variants`);
        console.log(`   This suggests LingDocs.inflectWord() might not be using infap/infbp fields`);
      }
    }
    
  } catch (error: any) {
    console.error(`\n❌ Error: ${error.message}`);
    console.log(`   This suggests LingDocs library might not be available or working correctly`);
  }
  
  // Test with "ټول" to see if it generates inflections
  console.log(`\n\n📖 Testing word: "ټول" (Tol)`);
  console.log('   Expected inflections: ټوله, ټولې, ټولو');
  
  try {
    const variants = await generateNounVariantsLingDocs('ټول', { cap: 50 });
    console.log(`\n✅ Generated ${variants.length} variants:`);
    variants.slice(0, 10).forEach((variant, i) => {
      console.log(`   ${i + 1}. ${variant.form} - ${variant.label || 'N/A'}`);
    });
    
    const expectedForms = ['ټوله', 'ټولې', 'ټولو'];
    const foundForms = expectedForms.filter(form => variants.some(v => v.form === form));
    console.log(`\n📊 Found ${foundForms.length}/${expectedForms.length} expected forms:`);
    foundForms.forEach(form => console.log(`   ✅ ${form}`));
    expectedForms.filter(f => !foundForms.includes(f)).forEach(form => {
      console.log(`   ❌ ${form} (NOT FOUND)`);
    });
    
  } catch (error: any) {
    console.error(`\n❌ Error: ${error.message}`);
  }
}

main().catch(console.error);

