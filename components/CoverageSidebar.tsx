"use client";

import CoverageGrid, { ComplexityLevel } from './CoverageGrid';
import { useSidebarCoverage } from '../hooks/useSidebarCoverage';
import type { CoverageItem, Scope, AudioMap } from '../types';

interface Props {
  coverage: CoverageItem[];
  scope: Scope;
  coverageLevel: ComplexityLevel;
  onPickBook: (book: string) => void;
  selectedBook?: string | null;
  selectedBooks?: string[];
  onClearFilters?: () => void;
  resultsCount?: number;
  filteredCount?: number;
  audioMap?: AudioMap;
}

export default function CoverageSidebar({
  coverage,
  scope,
  coverageLevel,
  onPickBook,
  selectedBook,
  selectedBooks = [],
  onClearFilters,
  resultsCount,
  filteredCount,
  audioMap
}: Props) {
  const sidebarCoverage = useSidebarCoverage(coverage);

  const title = coverage.length > 0 ? "Search Results" : "Bible Books";
  const subtitle = filteredCount !== undefined && selectedBooks.length > 0
    ? selectedBooks.length === 1 
      ? `Showing ${filteredCount} results from ${selectedBooks[0]}`
      : `Showing ${filteredCount} results from ${selectedBooks.length} books`
    : undefined;

  return (
    <div className="w-full lg:w-auto">
      <CoverageGrid
        coverage={sidebarCoverage}
        onPickBook={onPickBook}
        scope={scope}
        complexityLevel={ComplexityLevel.Basic}
        title={title}
        subtitle={subtitle}
        compact={true}
        selectedBook={selectedBook}
        selectedBooks={selectedBooks}
        onClearFilters={onClearFilters}
        audioMap={audioMap}
      />
    </div>
  );
}
