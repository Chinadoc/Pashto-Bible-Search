"use client";

import React, { useMemo } from "react";
import type { CoverageItem } from "@/types";

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

interface Props {
  coverage: CoverageItem[];
  onPickBook?: (b: string) => void;
  compact?: boolean;
  scope?: "all" | "nt" | "ot";
}

function abbr(book: string): string {
  return ABBR[book] || book;
}


export default function CoverageGrid({ coverage, onPickBook, compact, scope = "all" }: Props) {
  const covMap = useMemo(() => {
    const m: Record<string, number> = {};
    for (const c of coverage) m[c.book] = c.count;
    return m;
  }, [coverage]);

  // Compute intensity classes for counts (simple 4-step heat map)
  const max = useMemo(() => Math.max(1, ...Object.values(covMap)), [covMap])
  const tint = (count: number) => {
    const r = count / max
    if (r > 0.75) return 'bg-sky-600/25 border-sky-400'
    if (r > 0.5) return 'bg-sky-600/20 border-sky-500'
    if (r > 0.25) return 'bg-sky-600/10 border-sky-700'
    return 'bg-transparent border-gray-700'
  }

  const Tile = ({ book }: { book: string }) => {
    const count = covMap[book] ?? 0
    const active = count > 0
    return (
      <button
        onClick={() => active && onPickBook?.(book)}
        className={`relative text-left rounded-md px-2 py-1 border ${compact ? 'text-xs' : 'text-sm'} ${tint(count)} ${active ? 'hover:bg-sky-700/20' : 'opacity-60'}`}
      >
        <span>{compact ? abbr(book) : book}</span>
        {active ? <span className="absolute -top-1 -right-1 inline-flex items-center justify-center w-5 h-5 rounded-full bg-sky-600 text-white text-[10px]">{count}</span> : null}
      </button>
    )
  }

  return (
    <div className={`w-full rounded-lg border border-gray-600/60 ${compact ? 'p-2' : 'p-4'} bg-gray-900/40`}> 
      {!compact && <div className="font-semibold text-lg mb-3">Bible Coverage</div>}
      <div className="flex flex-col gap-4">
        {(scope === 'all' || scope === 'ot') && (
          <div>
            {!compact && <div className="text-sm text-gray-400 mb-1">Old Testament</div>}
            <div className={compact ? 'grid grid-cols-3 gap-1' : 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2'}>
              {OT_BOOKS.map((b) => <Tile key={b} book={b} />)}
            </div>
          </div>
        )}
        {(scope === 'all' || scope === 'nt') && (
          <div>
            {!compact && <div className="text-sm text-gray-400 mb-1">New Testament</div>}
            <div className={compact ? 'grid grid-cols-3 gap-1' : 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2'}>
              {NT_BOOKS.map((b) => <Tile key={b} book={b} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

