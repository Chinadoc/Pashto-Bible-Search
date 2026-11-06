# Cloudflare Environment Setup

This project expects a Cloudflare Worker with D1 + R2 bindings to serve data and audio.
Follow these steps to interact with the Cloudflare data locally or in CI.

## Prerequisites
- Install the Cloudflare CLI: `npm install -g wrangler`
- Ensure you have access to the Cloudflare account that hosts the D1 database and R2 bucket.

## Configure wrangler
1. Copy the example config and fill in your values:
   ```bash
   cp cloudflare/wrangler.example.toml wrangler.toml
   ```
2. Set the bindings in `wrangler.toml`:
   - `account_id`: Your Cloudflare account ID.
   - `name`: Worker name (e.g., `pashto-bible-search`).
   - `route`/`zone_id`: Optional if you deploy behind a zone; otherwise use `workers.dev`.
   - D1 binding `DB`: add your D1 database name and optional preview name.
   - R2 binding `AUDIO_BUCKET`: set the R2 bucket containing verse audio.

## Local secrets and env
Create `.dev.vars` (or copy `cloudflare/.dev.vars.example`) in the repo root to provide any secrets your worker needs:
```bash
cp cloudflare/.dev.vars.example cloudflare/.dev.vars
# then edit cloudflare/.dev.vars with your real values

# required
CLOUDFLARE_ACCOUNT_ID=...
CLOUDFLARE_API_TOKEN=...
R2_ACCESS_KEY_ID=...
R2_SECRET_ACCESS_KEY=...
R2_BUCKET_NAME=pashto-bible-audio

# optional: point the Next.js app at a running worker
NEXT_PUBLIC_CLOUDFLARE_WORKER_URL=http://127.0.0.1:8787
```

> **Never commit `.dev.vars` or `.env.local`**—they contain secrets. The copies in version control are examples only.

## Run the worker locally
```bash
# start the worker against D1 + R2
wrangler dev --local --test-scheduled
```

## Verify R2 access
You can confirm credentials by listing a known audio prefix (replace with your bucket name/prefixes):
```bash
wrangler r2 object list AUDIO_BUCKET --prefix afghan2023/nt | head
```
If you prefer S3 tooling, set the environment variables from `.dev.vars` and run:
```bash
AWS_ACCESS_KEY_ID="$R2_ACCESS_KEY_ID" \
AWS_SECRET_ACCESS_KEY="$R2_SECRET_ACCESS_KEY" \
AWS_ENDPOINT_URL="https://${CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com" \
aws s3 ls s3://$R2_BUCKET_NAME/afghan2023/nt --no-sign-request
```

## Populate D1 from a backup (optional)
If you have a SQLite backup of the D1 database:
```bash
# create a local D1 database and import backup.sql
wrangler d1 create pashto-bible-search --db-path=./.wrangler/state/d1/pashto-bible-search.sqlite
wrangler d1 execute pashto-bible-search --file=backup.sql --local
```

## Point Next.js to the worker
Set `NEXT_PUBLIC_CLOUDFLARE_WORKER_URL` in `.env.local` so the Next.js app calls your running worker:
```bash
NEXT_PUBLIC_CLOUDFLARE_WORKER_URL=http://127.0.0.1:8787
```

With wrangler running, the app and its API routes will resolve Cloudflare-backed data and audio locally.

## Admin-only Worker routes
These routes can change or delete data, so they need the `x-admin-secret` header to match the Worker secret `ADMIN_API_SECRET`. With no secret set they refuse everyone.

`POST /api/d1/query`, `POST /api/r2/upload`, `POST /api/r2/delete`, `DELETE /api/video/:id`, `POST /api/video/process`, `POST /api/update-audio-urls`, `POST /api/import-yousafzai-verses`, `POST /api/analyze-inflections`, `POST /api/populate-inflection-reasons`, `POST /api/validate-verb-forms`, `POST /api/index-video-words`, `POST /api/videos/transcribe`, `POST /api/store-video`, `POST /api/videos`, `POST /api/process-video`, `POST /api/transcribe-audio`, `POST /api/transcribe-r2-audio`.

Scripts that call them read `ADMIN_API_SECRET` from the environment. The value is in the macOS Keychain as `pashto-admin-api-secret`.

## YouTube transcription
1. A signed-in admin submits a URL in the app. The Next route `POST /api/videos/transcribe` checks that the session email is in `VIDEO_ADMIN_EMAILS`, then calls the Worker route of the same name with `x-admin-secret`. Anonymous visitors can't spend ElevenLabs credits.
2. The Worker sends ElevenLabs the YouTube URL (`source_url`, `webhook=true`, `webhook_metadata={video_id}`), saves the video as `processing` and returns 202. A video already `processing` or `completed` is not sent again.
3. ElevenLabs posts the result to `POST /api/elevenlabs/webhook`. The Worker checks the `elevenlabs-signature` header (`t=...,v0=...`, HMAC-SHA256 of `{t}.{raw body}` with the secret `ELEVENLABS_WEBHOOK_SECRET`, 30 minute window), then writes `videos` and the word tables. A repeat delivery changes nothing.
4. The page polls `GET /api/videos/:id` for `status` (`processing`, `completed`, `failed`) and `error`.
5. A cron every 15 minutes fetches jobs still `processing` after 15 minutes from `GET /v1/speech-to-text/transcripts/{id}`, and marks them `failed` after 6 hours.

Apply `migrations/0003_async_transcription.sql` before deploying this code.

