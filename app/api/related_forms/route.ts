/**
 * Get Related Forms (Inflections/Conjugations) from D1
 * 
 * This endpoint queries D1 for inflections, handling:
 * - Verbs (using verbs_lexicon/irregular_verbs)
 * - Nouns (using nouns_lexicon + LingDocs patterns)
 * - Adjectives (using LingDocs inflection patterns)
 * - Translation demarcation (Afghan 2023 vs Yousafzai)
 * - POS tagging from LingDocs and D1
 */

import { NextRequest, NextResponse } from 'next/server';
import { getLightweightData } from '@/app/lib/data/load';
import { generateNounVariantsLingDocs, generateVerbVariantsLingDocs } from '@/app/utils/lingdocs_integration';
import { generateNounVariants } from '@/app/utils/noun_variants';
import { generateVerbVariants } from '@/app/utils/verb_variants';
import { getD1ClientOrThrow, getPOSMetadata } from '@/utils/d1-helpers';
import type { VariantWithPOS, POSSummary, PartOfSpeech, POSMetadata } from '@/types/search';
import { readFileSync } from 'fs';
import { join } from 'path';

const CLOUDFLARE_WORKER_URL = process.env.NEXT_PUBLIC_CLOUDFLARE_WORKER_URL || 'https://pashtobiblesearch.jeremy-samuels17.workers.dev';

// Load LingDocs POS map
let lingdocsPosMap: Record<string, any> | null = null;
function getLingDocsPosMap(): Record<string, any> {
  if (lingdocsPosMap) return lingdocsPosMap;
  
  try {
    const mapPath = join(process.cwd(), 'app', 'data', 'lingdocs_pos_map.json');
    const mapData = readFileSync(mapPath, 'utf-8');
    lingdocsPosMap = JSON.parse(mapData);
    return lingdocsPosMap || {};
  } catch (error) {
    console.warn('⚠️ Failed to load LingDocs POS map:', error);
    return {};
  }
}

type Variant = VariantWithPOS & {
  inflectionReasons?: {
    plural: number;
    sandwich: number;
    transitive_past: number;
    sandwich_types: string[];
  };
};

type RelatedFormsResponse = {
  root: string;
  searchedForm?: string;
  forms: { nouns?: Variant[]; verbs?: Variant[]; adjectives?: Variant[]; other?: Variant[] };
  total: number;
  variantDetails?: any;
  ms: number;
  posGuess?: PartOfSpeech;
  translation?: 'afghan2023' | 'yousafzai2019';
  posSummary?: POSSummary;
  metadata?: {
    hasMultiplePos: boolean;
    primaryPos: string;
    totalFormsByPos: {
      nouns: number;
      verbs: number;
      adjectives: number;
      other: number;
    };
    generationStrategy: string;
    reverseLookup?: boolean;
    source: 'd1' | 'lingdocs' | 'fallback';
  };
};

/**
 * Enrich variant with POS metadata from LingDocs and D1
 */
