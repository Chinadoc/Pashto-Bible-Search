"use client";

import { useEffect, useState, useMemo, useCallback, useRef, ChangeEvent } from "react";
import { debounce, optimizedFilter } from "./utils/debounce";
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

// New multi-select filter state
interface MultiVerbFilterState {
  person: VerbFilterPerson[];
  tense: VerbFilterTense[];
  aspect: VerbFilterAspect[];
  mood: VerbFilterMood[];
}

const DEFAULT_MULTI_VERB_FILTER: MultiVerbFilterState = {
  person: ['all'],
  tense: ['all'],
  aspect: ['all'],
  mood: ['all'],
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
  '1st': ['1sg', '1 pl', '1pl', '1st', 'first', 'i', 'we'],
  '2nd': ['2sg', '2 pl', '2pl', '2nd', 'second', 'you'],
  '3rd': ['3sg', '3 pl', '3pl', '3rd', 'third', 'he', 'she', 'they'],
};

const TENSE_MATCHERS: Record<VerbFilterTense, (label: string) => boolean> = {
  all: () => true,
  present: (l) => l.toLowerCase().includes('present'),
  past: (l) => l.toLowerCase().includes('past') && !l.toLowerCase().includes('participle') && !l.toLowerCase().includes('perfect'),
  future: (l) => l.toLowerCase().includes('future'),
  perfect: (l) => l.toLowerCase().includes('perfect') || l.toLowerCase().includes('participle'),
  subjunctive: (l) => l.toLowerCase().includes('subj'),
  imperative: (l) => l.toLowerCase().includes('imperativ'),
  ability: (l) => l.toLowerCase().includes('ability') || l.toLowerCase().includes('able') || l.toLowerCase().includes('can'),
  habitual: (l) => l.toLowerCase().includes('habit'),
};

const MOOD_MATCHERS: Record<VerbFilterMood, (label: string) => boolean> = {
  all: () => true,
  indicative: (l) => !l.toLowerCase().includes('subj') && !l.toLowerCase().includes('imperativ') && !l.toLowerCase().includes('ability'),
  subjunctive: (l) => l.toLowerCase().includes('subj'),
  imperative: (l) => l.toLowerCase().includes('imperativ'),
  ability: (l) => l.toLowerCase().includes('ability') || l.toLowerCase().includes('able') || l.toLowerCase().includes('can') || l.toLowerCase().includes('ش') || l.toLowerCase().includes('sh') || l.includes('ش'),
};

const ASPECT_MATCHERS: Record<VerbFilterAspect, (label: string) => boolean> = {
  all: () => true,
  imperfective: (l) =>
    l.toLowerCase().includes('present') ||
    l.toLowerCase().includes('future') ||
    l.toLowerCase().includes('progressive') ||
    l.toLowerCase().includes('habit') ||
    l.toLowerCase().includes('subj') ||
    l.toLowerCase().includes('ability'),
  perfective: (l) => l.toLowerCase().includes('past') || l.toLowerCase().includes('perfect') || l.toLowerCase().includes('participle') || l.toLowerCase().includes('subj'),
};

function normalizeLabel(label?: string): string {
  return (label || '').toLowerCase();
}

function matchesPerson(label: string, person: VerbFilterPerson): boolean {
  if (person === 'all') return true;
  const patterns = PERSON_PATTERNS[person];
  if (!patterns?.length) return true;
  return patterns.some((pattern) => label.toLowerCase().includes(pattern.toLowerCase()));
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
    const personMatch = matchesPerson(label, filters.person);
    const tenseMatch = matchesTense(label, filters.tense);
    const moodMatch = matchesMood(label, filters.mood);
    const aspectMatch = matchesAspect(label, filters.aspect);

    console.log(`Filtering variant: "${variant.form}" label: "${variant.label}" (${label})`);
    console.log(`  Person match (${filters.person}): ${personMatch}`);
    console.log(`  Tense match (${filters.tense}): ${tenseMatch}`);
    console.log(`  Mood match (${filters.mood}): ${moodMatch}`);
    console.log(`  Aspect match (${filters.aspect}): ${aspectMatch}`);

    return personMatch && tenseMatch && moodMatch && aspectMatch;
  };

  const filtered = verbs.filter(labelFilter);
  console.log(`Filtered ${verbs.length} verb variants down to ${filtered.length} for filters:`, filters);
  return filtered;
}

function relaxFilters(filters: VerbFilterState): VerbFilterState {
  return {
    ...filters,
    person: filters.person === 'all' ? 'all' : 'all', // Relax person first
    tense: filters.tense === 'all' ? 'all' : 'all',   // Then tense
  };
}

