"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import { debounce } from '@/app/utils/debounce';
import type { MultiVerbFilterState } from '@/types';

export interface FacetCounts {
  person: Record<string, number>;
  tense: Record<string, number>;
  aspect: Record<string, number>;
  mood: Record<string, number>;
  totalForms: number;
  matchingVerses: number;
}

export interface UseMorphologyFacetsOptions {
  lemma: string | null;
  filters: MultiVerbFilterState;
  translation?: 'afghan2023' | 'yousafzai2019';
  enabled?: boolean;
  debounceMs?: number;
}

export interface UseMorphologyFacetsResult {
  facets: FacetCounts | null;
  matchingForms: string[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

const DEFAULT_FACETS: FacetCounts = {
  person: { '1st': 0, '2nd': 0, '3rd': 0 },
  tense: { present: 0, past: 0, future: 0, perfect: 0, subjunctive: 0, imperative: 0, ability: 0, habitual: 0 },
  aspect: { imperfective: 0, perfective: 0 },
  mood: { indicative: 0, subjunctive: 0, imperative: 0, ability: 0 },
  totalForms: 0,
  matchingVerses: 0,
};

/**
 * Hook for fetching morphological facet counts from D1
 * Returns context-aware counts that update when filters change
 */
export function useMorphologyFacets({
  lemma,
  filters,
  translation = 'afghan2023',
  enabled = true,
  debounceMs = 200,
}: UseMorphologyFacetsOptions): UseMorphologyFacetsResult {
  const [facets, setFacets] = useState<FacetCounts | null>(null);
  const [matchingForms, setMatchingForms] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const abortControllerRef = useRef<AbortController | null>(null);
  const lastFetchRef = useRef<string>('');

  // Convert multi-filter state to API format
  const filtersToApiFormat = useCallback((f: MultiVerbFilterState) => {
    return {
      person: f.person.filter(v => v !== 'all'),
      tense: f.tense.filter(v => v !== 'all'),
      aspect: f.aspect.filter(v => v !== 'all'),
      mood: f.mood.filter(v => v !== 'all'),
    };
  }, []);

  const fetchFacets = useCallback(async () => {
    if (!lemma || !enabled) {
      setFacets(null);
      setMatchingForms([]);
      return;
    }

    // Create a unique key for this request to avoid duplicate fetches
    const apiFilters = filtersToApiFormat(filters);
    const requestKey = JSON.stringify({ lemma, filters: apiFilters, translation });
    
    if (requestKey === lastFetchRef.current) {
      return; // Skip duplicate request
    }
    lastFetchRef.current = requestKey;

    // Cancel any pending request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/morphology/facets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lemma,
          filters: apiFilters,
          translation,
        }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch facets: ${response.statusText}`);
      }

      const data = await response.json();
      
      setFacets(data.facets || DEFAULT_FACETS);
      setMatchingForms(data.matchingForms || []);
      setError(null);
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        // Request was cancelled, ignore
        return;
      }
      console.error('Failed to fetch morphology facets:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch facets');
      setFacets(DEFAULT_FACETS);
      setMatchingForms([]);
    } finally {
      setIsLoading(false);
    }
  }, [lemma, filters, translation, enabled, filtersToApiFormat]);

  // Debounced fetch to avoid excessive API calls
  const debouncedFetch = useCallback(
    debounce(fetchFacets, debounceMs),
    [fetchFacets, debounceMs]
  );

  // Fetch on mount and when dependencies change
  useEffect(() => {
    if (lemma && enabled) {
      debouncedFetch();
    }

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [lemma, filters, translation, enabled, debouncedFetch]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const refetch = useCallback(() => {
    lastFetchRef.current = ''; // Reset to force refetch
    fetchFacets();
  }, [fetchFacets]);

  return {
    facets,
    matchingForms,
    isLoading,
    error,
    refetch,
  };
}

export default useMorphologyFacets;

