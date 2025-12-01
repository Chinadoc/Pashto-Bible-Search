'use client';

import { useState, useEffect } from 'react';
import PashtoTyper from '@/components/PashtoTyper';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

interface SRSItem {
    verse_ref: string;
    next_review: string;
    interval: number;
    repetitions: number;
}

export default function TyperPage() {
    const { data: session } = useSession();
    const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');
    const [srsItems, setSrsItems] = useState<SRSItem[]>([]);
    const [selectedVerse, setSelectedVerse] = useState<string | null>(null);
    const [verseData, setVerseData] = useState<any>(null);
    const [loadingData, setLoadingData] = useState(false);

    // Fetch SRS items
    useEffect(() => {
        if (session) {
            fetch('/api/srs-progress')
                .then(res => res.ok ? res.json() : { items: [] })
                .then(data => {
                    if (data.items) {
                        // Sort by next_review date
                        const sorted = data.items.sort((a: SRSItem, b: SRSItem) =>
                            new Date(a.next_review).getTime() - new Date(b.next_review).getTime()
                        );
                        setSrsItems(sorted);
                    }
                })
                .catch(console.error);
        }
    }, [session]);

    // Load verse data when selected
    const loadVerse = async (ref: string) => {
        setLoadingData(true);
        setSelectedVerse(ref);
        try {
            const res = await fetch(`/api/typer/verse-data?ref=${encodeURIComponent(ref)}`);
            const data = await res.json();
            if (data.lines) {
                setVerseData(data.lines);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoadingData(false);
        }
    };

    const handleComplete = async (score: number) => {
        if (!selectedVerse || !session) return;

        try {
            await fetch('/api/srs-progress', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ verseRef: selectedVerse, rating: score })
            });

            // Refresh list
            const res = await fetch('/api/srs-progress');
            const data = await res.json();
            if (data.items) {
                const sorted = data.items.sort((a: SRSItem, b: SRSItem) =>
                    new Date(a.next_review).getTime() - new Date(b.next_review).getTime()
                );
                setSrsItems(sorted);
            }
        } catch (e) {
            console.error(e);
        }
    };

    // For mobile preview, we need to show the entire page layout
    const typerPageContent = (
        <>
            {/* Compact header strip - same height as main site header */}
            <div className="bg-slate-800/90 border-b border-slate-700 px-4 py-3 flex items-center justify-between z-20 shadow-md backdrop-blur flex-shrink-0">
                <div className="flex items-center gap-4">
                    <Link
                        href="/"
                        className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        <span className="text-sm font-medium">Home</span>
                    </Link>

                    {/* Verse Selector Dropdown */}
                    {session && srsItems.length > 0 && (
                        <select
                            value={selectedVerse || ''}
                            onChange={(e) => loadVerse(e.target.value)}
                            className="bg-slate-700 text-white text-sm rounded px-2 py-1 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        >
                            <option value="" disabled>Select a verse...</option>
                            {srsItems.map(item => {
                                const due = new Date(item.next_review) <= new Date();
                                return (
                                    <option key={item.verse_ref} value={item.verse_ref}>
                                        {due ? '🔴 ' : '🟢 '}{item.verse_ref}
                                    </option>
                                );
                            })}
                        </select>
                    )}
                </div>

                <h1 className="font-bold text-emerald-400 text-lg hidden sm:block">
                    {selectedVerse || "The Lord's Prayer"}
                </h1>

                {/* Only show view toggle in desktop/testing mode */}
                {viewMode === 'desktop' && (
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setViewMode('desktop')}
                            className="px-2 py-1 rounded text-xs font-medium bg-blue-600 text-white"
                        >
                            🖥️
                        </button>
                        <button
                            onClick={() => setViewMode('mobile')}
                            className="px-2 py-1 rounded text-xs font-medium bg-slate-700 text-slate-300 hover:bg-slate-600 transition"
                        >
                            📱
                        </button>
                    </div>
                )}
                {viewMode === 'mobile' && (
                    <div className="flex items-center gap-2">
                        <button className="p-1 text-slate-400">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                            </svg>
                        </button>
                    </div>
                )}
            </div>

            {/* PashtoTyper component */}
            <div className="flex-grow overflow-hidden relative">
                {loadingData && (
                    <div className="absolute inset-0 bg-slate-900/80 z-50 flex items-center justify-center">
                        <div className="text-emerald-400 animate-pulse">Loading verse data...</div>
                    </div>
                )}
                <PashtoTyper
                    key={selectedVerse || 'default'}
                    data={verseData || undefined}
                    onComplete={handleComplete}
                />
            </div>
        </>
    );

    if (viewMode === 'desktop') {
        return (
            <div className="flex flex-col h-screen">
                {typerPageContent}
            </div>
        );
    }

    // Mobile preview mode - show phone frame with entire page
    return (
        <div className="flex flex-col h-screen">
            {/* Testing controls bar */}
            <div className="bg-slate-800/90 border-b border-slate-700 px-4 py-2 flex items-center justify-between z-20">
                <span className="text-slate-400 text-sm">Mobile Preview (Testing)</span>
                <button
                    onClick={() => setViewMode('desktop')}
                    className="px-3 py-1 rounded text-xs bg-slate-700 text-slate-300 hover:bg-slate-600 transition"
                >
                    Exit Preview
                </button>
            </div>

            {/* Mobile phone frame */}
            <div className="flex-grow flex justify-center items-start bg-slate-900/50 overflow-auto p-4">
                <div className="w-[375px] h-[812px] border-4 border-slate-700 rounded-[3rem] shadow-2xl relative bg-slate-900 overflow-hidden flex flex-col">
                    {/* Entire page content inside phone frame */}
                    {typerPageContent}

                    {/* Simulated virtual keyboard */}
                    <div className="absolute bottom-0 left-0 right-0 bg-slate-700/95 border-t border-slate-600 z-50">
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
                </div>
            </div>
        </div>
    );
}
