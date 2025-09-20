// components/SidePanels.tsx
import React, { useState } from 'react';

interface Coverage {
  book: string;
  count: number;
}

interface Frequency {
  pashto: string;
  frequency: number;
}

interface SidePanelsProps {
  coverage: Coverage[];
  ntFreq: Frequency[];
  otFreq: Frequency[];
  allFreq: Frequency[];
  activeMainTab: 'results' | 'frequencies'; // New prop
  selectedBook?: string | null;
  onSelectBook?: (book: string | null) => void;
}

const SidePanels: React.FC<SidePanelsProps> = ({ coverage, ntFreq, otFreq, allFreq, activeMainTab, selectedBook = null, onSelectBook }) => {
  const [activeTab, setActiveTab] = useState<'all' | 'nt' | 'ot'>('all');

  const frequencyData = {
    all: allFreq,
    nt: ntFreq,
    ot: otFreq
  };

  return (
    <div className="space-y-6">
      {activeMainTab === 'results' && coverage.length > 0 && (
        <div>
          <h2 className="text-2xl font-semibold mb-2 border-b border-gray-700 pb-2">Books</h2>
          {onSelectBook && (
            <button
              onClick={() => onSelectBook(null)}
              className="mb-2 text-sm text-blue-300 hover:text-blue-200"
            >
              {selectedBook ? 'Clear book filter' : 'All books'}
            </button>
          )}
          <div className="max-h-[40vh] overflow-y-auto pr-2 space-y-1">
            {coverage.map((item, i) => {
              const isSelected = selectedBook === item.book;
              return (
                <button
                  key={i}
                  onClick={() => onSelectBook && onSelectBook(item.book)}
                  className={`w-full flex justify-between items-center px-2 py-1 rounded ${
                    isSelected ? 'bg-blue-900/40 text-blue-200' : 'text-gray-300 hover:bg-gray-800'
                  }`}
                >
                  <span className="truncate text-left">{item.book}</span>
                  <span className="ml-2 text-gray-400">{item.count}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {activeMainTab === 'frequencies' && (
        <div>
          <h2 className="text-2xl font-semibold mb-4 border-b border-gray-700 pb-2">Frequency</h2>
          <div className="flex gap-2 mb-2">
            <button onClick={() => setActiveTab('all')} className={`p-2 rounded ${activeTab === 'all' ? 'bg-blue-600' : 'bg-gray-700'}`}>All</button>
            <button onClick={() => setActiveTab('nt')} className={`p-2 rounded ${activeTab === 'nt' ? 'bg-blue-600' : 'bg-gray-700'}`}>NT</button>
            <button onClick={() => setActiveTab('ot')} className={`p-2 rounded ${activeTab === 'ot' ? 'bg-blue-600' : 'bg-gray-700'}`}>OT</button>
          </div>
          <div className="max-h-[40vh] overflow-y-auto pr-2">
            {frequencyData[activeTab].map((item, i) => (
              <div key={i} className="flex justify-between text-gray-400">
                <span>{item.pashto}</span>
                <span>{item.frequency}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SidePanels;
