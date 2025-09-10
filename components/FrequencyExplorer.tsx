"use client";

import React, { useMemo, useState } from 'react';
import Pagination from '@mui/material/Pagination';
import { useFrequencyExplorer, type PosFilter } from '../hooks/useFrequencyExplorer';

interface Props { testamentProp?: 'all' | 'nt' | 'ot'; onPickForm?: (form: string) => void }

export default function FrequencyExplorer({ testamentProp, onPickForm }: Props) {
  const [testament, setTestament] = useState<'all' | 'nt' | 'ot'>(testamentProp || 'all');
  const [pos, setPos] = useState<PosFilter>('any');
  const [aggregate, setAggregate] = useState<boolean>(true);
  const [limit, setLimit] = useState<number>(300);
  const [filterText, setFilterText] = useState('');
  const [page, setPage] = useState(1);
  const itemsPerPage = 20;

  const { items, loading, error } = useFrequencyExplorer({ testament, pos, aggregateByRoot: aggregate, limit });

  const filtered = useMemo(() => {
    const needle = filterText.trim();
    if (!needle) return items;
    const n = needle.toLowerCase();
    return items.filter(it => it.form.toLowerCase().includes(n) || (it.root || '').toLowerCase().includes(n));
  }, [items, filterText]);

  const paginated = filtered.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  if (loading) return <div className="p-4 text-center">Loading frequency data...</div>;
  if (error) return <div className="p-4 text-center text-red-500">Error: {error}</div>;

  return (
    <div className="p-4" dir="rtl">
      <h2 className="text-xl font-bold mb-4">تجزیه بسامد کلمات</h2>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Word Frequency Analysis {aggregate ? '(grouped by root)' : ''}
      </p>

      <div className="flex flex-wrap items-center gap-2 mb-4">
        {!testamentProp && (
          <select
            value={testament}
            onChange={(e) => { setTestament(e.target.value as any); setPage(1); }}
            className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800"
          >
            <option value="all">All Testaments</option>
            <option value="ot">Old Testament</option>
            <option value="nt">New Testament</option>
          </select>
        )}
        <select
          value={pos}
          onChange={(e) => { setPos(e.target.value as PosFilter); setPage(1); }}
          className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800"
        >
          <option value="any">Any POS</option>
          <option value="verb">Verbs</option>
          <option value="noun">Nouns</option>
        </select>
        <label className="flex items-center gap-1 text-sm">
          <input type="checkbox" checked={aggregate} onChange={(e) => { setAggregate(e.target.checked); setPage(1); }} /> Group by root
        </label>
        <input
          type="number"
          min={50}
          max={2000}
          step={50}
          value={limit}
          onChange={(e) => { setLimit(Math.max(50, Math.min(2000, Number(e.target.value) || 300))); setPage(1); }}
          className="w-24 p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-sm"
        />
        <input
          type="text"
          value={filterText}
          onChange={(e) => { setFilterText(e.target.value); setPage(1); }}
          placeholder="Filter forms/roots"
          className="flex-1 min-w-[160px] p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-sm"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300 dark:border-gray-600" dir="rtl">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-800">
              <th className="border p-3 text-right font-bold">#</th>
              <th className="border p-3 text-right font-bold">کلمه</th>
              {aggregate && <th className="border p-3 text-right font-bold">ریښه</th>}
              <th className="border p-3 text-right font-bold">تعداد</th>
              <th className="border p-3 text-right font-bold">POS</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((it, index) => (
              <tr
                key={`${it.form}-${it.root || ''}-${index}`}
                className="border hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer"
                onClick={() => onPickForm?.(aggregate ? (it.root || it.form) : it.form)}
              >
                <td className="border p-3 text-center">{(page - 1) * itemsPerPage + index + 1}</td>
                <td className="border p-3 text-right font-medium">{it.form}</td>
                {aggregate && <td className="border p-3 text-right">{it.root || '—'}</td>}
                <td className="border p-3 text-center">{it.frequency.toLocaleString()}</td>
                <td className="border p-3 text-center">{it.pos || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filtered.length > itemsPerPage && (
        <div className="flex justify-center mt-6">
          <Pagination
            count={Math.ceil(filtered.length / itemsPerPage)}
            page={page}
            onChange={(_, value) => setPage(value)}
            color="primary"
            size="medium"
            showFirstButton
            showLastButton
          />
        </div>
      )}

      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">{filtered.length}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Rows</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">{filtered.reduce((s, it) => s + (it.frequency || 0), 0).toLocaleString()}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Total frequency</p>
          </div>
        </div>
      </div>

      {filtered.length === 0 && (
        <div className="text-center text-gray-500 mt-8">No frequency rows for current filters.</div>
      )}
    </div>
  );
}
