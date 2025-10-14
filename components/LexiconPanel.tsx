"use client";

import React, { useState, useEffect } from "react";
import { useSupabaseLexicon } from "../hooks/useSupabaseLexicon";
import { supabase } from "@/utils/supabase";
import type { Database } from "@/types/database";

type NounEntry = Database['public']['Tables']['nouns_lexicon']['Row'];

interface Props { onPickForm?: (form: string) => void; queryProp?: string }

export default function LexiconPanel({ onPickForm, queryProp }: Props) {
  const { query, setQuery, result, loading, error } = useSupabaseLexicon();
  const [nounResult, setNounResult] = useState<NounEntry | null>(null);
  const [searchType, setSearchType] = useState<'verb' | 'noun' | 'all'>('all');
  const [nounLoading, setNounLoading] = useState(false);
  const [dict, setDict] = useState<any | null>(null);
  const [rootFromForm, setRootFromForm] = useState<string | null>(null);

  // Sync external query if provided
  useEffect(() => {
    if (typeof queryProp === 'string') {
      setQuery(queryProp);
    }
  }, [queryProp]);

  // Dictionary lookup (pashto or romanized)
  useEffect(() => {
    const run = async () => {
      const q = query.trim();
      if (!q) { setDict(null); return; }
      try {
        const { data, error } = await supabase
          .from('dictionary')
          .select('*')
          .or(`pashto.ilike.%${q}%,romanized.ilike.%${q}%`)
          .limit(1);
        if (!error && data && data.length > 0) setDict(data[0]); else setDict(null);
      } catch { setDict(null); }
    };
    const t = setTimeout(run, 250);
    return () => clearTimeout(t);
  }, [query]);

  // If user typed an inflected form, find its root via form_to_root_map and load verb entry
  useEffect(() => {
    const q = query.trim();
    if (!q) { setRootFromForm(null); return; }
    let cancelled = false;
    (async () => {
      try {
        const { data: map } = await supabase
          .from('form_to_root_map')
          .select('root')
          .eq('form', q)
          .limit(1)
        const root = (map && map[0]) ? String((map[0] as any).root) : null
        if (cancelled) return
        setRootFromForm(root)
        if (root && !result) {
          // Load verb by root if verb panel didn't find it
          const { data: verbs } = await supabase
            .from('verbs_lexicon')
            .select('*')
            .eq('verb_root', root)
            .limit(1)
          // We intentionally don't mutate useSupabaseLexicon's state; just show a hint below
        }
      } catch {
        if (!cancelled) setRootFromForm(null)
      }
    })()
    return () => { cancelled = true }
  }, [query, result])

  // Search for nouns when query changes and search type allows
  useEffect(() => {
    if (!query.trim() || searchType === 'verb') {
      setNounResult(null);
      return;
    }

    const fetchNoun = async () => {
      setNounLoading(true);
      try {
        const { data, error } = await supabase
          .from('nouns_lexicon')
          .select('*')
          .ilike('pashto_word', `%${query}%`)
          .limit(1);

        if (!error && data && data.length > 0) {
          setNounResult(data[0]);
        } else {
          setNounResult(null);
        }
      } catch (err) {
        setNounResult(null);
      } finally {
        setNounLoading(false);
      }
    };

    if (searchType === 'all' || searchType === 'noun') {
      fetchNoun();
    }
  }, [query, searchType]);

  // Generate conjugation tables - Updated for Supabase integration
  const generateConjugationTable = (tense: string, description: string, stem: string, endings: Record<string, string[]>) => {
    const persons = ['1st', '2nd', '3rd'];
    const numbers = ['singular', 'plural'];

    return (
      <div className="mt-4">
        <h4 className="font-medium text-lg">{tense}</h4>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{description}</p>
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse border border-gray-300 dark:border-gray-600" dir="rtl">
            <thead>
              <tr>
                <th className="border p-2 bg-gray-50 dark:bg-gray-800">شخص</th>
                <th className="border p-2 bg-gray-50 dark:bg-gray-800">مفرد</th>
                <th className="border p-2 bg-gray-50 dark:bg-gray-800">جمع</th>
              </tr>
            </thead>
            <tbody>
              {persons.map((person, i) => (
                <tr key={person}>
                  <td className="border p-2 text-center font-medium">{person}</td>
                  <td className="border p-2 text-center font-mono">{stem + (endings.singular?.[i] || '')}</td>
                  <td className="border p-2 text-center font-mono">{stem + (endings.plural?.[i] || '')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  if (loading) {
    return <div className="p-4 text-center">Loading lexicon...</div>;
  }

  if (error) {
    return <div className="p-4 text-center text-red-500">Error: {error}</div>;
  }

  return (
    <div className="p-4" dir="rtl">
      <h2 className="text-xl font-bold mb-4">لغت نامه</h2>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Pashto Lexicon - Search for verb roots like "leedul" (لیدل)
      </p>

      <div className="mb-6 space-y-4">
        {!queryProp && (
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search words (e.g., لیدل or leedul)"
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-lg"
          />
        )}

        <div className="flex gap-2">
          <select
            value={searchType}
            onChange={(e) => setSearchType(e.target.value as 'verb' | 'noun' | 'all')}
            className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800"
          >
            <option value="all">All Words</option>
            <option value="verb">Verbs Only</option>
            <option value="noun">Nouns Only</option>
          </select>
        </div>
      </div>

      {result && (searchType === 'all' || searchType === 'verb') && (
        <div className="space-y-6">
          {rootFromForm && rootFromForm !== result.verb_root && (
            <div className="p-2 text-sm bg-amber-50 dark:bg-amber-900/20 rounded border border-amber-400/40">
              The form <span className="font-mono">{query}</span> maps to root <button className="underline" onClick={() => setQuery(rootFromForm!)}>{rootFromForm}</button>.
            </div>
          )}
          {/* Dictionary definition */}
          {dict && (
            <div className="bg-slate-50 dark:bg-slate-900/30 p-4 rounded-lg">
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Dictionary</div>
              <div className="flex items-baseline gap-2">
                <div className="text-lg font-semibold">{dict.pashto || result.verb_root}</div>
                {dict.romanized && <div className="text-sm text-gray-600">{dict.romanized}</div>}
                {dict.pos && <div className="text-xs bg-gray-200 dark:bg-gray-700 px-2 py-0.5 rounded">{dict.pos}</div>}
              </div>
              {dict.definition && (
                <div className="mt-2 text-sm text-gray-800 dark:text-gray-200">{dict.definition}</div>
              )}
            </div>
          )}
          {/* Verb Header */}
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <h3 className="text-2xl font-bold text-blue-800 dark:text-blue-200 mb-2">
              {result.verb_root}
            </h3>
            <p className="text-lg text-blue-600 dark:text-blue-300">
              {typeof result.romanization === 'object' && result.romanization?.transliteration
                ? result.romanization.transliteration
                : 'Unknown romanization'}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {result.irregularity_type} • Pattern: {result.conjugation_pattern}
            </p>
          </div>

          {/* Roots and Stems */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
              <h4 className="font-bold text-green-800 dark:text-green-200 mb-2">🌱 Roots</h4>
              {typeof result.roots === 'object' && result.roots && (
                <div className="space-y-1">
                  {Object.entries(result.roots).map(([key, value]) => (
                    <p key={key} className="text-sm">
                      <span className="font-medium">{key}:</span> {String(value)}
                    </p>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
              <h4 className="font-bold text-purple-800 dark:text-purple-200 mb-2">🌿 Stems</h4>
              {typeof result.stems === 'object' && result.stems && (
                <div className="space-y-1">
                  {Object.entries(result.stems).map(([key, value]) => (
                    <p key={key} className="text-sm">
                      <span className="font-medium">{key}:</span> {String(value)}
                    </p>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Past Participle */}
          <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
            <h4 className="font-bold text-orange-800 dark:text-orange-200 mb-2">📝 Past Participle</h4>
            <p className="text-xl font-mono">{result.past_participle}</p>
          </div>

          {/* Conjugation Tables */}
          <div className="bg-gray-50 dark:bg-gray-900/20 p-4 rounded-lg">
            <h4 className="font-bold text-lg mb-4">📊 Conjugations</h4>

            {/* Present Tense */}
            {generateConjugationTable(
              'حال',
              'Present tense - imperfective stem + present endings',
              typeof result.stems === 'object' && result.stems?.imperfective ? String(result.stems.imperfective) : '',
              {
                singular: ['م', 'ې', 'ي'],
                plural: ['و', 'ئ', 'ي']
              }
            )}

            {/* Subjunctive */}
            {generateConjugationTable(
              'فرضی',
              'Subjunctive - perfective stem + present endings',
              typeof result.stems === 'object' && result.stems?.perfective ? String(result.stems.perfective) : '',
              {
                singular: ['م', 'ې', 'ي'],
                plural: ['و', 'ئ', 'ي']
              }
            )}

            {/* Future */}
            {generateConjugationTable(
              'مستقبل',
              'Future - "به" + present form',
              'به ' + (typeof result.stems === 'object' && result.stems?.imperfective ? String(result.stems.imperfective) : ''),
              {
                singular: ['م', 'ې', 'ي'],
                plural: ['و', 'ئ', 'ي']
              }
            )}
          </div>

          {/* Examples */}
          {result.examples && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
              <h4 className="font-bold text-yellow-800 dark:text-yellow-200 mb-2">📚 Examples</h4>
              {typeof result.examples === 'object' && Array.isArray(result.examples) ? (
                <ul className="space-y-2">
                  {result.examples.map((example: any, index: number) => (
                    <li key={index} className="text-sm">
                      <span className="font-mono">{example.pashto}</span>
                      {example.english && <span className="text-gray-600 dark:text-gray-400 ml-2">({example.english})</span>}
                    </li>
                  ))}
                </ul>
              ) : (
                <pre className="text-sm">{JSON.stringify(result.examples, null, 2)}</pre>
              )}
            </div>
          )}

          {/* Notes */}
          {result.notes && (
            <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
              <h4 className="font-bold text-red-800 dark:text-red-200 mb-2">📝 Notes</h4>
              <p className="text-sm">{result.notes}</p>
            </div>
          )}

          {/* Search in Bible Button */}
          <div className="flex justify-center">
            <button
              onClick={() => onPickForm?.(result.verb_root)}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              🔍 Search "{result.verb_root}" in Bible
            </button>
          </div>
        </div>
      )}

      {/* Noun Results */}
      {nounResult && (searchType === 'all' || searchType === 'noun') && (
        <div className="mt-8 space-y-6">
          <div className="border-t pt-6">
            <h3 className="text-lg font-bold mb-4 text-green-600 dark:text-green-400">📝 Noun Result</h3>

            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
              <h4 className="text-2xl font-bold text-green-800 dark:text-green-200 mb-2">
                {nounResult.pashto_word}
              </h4>
              <p className="text-lg text-green-600 dark:text-green-300">
                {nounResult.romanized || 'No romanization'}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Gender: {nounResult.gender} • Number: {nounResult.number}
              </p>
            </div>

            {/* Plural Forms */}
            {nounResult.plural_forms && (
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <h4 className="font-bold text-blue-800 dark:text-blue-200 mb-2">Plural Forms</h4>
                <div className="space-y-1">
                  {Object.entries(nounResult.plural_forms).map(([key, value]) => (
                    <p key={key} className="text-sm">
                      <span className="font-medium">{key}:</span> {String(value)}
                    </p>
                  ))}
                </div>
              </div>
            )}

            {/* Noun Search Button */}
            <div className="flex justify-center">
              <button
                onClick={() => onPickForm?.(nounResult.pashto_word)}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                🔍 Search "{nounResult.pashto_word}" in Bible
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Loading States */}
      {(loading && (searchType === 'all' || searchType === 'verb')) ||
       (nounLoading && (searchType === 'all' || searchType === 'noun')) ? (
        <div className="text-center text-gray-500 mt-8">Searching...</div>
      ) : !result && !nounResult && query ? (
        <div className="text-center text-gray-500 mt-8">
          No results found for "{query}". Try different search terms or adjust the search type.
        </div>
      ) : !query ? (
        <div className="text-center text-gray-500 mt-8">
          Enter a Pashto word to search the lexicon.
        </div>
      ) : null}
    </div>
  );
}









