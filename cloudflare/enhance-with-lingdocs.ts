/**
 * Enhance Reverse Index with LingDocs Library Generation
 * 
 * Uses LingDocs library to generate all forms for dictionary entries,
 * then adds them to the reverse index. This catches forms not in the cache.
 */

import { readFile } from 'fs/promises';
import { join } from 'path';
import { generateVerbVariantsLingDocs, generateNounVariantsLingDocs } from '../app/utils/lingdocs_integration';

interface DictionaryEntry {
  p?: string; // Pashto word (base form)
  f?: string; // Phonetics
  c?: string; // Part of speech
  c_norm?: string; // Normalized POS
  pos_family?: string; // POS family
  psp?: string; // Imperfective stem (verbs)
  ssp?: string; // Perfective stem (verbs)
  prp?: string; // Perfective root (verbs)
  ts?: number; // Timestamp (dictionary ID)
}

/**
 * Load dictionary entries
 */
async function loadDictionary(): Promise<Map<string, DictionaryEntry>> {
  const dictPath = join(process.cwd(), 'app/data/full_dictionary_enriched.json');
  const content = await readFile(dictPath, 'utf-8');
  const data = JSON.parse(content);
  
  const entries = Array.isArray(data) ? data : (data.entries || []);
  const dictMap = new Map<string, DictionaryEntry>();
  
  for (const entry of entries) {
    if (entry.p) {
      if (!dictMap.has(entry.p)) {
        dictMap.set(entry.p, entry);
      }
    }
  }
  
  console.log(`📚 Loaded ${dictMap.size} dictionary entries`);
  return dictMap;
}

/**
 * Classify entry as verb, noun, or other
 */
function classifyEntry(entry: DictionaryEntry): 'verb' | 'noun' | 'adjective' | 'other' {
  const pos = [
    entry.c,
    entry.c_norm,
    entry.pos_family
  ].join(' ').toLowerCase();
  
  if (pos.includes('verb') || /\bv\./.test(pos)) return 'verb';
  if (pos.includes('noun') || /\bn\./.test(pos)) return 'noun';
  if (pos.includes('adj')) return 'adjective';
  return 'other';
}

/**
 * Enhance reverse index with LingDocs-generated forms
 */
export async function enhanceReverseIndex(
  reverseIndex: Map<string, string>,
  dictionary: Map<string, DictionaryEntry>,
  limit?: number
): Promise<Map<string, string>> {
  console.log('\n🔍 Enhancing reverse index with LingDocs library...');
  
  const entries = Array.from(dictionary.entries());
  const processed = limit ? entries.slice(0, limit) : entries;
  
  let added = 0;
  let skipped = 0;
  
  for (let i = 0; i < processed.length; i++) {
    const [baseForm, entry] = processed[i];
    
    if (!baseForm) continue;
    
    const posType = classifyEntry(entry);
    
    try {
      let variants: Array<{form: string}> = [];
      
      if (posType === 'verb') {
        const verbVariants = await generateVerbVariantsLingDocs(baseForm, { cap: 200 });
        variants = verbVariants.map(v => ({ form: v.form }));
      } else if (posType === 'noun' || posType === 'adjective') {
        const nounVariants = await generateNounVariantsLingDocs(baseForm, { cap: 100 });
        variants = nounVariants.map(v => ({ form: v.form }));
      }
      
      // Add variants to reverse index
      for (const variant of variants) {
        if (variant.form && variant.form !== baseForm) {
          const existing = reverseIndex.get(variant.form);
          if (!existing || baseForm.length < existing.length) {
            reverseIndex.set(variant.form, baseForm);
            added++;
          }
        }
      }
      
      if ((i + 1) % 100 === 0) {
        process.stdout.write(`\r   Processed ${i + 1}/${processed.length} entries (added ${added} forms)...`);
      }
      
      // Small delay to avoid overwhelming the system
      if ((i + 1) % 50 === 0) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
    } catch (error: any) {
      skipped++;
      if (skipped < 10) {
        console.warn(`\n   ⚠️  Skipped ${baseForm}: ${error.message.substring(0, 50)}`);
      }
    }
  }
  
  console.log(`\n✅ Enhanced reverse index: added ${added} forms, skipped ${skipped} entries`);
  console.log(`   Total mappings: ${reverseIndex.size}`);
  
  return reverseIndex;
}

/**
 * Main function to build and enhance reverse index
 */
export async function buildEnhancedReverseIndex(limit?: number): Promise<Map<string, string>> {
  // Step 1: Build base reverse index from cache
  const { buildReverseIndex } = await import('./build-reverse-inflection-index');
  const reverseIndex = await buildReverseIndex();
  
  // Step 2: Load dictionary
  const dictionary = await loadDictionary();
  
  // Step 3: Enhance with LingDocs
  const enhanced = await enhanceReverseIndex(reverseIndex, dictionary, limit);
  
  return enhanced;
}

if (require.main === module) {
  const limit = process.argv[2] ? parseInt(process.argv[2], 10) : undefined;
  
  buildEnhancedReverseIndex(limit)
    .then(index => {
      console.log('\n✅ Enhanced reverse index built successfully');
      console.log(`   Total mappings: ${index.size}`);
      
      // Test with examples
      const testWords = ['ټول', 'ټوله', 'ټولې', 'ټولو', 'وهل', 'وهم', 'ووهل'];
      console.log('\n🧪 Testing enhanced reverse lookup:');
      for (const word of testWords) {
        const base = index.get(word);
        console.log(`   ${word} → ${base || 'NOT FOUND'}`);
      }
    })
    .catch(error => {
      console.error('❌ Failed to build enhanced reverse index:', error);
      process.exit(1);
    });
}

