"use client";

import { useState, useMemo, useEffect } from 'react';
import type { RelatedFormsData, RelatedFormVariant } from '../types';

// Types for the structured data from Edge function
type Variant = RelatedFormVariant;

type VariantDetails = Array<{
  type: string;
  description?: string;
  count: number;
  groups?: Array<{ key: string; label: string; items: Variant[] }>;
}>;

type VerbUnderstandingState = {
  person: '1st' | '2nd' | '3rd';
  tense: 'present' | 'past' | 'future' | 'perfect' | 'subjunctive' | 'imperative' | 'ability' | 'habitual';
  aspect: 'imperfective' | 'perfective';
  mood: 'indicative' | 'subjunctive' | 'imperative' | 'ability';
}

// Map Edge function grammatical labels to LingDocs categories
function mapGrammaticalLabel(label: string): string {
  const l = label.toLowerCase();

  // Handle detailed grammatical labels from Edge function
  if (l.includes('present') || l.includes('pres')) return 'Present';
  if (l.includes('subj') || l.includes('subjunctive')) return 'Subjunctive';
  if (l.includes('future') || l.includes('fut')) return 'Future';
  if (l.includes('past_participle') || l.includes('participle')) return 'Perfect';
  if (l.includes('past') && !l.includes('participle')) return 'Past';
  if (l.includes('imperative') || l.includes('imp')) return 'Imperative';
  if (l.includes('ability') || l.includes('abil')) return 'Ability';
  if (l.includes('habitual') || l.includes('hab')) return 'Habitual';
  if (l.includes('perfect')) return 'Perfect';

  // Return the original label if it doesn't match any category
  // This preserves detailed labels like "1sg Present", "2sg Present", etc.
  return label;
}

// Group verb forms by their detailed grammatical labels for display
function groupVerbsByDetailedLabels(variantDetails?: VariantDetails) {
  const verbVariants = variantDetails?.find(block => block.type === 'verb')?.groups?.[0]?.items || [];
  const groups: Record<string, Array<RelatedFormVariant>> = {
    presentTense: [],
    subjunctiveTense: [],
    futureTense: [],
    pastTense: [],
    imperativeForms: [],
    abilityForms: [],
    perfectForms: [],
    habitualForms: [],
    otherVerbs: []
  };

  verbVariants.forEach(variant => {
    const category = mapGrammaticalLabel(variant.label || '');

    // Keep the detailed label for display but group by category
    const formWithLabel = { form: variant.form, count: variant.count || 0, label: variant.label || '' };

    if (category === 'Present') {
      groups.presentTense.push(formWithLabel);
    } else if (category === 'Subjunctive') {
      groups.subjunctiveTense.push(formWithLabel);
    } else if (category === 'Future') {
      groups.futureTense.push(formWithLabel);
    } else if (category === 'Past') {
      groups.pastTense.push(formWithLabel);
    } else if (category === 'Imperative') {
      groups.imperativeForms.push(formWithLabel);
    } else if (category === 'Ability') {
      groups.abilityForms.push(formWithLabel);
    } else if (category === 'Perfect') {
      groups.perfectForms.push(formWithLabel);
    } else if (category === 'Habitual') {
      groups.habitualForms.push(formWithLabel);
    } else {
      groups.otherVerbs.push(formWithLabel);
    }
  });

  return groups;
}

// Categorize verbs by their grammatical labels
function categorizeVerbForms(verbs: Array<RelatedFormVariant>) {
  const groups: Record<string, Array<RelatedFormVariant>> = {
    presentTense: [],
    subjunctiveTense: [],
    futureTense: [],
    pastTense: [],
    imperativeForms: [],
    abilityForms: [],
    perfectForms: [],
    habitualForms: [],
    otherVerbs: []
  };

  verbs.forEach(verb => {
    const category = mapGrammaticalLabel(verb.label || '');

    // Map to appropriate category
    if (category === 'Present') {
      groups.presentTense.push(verb);
    } else if (category === 'Subjunctive') {
      groups.subjunctiveTense.push(verb);
    } else if (category === 'Future') {
      groups.futureTense.push(verb);
    } else if (category === 'Past') {
      groups.pastTense.push(verb);
    } else if (category === 'Imperative') {
      groups.imperativeForms.push(verb);
    } else if (category === 'Ability') {
      groups.abilityForms.push(verb);
    } else if (category === 'Perfect') {
      groups.perfectForms.push(verb);
    } else if (category === 'Habitual') {
      groups.habitualForms.push(verb);
    } else {
      groups.otherVerbs.push(verb);
    }
  });

  return groups;
}

