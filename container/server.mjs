// Runs inside the Cloudflare Container. Answers whether YouTube serves this IP.
import { execFile } from 'node:child_process';
import { mkdtemp, readdir, rm, stat } from 'node:fs/promises';
import { createServer } from 'node:http';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const VIDEO_ID = /^[A-Za-z0-9_-]{11}$/;
const TIMEOUT_MS = 10 * 60 * 1000;

async function cloudflareEgress() {
  const res = await fetch('https://www.cloudflare.com/cdn-cgi/trace');
  const fields = Object.fromEntries(
    (await res.text()).trim().split('\n').map((line) => line.split('=')),
  );
  return { ip: fields.ip, colo: fields.colo };
}

function run(bin, args) {
  return new Promise((resolve) => {
    execFile(bin, args, { timeout: TIMEOUT_MS, maxBuffer: 10 * 1024 * 1024 }, (error, stdout, stderr) => {
      resolve({ error, stdout, stderr });
    });
  });
}

async function download(videoId, ytDlp) {
  const dir = await mkdtemp(path.join(tmpdir(), 'audio-'));
  const started = Date.now();
  try {
    const { error, stdout, stderr } = await run(ytDlp, [
      '--no-playlist',
      '--no-cache-dir',
      '--js-runtimes', 'node',
      '-f', 'bestaudio',
      '--paths', dir,
      '-o', 'audio.%(ext)s',
      '--print', 'after_move:%(duration)s %(format_id)s',
      `https://www.youtube.com/watch?v=${videoId}`,
    ]);
    const seconds = Math.round((Date.now() - started) / 1000);
    if (error) {
      return { ok: false, seconds, error: (stderr || error.message).slice(-2000) };
    }
    const [file] = await readdir(dir);
    const { size } = await stat(path.join(dir, file));
    const [duration, formatId] = stdout.trim().split(' ');
    return { ok: true, seconds, bytes: size, durationSeconds: Number(duration), formatId };
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
}

function send(res, status, body) {
  res.writeHead(status, { 'content-type': 'application/json' });
  res.end(JSON.stringify(body));
}

async function readJson(req) {
  let text = '';
  for await (const chunk of req) text += chunk;
  try {
    return JSON.parse(text);
  } catch {
    return {};
  }
}

export function createApp({ ytDlp = 'yt-dlp', egress = cloudflareEgress } = {}) {
  return createServer(async (req, res) => {
    if (req.method !== 'POST' || req.url !== '/download') {
      return send(res, 404, { ok: false, error: 'Not found' });
    }
    const { videoId } = await readJson(req);
    if (typeof videoId !== 'string' || !VIDEO_ID.test(videoId)) {
      return send(res, 400, { ok: false, error: 'Bad video id' });
    }
    const [result, from] = await Promise.all([download(videoId, ytDlp), egress().catch(() => null)]);
    send(res, 200, {
      ...result,
      videoId,
      egress: from,
      placement: {
        location: process.env.CLOUDFLARE_LOCATION,
        region: process.env.CLOUDFLARE_REGION,
        country: process.env.CLOUDFLARE_COUNTRY_A2,
        application: process.env.CLOUDFLARE_APPLICATION_ID,
      },
    });
  });
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  createApp().listen(8080);
}
