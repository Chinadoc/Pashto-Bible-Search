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
Create `.dev.vars` in the repo root to provide any secrets your worker needs (none are required for the default endpoints):
```bash
# example .dev.vars
CLOUDFLARE_ACCOUNT_ID=...
CLOUDFLARE_API_TOKEN=...
```

## Run the worker locally
```bash
# start the worker against D1 + R2
wrangler dev --local --test-scheduled
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