async function enrichVariantWithPOS(
  variant: Variant,
  db: any
): Promise<Variant> {
  const lingdocsMap = getLingDocsPosMap();
  const lingdocsEntry = lingdocsMap[variant.form];
  
  // Get D1 POS metadata
  let d1Metadata: POSMetadata | null = null;
  try {
    if (db) {
      d1Metadata = await getPOSMetadata(db, variant.form);
    }
  } catch (error) {
    console.warn(`Failed to get D1 POS for "${variant.form}":`, error);
  }
  
  // Determine POS from multiple sources
  let detectedPos: PartOfSpeech = variant.pos as PartOfSpeech;
  const sources: string[] = [];
  
  // Priority: D1 > LingDocs > existing variant.pos
  if (d1Metadata) {
    detectedPos = Array.isArray(d1Metadata.pos) ? d1Metadata.pos[0] : d1Metadata.pos;
    sources.push('d1');
  } else if (lingdocsEntry) {
    const lingdocsPos = Array.isArray(lingdocsEntry.pos) ? lingdocsEntry.pos[0] : lingdocsEntry.pos;
    if (lingdocsPos) {
      detectedPos = lingdocsPos as PartOfSpeech;
    }
    sources.push('lingdocs');
  } else if (variant.pos) {
    detectedPos = variant.pos as PartOfSpeech;
    sources.push('variant');
  }
  
  // Build merged POS metadata
  const posMetadata: POSMetadata = {
    pos: detectedPos,
    source: sources.length > 1 ? 'merged' : (sources[0] === 'd1' ? 'd1' : 'lingdocs'),
  };
  
  if (lingdocsEntry) {
    posMetadata.lingdocsId = lingdocsEntry.lingdocsId;
    if (lingdocsEntry.transitivity) posMetadata.transitivity = lingdocsEntry.transitivity;
    if (lingdocsEntry.verbType) posMetadata.verbType = lingdocsEntry.verbType;
    if (lingdocsEntry.gender) posMetadata.gender = lingdocsEntry.gender;
  }
  
  if (d1Metadata) {
    posMetadata.d1Lemma = d1Metadata.d1Lemma;
    if (d1Metadata.transitivity) posMetadata.transitivity = d1Metadata.transitivity;
    if (d1Metadata.verbType) posMetadata.verbType = d1Metadata.verbType;
    if (d1Metadata.gender) posMetadata.gender = d1Metadata.gender;
    if (d1Metadata.nounInflectionType) posMetadata.nounInflectionType = d1Metadata.nounInflectionType;
  }
  
  return {
    ...variant,
    pos: detectedPos,
    posMetadata,
    sources: sources.length > 0 ? sources : ['unknown'],
  };
}

/**
 * Calculate POS summary from variants
 */
function calculatePOSSummary(variants: Variant[]): POSSummary {
  const summary: POSSummary = {};
  
  for (const variant of variants) {
    const pos = variant.pos;
    if (!summary[pos]) {
      summary[pos] = {
        count: 0,
        sources: { lingdocs: 0, d1: 0 },
      };
    }
    
    summary[pos].count++;
    
    if (variant.sources) {
      if (variant.sources.includes('lingdocs')) summary[pos].sources.lingdocs++;
      if (variant.sources.includes('d1')) summary[pos].sources.d1++;
    }
  }
  
  return summary;
}
async function getInflectionsFromD1(
  baseWord: string,
  translation?: 'afghan2023' | 'yousafzai2019'
): Promise<Variant[]> {
  try {
    const response = await fetch(
      `${CLOUDFLARE_WORKER_URL}/api/inflections?base_word=${encodeURIComponent(baseWord)}`
    );

    if (!response.ok) {
      return [];
    }

    const data = await response.json();
    const inflections = data.inflections || [];

    return inflections.map((inf: any) => {
      const grammaticalInfo = typeof inf.grammatical_info === 'string' 
        ? JSON.parse(inf.grammatical_info) 
        : inf.grammatical_info || {};

      // Determine POS from grammatical_info
      let pos: 'noun' | 'verb' | 'adjective' | 'other' = 'other';
      if (grammaticalInfo.category === 'verb') pos = 'verb';
      else if (grammaticalInfo.category === 'noun') pos = 'noun';
      else if (grammaticalInfo.category === 'adjective') pos = 'adjective';

      // Build label from grammatical_info
      let label = inf.inflected_form;
      if (grammaticalInfo.tense) {
        label = `${grammaticalInfo.person || ''} ${grammaticalInfo.tense}`.trim();
      } else if (grammaticalInfo.label) {
        label = grammaticalInfo.label;
      }

      return {
        form: inf.inflected_form,
        label,
        pos,
        count: inf.frequency || 0,
        score: inf.frequency || 0,
        flags: ['d1'],
      };
    });
  } catch (error) {
    console.warn(`⚠️ D1 inflections query failed for "${baseWord}":`, error);
    return [];
  }
}

