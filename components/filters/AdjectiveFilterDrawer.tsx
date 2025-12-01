"use client";

/**
 * AdjectiveFilterDrawer Component
 * Multi-select filters for adjective inflections based on LingDocs Pashto Grammar
 * 
 * Adjectives inflect for:
 * - Gender (masculine/feminine)
 * - Number (singular/plural)
 * - Inflection state (plain/1st/2nd)
 * 
 * Most adjectives follow Pattern #1 Basic, e.g.:
 * حسین haséen (m.) → حسینه haséena (f.)
 *                  → حسینې haséene (f. 1st)
 *                  → حسینو haséeno (obl. pl.)
 */

import { useMemo, useCallback } from 'react';
import { useSearchFilters } from '@/app/contexts/SearchFiltersContext';
import { isDefaultAdjectiveFilter } from '@/app/reducers/searchFiltersReducer';
import FacetGroup, { type FacetOption } from './FacetGroup';
import type { RelatedFormVariant } from '@/types';

interface AdjectiveFilterDrawerProps {
  onApplyFilters: () => void;
  lemma?: string;
  adjectiveForms?: RelatedFormVariant[];
}

const DEFAULT_ADJECTIVE_FILTER = {
  gender: 'all' as const,
  inflectionType: 'all' as const,
  number: 'all' as const,
};

const GENDER_OPTIONS: Array<{ value: string; label: string }> = [
  { value: 'masculine', label: 'Masculine' },
  { value: 'feminine', label: 'Feminine' },
];

const INFLECTION_TYPE_OPTIONS: Array<{ value: string; label: string }> = [
  { value: 'plain', label: 'Plain' },
  { value: '1st', label: '1st Inflection' },
  { value: '2nd', label: '2nd Inflection' },
  { value: 'vocative', label: 'Vocative' },
];

const NUMBER_OPTIONS: Array<{ value: string; label: string }> = [
  { value: 'singular', label: 'Singular' },
  { value: 'plural', label: 'Plural' },
];

