"use client";

import { useEffect, useState } from 'react';

type Item = { form: string; count?: number; pos?: string; relation?: 'root' | 'inflection' | 'mapped'; info?: any }

export default function RelatedForms({ term, onPick }: { term: string; onPick: (form: string) => void }) {
  const [items, setItems] = useState<Item[]>([])
  const [root, setRoot] = useState<string>('')
  const [open, setOpen] = useState<boolean>(false)

  useEffect(() => {
    const q = term.trim();
    if (!q) { setItems([]); setRoot(''); return }
    let cancelled = false
    ;(async () => {
      try {
        const r = await fetch('/api/related_forms', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ term: q, limit: 500 }) })
        const js = await r.json()
        if (!cancelled) {
          setItems(Array.isArray(js?.forms) ? js.forms : [])
          setRoot(js?.root || '')
        }
      } catch {
        if (!cancelled) { setItems([]); setRoot('') }
      }
    })()
    return () => { cancelled = true }
  }, [term])

  if (!term.trim()) return null

  const verbs = items.filter(it => it.pos === 'verb')
  const nouns = items.filter(it => it.pos === 'noun')
  const others = items.filter(it => it.pos !== 'verb' && it.pos !== 'noun')

  const Section = ({ title, list }: { title: string; list: Item[] }) => (
    <div className="mt-2">
      <div className="text-xs text-gray-500 mb-1">{title} ({list.length})</div>
      <div className="flex flex-wrap gap-2">
        {list.map(it => (
          <button
            key={`${title}-${it.form}`}
            onClick={() => onPick(it.form)}
            className="px-2 py-1 border rounded hover:bg-gray-100 dark:hover:bg-gray-700"
            title={it.info ? JSON.stringify(it.info) : undefined}
          >
            {it.form}
            {it.relation && <span className="ml-1 text-xs text-gray-500">({it.relation})</span>}
            {typeof it.count === 'number' && <span className="ml-1 text-xs text-gray-500">{it.count}</span>}
          </button>
        ))}
        {list.length === 0 && <span className="text-gray-400">—</span>}
      </div>
    </div>
  )

  return (
    <div className="mt-2 rounded border border-gray-200 dark:border-gray-700 p-2 text-sm">
      <div className="flex items-center justify-between">
        <div className="text-gray-700 dark:text-gray-300">Related forms</div>
        <button onClick={() => setOpen(!open)} className="text-xs px-2 py-0.5 border rounded">{open ? 'Hide' : 'Show'}</button>
      </div>
      {open && (
        <div className="mt-2">
          <Section title="Verbs" list={verbs} />
          <Section title="Nouns" list={nouns} />
          <Section title="Other" list={others} />
        </div>
      )}
    </div>
  )
}
