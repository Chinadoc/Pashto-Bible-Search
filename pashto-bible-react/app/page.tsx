"use client";

import { useState, useEffect } from "react";
import SearchBar from "../components/SearchBar";
import ResultsList from "../components/ResultsList";
import SidePanels from "../components/SidePanels";
import BookSelector from "../components/BookSelector";
import type { Scope } from "../types";

interface Verse {
  ref: string;
  text: string;
}

interface Coverage {
  book: string;
  count: number;
}

interface Frequency {
  pashto: string;
  frequency: number;
}

const Home: React.FC = () => {
  const [query, setQuery] = useState<string>('');
  const [scope, setScope] = useState<Scope>('all');
  const [results, setResults] = useState<Verse[]>([]);
  const [coverage, setCoverage] = useState<Coverage[]>([]);
  const [ntFreq, setNtFreq] = useState<Frequency[]>([]);
  const [otFreq, setOtFreq] = useState<Frequency[]>([]);
  const [allFreq, setAllFreq] = useState<Frequency[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'results' | 'frequencies'>('results');
  const [romanizedQuery, setRomanizedQuery] = useState<string | null>(null); // New state for romanized query
  const [bookFilter, setBookFilter] = useState<string | null>(null);
  const [audioMap, setAudioMap] = useState<Record<string, string>>({});
  const [highlightTerms, setHighlightTerms] = useState<string[]>([]);

  useEffect(() => {
    const fetchFrequencyData = async () => {
      try {
        const response = await fetch('/api/get-frequency');
        if (!response.ok) throw new Error('Failed to fetch frequency data');
        const data = await response.json();
        setNtFreq(data.nt);
        setOtFreq(data.ot);
        setAllFreq(data.all);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      }
    };
    fetchFrequencyData();
  }, []);

  // Load audio mappings once (merge server map and static Google Drive map)
  useEffect(() => {
    const loadAudio = async () => {
      try {
        const [serverRes, staticRes] = await Promise.all([
          fetch('/api/get_audio_map').catch(() => null),
          fetch('/assets/audio_file_map.json').catch(() => null),
        ]);

        const serverMap = serverRes && serverRes.ok ? await serverRes.json() : {};
        const staticMap = staticRes && staticRes.ok ? await staticRes.json() : {};

        // serverMap may contain verseRef->URL; staticMap contains filename->DriveID
        setAudioMap({ ...(staticMap || {}), ...(serverMap || {}) });
      } catch {
        // ignore audio errors on page load
      }
    };
    loadAudio();
  }, []);

  const handleSearch = async () => {
    if (!query) return;
    setLoading(true);
    setError(null);
    setResults([]);
    setCoverage([]);

    try {
      const response = await fetch('/api/search_phrase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, scope }),
      });

      if (!response.ok) {
        throw new Error('Search failed. Please try again.');
      }

      const data = await response.json();
      setResults(data.results);
      setCoverage(data.coverage);
      setRomanizedQuery(data.processed.romanization); // Set romanized query
      // collect highlight terms: normalized + variants (deduped)
      const terms: string[] = Array.from(new Set<string>([
        data.processed?.normalized,
        ...(data.processed?.variants || []),
      ].filter(Boolean)));
      setHighlightTerms(terms);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed');
    } finally {
      setLoading(false);
    }
  };

  // Apply client-side book filter
  const displayedResults = bookFilter
    ? results.filter(r => r.ref.startsWith(`${bookFilter} `))
    : results;

  return (
    <main className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto p-4">
        <h1 className="text-4xl font-bold mb-8 text-center">Pashto Bible Search</h1>

        <SearchBar
          query={query}
          setQuery={setQuery}
          scope={scope}
          setScope={setScope}
          onSearch={handleSearch}
          loading={loading}
        />

        {error && (
          <div className="bg-red-800 border border-red-600 text-red-200 p-4 rounded-md mb-6">
            {error}
          </div>
        )}

        {romanizedQuery && query && query !== romanizedQuery && (
          <div className="text-center text-gray-400 mb-4">
            Romanized: <span className="font-semibold text-blue-400">{romanizedQuery}</span>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="mb-6">
          <div className="border-b border-gray-700">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('results')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'results'
                    ? 'border-blue-500 text-blue-400'
                    : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
                }`}
              >
                Search Results ({results.length})
              </button>
              <button
                onClick={() => setActiveTab('frequencies')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'frequencies'
                    ? 'border-blue-500 text-blue-400'
                    : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
                }`}
              >
                Word Frequencies
              </button>
            </nav>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */
          }
          <div className="lg:col-span-3">
            {/* Book Filter */}
            <div className="mb-4">
              <BookSelector bookFilter={bookFilter} setBookFilter={setBookFilter} />
            </div>
            {activeTab === 'results' && (
              <ResultsList
                results={displayedResults}
                loading={loading}
                highlightTerms={highlightTerms}
                audioMap={audioMap}
              />
            )}

            {activeTab === 'frequencies' && (
              <div className="text-gray-400">
                <p>Frequency panel will be shown here (controlled by SidePanels)</p>
              </div>
            )}
          </div>

          {/* Sidebar - always visible with content based on activeTab */}
          <div className="lg:col-span-1">
            <SidePanels
              activeMainTab={activeTab} // New prop to control what SidePanels shows
              coverage={coverage}
              ntFreq={ntFreq}
              otFreq={otFreq}
              allFreq={allFreq}
              selectedBook={bookFilter}
              onSelectBook={(book) => setBookFilter(book)}
            />
          </div>
        </div>
      </div>
    </main>
  );
};

export default Home;
