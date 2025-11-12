"use client";

/**
 * POSFilterBar Component
 * Displays Part of Speech selector and conditionally shows verb/noun/adjective filters
 */

import { useSearchFilters } from '@/app/contexts/SearchFiltersContext';
import type { PartOfSpeech } from '@/types/search';
import type { RelatedFormsData } from '@/types';

interface POSFilterBarProps {
  includeRelated: boolean;
  relatedForms: RelatedFormsData | null;
  onApplyFilters: () => void;
}

export default function POSFilterBar({
  includeRelated,
  relatedForms,
  onApplyFilters,
}: POSFilterBarProps) {
  const { filters, dispatch } = useSearchFilters();
  
  const selectedPartOfSpeech = filters.pos.selected.length > 0 
    ? (filters.pos.selected[0] as 'verb' | 'noun' | 'adjective')
    : 'auto';
  
  const setSelectedPartOfSpeech = (pos: 'auto' | 'verb' | 'noun' | 'adjective') => {
    if (pos === 'auto') {
      dispatch({ type: 'CLEAR_POS_FILTERS' });
    } else {
      dispatch({ type: 'SET_POS_FILTER', pos: [pos] });
    }
    onApplyFilters();
  };

  if (!includeRelated) {
    return null;
  }

  return (
    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-4 mb-3">
        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          Filter by Part of Speech:
        </span>
        <select
          value={selectedPartOfSpeech}
          onChange={(e) => {
            const newPos = e.target.value as 'auto' | 'verb' | 'noun' | 'adjective';
            setSelectedPartOfSpeech(newPos);
          }}
          className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="auto">Auto (detect from word)</option>
          <option value="verb">Verb</option>
          <option value="noun">Noun</option>
          <option value="adjective">Adjective</option>
        </select>
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {selectedPartOfSpeech === 'auto' && relatedForms?.posGuess && `(Detected: ${relatedForms.posGuess})`}
        </span>
      </div>
      
      {/* Show active POS indicator */}
      {selectedPartOfSpeech !== 'auto' && (
        <div className="mt-2 text-xs text-blue-700 dark:text-blue-300">
          Filtering by: <strong>{selectedPartOfSpeech}</strong>
        </div>
      )}
    </div>
  );
}

