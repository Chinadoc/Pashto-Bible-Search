"use client";

import { ChangeEvent, useState } from 'react';
import type { Scope } from '../types';

interface Props {
  query: string;
  setQuery: (query: string) => void;
  scope: Scope;
  setScope: (scope: Scope) => void;
  onSearch: () => void;
  loading: boolean;
  verbPerson?: '1st' | '2nd' | '3rd';
  setVerbPerson?: (person: '1st' | '2nd' | '3rd') => void;
  showFirstPerson?: boolean;
  setShowFirstPerson?: (show: boolean) => void;
  verbTense?: 'present' | 'past' | 'future' | 'perfect';
  setVerbTense?: (tense: 'present' | 'past' | 'future' | 'perfect') => void;
}

export default function SearchBar({
  query,
  setQuery,
  onSearch,
  loading
}: {
  query: string;
  setQuery: (query: string) => void;
  onSearch: () => void;
  loading: boolean;
}) {
  const handleQueryChange = (e: ChangeEvent<HTMLInputElement>) => setQuery(e.target.value);
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !loading) {
      onSearch();
    }
  };

  return (
    <div className="space-y-3 w-full">
      <div className="flex gap-2 items-center">
        <div className="relative flex-1">
          <input
            type="text"
            value={query}
            onChange={handleQueryChange}
            onKeyPress={handleKeyPress}
            placeholder="Search Pashto Bible (e.g., لیدل, خدا, موسى)"
            className="w-full p-3 pr-10 border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            dir="rtl"
            disabled={loading}
            style={{ boxSizing: 'border-box' }}
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
            🔍
          </div>
        </div>
        <button
          onClick={() => onSearch()}
          disabled={loading || !query.trim()}
          className="px-4 py-3 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
        >
          {loading ? '...' : 'Search'}
        </button>
      </div>

      <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
        Press Enter or click Search • Supports Pashto text and English transliteration
      </div>
    </div>
  );
}
