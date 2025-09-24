"use client";

import { useState, useMemo } from 'react';

// Types for the structured data from Edge function
type Variant = {
  form: string;
  label: string;
  pos: 'noun'|'verb'|'adjective'|'other';
  score?: number;
  count?: number;
  romanized?: string;
  flags?: string[];
};

type VariantDetails = Array<{
  type: string;
  description?: string;
  count: number;
  groups?: Array<{ key: string; label: string; items: Variant[] }>;
}>;

// Extended type that includes both legacy and new structured data
type RelatedFormsData = {
  verbs?: Array<{form: string, count: number}>;
  nouns?: Array<{form: string, count: number}>;
  other?: Array<{form: string, count: number}>;
  total?: number;
  variantDetails?: VariantDetails; // New structured data from Edge function
};

type VerbUnderstandingState = {
  person: '1st' | '2nd' | '3rd';
  tense: 'present' | 'past' | 'future' | 'perfect' | 'subjunctive' | 'imperative' | 'ability' | 'habitual';
  aspect: 'imperfective' | 'perfective';
  mood: 'indicative' | 'subjunctive' | 'imperative' | 'ability';
}

// Map Edge function grammatical labels to LingDocs categories
function mapGrammaticalLabel(label: string): string {
  const l = label.toLowerCase();

  if (l.includes('present') || l.includes('pres')) return 'Present';
  if (l.includes('subj') || l.includes('subjunctive')) return 'Subjunctive';
  if (l.includes('future') || l.includes('fut')) return 'Future';
  if (l.includes('past_participle') || l.includes('participle')) return 'Perfect';
  if (l.includes('past') && !l.includes('participle')) return 'Past';
  if (l.includes('imperative') || l.includes('imp')) return 'Imperative';
  if (l.includes('ability') || l.includes('abil')) return 'Ability';
  if (l.includes('habitual') || l.includes('hab')) return 'Habitual';
  if (l.includes('perfect')) return 'Perfect';

  return label; // Return original if no match
}