/**
 * Get base word from inflected form using D1
 */
async function getBaseWordFromD1(form: string): Promise<string | null> {
  try {
    const response = await fetch(
      `${CLOUDFLARE_WORKER_URL}/api/inflections/reverse?form=${encodeURIComponent(form)}`
    );

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data.base_word || null;
  } catch (error) {
    console.warn(`⚠️ D1 reverse lookup failed for "${form}":`, error);
    return null;
  }
}

/**
 * Get verb data from D1
 */
async function getVerbDataFromD1(root: string): Promise<any> {
  try {
    const response = await fetch(
      `${CLOUDFLARE_WORKER_URL}/api/verbs/${encodeURIComponent(root)}`
    );

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data.verb || null;
  } catch (error) {
    console.warn(`⚠️ D1 verb data query failed for "${root}":`, error);
    return null;
  }
}

/**
 * Get noun data from D1
 */
async function getNounDataFromD1(word: string): Promise<any> {
  try {
    const response = await fetch(
      `${CLOUDFLARE_WORKER_URL}/api/nouns/${encodeURIComponent(word)}`
    );

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data.noun || null;
  } catch (error) {
    console.warn(`⚠️ D1 noun data query failed for "${word}":`, error);
    return null;
  }
}

/**
 * Get verse references for a form from D1
 */
async function getVerseRefsFromD1(form: string): Promise<string[]> {
  try {
    const response = await fetch(
      `${CLOUDFLARE_WORKER_URL}/api/form-occurrences?form=${encodeURIComponent(form)}`
    );

    if (!response.ok) {
      return [];
    }

    const data = await response.json();
    const verseRefs = typeof data.verse_refs === 'string' 
      ? JSON.parse(data.verse_refs) 
      : data.verse_refs || [];
    
    return Array.isArray(verseRefs) ? verseRefs : [];
  } catch (error) {
    console.warn(`⚠️ D1 verse refs query failed for "${form}":`, error);
    return [];
  }
}

/**
 * Get inflection reasons for a form from D1
 */
async function getInflectionReasonsFromD1(
  form: string,
  translation?: 'afghan2023' | 'yousafzai2019'
): Promise<{
  plural: number;
  sandwich: number;
  transitive_past: number;
  sandwich_types: string[];
} | null> {
  try {
    const params = new URLSearchParams({
      form,
    });
    if (translation) {
      params.append('translation', translation);
    }

    const response = await fetch(
      `${CLOUDFLARE_WORKER_URL}/api/inflection-reasons?${params}`
    );

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    if (data.reasons && data.reasons.length > 0) {
      const aggregated = data.reasons[0];
      return aggregated.reasons;
    }
    
    return null;
  } catch (error) {
    console.warn(`⚠️ D1 inflection reasons query failed for "${form}":`, error);
    return null;
  }
}

/**
 * Generate adjective inflections using LingDocs patterns
 * Based on: https://grammar.lingdocs.com/inflection/inflection-patterns/
 */
