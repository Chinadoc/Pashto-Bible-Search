"use client";

import { useState } from 'react';

type RelatedFormsData = {
  verbs: Array<{form: string, count: number}> | string[]
  nouns: Array<{form: string, count: number}> | string[]
  other: Array<{form: string, count: number}> | string[]
  total: number
} | null

export default function RelatedForms({ relatedForms, onPick }: { 
  relatedForms: RelatedFormsData; 
  onPick: (form: string) => void 
}) {
  const [open, setOpen] = useState<boolean>(false)

  if (!relatedForms || relatedForms.total === 0) return null

  const verbs = relatedForms.verbs || []
  const nouns = relatedForms.nouns || []
  const others = relatedForms.other || []

  // Helper to handle both old format (string[]) and new format (with counts)
  const formatItem = (item: string | {form: string, count: number}) => {
    if (typeof item === 'string') return { form: item, count: 0 }
    return item
  }

  const Section = ({ title, list }: { title: string; list: (string | {form: string, count: number})[] }) => (
    <div className="mt-2">
      <div className="text-xs text-gray-500 mb-1">{title} ({list.length})</div>
      <div className="flex flex-wrap gap-2">
        {list.map((item, idx) => {
          const { form, count } = formatItem(item)
          return (
            <button
              key={`${title}-${form}-${idx}`}
              onClick={() => onPick(form)}
              className="px-2 py-1 border rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-sm"
            >
              <span className="font-medium">{form}</span>
              {count > 0 && <span className="ml-1 text-xs opacity-70">({count})</span>}
            </button>
          )
        })}
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
