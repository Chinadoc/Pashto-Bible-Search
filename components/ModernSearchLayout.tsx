"use client";

/**
 * ModernSearchLayout Component
 * Glass-card based layout matching the new intelligence console design
 * Integrates results, coverage, filters, and real-time insights
 */

import { useState } from 'react';
import type { Verse, RelatedFormsData, PhraseResponse, CoverageItem, Scope } from '@/types';
import DictionaryDisambiguation from './DictionaryDisambiguation';
import WordAlternativeUses from './WordAlternativeUses';
import FilterPanel from './FilterPanel';
import CoverageSidebar from './CoverageSidebar';
import InlineFrequency from './InlineFrequency';
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

  // Calculate insights
  const audioCoverage = Object.keys(audioMap || {}).length;
  const filterBadge = bookFilter.length
    ? `${bookFilter.length} filtered book${bookFilter.length > 1 ? 's' : ''}`
    : 'All books included';

  const insightCards = [
    { label: 'Morphology', value: includeRelated ? 'Expanded' : 'Standard', hint: includeRelated ? 'Inflections & conjugations' : 'Exact lemma only' },
    { label: 'Matching', value: enableFuzzy ? 'Fuzzy' : 'Exact', hint: enableFuzzy ? 'Diacritic-agnostic' : 'Precise text' },
    { label: 'Book filters', value: bookFilter.length ? bookFilter.length.toString() : 'All', hint: filterBadge },
    { label: 'Audio coverage', value: audioCoverage.toLocaleString(), hint: 'Verses with audio' },
  ];

  return (
    <div className="space-y-6">
      {/* Dictionary & Alternatives */}
      {(dictionaryData || (query.trim() && relatedForms)) && (
        <div className="space-y-4">
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
        </div>
      )}

      {/* Main 3-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Results Column - 7 cols */}
        <div className="lg:col-span-7 space-y-6">
          {/* Filters Glass Card */}
          {relatedForms && (
            <div className="glass-card p-5">
              <FilterPanel
                includeRelated={includeRelated}
                relatedForms={relatedForms}
                onApplyFilters={() => {}}
                activeVariantForms={activeVariantForms}
                onPickForm={onPickForm}
              />
            </div>
          )}

          {/* Results Glass Card */}
          <div className="glass-card p-6 space-y-4">
            {/* Results Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-700/50">
              <div>
                <h2 className="text-2xl font-semibold text-white">
                  {filteredResults.length.toLocaleString()} {filteredResults.length === 1 ? 'Result' : 'Results'}
                </h2>
                {totalEstimatedCount && totalEstimatedCount > results.length && (
                  <p className="text-sm text-slate-400">of ~{totalEstimatedCount.toLocaleString()} total</p>
                )}
                {hasMoreResults && (
                  <p className="text-sm text-cyan-400">+ more available</p>
                )}
              </div>

              {results.length !== filteredResults.length && (
                <button
                  onClick={onResetFilters}
                  className="px-4 py-2 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-sm font-semibold transition hover:shadow-lg hover:shadow-cyan-500/30"
                >
                  Reset Filters
                </button>
              )}
            </div>

            {/* English Matches */}
            {processed?.language === 'english' && processed?.englishMatches && processed.englishMatches.length > 0 && (
              <div className="p-4 rounded-2xl bg-orange-500/10 border border-orange-500/30">
                <p className="text-xs font-semibold uppercase tracking-wide text-orange-300 mb-2">
                  Dictionary matches for "{processed.original}":
                </p>
                <div className="flex flex-wrap gap-2">
                  {processed.englishMatches.slice(0, 4).map((match, idx) => (
                    <span
                      key={`${match.pashto}-${idx}`}
                      className="px-3 py-1.5 rounded-full bg-orange-400/20 text-orange-200 text-sm border border-orange-400/30"
                    >
                      {match.pashto}
                    </span>
                  ))}
                  {processed.englishMatches.length > 4 && (
                    <span className="text-orange-300 text-sm">+{processed.englishMatches.length - 4} more</span>
                  )}
                </div>
              </div>
            )}

            {/* Loading State */}
            {isLoading && (
              <div className="grid grid-cols-1 gap-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="p-4 rounded-2xl bg-slate-800/50 animate-pulse">
                    <div className="h-4 bg-slate-700 rounded w-1/4 mb-3"></div>
                    <div className="h-16 bg-slate-700 rounded mb-2"></div>
                    <div className="h-3 bg-slate-700 rounded w-1/3"></div>
                  </div>
                ))}
              </div>
            )}

            {/* Empty State */}
            {!isLoading && filteredResults.length === 0 && query && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-2xl font-semibold text-white mb-2">
                  No results found
                </h3>
                <p className="text-slate-400">
                  Try adjusting your search terms or filters
                </p>
              </div>
            )}

            {/* Results List */}
            {!isLoading && filteredResults.length > 0 && (
              <div className="space-y-3">
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
                      className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700/50 transition hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/10"
                    >
                      {/* Reference & Audio */}
                      <div className="flex items-center justify-between mb-3">
                        <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-400/30 text-cyan-200 text-sm font-semibold">
                          <span>📖</span>
                          <span>{ref}</span>
                        </span>

                        {audioMap[ref] && (
                          <button
                            onClick={() => {
                              const audio = new Audio(audioMap[ref]);
                              audio.play();
                            }}
                            className="p-2 rounded-full bg-slate-700/50 border border-slate-600/50 hover:bg-cyan-500/20 hover:border-cyan-500/50 transition"
                            title="Play audio"
                          >
                            🔊
                          </button>
                        )}
                      </div>

                      {/* Verse Text */}
                      <div
                        className="text-lg leading-relaxed mb-3 text-slate-100"
                        dir="rtl"
                        style={{ fontFamily: 'Noto Nastaliq Urdu, serif' }}
                      >
                        {displayText}
                      </div>

                      {/* Expand Button & Translation Badge */}
                      <div className="flex items-center justify-between">
                        {needsExpansion && (
                          <button
                            onClick={() => toggleCard(ref)}
                            className="text-sm font-medium text-cyan-400 hover:text-cyan-300 transition"
                          >
                            {isExpanded ? '▲ Show less' : '▼ Show more'}
                          </button>
                        )}

                        {verse.translation && (
                          <span
                            className="text-xs px-3 py-1 rounded-full"
                            style={{
                              background: verse.translation === 'afghan2023'
                                ? 'rgba(16, 185, 129, 0.15)'
                                : 'rgba(249, 115, 22, 0.15)',
                              color: verse.translation === 'afghan2023'
                                ? '#6ee7b7'
                                : '#fdba74',
                              border: `1px solid ${verse.translation === 'afghan2023' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(249, 115, 22, 0.3)'}`
                            }}
                          >
                            {verse.translation === 'afghan2023' ? '🇦🇫 Afghan' : '🕌 Yousafzai'}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Coverage Sidebar - 2 cols */}
        <div className="lg:col-span-2">
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

        {/* Insights Column - 3 cols */}
        <div className="lg:col-span-3 space-y-4">
          <div className="sticky top-4 space-y-4">
            {/* Insights Card */}
            <div className="glass-card p-5 space-y-4">
              <h3 className="text-xs uppercase tracking-[0.35em] text-slate-400">Search Insights</h3>
              {insightCards.map((card) => (
                <div key={card.label} className="stat-card space-y-1">
                  <p className="text-xs uppercase tracking-[0.35em] text-slate-400">{card.label}</p>
                  <p className="text-xl font-semibold text-white">{card.value}</p>
                  <p className="text-xs text-slate-500">{card.hint}</p>
                </div>
              ))}
            </div>

            {/* Inline Frequency - if query exists */}
            {query.trim() && (
              <div className="glass-card p-5">
                <h3 className="text-xs uppercase tracking-[0.35em] text-slate-400 mb-4">Word Analysis</h3>
                <InlineFrequency
                  term={query.trim()}
                  scope={scope}
                  includeRelated={includeRelated}
                  onPick={onPickForm}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