async function generateAdjectiveInflections(baseWord: string): Promise<Variant[]> {
  const forms: Variant[] = [];
  
  // Base form
  forms.push({
    form: baseWord,
    label: 'Base',
    pos: 'adjective',
    sources: [], // Will be enriched later
    count: 0,
    score: 0,
  });

  // Pattern 1: Basic consonant ending (masculine)
  // Example: مفرد → مفرده (feminine), مفردې (oblique), مفردو (plural)
  if (!baseWord.endsWith('ه') && !baseWord.endsWith('ی') && !baseWord.endsWith('ې')) {
    forms.push(
      { form: baseWord + 'ه', label: 'Feminine', pos: 'adjective', sources: [], count: 0, score: 0 },
      { form: baseWord + 'ې', label: 'Oblique', pos: 'adjective', sources: [], count: 0, score: 0 },
      { form: baseWord + 'و', label: 'Plural', pos: 'adjective', sources: [], count: 0, score: 0 }
    );
  }

  // Pattern 1: Feminine ending in ه
  // Example: اندازه → اندازه (base), اندازې (oblique), اندازو (plural)
  if (baseWord.endsWith('ه')) {
    const stem = baseWord.slice(0, -1);
    forms.push(
      { form: stem + 'ې', label: 'Oblique', pos: 'adjective', sources: [], count: 0, score: 0 },
      { form: stem + 'و', label: 'Plural', pos: 'adjective', sources: [], count: 0, score: 0 }
    );
  }

  // Pattern 3: Stressed ی ending
  // Example: سوری → سوري (oblique), سوریو (plural)
  if (baseWord.endsWith('ی')) {
    const stem = baseWord.slice(0, -1);
    forms.push(
      { form: stem + 'ي', label: 'Oblique', pos: 'adjective', sources: [], count: 0, score: 0 },
      { form: stem + 'یو', label: 'Plural', pos: 'adjective', sources: [], count: 0, score: 0 }
    );
  }

  return forms;
}

