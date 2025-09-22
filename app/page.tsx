"use client";

import { useEffect, useState, useMemo, ChangeEvent } from "react";
import SearchBar from "../components/SearchBar";
import ResultsList from "../components/ResultsList";
import LexiconPanel from "../components/LexiconPanel";
import InlineFrequency from "../components/InlineFrequency";
import RelatedForms from "../components/RelatedForms";
import CoverageSidebar from "../components/CoverageSidebar";
import Tabs from "../components/Tabs";
import LinguisticAnalysis from "../components/LinguisticAnalysis";
import VariantDetailsPanel from "../components/VariantDetailsPanel";
import type { Verse, Scope, CoverageItem, AudioMap, PhraseResponse, Conjugations, VariantGroupMeta, VariantDetailMeta } from "../types";
import { ComplexityLevel } from "../components/CoverageGrid";

// Search input component - prominent and visible
function SearchInput({ query, setQuery, onSearch, loading }: {
  query: string;
  setQuery: (query: string) => void;
  onSearch: () => void;
  loading: boolean;
}) {
  const handleQueryChange = (e: ChangeEvent<HTMLInputElement>) => setQuery(e.target.value);
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !loading) {
      onSearch();
    }
  };

  return (
    <div className="relative">
      <input
        type="text"
        value={query}
        onChange={handleQueryChange}
        onKeyPress={handleKeyPress}
        placeholder="Search Pashto Bible (e.g., لیدل, خدا, موسى)"
        className="w-full p-4 pr-16 text-lg border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
        dir="rtl"
        disabled={loading}
      />
      <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl">
        🔍
      </div>
      <button
        onClick={() => onSearch()}
        disabled={loading || !query.trim()}
        className="absolute right-3 top-1/2 transform -translate-y-1/2 px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? '...' : 'Search'}
      </button>
    </div>
  );
}

