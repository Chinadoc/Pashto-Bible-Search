"use client";

/**
 * InflectionExplainer Component
 * 
 * Shows grammatical explanations for inflected words in a verse.
 * Based on LingDocs' 3 basic reasons for noun inflection:
 * 1. Plural (جمع)
 * 2. In a sandwich (adpositional phrase)
 * 3. Subject of a transitive past tense verb (ergative)
 * 
 * @see https://grammar.lingdocs.com/inflection/inflection-intro/
 */

import { useState, useEffect, useMemo } from 'react';

interface InflectedWord {
  word: string;
  position: number;
  isInflected: boolean;
  isPlural: boolean;
  inflectionType: string | null;
  isInSandwich: boolean;
  sandwichType: string | null;
  isSubjectTransitivePast: boolean;
  baseWord: string | null;
  explanation: string;
}

interface InflectionAnalysis {
  verse_ref: string;
  text: string;
  inflected_words: InflectedWord[];
  count: number;
}

interface InflectionExplainerProps {
  verseRef: string;
  verseText: string;
  highlightedForms?: string[]; // Forms from the search that should be highlighted
  showAlways?: boolean; // Show even when no inflections found
  compact?: boolean; // Compact mode for inline display
}

// Reason icons and labels
const REASON_ICONS: Record<string, { icon: string; label: string; labelPs: string }> = {
  plural: { icon: '👥', label: 'Plural', labelPs: 'جمع' },
  sandwich: { icon: '🥪', label: 'In sandwich', labelPs: 'په ... کې' },
  ergative: { icon: '⚡', label: 'Ergative (past tense subject)', labelPs: 'ارګېتیف' },
};

// Sandwich type labels
const SANDWICH_LABELS: Record<string, string> = {
  'locative_in': 'په...کې (in)',
  'locative_on': 'په...باندې (on)',
  'comitative': 'په...سره (with)',
  'genitive': 'د (of)',
  'comitative_from': 'له...سره (with)',
  'ablative': 'له...نه (from)',
  'ablative_from': 'له...څخه (from)',
  'dative': 'ته (to)',
  'terminative': 'تر...پورې (until)',
};

export default function InflectionExplainer({
  verseRef,
  verseText,
  highlightedForms = [],
  showAlways = false,
  compact = false,
}: InflectionExplainerProps) {
  const [analysis, setAnalysis] = useState<InflectionAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  // Fetch analysis when verse changes
  useEffect(() => {
    if (!verseText || verseText.length < 5) return;

    const fetchAnalysis = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_WORKER_URL}/api/analyze-inflections`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              text: verseText,
              verse_ref: verseRef,
              translation: 'afghan2023',
            }),
          }
        );

        if (!response.ok) {
          throw new Error('Failed to analyze inflections');
        }

        const data = await response.json();
        setAnalysis(data);
      } catch (err) {
        console.error('Inflection analysis error:', err);
        setError(err instanceof Error ? err.message : 'Analysis failed');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalysis();
  }, [verseRef, verseText]);

  // Filter to only show inflections for highlighted search forms
  const relevantInflections = useMemo(() => {
    if (!analysis?.inflected_words) return [];
    
    if (highlightedForms.length === 0) {
      return analysis.inflected_words;
    }

    // Only show inflections for words that match our search
    return analysis.inflected_words.filter(inf =>
      highlightedForms.some(form => 
        inf.word === form || 
        inf.baseWord === form ||
        form.includes(inf.word) ||
        inf.word.includes(form)
      )
    );
  }, [analysis, highlightedForms]);

  // Don't render if nothing to show
  if (!showAlways && relevantInflections.length === 0 && !isLoading) {
    return null;
  }

  // Compact mode: just show count
  if (compact) {
    if (isLoading) {
      return (
        <span className="text-xs text-gray-400 ml-2">
          <span className="animate-pulse">analyzing...</span>
        </span>
      );
    }

    if (relevantInflections.length === 0) return null;

    return (
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline ml-2"
      >
        {relevantInflections.length} inflected word{relevantInflections.length > 1 ? 's' : ''}
      </button>
    );
  }

  return (
    <div className="mt-2 border-t border-gray-200 dark:border-gray-700 pt-2">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
      >
        <span className="text-lg">{isExpanded ? '▼' : '▶'}</span>
        <span className="font-medium">Inflection Analysis</span>
        {isLoading ? (
          <span className="animate-pulse text-xs bg-gray-200 dark:bg-gray-700 px-2 py-0.5 rounded">
            analyzing...
          </span>
        ) : (
          <span className="text-xs bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 px-2 py-0.5 rounded-full">
            {relevantInflections.length} word{relevantInflections.length !== 1 ? 's' : ''}
          </span>
        )}
      </button>

      {/* Expanded content */}
      {isExpanded && (
        <div className="mt-3 space-y-2">
          {error && (
            <p className="text-xs text-red-500">{error}</p>
          )}

          {relevantInflections.length === 0 && !isLoading && (
            <p className="text-xs text-gray-500 italic">
              No inflected forms found in this verse
            </p>
          )}

          {relevantInflections.map((inf, idx) => (
            <div
              key={`${inf.word}-${inf.position}-${idx}`}
              className="flex flex-wrap items-start gap-2 p-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg"
            >
              {/* Word */}
              <div className="flex items-center gap-1">
                <span
                  className="text-lg font-semibold text-indigo-700 dark:text-indigo-300"
                  style={{ direction: 'rtl' }}
                >
                  {inf.word}
                </span>
                {inf.baseWord && inf.baseWord !== inf.word && (
                  <span className="text-xs text-gray-500">
                    ← <span style={{ direction: 'rtl' }}>{inf.baseWord}</span>
                  </span>
                )}
              </div>

              {/* Reasons */}
              <div className="flex flex-wrap gap-1">
                {inf.isPlural && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 rounded-full text-xs">
                    {REASON_ICONS.plural.icon} {REASON_ICONS.plural.label}
                    <span className="text-purple-500">({REASON_ICONS.plural.labelPs})</span>
                  </span>
                )}

                {inf.isInSandwich && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 rounded-full text-xs">
                    {REASON_ICONS.sandwich.icon}
                    {inf.sandwichType && SANDWICH_LABELS[inf.sandwichType]
                      ? SANDWICH_LABELS[inf.sandwichType]
                      : REASON_ICONS.sandwich.label}
                  </span>
                )}

                {inf.isSubjectTransitivePast && !inf.isPlural && !inf.isInSandwich && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 rounded-full text-xs">
                    {REASON_ICONS.ergative.icon} {REASON_ICONS.ergative.label}
                  </span>
                )}

                {/* Inflection type badge */}
                {inf.inflectionType && (
                  <span className="inline-flex items-center px-2 py-0.5 bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full text-xs">
                    {inf.inflectionType.replace(/_/g, ' ')}
                  </span>
                )}
              </div>
            </div>
          ))}

          {/* Reference link */}
          <a
            href="https://grammar.lingdocs.com/inflection/inflection-intro/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-gray-400 hover:text-indigo-500 mt-2"
          >
            <span>📚</span>
            <span>Learn more about Pashto inflection</span>
            <span>→</span>
          </a>
        </div>
      )}
    </div>
  );
}

