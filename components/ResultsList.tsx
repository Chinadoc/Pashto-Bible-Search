"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
// Removed Material-UI Pagination for better dark mode support
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
        const ref = verse?.ref?.trim();
        if (!ref) continue; // Guard against missing ref
        if (resolvedUrls[ref]) continue;
        // Skip OT books for now (no audio)
        const lastSpaceIndex = ref.lastIndexOf(' ');
        const book = lastSpaceIndex > 0 ? ref.slice(0, lastSpaceIndex) : '';
        const isYousafzai = verse.translation === 'Yousafzai 2019';
        if (OT_BOOKS.has(book) && !isYousafzai) continue;

        // For Yousafzai verses, prefer individual verse clip over chapter MP3
        let url = '';
        if (isYousafzai && verse.audio_verse_url) {
          url = verse.audio_verse_url;
        } else {
          const direct = audioMap[ref];
          const derived = direct || audioUrlFromRef(ref, audioMap);
          if (derived && /^https?:\/\//i.test(derived)) {
            url = derived;
          }
        }

        // If no URL in audio map, try API (this will use Supabase Storage)
        if (!url) {
          try {
            // Force refresh audio map to get updated URLs without Drive links
            const r = await fetch(`/api/audio_url?ref=${encodeURIComponent(ref)}`, { cache: 'no-store' });
            const js = await r.json().catch(() => ({}));
            url = js?.url || '';
            console.log(`Generated audio URL for ${ref}:`, url ? 'SUCCESS' : 'FAILED');
            if (url && !url.includes('drive.google.com')) {
              console.log(`✅ Supabase Storage URL: ${url.substring(0, 80)}...`);
            } else if (url.includes('drive.google.com')) {
              console.warn(`⚠️ Google Drive URL still being used: ${ref}`);
            }
          } catch (error) {
            console.log(`Failed to generate audio URL for ${ref}:`, error);
          }
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

  const paginationControl = (position: 'top' | 'bottom') => {
    const totalPages = Math.ceil(results.length / itemsPerPage)
    if (totalPages <= 1) return null
    
    return (
      <div className={position === 'bottom' ? 'mt-6 flex justify-center' : 'flex justify-end'}>
        <div className="flex items-center gap-2">
          <button
            onClick={() => handlePageChange({} as any, 1)}
            disabled={page === 1}
            className="px-3 py-1 text-sm bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 dark:hover:bg-gray-600"
          >
            First
          </button>
          <button
            onClick={() => handlePageChange({} as any, page - 1)}
            disabled={page === 1}
            className="px-3 py-1 text-sm bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 dark:hover:bg-gray-600"
          >
            Prev
          </button>
          <span className="px-3 py-1 text-sm bg-blue-500 text-white rounded">
            {page}
          </span>
          <span className="text-gray-500 dark:text-gray-400">of {totalPages}</span>
          <button
            onClick={() => handlePageChange({} as any, page + 1)}
            disabled={page === totalPages}
            className="px-3 py-1 text-sm bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 dark:hover:bg-gray-600"
          >
            Next
          </button>
          <button
            onClick={() => handlePageChange({} as any, totalPages)}
            disabled={page === totalPages}
            className="px-3 py-1 text-sm bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 dark:hover:bg-gray-600"
          >
            Last
          </button>
        </div>
      </div>
    )
  }

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

        // Debug logging for troubleshooting
        if (!verse.ref) {
          console.warn('Verse missing ref:', verse);
        }

        // Safely get audio URL
        const audioUrl = (verse.ref && audioMap[verse.ref]) || '';
        if (verse.ref && audioUrl) {
          console.log('Found audio for:', verse.ref);
          if (audioUrl.includes('drive.google.com')) {
            console.warn(`⚠️ Using Google Drive URL for ${verse.ref} - consider refreshing audio map`);
          } else if (audioUrl.includes('supabase.co/storage')) {
            console.log(`✅ Using Supabase Storage URL for ${verse.ref}`);
          }
        }

        const terms = termsProp && termsProp.length > 0
          ? Array.from(new Set(termsProp.map((t) => t.trim()).filter(Boolean)))
          : (query && query.trim()) ? [query.trim()] : [];

        // Safely extract book name for highlighting
        let verseBook = '';
        if (verse.ref && typeof verse.ref === 'string' && verse.ref.trim()) {
          const parts = verse.ref.trim().split(' ');
          verseBook = parts.length > 1 ? parts.slice(0, -1).join(' ') : parts[0] || '';
        }
        const isHighlighted = highlightBook && verseBook === highlightBook;

        return (
          <div
            key={verse.ref || `verse-${globalIndex}`}
            className={`p-4 mb-2 border rounded-md ${
              isHighlighted
                ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-300 dark:border-blue-600 ring-2 ring-blue-200 dark:ring-blue-700'
                : 'bg-gray-50 dark:bg-gray-800 dark:border-gray-600'
            }`}
          >
            <div className="flex justify-between items-start mb-2" dir="ltr">
              <div className="flex items-center gap-2">
                <h3 className="font-medium text-blue-600 dark:text-blue-400">{verse.ref || 'Unknown Reference'}</h3>
                {getTranslationBadge(verse.translation, verse.dialect)}
              </div>
              <div className="flex items-center gap-2">
                {/* Copy verse */}
                <button
                  onClick={async () => {
                    try {
                      await navigator.clipboard.writeText(`${verse.ref || 'Unknown Reference'}\n${verse.text || ''}`);
                    } catch {}
                  }}
                  className="text-xs px-2 py-1 border rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                  title="Copy verse"
                >
                  Copy
                </button>
                {/* Download audio */}
                {audioUrl && verse.ref && (
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

            {/* only the Pashto text needs RTL */}
            <p className="text-gray-800 dark:text-gray-200 leading-relaxed break-words" dir="rtl">
              {highlight(verse.text || '', terms)}
            </p>

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
                      // For Yousafzai verses with individual verse clips, no seeking needed
                      const hasIndividualClip = verse.translation === 'Yousafzai 2019' && verse.audio_verse_url;
                      
                      if (hasIndividualClip) {
                        // Individual verse clip - play from beginning
                        el.play().then(() => setPlayingKey(verse.ref)).catch(() => {});
                      } else {
                        // Chapter MP3 - seek to verse start time if timing data is available
                        const seekTime = verse.translation === 'Yousafzai 2019' && verse.tags && Array.isArray(verse.tags) && verse.tags.length > 0
                          ? (() => {
                              const firstSegment = verse.tags[0];
                              return Array.isArray(firstSegment) && firstSegment.length >= 2 && typeof firstSegment[0] === 'number'
                                ? firstSegment[0] // Start time from jktags
                                : null;
                            })()
                          : null;

                        if (seekTime !== null) {
                          // Seek after play starts to ensure audio is ready
                          el.play().then(() => {
                            el.currentTime = seekTime;
                            setPlayingKey(verse.ref);
                          }).catch(() => {});
                        } else {
                          el.play().then(() => setPlayingKey(verse.ref)).catch(() => {});
                        }
                      }
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
