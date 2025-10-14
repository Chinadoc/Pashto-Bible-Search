/**
 * LingDocs Integration Layer
 *
 * Provides verb and noun variants powered by the official LingDocs library.
 * Results are cached using the pre-generated LingDocs inflection cache for speed,
 * and augmented with frequency information where available.
 */

import type { Variant } from './verb_variants';

type LingDocsLibraryModule = typeof import('../../pashto-inflector/src/lib/dist/lib/library.cjs');

type CachedInflection = {
  form: string;
  romanization?: string;
  category?: string;
};

type CachedResources = {
  dictionaryByPashto: Map<string, any>;
  inflectionCache: Map<string, CachedInflection[]>;
  frequencyMap: Map<string, number>;
};

// ---------------------------------------------------------------------------
// Lazy resource loaders
// ---------------------------------------------------------------------------

let lingDocsLibraryPromise: Promise<LingDocsLibraryModule | null> | null = null;
let cachedResourcesPromise: Promise<CachedResources> | null = null;

async function loadLingDocsLibrary(): Promise<LingDocsLibraryModule | null> {
  if (!lingDocsLibraryPromise) {
    lingDocsLibraryPromise = import('../../pashto-inflector/src/lib/dist/lib/library.cjs')
      .then((mod) => {
        console.log('✅ LingDocs library loaded successfully');
        return mod;
      })
      .catch((error) => {
        console.warn('⚠️ LingDocs library not available (submodule issue), using fallback:', error.message);
        return null; // Return null instead of throwing
      });
  }
  return lingDocsLibraryPromise;
}

async function loadLingDocsResources(): Promise<CachedResources> {
  if (!cachedResourcesPromise) {
    cachedResourcesPromise = (async () => {
      const [fs, path] = await Promise.all([import('fs/promises'), import('path')]);

      const dictionaryPath = path.join(process.cwd(), 'app/data/full_dictionary_enriched.json');
      const inflectionCachePath = path.join(process.cwd(), 'app/data/inflections_cache.json');
      const frequencyPath = path.join(process.cwd(), 'app/data/word_frequency_list.json');

      const [dictionaryRaw, cacheRaw, frequencyRaw] = await Promise.all([
        fs.readFile(dictionaryPath, 'utf8'),
        fs.readFile(inflectionCachePath, 'utf8').catch(() => 'null'),
        fs.readFile(frequencyPath, 'utf8').catch(() => 'null'),
      ]);

      // Dictionary ----------------------------------------------------------
      const dictionaryJson = JSON.parse(dictionaryRaw ?? '{}');
      const dictionaryEntries: any[] = Array.isArray(dictionaryJson.entries) ? dictionaryJson.entries : [];
      const dictionaryByPashto = new Map<string, any>();
      for (const entry of dictionaryEntries) {
        if (entry?.p && !dictionaryByPashto.has(entry.p)) {
          dictionaryByPashto.set(entry.p, entry);
        }
      }

      // Inflection cache ----------------------------------------------------
      const inflectionCache = new Map<string, CachedInflection[]>();
      if (cacheRaw) {
        try {
          const cacheJson = JSON.parse(cacheRaw);
          if (cacheJson && typeof cacheJson === 'object') {
            for (const [lemma, rows] of Object.entries(cacheJson) as Array<[string, CachedInflection[]]>) {
              if (Array.isArray(rows) && rows.length) {
                inflectionCache.set(lemma, rows);
              }
            }
          }
          console.log(`📦 Loaded LingDocs cache with ${inflectionCache.size} entries`);
        } catch (err) {
          console.warn('⚠️ Failed to parse inflections cache:', err);
        }
      }

      // Frequency map -------------------------------------------------------
      const frequencyMap = new Map<string, number>();
      if (frequencyRaw) {
        try {
          const frequencyJson = JSON.parse(frequencyRaw);
          if (Array.isArray(frequencyJson)) {
            for (const row of frequencyJson) {
              const word = typeof row?.pashto === 'string' ? row.pashto : undefined;
              const value =
                typeof row?.frequency === 'number'
                  ? row.frequency
                  : Number.parseInt(String(row?.frequency ?? 0), 10);
              if (word) {
                frequencyMap.set(word, Number.isFinite(value) ? value : 0);
              }
            }
          }
        } catch (err) {
          console.warn('⚠️ Failed to parse frequency list:', err);
        }
      }

      return { dictionaryByPashto, inflectionCache, frequencyMap };
    })();
  }

  return cachedResourcesPromise;
}

// ---------------------------------------------------------------------------
// Shared helpers
// ---------------------------------------------------------------------------

