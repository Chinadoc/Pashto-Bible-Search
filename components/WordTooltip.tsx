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
    sandwichType: string | null; // e.g., "په...کې", "د", "له...سره"
    sandwichMeaning?: string | null; // e.g., "in", "of", "with"
    isErgative: boolean; // Subject of transitive past
    ergativeVerb?: string | null; // The verb that triggered ergative
    isVocative?: boolean; // Direct address form
    isAblative?: boolean; // After له, تر, بې, پرته
    ablativeTrigger?: string | null; // Which word triggered ablative
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
  
  // Pronoun/Clitic-specific
  isClitic?: boolean;
  cliticType?: 'subject' | 'object' | 'possessive';
  cliticNotes?: string;
  possibleReferents?: string[];
  grammaticalCase?: string;
  
  // Compound verb info (when word + next word form compound verb)
  compoundVerbInfo?: {
    fullForm: string; // e.g., "پاتې شم"
    infinitive: string; // e.g., "پاتې کېدل"
    meaning: string;
    transitivity: 'transitive' | 'intransitive';
    person: string;
    number: string;
    tense: string;
    note: string;
  };
  
  // Source
  confidence: number;
  source: 'verb_forms' | 'word_frequencies' | 'inflections' | 'inflection_reasons' | 'inferred' | 'clitic_table' | 'pronoun_table';
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

// Inflection reason icons and LingDocs terminology
const REASON_ICONS = {
  plural: '👥',
  sandwich: '🥪',
  ergative: '⚡',
  vocative: '📢',
  ablative: '🧈', // Mayo = ablative
};

// LingDocs-style inflection state labels with tooltips
const INFLECTION_STATE_INFO: Record<string, { label: string; description: string }> = {
  'plain': { label: 'Plain', description: 'Base/dictionary form - no inflection applied' },
  '1st': { label: '1st Inflection', description: 'One reason: plural OR sandwich OR ergative (button half-pressed)' },
  '2nd': { label: '2nd Inflection', description: 'Two reasons: e.g. plural + sandwich (button fully pressed)' },
};

// Helper to determine inflection level based on reasons
// Three possible reasons for inflection:
// 1. Plural (جمع)
// 2. Sandwich (adpositional phrase)
// 3. Subject of transitive past tense verb (ergative)
//
// 1st inflection = 1/3 reasons (any ONE of the above)
// 2nd inflection = 2/3 reasons (any TWO of the above)
// Note: 3/3 won't happen in practice - ergative subjects aren't typically in sandwiches while plural
// Vocative is special (not combined with others)
// Ablative triggers 2nd inflection by itself
function getInflectionLevelFromReasons(reason: WordAnalysis['inflectionReason']): { level: '1st' | '2nd' | 'vocative' | null; count: number } {
  if (!reason) return { level: null, count: 0 };
  
  // Vocative is special - it's its own category
  if (reason.isVocative) return { level: 'vocative', count: 1 };
  
  let count = 0;
  if (reason.isPlural) count++;
  if (reason.isInSandwich) count++;
  if (reason.isErgative) count++;
  
  // Ablative (mayo) always causes 2nd inflection
  if (reason.isAblative) {
    count = Math.max(count, 2);
  }
  
  // Cap at 2 - in practice you won't have all 3 reasons at once
  count = Math.min(count, 2);
  
  if (count === 0) return { level: null, count: 0 };
  if (count >= 2) return { level: '2nd', count };
  return { level: '1st', count };
}

