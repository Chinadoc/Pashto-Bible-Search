"use client";

import React, { useMemo } from "react";
import classNames from "classnames";
import type { CoverageItem } from "../types";

const OT_BOOKS = [
  "Genesis","Exodus","Leviticus","Numbers","Deuteronomy","Joshua","Judges","Ruth","1 Samuel","2 Samuel","1 Kings","2 Kings","1 Chronicles","2 Chronicles","Ezra","Nehemiah","Esther","Job","Psalms","Proverbs","Ecclesiastes","Song of Solomon","Isaiah","Jeremiah","Lamentations","Ezekiel","Daniel","Hosea","Joel","Amos","Obadiah","Jonah","Micah","Nahum","Habakkuk","Zephaniah","Haggai","Zechariah","Malachi"
];
const NT_BOOKS = [
  "Matthew","Mark","Luke","John","Acts","Romans","1 Corinthians","2 Corinthians","Galatians","Ephesians","Philippians","Colossians","1 Thessalonians","2 Thessalonians","1 Timothy","2 Timothy","Titus","Philemon","Hebrews","James","1 Peter","2 Peter","1 John","2 John","3 John","Jude","Revelation"
];

// Abbreviations tuned for density
const ABBR: Record<string, string> = {
  Genesis: "Gen", Exodus: "Exo", Leviticus: "Lev", Numbers: "Num", Deuteronomy: "Deu",
  Joshua: "Jos", Judges: "Jdg", Ruth: "Rut", "1 Samuel": "1Sam", "2 Samuel": "2Sam",
  "1 Kings": "1Kgs", "2 Kings": "2Kgs", "1 Chronicles": "1Chr", "2 Chronicles": "2Chr",
  Ezra: "Ezr", Nehemiah: "Neh", Esther: "Est", Job: "Job", Psalms: "Psa", Proverbs: "Pro",
  Ecclesiastes: "Ecc", "Song of Solomon": "Sng", Isaiah: "Isa", Jeremiah: "Jer", Lamentations: "Lam",
  Ezekiel: "Eze", Daniel: "Dan", Hosea: "Hos", Joel: "Joe", Amos: "Amo", Obadiah: "Oba", Jonah: "Jon",
  Micah: "Mic", Nahum: "Nah", Habakkuk: "Hab", Zephaniah: "Zep", Haggai: "Hag", Zechariah: "Zec", Malachi: "Mal",
  Matthew: "Mat", Mark: "Mar", Luke: "Luk", John: "Joh", Acts: "Act", Romans: "Rom",
  "1 Corinthians": "1Cor", "2 Corinthians": "2Cor", Galatians: "Gal", Ephesians: "Eph", Philippians: "Phi",
  Colossians: "Col", "1 Thessalonians": "1Th", "2 Thessalonians": "2Th", "1 Timothy": "1Tim", "2 Timothy": "2Tim",
  Titus: "Tit", Philemon: "Phm", Hebrews: "Heb", James: "Jas", "1 Peter": "1Pet", "2 Peter": "2Pet",
  "1 John": "1Joh", "2 John": "2Joh", "3 John": "3Joh", Jude: "Jud", Revelation: "Rev",
};

export enum ComplexityLevel {
  Minimal = 1,  // Just book names, no counts/heatmap
  Basic = 2,    // Add count badges
  Full = 3      // Add heatmap tinting
}

interface Props {
  coverage: CoverageItem[];
  onPickBook?: (b: string) => void;
  compact?: boolean;
  scope?: "all" | "nt" | "ot";
  title?: string;
  subtitle?: string;
  complexityLevel?: ComplexityLevel;
  selectedBook?: string | null;
}

function abbr(book: string): string {
  return ABBR[book] || book;
}

// Helper for tint classes - extracted for testability
function getTintClasses(count: number, maxCount: number): string {
  const r = count / Math.max(1, maxCount);
  if (r > 0.75) return 'bg-sky-600/25 border-sky-400';
  if (r > 0.5) return 'bg-sky-600/20 border-sky-500';
  if (r > 0.25) return 'bg-sky-600/10 border-sky-700';
  return 'bg-transparent border-gray-700';
}

