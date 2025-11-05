/**
 * LingDocs Integration Layer
 *
 * Provides verb and noun variants powered by the official LingDocs library.
 * Results are cached using the pre-generated LingDocs inflection cache for speed,
 * and augmented with frequency information where available.
 */

import type { Variant } from './verb_variants';

// Conditional import type to avoid build errors when LingDocs is not available
type LingDocsLibraryModule = any | null;

type CachedInflection = {
  form: string;
  romanization?: string;
  category?: string;
};

type DictionaryEntry = {
  p?: string;
  f?: string;
  g?: string;
  c?: string;
  c_norm?: string;
  pos_family?: string;
  pos?: string;
  e?: string;
  gender?: string;
  ppp?: string;
  ppf?: string;
  infap?: string;
  infaf?: string;
  ts?: number;
};

type CachedResources = {
  dictionaryByPashto: Map<string, DictionaryEntry>;
  dictionaryVariantsByPashto: Map<string, DictionaryEntry[]>;
  inflectionCache: Map<string, CachedInflection[]>;
  frequencyMap: Map<string, number>;
};

// ---------------------------------------------------------------------------
// Lazy resource loaders
// ---------------------------------------------------------------------------

let lingDocsLibraryPromise: Promise<LingDocsLibraryModule> | null = null;
let cachedResourcesPromise: Promise<CachedResources> | null = null;

