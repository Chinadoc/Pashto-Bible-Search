/**
 * Async YouTube transcription: ElevenLabs fetches the video itself and posts
 * the result to our webhook. A cron picks up jobs whose webhook never came.
 */

import { Env, errorResponse, extractWordsFromVideoTranscript, extractYouTubeVideoId, getYouTubeMetadata, jsonResponse } from './worker-api';
import { safeEqual } from './admin-auth';
import { InputWord, planClips, toPlannedWords } from './clip-planner';

const ELEVENLABS_STT_URL = 'https://api.elevenlabs.io/v1/speech-to-text';
const SIGNATURE_TOLERANCE_MS = 30 * 60 * 1000;
const STUCK_AFTER_MS = 15 * 60 * 1000;
const GIVE_UP_AFTER_MS = 6 * 60 * 60 * 1000;
const STUCK_BATCH = 20;
const SUBMISSIONS_PER_DAY = 5;
const MAX_VIDEO_SECONDS = 60 * 60;
const DEFAULT_HOURS_PER_MONTH = 10;
const METADATA_ATTEMPTS = 3;

interface Transcription {
  text?: string;
  language_code?: string;
  transcription_id?: string;
  words?: InputWord[];
}

export async function verifyElevenLabsSignature(rawBody: string, header: string | null, secret: string | undefined): Promise<boolean> {
  if (!header || !secret) return false;
  const parts = header.split(',');
  const timestamp = parts.find(p => p.startsWith('t='))?.slice(2);
  const signature = parts.find(p => p.startsWith('v0='));
  if (!timestamp || !signature) return false;
  if (Math.abs(Date.now() - Number(timestamp) * 1000) > SIGNATURE_TOLERANCE_MS) return false;

  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const mac = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(`${timestamp}.${rawBody}`));
  const hex = Array.from(new Uint8Array(mac), b => b.toString(16).padStart(2, '0')).join('');
  return safeEqual(signature, `v0=${hex}`);
}

async function markFailed(env: Env, videoId: string, message: string): Promise<void> {
  await env.DB.prepare(`UPDATE videos SET status = 'failed', error_message = ?, updated_at = ? WHERE video_id = ? AND status = 'processing'`)
    .bind(message, new Date().toISOString(), videoId).run();
}

/** Returns false when the video was already completed or does not exist. */
async function saveTranscription(env: Env, videoId: string, result: Transcription): Promise<boolean> {
  const words = result.words || [];
  const segments = planClips(words);
  const text = result.text || '';
  const outcome = await env.DB.prepare(`
    UPDATE videos
    SET transcript_text = ?, segments_json = ?, words_json = ?, duration = ?, language_code = ?,
        status = 'completed', error_message = NULL, updated_at = ?
    WHERE video_id = ? AND status IN ('processing', 'failed')
  `).bind(
    text,
    JSON.stringify(segments),
    JSON.stringify(toPlannedWords(words)),
    segments.length > 0 ? segments[segments.length - 1].end_time : 0,
    result.language_code || 'ps',
    new Date().toISOString(),
    videoId,
  ).run();
  if (outcome.meta.changes === 0) return false;

  try {
    await extractWordsFromVideoTranscript(env, videoId, text);
  } catch (error) {
    console.error(`[transcription] Word indexing failed for ${videoId}:`, error);
  }
  return true;
}

/** POST /api/videos/transcribe */
// YouTube blocks some requests from Cloudflare's IPs and not others, so ask again.
async function readVideoMetadata(videoId: string) {
  let metadata = null;
  for (let attempt = 0; attempt < METADATA_ATTEMPTS && !metadata?.durationSeconds; attempt++) {
    metadata = await getYouTubeMetadata(videoId).catch(() => null);
  }
  return metadata;
}

