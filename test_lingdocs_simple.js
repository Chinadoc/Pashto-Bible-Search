// Simple test script to use LingDocs without full build
// This bypasses the complex build process

const fs = require('fs');
const path = require('path');

// Simple test of LingDocs functionality
async function testLingDocs() {
    console.log('🔍 Testing LingDocs integration...');

    try {
        // Check if we can read the main library file
        const libraryPath = './pashto-inflector/src/lib/library.ts';
        if (fs.existsSync(libraryPath)) {
            console.log('✅ Library file exists');
            const content = fs.readFileSync(libraryPath, 'utf8');
            console.log('📄 Library file length:', content.length, 'characters');

            // Check if it exports the functions we need
            if (content.includes('export { conjugateVerb }')) {
                console.log('✅ conjugateVerb function found');
            }
            if (content.includes('export { inflectWord }')) {
                console.log('✅ inflectWord function found');
            }
        } else {
            console.log('❌ Library file not found');
        }

        // Check for essential source files
        const essentialFiles = [
            './pashto-inflector/src/lib/src/verb-conjugation.ts',
            './pashto-inflector/src/lib/src/pashto-inflector.ts',
            './pashto-inflector/src/lib/src/verb-info.ts'
        ];

        console.log('\n📁 Checking essential source files:');
        for (const file of essentialFiles) {
            if (fs.existsSync(file)) {
                console.log(`✅ ${path.basename(file)} exists`);
                const content = fs.readFileSync(file, 'utf8');
                console.log(`   Size: ${content.length} characters`);
            } else {
                console.log(`❌ ${path.basename(file)} missing`);
            }
        }

        console.log('\n🎯 Next steps:');
        console.log('1. Use tsx to run TypeScript directly');
        console.log('2. Create minimal wrapper for core functions');
        console.log('3. Integrate with existing Bible search');

    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

testLingDocs();




