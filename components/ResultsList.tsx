"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import Pagination from '@mui/material/Pagination';
import type { Verse, AudioMap } from '../types';
import { audioUrlFromRef } from '../utils/audio';

const OT_BOOKS = new Set([
  'Genesis','Exodus','Leviticus','Numbers','Deuteronomy','Joshua','Judges','Ruth','1 Samuel','2 Samuel','1 Kings','2 Kings','1 Chronicles','2 Chronicles','Ezra','Nehemiah','Esther','Job','Psalms','Proverbs','Ecclesiastes','Song of Solomon','Isaiah','Jeremiah','Lamentations','Ezekiel','Daniel','Hosea','Joel','Amos','Obadiah','Jonah','Micah','Nahum','Habakkuk','Zephaniah','Haggai','Zechariah','Malachi'
]);

interface Props {
  results: Verse[];
  audioMap: AudioMap;
  loading: boolean;
  query?: string; // legacy single-term highlight (fallback)
  terms?: string[]; // preferred: multiple variants to highlight
  highlightBook?: string | null; // book to visually highlight
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
    const out: ReactNode[] = [];
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      if (part === undefined) continue;
      // split with a capturing group produces: even indexes = non-match, odd indexes = matched terms
      const isMatch = i % 2 === 1;
      out.push(
        isMatch
          ? <mark key={i} className="bg-yellow-200 dark:bg-yellow-700/60 px-0.5 rounded">{part}</mark>
          : part
      );
    }
    return out;
  } catch {
    return [text];
  }
}

