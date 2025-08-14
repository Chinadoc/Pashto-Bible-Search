"use client";

import { useCallback } from "react";
import type { Scope, Mode } from "@/types";

interface Props {
  query: string;
  setQuery: (q: string) => void;
  scope: Scope;
  setScope: (s: Scope) => void;
  mode: Mode;
  setMode: (m: Mode) => void;
  onSearch: () => void;
}

export default function SearchBar({ query, setQuery, scope, setScope, mode, setMode, onSearch }: Props) {
  const onKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") onSearch();
    },
    [onSearch]
  );

  return (
    <div className="w-full flex flex-col sm:flex-row items-stretch gap-3">
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder="Search Pashto Bible..."
        className="flex-1 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <select
        value={mode}
        onChange={(e) => setMode(e.target.value as Mode)}
        className="rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2"
        title="Search mode"
      >
        <option value="phrase">Phrase</option>
        <option value="grammar">Grammar</option>
      </select>
      <select
        value={scope}
        onChange={(e) => setScope(e.target.value as Scope)}
        className="rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2"
      >
        <option value="all">All</option>
        <option value="ot">OT</option>
        <option value="nt">NT</option>
      </select>
      <button
        onClick={onSearch}
        className="rounded-md bg-blue-600 text-white px-4 py-2 hover:bg-blue-700"
      >
        Search
      </button>
    </div>
  );
}


