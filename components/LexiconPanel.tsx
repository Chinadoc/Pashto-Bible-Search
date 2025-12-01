"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams } from 'next/navigation';

interface DictionaryEntry {
  id: string;
  pashto: string;
  romanization: string;
  english: string;
  pos: string;
  frequency?: number;
  lingdocs_id?: string;
}

interface Props {
  onPickForm?: (form: string) => void;
  queryProp?: string;
}

const WORKER_URL = process.env.NEXT_PUBLIC_CLOUDFLARE_WORKER_URL || 'https://pashtobiblesearch.jeremy-samuels17.workers.dev';

export default function LexiconPanel({ onPickForm, queryProp }: Props) {
  const searchParams = useSearchParams();
  const urlQuery = searchParams?.get('q') || '';
  
  const [entries, setEntries] = useState<DictionaryEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState(urlQuery || queryProp || '');
  const [selectedEntry, setSelectedEntry] = useState<DictionaryEntry | null>(null);
  const [verbForms, setVerbForms] = useState<any[]>([]);
  const [nounForms, setNounForms] = useState<any[]>([]);
  const [loadingForms, setLoadingForms] = useState(false);
  const [activeTab, setActiveTab] = useState<'dictionary' | 'frequency' | 'roots'>('dictionary');
  const [frequencyData, setFrequencyData] = useState<any[]>([]);
  const [posFilter, setPosFilter] = useState<'all' | 'verb' | 'noun' | 'adj' | 'other'>('all');

  // Debounced search
  const [debouncedQuery, setDebouncedQuery] = useState(searchQuery);
  
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(searchQuery), 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch dictionary entries
  const fetchEntries = useCallback(async (query: string) => {
    if (!query || query.length < 2) {
      setEntries([]);
      return;
    }

    setLoading(true);
    try {
      const isRomanized = /^[a-zA-Z]/.test(query);
      
      // Use dictionary/search endpoint for all searches
      const response = await fetch(`${WORKER_URL}/api/dictionary/search?q=${encodeURIComponent(query)}`);
      
      if (response.ok) {
        const data = await response.json();
        if (data.entries && data.entries.length > 0) {
          setEntries(data.entries);
          return;
        }
      }
      
      // Fallback: Try exact word-frequency lookup
      const freqResponse = await fetch(`${WORKER_URL}/api/word-frequency?word=${encodeURIComponent(query)}`);
      
      if (freqResponse.ok) {
        const data = await freqResponse.json();
        if (data && data.pashto_word) {
          setEntries([{
            id: data.pashto_word,
            pashto: data.pashto_word,
            romanization: data.romanization || '',
            english: data.english_translation || '',
            pos: data.word_type || data.pos || '',
            frequency: data.frequency_total,
          }]);
          return;
        }
      }

      // Fallback to local dictionary search
      const localResponse = await fetch(`/api/dictionary/search?q=${encodeURIComponent(query)}`);
      if (localResponse.ok) {
        const data = await localResponse.json();
        setEntries(data.entries || []);
      } else {
        setEntries([]);
      }
    } catch (error) {
      console.error('Error fetching dictionary entries:', error);
      setEntries([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch top frequency words for frequency tab
  const fetchTopFrequency = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`${WORKER_URL}/api/top-words?limit=100&pos=${posFilter}`);
      if (response.ok) {
        const data = await response.json();
        setFrequencyData(data.words || []);
      } else {
        // Fallback to local API
        const localResponse = await fetch(`/api/lexicon_frequency?limit=100&pos=${posFilter}`);
        if (localResponse.ok) {
          const data = await localResponse.json();
          setFrequencyData(data.items || []);
        }
      }
    } catch (error) {
      console.error('Error fetching frequency data:', error);
      setFrequencyData([]);
    } finally {
      setLoading(false);
    }
  }, [posFilter]);

  // Fetch verb/noun forms when entry is selected
  const fetchForms = useCallback(async (entry: DictionaryEntry) => {
    setLoadingForms(true);
    setVerbForms([]);
    setNounForms([]);

    try {
      // Check if it's a verb
      if (entry.pos?.toLowerCase().includes('v')) {
        const response = await fetch(`${WORKER_URL}/api/verb-forms?lemma=${encodeURIComponent(entry.pashto)}`);
        if (response.ok) {
          const data = await response.json();
          setVerbForms(data.forms || []);
        }
      }

      // Check if it's a noun
      if (entry.pos?.toLowerCase().includes('n')) {
        const response = await fetch(`${WORKER_URL}/api/noun-inflections?base=${encodeURIComponent(entry.pashto)}`);
        if (response.ok) {
          const data = await response.json();
          setNounForms(data.inflections || []);
        }
      }
    } catch (error) {
      console.error('Error fetching forms:', error);
    } finally {
      setLoadingForms(false);
    }
  }, []);

  // Search effect
  useEffect(() => {
    if (activeTab === 'dictionary' && debouncedQuery) {
      fetchEntries(debouncedQuery);
    }
  }, [debouncedQuery, activeTab, fetchEntries]);

  // Frequency tab effect
  useEffect(() => {
    if (activeTab === 'frequency') {
      fetchTopFrequency();
    }
  }, [activeTab, posFilter, fetchTopFrequency]);

  // Select entry effect
  useEffect(() => {
    if (selectedEntry) {
      fetchForms(selectedEntry);
    }
  }, [selectedEntry, fetchForms]);

  // Sync external query or URL query
  useEffect(() => {
    if (urlQuery) {
      setSearchQuery(urlQuery);
    } else if (queryProp) {
      setSearchQuery(queryProp);
    }
  }, [queryProp, urlQuery]);

  const getPosColor = (pos: string) => {
    const lower = pos?.toLowerCase() || '';
    if (lower.includes('v.') || lower.includes('verb')) return 'bg-blue-500';
    if (lower.includes('n.') || lower.includes('noun')) return 'bg-emerald-500';
    if (lower.includes('adj')) return 'bg-purple-500';
    if (lower.includes('adv')) return 'bg-orange-500';
    if (lower.includes('prep') || lower.includes('part')) return 'bg-pink-500';
    return 'bg-gray-500';
  };

  const getPosLabel = (pos: string) => {
    const lower = pos?.toLowerCase() || '';
    if (lower.includes('v.') || lower.includes('verb')) return 'Verb';
    if (lower.includes('n.') || lower.includes('noun')) return 'Noun';
    if (lower.includes('adj')) return 'Adjective';
    if (lower.includes('adv')) return 'Adverb';
    return pos || 'Other';
  };

  return (
    <div className="min-h-[600px]">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 via-blue-500 to-purple-500 bg-clip-text text-transparent mb-2">
          📚 Pashto Dictionary
        </h1>
        <p className="text-slate-400">
          Search words, explore conjugations, and discover frequencies
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 p-1 bg-slate-800/50 rounded-xl">
        {[
          { id: 'dictionary', label: '📖 Dictionary', icon: '📖' },
          { id: 'frequency', label: '📊 Frequency', icon: '📊' },
          { id: 'roots', label: '🌳 Roots', icon: '🌳' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Search Bar */}
      <div className="relative mb-6">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search Pashto or English..."
          className="w-full px-5 py-4 bg-slate-800/80 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
          dir="auto"
        />
        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500">
          {loading ? (
            <div className="animate-spin h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full" />
          ) : (
            <span className="text-xl">🔍</span>
          )}
        </div>
      </div>

      {/* Dictionary Tab */}
      {activeTab === 'dictionary' && (
        <div className="space-y-4">
          {entries.length === 0 && !loading && searchQuery.length >= 2 && (
            <div className="text-center py-12 text-slate-500">
              <div className="text-5xl mb-4">📭</div>
              <p>No entries found for "{searchQuery}"</p>
              <button
                onClick={() => onPickForm?.(searchQuery)}
                className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                Search in Bible instead
              </button>
            </div>
          )}

          {entries.length === 0 && !loading && searchQuery.length < 2 && (
            <div className="text-center py-12 text-slate-500">
              <div className="text-5xl mb-4">📚</div>
              <p>Type at least 2 characters to search</p>
              <div className="mt-6 flex flex-wrap gap-2 justify-center">
                <p className="w-full text-sm mb-2">Try these common words:</p>
                {['کول', 'کېدل', 'وهل', 'ورکول', 'مرسته', 'خدای'].map((word) => (
                  <button
                    key={word}
                    onClick={() => setSearchQuery(word)}
                    className="px-4 py-2 bg-slate-700/50 hover:bg-slate-600 rounded-lg text-white transition-colors"
                    dir="rtl"
                  >
                    {word}
                  </button>
                ))}
              </div>
            </div>
          )}

          {entries.map((entry, idx) => (
            <div
              key={entry.id || idx}
              className={`p-5 rounded-xl border transition-all cursor-pointer ${
                selectedEntry?.id === entry.id
                  ? 'bg-slate-700/80 border-blue-500 shadow-lg shadow-blue-500/20'
                  : 'bg-slate-800/50 border-slate-700 hover:border-slate-600'
              }`}
              onClick={() => setSelectedEntry(entry)}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-2xl font-bold text-white" dir="rtl">
                      {entry.pashto}
                    </h3>
                    <span className={`px-2 py-0.5 text-xs font-semibold rounded-full text-white ${getPosColor(entry.pos)}`}>
                      {getPosLabel(entry.pos)}
                    </span>
                    {entry.frequency && (
                      <span className="text-xs text-slate-400 bg-slate-700 px-2 py-0.5 rounded">
                        {entry.frequency.toLocaleString()}×
                      </span>
                    )}
                  </div>
                  
                  {entry.romanization && (
                    <p className="text-blue-400 font-medium mb-1">
                      {entry.romanization}
                    </p>
                  )}
                  
                  {entry.english && (
                    <p className="text-slate-300 leading-relaxed">
                      {entry.english}
                    </p>
                  )}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onPickForm?.(entry.pashto);
                    }}
                    className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm rounded-lg transition-colors"
                  >
                    Search Bible
                  </button>
                  {entry.lingdocs_id && (
                    <a
                      href={`https://dictionary.lingdocs.com/word?id=${entry.lingdocs_id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded-lg transition-colors"
                    >
                      LingDocs
                    </a>
                  )}
                </div>
              </div>

              {/* Expanded Forms Section */}
              {selectedEntry?.id === entry.id && (
                <div className="mt-5 pt-5 border-t border-slate-600">
                  {loadingForms ? (
                    <div className="flex items-center gap-2 text-slate-400">
                      <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full" />
                      Loading conjugations...
                    </div>
                  ) : (
                    <>
                      {verbForms.length > 0 && (
                        <div className="mb-4">
                          <h4 className="text-sm font-semibold text-blue-400 mb-3">
                            🔄 Verb Conjugations ({verbForms.length} forms)
                          </h4>
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                            {verbForms.slice(0, 12).map((form, i) => (
                              <button
                                key={i}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onPickForm?.(form.form || form);
                                }}
                                className="px-3 py-2 bg-blue-900/30 hover:bg-blue-800/50 border border-blue-700/50 rounded-lg text-sm text-white transition-colors text-right"
                                dir="rtl"
                              >
                                <div className="font-medium">{form.form || form}</div>
                                {form.label && (
                                  <div className="text-xs text-blue-400 mt-0.5">{form.label}</div>
                                )}
                              </button>
                            ))}
                          </div>
                          {verbForms.length > 12 && (
                            <p className="text-xs text-slate-500 mt-2">
                              + {verbForms.length - 12} more forms
                            </p>
                          )}
                        </div>
                      )}

                      {nounForms.length > 0 && (
                        <div>
                          <h4 className="text-sm font-semibold text-emerald-400 mb-3">
                            📋 Noun Inflections ({nounForms.length} forms)
                          </h4>
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                            {nounForms.slice(0, 8).map((form, i) => (
                              <button
                                key={i}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onPickForm?.(form.inflected_form || form.form);
                                }}
                                className="px-3 py-2 bg-emerald-900/30 hover:bg-emerald-800/50 border border-emerald-700/50 rounded-lg text-sm text-white transition-colors text-right"
                                dir="rtl"
                              >
                                <div className="font-medium">{form.inflected_form || form.form}</div>
                                {form.inflection_type && (
                                  <div className="text-xs text-emerald-400 mt-0.5">{form.inflection_type}</div>
                                )}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {verbForms.length === 0 && nounForms.length === 0 && (
                        <p className="text-slate-500 text-sm">
                          No additional forms found for this entry.
                        </p>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Frequency Tab */}
      {activeTab === 'frequency' && (
        <div>
          {/* POS Filter */}
          <div className="flex gap-2 mb-6">
            {[
              { id: 'all', label: 'All' },
              { id: 'verb', label: 'Verbs' },
              { id: 'noun', label: 'Nouns' },
              { id: 'adj', label: 'Adjectives' },
              { id: 'other', label: 'Other' },
            ].map((filter) => (
              <button
                key={filter.id}
                onClick={() => setPosFilter(filter.id as any)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  posFilter === filter.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-700/50 text-slate-400 hover:bg-slate-700'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>

          {/* Frequency List */}
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin h-8 w-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-4" />
              <p className="text-slate-500">Loading frequency data...</p>
            </div>
          ) : frequencyData.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <div className="text-5xl mb-4">📊</div>
              <p>No frequency data available</p>
            </div>
          ) : (
            <div className="grid gap-2">
              {frequencyData.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-4 p-4 bg-slate-800/50 rounded-lg hover:bg-slate-700/50 transition-colors cursor-pointer"
                  onClick={() => {
                    setSearchQuery(item.form || item.pashto_word);
                    setActiveTab('dictionary');
                  }}
                >
                  <div className="w-8 text-center text-slate-500 font-mono text-sm">
                    #{idx + 1}
                  </div>
                  <div className="flex-1">
                    <span className="text-xl font-bold text-white" dir="rtl">
                      {item.form || item.pashto_word}
                    </span>
                    {item.romanization && (
                      <span className="ml-3 text-blue-400 text-sm">
                        {item.romanization}
                      </span>
                    )}
                    {item.dictionary?.english && (
                      <span className="ml-3 text-slate-400 text-sm">
                        {item.dictionary.english}
                      </span>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-emerald-400">
                      {(item.frequency || item.frequency_total || 0).toLocaleString()}
                    </div>
                    <div className="text-xs text-slate-500">occurrences</div>
                  </div>
                  <div className={`px-2 py-1 text-xs font-semibold rounded text-white ${getPosColor(item.pos || item.word_type || '')}`}>
                    {getPosLabel(item.pos || item.word_type || '')}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Roots Tab */}
      {activeTab === 'roots' && (
        <div className="text-center py-12 text-slate-500">
          <div className="text-5xl mb-4">🌳</div>
          <h3 className="text-xl font-bold text-white mb-2">Root Analysis</h3>
          <p>Explore Pashto word roots and their derived forms</p>
          <p className="text-sm mt-4">Coming soon...</p>
        </div>
      )}
    </div>
  );
}
