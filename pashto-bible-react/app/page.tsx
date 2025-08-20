"use client";

import { useEffect, useMemo, useState } from "react";
import SearchBar from "../components/SearchBar";
import CoverageChips from "../components/CoverageChips";
import ResultsList from "../components/ResultsList";
import LexiconModal from "../components/LexiconModal";
import type { Verse, Scope, CoverageItem, AudioMap, PhraseResponse, GrammarResponse, Mode, Conjugations, LexiconEntry } from "../types";

// Helper component to render conjugation tables nicely
const ConjugationDisplay = ({ conjugations }: { conjugations: Conjugations }) => {
  const tables: Record<string, unknown> = conjugations.tables ?? {};
  return (
    <div className="w-full rounded-lg border border-gray-200 dark:border-gray-700 p-4">
      <h3 className="font-semibold text-lg mb-2">
        {conjugations.kind === 'verb' ? 'Conjugations' : 'Inflections'} for: <span className="font-bold text-blue-400">{conjugations.root}</span>
      </h3>
      {conjugations.query_rom && (
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Romanization: {conjugations.query_rom}</p>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {Object.entries(tables).map(([title, values]) => (
          <div key={title}>
            <h4 className="font-semibold text-md capitalize border-b border-gray-300 dark:border-gray-600 pb-1 mb-2">{title.replace(/_/g, ' ')}</h4>
            {Array.isArray(values) || typeof values === 'string' || typeof values === 'number' || typeof values === 'boolean' ? (
              <p className="text-sm text-gray-700 dark:text-gray-200">
                {Array.isArray(values) ? (values as unknown[]).map(String).join(', ') : String(values)}
              </p>
            ) : (
              typeof values === 'object' && values !== null ? (
                <ul className="list-disc list-inside">
                  {Object.entries(values as Record<string, unknown>).map(([key, value]) => (
                    <li key={key} className="text-sm text-gray-700 dark:text-gray-200">
                      <span className="font-semibold capitalize">{key.replace(/_/g, ' ')}:</span> {Array.isArray(value) ? (value as unknown[]).map(String).join(', ') : String(value)}
                    </li>
                  ))}
                </ul>
              ) : null
            )}
          </div>
        ))}
      </div>
    </div>
  );
};


export default function Home() {
  const [audioMap, setAudioMap] = useState<AudioMap>({});
  const [query, setQuery] = useState<string>("");
  const [scope, setScope] = useState<Scope>("all");
  const [mode, setMode] = useState<Mode>("phrase");
  const [bookFilter, setBookFilter] = useState<string | null>(null);
  const [results, setResults] = useState<Verse[]>([]);
  const [coverage, setCoverage] = useState<CoverageItem[]>([]);
  const [conjugations, setConjugations] = useState<Conjugations | null>(null);
  const [highlightTerms, setHighlightTerms] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedLexiconWord, setSelectedLexiconWord] = useState<string | null>(null);
  const [lexiconEntry, setLexiconEntry] = useState<LexiconEntry | null>(null);
  const [lexiconLoading, setLexiconLoading] = useState<boolean>(false);

  // Hydrate persisted UI state
  useEffect(() => {
    setQuery(localStorage.getItem("pbs_query") || "");
    setScope((localStorage.getItem("pbs_scope") as Scope) || "all");
    setBookFilter(localStorage.getItem("pbs_book") || null);
  }, []);

  useEffect(() => { localStorage.setItem("pbs_query", query); }, [query]);
  useEffect(() => { localStorage.setItem("pbs_scope", scope); }, [scope]);
  useEffect(() => { if (bookFilter) localStorage.setItem("pbs_book", bookFilter); else localStorage.removeItem("pbs_book"); }, [bookFilter]);

  // Load audio map once
  useEffect(() => {
    const loadAudioMap = async () => {
      const url = process.env.NEXT_PUBLIC_AUDIO_MAP_URL;
      if (!url) return;
      try {
        const aMap = await fetch(url).then(r => r.json());
        setAudioMap(aMap as AudioMap);
      } catch (error) { console.error("Failed to load audio map:", error); }
    };
    loadAudioMap();
  }, []);
  
  // Fetch lexicon entry when a word is selected
  useEffect(() => {
    const fetchLexiconEntry = async () => {
      if (!selectedLexiconWord) return;
      setLexiconLoading(true);
      const url = process.env.NEXT_PUBLIC_LEXICON_URL;
      if (!url) {
        console.error("Lexicon URL is not configured.");
        setLexiconLoading(false);
        return;
      }
      try {
        const response = await fetch(`${url}?word=${encodeURIComponent(selectedLexiconWord)}`);
        if (!response.ok) throw new Error(`Lexicon entry not found for "${selectedLexiconWord}"`);
        const data = await response.json();
        setLexiconEntry(data as LexiconEntry);
      } catch (error) {
        console.error(error);
        setLexiconEntry({ f_primary: selectedLexiconWord || "", e: "Definition not found." });
      } finally {
        setLexiconLoading(false);
      }
    };
    fetchLexiconEntry();
  }, [selectedLexiconWord]);


  const visibleResults = useMemo(() => {
    if (!bookFilter) return results;
    return results.filter((v) => v?.ref?.startsWith(bookFilter + " "));
  }, [results, bookFilter]);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setResults([]);
    setCoverage([]);
    setConjugations(null);
    setHighlightTerms([]);

    const body = { query, scope };
    
    try {
      const url = mode === 'phrase'
        ? process.env.NEXT_PUBLIC_PHRASE_SEARCH_URL
        : process.env.NEXT_PUBLIC_GRAMMAR_SEARCH_URL;

      if (!url) throw new Error(`${mode} search URL is not configured.`);
      
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!response.ok) throw new Error(`API request failed with status ${response.status}`);
      
      const data = await response.json();

      if (mode === "phrase") {
        setResults((data.results ?? []).filter(Boolean));
        setHighlightTerms([query]);
        setConjugations(null);
      } else {
        setResults((data.occurrences ?? []).filter(Boolean));
        setHighlightTerms(data.highlight_terms ?? [query]);
        setConjugations(data.conjugations ?? null);
      }
      setCoverage(((data.coverage ?? []) as CoverageItem[]).sort((a: CoverageItem, b: CoverageItem) => b.count - a.count));
    } catch (e) {
      console.error("Failed to fetch search results:", e);
    } finally {
      setLoading(false);
    }
  };
  
  const handleWordClick = (word: string) => {
    setSelectedLexiconWord(word);
  };
  
  const closeModal = () => {
    setSelectedLexiconWord(null);
    setLexiconEntry(null);
  };

  return (
    <div className="min-h-screen p-4 sm:p-6 md:p-8">
      <div className="max-w-5xl mx-auto flex flex-col gap-4">
        <SearchBar query={query} setQuery={setQuery} scope={scope} setScope={setScope} mode={mode} setMode={setMode} onSearch={handleSearch} />
        <CoverageChips coverage={coverage} bookFilter={bookFilter} setBookFilter={setBookFilter} />
        {loading ? (
          <div className="py-8 text-center">Loading…</div>
        ) : (
          <ResultsList results={visibleResults} highlightTerms={highlightTerms} audioMap={audioMap} onWordClick={handleWordClick} />
        )}
        {conjugations && <ConjugationDisplay conjugations={conjugations} />}
        {(lexiconLoading || lexiconEntry) && (
          <LexiconModal 
            entry={lexiconLoading ? {f_primary: selectedLexiconWord || "", e: "Loading..."} : lexiconEntry!}
            onBackdropClick={closeModal}
          />
        )}
      </div>
    </div>
  );
}