async function transcriptionBudget(env: Env) {
  const hoursBudget = Number(env.TRANSCRIBE_HOURS_PER_MONTH) || DEFAULT_HOURS_PER_MONTH;
  const used = await env.DB.prepare('SELECT COALESCE(SUM(duration_seconds), 0) AS seconds FROM transcription_jobs WHERE created_at >= ?')
    .bind(`${new Date().toISOString().slice(0, 7)}-01T00:00:00.000Z`).first<{ seconds: number }>();
  const hoursUsed = (used?.seconds ?? 0) / 3600;
  return {
    hoursBudget,
    hoursUsed: Math.ceil(hoursUsed * 10) / 10,
    hoursLeft: Math.max(0, Math.floor((hoursBudget - hoursUsed) * 10) / 10),
  };
}

export async function handleTranscriptionBudget(env: Env): Promise<Response> {
  return jsonResponse(await transcriptionBudget(env));
}

export async function handleStartTranscription(request: Request, env: Env): Promise<Response> {
  const body = await request.json() as { youtubeUrl?: string; userEmail?: string };
  const videoId = body.youtubeUrl ? extractYouTubeVideoId(body.youtubeUrl) : null;
  if (!videoId || !/^[A-Za-z0-9_-]{11}$/.test(videoId)) return errorResponse('Invalid YouTube URL', 400);
  if (!body.userEmail) return errorResponse('Missing user', 400);
  if (!env.ELEVENLABS_API_KEY) return errorResponse('ElevenLabs API key not configured', 500);

  const youtubeUrl = `https://www.youtube.com/watch?v=${videoId}`;
  const now = new Date().toISOString();

  const known = await env.DB.prepare('SELECT status FROM videos WHERE video_id = ?').bind(videoId).first<{ status: string }>();
  if (known && known.status !== 'failed') return jsonResponse({ status: known.status, videoId });

  const today = await env.DB.prepare('SELECT COUNT(*) AS count FROM transcription_jobs WHERE user_email = ? AND created_at >= ?')
    .bind(body.userEmail, `${now.slice(0, 10)}T00:00:00.000Z`).first<{ count: number }>();
  if ((today?.count ?? 0) >= SUBMISSIONS_PER_DAY) {
    return errorResponse(`You have used all ${SUBMISSIONS_PER_DAY} submissions for today. Try again tomorrow.`, 429);
  }

  const metadata = await readVideoMetadata(videoId);
  const seconds = metadata?.durationSeconds;
  if (!seconds) return errorResponse("YouTube didn't give this video's length, so it wasn't sent. Try again later.", 422);
  if (seconds > MAX_VIDEO_SECONDS) {
    return errorResponse(`This video is ${Math.ceil(seconds / 60)} minutes long. The limit is ${MAX_VIDEO_SECONDS / 60} minutes.`, 400);
  }

  const budget = await transcriptionBudget(env);
  if (seconds / 3600 > budget.hoursLeft) {
    return errorResponse(`This video needs ${Math.ceil(seconds / 360) / 10} hours, but only ${budget.hoursLeft} of ${budget.hoursBudget} hours are left this month.`, 429);
  }

  // Claim the video first: two clicks can't pay twice, and a fast webhook finds its row.
  const claim = await env.DB.prepare(`
    INSERT INTO videos (video_id, youtube_url, title, transcript_text, segments_json, words_json, status, created_at, updated_at)
    VALUES (?, ?, ?, '', '[]', '[]', 'processing', ?, ?)
    ON CONFLICT(video_id) DO UPDATE SET status = 'processing', error_message = NULL, updated_at = excluded.updated_at
    WHERE videos.status = 'failed'
  `).bind(videoId, youtubeUrl, `Video ${videoId}`, now, now).run();

  if (claim.meta.changes === 0) {
    const existing = await env.DB.prepare('SELECT status FROM videos WHERE video_id = ?').bind(videoId).first<{ status: string }>();
    return jsonResponse({ status: existing?.status, videoId });
  }

  if (metadata?.title) {
    await env.DB.prepare('UPDATE videos SET title = ?, description = ?, thumbnail_url = ? WHERE video_id = ?')
      .bind(metadata.title, metadata.description || '', metadata.thumbnail || '', videoId).run();
  }

  const form = new FormData();
  form.append('model_id', 'scribe_v2');
  form.append('source_url', youtubeUrl);
  form.append('language_code', 'ps');
  form.append('timestamps_granularity', 'word');
  form.append('webhook', 'true');
  form.append('webhook_metadata', JSON.stringify({ video_id: videoId }));

  const response = await fetch(ELEVENLABS_STT_URL, {
    method: 'POST',
    headers: { 'xi-api-key': env.ELEVENLABS_API_KEY },
    body: form,
  });

  if (!response.ok) {
    const detail = (await response.text()).slice(0, 500);
    await markFailed(env, videoId, `ElevenLabs ${response.status}: ${detail}`);
    return errorResponse(`ElevenLabs refused the job: ${detail}`, 502);
  }

  const accepted = await response.json() as { transcription_id?: string };
  await env.DB.prepare('UPDATE videos SET transcription_id = ? WHERE video_id = ?')
    .bind(accepted.transcription_id || null, videoId).run();
  await env.DB.prepare('INSERT INTO transcription_jobs (video_id, user_email, duration_seconds, created_at) VALUES (?, ?, ?, ?)')
    .bind(videoId, body.userEmail, seconds, now).run();

  return jsonResponse({ status: 'processing', videoId }, 202);
}

