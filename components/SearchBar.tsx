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
}

export default function SearchBar({ query, setQuery, scope, setScope, onSearch, loading }: Props) {
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
    </div>
  );
}
