"use client";

import React, { useEffect, useMemo, useRef, useState, useCallback, type ReactNode } from 'react';
// Removed Material-UI Pagination for better dark mode support
import type { Verse, AudioMap } from '../types';
import { audioUrlFromRef, resolveAudioUrl } from '../utils/audio';
import { parseRef, dedupByRef, buildHighlightRegex, stripLeadingVerseNumber, highlightPsText, cleanVerseText } from '../utils/highlight';
import HighlightText from './HighlightText';
import VirtualizedResults from './VirtualizedResults';

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
  processed?: any; // processed data from search for highlighting
}

function escapeRegExp(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function highlight(text: string, terms: string[], processed?: any): ReactNode {
  // Use new Pashto-aware highlighting if we have processed data with variants
  if (processed) {
    const tokens = [
      processed.normalized,
      ...(processed.variants ?? []),
      ...(processed.variantGroups?.nouns ?? []).map((v: any) => v.form),
      ...(processed.variantGroups?.verbs ?? []).map((v: any) => v.form),
    ].filter(Boolean) as string[];

    return <HighlightText text={text} tokens={tokens} />;
  }

  // Fallback to simple highlighting
  const cleanTerms = Array.from(new Set(terms.map((t) => t.trim()).filter(Boolean)));
  if (cleanTerms.length === 0) return <span>{text}</span>;

  try {
    const pattern = cleanTerms.map(escapeRegExp).join('|');
    const re = new RegExp(`(${pattern})`, 'gi');
    const parts = text.split(re);

    // Ensure all parts are properly wrapped in React elements
    return (
      <span>
        {parts.map((part, i) =>
          i % 2 === 1
            ? <mark key={i} className="bg-yellow-200 dark:bg-yellow-700/60 px-0.5 rounded">{part}</mark>
            : <span key={i}>{part}</span>
        )}
      </span>
    );
  } catch (error) {
    console.warn('Highlight regex error:', error);
    return <span>{text}</span>;
  }
}

function getTranslationBadge(translation?: string | null, dialect?: string | null): ReactNode {
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

// Separate component for individual verse items (no hooks here!)
function VerseItem({
  verse,
  index,
  page,
  itemsPerPage,
  audioMap,
  resolvedUrls,
  setResolvedUrls,
  downloadingMap,
  setDownloadingMap,
  playingKey,
  setPlayingKey,
  audioRefs,
  termsProp,
  highlightBook,
  processed,
  audioUrl,
  setAudioUrl,
  loadAudioUrl,
  handleDownload,
  handlePlay,
  handlePause
}: {
  verse: Verse;
  index: number;
  page: number;
  itemsPerPage: number;
  audioMap: AudioMap;
  resolvedUrls: Record<string, string>;
  setResolvedUrls: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  downloadingMap: Record<string, boolean>;
  setDownloadingMap: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  playingKey: string | null;
  setPlayingKey: React.Dispatch<React.SetStateAction<string | null>>;
  audioRefs: React.MutableRefObject<Map<string, HTMLAudioElement>>;
  termsProp?: string[];
  highlightBook?: string | null;
  processed?: any;
  audioUrl?: string | null;
  setAudioUrl?: (url: string | null) => void;
  loadAudioUrl?: () => void;
  handleDownload?: () => void;
  handlePlay?: () => void;
  handlePause?: () => void;
}) {
  // Parse verse number from ref only (never from text)
  const refParts = parseRef(verse.ref);
  const verseNo = refParts?.verse ?? null;

  // Safely extract book name for highlighting
  let verseBook = '';
  if (refParts?.book) {
    verseBook = refParts.book;
  }
  const isHighlighted = highlightBook && verseBook === highlightBook;

  // Build highlight regex from processed data
  const tokens = processed ? [
    processed.normalized,
    ...(processed.variants ?? []),
  ].filter(Boolean) as string[] : [];

  // Note: Cannot use hooks in this component, so we'll build regex directly
  const rx = buildHighlightRegex(tokens);

  // Audio controls are now handled by parent component props
  const isPlaying = playingKey === verse.ref;
  const isDownloading = downloadingMap[verse.ref] || false;

  // Debug logging for troubleshooting
  if (!verse.ref) {
    console.warn('Verse missing ref:', verse);
  }

  return (
    <div
      key={verse.ref || `verse-${(page - 1) * itemsPerPage + index}`}
      className={`relative p-3 mb-2 border rounded-md ${
        isHighlighted
          ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-300 dark:border-blue-600 ring-2 ring-blue-200 dark:ring-blue-700'
          : 'bg-gray-50 dark:bg-gray-800 dark:border-gray-600'
      }`}
      style={{ minHeight: '80px' }} // Reduced space for smaller audio player
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
              onClick={handleDownload}
              className="text-xs px-2 py-1 border rounded hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-60"
              title="Download audio"
              disabled={isDownloading}
            >
              {downloadingMap[verse.ref] ? 'Downloading…' : 'Download'}
            </button>
          )}
        </div>
      </div>

      {/* Verse text with absolute-positioned verse number chip */}
      <p className="text-gray-800 dark:text-gray-200 leading-relaxed break-words" dir="rtl" style={{ unicodeBidi: "plaintext" }}>
        {verse.text ? highlight(cleanVerseText(verse.text), termsProp || [], processed) : <span className="text-gray-500 italic">No text available</span>}
      </p>

      {/* Verse number chip removed as requested */}

      {/* Compact audio player - show load button if not loaded yet */}
      {!audioUrl ? (
        <div className="mb-1 p-2 bg-gray-50 dark:bg-gray-800 rounded border">
          <button
            className="px-3 py-1 text-xs rounded border hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={loadAudioUrl}
            title="Load audio for this verse"
          >
            🔊 Load Audio
          </button>
        </div>
      ) : (
        <div className="mb-1 p-2 bg-gray-50 dark:bg-gray-800 rounded border">
          <div className="flex items-center gap-1">
            {/* Play/Pause */}
            <button
              className="px-2 py-1 text-xs rounded border hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={isPlaying ? handlePause : handlePlay}
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? '⏸️' : '▶️'}
            </button>

            {/* Compact audio element */}
            <audio
              ref={(el) => {
                if (el) audioRefs.current.set(verse.ref, el);
              }}
              src={audioUrl}
              preload="metadata"
              controls
              className="flex-1 h-6"
              onTimeUpdate={(e) => {
                // Update progress bar as audio plays
                const audio = e.currentTarget;
                const progress = (audio.currentTime / audio.duration) * 100;
                // You could add a progress bar here if desired
              }}
              onLoadedMetadata={(e) => {
                const audio = e.currentTarget;
                console.log(`Audio loaded for ${verse.ref}: ${audio.duration.toFixed(1)}s`);
              }}
              onEnded={() => setPlayingKey((k) => (k === verse.ref ? null : k))}
              onError={(e) => {
                console.error('Audio error for', verse.ref, e);
              }}
              onPlay={() => setPlayingKey(verse.ref)}
              onPause={() => setPlayingKey(null)}
            />

            {/* Download button */}
            <button
              type="button"
              onClick={handleDownload}
              className="text-xs px-1.5 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-60"
              title="Download audio"
              disabled={isDownloading}
            >
              {downloadingMap[verse.ref] ? '⬇️' : '📥'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ResultsList({ results, audioMap, loading, query, terms: termsProp, highlightBook, processed }: Props) {
  // Early returns BEFORE any hooks to avoid React hooks violations
  if (loading) return <p className="text-center text-gray-500">Loading...</p>;
  if (results.length === 0) return <p className="text-center text-gray-500">No results found.</p>;

  const [page, setPage] = useState(1);
  const itemsPerPage = 10;
  const audioRefs = useRef<Map<string, HTMLAudioElement>>(new Map());
  const [resolvedUrls, setResolvedUrls] = useState<Record<string, string>>({});
  const [playingKey, setPlayingKey] = useState<string | null>(null);
  const [downloadingMap, setDownloadingMap] = useState<Record<string, boolean>>({});
  
  // Enable virtual scrolling for large result sets
  const shouldUseVirtualization = results.length > 200;

  // Reset to page 1 when results change
  useEffect(() => { setPage(1); }, [results.length]);

  // Audio state for each verse (managed at parent level)
  const [verseAudioUrls, setVerseAudioUrls] = useState<Record<string, string | null>>({});

  const loadVerseAudioUrl = useCallback(async (verseRef: string) => {
    if (verseAudioUrls[verseRef]) return; // Already loaded

    const entry = audioMap[verseRef];
    const url = await resolveAudioUrl(verseRef, entry);
    if (url) {
      setVerseAudioUrls(prev => ({ ...prev, [verseRef]: url }));
      setResolvedUrls(prev => ({ ...prev, [verseRef]: url }));
    }
  }, [audioMap, setResolvedUrls, verseAudioUrls]);

  // Helper functions for verse-specific audio operations
  const handleVerseDownload = async (verse: Verse) => {
    if (!verse.ref) return;

    const audioUrl = verseAudioUrls[verse.ref];
    if (!audioUrl) {
      await loadVerseAudioUrl(verse.ref);
    }

    const finalAudioUrl = verseAudioUrls[verse.ref];
    if (!finalAudioUrl) return;

    setDownloadingMap((prev) => ({ ...prev, [verse.ref]: true }));
    try {
      const response = await fetch(finalAudioUrl);
      if (!response.ok) throw new Error(`Failed to download ${verse.ref}`);
      const blob = await response.blob();
      const sanitizedRef = verse.ref.replace(/[^0-9A-Za-z]+/g, '_') || 'audio';
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
      console.error(`Failed to download ${verse.ref}:`, error);
    } finally {
      setDownloadingMap((prev) => {
        const next = { ...prev };
        delete next[verse.ref];
        return next;
      });
    }
  };

  const handleVersePlay = (verse: Verse) => {
    if (!verse.ref) return;

    const audioUrl = verseAudioUrls[verse.ref];
    if (!audioUrl) {
      loadVerseAudioUrl(verse.ref);
      return;
    }

    // Stop any currently playing audio
    if (playingKey && playingKey !== verse.ref) {
      const currentAudio = audioRefs.current.get(playingKey);
      if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
      }
    }

    setPlayingKey(verse.ref);
    const audio = new Audio(audioUrl);
    audioRefs.current.set(verse.ref, audio);

    // Check if this is Yousafzai translation with verse-level timing data
    const hasIndividualClip = verse.translation === 'Yousafzai 2019' && verse.audio_verse_url;
    const hasTimingData = verse.translation === 'Yousafzai 2019' && verse.tags && Array.isArray(verse.tags) && verse.tags.length > 0;

    if (hasIndividualClip) {
      // Individual verse clip - play from beginning
      audio.play().then(() => setPlayingKey(verse.ref)).catch((error) => {
        console.error(`Failed to play individual verse ${verse.ref}:`, error);
        setPlayingKey(null);
      });
    } else if (hasTimingData) {
      // Chapter MP3 - seek to verse start time if timing data is available
      const seekTime = (() => {
        // Find the timing segment for this specific verse
        const verseNumber = parseRef(verse.ref)?.verse;
        if (!verseNumber || !verse.tags) return null;

        // Look for the first segment that corresponds to this verse
        for (const segment of verse.tags) {
          if (Array.isArray(segment) && segment.length >= 2 && typeof segment[0] === 'number') {
            // segment[0] is start time, segment[1] is end time (optional)
            return segment[0]; // Start time from jktags
          }
        }
        return null;
      })();

      if (seekTime !== null) {
        // Seek after play starts to ensure audio is ready
        audio.play().then(() => {
          audio.currentTime = seekTime;
          setPlayingKey(verse.ref);
        }).catch((error) => {
          console.error(`Failed to play chapter with seeking ${verse.ref}:`, error);
          setPlayingKey(null);
        });
      } else {
        // No timing data found, play from beginning
        audio.play().then(() => setPlayingKey(verse.ref)).catch((error) => {
          console.error(`Failed to play chapter ${verse.ref}:`, error);
          setPlayingKey(null);
        });
      }
    } else {
      // Regular chapter audio - play from beginning
      audio.play().then(() => setPlayingKey(verse.ref)).catch((error) => {
        console.error(`Failed to play ${verse.ref}:`, error);
        setPlayingKey(null);
      });
    }

    audio.addEventListener('ended', () => {
      setPlayingKey(null);
      audioRefs.current.delete(verse.ref);
    });

    audio.addEventListener('error', () => {
      console.error(`Audio error for ${verse.ref}:`, audio.error);
      setPlayingKey(null);
      audioRefs.current.delete(verse.ref);
    });
  };

  const handleVersePause = (verse: Verse) => {
    if (!verse.ref || playingKey !== verse.ref) return;

    const audio = audioRefs.current.get(verse.ref);
    if (audio) {
      audio.pause();
      setPlayingKey(null);
    }
  };

  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const paginatedResults = results.slice((page - 1) * itemsPerPage, page * itemsPerPage);

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

  // Render function for virtualized items
  const renderVirtualizedItem = (verse: Verse, index: number) => (
    <VerseItem
      key={verse.ref || `verse-${index}`}
      verse={verse}
      index={index}
      page={1}
      itemsPerPage={1}
      audioMap={audioMap}
      resolvedUrls={resolvedUrls}
      setResolvedUrls={setResolvedUrls}
      downloadingMap={downloadingMap}
      setDownloadingMap={setDownloadingMap}
      playingKey={playingKey}
      setPlayingKey={setPlayingKey}
      audioRefs={audioRefs}
      termsProp={termsProp}
      highlightBook={highlightBook}
      processed={processed}
      audioUrl={verseAudioUrls[verse.ref] || null}
      setAudioUrl={(url: string | null) => setVerseAudioUrls(prev => ({ ...prev, [verse.ref]: url }))}
      loadAudioUrl={() => loadVerseAudioUrl(verse.ref)}
      handleDownload={() => handleVerseDownload(verse)}
      handlePlay={() => handleVersePlay(verse)}
      handlePause={() => handleVersePause(verse)}
    />
  );

  return (
    <div>
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between text-sm text-gray-600 dark:text-gray-400">
        <span>
          Showing {shouldUseVirtualization ? results.length : paginatedResults.length} of {results.length} results
          {!shouldUseVirtualization && results.length > itemsPerPage && (
            <span className="ml-2 text-xs">
              (Page {page} of {Math.ceil(results.length / itemsPerPage)})
            </span>
          )}
          {shouldUseVirtualization && (
            <span className="ml-2 text-xs text-blue-600">
              (Virtualized for performance)
            </span>
          )}
        </span>
        {!shouldUseVirtualization && showPagination && paginationControl('top')}
      </div>

      {shouldUseVirtualization ? (
        <VirtualizedResults
          verses={results}
          itemHeight={120}
          containerHeight={600}
          overscan={5}
          renderItem={renderVirtualizedItem}
          className="border border-gray-200 dark:border-gray-700 rounded-lg"
        />
      ) : (
        <>
          {paginatedResults.map((verse, index) => (
            <VerseItem
              key={verse.ref || `verse-${(page - 1) * itemsPerPage + index}`}
              verse={verse}
              index={index}
              page={page}
              itemsPerPage={itemsPerPage}
              audioMap={audioMap}
              resolvedUrls={resolvedUrls}
              setResolvedUrls={setResolvedUrls}
              downloadingMap={downloadingMap}
              setDownloadingMap={setDownloadingMap}
              playingKey={playingKey}
              setPlayingKey={setPlayingKey}
              audioRefs={audioRefs}
              termsProp={termsProp}
              highlightBook={highlightBook}
              processed={processed}
              audioUrl={verseAudioUrls[verse.ref] || null}
              setAudioUrl={(url: string | null) => setVerseAudioUrls(prev => ({ ...prev, [verse.ref]: url }))}
              loadAudioUrl={() => loadVerseAudioUrl(verse.ref)}
              handleDownload={() => handleVerseDownload(verse)}
              handlePlay={() => handleVersePlay(verse)}
              handlePause={() => handleVersePause(verse)}
            />
          ))}

          {showPagination && paginationControl('bottom')}
        </>
      )}
    </div>
  );
}
// Fixed React hooks issue
