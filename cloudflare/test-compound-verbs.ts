/**
 * Test if LingDocs handles dynamic compound verbs correctly
 * Testing "مرسته کول" (mrásta kawúl) - dynamic compound verb
 */

import { generateVerbVariantsLingDocs } from '../app/utils/lingdocs_integration';

async function main() {
  console.log('🧪 Testing Dynamic Compound Verb with LingDocs\n');
  console.log('='.repeat(70));
  
  // Test dynamic compound verb: "مرسته کول" (to help)
  const testVerb = 'مرسته کول';
  
  console.log(`\n📖 Testing dynamic compound verb: "${testVerb}"`);
  console.log('   Expected POS: v. dyn. comp. trans.');
  console.log('   Expected forms: مرسته کوم, مرسته کوې, مرسته کوي, مرسته وکړ, etc.');
  
  try {
    console.log(`\n🔍 Generating conjugations using LingDocs...`);
    const variants = await generateVerbVariantsLingDocs(testVerb, { cap: 100, includeCompound: true });
    
    console.log(`\n✅ Generated ${variants.length} variants:`);
    variants.slice(0, 20).forEach((variant, i) => {
      console.log(`   ${i + 1}. ${variant.form}${variant.romanized ? ` (${variant.romanized})` : ''} - ${variant.label || 'N/A'}`);
    });
    
    // Check for expected dynamic compound forms
    const expectedForms = [
      'مرسته کوم',  // Present 1sg
      'مرسته کوې',  // Present 2sg
      'مرسته کوي',  // Present 3sg
      'مرسته کوو',  // Present 1pl
      'مرسته وکړ',  // Perfective
      'مرسته وکړم', // Perfective 1sg
      'مرسته وکړو', // Perfective 1pl
    ];
    
    console.log(`\n📊 Checking for expected dynamic compound forms:`);
    const foundForms = expectedForms.filter(form => variants.some(v => v.form === form));
    foundForms.forEach(form => console.log(`   ✅ ${form}`));
    expectedForms.filter(f => !foundForms.includes(f)).forEach(form => {
      console.log(`   ❌ ${form} (NOT FOUND)`);
    });
    
    // Check if we have both spaced and fused forms
    const hasSpaced = variants.some(v => v.form.includes(' '));
    const hasFused = variants.some(v => !v.form.includes(' ') && v.form.includes('مرسته'));
    
    console.log(`\n📊 Form types:`);
    console.log(`   Spaced forms (with space): ${hasSpaced ? '✅' : '❌'}`);
    console.log(`   Fused forms (no space): ${hasFused ? '✅' : '❌'}`);
    
    if (hasSpaced && !hasFused) {
      console.log(`\n✅ Dynamic compound correctly generates spaced forms (no fusion)`);
    } else if (hasFused) {
      console.log(`\n⚠️  WARNING: Dynamic compound should NOT have fused forms - only spaced`);
    }
    
  } catch (error: any) {
    console.error(`\n❌ Error: ${error.message}`);
    console.error(`   Stack: ${error.stack}`);
  }
  
  // Test stative compound for comparison
  console.log(`\n\n📖 Testing stative compound verb: "ګرم کېدل" (to become hot)`);
  console.log('   Expected POS: v. stat. comp. intrans.');
  console.log('   Expected forms: ګرم کېږم, ګرمېږم (both spaced AND fused)');
  
  try {
    const variants = await generateVerbVariantsLingDocs('ګرم کېدل', { cap: 100, includeCompound: true });
    
    console.log(`\n✅ Generated ${variants.length} variants:`);
    variants.slice(0, 15).forEach((variant, i) => {
      console.log(`   ${i + 1}. ${variant.form} - ${variant.label || 'N/A'}`);
    });
    
    const expectedStativeForms = [
      'ګرم کېږم',  // Spaced present 1sg
      'ګرمېږم',   // Fused present 1sg (stative compounds can fuse)
      'ګرم کېږي',  // Spaced present 3sg
      'ګرمېږي',   // Fused present 3sg
      'ګرم شو',    // Perfective past
    ];
    
    console.log(`\n📊 Checking for expected stative compound forms:`);
    const foundForms = expectedStativeForms.filter(form => variants.some(v => v.form === form));
    foundForms.forEach(form => console.log(`   ✅ ${form}`));
    expectedStativeForms.filter(f => !foundForms.includes(f)).forEach(form => {
      console.log(`   ❌ ${form} (NOT FOUND)`);
    });
    
  } catch (error: any) {
    console.error(`\n❌ Error: ${error.message}`);
  }
}

main().catch(console.error);

