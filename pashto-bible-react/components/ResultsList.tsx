// components/ResultsList.tsx
import React, { useState } from 'react';

interface Verse {
  ref: string;
  text: string;
}

interface ResultsListProps {
  results: Verse[];
  loading: boolean;
}

const ResultsList: React.FC<ResultsListProps> = ({ results, loading }) => {
  const [page, setPage] = useState(1);
  const resultsPerPage = 20;
  const paginatedResults = results.slice((page - 1) * resultsPerPage, page * resultsPerPage);

  if (loading) {
    return <div className="text-center">Loading results...</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4 border-b border-gray-700 pb-2">Results ({results.length})</h2>
      <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
        {paginatedResults.map((result, i) => (
          <div key={i} className="bg-gray-800 p-4 rounded-lg border border-gray-700">
            <h3 className="font-bold text-lg text-blue-400">{result.ref}</h3>
            <p className="text-xl leading-relaxed">{result.text}</p>
          </div>
        ))}
      </div>
      {/* Pagination Controls */}
      {results.length > resultsPerPage && (
        <div className="mt-4 flex justify-center gap-2">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="bg-gray-700 p-2 rounded">Previous</button>
          <span>Page {page} of {Math.ceil(results.length / resultsPerPage)}</span>
          <button onClick={() => setPage(p => Math.min(Math.ceil(results.length / resultsPerPage), p + 1))} disabled={page === Math.ceil(results.length / resultsPerPage)} className="bg-gray-700 p-2 rounded">Next</button>
        </div>
      )}
    </div>
  );
};

export default ResultsList;