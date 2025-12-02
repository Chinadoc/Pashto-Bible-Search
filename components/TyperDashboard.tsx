"use client";

import { useState, useEffect } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';

export interface SRSItem {
    verse_ref: string;
    next_review: string;
    interval: number;
    repetitions: number;
}

interface TyperDashboardProps {
    onSelectVerse: (ref: string) => void;
    srsItems: SRSItem[];
    loading: boolean;
}

export default function TyperDashboard({ onSelectVerse, srsItems, loading }: TyperDashboardProps) {
    const { data: session, status } = useSession();
    const sessionLoading = status === 'loading';

    // Group items by interval
    const groupedItems = srsItems.reduce((acc, item) => {
        let group = 'New / Learning';
        if (item.interval > 30) group = 'Review Monthly';
        else if (item.interval > 7) group = 'Review Every Few Weeks';
        else if (item.interval > 1) group = 'Review Weekly';
        else if (item.interval > 0) group = 'Review Daily';

        if (!acc[group]) acc[group] = [];
        acc[group].push(item);
        return acc;
    }, {} as Record<string, SRSItem[]>);

    // Sort groups order
    const groupOrder = ['New / Learning', 'Review Daily', 'Review Weekly', 'Review Every Few Weeks', 'Review Monthly'];

    // Calculate stats
    const totalVerses = srsItems.length;
    const mastered = srsItems.filter(i => i.interval > 21).length; // Arbitrary threshold for "mastered"
    const dueCount = srsItems.filter(i => new Date(i.next_review) <= new Date()).length;

    if (!session) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8">
                <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-xl max-w-md w-full">
                    <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                        <span className="text-3xl">⌨️</span>
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                        Sign in to Track Progress
                    </h2>
                    <p className="text-slate-600 dark:text-slate-300 mb-8">
                        Save verses, track your memorization progress, and improve your Pashto typing speed.
                    </p>
                    <button
                        onClick={() => signIn('google')}
                        className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z" />
                        </svg>
                        Sign in with Google
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto p-4 md:p-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                        <span className="text-emerald-500">📖</span> My Verses
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">
                        Manage and review your memorized scriptures
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => signOut()}
                        className="text-sm text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                    >
                        Sign Out
                    </button>
                    <div className="h-8 w-8 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center text-emerald-700 dark:text-emerald-300 font-bold">
                        {session.user?.name?.[0] || 'U'}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Main Content - Verse List */}
                <div className="lg:col-span-3 space-y-8">
                    {loading ? (
                        <div className="text-center py-12">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500 mx-auto"></div>
                            <p className="mt-4 text-slate-500">Loading your verses...</p>
                        </div>
                    ) : totalVerses === 0 ? (
                        <div className="bg-white dark:bg-slate-800 rounded-xl p-8 text-center border-2 border-dashed border-slate-200 dark:border-slate-700">
                            <div className="text-4xl mb-4">📚</div>
                            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">No verses saved yet</h3>
                            <p className="text-slate-500 dark:text-slate-400 mb-6">
                                Go to the Bible Search page to find and save verses to your collection.
                            </p>
                            <a href="/" className="inline-flex items-center px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors">
                                Search Verses
                            </a>
                        </div>
                    ) : (
                        groupOrder.map(group => {
                            const items = groupedItems[group];
                            if (!items || items.length === 0) return null;

                            return (
                                <div key={group} className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                                    <div className="bg-slate-50 dark:bg-slate-800/50 px-6 py-3 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
                                        <h3 className="font-semibold text-slate-700 dark:text-slate-200">{group}</h3>
                                        <span className="text-xs font-medium px-2 py-1 bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-full">
                                            {items.length} verses
                                        </span>
                                    </div>
                                    <div className="divide-y divide-slate-100 dark:divide-slate-700">
                                        {items.map(item => {
                                            const isDue = new Date(item.next_review) <= new Date();
                                            return (
                                                <div key={item.verse_ref} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors flex items-center gap-4 group">
                                                    {/* Status Icon */}
                                                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${isDue
                                                        ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
                                                        : 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
                                                        }`}>
                                                        {isDue ? '!' : '✓'}
                                                    </div>

                                                    {/* Content */}
                                                    <div className="flex-grow min-w-0">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <span className="font-bold text-slate-900 dark:text-white truncate">
                                                                {item.verse_ref}
                                                            </span>
                                                            {isDue && (
                                                                <span className="text-[10px] font-bold uppercase tracking-wider text-red-500 bg-red-50 dark:bg-red-900/20 px-1.5 py-0.5 rounded">
                                                                    Due
                                                                </span>
                                                            )}
                                                        </div>
                                                        {/* Progress Bar */}
                                                        <div className="w-full max-w-xs h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                                                            <div
                                                                className={`h-full rounded-full ${isDue ? 'bg-red-500' : 'bg-green-500'}`}
                                                                style={{ width: `${Math.min(100, (item.repetitions / 10) * 100)}%` }}
                                                            />
                                                        </div>
                                                    </div>

                                                    {/* Action */}
                                                    <button
                                                        onClick={() => onSelectVerse(item.verse_ref)}
                                                        className="px-4 py-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:hover:bg-emerald-900/40 rounded-lg font-medium text-sm transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                                                    >
                                                        Review
                                                    </button>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

                {/* Sidebar - Stats */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                        <h3 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                            <span>📊</span> Your Stats
                        </h3>

                        <div className="space-y-4">
                            <div>
                                <div className="text-sm text-slate-500 dark:text-slate-400 mb-1">Verses Saved</div>
                                <div className="text-2xl font-bold text-slate-900 dark:text-white">{totalVerses}</div>
                            </div>

                            <div>
                                <div className="text-sm text-slate-500 dark:text-slate-400 mb-1">Verses Mastered</div>
                                <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{mastered}</div>
                                <div className="text-xs text-slate-400 mt-1">Interval &gt; 21 days</div>
                            </div>

                            <div>
                                <div className="text-sm text-slate-500 dark:text-slate-400 mb-1">Due for Review</div>
                                <div className="text-2xl font-bold text-red-500">{dueCount}</div>
                            </div>
                        </div>

                        <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-700">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Level</span>
                                <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{Math.floor(totalVerses / 5) + 1}</span>
                            </div>
                            <div className="w-full h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-emerald-500 rounded-full"
                                    style={{ width: `${(totalVerses % 5) * 20}%` }}
                                />
                            </div>
                            <div className="text-xs text-slate-400 mt-1 text-right">
                                {5 - (totalVerses % 5)} verses to next level
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-xl p-4 border border-emerald-100 dark:border-emerald-900/30">
                        <h4 className="font-semibold text-emerald-800 dark:text-emerald-200 mb-2">Quick Review</h4>
                        <p className="text-sm text-emerald-600 dark:text-emerald-400 mb-3">
                            Review all {dueCount} due verses in a session.
                        </p>
                        <button
                            disabled={dueCount === 0}
                            onClick={() => {
                                const firstDue = srsItems.find(i => new Date(i.next_review) <= new Date());
                                if (firstDue) onSelectVerse(firstDue.verse_ref);
                            }}
                            className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium transition-colors"
                        >
                            Start Session
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
