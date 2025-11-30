import { NextRequest, NextResponse } from 'next/server';

/**
 * Morphology Facets API
 * Returns facet counts for verb filters based on D1 verb_forms table
 * Counts are context-aware: applying one filter updates counts for other facets
 * 
 * D1 verb_forms schema:
 *   - person: "1sg", "2sg", "3sg", "1pl", "2pl", "3pl"
 *   - tense: "imperative", "non-imperative" (limited from LingDocs)
 *   - aspect: "imperfective", "perfective" (from voice field or conjugation structure)
 *   - gender: "masculine", "feminine"
 *   
 * We normalize these to our UI filter values.
 */

const CLOUDFLARE_WORKER_URL =
  process.env.NEXT_PUBLIC_CLOUDFLARE_WORKER_URL ||
  'https://pashtobiblesearch.jeremy-samuels17.workers.dev';

export interface MorphologyFilters {
  person?: string[];
  tense?: string[];
  aspect?: string[];
  mood?: string[];
}

export interface FacetCounts {
  person: Record<string, number>;
  tense: Record<string, number>;
  aspect: Record<string, number>;
  mood: Record<string, number>;
  totalForms: number;
  matchingVerses: number;
}

interface VerbForm {
  form: string;
  tense?: string;      // Now unified: present, past, perfect, subjunctive, imperative, ability
  person?: string;     // D1 format: 1sg, 1pl, 2sg, 2pl, 3sg, 3pl
  aspect?: string;     // Now returned: imperfective, perfective
  mood?: string;       // Now returned: indicative, subjunctive, imperative, ability
  voice?: string;      // Legacy field
  gender?: string;
  helper?: string;
  // Raw D1 values for debugging
  _form_type?: string;
  _tense?: string;
}

// Person normalization: D1 "1sg" → our "1st"
const PERSON_D1_TO_FILTER: Record<string, string> = {
  '1': '1st',
  '1sg': '1st',
  '1pl': '1st',
  '2': '2nd',
  '2sg': '2nd',
  '2pl': '2nd',
  '3': '3rd',
  '3sg': '3rd',
  '3pl': '3rd',
};

// The Worker now returns normalized tense values: present, past, perfect, subjunctive, imperative, ability
// Just pass through the value, or infer from form if missing
function inferTenseFromForm(form: VerbForm): string | null {
  const tense = form.tense?.toLowerCase();
  
  // Unified tense values from Worker
  if (tense && ['present', 'past', 'perfect', 'subjunctive', 'imperative', 'ability', 'habitual', 'future'].includes(tense)) {
    return tense;
  }
  
  // Legacy fallback: Try to infer from _form_type
  if (form._form_type) {
    const formType = form._form_type.toLowerCase();
    if (formType === 'present') return 'present';
    if (formType === 'past' || formType === 'simple_past') return 'past';
    if (formType === 'perfect' || formType === 'past_participle') return 'perfect';
    if (formType === 'subjunctive') return 'subjunctive';
    if (formType === 'imperative') return 'imperative';
    if (formType === 'ability') return 'ability';
  }
  
  // Try to infer from the form text itself
  if (form.form) {
    // Perfective marker: و- prefix typically indicates past/perfective
    if (form.form.startsWith('و') || form.form.startsWith('وا')) {
      return 'past';
    }
  }
  
  return null;
}

// The Worker now returns normalized mood values: indicative, subjunctive, imperative, ability
function inferMoodFromForm(form: VerbForm): string | null {
  const mood = form.mood?.toLowerCase();
  
  if (mood && ['indicative', 'subjunctive', 'imperative', 'ability'].includes(mood)) {
    return mood;
  }
  
  // Fallback inference
  const tense = form.tense?.toLowerCase();
  if (tense === 'imperative') return 'imperative';
  if (tense === 'subjunctive') return 'subjunctive';
  if (tense === 'ability') return 'ability';
  
  return 'indicative';
}

function normalizePersonFromD1(d1Person?: string): string | null {
  if (!d1Person) return null;
  const clean = d1Person.toLowerCase().trim();
  
  // Handle both "1sg" format and just "1" format
  if (clean.startsWith('1')) return '1st';
  if (clean.startsWith('2')) return '2nd';
  if (clean.startsWith('3')) return '3rd';
  
  return PERSON_D1_TO_FILTER[clean] || null;
}