function addOrUpdateVariant(map: Map<string, Variant>, incoming: Variant): void {
  const key = incoming.form;
  const existing = map.get(key);
  if (existing) {
    if (!existing.romanized && incoming.romanized) {
      existing.romanized = incoming.romanized;
    }
    if ((!existing.label || existing.label === 'LingDocs Form') && incoming.label) {
      existing.label = incoming.label;
    }
    if (!existing.count && incoming.count) {
      existing.count = incoming.count;
      existing.score = incoming.count;
    }
    return;
  }
  map.set(key, { ...incoming });
}

const LENGTH_LABELS: Record<string, string> = {
  long: 'long',
  short: 'short',
  mini: 'mini',
};

const PERSON_INFLECTION_LABELS: Record<string, string> = {
  mascSing: 'Masc SG',
  mascPlur: 'Masc PL',
  femSing: 'Fem SG',
  femPlur: 'Fem PL',
};

const PERSON_LABELS = ['1sg', '1pl', '2sg', '2pl', '3sg', '3pl'] as const;
const IMPERATIVE_LABELS = ['2sg', '2pl'] as const;

// ---------------------------------------------------------------------------
// Verb handling
// ---------------------------------------------------------------------------

function flattenVerbForms(conjugation: any, lemma: string): Variant[] {
  const variantMap = new Map<string, Variant>();

  const addVariant = (ps: { p?: string; f?: string }, label: string) => {
    const form = typeof ps?.p === 'string' ? ps.p.trim() : '';
    if (!form) return;
    const romanized = typeof ps?.f === 'string' ? ps.f : undefined;
    addOrUpdateVariant(variantMap, {
      form,
      label: label || 'LingDocs Form',
      pos: 'verb',
      romanized,
    });
  };

  const collectVerbBlock = (block: any, baseLabel: string, labels = PERSON_LABELS) => {
    if (!Array.isArray(block)) return;
    block.forEach((personLine: any, idx: number) => {
      if (!Array.isArray(personLine)) return;
      const personLabel = labels[idx] ?? '';
      personLine.forEach((forms: any) => {
        if (!Array.isArray(forms)) return;
        forms.forEach((ps) => addVariant(ps, personLabel ? `${personLabel} ${baseLabel}` : baseLabel));
      });
    });
  };

  const collectFromNode = (value: any, label: string) => {
    if (!value) return;

    if (Array.isArray(value)) {
      // Handle deeply nested arrays like modal.nonImperative.long[person][gender][length][form]
      if (value.length && Array.isArray(value[0])) {
        // Check if this is a verb block structure (6 persons × 2 genders × 2 lengths)
        if (value.length === 6 && value.every((item: any) => Array.isArray(item) && item.length === 2)) {
          // VerbBlock structure: [person1, person2, person3, person4, person5, person6]
          // Each person is [masc, fem], each gender is [long, short]
          const persons = ['1sg', '2sg', '3sg', '1pl', '2pl', '3pl'];
          const lengths = ['long', 'short'];

          value.forEach((personLine: any, personIdx: number) => {
            if (!Array.isArray(personLine) || personLine.length !== 2) return;

            const personLabel = persons[personIdx] || `${personIdx + 1}`;

            personLine.forEach((genderLine: any, genderIdx: number) => {
              if (!Array.isArray(genderLine) || genderLine.length !== 2) return;

              const genderLabel = genderIdx === 0 ? 'Masc' : 'Fem';

              genderLine.forEach((lengthLine: any, lengthIdx: number) => {
                if (!Array.isArray(lengthLine)) return;

                const lengthLabel = lengths[lengthIdx] || `Length${lengthIdx + 1}`;

                lengthLine.forEach((ps: any) => {
                  if (ps && typeof ps.p === 'string') {
                    addVariant(ps, `${personLabel} ${label} ${genderLabel} ${lengthLabel}`);
                  }
                });
              });
            });
          });
          return;
        }

        // Handle imperative blocks (2 persons × 2 genders × 2 lengths)
        if (value.length === 2 && value.every((item: any) => Array.isArray(item) && item.length === 2)) {
          const persons = ['2sg', '2pl'];

          value.forEach((personLine: any, personIdx: number) => {
            if (!Array.isArray(personLine) || personLine.length !== 2) return;

            const personLabel = persons[personIdx] || `${personIdx + 1}`;

            personLine.forEach((genderLine: any, genderIdx: number) => {
              if (!Array.isArray(genderLine) || genderLine.length !== 2) return;

              const genderLabel = genderIdx === 0 ? 'Masc' : 'Fem';

              genderLine.forEach((lengthLine: any, lengthIdx: number) => {
                if (!Array.isArray(lengthLine)) return;

                const lengthLabel = lengthIdx === 0 ? 'long' : 'short';

                lengthLine.forEach((ps: any) => {
                  if (ps && typeof ps.p === 'string') {
                    addVariant(ps, `${personLabel} Imperative ${genderLabel} ${lengthLabel}`);
                  }
                });
              });
            });
          });
          return;
        }
      }

      // Handle simple arrays
      value.forEach((item) => collectFromNode(item, label));
      return;
    }

    if (typeof value === 'object') {
      if (typeof value.p === 'string') {
        addVariant(value, label);
        return;
      }

      const keys = Object.keys(value);
      if (keys.some((k) => LENGTH_LABELS[k])) {
        for (const [key, nested] of Object.entries(value)) {
          if (!nested) continue;
          const nextLabel = LENGTH_LABELS[key] ? `${label} (${LENGTH_LABELS[key]})` : label;
          collectFromNode(nested, nextLabel);
        }
        return;
      }

      if (keys.some((k) => PERSON_INFLECTION_LABELS[k])) {
        for (const [key, nested] of Object.entries(value)) {
          if (!nested) continue;
          const nextLabel = PERSON_INFLECTION_LABELS[key] ? `${label} ${PERSON_INFLECTION_LABELS[key]}` : label;
          collectFromNode(nested, nextLabel);
        }
        return;
      }

      // Handle nested objects
      for (const nested of Object.values(value)) {
        collectFromNode(nested, label);
      }
    }
  };

  const collectVerbForm = (form: any, label: string) => {
    if (!form) return;
    collectFromNode(form, label);
  };

  // Add base form
  addVariant({ p: lemma, f: lemma }, 'Infinitive');

  // Extract all forms from the LingDocs conjugation structure
  collectFromNode(conjugation, 'LingDocs Form');

  // Also try the specific paths we know about
  if (conjugation?.modal?.nonImperative?.long) {
    collectFromNode(conjugation.modal.nonImperative.long, 'Present Ability');
  }
  if (conjugation?.modal?.nonImperative?.short) {
    collectFromNode(conjugation.modal.nonImperative.short, 'Present Ability (Short)');
  }

  if (conjugation?.imperfective?.nonImperative) {
    collectFromNode(conjugation.imperfective.nonImperative, 'Present');
  }
  if (conjugation?.perfective?.nonImperative) {
    collectFromNode(conjugation.perfective.nonImperative, 'Subjunctive');
  }

  if (conjugation?.participle?.past) {
    collectFromNode(conjugation.participle.past, 'Past Participle');
  }
  if (conjugation?.participle?.present) {
    collectFromNode(conjugation.participle.present, 'Present Participle');
  }

  return Array.from(variantMap.values());
}

