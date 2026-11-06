import { chmodSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import type { Server } from 'node:http';
import type { AddressInfo } from 'node:net';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
// @ts-expect-error plain JavaScript, it runs as is inside the image
import { createApp } from '../container/server.mjs';
import { handleMediaRequest } from '../cloudflare/media-handler';

const dir = mkdtempSync(path.join(tmpdir(), 'media-container-'));
const argsLog = path.join(dir, 'args.log');
const VIDEO_ID = 'u9sU5l92Th4';
const BLOCKED_ID = 'XB8_H29rb4k';

// Stands in for yt-dlp: writes a 5-byte file, or fails the way YouTube's block does.
const fakeYtDlp = path.join(dir, 'fake-yt-dlp');
writeFileSync(
  fakeYtDlp,
  `#!/bin/sh
echo "$@" >> "${argsLog}"
case "$*" in
  *${BLOCKED_ID}*) echo "ERROR: Sign in to confirm you are not a bot" >&2; exit 1 ;;
esac
while [ $# -gt 0 ]; do
  if [ "$1" = "--paths" ]; then printf 'audio' > "$2/audio.webm"; fi
  shift
done
echo "242 251"
`,
);
chmodSync(fakeYtDlp, 0o755);

let server: Server;
let base: string;

beforeAll(async () => {
  server = createApp({
    ytDlp: fakeYtDlp,
    egress: async () => ({ ip: '203.0.113.9', colo: 'DFW' }),
  });
  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', () => resolve()));
  base = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
});

afterAll(() => {
  server.close();
  rmSync(dir, { recursive: true, force: true });
});

function download(videoId: unknown) {
  return fetch(`${base}/download`, { method: 'POST', body: JSON.stringify({ videoId }) });
}

describe('download server in the container', () => {
  it('reports size, duration and where the download came from', async () => {
    const res = await download(VIDEO_ID);
    expect(res.status).toBe(200);
    expect(await res.json()).toMatchObject({
      ok: true,
      videoId: VIDEO_ID,
      bytes: 5,
      durationSeconds: 242,
      formatId: '251',
      egress: { ip: '203.0.113.9', colo: 'DFW' },
    });
  });

  it('reports the YouTube error instead of hiding it', async () => {
    const res = await download(BLOCKED_ID);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toMatchObject({ ok: false, videoId: BLOCKED_ID, egress: { colo: 'DFW' } });
    expect(body.error).toContain('Sign in to confirm');
  });

  it('never passes a bad video id to yt-dlp', async () => {
    const before = readFileSync(argsLog, 'utf8');
    for (const bad of ['--exec=rm', 'short', 'u9sU5l92Th4; x', VIDEO_ID + 'x', 42, undefined]) {
      expect((await download(bad)).status).toBe(400);
    }
    expect(readFileSync(argsLog, 'utf8')).toBe(before);
  });

  it('uses no cookies or proxy, and asks for that one video only', () => {
    const args = readFileSync(argsLog, 'utf8');
    expect(args).toContain(`https://www.youtube.com/watch?v=${VIDEO_ID}`);
    expect(args).toContain('--no-playlist');
    expect(args).not.toMatch(/cookies|proxy/);
  });

  it('answers 404 for any other route', async () => {
    expect((await fetch(`${base}/other`, { method: 'POST' })).status).toBe(404);
  });
});

describe('media Worker', () => {
  const SECRET = 'test-admin-secret';
  const URL_DOWNLOAD = 'https://media.test/spike/download';

  function post(headers: Record<string, string> = {}, url = URL_DOWNLOAD) {
    return new Request(url, { method: 'POST', headers, body: JSON.stringify({ videoId: VIDEO_ID }) });
  }

  function recordingContainer() {
    const calls: Request[] = [];
    const run = async (request: Request) => {
      calls.push(request);
      return Response.json({ ok: true });
    };
    return { calls, run };
  }

  it('refuses a request without the secret and starts no container', async () => {
    const { calls, run } = recordingContainer();
    expect((await handleMediaRequest(post(), SECRET, run)).status).toBe(401);
    expect((await handleMediaRequest(post({ 'x-admin-secret': 'wrong' }), SECRET, run)).status).toBe(401);
    expect(calls).toHaveLength(0);
  });

  it('stays closed when the secret is not set', async () => {
    const { calls, run } = recordingContainer();
    const res = await handleMediaRequest(post({ 'x-admin-secret': 'anything' }), undefined, run);
    expect(res.status).toBe(401);
    expect(calls).toHaveLength(0);
  });

  it('forwards the body to the container with the right secret', async () => {
    const { calls, run } = recordingContainer();
    const res = await handleMediaRequest(post({ 'x-admin-secret': SECRET }), SECRET, run);
    expect(res.status).toBe(200);
    expect(new URL(calls[0].url).pathname).toBe('/download');
    expect(await calls[0].json()).toEqual({ videoId: VIDEO_ID });
    expect(calls[0].headers.has('x-admin-secret')).toBe(false);
  });

  it('answers 404 for other routes, even with the secret', async () => {
    const { calls, run } = recordingContainer();
    const res = await handleMediaRequest(post({ 'x-admin-secret': SECRET }, 'https://media.test/other'), SECRET, run);
    expect(res.status).toBe(404);
    expect(calls).toHaveLength(0);
  });

  it('says so when the container cannot start', async () => {
    const res = await handleMediaRequest(post({ 'x-admin-secret': SECRET }), SECRET, async () => {
      throw new Error('no capacity');
    });
    expect(res.status).toBe(502);
    expect(await res.json()).toEqual({ ok: false, error: 'no capacity' });
  });
});