// Search controls component - separate panel
function SearchControls({ scope, setScope, includeRelated, setIncludeRelated, resultsCount }: {
  scope: Scope;
  setScope: (scope: Scope) => void;
  includeRelated: boolean;
  setIncludeRelated: (include: boolean) => void;
  resultsCount: number;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        {/* Scope Selection as Tabs */}
        <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1 overflow-x-auto">
          {[
            {key: 'all', label: 'All', icon: '📚'},
            {key: 'ot', label: 'OT', icon: '📖'},
            {key: 'nt', label: 'NT', icon: '📜'}
          ].map((option) => (
            <button
              key={option.key}
              onClick={() => setScope(option.key as Scope)}
              className={`px-3 py-2 text-sm font-medium rounded-md transition-colors whitespace-nowrap ${
                scope === option.key
                  ? 'bg-blue-500 text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
              title={option.label}
            >
              <span className="mr-1">{option.icon}</span>
              <span className="hidden sm:inline">{option.label}</span>
              <span className="sm:hidden">{option.key.toUpperCase()}</span>
            </button>
          ))}
        </div>

        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input
            type="checkbox"
            checked={includeRelated}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setIncludeRelated(e.target.checked)}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="text-gray-700 dark:text-gray-300 font-medium">Include related forms</span>
        </label>
      </div>

      {/* Quick Search Actions */}
      <div className="flex items-center justify-between sm:justify-end gap-2">
        {resultsCount > 0 && (
          <span className="text-sm text-gray-500 dark:text-gray-400 px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full font-medium">
            {resultsCount} results
          </span>
        )}
      </div>
    </div>
  );
}

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

export default function Home() {
  const [audioMap, setAudioMap] = useState<AudioMap>({});
  const [query, setQuery] = useState<string>(" ");
  const [scope, setScope] = useState<Scope>("all");
  const [bookFilter, setBookFilter] = useState<string | null>(null);
  const [results, setResults] = useState<Verse[]>([]);
  const [coverage, setCoverage] = useState<CoverageItem[]>([]);
  const [conjugations, setConjugations] = useState<Conjugations | null>(null);
  const [relatedForms, setRelatedForms] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [localBible, setLocalBible] = useState<Verse[] | null>(null);
  const [coverageLevel, setCoverageLevel] = useState<ComplexityLevel>(ComplexityLevel.Basic); // Default to basic level
  // Minimal UI (two tabs: Search, Lexicon)
  const [includeRelated, setIncludeRelated] = useState<boolean>(false);
  const [highlightTerms, setHighlightTerms] = useState<string[]>([]);
  const [variantCount, setVariantCount] = useState<number>(0);
  const [variantGroups, setVariantGroups] = useState<VariantGroupMeta[]>([]);
  const [variantDetails, setVariantDetails] = useState<VariantDetailMeta[]>([]);
  const [showVariantDetails, setShowVariantDetails] = useState<boolean>(false);
  const [analysisWord, setAnalysisWord] = useState<string>("");
  const [lastSearchedQuery, setLastSearchedQuery] = useState<string>('');

  // Verb understanding features
  const [verbPerson, setVerbPerson] = useState<'1st' | '2nd' | '3rd'>('1st');
  const [showFirstPerson, setShowFirstPerson] = useState<boolean>(false);
  const [verbTense, setVerbTense] = useState<'present' | 'past' | 'future' | 'perfect'>('present');



  // hydrate persisted UI state
  useEffect(() => {
    setQuery(loadPersisted<string>("pbs_query", ""));
    setScope(loadPersisted<Scope>("pbs_scope", "all"));
    setBookFilter(loadPersisted<string | null>("pbs_book", null));
  }, []);

  useEffect(() => savePersisted("pbs_query", query), [query]);
  useEffect(() => savePersisted("pbs_scope", scope), [scope]);
  useEffect(() => savePersisted("pbs_book", bookFilter), [bookFilter]);

  // load audio map once
  useEffect(() => {
    const load = async () => {
      // Prefer internal API route that aggregates Storage + mappings
      try {
        const aMap = await fetch('/api/get_audio_map?refresh=1', { cache: 'no-store' }).then((r) => r.json());
        if (aMap && typeof aMap === 'object') {
          setAudioMap(aMap as AudioMap);
          return;
        }
      } catch {}
      try {
        const aMap = await fetch("/assets/audio_file_map.json").then((r) => r.json());
        setAudioMap(aMap as AudioMap);
      } catch {
        setAudioMap({});
      }
    };
    load();
  }, []);


  // load local bible JSON for fallback demo mode
  useEffect(() => {
    let cancelled = false;
    const loadBible = async () => {
      try {
        const raw: unknown = await fetch("/assets/pashto_bible.json").then((r) => r.json());
        if (Array.isArray(raw)) {
          const arr = raw as Array<unknown>;
          const normalized: Verse[] = arr
            .map((it) => {
              const obj = (it && typeof it === 'object') ? (it as Record<string, unknown>) : {};
              const pick = (keys: string[]): string => {
                for (const k of keys) {
                  const v = obj[k];
                  if (typeof v === 'string' && v) return v;
                }
                return '';
              };
              return { ref: pick(['ref','r']), text: pick(['text','t']) } as Verse;
            })
            .filter((v) => v.ref && v.text);
          if (!cancelled) setLocalBible(normalized);
        } else {
          if (!cancelled) setLocalBible([]);
        }
      } catch {
        if (!cancelled) setLocalBible([]);
      }
    };
    loadBible();
    return () => { cancelled = true; };
  }, []);

  const visibleResults = useMemo(() => results, [results]);

  // Prefer internal Next.js API routes for portability



  const handleSearch = async (book?: string | null) => {
    const normalizedBook = (typeof book === 'string' || book === null) ? book : undefined;
    const q = query.trim();
    if (!q) {
      setResults([]);
      setCoverage([]);
      setConjugations(null);
      setRelatedForms(null);
      setHighlightTerms([]);
      setVariantCount(0);
      setVariantGroups([]);
      setVariantDetails([]);
      setShowVariantDetails(false);
      setLastSearchedQuery('');
      setBookFilter(null);
      return;
    }

    const isNewQuery = q !== lastSearchedQuery;
    let effectiveBook = normalizedBook;
    if (effectiveBook === undefined) {
      effectiveBook = isNewQuery ? null : bookFilter;
    }
    const bookArgProvided = book !== undefined;
    if (!bookArgProvided && isNewQuery && bookFilter !== null) {
      setBookFilter(null);
    } else if (bookArgProvided) {
      setBookFilter(normalizedBook ?? null);
    }

    setLoading(true);
    try {
      const resp = await fetch(`/api/search_phrase`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: q, scope, includeRelated, bookFilter: effectiveBook ?? null }),
      });
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      const data = (await resp.json()) as PhraseResponse;
      setResults(data.results ?? []);
      const cov = (data.coverage ?? []).slice().sort((a, b) => b.count - a.count);
      setCoverage(cov);
      setConjugations(null);
      const processed = data.processed;
      const variants = processed?.variants;
      setHighlightTerms(Array.isArray(variants) && variants.length > 0 ? variants.slice(0, 10) : [q]);
      setVariantCount(Array.isArray(variants) ? variants.length : 1);
      if (Array.isArray(processed?.variantGroups)) {
        setVariantGroups(processed.variantGroups.filter((group) => group && group.label && Array.isArray(group.forms) && group.forms.length > 0));
      } else {
        setVariantGroups([]);
      }
      if (Array.isArray(processed?.variantDetails)) {
        setVariantDetails(processed.variantDetails.filter((detail) => detail && detail.form));
      } else {
        setVariantDetails([]);
      }

      setRelatedForms((data as any)?.relatedForms || null);
      setAnalysisWord(q);
      setLastSearchedQuery(q);
    } catch (e) {
      console.error("Failed to fetch search results, using local fallback:", e);
      setResults([]);
      setCoverage([]);
      setConjugations(null);
      setRelatedForms(null);
      setHighlightTerms([q]);
      setVariantCount(1);
      setVariantGroups([]);
      setVariantDetails([]);
      setShowVariantDetails(false);
    } finally {
      setLoading(false);
    }
  };

  // Optional: run a search automatically when scope changes and a query exists
  useEffect(() => {
    if (query.trim()) {
      // fire and forget
      handleSearch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scope, includeRelated]);

  const onBookSelect = (book: string | null) => {
    // If same book is clicked, clear the filter
    const newBookFilter = bookFilter === book ? null : book;
    setBookFilter(newBookFilter);
    if (query.trim()) {
      handleSearch(newBookFilter);
    }
  }

  return (
    <div className="min-h-screen p-2 sm:p-4">
      <div className="max-w-6xl mx-auto flex flex-col gap-4">
        {/* Header */}
        <div className="border-b border-gray-200 dark:border-gray-700">
          <div className="px-2 py-3 flex items-center justify-between">
            <div className="font-semibold text-lg">Pashto Bible</div>

            {/* Coverage toggles removed for consistent behavior */}
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Left Side - Tabs for Search/Lexicon/Grammar */}
          <div className="lg:col-span-3 order-2 lg:order-1">
            <Tabs
              tabs={[
                {
                  id: 'search',
                  label: '🔍 Search',
                  content: (
                    <div className="space-y-4">
                      {/* Search Input - Prominent and separate */}
                      <div className="mb-6">
                        <SearchInput
                          query={query}
                          setQuery={setQuery}
                          onSearch={handleSearch}
                          loading={loading}
                        />
                      </div>

                      {/* Search Controls Panel - Separate element */}
                      <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                        <SearchControls
                          scope={scope}
                          setScope={setScope}
                          includeRelated={includeRelated}
                          setIncludeRelated={setIncludeRelated}
                          resultsCount={results.length}
                        />
                      </div>

                      {/* Search Section */}
                      <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-3 sm:p-4 bg-white dark:bg-gray-900 shadow-sm">

                      {/* Verb Understanding Panel */}
                      {(showFirstPerson || verbPerson !== '1st' || verbTense !== 'present') && (
                        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 shadow-sm">
                          <div className="flex items-start gap-2">
                            <span className="text-blue-600 dark:text-blue-400 mt-0.5">🧠</span>
                            <div className="flex-1">
                              <div className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-1">
                                Verb Understanding Mode
                              </div>
                              <div className="text-xs text-blue-700 dark:text-blue-300 space-y-0.5">
                                {showFirstPerson && <div>• Showing 1st person present forms (م for "I")</div>}
                                {verbPerson === '2nd' && <div>• Showing 2nd person forms (ې for "you")</div>}
                                {verbPerson === '3rd' && <div>• Showing 3rd person forms (ي for "he/she")</div>}
                                {verbTense === 'past' && <div>• Showing past tense forms (لم for "I did")</div>}
                                {verbTense === 'future' && <div>• Showing future tense forms (به for "I will")</div>}
                                {verbTense === 'perfect' && <div>• Showing perfect forms (لیدلی for "I have seen")</div>}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Results Section */}
                      <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-3 sm:p-4 bg-white dark:bg-gray-900 shadow-sm">
                        {/* Results Header */}
                        {query.trim() && (
                          <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-100 dark:border-gray-800">
                            <div className="flex items-center gap-4">
                              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                Search Results
                              </h3>
                              {bookFilter && (
                                <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 text-xs rounded-full">
                                  📍 {bookFilter}
                                </span>
                              )}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {includeRelated
                                ? `${variantCount} variants • ${results.length} occurrences`
                                : `${results.length} direct matches`
                              }
                            </div>
                          </div>
                        )}

                        {loading ? (
                          <div className="py-8 text-center">
                            <div className="inline-flex items-center gap-2 text-gray-500">
                              <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent"></div>
                              Searching...
                            </div>
                          </div>
                        ) : (
                          <ResultsList
                            results={visibleResults}
                            audioMap={audioMap}
                            loading={loading}
                            query={highlightTerms?.[0] || query}
                            terms={highlightTerms?.length ? highlightTerms.slice(0, 10) : undefined}
                          />
                        )}

                        {/* Inline frequency summary */}
                        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                          <InlineFrequency term={query} scope={scope} includeRelated={includeRelated} onPick={(f) => { setQuery(f); handleSearch(); }} />
                        </div>
                      </div>

                      {/* Related Forms Section */}
                      {includeRelated && relatedForms && (
                        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-3 sm:p-4 bg-white dark:bg-gray-900 shadow-sm">
                          <RelatedForms
                            relatedForms={relatedForms}
                            onPick={(f) => { setQuery(f); handleSearch(); }}
                            verbState={{person: verbPerson, tense: verbTense}}
                            setVerbState={(state) => {
                              setVerbPerson(state.person)
                              setVerbTense(state.tense)
                            }}
                          />
                        </div>
                      )}

                      {/* Keep search focused. Lexicon is a separate tab. */}
                    </div>
                  )
                },
                {
                  id: 'lexicon',
                  label: '📚 Lexicon',
                  content: (
                    <div className="border border-gray-200 dark:border-gray-700 rounded p-4">
                      <LexiconPanel onPickForm={(f) => { setQuery(f); handleSearch(); }} />
                    </div>
                  )
                },
                {
                  id: 'analysis',
                  label: '🧪 Analysis',
                  content: (
                    <div className="border border-gray-200 dark:border-gray-700 rounded p-4">
                      {analysisWord ? (
                        <LinguisticAnalysis 
                          word={analysisWord} 
                          onRelatedWordClick={(word) => { 
                            setQuery(word); 
                            handleSearch(); 
                          }} 
                        />
                      ) : (
                        <div className="text-center text-gray-500 py-8">
                          Search for a word to see linguistic analysis
                        </div>
                      )}
                    </div>
                  )
                }
              ]}
              defaultTab="search"
            />
          </div>

          {/* Right Side - Coverage */}
          <div className="lg:col-span-1 order-1 lg:order-2">
            <CoverageSidebar
              coverage={coverage}
              scope={scope}
              coverageLevel={coverageLevel}
              onPickBook={onBookSelect}
              selectedBook={bookFilter}
            />
          </div>
        </div>

        {/* Bottom Section - Conjugations */}
        {conjugations && (
          <div className="border border-gray-200 dark:border-gray-700 rounded p-4">
            <div className="font-medium mb-2">{conjugations.kind === 'verb' ? 'Conjugations' : 'Inflections'} for {conjugations.root}</div>
            {conjugations.query_rom && (
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Romanization: {conjugations.query_rom}</div>
            )}
            <pre className="whitespace-pre-wrap text-sm bg-gray-50 dark:bg-gray-800 p-2 rounded overflow-auto">{JSON.stringify(conjugations.tables, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  );
}
