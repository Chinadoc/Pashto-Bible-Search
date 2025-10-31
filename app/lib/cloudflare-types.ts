/**
 * TypeScript types for Cloudflare D1 database schema
 * Mirrors the SQLite schema defined in d1-schema.sql
 */

export interface Verse {
  id: number;
  ref: string;
  book: string;
  chapter: number;
  verse: number;
  text: string;
  text_normalized?: string | null;
  testament: 'OT' | 'NT';
  translation_key: string;
  dialect?: string | null;
  audio_r2_key?: string | null;
  audio_public_url?: string | null;
  created_at: number; // Unix timestamp
  updated_at: number; // Unix timestamp
}

export interface VerseYousafzai extends Verse {
  tags: any[]; // JSON array
}

export interface WordOccurrence {
  id: number;
  word: string;
  translation_key: string;
  frequency: number;
  verse_refs: string[]; // JSON array parsed
  tf_idf_scores?: number[]; // JSON array parsed
  primary_verse_ref?: string | null;
  created_at: number;
  updated_at: number;
}

export interface IrregularVerb {
  id: number;
  verb_root: string;
  stems: any; // JSON
  roots: any; // JSON
  past_participle: string;
  romanization: any; // JSON
  irregularity_type: string;
  conjugation_pattern: string;
  examples: any; // JSON
  notes?: string | null;
  created_at: number;
  updated_at: number;
}

export interface VerbLexicon {
  id: number;
  verb_root: string;
  stems: any; // JSON
  roots: any; // JSON
  past_participle: string;
  romanization: any; // JSON
  conjugation_pattern: string;
  examples: any; // JSON
  notes?: string | null;
  created_at: number;
  updated_at: number;
}

export interface Inflection {
  id: number;
  base_word: string;
  inflected_form: string;
  grammatical_info: any; // JSON
  frequency: number;
  examples: any; // JSON
  created_at: number;
  updated_at: number;
}

export interface GrammarRule {
  id: number;
  rule_name: string;
  part_of_speech: string;
  pattern_description: string;
  transformation_rules: any; // JSON
  priority: number;
  examples: any; // JSON
  created_at: number;
  updated_at: number;
}

export interface WordFrequency {
  id: number;
  pashto_word: string;
  frequency_count: number;
  frequency_rank: number;
  testament: string;
  created_at: number;
  updated_at: number;
}

export interface NounLexicon {
  id: number;
  pashto_word: string;
  romanized?: string | null;
  gender: string;
  number: string;
  plural_forms?: any; // JSON
  frequency: number;
  examples?: any; // JSON
  created_at: number;
  updated_at: number;
}

export interface Dictionary {
  id: number;
  word: string;
  pos: string;
  definition: string;
  romanization: string;
  frequency: number;
  examples: any; // JSON
  enriched_info?: any; // JSON
  created_at: number;
  updated_at: number;
}

export interface FormLemma {
  id: number;
  lemma_form: string;
  base_word: string;
  part_of_speech: string;
  frequency: number;
  created_at: number;
  updated_at: number;
}

export interface FormRoot {
  id: number;
  word_form: string;
  root_word: string;
  base_word: string;
  frequency: number;
  created_at: number;
  updated_at: number;
}

export interface FormOccurrence {
  id: number;
  pashto_form: string;
  verse_reference: string;
  frequency: number;
  context?: string | null;
  created_at: number;
  updated_at: number;
}

export interface MorphologicalAnalysis {
  id: number;
  word_form: string;
  base_word: string;
  analysis_results: any; // JSON
  confidence_score: number;
  created_at: number;
  updated_at: number;
}

export interface VideoTranscript {
  id: number;
  video_id: string;
  verse_reference?: string | null;
  transcript_text: string;
  start_time?: number | null;
  end_time?: number | null;
  confidence?: number | null;
  speaker_id?: string | null;
  audio_r2_key?: string | null;
  google_drive_file_id?: string | null;
  google_drive_url?: string | null;
  needs_retry: boolean;
  retry_reason?: string | null;
  validation_score?: number | null;
  retry_count: number;
  transcription_service: string;
  created_at: number;
  updated_at: number;
}

/**
 * API Response types
 */
export interface SearchVersesResponse {
  verses: Verse[];
  count: number;
}

export interface GetVersesByChapterResponse {
  verses: Verse[];
  count: number;
}

export interface GetVerseByRefResponse {
  verse: Verse;
}

export interface SearchWordOccurrencesResponse {
  occurrences: WordOccurrence[];
  count: number;
}

export interface GetAudioUrlResponse {
  url: string;
  contentType: string;
  size: number;
}

