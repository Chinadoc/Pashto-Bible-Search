// Arabic combining marks (remove or make optional)
const DIA = "\u064B-\u065F\u0670\u06D6-\u06ED";

function esc(s: string){ return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }

function equiv(ch: string){
  switch (ch) {
    case "ی": case "ي": return "[یي]";
    case "ک": case "ك": return "[کك]";
    case "ه": return "(?:ه|هٔ)"; // heh / heh with hamza above
    default: return esc(ch);
  }
}

// Allow optional diacritics after each Arabic char
function withDia(s: string){
  return s.replace(/\p{Script=Arabic}/gu, (m) => `${equiv(m)}[${DIA}]*`);
}

export function buildHighlightRegex(tokens: string[]){
  const pashto = Array.from(new Set(
    tokens.filter(Boolean).filter(t => /[\p{Script=Arabic}]/u.test(t))
  ));
  if (!pashto.length) return null;
  const parts = pashto.map(t => withDia(t.normalize("NFC")));
  return new RegExp(`(${parts.join("|")})`, "giu");
}

export function renderHighlightedText(text: string, rx: RegExp): string {
  const chunks = text.split(rx);
  return chunks.map((c, i) =>
    i % 2 === 1
      ? `<mark class="bg-yellow-400/40 rounded px-0.5">${c}</mark>`
      : c
  ).join('');
}

// Safe highlighter that returns flat arrays of ReactNodes (no objects, no nested arrays)
import React from "react";

function escapeRx(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function highlightPsText(text: string, needles: string[]): React.ReactNode[] {
  const terms = Array.from(new Set(needles.filter(Boolean).map(s => s.trim()))); // uniq
  if (!terms.length) return [text];

  // longest-first so longer forms win tokenization
  terms.sort((a, b) => b.length - a.length);
  const rx = new RegExp(`(${terms.map(escapeRx).join("|")})`, "gi");

  // Split returns a flat array of strings; matched parts are kept via capturing group
  const parts = text.split(rx);

  const out: React.ReactNode[] = [];
  for (let i = 0; i < parts.length; i++) {
    const chunk = parts[i];
    if (!chunk) continue;
    // If this chunk equals a match for the regex, wrap it
    if (terms.some(t => chunk.toLowerCase() === t.toLowerCase())) {
      out.push(<mark key={`h-${i}`}>{chunk}</mark>);
    } else {
      out.push(<span key={`t-${i}`}>{chunk}</span>);
    }
  }
  return out;
}

// Utility to parse verse reference
export function parseRef(ref: string): { book: string; chapter: number; verse: number } | null {
  if (!ref || typeof ref !== 'string') return null;

  const m = ref.match(/^(.+?)\s+(\d+):(\d+)$/);
  if (!m) return null;

  const book = m[1].trim();
  const chapter = Number(m[2]);
  const verse = Number(m[3]);

  if (!book || Number.isNaN(chapter) || Number.isNaN(verse)) return null;
  return { book, chapter, verse };
}

// Deduplication utility for Verse arrays
export function dedupByRef<T extends {ref: string; text: string; testament?: 'NT' | 'OT'}>(list: T[]): T[] {
  const seen = new Set<string>();
  const out: T[] = [];
  for (const r of list) {
    if (!seen.has(r.ref)) { seen.add(r.ref); out.push(r); }
  }
  return out;
}

// Strip leading verse numbers from verse text to avoid duplication
// Handles both Latin digits (0-9) and Arabic-Indic digits (۰-۹)
export function stripLeadingVerseNumber(text: string): string {
  if (!text || typeof text !== 'string') return text;

  // Match patterns like "4 /", "۱۱ /", "24 /" at the start of text
  // This handles both Latin and Arabic-Indic digits
  const verseNumberPattern = /^\s*([0-9۰-۹]+)\s*[\/:،,\-]\s*/;

  return text.replace(verseNumberPattern, '');
}

// Extract verse number from reference for display in badge
export function extractVerseNumber(ref: string): string {
  if (!ref || typeof ref !== 'string') return '';

  // Extract the last part after the colon (e.g., "13:4" -> "4")
  const parts = ref.split(':');
  if (parts.length >= 2) {
    return parts[parts.length - 1];
  }

  return '';
}

// Clean verse text to remove duplicate verse numbers and other artifacts
export function cleanVerseText(raw: string): string {
  return raw
    .replace(/^\s*\d+\s*/, "")   // leading "4 "
    .replace(/\s*\d+\s*$/, "")   // trailing isolated number if present
    .trim();
}
