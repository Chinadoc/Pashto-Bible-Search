// Test the real LingDocs integration end-to-end
const path = require('path');

// Import the real LingDocs integration functions
async function testRealIntegration() {
  console.log('🧪 Testing REAL LingDocs Integration...\n');

  try {
    // Import the integration module
    const integrationPath = path.join(__dirname, 'app/utils/lingdocs_integration.js');
    const { generateVerbVariantsLingDocs, generateNounVariantsLingDocs } = await import(integrationPath);

    console.log('✅ LingDocs integration imported successfully');

    // Test verb conjugation
    console.log('\n🔍 Testing verb conjugation...');
    const verbVariants = await generateVerbVariantsLingDocs('کول', { cap: 10 });
    console.log(`✅ Generated ${verbVariants.length} verb variants`);
    console.log('Sample variants:', verbVariants.slice(0, 5).map(v => `${v.form} (${v.label})`));

    // Test noun inflection
    console.log('\n🔍 Testing noun inflection...');
    const nounVariants = await generateNounVariantsLingDocs('کور', { cap: 10 });
    console.log(`✅ Generated ${nounVariants.length} noun variants`);
    console.log('Sample variants:', nounVariants.slice(0, 5).map(v => `${v.form} (${v.label})`));

    console.log('\n🎉 SUCCESS: Real LingDocs integration is working!');
    console.log('📊 Your app now uses the official LingDocs engine for inflection generation');

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Stack:', error.stack);
  }
}

testRealIntegration().catch(console.error);

