/**
 * Authentication Handlers for Cloudflare Worker
 * Handles Google OAuth and session management with D1 database
 */

import { Env } from './worker-api';

// Helper to generate random IDs
function generateId(): string {
    return crypto.randomUUID();
}

// Helper to generate session token
function generateSessionToken(): string {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

// Helper to create JSON response with CORS
function jsonResponse(data: any, status: number = 200): Response {
    return new Response(JSON.stringify(data), {
        status,
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            'Access-Control-Allow-Credentials': 'true',
        },
    });
}

/**
 * Exchange Google OAuth code for user info and create session
 * POST /api/auth/callback/google
 */
export async function handleGoogleCallback(request: Request, env: Env): Promise<Response> {
    try {
        const body = await request.json() as { code: string; redirectUri: string };
        const { code, redirectUri } = body;

        if (!code) {
            return jsonResponse({ error: 'Missing authorization code' }, 400);
        }

        // Exchange code for tokens with Google
        const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                code,
                client_id: env.GOOGLE_CLIENT_ID,
                client_secret: env.GOOGLE_CLIENT_SECRET,
                redirect_uri: redirectUri,
                grant_type: 'authorization_code',
            }),
        });

        if (!tokenResponse.ok) {
            const error = await tokenResponse.text();
            console.error('Google token exchange failed:', error);
            return jsonResponse({ error: 'Failed to exchange code for tokens' }, 400);
        }

        const tokens = await tokenResponse.json() as {
            access_token: string;
            id_token: string;
            refresh_token?: string;
            expires_in: number;
        };

        // Get user info from Google
        const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
            headers: { Authorization: `Bearer ${tokens.access_token}` },
        });

        if (!userInfoResponse.ok) {
            return jsonResponse({ error: 'Failed to get user info' }, 400);
        }

        const userInfo = await userInfoResponse.json() as {
            id: string;
            email: string;
            name: string;
            picture: string;
        };

        // Create or update user in D1
        const userId = generateId();
        const now = new Date().toISOString();

        // Check if user exists
        const existingUser = await env.DB.prepare(
            'SELECT id FROM users WHERE email = ?'
        ).bind(userInfo.email).first();

        if (existingUser) {
            // Update existing user
            await env.DB.prepare(
                'UPDATE users SET name = ?, image = ?, emailVerified = ? WHERE email = ?'
            ).bind(userInfo.name, userInfo.picture, now, userInfo.email).run();
        } else {
            // Create new user
            await env.DB.prepare(
                'INSERT INTO users (id, email, name, image, emailVerified) VALUES (?, ?, ?, ?, ?)'
            ).bind(userId, userInfo.email, userInfo.name, userInfo.picture, now).run();
        }

        const finalUserId = existingUser ? existingUser.id as string : userId;

        // Create or update account
        const accountId = generateId();
        await env.DB.prepare(`
      INSERT OR REPLACE INTO accounts (
        id, userId, type, provider, providerAccountId,
        access_token, refresh_token, expires_at, token_type, scope, id_token
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
            accountId,
            finalUserId,
            'oauth',
            'google',
            userInfo.id,
            tokens.access_token,
            tokens.refresh_token || null,
            Math.floor(Date.now() / 1000) + tokens.expires_in,
            'Bearer',
            'openid profile email',
            tokens.id_token
        ).run();

        // Create session
        const sessionToken = generateSessionToken();
        const sessionExpires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

        await env.DB.prepare(
            'INSERT INTO sessions (id, sessionToken, userId, expires) VALUES (?, ?, ?, ?)'
        ).bind(generateId(), sessionToken, finalUserId, sessionExpires.toISOString()).run();

        return jsonResponse({
            success: true,
            sessionToken,
            user: {
                id: finalUserId,
                email: userInfo.email,
                name: userInfo.name,
                image: userInfo.picture,
            },
        });
    } catch (error: any) {
        console.error('Google callback error:', error);
        return jsonResponse({ error: error.message || 'Authentication failed' }, 500);
    }
}

/**
 * Get session by token
 * GET /api/auth/session?token=xxx
 */
export async function handleGetSession(request: Request, env: Env): Promise<Response> {
    try {
        const url = new URL(request.url);
        const sessionToken = url.searchParams.get('token') || request.headers.get('Authorization')?.replace('Bearer ', '');

        if (!sessionToken) {
            return jsonResponse({ session: null });
        }

        // Get session from D1
        const session = await env.DB.prepare(`
      SELECT s.*, u.id as user_id, u.email, u.name, u.image
      FROM sessions s
      JOIN users u ON s.userId = u.id
      WHERE s.sessionToken = ? AND s.expires > ?
    `).bind(sessionToken, new Date().toISOString()).first();

        if (!session) {
            return jsonResponse({ session: null });
        }

        return jsonResponse({
            session: {
                user: {
                    id: session.user_id,
                    email: session.email,
                    name: session.name,
                    image: session.image,
                },
                expires: session.expires,
            },
        });
    } catch (error: any) {
        console.error('Get session error:', error);
        return jsonResponse({ error: error.message }, 500);
    }
}

/**
 * Sign out - delete session
 * POST /api/auth/signout
 */
export async function handleSignOut(request: Request, env: Env): Promise<Response> {
    try {
        const body = await request.json() as { sessionToken: string };
        const { sessionToken } = body;

        if (!sessionToken) {
            return jsonResponse({ error: 'Missing session token' }, 400);
        }

        await env.DB.prepare('DELETE FROM sessions WHERE sessionToken = ?').bind(sessionToken).run();

        return jsonResponse({ success: true });
    } catch (error: any) {
        console.error('Sign out error:', error);
        return jsonResponse({ error: error.message }, 500);
    }
}
