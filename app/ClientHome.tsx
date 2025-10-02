"use client";

import { useEffect, useState, useMemo, useCallback, useRef, ChangeEvent } from "react";
import ResultsList from "../components/ResultsList";
import LexiconPanel from "../components/LexiconPanel";
import InlineFrequency from "../components/InlineFrequency";
import RelatedForms from "../components/RelatedForms";
import CoverageSidebar from "../components/CoverageSidebar";
import VariantDetailsPanel from "../components/VariantDetailsPanel";
import type { Verse, Scope, CoverageItem, AudioMap, PhraseResponse, RelatedFormsData, Conjugations, VariantGroupMeta, VariantDetailMeta } from "../types";
import { ComplexityLevel } from "../components/CoverageGrid";
import { TextField, Button, IconButton } from '@mui/material';
import { dedupByRef } from "../utils/highlight";

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

// Enhanced search controls component with all filters
function SearchControls({
  scope,
  setScope,
  includeRelated,
  setIncludeRelated,
  enableFuzzy,
  setEnableFuzzy,
  englishSearchMode,
  setEnglishSearchMode,
  bookFilter,
  setBookFilter,
  resultsCount,
  refreshAudioMap,
  isLoading
}: {
  scope: Scope;
  setScope: (scope: Scope) => void;
  includeRelated: boolean;
  setIncludeRelated: (include: boolean) => void;
  enableFuzzy: boolean;
  setEnableFuzzy: (enable: boolean) => void;
  englishSearchMode: boolean;
  setEnglishSearchMode: (enable: boolean) => void;
  bookFilter: string[];
  setBookFilter: (books: string[]) => void;
  resultsCount: number;
  refreshAudioMap: () => Promise<void>;
  isLoading: boolean;
}) {
  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Scope:
          </label>
          <select
            value={scope}
            onChange={(e) => setScope(e.target.value as Scope)}
            className="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Bible</option>
            <option value="ot">Old Testament</option>
            <option value="nt">New Testament</option>
          </select>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Mode:</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIncludeRelated(false)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                !includeRelated
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              Standard Search
            </button>
            <button
              onClick={() => setIncludeRelated(true)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                includeRelated
                  ? 'bg-green-500 text-white shadow-md'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              🔍 Related Forms Mode
            </button>
          </div>
        </div>

        {/* Show indicator when Related Forms Mode is active */}
        {includeRelated && (
          <div className="w-full px-3 py-2 bg-green-50 dark:bg-green-900/20 border border-green-300 dark:border-green-700 rounded-md">
            <p className="text-xs text-green-700 dark:text-green-300">
              ✅ Related Forms Mode Active - Search will include grammatical variants
            </p>
          </div>
        )}

        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Search:</span>
          <button
            onClick={() => setEnableFuzzy(false)}
            className={`px-2 py-1 text-xs font-medium rounded-md transition-colors ${
              !enableFuzzy
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            Exact
          </button>
          <button
            onClick={() => setEnableFuzzy(true)}
            className={`px-2 py-1 text-xs font-medium rounded-md transition-colors ${
              enableFuzzy
                ? 'bg-purple-500 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            Fuzzy
          </button>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Language:</span>
          <button
            onClick={() => setEnglishSearchMode(false)}
            className={`px-2 py-1 text-xs font-medium rounded-md transition-colors ${
              !englishSearchMode
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            Pashto
          </button>
          <button
            onClick={() => setEnglishSearchMode(true)}
            className={`px-2 py-1 text-xs font-medium rounded-md transition-colors ${
              englishSearchMode
                ? 'bg-orange-500 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
            title="Search in English - finds dictionary matches and searches Pashto equivalents"
          >
            🇬🇧 English
          </button>
        </div>

        <button
          onClick={refreshAudioMap}
          disabled={isLoading}
          className="px-3 py-1 text-xs bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded border disabled:opacity-50"
          title="Refresh audio URLs (get latest Supabase Storage URLs)"
        >
          🔄 Audio
        </button>

        <div className="text-sm text-gray-600 dark:text-gray-400 ml-auto">
          {resultsCount} results
        </div>
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
  const [includeRelated, setIncludeRelated] = useState<boolean>(true);
  const [enableFuzzy, setEnableFuzzy] = useState<boolean>(false);
  const [englishSearchMode, setEnglishSearchMode] = useState<boolean>(false);
  const [bookFilter, setBookFilter] = useState<string[]>([]);
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

  // Trigger search when verb filters change (real-time filtering)
  const previousVerbState = useRef(verbState);
  useEffect(() => {
    // Only trigger if verb state actually changed and we have related forms
    if (includeRelated && relatedForms && query.trim()) {
      const stateChanged = 
        previousVerbState.current.person !== verbPerson ||
        previousVerbState.current.tense !== verbTense ||
        previousVerbState.current.aspect !== verbAspect ||
        previousVerbState.current.mood !== verbMood;
      
      if (stateChanged) {
        console.log('🔄 Verb filter changed, triggering new search');
        handleSearch();
      }
    }
    previousVerbState.current = verbState;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [verbPerson, verbTense, verbAspect, verbMood]);

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
          const driveUrls = Object.values(audioMap).filter((url: unknown) => typeof url === 'string' && url.includes('drive.google.com')).length;
          const storageUrls = Object.values(audioMap).filter((url: unknown) => typeof url === 'string' && url.includes('supabase.co/storage')).length;

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
    // Only refresh if we have results but no audio map
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
  }, [results.length]); // Remove audioMap dependency to prevent excessive re-runs

  // Manual audio map refresh function
  const refreshAudioMap = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/get_audio_map?clear_cache=1');
      if (response.ok) {
        const data = await response.json();
        const newAudioMap = data || {};
        const driveUrls = Object.values(newAudioMap).filter((url: unknown) => typeof url === 'string' && url.includes('drive.google.com')).length;
        const storageUrls = Object.values(newAudioMap).filter((url: unknown) => typeof url === 'string' && url.includes('supabase.co/storage')).length;

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
  }, [setAudioMap, setIsLoading]);

  // Filter results by selected books
  const filteredResults = useMemo(() => {
    if (bookFilter.length === 0) return results;
    return results.filter(verse => {
      if (!verse.ref) return false;
      const book = verse.ref.split(' ')[0];
      // Handle multi-word book names like "1 Corinthians"
      const bookName = verse.ref.includes(' ') ? verse.ref.split(' ').slice(0, -1).join(' ') : book;
      return bookFilter.includes(bookName);
    });
  }, [results, bookFilter]);

  // Group ALL results by book for coverage calculation (always show full coverage)
  const fullCoverageData = useMemo(() => {
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

      const coverageItems = Object.entries(bookCounts).map(([book, count]) => ({
        book,
        count,
        translation: OT_BOOKS_SET.has(book) || NT_BOOKS_SET.has(book) ? 'KJV' : undefined
      }));

      console.log('Full coverage data calculated:', coverageItems);
      return coverageItems;
    } catch (err) {
      console.error('Error calculating coverage data:', err);
      return [];
    }
  }, [results]);

  // Always show full coverage (all books) but highlight the filtered one
  // This way users see "31 in Luke" even when filtered to Mark
  const coverageData = useMemo(() => {
    // Always show all books, regardless of filter
    return fullCoverageData;
  }, [fullCoverageData]);

  // Update coverage state when coverageData changes
  useEffect(() => {
    setCoverage(coverageData);
  }, [coverageData]);

  // Handle search
  const handleSearch = async () => {
    console.log('DEBUG: ========================================');
    console.log('DEBUG: FRONTEND SEARCH TRIGGERED');
    console.log('DEBUG: ========================================');
    console.log('DEBUG: Search parameters:', {
      query,
      scope,
      includeRelated,
      enableFuzzy,
      bookFilter
    });

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
      console.log('DEBUG: Starting enhanced search with filters and variants');

      // Use the enhanced search API with all filters
      const searchParams = {
        query: query.trim(),
        scope,
        includeRelated,
        enableFuzzy,
        englishSearchMode,
        bookFilter
      };

      const response = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(searchParams),
      });

      if (!response.ok) {
        throw new Error(`Search failed: ${response.status}`);
      }

      const searchData = await response.json();
      console.log('DEBUG: Search API returned:', {
        resultsCount: searchData.results?.length || 0,
        relatedFormsCount: searchData.relatedForms?.total || 0,
        processedVariants: searchData.processed?.variants?.length || 0,
        searchType: searchData.processed?.searchType || 'unknown',
        hasRelatedForms: !!searchData.relatedForms,
        relatedFormsData: searchData.relatedForms
      });

      setResults(searchData.results || []);
      setRelatedForms(searchData.relatedForms || null);
      setProcessed(searchData.processed || null);

      console.log(`DEBUG: Search completed. Found ${searchData.results?.length || 0} results.`);
    } catch (err) {
      console.error('Search error:', err);
      setError(err instanceof Error ? err.message : 'Search failed');
      setResults([]);
      setCoverage([]);
      setProcessed(null);
      setRelatedForms(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Trigger new search when Related Forms Mode is toggled (but only if we have a query)
  const previousIncludeRelated = useRef(includeRelated);
  useEffect(() => {
    // Only trigger if includeRelated actually changed (not on initial mount)
    if (previousIncludeRelated.current !== includeRelated && query.trim()) {
      console.log('DEBUG: Related Forms Mode toggled, triggering new search');
      handleSearch();
    }
    previousIncludeRelated.current = includeRelated;
    // NOTE: Intentionally NOT including results.length to prevent infinite loop!
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [includeRelated]);

  // Trigger new search when verb filters change (already implemented above)

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

      {/* Enhanced Search Controls */}
      <SearchControls
        scope={scope}
        setScope={setScope}
        includeRelated={includeRelated}
        setIncludeRelated={setIncludeRelated}
        enableFuzzy={enableFuzzy}
        setEnableFuzzy={setEnableFuzzy}
        englishSearchMode={englishSearchMode}
        setEnglishSearchMode={setEnglishSearchMode}
        bookFilter={bookFilter}
        setBookFilter={setBookFilter}
        resultsCount={resultsCount}
        refreshAudioMap={refreshAudioMap}
        isLoading={isLoading}
      />

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-200 rounded">
          {error}
        </div>
      )}

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Results with Inline Filtering */}
        <div className="lg:col-span-3">
          {/* Results Header */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow mb-4">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Results ({filteredResults.length}{results.length !== filteredResults.length ? ` of ${results.length}` : ''})
              </h2>
            </div>

            {/* Verb Form Filters (shown when Related Forms Mode is active and we have forms) */}
            {includeRelated && relatedForms && relatedForms.verbs && relatedForms.verbs.length > 0 && (
              <div className="p-4 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Filter by verb form:
                  </span>
                  <button
                    onClick={() => {
                      setVerbPerson('3rd');
                      setVerbTense('present');
                      setVerbAspect('imperfective');
                      setVerbMood('indicative');
                    }}
                    className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Reset filters
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  {/* Person Filter */}
                  <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                      Person:
                    </label>
                    <select
                      value={verbPerson}
                      onChange={(e) => setVerbPerson(e.target.value as '1st' | '2nd' | '3rd')}
                      className="w-full px-2 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="1st">1st (I/we)</option>
                      <option value="2nd">2nd (you)</option>
                      <option value="3rd">3rd (he/she/they)</option>
                    </select>
                  </div>

                  {/* Tense Filter */}
                  <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                      Tense:
                    </label>
                    <select
                      value={verbTense}
                      onChange={(e) => setVerbTense(e.target.value as any)}
                      className="w-full px-2 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
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

                  {/* Aspect Filter */}
                  <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                      Aspect:
                    </label>
                    <select
                      value={verbAspect}
                      onChange={(e) => setVerbAspect(e.target.value as 'imperfective' | 'perfective')}
                      className="w-full px-2 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="imperfective">Imperfective</option>
                      <option value="perfective">Perfective</option>
                    </select>
                  </div>

                  {/* Mood Filter */}
                  <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                      Mood:
                    </label>
                    <select
                      value={verbMood}
                      onChange={(e) => setVerbMood(e.target.value as any)}
                      className="w-full px-2 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="indicative">Indicative</option>
                      <option value="subjunctive">Subjunctive</option>
                      <option value="imperative">Imperative</option>
                      <option value="ability">Ability</option>
                    </select>
                  </div>
                </div>

                {/* Show which forms are being searched */}
                {relatedForms.verbs && relatedForms.verbs.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Searching with {relatedForms.verbs.length} verb forms
                      {relatedForms.verbs.slice(0, 5).map(v => (
                        <button
                          key={v.form}
                          onClick={() => handlePickForm(v.form)}
                          className="ml-2 px-2 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded text-xs hover:bg-blue-200 dark:hover:bg-blue-800"
                        >
                          {v.form} {v.count ? `(${v.count})` : ''}
                        </button>
                      ))}
                      {relatedForms.verbs.length > 5 && (
                        <span className="ml-2 text-gray-500">
                          +{relatedForms.verbs.length - 5} more
                        </span>
                      )}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Results List */}
          <ResultsList
            results={filteredResults}
            audioMap={audioMap}
            loading={isLoading}
            processed={processed}
          />
        </div>

        {/* Sidebar - Always show full coverage, not filtered */}
        <div className="lg:col-span-1">
          <CoverageSidebar
            coverage={coverage}
            scope={scope}
            coverageLevel={ComplexityLevel.Basic}
            onPickBook={(book: string) => {
              // Toggle book filter - if already selected, clear it, otherwise select it
              if (bookFilter.includes(book)) {
                setBookFilter(bookFilter.filter(b => b !== book));
              } else {
                setBookFilter([...bookFilter, book]);
              }
            }}
            selectedBook={bookFilter.length === 1 ? bookFilter[0] : null}
            resultsCount={results.length}
            filteredCount={bookFilter.length > 0 ? filteredResults.length : undefined}
          />
        </div>
      </div>
    </div>
  );
}
