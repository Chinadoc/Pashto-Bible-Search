"use client";

import { useEffect, useState, useMemo, ChangeEvent } from "react";
import ResultsList from "../components/ResultsList";
import LexiconPanel from "../components/LexiconPanel";
import InlineFrequency from "../components/InlineFrequency";
import RelatedForms from "../components/RelatedForms";
import CoverageSidebar from "../components/CoverageSidebar";
import Tabs from "../components/Tabs";
import LinguisticAnalysis from "../components/LinguisticAnalysis";
import VariantDetailsPanel from "../components/VariantDetailsPanel";
import type { Verse, Scope, CoverageItem, AudioMap, PhraseResponse, RelatedFormsData, Conjugations, VariantGroupMeta, VariantDetailMeta } from "../types";
import { ComplexityLevel } from "../components/CoverageGrid";
import { TextField, Button, IconButton } from '@mui/material';

// Book lists + abbreviations (match CoverageGrid)
const OT_BOOKS = [
  "Genesis","Exodus","Leviticus","Numbers","Deuteronomy","Joshua","Judges","Ruth","1 Samuel","2 Samuel","1 Kings","2 Kings","1 Chronicles","2 Chronicles","Ezra","Nehemiah","Esther","Job","Psalms","Proverbs","Ecclesiastes","Song of Solomon","Isaiah","Jeremiah","Lamentations","Ezekiel","Daniel","Hosea","Joel","Amos","Obadiah","Jonah","Micah","Nahum","Habakkuk","Zephaniah","Haggai","Zechariah","Malachi"
];
const NT_BOOKS = [
  "Matthew","Mark","Luke","John","Acts","Romans","1 Corinthians","2 Corinthians","Galatians","Ephesians","Philippians","Colossians","1 Thessalonians","2 Thessalonians","1 Timothy","2 Timothy","Titus","Philemon","Hebrews","James","1 Peter","2 Peter","1 John","2 John","3 John","Jude","Revelation"
];
// Abbreviations omitted (not used directly on this page)

const OT_BOOKS_SET = new Set(OT_BOOKS);
const NT_BOOKS_SET = new Set(NT_BOOKS);

function loadPersisted<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function savePersisted<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

// Search controls component
function SearchControls({ scope, setScope, includeRelated, setIncludeRelated, resultsCount }: {
  scope: Scope;
  setScope: (scope: Scope) => void;
  includeRelated: boolean;
  setIncludeRelated: (include: boolean) => void;
  resultsCount: number;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Scope:
        </label>
        <select
          value={scope}
          onChange={(e) => setScope(e.target.value as Scope)}
          className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Bible</option>
          <option value="ot">Old Testament</option>
          <option value="nt">New Testament</option>
        </select>
        <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
          <input
            type="checkbox"
            checked={includeRelated}
            onChange={(e) => setIncludeRelated(e.target.checked)}
            className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
          />
          Include Related Forms
        </label>
        <button
          onClick={refreshAudioMap}
          disabled={isLoading}
          className="px-3 py-1 text-xs bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded border disabled:opacity-50"
          title="Refresh audio URLs (get latest Supabase Storage URLs)"
        >
          🔄 Audio
        </button>
      </div>
      <div className="text-sm text-gray-600 dark:text-gray-400">
        {resultsCount} results
      </div>
    </div>
  );
}

// Verb understanding controls
function VerbUnderstandingControls({ verbState, setVerbState }: {
  verbState: { person: '1st' | '2nd' | '3rd'; tense: 'present' | 'past' | 'future' | 'perfect' | 'subjunctive' | 'imperative' | 'ability' | 'habitual'; aspect: 'imperfective' | 'perfective'; mood: 'indicative' | 'subjunctive' | 'imperative' | 'ability' };
  setVerbState: (state: any) => void;
}) {
  return (
    <div className="flex flex-wrap gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Person:
        </label>
        <select
          value={verbState.person}
          onChange={(e) => setVerbState({ ...verbState, person: e.target.value as '1st' | '2nd' | '3rd' })}
          className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="1st">1st Person</option>
          <option value="2nd">2nd Person</option>
          <option value="3rd">3rd Person</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Tense:
        </label>
        <select
          value={verbState.tense}
          onChange={(e) => setVerbState({ ...verbState, tense: e.target.value as any })}
          className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="present">Present</option>
          <option value="past">Past</option>
          <option value="future">Future</option>
          <option value="perfect">Perfect</option>
          <option value="subjunctive">Subjunctive</option>
          <option value="imperative">Imperative</option>
          <option value="ability">Ability</option>
          <option value="habitual">Habitual</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Aspect:
        </label>
        <select
          value={verbState.aspect}
          onChange={(e) => setVerbState({ ...verbState, aspect: e.target.value as 'imperfective' | 'perfective' })}
          className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="imperfective">Imperfective</option>
          <option value="perfective">Perfective</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Mood:
        </label>
        <select
          value={verbState.mood}
          onChange={(e) => setVerbState({ ...verbState, mood: e.target.value as any })}
          className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="indicative">Indicative</option>
          <option value="subjunctive">Subjunctive</option>
          <option value="imperative">Imperative</option>
          <option value="ability">Ability</option>
        </select>
      </div>
    </div>
  );
}

