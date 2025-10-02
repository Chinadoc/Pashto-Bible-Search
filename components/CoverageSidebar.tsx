"use client";

import CoverageGrid, { ComplexityLevel } from './CoverageGrid';
import { useSidebarCoverage } from '../hooks/useSidebarCoverage';
import type { CoverageItem, Scope } from '../types';

interface Props {
  coverage: CoverageItem[];
  scope: Scope;
  coverageLevel: ComplexityLevel;
  onPickBook: (book: string) => void;
  selectedBook?: string | null;
  resultsCount?: number;
  filteredCount?: number;
}

export default function CoverageSidebar({
  coverage,
  scope,
  coverageLevel,
  onPickBook,
  selectedBook,
  resultsCount,
  filteredCount
}: Props) {
  const sidebarCoverage = useSidebarCoverage(coverage);

  const title = coverage.length > 0 ? "Search Results" : "Bible Books";
  const subtitle = filteredCount !== undefined && selectedBook 
    ? `Showing ${filteredCount} results from ${selectedBook}`
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
      />
    </div>
  );
}
