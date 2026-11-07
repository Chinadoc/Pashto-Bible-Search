# Deployment Notes

Everything runs on Cloudflare, in account `3ac1a6fafce90adf6b1c8f1280dfc94d`.

| Piece | Config | Deploy |
|---|---|---|
| API Worker `pashtobiblesearch` (D1 `pashto-bible-db`, R2 `pashto-bible-audio`, cron) | `wrangler.toml` | `npx wrangler deploy` |
| Front end Worker `pashto-bible-web` (Next.js through OpenNext, D1 binding) | `wrangler.web.jsonc`, `open-next.config.ts` | `npm run web:deploy` |

`npm run web:build` builds the front end without deploying it. `npm run web:preview` runs it locally. `npm test` runs the tests. `npm run test:e2e` checks the page layout in a browser against the deployed site, or against `BASE_URL` if set. `node e2e/walk.mjs <dir>` screenshots every page at phone and desktop size.

The site is `https://pashto-bible-web.jeremy-samuels17.workers.dev`. `pashto-bible-search.vercel.app` sends every path there with a 308: `vercel.json` keeps that in place when `main` deploys to Vercel.

The API Worker has `preview_urls = false`, so old versions and test uploads can't be reached by their version URL.

The front end's compressed Worker can exceed 3 MiB, which needs the Workers Paid plan.

## Secrets

API Worker: `ELEVENLABS_API_KEY`, `ELEVENLABS_WEBHOOK_SECRET`, `ADMIN_API_SECRET`. Its older `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` and `AUTH_SECRET` are no longer used.

Front end Worker: `AUTH_SECRET`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `ADMIN_API_SECRET` (same value as the API Worker), `VIDEO_ADMIN_EMAILS` (comma-separated emails allowed to submit videos).

Set each with `npx wrangler secret put NAME` (add `--config wrangler.web.jsonc` for the front end).

## Sign-in

NextAuth uses Google with JWT sessions, so it needs no D1 tables. Google's OAuth client must list this redirect URI for each hostname: `https://<host>/api/auth/callback/google`.

## Database changes

Migrations in `migrations/` are additive and applied by hand: `npx wrangler d1 execute pashto-bible-db --remote --file migrations/<file>.sql`. `saved_verses` and `srs_progress` come from `0004_saved_verses.sql`; don't apply the older `0002_auth_and_srs.sql`, whose foreign keys require a `users` table that JWT sessions never fill.

## YouTube

See "YouTube transcription" in `cloudflare/README.md`. New videos are transcribed by ElevenLabs without any download. Audio clips for new videos still need a downloader: `modal/` holds the old one, and a Cloudflare Container is being tested to replace it (see "Media Container" in `cloudflare/README.md`).
