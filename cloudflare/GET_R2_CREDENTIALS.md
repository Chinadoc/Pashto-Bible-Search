# How to Get R2 S3-Compatible Credentials

## Quick Guide

You're on the right page! Now follow these steps:

### Step 1: Create Account API Token

1. **Click**: "Create Account API token" (blue button on the right side of "Account API Tokens" section)

2. **Fill in the form**:
   - **Token name**: `pashto-bible-r2-s3`
   - **Permissions**: 
     - ✅ Check "Object Read & Write"
   - **Bucket access**:
     - Select "Limit to specific buckets"
     - Choose `pashto-bible-audio`

3. **Click**: "Create API Token"

### Step 2: Copy Your Credentials

**IMPORTANT**: The credentials are shown **only once**!

You'll see:
- **Access Key ID**: (a long string, starts with letters/numbers)
- **Secret Access Key**: (a long string)

**Copy both immediately!**

### Step 3: Add to `.env.local`

Open `.env.local` and add:

```bash
CLOUDFLARE_ACCOUNT_ID=3ac1a6fafce90adf6b1c8f1280dfc94d
CLOUDFLARE_R2_ACCESS_KEY_ID=paste_your_access_key_id_here
CLOUDFLARE_R2_SECRET_ACCESS_KEY=paste_your_secret_access_key_here
```

### Step 4: Verify

After adding, tell me "R2 credentials added" and I'll verify and start the audio migration!

---

## Alternative: If "Create Account API Token" Doesn't Show S3 Credentials

If the Account API Token doesn't give you S3-compatible credentials, try:

1. Go to: https://dash.cloudflare.com/?to=/:account/r2/manage/account/api-tokens
2. Or look for "S3 API" or "Manage R2 API Tokens" in the R2 dashboard

The key is you need **S3-compatible** credentials (Access Key ID + Secret Access Key), not just a regular API token.

---

**Once you have the credentials added to `.env.local`, I'll start the audio migration!** 🚀


