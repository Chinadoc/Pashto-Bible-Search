"use client";

import { useState } from 'react';

type RelatedFormsData = {
  verbs: Array<{form: string, count: number}>
  nouns: Array<{form: string, count: number}>
  other: Array<{form: string, count: number}>
  total: number
} | null

// Verb form categorization
function categorizeVerbForms(forms: {form: string, count: number}[]) {
  const presentTense = forms.filter(f =>
    f.form.endsWith('م') || f.form.endsWith('و') || f.form.endsWith('ې') || f.form.endsWith('ئ') || f.form.endsWith('ي')
  )
  const pastTense = forms.filter(f =>
    f.form.endsWith('لم') || f.form.endsWith('لو') || f.form.endsWith('لې') || f.form.endsWith('ل') || f.form.endsWith('له')
  )
  const perfectForms = forms.filter(f =>
    f.form.includes('لیدلی') || f.form.includes('کړی') || f.form.includes('شوی')
  )
  const otherVerbs = forms.filter(f =>
    !presentTense.includes(f) && !pastTense.includes(f) && !perfectForms.includes(f)
  )

  return { presentTense, pastTense, perfectForms, otherVerbs }
}

export default function RelatedForms({ relatedForms, onPick }: { 
  relatedForms: RelatedFormsData; 
  onPick: (form: string) => void 
}) {
  const [open, setOpen] = useState<boolean>(false)

  if (!relatedForms || relatedForms.total === 0) return null

  const verbs = relatedForms.verbs || []
  const nouns = relatedForms.nouns || []
  const others = relatedForms.other || []

  const { presentTense, pastTense, perfectForms, otherVerbs } = categorizeVerbForms(verbs)

  const Section = ({ title, list }: { title: string; list: {form: string, count: number}[] }) => (
    <div className="mt-2">
      <div className="text-xs text-gray-500 mb-1">{title} ({list.length})</div>
      <div className="flex flex-wrap gap-2">
        {list.map(({ form, count }, idx) => (
          <button
            key={`${title}-${form}-${idx}`}
            onClick={() => onPick(form)}
            className="px-2 py-1 border rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-sm"
            title={`Click to search for: ${form}`}
          >
            <span className="font-medium">{form}</span>
            {count > 0 && <span className="ml-1 text-xs opacity-70">({count})</span>}
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
          {/* Verb forms categorized by tense */}
          {verbs.length > 0 && (
            <div className="mb-3">
              <div className="text-xs text-gray-500 mb-2 font-medium">Verbs ({verbs.length})</div>
              {presentTense.length > 0 && <Section title="Present Tense" list={presentTense} />}
              {pastTense.length > 0 && <Section title="Past Tense" list={pastTense} />}
              {perfectForms.length > 0 && <Section title="Perfect Forms" list={perfectForms} />}
              {otherVerbs.length > 0 && <Section title="Other Verbs" list={otherVerbs} />}
            </div>
          )}

          {/* Other forms */}
          <Section title="Nouns" list={nouns} />
          <Section title="Other" list={others} />
        </div>
      )}
    </div>
  )
}
