'use client';

import Link from 'next/link';

const PAGES = [
    {
        href: '/search',
        title: '🔍 Search',
        description: 'Search the Bible in Pashto with linguistic analysis',
        color: 'from-blue-500 to-cyan-500',
    },
    {
        href: '/topics',
        title: '📚 Topics',
        description: 'Explore Bible topics and themes',
        color: 'from-emerald-500 to-teal-500',
    },
    {
        href: '/chapters',
        title: '📖 Chapters',
        description: 'Browse chapters of the Bible',
        color: 'from-purple-500 to-pink-500',
    },
    {
        href: '/lexicon',
        title: '📚 Lexicon',
        description: 'Explore Pashto word meanings and usage',
        color: 'from-amber-500 to-orange-500',
    },
    {
        href: '/videos',
        title: '🎬 Videos',
        description: 'Watch and search video content',
        color: 'from-red-500 to-rose-500',
    },
    {
        href: '/poems',
        title: '📝 Poems',
        description: 'Browse Pashto poems and literature',
        color: 'from-indigo-500 to-blue-500',
    },
    {
        href: '/typer',
        title: '⌨️ Typer',
        description: 'Practice typing the Lord\'s Prayer in Pashto',
        color: 'from-green-500 to-emerald-500',
    },
];

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
            {/* Hero Section */}
            <div className="container mx-auto px-4 py-16">
                <div className="text-center mb-16">
                    <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
                        Pashto Bible Search
                    </h1>
                    <p className="text-xl md:text-2xl text-slate-300 mb-8">
                        Search the Bible in Pashto with linguistic analysis
                    </p>
                </div>

                {/* Navigation Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                    {PAGES.map((page) => (
                        <Link
                            key={page.href}
                            href={page.href}
                            className="group relative overflow-hidden rounded-2xl bg-slate-800/50 border border-slate-700 hover:border-slate-600 transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                        >
                            <div className={`absolute inset-0 bg-gradient-to-br ${page.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />

                            <div className="relative p-6">
                                <div className="text-4xl mb-3">{page.title.split(' ')[0]}</div>
                                <h2 className="text-2xl font-bold text-white mb-2">
                                    {page.title.split(' ').slice(1).join(' ')}
                                </h2>
                                <p className="text-slate-400 group-hover:text-slate-300 transition-colors">
                                    {page.description}
                                </p>

                                <div className="mt-4 flex items-center text-blue-400 group-hover:text-blue-300 transition-colors">
                                    <span className="text-sm font-medium">Explore</span>
                                    <svg
                                        className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Quick Start Hint */}
                <div className="mt-16 text-center">
                    <p className="text-slate-400 text-sm">
                        Click any card above to get started
                    </p>
                </div>
            </div>
        </div>
    );
}
