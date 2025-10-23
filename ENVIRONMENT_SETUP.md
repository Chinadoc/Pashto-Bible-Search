# Environment Variables Setup

This document outlines all the environment variables required for the Pashto Bible Search application.

## Required Environment Variables

### Supabase Configuration
These are the core database connection variables:

- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL (format: `https://your-project-id.supabase.co`)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous/public API key
- `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase service role key (for admin operations)

### GitHub Configuration
- `GITHUB_TOKEN`: GitHub personal access token (for automated GitHub operations)

## Setup Instructions

### 1. Copy the Example File
```bash
cp .env.local.example .env.local
```

### 2. Get Supabase Credentials
1. Go to your Supabase project dashboard
2. Navigate to Settings → API
3. Copy the following values:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon/public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role key** → `SUPABASE_SERVICE_ROLE_KEY`

### 3. Get GitHub Token (Optional)
1. Go to GitHub Settings → Developer settings → Personal access tokens
2. Create a new token with appropriate permissions
3. Copy the token → `GITHUB_TOKEN`

### 4. Vercel Deployment
The following variables are already configured in `vercel.json` for deployment:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Security Notes

- The `.env.local` file is automatically gitignored and should never be committed
- The `SUPABASE_SERVICE_ROLE_KEY` has admin privileges - keep it secure
- The `GITHUB_TOKEN` should have minimal required permissions

## Database Schema

The application expects the following Supabase tables:
- `verses` - Main Bible verses (Afghan translation)
- `verses_yousafzai` - Yousafzai translation verses
- `word_frequencies` - Word frequency data
- `form_occurrences` - Form occurrence mappings
- `form_roots` - Root form relationships
- `audio_by_verse` - Audio mapping data

## Verification

To verify your environment setup:
1. Run `npm run dev`
2. Check that the application loads without errors
3. Test search functionality
4. Verify database connections in browser console

## Production Deployment

For Vercel deployment:
1. Set environment variables in Vercel dashboard
2. Or ensure `vercel.json` contains the correct public variables
3. The build process will validate all required variables
