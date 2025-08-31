// components/ResultsList.tsx
import React, { useMemo, useState } from 'react';
import AudioPlayer from './AudioPlayer';
import { audioUrlFromRef } from '../utils/audio';
import type { AudioMap } from '../types';

interface Verse {
  ref: string;
  text: string;
}

interface ResultsListProps {
  results: Verse[];
  loading: boolean;
  highlightTerms?: string[];
  audioMap?: AudioMap;
}

function escapeRegExp(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

const ResultsList: React.FC<ResultsListProps> = ({ results, loading, highlightTerms = [], audioMap = {} }) => {
  const [page, setPage] = useState(1);
  const resultsPerPage = 20;
  const paginatedResults = results.slice((page - 1) * resultsPerPage, page * resultsPerPage);

  const highlightRegex = useMemo(() => {
    const terms = Array.from(new Set(highlightTerms.filter(Boolean)));
    if (terms.length === 0) return null;
    // Sort by length desc to prefer longer matches first
    terms.sort((a, b) => b.length - a.length);
    return new RegExp(terms.map(escapeRegExp).join('|'), 'giu');
  }, [highlightTerms]);

  const renderHighlighted = (text: string) => {
    if (!highlightRegex) return text;
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;
    let idx = 0;
    for (const match of text.matchAll(highlightRegex)) {
      const start = match.index ?? 0;
      const matched = match[0];
      if (start > lastIndex) parts.push(text.slice(lastIndex, start));
      parts.push(
        <mark key={`h-${idx++}-${start}`} className="bg-yellow-600/40 text-yellow-200 px-0.5 rounded">
          {matched}
        </mark>
      );
      lastIndex = start + matched.length;
    }
    if (lastIndex < text.length) parts.push(text.slice(lastIndex));
    return parts;
  };

  if (loading) {
    return <div className="text-center">Loading results...</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4 border-b border-gray-700 pb-2">Results ({results.length})</h2>
      <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
        {paginatedResults.map((result, i) => (
          <div key={i} className="bg-gray-800 p-4 rounded-lg border border-gray-700">
            <div className="flex items-start justify-between gap-3">
              <h3 className="font-bold text-lg text-blue-400">{result.ref}</h3>
              {audioMap && (
                (() => {
                  const url = audioUrlFromRef(result.ref, audioMap);
                  return url ? <AudioPlayer audioUrl={url} verseRef={result.ref} /> : null;
                })()
              )}
            </div>
            <p className="text-xl leading-relaxed">{renderHighlighted(result.text)}</p>
          </div>
        ))}
      </div>
      {/* Pagination Controls */}
      {results.length > resultsPerPage && (
        <div className="mt-4 flex justify-center gap-2">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="bg-gray-700 p-2 rounded">Previous</button>
          <span>Page {page} of {Math.ceil(results.length / resultsPerPage)}</span>
          <button onClick={() => setPage(p => Math.min(Math.ceil(results.length / resultsPerPage), p + 1))} disabled={page === Math.ceil(results.length / resultsPerPage)} className="bg-gray-700 p-2 rounded">Next</button>
        </div>
      )}
    </div>
  );
};

export default ResultsList;
