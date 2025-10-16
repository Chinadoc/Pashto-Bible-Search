// Test the real LingDocs library to understand its structure
const path = require('path');

// Import the real LingDocs library
const lingdocsPath = path.join(__dirname, 'pashto-inflector/src/lib/dist/lib/library.cjs');
const lingdocs = require(lingdocsPath);

async function testRealLingDocs() {
  console.log('🧪 Testing REAL LingDocs library...\n');

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

  console.log('🔍 Testing verb conjugation:');
  console.log('Input:', verbEntry);

  try {
    const conjugation = lingdocs.conjugateVerb(verbEntry);
    console.log('\n✅ LingDocs conjugation result:');
    console.log(JSON.stringify(conjugation, null, 2));

    // Test with a noun
    const nounEntry = {
      ts: Date.now(),
      i: 2,
      p: 'کور',
      f: 'kor',
      g: 'kor',
      e: 'house',
      c: 'n. m.',
    };

    console.log('\n🔍 Testing noun inflection:');
    console.log('Input:', nounEntry);

    const inflection = lingdocs.inflectWord(nounEntry);
    console.log('\n✅ LingDocs inflection result:');
    console.log(JSON.stringify(inflection, null, 2));

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Stack:', error.stack);
  }
}

testRealLingDocs().catch(console.error);



