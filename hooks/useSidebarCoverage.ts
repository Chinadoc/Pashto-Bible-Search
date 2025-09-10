import { useMemo } from 'react';
import type { CoverageItem, Verse } from '@/types';

// Helper function to extract book from reference (move to utils if needed)
function extractBook(ref: string): string {
  const m = ref.match(/^([A-Za-z0-9\s]+)\s\d+:\d+$/);
  return m ? m[1].trim() : ref.split(" ").slice(0, -1).join(" ");
}

export function useSidebarCoverage(coverage: CoverageItem[], localBible: Verse[] | null) {
  return useMemo(() => {
    if (coverage.length > 0) {
      // Use search results coverage
      return coverage;
    }

    if (!localBible) {
      return [];
    }

    // Pre-compute book counts using reduce for better performance
    const bookCounts = localBible.reduce((acc: Record<string, number>, verse) => {
      const book = extractBook(verse.ref);
      acc[book] = (acc[book] || 0) + 1;
      return acc;
    }, {});

    // Convert to CoverageItem format and sort by count
    return Object.entries(bookCounts)
      .map(([book, count]) => ({ book, count }))
      .sort((a, b) => b.count - a.count);
  }, [coverage, localBible]);
}
