"use client";

import React, { useState, useEffect } from "react";

interface WordFrequencyItem {
  pashto_word: string;
  frequency_total: number;
  frequency_rank: number;
  romanization: string | null;
  pos: string | null;
  inflection_type: string | null;
  base_form: string | null;
  word_type: string | null;
  compound_type: string | null;
}

interface Props {
  onPickForm?: (form: string) => void;
  queryProp?: string;
}

export default function LexiconPanel({ onPickForm, queryProp }: Props) {
  const [data, setData] = useState<WordFrequencyItem[]>([]);
  const [filteredData, setFilteredData] = useState<WordFrequencyItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Simple filters
  const [searchQuery, setSearchQuery] = useState('');
  const [posFilter, setPosFilter] = useState<string>('all');
  const [inflectionFilter, setInflectionFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'frequency' | 'word' | 'rank'>('frequency');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [limit, setLimit] = useState(300);

  // Fetch data from word_frequencies
  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        limit: limit.toString(),
      });

      if (posFilter !== 'all') {
        params.set('pos', posFilter);
      }
      if (inflectionFilter !== 'all') {
        params.set('inflection_label', inflectionFilter);
      }
      if (sortBy !== 'frequency') {
        params.set('sort_by', sortBy);
      }
      params.set('sort_order', sortOrder);

      const response = await fetch(`/api/lexicon-d1?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const result = await response.json();
      setData(result.items || []);
    } catch (err: any) {
      console.error('Error fetching lexicon data:', err);
      setError(err.message || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchData();
  }, [limit, posFilter, inflectionFilter, sortBy, sortOrder]);

  // Filter by search query
  useEffect(() => {
    let filtered = data;

    if (searchQuery.trim()) {
      const query = searchQuery.trim().toLowerCase();
      filtered = filtered.filter(item => 
        item.pashto_word.toLowerCase().includes(query) ||
        (item.romanization && item.romanization.toLowerCase().includes(query))
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'frequency') {
        comparison = a.frequency_total - b.frequency_total;
      } else if (sortBy === 'word') {
        comparison = a.pashto_word.localeCompare(b.pashto_word);
      } else if (sortBy === 'rank') {
        comparison = (a.frequency_rank || 0) - (b.frequency_rank || 0);
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    setFilteredData(filtered);
  }, [data, searchQuery, sortBy, sortOrder]);

  // Sync external query
  useEffect(() => {
    if (typeof queryProp === 'string') {
      setSearchQuery(queryProp);
    }
  }, [queryProp]);

  // Get unique inflection types for dropdown
  const inflectionTypes = Array.from(new Set(data.map(item => item.inflection_type).filter(Boolean))).sort();

  if (error) {
    return (
      <div className="p-4 mx-auto" style={{ maxWidth: '95%' }} dir="rtl">
        <div className="text-center text-red-500">Error: {error}</div>
        <button
          onClick={fetchData}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 mx-auto" style={{ maxWidth: '95%' }} dir="rtl">
      <h2 className="text-xl font-bold mb-4">Lexicon - Word Frequency List</h2>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Pashto Lexicon - Word frequency list from Bible text ({data.length} words loaded)
      </p>

      {/* Simple Controls */}
      <div className="mb-6 space-y-4 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
        {/* Search */}
        <div className="flex gap-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search words or romanization..."
            className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
          />
          <button
            onClick={fetchData}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Reload'}
          </button>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-medium mb-1">POS</label>
            <select
              value={posFilter}
              onChange={(e) => setPosFilter(e.target.value)}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
            >
              <option value="all">All</option>
              <option value="verb">Verbs</option>
              <option value="noun">Nouns</option>
              <option value="adj">Adjectives</option>
              <option value="adv">Adverbs</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium mb-1">Inflection</label>
            <select
              value={inflectionFilter}
              onChange={(e) => setInflectionFilter(e.target.value)}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
            >
              <option value="all">All</option>
              {inflectionTypes.map((type) => (
                <option key={type} value={type || ''}>
                  {type || 'None'}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium mb-1">Sort By</label>
            <div className="flex gap-1">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'frequency' | 'word' | 'rank')}
                className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700"
              >
                <option value="frequency">Frequency</option>
                <option value="word">Word</option>
                <option value="rank">Rank</option>
              </select>
              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700"
              >
                {sortOrder === 'asc' ? '↑' : '↓'}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium mb-1">Limit</label>
            <select
              value={limit}
              onChange={(e) => setLimit(Number(e.target.value))}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
            >
              <option value={100}>100</option>
              <option value={300}>300</option>
              <option value={500}>500</option>
              <option value={1000}>1000</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700 sticky top-0 z-10">
              <tr>
                <th
                  className="px-3 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                  onClick={() => {
                    if (sortBy === 'rank') {
                      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                    } else {
                      setSortBy('rank');
                      setSortOrder('desc');
                    }
                  }}
                >
                  Rank {sortBy === 'rank' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th
                  className="px-3 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                  onClick={() => {
                    if (sortBy === 'word') {
                      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                    } else {
                      setSortBy('word');
                      setSortOrder('asc');
                    }
                  }}
                >
                  Word {sortBy === 'word' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Romanization</th>
                <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">POS</th>
                <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Inflection</th>
                <th
                  className="px-3 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                  onClick={() => {
                    if (sortBy === 'frequency') {
                      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                    } else {
                      setSortBy('frequency');
                      setSortOrder('desc');
                    }
                  }}
                >
                  Frequency {sortBy === 'frequency' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-3 py-4 text-center text-gray-500">
                    Loading...
                  </td>
                </tr>
              ) : filteredData.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-3 py-4 text-center text-gray-500">
                    No results found
                  </td>
                </tr>
              ) : (
                filteredData.map((item, index) => (
                  <tr key={`${item.pashto_word}-${index}`} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      {item.frequency_rank || index + 1}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100 font-mono">
                      {item.pashto_word}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {item.romanization || '-'}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {item.pos || '-'}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {item.inflection_type || '-'}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {item.frequency_total.toLocaleString()}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm font-medium">
                      {onPickForm && (
                        <button
                          onClick={() => onPickForm(item.pashto_word)}
                          className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                        >
                          Search
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary */}
      {filteredData.length > 0 && (
        <div className="mt-4 text-sm text-gray-600 dark:text-gray-400 text-center">
          Showing {filteredData.length} of {data.length} words
        </div>
      )}
    </div>
  );
}
