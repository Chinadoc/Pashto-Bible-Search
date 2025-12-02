'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import PashtoTyper from '@/components/PashtoTyper';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

import TyperDashboard, { SRSItem } from '@/components/TyperDashboard';

function TyperPageContent() {
    const { data: session } = useSession();
    const searchParams = useSearchParams();
    const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');
    const [srsItems, setSrsItems] = useState<SRSItem[]>([]);
    const [selectedVerse, setSelectedVerse] = useState<string | null>(null);
    const [verseData, setVerseData] = useState<any>(null);
    const [loadingData, setLoadingData] = useState(false);

    // Load verse data - defined before useEffect
    const loadVerse = async (ref: string) => {
        console.log('Loading verse:', ref);
        setLoadingData(true);
        setSelectedVerse(ref);
        try {
            const res = await fetch(`/api/typer/verse-data?ref=${encodeURIComponent(ref)}`);
            const data = await res.json();
            console.log('Verse data response:', data);
            if (data.lines) {
                setVerseData(data.lines);
            } else if (data.error) {
                console.error('Verse data error:', data.error);
            }
        } catch (e) {
            console.error('Failed to load verse:', e);
        } finally {
            setLoadingData(false);
        }
    };

    // Load verse from URL parameter on mount
    useEffect(() => {
        const refFromUrl = searchParams.get('ref');
        console.log('URL ref param:', refFromUrl);
        if (refFromUrl) {
            loadVerse(refFromUrl);
        }
    }, [searchParams]);

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
    const content = (
        <>
            {/* Header */}
            <div className="bg-slate-800/90 border-b border-slate-700 px-4 py-3 flex items-center justify-between z-20 shadow-md backdrop-blur flex-shrink-0 sticky top-0">
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

                    {/* Breadcrumbs */}
                    {selectedVerse && (
                        <div className="flex items-center gap-2 text-sm">
                            <span className="text-slate-500">/</span>
                            <button
                                onClick={() => setSelectedVerse(null)}
                                className="text-slate-300 hover:text-white"
                            >
                                Dashboard
                            </button>
                            <span className="text-slate-500">/</span>
                            <span className="text-emerald-400 font-medium">{selectedVerse}</span>
                        </div>
                    )}
                </div>

                {/* View Toggle (Desktop Only) */}
                {viewMode === 'desktop' && (
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setViewMode('desktop')}
                            className="px-2 py-1 rounded text-xs font-medium bg-blue-600 text-white"
                            title="Desktop View"
                        >
                            🖥️
                        </button>
                        <button
                            onClick={() => setViewMode('mobile')}
                            className="px-2 py-1 rounded text-xs font-medium bg-slate-700 text-slate-300 hover:bg-slate-600 transition"
                            title="Mobile Preview"
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

            {/* Main Content Area */}
            <div className="flex-grow overflow-y-auto bg-slate-50 dark:bg-slate-900">
                {!selectedVerse ? (
                    <TyperDashboard
                        onSelectVerse={loadVerse}
                        srsItems={srsItems}
                        loading={!session && false} // TODO: Add loading state for initial fetch
                    />
                ) : (
                    <div className="h-full flex flex-col relative">
                        {loadingData && (
                            <div className="absolute inset-0 bg-slate-900/80 z-50 flex items-center justify-center">
                                <div className="text-emerald-400 animate-pulse">Loading verse data...</div>
                            </div>
                        )}
                        <PashtoTyper
                            key={selectedVerse}
                            data={verseData || undefined}
                            onComplete={handleComplete}
                            onExit={() => setSelectedVerse(null)}
                        />
                    </div>
                )}
            </div>
        </>
    );

    if (viewMode === 'desktop') {
        return (
            <div className="flex flex-col h-screen bg-slate-50 dark:bg-slate-900">
                {content}
            </div>
        );
    }

    // Mobile preview mode
    return (
        <div className="flex flex-col h-screen bg-slate-950">
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
            <div className="flex-grow flex justify-center items-start overflow-auto p-4">
                <div className="w-[375px] h-[812px] border-4 border-slate-700 rounded-[3rem] shadow-2xl relative bg-slate-900 overflow-hidden flex flex-col">
                    {content}

                    {/* Virtual Keyboard (Only show in Typer mode) */}
                    {selectedVerse && (
                        <div className="absolute bottom-0 left-0 right-0 bg-slate-700/95 border-t border-slate-600 z-50 pointer-events-none opacity-50">
                            {/* Visual placeholder for keyboard area */}
                            <div className="h-[280px] flex items-center justify-center text-slate-400 text-sm">
                                Virtual Keyboard Area
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

// Wrap with Suspense for useSearchParams
export default function TyperPage() {
    return (
        <Suspense fallback={
            <div className="flex flex-col h-screen bg-slate-900 items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
                <p className="mt-4 text-slate-400">Loading Typer...</p>
            </div>
        }>
            <TyperPageContent />
        </Suspense>
    );
}
