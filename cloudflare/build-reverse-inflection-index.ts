/**
 * Build Reverse Inflection Index from Inflections Cache
 * 
 * Creates a reverse index: Map<inflectedForm, baseForm>
 * This allows us to look up the base form for any inflected/conjugated form
 */

import { readFile } from 'fs/promises';
import { join } from 'path';

interface InflectionCacheEntry {
  form: string;
  romanization?: string;
  category?: string;
}

type InflectionsCache = Record<string, InflectionCacheEntry[]>;

/**
 * Build reverse index from inflections cache
 * Returns: Map<inflectedForm, baseForm>
 */
export async function buildReverseIndex(): Promise<Map<string, string>> {
  console.log('📖 Loading inflections cache...');
  
  const cachePath = join(process.cwd(), 'app/data/inflections_cache.json');
  const cacheContent = await readFile(cachePath, 'utf-8');
  const cache: InflectionsCache = JSON.parse(cacheContent);
  
  console.log(`   Loaded ${Object.keys(cache).length} base forms`);
  
  const reverseIndex = new Map<string, string>();
  
  // For each base form (lemma), map all its inflected forms back to the base
  for (const [baseForm, inflections] of Object.entries(cache)) {
    if (!baseForm || !Array.isArray(inflections)) continue;
    
    // The base form maps to itself
    reverseIndex.set(baseForm, baseForm);
    
    // Map each inflected form to its base
    for (const inflection of inflections) {
      if (inflection?.form && inflection.form !== baseForm) {
        // If multiple base forms generate the same inflected form,
        // prefer the base form that's shorter or more common
        const existing = reverseIndex.get(inflection.form);
        if (!existing || baseForm.length < existing.length) {
          reverseIndex.set(inflection.form, baseForm);
        }
      }
    }
  }
  
  console.log(`   Created reverse index with ${reverseIndex.size} form mappings`);
  
  return reverseIndex;
}

/**
 * Build reverse index with category information
 * Returns: Map<inflectedForm, {baseForm: string, category: string}>
 */
export async function buildReverseIndexWithCategory(): Promise<Map<string, {baseForm: string; category?: string}>> {
  console.log('📖 Loading inflections cache with categories...');
  
  const cachePath = join(process.cwd(), 'app/data/inflections_cache.json');
  const cacheContent = await readFile(cachePath, 'utf-8');
  const cache: InflectionsCache = JSON.parse(cacheContent);
  
  console.log(`   Loaded ${Object.keys(cache).length} base forms`);
  
  const reverseIndex = new Map<string, {baseForm: string; category?: string}>();
  
  for (const [baseForm, inflections] of Object.entries(cache)) {
    if (!baseForm || !Array.isArray(inflections)) continue;
    
    // The base form maps to itself
    reverseIndex.set(baseForm, { baseForm, category: 'base' });
    
    // Map each inflected form to its base
    for (const inflection of inflections) {
      if (inflection?.form && inflection.form !== baseForm) {
        const existing = reverseIndex.get(inflection.form);
        if (!existing || baseForm.length < existing.baseForm.length) {
          reverseIndex.set(inflection.form, {
            baseForm,
            category: inflection.category || 'unknown'
          });
        }
      }
    }
  }
  
  console.log(`   Created reverse index with ${reverseIndex.size} form mappings`);
  
  return reverseIndex;
}

/**
 * Handle compound verbs - both spaced and fused forms
 * Example: "منډه وهل" (spaced) and "منډهوهل" (fused)
 */
export function normalizeCompoundVerb(form: string): string[] {
  const variants: string[] = [form];
  
  // If form contains space, try fused version
  if (form.includes(' ')) {
    variants.push(form.replace(/\s+/g, ''));
  }
  
  // If form doesn't contain space, try adding space before common verb endings
  const verbEndings = ['وهل', 'کول', 'کېدل', 'ېدل', 'کړل'];
  for (const ending of verbEndings) {
    if (form.endsWith(ending) && form.length > ending.length) {
      const mainPart = form.slice(0, -ending.length);
      variants.push(`${mainPart} ${ending}`);
    }
  }
  
  return variants;
}

/**
 * Find base form for a given word, handling compound verbs
 */
export async function findBaseForm(
  word: string,
  reverseIndex: Map<string, string>
): Promise<string | null> {
  // Direct lookup
  const direct = reverseIndex.get(word);
  if (direct) return direct;
  
  // Try compound verb variants
  const variants = normalizeCompoundVerb(word);
  for (const variant of variants) {
    const found = reverseIndex.get(variant);
    if (found) return found;
  }
  
  return null;
}

if (require.main === module) {
  buildReverseIndex()
    .then(index => {
      console.log('\n✅ Reverse index built successfully');
      console.log(`   Total mappings: ${index.size}`);
      
      // Test with a few examples
      const testWords = ['ټول', 'ټوله', 'ټولې', 'ټولو', 'وهل', 'وهم'];
      console.log('\n🧪 Testing reverse lookup:');
      for (const word of testWords) {
        const base = index.get(word);
        console.log(`   ${word} → ${base || 'NOT FOUND'}`);
      }
    })
    .catch(error => {
      console.error('❌ Failed to build reverse index:', error);
      process.exit(1);
    });
}

