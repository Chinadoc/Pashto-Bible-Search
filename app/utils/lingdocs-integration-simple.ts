// Simple LingDocs integration that works around build issues
// Uses copied source files directly

import { conjugateVerb } from './lingdocs/verb-conjugation';
import { inflectWord } from './lingdocs/pashto-inflector';

export interface LingDocsResult {
    success: boolean;
    forms?: string[];
    error?: string;
}

// Simple wrapper for verb conjugation using LingDocs
export async function conjugateVerbLingDocs(verb: string): Promise<LingDocsResult> {
    try {
        console.log(`🔍 LingDocs conjugating: ${verb}`);

        // This will use the copied LingDocs source files
        const result = conjugateVerb(verb);

        if (result && result.forms_map) {
            const forms = Object.keys(result.forms_map);
            console.log(`✅ LingDocs generated ${forms.length} forms for ${verb}`);
            return {
                success: true,
                forms: forms
            };
        } else {
            return {
                success: false,
                error: 'No forms generated'
            };
        }
    } catch (error) {
        console.error(`❌ LingDocs conjugation failed for ${verb}:`, error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
        };
    }
}

// Simple wrapper for word inflection using LingDocs
export async function inflectWordLingDocs(word: string): Promise<LingDocsResult> {
    try {
        console.log(`🔍 LingDocs inflecting: ${word}`);

        // This will use the copied LingDocs source files
        const result = inflectWord(word);

        if (result) {
            const forms = Array.isArray(result) ? result : [result];
            console.log(`✅ LingDocs generated ${forms.length} inflections for ${word}`);
            return {
                success: true,
                forms: forms
            };
        } else {
            return {
                success: false,
                error: 'No inflections generated'
            };
        }
    } catch (error) {
        console.error(`❌ LingDocs inflection failed for ${word}:`, error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
        };
    }
}

// Test function to verify LingDocs integration
export async function testLingDocsIntegration(): Promise<boolean> {
    console.log('🧪 Testing LingDocs integration...');

    const testVerbs = ['کول', 'وهل', 'ليدل'];

    for (const verb of testVerbs) {
        const result = await conjugateVerbLingDocs(verb);
        if (result.success) {
            console.log(`✅ ${verb}: ${result.forms?.length || 0} forms`);
        } else {
            console.log(`❌ ${verb}: ${result.error}`);
            return false;
        }
    }

    console.log('🎉 LingDocs integration test passed!');
    return true;
}
