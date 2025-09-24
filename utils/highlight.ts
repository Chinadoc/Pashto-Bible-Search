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

// Deduplication utility
export function dedupByRef(list: {ref: string; text: string; testament?: string}[]) {
  const seen = new Set<string>();
  const out: typeof list = [];
  for (const r of list) {
    if (!seen.has(r.ref)) { seen.add(r.ref); out.push(r); }
  }
  return out;
}
