import { mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { getPlatformProxy } from 'wrangler';
import { NextRequest } from 'next/server';

const session = vi.hoisted(() => ({ current: null as any }));
const binding = vi.hoisted(() => ({ DB: null as any }));

vi.mock('@/app/lib/auth', () => ({ auth: async () => session.current }));
vi.mock('@opennextjs/cloudflare', () => ({ getCloudflareContext: () => ({ env: binding }) }));

import { GET as videoBudget, POST as transcribe } from '@/app/api/videos/transcribe/route';
import { GET as getSaved, POST as save } from '@/app/api/saved-verses/route';

const post = (path: string, body: unknown) =>
  new NextRequest(`https://site.test${path}`, { method: 'POST', body: JSON.stringify(body) });

describe('POST /api/videos/transcribe (Next)', () => {
  const YT = 'https://www.youtube.com/watch?v=u9sU5l92Th4';
  let upstream: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    process.env.ADMIN_API_SECRET = 'admin-secret';
    process.env.VIDEO_ADMIN_EMAILS = 'owner@example.com, second@example.com';
    upstream = vi.fn(async () => new Response(JSON.stringify({ status: 'processing', videoId: 'u9sU5l92Th4' }), { status: 202 }));
    vi.stubGlobal('fetch', upstream);
  });

  afterEach(() => { vi.unstubAllGlobals(); });

  it('refuses anonymous visitors and spends nothing', async () => {
    session.current = null;
    const res = await transcribe(post('/api/videos/transcribe', { youtubeUrl: YT }));
    expect(res.status).toBe(401);
    expect(upstream).not.toHaveBeenCalled();
  });

  it('refuses a signed-in user who is not on the list', async () => {
    session.current = { user: { id: '1', email: 'someone@example.com' } };
    const res = await transcribe(post('/api/videos/transcribe', { youtubeUrl: YT }));
    expect(res.status).toBe(401);
    expect(upstream).not.toHaveBeenCalled();
  });

  it('refuses everyone when the list is empty', async () => {
    process.env.VIDEO_ADMIN_EMAILS = '';
    session.current = { user: { id: '1', email: '' } };
    expect((await transcribe(post('/api/videos/transcribe', { youtubeUrl: YT }))).status).toBe(401);
  });

  it('forwards an allowed user to the Worker with the admin secret', async () => {
    session.current = { user: { id: '1', email: 'Second@Example.com' } };
    const res = await transcribe(post('/api/videos/transcribe', { youtubeUrl: YT }));
    expect(res.status).toBe(202);
    expect(await res.json()).toMatchObject({ status: 'processing', videoId: 'u9sU5l92Th4' });
    const [url, init] = upstream.mock.calls[0] as [string, RequestInit];
    expect(url).toMatch(/\/api\/videos\/transcribe$/);
    expect((init.headers as Record<string, string>)['x-admin-secret']).toBe('admin-secret');
    expect(JSON.parse(init.body as string)).toEqual({ youtubeUrl: YT, userEmail: 'Second@Example.com' });
  });

  it('ignores an email sent by the browser', async () => {
    session.current = { user: { id: '1', email: 'owner@example.com' } };
    await transcribe(post('/api/videos/transcribe', { youtubeUrl: YT, userEmail: 'someone@example.com' }));
    const [, init] = upstream.mock.calls[0] as [string, RequestInit];
    expect(JSON.parse(init.body as string).userEmail).toBe('owner@example.com');
  });

  it('tells the page who may submit and how many hours are left, without the secret', async () => {
    upstream.mockImplementation(async () => new Response(JSON.stringify({ hoursBudget: 10, hoursUsed: 2.5, hoursLeft: 7.5 })));
    session.current = { user: { id: '1', email: 'owner@example.com' } };
    const res = await videoBudget();
    expect(await res.json()).toEqual({ allowed: true, hoursBudget: 10, hoursLeft: 7.5 });
    const [url, init] = upstream.mock.calls[0] as [string, RequestInit];
    expect(url).toMatch(/\/api\/videos\/transcribe\/budget$/);
    expect((init.headers as Record<string, string>)['x-admin-secret']).toBe('admin-secret');
  });

  it('tells anyone else only that they may not submit', async () => {
    for (const current of [null, { user: { id: '1', email: 'someone@example.com' } }]) {
      session.current = current;
      expect(await (await videoBudget()).json()).toEqual({ allowed: false });
    }
    expect(upstream).not.toHaveBeenCalled();
  });
});

describe('saved verses on the D1 binding', () => {
  let proxy: Awaited<ReturnType<typeof getPlatformProxy>>;

  beforeAll(async () => {
    const dir = mkdtempSync(join(tmpdir(), 'pashto-next-d1-'));
    writeFileSync(join(dir, 'wrangler.toml'), `name = "t"\ncompatibility_date = "2024-10-27"\n[[d1_databases]]\nbinding = "DB"\ndatabase_name = "t"\ndatabase_id = "00000000-0000-0000-0000-000000000000"\n`);
    proxy = await getPlatformProxy({ configPath: join(dir, 'wrangler.toml'), persist: { path: join(dir, 'state') } });
    binding.DB = (proxy.env as any).DB;
    const sql = readFileSync('migrations/0004_saved_verses.sql', 'utf8').split('\n').filter(l => !l.startsWith('--')).join('\n');
    for (const statement of sql.split(/;\s*\n/).map(s => s.trim()).filter(Boolean)) await binding.DB.prepare(statement).run();
  });

  afterAll(async () => { await proxy.dispose(); });

  it('refuses anonymous saves', async () => {
    session.current = null;
    expect((await save(post('/api/saved-verses', { verseRef: 'John 1:1' }))).status).toBe(401);
  });

  it('saves for a JWT user who has no users row, and reads it back', async () => {
    session.current = { user: { id: 'google-123' } };
    expect((await save(post('/api/saved-verses', { verseRef: 'John 1:1' }))).status).toBe(200);
    const row = await binding.DB.prepare('SELECT verse_ref FROM saved_verses WHERE user_id = ?').bind('google-123').first();
    expect(row.verse_ref).toBe('John 1:1');
    const res = await getSaved(new NextRequest('https://site.test/api/saved-verses'));
    expect(res.status).toBe(200);
    expect(JSON.stringify(await res.json())).toContain('John 1:1');
  });
});