async function loadLingDocsLibrary(): Promise<LingDocsLibraryModule> {
  if (!lingDocsLibraryPromise) {
    lingDocsLibraryPromise = (async () => {
      try {
        // Use dynamic import with proper path resolution
        const fs = await import('fs');
        const path = await import('path');

        // Try different possible paths for the LingDocs library
        const possiblePaths = [
          path.join(process.cwd(), '../pashto-inflector/src/lib/dist/lib/library.cjs'),
          path.join(process.cwd(), '../../pashto-inflector/src/lib/dist/lib/library.cjs'),
          path.join(process.cwd(), 'pashto-inflector/src/lib/dist/lib/library.cjs'),
        ];

        let libPath = null;
        for (const testPath of possiblePaths) {
          if (fs.existsSync(testPath)) {
            libPath = testPath;
            break;
          }
        }

        if (!libPath) {
          throw new Error(`LingDocs library not found in any of: ${possiblePaths.join(', ')}`);
        }

        console.log('🔍 Loading LingDocs library from:', libPath);
        const { pathToFileURL } = await import('url');
        const moduleUrl = pathToFileURL(libPath).href;
        const mod = await import(/* webpackIgnore: true */ moduleUrl);
        console.log('✅ LingDocs library loaded successfully');
        return mod;
      } catch (error) {
        console.error('❌ Failed to load LingDocs library:', error);
        console.warn('⚠️ Falling back to pattern-based generation');
        return null; // Return null instead of throwing
      }
    })();
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
      const dictionaryEntries: DictionaryEntry[] = Array.isArray(dictionaryJson.entries) ? dictionaryJson.entries : [];
      const dictionaryByPashto = new Map<string, DictionaryEntry>();
      const dictionaryVariantsByPashto = new Map<string, DictionaryEntry[]>();
      for (const entry of dictionaryEntries) {
        if (!entry?.p) continue;
        if (!dictionaryByPashto.has(entry.p)) {
          dictionaryByPashto.set(entry.p, entry);
        }
        const variants = dictionaryVariantsByPashto.get(entry.p) ?? [];
        variants.push(entry);
        dictionaryVariantsByPashto.set(entry.p, variants);
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

      return { dictionaryByPashto, dictionaryVariantsByPashto, inflectionCache, frequencyMap };
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
    const existingLabel = existing.label ?? '';
    const incomingLabel = incoming.label ?? '';
    const existingIsGeneric =
      !existingLabel ||
      existingLabel.includes('LingDocs');
    const incomingIsGeneric = incomingLabel.includes('LingDocs');
    if (existingIsGeneric && incoming.label && (!incomingIsGeneric || !existingLabel)) {
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

const PERSON_LABELS = ['1sg', '2sg', '3sg', '1pl', '2pl', '3pl'] as const;
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
    const flattenForms = (input: any): any[] => {
      if (!input) return [];
      if (Array.isArray(input)) {
        const acc: any[] = [];
        input.forEach((item) => {
          acc.push(...flattenForms(item));
        });
        return acc;
      }
      return [input];
    };

    block.forEach((personLine: any, idx: number) => {
      if (!Array.isArray(personLine)) return;
      const personLabel = labels[idx] ?? '';
      personLine.forEach((forms: any) => {
        const labelPrefix = personLabel ? `${personLabel} ${baseLabel}` : baseLabel;
        flattenForms(forms).forEach((ps) => {
          if (ps && typeof ps.p === 'string') {
            addVariant(ps, labelPrefix);
          }
        });
      });
    });
  };

  const collectFromNode = (value: any, label: string) => {
    if (!value) return;

    if (Array.isArray(value)) {
      // Handle verb blocks where each index corresponds to a person (and optional gender/length nesting)
      if (value.length === 6 && value.every((item: any) => Array.isArray(item))) {
        collectVerbBlock(value, label, PERSON_LABELS);
        return;
      }

      // Handle imperative blocks (usually two persons: 2sg, 2pl)
      if (value.length === 2 && value.every((item: any) => Array.isArray(item))) {
        collectVerbBlock(value, label, IMPERATIVE_LABELS);
        return;
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
    if (!LingDocs) {
      console.warn('⚠️ LingDocs library not available, returning empty variants');
      return [];
    }
    
    const { dictionaryByPashto, dictionaryVariantsByPashto, inflectionCache, frequencyMap } = await loadLingDocsResources();

    const dictEntry = resolveDictionaryEntry(rootOrInfinitive, 'verb', dictionaryByPashto, dictionaryVariantsByPashto);
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
    if (!LingDocs) {
      console.warn('⚠️ LingDocs library not available, returning empty variants');
      return [];
    }
    
    const { dictionaryByPashto, dictionaryVariantsByPashto, inflectionCache, frequencyMap } = await loadLingDocsResources();

    const dictEntry = resolveDictionaryEntry(rootOrLemma, 'noun', dictionaryByPashto, dictionaryVariantsByPashto);
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

type TargetPos = 'noun' | 'verb' | 'adjective' | 'other';

function classifyPos(entry: DictionaryEntry | null | undefined): TargetPos {
  if (!entry) return 'other';
  const parts = [
    typeof entry.pos === 'string' ? entry.pos : '',
    typeof entry.c === 'string' ? entry.c : '',
    typeof entry.c_norm === 'string' ? entry.c_norm : '',
    typeof entry.pos_family === 'string' ? entry.pos_family : '',
  ]
    .join(' ')
    .toLowerCase();

  if (parts.includes('verb') || /\bv\./.test(parts)) return 'verb';
  if (parts.includes('noun') || /\bn\./.test(parts)) return 'noun';
  if (parts.includes('adj')) return 'adjective';
  return 'other';
}

function scoreEntry(entry: DictionaryEntry, target: TargetPos): number {
  let score = 0;
  const pos = classifyPos(entry);

  if (pos === target) {
    score += 100;
  } else if (target === 'noun' && pos === 'other') {
    // Still allow nouns that might be marked differently (e.g., anim.)
    score += 15;
  } else if (target === 'verb' && pos === 'other') {
    score += 10;
  } else if (pos !== target) {
    score -= 10;
  }

  if (target === 'noun') {
    if (entry.ppp || entry.ppf) score += 25;
    const descriptor = [entry.c, entry.c_norm, entry.pos_family].join(' ').toLowerCase();
    if (descriptor.includes('anim')) score += 5;
    if (descriptor.includes('fam')) score += 5;
  }

  if (target === 'verb') {
    const descriptor = [entry.c, entry.c_norm, entry.pos_family].join(' ').toLowerCase();
    if (descriptor.includes('compound')) score += 3;
  }

  if (target === 'adjective') {
    const descriptor = [entry.c, entry.c_norm, entry.pos_family].join(' ').toLowerCase();
    if (descriptor.includes('adj')) score += 20;
  }

  return score;
}

function resolveDictionaryEntry(
  word: string,
  target: TargetPos,
  primaryMap: Map<string, DictionaryEntry>,
  variantsMap: Map<string, DictionaryEntry[]>
): DictionaryEntry | undefined {
  const candidates = variantsMap.get(word);
  if (Array.isArray(candidates) && candidates.length > 0) {
    let best: DictionaryEntry | undefined;
    let bestScore = -Infinity;

    for (const candidate of candidates) {
      if (!candidate) continue;
      const score = scoreEntry(candidate, target);
      if (score > bestScore) {
        bestScore = score;
        best = candidate;
      }
    }

    if (best) return best;
  }

  return primaryMap.get(word);
}
