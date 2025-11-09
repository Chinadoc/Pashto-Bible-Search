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
  lemma: string;
  searchedForm: string; // The form user actually searched for
  romanization?: string;
  english?: string;
  
  // POS and grammar
  pos: 'verb' | 'noun' | 'adjective' | 'other';
  verbType?: 'dynamic' | 'stative' | 'dynamic_compound' | 'stative_compound';
  helper?: string; // For compound verbs
  transitivity?: 'transitive' | 'intransitive' | 'both';
  
  // Form counts
  totalForms: number;
  searchedFormIsLemma: boolean; // True if searched form = lemma
  
  // LingDocs integration
  lingdocsId?: number;
  
  // Metadata
  confidence: 'high' | 'medium' | 'low';
  source: 'd1_verbs_lexicon' | 'd1_verb_forms' | 'd1_form_to_root' | 'd1_nouns_lexicon' | 'inferred';
}

interface Props {
  term: DictionaryTerm;
  searchedTerm: string;
  onExpandForms: () => void;
  onDismiss?: () => void;
  isExpanded?: boolean;
}

export default function DictionaryTermDetection({
  term,
  searchedTerm,
  onExpandForms,
  onDismiss,
  isExpanded = false,
}: Props) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  const handleDismiss = () => {
    setDismissed(true);
    onDismiss?.();
  };

  const handleExpand = () => {
    onExpandForms();
  };

  // Build grammar description
  const grammarInfo: string[] = [];
  if (term.verbType) {
    grammarInfo.push(term.verbType.replace('_', ' '));
  }
  if (term.helper) {
    grammarInfo.push(`Helper: ${term.helper}`);
  }
  if (term.transitivity) {
    grammarInfo.push(term.transitivity);
  }

  const lingdocsUrl = term.lingdocsId
    ? `https://dictionary.lingdocs.com/word?id=${term.lingdocsId}`
    : `https://dictionary.lingdocs.com/?q=${encodeURIComponent(term.lemma)}`;

  return (
    <div className="mb-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 rounded-lg shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          {/* Header */}
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">📘</span>
            <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100">
              Found {term.pos}: <strong>{term.lemma}</strong>
              {term.romanization && (
                <span className="text-sm font-normal text-blue-700 dark:text-blue-300 ml-2">
                  ({term.romanization})
                </span>
              )}
            </h3>
          </div>

          {/* English translation */}
          {term.english && (
            <p className="text-blue-800 dark:text-blue-200 mb-2 italic">
              "{term.english}"
            </p>
          )}

          {/* Grammar metadata */}
          {grammarInfo.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {grammarInfo.map((info, i) => (
                <span
                  key={i}
                  className="px-2 py-1 bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 rounded text-xs font-medium"
                >
                  {info}
                </span>
              ))}
            </div>
          )}

          {/* Form info */}
          {!term.searchedFormIsLemma && (
            <p className="text-sm text-blue-700 dark:text-blue-300 mb-2">
              You searched for <strong>{searchedTerm}</strong>, which is a conjugated form of <strong>{term.lemma}</strong>.
            </p>
          )}

          {/* Action buttons */}
          <div className="flex flex-wrap gap-2 mt-3">
            {!isExpanded ? (
              <>
                <button
                  onClick={handleExpand}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors font-medium shadow-sm"
                >
                  Search all {term.totalForms} {term.pos === 'verb' ? 'conjugations' : 'forms'} →
                </button>
                <a
                  href={lingdocsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-white dark:bg-gray-800 border border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-300 rounded-md transition-colors hover:bg-blue-50 dark:hover:bg-blue-900/30"
                >
                  📖 View in LingDocs
                </a>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-green-600 dark:text-green-400">✓</span>
                <span className="text-sm text-blue-700 dark:text-blue-300">
                  Showing all {term.totalForms} {term.pos === 'verb' ? 'conjugations' : 'forms'}
                </span>
              </div>
            )}
          </div>

          {/* Confidence badge */}
          <div className="mt-2 text-xs text-blue-600 dark:text-blue-400">
            <span className="inline-flex items-center gap-1">
              <span className={`w-2 h-2 rounded-full ${
                term.confidence === 'high' ? 'bg-green-500' :
                term.confidence === 'medium' ? 'bg-yellow-500' : 'bg-orange-500'
              }`} />
              {term.confidence === 'high' ? 'Verified' : 'Inferred'} from {term.source.replace('d1_', '').replace('_', ' ')}
            </span>
          </div>
        </div>

        {/* Dismiss button */}
        <button
          onClick={handleDismiss}
          className="text-blue-400 hover:text-blue-600 dark:hover:text-blue-300 transition-colors"
          aria-label="Dismiss"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}