// ---------------------------------------------------------------------------
// Noun handling
// ---------------------------------------------------------------------------

function flattenNounForms(inflection: any, lemma: string): Variant[] {
  const variantMap = new Map<string, Variant>();

  const addVariant = (ps: { p?: string; f?: string }, label = 'LingDocs Form') => {
    const form = typeof ps?.p === 'string' ? ps.p.trim() : '';
    if (!form) return;
    const romanized = typeof ps?.f === 'string' ? ps.f : undefined;
    addOrUpdateVariant(variantMap, {
      form,
      label,
      pos: 'noun',
      romanized,
    });
  };

  addVariant({ p: lemma }, 'Direct');

  const traverse = (node: any, label: string) => {
    if (!node) return;
    if (Array.isArray(node)) {
      node.forEach((item) => traverse(item, label));
      return;
    }
    if (typeof node === 'object') {
      if (typeof node.p === 'string') {
        addVariant(node, label);
        return;
      }
      for (const [key, value] of Object.entries(node)) {
        if (!value) continue;
        const nextLabel =
          key === 'masc'
            ? `${label} (Masc)`
            : key === 'fem'
              ? `${label} (Fem)`
              : label;
        traverse(value, nextLabel);
      }
    }
  };

  traverse(inflection, 'LingDocs Form');

  return Array.from(variantMap.values());
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export async function generateVerbVariantsLingDocs(
  rootOrInfinitive: string,
  opts?: { cap?: number; includeCompound?: boolean }
): Promise<Variant[]> {
  try {
    const LingDocs = await loadLingDocsLibrary();
    
    // Fallback when LingDocs library is not available
    if (!LingDocs) {
      console.warn(`⚠️ LingDocs library not available, returning empty variants for "${rootOrInfinitive}"`);
      return [];
    }
    
    const { dictionaryByPashto, inflectionCache, frequencyMap } = await loadLingDocsResources();

    const dictEntry = dictionaryByPashto.get(rootOrInfinitive);
    if (!dictEntry) {
      console.warn(`❌ Verb "${rootOrInfinitive}" not found in dictionary`);
      return [];
    }

    const verbEntry = {
      ...dictEntry,
      c: dictEntry.c || 'v.',
      f: dictEntry.f || dictEntry.p,
      g: dictEntry.g || dictEntry.f || dictEntry.p,
    };

    const conjugation = LingDocs.conjugateVerb(verbEntry);
    if (!conjugation) {
      console.warn(`❌ LingDocs conjugation failed for "${rootOrInfinitive}"`);
      return [];
    }

    const variants = flattenVerbForms(conjugation, rootOrInfinitive);
    const variantMap = new Map<string, Variant>();
    variants.forEach((variant) => addOrUpdateVariant(variantMap, variant));

    // Augment with cached LingDocs pre-generated forms
    const cachedRows = inflectionCache.get(rootOrInfinitive) ?? [];
    for (const row of cachedRows) {
      if (!row?.form) continue;
      addOrUpdateVariant(variantMap, {
        form: row.form,
        label: 'LingDocs Cached',
        pos: 'verb',
        romanized: row.romanization,
      });
    }

    for (const variant of variantMap.values()) {
      const frequency = frequencyMap.get(variant.form) ?? 0;
      variant.count = frequency;
      variant.score = frequency;
      if (!variant.label) variant.label = 'LingDocs Form';
    }

    const sorted = Array.from(variantMap.values()).sort((a, b) => (b.count ?? 0) - (a.count ?? 0));
    if (!sorted.length) {
      console.warn(`❌ LingDocs returned no variants for "${rootOrInfinitive}"`);
      return [];
    }

    const cap = Math.max(1, Math.min(opts?.cap ?? 80, 400));
    const baseVariant = variantMap.get(rootOrInfinitive);
    const remaining = sorted.filter((variant) => variant.form !== rootOrInfinitive);
    const ordered = baseVariant ? [baseVariant, ...remaining] : remaining;
    return ordered.slice(0, cap);
  } catch (error) {
    console.error(`❌ LingDocs verb generation failed for "${rootOrInfinitive}":`, error);
    return [];
  }
}

export async function generateNounVariantsLingDocs(
  rootOrLemma: string,
  opts?: { cap?: number }
): Promise<Variant[]> {
  try {
    const LingDocs = await loadLingDocsLibrary();
    
    // Fallback when LingDocs library is not available
    if (!LingDocs) {
      console.warn(`⚠️ LingDocs library not available, returning empty variants for "${rootOrLemma}"`);
      return [];
    }
    
    const { dictionaryByPashto, inflectionCache, frequencyMap } = await loadLingDocsResources();

    const dictEntry = dictionaryByPashto.get(rootOrLemma);
    if (!dictEntry) {
      console.warn(`❌ Noun "${rootOrLemma}" not found in dictionary`);
      return [];
    }

    const nounEntry = {
      ...dictEntry,
      c: dictEntry.c || 'n.',
      f: dictEntry.f || dictEntry.p,
      g: dictEntry.g || dictEntry.f || dictEntry.p,
    };

    const inflection = LingDocs.inflectWord(nounEntry);
    if (!inflection) {
      console.warn(`❌ LingDocs inflection failed for "${rootOrLemma}"`);
      return [];
    }

    const variants = flattenNounForms(inflection, rootOrLemma);
    const variantMap = new Map<string, Variant>();
    variants.forEach((variant) => addOrUpdateVariant(variantMap, variant));

    const cachedRows = inflectionCache.get(rootOrLemma) ?? [];
    for (const row of cachedRows) {
      if (!row?.form) continue;
      addOrUpdateVariant(variantMap, {
        form: row.form,
        label: 'LingDocs Cached',
        pos: 'noun',
        romanized: row.romanization,
      });
    }

    for (const variant of variantMap.values()) {
      const frequency = frequencyMap.get(variant.form) ?? 0;
      variant.count = frequency;
      variant.score = frequency;
      if (!variant.label) variant.label = 'LingDocs Form';
    }

    const sorted = Array.from(variantMap.values()).sort((a, b) => (b.count ?? 0) - (a.count ?? 0));
    if (!sorted.length) {
      console.warn(`❌ LingDocs returned no variants for "${rootOrLemma}"`);
      return [];
    }

    const cap = Math.max(1, Math.min(opts?.cap ?? 60, 200));
    const baseVariant = variantMap.get(rootOrLemma);
    const remaining = sorted.filter((variant) => variant.form !== rootOrLemma);
    const ordered = baseVariant ? [baseVariant, ...remaining] : remaining;
    return ordered.slice(0, cap);
  } catch (error) {
    console.error(`❌ LingDocs noun generation failed for "${rootOrLemma}":`, error);
    return [];
  }
}

export function isPashtoWord(word: string): boolean {
  const pashtoRegex = /[\u0600-\u06FF\uFB50-\uFDFF]/;
  return pashtoRegex.test(word);
}

export function normalizePashtoText(text: string): string {
  return text.trim().replace(/\u200c/g, '').replace(/\u200d/g, '').replace(/\s+/g, ' ');
}
