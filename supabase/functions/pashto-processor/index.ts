// Supabase Edge Function (Deno) — pashto-processor
// - Normalizes Pashto input
// - Handles romanized → Pashto best-effort via DB
// - Expands variants (yeh/kaf variants + root→forms where available)
// Request: { formPs?: string; includeRelated?: boolean }
// Response: { normalized: string; variants: string[]; romanization?: string; root?: string }

// deno-lint-ignore-file no-explicit-any
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

type Payload = {
  formPs?: string
  includeRelated?: boolean
}

type Result = {
  normalized: string
  variants: string[]
  romanization?: string
  root?: string
}

function normalizePashto(input: string): string {
  return (input || '')
    .normalize('NFC')
    .replace(/[\u200C\u200D\u200E\u200F]/g, '') // ZWNJ/ZWJ/LRM/RLM
    .replace(/[يىئ]/g, 'ی') // unify Arabic yeh → Farsi Yeh
}

function isPashto(text: string): boolean {
  return /[\u0600-\u06FF]/.test(text || '')
}

function yehKafVariants(text: string): string[] {
  const v = new Set<string>()
  const base = text || ''
  v.add(base)
  v.add(base.replace(/ی/g, 'ي'))
  v.add(base.replace(/ی/g, 'ى'))
  v.add(base.replace(/ک/g, 'ك')) // keheh → Arabic kaf
  v.add(base.replace(/ې/g, 'ی')) // Pashto yeh → Farsi
  v.add(base.replace(/ی/g, 'ې')) // Farsi yeh → Pashto yeh
  return Array.from(v).filter(Boolean)
}

function orthoVariants(text: string): string[] {
  // Minimal orthographic pair used in Streamlit: اخستل ↔︎ اخیستل
  const v = new Set<string>()
  v.add(text)
  v.add(text.replace(/خ(?=ست)/g, 'خی'))
  v.add(text.replace(/خی(?=ست)/g, 'خ'))
  return Array.from(v)
}

async function getSupabaseClient() {
  const url = Deno.env.get('SUPABASE_URL') || Deno.env.get('SUPABASE_URL')
  // Prefer service role for unrestricted reads; fall back to anon if not set
  const service = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || Deno.env.get('SERVICE_KEY')
  const anon = Deno.env.get('SUPABASE_ANON_KEY') || Deno.env.get('SUPABASE_ANON_KEY')
  const key = service || anon
  if (!url || !key) return null
  return createClient(url, key, { auth: { persistSession: false } })
}

async function fromRomanizedToPashto(supabase: any, input: string): Promise<{ pashto?: string; roman?: string }> {
  if (!supabase) return {}
  const q = input.trim()
  if (!q) return {}
  try {
    // Try romanized_dictionary first
    let { data, error } = await supabase
      .from('romanized_dictionary')
      .select('pashto, romanized')
      .ilike('romanized', `%${q}%`)
      .limit(1)
    if (!error && Array.isArray(data) && data[0]) {
      return { pashto: String(data[0].pashto || ''), roman: String(data[0].romanized || '') }
    }
    // Fallback: dictionary table with romanized column
    ;({ data, error } = await supabase
      .from('dictionary')
      .select('pashto, romanized')
      .ilike('romanized', `%${q}%`)
      .limit(1))
    if (!error && Array.isArray(data) && data[0]) {
      return { pashto: String(data[0].pashto || ''), roman: String(data[0].romanized || '') }
    }
  } catch (_) {}
  return {}
}

async function expandRelatedForms(supabase: any, norm: string): Promise<{ root?: string; forms: string[] }> {
  if (!supabase || !norm) return { forms: [] }
  try {
    // 1) find root for form
    let root = norm
    {
      const { data } = await supabase
        .from('form_to_root_map')
        .select('root')
        .eq('form', norm)
        .limit(1)
      if (Array.isArray(data) && data[0]?.root) root = String(data[0].root)
    }
    const forms = new Set<string>()
    // 2) forms via mapping
    {
      const { data } = await supabase
        .from('form_to_root_map')
        .select('form')
        .eq('root', root)
        .limit(2000)
      if (Array.isArray(data)) data.forEach((r: any) => { if (r?.form) forms.add(String(r.form)) })
    }
    // 3) inflections if needed
    if (forms.size === 0) {
      const { data } = await supabase
        .from('inflections')
        .select('inflected_form')
        .eq('base_word', root)
        .limit(2000)
      if (Array.isArray(data)) data.forEach((r: any) => { if (r?.inflected_form) forms.add(String(r.inflected_form)) })
    }
    return { root, forms: Array.from(forms) }
  } catch (_) {
    return { forms: [] }
  }
}

export const handler = async (req: Request): Promise<Response> => {
  try {
    const payload = (await req.json().catch(() => ({}))) as Payload
    const raw = (payload.formPs || '').toString()
    if (!raw.trim()) {
      return new Response(JSON.stringify({ normalized: '', variants: [] } satisfies Result), { headers: { 'Content-Type': 'application/json' } })
    }

    const supabase = await getSupabaseClient()

    let base = raw
    let romanization: string | undefined
    // If input is Latin, try DB mapping to Pashto
    if (!isPashto(raw)) {
      const m = await fromRomanizedToPashto(supabase, raw)
      if (m.pashto) base = m.pashto
      if (m.roman) romanization = m.roman
    }

    const normalized = normalizePashto(base)
    // Seed variants
    let variants = new Set<string>([normalized])
    yehKafVariants(normalized).forEach((v) => variants.add(v))
    orthoVariants(normalized).forEach((v) => variants.add(v))

    // Optionally expand related forms (root → forms)
    let root: string | undefined
    if (payload.includeRelated) {
      const { root: r, forms } = await expandRelatedForms(supabase, normalized)
      root = r
      forms.forEach((f) => variants.add(normalizePashto(f)))
    }

    // Limit variants to keep payload small
    const out: Result = {
      normalized,
      variants: Array.from(variants).filter(Boolean).slice(0, 500),
      romanization,
      root,
    }
    return new Response(JSON.stringify(out), { headers: { 'Content-Type': 'application/json' } })

  } catch (e) {
    return new Response(JSON.stringify({ error: (e as any)?.message || 'error' }), { status: 500, headers: { 'Content-Type': 'application/json' } })
  }
}

// Deno entrypoint
export default handler