function getTranslationBadge(translation?: string, dialect?: string): ReactNode {
  if (!translation || translation === 'Standard') return null;

  const isYousafzai = translation === 'Yousafzai 2019';
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
      isYousafzai
        ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300 border border-orange-300'
        : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border border-blue-300'
    }`}>
      {isYousafzai ? '🕌' : '📖'} {translation}
    </span>
  );
}

export default function ResultsList({ results, audioMap, loading, query, terms: termsProp, highlightBook }: Props) {
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;
  const audioRefs = useRef<Map<string, HTMLAudioElement>>(new Map());
  const [resolvedUrls, setResolvedUrls] = useState<Record<string, string>>({});
  const [playingKey, setPlayingKey] = useState<string | null>(null);
  const [downloadingMap, setDownloadingMap] = useState<Record<string, boolean>>({});

  // Reset to page 1 when results change
  useEffect(() => { setPage(1); }, [results]);

  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;
  if (results.length === 0) return <p className="text-center text-gray-500">No results found.</p>;

  const paginatedResults = results.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  // Resolve audio URLs (prefer Supabase Storage signed URLs)
  useEffect(() => {
    (async () => {
      for (const verse of paginatedResults) {
        const ref = verse.ref;
        if (resolvedUrls[ref]) continue;
        // Skip OT books for now (no audio)
        const lastSpaceIndex = ref.lastIndexOf(' ');
        const book = lastSpaceIndex > 0 ? ref.slice(0, lastSpaceIndex) : '';
        const isYousafzai = verse.translation === 'Yousafzai 2019';
        if (OT_BOOKS.has(book) && !isYousafzai) continue;

        const direct = audioMap[ref];
        const derived = direct || audioUrlFromRef(ref, audioMap);

        let url = '';
        if (derived && /^https?:\/\//i.test(derived)) {
          url = derived;
        } else {
          try {
            const r = await fetch(`/api/audio_url?ref=${encodeURIComponent(ref)}`, { cache: 'no-store' });
            const js = await r.json().catch(() => ({}));
            url = js?.url || '';
          } catch { /* ignore */ }
        }

        if (url) setResolvedUrls(prev => ({ ...prev, [ref]: url }));
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paginatedResults, audioMap]);

  const handleDownload = async (ref: string, url: string) => {
    if (!url) return;
    setDownloadingMap((prev) => ({ ...prev, [ref]: true }));
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Failed to download ${ref}`);
      const blob = await response.blob();
      const sanitizedRef = ref.replace(/[^0-9A-Za-z]+/g, '_') || 'audio';
      const filename = `${sanitizedRef}.mp3`;
      const link = document.createElement('a');
      const objectUrl = URL.createObjectURL(blob);
      link.href = objectUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(objectUrl);
    } catch (error) {
      console.error('Audio download failed', error);
    } finally {
      setDownloadingMap((prev) => {
        const next = { ...prev };
        delete next[ref];
        return next;
      });
    }
  };

  const showPagination = results.length > itemsPerPage

  const paginationControl = (position: 'top' | 'bottom') => (
    <div
      className={position === 'bottom' ? 'mt-6 flex justify-center' : 'flex justify-end'}
    >
      <Pagination
        count={Math.ceil(results.length / itemsPerPage)}
        page={page}
        onChange={handlePageChange}
        color="primary"
        size={position === 'bottom' ? 'medium' : 'small'}
        showFirstButton={position === 'bottom'}
        showLastButton={position === 'bottom'}
      />
    </div>
  )

  return (
    <div>
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between text-sm text-gray-600 dark:text-gray-400">
        <span>
          Showing {paginatedResults.length} of {results.length} results
          {results.length > itemsPerPage && (
            <span className="ml-2 text-xs">
              (Page {page} of {Math.ceil(results.length / itemsPerPage)})
            </span>
          )}
        </span>
        {showPagination && paginationControl('top')}
      </div>

      {paginatedResults.map((verse, index) => {
        const globalIndex = (page - 1) * itemsPerPage + index;
        const direct = audioMap[verse.ref];
        const audioUrl = resolvedUrls[verse.ref] || (direct && /^https?:\/\//i.test(direct) ? direct : '');
        const terms = termsProp && termsProp.length > 0
          ? Array.from(new Set(termsProp.map((t) => t.trim()).filter(Boolean)))
          : (query && query.trim()) ? [query.trim()] : [];
        
        // Check if this verse matches the highlighted book
        const verseBook = verse.ref.split(' ')[0]; // "Hebrews 12:1" -> "Hebrews"
        const isHighlighted = highlightBook && verseBook === highlightBook;

        return (
          <div 
            key={verse.ref} 
            className={`p-4 mb-2 border rounded-md ${
              isHighlighted 
                ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-300 dark:border-blue-600 ring-2 ring-blue-200 dark:ring-blue-700' 
                : 'bg-gray-50 dark:bg-gray-800 dark:border-gray-600'
            }`} 
            dir="rtl"
          >
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-2">
                <h3 className="font-medium text-blue-600 dark:text-blue-400">{verse.ref}</h3>
                {getTranslationBadge(verse.translation, verse.dialect)}
              </div>
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
                  <button
                    type="button"
                    onClick={() => handleDownload(verse.ref, audioUrl)}
                    className="text-xs px-2 py-1 border rounded hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-60"
                    title="Download audio"
                    disabled={!!downloadingMap[verse.ref]}
                  >
                    {downloadingMap[verse.ref] ? 'Downloading…' : 'Download'}
                  </button>
                )}
              </div>
            </div>

            {/* Compact audio controls */}
            {audioUrl && (
              <div className="flex items-center gap-2 mb-2">
                <audio
                  ref={(el) => {
                    if (el) audioRefs.current.set(verse.ref, el);
                  }}
                  src={audioUrl}
                  preload="metadata"
                  className="hidden"
                  onEnded={() => setPlayingKey((k) => (k === verse.ref ? null : k))}
                />
                <button
                  className="px-2 py-1 text-xs rounded border hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => {
                    const el = audioRefs.current.get(verse.ref);
                    if (!el) return;
                    // pause others
                    audioRefs.current.forEach((a, key) => { if (key !== verse.ref) { try { a.pause(); } catch {} } });
                    if (el.paused) {
                      // For Yousafzai verses, seek to verse start time if timing data is available
                      if (verse.translation === 'Yousafzai 2019' && verse.tags && Array.isArray(verse.tags) && verse.tags.length > 0) {
                        const firstSegment = verse.tags[0];
                        if (Array.isArray(firstSegment) && firstSegment.length >= 2 && typeof firstSegment[0] === 'number') {
                          el.currentTime = firstSegment[0]; // Start time from jktags
                        }
                      }
                      el.play().then(() => setPlayingKey(verse.ref)).catch(() => {});
                    } else {
                      el.pause();
                      setPlayingKey(null);
                    }
                  }}
                  title={playingKey === verse.ref ? 'Pause' : 'Play'}
                >
                  {playingKey === verse.ref ? 'Pause' : 'Play'}
                </button>
                {/* no label */}
              </div>
            )}

            <p className="text-gray-800 dark:text-gray-200 leading-relaxed break-words">
              {highlight(verse.text, terms)}
            </p>
          </div>
        );
      })}

      {showPagination && paginationControl('bottom')}
    </div>
  );
}
