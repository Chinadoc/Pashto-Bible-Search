# Quick Start: Cloudflare Migration Setup

## Step 1: Verify Cloudflare Account

You likely already have a Cloudflare account (based on existing worker setup).

**Check if you're logged in:**
```bash
npx wrangler whoami
```

If you see your email, you're good! If not, login:
```bash
npx wrangler login
```
This will open your browser to authenticate.

---

## Step 2: Create D1 Database

**In Terminal:**
```bash
npx wrangler d1 create pashto-bible-db
```

**Output will look like:**
```
✅ Successfully created DB 'pashto-bible-db' in region APAC!
Created your database using D1's new storage backend. The new storage backend is not yet recommended for production workloads, but backs up your data via snapshots to R2.

[[d1_databases]]
binding = "DB"
database_name = "pashto-bible-db"
database_id = "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
```

**Copy the `database_id` and update `wrangler.toml`:**
```toml
[[d1_databases]]
binding = "DB"
database_name = "pashto-bible-db"
database_id = "YOUR_DATABASE_ID_HERE"  # ← Paste the ID here
```

---

## Step 3: Create R2 Bucket

**In Terminal:**
```bash
npx wrangler r2 bucket create pashto-bible-audio
```

**Output:**
```
✅ Successfully created bucket "pashto-bible-audio"
```

---

## Step 4: Get R2 API Credentials

**In Browser:**
1. Go to: https://dash.cloudflare.com/?to=/:account/r2/api-tokens
2. Click **"Create API token"**
3. Fill in:
   - **Token name**: `pashto-bible-r2-migration`
   - **Permissions**: 
     - ✅ **Object Read & Write**
     - ✅ **Bucket Read & Write**
   - **Bucket access**: `pashto-bible-audio`
4. Click **"Create API Token"**
5. **IMPORTANT**: Copy these values immediately (shown only once):
   - **Account ID**
   - **Access Key ID**
   - **Secret Access Key**

**Set Environment Variables:**
```bash
export CLOUDFLARE_ACCOUNT_ID="your_account_id"
export CLOUDFLARE_R2_ACCESS_KEY_ID="your_access_key"
export CLOUDFLARE_R2_SECRET_ACCESS_KEY="your_secret_key"
```

**Or create `.env.local` file:**
```bash
# Cloudflare R2 Credentials
CLOUDFLARE_ACCOUNT_ID=your_account_id
CLOUDFLARE_R2_ACCESS_KEY_ID=your_access_key
CLOUDFLARE_R2_SECRET_ACCESS_KEY=your_secret_key

# Supabase (for migration)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

---

## Step 5: Initialize Database Schema

```bash
npm run cloudflare:init-schema
```

This applies the D1 schema from `cloudflare/d1-schema.sql`.

**Verify:**
```bash
npx wrangler d1 execute pashto-bible-db --command="SELECT name FROM sqlite_master WHERE type='table';"
```

You should see all your tables listed.

---

## Step 6: Ready to Migrate!

Now you can proceed with:
1. Database migration
2. Audio migration

Continue with the migration execution plan!


