import 'server-only';
import Fuse from 'fuse.js';
import type { IFuseOptions } from 'fuse.js';
import { getData, VerseRecord } from '../data/load';

export type Scope = 'all' | 'ot' | 'nt';
export type SearchResult = Pick<VerseRecord, 'ref' | 'text' | 'testament' | 'source' | 'book'>;

const fuseOptions: IFuseOptions<VerseRecord> = {
  keys: ['text', 'textNormalized'],
  includeScore: true,
  threshold: 0.35,
  minMatchCharLength: 2,
};

let fuseInstance: Fuse<VerseRecord> | null = null;

function matchesScope(record: VerseRecord, scope: Scope): boolean {
  if (scope === 'all') return true;
  const testament = record.testament?.toLowerCase();
  return testament === scope;
}

function toSearchResult(record: VerseRecord): SearchResult {
  return {
    ref: record.ref,
    text: record.text,
    testament: record.testament,
    source: record.source,
    book: record.book,
  };
}

export async function directContains(term: string, scope: Scope, limit = 100): Promise<SearchResult[]> {
  const query = term.trim();
  if (!query) return [];

  const { verses } = await getData();
  const lower = query.toLowerCase();
  const results: SearchResult[] = [];

  for (const verse of verses) {
    if (!matchesScope(verse, scope)) continue;
    if (verse.textLower.includes(lower) || verse.textNormalizedLower?.includes(lower)) {
      results.push(toSearchResult(verse));
      if (results.length >= limit) break;
    }
  }

  return results;
}

export async function fuzzySearch(term: string, scope: Scope, limit = 20): Promise<SearchResult[]> {
  const query = term.trim();
  if (!query) return [];

  const { verses } = await getData();
  if (!fuseInstance) {
    fuseInstance = new Fuse(verses, fuseOptions);
  }

  const hits = fuseInstance.search(query, { limit: limit * 3 });
  const scoped = hits
    .map((hit) => hit.item)
    .filter((verse) => matchesScope(verse, scope))
    .slice(0, limit)
    .map(toSearchResult);

  return scoped;
}

export async function multiTermSearch(terms: string[], scope: Scope, limit = 100): Promise<SearchResult[]> {
  const needles = Array.from(new Set(terms.map((term) => term.trim()).filter(Boolean)));
  if (!needles.length) return [];

  const resultsMap = new Map<string, SearchResult>();

  for (const needle of needles) {
    const hits = await directContains(needle, scope, limit);
    for (const hit of hits) {
      if (!resultsMap.has(hit.ref)) {
        resultsMap.set(hit.ref, hit);
        if (resultsMap.size >= limit) break;
      }
    }
    if (resultsMap.size >= limit) break;
  }

  return Array.from(resultsMap.values());
}

