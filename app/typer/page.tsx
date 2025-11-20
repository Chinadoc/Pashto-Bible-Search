'use client';

import { useState } from 'react';
import PashtoTyper from '@/components/PashtoTyper';
import SearchHeader from '@/components/SearchHeader';

export default function TyperPage() {
    const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');

    return (
        <div className="flex flex-col h-screen">
            <SearchHeader
                query=""
                setQuery={() => { }}
                handleSearch={() => { }}
                handleKeyPress={() => { }}
                isLoading={false}
                activeMainTab="typer"
                activeTranslation="afghan2023"
                setActiveTranslation={() => { }}
                searchLanguage="pashto"
                isEnglishMode={false}
            />

            {/* Mobile/Desktop Preview Toggle */}
            <div className="bg-slate-800 border-b border-slate-700 px-4 py-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <span className="text-slate-400 text-sm">View:</span>
                    <button
                        onClick={() => setViewMode('desktop')}
                        className={`px-3 py-1 rounded text-sm font-medium transition ${viewMode === 'desktop'
                                ? 'bg-blue-600 text-white'
                                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                            }`}
                    >
                        🖥️ Desktop
                    </button>
                    <button
                        onClick={() => setViewMode('mobile')}
                        className={`px-3 py-1 rounded text-sm font-medium transition ${viewMode === 'mobile'
                                ? 'bg-blue-600 text-white'
                                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                            }`}
                    >
                        📱 Mobile (375px)
                    </button>
                </div>
                <span className="text-emerald-400 text-sm font-bold">Matthew 6:9-13</span>
            </div>

            {/* Content with responsive preview */}
            <div className="flex-grow flex justify-center items-start bg-slate-900/50 overflow-auto">
                <div
                    className={`${viewMode === 'mobile'
                            ? 'w-[375px] h-[667px] border-4 border-slate-700 rounded-3xl shadow-2xl'
                            : 'w-full h-full'
                        } bg-slate-900 overflow-hidden`}
                    style={viewMode === 'mobile' ? { transform: 'scale(0.9)' } : {}}
                >
                    <PashtoTyper />
                </div>
            </div>
        </div>
    );
}
