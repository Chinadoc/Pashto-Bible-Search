"use client";

import React, { useMemo, useState } from "react";

type LexItem = {
  form: string;
  rom?: string;
  e?: string; // english gloss
  pos?: string; // part of speech
  count?: number; // usage count
};

interface Props {
  items?: LexItem[]; // placeholder; will be API wired later
  onPickForm?: (form: string) => void;
}

export default function LexiconPanel({ items = [], onPickForm }: Props) {
  const [q, setQ] = useState("");
  const [minCount, setMinCount] = useState(0);
  const [onlyWithRom, setOnlyWithRom] = useState(false);
  const [pos, setPos] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const s = (q || "").trim().toLowerCase();
    return (items || []).filter((it) => {
      if (minCount && (it.count || 0) < minCount) return false;
      if (onlyWithRom && !it.rom) return false;
      if (pos && it.pos !== pos) return false;
      if (!s) return true;
      const hay = `${it.form} ${it.rom || ""} ${it.e || ""}`.toLowerCase();
      return hay.includes(s);
    });
  }, [items, q, minCount, onlyWithRom, pos]);

  return (
    <div className="w-full flex flex-col gap-3">
      <div className="flex flex-col sm:flex-row gap-2 items-stretch">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search lexicon (Pashto/romanization/English)"
          className="flex-1 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2"
        />
        <input
          type="number"
          min={0}
          value={minCount}
          onChange={(e) => setMinCount(parseInt(e.target.value || "0", 10))}
          className="w-28 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2"
          title="Minimum usage count"
        />
        <select
          value={pos || ""}
          onChange={(e) => setPos(e.target.value || null)}
          className="rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2"
          title="Part of speech"
        >
          <option value="">All POS</option>
          <option value="verb">Verb</option>
          <option value="noun">Noun</option>
          <option value="adj">Adjective</option>
          <option value="adv">Adverb</option>
        </select>
        <label className="inline-flex items-center gap-2 text-sm px-2">
          <input type="checkbox" checked={onlyWithRom} onChange={(e) => setOnlyWithRom(e.target.checked)} />
          Romanization only
        </label>
      </div>

      <div className="text-sm text-gray-600 dark:text-gray-400">{filtered.length} items</div>
      <div className="border rounded-md border-gray-200 dark:border-gray-700 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr className="text-left">
              <th className="p-2">Form</th>
              <th className="p-2">Romanization</th>
              <th className="p-2">English</th>
              <th className="p-2">POS</th>
              <th className="p-2">Count</th>
            </tr>
          </thead>
          <tbody>
            {filtered.slice(0, 500).map((it) => (
              <tr key={`${it.form}|${it.rom}`} className="border-t border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/60">
                <td className="p-2">
                  <button className="text-blue-600 hover:underline" onClick={() => onPickForm?.(it.form)}>
                    {it.form}
                  </button>
                </td>
                <td className="p-2 text-gray-700 dark:text-gray-300">{it.rom || ""}</td>
                <td className="p-2 text-gray-700 dark:text-gray-300">{it.e || ""}</td>
                <td className="p-2 text-gray-700 dark:text-gray-300">{it.pos || ""}</td>
                <td className="p-2">{it.count ?? ""}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}













