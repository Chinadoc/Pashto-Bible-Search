import express from 'express'
import fetch from 'node-fetch'

let inflectEngine
try {
  inflectEngine = await import('@lingdocs/inflect')
} catch (e) {
  console.error('Missing @lingdocs/inflect. Run `npm install` in inflection_service.')
  process.exit(1)
}

const app = express()
app.use(express.json())

const DICT_URL = 'https://storage.lingdocs.com/dictionary/dictionary.json'
let dictionary = null

async function ensureDictionary () {
  if (dictionary) return dictionary
  const res = await fetch(DICT_URL)
  if (!res.ok) throw new Error('Failed to fetch dictionary')
  const data = await res.json()
  dictionary = Array.isArray(data) ? data : data.entries
  return dictionary
}

app.get('/health', (_req, res) => res.json({ ok: true }))

// GET /analyze?form=PashtoWord
app.get('/analyze', async (req, res) => {
  try {
    const q = (req.query.form || '').toString()
    if (!q) return res.status(400).json({ ok: false, error: 'missing form' })
    const entries = await ensureDictionary()
    // Hypothetical API: adjust to real engine functions
    const result = inflectEngine.analyzeForm
      ? await inflectEngine.analyzeForm(q, entries)
      : { lemma: null, possibilities: [] }
    res.json({ ok: true, ...result })
  } catch (e) {
    res.status(500).json({ ok: false, error: String(e) })
  }
})

// GET /conjugate?lemma=PashtoWord
app.get('/conjugate', async (req, res) => {
  try {
    const lemma = (req.query.lemma || '').toString()
    if (!lemma) return res.status(400).json({ ok: false, error: 'missing lemma' })
    const entries = await ensureDictionary()
    const forms = inflectEngine.generateAllFormsForLemma
      ? await inflectEngine.generateAllFormsForLemma(lemma, entries)
      : []
    res.json({ ok: true, lemma, forms })
  } catch (e) {
    res.status(500).json({ ok: false, error: String(e) })
  }
})

const PORT = process.env.PORT || 5050
app.listen(PORT, () => {
  console.log('Inflection service listening on', PORT)
})


