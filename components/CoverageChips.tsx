"use client";

import type { CoverageItem } from "@/types";

interface Props {
  coverage: CoverageItem[];
  bookFilter: string | null;
  setBookFilter: (b: string | null) => void;
}

export default function CoverageChips({ coverage, bookFilter, setBookFilter }: Props) {
  return (
    <div className="sticky top-14 z-20 backdrop-blur bg-white/70 dark:bg-gray-900/70 py-2">
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setBookFilter(null)}
          className={`px-3 py-1 rounded-full border text-sm ${
            bookFilter === null
              ? "bg-blue-600 text-white border-transparent"
              : "bg-transparent border-gray-300 dark:border-gray-700"
          }`}
        >
          Show all
        </button>
        {coverage.map((c) => (
          <button
            key={c.book}
            onClick={() => setBookFilter(c.book)}
            className={`px-3 py-1 rounded-full border text-sm ${
              bookFilter === c.book
                ? "bg-blue-600 text-white border-transparent"
                : "bg-transparent border-gray-300 dark:border-gray-700"
            }`}
            title={`${c.count} matches`}
          >
            {c.book} ({c.count})
          </button>
        ))}
      </div>
    </div>
  );
}


