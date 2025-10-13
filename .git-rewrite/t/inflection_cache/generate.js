// Precompute inflections with LingDocs engine
// Usage: node generate.js

import fs from 'node:fs'
import path from 'node:path'
import fetch from 'node-fetch'

// Attempt to import the engine. If not available, stub out.
let inflectEngine
try {
  // This package name should point to the engine you use, e.g. @lingdocs/inflect
  // For illustration; you will need to add it to package.json and npm install
  inflectEngine = await import('@lingdocs/inflect')
} catch (e) {
  console.error('LingDocs engine not installed. Run: npm install @lingdocs/inflect')
  process.exit(1)
}

const OUT_FORM_TO_LEMMA = path.join(process.cwd(), 'form_to_lemma.json')
const OUT_INFL = path.join(process.cwd(), 'inflections_cache.json')

const DICT_URL = 'https://storage.lingdocs.com/dictionary/dictionary.json'

async function getDictionary () {
  const res = await fetch(DICT_URL)
  if (!res.ok) throw new Error(`failed to fetch dictionary ${res.status}`)
  const data = await res.json()
  return Array.isArray(data) ? data : data.entries
}

function romanizationFirst (f) {
  return (f || '').split(',')[0].trim()
}

async function main () {
  const entries = await getDictionary()
  const formToLemma = {}
  const byLemma = {}

  for (const ent of entries) {
    const p = ent.p
    if (!p) continue
    try {
      // Hypothetical API – replace with real inflect engine calls
      const forms = inflectEngine.generateAllFormsForLemma
        ? inflectEngine.generateAllFormsForLemma(p)
        : []

      byLemma[p] = forms.map(f => ({
        form: f.form,
        romanization: romanizationFirst(f.romanization || ent.f),
        category: f.category || ent.c,
      }))

      for (const f of byLemma[p]) {
        if (!formToLemma[f.form]) formToLemma[f.form] = p
      }
    } catch {
      // skip lemmas that the demo engine doesn’t handle
    }
  }

  fs.writeFileSync(OUT_FORM_TO_LEMMA, JSON.stringify(formToLemma, null, 2))
  fs.writeFileSync(OUT_INFL, JSON.stringify(byLemma, null, 2))
  console.log('Wrote:', OUT_FORM_TO_LEMMA, OUT_INFL)
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})


