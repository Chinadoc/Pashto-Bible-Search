"use client";

import { useEffect, useState, useMemo, useCallback, useRef, ChangeEvent } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { debounce, optimizedFilter } from "./utils/debounce";
import ResultsList from "../components/ResultsList";
import LexiconPanel from "../components/LexiconPanel";
import VideosPanel from "../components/VideosPanel";
import InlineFrequency from "../components/InlineFrequency";
import CoverageSidebar from "../components/CoverageSidebar";
import VariantDetailsPanel from "../components/VariantDetailsPanel";
import ChapterNavigator from "../components/ChapterNavigator";
import ChapterView from "../components/ChapterView";
import TopicsBrowser from "../components/TopicsBrowser";
import DictionaryDisambiguation from "../components/DictionaryDisambiguation";
import WordAlternativeUses from "../components/WordAlternativeUses";
import { useSearchFilters } from "./contexts/SearchFiltersContext";
import SearchHeader from "../components/SearchHeader";
import ResultsPane from "../components/ResultsPane";
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
  InflectionReasonFilter,
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
  inflectionReason: 'all',
};

const DEFAULT_ADJECTIVE_FILTER: AdjectiveFilterState = {
  inflectionType: 'all',
  gender: 'all',
};

const MAIN_TABS = ['search', 'topics', 'chapters', 'lexicon', 'videos', 'poems'] as const;
type MainTab = typeof MAIN_TABS[number];

const PERSON_VALUES: VerbFilterPerson[] = ['all', '1st', '2nd', '3rd'];
const TENSE_VALUES: VerbFilterTense[] = ['all', 'present', 'past', 'future', 'perfect', 'subjunctive', 'imperative', 'ability', 'habitual'];
const ASPECT_VALUES: VerbFilterAspect[] = ['all', 'imperfective', 'perfective'];
const MOOD_VALUES: VerbFilterMood[] = ['all', 'indicative', 'subjunctive', 'imperative', 'ability'];

const NOUN_INFLECTION_VALUES: NounInflectionType[] = ['all', 'plain', '1st', '2nd', 'plural', 'vocative', 'bundled'];
const GENDER_VALUES: NounGender[] = ['all', 'masculine', 'feminine'];
const INFLECTION_REASON_VALUES: InflectionReasonFilter[] = ['all', 'plural', 'sandwich', 'transitive_past'];

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

