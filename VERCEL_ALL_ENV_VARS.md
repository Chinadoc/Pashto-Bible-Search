# 🔧 Complete Vercel Environment Variables Setup

## ✅ Already Added
- ASSEMBLYAI_API_KEY

## ⏳ Still Need to Add

### 1. ELEVENLABS_API_KEY

Go to Vercel → Settings → Environment Variables

Add:
- **Name**: `ELEVENLABS_API_KEY`
- **Value**: `sk_b3f632622b08afb9a26b2fb912be9d1baa2548414f430543`
- **Environment**: Select all (Production, Preview, Development)
- Click **Save**

### 2. All Variables Checklist

Make sure ALL of these are configured in Vercel:

```bash
✅ NEXT_PUBLIC_SUPABASE_URL=https://nkombdutnjvaasxrbmdn.supabase.co
✅ NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
✅ SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
✅ ASSEMBLYAI_API_KEY=4c15846aff03429e99207a86450addae
⏳ ELEVENLABS_API_KEY=sk_b3f632622b08afb9a26b2fb912be9d1baa2548414f430543
```

## After Adding

1. Vercel will auto-redeploy
2. Wait ~2 minutes for deployment
3. Refresh your app
4. Both AssemblyAI and ElevenLabs will work! ✅

## Why Both?

- **AssemblyAI**: Fast cloud transcription (no local tools)
- **ElevenLabs**: Higher quality, used as fallback

Both are needed for complete functionality!