// Group verbs by LingDocs categories using structured data from Edge function
function groupVerbsFromStructuredData(variantDetails?: VariantDetails) {
  const verbVariants = variantDetails?.find(block => block.type === 'verb')?.groups?.[0]?.items || [];
  const groups: Record<string, Array<{form: string, count: number}>> = {
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
    const category = mapGrammaticalLabel(variant.label);

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
  const [open, setOpen] = useState<boolean>(false)

  if (!relatedForms) return null

  // Show the interface even if no forms found yet, to allow user to see the controls
  const hasAnyForms = (relatedForms.total ?? 0) > 0

  // Use structured data from Edge function if available, otherwise fall back to legacy data
  const hasStructuredData = relatedForms.variantDetails && relatedForms.variantDetails.length > 0;
  const verbGroups = hasStructuredData
    ? groupVerbsFromStructuredData(relatedForms.variantDetails)
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

  // Filter verbs based on current tense/aspect/mood/person selection
  const filteredVerbs = useMemo(() => {
    if (!verbState) return Object.values(verbGroups).flat();

    let filtered: Array<{form: string, count: number}> = [];

    switch (verbState.tense) {
      case 'present': filtered = verbGroups.presentTense; break;
      case 'subjunctive': filtered = verbGroups.subjunctiveTense; break;
      case 'future': filtered = verbGroups.futureTense; break;
      case 'past': filtered = verbGroups.pastTense; break;
      case 'imperative': filtered = verbGroups.imperativeForms; break;
      case 'ability': filtered = verbGroups.abilityForms; break;
      case 'perfect': filtered = verbGroups.perfectForms; break;
      case 'habitual': filtered = verbGroups.habitualForms; break;
      default: filtered = verbGroups.otherVerbs;
    }

    // Filter by person
    const personEndings: Record<string, string[]> = {
      '1st': ['م', 'و'], // 1st person endings
      '2nd': ['ې', 'ئ'], // 2nd person endings
      '3rd': ['ي'] // 3rd person endings
    };

    const endings = personEndings[verbState.person] || [];
    filtered = filtered.filter(f =>
      endings.some(ending => f.form.endsWith(ending))
    );

    return filtered;
  }, [verbState, verbGroups]);

  // Get all form counts for display
  const formCounts = {
    present: verbGroups.presentTense.length,
    subjunctive: verbGroups.subjunctiveTense.length,
    future: verbGroups.futureTense.length,
    past: verbGroups.pastTense.length,
    imperative: verbGroups.imperativeForms.length,
    ability: verbGroups.abilityForms.length,
    perfect: verbGroups.perfectForms.length,
    habitual: verbGroups.habitualForms.length,
    other: verbGroups.otherVerbs.length
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
  } = verbGroups;

  const Section = ({ title, list }: { title: string; list: {form: string, count: number}[] }) => (
    <div className="mt-2">
      <div className="text-xs text-gray-500 mb-1">{title} ({list.length})</div>
      <div className="flex flex-wrap gap-2">
        {list.map(({ form, count }, idx) => (
          <button
            key={`${title}-${form}-${idx}`}
            onClick={() => onPick(form)}
            className="px-2 py-1 border rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-sm"
            title={`Click to search for: ${form}`}
          >
            <span className="font-medium">{form}</span>
            {count > 0 && <span className="ml-1 text-xs opacity-70">({count})</span>}
          </button>
        ))}
        {list.length === 0 && <span className="text-gray-400">—</span>}
      </div>
    </div>
  )

  return (
    <div className="mt-2 rounded border border-gray-200 dark:border-gray-700 p-2 text-sm">
      <div className="flex items-center justify-between">
        <div className="text-gray-700 dark:text-gray-300">
          Related forms ({filteredVerbs.length} forms)
        </div>
        <div className="flex gap-2">
          {onApplyFilter && filteredVerbs.length > 0 && (
            <button
              onClick={() => {
                console.log('DEBUG: Applying filter with', filteredVerbs.length, 'terms:', filteredVerbs.map(v => v.form));
                onApplyFilter(filteredVerbs.map(v => v.form));
              }}
              className="text-xs px-2 py-0.5 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Apply Filter ({filteredVerbs.length})
            </button>
          )}
          <button onClick={() => setOpen(!open)} className="text-xs px-2 py-0.5 border rounded">
            {open ? 'Hide' : 'Show'}
          </button>
        </div>
      </div>

      {/* Verb understanding controls */}
      {verbState && setVerbState && (
        <div className="mt-2 space-y-2 text-xs">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-gray-600 dark:text-gray-400">Tense:</span>
              <select
                value={verbState.tense}
                onChange={(e) => setVerbState({...verbState, tense: e.target.value as any})}
                className="p-1 border border-gray-300 rounded text-xs dark:border-gray-600 dark:bg-gray-800"
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
              <span className="text-gray-600 dark:text-gray-400">Person:</span>
              <select
                value={verbState.person}
                onChange={(e) => setVerbState({...verbState, person: e.target.value as '1st' | '2nd' | '3rd'})}
                className="p-1 border border-gray-300 rounded text-xs dark:border-gray-600 dark:bg-gray-800"
              >
                <option value="1st">1st Person (م)</option>
                <option value="2nd">2nd Person (ې)</option>
                <option value="3rd">3rd Person (ي)</option>
              </select>
            </div>

            <div className="text-gray-500 dark:text-gray-400">
              {filteredVerbs.length} forms
            </div>
          </div>
        </div>
      )}
      {open && (
        <div className="mt-2">
          {/* Verb forms - filtered or unfiltered based on controls */}
          {hasAnyForms ? (
            <>
              {filteredVerbs.length > 0 && (
                <div className="mb-3">
                  <div className="text-xs text-gray-500 mb-2 font-medium">
                    Verbs ({verbState ? `Filtered: ${filteredVerbs.length}` : 'All forms'})
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
            <div className="text-xs text-gray-500 italic">
              No related forms found. Try searching for a different term.
            </div>
          )}
        </div>
      )}
    </div>
  )
}
