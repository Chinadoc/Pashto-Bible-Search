'use client';

import PashtoTyper from '@/components/PashtoTyper';
import Link from 'next/link';

export default function TyperPage() {
    return (
        <div className="flex flex-col h-screen bg-slate-900">
            {/* Simple header with back button */}
            <div className="bg-slate-800/90 border-b border-slate-700 px-4 py-3 flex items-center gap-4 z-20 shadow-md backdrop-blur">
                <Link
                    href="/"
                    className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    <span className="text-sm font-medium">Back to Home</span>
                </Link>
                <h1 className="font-bold text-emerald-400 text-lg">Matthew 6:9-13</h1>
            </div>
            <PashtoTyper />
        </div>
    );
}
