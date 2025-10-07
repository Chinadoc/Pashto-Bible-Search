export type Scope = "all" | "ot" | "nt";
export type Mode = "phrase" | "grammar";
export type SearchLanguage = "pashto" | "english" | "anki";

export type VerbFilterPerson = 'all' | '1st' | '2nd' | '3rd';
export type VerbFilterTense = 'all' | 'present' | 'past' | 'future' | 'perfect' | 'subjunctive' | 'imperative' | 'ability' | 'habitual';
export type VerbFilterAspect = 'all' | 'imperfective' | 'perfective';
export type VerbFilterMood = 'all' | 'indicative' | 'subjunctive' | 'imperative' | 'ability';

export interface VerbFilterState {
  person: VerbFilterPerson;
  tense: VerbFilterTense;
  aspect: VerbFilterAspect;
  mood: VerbFilterMood;
}

// Noun inflection filters
export type NounInflectionType = 'all' | 'plain' | '1st' | '2nd' | 'plural' | 'vocative' | 'bundled';
export type NounGender = 'all' | 'masculine' | 'feminine';

export interface NounFilterState {
  inflectionType: NounInflectionType;
  gender: NounGender;
}

// Adjective inflection filters (same as nouns)
export type AdjectiveInflectionType = NounInflectionType;
export type AdjectiveGender = NounGender;

export interface AdjectiveFilterState {
  inflectionType: AdjectiveInflectionType;
  gender: AdjectiveGender;
}

export interface Verse {
  ref: string;
  text: string;
  translation?: string | null;
  dialect?: string | null;
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

export interface EnglishMatchMeta {
  english: string;
  pashto: string;
  romanized?: string;
  pos?: string;
  forms?: string[];
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
  language?: SearchLanguage;
  englishMatches?: EnglishMatchMeta[];
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
