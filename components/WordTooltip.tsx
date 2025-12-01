"use client";

/**
 * WordTooltip Component
 * 
 * Shows grammatical analysis on word hover:
 * - Part of speech (noun, verb, adjective, etc.)
 * - For nouns: inflection reason (plural, sandwich, ergative)
 * - For verbs: conjugation info (person, tense, aspect, mood)
 * - Base form / lemma
 * - English meaning if available
 * 
 * Based on LingDocs Pashto Grammar:
 * - https://grammar.lingdocs.com/inflection/inflection-patterns/
 * - https://grammar.lingdocs.com/verbs/
 */

import { useState, useRef, useEffect } from 'react';

export interface WordAnalysis {
  word: string;
  pos: 'noun' | 'verb' | 'adjective' | 'adverb' | 'pronoun' | 'preposition' | 'particle' | 'conjunction' | 'other' | null;
  baseForm: string | null;
  romanized: string | null;
  english: string | null;
  
  // Noun-specific
  gender?: 'masculine' | 'feminine' | null;
  inflectionPattern?: string | null; // "Pattern #1 Basic", "Pattern #2 Unstressed ی", etc.
  inflectionState?: 'plain' | '1st' | '2nd' | null;
  inflectionReason?: {
    isPlural: boolean;
    isInSandwich: boolean;
    sandwichType: string | null;
    isErgative: boolean; // Subject of transitive past
  } | null;
  
  // Verb-specific
  person?: '1st' | '2nd' | '3rd' | null;
  number?: 'singular' | 'plural' | null;
  tense?: string | null;
  aspect?: 'imperfective' | 'perfective' | null;
  mood?: 'indicative' | 'subjunctive' | 'imperative' | 'ability' | null;
  isCompound?: boolean;
  compoundType?: 'dynamic' | 'stative' | null;
  auxiliaryVerb?: string | null; // کول, کېدل, etc.
  
  // Source
  confidence: number;
  source: 'verb_forms' | 'word_frequencies' | 'inflections' | 'inflection_reasons' | 'inferred';
}

interface WordTooltipProps {
  word: string;
  analysis: WordAnalysis | null;
  isLoading: boolean;
  position?: 'above' | 'below';
  children: React.ReactNode;
  onHover?: (word: string) => void;
}

// POS colors
const POS_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  noun: { bg: 'bg-blue-100 dark:bg-blue-900/50', text: 'text-blue-800 dark:text-blue-200', border: 'border-blue-300 dark:border-blue-700' },
  verb: { bg: 'bg-green-100 dark:bg-green-900/50', text: 'text-green-800 dark:text-green-200', border: 'border-green-300 dark:border-green-700' },
  adjective: { bg: 'bg-purple-100 dark:bg-purple-900/50', text: 'text-purple-800 dark:text-purple-200', border: 'border-purple-300 dark:border-purple-700' },
  adverb: { bg: 'bg-orange-100 dark:bg-orange-900/50', text: 'text-orange-800 dark:text-orange-200', border: 'border-orange-300 dark:border-orange-700' },
  pronoun: { bg: 'bg-pink-100 dark:bg-pink-900/50', text: 'text-pink-800 dark:text-pink-200', border: 'border-pink-300 dark:border-pink-700' },
  preposition: { bg: 'bg-yellow-100 dark:bg-yellow-900/50', text: 'text-yellow-800 dark:text-yellow-200', border: 'border-yellow-300 dark:border-yellow-700' },
  particle: { bg: 'bg-gray-100 dark:bg-gray-700', text: 'text-gray-800 dark:text-gray-200', border: 'border-gray-300 dark:border-gray-600' },
  conjunction: { bg: 'bg-teal-100 dark:bg-teal-900/50', text: 'text-teal-800 dark:text-teal-200', border: 'border-teal-300 dark:border-teal-700' },
  other: { bg: 'bg-gray-100 dark:bg-gray-700', text: 'text-gray-600 dark:text-gray-300', border: 'border-gray-300 dark:border-gray-600' },
};

// Inflection reason icons
const REASON_ICONS = {
  plural: '👥',
  sandwich: '🥪',
  ergative: '⚡',
};

