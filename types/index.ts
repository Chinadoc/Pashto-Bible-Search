export type Scope = "all" | "ot" | "nt";
export type Mode = "phrase" | "grammar";

export interface Verse {
  ref: string;
  text: string;
  translation?: string;
  dialect?: string;
  tags?: any[][]; // Timing segments for audio playback (jktags data) - added for Yousafzai audio seeking
  audio_verse_url?: string | null; // Individual verse audio clip URL for Yousafzai
  testament?: 'OT' | 'NT'; // Old Testament or New Testament
}

export interface CoverageItem {
  book: string;
  count: number;
  translation?: string;
}

export type AudioMap = Record<string, string>;

// API response types
export interface RelatedFormVariant {
  form: string;
  count?: number;
  label?: string;
  pos?: 'noun' | 'verb' | 'adjective' | 'other';
  score?: number;
  romanized?: string;
  flags?: string[];
}

export interface RelatedFormsData {
  root?: string;
  verbs?: RelatedFormVariant[];
  nouns?: RelatedFormVariant[];
  other?: RelatedFormVariant[];
  forms?: {
    verbs?: RelatedFormVariant[];
    nouns?: RelatedFormVariant[];
    other?: RelatedFormVariant[];
  };
  total?: number;
  variantDetails?: any;
  posGuess?: string;
}

export interface PhraseResponse {
  results: Verse[];
  coverage: CoverageItem[];
  ms: number;
  processed?: ProcessedSearchMetadata;
  relatedForms?: RelatedFormsData;
}

export interface VariantDetailMeta {
  form: string;
  sources: string[];
  pos?: string;
  frequency?: number;
  note?: string;
  romanization?: string;
  pattern?: string;
}

export interface VariantGroupMeta {
  label: string;
  forms: string[];
}

export interface ProcessedSearchMetadata {
  original: string;
  normalized: string;
  primaryVariant?: string;
  variants: string[];
  variantsSearched?: string[];
  variantDetails?: VariantDetailMeta[];
  variantGroups?: VariantGroupMeta[];
  romanization?: string;
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
