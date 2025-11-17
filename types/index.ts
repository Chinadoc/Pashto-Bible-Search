export type Scope = "all" | "ot" | "nt";
export type Mode = "phrase" | "grammar";
export type SearchLanguage = "pashto" | "english" | "anki";

export * from './search';
export * from './database';

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

export interface MultiVerbFilterState {
  person: VerbFilterPerson[];
  tense: VerbFilterTense[];
  aspect: VerbFilterAspect[];
  mood: VerbFilterMood[];
}

// Inflection reason filters
export type InflectionReasonFilter = 'all' | 'plural' | 'sandwich' | 'transitive_past';

// Noun inflection filters
export type NounInflectionType = 'all' | 'plain' | '1st' | '2nd' | 'plural' | 'vocative' | 'bundled';
export type NounGender = 'all' | 'masculine' | 'feminine';

export interface NounFilterState {
  inflectionType: NounInflectionType;
  gender: NounGender;
  inflectionReason?: InflectionReasonFilter; // Filter by why word is inflected
  category?: string | 'all';
  grammaticalCase?: string | 'all';
  number?: string | 'all';
  lexicalGender?: string | 'all';
  pluralType?: string | 'all';
}

// Adjective inflection filters (same as nouns)
export type AdjectiveInflectionType = NounInflectionType;
export type AdjectiveGender = NounGender;

export interface AdjectiveFilterState {
  inflectionType: AdjectiveInflectionType;
  gender: AdjectiveGender;
  category?: string | 'all';
  grammaticalCase?: string | 'all';
  number?: string | 'all';
}

export interface MorphologyFacetBucket {
  value: string;
  count: number;
}

export interface MorphologyFacets {
  inflectionCategories: MorphologyFacetBucket[];
  inflectionCases: MorphologyFacetBucket[];
  inflectionNumbers: MorphologyFacetBucket[];
  inflectionGenders: MorphologyFacetBucket[];
  nounLexiconGenders: MorphologyFacetBucket[];
  nounPluralTypes: MorphologyFacetBucket[];
}

export interface DictionaryEntry {
  pashto: string;
  romanized?: string | null;
  pos?: string | null;
  english?: string | null;
}

export interface DictionaryData {
  entries: DictionaryEntry[];
  groupedByPos: Record<string, DictionaryEntry[]>;
  needsDisambiguation: boolean;
}

export interface Verse {
  ref: string;
  text: string;
  translation?: string | null;
  dialect?: string | null;
  tags?: any[][]; // Timing segments for audio playback (jktags data) - added for Yousafzai audio seeking
  audio_verse_url?: string | null; // Individual verse audio clip URL for Yousafzai
  testament?: 'OT' | 'NT'; // Old Testament or New Testament
  audio_storage_path?: string | null; // Storage path for verse audio file
  audio_public_url?: string | null; // Public URL for verse audio playback
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
  source?: string; // Source table or resolver that produced the variant
  flags?: string[];
  inflectionType?: string; // e.g., 'plain', '1st_m', '1st_f', '2nd', 'vocative_m', 'plural_m', etc.
  inflectionCategory?: string;
  grammaticalCase?: string;
  grammaticalNumber?: string;
  gender?: string;
  pluralType?: string;
  lexicalGender?: string;
  grammaticalInfo?: Record<string, any> | null;
  inflectionReasons?: {
    plural: number;
    sandwich: number;
    transitive_past: number;
    sandwich_types: string[];
    examples?: Array<{
      verse_ref: string;
      text: string;
      reason: 'plural' | 'sandwich' | 'transitive_past';
      highlighted_context?: string;
      pattern?: string;
    }>;
  };
}

export interface RelatedFormsData {
  root?: string;
  searchedForm?: string; // The original form that was searched (for conjugated forms)
  verbs?: RelatedFormVariant[];
  nouns?: RelatedFormVariant[];
  adjectives?: RelatedFormVariant[];
  other?: RelatedFormVariant[];
  romanization?: string;
  english?: string;
  forms?: {
    verbs?: RelatedFormVariant[];
    nouns?: RelatedFormVariant[];
    adjectives?: RelatedFormVariant[];
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

// Forward declaration for DisambiguationResult (defined in enhanced_disambiguation.ts)
export interface DisambiguationResult {
  word: string;
  primaryMeaning: string;
  primaryPOS: string;
  confidence: number;
  alternativeMeanings: Array<{
    meaning: string;
    pos: string;
    confidence: number;
    contextClues: string[];
  }>;
  contextAnalysis: any; // ContextFeatures type
  recommendedAction: string;
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
  disambiguation?: {
    word: string;
    likelyPos: string;
    confidence: number;
    contextClues: string[];
    recommendedAction: string;
  };
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

// Chapter browsing types
export interface ChapterInfo {
  book: string;
  chapter: number;
  verseCount: number;
}

export interface BookChapterInfo {
  book: string;
  chapters: ChapterInfo[];
  totalVerses: number;
}
