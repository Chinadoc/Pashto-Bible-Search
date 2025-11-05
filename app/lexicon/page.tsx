"use client";

import ClientHome from '../ClientHome';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

export const dynamic = 'force-dynamic';

function LexiconContent() {
  const searchParams = useSearchParams();
  const q = searchParams?.get('q') || '';

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="container mx-auto px-2 sm:px-4 py-4">
        <ClientHome initialQuery={q} />
      </div>
    </div>
  );
}

export default function LexiconPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <div className="container mx-auto px-2 sm:px-4 py-4">
          <div className="animate-pulse">Loading...</div>
        </div>
      </div>
    }>
      <LexiconContent />
    </Suspense>
  );
}

