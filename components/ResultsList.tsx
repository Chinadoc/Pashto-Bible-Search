"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import Pagination from '@mui/material/Pagination';
import type { Verse, AudioMap } from '../types';
import { audioUrlFromRef } from '../utils/audio';

interface Props {
  results: Verse[];
  audioMap: AudioMap;
  loading: boolean;
  query?: string; // highlight term
}

function escapeRegExp(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function highlight(text: string, terms: string[]): ReactNode[] {
  const cleanTerms = Array.from(new Set(terms.map((t) => t.trim()).filter(Boolean)));
  if (cleanTerms.length === 0) return [text];
  try {
    const pattern = cleanTerms.map(escapeRegExp).join('|');
    const re = new RegExp(`(${pattern})`, 'gi');
    const parts = text.split(re);
    const out: (string | JSX.Element)[] = [];
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      if (part === undefined) continue;
      if (re.test(part)) {
        out.push(<mark key={i} className="bg-yellow-200 dark:bg-yellow-700/60 px-0.5 rounded">{part}</mark>);
      } else {
        out.push(part);
      }
    }
    return out;
  } catch {
    return [text];
  }
}

export default function ResultsList({ results, audioMap, loading, query }: Props) {
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;
  const firstAudioRef = useRef<HTMLAudioElement | null>(null);

  // Reset to page 1 when results change
  useEffect(() => { setPage(1); }, [results]);

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;
  if (results.length === 0) return <p className="text-center text-gray-500">No results found.</p>;

  const paginatedResults = results.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const handlePageChange = (_: any, value: number) => {
    setPage(value);
    // Scroll to top of results on page change
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div>
      <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
        Showing {paginatedResults.length} of {results.length} results
      </div>

      {paginatedResults.map((verse, index) => {
        const globalIndex = (page - 1) * itemsPerPage + index;
        const direct = audioMap[verse.ref];
        const audioUrl = direct || audioUrlFromRef(verse.ref, audioMap);
        const terms = (query && query.trim()) ? [query.trim()] : [];
        const autoPlay = index === 0 && page === 1 && !!audioUrl;

        return (
          <div key={verse.ref} className="p-4 mb-2 border rounded-md bg-gray-50 dark:bg-gray-800 dark:border-gray-600" dir="rtl">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-medium text-blue-600 dark:text-blue-400">{verse.ref}</h3>
              <div className="flex items-center gap-2">
                {/* Copy verse */}
                <button
                  onClick={async () => {
                    try {
                      await navigator.clipboard.writeText(`${verse.ref}\n${verse.text}`);
                    } catch {}
                  }}
                  className="text-xs px-2 py-1 border rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                  title="Copy verse"
                >
                  Copy
                </button>
                {/* Download audio */}
                {audioUrl && (
                  <a
                    href={audioUrl}
                    download
                    className="text-xs px-2 py-1 border rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                    title="Download audio"
                  >
                    Download
                  </a>
                )}
              </div>
            </div>

            {/* Inline audio player */}
            {audioUrl && (
              <audio
                ref={index === 0 ? firstAudioRef : undefined}
                src={audioUrl}
                controls
                preload="metadata"
                className="w-full mb-2"
                autoPlay={autoPlay}
                onCanPlay={() => {
                  if (autoPlay && firstAudioRef.current) {
                    firstAudioRef.current.play().catch(() => {});
                  }
                }}
              />
            )}

            <p className="text-gray-800 dark:text-gray-200 leading-relaxed break-words">
              {highlight(verse.text, terms)}
            </p>
          </div>
        );
      })}

      {results.length > itemsPerPage && (
        <div className="flex justify-center mt-6">
          <Pagination
            count={Math.ceil(results.length / itemsPerPage)}
            page={page}
            onChange={handlePageChange}
            color="primary"
            size="medium"
            showFirstButton
            showLastButton
          />
        </div>
      )}
    </div>
  );
}
