// Compare LingDocs vs Current verb inflection systems

const fs = require('fs');
const path = require('path');

async function compareSystems() {
    console.log('🔍 Comparing LingDocs vs Current System\n');

    // Test verbs
    const testVerbs = ['کول', 'وهل', 'ليدل', 'تلل', 'راوستل'];

    console.log('📊 Comparison Results:');
    console.log('=' * 50);

    for (const verb of testVerbs) {
        console.log(`\n🔤 Verb: ${verb}`);

        // Test current system (if available)
        try {
            // This would call your current verb inflection system
            // For now, we'll simulate it
            const currentForms = await getCurrentSystemForms(verb);
            console.log(`   Current: ${currentForms.length} forms`);
        } catch (error) {
            console.log(`   Current: Error - ${error.message}`);
        }

        // Test LingDocs
        try {
            const lingdocsModule = require('./app/utils/lingdocs-integration-simple.js');
            const lingdocsResult = lingdocsModule.conjugateVerbLingDocs(verb);

            if (lingdocsResult.success) {
                console.log(`   LingDocs: ${lingdocsResult.forms?.length || 0} forms`);

                if (lingdocsResult.forms && lingdocsResult.forms.length > 0) {
                    console.log('   Sample LingDocs forms:');
                    lingdocsResult.forms.slice(0, 3).forEach(form => {
                        console.log(`     - ${form}`);
                    });
                }
            } else {
                console.log(`   LingDocs: Error - ${lingdocsResult.error}`);
            }
        } catch (error) {
            console.log(`   LingDocs: Error - ${error.message}`);
        }
    }

    console.log('\n' + '=' * 50);
    console.log('✅ Comparison complete!');
}

async function getCurrentSystemForms(verb) {
    // Placeholder for current system
    // In a real implementation, this would call your existing verb inflection
    return ['کم', 'کو', 'کوی']; // Sample forms
}

compareSystems();




