# GitHub Secrets Setup Guide

## Required Secrets for Dictionary Update Workflow

The `.github/workflows/check-dictionary-updates.yml` workflow needs these secrets:

### 1. CLOUDFLARE_API_TOKEN ⚠️ **NEED TO CREATE**
- **What it is**: Cloudflare API Token with D1 permissions
- **How to create**:
  1. Go to https://dash.cloudflare.com/profile/api-tokens
  2. Click "Create Token"
  3. Use "Edit Cloudflare Workers" template OR create custom token with:
     - Permissions: `Account` → `Cloudflare D1` → `Edit`
     - Account Resources: Include your account (`3ac1a6fafce90adf6b1c8f1280dfc94d`)
  4. Copy the token (starts with something like `abc123...`)
  5. ⚠️ **Save it immediately** - you won't be able to see it again!

### 2. CLOUDFLARE_ACCOUNT_ID ✅ **ALREADY FOUND**
- **What it is**: Your Cloudflare Account ID
- **Value**: `3ac1a6fafce90adf6b1c8f1280dfc94d`
- **Already identified from wrangler config**

### 3. (Optional) R2 Credentials - For Future Use
- **What you provided**: R2 credentials for object storage
  - Access Key ID: `bc9f69e4b93a7b359ee22b80e86efba8`
  - Secret Access Key: `18d423fe4b2372174c18dc9e022041ef5c32c065394fe6a7aad1a6b751cf791d`
  - Endpoint: `https://3ac1a6fafce90adf6b1c8f1280dfc94d.r2.cloudflarestorage.com`
- **Not needed for**: Dictionary update workflow (uses D1, not R2)
- **May be useful for**: Storing backups, audio files, etc.

## Adding Secrets to GitHub

1. Go to your GitHub repository: `https://github.com/[your-username]/pashto-bible-search`
2. Settings → Secrets and variables → Actions
3. Click "New repository secret"
4. Add each secret:
   - **Name**: `CLOUDFLARE_API_TOKEN`
     **Value**: `[your API token from step 1]`
   - **Name**: `CLOUDFLARE_ACCOUNT_ID`
     **Value**: `3ac1a6fafce90adf6b1c8f1280dfc94d`

## Testing Locally

You can test without GitHub Actions:

```bash
# Check if wrangler is configured
wrangler whoami

# Test dictionary update checker
npx tsx scripts/check-dictionary-updates-wrangler.ts --dry-run

# Run actual update check
npx tsx scripts/check-dictionary-updates-wrangler.ts
```

## Quick Setup Checklist

- [ ] Create Cloudflare API Token at https://dash.cloudflare.com/profile/api-tokens
- [ ] Add `CLOUDFLARE_API_TOKEN` secret to GitHub
- [ ] Add `CLOUDFLARE_ACCOUNT_ID` secret to GitHub (value: `3ac1a6fafce90adf6b1c8f1280dfc94d`)
- [ ] Test workflow manually via GitHub Actions UI (workflow_dispatch)

## Note

**R2 vs D1:**
- **R2** (credentials you provided): Object storage - for files, backups, media
- **D1** (what we need): Database - for dictionary entries, queries

The dictionary update workflow uses **D1**, so you need an API token with D1 permissions, not R2 credentials.

However, if you want to store dictionary backups in R2, we can add that functionality separately using the R2 credentials you provided.


