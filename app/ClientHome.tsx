"use client";

import { useEffect, useState, useMemo, useCallback, useRef, ChangeEvent } from "react";
import ResultsList from "../components/ResultsList";
import LexiconPanel from "../components/LexiconPanel";
import InlineFrequency from "../components/InlineFrequency";
import CoverageSidebar from "../components/CoverageSidebar";
import VariantDetailsPanel from "../components/VariantDetailsPanel";
import type {
  Verse,
  Scope,
  CoverageItem,
  AudioMap,
  PhraseResponse,
  RelatedFormsData,
  RelatedFormVariant,
  Conjugations,
  VariantGroupMeta,
  VariantDetailMeta,
  VerbFilterState,
  VerbFilterPerson,
  VerbFilterTense,
  VerbFilterAspect,
  VerbFilterMood,
  NounFilterState,
  NounInflectionType,
  NounGender,
  AdjectiveFilterState,
  AdjectiveInflectionType,
  AdjectiveGender,
  SearchLanguage,
} from "../types";
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

const DEFAULT_VERB_FILTER: VerbFilterState = {
  person: 'all',
  tense: 'all',
  aspect: 'all',
  mood: 'all',
};

const DEFAULT_NOUN_FILTER: NounFilterState = {
  inflectionType: 'all',
  gender: 'all',
};

const DEFAULT_ADJECTIVE_FILTER: AdjectiveFilterState = {
  inflectionType: 'all',
  gender: 'all',
};

const PERSON_VALUES: VerbFilterPerson[] = ['all', '1st', '2nd', '3rd'];
const TENSE_VALUES: VerbFilterTense[] = ['all', 'present', 'past', 'future', 'perfect', 'subjunctive', 'imperative', 'ability', 'habitual'];
const ASPECT_VALUES: VerbFilterAspect[] = ['all', 'imperfective', 'perfective'];
const MOOD_VALUES: VerbFilterMood[] = ['all', 'indicative', 'subjunctive', 'imperative', 'ability'];

const NOUN_INFLECTION_VALUES: NounInflectionType[] = ['all', 'plain', '1st', '2nd', 'plural', 'vocative', 'bundled'];
const GENDER_VALUES: NounGender[] = ['all', 'masculine', 'feminine'];

function sanitizeVerbFilter(candidate: any): VerbFilterState {
  if (!candidate || typeof candidate !== 'object') {
    return { ...DEFAULT_VERB_FILTER };
  }

  const person = PERSON_VALUES.includes(candidate.person) ? candidate.person : 'all';
  const tense = TENSE_VALUES.includes(candidate.tense) ? candidate.tense : 'all';
  const aspect = ASPECT_VALUES.includes(candidate.aspect) ? candidate.aspect : 'all';
  const mood = MOOD_VALUES.includes(candidate.mood) ? candidate.mood : 'all';

  return { person, tense, aspect, mood } as VerbFilterState;
}

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

const PERSON_PATTERNS: Record<VerbFilterPerson, string[]> = {
  all: [],
  '1st': ['1sg', '1 pl', '1pl'],
  '2nd': ['2sg', '2 pl', '2pl'],
  '3rd': ['3sg', '3 pl', '3pl'],
};

const TENSE_MATCHERS: Record<VerbFilterTense, (label: string) => boolean> = {
  all: () => true,
  present: (l) => l.includes('present'),
  past: (l) => l.includes('past') && !l.includes('participle') && !l.includes('perfect'),
  future: (l) => l.includes('future'),
  perfect: (l) => l.includes('perfect') || l.includes('participle'),
  subjunctive: (l) => l.includes('subj'),
  imperative: (l) => l.includes('imperativ'),
  ability: (l) => l.includes('ability') || l.includes('able') || l.includes('can'),
  habitual: (l) => l.includes('habit'),
};

const MOOD_MATCHERS: Record<VerbFilterMood, (label: string) => boolean> = {
  all: () => true,
  indicative: (l) => !l.includes('subj') && !l.includes('imperativ'),
  subjunctive: (l) => l.includes('subj'),
  imperative: (l) => l.includes('imperativ'),
  ability: (l) => l.includes('ability') || l.includes('able') || l.includes('can'),
};