// Group verbs by LingDocs categories using structured data from Edge function
function groupVerbsFromStructuredData(variantDetails?: VariantDetails) {
  const verbVariants = variantDetails?.find(block => block.type === 'verb')?.groups?.[0]?.items || [];
  const groups: Record<string, Array<RelatedFormVariant>> = {
    presentTense: [],
    subjunctiveTense: [],
    futureTense: [],
    pastTense: [],
    imperativeForms: [],
    abilityForms: [],
    perfectForms: [],
    habitualForms: [],
    otherVerbs: []
  };

  verbVariants.forEach(variant => {
    const category = mapGrammaticalLabel(variant.label || '');

    // Map to appropriate category
    if (category === 'Present') {
      groups.presentTense.push({ form: variant.form, count: variant.count || 0 });
    } else if (category === 'Subjunctive') {
      groups.subjunctiveTense.push({ form: variant.form, count: variant.count || 0 });
    } else if (category === 'Future') {
      groups.futureTense.push({ form: variant.form, count: variant.count || 0 });
    } else if (category === 'Past') {
      groups.pastTense.push({ form: variant.form, count: variant.count || 0 });
    } else if (category === 'Imperative') {
      groups.imperativeForms.push({ form: variant.form, count: variant.count || 0 });
    } else if (category === 'Ability') {
      groups.abilityForms.push({ form: variant.form, count: variant.count || 0 });
    } else if (category === 'Perfect') {
      groups.perfectForms.push({ form: variant.form, count: variant.count || 0 });
    } else if (category === 'Habitual') {
      groups.habitualForms.push({ form: variant.form, count: variant.count || 0 });
    } else {
      groups.otherVerbs.push({ form: variant.form, count: variant.count || 0 });
    }
  });

  return groups;
}

