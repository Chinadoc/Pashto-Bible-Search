# 🚀 Ready to Migrate - Action Items

## ✅ What's Done

1. ✅ Cloudflare account authenticated
2. ✅ D1 database created (`pashto-bible-db`)
3. ✅ Database schema applied (15 tables ready)
4. ✅ Supabase URL found in `.env.local`

## ⚠️ What You Need to Do

### 1. Enable R2 Storage (5 minutes)

**Go to**: https://dash.cloudflare.com/?to=/:account/r2

**Click**: "Enable R2" or "Get Started"

**Note**: May require adding a payment method, but free tier covers your usage (~$0.15/month)

**After enabling**, tell me and I'll create the bucket!

---

### 2. Get Supabase Service Role Key (2 minutes)

**You need**: `SUPABASE_SERVICE_ROLE_KEY` (different from the anon key you have)

**Go to**: https://supabase.com/dashboard/project/nkombdutnjvaasxrbmdn/settings/api

**Find**: "service_role" key (secret, starts with `eyJ...`)

**Add to `.env.local`**:
```bash
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

**⚠️ Important**: This key has admin access - never commit it to git!

---

### 3. Get R2 API Credentials (3 minutes)

**After R2 is enabled**, go to: https://dash.cloudflare.com/?to=/:account/r2/api-tokens

**Click**: "Create API token"

**Settings**:
- Name: `pashto-bible-r2-migration`
- Permissions: Object Read & Write
- Bucket: `pashto-bible-audio`

**Copy these** (shown only once):
- Account ID
- Access Key ID  
- Secret Access Key

**Add to `.env.local`**:
```bash
CLOUDFLARE_ACCOUNT_ID=your_account_id
CLOUDFLARE_R2_ACCESS_KEY_ID=your_access_key
CLOUDFLARE_R2_SECRET_ACCESS_KEY=your_secret_key
```

---

## 🎯 Once You Have Everything

**Reply with**: "Ready!" and I'll:
1. ✅ Create the R2 bucket
2. ✅ Start database migration
3. ✅ Start audio migration
4. ✅ Update you on progress

---

## Quick Check

After adding credentials, verify with:
```bash
# Check if keys are set
grep -E "SUPABASE_SERVICE_ROLE_KEY|CLOUDFLARE_ACCOUNT_ID" .env.local
```

---

**Estimated Total Time**: ~10 minutes setup, then migrations run automatically (~15-20 hours total migration time, but runs in background)

Ready when you are! 🚀


