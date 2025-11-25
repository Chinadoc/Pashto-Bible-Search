"use client";

/**
 * VerbFilterDrawer Component
 * Multi-select filters for verb forms with D1-backed facet counts
 * Shows context-aware counts that update dynamically as filters change
 */

import { useMemo, useCallback } from 'react';
import { useSearchFilters } from '@/app/contexts/SearchFiltersContext';
import { isDefaultMultiVerbFilter } from '@/app/reducers/searchFiltersReducer';
import { useMorphologyFacets } from '@/hooks/useMorphologyFacets';
import FacetGroup, { FacetOption } from './FacetGroup';
import ActiveChips from './ActiveChips';
import VerbFormsStrip from './VerbFormsStrip';
import type { 
  VerbFilterPerson, 
  VerbFilterTense, 
  VerbFilterAspect, 
  VerbFilterMood,
  MultiVerbFilterState,
} from '@/types';

interface VerbFilterDrawerProps {
  onApplyFilters: () => void;
  activeVariantForms?: string[];
  onPickForm?: (form: string) => void;
  lemma?: string; // The verb lemma being searched (for facet counts)
}

function toggleMultiFilter<T extends string>(
  currentValues: T[],
  value: T,
  allValue: T = 'all' as T
): T[] {
  if (value === allValue) {
    // Toggle "all" - if it's selected, deselect everything; if not, select only "all"
    return currentValues.includes(allValue) ? [] : [allValue];
  }

  const withoutAll = currentValues.filter(v => v !== allValue);

  if (withoutAll.includes(value)) {
    // Deselect the value
    const newValues = withoutAll.filter(v => v !== value);
    // If no specific values remain, select "all"
    return newValues.length === 0 ? [allValue] : newValues;
  } else {
    // Select the value
    return [...withoutAll, value];
  }
}

const DEFAULT_MULTI_VERB_FILTER: MultiVerbFilterState = {
  person: ['all'] as VerbFilterPerson[],
  tense: ['all'] as VerbFilterTense[],
  aspect: ['all'] as VerbFilterAspect[],
  mood: ['all'] as VerbFilterMood[],
};

// Define tense display order and labels
const TENSE_OPTIONS: Array<{ value: VerbFilterTense; label: string }> = [
  { value: 'present', label: 'Present' },
  { value: 'past', label: 'Past' },
  { value: 'future', label: 'Future' },
  { value: 'perfect', label: 'Perfect' },
  { value: 'subjunctive', label: 'Subjunctive' },
  { value: 'imperative', label: 'Imperative' },
  { value: 'ability', label: 'Ability' },
  { value: 'habitual', label: 'Habitual' },
];

const PERSON_OPTIONS: Array<{ value: VerbFilterPerson; label: string }> = [
  { value: '1st', label: '1st (I/we)' },
  { value: '2nd', label: '2nd (you)' },
  { value: '3rd', label: '3rd (he/she/they)' },
];

const ASPECT_OPTIONS: Array<{ value: VerbFilterAspect; label: string }> = [
  { value: 'imperfective', label: 'Imperfective' },
  { value: 'perfective', label: 'Perfective' },
];

const MOOD_OPTIONS: Array<{ value: VerbFilterMood; label: string }> = [
  { value: 'indicative', label: 'Indicative' },
  { value: 'subjunctive', label: 'Subjunctive' },
  { value: 'imperative', label: 'Imperative' },
  { value: 'ability', label: 'Ability' },
];

