"use client";

/**
 * VerbFilterDrawer Component
 * Multi-select filters for verb forms: person, tense, aspect, mood
 */

import { useSearchFilters } from '@/app/contexts/SearchFiltersContext';
import { isDefaultMultiVerbFilter } from '@/app/reducers/searchFiltersReducer';
import type { VerbFilterPerson, VerbFilterTense, VerbFilterAspect, VerbFilterMood } from '@/types';

interface VerbFilterDrawerProps {
  onApplyFilters: () => void;
  activeVariantForms?: string[];
  onPickForm?: (form: string) => void;
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

const DEFAULT_MULTI_VERB_FILTER = {
  person: ['all'] as VerbFilterPerson[],
  tense: ['all'] as VerbFilterTense[],
  aspect: ['all'] as VerbFilterAspect[],
  mood: ['all'] as VerbFilterMood[],
};

export default function VerbFilterDrawer({
  onApplyFilters,
  activeVariantForms = [],
  onPickForm,
}: VerbFilterDrawerProps) {
  const { filters, dispatch } = useSearchFilters();
  const multiVerbFilters = filters.verb;

  const setMultiVerbFilters = (newFilters: typeof multiVerbFilters) => {
    dispatch({ type: 'SET_VERB_FILTERS', filters: newFilters });
    onApplyFilters();
  };

  const handleReset = () => {
    setMultiVerbFilters(DEFAULT_MULTI_VERB_FILTER);
  };

  return (
    <div className="p-4 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Filter by verb form {!isDefaultMultiVerbFilter(multiVerbFilters) && '(Active)'}:
        </span>
        <button
          onClick={handleReset}
          className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
        >
          Reset filters
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Person Filter */}
        <div>
          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
            Person:
          </label>
          <div className="space-y-1">
            <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 px-2 py-1 rounded">
              <input
                type="checkbox"
                checked={multiVerbFilters.person.includes('all')}
                onChange={() => {
                  const newPerson = toggleMultiFilter(multiVerbFilters.person, 'all');
                  setMultiVerbFilters({ ...multiVerbFilters, person: newPerson });
                }}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              />
              <span className="font-medium">All</span>
            </label>
            {[{ value: '1st', label: '1st (I/we)' }, { value: '2nd', label: '2nd (you)' }, { value: '3rd', label: '3rd (he/she/they)' }].map((option) => (
              <label key={option.value} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 px-2 py-1 rounded">
                <input
                  type="checkbox"
                  checked={multiVerbFilters.person.includes(option.value as VerbFilterPerson)}
                  onChange={() => {
                    const newPerson = toggleMultiFilter(multiVerbFilters.person, option.value as VerbFilterPerson);
                    setMultiVerbFilters({ ...multiVerbFilters, person: newPerson });
                  }}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <span>{option.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Tense Filter */}
        <div>
          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
            Tense:
          </label>
          <div className="space-y-1 max-h-48 overflow-y-auto">
            <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 px-2 py-1 rounded">
              <input
                type="checkbox"
                checked={multiVerbFilters.tense.includes('all')}
                onChange={() => {
                  const newTense = toggleMultiFilter(multiVerbFilters.tense, 'all');
                  setMultiVerbFilters({ ...multiVerbFilters, tense: newTense });
                }}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              />
              <span className="font-medium">All</span>
            </label>
            {['present', 'past', 'future', 'perfect', 'subjunctive', 'imperative', 'ability', 'habitual'].map((tense) => (
              <label key={tense} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 px-2 py-1 rounded">
                <input
                  type="checkbox"
                  checked={multiVerbFilters.tense.includes(tense as VerbFilterTense)}
                  onChange={() => {
                    const newTense = toggleMultiFilter(multiVerbFilters.tense, tense as VerbFilterTense);
                    setMultiVerbFilters({ ...multiVerbFilters, tense: newTense });
                  }}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <span className="capitalize">{tense}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Aspect Filter */}
        <div>
          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
            Aspect:
          </label>
          <div className="space-y-1">
            <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 px-2 py-1 rounded">
              <input
                type="checkbox"
                checked={multiVerbFilters.aspect.includes('all')}
                onChange={() => {
                  const newAspect = toggleMultiFilter(multiVerbFilters.aspect, 'all');
                  setMultiVerbFilters({ ...multiVerbFilters, aspect: newAspect });
                }}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              />
              <span className="font-medium">All</span>
            </label>
            {['imperfective', 'perfective'].map((aspect) => (
              <label key={aspect} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 px-2 py-1 rounded">
                <input
                  type="checkbox"
                  checked={multiVerbFilters.aspect.includes(aspect as VerbFilterAspect)}
                  onChange={() => {
                    const newAspect = toggleMultiFilter(multiVerbFilters.aspect, aspect as VerbFilterAspect);
                    setMultiVerbFilters({ ...multiVerbFilters, aspect: newAspect });
                  }}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <span className="capitalize">{aspect}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Mood Filter */}
        <div>
          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
            Mood:
          </label>
          <div className="space-y-1">
            <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 px-2 py-1 rounded">
              <input
                type="checkbox"
                checked={multiVerbFilters.mood.includes('all')}
                onChange={() => {
                  const newMood = toggleMultiFilter(multiVerbFilters.mood, 'all');
                  setMultiVerbFilters({ ...multiVerbFilters, mood: newMood });
                }}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              />
              <span className="font-medium">All</span>
            </label>
            {['indicative', 'subjunctive', 'imperative', 'ability'].map((mood) => (
              <label key={mood} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 px-2 py-1 rounded">
                <input
                  type="checkbox"
                  checked={multiVerbFilters.mood.includes(mood as VerbFilterMood)}
                  onChange={() => {
                    const newMood = toggleMultiFilter(multiVerbFilters.mood, mood as VerbFilterMood);
                    setMultiVerbFilters({ ...multiVerbFilters, mood: newMood });
                  }}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <span className="capitalize">{mood}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Show which forms are being searched */}
      {activeVariantForms.length > 0 && onPickForm && (
        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
          <p className="text-xs text-gray-600 dark:text-gray-400">
            Searching with {activeVariantForms.length} verb forms
            {activeVariantForms.slice(0, 5).map((form) => (
              <button
                key={form}
                onClick={() => onPickForm(form)}
                className="ml-2 px-2 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded text-xs hover:bg-blue-200 dark:hover:bg-blue-800"
              >
                {form}
              </button>
            ))}
            {activeVariantForms.length > 5 && (
              <span className="ml-2 text-gray-500">
                +{activeVariantForms.length - 5} more
              </span>
            )}
          </p>
        </div>
      )}
    </div>
  );
}

