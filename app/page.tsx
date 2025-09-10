"use client";

import { useEffect, useState } from "react";
import SearchBar from "@/components/SearchBar";
import CoverageGrid, { ComplexityLevel } from "@/components/CoverageGrid";
import ResultsList from "@/components/ResultsList";
import LexiconPanel from "@/components/LexiconPanel";
import { useSidebarCoverage } from "@/hooks/useSidebarCoverage";
import { useBibleSearch } from "@/hooks/useBibleSearch";
import type { Verse, Scope, CoverageItem, AudioMap, PhraseResponse, Conjugations } from "@/types";

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
  const [loading, setLoading] = useState<boolean>(false);
  const [localBible, setLocalBible] = useState<Verse[] | null>(null);
  const [coverageLevel, setCoverageLevel] = useState<ComplexityLevel>(ComplexityLevel.Basic); // Default to basic level

  // Create unified coverage data using custom hook
  const sidebarCoverage = useSidebarCoverage(coverage, localBible);

  // Optimized search functionality with Fuse.js
  const { search: bibleSearch, loading: searchLoading } = useBibleSearch(localBible, scope);

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

  const visibleResults = useMemo(() => {
    if (!bookFilter) return results;
    return results.filter((v) => v.ref.startsWith(bookFilter + " "));
  }, [results, bookFilter]);

  // Prefer internal Next.js API routes for portability



  const handleSearch = async () => {
    const q = query.trim();
    if (!q) {
      setResults([]);
      setCoverage([]);
      setConjugations(null);
      return;
    }
    setLoading(true);
    try {
      const resp = await fetch(`/api/search_phrase`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: q, scope }),
      });
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      const data = (await resp.json()) as PhraseResponse;
      setResults(data.results ?? []);
      const cov = (data.coverage ?? []).slice().sort((a, b) => b.count - a.count);
      setCoverage(cov);
      setConjugations(null);
    } catch (e) {
      console.error("Failed to fetch search results, using local fallback:", e);
      const fallbackResult = await bibleSearch(q);
      setResults(fallbackResult.hits);
      setCoverage(Object.entries(fallbackResult.counts).map(([book, count]) => ({ book, count })));
      setConjugations(null);
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
  }, [scope]);

  return (
    <div className="min-h-screen p-2 sm:p-4">
      <div className="max-w-6xl mx-auto flex flex-col gap-4">
        {/* Header */}
        <div className="border-b border-gray-200 dark:border-gray-700">
          <div className="px-2 py-3 flex items-center justify-between">
            <div className="font-semibold text-lg">Pashto Bible</div>

            {/* Coverage Level Toggle */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">Coverage:</span>
              <div className="flex gap-1">
                <button
                  onClick={() => setCoverageLevel(ComplexityLevel.Minimal)}
                  className={`px-2 py-1 text-xs rounded border ${coverageLevel === ComplexityLevel.Minimal ? 'bg-blue-500 text-white border-blue-500' : 'border-gray-300 text-gray-600'}`}
                >
                  Min
                </button>
                <button
                  onClick={() => setCoverageLevel(ComplexityLevel.Basic)}
                  className={`px-2 py-1 text-xs rounded border ${coverageLevel === ComplexityLevel.Basic ? 'bg-blue-500 text-white border-blue-500' : 'border-gray-300 text-gray-600'}`}
                >
                  Basic
                </button>
                <button
                  onClick={() => setCoverageLevel(ComplexityLevel.Full)}
                  className={`px-2 py-1 text-xs rounded border ${coverageLevel === ComplexityLevel.Full ? 'bg-blue-500 text-white border-blue-500' : 'border-gray-300 text-gray-600'}`}
                >
                  Full
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Left Side - Search & Lexicon */}
          <div className="lg:col-span-3 flex flex-col gap-4">
            {/* Search Section */}
            <div className="border border-gray-200 dark:border-gray-700 rounded p-4">
              <SearchBar query={query} setQuery={setQuery} scope={scope} setScope={setScope} onSearch={handleSearch} loading={loading} />
              {loading ? (
                <div className="py-4 text-center text-gray-500">Loading...</div>
              ) : (
                <ResultsList results={visibleResults} audioMap={audioMap} loading={loading} />
              )}
            </div>

            {/* Lexicon Section */}
            <div className="border border-gray-200 dark:border-gray-700 rounded p-4">
              <LexiconPanel onPickForm={(f) => { setQuery(f); handleSearch(); }} />
            </div>
          </div>

          {/* Right Side - Coverage */}
          <div className="lg:col-span-1">
            <CoverageGrid
              coverage={sidebarCoverage}
              onPickBook={(b) => setBookFilter(b)}
              scope={scope}
              complexityLevel={coverageLevel}
              title={coverage.length > 0 ? "Search Results" : "Bible Books"}
              subtitle={coverage.length > 0 ? `${sidebarCoverage.length} books with matches` : "Available for search"}
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
