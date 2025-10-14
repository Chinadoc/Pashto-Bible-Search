"use client";

import { useMemo } from "react";
import type { VariantDetailMeta, VariantGroupMeta } from "../types";

interface Props {
  details: VariantDetailMeta[];
  groups: VariantGroupMeta[];
  onSelect?: (form: string) => void;
}

function formatSourceTag(tag: string): string {
  switch (tag) {
    case 'query': return 'Query';
    case 'dictionary': return 'Dictionary';
    case 'romanized-dictionary': return 'Romanized';
    case 'lemma':
    case 'lemma-base': return 'Lemma';
    case 'root-map':
    case 'root-base':
    case 'root': return 'Roots';
    case 'inflection-table': return 'Inflection';
    case 'extra': return 'Extra';
    case 'directional-base': return 'Directional';
    case 'irregular-verb': return 'Irregular';
    case 'feminine-pattern': return 'Pattern';
    default: return tag.replace(/[-_]/g, ' ').replace(/\w/g, (c) => c.toUpperCase());
  }
}

export default function VariantDetailsPanel({ details, groups, onSelect }: Props) {
  const detailMap = useMemo(() => {
    const map = new Map<string, VariantDetailMeta>();
    for (const detail of details) {
      map.set(detail.form, detail);
    }
    return map;
  }, [details]);

  const groupedForms = useMemo(() => {
    return groups.map((group) => ({
      label: group.label,
      items: group.forms
        .map((form) => ({ form, meta: detailMap.get(form) }))
        .filter((entry) => Boolean(entry.meta)),
    })).filter((group) => group.items.length > 0);
  }, [detailMap, groups]);

  const groupedFormSet = useMemo(() => {
    const set = new Set<string>();
    for (const group of groups) {
      for (const form of group.forms) {
        set.add(form);
      }
    }
    return set;
  }, [groups]);

  const otherForms = useMemo(() => {
    return details.filter((detail) => !groupedFormSet.has(detail.form));
  }, [details, groupedFormSet]);

  const handleSelect = (form: string) => {
    if (onSelect) onSelect(form);
  };

  const renderCard = (detail: VariantDetailMeta) => {
    const content = (
      <div className="w-full text-left">
        <div className="flex flex-col gap-1">
          <div className="text-base font-semibold" dir="rtl">{detail.form}</div>
          {detail.romanization && (
            <div className="text-xs text-gray-500 dark:text-gray-400" dir="ltr">
              {detail.romanization}
            </div>
          )}
          {detail.pattern && (
            <div className="text-[11px] text-gray-500 dark:text-gray-400">
              {detail.pattern}
            </div>
          )}
          {detail.note && (
            <div className="text-[11px] font-medium text-amber-600 dark:text-amber-300">{detail.note}</div>
          )}
          {detail.sources && detail.sources.length > 0 && (
            <div className="flex flex-wrap gap-1 text-[10px] uppercase tracking-wide text-gray-400 dark:text-gray-500">
              {Array.from(new Set(detail.sources)).map((source) => (<span key={source}>{formatSourceTag(source)}</span>))}
            </div>
          )}
        </div>
      </div>
    );

    if (!onSelect) {
      return (
        <div
          key={detail.form}
          className="rounded border border-gray-200 dark:border-gray-700 bg-white/5 dark:bg-gray-900/40 px-3 py-2"
        >
          {content}
        </div>
      );
    }

    return (
      <button
        key={detail.form}
        type="button"
        onClick={() => handleSelect(detail.form)}
        className="rounded border border-gray-200 dark:border-gray-700 bg-white/5 dark:bg-gray-900/40 px-3 py-2 text-left transition hover:border-blue-400 hover:bg-blue-50 dark:hover:border-blue-500 dark:hover:bg-blue-500/10"
      >
        {content}
      </button>
    );
  };

  return (
    <div className="mt-3 space-y-4 border border-gray-200 dark:border-gray-700 rounded-md p-3">
      {groupedForms.map((group) => (
        <div key={group.label} className="space-y-2">
          <div className="text-sm font-semibold text-gray-700 dark:text-gray-200">
            {group.label} ({group.items.length})
          </div>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {group.items.map(({ meta }) => meta && renderCard(meta))}
          </div>
        </div>
      ))}

      {otherForms.length > 0 && (
        <div className="space-y-2">
          <div className="text-sm font-semibold text-gray-700 dark:text-gray-200">
            Other ({otherForms.length})
          </div>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {otherForms.map((detail) => renderCard(detail))}
          </div>
        </div>
      )}
    </div>
  );
}
