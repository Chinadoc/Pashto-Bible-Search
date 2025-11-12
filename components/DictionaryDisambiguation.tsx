"use client";

import React from 'react';

interface DictionaryEntry {
  pashto: string;
  romanized?: string | null;
  pos?: string | null;
  english?: string | null;
}

interface DictionaryData {
  entries: DictionaryEntry[];
  groupedByPos: Record<string, DictionaryEntry[]>;
  needsDisambiguation: boolean;
}

interface Props {
  dictionary?: DictionaryData;
  query: string;
  onSelectEntry?: (entry: DictionaryEntry) => void;
}

export default function DictionaryDisambiguation({ dictionary, query, onSelectEntry }: Props) {
  if (!dictionary || dictionary.entries.length === 0) {
    return null;
  }

  // If only one entry, show it simply
  if (dictionary.entries.length === 1) {
    const entry = dictionary.entries[0];
    return (
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-4 mb-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <span className="text-2xl">📖</span>
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-1">
              Dictionary Entry
            </h3>
            <div className="text-sm text-blue-800 dark:text-blue-200">
              <span className="font-medium">{entry.pashto}</span>
              {entry.romanized && (
                <span className="text-blue-600 dark:text-blue-300 ml-2">({entry.romanized})</span>
              )}
              {entry.pos && (
                <span className="text-blue-500 dark:text-blue-400 ml-2 text-xs">[{entry.pos}]</span>
              )}
              {entry.english && (
                <span className="block mt-1 text-blue-700 dark:text-blue-300">
                  {entry.english}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Multiple entries - show disambiguation
  return (
    <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg p-4 mb-4">
      <div className="flex items-start gap-3 mb-3">
        <div className="flex-shrink-0">
          <span className="text-2xl">🔍</span>
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-yellow-900 dark:text-yellow-100 mb-1">
            Multiple meanings found for "{query}"
          </h3>
          <p className="text-xs text-yellow-700 dark:text-yellow-300 mb-3">
            Did you mean one of these?
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {Object.entries(dictionary.groupedByPos).map(([pos, entries]) => (
          <div key={pos} className="bg-white dark:bg-gray-800 rounded p-3 border border-yellow-200 dark:border-yellow-800">
            <div className="text-xs font-medium text-yellow-700 dark:text-yellow-300 mb-2 uppercase">
              {pos || 'Unknown'}
            </div>
            {entries.map((entry, idx) => (
              <div
                key={idx}
                className={`py-2 px-3 rounded cursor-pointer transition-colors ${
                  onSelectEntry
                    ? 'hover:bg-yellow-100 dark:hover:bg-yellow-900/30'
                    : ''
                }`}
                onClick={() => onSelectEntry?.(entry)}
              >
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {entry.pashto}
                  </span>
                  {entry.romanized && (
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      ({entry.romanized})
                    </span>
                  )}
                  {entry.english && (
                    <span className="text-sm text-gray-700 dark:text-gray-300 ml-auto">
                      {entry.english}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}




