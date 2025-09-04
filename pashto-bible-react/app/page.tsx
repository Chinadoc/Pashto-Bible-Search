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
  audioUrl?: string;
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
  const [relatedForms, setRelatedForms] = useState<string[]>([]);
  const [includeInflections, setIncludeInflections] = useState<boolean>(false);

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

  // Load audio mappings once from Supabase (Storage URLs)
  useEffect(() => {
    const loadAudio = async () => {
      try {
        const serverRes = await fetch('/api/get_audio_map');
        if (serverRes.ok) {
          const serverMap = await serverRes.json();
          setAudioMap(serverMap || {});
        }
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
    // If toggled, include known related forms as extraVariants
    const extraVariants = includeInflections ? relatedForms : [];

    try {
      const response = await fetch('/api/search_phrase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, scope, extraVariants }),
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
        ...(includeInflections ? relatedForms : []),
      ].filter(Boolean)));
      setHighlightTerms(terms);
      // Kick off fetch for related forms suggestions based on normalized root
      if (data.processed?.normalized) {
        try {
          const relRes = await fetch('/api/related_forms', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ term: data.processed.normalized, limit: 200 })
          });
          if (relRes.ok) {
            const rel = await relRes.json();
            // Handle both old format (array of strings) and new format (array of {form, count})
            if (Array.isArray(rel.forms)) {
              if (rel.forms.length > 0 && typeof rel.forms[0] === 'object') {
                // New format with counts
                setRelatedForms(rel.forms.map((item: any) => item.form));
              } else {
                // Old format - just strings
                setRelatedForms(rel.forms);
              }
            } else {
              setRelatedForms([]);
            }
          } else {
            setRelatedForms([]);
          }
        } catch {
          setRelatedForms([]);
        }
      } else {
        setRelatedForms([]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed');
    } finally {
      setLoading(false);
    }
  };

  // Apply client-side book filter (normalize hyphens/spaces/case)
  const normalizeBook = (name: string) => name.toLowerCase().replace(/[^a-z0-9]/g, '');
  const getBookFromRef = (ref: string) => {
    const m = ref.match(/^(.+?)\s+\d+:\d+$/);
    return m ? m[1] : '';
  };
  const displayedResults = bookFilter
    ? results.filter(r => normalizeBook(getBookFromRef(r.ref)) === normalizeBook(bookFilter))
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
            {/* Related forms + toggle */}
            {relatedForms.length > 0 && (
              <div className="mb-4 bg-gray-800 border border-gray-700 rounded p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm text-gray-300">Related forms</div>
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={includeInflections}
                      onChange={(e) => setIncludeInflections(e.target.checked)}
                    />
                    <span>Include in search</span>
                  </label>
                </div>
                <div className="flex flex-wrap gap-2">
                  {relatedForms.slice(0, 24).map((f) => (
                    <button
                      key={f}
                      onClick={() => {
                        // quickly search that form directly
                        setQuery(f);
                        // reset inclusion for direct search
                        setIncludeInflections(false);
                        setRelatedForms([]);
                        setTimeout(() => handleSearch(), 0);
                      }}
                      className="text-xs px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded border border-gray-600"
                      title="Search this form"
                    >
                      {f}
                    </button>
                  ))}
                  {relatedForms.length > 24 && (
                    <span className="text-xs text-gray-400">+{relatedForms.length - 24} more</span>
                  )}
                </div>
              </div>
            )}
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
