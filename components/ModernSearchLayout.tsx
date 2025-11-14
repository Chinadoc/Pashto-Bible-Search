"use client";

/**
 * ModernSearchLayout Component
 * Comprehensive layout that integrates all search features:
 * - Search controls (scope, fuzzy, related forms)
 * - Filters (POS, verb/noun/adjective filters)
 * - Dictionary detection and disambiguation
 * - Results display with coverage sidebar
 * - Word alternative uses
 */

import { useState } from 'react';
import type { Verse, RelatedFormsData, PhraseResponse, CoverageItem, Scope } from '@/types';
import DictionaryDisambiguation from './DictionaryDisambiguation';
import WordAlternativeUses from './WordAlternativeUses';
import FilterPanel from './FilterPanel';
import CoverageSidebar from './CoverageSidebar';
import { ComplexityLevel } from './CoverageGrid';

interface ModernSearchLayoutProps {
  // Results
  results: Verse[];
  filteredResults: Verse[];
  totalEstimatedCount?: number;
  hasMoreResults: boolean;
  isLoading: boolean;
  query: string;

  // Dictionary & Related Forms
  processed: PhraseResponse['processed'] | null;
  dictionaryData: any;
  relatedForms: RelatedFormsData | null;
  includeRelated: boolean;
  activeVariantForms: string[];
  onPickForm: (form: string) => void;

  // Audio
  audioMap: Record<string, string>;

  // Filters
  multiVerbFilters: any;
  onResetFilters: () => void;

  // Coverage
  coverage: CoverageItem[];
  scope: Scope;
  bookFilter: string[];
  onPickBook: (book: string) => void;
  onClearFilters: () => void;

  // Search Controls
  setIncludeRelated?: (value: boolean) => void;
  enableFuzzy?: boolean;
  setEnableFuzzy?: (value: boolean) => void;
  setScope?: (scope: Scope) => void;
}

