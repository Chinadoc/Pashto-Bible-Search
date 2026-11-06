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
export async function handleStartTranscription(request: Request, env: Env): Promise<Response> {
  const body = await request.json() as { youtubeUrl?: string };
  const videoId = body.youtubeUrl ? extractYouTubeVideoId(body.youtubeUrl) : null;
  if (!videoId || !/^[A-Za-z0-9_-]{11}$/.test(videoId)) return errorResponse('Invalid YouTube URL', 400);
  if (!env.ELEVENLABS_API_KEY) return errorResponse('ElevenLabs API key not configured', 500);

  const youtubeUrl = `https://www.youtube.com/watch?v=${videoId}`;
  const now = new Date().toISOString();

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

  const metadata = await getYouTubeMetadata(videoId).catch(() => null);
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
