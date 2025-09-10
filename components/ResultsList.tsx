"use client";

import { useState } from 'react';
import Pagination from '@mui/material/Pagination';
import type { Verse, AudioMap } from '../types';
import { audioUrlFromRef } from '../utils/audio';

interface Props {
  results: Verse[];
  audioMap: AudioMap;
  loading: boolean;
}

export default function ResultsList({ results, audioMap, loading }: Props) {
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;
  if (results.length === 0) return <p className="text-center text-gray-500">No results found.</p>;

  const paginatedResults = results.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const handlePageChange = (_: any, value: number) => {
    setPage(value);
    // Scroll to top of results on page change
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div>
      <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
        Showing {paginatedResults.length} of {results.length} results
      </div>

      {paginatedResults.map((verse, index) => {
        const globalIndex = (page - 1) * itemsPerPage + index;
        const direct = audioMap[verse.ref];
        const audioUrl = direct || audioUrlFromRef(verse.ref, audioMap);

        return (
          <div key={verse.ref} className="p-4 mb-2 border rounded-md dark:bg-gray-800 dark:border-gray-600" dir="rtl">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-medium text-blue-600 dark:text-blue-400">{verse.ref}</h3>
              {audioUrl && (
                <button
                  onClick={() => new Audio(audioUrl).play()}
                  className="text-sm px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                  title="Play Audio"
                >
                  🔊
                </button>
              )}
            </div>
            <p className="text-gray-800 dark:text-gray-200 leading-relaxed">{verse.text}</p>
          </div>
        );
      })}

      {results.length > itemsPerPage && (
        <div className="flex justify-center mt-6">
          <Pagination
            count={Math.ceil(results.length / itemsPerPage)}
            page={page}
            onChange={handlePageChange}
            color="primary"
            size="medium"
            showFirstButton
            showLastButton
          />
        </div>
      )}
    </div>
  );
}
