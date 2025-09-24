"use client";

import { useEffect, useState, useMemo, useCallback, ChangeEvent, useRef } from "react";
import ResultsList from "../components/ResultsList";
import LexiconPanel from "../components/LexiconPanel";
import InlineFrequency from "../components/InlineFrequency";
import RelatedForms from "../components/RelatedForms";
import { matchesVerb, normalizeLabel, type VerbFeatures } from "../utils/variants";
import CoverageSidebar from "../components/CoverageSidebar";
import Tabs from "../components/Tabs";
import LinguisticAnalysis from "../components/LinguisticAnalysis";
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

// Search controls component
function SearchControls({ scope, setScope, includeRelated, setIncludeRelated, resultsCount, refreshAudioMap, isLoading }: {
  scope: Scope;
  setScope: (scope: Scope) => void;
  includeRelated: boolean;
  setIncludeRelated: (include: boolean) => void;
  resultsCount: number;
  refreshAudioMap: () => Promise<void>;
  isLoading: boolean;
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
  const [activeTab, setActiveTab] = useState<string>('search');
  const [selectedBook, setSelectedBook] = useState<string | null>(null);
  const [showRelatedForms, setShowRelatedForms] = useState<boolean>(false);
  const [selectedMood, setSelectedMood] = useState<VerbFeatures['mood']>('all');
  const [selectedPerson, setSelectedPerson] = useState<'1'|'2'|'3'|'any'>('1');

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
    if (results.length > 0 && Object.keys(audioMap).length === 0) {
      const loadInitialAudioMap = async () => {
        try {
          const response = await fetch('/api/get_audio_map?clear_cache=1');
          if (response.ok) {
            const data = await response.json();
            const newAudioMap = data || {};
            console.log(`Initial audio map loaded: ${Object.keys(newAudioMap).length} entries`);
            setAudioMap(newAudioMap);
          }
        } catch (error) {
          console.error('Failed to load initial audio map:', error);
        }
      };
      loadInitialAudioMap();
    }
  }, [results, audioMap]);

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

  // Handle search using current state
  const handleSearchWithState = async () => {
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
      console.log('DEBUG: Starting direct database search for:', query.trim());

      // Perform the search using server-side API
      const searchResponse = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: query.trim(),
          scope,
          includeRelated
        }),
      });

      if (!searchResponse.ok) {
        throw new Error(`Search failed: ${searchResponse.statusText}`);
      }

      const searchData = await searchResponse.json();
      const transformedResults = searchData.results || [];
      console.log('DEBUG: Server search returned', transformedResults.length, 'results');

      console.log('DEBUG: Transformed results:', transformedResults.slice(0, 5));

      // Deduplicate results by ref to avoid duplicates from variant searches
      const dedupedResults = dedupByRef(transformedResults);
      console.log(`DEBUG: Deduplicated from ${transformedResults.length} to ${dedupedResults.length} results`);

      // Set the results directly (use deduplicated results)
      setResults(dedupedResults);
      setCoverage(Array.isArray(displayCoverageData) ? displayCoverageData : []);
      setProcessed(null);

      // Set related forms from server response
      if (includeRelated && query.trim() && searchData.relatedForms) {
        console.log('DEBUG: Setting related forms data:', searchData.relatedForms);
        setRelatedForms(searchData.relatedForms);
      } else {
        console.log('DEBUG: No related forms data received or includeRelated not checked');
        setRelatedForms(null);
      }

      console.log(`DEBUG: Search completed. Found ${dedupedResults.length} results.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed');
      setResults([]);
      setCoverage([]);
      setProcessed(null);
      setRelatedForms(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate results count
  const resultsCount = results.length;

  // Determine default tab based on state
  const getDefaultTab = () => {
    if (results.length > 0) return 'search';
    if (relatedForms) return 'related';
    return 'search';
  };

  // Get book name from ref for highlighting
  const getBookFromRef = (ref: string) => {
    if (!ref) return null;
    const parts = ref.split(' ');
    return parts.length > 0 ? parts[0] : null;
  };

  // Filter results by testament
  const filteredResults = useMemo(() => {
    if (scope === 'all') return results;
    return results.filter(r => {
      const book = getBookFromRef(r.ref);
      if (!book) return scope === 'nt'; // Default to NT if no book found

      const isOT = OT_BOOKS_SET.has(book);
      const isNT = NT_BOOKS_SET.has(book);

      if (scope === 'ot') return isOT;
      if (scope === 'nt') return isNT;
      return false;
    });
  }, [results, scope]);

  // Group results by book for coverage display
  const displayCoverageData = useMemo(() => {
    const coverageMap = new Map();
    results.forEach(verse => {
      const book = getBookFromRef(verse.ref);
      if (book) {
        coverageMap.set(book, (coverageMap.get(book) || 0) + 1);
      }
    });

    return Array.from(coverageMap.entries()).map(([book, count]) => ({
      book,
      count,
      translation: 'Yousafzai 2019',
      dialect: 'Yousafzai'
    }));
  }, [results]);

  // Manual audio map refresh function
  const manualRefreshAudioMap = async () => {
    try {
      const response = await fetch('/api/get_audio_map?clear_cache=1');
      if (response.ok) {
        const data = await response.json();
        const audioMap = data || {};
        const driveUrls = Object.values(audioMap).filter((url: unknown) => typeof url === 'string' && url.includes('drive.google.com')).length;
        const storageUrls = Object.values(audioMap).filter((url: unknown) => typeof url === 'string' && url.includes('supabase.co/storage')).length;

        console.log(`Audio map refreshed: ${Object.keys(audioMap).length} entries (${storageUrls} Supabase, ${driveUrls} Drive)`);
      }
    } catch (error) {
      console.error('Error refreshing audio map:', error);
    }
  };

  // Handle tab change
  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
  };

  // Handle book selection from coverage sidebar
  const handleBookSelect = (book: string | null) => {
    setSelectedBook(book);
  };

  // Handle search
  const handleSearch = async (query: string, scope: Scope, includeRelated: boolean) => {
    try {
      console.log('DEBUG: Starting direct database search for:', query.trim());

      // Perform the search using server-side API
      const searchResponse = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: query.trim(),
          scope,
          includeRelated
        }),
      });

      if (!searchResponse.ok) {
        throw new Error(`Search failed: ${searchResponse.statusText}`);
      }

      const searchData = await searchResponse.json();
      const transformedResults = searchData.results || [];
      console.log('DEBUG: Server search returned', transformedResults.length, 'results');

      console.log('DEBUG: Transformed results:', transformedResults.slice(0, 5));

      // Deduplicate results by ref to avoid duplicates from variant searches
      const dedupedResults = dedupByRef(transformedResults);
      console.log(`DEBUG: Deduplicated from ${transformedResults.length} to ${dedupedResults.length} results`);

      // Set the results directly (use deduplicated results)
      setResults(dedupedResults);
      setCoverage(Array.isArray(displayCoverageData) ? displayCoverageData : []);
      setProcessed(null);

      // Set related forms from server response
      if (includeRelated && query.trim() && searchData.relatedForms) {
        console.log('DEBUG: Setting related forms data:', searchData.relatedForms);
        setRelatedForms(searchData.relatedForms);
      } else {
        console.log('DEBUG: No related forms data received or includeRelated not checked');
        setRelatedForms(null);
      }

      console.log(`DEBUG: Search completed. Found ${dedupedResults.length} results.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed');
      setResults([]);
      setCoverage([]);
      setProcessed(null);
      setRelatedForms(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Get filtered verb variants based on current filter selections
  const filteredVerbVariants = useMemo(() => {
    if (!processed?.variantGroups) return [];

    // Find verb groups (groups with "verb" in the label)
    const verbGroups = processed.variantGroups.filter(group =>
      group.label?.toLowerCase().includes('verb')
    );

    if (verbGroups.length === 0) return [];

    // Combine all forms from verb groups
    const allVerbForms = verbGroups.flatMap(group => group.forms || []);

    // Filter verb forms based on selected mood and person
    let filteredForms = allVerbForms;

    // Filter by mood if selected
    if (selectedMood && selectedMood !== 'all') {
      filteredForms = filteredForms.filter(verbForm => {
        // Basic mood filtering based on form patterns
        const lowerForm = verbForm.toLowerCase();
        switch (selectedMood) {
          case 'present':
            return lowerForm.includes('م') || lowerForm.includes('و') || lowerForm.includes('ي') || lowerForm.includes('ې');
          case 'subjunctive':
            return lowerForm.includes('وو') || lowerForm.includes('ووه');
          case 'future':
            return lowerForm.includes('به ') || lowerForm.includes('به');
          case 'past':
            return lowerForm.includes('لم') || lowerForm.includes('لو') || lowerForm.includes('ل') || lowerForm.includes('له');
          case 'perfect':
            return lowerForm.includes('لی') || lowerForm.includes('کړی') || lowerForm.includes('شوی');
          case 'imperative':
            return lowerForm.includes('ه') && !lowerForm.includes(' ');
          case 'ability':
            return lowerForm.includes('ش') && (lowerForm.includes('م') || lowerForm.includes('و') || lowerForm.includes('ي'));
          case 'habitual':
            return lowerForm.includes('به ') && (lowerForm.includes('لم') || lowerForm.includes('لو'));
          default:
            return true;
        }
      });
    }

    // Filter by person if selected
    if (selectedPerson && selectedPerson !== 'any') {
      filteredForms = filteredForms.filter(verbForm => {
        const lowerForm = verbForm.toLowerCase();
        switch (selectedPerson) {
          case '1':
            return lowerForm.endsWith('م') || lowerForm.endsWith('و') || lowerForm.includes(' به ') && (lowerForm.includes('م') || lowerForm.includes('و'));
          case '2':
            return lowerForm.endsWith('ې') || lowerForm.endsWith('ئ') || lowerForm.includes(' به ') && (lowerForm.includes('ې') || lowerForm.includes('ئ'));
          case '3':
            return lowerForm.endsWith('ي') || lowerForm.includes(' به ') && lowerForm.includes('ي');
          default:
            return true;
        }
      });
    }

    return filteredForms.map(form => ({ form }));
  }, [processed, selectedMood, selectedPerson]);

  // Run filtered search with selected variants
  const runFilteredSearch = async (forms?: string[]) => {
    // If forms are provided (from RelatedForms), use those
    // Otherwise use the existing filteredVerbVariants (for auto-apply)
    const needles = forms || filteredVerbVariants.map(v => v.form).filter(Boolean);
    if (needles.length === 0) return;

    try {
      setIsLoading(true);
      setError('');

      const searchResponse = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: processed?.normalized || query,
          scope,
          variants: needles, // Pass filtered forms as OR search terms
        }),
      });

      if (!searchResponse.ok) {
        throw new Error(`Filtered search failed: ${searchResponse.statusText}`);
      }

      const searchData = await searchResponse.json();
      const transformedResults = searchData.results || [];

      // Deduplicate results
      const dedupedResults = dedupByRef(transformedResults);

      // Set the results with highlighting for all search terms
      setResults(dedupedResults);
      setProcessed(searchData.processed || null);

      console.log(`DEBUG: Filtered search completed. Found ${dedupedResults.length} results for ${needles.length} terms:`, needles);
      console.log('DEBUG: Processed data:', searchData.processed);
      console.log('DEBUG: First few results:', dedupedResults.slice(0, 3));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Filtered search failed');
    } finally {
      setIsLoading(false);
    }
  };

  // Clear form filter and return to original search
  const clearFormFilter = async () => {
    setProcessed(null);
    setRelatedForms(null);
    if (query.trim()) {
      await handleSearch(query, scope, includeRelated);
    }
  };

  // Auto-apply filter when verb state changes (debounced)
  useEffect(() => {
    if (!processed?.variantGroups || filteredVerbVariants.length === 0) {
      console.log('DEBUG: Auto-apply skipped - no processed data or no filtered variants');
      return;
    }

    console.log('DEBUG: Auto-applying filter with', filteredVerbVariants.length, 'terms:', filteredVerbVariants.map(v => v.form));

    const timeoutId = setTimeout(() => {
      console.log('DEBUG: Auto-apply timeout triggered');
      runFilteredSearch();
    }, 300); // Debounce for 300ms

    return () => clearTimeout(timeoutId);
  }, [selectedMood, selectedPerson, processed?.normalized]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearchWithState();
    }
  };

  const handlePickForm = (form: string) => {
    setQuery(form);
  };

  // Calculate results count
  const currentResultsCount = results.length;

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
                onClick={handleSearchWithState}
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
                onClick={handleSearchWithState}
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
        resultsCount={currentResultsCount}
        refreshAudioMap={manualRefreshAudioMap}
        isLoading={isLoading}
      />

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-200 rounded">
          {error}
        </div>
      )}

      {/* Related Forms Section */}
      {relatedForms && (relatedForms.total ?? 0) > 0 && (
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
              Related Forms
            </h3>
            <button
              onClick={() => setShowRelatedForms(!showRelatedForms)}
              className="px-3 py-1 text-sm bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 rounded hover:bg-blue-200 dark:hover:bg-blue-800"
            >
              {showRelatedForms ? 'Hide' : 'Show'} ({relatedForms.total})
            </button>
          </div>

          {showRelatedForms && (
            <RelatedForms
              relatedForms={relatedForms}
              onPick={(form) => {
                setQuery(form);
                setShowRelatedForms(false);
              }}
              onApplyFilter={runFilteredSearch}
              verbState={{
                person: verbPerson,
                tense: verbTense,
                aspect: verbAspect,
                mood: verbMood
              }}
              setVerbState={(state) => {
                setVerbPerson(state.person);
                setVerbTense(state.tense);
                setVerbAspect(state.aspect);
                setVerbMood(state.mood);
              }}
            />
          )}
        </div>
      )}

      {/* Form Filter Chips */}
      {processed?.variants && processed.variants.length > 1 && (
        <div className="mb-4">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-600 dark:text-gray-400">Filtering by {processed.variants.length} related forms</span>
            <button
              className="px-2 py-1 text-xs bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-300 rounded hover:bg-red-200 dark:hover:bg-red-800"
              onClick={clearFormFilter}
            >
              Clear filter
            </button>
          </div>
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
                    processed={processed}
                    terms={processed?.variants || [query]}
                    query={query}
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
            resultsCount={currentResultsCount}
          />
        </div>
      </div>
    </div>
  );
}
