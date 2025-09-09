"use client";

import React from "react";

export type TabKey = "search" | "lexicon" | "grammar";

interface TabsProps {
  active: TabKey;
  onChange: (k: TabKey) => void;
}

export default function Tabs({ active, onChange }: TabsProps) {
  const btn = (key: TabKey, label: string) => (
    <button
      key={key}
      onClick={() => onChange(key)}
      className={`px-4 py-2 rounded-md text-sm border transition-colors ${
        active === key
          ? "bg-blue-600 text-white border-blue-600"
          : "bg-transparent text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="w-full flex gap-2 items-center">
      {btn("search", "Search")}
      {btn("lexicon", "Lexicon")}
      {btn("grammar", "Grammar")}
    </div>
  );
}













