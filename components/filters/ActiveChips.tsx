"use client";

/**
 * ActiveChips Component
 * Displays active filter selections as removable chips
 * Shows in a sticky bar above the filter panel
 */

import type { MultiVerbFilterState } from '@/types';

interface ActiveChipsProps {
  filters: MultiVerbFilterState;
  onRemove: (facet: keyof MultiVerbFilterState, value: string) => void;
  onReset: () => void;
  matchingCount?: number;
  isLoading?: boolean;
}

const FACET_LABELS: Record<keyof MultiVerbFilterState, string> = {
  person: 'Person',
  tense: 'Tense',
  aspect: 'Aspect',
  mood: 'Mood',
};

const VALUE_LABELS: Record<string, string> = {
  '1st': '1st Person',
  '2nd': '2nd Person', 
  '3rd': '3rd Person',
  present: 'Present',
  past: 'Past',
  future: 'Future',
  perfect: 'Perfect',
  subjunctive: 'Subjunctive',
  imperative: 'Imperative',
  ability: 'Ability',
  habitual: 'Habitual',
  imperfective: 'Imperfective',
  perfective: 'Perfective',
  indicative: 'Indicative',
};

function isDefaultFilter(filters: MultiVerbFilterState): boolean {
  return (
    (filters.person.length === 0 || (filters.person.length === 1 && filters.person[0] === 'all')) &&
    (filters.tense.length === 0 || (filters.tense.length === 1 && filters.tense[0] === 'all')) &&
    (filters.aspect.length === 0 || (filters.aspect.length === 1 && filters.aspect[0] === 'all')) &&
    (filters.mood.length === 0 || (filters.mood.length === 1 && filters.mood[0] === 'all'))
  );
}

export default function ActiveChips({
  filters,
  onRemove,
  onReset,
  matchingCount,
  isLoading = false,
}: ActiveChipsProps) {
  const hasActiveFilters = !isDefaultFilter(filters);

  // Collect all active filter values
  const activeChips: Array<{ facet: keyof MultiVerbFilterState; value: string }> = [];
  
  for (const [facet, values] of Object.entries(filters) as Array<[keyof MultiVerbFilterState, string[]]>) {
    for (const value of values) {
      if (value !== 'all') {
        activeChips.push({ facet, value });
      }
    }
  }

  if (!hasActiveFilters && !matchingCount) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border-b border-indigo-100 dark:border-indigo-800">
      {/* Matching count indicator */}
      {matchingCount !== undefined && (
        <div className={`
          flex items-center gap-1.5 text-sm font-medium
          ${isLoading ? 'opacity-50' : ''}
          text-indigo-700 dark:text-indigo-300
        `}>
          <span className={`
            inline-flex items-center justify-center min-w-[1.75rem] h-6 px-1.5
            bg-indigo-100 dark:bg-indigo-800 rounded-full text-xs font-bold
            ${isLoading ? 'animate-pulse' : ''}
          `}>
            {matchingCount}
          </span>
          <span>matching forms</span>
        </div>
      )}

      {/* Divider */}
      {matchingCount !== undefined && activeChips.length > 0 && (
        <div className="w-px h-5 bg-indigo-200 dark:bg-indigo-700" />
      )}

      {/* Active filter chips */}
      {activeChips.map(({ facet, value }) => (
        <button
          key={`${facet}-${value}`}
          onClick={() => onRemove(facet, value)}
          className="
            inline-flex items-center gap-1 px-2.5 py-1 
            bg-white dark:bg-gray-800 
            border border-indigo-200 dark:border-indigo-700
            rounded-full text-sm text-indigo-700 dark:text-indigo-300
            hover:bg-indigo-50 dark:hover:bg-indigo-900/50
            hover:border-indigo-300 dark:hover:border-indigo-600
            transition-all duration-150
            group
          "
        >
          <span className="text-xs text-indigo-500 dark:text-indigo-400 font-medium">
            {FACET_LABELS[facet]}:
          </span>
          <span className="font-medium">
            {VALUE_LABELS[value] || value}
          </span>
          <svg 
            className="w-3.5 h-3.5 text-indigo-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      ))}

      {/* Reset button */}
      {hasActiveFilters && (
        <button
          onClick={onReset}
          className="
            inline-flex items-center gap-1 px-2.5 py-1
            text-sm text-indigo-600 dark:text-indigo-400
            hover:text-indigo-800 dark:hover:text-indigo-300
            hover:underline
            transition-colors duration-150
          "
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Reset all
        </button>
      )}
    </div>
  );
}

