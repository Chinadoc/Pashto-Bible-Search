export type Scope = "all" | "ot" | "nt";
export type Mode = "phrase" | "grammar";

export interface Verse {
  ref: string;
  text: string;
}

export interface CoverageItem {
  book: string;
  count: number;
}

export type AudioMap = Record<string, string>;

// API response types
export interface PhraseResponse {
  results: Verse[];
  coverage: CoverageItem[];
  ms: number;
}

export interface Conjugations {
  root: string;
  kind: "verb" | "noun" | string;
  query_rom?: string;
  tables: Record<string, any>;
}

export interface GrammarResponse {
  occurrences: Verse[];
  coverage: CoverageItem[];
  conjugations?: Conjugations | null;
  highlight_terms?: string[];
  ms: number;
}

export interface LexiconEntry {
  e?: string;
  f_primary: string;
  f_secondary?: string;
  gender?: string;
  p_norm?: string;
  pos_family?: string;
  [key: string]: any;
}


