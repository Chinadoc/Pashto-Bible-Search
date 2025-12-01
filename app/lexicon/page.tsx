"use client";

import ClientHome from '../ClientHome';
import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

export const dynamic = 'force-dynamic';

function LexiconContent() {
  const searchParams = useSearchParams();
  const queryFromUrl = searchParams.get('q') || '';
  
  return (
    <div className="min-h-screen bg-transparent text-slate-100">
      <div className="search-shell">
        <ClientHome initialTab="lexicon" />
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
