"use client";

/**
 * FilterPanel Component
 * Consolidates POS filter bar and POS-specific filter drawers
 * Now with D1-backed facet counts for dynamic filtering
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
  searchQuery?: string; // The current search query (lemma for verbs)
}

export default function FilterPanel({
  includeRelated,
  relatedForms,
  onApplyFilters,
  activeVariantForms = [],
  onPickForm,
  searchQuery,
}: FilterPanelProps) {
  const { filters } = useSearchFilters();
  
  const selectedPartOfSpeech = filters.pos.selected.length > 0 
    ? (filters.pos.selected[0] as 'verb' | 'noun' | 'adjective')
    : 'auto';
    
  // Determine the lemma for verb/noun facet counts
  const lemma = relatedForms?.root || searchQuery;

  if (!includeRelated) {
    return null;
  }

  // Helper to check if there are forms of a given type
  const hasNouns = (relatedForms?.nouns?.length ?? 0) > 0 || 
                   (relatedForms?.forms?.nouns?.length ?? 0) > 0;
  const hasVerbs = (relatedForms?.verbs?.length ?? 0) > 0 || 
                   (relatedForms?.forms?.verbs?.length ?? 0) > 0;
  const hasAdjectives = (relatedForms?.adjectives?.length ?? 0) > 0 || 
                        (relatedForms?.forms?.adjectives?.length ?? 0) > 0 ||
                        (relatedForms?.other?.length ?? 0) > 0 ||
                        (relatedForms?.forms?.other?.length ?? 0) > 0;

  // Priority: posGuess takes precedence, then fallback to what forms exist
  // IMPORTANT: Noun takes priority over verb when posGuess is 'noun'
  const posGuess = relatedForms?.posGuess;

  const showNounFilters = selectedPartOfSpeech === 'noun' || 
    (selectedPartOfSpeech === 'auto' && posGuess === 'noun');

  const showVerbFilters = selectedPartOfSpeech === 'verb' || 
    (selectedPartOfSpeech === 'auto' && (
      posGuess === 'verb' ||
      // Only show verb filters if no posGuess AND there are verbs but no nouns
      (!posGuess && hasVerbs && !hasNouns)
    ));

  const showAdjectiveFilters = selectedPartOfSpeech === 'adjective' || 
    (selectedPartOfSpeech === 'auto' && (
      posGuess === 'adjective' || posGuess === 'adj'
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
          lemma={lemma}
        />
      )}

      {showNounFilters && (
        <NounFilterDrawer 
          onApplyFilters={onApplyFilters} 
          lemma={lemma}
          nounForms={relatedForms?.nouns || relatedForms?.forms?.nouns || []}
        />
      )}

      {showAdjectiveFilters && (
        <AdjectiveFilterDrawer 
          onApplyFilters={onApplyFilters} 
          lemma={lemma}
          adjectiveForms={relatedForms?.adjectives || relatedForms?.forms?.adjectives || relatedForms?.other || relatedForms?.forms?.other || []}
        />
      )}
    </div>
  );
}

