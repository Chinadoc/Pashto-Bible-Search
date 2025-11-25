import { NextRequest, NextResponse } from 'next/server';

/**
 * Morphology Facets API
 * Returns facet counts for verb filters based on D1 verb_forms table
 * Counts are context-aware: applying one filter updates counts for other facets
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
  tense?: string;
  person?: string;
  voice?: string;
  gender?: string;
  aspect?: string;
  mood?: string;
}

// Mapping for tense values (normalize D1 data to our filter values)
const TENSE_NORMALIZATION: Record<string, string> = {
  'present': 'present',
  'pres': 'present',
  'non-past': 'present',
  'past': 'past',
  'preterite': 'past',
  'future': 'future',
  'fut': 'future',
  'perfect': 'perfect',
  'perf': 'perfect',
  'subjunctive': 'subjunctive',
  'subj': 'subjunctive',
  'imperative': 'imperative',
  'imp': 'imperative',
  'ability': 'ability',
  'pot': 'ability',
  'potential': 'ability',
  'habitual': 'habitual',
  'hab': 'habitual',
};

const PERSON_NORMALIZATION: Record<string, string> = {
  '1': '1st',
  '1st': '1st',
  'first': '1st',
  '2': '2nd',
  '2nd': '2nd',
  'second': '2nd',
  '3': '3rd',
  '3rd': '3rd',
  'third': '3rd',
};

const ASPECT_NORMALIZATION: Record<string, string> = {
  'imperfective': 'imperfective',
  'ipfv': 'imperfective',
  'impfv': 'imperfective',
  'perfective': 'perfective',
  'pfv': 'perfective',
  'perf': 'perfective',
};

const MOOD_NORMALIZATION: Record<string, string> = {
  'indicative': 'indicative',
  'ind': 'indicative',
  'subjunctive': 'subjunctive',
  'subj': 'subjunctive',
  'imperative': 'imperative',
  'imp': 'imperative',
  'ability': 'ability',
  'pot': 'ability',
  'potential': 'ability',
};

function normalizeValue(value: string | undefined, mapping: Record<string, string>): string | null {
  if (!value) return null;
  const lower = value.toLowerCase().trim();
  return mapping[lower] || null;
}

function extractFacetFromLabel(label: string | undefined): {
  person?: string;
  tense?: string;
  aspect?: string;
  mood?: string;
} {
  if (!label) return {};
  const lower = label.toLowerCase();
  
  const result: {
    person?: string;
    tense?: string;
    aspect?: string;
    mood?: string;
  } = {};
  
  // Extract person
  if (lower.includes('1st') || lower.includes(' 1 ') || lower.match(/\b1\.?\s/)) {
    result.person = '1st';
  } else if (lower.includes('2nd') || lower.includes(' 2 ') || lower.match(/\b2\.?\s/)) {
    result.person = '2nd';
  } else if (lower.includes('3rd') || lower.includes(' 3 ') || lower.match(/\b3\.?\s/)) {
    result.person = '3rd';
  }
  
  // Extract tense
  for (const [pattern, normalized] of Object.entries(TENSE_NORMALIZATION)) {
    if (lower.includes(pattern)) {
      result.tense = normalized;
      break;
    }
  }
  
  // Extract aspect
  for (const [pattern, normalized] of Object.entries(ASPECT_NORMALIZATION)) {
    if (lower.includes(pattern)) {
      result.aspect = normalized;
      break;
    }
  }
  
  // Extract mood
  for (const [pattern, normalized] of Object.entries(MOOD_NORMALIZATION)) {
    if (lower.includes(pattern)) {
      result.mood = normalized;
      break;
    }
  }
  
  return result;
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
      translation = 'afghan2023',
    }: { 
      lemma: string; 
      filters?: MorphologyFilters;
      translation?: string;
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

    // Normalize and enrich forms with facet data
    const enrichedForms = allForms.map(form => {
      // Try to extract facets from the form's tense/person fields first
      let person = normalizeValue(form.person, PERSON_NORMALIZATION);
      let tense = normalizeValue(form.tense, TENSE_NORMALIZATION);
      let aspect = normalizeValue(form.voice, ASPECT_NORMALIZATION); // voice sometimes contains aspect
      let mood = normalizeValue(form.tense, MOOD_NORMALIZATION); // mood sometimes in tense field
      
      // If not found, try to extract from label (constructed from tense + person)
      if (!person || !tense) {
        const label = [form.tense, form.person].filter(Boolean).join(' ');
        const extracted = extractFacetFromLabel(label);
        person = person || extracted.person || null;
        tense = tense || extracted.tense || null;
        aspect = aspect || extracted.aspect || null;
        mood = mood || extracted.mood || null;
      }
      
      return {
        ...form,
        normalizedPerson: person,
        normalizedTense: tense,
        normalizedAspect: aspect,
        normalizedMood: mood,
      };
    });

    // Apply current filters to get base set of forms
    const activeFilters = {
      person: (filters.person && filters.person.length > 0 && !filters.person.includes('all')) ? filters.person : null,
      tense: (filters.tense && filters.tense.length > 0 && !filters.tense.includes('all')) ? filters.tense : null,
      aspect: (filters.aspect && filters.aspect.length > 0 && !filters.aspect.includes('all')) ? filters.aspect : null,
      mood: (filters.mood && filters.mood.length > 0 && !filters.mood.includes('all')) ? filters.mood : null,
    };

    // Filter forms based on current selections (for context-aware counts)
    const filterForms = (
      forms: typeof enrichedForms,
      excludeFacet?: 'person' | 'tense' | 'aspect' | 'mood'
    ) => {
      return forms.filter(form => {
        if (excludeFacet !== 'person' && activeFilters.person) {
          if (!form.normalizedPerson || !activeFilters.person.includes(form.normalizedPerson)) {
            return false;
          }
        }
        if (excludeFacet !== 'tense' && activeFilters.tense) {
          if (!form.normalizedTense || !activeFilters.tense.includes(form.normalizedTense)) {
            return false;
          }
        }
        if (excludeFacet !== 'aspect' && activeFilters.aspect) {
          if (!form.normalizedAspect || !activeFilters.aspect.includes(form.normalizedAspect)) {
            return false;
          }
        }
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
      matchingVerses: matchingForms.length, // Forms matching current filters
    };

    console.log(`[FACETS] Computed facets in ${Date.now() - startTime}ms:`, {
      totalForms: facets.totalForms,
      matchingForms: facets.matchingVerses,
      personCounts: facets.person,
      tenseCounts: facets.tense,
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