export default function AdjectiveFilterDrawer({ 
  onApplyFilters, 
  lemma,
  adjectiveForms = [],
}: AdjectiveFilterDrawerProps) {
  const { filters, dispatch } = useSearchFilters();
  const adjFilters = filters.adjective;

  const setAdjFilters = useCallback((newFilters: typeof adjFilters) => {
    dispatch({ type: 'SET_ADJECTIVE_FILTERS', filters: newFilters });
    onApplyFilters();
  }, [dispatch, onApplyFilters]);

  const handleReset = useCallback(() => {
    setAdjFilters(DEFAULT_ADJECTIVE_FILTER);
  }, [setAdjFilters]);

  // Calculate facet counts from the adjective forms
  const facetCounts = useMemo(() => {
    const counts = {
      gender: {} as Record<string, number>,
      inflectionType: {} as Record<string, number>,
      number: {} as Record<string, number>,
    };

    for (const form of adjectiveForms) {
      const label = (form.label || '').toLowerCase();
      
      // Gender
      if (label.includes('masculine') || label.includes('masc') || label.includes('m.')) {
        counts.gender['masculine'] = (counts.gender['masculine'] || 0) + 1;
      }
      if (label.includes('feminine') || label.includes('fem') || label.includes('f.')) {
        counts.gender['feminine'] = (counts.gender['feminine'] || 0) + 1;
      }

      // Inflection type
      if (label.includes('plain')) counts.inflectionType['plain'] = (counts.inflectionType['plain'] || 0) + 1;
      if (label.includes('1st')) counts.inflectionType['1st'] = (counts.inflectionType['1st'] || 0) + 1;
      if (label.includes('2nd')) counts.inflectionType['2nd'] = (counts.inflectionType['2nd'] || 0) + 1;
      if (label.includes('vocative') || label.includes('voc')) counts.inflectionType['vocative'] = (counts.inflectionType['vocative'] || 0) + 1;

      // Number
      if (label.includes('singular') || label.includes('sing')) {
        counts.number['singular'] = (counts.number['singular'] || 0) + 1;
      }
      if (label.includes('plural') || label.includes('plur')) {
        counts.number['plural'] = (counts.number['plural'] || 0) + 1;
      }
    }

    return counts;
  }, [adjectiveForms]);

  // Build FacetOption arrays with counts
  const genderOptions: FacetOption[] = useMemo(() => {
    return GENDER_OPTIONS.map(opt => ({
      value: opt.value,
      label: opt.label,
      count: facetCounts.gender[opt.value] || 0,
      disabled: (facetCounts.gender[opt.value] || 0) === 0,
    }));
  }, [facetCounts]);

  const inflectionTypeOptions: FacetOption[] = useMemo(() => {
    return INFLECTION_TYPE_OPTIONS.map(opt => ({
      value: opt.value,
      label: opt.label,
      count: facetCounts.inflectionType[opt.value] || 0,
      disabled: (facetCounts.inflectionType[opt.value] || 0) === 0,
    }));
  }, [facetCounts]);

  const numberOptions: FacetOption[] = useMemo(() => {
    return NUMBER_OPTIONS.map(opt => ({
      value: opt.value,
      label: opt.label,
      count: facetCounts.number[opt.value] || 0,
      disabled: (facetCounts.number[opt.value] || 0) === 0,
    }));
  }, [facetCounts]);

  const isDefault = isDefaultAdjectiveFilter(adjFilters);

  // Get active filter values
  const getActiveFilters = (value: string | string[]): string[] => {
    if (Array.isArray(value)) return value.filter(v => v !== 'all');
    return value === 'all' ? [] : [value];
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
      {/* Active chips bar */}
      {!isDefault && (
        <div className="px-4 py-2 bg-purple-50 dark:bg-purple-900/30 border-b border-purple-100 dark:border-purple-800 flex items-center gap-2 flex-wrap">
          <span className="text-xs text-purple-600 dark:text-purple-400 font-medium">Active:</span>
          
          {adjFilters.gender !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-pink-100 dark:bg-pink-900/50 text-pink-700 dark:text-pink-300 rounded-full text-xs">
              {adjFilters.gender}
              <button 
                onClick={() => setAdjFilters({ ...adjFilters, gender: 'all' })}
                className="hover:text-pink-900 dark:hover:text-pink-100"
              >×</button>
            </span>
          )}
          
          {adjFilters.inflectionType !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded-full text-xs">
              {adjFilters.inflectionType}
              <button 
                onClick={() => setAdjFilters({ ...adjFilters, inflectionType: 'all' })}
                className="hover:text-blue-900 dark:hover:text-blue-100"
              >×</button>
            </span>
          )}
          
          {adjFilters.number !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 rounded-full text-xs">
              {adjFilters.number}
              <button 
                onClick={() => setAdjFilters({ ...adjFilters, number: 'all' })}
                className="hover:text-green-900 dark:hover:text-green-100"
              >×</button>
            </span>
          )}
          
          <button
            onClick={handleReset}
            className="ml-auto text-xs text-purple-600 dark:text-purple-400 hover:underline"
          >
            Reset filters
          </button>
        </div>
      )}

      {/* Main filter panel */}
      <div className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Filter by adjective form
          </span>
          {!isDefault && (
            <span className="text-xs px-2 py-0.5 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded-full">
              Active
            </span>
          )}
          {lemma && (
            <span className="text-xs text-gray-500 dark:text-gray-400 ml-auto">
              Adjective: <span className="font-medium" style={{ direction: 'rtl' }}>{lemma}</span>
              <span className="ml-2 text-purple-600 dark:text-purple-400">
                {adjectiveForms.length} forms
              </span>
            </span>
          )}
        </div>

        {/* Responsive grid layout */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Gender Filter */}
          <FacetGroup
            title="Gender"
            options={genderOptions}
            selected={getActiveFilters(adjFilters.gender)}
            onToggle={(value) => {
              setAdjFilters({ ...adjFilters, gender: value as 'all' | 'masculine' | 'feminine' });
            }}
            isLoading={false}
          />

          {/* Inflection Type Filter */}
          <FacetGroup
            title="Inflection Form"
            options={inflectionTypeOptions}
            selected={getActiveFilters(adjFilters.inflectionType)}
            onToggle={(value) => {
              setAdjFilters({ ...adjFilters, inflectionType: value as 'all' | 'plain' | '1st' | '2nd' | 'vocative' });
            }}
            isLoading={false}
          />

          {/* Number Filter */}
          <FacetGroup
            title="Number"
            options={numberOptions}
            selected={getActiveFilters(adjFilters.number || 'all')}
            onToggle={(value) => {
              setAdjFilters({ ...adjFilters, number: value as 'all' | 'singular' | 'plural' });
            }}
            isLoading={false}
          />
        </div>

        {/* Adjective forms strip */}
        {adjectiveForms.length > 0 && (
          <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
              Inflected forms ({adjectiveForms.length}):
            </div>
            <div className="flex flex-wrap gap-1.5">
              {adjectiveForms.slice(0, 15).map((form, idx) => (
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
              {adjectiveForms.length > 15 && (
                <span className="text-xs text-gray-400 dark:text-gray-500 self-center">
                  +{adjectiveForms.length - 15} more
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
