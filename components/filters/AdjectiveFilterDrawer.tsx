"use client";

/**
 * AdjectiveFilterDrawer Component
 * Filters for adjective inflections: inflectionType, gender
 */

import { useSearchFilters } from '@/app/contexts/SearchFiltersContext';
import { isDefaultAdjectiveFilter } from '@/app/reducers/searchFiltersReducer';
import type { AdjectiveInflectionType, AdjectiveGender } from '@/types';

interface AdjectiveFilterDrawerProps {
  onApplyFilters: () => void;
}

const DEFAULT_ADJECTIVE_FILTER = {
  inflectionType: 'all' as AdjectiveInflectionType,
  gender: 'all' as AdjectiveGender,
  category: 'all' as const,
  grammaticalCase: 'all' as const,
  number: 'all' as const,
};

export default function AdjectiveFilterDrawer({ onApplyFilters }: AdjectiveFilterDrawerProps) {
  const { filters, dispatch } = useSearchFilters();
  const adjectiveFilters = filters.adjective;

  const setAdjectiveFilters = (newFilters: typeof adjectiveFilters) => {
    dispatch({ type: 'SET_ADJECTIVE_FILTERS', filters: newFilters });
    onApplyFilters();
  };

  const handleReset = () => {
    setAdjectiveFilters(DEFAULT_ADJECTIVE_FILTER);
  };

  return (
    <div className="p-4 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Filter by adjective inflection {!isDefaultAdjectiveFilter(adjectiveFilters) && '(Active)'}:
        </span>
        <button
          onClick={handleReset}
          className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
        >
          Reset filters
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Inflection Type Filter */}
        <div>
          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
            Inflection Type:
          </label>
          <select
            value={adjectiveFilters.inflectionType}
            onChange={(e) => setAdjectiveFilters({ ...adjectiveFilters, inflectionType: e.target.value as AdjectiveInflectionType })}
            className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All</option>
            <option value="plain">Plain</option>
            <option value="1st">1st Inflection</option>
            <option value="2nd">2nd Inflection</option>
            <option value="plural">Plural</option>
            <option value="vocative">Vocative</option>
            <option value="bundled">Bundled</option>
          </select>
        </div>

        {/* Gender Filter */}
        <div>
          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
            Gender:
          </label>
          <select
            value={adjectiveFilters.gender}
            onChange={(e) => setAdjectiveFilters({ ...adjectiveFilters, gender: e.target.value as AdjectiveGender })}
            className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All</option>
            <option value="masculine">Masculine</option>
            <option value="feminine">Feminine</option>
          </select>
        </div>
      </div>
    </div>
  );
}

