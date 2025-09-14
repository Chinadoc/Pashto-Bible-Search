"use client";

import { useState } from 'react';

type RelatedFormsData = {
  verbs: string[]
  nouns: string[]
  other: string[]
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

  const Section = ({ title, list }: { title: string; list: string[] }) => (
    <div className="mt-2">
      <div className="text-xs text-gray-500 mb-1">{title} ({list.length})</div>
      <div className="flex flex-wrap gap-2">
        {list.map(form => (
          <button
            key={`${title}-${form}`}
            onClick={() => onPick(form)}
            className="px-2 py-1 border rounded hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            {form}
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
