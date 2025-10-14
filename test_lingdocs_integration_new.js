// Test the actual LingDocs integration
const path = require('path');

// Test importing the LingDocs integration module
async function testLingDocsIntegration() {
  try {
    console.log('🧪 Testing LingDocs Integration Module');

    // Import the integration module
    const integrationPath = path.join(__dirname, 'app/utils/lingdocs_integration.js');
    console.log('🔍 Integration module path:', integrationPath);

    // For now, let's test the direct LingDocs import
    const lingdocsPath = path.join(__dirname, 'pashto-inflector/src/lib/dist/lib/library.cjs');
    const lingdocs = require(lingdocsPath);

    console.log('✅ LingDocs library loaded successfully');

    // Test with a simple verb entry
    const verbEntry = {
      ts: Date.now(),
      i: 1,
      p: 'کول',
      f: 'kawul',
      g: 'kawul',
      e: 'to do',
      c: 'v. trans.',
    };

    console.log('🔍 Testing verb conjugation with:', verbEntry.p);

    const conjugation = lingdocs.conjugateVerb(verbEntry);
    console.log('✅ Conjugation successful:', {
      hasImperfective: !!conjugation.imperfective,
      hasPerfective: !!conjugation.perfective,
      hasParticiple: !!conjugation.participle,
    });

    // Test noun inflection
    const nounEntry = {
      ts: Date.now(),
      i: 2,
      p: 'کور',
      f: 'kor',
      g: 'kor',
      e: 'house',
      c: 'n. m.',
    };

    console.log('🔍 Testing noun inflection with:', nounEntry.p);

    const inflection = lingdocs.inflectWord(nounEntry);
    console.log('✅ Inflection successful:', {
      hasInflection: !!inflection,
      keys: inflection ? Object.keys(inflection) : [],
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Stack:', error.stack);
  }
}

testLingDocsIntegration().catch(console.error);