// LingDocs sandwich names
const SANDWICH_DISPLAY: Record<string, { pashto: string; english: string; short: string }> = {
  'locative_in': { pashto: 'په...کې', english: 'in', short: 'په...کې (in)' },
  'locative_on': { pashto: 'په...باندې', english: 'on', short: 'په...باندې (on)' },
  'comitative': { pashto: 'په...سره', english: 'with', short: 'په...سره (with)' },
  'genitive': { pashto: 'د', english: 'of/possessive', short: 'د (of)' },
  'comitative_from': { pashto: 'له...سره', english: 'with (from)', short: 'له...سره (with)' },
  'ablative': { pashto: 'له...نه', english: 'from', short: 'له...نه (from)' },
  'ablative_from': { pashto: 'له...څخه', english: 'from', short: 'له...څخه (from)' },
  'dative': { pashto: 'ته', english: 'to/toward', short: 'ته (to)' },
  'terminative': { pashto: 'تر...پورې', english: 'until', short: 'تر...پورې (until)' },
};

// Format person/number for display
function formatPersonNumber(person?: string | null, number?: string | null): string {
  if (!person) return '';
  const p = person.replace('st', '').replace('nd', '').replace('rd', '');
  const n = number === 'plural' ? 'pl' : number === 'singular' ? 'sg' : '';
  return `${p}${n ? ` ${n}` : ''}`;
}

