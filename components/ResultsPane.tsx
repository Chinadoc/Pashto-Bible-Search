"use client";

/**
 * ResultsPane Component
 * Consolidates results header, dictionary disambiguation, word alternative uses, filter panel, and results list
 */

import DictionaryDisambiguation from './DictionaryDisambiguation';
import WordAlternativeUses from './WordAlternativeUses';
import FilterPanel from './FilterPanel';
import ResultsList from './ResultsList';
import type {
  Verse,
  RelatedFormsData,
  PhraseResponse,
  DictionaryData,
  MultiVerbFilterState,
} from '@/types';

interface ResultsPaneProps {
  results: Verse[];
  filteredResults: Verse[];
  totalEstimatedCount?: number;
  hasMoreResults: boolean;
  isLoading: boolean;
  processed: PhraseResponse['processed'] | null;
  dictionaryData?: DictionaryData | null;
  relatedForms: RelatedFormsData | null;
  includeRelated: boolean;
  query: string;
  activeVariantForms: string[];
  onPickForm: (form: string) => void;
  audioMap: Record<string, string>;
  multiVerbFilters?: MultiVerbFilterState;
  onResetFilters: () => void;
}

export default function ResultsPane({
  results,
  filteredResults,
  totalEstimatedCount,
  hasMoreResults,
  isLoading,
  processed,
  dictionaryData,
  relatedForms,
  includeRelated,
  query,
  activeVariantForms,
  onPickForm,
  audioMap,
  multiVerbFilters,
  onResetFilters,
}: ResultsPaneProps) {
  const handleApplyFilters = () => {
    // Filters are applied automatically via context/dispatch
    // This callback can trigger a search refresh if needed
  };

  return (
    <div className="lg:col-span-3">
      {/* Dictionary Disambiguation - Show before results */}
      {dictionaryData && (
        <DictionaryDisambiguation
          dictionary={dictionaryData}
          query={query}
        />
      )}

      {/* Alternative Uses Alert - Show alternative grammatical contexts */}
      {query.trim() && relatedForms && (
        <WordAlternativeUses
          word={query.trim()}
          pos={relatedForms.posGuess || undefined}
          onSelectForm={onPickForm}
        />
      )}

      {/* Filter Panel */}
      <FilterPanel
        includeRelated={includeRelated}
        relatedForms={relatedForms}
        onApplyFilters={handleApplyFilters}
        activeVariantForms={activeVariantForms}
        onPickForm={onPickForm}
        searchQuery={query}
      />

      {/* Results Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow mb-4">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Results ({filteredResults.length}{totalEstimatedCount && totalEstimatedCount > results.length ? ` of ~${totalEstimatedCount}` : results.length !== filteredResults.length ? ` of ${results.length}` : ''}{hasMoreResults ? '+' : ''})
          </h2>
        </div>

        {/* English matches display */}
        {processed?.language === 'english' && processed?.englishMatches && processed.englishMatches.length > 0 && (
          <div className="px-4 py-3 bg-orange-50 dark:bg-orange-900/20 border-b border-orange-200 dark:border-orange-700">
            <p className="text-xs text-orange-700 dark:text-orange-300 font-medium mb-1">
              Dictionary matches for "{processed.original}":
            </p>
            <div className="flex flex-wrap gap-2 text-xs">
              {processed.englishMatches.slice(0, 4).map((match, idx) => (
                <span
                  key={`${match.pashto}-${idx}`}
                  className="px-2 py-1 rounded-full bg-orange-500/10 text-orange-700 dark:text-orange-200 border border-orange-300/50"
                >
                  {match.pashto}
                  {match.romanized ? ` · ${match.romanized}` : ''}
                </span>
              ))}
              {processed.englishMatches.length > 4 && (
                <span className="text-orange-600 dark:text-orange-300">+{processed.englishMatches.length - 4} more</span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Results List */}
      <ResultsList
        results={filteredResults}
        audioMap={audioMap}
        loading={isLoading}
        processed={processed}
        dictionaryData={dictionaryData}
        multiVerbFilters={multiVerbFilters}
        activeVariantForms={activeVariantForms}
        onResetFilters={onResetFilters}
      />
    </div>
  );
}

