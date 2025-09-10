"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import type { Database } from '@/types/database';

type InflectionData = Database['public']['Tables']['inflections']['Row'] & {
  form_roots?: Database['public']['Tables']['form_roots']['Row'][];
  form_lemmas?: Database['public']['Tables']['form_lemmas']['Row'][];
  form_occurrences?: Database['public']['Tables']['form_occurrences']['Row'][];
  morphological_analysis?: Database['public']['Tables']['morphological_analysis']['Row'];
};

export function useMorphologySearch() {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<InflectionData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!query.trim()) {
      setResult(null);
      return;
    }

    const fetchMorphology = async () => {
      setLoading(true);
      setError(null);

      try {
        // Query inflections with related data
        const { data, error: inflectionError } = await supabase
          .from('inflections')
          .select(`
            *,
            form_roots(*),
            form_lemmas(*),
            form_occurrences(*),
            morphological_analysis(*)
          `)
          .eq('base_word', query.trim())
          .single();

        if (inflectionError && inflectionError.code !== 'PGRST116') {
          // PGRST116 is "no rows returned" which is expected
          setError(inflectionError.message);
          return;
        }

        if (data) {
          setResult(data);
        } else {
          setResult(null);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Morphology search failed');
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(fetchMorphology, 300);
    return () => clearTimeout(debounceTimer);
  }, [query]);

  return { query, setQuery, result, loading, error };
}