// The Worker now returns normalized aspect values: imperfective, perfective
function normalizeAspectFromD1(d1Voice?: string, d1Aspect?: string, form?: VerbForm): string | null {
  const value = (d1Aspect || d1Voice || '').toLowerCase();
  
  if (value.includes('imperfective') || value.includes('ipfv')) return 'imperfective';
  if (value.includes('perfective') || value.includes('pfv')) return 'perfective';
  
  // Infer from tense if aspect not explicitly set
  if (form?.tense) {
    const tense = form.tense.toLowerCase();
    if (tense === 'present' || tense === 'habitual' || tense === 'future') return 'imperfective';
    if (tense === 'past' || tense === 'perfect') return 'perfective';
  }
  
  return null;
}

async function fetchVerbFormsFromD1(lemma: string, cap: number = 500): Promise<VerbForm[]> {
  try {
    const params = new URLSearchParams({
      lemma,
      cap: String(cap),
    });

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    const response = await fetch(`${CLOUDFLARE_WORKER_URL}/api/verb-forms?${params}`, {
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      console.warn(`D1 verb-forms fetch failed (${response.status})`);
      return [];
    }

    const data = await response.json();
    return data.forms || [];
  } catch (error) {
    console.error(`Failed to fetch verb forms for ${lemma}:`, error);
    return [];
  }
}

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    const body = await request.json();
    const { 
      lemma, 
      filters = {},
    }: { 
      lemma: string; 
      filters?: MorphologyFilters;
    } = body;

    if (!lemma || typeof lemma !== 'string') {
      return NextResponse.json({ error: 'Lemma is required' }, { status: 400 });
    }

    console.log(`[FACETS] Computing facet counts for lemma: "${lemma}"`);

    // Fetch all verb forms from D1
    const allForms = await fetchVerbFormsFromD1(lemma, 500);
    
    if (allForms.length === 0) {
      console.log(`[FACETS] No forms found for lemma: "${lemma}"`);
      return NextResponse.json({
        facets: {
          person: { '1st': 0, '2nd': 0, '3rd': 0 },
          tense: { present: 0, past: 0, future: 0, perfect: 0, subjunctive: 0, imperative: 0, ability: 0, habitual: 0 },
          aspect: { imperfective: 0, perfective: 0 },
          mood: { indicative: 0, subjunctive: 0, imperative: 0, ability: 0 },
          totalForms: 0,
          matchingVerses: 0,
        },
        queryTime: Date.now() - startTime,
      });
    }

    console.log(`[FACETS] Found ${allForms.length} forms for "${lemma}"`);

    // Normalize and enrich forms with inferred grammatical features
    const enrichedForms = allForms.map(form => {
      const normalizedPerson = normalizePersonFromD1(form.person);
      const inferredTense = inferTenseFromForm(form);
      const normalizedAspect = normalizeAspectFromD1(form.voice, form.aspect, form);
      const inferredMood = inferMoodFromForm(form);
      
      return {
        ...form,
        normalizedPerson,
        normalizedAspect,
        normalizedTense: inferredTense,
        normalizedMood: inferredMood,
      };
    });

    // Parse active filters (exclude 'all' values)
    const activeFilters = {
      person: (filters.person?.length && !filters.person.includes('all')) ? filters.person : null,
      tense: (filters.tense?.length && !filters.tense.includes('all')) ? filters.tense : null,
      aspect: (filters.aspect?.length && !filters.aspect.includes('all')) ? filters.aspect : null,
      mood: (filters.mood?.length && !filters.mood.includes('all')) ? filters.mood : null,
    };

    // Filter forms based on current selections (for context-aware counts)
    const filterForms = (
      forms: typeof enrichedForms,
      excludeFacet?: 'person' | 'tense' | 'aspect' | 'mood'
    ) => {
      return forms.filter(form => {
        // Person filter
        if (excludeFacet !== 'person' && activeFilters.person) {
          if (!form.normalizedPerson || !activeFilters.person.includes(form.normalizedPerson)) {
            return false;
          }
        }
        // Tense filter
        if (excludeFacet !== 'tense' && activeFilters.tense) {
          if (!form.normalizedTense || !activeFilters.tense.includes(form.normalizedTense)) {
            return false;
          }
        }
        // Aspect filter
        if (excludeFacet !== 'aspect' && activeFilters.aspect) {
          if (!form.normalizedAspect || !activeFilters.aspect.includes(form.normalizedAspect)) {
            return false;
          }
        }
        // Mood filter
        if (excludeFacet !== 'mood' && activeFilters.mood) {
          if (!form.normalizedMood || !activeFilters.mood.includes(form.normalizedMood)) {
            return false;
          }
        }
        return true;
      });
    };

    // Compute counts for each facet (context-aware)
    const computeFacetCounts = (
      forms: typeof enrichedForms,
      facetKey: 'normalizedPerson' | 'normalizedTense' | 'normalizedAspect' | 'normalizedMood'
    ): Record<string, number> => {
      const counts: Record<string, number> = {};
      for (const form of forms) {
        const value = form[facetKey];
        if (value) {
          counts[value] = (counts[value] || 0) + 1;
        }
      }
      return counts;
    };

    // Person counts: filter by tense, aspect, mood (exclude person)
    const formsForPersonCounts = filterForms(enrichedForms, 'person');
    const personCounts = computeFacetCounts(formsForPersonCounts, 'normalizedPerson');

    // Tense counts: filter by person, aspect, mood (exclude tense)
    const formsForTenseCounts = filterForms(enrichedForms, 'tense');
    const tenseCounts = computeFacetCounts(formsForTenseCounts, 'normalizedTense');

    // Aspect counts: filter by person, tense, mood (exclude aspect)
    const formsForAspectCounts = filterForms(enrichedForms, 'aspect');
    const aspectCounts = computeFacetCounts(formsForAspectCounts, 'normalizedAspect');

    // Mood counts: filter by person, tense, aspect (exclude mood)
    const formsForMoodCounts = filterForms(enrichedForms, 'mood');
    const moodCounts = computeFacetCounts(formsForMoodCounts, 'normalizedMood');

    // Get matching forms with all filters applied
    const matchingForms = filterForms(enrichedForms);

    // Ensure all expected keys are present with 0 counts if missing
    const ensureAllKeys = (counts: Record<string, number>, keys: string[]): Record<string, number> => {
      const result: Record<string, number> = {};
      for (const key of keys) {
        result[key] = counts[key] || 0;
      }
      return result;
    };

    const facets: FacetCounts = {
      person: ensureAllKeys(personCounts, ['1st', '2nd', '3rd']),
      tense: ensureAllKeys(tenseCounts, ['present', 'past', 'future', 'perfect', 'subjunctive', 'imperative', 'ability', 'habitual']),
      aspect: ensureAllKeys(aspectCounts, ['imperfective', 'perfective']),
      mood: ensureAllKeys(moodCounts, ['indicative', 'subjunctive', 'imperative', 'ability']),
      totalForms: enrichedForms.length,
      matchingVerses: matchingForms.length,
    };

    console.log(`[FACETS] Computed facets in ${Date.now() - startTime}ms:`, {
      totalForms: facets.totalForms,
      matchingForms: facets.matchingVerses,
      personCounts: facets.person,
      tenseCounts: facets.tense,
      aspectCounts: facets.aspect,
    });

    return NextResponse.json({
      facets,
      matchingForms: matchingForms.map(f => f.form),
      queryTime: Date.now() - startTime,
    });
  } catch (error) {
    console.error('[FACETS] Error computing facets:', error);
    return NextResponse.json(
      { error: 'Failed to compute facet counts', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const lemma = searchParams.get('lemma');
  
  if (!lemma) {
    return NextResponse.json({ error: 'Lemma parameter is required' }, { status: 400 });
  }

  // Convert GET to POST format
  const filters: MorphologyFilters = {};
  const person = searchParams.get('person');
  const tense = searchParams.get('tense');
  const aspect = searchParams.get('aspect');
  const mood = searchParams.get('mood');
  
  if (person) filters.person = person.split(',').filter(Boolean);
  if (tense) filters.tense = tense.split(',').filter(Boolean);
  if (aspect) filters.aspect = aspect.split(',').filter(Boolean);
  if (mood) filters.mood = mood.split(',').filter(Boolean);

  // Create a mock request for POST handler
  const postRequest = new Request(request.url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ lemma, filters }),
  });

  return POST(postRequest as NextRequest);
}
