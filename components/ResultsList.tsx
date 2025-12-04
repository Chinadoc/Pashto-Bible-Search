"use client";

import React, { useEffect, useMemo, useRef, useState, useCallback, type ReactNode } from 'react';
// Removed Material-UI Pagination for better dark mode support
import type {
  Verse,
  AudioMap,
  VerbFilterState,
  MultiVerbFilterState,
  DictionaryData,
  RelatedFormVariant,
} from '../types';
import { audioUrlFromRef, resolveAudioUrl } from '@/app/lib/audio';
import { parseRef, dedupByRef, buildHighlightRegex, stripLeadingVerseNumber, highlightPsText, cleanVerseText } from '../utils/highlight';
import HighlightText from './HighlightText';
import EnhancedHighlightText from './EnhancedHighlightText';
import VirtualizedResults from './VirtualizedResults';
import VerbDetails from './VerbDetails';
import VerbConjugationTable from './VerbConjugationTable';
import InflectionExplainer from './InflectionExplainer';
import InteractiveVerse from './InteractiveVerse';
import {
  matchesPerson,
  matchesTense,
  matchesMood,
  matchesAspect,
  normalizeLabel
} from '@/app/utils/verb-filters';
import { useSession } from "next-auth/react";

// Anki Card Export Button - creates a complete .apkg file with embedded audio
interface AnkiExportProps {
  verseRef: string;
  verseText: string;
  searchWord?: string;
  dictionaryData?: DictionaryData | null;
  matchedForms?: string[];
  audioUrl?: string | null;
  source?: 'bible' | 'video' | 'poem' | 'proverb';
}

function AnkiExportButton({ verseRef, verseText, searchWord, dictionaryData, matchedForms, audioUrl: initialAudioUrl, source = 'bible' }: AnkiExportProps) {
  const [exporting, setExporting] = useState(false);
  
  const handleExport = async () => {
    setExporting(true);
    try {
      // Dynamic import of anki-apkg-export (client-side only)
      const { default: AnkiExport } = await import('anki-apkg-export');
      const { saveAs } = await import('file-saver');
      
      // Try to get audio URL if not already available
      let audioUrl = initialAudioUrl;
      if (!audioUrl && verseRef && source === 'bible') {
        try {
          const audioRes = await fetch(`/api/audio?ref=${encodeURIComponent(verseRef)}`);
          if (audioRes.ok) {
            const audioData = await audioRes.json();
            audioUrl = audioData.url || null;
          }
        } catch (e) {
          console.log('Could not fetch audio URL for Anki card');
        }
      }
      
      // Get dictionary info for the searched word
      let translation = '';
      let romanization = '';
      let pos = '';
      let baseWord = searchWord || matchedForms?.[0] || '';
      
      // Build word info from dictionary data
      if (dictionaryData?.entries?.length) {
        const entry = dictionaryData.entries[0];
        baseWord = entry.pashto || baseWord;
        romanization = entry.romanized || '';
        pos = entry.pos || '';
        translation = entry.english || '';
      } else if (matchedForms?.length || searchWord) {
        // Try to fetch word analysis
        const wordToAnalyze = matchedForms?.[0] || searchWord;
        if (wordToAnalyze) {
          try {
            const res = await fetch(`/api/word-analysis?word=${encodeURIComponent(wordToAnalyze)}`);
            if (res.ok) {
              const data = await res.json();
              if (data.dictionary) {
                baseWord = data.dictionary.baseWord || data.dictionary.pashto || baseWord;
                romanization = data.dictionary.romanization || '';
                pos = data.dictionary.pos || '';
                translation = data.dictionary.english || '';
              }
            }
          } catch (e) {
            console.log('Could not fetch word analysis for Anki export');
          }
        }
      }
      
      // Build the "Helpful Word" field with inflection chain
      let helpfulWord = baseWord;
      if (romanization) helpfulWord += ` - ${romanization}`;
      if (pos) helpfulWord += ` (${pos})`;
      
      // Show inflection chain if the matched form differs from base
      const matchedForm = matchedForms?.[0] || searchWord;
      if (matchedForm && matchedForm !== baseWord) {
        helpfulWord = `${matchedForm} ← ${helpfulWord}`;
      }
      
      // Create deck name based on source
      const deckName = source === 'bible' 
        ? 'Pashto Bible' 
        : source === 'video' 
          ? 'Pashto Videos' 
          : source === 'poem' 
            ? 'Pashto Poetry' 
            : 'Pashto Proverbs';
      
      // Create the Anki package
      const apkg = new AnkiExport(deckName);
      
      // Audio filename (sanitized)
      const audioFileName = `${(matchedForm || baseWord || verseRef).replace(/[: /\\?*"|<>]/g, '_')}.mp3`;
      
      // Build the Pashto sentence with source info embedded
      let pashtoSentenceWithSource = verseText;
      if (source === 'bible') {
        pashtoSentenceWithSource = `<div style="font-size: 12px; color: #6b7280; margin-bottom: 8px;">📖 ${verseRef}</div>${verseText}`;
      } else if (source === 'video') {
        pashtoSentenceWithSource = `<div style="font-size: 12px; color: #6b7280; margin-bottom: 8px;">🎬 ${verseRef}</div>${verseText}`;
      } else if (source === 'poem') {
        pashtoSentenceWithSource = `<div style="font-size: 12px; color: #6b7280; margin-bottom: 8px;">📜 ${verseRef}</div>${verseText}`;
      }
      
      // FRONT of card: The Word being studied
      const front = `
<div style="text-align: center; direction: rtl; font-family: 'Noto Naskh Arabic', 'Scheherazade New', serif;">
  <div style="font-size: 56px; font-weight: bold; color: #1d4ed8; margin: 20px 0;">
    ${matchedForm || baseWord}
  </div>
  ${romanization ? `
  <div style="font-size: 20px; color: #64748b; font-style: italic; margin-bottom: 10px; direction: ltr;">
    ${romanization}
  </div>
  ` : ''}
  ${translation ? `
  <div style="font-size: 18px; color: #374151; margin: 15px 0; direction: ltr;">
    ${translation}
  </div>
  ` : ''}
</div>
      `.trim();
      
      // BACK of card: Pashto Sentence with audio
      const back = `
<div style="text-align: center; direction: rtl; font-family: 'Noto Naskh Arabic', 'Scheherazade New', serif;">
  <!-- Audio plays automatically on back -->
  ${audioUrl ? `<div style="margin-bottom: 15px;">[sound:${audioFileName}]</div>` : ''}
  
  <!-- Pashto Sentence with source -->
  <div style="font-size: 24px; line-height: 2; margin: 20px 0; padding: 15px; background: #f8fafc; border-radius: 8px;">
    ${pashtoSentenceWithSource}
  </div>
  
  <!-- Helpful Word (inflection info) -->
  ${helpfulWord ? `
  <div style="font-size: 14px; color: #6b7280; margin-top: 15px; padding: 10px; background: #fef3c7; border-radius: 6px; direction: ltr;">
    💡 ${helpfulWord}
  </div>
  ` : ''}
</div>

<style>
  mark, .highlight {
    background-color: #fef08a;
    padding: 2px 6px;
    border-radius: 4px;
    font-weight: bold;
  }
</style>
      `.trim();
      
      // Add the card to the deck
      apkg.addCard(front, back);
      
      // Download and embed audio if available
      if (audioUrl) {
        try {
          const audioResponse = await fetch(audioUrl);
          if (audioResponse.ok) {
            const audioBlob = await audioResponse.blob();
            apkg.addMedia(audioFileName, audioBlob);
          }
        } catch (e) {
          console.error('Failed to download audio for Anki card', e);
        }
      }
      
      // Generate and save the .apkg file
      const zip = await apkg.save();
      const fileName = `${(matchedForm || baseWord || verseRef).replace(/[: /\\?*"|<>]/g, '_')}_${source}.apkg`;
      saveAs(zip, fileName);
      
    } catch (err) {
      console.error('Failed to export Anki card', err);
      alert('Failed to create Anki package. Please try again.');
    } finally {
      setExporting(false);
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={exporting}
      className="text-xs px-3 py-1.5 border border-amber-600/50 rounded-lg hover:bg-amber-700/30 text-amber-400 hover:text-amber-300 transition-colors"
      title="Export as Anki deck (.apkg) with embedded audio"
    >
      {exporting ? '⏳' : '📇 Anki'}
    </button>
  );
}

// Practice Button - saves verse and navigates to typer
function PracticeButton({ verseRef }: { verseRef: string }) {
  const { data: session } = useSession();
  const [saving, setSaving] = useState(false);
  
  const handlePractice = async () => {
    // If logged in, save the verse first
    if (session) {
      setSaving(true);
      try {
        await fetch('/api/saved-verses', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ verseRef }),
        });
      } catch (err) {
        console.error('Failed to save verse', err);
      }
      setSaving(false);
    }
    // Navigate to typer
    window.location.href = `/typer?ref=${encodeURIComponent(verseRef || '')}`;
  };

  return (
    <button
      onClick={handlePractice}
      disabled={saving}
      className="text-xs px-3 py-1.5 border border-emerald-600/50 rounded-lg hover:bg-emerald-700/30 text-emerald-400 hover:text-emerald-300 transition-colors flex items-center gap-1"
      title={session ? "Save verse and practice typing" : "Practice typing this verse"}
    >
      {saving ? '...' : '⌨️ Practice'}
    </button>
  );
}

