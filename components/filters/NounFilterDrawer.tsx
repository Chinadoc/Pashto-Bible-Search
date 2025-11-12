"use client";

/**
 * NounFilterDrawer Component
 * Filters for noun inflections: inflectionType, gender, inflectionReason
 */

import { useSearchFilters } from '@/app/contexts/SearchFiltersContext';
import { isDefaultNounFilter } from '@/app/reducers/searchFiltersReducer';
import type { NounInflectionType, NounGender, InflectionReasonFilter } from '@/types';

interface NounFilterDrawerProps {
  onApplyFilters: () => void;
}

const DEFAULT_NOUN_FILTER = {
  inflectionType: 'all' as NounInflectionType,
  gender: 'all' as NounGender,
  inflectionReason: 'all' as InflectionReasonFilter,
};

export default function NounFilterDrawer({ onApplyFilters }: NounFilterDrawerProps) {
  const { filters, dispatch } = useSearchFilters();
  const nounFilters = filters.noun;

  const setNounFilters = (newFilters: typeof nounFilters) => {
    dispatch({ type: 'SET_NOUN_FILTERS', filters: newFilters });
    onApplyFilters();
  };

  const handleReset = () => {
    setNounFilters(DEFAULT_NOUN_FILTER);
  };

  return (
    <div className="p-4 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Filter by noun inflection {!isDefaultNounFilter(nounFilters) && '(Active)'}:
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
            value={nounFilters.inflectionType}
            onChange={(e) => setNounFilters({ ...nounFilters, inflectionType: e.target.value as NounInflectionType })}
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
            value={nounFilters.gender}
            onChange={(e) => setNounFilters({ ...nounFilters, gender: e.target.value as NounGender })}
            className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All</option>
            <option value="masculine">Masculine</option>
            <option value="feminine">Feminine</option>
          </select>
        </div>

        {/* Inflection Reason Filter */}
        <div className="md:col-span-2">
          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
            Inflection Reason:
          </label>
          <select
            value={nounFilters.inflectionReason || 'all'}
            onChange={(e) => setNounFilters({ ...nounFilters, inflectionReason: e.target.value as InflectionReasonFilter })}
            className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All</option>
            <option value="plural">Plural</option>
            <option value="sandwich">Sandwich</option>
            <option value="transitive_past">Transitive Past</option>
          </select>
        </div>
      </div>
    </div>
  );
}

