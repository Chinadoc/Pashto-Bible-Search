"use client";

import { useMemo, useState } from "react";
import type { Verse, AudioMap } from "@/types";
import { audioUrlFromRef } from "@/utils/audio";

interface Props {
  results: Verse[];
  query: string;
  audioMap: AudioMap;
}

const MAX_INITIAL = 50;

function highlightNodes(text: string, query: string) {
  if (!query) return [text];
  const parts: Array<string> = [];
  let i = 0;
  while (true) {
    const idx = text.indexOf(query, i);
    if (idx === -1) {
      parts.push(text.slice(i));
      break;
    }
    parts.push(text.slice(i, idx));
    parts.push(query);
    i = idx + query.length;
  }
  const nodes = parts.map((part, idx) =>
    idx % 2 === 1 ? (
      <mark key={idx} className="bg-yellow-200 dark:bg-yellow-700">
        {part}
      </mark>
    ) : (
      <span key={idx}>{part}</span>
    )
  );
  return nodes;
}

export default function ResultsList({ results, query, audioMap }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [initial, rest] = useMemo(() => {
    const first = results.slice(0, MAX_INITIAL);
    const remaining = results.slice(MAX_INITIAL);
    return [first, remaining] as const;
  }, [results]);

  const total = results.length;

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="text-sm text-gray-600 dark:text-gray-300">{total} results</div>
      {(expanded ? results : initial).map((v) => {
        const url = audioUrlFromRef(v.ref, audioMap);
        return (
          <div key={v.ref + v.text.slice(0, 20)} className="w-full rounded-lg border border-gray-200 dark:border-gray-700 p-3">
            <div className="font-semibold mb-2">{v.ref}</div>
            <div className="text-right leading-7">{highlightNodes(v.text, query)}</div>
            {url ? (
              <div className="mt-2">
                <audio controls src={url} className="w-full" />
              </div>
            ) : null}
          </div>
        );
      })}
      {!expanded && rest.length > 0 ? (
        <button
          onClick={() => setExpanded(true)}
          className="self-center rounded-md border border-gray-300 dark:border-gray-700 px-3 py-1 text-sm hover:bg-gray-50 dark:hover:bg-gray-800"
        >
          Show {rest.length} more
        </button>
      ) : null}
    </div>
  );
}


