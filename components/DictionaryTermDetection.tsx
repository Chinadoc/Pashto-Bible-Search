"use client";

import { useState } from 'react';

/**
 * Dictionary Term Detection Banner
 *
 * Shows when search term matches a LingDocs dictionary entry.
 * Offers user the choice to expand search to all conjugations/inflections.
 *
 * Example UX:
 * ┌─────────────────────────────────────────────────────────────┐
 * │ 📘 Found verb: وهل (wahul) - "to hit"                       │
 * │    [Search all 47 conjugations →]                           │
 * │    LingDocs: https://dictionary.lingdocs.com/word?id=...    │
 * └─────────────────────────────────────────────────────────────┘
 */

export interface DictionaryTerm {
  // Core identification
  lemma: string;              // Base form: وهل
  romanization?: string;      // Romanization: wahul
  englishTranslation?: string; // to hit, to strike
  pos: 'verb' | 'noun' | 'adjective' | 'adverb' | 'other';

  // LingDocs metadata
  lingdocsId?: number;        // 1527815399
  lingdocsUrl?: string;       // https://dictionary.lingdocs.com/word?id=1527815399

  // Verb-specific
  verbType?: 'simple' | 'dynamic_compound' | 'stative_compound';
  helper?: string;            // کول for dynamic compounds
  transitivity?: 'transitive' | 'intransitive';

  // Variant counts
  totalForms?: number;        // Total variants in D1
  verbs?: number;             // Verb conjugations
  nouns?: number;             // Noun inflections
  other?: number;             // Other forms

  // Confidence
  confidence: 'high' | 'medium' | 'low';
  source: 'd1_verified' | 'd1_inferred' | 'lingdocs_cache' | 'fallback';
}

interface DictionaryTermDetectionProps {
  term: DictionaryTerm | null;
  searchedTerm: string;
  onExpandForms: () => void;
  isExpanded: boolean;
  loading?: boolean;
}

export default function DictionaryTermDetection({
  term,
  searchedTerm,
  onExpandForms,
  isExpanded,
  loading = false
}: DictionaryTermDetectionProps) {
  const [showDetails, setShowDetails] = useState(false);

  if (!term || term.confidence === 'low') {
    return null; // Don't show banner for low confidence
  }

  const getIcon = (pos: string) => {
    switch (pos) {
      case 'verb': return '🔄';
      case 'noun': return '📦';
      case 'adjective': return '✨';
      default: return '📘';
    }
  };

  const getPOSLabel = (pos: string) => {
    switch (pos) {
      case 'verb': return 'Verb';
      case 'noun': return 'Noun';
      case 'adjective': return 'Adjective';
      default: return 'Word';
    }
  };

  const getVerbTypeLabel = (verbType?: string) => {
    switch (verbType) {
      case 'dynamic_compound': return 'Dynamic compound verb';
      case 'stative_compound': return 'Stative compound verb';
      case 'simple': return 'Simple verb';
      default: return '';
    }
  };

  const totalForms = term.totalForms || (term.verbs || 0) + (term.nouns || 0) + (term.other || 0);

  return (
    <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
      <div className="flex items-start justify-between gap-4">
        {/* Left side: Dictionary info */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">{getIcon(term.pos)}</span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-blue-900 dark:text-blue-100" dir="rtl">
                  {term.lemma}
                </span>
                {term.romanization && (
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    ({term.romanization})
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                <span className="font-medium">{getPOSLabel(term.pos)}</span>
                {term.englishTranslation && (
                  <>
                    <span>•</span>
                    <span className="italic">"{term.englishTranslation}"</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Verb metadata */}
          {term.verbType && (
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              {getVerbTypeLabel(term.verbType)}
              {term.helper && (
                <span className="ml-2">
                  • Helper: <span className="font-mono" dir="rtl">{term.helper}</span>
                </span>
              )}
              {term.transitivity && (
                <span className="ml-2">
                  • {term.transitivity}
                </span>
              )}
            </div>
          )}

          {/* LingDocs link */}
          {term.lingdocsUrl && (
            <div className="mt-2">
              <a
                href={term.lingdocsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
              >
                📖 View in LingDocs dictionary
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                  <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                </svg>
              </a>
            </div>
          )}

          {/* Data source badge */}
          <div className="mt-2 text-xs text-gray-500 dark:text-gray-500">
            {term.source === 'd1_verified' && '✓ Verified from LingDocs'}
            {term.source === 'd1_inferred' && '⚠ Inferred from patterns'}
            {term.source === 'lingdocs_cache' && '📦 From LingDocs cache'}
            {term.source === 'fallback' && '⚡ Quick lookup'}
          </div>
        </div>

        {/* Right side: Action button */}
        <div className="flex flex-col items-end gap-2">
          {!isExpanded ? (
            <button
              onClick={onExpandForms}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <>
                  <span className="animate-spin">⏳</span>
                  Loading...
                </>
              ) : (
                <>
                  Search all {totalForms} forms
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </>
              )}
            </button>
          ) : (
            <div className="px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 text-sm font-medium rounded-lg flex items-center gap-2">
              <span>✓</span>
              Showing all {totalForms} forms
            </div>
          )}

          {/* Forms breakdown */}
          {totalForms > 0 && !isExpanded && (
            <div className="text-xs text-gray-600 dark:text-gray-400 text-right">
              {term.verbs && term.verbs > 0 && <div>{term.verbs} conjugations</div>}
              {term.nouns && term.nouns > 0 && <div>{term.nouns} inflections</div>}
              {term.other && term.other > 0 && <div>{term.other} other forms</div>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
