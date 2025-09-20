import { useMemo } from 'react';
import type { CoverageItem } from '../types';

// Helper function to extract book from reference (move to utils if needed)
function extractBook(ref: string): string {
  const m = ref.match(/^([A-Za-z0-9\s]+)\s\d+:\d+$/);
  return m ? m[1].trim() : ref.split(" ").slice(0, -1).join(" ");
}

// Utility function to get coverage from search results
function aggregateCoverageByBook(items: CoverageItem[]): CoverageItem[] {
  if (!items || items.length === 0) return [];
  const bookCounts = new Map<string, number>();
  for (const item of items) {
    const current = bookCounts.get(item.book) || 0;
    bookCounts.set(item.book, current + item.count);
  }
  return Array.from(bookCounts.entries())
    .map(([book, count]) => ({ book, count }))
    .sort((a, b) => b.count - a.count);
}

function getSearchCoverage(coverage: CoverageItem[]): CoverageItem[] | null {
  if (!coverage || coverage.length === 0) return null;
  return aggregateCoverageByBook(coverage);
}

export function useSidebarCoverage(coverage: CoverageItem[]) {
  return useMemo(() => {
    const searchCoverage = getSearchCoverage(coverage);
    if (searchCoverage && searchCoverage.length > 0) {
      return searchCoverage;
    }
    return [];
  }, [coverage]);
}
