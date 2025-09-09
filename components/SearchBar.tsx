// components/SearchBar.tsx
import React from 'react';

interface SearchBarProps {
  query: string;
  setQuery: (query: string) => void;
  scope: 'all' | 'ot' | 'nt';
  setScope: (scope: 'all' | 'ot' | 'nt') => void;
  onSearch: () => void;
  loading: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({ query, setQuery, scope, setScope, onSearch, loading }) => {
  const isRtl = true;

  return (
    <div className="max-w-xl mx-auto mb-8">
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter Pashto term..."
          className="flex-grow p-3 bg-gray-800 border border-gray-700 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
          style={{ textAlign: isRtl ? 'right' : 'left' }}
          onKeyDown={(e) => e.key === 'Enter' && onSearch()}
        />
        <select
          value={scope}
          onChange={(e) => setScope(e.target.value as 'all' | 'ot' | 'nt')}
          className="p-3 bg-gray-800 border border-gray-700 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
        >
          <option value="all">All Scripture</option>
          <option value="ot">Old Testament</option>
          <option value="nt">New Testament</option>
        </select>
        <button
          onClick={onSearch}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold p-3 rounded-md transition-colors duration-200 disabled:bg-gray-500"
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
      </div>
    </div>
  );
};

export default SearchBar;