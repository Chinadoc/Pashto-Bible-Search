# Cloudflare Worker Setup Guide

This directory contains the Cloudflare Worker for Pashto Bible Search, which provides API endpoints for D1 database queries and R2 audio file access.

## Prerequisites

- [Cloudflare Account](https://dash.cloudflare.com/sign-up)
- Wrangler CLI (already installed globally)
- Node.js 18+ (for local development)

## Initial Setup

### 1. Authenticate with Cloudflare

```bash
wrangler login
```

This will open a browser window to authenticate with your Cloudflare account.

### 2. Create D1 Database

```bash
wrangler d1 create pashto-bible-db
```

This will output a database ID. Copy it and update `wrangler.toml`:
```toml
[[d1_databases]]
binding = "DB"
database_name = "pashto-bible-db"
database_id = "YOUR_DATABASE_ID_HERE"  # Replace with actual ID
```

### 3. Create R2 Bucket

```bash
wrangler r2 bucket create pashto-bible-audio
```

### 4. Update Configuration

Edit `../wrangler.toml` in the project root and update:
- `database_id` for D1 bindings
- Verify `bucket_name` matches your R2 bucket

## Development Workflow

### Local Development

Run the worker locally with hot reload:

```bash
cd cloudflare
npm run dev
```

Or from the project root:
```bash
wrangler dev cloudflare/worker-api.ts
```

The worker will be available at `http://localhost:8787`

### Testing API Endpoints

Test locally:
```bash
# Search verses
curl "http://localhost:8787/api/search?q=خدای&translation=afghan2023&limit=10"

# Get chapter
curl "http://localhost:8787/api/chapter?book=Genesis&chapter=1&translation=afghan2023"

# Get verse by reference
curl "http://localhost:8787/api/verse?ref=Genesis%201:1&translation=afghan2023"

# Get verb forms
curl "http://localhost:8787/api/verb-forms?lemma=کول&cap=200"
```

### View Logs

Watch real-time logs from your deployed worker:

```bash
npm run tail
# or
wrangler tail
```

## Deployment

### Deploy to Development

```bash
npm run deploy:development
```

### Deploy to Production

```bash
npm run deploy:production
```

### Deploy to Default Environment

```bash
npm run deploy
```

## D1 Database Operations

### Execute SQL Query

```bash
wrangler d1 execute pashto-bible-db --command "SELECT COUNT(*) FROM verses_afghan2023"
```

### Interactive D1 Console

```bash
npm run d1:console
```

### Import Data into D1

```bash
wrangler d1 execute pashto-bible-db --file=/path/to/schema.sql
```

## R2 Storage Operations

### List Buckets

```bash
npm run r2:list
```

### List Objects in Bucket

```bash
npm run r2:objects
```

### Upload File to R2

```bash
wrangler r2 object put pashto-bible-audio/path/to/file.mp3 --file=/local/path/file.mp3
```

### Download File from R2

```bash
wrangler r2 object get pashto-bible-audio/path/to/file.mp3 --file=/local/destination/file.mp3
```

## Environment Variables

For local development, create `.dev.vars` in the project root:

```bash
cp ../.dev.vars.example ../.dev.vars
```

Edit `.dev.vars` with your local environment variables.

## Project Structure

```
cloudflare/
├── worker-api.ts      # Main worker code with API routes
├── types.ts           # TypeScript type definitions
├── package.json       # NPM scripts for Cloudflare operations
└── README.md          # This file

Root:
├── wrangler.toml      # Cloudflare Worker configuration
└── .dev.vars          # Local environment variables (create from .dev.vars.example)
```

## API Endpoints

The worker provides these endpoints:

- `GET /api/search` - Search verses by text
- `GET /api/chapter` - Get verses by book/chapter
- `GET /api/verse` - Get single verse by reference
- `GET /api/word-occurrences` - Search word occurrences
- `GET /api/form-occurrences` - Get verse references for word form
- `GET /api/verb-forms` - Get verb conjugations from D1
- `GET /api/audio/url/:key` - Get presigned R2 URL for audio
- `GET /api/audio/stream/:key` - Stream audio directly from R2

## Useful Commands

```bash
# Check authentication status
npm run whoami

# View worker settings
wrangler whoami

# List all workers
wrangler deployments list

# Delete a worker
wrangler delete

# Publish worker without deploying
wrangler publish --dry-run
```

## Troubleshooting

### Authentication Issues

```bash
wrangler logout
wrangler login
```

### View Worker Logs

```bash
npm run tail
```

### Test Worker Locally

```bash
npm run dev
# Then test with curl or browser at http://localhost:8787
```

### Check D1 Database Connection

```bash
wrangler d1 execute pashto-bible-db --command "SELECT 1"
```

## Resources

- [Wrangler Documentation](https://developers.cloudflare.com/workers/wrangler/)
- [Workers Documentation](https://developers.cloudflare.com/workers/)
- [D1 Documentation](https://developers.cloudflare.com/d1/)
- [R2 Documentation](https://developers.cloudflare.com/r2/)
- [Workers TypeScript](https://developers.cloudflare.com/workers/languages/typescript/)

## Production Considerations

1. **Environment Separation**: Use separate D1 databases and R2 buckets for dev/staging/production
2. **Secrets Management**: Use `wrangler secret` for sensitive values (not in wrangler.toml)
3. **Rate Limiting**: Implement rate limiting for public APIs
4. **Monitoring**: Set up alerts in Cloudflare dashboard
5. **Backups**: Regularly backup D1 database data
6. **CORS**: Configure CORS headers appropriately for your domains

## Adding Secrets

For sensitive data (API keys, tokens):

```bash
# Set a secret
wrangler secret put SECRET_NAME

# List secrets
wrangler secret list

# Delete a secret
wrangler secret delete SECRET_NAME
```

Access in worker code:
```typescript
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const apiKey = env.SECRET_NAME;
    // ...
  }
}
```
