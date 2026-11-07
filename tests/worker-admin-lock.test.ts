import { describe, expect, it, vi } from 'vitest';
import worker from '../cloudflare/worker-api';

const SECRET = 'test-admin-secret';
const BASE = 'https://worker.test';

const LOCKED: Array<[string, string, unknown]> = [
  ['POST', '/api/d1/query', { sql: 'SELECT 1; DROP TABLE videos' }],
  ['POST', '/api/r2/upload', { key: 'x', data: 'eA==' }],
  ['POST', '/api/r2/delete', { key: 'x' }],
  ['DELETE', '/api/video/abc123', undefined],
  ['POST', '/api/video/process', { youtubeUrl: 'x', videoId: 'y' }],
  ['POST', '/api/update-audio-urls', {}],
  ['POST', '/api/import-yousafzai-verses', { verses: [] }],
  ['POST', '/api/analyze-inflections', {}],
  ['POST', '/api/populate-inflection-reasons', {}],
  ['POST', '/api/validate-verb-forms', {}],
  ['POST', '/api/index-video-words', { video_id: 'y' }],
  ['POST', '/api/videos/transcribe', { youtubeUrl: 'x' }],
  ['POST', '/api/store-video', { video_id: 'y', segments: [] }],
  ['POST', '/api/videos', { video_id: 'y' }],
  ['POST', '/api/process-video', { youtubeUrl: 'x' }],
  ['POST', '/api/transcribe-audio', {}],
  ['POST', '/api/transcribe-r2-audio', { video_id: 'y' }],
];

function fakeEnv(adminSecret: string | undefined = SECRET) {
  const statement = {
    bind: () => statement,
    all: async () => ({ results: [{ ok: 1 }], meta: {} }),
    first: async () => null,
    run: async () => ({ meta: { changes: 0 } }),
  };
  const prepare = vi.fn(() => statement);
  const bucketDelete = vi.fn(async () => undefined);
  const bucketPut = vi.fn(async () => undefined);
  const env = {
    DB: { prepare },
    AUDIO_BUCKET: { get: vi.fn(async () => ({ size: 1 })), put: bucketPut, delete: bucketDelete },
    ADMIN_API_SECRET: adminSecret,
  } as any;
  return { env, prepare, bucketDelete, bucketPut };
}

function call(method: string, path: string, body: unknown, headers: Record<string, string> = {}) {
  return new Request(BASE + path, {
    method,
    headers: { 'Content-Type': 'application/json', ...headers },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
}

describe('admin-only Worker routes', () => {
  it.each(LOCKED)('%s %s refuses a request with no secret and touches nothing', async (method, path, body) => {
    const { env, prepare, bucketDelete, bucketPut } = fakeEnv();
    const res = await worker.fetch(call(method, path, body), env);
    expect(res.status).toBe(401);
    expect(prepare).not.toHaveBeenCalled();
    expect(bucketDelete).not.toHaveBeenCalled();
    expect(bucketPut).not.toHaveBeenCalled();
  });

  it('refuses a wrong secret', async () => {
    const { env, prepare } = fakeEnv();
    const res = await worker.fetch(call('POST', '/api/d1/query', { sql: 'SELECT 1' }, { 'x-admin-secret': 'wrong' }), env);
    expect(res.status).toBe(401);
    expect(prepare).not.toHaveBeenCalled();
  });

  it('fails closed when the Worker has no secret configured', async () => {
    const { env, prepare } = fakeEnv('');
    const res = await worker.fetch(call('POST', '/api/d1/query', { sql: 'SELECT 1' }, { 'x-admin-secret': '' }), env);
    expect(res.status).toBe(401);
    expect(prepare).not.toHaveBeenCalled();
  });

  it('lets the right secret through', async () => {
    const { env, prepare } = fakeEnv();
    const res = await worker.fetch(call('POST', '/api/d1/query', { sql: 'SELECT 1' }, { 'x-admin-secret': SECRET }), env);
    expect(res.status).toBe(200);
    expect(prepare).toHaveBeenCalled();
  });

  it.each([
    ['POST', '/api/auth/callback/google'],
    ['GET', '/api/auth/session'],
    ['POST', '/api/auth/signout'],
  ])('no longer serves the old hand-rolled sign-in at %s %s', async (method, path) => {
    const { env, prepare } = fakeEnv();
    const res = await worker.fetch(new Request(BASE + path, { method, body: method === 'POST' ? '{}' : undefined }), env);
    expect(res.status).toBe(404);
    expect(prepare).not.toHaveBeenCalled();
  });

  it('leaves public read routes open', async () => {
    const { env } = fakeEnv();
    const res = await worker.fetch(call('POST', '/api/search-batch', { queries: [] }), env);
    expect(res.status).not.toBe(401);
  });
});
