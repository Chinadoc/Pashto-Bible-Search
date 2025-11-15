"use client";

import ClientHome from '../ClientHome';
import { Suspense } from 'react';

export const dynamic = 'force-dynamic';

function LexiconContent() {
  return (
    <div className="min-h-screen bg-transparent text-slate-100">
      <div className="search-shell">
        <ClientHome />
      </div>
    </div>
  );
}

export default function LexiconPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-transparent text-slate-100">
        <div className="search-shell">
          <div className="animate-pulse">Loading...</div>
        </div>
      </div>
    }>
      <LexiconContent />
    </Suspense>
  );
}

