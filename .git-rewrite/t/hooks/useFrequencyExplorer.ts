"use client";

import { useState, useEffect } from 'react';

export type PosFilter = 'any' | 'verb' | 'noun'
export type FrequencyItem = { form: string; root?: string; pos?: 'verb' | 'noun'; frequency: number }

export function useFrequencyExplorer(params: {
  testament?: 'all' | 'nt' | 'ot';
  pos?: PosFilter;
  aggregateByRoot?: boolean; // if true, groups inflections by root
  limit?: number;
}) {
  const { testament = 'all', pos = 'any', aggregateByRoot = false, limit = 300 } = params || {}
  const [items, setItems] = useState<FrequencyItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    const run = async () => {
      setLoading(true)
      setError(null)
      try {
        const qs = new URLSearchParams()
        qs.set('scope', testament)
        qs.set('limit', String(limit))
        qs.set('pos', pos)
        if (aggregateByRoot) qs.set('inflections', '1')
        const r = await fetch(`/api/lexicon_frequency?${qs.toString()}`, { cache: 'no-store' })
        const json = await r.json().catch(() => ({ items: [] }))
        if (!cancelled) setItems(Array.isArray(json?.items) ? json.items : [])
      } catch (e: any) {
        if (!cancelled) setError(e?.message || 'Failed to load frequency data')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    run()
    return () => { cancelled = true }
  }, [testament, pos, aggregateByRoot, limit])

  return { items, loading, error }
}
