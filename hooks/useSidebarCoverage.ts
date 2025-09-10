import { useMemo } from 'react';
import type { CoverageItem, Verse } from '@/types';

// Helper function to extract book from reference (move to utils if needed)
function extractBook(ref: string): string {
  const m = ref.match(/^([A-Za-z0-9\s]+)\s\d+:\d+$/);
  return m ? m[1].trim() : ref.split(" ").slice(0, -1).join(" ");
}

// Utility function to get coverage from search results
function getSearchCoverage(coverage: CoverageItem[]): CoverageItem[] | null {
  return coverage.length > 0 ? coverage : null;
}

// Utility function to get coverage from the local Bible data
function getLocalBibleCoverage(localBible: Verse[] | null): CoverageItem[] | null {
  if (!localBible || localBible.length === 0) return null;

  const bookCounts = localBible.reduce((acc: Record<string, number>, verse) => {
    const book = extractBook(verse.ref);
    acc[book] = (acc[book] || 0) + 1;
    return acc;
  }, {});

  return Object.entries(bookCounts)
    .map(([book, count]) => ({ book, count }))
    .sort((a, b) => b.count - a.count);
}

export function useSidebarCoverage(coverage: CoverageItem[], localBible: Verse[] | null) {
  return useMemo(() => {
    // Use nullish coalescing for cleaner fallback logic
    return getSearchCoverage(coverage) ?? getLocalBibleCoverage(localBible) ?? [];
  }, [coverage, localBible]);
}
