/**
 * Part of Speech (POS) types and metadata for search filtering
 * Aligned with LingDocs POS system and D1 database structure
 */

export type PartOfSpeech = 
  | 'verb' 
  | 'noun' 
  | 'adjective' 
  | 'adverb' 
  | 'phrase' 
  | 'preposition'
  | 'pronoun'
  | 'other';

export interface POSMetadata {
  pos: PartOfSpeech | PartOfSpeech[];  // Can be multiple POS for words like "منډه" (noun/verb)
  source: 'lingdocs' | 'd1' | 'merged';
  lingdocsId?: string;
  d1Lemma?: string;
  transitivity?: 'transitive' | 'intransitive' | 'both';
  verbType?: 'stative' | 'dynamic' | 'compound';
  gender?: 'masculine' | 'feminine' | 'both';
  nounInflectionType?: 'regular' | 'irregular' | 'sandwich';
  adjectiveDegree?: 'positive' | 'comparative' | 'superlative';
}

export interface VariantWithPOS {
  form: string;
  label: string;
  pos: PartOfSpeech;
  posMetadata?: POSMetadata;
  sources: string[];  // ['lingdocs', 'd1']
  count?: number;
  score?: number;
  romanized?: string;
  flags?: string[];
}

export interface POSSummary {
  [key: string]: {
    count: number;
    sources: {
      lingdocs: number;
      d1: number;
    };
  };
}

export interface POSFilters {
  include?: PartOfSpeech[];
  exclude?: PartOfSpeech[];
}