function applyVerbFiltersWithFallback(
  verbs: RelatedFormVariant[],
  filters: VerbFilterState
): RelatedFormVariant[] {
  // Try strict filtering first
  let filtered = filterVerbVariants(verbs, filters);
  
  // If no results, try progressive relaxation
  if (filtered.length === 0) {
    const relaxedFilters = [
      { ...filters, person: 'all' as VerbFilterPerson },
      { ...filters, tense: 'all' as VerbFilterTense },
      { ...filters, aspect: 'all' as VerbFilterAspect },
      { ...filters, mood: 'all' as VerbFilterMood },
    ];
    
    for (const relaxed of relaxedFilters) {
      filtered = filterVerbVariants(verbs, relaxed);
      if (filtered.length > 0) break;
    }
  }
  
  return filtered;
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

// Multi-select filter helpers
function isDefaultMultiVerbFilter(filters: MultiVerbFilterState): boolean {
  return (
    filters.person.length === 1 && filters.person[0] === 'all' &&
    filters.tense.length === 1 && filters.tense[0] === 'all' &&
    filters.aspect.length === 1 && filters.aspect[0] === 'all' &&
    filters.mood.length === 1 && filters.mood[0] === 'all'
  );
}

function toggleMultiFilter<T extends string>(
  currentValues: T[],
  value: T,
  allValue: T = 'all' as T
): T[] {
  if (value === allValue) {
    // Toggle "all" - if it's selected, deselect everything; if not, select only "all"
    return currentValues.includes(allValue) ? [] : [allValue];
  }
  
  // Remove "all" if it's selected and select the specific value
  const withoutAll = currentValues.filter(v => v !== allValue);
  
  if (withoutAll.includes(value)) {
    // Deselect the value
    const newValues = withoutAll.filter(v => v !== value);
    // If no specific values remain, select "all"
    return newValues.length === 0 ? [allValue] : newValues;
  } else {
    // Select the value
    return [...withoutAll, value];
  }
}

function multiFilterToSingleFilter(multiFilters: MultiVerbFilterState): VerbFilterState {
  return {
    person: multiFilters.person.includes('all') || multiFilters.person.length === 0 ? 'all' : multiFilters.person[0],
    tense: multiFilters.tense.includes('all') || multiFilters.tense.length === 0 ? 'all' : multiFilters.tense[0],
    aspect: multiFilters.aspect.includes('all') || multiFilters.aspect.length === 0 ? 'all' : multiFilters.aspect[0],
    mood: multiFilters.mood.includes('all') || multiFilters.mood.length === 0 ? 'all' : multiFilters.mood[0],
  };
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

  return filtered;
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

  return filtered;
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
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Search Mode:</span>
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

        {/* LingDocs-style Inflections/Conjugations Button */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIncludeRelated(!includeRelated)}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border-2 transition-all ${
              includeRelated
                ? 'bg-purple-600 text-white border-purple-600 shadow-lg transform scale-105'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:border-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
            </svg>
            {includeRelated ? 'Search in Inflections/Conjugations' : 'Search Inflections/Conjugations'}
          </button>
        </div>

        {/* Show indicator when Inflections/Conjugations search is active */}
        {includeRelated && (
          <div className="w-full px-3 py-2 bg-purple-50 dark:bg-purple-900/20 border border-purple-300 dark:border-purple-700 rounded-md">
            <p className="text-xs text-purple-700 dark:text-purple-300">
              🔍 Search in Inflections/Conjugations Active - Finding all morphological variants including conjugated verbs, inflected nouns, and related grammatical forms
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
          <button
            onClick={() => setSearchLanguage('anki')}
            className={`px-2 py-1 text-xs font-medium rounded-md transition-colors ${
              searchLanguage === 'anki'
                ? 'bg-green-500 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
            title="Anki Export Mode - search for words and export to Anki flashcards with audio"
          >
            📚 Anki
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
  const [yousafzaiAudioMap, setYousafzaiAudioMap] = useState<AudioMap>({});
  const [activeTranslation, setActiveTranslation] = useState<'afghan2023' | 'yousafzai2019'>('afghan2023');
  const [activeMainTab, setActiveMainTab] = useState<'search' | 'lexicon' | 'videos' | 'poems'>('search');
  const [audioClips, setAudioClips] = useState<any[]>([]);
  const [poems, setPoems] = useState<any[]>([]);
  const [loadingAudio, setLoadingAudio] = useState(false);
  const [transcriptSearchQuery, setTranscriptSearchQuery] = useState('');
  const [transcriptResults, setTranscriptResults] = useState<any[]>([]);
  const [loadingTranscripts, setLoadingTranscripts] = useState(false);
  const [videos, setVideos] = useState<any[]>([]);
  const [loadingVideos, setLoadingVideos] = useState(false);
  const [retranscribingSegments, setRetranscribingSegments] = useState<Set<number>>(new Set());
  const [newVideoUrl, setNewVideoUrl] = useState('');
  const [processingVideo, setProcessingVideo] = useState(false);
  const [processingStatus, setProcessingStatus] = useState('');
  const [loadingPoems, setLoadingPoems] = useState(false);
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
    englishMatches?: Array<{ english: string; pashto: string; romanized?: string; pos?: string; forms?: string[] }>;
  } | null>(null);

  // Verb understanding state
  const [verbFilters, setVerbFilters] = useState<VerbFilterState>({ ...DEFAULT_VERB_FILTER });
  const [multiVerbFilters, setMultiVerbFilters] = useState<MultiVerbFilterState>({ ...DEFAULT_MULTI_VERB_FILTER });
  const [nounFilters, setNounFilters] = useState<NounFilterState>({ ...DEFAULT_NOUN_FILTER });
  const [adjectiveFilters, setAdjectiveFilters] = useState<AdjectiveFilterState>({ ...DEFAULT_ADJECTIVE_FILTER });
  const [variantsOverride, setVariantsOverride] = useState<string[] | null>(null);
  const [activeVariantForms, setActiveVariantForms] = useState<string[]>([]);
  const [searchLanguage, setSearchLanguage] = useState<SearchLanguage>('pashto');
  const variantKeyRef = useRef<string>('');
  const isQueryChangingRef = useRef<boolean>(false);

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
        console.log('🔄 Verb filter changed, applying filter without re-searching');
        applyVerbFiltersAndSearch(verbFilters);
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
        console.log('🔄 Noun filter changed, applying filter without re-searching');
        applyNounFiltersAndSearch(nounFilters);
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
        console.log('🔄 Adjective filter changed, applying filter without re-searching');
        applyAdjectiveFiltersAndSearch(adjectiveFilters);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [adjectiveFilters.inflectionType, adjectiveFilters.gender]);

  // Load persisted preferences on mount
  useEffect(() => {
    setScope(loadPersisted('scope', 'all'));
    setIncludeRelated(loadPersisted('includeRelated', false));
    const savedFilters = sanitizeVerbFilter(loadPersisted('verbFilters', DEFAULT_VERB_FILTER));
    console.log('Loading verb filters from localStorage:', savedFilters);
    setVerbFilters(savedFilters);
    setNounFilters(loadPersisted('nounFilters', DEFAULT_NOUN_FILTER));
    setAdjectiveFilters(loadPersisted('adjectiveFilters', DEFAULT_ADJECTIVE_FILTER));
    const savedLanguage = loadPersisted<SearchLanguage>('searchLanguage', 'pashto');
    setSearchLanguage(savedLanguage === 'english' ? 'english' : 'pashto');
  }, []);

  // Persist preferences when they change
  useEffect(() => {
    // Don't persist filters during query changes to prevent stale state
    if (isQueryChangingRef.current) {
      console.log('Skipping filter persistence during query change');
      return;
    }
    
    savePersisted('scope', scope);
    savePersisted('includeRelated', includeRelated);
    console.log('Persisting verb filters:', verbFilters);
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

  // Load audio map data for both translations
  useEffect(() => {
    const loadAudioMaps = async () => {
      try {
        // Load Afghan 2023 audio map
        const afghanResponse = await fetch('/api/get_audio_map?clear_cache=1');
        if (afghanResponse.ok) {
          const afghanData = await afghanResponse.json();
          const afghanAudioMap = afghanData || {};
          const driveUrls = Object.values(afghanAudioMap).filter((url: unknown) => typeof url === 'string' && url.includes('drive.google.com')).length;
          const storageUrls = Object.values(afghanAudioMap).filter((url: unknown) => typeof url === 'string' && url.includes('supabase.co/storage')).length;

          console.log(`Afghan 2023 audio map loaded: ${Object.keys(afghanAudioMap).length} entries (${storageUrls} Supabase, ${driveUrls} Drive)`);
          setAudioMap(afghanAudioMap);

          if (driveUrls > 0) {
            console.warn(`⚠️ Afghan 2023 audio map contains ${driveUrls} Google Drive URLs - consider manual refresh`);
          }
        } else {
          console.warn('Afghan 2023 audio map API returned error:', afghanResponse.status, afghanResponse.statusText);
          setAudioMap({});
        }

        // Load Yousafzai 2019 audio map
        const yousafzaiResponse = await fetch('/api/get_yousafzai_audio_map?clear_cache=1');
        if (yousafzaiResponse.ok) {
          const yousafzaiData = await yousafzaiResponse.json();
          const yousafzaiAudioMap = yousafzaiData || {};
          const yousafzaiDriveUrls = Object.values(yousafzaiAudioMap).filter((url: unknown) => typeof url === 'string' && url.includes('drive.google.com')).length;
          const yousafzaiStorageUrls = Object.values(yousafzaiAudioMap).filter((url: unknown) => typeof url === 'string' && url.includes('supabase.co/storage')).length;

          console.log(`Yousafzai 2019 audio map loaded: ${Object.keys(yousafzaiAudioMap).length} entries (${yousafzaiStorageUrls} Supabase, ${yousafzaiDriveUrls} Drive)`);
          setYousafzaiAudioMap(yousafzaiAudioMap);

          if (yousafzaiDriveUrls > 0) {
            console.warn(`⚠️ Yousafzai 2019 audio map contains ${yousafzaiDriveUrls} Google Drive URLs - consider manual refresh`);
          }
        } else {
          console.warn('Yousafzai 2019 audio map API returned error:', yousafzaiResponse.status, yousafzaiResponse.statusText);
          setYousafzaiAudioMap({});
        }
      } catch (error) {
        console.error('Failed to load audio maps:', error);
        // Audio maps are optional, so we can continue without them
        setAudioMap({});
        setYousafzaiAudioMap({});
      }
    };
    loadAudioMaps();
  }, []);

  // Fetch audio clips when videos tab is active
  useEffect(() => {
    if (activeMainTab === 'videos' && audioClips.length === 0) {
      setLoadingAudio(true);
      fetch('/api/audio-clips')
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setAudioClips(data.clips || []);
          }
        })
        .catch(err => {
          console.error('Error fetching audio clips:', err);
        })
        .finally(() => {
          setLoadingAudio(false);
        });
    }
  }, [activeMainTab, audioClips.length]);

  // Fetch poems when poems tab is active
  useEffect(() => {
    if (activeMainTab === 'poems' && poems.length === 0) {
      setLoadingPoems(true);
      fetch('/api/poems')
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setPoems(data.poems || []);
          }
        })
        .catch(err => {
          console.error('Error fetching poems:', err);
        })
        .finally(() => {
          setLoadingPoems(false);
        });
    }
  }, [activeMainTab, poems.length]);

  // Fetch videos when videos tab is active
  useEffect(() => {
    if (activeMainTab === 'videos' && videos.length === 0) {
      setLoadingVideos(true);
      fetch('/api/videos')
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setVideos(data.videos || []);
          }
        })
        .catch(error => {
          console.error('Error fetching videos:', error);
        })
        .finally(() => {
          setLoadingVideos(false);
        });
    }
  }, [activeMainTab, videos.length]);

  // Re-transcribe segment function
  const retranscribeSegment = async (audioFilename: string, segmentIndex: number) => {
    setRetranscribingSegments(prev => new Set(prev).add(segmentIndex));
    
    try {
      const response = await fetch('/api/retranscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ audioFilename }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Update the transcript in the videos state
        setVideos(prevVideos => 
          prevVideos.map(video => ({
            ...video,
            segments: video.segments.map((segment: any, index: number) => 
              index === segmentIndex 
                ? { ...segment, transcript: data.transcript }
                : segment
            )
          }))
        );
        
        // Show success message with quality check info
        const qualityInfo = data.qualityCheck ? `\nQuality check: ${data.qualityCheck.reason}` : '';
        alert(`Transcript updated successfully!${qualityInfo}`);
        console.log('Transcript updated successfully', data.qualityCheck);
      } else {
        console.error('Failed to re-transcribe:', data.error);
        const errorMsg = data.reason ? `Quality check failed: ${data.reason}` : 'Failed to re-transcribe segment. Please try again.';
        alert(errorMsg);
      }
    } catch (error) {
      console.error('Error re-transcribing segment:', error);
      alert('Error re-transcribing segment. Please try again.');
    } finally {
      setRetranscribingSegments(prev => {
        const newSet = new Set(prev);
        newSet.delete(segmentIndex);
        return newSet;
      });
    }
  };

  // Process new video function
  const processNewVideo = async () => {
    if (!newVideoUrl.trim()) {
      alert('Please enter a YouTube URL');
      return;
    }

    setProcessingVideo(true);
    setProcessingStatus('Starting video processing...');

    try {
      const response = await fetch('/api/process-video', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ youtubeUrl: newVideoUrl }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setProcessingStatus(`✅ Successfully processed video!`);
        setProcessingStatus(prev => prev + `\nVideo ID: ${data.videoId}`);
        setProcessingStatus(prev => prev + `\nTotal chunks: ${data.totalChunks}`);
        setProcessingStatus(prev => prev + `\nSuccessful transcriptions: ${data.successfulTranscriptions}`);
        
        // Refresh videos list
        setVideos([]);
        setTimeout(() => {
          fetch('/api/videos')
            .then(res => res.json())
            .then(data => {
              if (data.success) {
                setVideos(data.videos || []);
              }
            })
            .catch(error => {
              console.error('Error refreshing videos:', error);
            });
        }, 2000);
        
        setNewVideoUrl('');
      } else {
        setProcessingStatus(`❌ Processing failed: ${data.error}`);
        if (data.output) {
          setProcessingStatus(prev => prev + `\n\nDetails:\n${data.output}`);
        }
      }
    } catch (error) {
      console.error('Error processing video:', error);
      setProcessingStatus(`❌ Error: ${error}`);
    } finally {
      setProcessingVideo(false);
    }
  };

  // Search transcripts function
  const searchTranscripts = async (query: string) => {
    if (!query.trim()) {
      setTranscriptResults([]);
      return;
    }

    setLoadingTranscripts(true);
    try {
      const response = await fetch(`/api/search-transcripts?q=${encodeURIComponent(query)}&limit=10`);
      const data = await response.json();
      
      if (response.ok) {
        setTranscriptResults(data.results || []);
      } else {
        console.error('Error searching transcripts:', data.error);
        setTranscriptResults([]);
      }
    } catch (error) {
      console.error('Error searching transcripts:', error);
      setTranscriptResults([]);
    } finally {
      setLoadingTranscripts(false);
    }
  };

  // Debounced transcript search
  const debouncedTranscriptSearch = useCallback(
    debounce((query: string) => {
      searchTranscripts(query);
    }, 500),
    []
  );

  // Handle transcript search input change
  const handleTranscriptSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setTranscriptSearchQuery(query);
    debouncedTranscriptSearch(query);
  };

  // Refresh audio maps when results change to ensure we have latest URLs
  useEffect(() => {
    // Only refresh if we have results but no audio map for the active translation
    const currentAudioMap = activeTranslation === 'afghan2023' ? audioMap : yousafzaiAudioMap;
    if (results.length > 0 && Object.keys(currentAudioMap).length === 0) {
      const refreshAudioMaps = async () => {
        try {
          // Refresh Afghan 2023 audio map
          const afghanResponse = await fetch('/api/get_audio_map?clear_cache=1');
          if (afghanResponse.ok) {
            const afghanData = await afghanResponse.json();
            const newAfghanAudioMap = afghanData || {};
            console.log(`Refreshed Afghan 2023 audio map: ${Object.keys(newAfghanAudioMap).length} entries`);
            setAudioMap(newAfghanAudioMap);
          }

          // Refresh Yousafzai 2019 audio map
          const yousafzaiResponse = await fetch('/api/get_yousafzai_audio_map?clear_cache=1');
          if (yousafzaiResponse.ok) {
            const yousafzaiData = await yousafzaiResponse.json();
            const newYousafzaiAudioMap = yousafzaiData || {};
            console.log(`Refreshed Yousafzai 2019 audio map: ${Object.keys(newYousafzaiAudioMap).length} entries`);
            setYousafzaiAudioMap(newYousafzaiAudioMap);
          }
        } catch (error) {
          console.error('Failed to refresh audio maps:', error);
        }
      };
      refreshAudioMaps();
    }
  }, [results.length, activeTranslation]); // Remove audioMap dependency to prevent excessive re-runs

  // Manual audio map refresh function
  const refreshAudioMap = useCallback(async () => {
    try {
      setIsLoading(true);
      
      // Refresh Afghan 2023 audio map
      const afghanResponse = await fetch('/api/get_audio_map?clear_cache=1');
      if (afghanResponse.ok) {
        const afghanData = await afghanResponse.json();
        const newAfghanAudioMap = afghanData || {};
        const afghanDriveUrls = Object.values(newAfghanAudioMap).filter((url: unknown) => typeof url === 'string' && url.includes('drive.google.com')).length;
        const afghanStorageUrls = Object.values(newAfghanAudioMap).filter((url: unknown) => typeof url === 'string' && url.includes('supabase.co/storage')).length;

        console.log(`Afghan 2023 audio map refreshed: ${Object.keys(newAfghanAudioMap).length} entries (${afghanStorageUrls} Supabase, ${afghanDriveUrls} Drive)`);
        setAudioMap(newAfghanAudioMap);

        // Refresh Yousafzai 2019 audio map
        const yousafzaiResponse = await fetch('/api/get_yousafzai_audio_map?clear_cache=1');
        if (yousafzaiResponse.ok) {
          const yousafzaiData = await yousafzaiResponse.json();
          const newYousafzaiAudioMap = yousafzaiData || {};
          const yousafzaiDriveUrls = Object.values(newYousafzaiAudioMap).filter((url: unknown) => typeof url === 'string' && url.includes('drive.google.com')).length;
          const yousafzaiStorageUrls = Object.values(newYousafzaiAudioMap).filter((url: unknown) => typeof url === 'string' && url.includes('supabase.co/storage')).length;

          console.log(`Yousafzai 2019 audio map refreshed: ${Object.keys(newYousafzaiAudioMap).length} entries (${yousafzaiStorageUrls} Supabase, ${yousafzaiDriveUrls} Drive)`);
          setYousafzaiAudioMap(newYousafzaiAudioMap);

          const totalDriveUrls = afghanDriveUrls + yousafzaiDriveUrls;
          const totalStorageUrls = afghanStorageUrls + yousafzaiStorageUrls;

          if (totalDriveUrls > 0) {
            alert(`Audio maps refreshed with ${totalDriveUrls} Google Drive URLs still present. Try refreshing again.`);
          } else {
            alert(`Audio maps refreshed with ${totalStorageUrls} Supabase Storage URLs!`);
          }
        } else {
          alert('Failed to refresh Yousafzai 2019 audio map');
        }
      } else {
        alert('Failed to refresh Afghan 2023 audio map');
      }
    } catch (error) {
      console.error('Failed to refresh audio maps:', error);
      alert('Failed to refresh audio maps');
    } finally {
      setIsLoading(false);
    }
  }, [setAudioMap, setYousafzaiAudioMap, setIsLoading]);

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
      
      // Reset filters when starting a new search (manual or query change)
      if (reason === 'manual' || reason === 'query') {
        console.log('🔄 Resetting filters for new search');
        setMultiVerbFilters({ ...DEFAULT_MULTI_VERB_FILTER });
        setVerbFilters({ ...DEFAULT_VERB_FILTER });
        setNounFilters({ ...DEFAULT_NOUN_FILTER });
        setAdjectiveFilters({ ...DEFAULT_ADJECTIVE_FILTER });
        // Clear variant override to ensure fresh analysis
        setVariantsOverride(null);
        setActiveVariantForms([]);
        variantKeyRef.current = '';
      }
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
        translation: activeTranslation,
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
      setRelatedForms(searchData.relatedForms ? {
        ...searchData.relatedForms,
        searchedForm: searchData.searchedForm,
      } : null);
      setProcessed(searchData.processed ? {
        ...searchData.processed,
        searchedForm: searchData.searchedForm,
      } : null);

      const processedVariants: string[] = searchData.processed?.variantsSearched
        || searchData.processed?.variants
        || variantsPayload
        || [];

      console.log('Setting active variant forms:', processedVariants);
      console.log('Setting variants override:', variantsPayload);
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

  // Helper to calculate coverage from filtered results
  const calculateCoverageFromResults = useCallback((verses: Verse[]) => {
    const bookCounts = new Map<string, number>();

    for (const verse of verses) {
      const book = verse.ref.split(' ')[0];
      bookCounts.set(book, (bookCounts.get(book) || 0) + 1);
    }

    return Array.from(bookCounts.entries()).map(([book, count]) => ({
      book,
      count,
      testament: OT_BOOKS_SET.has(book) ? 'OT' : NT_BOOKS_SET.has(book) ? 'NT' : 'OT'
    }));
  }, []);

  // Optimized filtering function for large result sets
  const optimizedVerseFilter = useCallback((verses: Verse[], forms: string[]) => {
    if (forms.length === 0) return verses;
    
    return optimizedFilter(verses, (verse) => {
      const text = verse.text ?? '';
      const normalizedText = text.toLowerCase();
      const collapsedText = normalizedText.replace(/\s+/g, '');
      
      return forms.some(form => {
        const normalizedForm = form.toLowerCase();
        const collapsedForm = normalizedForm.replace(/\s+/g, '');

        if (normalizedForm.includes(' ')) {
          return normalizedText.includes(normalizedForm) || collapsedText.includes(collapsedForm);
        }

        return collapsedText.includes(collapsedForm);
      });
    }, 50); // Process in batches of 50
  }, []);

  // Debounced filtering to prevent excessive re-renders
  const debouncedFilter = useMemo(
    () => debounce((verses: Verse[], forms: string[]) => {
      const filtered = optimizedVerseFilter(verses, forms);
      setResults(filtered);
      
      // Update coverage based on filtered results
      const newCoverage = calculateCoverageFromResults(filtered);
      setCoverage(newCoverage);
    }, 150),
    [optimizedVerseFilter, calculateCoverageFromResults]
  );

  const handleSearch = useCallback(
    (opts?: { preserveResults?: boolean }) => executeSearch({ ...opts, reason: 'manual' }),
    [executeSearch]
  );

  const debouncedVerbFilterSearch = useMemo(
    () => debounce((nextFilters: VerbFilterState) => {
      const sanitized = sanitizeVerbFilter(nextFilters);
      console.log('Applying verb filters:', { nextFilters, sanitized });
      setVerbFilters(sanitized);

      // Guard clauses moved to beginning to avoid early returns after hooks
      if (!includeRelated) {
        console.log('Related forms mode not active, filters ignored');
        return;
      }

      if (!relatedForms?.verbs?.length) {
        console.log('Verb filters updated, awaiting related forms to refetch results');
        return;
      }

      const filteredVariants = applyVerbFiltersWithFallback(relatedForms.verbs, sanitized);
      const forms = formsFromVariants(filteredVariants);

      // If no forms match the filters, show no results
      if (forms.length === 0) {
        setResults([]);
        setCoverage([]);
        setVariantsOverride([]);
        setActiveVariantForms([]);
        return;
      }

    // Always do client-side filtering when we have existing results
    // This prevents triggering new searches when filters change
    if (results && results.length > 0) {
      console.log('🔍 Client-side filtering existing results by', forms.length, 'forms');

      // Use debounced filtering for better performance
      debouncedFilter(results, forms);
      setVariantsOverride(forms);
      setActiveVariantForms(forms);
    } else {
      // No existing results - need to restore original results
      console.log('🔄 No existing results, restoring original search results');

      // If filters are reset to "All", restore original results from the last successful search
      if (isDefaultVerbFilter(sanitized)) {
        console.log('🔄 Filters reset to "All", restoring original results');
        // Clear variant override to show all original forms
        setVariantsOverride(null);
        setActiveVariantForms(relatedForms?.forms?.verbs?.map(v => v.form) || []);

        // Re-run the original search to restore results
        executeSearch({ preserveResults: false, reason: 'filter-reset' });
      } else {
        // Specific filters applied but no results - trigger search with filtered forms
        console.log('🔄 Specific filters applied, triggering search with filtered forms');
        variantKeyRef.current = forms.join('|');
        setVariantsOverride(forms);
        setActiveVariantForms(forms);
        executeSearch({ overrideVariants: forms, preserveResults: false, reason: 'verb-filter' });
      }
    }
    }, 200), // 200ms debounce for filter changes
    [includeRelated, relatedForms, results, query, isDefaultVerbFilter, debouncedFilter, executeSearch, setResults, setCoverage, setVariantsOverride, setActiveVariantForms]
  );

  const applyVerbFiltersAndSearch = useCallback((nextFilters: VerbFilterState) => {
    debouncedVerbFilterSearch(nextFilters);
  }, [debouncedVerbFilterSearch]);

  const applyMultiVerbFiltersAndSearch = useCallback((nextFilters: MultiVerbFilterState) => {
    console.log('Applying multi verb filters:', nextFilters);
    setMultiVerbFilters(nextFilters);

    // Convert multi-select to single-select for backward compatibility
    const singleFilter = multiFilterToSingleFilter(nextFilters);
    applyVerbFiltersAndSearch(singleFilter);
  }, [applyVerbFiltersAndSearch]);

  const applyNounFiltersAndSearch = useCallback((nextFilters: NounFilterState) => {
    setNounFilters(nextFilters);

    // Guard clauses moved to beginning to avoid early returns after hooks
    if (!includeRelated) {
      console.log('Related forms mode not active, filters ignored');
      return;
    }

    if (!relatedForms?.nouns?.length) {
      console.log('Noun filters updated, awaiting related forms to refetch results');
      return;
    }

    const filteredVariants = filterNounVariants(relatedForms.nouns, nextFilters);
    const forms = formsFromVariants(filteredVariants);

    // If no forms match the filters, show no results
    if (forms.length === 0) {
      setResults([]);
      setCoverage([]);
      setVariantsOverride([]);
      setActiveVariantForms([]);
      return;
    }

    // Client-side filtering
    if (results && results.length > 0) {
      console.log('🔍 Client-side filtering existing results by', forms.length, 'noun forms');

      const filtered = results.filter((verse) => {
        const text = verse.text ?? '';
        const collapsedText = text.replace(/\s+/g, '').toLowerCase();

        return forms.some(form => {
          const collapsedForm = form.toLowerCase().replace(/\s+/g, '');
          return collapsedText.includes(collapsedForm);
        });
      });

      console.log(`✅ Filtered from ${results.length} to ${filtered.length} results`);
      setResults(filtered);
      setVariantsOverride(forms);
      setActiveVariantForms(forms);

      const newCoverage = calculateCoverageFromResults(filtered);
      setCoverage(newCoverage);
    } else {
      console.log('🔄 No existing results, triggering search for filtered forms');
      setVariantsOverride(forms);
      setActiveVariantForms(forms);
      executeSearch({ overrideVariants: forms, preserveResults: false, reason: 'noun-filter' });
    }
  }, [includeRelated, relatedForms, results, setResults, setCoverage, setVariantsOverride, setActiveVariantForms, calculateCoverageFromResults, executeSearch]);

  const applyAdjectiveFiltersAndSearch = useCallback((nextFilters: AdjectiveFilterState) => {
    setAdjectiveFilters(nextFilters);

    // Guard clauses moved to beginning to avoid early returns after hooks
    if (!includeRelated) {
      console.log('Related forms mode not active, filters ignored');
      return;
    }

    if (!relatedForms?.other?.length) {
      console.log('Adjective filters updated, awaiting related forms to refetch results');
      return;
    }

    const filteredVariants = filterAdjectiveVariants(relatedForms.other, nextFilters);
    const forms = formsFromVariants(filteredVariants);

    // If no forms match the filters, show no results
    if (forms.length === 0) {
      setResults([]);
      setCoverage([]);
      setVariantsOverride([]);
      setActiveVariantForms([]);
      return;
    }

    // Client-side filtering
    if (results && results.length > 0) {
      console.log('🔍 Client-side filtering existing results by', forms.length, 'adjective forms');

      const filtered = results.filter((verse) => {
        const text = verse.text ?? '';
        const collapsedText = text.replace(/\s+/g, '').toLowerCase();

        return forms.some(form => {
          const collapsedForm = form.toLowerCase().replace(/\s+/g, '');
          return collapsedText.includes(collapsedForm);
        });
      });

      console.log(`✅ Filtered from ${results.length} to ${filtered.length} results`);
      setResults(filtered);
      setVariantsOverride(forms);
      setActiveVariantForms(forms);

      const newCoverage = calculateCoverageFromResults(filtered);
      setCoverage(newCoverage);
    } else {
      console.log('🔄 No existing results, triggering search for filtered forms');
      setVariantsOverride(forms);
      setActiveVariantForms(forms);
      executeSearch({ overrideVariants: forms, preserveResults: false, reason: 'adjective-filter' });
    }
  }, [includeRelated, relatedForms, results, setResults, setCoverage, setVariantsOverride, setActiveVariantForms, calculateCoverageFromResults, executeSearch]);

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
      setMultiVerbFilters({ ...DEFAULT_MULTI_VERB_FILTER });
      setVerbFilters({ ...DEFAULT_VERB_FILTER });
      variantKeyRef.current = ''; // reset variant key to avoid stale matches
      setVariantsOverride(null);
      setActiveVariantForms([]);
      executeSearch({ overrideVariants: null, preserveResults: false, reason: 'language-toggle' });
    }
    previousLanguage.current = searchLanguage;
  }, [searchLanguage, query, executeSearch]);

  // Trigger search when query changes (with debouncing)
  const previousQuery = useRef<string>(query);
  const debouncedSearch = useMemo(
    () => debounce((trimmedQuery: string) => {
      console.log('🔄 Query changed, triggering new search');
      // Set flag to prevent filter persistence during query change
      isQueryChangingRef.current = true;
      // Reset filters and variant forms when query changes to ensure fresh analysis
      console.log('Clearing variant forms for new query:', trimmedQuery);
      setMultiVerbFilters({ ...DEFAULT_MULTI_VERB_FILTER });
      setVerbFilters({ ...DEFAULT_VERB_FILTER });
      setNounFilters({ ...DEFAULT_NOUN_FILTER });
      setAdjectiveFilters({ ...DEFAULT_ADJECTIVE_FILTER });
      variantKeyRef.current = ''; // reset variant key to avoid stale matches
      setVariantsOverride(null);
      setActiveVariantForms([]);
      executeSearch({ preserveResults: false, reason: 'query' });
      // Reset flag after a short delay to allow state updates to complete
      setTimeout(() => {
        isQueryChangingRef.current = false;
      }, 100);
    }, 300), // 300ms debounce delay
    [executeSearch]
  );

  useEffect(() => {
    const trimmedQuery = query.trim();
    const previousTrimmedQuery = previousQuery.current.trim();
    
    // Only trigger if query actually changed and we have a non-empty query
    if (trimmedQuery !== previousTrimmedQuery && trimmedQuery) {
      debouncedSearch(trimmedQuery);
    }
    previousQuery.current = query;
  }, [query, debouncedSearch]);

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
  const isAnkiMode = searchLanguage === 'anki';

  // Anki export state
  const [isExportingAnki, setIsExportingAnki] = useState(false);

  // Anki export function
  const exportToAnki = useCallback(async () => {
    if (!results.length || !isAnkiMode) return;

    setIsExportingAnki(true);
    try {
      console.log(`🔄 Exporting ${results.length} results to Anki deck...`);

      const response = await fetch('/api/anki-export', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query,
          results: results.slice(0, 50), // Limit to 50 cards for performance
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      // Generate and download Anki deck file
      await generateAnkiDeckFile(data.deck, data.cards);

      console.log(`✅ Successfully exported ${data.count} cards to Anki`);
    } catch (error) {
      console.error('❌ Failed to export to Anki:', error);
      alert(`Failed to export to Anki: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsExportingAnki(false);
    }
  }, [results, query, isAnkiMode]);

  // Generate Anki deck file for download
  const generateAnkiDeckFile = async (deck: any, cards: any[]) => {
    const deckName = deck.name;
    const timestamp = new Date().toISOString().slice(0, 19).replace(/[:.]/g, '-');

    // Create CSV content for Anki import with enhanced formatting
    const csvContent = [
      'Front,Back,Tags',
      ...cards.map(card => `"${card.front.replace(/"/g, '""')}","${card.back.replace(/"/g, '""')}","${card.tags?.join(' ') || ''}"`)
    ].join('\n');

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${deckName}_${timestamp}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    // Show success message with card count
    alert(`✅ Successfully exported ${cards.length} cards to Anki!\n\nDeck: ${deckName}\nFile: ${deckName}_${timestamp}.csv`);
  };

  return (
    <div className={`w-full max-w-6xl mx-auto transition-colors duration-300 ${isEnglishMode ? 'bg-gradient-to-b from-orange-50 to-transparent dark:from-orange-950' : ''} ${isAnkiMode ? 'bg-gradient-to-b from-green-50 to-transparent dark:from-green-950' : ''}`}>
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

      {/* Anki Mode Banner */}
      {isAnkiMode && (
        <div className="mb-4 p-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg shadow-lg border-2 border-green-600">
          <div className="flex items-center justify-center gap-3">
            <span className="text-2xl">📚</span>
            <div className="text-center">
              <p className="font-bold text-lg">Anki Export Mode Active</p>
              <p className="text-sm opacity-90">Search for words and create flashcards with audio</p>
            </div>
            <span className="text-2xl">📚</span>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="text-center mb-6">
        <h1 className={`text-3xl font-bold mb-2 transition-colors ${isEnglishMode ? 'text-orange-700 dark:text-orange-300' : isAnkiMode ? 'text-green-700 dark:text-green-300' : 'text-gray-900 dark:text-gray-100'}`}>
          Pashto Bible Search
        </h1>
        <p className={`transition-colors ${isEnglishMode ? 'text-orange-600 dark:text-orange-400' : isAnkiMode ? 'text-green-600 dark:text-green-400' : 'text-gray-600 dark:text-gray-400'}`}>
          {isAnkiMode ? 'Anki Export Mode - Create flashcards with audio' : isEnglishMode ? 'Searching in English - Finding Pashto translations' : 'Search the Bible in Pashto with linguistic analysis'}
        </p>
      </header>

      {/* Main Tabs */}
      <div className="flex justify-center mb-6">
        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-1 flex gap-1">
          <button
            onClick={() => setActiveMainTab('search')}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              activeMainTab === 'search'
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
            }`}
          >
            🔍 Search
          </button>
          <button
            onClick={() => setActiveMainTab('lexicon')}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              activeMainTab === 'lexicon'
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
            }`}
          >
            📚 Lexicon
          </button>
          <button
            onClick={() => setActiveMainTab('videos')}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              activeMainTab === 'videos'
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
            }`}
          >
            🎵 Videos/Audio
          </button>
          <button
            onClick={() => setActiveMainTab('poems')}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              activeMainTab === 'poems'
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
            }`}
          >
            📝 Poems
          </button>
        </div>
      </div>

      {/* Main Content */}
      {activeMainTab === 'search' && (
        <>
          {/* Translation Tabs */}
          <div className="flex justify-center mb-6">
            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-1 flex gap-1">
              <button
                onClick={() => setActiveTranslation('afghan2023')}
                className={`px-4 py-2 rounded-md font-medium transition-all duration-300 ${
                  activeTranslation === 'afghan2023'
                    ? 'bg-blue-500 text-white shadow-lg transform scale-105'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                Afghan 2023
              </button>
              <button
                onClick={() => setActiveTranslation('yousafzai2019')}
                className={`px-4 py-2 rounded-md font-medium transition-all duration-300 ${
                  activeTranslation === 'yousafzai2019'
                    ? 'bg-green-500 text-white shadow-lg transform scale-105'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                Yousafzai 2019
              </button>
            </div>
          </div>

      {/* Search Bar */}
      <div className="relative z-10 mb-6">
        <TextField
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={
            isAnkiMode
              ? "Enter word to export to Anki (e.g., 'body parts', 'colors', 'animals')..."
              : isEnglishMode
                ? "Enter English word (e.g., 'baptize', 'love', 'peace')..."
                : "Enter Pashto text to search..."
          }
          variant="outlined"
          fullWidth
          inputProps={{
            dir: isEnglishMode || isAnkiMode ? 'ltr' : 'rtl',
            style: { textAlign: isEnglishMode || isAnkiMode ? 'left' : 'right', padding: '12px 16px' }
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              backgroundColor: isEnglishMode ? '#FFF7ED' : isAnkiMode ? '#ECFDF5' : '#374151',
              borderColor: isEnglishMode ? '#F97316' : isAnkiMode ? '#10B981' : '#4B5563',
              color: isEnglishMode ? '#9A3412' : '#F9FAFB',
              '&:hover': {
                borderColor: isEnglishMode ? '#EA580C' : isAnkiMode ? '#059669' : '#6B7280'
              },
              '&.Mui-focused': {
                borderColor: isEnglishMode ? '#F97316' : isAnkiMode ? '#10B981' : '#3B82F6',
                boxShadow: isEnglishMode ? '0 0 0 2px rgba(249, 115, 22, 0.3)' : isAnkiMode ? '0 0 0 2px rgba(16, 185, 129, 0.3)' : '0 0 0 2px rgba(59, 130, 246, 0.5)'
              }
            },
            '& .MuiInputBase-input::placeholder': {
              color: isEnglishMode ? '#C2410C' : isAnkiMode ? '#065F46' : '#9CA3AF'
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

            {/* Form Filters (shown when Related Forms Mode is active OR filters are applied) */}
            {/* Conditionally show VERB, NOUN, or ADJECTIVE filters based on posGuess */}
            {includeRelated && (relatedForms || !isDefaultVerbFilter(verbFilters) || !isDefaultNounFilter(nounFilters) || !isDefaultAdjectiveFilter(adjectiveFilters)) && (
              <>
                {/* VERB FILTERS */}
                {(relatedForms?.posGuess === 'verb' ||
                  (!relatedForms?.posGuess && relatedForms?.verbs && relatedForms.verbs.length > 0) ||
                  (!relatedForms && !isDefaultVerbFilter(verbFilters))) && (
                  <div className="p-4 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Filter by verb form {!isDefaultVerbFilter(verbFilters) && '(Active)'}:
                      </span>
                      <button
                        onClick={() => {
                          setMultiVerbFilters({ ...DEFAULT_MULTI_VERB_FILTER });
                          applyVerbFiltersAndSearch({ ...DEFAULT_VERB_FILTER });
                        }}
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
                          type="checkbox"
                          checked={multiVerbFilters.person.includes('all')}
                          onChange={() => {
                            const newPerson = toggleMultiFilter(multiVerbFilters.person, 'all');
                            applyMultiVerbFiltersAndSearch({ ...multiVerbFilters, person: newPerson });
                          }}
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                        />
                        <span className="font-medium">All</span>
                      </label>
                      {[{ value: '1st', label: '1st (I/we)' }, { value: '2nd', label: '2nd (you)' }, { value: '3rd', label: '3rd (he/she/they)' }].map((option) => (
                        <label key={option.value} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 px-2 py-1 rounded">
                          <input
                            type="checkbox"
                            checked={multiVerbFilters.person.includes(option.value as VerbFilterPerson)}
                            onChange={() => {
                              const newPerson = toggleMultiFilter(multiVerbFilters.person, option.value as VerbFilterPerson);
                              applyMultiVerbFiltersAndSearch({ ...multiVerbFilters, person: newPerson });
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
                          type="checkbox"
                          checked={multiVerbFilters.tense.includes('all')}
                          onChange={() => {
                            const newTense = toggleMultiFilter(multiVerbFilters.tense, 'all');
                            applyMultiVerbFiltersAndSearch({ ...multiVerbFilters, tense: newTense });
                          }}
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                        />
                        <span className="font-medium">All</span>
                      </label>
                      {['present', 'past', 'future', 'perfect', 'subjunctive', 'imperative', 'ability', 'habitual'].map((tense) => (
                        <label key={tense} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 px-2 py-1 rounded">
                          <input
                            type="checkbox"
                            checked={multiVerbFilters.tense.includes(tense as VerbFilterTense)}
                            onChange={() => {
                              const newTense = toggleMultiFilter(multiVerbFilters.tense, tense as VerbFilterTense);
                              applyMultiVerbFiltersAndSearch({ ...multiVerbFilters, tense: newTense });
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
                          type="checkbox"
                          checked={multiVerbFilters.aspect.includes('all')}
                          onChange={() => {
                            const newAspect = toggleMultiFilter(multiVerbFilters.aspect, 'all');
                            applyMultiVerbFiltersAndSearch({ ...multiVerbFilters, aspect: newAspect });
                          }}
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                        />
                        <span className="font-medium">All</span>
                      </label>
                      {['imperfective', 'perfective'].map((aspect) => (
                        <label key={aspect} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 px-2 py-1 rounded">
                          <input
                            type="checkbox"
                            checked={multiVerbFilters.aspect.includes(aspect as VerbFilterAspect)}
                            onChange={() => {
                              const newAspect = toggleMultiFilter(multiVerbFilters.aspect, aspect as VerbFilterAspect);
                              applyMultiVerbFiltersAndSearch({ ...multiVerbFilters, aspect: newAspect });
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
                          type="checkbox"
                          checked={multiVerbFilters.mood.includes('all')}
                          onChange={() => {
                            const newMood = toggleMultiFilter(multiVerbFilters.mood, 'all');
                            applyMultiVerbFiltersAndSearch({ ...multiVerbFilters, mood: newMood });
                          }}
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                        />
                        <span className="font-medium">All</span>
                      </label>
                      {['indicative', 'subjunctive', 'imperative', 'ability'].map((mood) => (
                        <label key={mood} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 px-2 py-1 rounded">
                          <input
                            type="checkbox"
                            checked={multiVerbFilters.mood.includes(mood as VerbFilterMood)}
                            onChange={() => {
                              const newMood = toggleMultiFilter(multiVerbFilters.mood, mood as VerbFilterMood);
                              applyMultiVerbFiltersAndSearch({ ...multiVerbFilters, mood: newMood });
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
            {(relatedForms?.posGuess === 'noun' && relatedForms.nouns && relatedForms.nouns.length > 0) ||
             (!relatedForms && !isDefaultNounFilter(nounFilters)) && (
              <div className="p-4 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Filter by noun inflection {!isDefaultNounFilter(nounFilters) && '(Active)'}:
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
            {((relatedForms?.posGuess === 'adjective' || relatedForms?.posGuess === 'adj') && relatedForms.other && relatedForms.other.length > 0) ||
             (!relatedForms && !isDefaultAdjectiveFilter(adjectiveFilters)) && (
              <div className="p-4 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Filter by adjective inflection {!isDefaultAdjectiveFilter(adjectiveFilters) && '(Active)'}:
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

          {/* Anki Export Button */}
          {isAnkiMode && results.length > 0 && (
            <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-green-800 dark:text-green-300">
                    📚 Export to Anki
                  </h3>
                  <p className="text-sm text-green-600 dark:text-green-400">
                    Create flashcards with audio for {results.length} results
                  </p>
                </div>
                <button
                  onClick={exportToAnki}
                  disabled={isExportingAnki || results.length === 0}
                  className={`px-4 py-2 rounded-md font-medium transition-colors ${
                    isExportingAnki
                      ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                      : 'bg-green-600 hover:bg-green-700 text-white'
                  }`}
                >
                  {isExportingAnki ? 'Exporting...' : '📥 Export Deck'}
                </button>
              </div>
            </div>
          )}

          {/* Results List */}
          <ResultsList
            results={filteredResults}
            audioMap={activeTranslation === 'afghan2023' ? audioMap : yousafzaiAudioMap}
            loading={isLoading}
            processed={processed}
            verbFilters={verbFilters}
            multiVerbFilters={multiVerbFilters}
            activeVariantForms={activeVariantForms}
            onResetFilters={() => {
              setMultiVerbFilters({ ...DEFAULT_MULTI_VERB_FILTER });
              setVerbFilters({ ...DEFAULT_VERB_FILTER });
              setNounFilters({ ...DEFAULT_NOUN_FILTER });
              setAdjectiveFilters({ ...DEFAULT_ADJECTIVE_FILTER });
            }}
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
            selectedBooks={bookFilter}
            onClearFilters={() => setBookFilter([])}
            resultsCount={results.length}
            filteredCount={bookFilter.length > 0 ? filteredResults.length : undefined}
            audioMap={activeTranslation === 'afghan2023' ? audioMap : yousafzaiAudioMap}
          />
        </div>
      </div>
        </>
      )}

      {/* Lexicon Tab */}
      {activeMainTab === 'lexicon' && (
        <div className="max-w-4xl mx-auto">
          <LexiconPanel onPickForm={(form) => {
            setQuery(form);
            setActiveMainTab('search');
          }} />
        </div>
      )}

      {/* Videos/Audio Tab */}
      {activeMainTab === 'videos' && (
        <div className="max-w-6xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              🎵 Videos/Audio
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              YouTube videos with searchable Pashto transcripts
            </p>
            
            {/* Video Upload Section */}
            <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
                🎬 Process New Video
              </h3>
              <div className="space-y-3">
                <div>
                  <input
                    type="url"
                    value={newVideoUrl}
                    onChange={(e) => setNewVideoUrl(e.target.value)}
                    placeholder="Enter YouTube URL (e.g., https://www.youtube.com/watch?v=...)"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={processingVideo}
                  />
                </div>
                <button
                  onClick={processNewVideo}
                  disabled={processingVideo || !newVideoUrl.trim()}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors disabled:cursor-not-allowed"
                >
                  {processingVideo ? 'Processing...' : 'Process Video'}
                </button>
                
                {processingStatus && (
                  <div className="mt-3 p-3 bg-gray-100 dark:bg-gray-800 rounded border">
                    <pre className="text-sm text-gray-900 dark:text-gray-100 whitespace-pre-wrap">
                      {processingStatus}
                    </pre>
                  </div>
                )}
              </div>
            </div>
            
            {/* Transcript Search */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
                🔍 Search Transcripts
              </h3>
              <div className="relative">
                <input
                  type="text"
                  value={transcriptSearchQuery}
                  onChange={handleTranscriptSearchChange}
                  placeholder="Enter Pashto text to search in video transcripts..."
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {loadingTranscripts && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  </div>
                )}
              </div>
              
              {/* Search Results */}
              {transcriptResults.length > 0 && (
                <div className="mt-4 space-y-3">
                  <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
                    <p className="text-green-800 dark:text-green-300 font-medium">
                      Found {transcriptResults.length} matching segments
                    </p>
                  </div>
                  
                  {transcriptResults.map((result, index) => (
                    <div key={result.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                        {result.verse_reference}
                      </h4>
                      <div className="mb-3">
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                          Audio: {result.audio_filename} • Duration: {result.duration_seconds}s
                        </p>
                        <div className="bg-white dark:bg-gray-800 rounded border p-3 max-h-32 overflow-y-auto">
                          <p className="text-gray-900 dark:text-gray-100 text-sm leading-relaxed">
                            {result.transcript}
                          </p>
                        </div>
                      </div>
                      <audio controls className="w-full">
                        <source src={`/api/audio-clips/${result.audio_filename}`} type="audio/wav" />
                        Your browser does not support the audio element.
                      </audio>
                    </div>
                  ))}
                </div>
              )}
              
              {transcriptSearchQuery && transcriptResults.length === 0 && !loadingTranscripts && (
                <div className="mt-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
                  <p className="text-yellow-800 dark:text-yellow-300">
                    No matching transcripts found for "{transcriptSearchQuery}"
                  </p>
                </div>
              )}
            </div>
            
            {/* Videos Section */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
                📺 YouTube Videos with Transcripts
              </h3>
            
            {loadingVideos ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-gray-500 dark:text-gray-400">Loading videos...</p>
              </div>
            ) : videos.length > 0 ? (
              <div className="space-y-6">
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                  <p className="text-green-800 dark:text-green-300">
                    Found {videos.length} video{videos.length !== 1 ? 's' : ''} with transcripts
                  </p>
                </div>
                
                {videos.map((video, index) => (
                  <div key={video.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                    <div className="mb-4">
                      <h4 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                        {video.title}
                      </h4>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                        <span>{video.totalSegments} segments</span>
                        <span>{Math.round(video.totalDuration / 60)} minutes total</span>
                        <a 
                          href={video.youtubeUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          View on YouTube →
                        </a>
                      </div>
                    </div>
                    
                    {/* YouTube Embed */}
                    <div className="mb-6">
                      <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                        <iframe
                          className="absolute top-0 left-0 w-full h-full rounded-lg"
                          src={`https://www.youtube.com/embed/${video.id}`}
                          title={video.title}
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        ></iframe>
                      </div>
                    </div>
                    
                    {/* Video Segments with Transcripts */}
                    <div className="space-y-4">
                      <h5 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                        Video Segments & Transcripts
                      </h5>
                      
                      {video.segments.map((segment: any, segIndex: number) => (
                        <div key={segIndex} className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                          <div className="flex items-center justify-between mb-3">
                            <h6 className="font-medium text-gray-900 dark:text-gray-100">
                              {segment.type === 'sentence' 
                                ? `Segment ${segment.segmentNumber}, Sentence ${segment.sentenceNumber}`
                                : `Segment ${segment.segmentNumber}`
                              }
                            </h6>
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                              {Math.floor(segment.startTime / 60)}:{(segment.startTime % 60).toString().padStart(2, '0')} - 
                              {Math.floor(segment.endTime / 60)}:{(segment.endTime % 60).toString().padStart(2, '0')}
                              {segment.type === 'sentence' && (
                                <span className="ml-2 px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded">
                                  {segment.duration}s
                                </span>
                              )}
                            </div>
                          </div>
                          
                          {/* Transcript */}
                          <div className="mb-3">
                            <div className="bg-gray-50 dark:bg-gray-900 rounded border p-3 max-h-40 overflow-y-auto">
                              <p className="text-gray-900 dark:text-gray-100 text-sm leading-relaxed">
                                {segment.transcript}
                              </p>
                            </div>
                            <div className="mt-2 flex justify-end">
                              <button
                                onClick={() => retranscribeSegment(segment.audioFilename, segIndex)}
                                disabled={retranscribingSegments.has(segIndex)}
                                className="px-3 py-1 text-xs bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded hover:bg-yellow-200 dark:hover:bg-yellow-800 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                {retranscribingSegments.has(segIndex) ? 'Re-transcribing...' : 'Re-run Transcription'}
                              </button>
                            </div>
                          </div>
                          
                          {/* Audio Player */}
                          <audio controls className="w-full">
                            <source src={`/api/audio-clips/${segment.audioFilename}`} type="audio/wav" />
                            Your browser does not support the audio element.
                          </audio>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <p className="text-blue-800 dark:text-blue-300">
                  No videos found. Please process YouTube videos first.
                </p>
                <div className="mt-4 text-sm text-blue-600 dark:text-blue-400">
                  <p>To process videos:</p>
                  <ol className="list-decimal list-inside mt-2 space-y-1">
                    <li>Install dependencies: <code className="bg-blue-100 dark:bg-blue-800 px-1 rounded">./setup_audio_processing.sh</code></li>
                    <li>Run processor: <code className="bg-blue-100 dark:bg-blue-800 px-1 rounded">python3 youtube_audio_processor.py --elevenlabs-key YOUR_API_KEY</code></li>
                  </ol>
                </div>
              </div>
            )}
            </div>
          </div>
        </div>
      )}

      {/* Poems Tab */}
      {activeMainTab === 'poems' && (
        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              📝 Poems
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Transcribed Pashto text from audio clips
            </p>
            
            {loadingPoems ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
                <p className="mt-2 text-gray-500 dark:text-gray-400">Loading poems...</p>
              </div>
            ) : poems.length > 0 ? (
              <div className="space-y-4">
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                  <p className="text-green-800 dark:text-green-300">
                    Found {poems.length} poems
                  </p>
                </div>
                
                {poems.map((poem, index) => (
                  <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">
                      {poem.name}
                    </h3>
                    <div className="bg-white dark:bg-gray-800 rounded border p-4 max-h-64 overflow-y-auto">
                      <pre className="whitespace-pre-wrap text-gray-900 dark:text-gray-100 font-medium leading-relaxed">
                        {poem.content}
                      </pre>
                    </div>
                    <div className="mt-3 flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
                      <span>{poem.length} characters</span>
                      <span>Created: {new Date(poem.created).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                <p className="text-green-800 dark:text-green-300">
                  No poems found. Please transcribe audio clips first.
                </p>
                <div className="mt-4 text-sm text-green-600 dark:text-green-400">
                  <p>To create poems:</p>
                  <ol className="list-decimal list-inside mt-2 space-y-1">
                    <li>Install dependencies: <code className="bg-green-100 dark:bg-green-800 px-1 rounded">./setup_audio_processing.sh</code></li>
                    <li>Run processor: <code className="bg-green-100 dark:bg-green-800 px-1 rounded">python3 youtube_audio_processor.py --elevenlabs-key YOUR_API_KEY</code></li>
                  </ol>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
