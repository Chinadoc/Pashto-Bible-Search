/**
 * Generate Inflections from Dictionary Patterns
 * 
 * Uses dictionary inflection fields (infap, infaf, infbp, infbf) to generate
 * all inflected forms for nouns and adjectives according to their patterns.
 * 
 * Based on LingDocs inflection patterns: https://dictionary.lingdocs.com/word?id=1527812931
 */

import { readFile } from 'fs/promises';
import { join } from 'path';

interface DictionaryEntry {
  p?: string; // Pashto word (base form)
  f?: string; // Phonetics
  c?: string; // Part of speech
  c_norm?: string;
  pos_family?: string;
  gender?: string;
  infap?: string; // First masculine irregular inflection in Pashto
  infaf?: string; // First masculine irregular inflection in Phonetics
  infbp?: string; // Base for second masculine/feminine irregular inflection in Pashto
  infbf?: string; // Base for second masculine/feminine irregular inflection in Phonetics
  noInf?: boolean; // Entry does not inflect?
}

/**
 * Generate Inflections from Dictionary Patterns
 * 
 * Uses LingDocs library's inflectWord function which automatically applies
 * dictionary inflection patterns (infap, infaf, infbp, infbf) to generate
 * all inflected forms for nouns and adjectives.
 * 
 * Based on LingDocs inflection patterns: https://dictionary.lingdocs.com/word?id=1527812931
 */

import { readFile } from 'fs/promises';
import { join } from 'path';
import { generateNounVariantsLingDocs } from '../app/utils/lingdocs_integration';

interface DictionaryEntry {
  p?: string; // Pashto word (base form)
  f?: string; // Phonetics
  c?: string; // Part of speech
  c_norm?: string;
  pos_family?: string;
  gender?: string;
  infap?: string; // First masculine irregular inflection in Pashto
  infaf?: string; // First masculine irregular inflection in Phonetics
  infbp?: string; // Base for second masculine/feminine irregular inflection in Pashto
  infbf?: string; // Base for second masculine/feminine irregular inflection in Phonetics
  noInf?: boolean; // Entry does not inflect?
}

/**
 * Build reverse index from dictionary using LingDocs library
 * This uses LingDocs.inflectWord() which applies inflection patterns automatically
 */
export async function buildReverseIndexFromDictionaryPatterns(): Promise<Map<string, string>> {
  console.log('📖 Building reverse index from dictionary using LingDocs library...');
  
  const dictPath = join(process.cwd(), 'app/data/full_dictionary_enriched.json');
  const content = await readFile(dictPath, 'utf-8');
  const data = JSON.parse(content);
  
  const entries = Array.isArray(data) ? data : (data.entries || []);
  
  const reverseIndex = new Map<string, string>();
  
  let processed = 0;
  let withPatterns = 0;
  let formsGenerated = 0;
  
  for (const entry of entries) {
    if (!entry.p) continue;
    
    const pos = [
      entry.c,
      entry.c_norm,
      entry.pos_family
    ].join(' ').toLowerCase();
    
    // Only process nouns and adjectives
    const isNoun = pos.includes('noun') || /\bn\./.test(pos);
    const isAdj = pos.includes('adj');
    
    if (!isNoun && !isAdj) continue;
    
    const baseForm = entry.p;
    
    try {
      // Use LingDocs library to generate all inflections
      // This automatically applies infap, infaf, infbp, infbf patterns
      const variants = await generateNounVariantsLingDocs(baseForm, { cap: 200 });
      
      // Map all forms back to base form
      for (const variant of variants) {
        if (variant.form) {
          const existing = reverseIndex.get(variant.form);
          if (!existing || baseForm.length < existing.length) {
            reverseIndex.set(variant.form, baseForm);
            formsGenerated++;
          }
        }
      }
      
      if (entry.infap || entry.infbp) {
        withPatterns++;
      }
      
      processed++;
      
      if (processed % 500 === 0) {
        process.stdout.write(`\r   Processed ${processed} entries (${withPatterns} with patterns, ${formsGenerated} forms generated)...`);
      }
      
      // Small delay to avoid overwhelming
      if (processed % 100 === 0) {
        await new Promise(resolve => setTimeout(resolve, 50));
      }
      
    } catch (error: any) {
      // If LingDocs fails, fall back to basic pattern matching
      if (entry.infap) {
        reverseIndex.set(entry.infap, baseForm);
        formsGenerated++;
      }
      if (entry.infbp) {
        reverseIndex.set(entry.infbp, baseForm);
        formsGenerated++;
      }
      processed++;
    }
  }
  
  console.log(`\n   Processed ${processed} nouns/adjectives`);
  console.log(`   Found ${withPatterns} entries with inflection patterns (infap/infbp)`);
  console.log(`   Generated ${formsGenerated} inflected forms`);
  console.log(`   Created reverse index with ${reverseIndex.size} form mappings`);
  
  return reverseIndex;
}

/**
 * Merge reverse indices (from cache and from dictionary patterns)
 */
export async function buildCompleteReverseIndex(): Promise<Map<string, string>> {
  console.log('🔄 Building complete reverse index...\n');
  
  // Step 1: Build from inflections cache
  const { buildReverseIndex } = await import('./build-reverse-inflection-index');
  const cacheIndex = await buildReverseIndex();
  
  // Step 2: Build from dictionary patterns
  const dictIndex = await buildReverseIndexFromDictionaryPatterns();
  
  // Step 3: Merge (dictionary patterns take precedence for conflicts)
  const merged = new Map<string, string>(cacheIndex);
  
  let added = 0;
  let updated = 0;
  
  for (const [form, baseForm] of dictIndex.entries()) {
    const existing = merged.get(form);
    if (!existing) {
      merged.set(form, baseForm);
      added++;
    } else if (baseForm.length < existing.length) {
      // Prefer shorter base form (more likely to be correct)
      merged.set(form, baseForm);
      updated++;
    }
  }
  
  console.log(`\n✅ Merged reverse index:`);
  console.log(`   From cache: ${cacheIndex.size} mappings`);
  console.log(`   From dictionary: ${dictIndex.size} mappings`);
  console.log(`   Added: ${added}, Updated: ${updated}`);
  console.log(`   Total: ${merged.size} mappings`);
  
  return merged;
}

if (require.main === module) {
  buildCompleteReverseIndex()
    .then(index => {
      // Test with examples
      const testWords = ['ټول', 'ټوله', 'ټولې', 'ټولو', 'اوږد', 'اوږده'];
      console.log('\n🧪 Testing reverse lookup:');
      for (const word of testWords) {
        const base = index.get(word);
        console.log(`   ${word} → ${base || 'NOT FOUND'}`);
      }
    })
    .catch(error => {
      console.error('❌ Failed:', error);
      process.exit(1);
    });
}