const OT_BOOKS = new Set([
  'Genesis', 'Exodus', 'Leviticus', 'Numbers', 'Deuteronomy', 'Joshua', 'Judges', 'Ruth', '1 Samuel', '2 Samuel', '1 Kings', '2 Kings', '1 Chronicles', '2 Chronicles', 'Ezra', 'Nehemiah', 'Esther', 'Job', 'Psalms', 'Proverbs', 'Ecclesiastes', 'Song of Solomon', 'Isaiah', 'Jeremiah', 'Lamentations', 'Ezekiel', 'Daniel', 'Hosea', 'Joel', 'Amos', 'Obadiah', 'Jonah', 'Micah', 'Nahum', 'Habakkuk', 'Zephaniah', 'Haggai', 'Zechariah', 'Malachi'
]);

interface Props {
  results: Verse[];
  audioMap: AudioMap;
  loading: boolean;
  query?: string; // legacy single-term highlight (fallback)
  terms?: string[]; // preferred: multiple variants to highlight
  highlightBook?: string | null; // book to visually highlight
  processed?: any; // processed data from search for highlighting
  dictionaryData?: DictionaryData | null;
  verbFilters?: VerbFilterState;
  multiVerbFilters?: MultiVerbFilterState;
  activeVariantForms?: string[];
  onResetFilters?: () => void;
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
    // Sort by length (longest first) to prioritize longer matches
    cleanTerms.sort((a, b) => b.length - a.length);
    const pattern = cleanTerms.map(escapeRegExp).join('|');

