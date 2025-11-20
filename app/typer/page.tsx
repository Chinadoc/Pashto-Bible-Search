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
            <div className="flex-grow flex justify-center items-start bg-slate-900/50 overflow-auto p-4">
                <div
                    className={`${viewMode === 'mobile'
                        ? 'w-[375px] h-[812px] border-4 border-slate-700 rounded-[3rem] shadow-2xl relative'
                        : 'w-full h-full'
                        } bg-slate-900 overflow-hidden`}
                >
                    {/* Actual typer content */}
                    <div className="h-full overflow-hidden">
                        <PashtoTyper />
                    </div>

                    {/* Simulated virtual keyboard (only in mobile preview) */}
                    {viewMode === 'mobile' && (
                        <div className="absolute bottom-0 left-0 right-0 bg-slate-700/95 border-t border-slate-600">
                            {/* iOS-style keyboard simulation */}
                            <div className="p-2 space-y-2">
                                {/* Row 1 */}
                                <div className="flex gap-1 justify-center">
                                    {['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'].map(key => (
                                        <div key={key} className="flex-1 bg-slate-200 text-slate-900 rounded py-2 text-center text-sm font-medium shadow">
                                            {key}
                                        </div>
                                    ))}
                                </div>
                                {/* Row 2 */}
                                <div className="flex gap-1 justify-center px-4">
                                    {['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'].map(key => (
                                        <div key={key} className="flex-1 bg-slate-200 text-slate-900 rounded py-2 text-center text-sm font-medium shadow">
                                            {key}
                                        </div>
                                    ))}
                                </div>
                                {/* Row 3 */}
                                <div className="flex gap-1 justify-center">
                                    <div className="w-12 bg-slate-300 text-slate-700 rounded py-2 text-center text-xs font-medium shadow">⇧</div>
                                    {['Z', 'X', 'C', 'V', 'B', 'N', 'M'].map(key => (
                                        <div key={key} className="flex-1 bg-slate-200 text-slate-900 rounded py-2 text-center text-sm font-medium shadow">
                                            {key}
                                        </div>
                                    ))}
                                    <div className="w-12 bg-slate-300 text-slate-700 rounded py-2 text-center text-xs font-medium shadow">⌫</div>
                                </div>
                                {/* Row 4 */}
                                <div className="flex gap-1">
                                    <div className="w-16 bg-slate-300 text-slate-700 rounded py-2 text-center text-xs font-medium shadow">123</div>
                                    <div className="flex-1 bg-slate-200 text-slate-900 rounded py-2 text-center text-sm font-medium shadow">space</div>
                                    <div className="w-16 bg-blue-500 text-white rounded py-2 text-center text-xs font-medium shadow">return</div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
