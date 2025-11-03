"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/utils/supabase";

interface FrequencyItem {
  form: string;
  root?: string;
  pos?: 'verb' | 'noun';
  frequency: number;
  dictionary?: {
    definition?: string;
    romanized?: string;
    pos?: string;
    english?: string;
  };
  morphological?: {
    relatedForms?: Array<{ form: string; count: number }>;
    inflections?: Array<{ form: string; grammatical_info: any; frequency: number }>;
  };
  verseContexts?: Array<{
    verse_ref: string;
    verse_text: string;
    book: string;
    chapter: number;
    verse: number;
  }>;
}

interface Props { onPickForm?: (form: string) => void; queryProp?: string }

export default function LexiconPanel({ onPickForm, queryProp }: Props) {
  const [frequencyData, setFrequencyData] = useState<FrequencyItem[]>([]);
  const [filteredData, setFilteredData] = useState<FrequencyItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [posFilter, setPosFilter] = useState<'any' | 'verb' | 'noun'>('any');
  const [scope, setScope] = useState<'all' | 'ot' | 'nt'>('all');
  const [limit, setLimit] = useState(300);
  const [sortBy, setSortBy] = useState<'frequency' | 'form' | 'rank' | 'root' | 'type'>('frequency');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  // New filters
  const [inflectionPatternFilter, setInflectionPatternFilter] = useState<string>('any');
  const [inflectionLabelFilter, setInflectionLabelFilter] = useState<string>('any');
  const [verbAspectFilter, setVerbAspectFilter] = useState<string>('any');
  const [compoundTypeFilter, setCompoundTypeFilter] = useState<string>('any');
  const [wordTypeFilter, setWordTypeFilter] = useState<string>('any');
  const [audioMap, setAudioMap] = useState<Record<string, string>>({});
  const [searchMode, setSearchMode] = useState<'exact' | 'fuzzy' | 'regex' | 'root'>('exact');
  const [showStats, setShowStats] = useState(false);
  const [userNotes, setUserNotes] = useState<Record<string, string>>({});
  const [showNoteForm, setShowNoteForm] = useState<string | null>(null);

  // Fetch frequency data
  const fetchFrequencyData = async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        scope,
        limit: limit.toString(),
        pos: posFilter,
        search: searchQuery,
        sort_by: sortBy,
        sort_order: sortOrder,
      });

      // Add advanced filters if set (only send if not 'any')
      if (inflectionPatternFilter && inflectionPatternFilter !== 'any') {
        params.set('inflection_pattern', inflectionPatternFilter);
      }
      if (inflectionLabelFilter && inflectionLabelFilter !== 'any') {
        params.set('inflection_label', inflectionLabelFilter);
      }
      if (verbAspectFilter && verbAspectFilter !== 'any') {
        params.set('verb_aspect', verbAspectFilter);
      }
      if (compoundTypeFilter && compoundTypeFilter !== 'any') {
        params.set('compound_type', compoundTypeFilter);
      }
      if (wordTypeFilter && wordTypeFilter !== 'any') {
        params.set('word_type', wordTypeFilter);
      }
      
      console.log('Fetching with params:', params.toString());

      // Try new D1 endpoint first, fallback to lexicon_frequency
      let response = await fetch(`/api/lexicon-d1?${params.toString()}`);
      console.log('API Response status:', response.status, 'URL:', `/api/lexicon-d1?${params.toString()}`);
      
      if (!response.ok) {
        console.warn('D1 API failed, trying fallback');
        // Fallback to existing endpoint
        const fallbackParams = new URLSearchParams({
          scope,
          limit: limit.toString(),
          pos: posFilter,
        });
        response = await fetch(`/api/lexicon_frequency?${fallbackParams.toString()}`);
      }
      const data = await response.json();

      console.log('API Response:', { ok: response.ok, status: response.status, itemsCount: data.items?.length });
      console.log('Sample item:', data.items?.[0]);
      console.log('Full response:', JSON.stringify(data).substring(0, 500));

      if (response.ok && data.items) {
        console.log('Using API data with', data.items.length, 'items');
        setFrequencyData(data.items || []);
      } else {
        // Fallback to static JSON data
        console.log('API returned no items or error, using fallback JSON data');
        console.log('API error:', data.error, data.details);
        const fallbackResponse = await fetch('/word_frequency_list.json');
        if (fallbackResponse.ok) {
          const fallbackData = await fallbackResponse.json();
          let filteredItems: FrequencyItem[] = fallbackData.slice(0, limit).map((item: any) => ({
            form: item.pashto,
            frequency: item.frequency,
            pos: item.pos === 'verb' ? 'verb' : item.pos === 'noun' ? 'noun' : undefined,
            dictionary: item.romanization || item.definition ? {
              romanized: item.romanization || '',
              definition: item.definition || '',
              pos: item.pos || '',
              english: item.english || '',
            } : undefined,
          }));

          // Apply POS filter for fallback data
          if (posFilter !== 'any') {
            filteredItems = filteredItems.filter(item => item.pos === posFilter);
          }

          setFrequencyData(filteredItems);
        } else {
          setError('Failed to fetch frequency data');
        }
      }
    } catch (err) {
      // Fallback to static JSON data on error
      console.log('Using fallback JSON data due to error');
      try {
        const fallbackResponse = await fetch('/word_frequency_list.json');
        if (fallbackResponse.ok) {
          const fallbackData = await fallbackResponse.json();
          let filteredItems: FrequencyItem[] = fallbackData.slice(0, limit).map((item: any) => ({
            form: item.pashto,
            frequency: item.frequency,
            pos: item.pos === 'verb' ? 'verb' : item.pos === 'noun' ? 'noun' : undefined,
            dictionary: item.romanization || item.definition ? {
              romanized: item.romanization || '',
              definition: item.definition || '',
              pos: item.pos || '',
              english: item.english || '',
            } : undefined,
          }));

          // Apply POS filter for fallback data
          if (posFilter !== 'any') {
            filteredItems = filteredItems.filter(item => item.pos === posFilter);
          }

          setFrequencyData(filteredItems);
        } else {
          setError('Failed to fetch frequency data');
        }
      } catch (fallbackErr) {
        setError('Failed to fetch frequency data');
        console.error('Error fetching frequency data:', err);
        console.error('Fallback also failed:', fallbackErr);
      }
    } finally {
      setLoading(false);
    }
  };

  // Initial load and when filters change
  useEffect(() => {
    fetchFrequencyData();
  }, [scope, limit, posFilter, inflectionPatternFilter, inflectionLabelFilter, verbAspectFilter, compoundTypeFilter, wordTypeFilter]);

  // Filter and search data
  useEffect(() => {
    let filtered = frequencyData;

    // Apply search query filter with advanced modes
    if (searchQuery.trim()) {
      const query = searchQuery.trim();

      filtered = filtered.filter(item => {
        const form = item.form.toLowerCase();
        const root = (item.root || '').toLowerCase();
        const romanization = (item.dictionary?.romanized || '').toLowerCase();

        switch (searchMode) {
          case 'exact':
            return form.includes(query.toLowerCase()) || root.includes(query.toLowerCase()) || romanization.includes(query.toLowerCase());

          case 'fuzzy':
            // Simple fuzzy matching - check for similar characters
            return form.includes(query.toLowerCase()) ||
                   root.includes(query.toLowerCase()) ||
                   romanization.includes(query.toLowerCase()) ||
                   levenshteinDistance(form, query.toLowerCase()) <= 2 ||
                   levenshteinDistance(root, query.toLowerCase()) <= 2;

          case 'regex':
            try {
              const regex = new RegExp(query, 'i');
              return regex.test(item.form) || regex.test(item.root || '') || regex.test(item.dictionary?.romanized || '');
            } catch {
              // Invalid regex, fall back to exact match
              return form.includes(query.toLowerCase()) || root.includes(query.toLowerCase()) || romanization.includes(query.toLowerCase());
            }

          case 'root':
            // Search for words that could be related to this root pattern
            return root.includes(query.toLowerCase()) ||
                   form.includes(query.toLowerCase()) ||
                   // Check if this looks like a root pattern (typically 2-4 consonants)
                   (query.length >= 2 && query.length <= 4 && /^[بپتثجچحخدذرزژسشصضطظعغفقکگلمنوهی]+$/.test(query) && root.includes(query));

          default:
            return form.includes(query.toLowerCase()) || root.includes(query.toLowerCase()) || romanization.includes(query.toLowerCase());
        }
      });
    }

    // Apply additional filters from API response or client-side
    // Note: These filters should ideally be applied server-side for better performance
    // For now, we apply them client-side if the data includes these fields
    
    // Filter by inflection pattern (if available in data)
    if (inflectionPatternFilter !== 'any') {
      filtered = filtered.filter(item => {
        // Check if item has inflection_pattern field
        const itemPattern = (item as any).inflectionPattern || (item as any).inflection_pattern;
        // If field doesn't exist, don't filter it out (show all)
        if (!itemPattern) return true;
        return String(itemPattern).toLowerCase() === inflectionPatternFilter.toLowerCase();
      });
    }

    // Filter by inflection label (if available)
    if (inflectionLabelFilter !== 'any') {
      filtered = filtered.filter(item => {
        const itemLabel = (item as any).inflectionLabel || (item as any).inflectionType;
        // If field doesn't exist, don't filter it out (show all)
        if (!itemLabel) return true;
        // Map dropdown values to inflection_type values
        const labelStr = String(itemLabel).toLowerCase();
        let filterStr = inflectionLabelFilter.toLowerCase();
        
        // Map dropdown values to actual inflection_type values
        if (filterStr === 'masc_1st' || filterStr === 'fem_1st') {
          filterStr = '1st';
        } else if (filterStr === 'masc_2nd' || filterStr === 'fem_2nd') {
          filterStr = '2nd';
        }
        
        return labelStr === filterStr || labelStr.includes(filterStr) || filterStr.includes(labelStr);
      });
    }

    // Filter by verb aspect (if available)
    if (verbAspectFilter !== 'any' && posFilter === 'verb') {
      filtered = filtered.filter(item => {
        // Check if item has aspect information
        const itemAspect = (item as any).aspect || (item as any).verbAspect;
        if (!itemAspect) return true; // Don't filter if field doesn't exist
        return String(itemAspect).toLowerCase() === verbAspectFilter.toLowerCase();
      });
    }

    // Filter by compound type (if available)
    if (compoundTypeFilter !== 'any') {
      filtered = filtered.filter(item => {
        const itemWordType = (item as any).wordType;
        const isCompound = item.form.includes('\u200c') || item.form.includes('\u200d') || item.form.includes(' ');
        
        // If wordType field exists, use it
        if (itemWordType) {
          if (compoundTypeFilter === 'dynamic' || compoundTypeFilter === 'compound_dynamic') {
            return itemWordType === 'compound_dynamic' || itemWordType === 'dynamic';
          } else if (compoundTypeFilter === 'stative' || compoundTypeFilter === 'compound_stative') {
            return itemWordType === 'compound_stative' || itemWordType === 'stative';
          }
          return itemWordType === compoundTypeFilter;
        }
        
        // Fallback: check if word looks like a compound
        if (compoundTypeFilter === 'dynamic' || compoundTypeFilter === 'compound_dynamic') {
          return isCompound && (item.pos === 'verb' || item.pos?.includes('verb'));
        } else if (compoundTypeFilter === 'stative' || compoundTypeFilter === 'compound_stative') {
          return isCompound;
        }
        
        // If no compound type matches and filter is set, show only non-compounds
        return !isCompound;
      });
    }

    // Filter by word type (if available)
    if (wordTypeFilter !== 'any') {
      filtered = filtered.filter(item => {
        const itemWordType = (item as any).wordType;
        // If field doesn't exist, don't filter it out (show all)
        if (!itemWordType) return true;
        return String(itemWordType).toLowerCase() === wordTypeFilter.toLowerCase();
      });
    }

    // Apply POS filter for local data (API data already filtered)
    if (posFilter !== 'any') {
      filtered = filtered.filter(item => item.pos === posFilter);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let comparison = 0;

      if (sortBy === 'frequency') {
        comparison = a.frequency - b.frequency;
      } else if (sortBy === 'form') {
        comparison = a.form.localeCompare(b.form);
      } else if (sortBy === 'root') {
        comparison = (a.root || '').localeCompare(b.root || '');
      } else if (sortBy === 'type') {
        comparison = (a.pos || '').localeCompare(b.pos || '');
      } else if (sortBy === 'rank') {
        // Rank is based on index, so we'll sort by frequency as proxy
        comparison = a.frequency - b.frequency;
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });

    setFilteredData(filtered);
  }, [frequencyData, searchQuery, sortBy, sortOrder, posFilter, searchMode, inflectionPatternFilter, inflectionLabelFilter, verbAspectFilter, compoundTypeFilter, wordTypeFilter]);

  // Simple Levenshtein distance for fuzzy matching
  function levenshteinDistance(a: string, b: string): number {
    if (a.length === 0) return b.length;
    if (b.length === 0) return a.length;

    const matrix = Array(b.length + 1).fill(null).map(() => Array(a.length + 1).fill(null));

    for (let i = 0; i <= a.length; i++) matrix[0][i] = i;
    for (let j = 0; j <= b.length; j++) matrix[j][0] = j;

    for (let j = 1; j <= b.length; j++) {
      for (let i = 1; i <= a.length; i++) {
        const indicator = a[i - 1] === b[j - 1] ? 0 : 1;
        matrix[j][i] = Math.min(
          matrix[j][i - 1] + 1,     // deletion
          matrix[j - 1][i] + 1,     // insertion
          matrix[j - 1][i - 1] + indicator // substitution
        );
      }
    }

    return matrix[b.length][a.length];
  }

  // Load audio map for verse references
  const loadAudioMap = async () => {
    try {
      const response = await fetch('/api/get_audio_map');
      if (response.ok) {
        const audioData = await response.json();
        setAudioMap(audioData);
      }
    } catch (err) {
      console.warn('Failed to load audio map:', err);
    }
  };

  // Load audio map on component mount
  useEffect(() => {
    loadAudioMap();
  }, []);

  // Load user notes from localStorage
  useEffect(() => {
    const savedNotes = localStorage.getItem('pashto-lexicon-notes');
    if (savedNotes) {
      try {
        setUserNotes(JSON.parse(savedNotes));
      } catch (err) {
        console.warn('Failed to load user notes:', err);
      }
    }
  }, []);

  // Save user notes to localStorage
  const saveUserNotes = (notes: Record<string, string>) => {
    localStorage.setItem('pashto-lexicon-notes', JSON.stringify(notes));
    setUserNotes(notes);
  };

  // Add or update a user note
  const addUserNote = (word: string, note: string) => {
    const newNotes = { ...userNotes, [word]: note };
    saveUserNotes(newNotes);
    setShowNoteForm(null);
  };

  // Submit correction to API
  const submitCorrection = async (word: string, correction: string) => {
    try {
      await fetch('/api/user-corrections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ word, correction, timestamp: new Date().toISOString() }),
      });
      alert('Your correction has been submitted. Thank you!');
      setShowNoteForm(null);
    } catch (err) {
      console.error('Failed to submit correction:', err);
      alert('Error submitting correction. Please try again.');
    }
  };

  // Export functionality
  const exportToCSV = (data: FrequencyItem[]) => {
    const headers = [
      'Rank',
      'Word',
      'Root',
      'Type',
      'Frequency',
      'Romanized',
      'Definition',
      'POS',
      'Related Forms',
      'Inflections',
      'Verses',
      'User Notes'
    ];

    const csvData = data.map((item, index) => [
      (index + 1).toString(),
      item.form,
      item.root || '',
      item.pos === 'verb' ? 'Verb' : item.pos === 'noun' ? 'Noun' : 'Unknown',
      item.frequency.toString(),
      item.dictionary?.romanized || '',
      item.dictionary?.definition || '',
      item.dictionary?.pos || '',
      item.morphological?.relatedForms?.map(f => `${f.form}(${f.count})`).join('; ') || '',
      item.morphological?.inflections?.map(i =>
        `${i.form}(${typeof i.grammatical_info === 'object' ?
          Object.entries(i.grammatical_info).map(([k, v]) => `${k}:${v}`).join(',') :
          i.grammatical_info}${i.frequency > 0 ? `;${i.frequency}` : ''})`
      ).join('; ') || '',
      item.verseContexts?.map(c => c.verse_ref).join('; ') || '',
      userNotes[item.form] || ''
    ]);

    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.map(cell => `"${cell.replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `pashto_frequency_list_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Sync external query if provided
  useEffect(() => {
    if (typeof queryProp === 'string') {
      setSearchQuery(queryProp);
    }
  }, [queryProp]);

  if (error) {
    return <div className="p-4 text-center text-red-500">Error: {error}</div>;
  }

  return (
    <div className="p-4 mx-auto" style={{ maxWidth: '95%' }} dir="rtl">
      <h2 className="text-xl font-bold mb-4">Lexicon - Word Frequency List</h2>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Pashto Lexicon - Word frequency list from Bible text
      </p>

      {/* Controls */}
      <div className="mb-6 space-y-4 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
        {/* Search Input */}
        <div className="flex gap-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              searchMode === 'exact' ? 'Search words or roots...' :
              searchMode === 'fuzzy' ? 'Fuzzy search...' :
              searchMode === 'regex' ? 'Regex pattern...' :
              'Root pattern search...'
            }
            className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-sm"
          />
          <select
            value={searchMode}
            onChange={(e) => setSearchMode(e.target.value as 'exact' | 'fuzzy' | 'regex' | 'root')}
            className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-sm"
          >
            <option value="exact">Exact</option>
            <option value="fuzzy">Fuzzy</option>
            <option value="regex">Regex</option>
            <option value="root">Root</option>
          </select>
          <button
            onClick={fetchFrequencyData}
            className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Reload'}
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center">
          <button
            onClick={() => setShowStats(!showStats)}
            className="px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm flex items-center gap-2"
          >
            📊 Statistics {showStats ? 'Hide' : 'Show'}
          </button>
          <button
            onClick={() => exportToCSV(filteredData)}
            className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm flex items-center gap-2"
          >
            📥 Export CSV
          </button>
        </div>

        {/* Filters */}
        <div className="space-y-4">
          {/* First row: Basic filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-medium mb-1">Scope</label>
              <select
                value={scope}
                onChange={(e) => setScope(e.target.value as 'all' | 'ot' | 'nt')}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-sm"
              >
                <option value="all">All Bible</option>
                <option value="ot">Old Testament</option>
                <option value="nt">New Testament</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium mb-1">Word Type</label>
              <select
                value={posFilter}
                onChange={(e) => setPosFilter(e.target.value as 'any' | 'verb' | 'noun')}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-sm"
              >
                <option value="any">All</option>
                <option value="verb">Verbs</option>
                <option value="noun">Nouns</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium mb-1">Result Count</label>
              <select
                value={limit}
                onChange={(e) => setLimit(Number(e.target.value))}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-sm"
              >
                <option value={100}>100</option>
                <option value={300}>300</option>
                <option value={500}>500</option>
                <option value={1000}>1000</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium mb-1">Sort By</label>
              <div className="flex gap-1">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'frequency' | 'form' | 'rank' | 'root' | 'type')}
                  className="flex-1 p-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-sm"
                >
                  <option value="frequency">Frequency</option>
                  <option value="form">Alphabetical</option>
                  <option value="root">Root</option>
                  <option value="type">Type</option>
                  <option value="rank">Rank</option>
                </select>
                <button
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                  className="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-sm hover:bg-gray-50 dark:hover:bg-gray-600"
                  title={`Sort ${sortOrder === 'asc' ? 'Ascending' : 'Descending'}`}
                >
                  {sortOrder === 'asc' ? '↑' : '↓'}
                </button>
              </div>
            </div>
          </div>

          {/* Second row: Advanced filters */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <label className="block text-xs font-medium mb-1">Inflection Pattern</label>
              <select
                value={inflectionPatternFilter}
                onChange={(e) => setInflectionPatternFilter(e.target.value)}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-sm"
              >
                <option value="any">All Patterns</option>
                <option value="pattern1">Pattern 1</option>
                <option value="pattern2">Pattern 2</option>
                <option value="pattern3">Pattern 3</option>
                <option value="pattern4">Pattern 4</option>
                <option value="pattern5">Pattern 5</option>
                <option value="pattern5.5">Pattern 5.5</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium mb-1">Inflection</label>
              <select
                value={inflectionLabelFilter}
                onChange={(e) => setInflectionLabelFilter(e.target.value)}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-sm"
              >
                <option value="any">All</option>
                <option value="masc_1st">Masculine 1st</option>
                <option value="masc_2nd">Masculine 2nd</option>
                <option value="fem_1st">Feminine 1st</option>
                <option value="fem_2nd">Feminine 2nd</option>
                <option value="plain">Plain</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium mb-1">Verb Aspect</label>
              <select
                value={verbAspectFilter}
                onChange={(e) => setVerbAspectFilter(e.target.value)}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-sm"
                disabled={posFilter !== 'verb'}
              >
                <option value="any">All</option>
                <option value="imperfective">Imperfective</option>
                <option value="perfective">Perfective</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium mb-1">Compound Type</label>
              <select
                value={compoundTypeFilter}
                onChange={(e) => setCompoundTypeFilter(e.target.value)}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-sm"
              >
                <option value="any">All</option>
                <option value="dynamic">Dynamic</option>
                <option value="stative">Stative</option>
                <option value="compound_dynamic">Dynamic Compounds</option>
                <option value="compound_stative">Stative Compounds</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium mb-1">Word Category</label>
              <select
                value={wordTypeFilter}
                onChange={(e) => setWordTypeFilter(e.target.value)}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-sm"
              >
                <option value="any">All</option>
                <option value="proper_noun">Proper Nouns</option>
                <option value="compound">Compound Words</option>
              </select>
            </div>
          </div>
        </div>
            </div>

      {/* Results Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full divide-y divide-gray-200 dark:divide-gray-700 table-fixed">
            <thead className="bg-gray-50 dark:bg-gray-700 sticky top-0 z-10">
              <tr>
                <th 
                  className="w-16 px-3 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 select-none"
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
                  className="w-24 px-3 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 select-none"
                  onClick={() => {
                    if (sortBy === 'form') {
                      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                    } else {
                      setSortBy('form');
                      setSortOrder('asc');
                    }
                  }}
                >
                  Word {sortBy === 'form' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th 
                  className="w-24 px-3 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 select-none"
                  onClick={() => {
                    if (sortBy === 'root') {
                      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                    } else {
                      setSortBy('root');
                      setSortOrder('asc');
                    }
                  }}
                >
                  Root {sortBy === 'root' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th 
                  className="w-20 px-3 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 select-none"
                  onClick={() => {
                    if (sortBy === 'type') {
                      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                    } else {
                      setSortBy('type');
                      setSortOrder('asc');
                    }
                  }}
                >
                  Type {sortBy === 'type' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th 
                  className="w-20 px-3 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 select-none"
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
                <th className="w-80 px-3 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Dictionary
                </th>
                <th className="w-48 px-3 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Related Forms
                </th>
                <th className="w-16 px-3 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Audio
                </th>
                <th className="w-24 px-3 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Verses
                </th>
                <th className="w-24 px-3 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Notes
                </th>
                <th className="w-24 px-3 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {loading ? (
                <tr>
                  <td colSpan={11} className="px-3 py-4 text-center text-gray-500">
                    Loading...
                  </td>
                </tr>
              ) : filteredData.length === 0 ? (
                <tr>
                  <td colSpan={11} className="px-3 py-4 text-center text-gray-500">
                    No results found
                  </td>
                </tr>
              ) : (
                filteredData.map((item, index) => (
                  <tr key={`${item.form}-${index}`} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      {index + 1}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100 font-mono">
                      {item.form}
                      {(item as any).inflectionPattern && (
                        <span className="ml-2 text-xs text-blue-600 dark:text-blue-400">
                          ({(item as any).inflectionPattern})
                        </span>
                      )}
                      {(item as any).wordType === 'proper_noun' && (
                        <span className="ml-2 text-xs text-purple-600 dark:text-purple-400 font-semibold">
                          [Proper Noun]
                        </span>
                      )}
                      {(item as any).wordType === 'compound' && (
                        <span className="ml-2 text-xs text-orange-600 dark:text-orange-400 font-semibold">
                          [Compound]
                        </span>
                      )}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {item.root || '-'}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-0.5 text-xs font-semibold rounded-full ${
                        item.pos?.includes('v.') || item.pos?.includes('verb')
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                          : item.pos?.includes('n.') || item.pos?.includes('noun')
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : item.pos?.includes('adpos') || item.pos?.includes('adp')
                          ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                          : item.pos?.includes('conj')
                          ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
                          : item.pos?.includes('adv')
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                          : item.pos?.includes('pron')
                          ? 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200'
                          : item.pos?.includes('adj')
                          ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200'
                          : item.pos?.includes('num')
                          ? 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200'
                          : item.pos?.includes('part')
                          ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                      }`}>
                        {item.pos || 'Unknown'}
                      </span>
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {item.frequency.toLocaleString()}
                    </td>
                    <td className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">
                      {item.dictionary?.definition ? (
                        <div>
                          <div className="text-xs font-medium text-gray-900 dark:text-gray-100">
                            {item.dictionary.romanized || item.form}
                          </div>
                          <div className="text-xs text-gray-600 dark:text-gray-400" title={item.dictionary.definition}>
                            {item.dictionary.definition}
                          </div>
                          {item.dictionary.pos && (
                            <div className="text-xs text-blue-600 dark:text-blue-400">
                              {item.dictionary.pos}
                </div>
              )}
            </div>
                      ) : (
                        <span className="text-xs text-gray-400">—</span>
                      )}
                    </td>
                    <td className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">
                      {item.morphological?.relatedForms && item.morphological.relatedForms.length > 0 ? (
                        <div>
                          <div className="text-xs font-medium text-gray-900 dark:text-gray-100 mb-1">
                            Related Forms:
                          </div>
                          {item.morphological.relatedForms.slice(0, 3).map((form, idx) => (
                            <div key={idx} className="text-xs">
                              <span className="font-mono">{form.form}</span>
                              <span className="text-gray-500">({form.count})</span>
          </div>
                          ))}
                          {item.morphological.relatedForms.length > 3 && (
                            <div className="text-xs text-gray-400">+{item.morphological.relatedForms.length - 3} more</div>
                          )}
                          {item.morphological?.inflections && item.morphological.inflections.length > 0 && (
                            <div className="text-xs font-medium text-gray-900 dark:text-gray-100 mt-2 mb-1">
                              Inflections:
          </div>
                          )}
                          {item.morphological?.inflections && item.morphological.inflections.slice(0, 2).map((inflection, idx) => (
                            <div key={idx} className="text-xs">
                              <span className="font-mono">{inflection.form}</span>
                              {inflection.grammatical_info && (
                                <span className="text-gray-500 ml-1">
                                  ({typeof inflection.grammatical_info === 'object' ?
                                    Object.entries(inflection.grammatical_info).map(([k, v]) => `${k}:${v}`).join(', ') :
                                    inflection.grammatical_info})
                                </span>
                              )}
                              {inflection.frequency > 0 && (
                                <span className="text-blue-500 ml-1">({inflection.frequency})</span>
                              )}
                            </div>
                          ))}

          </div>
                      ) : (
                        <span className="text-xs text-gray-400">—</span>
                      )}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {Object.keys(audioMap).length > 0 ? (
                        <span className="text-xs">
                          📊
                        </span>
                      ) : (
                        <span className="text-xs text-gray-400">—</span>
                      )}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {item.verseContexts && item.verseContexts.length > 0 ? (
                        <div className="max-w-xs">
                          {item.verseContexts.slice(0, 2).map((ctx, idx) => (
                            <div key={idx} className="text-xs">
                              {ctx.verse_ref}
                            </div>
                          ))}
                          {item.verseContexts.length > 2 && (
                            <div className="text-xs text-gray-400">+{item.verseContexts.length - 2} more</div>
                          )}
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400">—</span>
                      )}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {showNoteForm === item.form ? (
                        <div className="space-y-2">
                          <textarea
                            className="w-full p-2 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800"
                            placeholder="Write your note or correction..."
                            rows={2}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && e.ctrlKey) {
                                const note = (e.target as HTMLTextAreaElement).value.trim();
                                if (note) {
                                  submitCorrection(item.form, note);
                                }
                              }
                              if (e.key === 'Escape') {
                                setShowNoteForm(null);
                              }
                            }}
                          />
                          <div className="flex gap-1">
                            <button
                              onClick={(e) => {
                                const note = (e.target as any).previousElementSibling?.querySelector('textarea')?.value?.trim();
                                if (note) {
                                  submitCorrection(item.form, note);
                                }
                              }}
                              className="px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
                            >
                              Submit
                            </button>
                            <button
                              onClick={() => setShowNoteForm(null)}
                              className="px-2 py-1 text-xs bg-gray-500 text-white rounded hover:bg-gray-600"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          {userNotes[item.form] && (
                            <span className="text-xs text-blue-600 dark:text-blue-400">✓</span>
                          )}
                          <button
                            onClick={() => setShowNoteForm(item.form)}
                            className="text-xs text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
                          >
                            {userNotes[item.form] ? 'Edit' : 'Add'}
                          </button>
                        </div>
                      )}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => onPickForm?.(item.form)}
                        className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                      >
                        Search
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Statistics Panel */}
      {showStats && filteredData.length > 0 && (
        <div className="mb-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-6 rounded-lg">
          <h3 className="text-lg font-bold mb-4 text-gray-800 dark:text-gray-200">📊 Frequency Statistics</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Basic Statistics */}
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {filteredData.length.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Words</div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {Math.round(filteredData.reduce((sum, item) => sum + item.frequency, 0) / filteredData.length).toLocaleString()}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Average Frequency</div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {filteredData[0]?.frequency.toLocaleString() || 0}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Highest Frequency</div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                {filteredData.reduce((sum, item) => sum + item.frequency, 0).toLocaleString()}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Occurrences</div>
            </div>
          </div>

          {/* Distribution Charts */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* POS Distribution */}
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
              <h4 className="font-semibold mb-3 text-gray-800 dark:text-gray-200">Distribution by Word Type</h4>
              <div className="space-y-2">
                {Object.entries(
                  filteredData.reduce((acc, item) => {
                    const pos = item.pos === 'verb' ? 'Verbs' : item.pos === 'noun' ? 'Nouns' : 'Unknown';
                    acc[pos] = (acc[pos] || 0) + 1;
                    return acc;
                  }, {} as Record<string, number>)
                ).map(([pos, count]) => (
                  <div key={pos} className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">{pos}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            pos === 'Verbs' ? 'bg-blue-500' :
                            pos === 'Nouns' ? 'bg-green-500' : 'bg-gray-500'
                          }`}
                          style={{ width: `${(count / filteredData.length) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium">{count}</span>
                    </div>
                  </div>
                ))}
        </div>
            </div>

            {/* Frequency Ranges */}
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
              <h4 className="font-semibold mb-3 text-gray-800 dark:text-gray-200">Frequency Distribution</h4>
              <div className="space-y-2">
                {[
                  { label: 'Low (1-10)', min: 1, max: 10 },
                  { label: 'Medium (11-100)', min: 11, max: 100 },
                  { label: 'High (101-1000)', min: 101, max: 1000 },
                  { label: 'Very High (1000+)', min: 1001, max: Infinity },
                ].map(range => {
                  const count = filteredData.filter(item => item.frequency >= range.min && item.frequency <= range.max).length;
                  return (
                    <div key={range.label} className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">{range.label}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className="h-2 bg-purple-500 rounded-full"
                            style={{ width: `${(count / filteredData.length) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium">{count}</span>
                      </div>
                </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Summary */}
      {filteredData.length > 0 && (
        <div className="mt-4 text-sm text-gray-600 dark:text-gray-400 text-center">
          Showing {filteredData.length} results from {frequencyData.length} words
        </div>
      )}
    </div>
  );
}









