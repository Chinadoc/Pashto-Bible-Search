"use client";

import React, { useState } from 'react';
import { useFrequencyExplorer } from '../hooks/useFrequencyExplorer';
import Pagination from '@mui/material/Pagination';

export default function FrequencyExplorer() {
  const [testament, setTestament] = useState<'all' | 'nt' | 'ot'>('all');
  const [page, setPage] = useState(1);
  const itemsPerPage = 20;

  const { frequencies, loading, error } = useFrequencyExplorer(testament);

  if (loading) {
    return <div className="p-4 text-center">Loading frequency data...</div>;
  }

  if (error) {
    return <div className="p-4 text-center text-red-500">Error: {error}</div>;
  }

  const paginatedFrequencies = frequencies.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  return (
    <div className="p-4" dir="rtl">
      <h2 className="text-xl font-bold mb-4">تجزیه بسامد کلمات</h2>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Word Frequency Analysis - Explore the most common words in the Pashto Bible
      </p>

      {/* Testament Filter */}
      <div className="mb-6">
        <select
          value={testament}
          onChange={(e) => {
            setTestament(e.target.value as 'all' | 'nt' | 'ot');
            setPage(1); // Reset to first page
          }}
          className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800"
        >
          <option value="all">All Testaments</option>
          <option value="ot">Old Testament</option>
          <option value="nt">New Testament</option>
        </select>
      </div>

      {/* Frequency Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300 dark:border-gray-600" dir="rtl">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-800">
              <th className="border p-3 text-right font-bold">#</th>
              <th className="border p-3 text-right font-bold">کلمه</th>
              <th className="border p-3 text-right font-bold">تعداد</th>
              <th className="border p-3 text-right font-bold">رتبه</th>
              <th className="border p-3 text-right font-bold">عهد</th>
            </tr>
          </thead>
          <tbody>
            {paginatedFrequencies.map((freq, index) => (
              <tr
                key={`${freq.pashto_word}-${freq.testament}`}
                className="border hover:bg-gray-50 dark:hover:bg-gray-800/50"
              >
                <td className="border p-3 text-center">
                  {(page - 1) * itemsPerPage + index + 1}
                </td>
                <td className="border p-3 text-right font-medium">
                  {freq.pashto_word}
                </td>
                <td className="border p-3 text-center">
                  {freq.frequency_count.toLocaleString()}
                </td>
                <td className="border p-3 text-center">
                  {freq.frequency_rank}
                </td>
                <td className="border p-3 text-center">
                  {freq.testament === 'ot' ? 'عتیق' : freq.testament === 'nt' ? 'جديد' : 'همه'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {frequencies.length > itemsPerPage && (
        <div className="flex justify-center mt-6">
          <Pagination
            count={Math.ceil(frequencies.length / itemsPerPage)}
            page={page}
            onChange={(_, value) => setPage(value)}
            color="primary"
            size="medium"
            showFirstButton
            showLastButton
          />
        </div>
      )}

      {/* Summary Stats */}
      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <h3 className="font-bold text-blue-800 dark:text-blue-200 mb-2">آمار</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">{frequencies.length}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">کل کلمات</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">
              {frequencies.reduce((sum, freq) => sum + freq.frequency_count, 0).toLocaleString()}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">مجموع وقوع</p>
          </div>
          {testament !== 'all' && (
            <>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">
                  {Math.max(...frequencies.map(f => f.frequency_count)).toLocaleString()}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">بیشترین وقوع</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">
                  {frequencies.find(f => f.frequency_rank === 1)?.pashto_word || 'N/A'}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">کلمه پرتکرار</p>
              </div>
            </>
          )}
        </div>
      </div>

      {frequencies.length === 0 && (
        <div className="text-center text-gray-500 mt-8">
          No frequency data found for the selected testament.
        </div>
      )}
    </div>
  );
}
