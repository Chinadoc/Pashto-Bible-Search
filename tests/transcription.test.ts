import { mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { createHmac } from 'node:crypto';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { getPlatformProxy } from 'wrangler';
import worker from '../cloudflare/worker-api';

const BASE = 'https://worker.test';
const WEBHOOK_SECRET = 'whsec_test';
const ADMIN = 'admin-secret';
const VIDEO = 'u9sU5l92Th4';
const YT = `https://www.youtube.com/watch?v=${VIDEO}`;

let proxy: Awaited<ReturnType<typeof getPlatformProxy>>;
let db: D1Database;
let env: any;
let youtubeSeconds: string | undefined;
let youtubeBlocks = 0;

function statements(path: string): string[] {
  return readFileSync(path, 'utf8')
    .split('\n').filter(l => !l.trim().startsWith('--')).join('\n')
    .split(/;\s*\n/).map(s => s.trim()).filter(Boolean);
}

beforeAll(async () => {
  const dir = mkdtempSync(join(tmpdir(), 'pashto-d1-'));
  writeFileSync(join(dir, 'wrangler.toml'), `name = "t"\ncompatibility_date = "2024-10-27"\n[[d1_databases]]\nbinding = "DB"\ndatabase_name = "t"\ndatabase_id = "00000000-0000-0000-0000-000000000000"\n`);
  proxy = await getPlatformProxy({ configPath: join(dir, 'wrangler.toml'), persist: { path: join(dir, 'state') } });
  db = (proxy.env as any).DB;
  for (const sql of [...statements('tests/fixtures/live-video-schema.sql'), ...statements('migrations/0003_async_transcription.sql'), ...statements('migrations/0005_transcription_jobs.sql')]) {
    await db.prepare(sql).run();
  }
});

afterAll(async () => { await proxy.dispose(); });

beforeEach(async () => {
  youtubeSeconds = '300';
  youtubeBlocks = 0;
  for (const t of ['videos', 'video_word_mappings', 'word_frequencies', 'transcription_jobs']) await db.prepare(`DELETE FROM ${t}`).run();
  env = {
    DB: db,
    AUDIO_BUCKET: {},
    ADMIN_API_SECRET: ADMIN,
    ELEVENLABS_API_KEY: 'el-key',
    ELEVENLABS_WEBHOOK_SECRET: WEBHOOK_SECRET,
  };
});

afterEach(() => { vi.unstubAllGlobals(); });

function sign(body: string, secret = WEBHOOK_SECRET, at = Math.floor(Date.now() / 1000)) {
  const hash = createHmac('sha256', secret).update(`${at}.${body}`).digest('hex');
  return `t=${at},v0=${hash}`;
}

function webhook(payload: unknown, signature?: string) {
  const body = JSON.stringify(payload);
  return new Request(`${BASE}/api/elevenlabs/webhook`, {
    method: 'POST',
    headers: { 'elevenlabs-signature': signature ?? sign(body) },
    body,
  });
}

const W = (text: string, start: number, end: number) => ({ text, start, end, type: 'word', logprob: -0.1 });
const SPACE = { text: ' ', start: 0, end: 0, type: 'spacing', logprob: 0 };
const completed = (videoId = VIDEO) => ({
  type: 'speech_to_text_transcription',
  data: {
    request_id: 'req-1',
    webhook_metadata: { video_id: videoId },
    transcription: {
      language_code: 'pus', language_probability: 0.9, text: 'سلام دنیا',
      transcription_id: 'tr-1',
      words: [W('سلام', 0, 1), SPACE, W('دنیا', 1.2, 2)],
    },
  },
});
const failure = (videoId = VIDEO) => ({
  type: 'webhook_error', request_id: 'req-1', error_message: 'could not fetch video', webhook_metadata: { video_id: videoId },
});

async function seed(status: string, extra: { transcript?: string; transcriptionId?: string; updatedAt?: string; videoId?: string } = {}) {
  const at = extra.updatedAt ?? new Date().toISOString();
  await db.prepare(`INSERT INTO videos (video_id, youtube_url, title, transcript_text, segments_json, words_json, status, transcription_id, created_at, updated_at) VALUES (?, ?, 'T', ?, '[]', '[]', ?, ?, ?, ?)`)
    .bind(extra.videoId ?? VIDEO, YT, extra.transcript ?? '', status, extra.transcriptionId ?? 'tr-1', at, at).run();
}

const row = (videoId = VIDEO) => db.prepare('SELECT * FROM videos WHERE video_id = ?').bind(videoId).first<any>();
const status = async (videoId = VIDEO) => {
  const res = await worker.fetch(new Request(`${BASE}/api/videos/${videoId}`), env);
  return { code: res.status, body: await res.json() as any };
};

function stubFetch(handler: (url: string, init?: RequestInit) => Response) {
  const calls: Array<{ url: string; init?: RequestInit }> = [];
  vi.stubGlobal('fetch', vi.fn(async (input: any, init?: RequestInit) => {
    const url = String(input?.url ?? input);
    calls.push({ url, init });
    if (url.includes('youtube.com/oembed') || (url.includes('youtube.com') && !url.includes('elevenlabs'))) {
      if (youtubeBlocks-- > 0) return new Response(JSON.stringify({ playabilityStatus: { status: 'LOGIN_REQUIRED' } }), { status: 200 });
      return new Response(JSON.stringify({ videoDetails: { title: 'From YouTube', lengthSeconds: youtubeSeconds } }), { status: 200 });
    }
    return handler(url, init);
  }));
  return calls;
}

const USER = 'owner@example.com';
const start = (body: Record<string, unknown>, headers: Record<string, string> = { 'x-admin-secret': ADMIN }) =>
  worker.fetch(new Request(`${BASE}/api/videos/transcribe`, { method: 'POST', headers: { 'Content-Type': 'application/json', ...headers }, body: JSON.stringify({ userEmail: USER, ...body }) }), env);

describe('POST /api/videos/transcribe', () => {
  it('refuses without the admin secret and spends nothing', async () => {
    const calls = stubFetch(() => new Response('{}'));
    const res = await start({ youtubeUrl: YT }, {});
    expect(res.status).toBe(401);
    expect(calls.filter(c => c.url.includes('elevenlabs'))).toHaveLength(0);
  });

  it('refuses a URL that is not YouTube', async () => {
    const calls = stubFetch(() => new Response('{}'));
    const res = await start({ youtubeUrl: 'https://example.com/a.mp3' });
    expect(res.status).toBe(400);
    expect(calls.filter(c => c.url.includes('elevenlabs'))).toHaveLength(0);
  });

  it('sends the URL to ElevenLabs asynchronously and returns at once as processing', async () => {
    const calls = stubFetch(() => new Response(JSON.stringify({ message: 'ok', request_id: 'r', transcription_id: 'tr-9' }), { status: 200 }));
    const res = await start({ youtubeUrl: YT });
    expect(res.status).toBe(202);
    expect(await res.json()).toMatchObject({ status: 'processing', videoId: VIDEO });

    const el = calls.find(c => c.url === 'https://api.elevenlabs.io/v1/speech-to-text')!;
    const form = el.init!.body as FormData;
    expect(form.get('source_url')).toBe(`https://www.youtube.com/watch?v=${VIDEO}`);
    expect(form.get('webhook')).toBe('true');
    expect(JSON.parse(form.get('webhook_metadata') as string)).toEqual({ video_id: VIDEO });
    expect(form.get('model_id')).toBe('scribe_v2');

    expect(await row()).toMatchObject({ status: 'processing', transcription_id: 'tr-9' });
  });

  it.each(['processing', 'completed'])('does not pay twice for a video already %s', async (state) => {
    await seed(state, { transcript: 'keep me' });
    const calls = stubFetch(() => new Response('{}'));
    const res = await start({ youtubeUrl: YT });
    expect(res.status).toBe(200);
    expect(await res.json()).toMatchObject({ status: state, videoId: VIDEO });
    expect(calls.filter(c => c.url.includes('elevenlabs'))).toHaveLength(0);
    expect((await row()).transcript_text).toBe('keep me');
  });

  it('allows a retry after a failure', async () => {
    await seed('failed');
    stubFetch(() => new Response(JSON.stringify({ message: 'ok', request_id: 'r', transcription_id: 'tr-2' }), { status: 200 }));
    expect((await start({ youtubeUrl: YT })).status).toBe(202);
    expect(await row()).toMatchObject({ status: 'processing', transcription_id: 'tr-2', error_message: null });
  });

  it('records a refusal from ElevenLabs as failed', async () => {
    stubFetch(() => new Response(JSON.stringify({ detail: { code: 'quota_exceeded', message: 'over quota' } }), { status: 401 }));
    const res = await start({ youtubeUrl: YT });
    expect(res.status).toBe(502);
    const saved = await row();
    expect(saved.status).toBe('failed');
    expect(saved.error_message).toContain('quota_exceeded');
  });
});

describe('limits on new transcripts', () => {
  const OTHER_VIDEO = 'XB8_H29rb4k';
  const accepted = () => new Response(JSON.stringify({ transcription_id: 'tr-9' }), { status: 200 });
  const elevenLabsCalls = (calls: Array<{ url: string }>) => calls.filter(c => c.url.includes('elevenlabs'));

  async function job(hours: number, email = 'someone@example.com', at = new Date().toISOString()) {
    await db.prepare('INSERT INTO transcription_jobs (video_id, user_email, duration_seconds, created_at) VALUES (?, ?, ?, ?)')
      .bind('oldvideo000', email, Math.round(hours * 3600), at).run();
  }

  const budget = async () => (await worker.fetch(
    new Request(`${BASE}/api/videos/transcribe/budget`, { headers: { 'x-admin-secret': ADMIN } }), env,
  )).json() as Promise<any>;

  it('refuses a video once the monthly hours are used up, with a plain message', async () => {
    await job(10);
    const calls = stubFetch(accepted);
    const res = await start({ youtubeUrl: YT });
    expect(res.status).toBe(429);
    expect((await res.json() as any).error).toMatch(/hours/);
    expect(elevenLabsCalls(calls)).toHaveLength(0);
    expect((await row())?.status ?? 'none').not.toBe('processing');
  });

  it('refuses a video that would not fit in the hours left', async () => {
    await job(9.9);
    youtubeSeconds = String(30 * 60);
    const calls = stubFetch(accepted);
    expect((await start({ youtubeUrl: YT })).status).toBe(429);
    expect(elevenLabsCalls(calls)).toHaveLength(0);
  });

  it('counts only this calendar month', async () => {
    const lastMonth = new Date(Date.UTC(new Date().getUTCFullYear(), new Date().getUTCMonth(), 1) - 1000).toISOString();
    await job(10, 'someone@example.com', lastMonth);
    const calls = stubFetch(accepted);
    expect((await start({ youtubeUrl: YT })).status).toBe(202);
    expect(elevenLabsCalls(calls)).toHaveLength(1);
  });

  it('reads the budget from TRANSCRIBE_HOURS_PER_MONTH', async () => {
    env.TRANSCRIBE_HOURS_PER_MONTH = '12';
    await job(10);
    expect(await budget()).toEqual({ hoursBudget: 12, hoursUsed: 10, hoursLeft: 2 });
    const calls = stubFetch(accepted);
    expect((await start({ youtubeUrl: YT })).status).toBe(202);
    expect(elevenLabsCalls(calls)).toHaveLength(1);
  });

  it('reports 10 hours by default, and locks the budget route', async () => {
    await job(2.5);
    expect(await budget()).toEqual({ hoursBudget: 10, hoursUsed: 2.5, hoursLeft: 7.5 });
    const res = await worker.fetch(new Request(`${BASE}/api/videos/transcribe/budget`), env);
    expect(res.status).toBe(401);
  });

  it('refuses a 61-minute video and accepts a 60-minute one', async () => {
    youtubeSeconds = String(61 * 60);
    const calls = stubFetch(accepted);
    const res = await start({ youtubeUrl: YT });
    expect(res.status).toBe(400);
    expect((await res.json() as any).error).toMatch(/61 minutes.*60 minutes/);
    expect(elevenLabsCalls(calls)).toHaveLength(0);

    youtubeSeconds = String(60 * 60);
    expect((await start({ youtubeUrl: YT })).status).toBe(202);
    expect(elevenLabsCalls(calls)).toHaveLength(1);
  });

  it('refuses when YouTube gives no length, rather than risk paying', async () => {
    for (const unknown of [undefined, '0']) {
      youtubeSeconds = unknown;
      const calls = stubFetch(accepted);
      expect((await start({ youtubeUrl: YT })).status).toBe(422);
      expect(elevenLabsCalls(calls)).toHaveLength(0);
    }
  });

  it('asks YouTube again when a request is blocked, because that varies per request', async () => {
    youtubeBlocks = 2;
    const calls = stubFetch(accepted);
    expect((await start({ youtubeUrl: YT })).status).toBe(202);
    expect(elevenLabsCalls(calls)).toHaveLength(1);
    expect((await row()).title).toBe('From YouTube');
  });

  it('stops asking after 3 blocked requests and spends nothing', async () => {
    youtubeBlocks = 3;
    const calls = stubFetch(accepted);
    expect((await start({ youtubeUrl: YT })).status).toBe(422);
    expect(calls.filter(c => c.url.includes('youtube'))).toHaveLength(3);
    expect(elevenLabsCalls(calls)).toHaveLength(0);
  });

  it('gives the existing video for a duplicate, with no call and nothing counted', async () => {
    for (const existing of ['completed', 'processing']) {
      await db.prepare('DELETE FROM videos').run();
      await seed(existing);
      const calls = stubFetch(accepted);
      const res = await start({ youtubeUrl: YT });
      expect(res.status).toBe(200);
      expect(await res.json()).toMatchObject({ status: existing, videoId: VIDEO });
      expect(calls).toHaveLength(0);
    }
    expect((await budget()).hoursUsed).toBe(0);
  });

  it('still gives the existing video when the limits are used up', async () => {
    await job(10, USER);
    for (let i = 0; i < 5; i++) await job(0, USER);
    await seed('completed');
    stubFetch(accepted);
    expect((await start({ youtubeUrl: YT })).status).toBe(200);
  });

  it('allows 5 submissions per user per day, separately for each user', async () => {
    for (let i = 0; i < 5; i++) await job(0.1, USER);
    const calls = stubFetch(accepted);
    const res = await start({ youtubeUrl: YT });
    expect(res.status).toBe(429);
    expect((await res.json() as any).error).toMatch(/5 .*today/);
    expect(elevenLabsCalls(calls)).toHaveLength(0);

    expect((await start({ youtubeUrl: YT, userEmail: 'second@example.com' })).status).toBe(202);
    expect(elevenLabsCalls(calls)).toHaveLength(1);
  });

  it('does not count earlier days', async () => {
    const yesterday = new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString();
    for (let i = 0; i < 5; i++) await job(0.1, USER, yesterday);
    stubFetch(accepted);
    expect((await start({ youtubeUrl: YT })).status).toBe(202);
  });

  it('needs to know who is asking', async () => {
    const calls = stubFetch(accepted);
    expect((await start({ youtubeUrl: YT, userEmail: undefined })).status).toBe(400);
    expect(elevenLabsCalls(calls)).toHaveLength(0);
  });

  it('counts an accepted job with its length and user', async () => {
    youtubeSeconds = String(30 * 60);
    stubFetch(accepted);
    await start({ youtubeUrl: `https://www.youtube.com/watch?v=${OTHER_VIDEO}` });
    expect((await budget()).hoursUsed).toBe(0.5);
    const counted = await db.prepare('SELECT video_id, user_email, duration_seconds FROM transcription_jobs').first();
    expect(counted).toEqual({ video_id: OTHER_VIDEO, user_email: USER, duration_seconds: 1800 });
  });

  it('does not count a job ElevenLabs refuses', async () => {
    stubFetch(() => new Response('{"detail":"nope"}', { status: 401 }));
    expect((await start({ youtubeUrl: YT })).status).toBe(502);
    expect((await budget()).hoursUsed).toBe(0);
  });
});

describe('POST /api/elevenlabs/webhook', () => {
  it('writes the transcript for the video named in the metadata', async () => {
    await seed('processing');
    await seed('processing', { videoId: 'otherVideo1', transcriptionId: 'tr-other' });
    const res = await worker.fetch(webhook(completed()), env);
    expect(res.status).toBe(200);

    const saved = await row();
    expect(saved.status).toBe('completed');
    expect(saved.transcript_text).toBe('سلام دنیا');
    expect(saved.duration).toBe(2);
    expect(saved.language_code).toBe('pus');
    const segments = JSON.parse(saved.segments_json);
    expect(segments).toHaveLength(1);
    expect(segments[0]).toMatchObject({ segment_number: 1, start_time: 0, end_time: 2, text: 'سلام دنیا' });
    expect(JSON.parse(saved.words_json).map((w: any) => w.text)).toEqual(['سلام', 'دنیا']);

    const mapped = await db.prepare('SELECT pashto_word, frequency FROM video_word_mappings WHERE video_id = ? ORDER BY pashto_word').bind(VIDEO).all();
    expect(mapped.results).toHaveLength(2);

    expect((await row('otherVideo1')).status).toBe('processing');
  });

  it('refuses a bad signature and changes nothing', async () => {
    await seed('processing');
    const body = completed();
    const res = await worker.fetch(webhook(body, sign(JSON.stringify(body), 'wrong-secret')), env);
    expect(res.status).toBe(401);
    expect((await row()).status).toBe('processing');
  });

  it('refuses a missing signature', async () => {
    await seed('processing');
    const req = new Request(`${BASE}/api/elevenlabs/webhook`, { method: 'POST', body: JSON.stringify(completed()) });
    expect((await worker.fetch(req, env)).status).toBe(401);
    expect((await row()).status).toBe('processing');
  });

  it('refuses an old signature (replay)', async () => {
    await seed('processing');
    const body = completed();
    const old = Math.floor(Date.now() / 1000) - 31 * 60;
    expect((await worker.fetch(webhook(body, sign(JSON.stringify(body), WEBHOOK_SECRET, old)), env)).status).toBe(401);
  });

  it('fails closed when the signing secret is not set', async () => {
    await seed('processing');
    env.ELEVENLABS_WEBHOOK_SECRET = '';
    const body = completed();
    expect((await worker.fetch(webhook(body, sign(JSON.stringify(body), '')), env)).status).toBe(401);
    expect((await row()).status).toBe('processing');
  });

  it('marks the video failed on an error event', async () => {
    await seed('processing');
    expect((await worker.fetch(webhook(failure()), env)).status).toBe(200);
    expect(await row()).toMatchObject({ status: 'failed', error_message: 'could not fetch video' });
  });

  it('treats a repeat delivery as a no-op', async () => {
    await seed('processing');
    await worker.fetch(webhook(completed()), env);
    const first = await row();
    const counts = await db.prepare('SELECT pashto_word, frequency FROM video_word_mappings ORDER BY pashto_word').all();
    expect((await worker.fetch(webhook(completed()), env)).status).toBe(200);
    expect(await row()).toEqual(first);
    expect((await db.prepare('SELECT pashto_word, frequency FROM video_word_mappings ORDER BY pashto_word').all()).results).toEqual(counts.results);
  });

  it('does not let a late error overwrite a finished transcript', async () => {
    await seed('processing');
    await worker.fetch(webhook(completed()), env);
    expect((await worker.fetch(webhook(failure()), env)).status).toBe(200);
    expect(await row()).toMatchObject({ status: 'completed', transcript_text: 'سلام دنیا' });
  });

  it('creates nothing for a video it does not know', async () => {
    expect((await worker.fetch(webhook(completed('notARealVid1')), env)).status).toBe(404);
    expect(await row('notARealVid1')).toBeNull();
  });

  it('rejects a signed payload with no video id', async () => {
    const payload = completed();
    delete (payload.data as any).webhook_metadata;
    expect((await worker.fetch(webhook(payload), env)).status).toBe(400);
  });
});

describe('GET /api/videos/:id status', () => {
  it('reports processing, completed and failed with the error', async () => {
    await seed('processing');
    expect(await status()).toMatchObject({ code: 200, body: { status: 'processing', segments: [] } });
    await worker.fetch(webhook(completed()), env);
    const done = await status();
    expect(done.body.status).toBe('completed');
    expect(done.body.segments).toHaveLength(1);
    await seed('processing', { videoId: 'otherVideo1' });
    await worker.fetch(webhook(failure('otherVideo1')), env);
    expect(await status('otherVideo1')).toMatchObject({ body: { status: 'failed', error: 'could not fetch video' } });
  });

  it('is 404 for an unknown video', async () => {
    expect((await status('notARealVid1')).code).toBe(404);
  });
});

describe('cron recovery of stuck jobs', () => {
  const ago = (minutes: number) => new Date(Date.now() - minutes * 60_000).toISOString();

  it('fetches a stuck job by transcription id and finishes it', async () => {
    await seed('processing', { updatedAt: ago(20), transcriptionId: 'tr-stuck' });
    const calls = stubFetch(() => new Response(JSON.stringify(completed().data.transcription), { status: 200 }));
    await worker.scheduled({} as any, env);
    expect(calls.some(c => c.url === 'https://api.elevenlabs.io/v1/speech-to-text/transcripts/tr-stuck')).toBe(true);
    expect(await row()).toMatchObject({ status: 'completed', transcript_text: 'سلام دنیا' });
  });

  it('leaves young jobs alone', async () => {
    await seed('processing', { updatedAt: ago(5) });
    const calls = stubFetch(() => new Response('{}'));
    await worker.scheduled({} as any, env);
    expect(calls).toHaveLength(0);
    expect((await row()).status).toBe('processing');
  });

  it('keeps waiting while the transcript is not ready', async () => {
    await seed('processing', { updatedAt: ago(20) });
    stubFetch(() => new Response('{}', { status: 404 }));
    await worker.scheduled({} as any, env);
    expect((await row()).status).toBe('processing');
  });

  it('gives up after 6 hours', async () => {
    await seed('processing', { updatedAt: ago(6 * 60 + 1) });
    stubFetch(() => new Response('{}', { status: 404 }));
    await worker.scheduled({} as any, env);
    const saved = await row();
    expect(saved.status).toBe('failed');
    expect(saved.error_message).toContain('6 hours');
  });

  it('never touches completed videos', async () => {
    await seed('completed', { updatedAt: ago(600), transcript: 'keep me' });
    const calls = stubFetch(() => new Response('{}'));
    await worker.scheduled({} as any, env);
    expect(calls).toHaveLength(0);
    expect((await row()).transcript_text).toBe('keep me');
  });
});
