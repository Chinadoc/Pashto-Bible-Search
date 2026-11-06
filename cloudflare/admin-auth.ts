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
  '/api/videos/transcribe',
]);

export function isAdminRoute(method: string, path: string): boolean {
  if (method === 'POST') return ADMIN_POST_ROUTES.has(path);
  return method === 'DELETE' && path.startsWith('/api/video/');
}

async function sha256(value: string): Promise<Uint8Array> {
  return new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value)));
}

export async function safeEqual(a: string, b: string): Promise<boolean> {
  const [x, y] = await Promise.all([sha256(a), sha256(b)]);
  let diff = 0;
  for (let i = 0; i < x.length; i++) diff |= x[i] ^ y[i];
  return diff === 0;
}

export async function hasAdminSecret(request: Request, secret: string | undefined): Promise<boolean> {
  const sent = request.headers.get('x-admin-secret');
  if (!secret || !sent) return false;
  return safeEqual(sent, secret);
}
