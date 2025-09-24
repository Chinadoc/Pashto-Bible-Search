import React from "react";

// Arabic combining marks (remove or make optional)
const AR_DIA = "\u064B-\u065F\u0670\u06D6-\u06ED";

function esc(s: string) { return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }

// Map common Pashto/Arabic alternates to a char class that matches either
function pashtoEquiv(ch: string) {
  switch (ch) {
    case "ی": case "ي": return "[یي]";
    case "ک": case "ك": return "[کك]";
    case "ه": return "(?:ه|هٔ)"; // heh / heh with hamza above
    default: return esc(ch);
  }
}

// Allow optional diacritics after each Arabic-script char
function withOptionalDia(pattern: string) {
  return pattern.replace(/\p{Script=Arabic}/gu, (m) => `${pashtoEquiv(m)}[${AR_DIA}]*`);
}

export function buildHighlightRegex(tokens: string[]) {
  const pashtoOnly = tokens
    .map(t => (t ?? "").trim())
    .filter(Boolean)
    .filter(t => /[\p{Script=Arabic}]/u.test(t)); // only Pashto/Arabic tokens are highlightable in RTL text

  const uniq = Array.from(new Set(pashtoOnly));
  if (!uniq.length) return null;

  const parts = uniq.map(t => withOptionalDia(t.normalize("NFC")));
  return new RegExp(`(${parts.join("|")})`, "giu");
}

export function renderHighlighted(text: string, rx: RegExp) {
  // Note: keep dir="rtl" on parent container
  const pieces = text.split(rx);
  return pieces.map((p, i) =>
    i % 2 === 1
      ? <mark key={i} className="bg-yellow-400/40 rounded px-0.5">{p}</mark>
      : <React.Fragment key={i}>{p}</React.Fragment>
  );
}
