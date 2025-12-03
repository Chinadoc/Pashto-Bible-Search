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

// Reason icons and labels - using LingDocs terminology
const REASON_ICONS: Record<string, { icon: string; label: string; labelPs: string; tip: string }> = {
  plural: { icon: '👥', label: 'Plural', labelPs: 'جمع', tip: 'Indicates more than one' },
  sandwich: { icon: '🥪', label: 'Sandwich', labelPs: 'په ... کې', tip: 'Inside an adpositional phrase' },
  ergative: { icon: '⚡', label: 'Ergative', labelPs: 'ارګېتیف', tip: 'Subject of transitive past tense verb' },
};

// Sandwich type labels with Pashto first
const SANDWICH_LABELS: Record<string, { ps: string; en: string }> = {
  'locative_in': { ps: 'په...کې', en: 'in' },
  'locative_on': { ps: 'په...باندې', en: 'on' },
  'comitative': { ps: 'په...سره', en: 'with' },
  'genitive': { ps: 'د', en: 'of' },
  'comitative_from': { ps: 'له...سره', en: 'with' },
  'ablative': { ps: 'له...نه', en: 'from' },
  'ablative_from': { ps: 'له...څخه', en: 'from' },
  'dative': { ps: 'ته', en: 'to' },
  'terminative': { ps: 'تر...پورې', en: 'until' },
};

// Helper to determine inflection level based on reasons
// 1st inflection = ONE reason (plural OR sandwich OR ergative)
// 2nd inflection = TWO+ reasons (e.g., plural AND sandwich)
function getInflectionLevel(inf: InflectedWord): { level: '1st' | '2nd'; reasonCount: number } {
  let reasonCount = 0;
  if (inf.isPlural) reasonCount++;
  if (inf.isInSandwich) reasonCount++;
  if (inf.isSubjectTransitivePast) reasonCount++;
  
  // 2nd inflection requires 2+ reasons, otherwise 1st
  return {
    level: reasonCount >= 2 ? '2nd' : '1st',
    reasonCount,
  };
}

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
        const workerUrl = process.env.NEXT_PUBLIC_WORKER_URL || 'https://pashtobiblesearch.jeremy-samuels17.workers.dev';
        const response = await fetch(
          `${workerUrl}/api/analyze-inflections`,
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

          {relevantInflections.map((inf, idx) => {
            const { level, reasonCount } = getInflectionLevel(inf);
            const hasReasons = inf.isPlural || inf.isInSandwich || inf.isSubjectTransitivePast;
            
            return (
              <div
                key={`${inf.word}-${inf.position}-${idx}`}
                className="flex flex-wrap items-center gap-2 p-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg text-sm"
              >
                {/* Word with base form */}
                <div className="flex items-center gap-1.5 min-w-0">
                  <span
                    className="text-base font-semibold text-indigo-700 dark:text-indigo-300"
                    style={{ direction: 'rtl' }}
                  >
                    {inf.word}
                  </span>
                  {inf.baseWord && inf.baseWord !== inf.word && (
                    <span className="text-xs text-gray-500 flex items-center gap-0.5">
                      ← <span style={{ direction: 'rtl' }} className="font-medium">{inf.baseWord}</span>
                    </span>
                  )}
                </div>

                {/* Inflection level - determined by number of reasons */}
                {hasReasons && (
                  <span 
                    className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium ${
                      level === '2nd' 
                        ? 'bg-indigo-200 dark:bg-indigo-800/70 text-indigo-800 dark:text-indigo-200' 
                        : 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300'
                    }`}
                    title={level === '2nd' 
                      ? 'Double inflection: 2 reasons combine (button pressed all the way down)' 
                      : 'Single inflection: 1 reason (button pressed halfway)'}
                  >
                    {level} inflection
                  </span>
                )}

                {/* Reasons - ALWAYS show all that apply */}
                {hasReasons && (
                  <div className="flex flex-wrap gap-1 items-center">
                    {inf.isInSandwich && (
                      <span 
                        className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 rounded text-xs cursor-help"
                        title={`Sandwich: ${SANDWICH_LABELS[inf.sandwichType || '']?.en || 'adposition'} - word is inside an adpositional phrase`}
                      >
                        {REASON_ICONS.sandwich.icon}
                        <span dir="rtl" className="font-medium">
                          {inf.sandwichType && SANDWICH_LABELS[inf.sandwichType]
                            ? SANDWICH_LABELS[inf.sandwichType].ps
                            : 'sandwich'}
                        </span>
                      </span>
                    )}

                    {inf.isPlural && (
                      <span 
                        className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 rounded text-xs cursor-help"
                        title="Plural: indicates more than one"
                      >
                        {REASON_ICONS.plural.icon} plural
                      </span>
                    )}

                    {inf.isSubjectTransitivePast && (
                      <span 
                        className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 rounded text-xs cursor-help"
                        title="Ergative: subject of a transitive past tense verb"
                      >
                        {REASON_ICONS.ergative.icon} ergative
                      </span>
                    )}
                  </div>
                )}
              </div>
            );
          })}

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

