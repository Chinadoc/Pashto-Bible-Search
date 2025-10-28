# 🔧 Vercel Environment Variables Setup

## Issue

AssemblyAI API key is missing on Vercel, causing 500 errors.

## Fix: Add Environment Variable

### Step 1: Go to Vercel Dashboard
1. Visit: https://vercel.com/dashboard
2. Select your project: `pashto-bible-search`

### Step 2: Add Environment Variable
1. Go to **Settings** → **Environment Variables**
2. Click **Add New**
3. Add:
   - **Name**: `ASSEMBLYAI_API_KEY`
   - **Value**: `4c15846aff03429e99207a86450addae`
   - **Environment**: Select all (Production, Preview, Development)
4. Click **Save**

### Step 3: Redeploy
After adding the variable, Vercel will automatically redeploy.

Or manually trigger:
1. Go to **Deployments** tab
2. Click **...** on latest deployment
3. Click **Redeploy**

## Current Status

✅ Changed default to ElevenLabs (will work immediately)
⏳ Add AssemblyAI key to Vercel for AssemblyAI option

## Test After Setup

After adding the key, try:
1. Refresh the page
2. Change dropdown to "⚡ AssemblyAI"
3. Click "🚀 Process Complete Video"
4. Should work now!

## All Required Variables

Make sure these are in Vercel:

```
NEXT_PUBLIC_SUPABASE_URL=https://nkombdutnjvaasxrbmdn.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
ASSEMBLYAI_API_KEY=4c15846aff03429e99207a86450addae
```

