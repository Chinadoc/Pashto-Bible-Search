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