const ASPECT_MATCHERS: Record<VerbFilterAspect, (label: string) => boolean> = {
  all: () => true,
  imperfective: (l) =>
    l.includes('present') ||
    l.includes('future') ||
    l.includes('progressive') ||
    l.includes('habit') ||
    l.includes('subj') ||
    l.includes('ability'),
  perfective: (l) => l.includes('past') || l.includes('perfect') || l.includes('participle') || l.includes('subj'),
};

function normalizeLabel(label?: string): string {
  return (label || '').toLowerCase();
}

function matchesPerson(label: string, person: VerbFilterPerson): boolean {
  if (person === 'all') return true;
  const patterns = PERSON_PATTERNS[person];
  if (!patterns?.length) return true;
  return patterns.some((pattern) => label.includes(pattern));
}

function matchesTense(label: string, tense: VerbFilterTense): boolean {
  const matcher = TENSE_MATCHERS[tense];
  return matcher ? matcher(label) : true;
}

function matchesMood(label: string, mood: VerbFilterMood): boolean {
  const matcher = MOOD_MATCHERS[mood];
  return matcher ? matcher(label) : true;
}

function matchesAspect(label: string, aspect: VerbFilterAspect): boolean {
  const matcher = ASPECT_MATCHERS[aspect];
  return matcher ? matcher(label) : true;
}

function filterVerbVariants(
  verbs: RelatedFormVariant[] | undefined,
  filters: VerbFilterState
): RelatedFormVariant[] {
  if (!verbs?.length) return [];
  const labelFilter = (variant: RelatedFormVariant) => {
    const label = normalizeLabel(variant.label);
    return (
      matchesPerson(label, filters.person) &&
      matchesTense(label, filters.tense) &&
      matchesMood(label, filters.mood) &&
      matchesAspect(label, filters.aspect)
    );
  };

  const filtered = verbs.filter(labelFilter);
  return filtered.length > 0 ? filtered : verbs;
}

function formsFromVariants(variants: RelatedFormVariant[]): string[] {
  const seen = new Set<string>();
  const forms: string[] = [];
  for (const variant of variants) {
    if (!variant.form) continue;
    if (!seen.has(variant.form)) {
      seen.add(variant.form);
      forms.push(variant.form);
    }
  }
  return forms;
}

function isDefaultVerbFilter(filters: VerbFilterState): boolean {
  return (
    filters.person === 'all' &&
    filters.tense === 'all' &&
    filters.aspect === 'all' &&
    filters.mood === 'all'
  );
}

// Noun/Adjective filter matching
function matchesNounInflectionType(label: string, inflectionType: NounInflectionType): boolean {
  if (inflectionType === 'all') return true;
  const lower = label.toLowerCase();
  
  if (inflectionType === 'plain') return lower.includes('plain');
  if (inflectionType === '1st') return lower.includes('1st');
  if (inflectionType === '2nd') return lower.includes('2nd');
  if (inflectionType === 'plural') return lower.includes('plural') || lower.includes('plur');
  if (inflectionType === 'vocative') return lower.includes('voc');
  if (inflectionType === 'bundled') return lower.includes('bundled');
  
  return true;
}

function matchesGender(label: string, gender: NounGender): boolean {
  if (gender === 'all') return true;
  const lower = label.toLowerCase();
  
  if (gender === 'masculine') return lower.includes('masc') || lower.includes('m.');
  if (gender === 'feminine') return lower.includes('fem') || lower.includes('f.');
  
  return true;
}

function filterNounVariants(
  nouns: RelatedFormVariant[] | undefined,
  filters: NounFilterState
): RelatedFormVariant[] {
  if (!nouns?.length) return [];
  
  const filtered = nouns.filter((variant) => {
    const label = normalizeLabel(variant.label);
    return (
      matchesNounInflectionType(label, filters.inflectionType) &&
      matchesGender(label, filters.gender)
    );
  });
  
  return filtered.length > 0 ? filtered : nouns;
}

function filterAdjectiveVariants(
  adjectives: RelatedFormVariant[] | undefined,
  filters: AdjectiveFilterState
): RelatedFormVariant[] {
  if (!adjectives?.length) return [];
  
  const filtered = adjectives.filter((variant) => {
    const label = normalizeLabel(variant.label);
    return (
      matchesNounInflectionType(label, filters.inflectionType) &&
      matchesGender(label, filters.gender)
    );
  });
  
  return filtered.length > 0 ? filtered : adjectives;
}