function getTileClasses(count: number, maxCount: number, complexityLevel: ComplexityLevel, compact: boolean): string {
  return classNames(
    'relative text-left rounded-md px-2 py-1 border',
    compact ? 'text-xs' : 'text-sm',
    count > 0 ? 'hover:bg-gray-100 dark:hover:bg-gray-800' : 'opacity-60',
    complexityLevel >= ComplexityLevel.Full ? getTintClasses(count, maxCount) : 'bg-transparent border-gray-700'
  );
}


export default function CoverageGrid({ coverage, onPickBook, compact, scope = "all", title, subtitle, complexityLevel = ComplexityLevel.Full, selectedBook }: Props) {
  const covMap = useMemo(() => {
    const m: Record<string, { count: number; translation?: string }> = {};
    for (const c of coverage) {
      // Handle coverage keys that include translation (format: "Translation:Book")
      let bookName = c.book;
      let translation: string | undefined;

      if (c.book.includes(':')) {
        const parts = c.book.split(':');
        if (parts.length >= 2) {
          translation = parts[0];
          bookName = parts.slice(1).join(':'); // Handle book names that might contain colons
        }
      }

      // Also check if the coverage item has explicit translation field
      translation = translation || c.translation;

      const key = bookName;
      if (!m[key]) {
        m[key] = { count: 0, translation };
      }
      m[key].count += c.count;
    }
    return m;
  }, [coverage]);

  // Compute max count for heatmap (only needed for Full level)
  const maxCount = useMemo(() => Math.max(1, ...Object.values(covMap).map(item => item.count)), [covMap])

  const Tile = ({ book }: { book: string }) => {
    const item = covMap[book]
    const count = item?.count ?? 0
    const translation = item?.translation
    const active = count > 0
    const showCount = complexityLevel >= ComplexityLevel.Basic && active
    const isSelected = selectedBook === book

    // Override classes for selected book
    const tileClasses = isSelected 
      ? `relative p-2 m-0.5 rounded border-2 border-blue-500 bg-blue-100 dark:bg-blue-800 text-blue-900 dark:text-blue-100 font-semibold hover:bg-blue-200 dark:hover:bg-blue-700 ${compact ? 'text-xs' : 'text-sm'}`
      : getTileClasses(count, maxCount, complexityLevel, compact ?? false)

    return (
      <button
        onClick={() => onPickBook?.(book)}
        className={tileClasses}
        title={translation ? `${book} (${translation})` : book}
      >
        <span>{compact ? abbr(book) : book}</span>
        {translation && (
          <span className="absolute -top-1 -left-1 inline-flex items-center justify-center w-3 h-3 rounded-full bg-orange-500 text-white text-[8px]">
            {translation === 'Yousafzai 2019' ? '🕌' : '📖'}
          </span>
        )}
        {showCount ? <span className="absolute -top-1 -right-1 inline-flex items-center justify-center w-5 h-5 rounded-full bg-sky-600 text-white text-[10px]">{count}</span> : null}
      </button>
    )
  }

  return (
    <div className={`w-full border border-gray-300 dark:border-gray-600 ${compact ? 'p-2' : 'p-3'}`}>
      {complexityLevel >= ComplexityLevel.Basic && !compact && (
        <div className="mb-2">
          <div className="font-medium text-sm">{title || "Bible Coverage"}</div>
          {subtitle && <div className="text-xs text-gray-500 mt-1">{subtitle}</div>}
        </div>
      )}
      <div className="flex flex-col gap-4">
        {(scope === 'all' || scope === 'ot') && (
          <div>
            {complexityLevel >= ComplexityLevel.Basic && !compact && <div className="text-xs text-gray-500 mb-1">Old Testament</div>}
            <div className={compact ? 'grid grid-cols-3 gap-1' : 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2'}>
              {OT_BOOKS.map((b) => <Tile key={b} book={b} />)}
            </div>
          </div>
        )}
        {(scope === 'all' || scope === 'nt') && (
          <div>
            {complexityLevel >= ComplexityLevel.Basic && !compact && <div className="text-xs text-gray-500 mb-1">New Testament</div>}
            <div className={compact ? 'grid grid-cols-3 gap-1' : 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2'}>
              {NT_BOOKS.map((b) => <Tile key={b} book={b} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
