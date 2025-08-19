"use client";

import { useEffect, useMemo, useState } from "react";
import SearchBar from "@/components/SearchBar";
import CoverageChips from "@/components/CoverageChips";
import ResultsList from "@/components/ResultsList";
import type { Verse, Scope, CoverageItem, AudioMap, PhraseResponse, GrammarResponse, Mode, Conjugations } from "@/types";

const OT_BOOKS = new Set([
  "Genesis","Exodus","Leviticus","Numbers","Deuteronomy","Joshua","Judges","Ruth","1 Samuel","2 Samuel","1 Kings","2 Kings","1 Chronicles","2 Chronicles","Ezra","Nehemiah","Esther","Job","Psalms","Proverbs","Ecclesiastes","Song of Solomon","Isaiah","Jeremiah","Lamentations","Ezekiel","Daniel","Hosea","Joel","Amos","Obadiah","Jonah","Micah","Nahum","Habakkuk","Zephaniah","Haggai","Zechariah","Malachi"
]);
const NT_BOOKS = new Set([
  "Matthew","Mark","Luke","John","Acts","Romans","1 Corinthians","2 Corinthians","Galatians","Ephesians","Philippians","Colossians","1 Thessalonians","2 Thessalonians","1 Timothy","2 Timothy","Titus","Philemon","Hebrews","James","1 Peter","2 Peter","1 John","2 John","3 John","Jude","Revelation"
]);

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
  const [mode, setMode] = useState<Mode>("phrase");
  const [bookFilter, setBookFilter] = useState<string | null>(null);
  const [results, setResults] = useState<Verse[]>([]);
  const [coverage, setCoverage] = useState<CoverageItem[]>([]);
  const [conjugations, setConjugations] = useState<Conjugations | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

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
      const aMap = await fetch("/assets/audio_file_map.json").then((r) => r.json()).catch(() => ({}));
      setAudioMap(aMap as AudioMap);
    };
    load();
  }, []);

  const visibleResults = useMemo(() => {
    if (!bookFilter) return results;
    return results.filter((v) => v.ref.startsWith(bookFilter + " "));
  }, [results, bookFilter]);

  const handleSearch = async () => {
    setLoading(true);
    setResults([]);
    setCoverage([]);
    setConjugations(null);

    const body = { query, scope };

    try {
      let response: Response;
      if (mode === "phrase") {
        const url = process.env.NEXT_PUBLIC_PHRASE_SEARCH_URL;
        if (!url) throw new Error("Phrase search URL is not configured.");
        response = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
      } else {
        const url = process.env.NEXT_PUBLIC_GRAMMAR_SEARCH_URL;
        if (!url) throw new Error("Grammar search URL is not configured.");
        response = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
      }

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      const data = (await response.json()) as PhraseResponse | GrammarResponse;
      if (mode === "phrase") {
        setResults((data as PhraseResponse).results ?? []);
        const cov = (data.coverage ?? []).slice().sort((a, b) => b.count - a.count);
        setCoverage(cov);
        setConjugations(null);
      } else {
        setResults((data as GrammarResponse).occurrences ?? []);
        const cov = (data.coverage ?? []).slice().sort((a, b) => b.count - a.count);
        setCoverage(cov);
        setConjugations((data as GrammarResponse).conjugations ?? null);
      }
    } catch (e) {
      console.error("Failed to fetch search results:", e);
      setResults([]);
      setCoverage([]);
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
    <div className="min-h-screen p-4 sm:p-6 md:p-8">
      <div className="max-w-5xl mx-auto flex flex-col gap-4">
        <SearchBar query={query} setQuery={setQuery} scope={scope} setScope={setScope} mode={mode} setMode={setMode} onSearch={handleSearch} />
        <CoverageChips coverage={coverage} bookFilter={bookFilter} setBookFilter={setBookFilter} />
        {loading ? (
          <div className="py-8 text-center">Loading…</div>
        ) : (
          <ResultsList results={visibleResults} query={query.trim()} audioMap={audioMap} />
        )}
        {conjugations ? (
          <div className="w-full rounded-lg border border-gray-200 dark:border-gray-700 p-3">
            <div className="font-semibold mb-2">{conjugations.kind === 'verb' ? 'Conjugations' : 'Inflections'} for {conjugations.root}</div>
            {conjugations.query_rom ? (
              <div className="text-sm text-gray-600 dark:text-gray-300 mb-2">Romanization: {conjugations.query_rom}</div>
            ) : null}
            <pre className="whitespace-pre-wrap text-sm overflow-auto">{JSON.stringify(conjugations.tables, null, 2)}</pre>
          </div>
        ) : null}
      </div>
    </div>
  );
}
