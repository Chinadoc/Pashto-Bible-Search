export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      irregular_verbs: {
        Row: {
          id: number
          verb_root: string
          stems: Json
          roots: Json
          past_participle: string
          romanization: Json
          irregularity_type: string
          conjugation_pattern: string
          examples: Json
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          verb_root: string
          stems: Json
          roots: Json
          past_participle: string
          romanization: Json
          irregularity_type: string
          conjugation_pattern: string
          examples: Json
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          verb_root?: string
          stems?: Json
          roots?: Json
          past_participle?: string
          romanization?: Json
          irregularity_type?: string
          conjugation_pattern?: string
          examples?: Json
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      verbs_lexicon: {
        Row: {
          id: number
          verb_root: string
          stems: Json
          roots: Json
          past_participle: string
          romanization: Json
          conjugation_pattern: string
          examples: Json
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          verb_root: string
          stems: Json
          roots: Json
          past_participle: string
          romanization: Json
          conjugation_pattern: string
          examples: Json
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          verb_root?: string
          stems?: Json
          roots?: Json
          past_participle?: string
          romanization?: Json
          conjugation_pattern?: string
          examples?: Json
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      inflections: {
        Row: {
          id: number
          base_word: string
          inflected_form: string
          grammatical_info: Json
          frequency: number
          examples: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          base_word: string
          inflected_form: string
          grammatical_info: Json
          frequency: number
          examples: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          base_word?: string
          inflected_form?: string
          grammatical_info?: Json
          frequency?: number
          examples?: Json
          created_at?: string
          updated_at?: string
        }
      }
      grammar_rules: {
        Row: {
          id: number
          rule_name: string
          part_of_speech: string
          pattern_description: string
          transformation_rules: Json
          priority: number
          examples: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          rule_name: string
          part_of_speech: string
          pattern_description: string
          transformation_rules: Json
          priority: number
          examples: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          rule_name?: string
          part_of_speech?: string
          pattern_description?: string
          transformation_rules?: Json
          priority?: number
          examples?: Json
          created_at?: string
          updated_at?: string
        }
      }
      word_frequencies: {
        Row: {
          id: number
          pashto_word: string
          frequency_count: number
          frequency_rank: number
          testament: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          pashto_word: string
          frequency_count: number
          frequency_rank: number
          testament: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          pashto_word?: string
          frequency_count?: number
          frequency_rank?: number
          testament?: string
          created_at?: string
          updated_at?: string
        }
      }
      nouns_lexicon: {
        Row: {
          id: number
          pashto_word: string
          romanized: string
          gender: string
          number: string
          plural_forms: Json
          frequency: number
          examples: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          pashto_word: string
          romanized?: string
          gender: string
          number: string
          plural_forms?: Json
          frequency?: number
          examples?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          pashto_word?: string
          romanized?: string
          gender?: string
          number?: string
          plural_forms?: Json
          frequency?: number
          examples?: Json
          created_at?: string
          updated_at?: string
        }
      }
      dictionary: {
        Row: {
          id: number
          word: string
          pos: string
          definition: string
          romanization: string
          frequency: number
          examples: Json
          enriched_info: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          word: string
          pos: string
          definition: string
          romanization: string
          frequency: number
          examples: Json
          enriched_info: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          word?: string
          pos?: string
          definition?: string
          romanization?: string
          frequency?: number
          examples?: Json
          enriched_info?: Json
          created_at?: string
          updated_at?: string
        }
      }
      form_lemmas: {
        Row: {
          id: number
          lemma_form: string
          base_word: string
          part_of_speech: string
          frequency: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          lemma_form: string
          base_word: string
          part_of_speech: string
          frequency?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          lemma_form?: string
          base_word?: string
          part_of_speech?: string
          frequency?: number
          created_at?: string
          updated_at?: string
        }
      }
      form_roots: {
        Row: {
          id: number
          word_form: string
          root_word: string
          base_word: string
          frequency: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          word_form: string
          root_word: string
          base_word: string
          frequency?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          word_form?: string
          root_word?: string
          base_word?: string
          frequency?: number
          created_at?: string
          updated_at?: string
        }
      }
      form_occurrences: {
        Row: {
          id: number
          pashto_form: string
          verse_reference: string
          frequency: number
          context: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          pashto_form: string
          verse_reference: string
          frequency?: number
          context?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          pashto_form?: string
          verse_reference?: string
          frequency?: number
          context?: string
          created_at?: string
          updated_at?: string
        }
      }
      morphological_analysis: {
        Row: {
          id: number
          word_form: string
          base_word: string
          analysis_results: Json
          confidence_score: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          word_form: string
          base_word: string
          analysis_results: Json
          confidence_score?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          word_form?: string
          base_word?: string
          analysis_results?: Json
          confidence_score?: number
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