function matchesPersonMulti(label: string, persons: string[]): boolean {
  // Filter out 'all' - if only 'all' remains or array is empty, return true
  const personValues = persons.filter(p => p !== 'all');
  if (personValues.length === 0) return true;
  
  // Check if label matches any of the selected persons
  return personValues.some(person => {
    const patterns = PERSON_PATTERNS[person as VerbFilterPerson];
    if (!patterns?.length) return true;
    return patterns.some((pattern) => label.toLowerCase().includes(pattern.toLowerCase()));
  });
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

function filterVerbVariantsMulti(
  verbs: RelatedFormVariant[] | undefined,
  multiFilters: MultiVerbFilterState
): RelatedFormVariant[] {
  if (!verbs?.length) {
    console.warn(`⚠️ [FILTER] No verbs provided to filterVerbVariantsMulti`);
    return [];
  }
  
  console.log(`🔍 [FILTER] Starting filterVerbVariantsMulti with ${verbs.length} verbs`, {
    filters: multiFilters,
    sampleVerbs: verbs.slice(0, 5).map(v => ({ form: v.form, label: v.label })),
  });
  
  // Only filter by person - ignore tense/aspect/mood
  const person = Array.isArray(multiFilters.person) ? multiFilters.person : ['all'];
  const personValues = person.filter(p => p !== 'all');
  
  console.log(`🔍 [FILTER] Filter values (person only):`, {
    personValues,
  });
  
  const labelFilter = (variant: RelatedFormVariant) => {
    const label = normalizeLabel(variant.label);
    
    // Only check person filter - ignore tense/aspect/mood
    const personMatch = personValues.length === 0 || matchesPersonMulti(label, person);

    const matches = personMatch;
    
    // Only log first few to avoid spam
    if (verbs.indexOf(variant) < 5) {
      console.log(`🔍 [FILTER] Variant "${variant.form}" (label: "${variant.label}" → "${label}")`, {
        personMatch,
        matches,
      });
    }

    return matches;
  };

  const filtered = verbs.filter(labelFilter);
  console.log(`✅ [FILTER] Filtered ${verbs.length} verb variants down to ${filtered.length}`, {
    filters: multiFilters,
    filteredForms: filtered.slice(0, 10).map(v => ({ form: v.form, label: v.label })),
  });
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
  const person = Array.isArray(filters.person) ? filters.person : ['all'];
  const tense = Array.isArray(filters.tense) ? filters.tense : ['all'];
  const aspect = Array.isArray(filters.aspect) ? filters.aspect : ['all'];
  const mood = Array.isArray(filters.mood) ? filters.mood : ['all'];
  
  return (
    person.length === 1 && person[0] === 'all' &&
    tense.length === 1 && tense[0] === 'all' &&
    aspect.length === 1 && aspect[0] === 'all' &&
    mood.length === 1 && mood[0] === 'all'
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
  // If 'all' is included or array is empty, return 'all'
  // Otherwise, if multiple values are selected, we need to filter for any of them
  // For now, we'll use the first non-'all' value, but the actual filtering should handle multiple values
  const personValues = multiFilters.person.filter(p => p !== 'all');
  const tenseValues = multiFilters.tense.filter(t => t !== 'all');
  const aspectValues = multiFilters.aspect.filter(a => a !== 'all');
  const moodValues = multiFilters.mood.filter(m => m !== 'all');
  
  return {
    person: multiFilters.person.includes('all') || personValues.length === 0 ? 'all' : personValues[0] as VerbFilterPerson,
    tense: multiFilters.tense.includes('all') || tenseValues.length === 0 ? 'all' : tenseValues[0] as VerbFilterTense,
    aspect: multiFilters.aspect.includes('all') || aspectValues.length === 0 ? 'all' : aspectValues[0] as VerbFilterAspect,
    mood: multiFilters.mood.includes('all') || moodValues.length === 0 ? 'all' : moodValues[0] as VerbFilterMood,
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

function matchesInflectionReason(
  variant: RelatedFormVariant,
  reason: InflectionReasonFilter
): boolean {
  if (reason === 'all') return true;
  if (!variant.inflectionReasons) return false;
  
  const reasons = variant.inflectionReasons;
  
  if (reason === 'plural') return reasons.plural > 0;
  if (reason === 'sandwich') return reasons.sandwich > 0;
  if (reason === 'transitive_past') return reasons.transitive_past > 0;
  
  return true;
}

function filterNounVariants(
  nouns: RelatedFormVariant[] | undefined,
  filters: NounFilterState
): RelatedFormVariant[] {
  if (!nouns?.length) return [];
  
  const filtered = nouns.filter((variant) => {
    const label = normalizeLabel(variant.label);
    const inflectionTypeMatch = matchesNounInflectionType(label, filters.inflectionType);
    const genderMatch = matchesGender(label, filters.gender);
    const reasonMatch = filters.inflectionReason 
      ? matchesInflectionReason(variant, filters.inflectionReason)
      : true;
    
    return inflectionTypeMatch && genderMatch && reasonMatch;
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
    const inflectionTypeMatch = matchesNounInflectionType(label, filters.inflectionType);
    const genderMatch = matchesGender(label, filters.gender);
    
    return inflectionTypeMatch && genderMatch;
  });

  return filtered;
}

function isDefaultNounFilter(filters: NounFilterState): boolean {
  return filters.inflectionType === 'all' && filters.gender === 'all' && (filters.inflectionReason === 'all' || !filters.inflectionReason);
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
  isLoading,
  multiVerbFilters,
  setMultiVerbFilters,
  nounFilters,
  setNounFilters
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
  multiVerbFilters?: MultiVerbFilterState;
  setMultiVerbFilters?: (filters: MultiVerbFilterState) => void;
  nounFilters?: NounFilterState;
  setNounFilters?: (filters: NounFilterState) => void;
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
        </div>

        <button
          onClick={refreshAudioMap}
          disabled={isLoading}
          className="px-3 py-1 text-xs bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded border disabled:opacity-50"
          title="Refresh audio URLs (get latest Supabase Storage URLs)"
        >
          🔄 Audio
        </button>

        {/* Inflection Filters (for nouns/adjectives) */}
        {includeRelated && nounFilters && setNounFilters && (
          <div className="flex flex-wrap items-center gap-3 p-2 bg-purple-50 dark:bg-purple-900/20 rounded-md border border-purple-200 dark:border-purple-800">
            <span className="text-xs font-semibold text-purple-800 dark:text-purple-200">Inflection Filters:</span>
            <div className="flex items-center gap-2">
              <label className="text-xs text-gray-700 dark:text-gray-300">Type:</label>
              <select
                value={nounFilters.inflectionType}
                onChange={(e) => setNounFilters({ ...nounFilters, inflectionType: e.target.value as NounInflectionType })}
                className="px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700"
              >
                <option value="all">All</option>
                <option value="plain">Plain/Base</option>
                <option value="1st">1st Inflection</option>
                <option value="2nd">2nd Inflection</option>
                <option value="plural">Plural</option>
                <option value="vocative">Vocative</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs text-gray-700 dark:text-gray-300">Reason:</label>
              <select
                value={nounFilters.inflectionReason || 'all'}
                onChange={(e) => setNounFilters({ ...nounFilters, inflectionReason: e.target.value as InflectionReasonFilter })}
                className="px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700"
              >
                <option value="all">All</option>
                <option value="plural">Plural</option>
                <option value="sandwich">Sandwich</option>
                <option value="transitive_past">Transitive Past</option>
              </select>
            </div>
          </div>
        )}

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

export default function ClientHome({ initialQuery }: { initialQuery?: string } = {}) {
  const [results, setResults] = useState<Verse[]>([]);
  const [coverage, setCoverage] = useState<CoverageItem[]>([]);
  const [totalEstimatedCount, setTotalEstimatedCount] = useState<number | undefined>();
  const [hasMoreResults, setHasMoreResults] = useState(false);
  const [dictionaryData, setDictionaryData] = useState<{
    entries: Array<{ pashto: string; romanized?: string | null; pos?: string | null; english?: string | null; ts?: number | null }>;
    groupedByPos: Record<string, any[]>;
    needsDisambiguation: boolean;
  } | undefined>();
  const [audioMap, setAudioMap] = useState<AudioMap>({});
  const [yousafzaiAudioMap, setYousafzaiAudioMap] = useState<AudioMap>({});
  const [activeTranslation, setActiveTranslation] = useState<'afghan2023' | 'yousafzai2019' | 'unified'>('afghan2023');
  const pathname = usePathname();
  const router = useRouter();
  
  // Determine active tab from pathname
  const getActiveTabFromPath = (path: string): MainTab => {
    if (path === '/topics') return 'topics';
    if (path === '/chapters') return 'chapters';
    if (path === '/lexicon') return 'lexicon';
    if (path === '/videos') return 'videos';
    if (path === '/poems') return 'poems';
    return 'search'; // default to search
  };
  
  const activeMainTab = getActiveTabFromPath(pathname || '/search');
  const [selectedBook, setSelectedBook] = useState<string | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<number | null>(null);
  const [poems, setPoems] = useState<any[]>([]);

  const [loadingPoems, setLoadingPoems] = useState(false);
  const [scope, setScope] = useState<Scope>('all');
  const [includeRelated, setIncludeRelated] = useState<boolean>(true);
  const [enableFuzzy, setEnableFuzzy] = useState<boolean>(false);
  const [bookFilter, setBookFilter] = useState<string[]>([]);
  const [relatedForms, setRelatedForms] = useState<RelatedFormsData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const abortControllerRef = useRef<AbortController | null>(null);

  // Client-side cache for instant loading
  const clientCacheRef = useRef<Map<string, any>>(new Map());

  // Client-side cache functions
  const getClientCachedSearch = useCallback((cacheKey: string) => {
    const cached = clientCacheRef.current.get(cacheKey);
    if (cached && (Date.now() - cached.timestamp) < 3600000) { // 1 hour TTL
      console.log('⚡ Client cache hit:', cacheKey);
      return cached.data;
    }
    if (cached) {
      clientCacheRef.current.delete(cacheKey);
    }
    return null;
  }, []);

  const setClientCachedSearch = useCallback((cacheKey: string, data: any) => {
    clientCacheRef.current.set(cacheKey, {
      data,
      timestamp: Date.now()
    });
    console.log('💾 Stored in client cache:', cacheKey);
  }, []);
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

  // Remove verbFilters - use only multiVerbFilters
  // const [verbFilters, setVerbFilters] = useState<VerbFilterState>({ ...DEFAULT_VERB_FILTER }); // REMOVED
  const { filters, dispatch, toAPIPayload } = useSearchFilters();
  const multiVerbFilters = filters.verb;
  const nounFilters = filters.noun;
  const adjectiveFilters = filters.adjective;
  const selectedPartOfSpeech = filters.pos.selected.length > 0 
    ? (filters.pos.selected[0] as 'verb' | 'noun' | 'adjective')
    : 'auto';
  
  const setMultiVerbFilters = (newFilters: MultiVerbFilterState) => {
    dispatch({ type: 'SET_VERB_FILTERS', filters: newFilters });
  };
  
  const setNounFilters = (newFilters: NounFilterState) => {
    dispatch({ type: 'SET_NOUN_FILTERS', filters: newFilters });
  };
  
  const setAdjectiveFilters = (newFilters: AdjectiveFilterState) => {
    dispatch({ type: 'SET_ADJECTIVE_FILTERS', filters: newFilters });
  };
  
  const setSelectedPartOfSpeech = (pos: 'auto' | 'verb' | 'noun' | 'adjective') => {
    if (pos === 'auto') {
      dispatch({ type: 'CLEAR_POS_FILTERS' });
    } else {
      dispatch({ type: 'SET_POS_FILTER', pos: [pos] });
    }
  };
  const [variantsOverride, setVariantsOverride] = useState<string[] | null>(null);
  const [activeVariantForms, setActiveVariantForms] = useState<string[]>([]);
  const [searchLanguage, setSearchLanguage] = useState<SearchLanguage>('pashto');
  const [query, setQuery] = useState<string>(initialQuery || '');
  const variantKeyRef = useRef<string>('');
  const isQueryChangingRef = useRef<boolean>(false);
  const translationEffectGuard = useRef<boolean>(true);
  const initialQueryHandledRef = useRef<boolean>(false);

  // Auto-update selectedPartOfSpeech when posGuess is detected
  useEffect(() => {
    if (selectedPartOfSpeech === 'auto' && relatedForms?.posGuess) {
      // Auto-detect and set the part of speech based on posGuess
      const detectedPos = relatedForms.posGuess.toLowerCase();
      if (detectedPos === 'verb' || detectedPos === 'v' || detectedPos.startsWith('verb')) {
        setSelectedPartOfSpeech('verb');
      } else if (detectedPos === 'noun' || detectedPos === 'n' || detectedPos.startsWith('noun')) {
        setSelectedPartOfSpeech('noun');
      } else if (detectedPos === 'adjective' || detectedPos === 'adj' || detectedPos.startsWith('adjective')) {
        setSelectedPartOfSpeech('adjective');
      }
    }
  }, [relatedForms?.posGuess, selectedPartOfSpeech]);

  // Unified filter application function - handles all parts of speech
  // NOTE: Uses executeSearchRef to avoid dependency issues
  const executeSearchRef = useRef<((opts?: { overrideVariants?: string[] | null; languageOverride?: SearchLanguage; preserveResults?: boolean; reason?: string; limit?: number }) => Promise<void>) | null>(null);
  
  const applyFiltersAndSearch = useCallback((
    pos: 'verb' | 'noun' | 'adjective',
    filters: MultiVerbFilterState | NounFilterState | AdjectiveFilterState
  ) => {
    if (!includeRelated) {
      console.log('Related forms mode not active, filters ignored');
      return;
    }

    let filteredVariants: RelatedFormVariant[] = [];
    let forms: string[] = [];

    if (pos === 'verb') {
      const verbFilters = filters as MultiVerbFilterState;
      setMultiVerbFilters(verbFilters);
      
      if (!relatedForms?.verbs?.length) {
        console.log('Verb filters updated, awaiting related forms to refetch results');
        return;
      }

      filteredVariants = filterVerbVariantsMulti(relatedForms.verbs, verbFilters);
      forms = formsFromVariants(filteredVariants);

      if (isDefaultMultiVerbFilter(verbFilters)) {
        // Reset to all forms
        setVariantsOverride(null);
        setActiveVariantForms(relatedForms?.forms?.verbs?.map(v => v.form) || []);
        if (executeSearchRef.current) {
          executeSearchRef.current({ preserveResults: false, reason: 'filter-reset' });
        }
        return;
      }
    } else if (pos === 'noun') {
      const nounFilters = filters as NounFilterState;
      setNounFilters(nounFilters);
      
      if (!relatedForms?.nouns?.length) {
        console.log('Noun filters updated, awaiting related forms to refetch results');
        return;
      }

      filteredVariants = filterNounVariants(relatedForms.nouns, nounFilters);
      forms = formsFromVariants(filteredVariants);
    } else if (pos === 'adjective') {
      const adjectiveFilters = filters as AdjectiveFilterState;
      setAdjectiveFilters(adjectiveFilters);
      
      if (!relatedForms?.other?.length) {
        console.log('Adjective filters updated, awaiting related forms to refetch results');
        return;
      }

      filteredVariants = filterAdjectiveVariants(relatedForms.other, adjectiveFilters);
      forms = formsFromVariants(filteredVariants);
    }

    // If no forms match the filters, show no results
    if (forms.length === 0) {
      setResults([]);
      setCoverage([]);
      setVariantsOverride([]);
      setActiveVariantForms([]);
      return;
    }

    // Always trigger new search with filtered forms
    console.log(`🔄 [CLIENT] ${pos} filter applied, searching for ${forms.length} filtered forms:`, forms.slice(0, 10));
    console.log(`🔄 [CLIENT] Filtered variants:`, {
      before: pos === 'verb' ? relatedForms?.verbs?.length : pos === 'noun' ? relatedForms?.nouns?.length : relatedForms?.other?.length,
      after: filteredVariants.length,
      filterApplied: filters,
    });
    variantKeyRef.current = forms.join('|');
    setVariantsOverride(forms);
    setActiveVariantForms(forms);
    if (executeSearchRef.current) {
      console.log(`🔄 [CLIENT] Calling executeSearch with overrideVariants:`, forms.slice(0, 10));
      executeSearchRef.current({ overrideVariants: forms, preserveResults: false, reason: `${pos}-filter` });
    }
  }, [includeRelated, relatedForms]);

  // Trigger search when multiVerbFilters change
  const previousMultiVerbFilters = useRef<MultiVerbFilterState>(multiVerbFilters);
  useEffect(() => {
    if (includeRelated && relatedForms && query.trim()) {
      const filtersChanged = JSON.stringify(previousMultiVerbFilters.current) !== JSON.stringify(multiVerbFilters);
      if (filtersChanged) {
        applyFiltersAndSearch('verb', multiVerbFilters);
      }
    }
    previousMultiVerbFilters.current = multiVerbFilters;
  }, [multiVerbFilters.person, multiVerbFilters.tense, multiVerbFilters.aspect, multiVerbFilters.mood, includeRelated, relatedForms, query, applyFiltersAndSearch]);

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
    // Filters are now loaded automatically by SearchFiltersContext from localStorage
    const savedLanguage = loadPersisted<SearchLanguage>('searchLanguage', 'pashto');
    setSearchLanguage(savedLanguage === 'english' ? 'english' : 'pashto');
  }, []);

  // Trigger initial search when an initialQuery is provided (e.g., navigating from Results → Lexicon)

  // Persist preferences when they change
  useEffect(() => {
    // Don't persist filters during query changes to prevent stale state
    if (isQueryChangingRef.current) {
      console.log('Skipping filter persistence during query change');
      return;
    }
    
    // Filters are now persisted automatically by SearchFiltersContext
    // No need to manually save here
  }, [scope, includeRelated, multiVerbFilters, nounFilters, adjectiveFilters, searchLanguage]);


  // Clear any problematic initial values on mount
  useEffect(() => {
    if (query === 'ldsoc') {
      setQuery('');
    }
  }, []);

  // Load audio map data for both translations
  // Audio is now handled entirely by D1/R2 via Cloudflare Worker
  // No need to load audio maps anymore
  useEffect(() => {
    // Audio maps are no longer needed - all audio comes from D1/R2
    setAudioMap({});
    setYousafzaiAudioMap({});
  }, []);

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




  // Transcript search state
  const [transcriptSearchQuery, setTranscriptSearchQuery] = useState('');
  const [transcriptResults, setTranscriptResults] = useState<any[]>([]);
  const [loadingTranscripts, setLoadingTranscripts] = useState(false);


  // Transcript search function
  const searchTranscripts = async (query: string) => {
    if (!query.trim()) {
      setTranscriptResults([]);
      return;
    }

    setLoadingTranscripts(true);
    try {
      const response = await fetch('/api/search-transcripts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query })
      });
      const data = await response.json();
      setTranscriptResults(data.results || []);
    } catch (error) {
      console.error('Transcript search error:', error);
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
    const currentAudioMap = activeTranslation === 'unified' 
      ? { ...audioMap, ...yousafzaiAudioMap }
      : (activeTranslation === 'afghan2023' ? audioMap : yousafzaiAudioMap);
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
          const yousafzaiResponse = await fetch('/api/get_yousafzai_aud?clear_cache=1');
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
        const yousafzaiResponse = await fetch('/api/get_yousafzai_aud?clear_cache=1');
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
  }, [coverageData, setCoverage]);

  const executeSearch = useCallback(async (
    opts: {
      overrideVariants?: string[] | null;
      languageOverride?: SearchLanguage;
      preserveResults?: boolean;
      reason?: string;
      limit?: number; // Add limit parameter
    } = {}
  ) => {
    const normalizedQuery = query.trim();
    if (!normalizedQuery) {
      console.log('DEBUG: Empty query, not searching');
      return;
    }

    // Cancel any ongoing search
    if (abortControllerRef.current) {
      console.log('🔄 Cancelling previous search');
      abortControllerRef.current.abort();
    }

    // Create new abort controller for this search
    abortControllerRef.current = new AbortController();

    const {
      overrideVariants,
      languageOverride,
      preserveResults = false,
      reason = 'manual',
      limit = 2000, // Default to 2000, but can be overridden (e.g., 10 for typing)
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

    // Generate cache key for client-side caching
    const searchParams: any = {
      query: normalizedQuery,
      scope,
      includeRelated,
      enableFuzzy,
      bookFilter,
      language: languageOverride ?? searchLanguage,
      translation: activeTranslation === 'unified' ? undefined : activeTranslation,
      limit: limit, // Pass limit to API
    };

    if (variantsPayload) {
      searchParams.variants = variantsPayload;
    }

    const variantsString = variantsPayload ? variantsPayload.sort().join(',') : 'none';
    const cacheKey = `${normalizedQuery}:${scope}:${includeRelated}:${enableFuzzy}:${languageOverride ?? searchLanguage}:${activeTranslation}:${variantsString}`;

    // Check client-side cache first (ultra-fast)
    const clientCachedResult = getClientCachedSearch(cacheKey);
    if (clientCachedResult) {
      console.log('⚡ Client cache hit, returning instantly');
      setResults(clientCachedResult.results || []);
      setRelatedForms(clientCachedResult.relatedForms ? {
        ...clientCachedResult.relatedForms,
        searchedForm: clientCachedResult.searchedForm,
      } : null);
      setProcessed(clientCachedResult.processed ? {
        ...clientCachedResult.processed,
        searchedForm: clientCachedResult.searchedForm,
      } : null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError('');
    if (!preserveResults) {
      setResults([]);
      setCoverage([]);
      setRelatedForms(null);
      
      // Reset filters when starting a new search (manual or query change)
      if (reason === 'manual' || reason === 'query') {
        console.log('🔄 Resetting filters for new search');
        dispatch({ type: 'RESET_VERB_FILTERS' });
        dispatch({ type: 'RESET_NOUN_FILTERS' });
        dispatch({ type: 'RESET_ADJECTIVE_FILTERS' });
        dispatch({ type: 'RESET_POS_FILTERS' });
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
        translation: activeTranslation === 'unified' ? undefined : activeTranslation,
        ...toAPIPayload(),  // Include posFilters from context
      };

      if (variantsPayload) {
        searchParams.variants = variantsPayload;
      }

      const response = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(searchParams),
        signal: abortControllerRef.current?.signal,
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
        posGuess: searchData.relatedForms?.posGuess,
        verbFormsCount: searchData.relatedForms?.forms?.verbs?.length || 0,
        nounFormsCount: searchData.relatedForms?.forms?.nouns?.length || 0,
      });

      setResults(searchData.results || []);
      setTotalEstimatedCount(searchData.totalEstimatedCount);
      setHasMoreResults(searchData.hasMore || false);
      setDictionaryData(searchData.dictionary);
      setRelatedForms(searchData.relatedForms ? {
        ...searchData.relatedForms,
        searchedForm: searchData.searchedForm,
      } : null);
      
      // Log related forms structure for debugging
      if (searchData.relatedForms) {
        console.log(`✅ [CLIENT] Received relatedForms:`, {
          total: searchData.relatedForms.total,
          posGuess: searchData.relatedForms.posGuess,
          verbsCount: searchData.relatedForms.forms?.verbs?.length || 0,
          nounsCount: searchData.relatedForms.forms?.nouns?.length || 0,
          verbLabels: searchData.relatedForms.forms?.verbs?.slice(0, 5).map((v: any) => ({ form: v.form, label: v.label })),
        });
      } else {
        console.warn(`⚠️ [CLIENT] No relatedForms in API response`);
      }
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

      // Cache the successful result in client cache for instant future loading
      setClientCachedSearch(cacheKey, searchData);
      console.log('💾 Cached result in client cache for future instant loading');

    } catch (err) {
      // Don't show error for aborted searches
      if (err instanceof Error && err.name === 'AbortError') {
        console.log('🔄 Search was cancelled');
        return;
      }

      console.error('Search error:', err);
      
      // Check if error is a 500 or network error vs actual no results
      const isServerError = err instanceof Error && (
        err.message.includes('500') || 
        err.message.includes('Search failed') ||
        err.message.includes('fetch')
      );
      
      if (isServerError) {
        // Show user-friendly message instead of technical error
        setError('No results found. Try a different search term or check your connection.');
      } else {
        setError(err instanceof Error ? err.message : 'No results found');
      }
      
      if (!preserveResults) {
      setResults([]);
      setCoverage([]);
      setRelatedForms(null);
      setDictionaryData(undefined);
      }
      setProcessed(null);
    } finally {
      // Clear the abort controller when search completes
      if (abortControllerRef.current) {
        abortControllerRef.current = null;
      }
      setIsLoading(false);
    }
  }, [activeTranslation, bookFilter, enableFuzzy, includeRelated, query, scope, searchLanguage, variantsOverride]);

  // Update executeSearchRef after executeSearch is defined
  useEffect(() => {
    executeSearchRef.current = executeSearch;
  }, [executeSearch]);

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
    (opts?: { preserveResults?: boolean }) => executeSearch({ ...opts, reason: 'manual', limit: 2000 }), // Use limit 2000 on manual search
    [executeSearch]
  );

  useEffect(() => {
    if (translationEffectGuard.current) {
      translationEffectGuard.current = false;
      return;
    }
    if (!query.trim()) {
      return;
    }
    executeSearch({ preserveResults: false, reason: 'translation-switch' });
  }, [activeTranslation, executeSearch, query]);

  // Handle initial query when navigating from Results → Lexicon
  useEffect(() => {
    const trimmedInitial = (initialQuery || '').trim();
    if (!trimmedInitial) return;

    if (trimmedInitial !== query.trim()) {
      // Update query state to match the incoming initial query; regular query effect will handle searching.
      initialQueryHandledRef.current = false;
      setQuery(trimmedInitial);
      return;
    }

    if (!initialQueryHandledRef.current) {
      initialQueryHandledRef.current = true;
      executeSearch({ preserveResults: false, reason: 'initial-query' });
    }
  }, [initialQuery, query, executeSearch]);

  const applyMultiVerbFiltersAndSearch = useCallback((nextFilters: MultiVerbFilterState) => {
    applyFiltersAndSearch('verb', nextFilters);
  }, [applyFiltersAndSearch]);

  const applyNounFiltersAndSearch = useCallback((nextFilters: NounFilterState) => {
    applyFiltersAndSearch('noun', nextFilters);
  }, [applyFiltersAndSearch]);

  const applyAdjectiveFiltersAndSearch = useCallback((nextFilters: AdjectiveFilterState) => {
    // Always trigger new search - don't do client-side filtering
    applyFiltersAndSearch('adjective', nextFilters);
  }, [applyFiltersAndSearch]);

  // Trigger new search when Related Forms Mode is toggled (but only if we have a query)
  const previousIncludeRelated = useRef(includeRelated);
  useEffect(() => {
    // Only trigger if includeRelated actually changed (not on initial mount)
    if (previousIncludeRelated.current !== includeRelated && query.trim()) {
      console.log('DEBUG: Related Forms Mode toggled, triggering new search');
      // Reset variant override and filters when toggling related forms mode
      setVariantsOverride(null);
      setActiveVariantForms([]);
      setMultiVerbFilters({ ...DEFAULT_MULTI_VERB_FILTER });
      setNounFilters({ ...DEFAULT_NOUN_FILTER });
      setAdjectiveFilters({ ...DEFAULT_ADJECTIVE_FILTER });
      // Trigger search with updated includeRelated setting
      executeSearch({ overrideVariants: null, preserveResults: false, reason: 'include-related-toggle' });
    }
    previousIncludeRelated.current = includeRelated;
    // NOTE: Intentionally NOT including results.length to prevent infinite loop!
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [includeRelated, query, executeSearch]);

  // Re-run search automatically when language switches (if query present)
  const previousLanguage = useRef<SearchLanguage>(searchLanguage);
  useEffect(() => {
    if (previousLanguage.current !== searchLanguage && query.trim()) {
      console.log('DEBUG: Search language changed to', searchLanguage, '- refreshing results');
      setMultiVerbFilters({ ...DEFAULT_MULTI_VERB_FILTER });
      variantKeyRef.current = ''; // reset variant key to avoid stale matches
      setVariantsOverride(null);
      setActiveVariantForms([]);
      executeSearch({ overrideVariants: null, preserveResults: false, reason: 'language-toggle' });
    }
    previousLanguage.current = searchLanguage;
  }, [searchLanguage, query, executeSearch]);

  // Cleanup abort controller on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  // Trigger search when query changes (with debouncing)
  const previousQuery = useRef<string>(query);
  const debouncedSearch = useMemo(
    () => debounce((trimmedQuery: string) => {
      console.log('🔄 Query changed, triggering new search');
      // Cancel any ongoing search before starting new one
      if (abortControllerRef.current) {
        console.log('🔄 Cancelling previous search due to query change');
        abortControllerRef.current.abort();
      }
      // Set flag to prevent filter persistence during query change
      isQueryChangingRef.current = true;
      // Reset filters and variant forms when query changes to ensure fresh analysis
      console.log('Clearing variant forms for new query:', trimmedQuery);
      setMultiVerbFilters({ ...DEFAULT_MULTI_VERB_FILTER });
      setNounFilters({ ...DEFAULT_NOUN_FILTER });
      setAdjectiveFilters({ ...DEFAULT_ADJECTIVE_FILTER });
      // Reset part of speech selector to 'auto' so auto-detection can work
      setSelectedPartOfSpeech('auto');
      variantKeyRef.current = ''; // reset variant key to avoid stale matches
      setVariantsOverride(null);
      setActiveVariantForms([]);
      executeSearch({ preserveResults: false, reason: 'query', limit: 10 }); // Use limit 10 during typing
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

  // Topics mode - will be used for category browsing

  return (
    <div className={`w-full max-w-full mx-auto transition-colors duration-300 ${isEnglishMode ? 'bg-gradient-to-b from-orange-50 to-transparent dark:from-orange-950' : ''}`}>
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

      {/* Search Header - includes title, tabs, translation selector, and search bar */}
      <SearchHeader
        query={query}
        setQuery={setQuery}
        handleSearch={handleSearch}
        handleKeyPress={handleKeyPress}
        isLoading={isLoading}
        activeMainTab={activeMainTab}
        activeTranslation={activeTranslation}
        setActiveTranslation={setActiveTranslation}
        searchLanguage={searchLanguage}
        isEnglishMode={isEnglishMode}
      />

      {/* Main Content */}
      {activeMainTab === 'search' && (
        <>

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
            multiVerbFilters={multiVerbFilters}
            setMultiVerbFilters={setMultiVerbFilters}
            nounFilters={nounFilters}
            setNounFilters={setNounFilters}
          />

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-200 rounded">
              {error}
            </div>
          )}

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Results Pane */}
            <ResultsPane
              results={results}
              filteredResults={filteredResults}
              totalEstimatedCount={totalEstimatedCount}
              hasMoreResults={hasMoreResults}
              isLoading={isLoading}
              processed={processed}
              dictionaryData={dictionaryData}
              relatedForms={relatedForms}
              includeRelated={includeRelated}
              query={query}
              activeVariantForms={activeVariantForms}
              onPickForm={handlePickForm}
              audioMap={activeTranslation === 'unified' ? { ...audioMap, ...yousafzaiAudioMap } : (activeTranslation === 'afghan2023' ? audioMap : yousafzaiAudioMap)}
              multiVerbFilters={multiVerbFilters}
              onResetFilters={() => {
                dispatch({ type: 'RESET_VERB_FILTERS' });
                dispatch({ type: 'RESET_NOUN_FILTERS' });
                dispatch({ type: 'RESET_ADJECTIVE_FILTERS' });
                dispatch({ type: 'RESET_POS_FILTERS' });
              }}
            />

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
                audioMap={activeTranslation === 'unified' ? { ...audioMap, ...yousafzaiAudioMap } : (activeTranslation === 'afghan2023' ? audioMap : yousafzaiAudioMap)}
              />
            </div>
          </div>
        </>
      )}

      {/* Topics Tab */}
      {activeMainTab === 'topics' && (
        <div className="max-w-6xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              📚 Browse by Topics
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Click on a topic to see all Bible verses in that category.
            </p>
            
            <TopicsBrowser
              onCategorySelect={(categoryKey) => {
                // Category selection is handled internally by TopicsBrowser
              }}
            />
          </div>
        </div>
      )}

      {/* Chapters Tab */}
      {activeMainTab === 'chapters' && (
        <>
          {/* Translation Tabs */}
          <div className="flex justify-center mb-6">
            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-1 flex gap-1">
              <button
                onClick={() => setActiveTranslation('afghan2023')}
                className={`px-4 py-2 rounded-md font-medium transition-all duration-300 ${
                  activeTranslation === 'afghan2023'
                    ? 'bg-green-600 text-white shadow-lg transform scale-105 ring-2 ring-green-300'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                🇦🇫 Afghan 2023
              </button>
              <button
                onClick={() => setActiveTranslation('yousafzai2019')}
                className={`px-4 py-2 rounded-md font-medium transition-all duration-300 ${
                  activeTranslation === 'yousafzai2019'
                    ? 'bg-orange-500 text-white shadow-lg transform scale-105 ring-2 ring-orange-300'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                🕌 Yousafzai 2019
              </button>
            </div>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                📖 Browse by Chapter
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Select a book and chapter to view all verses with audio
              </p>

              <ChapterNavigator
              onChapterSelect={(book, chapter) => {
                setSelectedBook(book);
                setSelectedChapter(chapter);
              }}
            />

            {selectedBook && selectedChapter && (
              <div className="mt-6">
                <ChapterView
                  book={selectedBook}
                  chapter={selectedChapter}
                  translation={activeTranslation === 'unified' ? undefined : activeTranslation}
                />
              </div>
            )}
            </div>
          </div>
        </>
      )}

      {/* Lexicon Tab */}
      {activeMainTab === 'lexicon' && (
        <div className="w-full">
          <LexiconPanel 
            onPickForm={(form) => {
              setQuery(form);
              router.push('/search');
            }}
            queryProp={initialQuery || query}
          />
        </div>
      )}

      {/* Videos Tab */}
      {activeMainTab === 'videos' && (
        <div className="max-w-[95%] mx-auto">
          <VideosPanel
            onSelectClip={(clip) => {
              if (clip?.query) {
                setQuery(clip.query);
                router.push('/search');
              }
            }}
          />
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
