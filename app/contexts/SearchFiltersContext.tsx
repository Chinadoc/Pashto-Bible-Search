"use client";

/**
 * Search Filters Context
 * Provides global access to search filter state and actions
 */

import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { searchFiltersReducer, SearchFiltersState, INITIAL_FILTERS_STATE, filtersToAPIPayload, isDefaultMultiVerbFilter, isDefaultNounFilter, isDefaultAdjectiveFilter } from '@/app/reducers/searchFiltersReducer';
import type { PartOfSpeech } from '@/types/search';

interface SearchFiltersContextValue {
  filters: SearchFiltersState;
  dispatch: React.Dispatch<import('@/app/reducers/searchFiltersReducer').SearchFiltersAction>;
  toAPIPayload: () => { posFilters?: { include?: PartOfSpeech[]; exclude?: PartOfSpeech[] } };
  hasActiveFilters: boolean;
  isDefaultVerbFilter: boolean;
  isDefaultNounFilter: boolean;
  isDefaultAdjectiveFilter: boolean;
}

const SearchFiltersContext = createContext<SearchFiltersContextValue | null>(null);

/**
 * Load filters from localStorage
 */
function loadPersistedFilters(): SearchFiltersState {
  if (typeof window === 'undefined') {
    return INITIAL_FILTERS_STATE;
  }

  try {
    const saved = localStorage.getItem('searchFilters');
    if (saved) {
      const parsed = JSON.parse(saved);
      // Validate structure and merge with defaults
      return {
        pos: parsed.pos || INITIAL_FILTERS_STATE.pos,
        verb: parsed.verb || INITIAL_FILTERS_STATE.verb,
        noun: parsed.noun || INITIAL_FILTERS_STATE.noun,
        adjective: parsed.adjective || INITIAL_FILTERS_STATE.adjective,
      };
    }
  } catch (error) {
    console.warn('Failed to load persisted filters:', error);
  }

  return INITIAL_FILTERS_STATE;
}

/**
 * Save filters to localStorage
 */
function savePersistedFilters(filters: SearchFiltersState): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem('searchFilters', JSON.stringify(filters));
  } catch (error) {
    console.warn('Failed to save filters to localStorage:', error);
  }
}

export function SearchFiltersProvider({ children }: { children: React.ReactNode }) {
  // Initialize state from localStorage or defaults
  const [filters, dispatch] = useReducer(
    searchFiltersReducer,
    loadPersistedFilters()
  );

  // Persist to localStorage whenever filters change
  useEffect(() => {
    savePersistedFilters(filters);
  }, [filters]);

  // Convert filters to API payload format
  const toAPIPayload = useCallback(() => {
    return filtersToAPIPayload(filters);
  }, [filters]);

  // Check if any filters are active
  const hasActiveFilters = useCallback(() => {
    return (
      filters.pos.selected.length > 0 ||
      !isDefaultMultiVerbFilter(filters.verb) ||
      !isDefaultNounFilter(filters.noun) ||
      !isDefaultAdjectiveFilter(filters.adjective)
    );
  }, [filters]);

  const isDefaultVerbFilter = isDefaultMultiVerbFilter(filters.verb);
  const isDefaultNounFilterValue = isDefaultNounFilter(filters.noun);
  const isDefaultAdjectiveFilterValue = isDefaultAdjectiveFilter(filters.adjective);

  const value: SearchFiltersContextValue = {
    filters,
    dispatch,
    toAPIPayload,
    hasActiveFilters: hasActiveFilters(),
    isDefaultVerbFilter,
    isDefaultNounFilter: isDefaultNounFilterValue,
    isDefaultAdjectiveFilter: isDefaultAdjectiveFilterValue,
  };

  return (
    <SearchFiltersContext.Provider value={value}>
      {children}
    </SearchFiltersContext.Provider>
  );
}

export function useSearchFilters(): SearchFiltersContextValue {
  const context = useContext(SearchFiltersContext);
  if (!context) {
    throw new Error('useSearchFilters must be used within SearchFiltersProvider');
  }
  return context;
}

