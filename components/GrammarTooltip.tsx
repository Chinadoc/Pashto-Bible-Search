"use client";

import { useState, useEffect } from 'react';

export interface GrammarInfo {
  form: string;
  baseWord: string;
  reasons: {
    plural: number;
    sandwich: number;
    transitive_past: number;
    sandwich_types: string[];
  };
  total_occurrences: number;
}

interface GrammarTooltipProps {
  form: string;
  translation?: 'afghan2023' | 'yousafzai2019';
  onClose?: () => void;
}

export default function GrammarTooltip({ form, translation, onClose }: GrammarTooltipProps) {
  const [grammarInfo, setGrammarInfo] = useState<GrammarInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchGrammarInfo() {
      setLoading(true);
      setError(null);

      try {
        const workerUrl = process.env.NEXT_PUBLIC_CLOUDFLARE_WORKER_URL || 'https://pashtobiblesearch.jeremy-samuels17.workers.dev';
        const params = new URLSearchParams({
          form,
          ...(translation && { translation }),
        });

        const response = await fetch(`${workerUrl}/api/inflection-reasons?${params}`);

        if (!response.ok) {
          throw new Error(`Failed to fetch grammar info: ${response.statusText}`);
        }

        const data = await response.json();

        if (data.reasons && data.reasons.length > 0) {
          setGrammarInfo(data.reasons[0]); // Take first aggregated result
        } else {
          setGrammarInfo(null);
        }
      } catch (err) {
        console.error('Grammar info fetch error:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }

    fetchGrammarInfo();
  }, [form, translation]);

  if (loading) {
    return (
      <div className="absolute z-50 bg-white dark:bg-gray-800 p-3 rounded-lg shadow-xl border border-gray-300 dark:border-gray-600 text-sm min-w-[200px]">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
          <span className="text-gray-600 dark:text-gray-400">Loading grammar info...</span>
        </div>
      </div>
    );
  }

  if (error || !grammarInfo) {
    return null; // Don't show tooltip if no grammar info available
  }

  const { baseWord, reasons, total_occurrences } = grammarInfo;
  const hasReasons = reasons.plural > 0 || reasons.sandwich > 0 || reasons.transitive_past > 0;

  if (!hasReasons) {
    return null; // No grammar reasons to display
  }

  return (
    <div
      className="absolute z-50 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-xl border border-gray-300 dark:border-gray-600 text-sm min-w-[250px] max-w-[350px]"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-3 pb-2 border-b border-gray-200 dark:border-gray-700">
        <div>
          <div className="font-bold text-lg" dir="rtl">{form}</div>
          <div className="text-gray-600 dark:text-gray-400 text-xs">
            Form of: <span dir="rtl" className="font-medium">{baseWord}</span>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 ml-2"
            aria-label="Close"
          >
            ✕
          </button>
        )}
      </div>

      {/* Grammar Reasons */}
      <div className="space-y-2">
        {reasons.plural > 0 && (
          <div className="flex items-center space-x-2">
            <span className="text-blue-600 dark:text-blue-400 font-medium">●</span>
            <span className="text-gray-700 dark:text-gray-300">
              Plural form
              {total_occurrences > 1 && (
                <span className="text-xs text-gray-500 ml-1">
                  ({reasons.plural}/{total_occurrences} times)
                </span>
              )}
            </span>
          </div>
        )}

        {reasons.sandwich > 0 && (
          <div className="flex items-center space-x-2">
            <span className="text-purple-600 dark:text-purple-400 font-medium">●</span>
            <div className="flex-1">
              <div className="text-gray-700 dark:text-gray-300">
                Sandwich construction
                {total_occurrences > 1 && (
                  <span className="text-xs text-gray-500 ml-1">
                    ({reasons.sandwich}/{total_occurrences} times)
                  </span>
                )}
              </div>
              {reasons.sandwich_types.length > 0 && (
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Types: {reasons.sandwich_types.join(', ')}
                </div>
              )}
            </div>
          </div>
        )}

        {reasons.transitive_past > 0 && (
          <div className="flex items-center space-x-2">
            <span className="text-green-600 dark:text-green-400 font-medium">●</span>
            <span className="text-gray-700 dark:text-gray-300">
              Transitive past tense subject
              {total_occurrences > 1 && (
                <span className="text-xs text-gray-500 ml-1">
                  ({reasons.transitive_past}/{total_occurrences} times)
                </span>
              )}
            </span>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-3 pt-2 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400">
        Found in {total_occurrences} {total_occurrences === 1 ? 'verse' : 'verses'}
      </div>
    </div>
  );
}