export default function WordTooltip({
  word,
  analysis,
  isLoading,
  position = 'above',
  children,
  onHover,
}: WordTooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState<'above' | 'below'>(position);
  const triggerRef = useRef<HTMLSpanElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Position tooltip with smart placement
  useEffect(() => {
    if (isVisible && triggerRef.current && tooltipRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const tooltipRect = tooltipRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      
      // Check if tooltip fits above
      const fitsAbove = triggerRect.top > tooltipRect.height + 12;
      const fitsBelow = triggerRect.bottom + tooltipRect.height + 12 < viewportHeight;
      
      // Prefer above, but flip to below if doesn't fit
      if (position === 'above' && !fitsAbove && fitsBelow) {
        setTooltipPosition('below');
      } else if (position === 'below' && !fitsBelow && fitsAbove) {
        setTooltipPosition('above');
      } else {
        setTooltipPosition(position);
      }
    }
  }, [isVisible, position]);

  const handleMouseEnter = () => {
    // Small delay to avoid accidental triggers
    hoverTimeoutRef.current = setTimeout(() => {
      setIsVisible(true);
      onHover?.(word);
    }, 200);
  };

  const handleMouseLeave = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    setIsVisible(false);
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  const posColors = POS_COLORS[analysis?.pos || 'other'] || POS_COLORS.other;

  // Check if we have meaningful data
  const hasData = analysis && (
    analysis.baseForm || 
    analysis.english || 
    analysis.tense || 
    analysis.person ||
    analysis.inflectionReason ||
    analysis.compoundVerbInfo
  );

  return (
    <span
      ref={triggerRef}
      className="relative inline cursor-help"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      
      {isVisible && (
        <div
          ref={tooltipRef}
          className={`absolute z-50 min-w-[220px] max-w-[320px] p-3 rounded-lg shadow-xl border-2
            bg-white dark:bg-gray-800 ${posColors.border}
            animate-in fade-in-0 zoom-in-95 duration-100`}
          style={{
            [tooltipPosition === 'above' ? 'bottom' : 'top']: '100%',
            marginTop: tooltipPosition === 'below' ? '8px' : undefined,
            marginBottom: tooltipPosition === 'above' ? '8px' : undefined,
            right: '50%',
            transform: 'translateX(50%)',
          }}
          dir="rtl"
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-2 text-gray-500 py-2" dir="ltr">
              <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
              <span className="text-sm">Analyzing...</span>
            </div>
          ) : analysis ? (
            <div className="space-y-2">
              {/* Header: Word + POS badge */}
              <div className="flex items-center justify-between gap-2">
                <span className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  {analysis.word}
                </span>
                {analysis.pos && (
                  <span className={`px-2 py-0.5 text-xs font-medium rounded-full shrink-0 ${posColors.bg} ${posColors.text}`} dir="ltr">
                    {analysis.pos}
                  </span>
                )}
              </div>
              
              {/* Romanization + English */}
              {(analysis.romanized || analysis.english) && (
                <div className="text-sm text-gray-600 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700 pb-2" dir="ltr">
                  {analysis.romanized && <span className="italic">{analysis.romanized}</span>}
                  {analysis.romanized && analysis.english && <span className="mx-1">—</span>}
                  {analysis.english && <span className="text-gray-700 dark:text-gray-300">{analysis.english}</span>}
                </div>
              )}
              
              {/* Base form (if different) */}
              {analysis.baseForm && analysis.baseForm !== analysis.word && (
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-gray-500" dir="ltr">Base:</span>
                  <span className="font-semibold text-gray-800 dark:text-gray-200">{analysis.baseForm}</span>
                </div>
              )}
              
              {/* Verb-specific info */}
              {analysis.pos === 'verb' && (
                <div className="pt-1 space-y-2">
                  {/* Equative badge - special "to be" form */}
                  {analysis.baseForm === 'اوسېدل' && (
                    <div className="flex items-center gap-1.5" dir="ltr">
                      <span className="px-2 py-0.5 bg-cyan-100 dark:bg-cyan-900/50 text-cyan-700 dark:text-cyan-300 rounded text-xs font-semibold">
                        ✨ equative
                      </span>
                      <span className="text-xs text-gray-500">("to be")</span>
                    </div>
                  )}
                  
                  {/* Tense/Mood/Aspect badges */}
                  <div className="flex flex-wrap gap-1.5" dir="ltr">
                    {analysis.mood && analysis.mood !== 'indicative' && (
                      <span className="px-2 py-0.5 bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-200 rounded text-xs font-medium">
                        {analysis.mood}
                      </span>
                    )}
                    {analysis.tense && (
                      <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 rounded text-xs font-medium">
                        {analysis.tense === 'habitual' ? 'habitual (usually)' : analysis.tense}
                      </span>
                    )}
                    {analysis.aspect && (
                      <span className="px-2 py-0.5 bg-purple-100 dark:bg-purple-900/50 text-purple-800 dark:text-purple-200 rounded text-xs font-medium">
                        {analysis.aspect}
                      </span>
                    )}
                  </div>
                  
                  {/* Person/Number */}
                  {analysis.person && (
                    <div className="text-sm" dir="ltr">
                      <span className="text-gray-500">Subject: </span>
                      <span className="font-medium text-gray-800 dark:text-gray-200">
                        {analysis.person} person {analysis.number}
                      </span>
                    </div>
                  )}
                  
                  {/* Compound verb info */}
                  {analysis.isCompound && (
                    <div className="text-xs" dir="ltr">
                      <span className={`px-1.5 py-0.5 rounded ${
                        analysis.compoundType === 'dynamic' 
                          ? 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300'
                          : 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300'
                      }`}>
                        {analysis.compoundType} compound
                      </span>
                      {analysis.auxiliaryVerb && (
                        <span className="mr-1 text-gray-500">
                          + {analysis.auxiliaryVerb}
                        </span>
                      )}
                    </div>
                  )}
                  
                  {/* Equative notes - for ambiguous forms like وی */}
                  {(analysis as any).equativeNotes && (
                    <div className="text-xs text-gray-500 dark:text-gray-400 pt-1 border-t border-gray-200 dark:border-gray-700 italic" dir="ltr">
                      💡 {(analysis as any).equativeNotes}
                    </div>
                  )}
                </div>
              )}
              
              {/* Pronoun/Clitic-specific info */}
              {analysis.pos === 'pronoun' && (
                <div className="pt-1 space-y-2">
                  {/* Clitic badge */}
                  {analysis.isClitic && (
                    <div className="flex items-center gap-1.5" dir="ltr">
                      <span className="px-2 py-0.5 bg-pink-100 dark:bg-pink-900/50 text-pink-700 dark:text-pink-300 rounded text-xs font-medium">
                        mini-pronoun (clitic)
                      </span>
                      {analysis.cliticType && (
                        <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded text-xs">
                          {analysis.cliticType}
                        </span>
                      )}
                    </div>
                  )}
                  
                  {/* Person/Number */}
                  {analysis.person && (
                    <div className="text-sm" dir="ltr">
                      <span className="text-gray-500">Refers to: </span>
                      <span className="font-medium text-gray-800 dark:text-gray-200">
                        {analysis.person} person {analysis.number}
                      </span>
                    </div>
                  )}
                  
                  {/* Grammatical case for regular pronouns */}
                  {analysis.grammaticalCase && (
                    <div className="text-xs" dir="ltr">
                      <span className="text-gray-500">Case: </span>
                      <span>{analysis.grammaticalCase}</span>
                    </div>
                  )}
                  
                  {/* Possible referents */}
                  {analysis.possibleReferents && analysis.possibleReferents.length > 0 && (
                    <div className="pt-1 border-t border-gray-200 dark:border-gray-700" dir="ltr">
                      <div className="text-xs text-gray-500 mb-1">Possible referent(s) in context:</div>
                      <div className="flex flex-wrap gap-1">
                        {analysis.possibleReferents.map((ref, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 rounded text-xs"
                          >
                            {ref}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Notes/disambiguation */}
                  {analysis.cliticNotes && (
                    <div className="text-xs text-amber-600 dark:text-amber-400 pt-1 border-t border-gray-200 dark:border-gray-700" dir="ltr">
                      {analysis.cliticNotes}
                    </div>
                  )}
                </div>
              )}
              
              {/* Noun-specific info - Compact LingDocs style */}
              {analysis.pos === 'noun' && (
                <div className="pt-1 space-y-1.5">
                  {/* Inflection level + gender badges */}
                  <div className="flex flex-wrap gap-1.5 items-center" dir="ltr">
                    {/* Determine inflection level from reasons (more accurate than inflectionState) */}
                    {(() => {
                      const { level, count } = getInflectionLevelFromReasons(analysis.inflectionReason);
                      if (level) {
                        return (
                          <span 
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium cursor-help ${
                              level === '2nd'
                                ? 'bg-indigo-200 dark:bg-indigo-800/70 text-indigo-800 dark:text-indigo-200'
                                : 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300'
                            }`}
                            title={`${level} inflection: ${count}/3 reason${count !== 1 ? 's' : ''}`}
                          >
                            {level} inflection
                            <span className="opacity-70">({count}/3)</span>
                          </span>
                        );
                      }
                      return null;
                    })()}
                    {analysis.gender && (
                      <span className={`px-1.5 py-0.5 rounded text-xs ${
                        analysis.gender === 'feminine' 
                          ? 'bg-pink-50 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400'
                          : 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                      }`}>
                        {analysis.gender === 'feminine' ? '♀ fem' : '♂ masc'}
                      </span>
                    )}
                  </div>
                  
                  {/* Inflection reasons - ALWAYS show all reasons */}
                  {analysis.inflectionReason && (
                    analysis.inflectionReason.isPlural || 
                    analysis.inflectionReason.isInSandwich || 
                    analysis.inflectionReason.isErgative ||
                    analysis.inflectionReason.isVocative ||
                    analysis.inflectionReason.isAblative
                  ) && (
                    <div dir="ltr" className="text-xs">
                      <span className="text-gray-400">Why: </span>
                      <span className="inline-flex flex-wrap gap-1 items-center">
                        {/* Vocative - special form for direct address */}
                        {analysis.inflectionReason.isVocative && (
                          <span 
                            className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-cyan-100 dark:bg-cyan-900/50 text-cyan-700 dark:text-cyan-300 rounded cursor-help"
                            title="Vocative: used when directly addressing someone"
                          >
                            {REASON_ICONS.vocative} vocative
                          </span>
                        )}
                        {/* Ablative/Mayonnaise - after له, تر, بې, پرته */}
                        {analysis.inflectionReason.isAblative && (
                          <span 
                            className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-yellow-100 dark:bg-yellow-900/50 text-yellow-700 dark:text-yellow-300 rounded cursor-help"
                            title={`Ablative (mayonnaise): after ${analysis.inflectionReason.ablativeTrigger || 'له/تر/بې/پرته'} - always 2nd inflection`}
                          >
                            {REASON_ICONS.ablative}
                            <span className="font-medium" dir="rtl">
                              {analysis.inflectionReason.ablativeTrigger || 'ablative'}
                            </span>
                          </span>
                        )}
                        {/* Regular sandwich (not ablative) */}
                        {analysis.inflectionReason.isInSandwich && !analysis.inflectionReason.isAblative && (
                          <span 
                            className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 rounded cursor-help"
                            title="Sandwich: word is inside an adpositional phrase"
                          >
                            {REASON_ICONS.sandwich}
                            <span className="font-medium" dir="rtl">
                              {analysis.inflectionReason.sandwichType || 'sandwich'}
                            </span>
                          </span>
                        )}
                        {analysis.inflectionReason.isPlural && (
                          <span 
                            className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 rounded cursor-help"
                            title="Plural: more than one"
                          >
                            {REASON_ICONS.plural} plural
                          </span>
                        )}
                        {analysis.inflectionReason.isErgative && (
                          <span 
                            className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 rounded cursor-help"
                            title={`Ergative: subject of past tense transitive verb${analysis.inflectionReason.ergativeVerb ? ` (${analysis.inflectionReason.ergativeVerb})` : ''}`}
                          >
                            {REASON_ICONS.ergative} ergative
                          </span>
                        )}
                      </span>
                    </div>
                  )}
                </div>
              )}
              
              {/* Compound verb info - shown for adjectives that form compound verbs with next word */}
              {analysis.compoundVerbInfo && (
                <div className="mt-2 pt-2 border-t border-dashed border-gray-300 dark:border-gray-600" dir="ltr">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 rounded text-xs font-medium">
                      🔗 Compound Verb
                    </span>
                    <span className={`px-2 py-0.5 rounded text-xs ${
                      analysis.compoundVerbInfo.transitivity === 'intransitive'
                        ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300'
                        : 'bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-300'
                    }`}>
                      {analysis.compoundVerbInfo.transitivity}
                    </span>
                  </div>
                  
                  <div className="text-sm font-semibold text-gray-800 dark:text-gray-200 text-right" dir="rtl">
                    {analysis.compoundVerbInfo.fullForm}
                  </div>
                  
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {analysis.compoundVerbInfo.infinitive}
                  </div>
                  
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    {analysis.compoundVerbInfo.person && (
                      <span className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded text-xs">
                        {analysis.compoundVerbInfo.person} {analysis.compoundVerbInfo.number}
                      </span>
                    )}
                    {analysis.compoundVerbInfo.tense && (
                      <span className="px-1.5 py-0.5 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded text-xs">
                        {analysis.compoundVerbInfo.tense}
                      </span>
                    )}
                  </div>
                  
                  <div className="text-xs text-gray-600 dark:text-gray-400 mt-1.5 italic">
                    "{analysis.compoundVerbInfo.meaning}"
                  </div>
                </div>
              )}
              
              {/* Low confidence indicator - only show if no meaningful data */}
              {!hasData && analysis.confidence < 0.8 && (
                <div className="text-xs text-gray-400 italic pt-1 border-t border-gray-200 dark:border-gray-700" dir="ltr">
                  ⓘ Limited data available
                </div>
              )}
            </div>
          ) : (
            <div className="text-sm text-gray-500 italic text-center py-2" dir="ltr">
              No analysis available
            </div>
          )}
          
          {/* Tooltip arrow */}
          <div 
            className={`absolute left-1/2 -translate-x-1/2 w-3 h-3 bg-white dark:bg-gray-800 border-2 rotate-45 ${posColors.border}
              ${tooltipPosition === 'above' ? 'bottom-[-8px] border-t-0 border-l-0' : 'top-[-8px] border-b-0 border-r-0'}`}
          />
        </div>
      )}
    </span>
  );
}