export default function ModernSearchLayout({
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
  setIncludeRelated,
  enableFuzzy,
  setEnableFuzzy,
  setScope,
}: ModernSearchLayoutProps) {
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());

  const toggleCard = (ref: string) => {
    const newExpanded = new Set(expandedCards);
    if (newExpanded.has(ref)) {
      newExpanded.delete(ref);
    } else {
      newExpanded.add(ref);
    }
    setExpandedCards(newExpanded);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Search Controls Bar */}
      {(setIncludeRelated || setEnableFuzzy || setScope) && (
        <div className="mb-6 p-4 rounded-2xl" style={{ background: 'var(--surface-elevated)', border: '1px solid var(--border)' }}>
          <div className="flex flex-wrap gap-4 items-center">
            <h3 className="font-semibold text-sm uppercase tracking-wide" style={{ color: 'var(--text-secondary)' }}>
              Search Options
            </h3>

            {setIncludeRelated && (
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeRelated}
                  onChange={(e) => setIncludeRelated(e.target.checked)}
                  className="w-4 h-4 rounded accent-purple-600"
                />
                <span className="text-sm" style={{ color: 'var(--text-primary)' }}>
                  Include Related Forms
                </span>
              </label>
            )}

            {setEnableFuzzy && (
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={enableFuzzy}
                  onChange={(e) => setEnableFuzzy(e.target.checked)}
                  className="w-4 h-4 rounded accent-purple-600"
                />
                <span className="text-sm" style={{ color: 'var(--text-primary)' }}>
                  Fuzzy Search
                </span>
              </label>
            )}

            {setScope && (
              <select
                value={scope}
                onChange={(e) => setScope(e.target.value as Scope)}
                className="px-3 py-1.5 rounded-lg text-sm"
                style={{
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  color: 'var(--text-primary)'
                }}
              >
                <option value="all">All Books</option>
                <option value="ot">Old Testament</option>
                <option value="nt">New Testament</option>
              </select>
            )}
          </div>
        </div>
      )}

      {/* Dictionary Disambiguation */}
      {dictionaryData && (
        <div className="mb-6">
          <DictionaryDisambiguation
            dictionary={dictionaryData}
            query={query}
          />
        </div>
      )}

      {/* Alternative Uses Alert */}
      {query.trim() && relatedForms && (
        <div className="mb-6">
          <WordAlternativeUses
            word={query.trim()}
            pos={relatedForms.posGuess || undefined}
            onSelectForm={onPickForm}
          />
        </div>
      )}

      {/* Main Content Grid: Results + Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Results Column */}
        <div className="lg:col-span-3">
          {/* Filter Panel */}
          {relatedForms && (
            <div className="mb-6">
              <FilterPanel
                includeRelated={includeRelated}
                relatedForms={relatedForms}
                onApplyFilters={() => {}}
                activeVariantForms={activeVariantForms}
                onPickForm={onPickForm}
              />
            </div>
          )}

          {/* Results Header */}
          <div className="mb-6 p-4 rounded-2xl" style={{ background: 'var(--surface-elevated)', border: '1px solid var(--border)' }}>
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                {filteredResults.length} {filteredResults.length === 1 ? 'Result' : 'Results'}
                {totalEstimatedCount && totalEstimatedCount > results.length && ` of ~${totalEstimatedCount}`}
                {hasMoreResults && '+'}
              </h2>

              {results.length !== filteredResults.length && (
                <button
                  onClick={onResetFilters}
                  className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
                  style={{
                    background: 'var(--accent)',
                    color: 'white'
                  }}
                >
                  Reset Filters
                </button>
              )}
            </div>

            {/* English matches display */}
            {processed?.language === 'english' && processed?.englishMatches && processed.englishMatches.length > 0 && (
              <div className="mt-3 pt-3" style={{ borderTop: '1px solid var(--border)' }}>
                <p className="text-xs font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                  Dictionary matches for "{processed.original}":
                </p>
                <div className="flex flex-wrap gap-2">
                  {processed.englishMatches.slice(0, 4).map((match, idx) => (
                    <span
                      key={`${match.pashto}-${idx}`}
                      className="px-3 py-1 rounded-full text-sm"
                      style={{
                        background: 'rgba(249, 115, 22, 0.1)',
                        color: '#f97316',
                        border: '1px solid rgba(249, 115, 22, 0.3)'
                      }}
                    >
                      {match.pashto}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="result-card animate-pulse">
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/3 mb-3"></div>
                  <div className="h-20 bg-gray-300 dark:bg-gray-700 rounded mb-3"></div>
                  <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!isLoading && filteredResults.length === 0 && query && (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                No results found
              </h3>
              <p style={{ color: 'var(--text-secondary)' }}>
                Try adjusting your search terms or filters
              </p>
            </div>
          )}

          {/* Results Grid */}
          {!isLoading && filteredResults.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 fade-in">
              {filteredResults.map((verse, index) => {
                const ref = verse.ref;
                const isExpanded = expandedCards.has(ref);
                const maxLength = 150;
                const needsExpansion = verse.text.length > maxLength;
                const displayText = needsExpansion && !isExpanded
                  ? verse.text.slice(0, maxLength) + '...'
                  : verse.text;

                return (
                  <div
                    key={`${verse.ref}-${index}`}
                    className="result-card"
                  >
                    {/* Reference Badge */}
                    <div className="flex items-center justify-between mb-3">
                      <div
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold"
                        style={{
                          background: 'linear-gradient(135deg, var(--accent) 0%, var(--gradient-end) 100%)',
                          color: 'white'
                        }}
                      >
                        <span>📖</span>
                        <span>{ref}</span>
                      </div>

                      {/* Audio Button */}
                      {audioMap[ref] && (
                        <button
                          onClick={() => {
                            const audio = new Audio(audioMap[ref]);
                            audio.play();
                          }}
                          className="p-2 rounded-full transition-all hover:scale-110"
                          style={{
                            background: 'var(--surface)',
                            border: '1px solid var(--border)'
                          }}
                          title="Play audio"
                        >
                          🔊
                        </button>
                      )}
                    </div>

                    {/* Verse Text */}
                    <div
                      className="text-lg leading-relaxed mb-3"
                      dir="rtl"
                      style={{
                        fontFamily: 'Noto Nastaliq Urdu, serif',
                        color: 'var(--text-primary)'
                      }}
                    >
                      {displayText}
                    </div>

                    {/* Expand/Collapse Button */}
                    {needsExpansion && (
                      <button
                        onClick={() => toggleCard(ref)}
                        className="text-sm font-medium transition-colors mb-3"
                        style={{ color: 'var(--accent)' }}
                      >
                        {isExpanded ? '▲ Show less' : '▼ Show more'}
                      </button>
                    )}

                    {/* Translation Badge */}
                    {verse.translation && (
                      <div className="pt-3" style={{ borderTop: '1px solid var(--border)' }}>
                        <span
                          className="text-xs px-2 py-1 rounded-full"
                          style={{
                            background: verse.translation === 'afghan2023'
                              ? 'rgba(16, 185, 129, 0.1)'
                              : 'rgba(249, 115, 22, 0.1)',
                            color: verse.translation === 'afghan2023'
                              ? '#10b981'
                              : '#f97316'
                          }}
                        >
                          {verse.translation === 'afghan2023' ? '🇦🇫 Afghan 2023' : '🕌 Yousafzai 2019'}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Coverage Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-4">
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
          </div>
        </div>
      </div>
    </div>
  );
}
