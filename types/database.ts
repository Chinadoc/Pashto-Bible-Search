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