export async function POST(req: NextRequest) {
  const startedAt = Date.now();
  try {
    const body = (await req.json().catch(() => ({}))) as {
      form?: string;
      word?: string;
      lemma?: string;
      root?: string;
      query?: string;
      translation?: 'afghan2023' | 'yousafzai2019';
    };

    const input = body.form ?? body.word ?? body.lemma ?? body.root ?? body.query ?? '';
    const translation = body.translation || 'afghan2023';
    const normalized = input.trim();

    if (!normalized) {
      return NextResponse.json({ error: 'form is required' }, { status: 400 });
    }

    console.log(`🔍 Related forms query: "${normalized}" (translation: ${translation})`);

    // Step 1: Try to find base word from D1
    let baseWord = normalized;
    let reverseLookup = false;

    const d1BaseWord = await getBaseWordFromD1(normalized);
    if (d1BaseWord && d1BaseWord !== normalized) {
      baseWord = d1BaseWord;
      reverseLookup = true;
      console.log(`✅ Found base word from D1: "${baseWord}" (searched: "${normalized}")`);
    }

    // Step 2: Get inflections from D1
    const d1Inflections = await getInflectionsFromD1(baseWord, translation);
    console.log(`✅ D1 inflections: ${d1Inflections.length} forms`);

    // Step 3: Determine POS and get lexicon data
    const { dictionaryByPashto, frequencyMap } = await getLightweightData();
    const dictEntry = dictionaryByPashto.get(baseWord);

    // Check verb data from D1
    const verbData = await getVerbDataFromD1(baseWord);
    const nounData = await getNounDataFromD1(baseWord);

    // Determine POS
    let posGuess: 'noun' | 'verb' | 'adjective' | 'other' = 'other';
    if (verbData) {
      posGuess = 'verb';
    } else if (nounData) {
      posGuess = 'noun';
    } else if (dictEntry?.pos) {
      const posLower = dictEntry.pos.toLowerCase();
      if (posLower.startsWith('v.') || posLower.includes('verb')) posGuess = 'verb';
      else if (posLower.startsWith('n.') || posLower.includes('noun')) posGuess = 'noun';
      else if (posLower.includes('adj')) posGuess = 'adjective';
    } else if (dictEntry?.c) {
      const cLower = dictEntry.c.toLowerCase();
      if (cLower.startsWith('v.')) posGuess = 'verb';
      else if (cLower.startsWith('n.')) posGuess = 'noun';
      else if (cLower.includes('adj')) posGuess = 'adjective';
    }

    console.log(`🔍 POS guess: ${posGuess}`);

    // Step 4: Generate comprehensive forms using LingDocs
    const groups: { nouns?: Variant[]; verbs?: Variant[]; adjectives?: Variant[]; other?: Variant[] } = {};

    // Group D1 inflections by POS
    const d1VerbForms = d1Inflections.filter(f => f.pos === 'verb');
    const d1NounForms = d1Inflections.filter(f => f.pos === 'noun');
    const d1AdjForms = d1Inflections.filter(f => f.pos === 'adjective');

    // Verbs: Use LingDocs + D1 data
    if (posGuess === 'verb' || verbData || d1VerbForms.length > 0) {
      try {
        // Try LingDocs first
        const lingdocsVerbs = await generateVerbVariantsLingDocs(baseWord, { cap: 50 });
        
        // Merge with D1 forms
        const allVerbForms = new Map<string, Variant>();
        lingdocsVerbs.forEach(v => {
          allVerbForms.set(v.form, {
            form: v.form,
            label: v.label || 'Verb Form',
            pos: 'verb',
            count: v.count || 0,
            score: v.score || 0,
            romanized: v.romanized,
            flags: ['lingdocs'],
          });
        });
        
        d1VerbForms.forEach(v => {
          const existing = allVerbForms.get(v.form);
          if (existing) {
            // Merge counts
            existing.count = Math.max(existing.count || 0, v.count || 0);
            existing.score = existing.count;
            existing.flags = [...(existing.flags || []), 'd1'];
          } else {
            allVerbForms.set(v.form, { ...v, flags: ['d1'] });
          }
        });

        groups.verbs = Array.from(allVerbForms.values()).sort((a, b) => (b.count || 0) - (a.count || 0));
        console.log(`✅ Generated ${groups.verbs.length} verb forms`);
      } catch (error) {
        console.error(`❌ Verb generation failed:`, error);
        groups.verbs = d1VerbForms;
      }
    }

    // Nouns: Use LingDocs + D1 data
    if (posGuess === 'noun' || nounData || d1NounForms.length > 0) {
      try {
        // Try LingDocs first
        const lingdocsNouns = await generateNounVariantsLingDocs(baseWord, { cap: 50 });
        
        // Merge with D1 forms
        const allNounForms = new Map<string, Variant>();
        lingdocsNouns.forEach(v => {
          allNounForms.set(v.form, {
            form: v.form,
            label: v.label || 'Noun Form',
            pos: 'noun',
            count: v.count || 0,
            score: v.score || 0,
            romanized: v.romanized,
            flags: ['lingdocs'],
          });
        });
        
        d1NounForms.forEach(v => {
          const existing = allNounForms.get(v.form);
          if (existing) {
            existing.count = Math.max(existing.count || 0, v.count || 0);
            existing.score = existing.count;
            existing.flags = [...(existing.flags || []), 'd1'];
          } else {
            allNounForms.set(v.form, { ...v, flags: ['d1'] });
          }
        });

        groups.nouns = Array.from(allNounForms.values()).sort((a, b) => (b.count || 0) - (a.count || 0));
        console.log(`✅ Generated ${groups.nouns.length} noun forms`);
      } catch (error) {
        console.error(`❌ Noun generation failed:`, error);
        groups.nouns = d1NounForms;
      }
    }

    // Adjectives: Use LingDocs patterns
    if (posGuess === 'adjective' || d1AdjForms.length > 0) {
      try {
        const adjForms = await generateAdjectiveInflections(baseWord);
        
        // Merge with D1 forms
        const allAdjForms = new Map<string, Variant>();
        adjForms.forEach(v => {
          allAdjForms.set(v.form, { ...v, flags: ['pattern'] });
        });
        
        d1AdjForms.forEach(v => {
          const existing = allAdjForms.get(v.form);
          if (existing) {
            existing.count = Math.max(existing.count || 0, v.count || 0);
            existing.score = existing.count;
            existing.flags = [...(existing.flags || []), 'd1'];
          } else {
            allAdjForms.set(v.form, { ...v, flags: ['d1'] });
          }
        });

        groups.adjectives = Array.from(allAdjForms.values()).sort((a, b) => (b.count || 0) - (a.count || 0));
        console.log(`✅ Generated ${groups.adjectives.length} adjective forms`);
      } catch (error) {
        console.error(`❌ Adjective generation failed:`, error);
        groups.adjectives = d1AdjForms;
      }
    }

    // Enrich all forms with frequency data, verse references, and inflection reasons
    const allForms: Variant[] = [];
    for (const group of Object.values(groups)) {
      if (group) {
        allForms.push(...group);
      }
    }

    // Get D1 client for POS enrichment
    let db: any = null;
    try {
      db = getD1ClientOrThrow();
    } catch (error) {
      console.warn('⚠️ D1 client not available, skipping POS enrichment:', error);
    }

    // Enrich with POS metadata, frequency counts, and inflection reasons
    for (const form of allForms) {
      // Enrich with POS metadata
      if (db) {
        const enriched = await enrichVariantWithPOS(form, db);
        Object.assign(form, enriched);
      } else {
        // Fallback: use LingDocs map only
        const lingdocsMap = getLingDocsPosMap();
        const lingdocsEntry = lingdocsMap[form.form];
        if (lingdocsEntry) {
          const pos = Array.isArray(lingdocsEntry.pos) ? lingdocsEntry.pos[0] : lingdocsEntry.pos;
          if (pos) {
            form.pos = pos as PartOfSpeech;
            form.sources = ['lingdocs'];
            form.posMetadata = {
              pos,
              source: 'lingdocs',
              lingdocsId: lingdocsEntry.lingdocsId,
            };
          }
        }
      }
      
      const freq = frequencyMap.get(form.form) || 0;
      if (freq > 0) {
        form.count = freq;
        form.score = freq;
      }
      
      // Get inflection reasons from D1
      const reasons = await getInflectionReasonsFromD1(form.form, translation);
      if (reasons) {
        form.inflectionReasons = reasons;
      }
    }

    // Sort by frequency
    allForms.sort((a, b) => (b.count || 0) - (a.count || 0));
    
    // Calculate POS summary
    const posSummary = calculatePOSSummary(allForms);

    // Update groups with enriched data
    const enrichedGroups: typeof groups = {};
    if (groups.nouns) enrichedGroups.nouns = allForms.filter(f => f.pos === 'noun');
    if (groups.verbs) enrichedGroups.verbs = allForms.filter(f => f.pos === 'verb');
    if (groups.adjectives) enrichedGroups.adjectives = allForms.filter(f => f.pos === 'adjective');
    if (groups.other) enrichedGroups.other = allForms.filter(f => f.pos === 'other');

    const total = allForms.length;

    const response: RelatedFormsResponse = {
      root: baseWord,
      searchedForm: normalized,
      forms: enrichedGroups,
      total,
      ms: Date.now() - startedAt,
      posGuess: posGuess as PartOfSpeech,
      translation,
      posSummary,
      metadata: {
        hasMultiplePos: Object.keys(enrichedGroups).length > 1,
        primaryPos: posGuess,
        totalFormsByPos: {
          nouns: enrichedGroups.nouns?.length || 0,
          verbs: enrichedGroups.verbs?.length || 0,
          adjectives: enrichedGroups.adjectives?.length || 0,
          other: enrichedGroups.other?.length || 0,
        },
        generationStrategy: d1Inflections.length > 0 ? 'd1-lingdocs-hybrid' : 'lingdocs-fallback',
        reverseLookup,
        source: d1Inflections.length > 0 ? 'd1' : 'lingdocs',
      },
    };

    console.log(`✅ Returning ${total} forms (${Date.now() - startedAt}ms)`);

    return NextResponse.json(response);
  } catch (error) {
    console.error('❌ Related forms error:', error);
    return NextResponse.json(
      { error: 'Related forms failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
