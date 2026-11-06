/**
 * Shared-secret gate for Worker routes that change or delete data.
 */

const ADMIN_POST_ROUTES = new Set([
  '/api/d1/query',
  '/api/r2/upload',
  '/api/r2/delete',
  '/api/video/process',
  '/api/update-audio-urls',
  '/api/import-yousafzai-verses',
  '/api/analyze-inflections',
  '/api/populate-inflection-reasons',
  '/api/validate-verb-forms',
  '/api/index-video-words',
]);

export function isAdminRoute(method: string, path: string): boolean {
  if (method === 'POST') return ADMIN_POST_ROUTES.has(path);
  return method === 'DELETE' && path.startsWith('/api/video/');
}

async function sha256(value: string): Promise<Uint8Array> {
  return new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value)));
}

export async function hasAdminSecret(request: Request, secret: string | undefined): Promise<boolean> {
  const sent = request.headers.get('x-admin-secret');
  if (!secret || !sent) return false;
  const [a, b] = await Promise.all([sha256(sent), sha256(secret)]);
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
  return diff === 0;
}