    // Simple regex - longer matches take priority due to sort order
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

// Enhanced highlighting function that shows inflection reasons
function highlightWithInflectionReasons(
  text: string,
  terms: string[],
  processed?: any,
  translation?: 'afghan2023' | 'yousafzai2019'
): ReactNode {
  if (!processed || !processed.variantDetails) {
    return highlight(text, terms, processed);
  }

  // Build a map of form -> inflection reasons
  const formToReasons = new Map<string, { plural: number; sandwich: number; transitive_past: number; sandwich_types: string[] }>();
  const formToInflectionType = new Map<string, string>();

  // Extract inflection data from variantDetails
  if (processed.variantDetails) {
    for (const detail of processed.variantDetails) {
      if (detail.form && detail.inflectionReasons) {
        formToReasons.set(detail.form, detail.inflectionReasons);
      }
      if (detail.form && detail.inflectionType) {
        formToInflectionType.set(detail.form, detail.inflectionType);
      }
    }
  }

  // Also check relatedForms for inflection data
  if (processed.relatedForms) {
    const allForms = [
      ...(processed.relatedForms.nouns || []),
      ...(processed.relatedForms.verbs || []),
      ...(processed.relatedForms.other || [])
    ];

    for (const form of allForms) {
      if (form.form && form.inflectionReasons) {
        formToReasons.set(form.form, form.inflectionReasons);
      }
      if (form.form && form.inflectionType) {
        formToInflectionType.set(form.form, form.inflectionType);
      }
    }
  }

  // Get all tokens to highlight
  const tokens = [
    processed.normalized,
    ...(processed.variants ?? []),
    ...(processed.variantGroups?.nouns ?? []).map((v: any) => v.form),
    ...(processed.variantGroups?.verbs ?? []).map((v: any) => v.form),
  ].filter(Boolean) as string[];

  // Use HighlightText for basic highlighting
  const basicHighlighted = <HighlightText text={text} tokens={tokens} />;

  // If no inflection reasons, return basic highlighting
  if (formToReasons.size === 0) {
    return basicHighlighted;
  }

  // Enhanced highlighting with inflection reason tags
  return (
    <EnhancedHighlightText
      text={text}
      tokens={tokens}
      formToReasons={formToReasons}
      formToInflectionType={formToInflectionType}
      translation={translation}
    />
  );
}

function getTranslationBadge(translation?: string | null, dialect?: string | null): ReactNode {
  if (!translation || translation === 'Standard') return null;

  const isYousafzai = translation === 'Yousafzai 2019';
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${isYousafzai
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
  isLoadingAudio,
  handleDownload,
  handlePlay,
  handlePause,
  filteredResultsLength,
  searchWord,
  dictionaryData
}: {
  verse: Verse;
  index: number;
  page: number;
  itemsPerPage: number;
  audioMap: AudioMap;
  resolvedUrls: Record<string, string | null>;
  setResolvedUrls: React.Dispatch<React.SetStateAction<Record<string, string | null>>>;
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
  isLoadingAudio?: boolean;
  handleDownload?: () => void;
  handlePlay?: () => void;
  handlePause?: () => void;
  filteredResultsLength?: number;
  searchWord?: string;
  dictionaryData?: DictionaryData | null;
}) {
  // Parse verse number from ref only (never from text)
  const refParts = verse.ref?.startsWith('video:') ? null : parseRef(verse.ref);
  const verseNo = refParts?.verse ?? null;
  const isVideoResult = verse.ref?.startsWith('video:') || (verse as any).source === 'video_transcript';

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
      className={`verse-item ${isHighlighted ? 'highlighted' : ''}`}
      style={{ minHeight: '80px' }}
    >
      <div className="flex justify-between items-start mb-3" dir="ltr">
        <div className="flex items-center gap-2 flex-wrap">
          {/* Verse Reference - prominently displayed */}
          {verse.ref && (
            <span className="font-semibold text-white text-sm">
              {verse.ref}
            </span>
          )}
          {getTranslationBadge(verse.translation, verse.dialect)}
        </div>
        <div className="flex items-center gap-2">
          {/* Copy verse */}
          <button
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(`${verse.ref || 'Unknown Reference'}\n${verse.text || ''}`);
              } catch { }
            }}
            className="text-xs px-3 py-1.5 border border-gray-600 rounded-lg hover:bg-gray-700/50 text-gray-300 hover:text-white transition-colors"
            title="Copy verse"
          >
            Copy
          </button>
          {/* Download audio */}
          {audioUrl && verse.ref && (
            <button
              type="button"
              onClick={handleDownload}
              className="text-xs px-3 py-1.5 border border-gray-600 rounded-lg hover:bg-gray-700/50 text-gray-300 hover:text-white disabled:opacity-60 transition-colors"
              title="Download audio"
              disabled={isDownloading}
            >
              {downloadingMap[verse.ref] ? 'Downloading…' : 'Download'}
            </button>
          )}
          {/* Export as Anki Card */}
          <AnkiExportButton 
            verseRef={verse.ref} 
            verseText={verse.text || ''} 
            searchWord={searchWord}
            dictionaryData={dictionaryData}
            matchedForms={verse.matchedForms}
            audioUrl={audioUrl}
          />

          {/* Practice in Typer (saves verse if logged in) */}
          <PracticeButton verseRef={verse.ref} />
        </div>
      </div>

      {/* Matched Forms Badges */}
      {verse.matchedForms && verse.matchedForms.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2" dir="ltr">
          {verse.matchedForms.map((form, idx) => (
            <span
              key={`${form}-${idx}`}
              className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 border border-purple-300 dark:border-purple-700"
              title="Matched form in this verse"
            >
              {form}
            </span>
          ))}
        </div>
      )}

      {/* Verse text - interactive with word tooltips */}
      <div className="text-gray-100 leading-relaxed break-words text-base">
        {verse.text ? (
          <InteractiveVerse
            text={cleanVerseText(verse.text)}
            verseRef={verse.ref}
            highlightedForms={verse.matchedForms || termsProp || []}
            showAnalysis={true}
            className=""
          />
        ) : (
          <span className="text-gray-400 italic" dir="rtl">No text available</span>
        )}
      </div>

      {/* Inflection Explainer - dynamically shows grammatical reasons for inflected words */}
      {verse.text && verse.ref && (
        <InflectionExplainer
          verseRef={verse.ref}
          verseText={cleanVerseText(verse.text)}
          highlightedForms={verse.matchedForms || termsProp}
          compact={false}
        />
      )}

      {/* Audio player */}
      {!audioUrl ? (
        <div className="mt-3 pt-3 border-t border-gray-700/50">
          <button
            onClick={loadAudioUrl}
            className={`px-3 py-1.5 text-sm rounded-lg border transition-colors flex items-center gap-2 ${audioUrl === 'MISSING'
              ? 'border-red-200 bg-red-50 text-red-400 cursor-not-allowed dark:border-red-900/30 dark:bg-red-900/10 dark:text-red-500'
              : 'border-blue-200 bg-blue-50 text-blue-600 hover:bg-blue-100 hover:border-blue-300 dark:border-blue-800 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/40'
              }`}
            title={audioUrl === 'MISSING' ? 'No audio available for this verse' : 'Load audio for this verse'}
            disabled={isLoadingAudio || audioUrl === 'MISSING'}
          >
            {isLoadingAudio ? '⏳ Loading...' : audioUrl === 'MISSING' ? '❌ No Audio' : '🔊 Load Audio'}
          </button>
        </div>
      ) : (
        <div className="mt-3 pt-3 border-t border-gray-700/50">
          <div className="flex items-center gap-2">
            {/* Audio element - native controls only (no duplicate play button) */}
            <audio
              ref={(el) => {
                if (el) audioRefs.current.set(verse.ref, el);
              }}
              src={audioUrl}
              preload="auto"
              controls
              playsInline
              controlsList="nodownload"
              className="flex-1 h-8 min-w-0"
              style={{ minWidth: '120px' }}
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
                // Try to reload on error (common on mobile)
                const audio = e.currentTarget;
                if (audio.src && audio.error) {
                  console.log('Attempting to reload audio...');
                  audio.load();
                }
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

export default function ResultsList({ results, audioMap, loading, query, terms: termsProp, highlightBook, processed, dictionaryData, verbFilters, multiVerbFilters, activeVariantForms, onResetFilters }: Props) {
  // Early returns BEFORE any hooks to avoid React hooks violations
  if (loading) return <p className="text-center text-gray-500">Loading...</p>;

  // Enhanced "No results" message with context
  if (results.length === 0) {
    // Check for active filters - Check ALL filters
    const hasActiveFiltersNoResults = multiVerbFilters ? (
      multiVerbFilters.person.some(p => p !== 'all') ||
      multiVerbFilters.tense.some(t => t !== 'all') ||
      multiVerbFilters.aspect.some(a => a !== 'all') ||
      multiVerbFilters.mood.some(m => m !== 'all')
    ) : verbFilters && (
      verbFilters.person !== 'all' ||
      verbFilters.tense !== 'all' ||
      verbFilters.aspect !== 'all' ||
      verbFilters.mood !== 'all'
    );

    // Count active filters from each category
    const activeFilterCountNoResults = multiVerbFilters ? (
      (multiVerbFilters.person.some(p => p !== 'all') ? 1 : 0) +
      (multiVerbFilters.tense.some(t => t !== 'all') ? 1 : 0) +
      (multiVerbFilters.aspect.some(a => a !== 'all') ? 1 : 0) +
      (multiVerbFilters.mood.some(m => m !== 'all') ? 1 : 0)
    ) : verbFilters ? (
      (verbFilters.person !== 'all' ? 1 : 0) +
      (verbFilters.tense !== 'all' ? 1 : 0) +
      (verbFilters.aspect !== 'all' ? 1 : 0) +
      (verbFilters.mood !== 'all' ? 1 : 0)
    ) : 0;

    // Collect active filter labels
    const activeLabelsNoResults: string[] = [];
    if (multiVerbFilters) {
      activeLabelsNoResults.push(...multiVerbFilters.person.filter(p => p !== 'all'));
      activeLabelsNoResults.push(...multiVerbFilters.tense.filter(t => t !== 'all'));
      activeLabelsNoResults.push(...multiVerbFilters.aspect.filter(a => a !== 'all'));
      activeLabelsNoResults.push(...multiVerbFilters.mood.filter(m => m !== 'all'));
    } else if (verbFilters) {
      if (verbFilters.person !== 'all') activeLabelsNoResults.push(verbFilters.person);
      if (verbFilters.tense !== 'all') activeLabelsNoResults.push(verbFilters.tense);
      if (verbFilters.aspect !== 'all') activeLabelsNoResults.push(verbFilters.aspect);
      if (verbFilters.mood !== 'all') activeLabelsNoResults.push(verbFilters.mood);
    }

    if (hasActiveFiltersNoResults) {
      return (
        <div className="text-center text-gray-500 p-6">
          <div className="mb-4">
            <p className="text-lg font-medium mb-2">No results match your current filters.</p>
            <p className="text-sm text-gray-600 mb-4">
              The corpus may not contain these specific conjugated forms.
              Try removing some filters or searching for the base form.
            </p>
          </div>

          {activeFilterCountNoResults > 0 && (
            <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="flex flex-col items-center gap-2 mb-2">
                <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
                  {activeFilterCountNoResults} filter{activeFilterCountNoResults !== 1 ? 's' : ''} active:
                </span>
                <div className="flex gap-1 flex-wrap justify-center">
                  {activeLabelsNoResults.map((label, idx) => (
                    <span
                      key={`${label}-${idx}`}
                      className="px-2 py-1 text-xs bg-blue-200 dark:bg-blue-800 text-blue-800 dark:text-blue-200 rounded capitalize"
                    >
                      {label}
                    </span>
                  ))}
                </div>
                {onResetFilters && (
                  <button
                    onClick={onResetFilters}
                    className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200 underline"
                  >
                    Reset all filters
                  </button>
                )}
              </div>

              <div className="text-xs text-blue-700 dark:text-blue-300">
                💡 Tip: Try removing some filters to see more results
              </div>
            </div>
          )}

          {activeVariantForms && activeVariantForms.length > 0 && (
            <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                Searching with {activeVariantForms.length} verb forms{processed?.searchedForm && processed.searchedForm !== processed.root ? ` (from "${processed.searchedForm}")` : ''}:
              </p>
              <div className="flex flex-wrap gap-1 justify-center">
                {activeVariantForms.slice(0, 8).map((form, i) => (
                  <span
                    key={i}
                    className="px-2 py-1 text-xs bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded"
                  >
                    {form}
                  </span>
                ))}
                {activeVariantForms.length > 8 && (
                  <span className="px-2 py-1 text-xs text-gray-500">
                    +{activeVariantForms.length - 8} more
                  </span>
                )}
              </div>
            </div>
          )}

          {onResetFilters && (
            <button
              onClick={onResetFilters}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Reset Filters
            </button>
          )}
        </div>
      );
    }

    return <p className="text-center text-gray-500">No results found.</p>;
  }

  const [page, setPage] = useState(1);
  const itemsPerPage = 10;
  const audioRefs = useRef<Map<string, HTMLAudioElement>>(new Map());
  const [resolvedUrls, setResolvedUrls] = useState<Record<string, string | null>>({});
  const [playingKey, setPlayingKey] = useState<string | null>(null);
  const [downloadingMap, setDownloadingMap] = useState<Record<string, boolean>>({});

  // Verb details state
  const [verbData, setVerbData] = useState<{
    metadata: any;
    conjugations: any[];
    lingdocs_url: string | null;
  } | null>(null);

  // Fetch verb details when query changes
  useEffect(() => {
    const fetchVerbDetails = async () => {
      // Use the searched form from processed data if available, otherwise use query
      const searchTerm = processed?.searchedForm || query;

      if (!searchTerm || searchTerm.length < 2) {
        setVerbData(null);
        return;
      }

      try {
        const res = await fetch(`/api/verbs/lookup?word=${encodeURIComponent(searchTerm)}`);
        if (res.ok) {
          const data = await res.json();
          setVerbData(data);
        } else {
          setVerbData(null);
        }
      } catch (error) {
        console.error('Failed to fetch verb details:', error);
        setVerbData(null);
      }
    };

    fetchVerbDetails();
  }, [query, processed?.searchedForm]);

  // Filter state indicator - Check ALL filters (person, tense, aspect, mood)
  const hasActiveFilters = multiVerbFilters ? (
    multiVerbFilters.person.some(p => p !== 'all') ||
    multiVerbFilters.tense.some(t => t !== 'all') ||
    multiVerbFilters.aspect.some(a => a !== 'all') ||
    multiVerbFilters.mood.some(m => m !== 'all')
  ) : verbFilters && (
    verbFilters.person !== 'all' ||
    verbFilters.tense !== 'all' ||
    verbFilters.aspect !== 'all' ||
    verbFilters.mood !== 'all'
  );

  // Count active filters from each category
  const activeFilterCount = multiVerbFilters ? (
    (multiVerbFilters.person.some(p => p !== 'all') ? 1 : 0) +
    (multiVerbFilters.tense.some(t => t !== 'all') ? 1 : 0) +
    (multiVerbFilters.aspect.some(a => a !== 'all') ? 1 : 0) +
    (multiVerbFilters.mood.some(m => m !== 'all') ? 1 : 0)
  ) : verbFilters ? (
    (verbFilters.person !== 'all' ? 1 : 0) +
    (verbFilters.tense !== 'all' ? 1 : 0) +
    (verbFilters.aspect !== 'all' ? 1 : 0) +
    (verbFilters.mood !== 'all' ? 1 : 0)
  ) : 0;

  // Collect active filter labels for display
  const activeFilterLabels: string[] = [];
  if (multiVerbFilters) {
    if (multiVerbFilters.person.some(p => p !== 'all')) {
      activeFilterLabels.push(...multiVerbFilters.person.filter(p => p !== 'all'));
    }
    if (multiVerbFilters.tense.some(t => t !== 'all')) {
      activeFilterLabels.push(...multiVerbFilters.tense.filter(t => t !== 'all'));
    }
    if (multiVerbFilters.aspect.some(a => a !== 'all')) {
      activeFilterLabels.push(...multiVerbFilters.aspect.filter(a => a !== 'all'));
    }
    if (multiVerbFilters.mood.some(m => m !== 'all')) {
      activeFilterLabels.push(...multiVerbFilters.mood.filter(m => m !== 'all'));
    }
  } else if (verbFilters) {
    if (verbFilters.person !== 'all') activeFilterLabels.push(verbFilters.person);
    if (verbFilters.tense !== 'all') activeFilterLabels.push(verbFilters.tense);
    if (verbFilters.aspect !== 'all') activeFilterLabels.push(verbFilters.aspect);
    if (verbFilters.mood !== 'all') activeFilterLabels.push(verbFilters.mood);
  }

  // Enable virtual scrolling for large result sets
  // Disable virtualization for now to prevent verse rows from overlapping when content exceeds the fixed item height
  const shouldUseVirtualization = false;

  // Reset to page 1 when results change
  useEffect(() => { setPage(1); }, [results.length]);

  // Audio state for each verse (managed at parent level)
  const [verseAudioUrls, setVerseAudioUrls] = useState<Record<string, string | null>>({});
  const [loadingAudio, setLoadingAudio] = useState<Set<string>>(new Set());

  // Preload audio for visible verses with batch optimization
  useEffect(() => {
    const preloadVisibleAudio = async () => {
      const startIndex = (page - 1) * itemsPerPage;
      const endIndex = Math.min(startIndex + itemsPerPage, results.length);

      // Collect verses that need audio URLs, grouped by translation
      const versesByTranslation: { afghan2023: string[], yousafzai2019: string[] } = { afghan2023: [], yousafzai2019: [] };
      for (let i = startIndex; i < endIndex; i++) {
        const verse = results[i];
        if (verse && verse.ref) {
          // Use audio_verse_url directly if available (from search results)
          if (verse.audio_verse_url) {
            setVerseAudioUrls(prev => ({ ...prev, [verse.ref]: verse.audio_verse_url || null }));
            continue;
          }
          // Otherwise, add to batch loading list
          if (!verseAudioUrls[verse.ref]) {
            const translation = verse.translation === 'Yousafzai 2019' ? 'yousafzai2019' : 'afghan2023';
            versesByTranslation[translation].push(verse.ref);
          }
        }
      }

      // Batch load audio URLs for efficiency (limit concurrent requests)
      // Process each translation separately
      for (const translation of ['afghan2023', 'yousafzai2019'] as const) {
        const versesNeedingAudio = versesByTranslation[translation];
        if (versesNeedingAudio.length === 0) continue;

        // Process in batches of 5 to avoid overwhelming the server
        const batchSize = 5;
        for (let i = 0; i < versesNeedingAudio.length; i += batchSize) {
          const batch = versesNeedingAudio.slice(i, i + batchSize);

          try {
            const response = await fetch('/api/audio_url', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ refs: batch, translation })
            });

            if (response.ok) {
              const { urls } = await response.json();
              setVerseAudioUrls(prev => ({ ...prev, ...urls }));
              setLoadingAudio(prev => {
                const next = new Set(prev);
                batch.forEach(ref => next.delete(ref));
                return next;
              });
            }
          } catch (error) {
            console.warn('Failed to batch preload audio:', error);
            // Fallback to individual loading with rate limiting
            for (const verseRef of batch) {
              setLoadingAudio(prev => new Set(prev).add(verseRef));
              try {
                const entry = audioMap[verseRef];
                // Determine translation from verse
                const verse = results.find(v => v.ref === verseRef);
                const verseTranslation = verse?.translation === 'Yousafzai 2019' ? 'yousafzai2019' : 'afghan2023';
                const url = await resolveAudioUrl(verseRef, entry, { translation: verseTranslation });
                if (url) {
                  setVerseAudioUrls(prev => ({ ...prev, [verseRef]: url }));
                } else {
                  setVerseAudioUrls(prev => ({ ...prev, [verseRef]: 'MISSING' }));
                }
              } catch (error) {
                console.warn(`Failed to preload audio for ${verseRef}:`, error);
              } finally {
                setLoadingAudio(prev => {
                  const next = new Set(prev);
                  next.delete(verseRef);
                  return next;
                });
              }
            }
          }

          // Small delay between batches to avoid overwhelming
          if (i + batchSize < versesNeedingAudio.length) {
            await new Promise(resolve => setTimeout(resolve, 100));
          }
        }
      }
    };

    preloadVisibleAudio();
  }, [page, results.length, audioMap]); // Remove verseAudioUrls from deps to avoid infinite loop

  const loadVerseAudioUrl = useCallback(async (verseRef: string) => {
    if (verseAudioUrls[verseRef] || loadingAudio.has(verseRef)) return; // Already loaded or loading

    // Check if verse already has audio_verse_url
    const verse = results.find(v => v.ref === verseRef);
    if (verse?.audio_verse_url) {
      const audioUrl = verse.audio_verse_url || null;
      setVerseAudioUrls(prev => ({ ...prev, [verseRef]: audioUrl }));
      setResolvedUrls(prev => ({ ...prev, [verseRef]: audioUrl }));
      return;
    }

    setLoadingAudio(prev => new Set(prev).add(verseRef));

    try {
      const entry = audioMap[verseRef];
      // Determine translation from verse
      const verseTranslation = verse?.translation === 'Yousafzai 2019' ? 'yousafzai2019' : 'afghan2023';
      const url = await resolveAudioUrl(verseRef, entry, { translation: verseTranslation });
      if (url) {
        setVerseAudioUrls(prev => ({ ...prev, [verseRef]: url }));
        setResolvedUrls(prev => ({ ...prev, [verseRef]: url }));
      } else {
        setVerseAudioUrls(prev => ({ ...prev, [verseRef]: 'MISSING' }));
      }
    } catch (error) {
      console.warn(`Failed to load audio for ${verseRef}:`, error);
    } finally {
      setLoadingAudio(prev => {
        const next = new Set(prev);
        next.delete(verseRef);
        return next;
      });
    }
  }, [audioMap, setResolvedUrls, verseAudioUrls, loadingAudio, results]);

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



  // ... existing imports ...

  // Filter results based on verb filters
  const filteredResults = useMemo(() => {
    // If no filters active, return all results
    if (!multiVerbFilters && !verbFilters) return results;

    // Check if any filter is actually active
    const hasActiveFilters = multiVerbFilters ? (
      multiVerbFilters.person.some(p => p !== 'all') ||
      multiVerbFilters.tense.some(t => t !== 'all') ||
      multiVerbFilters.aspect.some(a => a !== 'all') ||
      multiVerbFilters.mood.some(m => m !== 'all')
    ) : verbFilters && (
      verbFilters.person !== 'all' ||
      verbFilters.tense !== 'all' ||
      verbFilters.aspect !== 'all' ||
      verbFilters.mood !== 'all'
    );

    if (!hasActiveFilters) return results;

    // Build map of form -> array of variants (handles ambiguous forms like وهلو which can be 1pl or 3sg_m)
    const formToVariants = new Map<string, any[]>();

    const addVariant = (v: any) => {
      if (!v?.form) return;
      const existing = formToVariants.get(v.form) || [];
      // Only add if this person/tense combination isn't already present
      const isDuplicate = existing.some(e =>
        e.person === v.person && e.tense === v.tense && e.aspect === v.aspect && e.mood === v.mood
      );
      if (!isDuplicate) {
        existing.push(v);
        formToVariants.set(v.form, existing);
      }
    };

    // Check processed.verbs (direct format)
    if (processed?.verbs) {
      processed.verbs.forEach(addVariant);
    }
    // Check processed.variantGroups.verbs
    if (processed?.variantGroups?.verbs) {
      processed.variantGroups.verbs.forEach(addVariant);
    }
    // Check processed.relatedForms.forms.verbs (from relatedForms API)
    if (processed?.relatedForms?.forms?.verbs) {
      processed.relatedForms.forms.verbs.forEach(addVariant);
    }

    // If we still have no labels, try to use activeVariantForms with default labels
    if (formToVariants.size === 0 && activeVariantForms && activeVariantForms.length > 0) {
      console.log('Warning: No verb labels found, using form text as label fallback');
      activeVariantForms.forEach((form: string) => {
        formToVariants.set(form, [{ form, label: form }]);
      });
    }

    console.log(`Filter: Built formToVariants map with ${formToVariants.size} unique forms`);

    return results.filter(verse => {
      // If verse has no matched forms, check if the verse text contains any of the active forms
      let matchedFormsToCheck = verse.matchedForms || [];

      // If matchedForms is empty but we have activeVariantForms, check the verse text
      if (matchedFormsToCheck.length === 0 && activeVariantForms && activeVariantForms.length > 0 && verse.text) {
        matchedFormsToCheck = activeVariantForms.filter((form: string) => verse.text.includes(form));
      }

      if (matchedFormsToCheck.length === 0) {
        return false;
      }

      // Check if ANY of the matched forms in this verse satisfies the filter
      // For ambiguous forms (like وهلو = 1pl OR 3sg_m), ALL variants must match the filter
      // This prevents false positives where a 3rd person form is shown in 1st person results
      return matchedFormsToCheck.some((form: string) => {
        const variants = formToVariants.get(form);

        // If no variant data, exclude (strict filtering)
        if (!variants || variants.length === 0) {
          return false;
        }

        // For ambiguous forms: require ALL variants to match the person filter
        // This is conservative - only shows forms that are UNAMBIGUOUSLY the selected person
        if (multiVerbFilters) {
          const personFilters = multiVerbFilters.person.filter(p => p !== 'all');
          const tenseFilters = multiVerbFilters.tense.filter(t => t !== 'all');
          const aspectFilters = multiVerbFilters.aspect.filter(a => a !== 'all');
          const moodFilters = multiVerbFilters.mood.filter(m => m !== 'all');

          // For person filter: ALL variants of this form must match (strict for ambiguous forms)
          const personMatch = personFilters.length === 0 || variants.every(variant => {
            const normLabel = normalizeLabel(variant.label);
            return personFilters.some(p => matchesPerson(normLabel, p, variant));
          });

          // For tense/aspect/mood: at least ONE variant must match (standard behavior)
          const tenseMatch = tenseFilters.length === 0 || variants.some(variant => {
            const normLabel = normalizeLabel(variant.label);
            return tenseFilters.some(t => matchesTense(normLabel, t, variant));
          });

          const aspectMatch = aspectFilters.length === 0 || variants.some(variant => {
            const normLabel = normalizeLabel(variant.label);
            return aspectFilters.some(a => matchesAspect(normLabel, a, variant));
          });

          const moodMatch = moodFilters.length === 0 || variants.some(variant => {
            const normLabel = normalizeLabel(variant.label);
            return moodFilters.some(m => matchesMood(normLabel, m, variant));
          });

          return personMatch && tenseMatch && aspectMatch && moodMatch;
        } else if (verbFilters) {
          // Single-select: ALL variants must match person (strict for ambiguous forms)
          const personMatch = verbFilters.person === 'all' || variants.every(variant => {
            const normLabel = normalizeLabel(variant.label);
            return matchesPerson(normLabel, verbFilters.person, variant);
          });

          // Other filters: at least one variant matches
          const tenseMatch = verbFilters.tense === 'all' || variants.some(variant => {
            const normLabel = normalizeLabel(variant.label);
            return matchesTense(normLabel, verbFilters.tense, variant);
          });

          const aspectMatch = verbFilters.aspect === 'all' || variants.some(variant => {
            const normLabel = normalizeLabel(variant.label);
            return matchesAspect(normLabel, verbFilters.aspect, variant);
          });

          const moodMatch = verbFilters.mood === 'all' || variants.some(variant => {
            const normLabel = normalizeLabel(variant.label);
            return matchesMood(normLabel, verbFilters.mood, variant);
          });

          return personMatch && tenseMatch && aspectMatch && moodMatch;
        }
        return true;
      });
    });
  }, [results, multiVerbFilters, verbFilters, processed]);

  // Compute verse counts per verb form (for conjugation table)
  const verseCounts = useMemo(() => {
    const counts = new Map<string, number>();

    // Count how many times each form appears across all results
    for (const verse of results) {
      const matchedForms = verse.matchedForms || [];
      // Also check if forms from activeVariantForms appear in verse text
      const allForms = new Set(matchedForms);
      if (activeVariantForms && verse.text) {
        for (const form of activeVariantForms) {
          if (verse.text.includes(form)) {
            allForms.add(form);
          }
        }
      }

      for (const form of allForms) {
        counts.set(form, (counts.get(form) || 0) + 1);
      }
    }

    return counts;
  }, [results, activeVariantForms]);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [multiVerbFilters, verbFilters]);

  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const start = (page - 1) * itemsPerPage;
  const end = page * itemsPerPage;
  const paginatedResults = filteredResults.slice(start, end);

  console.log('ResultsList Debug:', {
    resultsLength: results.length,
    filteredResultsLength: filteredResults.length,
    page,
    itemsPerPage,
    start,
    end,
    paginatedResultsLength: paginatedResults.length,
    firstFilteredResult: filteredResults[0],
    firstPaginatedResult: paginatedResults[0],
    hasActiveFilters
  });

  const showPagination = filteredResults.length > itemsPerPage

  const paginationControl = (position: 'top' | 'bottom') => {
    const totalPages = Math.ceil(filteredResults.length / itemsPerPage)
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
      isLoadingAudio={loadingAudio.has(verse.ref)}
      handleDownload={() => handleVerseDownload(verse)}
      handlePlay={() => handleVersePlay(verse)}
      handlePause={() => handleVersePause(verse)}
      filteredResultsLength={filteredResults.length}
      searchWord={query}
      dictionaryData={dictionaryData}
    />
  );

  return (
    <div>
      {/* Filter State Indicator */}
      {hasActiveFilters && (
        <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
                🔍 {activeFilterCount} filter{activeFilterCount !== 1 ? 's' : ''} active:
              </span>
              <div className="flex gap-1 flex-wrap">
                {activeFilterLabels.map((label, idx) => (
                  <span
                    key={`${label}-${idx}`}
                    className="px-2 py-1 text-xs bg-blue-200 dark:bg-blue-800 text-blue-800 dark:text-blue-200 rounded capitalize"
                  >
                    {label}
                  </span>
                ))}
              </div>
            </div>
            {onResetFilters && (
              <button
                onClick={onResetFilters}
                className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200 underline"
              >
                Reset filters
              </button>
            )}
          </div>
        </div>
      )}

      <div className="mb-4 flex flex-col gap-2">
        {/* Debug logging for VerbConjugationTable */}
        {(() => {
          const hasFilters = multiVerbFilters &&
            (multiVerbFilters.person.some(p => p !== 'all') ||
              multiVerbFilters.tense.some(t => t !== 'all') ||
              multiVerbFilters.aspect.some(a => a !== 'all') ||
              multiVerbFilters.mood.some(m => m !== 'all'));
          const verbsLength = processed?.relatedForms?.forms?.verbs?.length ?? 0;
          console.log('VerbConjugationTable debug:', {
            hasFilters,
            hasRelatedForms: !!processed?.relatedForms,
            hasFormsObj: !!processed?.relatedForms?.forms,
            verbsLength,
            multiVerbFilters: multiVerbFilters ? {
              person: multiVerbFilters.person,
              tense: multiVerbFilters.tense,
            } : null,
          });
          return null;
        })()}
        {/* Verb Conjugation Table - Show when filters are active and we have verb forms */}
        {multiVerbFilters &&
          (multiVerbFilters.person.some(p => p !== 'all') ||
            multiVerbFilters.tense.some(t => t !== 'all') ||
            multiVerbFilters.aspect.some(a => a !== 'all') ||
            multiVerbFilters.mood.some(m => m !== 'all')) &&
          processed?.relatedForms?.forms?.verbs?.length > 0 && (
            <VerbConjugationTable
              lemma={processed.normalized || processed.relatedForms?.baseForm || ''}
              romanized={processed.romanization || processed.relatedForms?.romanized}
              english={dictionaryData?.entries?.[0]?.english || processed.relatedForms?.english}
              verbType={dictionaryData?.entries?.[0]?.pos || processed.relatedForms?.posGuess}
              verbs={processed.relatedForms.forms.verbs as RelatedFormVariant[]}
              filters={multiVerbFilters}
              verseCounts={verseCounts}
              totalVerses={results.length}
            />
          )}

        {/* Fallback: Simple display when no filters or no verb forms */}
        {!(multiVerbFilters &&
          (multiVerbFilters.person.some(p => p !== 'all') ||
            multiVerbFilters.tense.some(t => t !== 'all') ||
            multiVerbFilters.aspect.some(a => a !== 'all') ||
            multiVerbFilters.mood.some(m => m !== 'all')) &&
          processed?.relatedForms?.forms?.verbs?.length > 0) &&
          ((dictionaryData?.entries?.length ?? 0) > 0 || processed?.normalized || processed?.romanization) && (
            <div className="text-sm text-gray-700 dark:text-gray-300 mb-2">
              <span className="font-medium">Showing results for </span>
              {/* Show active variant forms */}
              {activeVariantForms && activeVariantForms.length > 0 && activeVariantForms.length < 10 ? (
                <span className="font-semibold text-blue-600 dark:text-blue-400">
                  {activeVariantForms.slice(0, 3).map((form, idx) => (
                    <React.Fragment key={form}>
                      <a
                        href={`/lexicon?q=${encodeURIComponent(form)}`}
                        className="hover:underline"
                        title="View in dictionary"
                      >
                        {form}
                      </a>
                      {idx < Math.min(activeVariantForms.length, 3) - 1 && <span className="mx-1">, </span>}
                    </React.Fragment>
                  ))}
                  {activeVariantForms.length > 3 && (
                    <span className="text-gray-500 dark:text-gray-400 ml-1">
                      {' '}and {activeVariantForms.length - 3} more
                    </span>
                  )}
                </span>
              ) : dictionaryData?.entries?.[0] ? (
                <span className="font-semibold text-blue-600 dark:text-blue-400">
                  <a
                    href={`/lexicon?q=${encodeURIComponent(dictionaryData.entries[0].pashto)}`}
                    className="hover:underline"
                    title="View in dictionary"
                  >
                    {dictionaryData.entries[0].pashto}
                  </a>
                  {dictionaryData.entries[0].romanized && (
                    <> - {dictionaryData.entries[0].romanized}</>
                  )}
                  {dictionaryData.entries[0].pos && (
                    <span className="text-gray-600 dark:text-gray-400 ml-1">
                      {dictionaryData.entries[0].pos}
                    </span>
                  )}
                  {dictionaryData.entries[0].english && (
                    <span className="text-gray-600 dark:text-gray-400 ml-1">
                      {dictionaryData.entries[0].english}
                    </span>
                  )}
                </span>
              ) : processed?.normalized ? (
                <span className="font-semibold text-blue-600 dark:text-blue-400">
                  <a
                    href={`/lexicon?q=${encodeURIComponent(processed.normalized)}`}
                    className="hover:underline"
                    title="View in dictionary"
                  >
                    {processed.normalized}
                  </a>
                  {processed.romanization && (
                    <> - {processed.romanization}</>
                  )}
                  {processed.pos && processed.pos !== 'unknown' && (
                    <span className="text-gray-600 dark:text-gray-400 ml-1">
                      {processed.pos}
                    </span>
                  )}
                </span>
              ) : null}
            </div>
          )}

        {/* Results count */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between text-sm text-gray-600 dark:text-gray-400">
          <span>
            <div className="text-sm text-slate-400 mb-4">
              Showing {paginatedResults.length} of {filteredResults.length} results
            </div>      {!shouldUseVirtualization && filteredResults.length > itemsPerPage && (
              <span className="ml-2 text-xs">
                (Page {page} of {Math.ceil(filteredResults.length / itemsPerPage)})
              </span>
            )}
            {shouldUseVirtualization && (
              <span className="ml-2 text-xs text-blue-600">
                (Virtualized for performance)
              </span>
            )}
          </span>
          {/* Verb Details Card */}
          {verbData && (
            <VerbDetails
              word={processed?.searchedForm || query || ''}
              metadata={verbData.metadata}
              conjugations={verbData.conjugations}
              lingdocsUrl={verbData.lingdocs_url}
            />
          )}

          {!shouldUseVirtualization && showPagination && paginationControl('top')}
        </div>
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
        <div className="flex flex-col gap-4">
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
              filteredResultsLength={filteredResults.length}
              searchWord={query}
              dictionaryData={dictionaryData}
            />
          ))}

          {showPagination && paginationControl('bottom')}
        </div>
      )}
    </div>
  );
}
// Fixed React hooks issue
