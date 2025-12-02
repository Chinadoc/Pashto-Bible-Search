'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { handleOAuthCallback } from '@/app/lib/cloudflare-auth';
import { Suspense } from 'react';

function CallbackContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const code = searchParams.get('code');
        const redirectUri = `${window.location.origin}/auth/callback`;

        if (!code) {
            setError('No authorization code received');
            return;
        }

        handleOAuthCallback(code, redirectUri)
            .then(result => {
                if (result) {
                    // Redirect to typer page after successful login
                    router.push('/typer');
                } else {
                    setError('Authentication failed');
                }
            })
            .catch(err => {
                console.error('Callback error:', err);
                setError('An error occurred during authentication');
            });
    }, [searchParams, router]);

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 text-white">
                <div className="bg-red-900/20 border border-red-500 rounded-lg p-6 max-w-md">
                    <h2 className="text-xl font-bold mb-2">Authentication Error</h2>
                    <p className="text-red-300">{error}</p>
                    <button
                        onClick={() => router.push('/typer')}
                        className="mt-4 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg"
                    >
                        Return to Typer
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 text-white">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mb-4"></div>
            <p className="text-slate-300">Completing sign in...</p>
        </div>
    );
}

export default function AuthCallbackPage() {
    return (
        <Suspense fallback={
            <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 text-white">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
            </div>
        }>
            <CallbackContent />
        </Suspense>
    );
}