export default function RelatedForms({
  relatedForms,
  onPick,
  verbState,
  setVerbState,
  onApplyFilter
}: {
  relatedForms: RelatedFormsData;
  onPick: (form: string) => void;
  verbState?: VerbUnderstandingState;
  setVerbState?: (state: VerbUnderstandingState) => void;
  onApplyFilter?: (forms: string[]) => void;
}) {
  // ✅ Always call hooks first, before any conditional returns
  const [open, setOpen] = useState<boolean>(false)

  // Debug logging to see what data we're receiving (moved to useEffect to avoid render issues)
  useEffect(() => {
    console.log('RelatedForms received data:', {
      total: relatedForms.total,
      verbsCount: relatedForms.verbs?.length || 0,
      hasVariantDetails: !!relatedForms.variantDetails,
      variantDetailsLength: relatedForms.variantDetails?.length || 0,
      variantDetails: relatedForms.variantDetails
    });
  }, [relatedForms]);

  // Show the interface even if no forms found yet, to allow user to see the controls
  const hasAnyForms = (relatedForms.total ?? 0) > 0

  // Use structured data from Edge function if available, otherwise fall back to legacy data
  const hasStructuredData = relatedForms.variantDetails && relatedForms.variantDetails.length > 0;
  const verbGroups = hasStructuredData
    ? groupVerbsByDetailedLabels(relatedForms.variantDetails)
    : {
        presentTense: relatedForms.verbs || [],
        subjunctiveTense: [],
        futureTense: [],
        pastTense: [],
        imperativeForms: [],
        abilityForms: [],
        perfectForms: [],
        habitualForms: [],
        otherVerbs: []
      };

  // Compute categorized buckets first (TDZ fix)
  const cats = useMemo(() => {
    // If we have structured data, use it directly since it's already categorized
    if (hasStructuredData) {
      return verbGroups;
    }
    // Otherwise, categorize the legacy verbs array
    return categorizeVerbForms(relatedForms.verbs || []);
  }, [verbGroups, hasStructuredData, relatedForms.verbs]);

  // Filter verbs based on current tense/aspect/mood/person selection
  const filteredVerbs = useMemo(() => {
    if (!verbState) return Object.values(cats).flat();

    let filtered: Array<RelatedFormVariant> = [];

    switch (verbState.tense) {
      case 'present': filtered = cats.presentTense; break;
      case 'subjunctive': filtered = cats.subjunctiveTense; break;
      case 'future': filtered = cats.futureTense; break;
      case 'past': filtered = cats.pastTense; break;
      case 'imperative': filtered = cats.imperativeForms; break;
      case 'ability': filtered = cats.abilityForms; break;
      case 'perfect': filtered = cats.perfectForms; break;
      case 'habitual': filtered = cats.habitualForms; break;
      default: filtered = cats.otherVerbs;
    }

    // Filter by person if specified
    if (verbState.person !== '1st' && verbState.person !== '2nd' && verbState.person !== '3rd') {
      return filtered; // Show all if no specific person filter
    }

    // Filter based on the grammatical labels (e.g., "1sg Present", "2pl Present")
    const personPatterns: Record<string, string[]> = {
      '1st': ['1sg', '1pl'],
      '2nd': ['2sg', '2pl'],
      '3rd': ['3sg', '3pl']
    };

    const patterns = personPatterns[verbState.person] || [];
    filtered = filtered.filter(f =>
      f.label && patterns.some(pattern => f.label!.toLowerCase().includes(pattern.toLowerCase()))
    );

    return filtered;
  }, [verbState, cats]);

  // Get all form counts for display
  const formCounts = {
    present: cats.presentTense.length,
    subjunctive: cats.subjunctiveTense.length,
    future: cats.futureTense.length,
    past: cats.pastTense.length,
    imperative: cats.imperativeForms.length,
    ability: cats.abilityForms.length,
    perfect: cats.perfectForms.length,
    habitual: cats.habitualForms.length,
    other: cats.otherVerbs.length
  };

  const {
    presentTense,
    subjunctiveTense,
    futureTense,
    pastTense,
    imperativeForms,
    abilityForms,
    perfectForms,
    habitualForms,
    otherVerbs
  } = cats;

  // ✅ Early return only after all hooks are declared
  if (!relatedForms) return null

  const Section = ({ title, list }: { title: string; list: Array<RelatedFormVariant> }) => {
    // Group by person for better organization
    const groupedByPerson = list.reduce((acc, item) => {
      const personMatch = item.label?.match(/(\d+)\s*(sg|pl|SG|PL)/i);
      const person = personMatch ? (personMatch[2].toLowerCase() === 'pl' ? 'plural' : 'singular') : 'other';
      if (!acc[person]) acc[person] = [];
      acc[person].push(item);
      return acc;
    }, {} as Record<string, typeof list>);

    return (
      <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
          <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
          {title} ({list.length})
        </div>
        <div className="space-y-2">
          {Object.entries(groupedByPerson).map(([person, items]) => (
            <div key={person}>
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-1 capitalize font-medium">
                {person} ({items.length})
              </div>
              <div className="flex flex-wrap gap-1.5">
                {items.map(({ form, count, label }, idx) => (
                  <button
                    key={`${title}-${form}-${idx}`}
                    onClick={() => onPick(form)}
                    className="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-blue-50 dark:hover:bg-blue-900/30 text-xs transition-colors"
                    title={`Click to search for: ${form}${label ? ` (${label})` : ''}`}
                  >
                    <span className="font-medium text-gray-800 dark:text-gray-200">{form}</span>
                    {(count || 0) > 0 && <span className="ml-1 text-xs opacity-70 text-gray-600 dark:text-gray-400">({count})</span>}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
        {list.length === 0 && <span className="text-gray-400 italic">—</span>}
      </div>
    );
  }

  return (
    <div className="mt-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm overflow-hidden">
      <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Verb Conjugations ({filteredVerbs.length} forms)
            </span>
            {verbState && (
              <span className="text-xs px-2 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full">
                {verbState.tense} • {verbState.person}
              </span>
            )}
          </div>
          <div className="flex gap-2">
            {onApplyFilter && filteredVerbs.length > 0 && (
              <button
                onClick={() => {
                  const formsToSearch = filteredVerbs.map(v => v.form);
                  console.log('DEBUG: Applying filter with', filteredVerbs.length, 'terms:', formsToSearch);
                  console.log('DEBUG: Filtered verb details:', filteredVerbs);
                  onApplyFilter(formsToSearch);
                }}
                className="text-xs px-3 py-1.5 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors font-medium"
              >
                Apply Filter ({filteredVerbs.length})
              </button>
            )}
            <button
              onClick={() => setOpen(!open)}
              className="text-xs px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              {open ? 'Hide' : 'Show'}
            </button>
          </div>
        </div>
      </div>

      {/* Verb understanding controls */}
      {verbState && setVerbState && (
        <div className="px-4 py-3 bg-blue-50 dark:bg-blue-900/20 border-b border-gray-200 dark:border-gray-600">
          <div className="flex flex-wrap items-center gap-4 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-gray-600 dark:text-gray-400 font-medium">Tense:</span>
              <select
                value={verbState.tense}
                onChange={(e) => setVerbState({...verbState, tense: e.target.value as any})}
                className="p-1.5 border border-gray-300 dark:border-gray-600 rounded-md text-xs bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All tenses</option>
                <option value="present">Present (م)</option>
                <option value="subjunctive">Subjunctive (ووهم)</option>
                <option value="future">Future (به وهم)</option>
                <option value="past">Past (لم)</option>
                <option value="perfect">Perfect (لیدلی یم)</option>
                <option value="imperative">Imperative (ه)</option>
                <option value="ability">Ability (شم)</option>
                <option value="habitual">Habitual (به وهلم)</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-gray-600 dark:text-gray-400 font-medium">Person:</span>
              <select
                value={verbState.person}
                onChange={(e) => setVerbState({...verbState, person: e.target.value as '1st' | '2nd' | '3rd'})}
                className="p-1.5 border border-gray-300 dark:border-gray-600 rounded-md text-xs bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500"
              >
                <option value="1st">1st Person (م)</option>
                <option value="2nd">2nd Person (ې)</option>
                <option value="3rd">3rd Person (ي)</option>
              </select>
            </div>

            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-medium">
              <span>{filteredVerbs.length} forms</span>
              {filteredVerbs.length > 0 && (
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  • Click any form to search
                </span>
              )}
            </div>
          </div>
        </div>
      )}
      {open && (
        <div className="p-4">
          {/* Verb forms - filtered or unfiltered based on controls */}
          {hasAnyForms ? (
            <>
              {filteredVerbs.length > 0 && (
                <div className="mb-4">
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-3 font-medium">
                    {verbState ? `Filtered Results: ${filteredVerbs.length} forms` : 'All Verb Forms'}
                  </div>
                  {verbState ? (
                    // Show filtered results when controls are active
                    <Section title={`${verbState.tense} - ${verbState.person}`} list={filteredVerbs} />
                  ) : (
                    // Show all LingDocs categories when no specific filtering
                    <>
                      {presentTense.length > 0 && <Section title="Present Tense (م)" list={presentTense} />}
                      {subjunctiveTense.length > 0 && <Section title="Subjunctive (ووهم)" list={subjunctiveTense} />}
                      {futureTense.length > 0 && <Section title="Future (به)" list={futureTense} />}
                      {pastTense.length > 0 && <Section title="Past Tense (لم)" list={pastTense} />}
                      {imperativeForms.length > 0 && <Section title="Imperative (ه)" list={imperativeForms} />}
                      {abilityForms.length > 0 && <Section title="Ability (شم)" list={abilityForms} />}
                      {perfectForms.length > 0 && <Section title="Perfect (لیدلی)" list={perfectForms} />}
                      {habitualForms.length > 0 && <Section title="Habitual (به وهلم)" list={habitualForms} />}
                      {otherVerbs.length > 0 && <Section title="Other Verbs" list={otherVerbs} />}
                    </>
                  )}
                </div>
              )}

              {/* Other forms */}
              {relatedForms.nouns?.length && <Section title="Nouns" list={relatedForms.nouns} />}
              {relatedForms.other?.length && <Section title="Other" list={relatedForms.other} />}
            </>
          ) : (
            // Show placeholder when no forms found
            <div className="text-center py-8">
              <div className="text-gray-400 dark:text-gray-500 text-sm">
                <div className="mb-2">🔍</div>
                <div>No verb conjugations found</div>
                <div className="text-xs mt-1">Try searching for a different verb</div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
