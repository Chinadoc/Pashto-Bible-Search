"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import SearchBar from "@/components/SearchBar";
import CoverageGrid from "@/components/CoverageGrid";
import Tabs, { TabKey } from "@/components/Tabs";
import ResultsList from "@/components/ResultsList";
import LexiconPanel from "@/components/LexiconPanel";
import type { Verse, Scope, CoverageItem, AudioMap, PhraseResponse, GrammarResponse, Mode, Conjugations } from "@/types";

// Book lists + abbreviations (match CoverageGrid)
const OT_BOOKS = [
  "Genesis","Exodus","Leviticus","Numbers","Deuteronomy","Joshua","Judges","Ruth","1 Samuel","2 Samuel","1 Kings","2 Kings","1 Chronicles","2 Chronicles","Ezra","Nehemiah","Esther","Job","Psalms","Proverbs","Ecclesiastes","Song of Solomon","Isaiah","Jeremiah","Lamentations","Ezekiel","Daniel","Hosea","Joel","Amos","Obadiah","Jonah","Micah","Nahum","Habakkuk","Zephaniah","Haggai","Zechariah","Malachi"
];
const NT_BOOKS = [
  "Matthew","Mark","Luke","John","Acts","Romans","1 Corinthians","2 Corinthians","Galatians","Ephesians","Philippians","Colossians","1 Thessalonians","2 Thessalonians","1 Timothy","2 Timothy","Titus","Philemon","Hebrews","James","1 Peter","2 Peter","1 John","2 John","3 John","Jude","Revelation"
];
const ABBR: Record<string, string> = {
  Genesis: "Gen", Exodus: "Exo", Leviticus: "Lev", Numbers: "Num", Deuteronomy: "Deu",
  Joshua: "Jos", Judges: "Jdg", Ruth: "Rut", "1 Samuel": "1Sam", "2 Samuel": "2Sam",
  "1 Kings": "1Kgs", "2 Kings": "2Kgs", "1 Chronicles": "1Chr", "2 Chronicles": "2Chr",
  Ezra: "Ezr", Nehemiah: "Neh", Esther: "Est", Job: "Job", Psalms: "Psa", Proverbs: "Pro",
  Ecclesiastes: "Ecc", "Song of Solomon": "Sng", Isaiah: "Isa", Jeremiah: "Jer", Lamentations: "Lam",
  Ezekiel: "Eze", Daniel: "Dan", Hosea: "Hos", Joel: "Joe", Amos: "Amo", Obadiah: "Oba", Jonah: "Jon",
  Micah: "Mic", Nahum: "Nah", Habakkuk: "Hab", Zephaniah: "Zep", Haggai: "Hag", Zechariah: "Zec", Malachi: "Mal",
  Matthew: "Mat", Mark: "Mar", Luke: "Luk", John: "Joh", Acts: "Act", Romans: "Rom",
  "1 Corinthians": "1Cor", "2 Corinthians": "2Cor", Galatians: "Gal", Ephesians: "Eph", Philippians: "Phi",
  Colossians: "Col", "1 Thessalonians": "1Th", "2 Thessalonians": "2Th", "1 Timothy": "1Tim", "2 Timothy": "2Tim",
  Titus: "Tit", Philemon: "Phm", Hebrews: "Heb", James: "Jas", "1 Peter": "1Pet", "2 Peter": "2Pet",
  "1 John": "1Joh", "2 John": "2Joh", "3 John": "3Joh", Jude: "Jud", Revelation: "Rev",
};

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
  const [tab, setTab] = useState<TabKey>("search");
  const [query, setQuery] = useState<string>(" ");
  const [scope, setScope] = useState<Scope>("all");
  const [mode, setMode] = useState<Mode>("phrase");
  const [bookFilter, setBookFilter] = useState<string | null>(null);
  const [results, setResults] = useState<Verse[]>([]);
  const [coverage, setCoverage] = useState<CoverageItem[]>([]);
  const [conjugations, setConjugations] = useState<Conjugations | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [localBible, setLocalBible] = useState<Verse[] | null>(null);
  const [compactSidebar, setCompactSidebar] = useState<boolean>(false);

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
      try {
        const base = process.env.NEXT_PUBLIC_FUNCTIONS_BASE_URL;
        const explicit = process.env.NEXT_PUBLIC_AUDIO_MAP_URL;
        const url = explicit || (base ? `${base}/get_audio_map` : "");
        if (url) {
          const aMap = await fetch(url).then((r) => r.json());
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

  // toggle compact coverage sidebar when scrolling
  useEffect(() => {
    const prev = { current: compactSidebar } as { current: boolean };
    const onScroll = () => {
      const next = window.scrollY > 240;
      if (next !== prev.current) {
        prev.current = next;
        setCompactSidebar(next);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // load local bible JSON for fallback demo mode
  useEffect(() => {
    let cancelled = false;
    const loadBible = async () => {
      try {
        const arr = (await fetch("/assets/pashto_bible.json").then((r) => r.json())) as any[];
        const normalized: Verse[] = Array.isArray(arr)
          ? arr
              .map((it: any) => ({ ref: String(it?.ref || it?.r || ""), text: String(it?.text || it?.t || "") }))
              .filter((v) => v.ref && v.text)
          : [];
        if (!cancelled) setLocalBible(normalized);
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

  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

  function extractBook(ref: string): string {
    const m = ref.match(/^([A-Za-z0-9\s]+)\s\d+:\d+$/);
    return m ? m[1].trim() : ref.split(" ").slice(0, -1).join(" ");
  }

  async function localPhraseSearch(q: string) {
    const data = localBible ?? [];
    const withinScope = (book: string) => {
      if (scope === "nt") return NT_BOOKS_SET.has(book);
      if (scope === "ot") return OT_BOOKS_SET.has(book);
      return true;
    };
    const hits: Verse[] = [];
    const counts: Record<string, number> = {};
    for (const v of data) {
      const b = extractBook(v.ref);
      if (!withinScope(b)) continue;
      if (v.text && v.text.includes(q)) {
        hits.push(v);
        counts[b] = (counts[b] || 0) + 1;
        if (hits.length >= 1000) break;
      }
    }
    const cov: CoverageItem[] = Object.entries(counts).map(([book, count]) => ({ book, count }));
    cov.sort((a, b) => b.count - a.count);
    setResults(hits);
    setCoverage(cov);
    setConjugations(null);
  }

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
      if (mode === "phrase") {
        const resp = await fetch(`${API_BASE}/search/phrase`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: q, scope, limit: 1000 }),
        });
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
        const data = (await resp.json()) as PhraseResponse;
        setResults(data.results ?? []);
        const cov = (data.coverage ?? []).slice().sort((a, b) => b.count - a.count);
        setCoverage(cov);
        setConjugations(null);
      } else {
        const resp = await fetch(`${API_BASE}/search/grammar`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: q, scope, limit: 500 }),
        });
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
        const data = (await resp.json()) as GrammarResponse;
        setResults(data.occurrences ?? []);
        const cov = (data.coverage ?? []).slice().sort((a, b) => b.count - a.count);
        setCoverage(cov);
        setConjugations(data.conjugations ?? null);
      }
    } catch (e) {
      console.error("Failed to fetch search results, using local fallback:", e);
      if (mode === "phrase") {
        await localPhraseSearch(q);
      } else {
        setResults([]);
        setCoverage([]);
        setConjugations(null);
      }
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
    <div className="min-h-screen p-2 sm:p-4 md:p-6">
      <div className="max-w-6xl mx-auto flex flex-col gap-4">
        <div className="sticky top-0 z-30 bg-white/85 dark:bg-gray-900/85 backdrop-blur border-b border-gray-200 dark:border-gray-800">
          <div className="px-2 sm:px-3 md:px-4 py-2 flex items-center justify-between">
            <div className="font-semibold tracking-wide">Pashto Bible</div>
            <Tabs active={tab} onChange={(k) => setTab(k)} />
          </div>
          {/* Linear book bar at top in very compact form */}
          {/* Top coverage bar removed per request */}
        </div>
        {tab === "search" && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
            <main className="flex flex-col gap-3 md:col-span-3">
              <div className="sticky top-16 z-20 bg-white/70 dark:bg-gray-900/70 backdrop-blur p-1 rounded-md">
                <SearchBar query={query} setQuery={setQuery} scope={scope} setScope={setScope} mode={mode} setMode={setMode} onSearch={handleSearch} />
              </div>
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
            </main>
            <aside className="md:col-span-1 md:sticky md:top-16 md:self-start flex flex-col gap-3 max-h-[calc(100vh-5rem)] overflow-auto">
              <CoverageGrid coverage={coverage} onPickBook={(b) => setBookFilter(b)} compact={compactSidebar} scope={scope} />
            </aside>
          </div>
        )}
        {tab === "lexicon" && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
            <main className="flex flex-col gap-3 md:col-span-3">
              <LexiconPanel items={[]} onPickForm={(f) => { setQuery(f); setTab("search"); }} />
            </main>
            <aside className="md:col-span-1 md:sticky md:top-16 md:self-start flex flex-col gap-3 max-h-[calc(100vh-5rem)] overflow-auto">
              <CoverageGrid coverage={coverage} onPickBook={(b) => setBookFilter(b)} compact={true} scope={scope} />
            </aside>
          </div>
        )}
        {tab === "grammar" && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
            <main className="flex flex-col gap-3 md:col-span-3">
              <div className="sticky top-16 z-20 bg-white/70 dark:bg-gray-900/70 backdrop-blur p-1 rounded-md">
                <SearchBar query={query} setQuery={setQuery} scope={scope} setScope={setScope} mode={"grammar" as any} setMode={() => {}} onSearch={handleSearch} />
              </div>
              {loading ? (
                <div className="py-8 text-center">Loading…</div>
              ) : (
                <ResultsList results={visibleResults} query={query.trim()} audioMap={audioMap} />
              )}
            </main>
            <aside className="md:col-span-1 md:sticky md:top-16 md:self-start flex flex-col gap-3 max-h-[calc(100vh-5rem)] overflow-auto">
              <CoverageGrid coverage={coverage} onPickBook={(b) => setBookFilter(b)} compact={true} scope={scope} />
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}