function isDefaultNounFilter(filters: NounFilterState): boolean {
  return filters.inflectionType === 'all' && filters.gender === 'all';
}

function isDefaultAdjectiveFilter(filters: AdjectiveFilterState): boolean {
  return filters.inflectionType === 'all' && filters.gender === 'all';
}

// Enhanced search controls component with all filters
function SearchControls({
  scope,
  setScope,
  includeRelated,
  setIncludeRelated,
  enableFuzzy,
  setEnableFuzzy,
  searchLanguage,
  setSearchLanguage,
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
  searchLanguage: SearchLanguage;
  setSearchLanguage: (language: SearchLanguage) => void;
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
            onClick={() => setSearchLanguage('pashto')}
            className={`px-2 py-1 text-xs font-medium rounded-md transition-colors ${
              searchLanguage === 'pashto'
                ? 'bg-sky-500 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
            title="Search directly in Pashto"
          >
            🕌 Pashto
          </button>
          <button
            onClick={() => setSearchLanguage('english')}
            className={`px-2 py-1 text-xs font-medium rounded-md transition-colors ${
              searchLanguage === 'english'
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
    language?: SearchLanguage;
    englishMatches?: Array<{ english: string; pashto: string; romanized?: string; pos?: string }>;
  } | null>(null);

  // Verb understanding state
  const [verbFilters, setVerbFilters] = useState<VerbFilterState>({ ...DEFAULT_VERB_FILTER });
  const [nounFilters, setNounFilters] = useState<NounFilterState>({ ...DEFAULT_NOUN_FILTER });
  const [adjectiveFilters, setAdjectiveFilters] = useState<AdjectiveFilterState>({ ...DEFAULT_ADJECTIVE_FILTER });
  const [variantsOverride, setVariantsOverride] = useState<string[] | null>(null);
  const [activeVariantForms, setActiveVariantForms] = useState<string[]>([]);
  const [searchLanguage, setSearchLanguage] = useState<SearchLanguage>('pashto');
  const variantKeyRef = useRef<string>('');

  // Trigger search when verb filters change (real-time filtering)
  const previousVerbState = useRef<VerbFilterState>(verbFilters);

  // useEffect to trigger search when verb filters change
  useEffect(() => {
    // Only trigger if verb state actually changed and we have related forms
    if (includeRelated && relatedForms && query.trim()) {
      const stateChanged =
        previousVerbState.current.person !== verbFilters.person ||
        previousVerbState.current.tense !== verbFilters.tense ||
        previousVerbState.current.aspect !== verbFilters.aspect ||
        previousVerbState.current.mood !== verbFilters.mood;

      if (stateChanged) {
        console.log('🔄 Verb filter changed, triggering new search');
        handleSearch();
      }
    }
    previousVerbState.current = verbFilters;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [verbFilters.person, verbFilters.tense, verbFilters.aspect, verbFilters.mood]);

  // useEffect to trigger search when noun filters change
  useEffect(() => {
    if (includeRelated && relatedForms && query.trim()) {
      const stateChanged =
        nounFilters.inflectionType !== 'all' || nounFilters.gender !== 'all';

      if (stateChanged) {
        console.log('🔄 Noun filter changed, triggering new search');
        handleSearch();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nounFilters.inflectionType, nounFilters.gender]);

  // useEffect to trigger search when adjective filters change
  useEffect(() => {
    if (includeRelated && relatedForms && query.trim()) {
      const stateChanged =
        adjectiveFilters.inflectionType !== 'all' || adjectiveFilters.gender !== 'all';

      if (stateChanged) {
        console.log('🔄 Adjective filter changed, triggering new search');
        handleSearch();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [adjectiveFilters.inflectionType, adjectiveFilters.gender]);

  // Load persisted preferences on mount
  useEffect(() => {
    setScope(loadPersisted('scope', 'all'));
    setIncludeRelated(loadPersisted('includeRelated', false));
    const savedFilters = sanitizeVerbFilter(loadPersisted('verbFilters', DEFAULT_VERB_FILTER));
    setVerbFilters(savedFilters);
    setNounFilters(loadPersisted('nounFilters', DEFAULT_NOUN_FILTER));
    setAdjectiveFilters(loadPersisted('adjectiveFilters', DEFAULT_ADJECTIVE_FILTER));
    const savedLanguage = loadPersisted<SearchLanguage>('searchLanguage', 'pashto');
    setSearchLanguage(savedLanguage === 'english' ? 'english' : 'pashto');
  }, []);

  // Persist preferences when they change
  useEffect(() => {
    savePersisted('scope', scope);
    savePersisted('includeRelated', includeRelated);
    savePersisted('verbFilters', verbFilters);
    savePersisted('nounFilters', nounFilters);
    savePersisted('adjectiveFilters', adjectiveFilters);
    savePersisted('searchLanguage', searchLanguage);
  }, [scope, includeRelated, verbFilters, nounFilters, adjectiveFilters, searchLanguage]);


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

  const executeSearch = useCallback(async (
    opts: {
      overrideVariants?: string[] | null;
      languageOverride?: SearchLanguage;
      preserveResults?: boolean;
      reason?: string;
    } = {}
  ) => {
    const normalizedQuery = query.trim();
    if (!normalizedQuery) {
      console.log('DEBUG: Empty query, not searching');
      return;
    }

    const {
      overrideVariants,
      languageOverride,
      preserveResults = false,
      reason = 'manual',
    } = opts;

    const effectiveVariants =
      overrideVariants !== undefined ? overrideVariants : variantsOverride;
    const variantsPayload = Array.isArray(effectiveVariants) && effectiveVariants.length > 0
      ? effectiveVariants
      : undefined;

    console.log('DEBUG: ========================================');
    console.log('DEBUG: FRONTEND SEARCH TRIGGERED');
    console.log('DEBUG: Reason:', reason);
    console.log('DEBUG: ========================================');
    console.log('DEBUG: Search parameters:', {
      query: normalizedQuery,
      scope,
      includeRelated,
      enableFuzzy,
      bookFilter,
      language: languageOverride ?? searchLanguage,
      variants: variantsPayload,
    });

    setIsLoading(true);
    setError('');
    if (!preserveResults) {
      setResults([]);
      setCoverage([]);
      setRelatedForms(null);
    }
    setProcessed(null);

    try {
      const searchParams: any = {
        query: normalizedQuery,
        scope,
        includeRelated,
        enableFuzzy,
        bookFilter,
        language: languageOverride ?? searchLanguage,
      };

      if (variantsPayload) {
        searchParams.variants = variantsPayload;
      }

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
        variantsSearched: searchData.processed?.variantsSearched || [],
        searchType: searchData.processed?.searchType || 'unknown',
        hasRelatedForms: !!searchData.relatedForms,
      });

      setResults(searchData.results || []);
      setRelatedForms(searchData.relatedForms || null);
      setProcessed(searchData.processed || null);

      const processedVariants: string[] = searchData.processed?.variantsSearched
        || searchData.processed?.variants
        || variantsPayload
        || [];

      setActiveVariantForms(processedVariants);
      setVariantsOverride(variantsPayload ?? null);
      variantKeyRef.current = processedVariants.length ? processedVariants.join('|') : '__all__';

      console.log(`DEBUG: Search completed. Found ${searchData.results?.length || 0} results.`);
    } catch (err) {
      console.error('Search error:', err);
      setError(err instanceof Error ? err.message : 'Search failed');
      if (!preserveResults) {
        setResults([]);
        setCoverage([]);
        setRelatedForms(null);
      }
      setProcessed(null);
    } finally {
      setIsLoading(false);
    }
  }, [bookFilter, enableFuzzy, includeRelated, query, scope, searchLanguage, variantsOverride]);

  const handleSearch = useCallback(
    (opts?: { preserveResults?: boolean }) => executeSearch({ ...opts, reason: 'manual' }),
    [executeSearch]
  );

  const applyVerbFiltersAndSearch = useCallback((nextFilters: VerbFilterState) => {
    const sanitized = sanitizeVerbFilter(nextFilters);
    setVerbFilters(sanitized);

    if (!includeRelated || !relatedForms?.verbs?.length) {
      console.log('Verb filters updated, awaiting related forms to refetch results');
      return;
    }

    if (isDefaultVerbFilter(sanitized)) {
      variantKeyRef.current = '__all__';
      const allForms = formsFromVariants(relatedForms.verbs || []);
      setVariantsOverride(null);
      setActiveVariantForms(allForms);
      executeSearch({ overrideVariants: null, preserveResults: true, reason: 'verb-filter-reset' });
      return;
    }

    const filteredVariants = filterVerbVariants(relatedForms.verbs, sanitized);
    const forms = formsFromVariants(filteredVariants);
    const key = forms.join('|');

    if (key === variantKeyRef.current) {
      return; // no change in concrete forms
    }

    variantKeyRef.current = key;
    setVariantsOverride(forms);
    setActiveVariantForms(forms);
    executeSearch({ overrideVariants: forms, preserveResults: true, reason: 'verb-filter' });
  }, [includeRelated, relatedForms, executeSearch]);

  const applyNounFiltersAndSearch = useCallback((nextFilters: NounFilterState) => {
    setNounFilters(nextFilters);

    if (!includeRelated || !relatedForms?.nouns?.length) {
      console.log('Noun filters updated, awaiting related forms to refetch results');
      return;
    }

    if (isDefaultNounFilter(nextFilters)) {
      variantKeyRef.current = '__all__';
      const allForms = formsFromVariants(relatedForms.nouns || []);
      setVariantsOverride(null);
      setActiveVariantForms(allForms);
      executeSearch({ overrideVariants: null, preserveResults: true, reason: 'noun-filter-reset' });
      return;
    }

    const filteredVariants = filterNounVariants(relatedForms.nouns, nextFilters);
    const forms = formsFromVariants(filteredVariants);
    const key = forms.join('|');

    if (key === variantKeyRef.current) {
      return;
    }

    variantKeyRef.current = key;
    setVariantsOverride(forms);
    setActiveVariantForms(forms);
    executeSearch({ overrideVariants: forms, preserveResults: true, reason: 'noun-filter' });
  }, [includeRelated, relatedForms, executeSearch]);

  const applyAdjectiveFiltersAndSearch = useCallback((nextFilters: AdjectiveFilterState) => {
    setAdjectiveFilters(nextFilters);

    if (!includeRelated || !relatedForms?.other?.length) {
      console.log('Adjective filters updated, awaiting related forms to refetch results');
      return;
    }

    if (isDefaultAdjectiveFilter(nextFilters)) {
      variantKeyRef.current = '__all__';
      const allForms = formsFromVariants(relatedForms.other || []);
      setVariantsOverride(null);
      setActiveVariantForms(allForms);
      executeSearch({ overrideVariants: null, preserveResults: true, reason: 'adjective-filter-reset' });
      return;
    }

    const filteredVariants = filterAdjectiveVariants(relatedForms.other, nextFilters);
    const forms = formsFromVariants(filteredVariants);
    const key = forms.join('|');

    if (key === variantKeyRef.current) {
      return;
    }

    variantKeyRef.current = key;
    setVariantsOverride(forms);
    setActiveVariantForms(forms);
    executeSearch({ overrideVariants: forms, preserveResults: true, reason: 'adjective-filter' });
  }, [includeRelated, relatedForms, executeSearch]);

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

  // Re-run search automatically when language switches (if query present)
  const previousLanguage = useRef<SearchLanguage>(searchLanguage);
  useEffect(() => {
    if (previousLanguage.current !== searchLanguage && query.trim()) {
      console.log('DEBUG: Search language changed to', searchLanguage, '- refreshing results');
      setVerbFilters({ ...DEFAULT_VERB_FILTER });
      variantKeyRef.current = ''; // reset variant key to avoid stale matches
      setVariantsOverride(null);
      setActiveVariantForms([]);
      executeSearch({ overrideVariants: null, preserveResults: false, reason: 'language-toggle' });
    }
    previousLanguage.current = searchLanguage;
  }, [searchLanguage, query, executeSearch]);

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

  const isEnglishMode = searchLanguage === 'english';

  return (
    <div className={`w-full max-w-6xl mx-auto transition-colors duration-300 ${isEnglishMode ? 'bg-gradient-to-b from-orange-50 to-transparent dark:from-orange-950' : ''}`}>
      {/* English Mode Banner */}
      {isEnglishMode && (
        <div className="mb-4 p-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg shadow-lg border-2 border-orange-600">
          <div className="flex items-center justify-center gap-3">
            <span className="text-2xl">🇬🇧</span>
            <div className="text-center">
              <p className="font-bold text-lg">English Search Mode Active</p>
              <p className="text-sm opacity-90">Searching dictionary for English → Pashto matches</p>
            </div>
            <span className="text-2xl">🇬🇧</span>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="text-center mb-6">
        <h1 className={`text-3xl font-bold mb-2 transition-colors ${isEnglishMode ? 'text-orange-700 dark:text-orange-300' : 'text-gray-900 dark:text-gray-100'}`}>
          Pashto Bible Search
        </h1>
        <p className={`transition-colors ${isEnglishMode ? 'text-orange-600 dark:text-orange-400' : 'text-gray-600 dark:text-gray-400'}`}>
          {isEnglishMode ? 'Searching in English - Finding Pashto translations' : 'Search the Bible in Pashto with linguistic analysis'}
        </p>
      </header>

      {/* Search Bar */}
      <div className="relative z-10 mb-6">
        <TextField
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={isEnglishMode ? "Enter English word (e.g., 'baptize', 'love', 'peace')..." : "Enter Pashto text to search..."}
          variant="outlined"
          fullWidth
          inputProps={{
            dir: isEnglishMode ? 'ltr' : 'rtl',
            style: { textAlign: isEnglishMode ? 'left' : 'right', padding: '12px 16px' }
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              backgroundColor: isEnglishMode ? '#FFF7ED' : '#374151',
              borderColor: isEnglishMode ? '#F97316' : '#4B5563',
              color: isEnglishMode ? '#9A3412' : '#F9FAFB',
              '&:hover': {
                borderColor: isEnglishMode ? '#EA580C' : '#6B7280'
              },
              '&.Mui-focused': {
                borderColor: isEnglishMode ? '#F97316' : '#3B82F6',
                boxShadow: isEnglishMode ? '0 0 0 2px rgba(249, 115, 22, 0.3)' : '0 0 0 2px rgba(59, 130, 246, 0.5)'
              }
            },
            '& .MuiInputBase-input::placeholder': {
              color: isEnglishMode ? '#C2410C' : '#9CA3AF'
            }
          }}
          InputProps={{
            startAdornment: (
              <IconButton
                onClick={() => handleSearch()}
                disabled={isLoading}
                sx={{
                  color: isEnglishMode ? '#9A3412' : '#F9FAFB',
                  '&:disabled': { color: '#6B7280' }
                }}
              >
                {isEnglishMode ? '🇬🇧' : '🔍'}
              </IconButton>
            ),
            endAdornment: (
              <Button
                onClick={() => handleSearch()}
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
        searchLanguage={searchLanguage}
        setSearchLanguage={setSearchLanguage}
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

            {processed?.language === 'english' && processed?.englishMatches && processed.englishMatches.length > 0 && (
              <div className="px-4 py-3 bg-orange-50 dark:bg-orange-900/20 border-b border-orange-200 dark:border-orange-700">
                <p className="text-xs text-orange-700 dark:text-orange-300 font-medium mb-1">
                  Dictionary matches for "{processed.original}":
                </p>
                <div className="flex flex-wrap gap-2 text-xs">
                  {processed.englishMatches.slice(0, 4).map((match, idx) => (
                    <span
                      key={`${match.pashto}-${idx}`}
                      className="px-2 py-1 rounded-full bg-orange-500/10 text-orange-700 dark:text-orange-200 border border-orange-300/50"
                    >
                      {match.pashto}
                      {match.romanized ? ` · ${match.romanized}` : ''}
                    </span>
                  ))}
                  {processed.englishMatches.length > 4 && (
                    <span className="text-orange-600 dark:text-orange-300">+{processed.englishMatches.length - 4} more</span>
                  )}
                </div>
              </div>
            )}

            {/* Form Filters (shown when Related Forms Mode is active) */}
            {/* Conditionally show VERB, NOUN, or ADJECTIVE filters based on posGuess */}
            {includeRelated && relatedForms && (
              <>
                {/* VERB FILTERS */}
                {(relatedForms.posGuess === 'verb' || (!relatedForms.posGuess && relatedForms.verbs && relatedForms.verbs.length > 0)) && (
                  <div className="p-4 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Filter by verb form:
                      </span>
                      <button
                        onClick={() => applyVerbFiltersAndSearch({ ...DEFAULT_VERB_FILTER })}
                        className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        Reset filters
                      </button>
                    </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {/* Person Filter */}
                  <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
                      Person:
                    </label>
                    <div className="space-y-1">
                      <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 px-2 py-1 rounded">
                        <input
                          type="radio"
                          name="person"
                          checked={verbFilters.person === 'all'}
                          onChange={() => {
                            if (verbFilters.person !== 'all') {
                              applyVerbFiltersAndSearch({ ...verbFilters, person: 'all' });
                            }
                          }}
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                        />
                        <span className="font-medium">All</span>
                      </label>
                      {[{ value: '1st', label: '1st (I/we)' }, { value: '2nd', label: '2nd (you)' }, { value: '3rd', label: '3rd (he/she/they)' }].map((option) => (
                        <label key={option.value} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 px-2 py-1 rounded">
                          <input
                            type="radio"
                            name="person"
                            checked={verbFilters.person === option.value}
                            onChange={() => {
                              if (verbFilters.person !== option.value) {
                                applyVerbFiltersAndSearch({ ...verbFilters, person: option.value as VerbFilterPerson });
                              }
                            }}
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                          />
                          <span>{option.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Tense Filter */}
                  <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
                      Tense:
                    </label>
                    <div className="space-y-1 max-h-48 overflow-y-auto">
                      <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 px-2 py-1 rounded">
                        <input
                          type="radio"
                          name="tense"
                          checked={verbFilters.tense === 'all'}
                          onChange={() => {
                            if (verbFilters.tense !== 'all') {
                              applyVerbFiltersAndSearch({ ...verbFilters, tense: 'all' });
                            }
                          }}
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                        />
                        <span className="font-medium">All</span>
                      </label>
                      {['present', 'past', 'future', 'perfect', 'subjunctive', 'imperative', 'ability', 'habitual'].map((tense) => (
                        <label key={tense} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 px-2 py-1 rounded">
                          <input
                            type="radio"
                            name="tense"
                            checked={verbFilters.tense === tense}
                            onChange={() => {
                              if (verbFilters.tense !== tense) {
                                applyVerbFiltersAndSearch({ ...verbFilters, tense: tense as VerbFilterTense });
                              }
                            }}
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                          />
                          <span className="capitalize">{tense}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Aspect Filter */}
                  <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
                      Aspect:
                    </label>
                    <div className="space-y-1">
                      <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 px-2 py-1 rounded">
                        <input
                          type="radio"
                          name="aspect"
                          checked={verbFilters.aspect === 'all'}
                          onChange={() => {
                            if (verbFilters.aspect !== 'all') {
                              applyVerbFiltersAndSearch({ ...verbFilters, aspect: 'all' });
                            }
                          }}
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                        />
                        <span className="font-medium">All</span>
                      </label>
                      {['imperfective', 'perfective'].map((aspect) => (
                        <label key={aspect} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 px-2 py-1 rounded">
                          <input
                            type="radio"
                            name="aspect"
                            checked={verbFilters.aspect === aspect}
                            onChange={() => {
                              if (verbFilters.aspect !== aspect) {
                                applyVerbFiltersAndSearch({ ...verbFilters, aspect: aspect as VerbFilterAspect });
                              }
                            }}
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                          />
                          <span className="capitalize">{aspect}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Mood Filter */}
                  <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
                      Mood:
                    </label>
                    <div className="space-y-1">
                      <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 px-2 py-1 rounded">
                        <input
                          type="radio"
                          name="mood"
                          checked={verbFilters.mood === 'all'}
                          onChange={() => {
                            if (verbFilters.mood !== 'all') {
                              applyVerbFiltersAndSearch({ ...verbFilters, mood: 'all' });
                            }
                          }}
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                        />
                        <span className="font-medium">All</span>
                      </label>
                      {['indicative', 'subjunctive', 'imperative', 'ability'].map((mood) => (
                        <label key={mood} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 px-2 py-1 rounded">
                          <input
                            type="radio"
                            name="mood"
                            checked={verbFilters.mood === mood}
                            onChange={() => {
                              if (verbFilters.mood !== mood) {
                                applyVerbFiltersAndSearch({ ...verbFilters, mood: mood as VerbFilterMood });
                              }
                            }}
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                          />
                          <span className="capitalize">{mood}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Show which forms are being searched */}
                {activeVariantForms.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Searching with {activeVariantForms.length} verb forms
                      {activeVariantForms.slice(0, 5).map((form) => (
                        <button
                          key={form}
                          onClick={() => handlePickForm(form)}
                          className="ml-2 px-2 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded text-xs hover:bg-blue-200 dark:hover:bg-blue-800"
                        >
                          {form}
                        </button>
                      ))}
                      {activeVariantForms.length > 5 && (
                        <span className="ml-2 text-gray-500">
                          +{activeVariantForms.length - 5} more
                        </span>
                      )}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* NOUN FILTERS */}
            {relatedForms.posGuess === 'noun' && relatedForms.nouns && relatedForms.nouns.length > 0 && (
              <div className="p-4 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Filter by noun inflection:
                  </span>
                  <button
                    onClick={() => applyNounFiltersAndSearch({ ...DEFAULT_NOUN_FILTER })}
                    className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Reset filters
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Inflection Type Filter */}
                  <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
                      Inflection Type:
                    </label>
                    <div className="space-y-1">
                      {NOUN_INFLECTION_VALUES.map((inflType) => (
                        <label key={inflType} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 px-2 py-1 rounded">
                          <input
                            type="radio"
                            name="noun-inflection"
                            checked={nounFilters.inflectionType === inflType}
                            onChange={() => {
                              if (nounFilters.inflectionType !== inflType) {
                                applyNounFiltersAndSearch({ ...nounFilters, inflectionType: inflType });
                              }
                            }}
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                          />
                          <span className="capitalize">{inflType}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Gender Filter */}
                  <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
                      Gender:
                    </label>
                    <div className="space-y-1">
                      {GENDER_VALUES.map((gender) => (
                        <label key={gender} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 px-2 py-1 rounded">
                          <input
                            type="radio"
                            name="noun-gender"
                            checked={nounFilters.gender === gender}
                            onChange={() => {
                              if (nounFilters.gender !== gender) {
                                applyNounFiltersAndSearch({ ...nounFilters, gender });
                              }
                            }}
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                          />
                          <span className="capitalize">{gender}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                {activeVariantForms.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Searching with {activeVariantForms.length} noun forms
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* ADJECTIVE FILTERS */}
            {(relatedForms.posGuess === 'adjective' || relatedForms.posGuess === 'adj') && relatedForms.other && relatedForms.other.length > 0 && (
              <div className="p-4 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Filter by adjective inflection:
                  </span>
                  <button
                    onClick={() => applyAdjectiveFiltersAndSearch({ ...DEFAULT_ADJECTIVE_FILTER })}
                    className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Reset filters
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Inflection Type Filter */}
                  <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
                      Inflection Type:
                    </label>
                    <div className="space-y-1">
                      {NOUN_INFLECTION_VALUES.map((inflType) => (
                        <label key={inflType} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 px-2 py-1 rounded">
                          <input
                            type="radio"
                            name="adj-inflection"
                            checked={adjectiveFilters.inflectionType === inflType}
                            onChange={() => {
                              if (adjectiveFilters.inflectionType !== inflType) {
                                applyAdjectiveFiltersAndSearch({ ...adjectiveFilters, inflectionType: inflType });
                              }
                            }}
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                          />
                          <span className="capitalize">{inflType}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Gender Filter */}
                  <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
                      Gender:
                    </label>
                    <div className="space-y-1">
                      {GENDER_VALUES.map((gender) => (
                        <label key={gender} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 px-2 py-1 rounded">
                          <input
                            type="radio"
                            name="adj-gender"
                            checked={adjectiveFilters.gender === gender}
                            onChange={() => {
                              if (adjectiveFilters.gender !== gender) {
                                applyAdjectiveFiltersAndSearch({ ...adjectiveFilters, gender });
                              }
                            }}
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                          />
                          <span className="capitalize">{gender}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                {activeVariantForms.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Searching with {activeVariantForms.length} adjective forms
                    </p>
                  </div>
                )}
              </div>
            )}
          </>
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
