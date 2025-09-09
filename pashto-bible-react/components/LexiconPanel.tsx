"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";

type Item = { form: string; root?: string; pos?: 'verb' | 'noun'; frequency: number }

interface Props { onPickForm?: (form: string) => void }

export default function LexiconPanel({ onPickForm }: Props) {
  const [scope, setScope] = useState<'all' | 'ot' | 'nt'>('all')
  const [pos, setPos] = useState<'any' | 'verb' | 'noun'>('any')
  const [inflections, setInflections] = useState<boolean>(false)
  const [q, setQ] = useState<string>("")
  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState<boolean>(false)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const url = `/api/lexicon_frequency?scope=${scope}&pos=${pos}&inflections=${inflections ? '1' : '0'}&limit=600`
      const data = await fetch(url, { cache: 'no-store' }).then(r => r.json()).catch(() => ({ items: [] }))
      setItems(Array.isArray(data?.items) ? data.items as Item[] : [])
    } finally { setLoading(false) }
  }, [scope, pos, inflections])

  useEffect(() => { load() }, [scope, pos, inflections, load])

  const filtered = useMemo(() => {
    const s = (q || '').trim()
    if (!s) return items
    return items.filter(it => it.form.includes(s) || (it.root && it.root.includes(s)))
  }, [items, q])

  return (
    <div className="w-full flex flex-col gap-3">
      <div className="flex flex-col sm:flex-row gap-2 items-stretch">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search forms/roots"
          className="flex-1 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2"
        />
        <select value={scope} onChange={(e) => setScope(e.target.value as 'all' | 'ot' | 'nt')} className="rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2">
          <option value="all">All</option>
          <option value="nt">New Testament</option>
          <option value="ot">Old Testament</option>
        </select>
        <select value={pos} onChange={(e) => setPos(e.target.value as 'any' | 'verb' | 'noun')} className="rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2">
          <option value="any">All POS</option>
          <option value="verb">Verbs</option>
          <option value="noun">Nouns</option>
        </select>
        <label className="inline-flex items-center gap-2 text-sm px-2">
          <input type="checkbox" checked={inflections} onChange={(e) => setInflections(e.target.checked)} />
          Aggregate by root
        </label>
      </div>
      <div className="text-sm text-gray-600 dark:text-gray-400">{loading ? 'Loading…' : `${filtered.length} items`}</div>
      <div className="border rounded-md border-gray-200 dark:border-gray-700 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr className="text-left">
              <th className="p-2">{inflections ? 'Root' : 'Form'}</th>
              <th className="p-2">POS</th>
              <th className="p-2">Frequency</th>
            </tr>
          </thead>
          <tbody>
            {filtered.slice(0, 800).map((it) => (
              <tr key={`${it.form}|${it.root || ''}`} className="border-t border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/60">
                <td className="p-2">
                  <button className="text-blue-600 hover:underline" onClick={() => onPickForm?.(it.form)}>
                    {it.form}
                  </button>
                  {it.root && it.root !== it.form ? (
                    <span className="ml-2 text-xs text-gray-500">root: {it.root}</span>
                  ) : null}
                </td>
                <td className="p-2 text-gray-700 dark:text-gray-300">{it.pos || ''}</td>
                <td className="p-2">{it.frequency}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}












