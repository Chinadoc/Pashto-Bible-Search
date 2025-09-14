"use client";

import CoverageGrid, { ComplexityLevel } from './CoverageGrid';
import { useSidebarCoverage } from '../hooks/useSidebarCoverage';
import type { CoverageItem, Verse, Scope } from '../types';

interface Props {
  coverage: CoverageItem[];
  localBible: Verse[] | null;
  scope: Scope;
  coverageLevel: ComplexityLevel;
  onPickBook: (book: string) => void;
  selectedBook?: string | null;
}

export default function CoverageSidebar({
  coverage,
  localBible,
  scope,
  coverageLevel,
  onPickBook,
  selectedBook
}: Props) {
  const sidebarCoverage = useSidebarCoverage(coverage, localBible);

  const title = coverage.length > 0 ? "Search Results" : "Bible Books";
  const subtitle = undefined;

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