export default function VerbFilterDrawer({
  onApplyFilters,
  activeVariantForms = [],
  onPickForm,
  lemma,
}: VerbFilterDrawerProps) {
  const { filters, dispatch } = useSearchFilters();
  const multiVerbFilters = filters.verb;

  // Fetch facet counts from D1
  const { facets, matchingForms, isLoading } = useMorphologyFacets({
    lemma: lemma || null,
    filters: multiVerbFilters,
    enabled: !!lemma,
    debounceMs: 150,
  });

  const setMultiVerbFilters = useCallback((newFilters: typeof multiVerbFilters) => {
    dispatch({ type: 'SET_VERB_FILTERS', filters: newFilters });
    onApplyFilters();
  }, [dispatch, onApplyFilters]);

  const handleReset = useCallback(() => {
    setMultiVerbFilters(DEFAULT_MULTI_VERB_FILTER);
  }, [setMultiVerbFilters]);

  const handleRemoveChip = useCallback((facet: keyof MultiVerbFilterState, value: string) => {
    const currentValues = multiVerbFilters[facet] as string[];
    const newValues = currentValues.filter(v => v !== value);
    setMultiVerbFilters({
      ...multiVerbFilters,
      [facet]: newValues.length === 0 ? ['all'] : newValues,
    });
  }, [multiVerbFilters, setMultiVerbFilters]);

  // Build FacetOption arrays with counts
  const personOptions: FacetOption[] = useMemo(() => {
    return PERSON_OPTIONS.map(opt => ({
      value: opt.value,
      label: opt.label,
      count: facets?.person[opt.value] || 0,
      disabled: (facets?.person[opt.value] || 0) === 0,
    }));
  }, [facets]);

  const tenseOptions: FacetOption[] = useMemo(() => {
    return TENSE_OPTIONS.map(opt => ({
      value: opt.value,
      label: opt.label,
      count: facets?.tense[opt.value] || 0,
      disabled: (facets?.tense[opt.value] || 0) === 0,
    }));
  }, [facets]);

  const aspectOptions: FacetOption[] = useMemo(() => {
    return ASPECT_OPTIONS.map(opt => ({
      value: opt.value,
      label: opt.label,
      count: facets?.aspect[opt.value] || 0,
      disabled: (facets?.aspect[opt.value] || 0) === 0,
    }));
  }, [facets]);

  const moodOptions: FacetOption[] = useMemo(() => {
    return MOOD_OPTIONS.map(opt => ({
      value: opt.value,
      label: opt.label,
      count: facets?.mood[opt.value] || 0,
      disabled: (facets?.mood[opt.value] || 0) === 0,
    }));
  }, [facets]);

  const isDefault = isDefaultMultiVerbFilter(multiVerbFilters);

  // Use matching forms from facets API or fall back to provided forms
  const displayForms = matchingForms.length > 0 ? matchingForms : activeVariantForms;

  return (
    <div className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
      {/* Active chips bar */}
      <ActiveChips
        filters={multiVerbFilters}
        onRemove={handleRemoveChip}
        onReset={handleReset}
        matchingCount={facets?.matchingVerses}
        isLoading={isLoading}
      />

      {/* Main filter panel */}
      <div className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Filter by verb form
          </span>
          {!isDefault && (
            <span className="text-xs px-2 py-0.5 bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 rounded-full">
              Active
            </span>
          )}
          {lemma && (
            <span className="text-xs text-gray-500 dark:text-gray-400 ml-auto">
              Verb: <span className="font-medium" style={{ direction: 'rtl' }}>{lemma}</span>
            </span>
          )}
        </div>

        {/* Responsive grid layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Person Filter */}
          <FacetGroup
            title="Person"
            options={personOptions}
            selected={multiVerbFilters.person.filter(v => v !== 'all')}
            onToggle={(value) => {
              const newPerson = toggleMultiFilter(multiVerbFilters.person, value as VerbFilterPerson);
              setMultiVerbFilters({ ...multiVerbFilters, person: newPerson });
            }}
            isLoading={isLoading}
          />

          {/* Tense Filter */}
          <div className="sm:col-span-1 lg:col-span-1">
            <FacetGroup
              title="Tense"
              options={tenseOptions}
              selected={multiVerbFilters.tense.filter(v => v !== 'all')}
              onToggle={(value) => {
                const newTense = toggleMultiFilter(multiVerbFilters.tense, value as VerbFilterTense);
                setMultiVerbFilters({ ...multiVerbFilters, tense: newTense });
              }}
              isLoading={isLoading}
            />
          </div>

          {/* Aspect Filter */}
          <FacetGroup
            title="Aspect"
            options={aspectOptions}
            selected={multiVerbFilters.aspect.filter(v => v !== 'all')}
            onToggle={(value) => {
              const newAspect = toggleMultiFilter(multiVerbFilters.aspect, value as VerbFilterAspect);
              setMultiVerbFilters({ ...multiVerbFilters, aspect: newAspect });
            }}
            isLoading={isLoading}
          />

          {/* Mood Filter */}
          <FacetGroup
            title="Mood"
            options={moodOptions}
            selected={multiVerbFilters.mood.filter(v => v !== 'all')}
            onToggle={(value) => {
              const newMood = toggleMultiFilter(multiVerbFilters.mood, value as VerbFilterMood);
              setMultiVerbFilters({ ...multiVerbFilters, mood: newMood });
            }}
            isLoading={isLoading}
          />
        </div>

        {/* Verb forms strip */}
        {displayForms.length > 0 && (
          <VerbFormsStrip
            forms={displayForms}
            onPickForm={onPickForm}
            isLoading={isLoading}
          />
        )}
      </div>
    </div>
  );
}