export default function ClientHome() {
  const [query, setQuery] = useState<string>('');
  const [results, setResults] = useState<Verse[]>([]);
  const [coverage, setCoverage] = useState<CoverageItem[]>([]);
  const [audioMap, setAudioMap] = useState<AudioMap>({});
  const [scope, setScope] = useState<Scope>('all');
  const [includeRelated, setIncludeRelated] = useState<boolean>(false);
  const [relatedForms, setRelatedForms] = useState<RelatedFormsData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [processed, setProcessed] = useState<{
    original: string;
    normalized: string;
    primaryVariant?: string;
    variants: string[];
    variantsSearched?: string[];
    variantDetails?: VariantDetailMeta[];
    variantGroups?: VariantGroupMeta[];
    romanization?: string;
  } | null>(null);

  // Verb understanding state
  const [verbPerson, setVerbPerson] = useState<'1st' | '2nd' | '3rd'>('3rd');
  const [verbTense, setVerbTense] = useState<'present' | 'past' | 'future' | 'perfect' | 'subjunctive' | 'imperative' | 'ability' | 'habitual'>('present');
  const [verbAspect, setVerbAspect] = useState<'imperfective' | 'perfective'>('imperfective');
  const [verbMood, setVerbMood] = useState<'indicative' | 'subjunctive' | 'imperative' | 'ability'>('indicative');

  const verbState = {
    person: verbPerson,
    tense: verbTense,
    aspect: verbAspect,
    mood: verbMood
  };

  // Persist state
  useEffect(() => {
    setScope(loadPersisted('scope', 'all'));
    setIncludeRelated(loadPersisted('includeRelated', false));
    setVerbPerson(loadPersisted('verbPerson', '3rd'));
    setVerbTense(loadPersisted('verbTense', 'present'));
    setVerbAspect(loadPersisted('verbAspect', 'imperfective'));
    setVerbMood(loadPersisted('verbMood', 'indicative'));
  }, []);

  useEffect(() => {
    savePersisted('scope', scope);
    savePersisted('includeRelated', includeRelated);
    savePersisted('verbPerson', verbPerson);
    savePersisted('verbTense', verbTense);
    savePersisted('verbAspect', verbAspect);
    savePersisted('verbMood', verbMood);
  }, [scope, includeRelated, verbPerson, verbTense, verbAspect, verbMood]);

  // Clear any problematic initial values on mount
  useEffect(() => {
    if (query === 'ldsoc') {
      setQuery('');
    }
  }, []);

  // Load audio map data
  useEffect(() => {
    const loadAudioMap = async () => {
      try {
        // Always force refresh to get latest URLs without Drive links
        const response = await fetch('/api/get_audio_map?clear_cache=1');
        if (response.ok) {
          const data = await response.json();
          const audioMap = data || {};
          const driveUrls = Object.values(audioMap).filter((url: string) => url.includes('drive.google.com')).length;
          const storageUrls = Object.values(audioMap).filter((url: string) => url.includes('supabase.co/storage')).length;

          console.log(`Audio map loaded: ${Object.keys(audioMap).length} entries (${storageUrls} Supabase, ${driveUrls} Drive)`);
          setAudioMap(audioMap);

          if (driveUrls > 0) {
            console.warn(`⚠️ Audio map contains ${driveUrls} Google Drive URLs - consider manual refresh`);
          }
        } else {
          console.warn('Audio map API returned error:', response.status, response.statusText);
          setAudioMap({});
        }
      } catch (error) {
        console.error('Failed to load audio map:', error);
        // Audio map is optional, so we can continue without it
        setAudioMap({});
      }
    };
    loadAudioMap();
  }, []);

  // Refresh audio map when results change to ensure we have latest URLs
  useEffect(() => {
    if (results.length > 0 && Object.keys(audioMap).length === 0) {
      const refreshAudioMap = async () => {
        try {
          const response = await fetch('/api/get_audio_map?clear_cache=1');
          if (response.ok) {
            const data = await response.json();
            const newAudioMap = data || {};
            console.log(`Refreshed audio map: ${Object.keys(newAudioMap).length} entries`);
            setAudioMap(newAudioMap);
          }
        } catch (error) {
          console.error('Failed to refresh audio map:', error);
        }
      };
      refreshAudioMap();
    }
  }, [results, audioMap]);

  // Manual audio map refresh function
  const refreshAudioMap = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/get_audio_map?clear_cache=1');
      if (response.ok) {
        const data = await response.json();
        const newAudioMap = data || {};
        const driveUrls = Object.values(newAudioMap).filter((url: string) => url.includes('drive.google.com')).length;
        const storageUrls = Object.values(newAudioMap).filter((url: string) => url.includes('supabase.co/storage')).length;

        console.log(`Audio map refreshed: ${Object.keys(newAudioMap).length} entries (${storageUrls} Supabase, ${driveUrls} Drive)`);
        setAudioMap(newAudioMap);

        if (driveUrls > 0) {
          alert(`Audio map refreshed with ${driveUrls} Google Drive URLs still present. Try refreshing again.`);
        } else {
          alert(`Audio map refreshed with ${storageUrls} Supabase Storage URLs!`);
        }
      } else {
        alert('Failed to refresh audio map');
      }
    } catch (error) {
      console.error('Failed to refresh audio map:', error);
      alert('Failed to refresh audio map');
    } finally {
      setIsLoading(false);
    }
  };

  // Group results by book for coverage calculation
  const coverageData = useMemo(() => {
    try {
      const bookCounts: Record<string, number> = {};
      results.forEach((verse) => {
        try {
          // Safely extract book name from ref
          if (!verse.ref || typeof verse.ref !== 'string') {
            console.warn('Skipping verse with invalid ref:', verse);
            return;
          }

          const parts = verse.ref.trim().split(' ');
          if (parts.length === 0) {
            console.warn('Skipping verse with empty ref:', verse);
            return;
          }

          // Handle multi-word book names like "1 Corinthians"
          const book = parts.length > 1 ? parts.slice(0, -1).join(' ') : parts[0];
          if (book) {
            bookCounts[book] = (bookCounts[book] || 0) + 1;
          }
        } catch (err) {
          console.warn('Error processing verse for coverage:', verse, err);
        }
      });

      return Object.entries(bookCounts).map(([book, count]) => ({
        book,
        count,
        translation: OT_BOOKS_SET.has(book) || NT_BOOKS_SET.has(book) ? 'KJV' : undefined
      }));
    } catch (err) {
      console.error('Error calculating coverage data:', err);
      return [];
    }
  }, [results]);

  // Handle search
  const handleSearch = async () => {
    console.log('DEBUG: ========================================');
    console.log('DEBUG: FRONTEND SEARCH TRIGGERED');
    console.log('DEBUG: ========================================');
    console.log('DEBUG: Search parameters:', { query, scope, includeRelated });

    if (!query.trim()) {
      console.log('DEBUG: Empty query, not searching');
      return;
    }

    setIsLoading(true);
    setError('');
    setResults([]);
    setCoverage([]);
    setProcessed(null);
    setRelatedForms(null);

    try {
      console.log('DEBUG: Making fetch request to /api/search_phrase');
      const response = await fetch('/api/search_phrase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: query.trim(),
          scope,
          includeRelated,
          limit: 100
        }),
      });

      console.log('DEBUG: Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.log('DEBUG: Search failed with status:', response.status, errorText);
        throw new Error(`Search failed: ${response.status}`);
      }

      let data: PhraseResponse;
      try {
        const responseText = await response.text();
        console.log('DEBUG: Raw response:', responseText);
        data = JSON.parse(responseText);
      } catch (parseErr) {
        console.error('Failed to parse search response:', parseErr);
        throw new Error('Invalid response format from search API');
      }

      // Safely handle the response data
      setResults(Array.isArray(data.results) ? data.results : []);
      setCoverage(Array.isArray(data.coverage) ? data.coverage : coverageData);
      setProcessed(data.processed && typeof data.processed === 'object' ? data.processed : null);

      if (includeRelated && data.relatedForms) {
        try {
          // Transform the related forms data to match our expected format
          const verbs = Array.isArray(data.relatedForms.verbs) ? data.relatedForms.verbs : undefined;
          const nouns = Array.isArray(data.relatedForms.nouns) ? data.relatedForms.nouns : undefined;
          const other = Array.isArray(data.relatedForms.other) ? data.relatedForms.other : undefined;

          const transformedForms: RelatedFormsData = {
            verbs,
            nouns,
            other,
            total: (verbs?.length || 0) + (nouns?.length || 0) + (other?.length || 0)
          };
          setRelatedForms(transformedForms);
        } catch (err) {
          console.error('Error processing related forms:', err);
          setRelatedForms(null);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handlePickForm = (form: string) => {
    setQuery(form);
  };

  // Calculate results count
  const resultsCount = results.length;

  // Determine default tab based on state
  const defaultTab = useMemo(() => {
    if (results.length > 0) return 'search'; // Search results
    if (relatedForms && relatedForms.total && relatedForms.total > 0) return 'analysis'; // Analysis
    return 'search';
  }, [results.length, relatedForms]);

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Header */}
      <header className="text-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Pashto Bible Search
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Search the Bible in Pashto with linguistic analysis
        </p>
      </header>

      {/* Search Bar */}
      <div className="relative z-10 mb-6">
        <TextField
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Enter Pashto text to search..."
          variant="outlined"
          fullWidth
          inputProps={{
            dir: 'rtl',
            style: { textAlign: 'right', padding: '12px 16px' }
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              backgroundColor: '#374151',
              borderColor: '#4B5563',
              color: '#F9FAFB',
              '&:hover': {
                borderColor: '#6B7280'
              },
              '&.Mui-focused': {
                borderColor: '#3B82F6',
                boxShadow: '0 0 0 2px rgba(59, 130, 246, 0.5)'
              }
            },
            '& .MuiInputBase-input::placeholder': {
              color: '#9CA3AF'
            }
          }}
          InputProps={{
            startAdornment: (
              <IconButton
                onClick={handleSearch}
                disabled={isLoading}
                sx={{
                  color: '#F9FAFB',
                  '&:disabled': { color: '#6B7280' }
                }}
              >
                🔍
              </IconButton>
            ),
            endAdornment: (
              <Button
                onClick={handleSearch}
                disabled={isLoading}
                variant="contained"
                sx={{
                  backgroundColor: '#3B82F6',
                  color: '#FFFFFF',
                  minWidth: '80px',
                  height: '100%',
                  '&:hover': {
                    backgroundColor: '#2563EB'
                  },
                  '&:disabled': {
                    backgroundColor: '#6B7280',
                    color: '#D1D5DB'
                  }
                }}
              >
                {isLoading ? 'Searching...' : 'Search'}
              </Button>
            )
          }}
        />
      </div>

      {/* Search Controls */}
      <SearchControls
        scope={scope}
        setScope={setScope}
        includeRelated={includeRelated}
        setIncludeRelated={setIncludeRelated}
        resultsCount={resultsCount}
      />

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-200 rounded">
          {error}
        </div>
      )}

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Results and Analysis */}
        <div className="lg:col-span-3">
          <Tabs
            defaultTab={defaultTab}
            tabs={[
              {
                id: 'search',
                label: `Results (${resultsCount})`,
                content: results.length > 0 ? (
                  <ResultsList
                    results={results}
                    audioMap={audioMap}
                    loading={isLoading}
                  />
                ) : (
                  <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                    {isLoading ? 'Searching...' : 'No results found. Try searching for a Pashto word.'}
                  </div>
                )
              },
              {
                id: 'analysis',
                label: 'Analysis',
                content: (
                  <div className="space-y-6">
                    {processed && (
                      <LinguisticAnalysis
                        word={processed.original}
                        onRelatedWordClick={handlePickForm}
                      />
                    )}

                    {includeRelated && relatedForms && typeof relatedForms.total === 'number' && relatedForms.total > 0 && (
                      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
                          Related Forms
                        </h3>
                        <RelatedForms
                          relatedForms={relatedForms}
                          onPick={handlePickForm}
                          verbState={verbState}
                          setVerbState={(state) => {
                            setVerbPerson(state.person);
                            setVerbTense(state.tense);
                            setVerbAspect(state.aspect);
                            setVerbMood(state.mood);
                          }}
                        />
                      </div>
                    )}
                  </div>
                )
              }
            ]}
          />
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <CoverageSidebar
            coverage={coverage}
            scope={scope}
            coverageLevel={ComplexityLevel.Basic}
            onPickBook={(book: string) => {
              // Handle book selection if needed
              console.log('Book selected:', book);
            }}
            selectedBook={null}
            resultsCount={resultsCount}
          />
        </div>
      </div>
    </div>
  );
}
