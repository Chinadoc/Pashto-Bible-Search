"use client";

/**
 * FilterPanel Component
 * Consolidates POS filter bar and POS-specific filter drawers
 */

import POSFilterBar from './POSFilterBar';
import VerbFilterDrawer from './filters/VerbFilterDrawer';
import NounFilterDrawer from './filters/NounFilterDrawer';
import AdjectiveFilterDrawer from './filters/AdjectiveFilterDrawer';
import { useSearchFilters } from '@/app/contexts/SearchFiltersContext';
import type { RelatedFormsData } from '@/types';

interface FilterPanelProps {
  includeRelated: boolean;
  relatedForms: RelatedFormsData | null;
  onApplyFilters: () => void;
  activeVariantForms?: string[];
  onPickForm?: (form: string) => void;
}

export default function FilterPanel({
  includeRelated,
  relatedForms,
  onApplyFilters,
  activeVariantForms = [],
  onPickForm,
}: FilterPanelProps) {
  const { filters } = useSearchFilters();
  
  const selectedPartOfSpeech = filters.pos.selected.length > 0 
    ? (filters.pos.selected[0] as 'verb' | 'noun' | 'adjective')
    : 'auto';

  if (!includeRelated) {
    return null;
  }

  // Determine which POS filters to show based on selectedPartOfSpeech or auto-detection
  const showVerbFilters = selectedPartOfSpeech === 'verb' || 
    (selectedPartOfSpeech === 'auto' && (
      relatedForms?.posGuess === 'verb' ||
      (!relatedForms?.posGuess && relatedForms?.verbs && relatedForms.verbs.length > 0)
    ));

  const showNounFilters = selectedPartOfSpeech === 'noun' || 
    (selectedPartOfSpeech === 'auto' && (
      relatedForms?.posGuess === 'noun' && 
      relatedForms.nouns && 
      relatedForms.nouns.length > 0
    ));

  const showAdjectiveFilters = selectedPartOfSpeech === 'adjective' || 
    (selectedPartOfSpeech === 'auto' && (
      (relatedForms?.posGuess === 'adjective' || relatedForms?.posGuess === 'adj') && 
      relatedForms.other && 
      relatedForms.other.length > 0
    ));

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow mb-4">
      {/* POS Filter Bar */}
      <POSFilterBar
        includeRelated={includeRelated}
        relatedForms={relatedForms}
        onApplyFilters={onApplyFilters}
      />

      {/* Conditional POS-specific filter drawers */}
      {showVerbFilters && (
        <VerbFilterDrawer
          onApplyFilters={onApplyFilters}
          activeVariantForms={activeVariantForms}
          onPickForm={onPickForm}
        />
      )}

      {showNounFilters && (
        <NounFilterDrawer onApplyFilters={onApplyFilters} />
      )}

      {showAdjectiveFilters && (
        <AdjectiveFilterDrawer onApplyFilters={onApplyFilters} />
      )}
    </div>
  );
}

