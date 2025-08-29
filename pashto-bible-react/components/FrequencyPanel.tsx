"use client";

import { useEffect, useState } from "react";
import type { Scope } from "../types";

interface FrequencyItem {
  pashto: string;
  frequency: number;
}

interface FrequencyResponse {
  frequencies: FrequencyItem[];
  scope: string;
  total: number;
  error?: string;
}

interface FrequencyPanelProps {
  scope: Scope;
  isVisible?: boolean;
}

const FREQUENCIES_URL = "/api/get_frequencies";

export default function FrequencyPanel({ scope, isVisible = true }: FrequencyPanelProps) {
  const [frequencies, setFrequencies] = useState<FrequencyItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isVisible) return;

    const fetchFrequencies = async () => {
      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams({
          scope: scope,
          limit: '100' // Limit to top 100 most frequent
        });

        const response = await fetch(`${FREQUENCIES_URL}?${params}`);
        const data: FrequencyResponse = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch frequencies');
        }

        setFrequencies(data.frequencies);
      } catch (err) {
        console.error('Frequency fetch error:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchFrequencies();
  }, [scope, isVisible]);

  if (!isVisible) return null;

  return (
    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
        Word Frequencies ({scope.toUpperCase()})
      </h3>

      {loading && (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600 dark:text-gray-400">Loading frequencies...</span>
        </div>
      )}

      {error && (
        <div className="text-red-600 dark:text-red-400 text-sm p-2 bg-red-50 dark:bg-red-900/20 rounded">
          Error: {error}
        </div>
      )}

      {!loading && !error && frequencies.length > 0 && (
        <div className="space-y-1 max-h-96 overflow-y-auto">
          {frequencies.map((item, index) => (
            <div
              key={`${item.pashto}-${index}`}
              className="flex justify-between items-center py-1 px-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <span
                className="text-right font-medium text-gray-900 dark:text-gray-100"
                style={{ direction: 'rtl', textAlign: 'right' }}
              >
                {item.pashto}
              </span>
              <span className="text-sm text-gray-600 dark:text-gray-400 bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded-full">
                {item.frequency}
              </span>
            </div>
          ))}
        </div>
      )}

      {!loading && !error && frequencies.length === 0 && (
        <div className="text-gray-500 dark:text-gray-400 text-center py-8">
          No frequency data available
        </div>
      )}

      <div className="mt-3 text-xs text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700 pt-2">
        Showing top {frequencies.length} most frequent words in {scope === 'all' ? 'both Testaments' : scope.toUpperCase()}
      </div>
    </div>
  );
}
