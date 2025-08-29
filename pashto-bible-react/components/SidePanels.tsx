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
}

const SidePanels: React.FC<SidePanelsProps> = ({ coverage, ntFreq, otFreq, allFreq }) => {
  const [activeTab, setActiveTab] = useState<'all' | 'nt' | 'ot'>('all');

  const frequencyData = {
    all: allFreq,
    nt: ntFreq,
    ot: otFreq
  };

  return (
    <div className="md:col-span-1 space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-4 border-b border-gray-700 pb-2">Coverage</h2>
        <div className="space-y-1">
          {coverage.map((item, i) => (
            <div key={i} className="flex justify-between text-gray-400">
              <span>{item.book}</span>
              <span>{item.count}</span>
            </div>
          ))}
        </div>
      </div>
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
    </div>
  );
};

export default SidePanels;