/**
 * Cloudflare Worker Authentication Client
 * Handles Google OAuth via Cloudflare Worker with D1 database
 */

const WORKER_URL = process.env.NEXT_PUBLIC_CLOUDFLARE_WORKER_URL || 'https://pashtobiblesearch.jeremy-samuels17.workers.dev';

export interface User {
    id: string;
    email: string;
    name: string;
    image: string;
}

export interface Session {
    user: User;
    expires: string;
}

/**
 * Sign in with Google OAuth
 * Redirects to Google OAuth consent screen
 */
export function signInWithGoogle(redirectUrl?: string) {
    const clientId = '509054723959-cifphall1mb53vcvuvf00m54fk3ktm6k.apps.googleusercontent.com';
    const redirect_uri = redirectUrl || `${window.location.origin}/auth/callback`;

    const params = new URLSearchParams({
        client_id: clientId,
        redirect_uri,
        response_type: 'code',
        scope: 'openid profile email',
        access_type: 'offline',
        prompt: 'consent',
    });

    window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}

/**
 * Handle OAuth callback - exchange code for session
 */
export async function handleOAuthCallback(code: string, redirectUri: string): Promise<{ sessionToken: string; user: User } | null> {
    try {
        const response = await fetch(`${WORKER_URL}/api/auth/callback/google`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code, redirectUri }),
        });

        if (!response.ok) {
            const error = await response.json();
            console.error('OAuth callback failed:', error);
            return null;
        }

        const data = await response.json();

        if (data.success && data.sessionToken) {
            // Store session token in localStorage
            localStorage.setItem('sessionToken', data.sessionToken);
            return { sessionToken: data.sessionToken, user: data.user };
        }

        return null;
    } catch (error) {
        console.error('OAuth callback error:', error);
        return null;
    }
}

/**
 * Get current session
 */
export async function getSession(): Promise<Session | null> {
    try {
        const sessionToken = localStorage.getItem('sessionToken');

        if (!sessionToken) {
            return null;
        }

        const response = await fetch(`${WORKER_URL}/api/auth/session?token=${encodeURIComponent(sessionToken)}`);

        if (!response.ok) {
            localStorage.removeItem('sessionToken');
            return null;
        }

        const data = await response.json();

        if (data.session) {
            return data.session;
        }

        return null;
    } catch (error) {
        console.error('Get session error:', error);
        return null;
    }
}

/**
 * Sign out
 */
export async function signOut(): Promise<void> {
    try {
        const sessionToken = localStorage.getItem('sessionToken');

        if (sessionToken) {
            await fetch(`${WORKER_URL}/api/auth/signout`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ sessionToken }),
            });
        }

        localStorage.removeItem('sessionToken');
    } catch (error) {
        console.error('Sign out error:', error);
        localStorage.removeItem('sessionToken');
    }
}

/**
 * React hook for session management
 */
export function useCloudflareAuth() {
    const [session, setSession] = React.useState<Session | null>(null);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        getSession().then(session => {
            setSession(session);
            setLoading(false);
        });
    }, []);

    return {
        session,
        loading,
        signIn: signInWithGoogle,
        signOut: async () => {
            await signOut();
            setSession(null);
        },
    };
}

// For compatibility with existing code
import React from 'react';
