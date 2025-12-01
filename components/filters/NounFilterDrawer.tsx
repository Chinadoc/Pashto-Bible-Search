"use client";

/**
 * NounFilterDrawer Component
 * Multi-select filters for noun inflections based on LingDocs Pashto Grammar
 * 
 * Noun Inflection Patterns (from https://grammar.lingdocs.com/inflection/):
 * - Pattern #1 Basic (most common)
 * - Pattern #2 Unstressed ی
 * - Pattern #3 Stressed ی
 * - Pattern #4 Pashtoon
 * - Pattern #5 Squish
 * 
 * Three reasons for inflection:
 * 1. Plural - indicating more than one
 * 2. Sandwich - in an adpositional phrase (په...کې, د, ته, etc.)
 * 3. Ergative - subject of a transitive past tense verb
 */

import { useMemo, useCallback } from 'react';
import { useSearchFilters } from '@/app/contexts/SearchFiltersContext';
import { isDefaultNounFilter } from '@/app/reducers/searchFiltersReducer';
import FacetGroup, { type FacetOption } from './FacetGroup';
import type { 
  NounInflectionType, 
  NounGender, 
  InflectionReasonFilter,
  RelatedFormVariant,
} from '@/types';

interface NounFilterDrawerProps {
  onApplyFilters: () => void;
  lemma?: string;
  nounForms?: RelatedFormVariant[];
}

const DEFAULT_NOUN_FILTER = {
  inflectionType: 'all' as NounInflectionType,
  gender: 'all' as NounGender,
  inflectionReason: 'all' as InflectionReasonFilter,
  category: 'all' as const,
  grammaticalCase: 'all' as const,
  number: 'all' as const,
  lexicalGender: 'all' as const,
  pluralType: 'all' as const,
};

// Define inflection type options based on LingDocs
const INFLECTION_TYPE_OPTIONS: Array<{ value: NounInflectionType; label: string }> = [
  { value: 'plain', label: 'Plain' },
  { value: '1st', label: '1st Inflection' },
  { value: '2nd', label: '2nd Inflection' },
  { value: 'plural', label: 'Plural' },
  { value: 'vocative', label: 'Vocative' },
  { value: 'bundled', label: 'Bundled Plural' },
];

const GENDER_OPTIONS: Array<{ value: NounGender; label: string }> = [
  { value: 'masculine', label: 'Masculine' },
  { value: 'feminine', label: 'Feminine' },
];

const INFLECTION_REASON_OPTIONS: Array<{ value: InflectionReasonFilter; label: string; icon: string }> = [
  { value: 'plural', label: 'Plural', icon: '👥' },
  { value: 'sandwich', label: 'Sandwich (adposition)', icon: '🥪' },
  { value: 'transitive_past', label: 'Ergative (past trans. subj)', icon: '⚡' },
];

function toggleMultiFilter<T extends string>(
  currentValues: T[],
  value: T,
  allValue: T = 'all' as T
): T[] {
  if (value === allValue) {
    return currentValues.includes(allValue) ? [] : [allValue];
  }

  const withoutAll = currentValues.filter(v => v !== allValue);

  if (withoutAll.includes(value)) {
    const newValues = withoutAll.filter(v => v !== value);
    return newValues.length === 0 ? [allValue] : newValues;
  } else {
    return [...withoutAll, value];
  }
}

