"use strict";
// Simple LingDocs integration that works around build issues
// Uses runtime approach with simplified implementation
Object.defineProperty(exports, "__esModule", { value: true });
exports.conjugateVerbLingDocs = conjugateVerbLingDocs;
exports.inflectWordLingDocs = inflectWordLingDocs;
exports.testLingDocsIntegration = testLingDocsIntegration;
const lingdocs_runtime_js_1 = require("./lingdocs-runtime.js");
// Simple wrapper for verb conjugation using LingDocs
function conjugateVerbLingDocs(verb) {
    try {
        console.log(`🔍 LingDocs conjugating: ${verb}`);
        // Use the runtime implementation
        const result = lingdocs_runtime_js_1.lingdocsRuntime.conjugateVerb(verb);
        if (result && result.forms_map) {
            const forms = Object.keys(result.forms_map);
            console.log(`✅ LingDocs generated ${forms.length} forms for ${verb}`);
            return {
                success: true,
                forms: forms
            };
        }
        else {
            return {
                success: false,
                error: 'No forms generated'
            };
        }
    }
    catch (error) {
        console.error(`❌ LingDocs conjugation failed for ${verb}:`, error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
        };
    }
}
// Simple wrapper for word inflection using LingDocs
function inflectWordLingDocs(word) {
    try {
        console.log(`🔍 LingDocs inflecting: ${word}`);
        // Use the runtime implementation
        const result = lingdocs_runtime_js_1.lingdocsRuntime.inflectWord(word);
        if (result && result.length > 0) {
            console.log(`✅ LingDocs generated ${result.length} inflections for ${word}`);
            return {
                success: true,
                forms: result
            };
        }
        else {
            return {
                success: false,
                error: 'No inflections generated'
            };
        }
    }
    catch (error) {
        console.error(`❌ LingDocs inflection failed for ${word}:`, error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
        };
    }
}
// Test function to verify LingDocs integration
function testLingDocsIntegration() {
    console.log('🧪 Testing LingDocs integration...');
    const testVerbs = ['کول', 'وهل', 'ليدل'];
    for (const verb of testVerbs) {
        const result = conjugateVerbLingDocs(verb);
        if (result.success) {
            console.log(`✅ ${verb}: ${result.forms?.length || 0} forms`);
        }
        else {
            console.log(`❌ ${verb}: ${result.error}`);
            return false;
        }
    }
    console.log('🎉 LingDocs integration test passed!');
    return true;
}
