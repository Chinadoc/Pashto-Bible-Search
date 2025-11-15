"use client";

/**
 * ClassicSearchLayout Component
 * Restored classic UI with proper verse metadata, audio controls, and highlighting
 * Uses Cloudflare D1/R2 data with the simpler, proven design
 */

import { useState } from 'react';
import type { Verse, RelatedFormsData, PhraseResponse, CoverageItem, Scope } from '@/types';
import DictionaryDisambiguation from './DictionaryDisambiguation';
import WordAlternativeUses from './WordAlternativeUses';
import FilterPanel from './FilterPanel';
import CoverageSidebar from './CoverageSidebar';
import InlineFrequency from './InlineFrequency';
import HighlightText from './HighlightText';
import { ComplexityLevel } from './CoverageGrid';

interface ClassicSearchLayoutProps {
  results: Verse[];
  filteredResults: Verse[];
  totalEstimatedCount?: number;
  hasMoreResults: boolean;
  isLoading: boolean;
  query: string;
  processed: PhraseResponse['processed'] | null;
  dictionaryData: any;
  relatedForms: RelatedFormsData | null;
  includeRelated: boolean;
  activeVariantForms: string[];
  onPickForm: (form: string) => void;
  audioMap: Record<string, string>;
  multiVerbFilters: any;
  onResetFilters: () => void;
  coverage: CoverageItem[];
  scope: Scope;
  bookFilter: string[];
  onPickBook: (book: string) => void;
  onClearFilters: () => void;
  activeTranslation: 'afghan2023' | 'yousafzai2019';
}

export default function ClassicSearchLayout({
  results,
  filteredResults,
  totalEstimatedCount,
  hasMoreResults,
  isLoading,
  query,
  processed,
  dictionaryData,
  relatedForms,
  includeRelated,
  activeVariantForms,
  onPickForm,
  audioMap,
  multiVerbFilters,
  onResetFilters,
  coverage,
  scope,
  bookFilter,
  onPickBook,
  onClearFilters,
  activeTranslation,
}: ClassicSearchLayoutProps) {

  // Copy verse to clipboard
  const copyToClipboard = (ref: string, text: string) => {
    const content = `${ref}\n${text}`;
    navigator.clipboard.writeText(content).then(() => {
      alert('Verse copied to clipboard!');
    });
  };

  return (
    <div className="space-y-4">
      {/* Dictionary & Alternatives */}
      {dictionaryData && (
        <DictionaryDisambiguation dictionary={dictionaryData} query={query} />
      )}

      {query.trim() && relatedForms && (
        <WordAlternativeUses
          word={query.trim()}
          pos={relatedForms.posGuess || undefined}
          onSelectForm={onPickForm}
        />
      )}

      {/* Main Grid: Results + Coverage Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Results Column */}
        <div className="lg:col-span-3 space-y-4">
          {/* Filter Panel */}
          {relatedForms && (
            <FilterPanel
              includeRelated={includeRelated}
              relatedForms={relatedForms}
              onApplyFilters={() => {}}
              activeVariantForms={activeVariantForms}
              onPickForm={onPickForm}
            />
          )}

          {/* Results Header */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Results ({filteredResults.length}
                {totalEstimatedCount && totalEstimatedCount > results.length && ` of ~${totalEstimatedCount}`}
                {results.length !== filteredResults.length && ` of ${results.length}`}
                {hasMoreResults && '+'})
              </h2>

              {results.length !== filteredResults.length && (
                <button
                  onClick={onResetFilters}
                  className="px-3 py-1.5 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded-md transition"
                >
                  Reset Filters
                </button>
              )}
            </div>

            {/* English Matches */}
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
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Loading State */}
            {isLoading && (
              <div className="p-4 space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/4 mb-2"></div>
                    <div className="h-20 bg-gray-300 dark:bg-gray-700 rounded"></div>
                  </div>
                ))}
              </div>
            )}

            {/* Empty State */}
            {!isLoading && filteredResults.length === 0 && query && (
              <div className="text-center py-12">
                <div className="text-5xl mb-3">🔍</div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
                  No results found
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Try adjusting your search terms or filters
                </p>
              </div>
            )}

            {/* Results List */}
            {!isLoading && filteredResults.length > 0 && (
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredResults.map((verse, index) => {
                  const ref = verse.ref;
                  const hasAudio = audioMap[ref];

                  return (
                    <div
                      key={`${verse.ref}-${index}`}
                      className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition"
                    >
                      {/* Verse Header: Reference + Translation + Actions */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          {/* Reference */}
                          <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                            {ref}
                          </span>

                          {/* Translation Badge */}
                          {verse.translation && (
                            <span
                              className="text-xs px-2 py-0.5 rounded-full"
                              style={{
                                background: activeTranslation === 'afghan2023'
                                  ? '#dcfce7'
                                  : '#fed7aa',
                                color: activeTranslation === 'afghan2023'
                                  ? '#15803d'
                                  : '#9a3412',
                                borderColor: activeTranslation === 'afghan2023'
                                  ? '#86efac'
                                  : '#fdba74'
                              }}
                            >
                              {activeTranslation === 'afghan2023' ? '🇦🇫 Afghan 2023' : '🕌 Yousafzai 2019'}
                            </span>
                          )}
                        </div>

                        {/* Actions: Audio + Copy */}
                        <div className="flex items-center gap-2">
                          {hasAudio && (
                            <button
                              onClick={() => {
                                const audio = new Audio(audioMap[ref]);
                                audio.play();
                              }}
                              className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition"
                              title="Play audio"
                            >
                              🔊
                            </button>
                          )}
                          <button
                            onClick={() => copyToClipboard(ref, verse.text)}
                            className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition text-sm"
                            title="Copy verse"
                          >
                            📋
                          </button>
                        </div>
                      </div>

                      {/* Verse Text with Highlighting */}
                      <div className="pashto-text text-gray-900 dark:text-gray-100">
                        <HighlightText
                          text={verse.text}
                          tokens={query.trim() ? [query.trim()] : []}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* More Available Indicator */}
            {hasMoreResults && filteredResults.length > 0 && (
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border-t border-blue-200 dark:border-blue-700">
                <p className="text-sm text-blue-700 dark:text-blue-300 text-center">
                  + more results available
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Coverage Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-4 space-y-4">
            <CoverageSidebar
              coverage={coverage}
              scope={scope}
              coverageLevel={ComplexityLevel.Basic}
              onPickBook={onPickBook}
              selectedBook={bookFilter.length === 1 ? bookFilter[0] : null}
              selectedBooks={bookFilter}
              onClearFilters={onClearFilters}
              resultsCount={results.length}
              filteredCount={bookFilter.length > 0 ? filteredResults.length : undefined}
              audioMap={audioMap}
            />

            {/* Word Frequency */}
            {query.trim() && (
              <InlineFrequency
                term={query.trim()}
                scope={scope}
                includeRelated={includeRelated}
                onPick={onPickForm}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
