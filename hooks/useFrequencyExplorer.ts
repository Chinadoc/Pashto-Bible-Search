"use client";

import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Database } from '../types/database';

type FrequencyData = Database['public']['Tables']['word_frequencies']['Row'];

export function useFrequencyExplorer(testament: 'all' | 'nt' | 'ot' = 'all') {
  const [frequencies, setFrequencies] = useState<FrequencyData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFrequencies = async () => {
      setLoading(true);
      setError(null);

      try {
        let query = supabase
          .from('word_frequencies')
          .select('*')
          .order('frequency_rank', { ascending: true })
          .limit(100); // Top 100 most frequent words

        if (testament !== 'all') {
          query = query.eq('testament', testament);
        }

        const { data, error: freqError } = await query;

        if (freqError) {
          setError(freqError.message);
        } else {
          setFrequencies(data || []);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load frequency data');
      } finally {
        setLoading(false);
      }
    };

    fetchFrequencies();
  }, [testament]);

  return { frequencies, loading, error };
}
