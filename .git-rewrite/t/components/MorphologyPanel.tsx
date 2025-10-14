"use client";

import React, { useEffect } from "react";
import { useMorphologySearch } from "../hooks/useMorphologySearch";

interface Props { queryProp?: string }

export default function MorphologyPanel({ queryProp }: Props) {
  const { query, setQuery, result, loading, error } = useMorphologySearch();

  useEffect(() => {
    if (typeof queryProp === 'string') setQuery(queryProp);
  }, [queryProp]);

  if (loading) {
    return <div className="p-4 text-center">Analyzing morphology...</div>;
  }

  if (error) {
    return <div className="p-4 text-center text-red-500">Error: {error}</div>;
  }

  return (
    <div className="p-4" dir="rtl">
      <h2 className="text-xl font-bold mb-4">تحلیل مورفولوژیکی</h2>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Morphological Analysis - Analyze word forms, roots, and grammatical structures
      </p>

      {!queryProp && (
        <div className="mb-6">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter a base word to analyze (e.g., لیدل)"
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-lg"
          />
        </div>
      )}

      {result ? (
        <div className="space-y-6">
          {/* Base Word Info */}
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <h3 className="text-xl font-bold text-blue-800 dark:text-blue-200 mb-2">
              {result.base_word}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Base Word • Grammatical Info: {JSON.stringify(result.grammatical_info, null, 2)}
            </p>
          </div>

          {/* Inflected Form */}
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
            <h4 className="font-bold text-green-800 dark:text-green-200 mb-2">Inflected Form</h4>
            <p className="text-2xl font-mono text-green-700 dark:text-green-300">
              {result.inflected_form}
            </p>
          </div>

          {/* Roots */}
          {result.form_roots && result.form_roots.length > 0 && (
            <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
              <h4 className="font-bold text-purple-800 dark:text-purple-200 mb-2">Roots</h4>
              <div className="space-y-2">
                {result.form_roots.map((root, index) => (
                  <div key={index} className="p-2 bg-white dark:bg-gray-700 rounded">
                    <p className="font-medium">{root.word_form}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Root: {root.root_word} • Frequency: {root.frequency}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Lemmas */}
          {result.form_lemmas && result.form_lemmas.length > 0 && (
            <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
              <h4 className="font-bold text-orange-800 dark:text-orange-200 mb-2">Lemmas</h4>
              <div className="space-y-2">
                {result.form_lemmas.map((lemma, index) => (
                  <div key={index} className="p-2 bg-white dark:bg-gray-700 rounded">
                    <p className="font-medium">{lemma.lemma_form}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      POS: {lemma.part_of_speech} • Frequency: {lemma.frequency}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Occurrences in Bible */}
          {result.form_occurrences && result.form_occurrences.length > 0 && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
              <h4 className="font-bold text-yellow-800 dark:text-yellow-200 mb-2">Bible Occurrences</h4>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {result.form_occurrences.slice(0, 20).map((occurrence, index) => (
                  <div key={index} className="p-2 bg-white dark:bg-gray-700 rounded text-sm">
                    <p className="font-medium">{occurrence.pashto_form}</p>
                    <p className="text-gray-600 dark:text-gray-400">
                      Verse: {occurrence.verse_reference} • Frequency: {occurrence.frequency}
                    </p>
                  </div>
                ))}
                {result.form_occurrences.length > 20 && (
                  <p className="text-center text-gray-500 text-sm">
                    ... and {result.form_occurrences.length - 20} more occurrences
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Morphological Analysis */}
          {result.morphological_analysis && (
            <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
              <h4 className="font-bold text-red-800 dark:text-red-200 mb-2">AI Analysis</h4>
              <pre className="text-sm bg-white dark:bg-gray-700 p-2 rounded overflow-auto">
                {JSON.stringify(result.morphological_analysis.analysis_results, null, 2)}
              </pre>
            </div>
          )}
        </div>
      ) : query ? (
        <div className="text-center text-gray-500 mt-8">
          No morphological analysis found for "{query}". Try a different word.
        </div>
      ) : (
        <div className="text-center text-gray-500 mt-8">
          Enter a Pashto word to see its morphological breakdown and analysis.
        </div>
      )}
    </div>
  );
}
