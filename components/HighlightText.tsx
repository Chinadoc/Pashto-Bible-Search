import React from 'react';
import { renderHighlightedText, buildHighlightRegex } from '../utils/highlight';

interface HighlightTextProps {
  text: string;
  tokens: string[];
}

export default function HighlightText({ text, tokens }: HighlightTextProps) {
  const rx = React.useMemo(() => buildHighlightRegex(tokens), [tokens.join("|")]);

  if (!rx) {
    return <span>{text}</span>;
  }

  // Split the text and render with highlights
  const chunks = text.split(rx);
  return (
    <span>
      {chunks.map((c, i) =>
        i % 2 === 1
          ? <mark key={i} className="bg-yellow-400/40 rounded px-0.5">{c}</mark>
          : <span key={i}>{c}</span>
      )}
    </span>
  );
}


