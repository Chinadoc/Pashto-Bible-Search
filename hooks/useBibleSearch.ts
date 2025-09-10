import { useMemo, useState } from 'react';
import Fuse from 'fuse.js';
import type { Verse, CoverageItem } from '@/types';

// Helper function to extract book from reference
function extractBook(ref: string): string {
  const m = ref.match(/^([A-Za-z0-9\s]+)\s\d+:\d+$/);
  return m ? m[1].trim() : ref.split(" ").slice(0, -1).join(" ");
}

export function useBibleSearch(localBible: Verse[] | null, scope: "all" | "ot" | "nt") {
  const [loading, setLoading] = useState(false);

  // Filter Bible data by scope and memoize Fuse instance
  const fuse = useMemo(() => {
    if (!localBible) return null;

    // Pre-filter by scope for better performance
    const withinScope = (book: string) => {
      if (scope === "nt") return NT_BOOKS_SET.has(book);
      if (scope === "ot") return OT_BOOKS_SET.has(book);
      return true;
    };

    const filteredData = localBible.filter(verse => {
      const book = extractBook(verse.ref);
      return withinScope(book);
    });

    return new Fuse(filteredData, {
      keys: ['text'],
      includeScore: true,
      threshold: 0.3, // Lower for stricter matches, higher for fuzzier
      ignoreLocation: true,
      shouldSort: true,
    });
  }, [localBible, scope]);

  const search = async (query: string): Promise<{ hits: Verse[]; counts: Record<string, number> }> => {
    if (!fuse || !query.trim()) {
      return { hits: [], counts: {} };
    }

    setLoading(true);
    try {
      const searchResults = fuse.search(query.trim());
      const hits = searchResults.map(result => result.item).slice(0, 1000); // Configurable limit

      const counts = hits.reduce((acc: Record<string, number>, verse) => {
        const book = extractBook(verse.ref);
        acc[book] = (acc[book] || 0) + 1;
        return acc;
      }, {});

      return { hits, counts };
    } finally {
      setLoading(false);
    }
  };

  return { search, loading };
}

// Book sets for scope filtering (could be moved to a constants file)
const OT_BOOKS = [
  "Genesis","Exodus","Leviticus","Numbers","Deuteronomy","Joshua","Judges","Ruth","1 Samuel","2 Samuel","1 Kings","2 Kings","1 Chronicles","2 Chronicles","Ezra","Nehemiah","Esther","Job","Psalms","Proverbs","Ecclesiastes","Song of Solomon","Isaiah","Jeremiah","Lamentations","Ezekiel","Daniel","Hosea","Joel","Amos","Obadiah","Jonah","Micah","Nahum","Habakkuk","Zephaniah","Haggai","Zechariah","Malachi"
];

const NT_BOOKS = [
  "Matthew","Mark","Luke","John","Acts","Romans","1 Corinthians","2 Corinthians","Galatians","Ephesians","Philippians","Colossians","1 Thessalonians","2 Thessalonians","1 Timothy","2 Timothy","Titus","Philemon","Hebrews","James","1 Peter","2 Peter","1 John","2 John","3 John","Jude","Revelation"
];

const OT_BOOKS_SET = new Set(OT_BOOKS);
const NT_BOOKS_SET = new Set(NT_BOOKS);