/** POST /api/elevenlabs/webhook */
export async function handleElevenLabsWebhook(request: Request, env: Env): Promise<Response> {
  const rawBody = await request.text();
  const valid = await verifyElevenLabsSignature(rawBody, request.headers.get('elevenlabs-signature'), env.ELEVENLABS_WEBHOOK_SECRET);
  if (!valid) return errorResponse('Invalid signature', 401);

  const event = JSON.parse(rawBody);
  const isError = event.type === 'webhook_error';
  const metadata = isError ? event.webhook_metadata : event.data?.webhook_metadata;
  const videoId: string | undefined = metadata?.video_id;
  if (!videoId) return errorResponse('Missing video_id in webhook_metadata', 400);

  const known = await env.DB.prepare('SELECT status FROM videos WHERE video_id = ?').bind(videoId).first();
  if (!known) return errorResponse('Unknown video', 404);

  if (isError) {
    await markFailed(env, videoId, event.error_message || 'ElevenLabs reported an error');
  } else if (event.type === 'speech_to_text_transcription' && event.data?.transcription) {
    await saveTranscription(env, videoId, event.data.transcription);
  }
  return jsonResponse({ received: true });
}

/** Cron: finish jobs whose webhook never arrived. */
export async function recoverStuckTranscriptions(env: Env): Promise<void> {
  const nowMs = Date.now();
  const stuck = await env.DB.prepare(`
    SELECT video_id, transcription_id, updated_at FROM videos
    WHERE status = 'processing' AND updated_at < ?
    ORDER BY updated_at LIMIT ?
  `).bind(new Date(nowMs - STUCK_AFTER_MS).toISOString(), STUCK_BATCH).all<{ video_id: string; transcription_id: string | null; updated_at: string }>();

  for (const job of stuck.results || []) {
    if (job.transcription_id) {
      const response = await fetch(`${ELEVENLABS_STT_URL}/transcripts/${encodeURIComponent(job.transcription_id)}`, {
        headers: { 'xi-api-key': env.ELEVENLABS_API_KEY },
      });
      if (response.ok) {
        await saveTranscription(env, job.video_id, await response.json() as Transcription);
        continue;
      }
    }
    if (nowMs - Date.parse(job.updated_at) > GIVE_UP_AFTER_MS) {
      await markFailed(env, job.video_id, 'No result from ElevenLabs after 6 hours');
    }
  }
}
