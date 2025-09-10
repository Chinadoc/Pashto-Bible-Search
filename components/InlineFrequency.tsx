"use client";

import { useEffect, useMemo, useState } from 'react';

interface Props {
  term: string;
  scope: 'all' | 'nt' | 'ot';
  includeRelated?: boolean;
  onPick?: (form: string) => void;
}

type Item = { form: string; frequency: number };

export default function InlineFrequency({ term, scope, includeRelated, onPick }: Props) {
  const [items, setItems] = useState<Item[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const q = term.trim();
    if (!q) { setItems([]); setTotal(0); return; }
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const url = `/api/form_frequency?q=${encodeURIComponent(q)}&scope=${scope}&includeRelated=${includeRelated ? '1' : '0'}`;
        const r = await fetch(url, { cache: 'no-store' });
        const js = await r.json();
        if (!cancelled) {
          setItems(Array.isArray(js?.items) ? js.items.slice(0, 20) : []);
          setTotal(Number(js?.total || 0));
        }
      } catch {
        if (!cancelled) { setItems([]); setTotal(0); }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true };
  }, [term, scope, includeRelated]);

  if (!term.trim()) return null;

  return (
    <div className="mt-2 rounded border border-gray-200 dark:border-gray-700 p-2 text-sm">
      <div className="flex items-center justify-between">
        <div className="text-gray-700 dark:text-gray-300">Frequency{includeRelated ? ' (incl. related)' : ''}:</div>
        <div className="font-semibold">{loading ? '…' : total.toLocaleString()}</div>
      </div>
      {items.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {items.map((it) => (
            <button
              key={it.form}
              onClick={() => onPick?.(it.form)}
              className="px-2 py-1 border rounded text-xs hover:bg-gray-100 dark:hover:bg-gray-700"
              title={`${it.form}: ${it.frequency.toLocaleString()}`}
            >
              {it.form} <span className="text-gray-500">{it.frequency.toLocaleString()}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