export default function NounFilterDrawer({ 
  onApplyFilters, 
  lemma,
  nounForms = [],
}: NounFilterDrawerProps) {
  const { filters, dispatch } = useSearchFilters();
  const nounFilters = filters.noun;

  const setNounFilters = useCallback((newFilters: typeof nounFilters) => {
    dispatch({ type: 'SET_NOUN_FILTERS', filters: newFilters });
    onApplyFilters();
  }, [dispatch, onApplyFilters]);

  const handleReset = useCallback(() => {
    setNounFilters(DEFAULT_NOUN_FILTER);
  }, [setNounFilters]);

  // Calculate facet counts from the noun forms
  const facetCounts = useMemo(() => {
    const counts = {
      inflectionType: {} as Record<string, number>,
      gender: {} as Record<string, number>,
      inflectionReason: {} as Record<string, number>,
    };

    for (const form of nounForms) {
      // Infer inflection type from label
      const label = (form.label || '').toLowerCase();
      
      if (label.includes('plain')) counts.inflectionType['plain'] = (counts.inflectionType['plain'] || 0) + 1;
      if (label.includes('1st')) counts.inflectionType['1st'] = (counts.inflectionType['1st'] || 0) + 1;
      if (label.includes('2nd')) counts.inflectionType['2nd'] = (counts.inflectionType['2nd'] || 0) + 1;
      if (label.includes('plural') && !label.includes('bundled')) counts.inflectionType['plural'] = (counts.inflectionType['plural'] || 0) + 1;
      if (label.includes('vocative') || label.includes('voc')) counts.inflectionType['vocative'] = (counts.inflectionType['vocative'] || 0) + 1;
      if (label.includes('bundled')) counts.inflectionType['bundled'] = (counts.inflectionType['bundled'] || 0) + 1;

      // Infer gender
      if (label.includes('masculine') || label.includes('masc') || label.includes('m.')) {
        counts.gender['masculine'] = (counts.gender['masculine'] || 0) + 1;
      }
      if (label.includes('feminine') || label.includes('fem') || label.includes('f.')) {
        counts.gender['feminine'] = (counts.gender['feminine'] || 0) + 1;
      }

      // Check inflection reasons from the variant's inflectionReasons
      if (form.inflectionReasons) {
        if (form.inflectionReasons.plural > 0) {
          counts.inflectionReason['plural'] = (counts.inflectionReason['plural'] || 0) + 1;
        }
        if (form.inflectionReasons.sandwich > 0) {
          counts.inflectionReason['sandwich'] = (counts.inflectionReason['sandwich'] || 0) + 1;
        }
        if (form.inflectionReasons.transitive_past > 0) {
          counts.inflectionReason['transitive_past'] = (counts.inflectionReason['transitive_past'] || 0) + 1;
        }
      }
    }

    return counts;
  }, [nounForms]);

  // Build FacetOption arrays with counts
  const inflectionTypeOptions: FacetOption[] = useMemo(() => {
    return INFLECTION_TYPE_OPTIONS.map(opt => ({
      value: opt.value,
      label: opt.label,
      count: facetCounts.inflectionType[opt.value] || 0,
      disabled: (facetCounts.inflectionType[opt.value] || 0) === 0,
    }));
  }, [facetCounts]);

  const genderOptions: FacetOption[] = useMemo(() => {
    return GENDER_OPTIONS.map(opt => ({
      value: opt.value,
      label: opt.label,
      count: facetCounts.gender[opt.value] || 0,
      disabled: (facetCounts.gender[opt.value] || 0) === 0,
    }));
  }, [facetCounts]);

  const inflectionReasonOptions: FacetOption[] = useMemo(() => {
    return INFLECTION_REASON_OPTIONS.map(opt => ({
      value: opt.value,
      label: `${opt.icon} ${opt.label}`,
      count: facetCounts.inflectionReason[opt.value] || 0,
      disabled: (facetCounts.inflectionReason[opt.value] || 0) === 0,
    }));
  }, [facetCounts]);

  const isDefault = isDefaultNounFilter(nounFilters);

  // Get active filter arrays (handle single value or array)
  const getActiveFilters = (value: string | string[]): string[] => {
    if (Array.isArray(value)) return value.filter(v => v !== 'all');
    return value === 'all' ? [] : [value];
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
      {/* Active chips bar */}
      {!isDefault && (
        <div className="px-4 py-2 bg-indigo-50 dark:bg-indigo-900/30 border-b border-indigo-100 dark:border-indigo-800 flex items-center gap-2 flex-wrap">
          <span className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">Active:</span>
          
          {nounFilters.inflectionType !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded-full text-xs">
              {nounFilters.inflectionType}
              <button 
                onClick={() => setNounFilters({ ...nounFilters, inflectionType: 'all' })}
                className="hover:text-blue-900 dark:hover:text-blue-100"
              >×</button>
            </span>
          )}
          
          {nounFilters.gender !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-pink-100 dark:bg-pink-900/50 text-pink-700 dark:text-pink-300 rounded-full text-xs">
              {nounFilters.gender}
              <button 
                onClick={() => setNounFilters({ ...nounFilters, gender: 'all' })}
                className="hover:text-pink-900 dark:hover:text-pink-100"
              >×</button>
            </span>
          )}
          
          {nounFilters.inflectionReason !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 rounded-full text-xs">
              {nounFilters.inflectionReason === 'transitive_past' ? 'ergative' : nounFilters.inflectionReason}
              <button 
                onClick={() => setNounFilters({ ...nounFilters, inflectionReason: 'all' })}
                className="hover:text-amber-900 dark:hover:text-amber-100"
              >×</button>
            </span>
          )}
          
          <button
            onClick={handleReset}
            className="ml-auto text-xs text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            Reset filters
          </button>
        </div>
      )}

      {/* Main filter panel */}
      <div className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Filter by noun inflection
          </span>
          {!isDefault && (
            <span className="text-xs px-2 py-0.5 bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 rounded-full">
              Active
            </span>
          )}
          {lemma && (
            <span className="text-xs text-gray-500 dark:text-gray-400 ml-auto">
              Noun: <span className="font-medium" style={{ direction: 'rtl' }}>{lemma}</span>
              <span className="ml-2 text-blue-600 dark:text-blue-400">
                {nounForms.length} forms
              </span>
            </span>
          )}
        </div>

        {/* Responsive grid layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Gender Filter */}
          <FacetGroup
            title="Gender"
            options={genderOptions}
            selected={getActiveFilters(nounFilters.gender)}
            onToggle={(value) => {
              setNounFilters({ ...nounFilters, gender: value as NounGender });
            }}
            isLoading={false}
          />

          {/* Inflection Type Filter */}
          <FacetGroup
            title="Inflection Form"
            options={inflectionTypeOptions}
            selected={getActiveFilters(nounFilters.inflectionType)}
            onToggle={(value) => {
              setNounFilters({ ...nounFilters, inflectionType: value as NounInflectionType });
            }}
            isLoading={false}
          />

          {/* Inflection Reason Filter */}
          <FacetGroup
            title="Why Inflected"
            options={inflectionReasonOptions}
            selected={getActiveFilters(nounFilters.inflectionReason || 'all')}
            onToggle={(value) => {
              setNounFilters({ ...nounFilters, inflectionReason: value as InflectionReasonFilter });
            }}
            isLoading={false}
          />
        </div>

        {/* Noun forms strip */}
        {nounForms.length > 0 && (
          <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
              Inflected forms ({nounForms.length}):
            </div>
            <div className="flex flex-wrap gap-1.5">
              {nounForms.slice(0, 20).map((form, idx) => (
                <span
                  key={`${form.form}-${idx}`}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-white dark:bg-gray-800 
                    border border-gray-200 dark:border-gray-600 rounded text-sm
                    hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  style={{ direction: 'rtl' }}
                  title={form.label || ''}
                >
                  {form.form}
                  {form.label && (
                    <span className="text-xs text-gray-400 dark:text-gray-500" style={{ direction: 'ltr' }}>
                      ({form.label})
                    </span>
                  )}
                </span>
              ))}
              {nounForms.length > 20 && (
                <span className="text-xs text-gray-400 dark:text-gray-500 self-center">
                  +{nounForms.length - 20} more
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
