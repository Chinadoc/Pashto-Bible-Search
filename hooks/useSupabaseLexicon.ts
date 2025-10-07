"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase';
import type { Database } from '@/types/database';

type VerbEntry = Database['public']['Tables']['irregular_verbs']['Row'] | Database['public']['Tables']['verbs_lexicon']['Row'];

interface LexiconResult {
  id?: number;
  verb_root: string;
  stems: Record<string, string>;
  roots: Record<string, string>;
  past_participle: string;
  romanization: Record<string, string>;
  irregularity_type: string;
  conjugation_pattern: string;
  examples: any[];
  notes?: string;
  conjugations?: Record<string, any>;
}

export function useSupabaseLexicon() {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<LexiconResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!query.trim()) {
      setResult(null);
      return;
    }

    const fetchLexicon = async () => {
      setLoading(true);
      setError(null);

      try {
        // First try irregular_verbs
        let { data, error: irregularError } = await supabase
          .from('irregular_verbs')
          .select('*')
          .ilike('verb_root', `%${query}%`)
          .limit(1);

        // If not found in irregular_verbs, try verbs_lexicon
        if (!data || data.length === 0) {
          const { data: lexiconData, error: lexiconError } = await supabase
            .from('verbs_lexicon')
            .select('*')
            .ilike('verb_root', `%${query}%`)
            .limit(1);

          data = lexiconData;
          if (lexiconError) {
            setError(lexiconError.message);
            return;
          }
        }

        if (irregularError) {
          setError(irregularError.message);
          return;
        }

        if (data && data.length > 0) {
          const verbData = data[0] as VerbEntry;

          // Generate conjugations if we have stems/roots
          const conjugations = await generateConjugations(verbData);

          setResult({
            ...verbData,
            conjugations
          } as LexiconResult);
        } else {
          setResult(null);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(fetchLexicon, 300); // Debounce search
    return () => clearTimeout(debounceTimer);
  }, [query]);

  const generateConjugations = async (verbData: VerbEntry) => {
    try {
      // Get grammar rules for this verb pattern
      const { data: rules } = await supabase
        .from('grammar_rules')
        .select('*')
        .eq('part_of_speech', 'verb')
        .order('priority');

      // Get inflections for this verb
      const { data: inflections } = await supabase
        .from('inflections')
        .select('*')
        .eq('base_word', verbData.verb_root)
        .order('frequency', { ascending: false });

      // Generate conjugation tables using rules and inflections
      const conjugations: Record<string, any> = {};

      if (rules) {
        conjugations.rules = rules;
      }

      if (inflections) {
        conjugations.inflections = inflections;
      }

      return conjugations;
    } catch (err) {
      console.error('Error generating conjugations:', err);
      return {};
    }
  };

  return { query, setQuery, result, loading, error };
}
