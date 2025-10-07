"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase';
import type { Database } from '@/types/database';

type InflectionRow = Database['public']['Tables']['inflections']['Row'];
type RootRow = Database['public']['Tables']['form_roots']['Row'];
type LemmaRow = Database['public']['Tables']['form_lemmas']['Row'];
type OccurrenceRow = Database['public']['Tables']['form_occurrences']['Row'];
type AnalysisRow = Database['public']['Tables']['morphological_analysis']['Row'];

type InflectionData = InflectionRow & {
  form_roots?: RootRow[];
  form_lemmas?: LemmaRow[];
  form_occurrences?: OccurrenceRow[];
  morphological_analysis?: AnalysisRow | null;
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
        const q = query.trim();

        // 1) Fetch a representative inflection row by base_word or inflected_form (ILIKE)
        const { data: inflList, error: inflErr } = await supabase
          .from('inflections')
          .select('*')
          .or(`base_word.eq.${q},inflected_form.ilike.%${q}%`)
          .order('frequency', { ascending: false })
          .limit(1);

        if (inflErr) {
          setError(inflErr.message);
          return;
        }

        if (!inflList || inflList.length === 0) {
          setResult(null);
          return;
        }

        const inflection = inflList[0] as InflectionRow;

        // Determine the base word to join on
        const base = inflection.base_word || q;

        // 2) Fetch related datasets in parallel using base keys
        const [rootsRes, lemmasRes, occRes, analysisRes] = await Promise.all([
          supabase.from('form_roots').select('*').eq('base_word', base).order('frequency', { ascending: false }).limit(50),
          supabase.from('form_lemmas').select('*').eq('base_word', base).order('frequency', { ascending: false }).limit(50),
          supabase.from('form_occurrences').select('*').ilike('pashto_form', `%${q}%`).order('frequency', { ascending: false }).limit(100),
          supabase.from('morphological_analysis').select('*').or(`base_word.eq.${base},word_form.ilike.%${q}%`).order('confidence_score', { ascending: false }).limit(1),
        ]);

        const roots = (rootsRes.data || []) as RootRow[];
        const lemmas = (lemmasRes.data || []) as LemmaRow[];
        const occ = (occRes.data || []) as OccurrenceRow[];
        const analysis = (analysisRes.data && analysisRes.data[0]) ? (analysisRes.data[0] as AnalysisRow) : null;

        const merged: InflectionData = { ...inflection, form_roots: roots, form_lemmas: lemmas, form_occurrences: occ, morphological_analysis: analysis };
        setResult(merged);
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
