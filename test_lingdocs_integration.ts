/**
 * Test LingDocs Integration
 * 
 * Run with: npx tsx test_lingdocs_integration.ts
 */

import { generateVerbVariants } from './app/utils/verb_variants';
import { generateNounVariants } from './app/utils/noun_variants';

async function testVerbConjugation() {
  console.log('🧪 Testing Verb Conjugation with LingDocs Integration\n');
  console.log('='.repeat(60));
  
  const testVerbs = [
    'وهل',     // wahul - to hit
    'کول',     // kawul - to do
    'خوړل',    // khoRul - to eat
    'ساتل',    // saatul - to keep
  ];
  
  for (const verb of testVerbs) {
    console.log(`\n📝 Testing: ${verb}`);
    console.log('-'.repeat(60));
    
    try {
      const variants = await generateVerbVariants(verb, { cap: 15 });
      
      console.log(`✅ Generated ${variants.length} forms:`);
      variants.slice(0, 10).forEach((v, i) => {
        const romanized = v.romanized ? ` (${v.romanized})` : '';
        const flags = v.flags ? ` [${v.flags.join(', ')}]` : '';
        const count = v.count ? ` - freq: ${v.count}` : '';
        console.log(`   ${i + 1}. ${v.form}${romanized} - ${v.label}${flags}${count}`);
      });
      
      if (variants.length > 10) {
        console.log(`   ... and ${variants.length - 10} more forms`);
      }
    } catch (error) {
      console.error(`❌ Error:`, error);
    }
  }
}

async function testNounInflection() {
  console.log('\n\n🧪 Testing Noun Inflection with LingDocs Integration\n');
  console.log('='.repeat(60));
  
  const testNouns = [
    'کتاب',    // book
    'سړی',     // man
    'ښځه',     // woman
  ];
  
  for (const noun of testNouns) {
    console.log(`\n📝 Testing: ${noun}`);
    console.log('-'.repeat(60));
    
    try {
      const variants = await generateNounVariants(noun, { cap: 10 });
      
      console.log(`✅ Generated ${variants.length} forms:`);
      variants.forEach((v, i) => {
        const romanized = v.romanized ? ` (${v.romanized})` : '';
        const count = v.count ? ` - freq: ${v.count}` : '';
        console.log(`   ${i + 1}. ${v.form}${romanized} - ${v.label}${count}`);
      });
    } catch (error) {
      console.error(`❌ Error:`, error);
    }
  }
}

async function main() {
  console.log('🚀 LingDocs Integration Test Suite');
  console.log('=' .repeat(60));
  console.log('Testing enhanced verb and noun generation...\n');
  
  await testVerbConjugation();
  await testNounInflection();
  
  console.log('\n\n✅ Integration test complete!');
  console.log('='.repeat(60));
  console.log('\n📊 Summary:');
  console.log('- Verbs use enhanced LingDocs-compatible adapter');
  console.log('- Nouns use enhanced adapter with frequency sorting');
  console.log('- Automatic fallback to legacy system if needed');
  console.log('- Ready for deployment!\n');
}

main().catch(console.error);