export default function WordTooltip({
  word,
  analysis,
  isLoading,
  position = 'above',
  children,
  onHover,
}: WordTooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [tooltipStyle, setTooltipStyle] = useState<React.CSSProperties>({});
  const triggerRef = useRef<HTMLSpanElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  // Position tooltip
  useEffect(() => {
    if (isVisible && triggerRef.current && tooltipRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const tooltipRect = tooltipRef.current.getBoundingClientRect();
      
      let top = position === 'above' 
        ? -tooltipRect.height - 8 
        : triggerRect.height + 8;
      
      // Adjust if tooltip would go off screen
      const viewportHeight = window.innerHeight;
      if (position === 'above' && triggerRect.top + top < 0) {
        top = triggerRect.height + 8; // Flip to below
      } else if (position === 'below' && triggerRect.bottom + tooltipRect.height > viewportHeight) {
        top = -tooltipRect.height - 8; // Flip to above
      }
      
      setTooltipStyle({ top });
    }
  }, [isVisible, position]);

  const handleMouseEnter = () => {
    setIsVisible(true);
    onHover?.(word);
  };

  const handleMouseLeave = () => {
    setIsVisible(false);
  };

  const posColors = POS_COLORS[analysis?.pos || 'other'] || POS_COLORS.other;

  return (
    <span
      ref={triggerRef}
      className="relative inline-block cursor-help"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      
      {isVisible && (
        <div
          ref={tooltipRef}
          className={`absolute z-50 min-w-[200px] max-w-[300px] p-3 rounded-lg shadow-lg border
            bg-white dark:bg-gray-800 ${posColors.border}
            animate-in fade-in-0 zoom-in-95 duration-150`}
          style={{
            ...tooltipStyle,
            left: '50%',
            transform: 'translateX(-50%)',
          }}
          dir="ltr"
        >
          {isLoading ? (
            <div className="flex items-center gap-2 text-gray-500">
              <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
              <span className="text-sm">Analyzing...</span>
            </div>
          ) : analysis ? (
            <div className="space-y-2">
              {/* Header: Word + POS badge */}
              <div className="flex items-center justify-between gap-2">
                <span className="text-lg font-bold" style={{ direction: 'rtl' }}>
                  {analysis.word}
                </span>
                {analysis.pos && (
                  <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${posColors.bg} ${posColors.text}`}>
                    {analysis.pos}
                  </span>
                )}
              </div>
              
              {/* Romanization + English */}
              {(analysis.romanized || analysis.english) && (
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {analysis.romanized && <span className="italic">{analysis.romanized}</span>}
                  {analysis.romanized && analysis.english && <span> — </span>}
                  {analysis.english && <span>{analysis.english}</span>}
                </div>
              )}
              
              {/* Base form (if different) */}
              {analysis.baseForm && analysis.baseForm !== analysis.word && (
                <div className="text-sm">
                  <span className="text-gray-500">Base: </span>
                  <span className="font-medium" style={{ direction: 'rtl' }}>{analysis.baseForm}</span>
                </div>
              )}
              
              {/* Noun-specific info */}
              {analysis.pos === 'noun' && (
                <div className="pt-1 border-t border-gray-200 dark:border-gray-700 space-y-1">
                  {analysis.gender && (
                    <div className="text-xs">
                      <span className="text-gray-500">Gender: </span>
                      <span className={analysis.gender === 'feminine' ? 'text-pink-600' : 'text-blue-600'}>
                        {analysis.gender}
                      </span>
                    </div>
                  )}
                  
                  {analysis.inflectionPattern && (
                    <div className="text-xs">
                      <span className="text-gray-500">Pattern: </span>
                      <span>{analysis.inflectionPattern}</span>
                    </div>
                  )}
                  
                  {analysis.inflectionState && analysis.inflectionState !== 'plain' && (
                    <div className="text-xs">
                      <span className="text-gray-500">Form: </span>
                      <span className="font-medium">{analysis.inflectionState} inflection</span>
                    </div>
                  )}
                  
                  {/* Inflection reasons */}
                  {analysis.inflectionReason && (
                    <div className="mt-1 pt-1 border-t border-gray-100 dark:border-gray-700">
                      <div className="text-xs text-gray-500 mb-1">Why inflected:</div>
                      <div className="flex flex-wrap gap-1">
                        {analysis.inflectionReason.isPlural && (
                          <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 rounded text-xs">
                            {REASON_ICONS.plural} Plural
                          </span>
                        )}
                        {analysis.inflectionReason.isInSandwich && (
                          <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 rounded text-xs">
                            {REASON_ICONS.sandwich} {analysis.inflectionReason.sandwichType || 'Sandwich'}
                          </span>
                        )}
                        {analysis.inflectionReason.isErgative && (
                          <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 rounded text-xs">
                            {REASON_ICONS.ergative} Ergative
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              {/* Verb-specific info */}
              {analysis.pos === 'verb' && (
                <div className="pt-1 border-t border-gray-200 dark:border-gray-700 space-y-1">
                  {/* Compound verb info */}
                  {analysis.isCompound && (
                    <div className="text-xs">
                      <span className={`px-1.5 py-0.5 rounded ${
                        analysis.compoundType === 'dynamic' 
                          ? 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300'
                          : 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300'
                      }`}>
                        {analysis.compoundType} compound
                      </span>
                      {analysis.auxiliaryVerb && (
                        <span className="ml-1 text-gray-500">
                          + {analysis.auxiliaryVerb}
                        </span>
                      )}
                    </div>
                  )}
                  
                  {/* Conjugation info */}
                  <div className="grid grid-cols-2 gap-x-2 gap-y-0.5 text-xs">
                    {analysis.person && (
                      <>
                        <span className="text-gray-500">Person:</span>
                        <span>{analysis.person} {analysis.number}</span>
                      </>
                    )}
                    {analysis.tense && (
                      <>
                        <span className="text-gray-500">Tense:</span>
                        <span>{analysis.tense}</span>
                      </>
                    )}
                    {analysis.aspect && (
                      <>
                        <span className="text-gray-500">Aspect:</span>
                        <span>{analysis.aspect}</span>
                      </>
                    )}
                    {analysis.mood && analysis.mood !== 'indicative' && (
                      <>
                        <span className="text-gray-500">Mood:</span>
                        <span>{analysis.mood}</span>
                      </>
                    )}
                  </div>
                </div>
              )}
              
              {/* Confidence indicator */}
              {analysis.confidence < 0.8 && (
                <div className="text-xs text-gray-400 italic mt-1">
                  {analysis.confidence < 0.5 ? '⚠️ Low confidence' : '~Estimated'}
                </div>
              )}
            </div>
          ) : (
            <div className="text-sm text-gray-500 italic">
              No analysis available
            </div>
          )}
          
          {/* Tooltip arrow */}
          <div 
            className={`absolute left-1/2 -translate-x-1/2 w-3 h-3 bg-white dark:bg-gray-800 border rotate-45 ${posColors.border}
              ${position === 'above' ? 'bottom-[-7px] border-t-0 border-l-0' : 'top-[-7px] border-b-0 border-r-0'}`}
          />
        </div>
      )}
    </span>
  );
}

