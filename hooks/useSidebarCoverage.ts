import { useMemo } from 'react';
import type { CoverageItem } from '../types';

// Helper function to extract book from reference (move to utils if needed)
function extractBook(ref: string): string {
  const m = ref.match(/^([A-Za-z0-9\s]+)\s\d+:\d+$/);
  return m ? m[1].trim() : ref.split(" ").slice(0, -1).join(" ");
}

export function useSidebarCoverage(coverage: CoverageItem[]) {
  return useMemo(() => {
    console.log('useSidebarCoverage input:', coverage);
    // Our coverage data is already aggregated by book, so just return it sorted by count
    if (coverage && coverage.length > 0) {
      const sortedCoverage = [...coverage].sort((a, b) => b.count - a.count);
      console.log('useSidebarCoverage output:', sortedCoverage);
      return sortedCoverage;
    }
    console.log('useSidebarCoverage output: [] (no data)');
    return [];
  }, [coverage]);
}
