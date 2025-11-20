'use client';

import { useState } from 'react';
import PashtoTyper from '@/components/PashtoTyper';
import Link from 'next/link';

export default function TyperPage() {
    const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');

    return (
        <div className="flex flex-col h-screen">
            {/* Compact header strip - same height as main site header */}
            <div className="bg-slate-800/90 border-b border-slate-700 px-4 py-3 flex items-center justify-between z-20 shadow-md backdrop-blur flex-shrink-0">
                <Link
                    href="/"
                    className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    <span className="text-sm font-medium">Home</span>
                </Link>

                <h1 className="font-bold text-emerald-400 text-lg">Matthew 6:9-13 - Scripture Typer</h1>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setViewMode('desktop')}
                        className={`px-2 py-1 rounded text-xs font-medium transition ${viewMode === 'desktop'
                                ? 'bg-blue-600 text-white'
                                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                            }`}
                    >
                        🖥️
                    </button>
                    <button
                        onClick={() => setViewMode('mobile')}
                        className={`px-2 py-1 rounded text-xs font-medium transition ${viewMode === 'mobile'
                                ? 'bg-blue-600 text-white'
                                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                            }`}
                    >
                        📱
                    </button>
                </div>
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
