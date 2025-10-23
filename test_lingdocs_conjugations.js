const path = require('path');

async function testLingDocsConjugations() {
  console.log('\n🔍 TESTING LINGDOCS CONJUGATION ENGINE\n');

  try {
    // Try to load and use the LingDocs library
    const { generateVerbVariantsLingDocs } = await import('./app/utils/lingdocs_integration.js');

    console.log('Testing verb: ویل (wayúl - to say, to tell)\n');
    
    const variants = await generateVerbVariantsLingDocs('ویل');
    
    if (variants && variants.length > 0) {
      console.log(`✅ Generated ${variants.length} variants:\n`);
      
      // Group by label to see what forms were generated
      const byLabel = {};
      variants.forEach(v => {
        if (!byLabel[v.label]) byLabel[v.label] = [];
        byLabel[v.label].push(v.form);
      });

      // Show first few of each type
      Object.entries(byLabel).forEach(([label, forms]) => {
        console.log(`${label}:`);
        forms.slice(0, 3).forEach(form => console.log(`  - ${form}`));
        if (forms.length > 3) console.log(`  ... and ${forms.length - 3} more`);
      });

      // Check if وویل (past tense) is in the results
      const hasOowayul = variants.some(v => v.form === 'وویل');
      console.log(`\n${hasOowayul ? '✅' : '❌'} Contains وویل (óowayul - past tense)?`);

    } else {
      console.log('❌ No variants generated');
    }

  } catch (error) {
    console.error('Error loading LingDocs:', error.message);
    console.log('\n⚠️ LingDocs library might not be available in this context');
  }
}

testLingDocsConjugations();
