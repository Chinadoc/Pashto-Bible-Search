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
}

export default function SearchBar({
  query,
  setQuery,
  scope,
  setScope,
  onSearch,
  loading,
  verbPerson,
  setVerbPerson,
  showFirstPerson,
  setShowFirstPerson
}: Props) {
  const handleQueryChange = (e: ChangeEvent<HTMLInputElement>) => setQuery(e.target.value);
  const handleScopeChange = (e: ChangeEvent<HTMLSelectElement>) => setScope(e.target.value as Scope);

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      <input
        type="text"
        value={query}
        onChange={handleQueryChange}
        placeholder="Leedul"
        className="flex-1 p-2 border border-gray-300 rounded-md dark:border-gray-600 dark:bg-gray-800"
        dir="rtl"
        disabled={loading}
      />
      <select
        value={scope}
        onChange={handleScopeChange}
        className="p-2 border border-gray-300 rounded-md dark:border-gray-600 dark:bg-gray-800"
        disabled={loading}
      >
        <option value="all">All</option>
        <option value="ot">Old Testament</option>
        <option value="nt">New Testament</option>
      </select>
      <button
        onClick={() => onSearch()}
        disabled={loading}
        className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Searching...' : 'Search'}
      </button>

      {/* Verb understanding options */}
      {verbPerson && setVerbPerson && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">Person:</span>
          <select
            value={verbPerson}
            onChange={(e) => setVerbPerson(e.target.value as '1st' | '2nd' | '3rd')}
            className="p-1 border border-gray-300 rounded text-sm dark:border-gray-600 dark:bg-gray-800"
          >
            <option value="1st">1st Person (م)</option>
            <option value="2nd">2nd Person (ې)</option>
            <option value="3rd">3rd Person (ي)</option>
          </select>
        </div>
      )}

      {showFirstPerson !== undefined && setShowFirstPerson && (
        <button
          onClick={() => setShowFirstPerson(!showFirstPerson)}
          className={`px-3 py-1 rounded text-sm border ${
            showFirstPerson
              ? 'bg-green-500 text-white border-green-500'
              : 'bg-gray-200 text-gray-700 border-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600'
          } hover:opacity-80 transition-colors`}
          title="Toggle 1st person present forms"
        >
          {showFirstPerson ? '✅ 1st Person' : '👤 1st Person'}
        </button>
      )}
    </div>
  );
}
