"use client";

import { ChangeEvent } from 'react';
import type { Scope } from '../types';

interface SearchInputProps {
  query: string;
  setQuery: (query: string) => void;
  onSearch: () => void;
  loading: boolean;
}

export function SearchInput({ query, setQuery, onSearch, loading }: SearchInputProps) {
  const handleQueryChange = (e: ChangeEvent<HTMLInputElement>) => setQuery(e.target.value);
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !loading) {
      onSearch();
    }
  };

  return (
    <div className="relative">
      <input
        type="text"
        value={query}
        onChange={handleQueryChange}
        onKeyPress={handleKeyPress}
        placeholder="Search Pashto Bible (e.g., لیدل, خدا, موسى)"
        className="w-full p-3 pr-12 border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        dir="rtl"
        disabled={loading}
      />
      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
        🔍
      </div>
      <button
        onClick={() => onSearch()}
        disabled={loading || !query.trim()}
        className="absolute right-2 top-1/2 transform -translate-y-1/2 px-3 py-1 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? '...' : 'Search'}
      </button>
    </div>
  );
}

interface SearchControlsProps {
  scope: Scope;
  setScope: (scope: Scope) => void;
  includeRelated: boolean;
  setIncludeRelated: (include: boolean) => void;
  resultsCount: number;
}

export function SearchControls({ scope, setScope, includeRelated, setIncludeRelated, resultsCount }: SearchControlsProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        {/* Scope Selection as Tabs */}
        <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1 overflow-x-auto">
          {[
            {key: 'all', label: 'All', icon: '📚'},
            {key: 'ot', label: 'OT', icon: '📖'},
            {key: 'nt', label: 'NT', icon: '📜'}
          ].map((option) => (
            <button
              key={option.key}
              onClick={() => setScope(option.key as Scope)}
              className={`px-2 sm:px-3 py-1 text-xs sm:text-sm rounded-md transition-colors whitespace-nowrap ${
                scope === option.key
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
              title={option.label}
            >
              <span className="mr-1">{option.icon}</span>
              <span className="hidden sm:inline">{option.label}</span>
              <span className="sm:hidden">{option.key.toUpperCase()}</span>
            </button>
          ))}
        </div>

        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input
            type="checkbox"
            checked={includeRelated}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setIncludeRelated(e.target.checked)}
            className="rounded"
          />
          <span className="text-gray-700 dark:text-gray-300">Include related forms</span>
        </label>
      </div>

      {/* Quick Search Actions */}
      <div className="flex items-center justify-between sm:justify-end gap-2">
        {resultsCount > 0 && (
          <span className="text-xs text-gray-500 dark:text-gray-400 px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded">
            {resultsCount} results
          </span>
        )}
      </div>
    </div>
  );
}

// Default export for backwards compatibility - just the search input
interface SearchBarProps {
  query: string;
  setQuery: (query: string) => void;
  onSearch: () => void;
  loading: boolean;
}

// Combined search interface with input and controls
interface SearchInterfaceProps {
  query: string;
  setQuery: (query: string) => void;
  onSearch: () => void;
  loading: boolean;
  scope: Scope;
  setScope: (scope: Scope) => void;
  includeRelated: boolean;
  setIncludeRelated: (include: boolean) => void;
  resultsCount: number;
}

export function SearchInterface({
  query,
  setQuery,
  onSearch,
  loading,
  scope,
  setScope,
  includeRelated,
  setIncludeRelated,
  resultsCount
}: SearchInterfaceProps) {
  return (
    <div className="flex flex-col space-y-4">
      <SearchInput
        query={query}
        setQuery={setQuery}
        onSearch={onSearch}
        loading={loading}
      />

      <SearchControls
        scope={scope}
        setScope={setScope}
        includeRelated={includeRelated}
        setIncludeRelated={setIncludeRelated}
        resultsCount={resultsCount}
      />
    </div>
  );
}

export default function SearchBar({
  query,
  setQuery,
  onSearch,
  loading
}: SearchBarProps) {
  const handleQueryChange = (e: ChangeEvent<HTMLInputElement>) => setQuery(e.target.value);
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !loading) {
      onSearch();
    }
  };

  return (
    <div className="relative">
      <input
        type="text"
        value={query}
        onChange={handleQueryChange}
        onKeyPress={handleKeyPress}
        placeholder="Search Pashto Bible (e.g., لیدل, خدا, موسى)"
        className="w-full p-3 pr-12 border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        dir="rtl"
        disabled={loading}
      />
      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
        🔍
      </div>
      <button
        onClick={() => onSearch()}
        disabled={loading || !query.trim()}
        className="absolute right-2 top-1/2 transform -translate-y-1/2 px-3 py-1 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? '...' : 'Search'}
      </button>
    </div>
  );
}
