# GitHub Secrets Quick Reference

## Secrets to Add in GitHub

Go to: `Settings → Secrets and variables → Actions → New repository secret`

### Secret 1: CLOUDFLARE_API_TOKEN
**Value**: Create at https://dash.cloudflare.com/profile/api-tokens
- Use "Edit Cloudflare Workers" template
- Or custom: Account → Cloudflare D1 → Edit

### Secret 2: CLOUDFLARE_ACCOUNT_ID  
**Value**: `3ac1a6fafce90adf6b1c8f1280dfc94d`
- ✅ Already identified from your account

## R2 Credentials (For Future Use)

These are separate from the workflow and can be used for:
- Storing dictionary backups
- Audio file storage
- Other object storage needs

**Access Key ID**: `bc9f69e4b93a7b359ee22b80e86efba8`  
**Secret Access Key**: `18d423fe4b2372174c18dc9e022041ef5c32c065394fe6a7aad1a6b751cf791d`  
**Endpoint**: `https://3ac1a6fafce90adf6b1c8f1280dfc94d.r2.cloudflarestorage.com`

## Quick Test

After adding secrets, test the workflow:
1. Go to GitHub Actions tab
2. Find "Check Dictionary Updates" workflow
3. Click "Run workflow" (manual trigger)
4. Watch it execute



