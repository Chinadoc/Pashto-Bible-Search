# Database Migrations

This folder contains SQL migration scripts for the Pashto Bible Search Supabase database.

## How to Run Migrations

### Option 1: Supabase SQL Editor (Recommended)

1. Go to your Supabase project dashboard: https://supabase.com/dashboard/project/nkombdutnjvaasxrbmdn
2. Click on **SQL Editor** in the left sidebar
3. Click **New Query**
4. Copy and paste the contents of the migration file (e.g., `add_audio_url_to_verses.sql`)
5. Click **Run** to execute the migration

### Option 2: Command Line (if you have psql installed)

```bash
# Set your database connection string
export DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.nkombdutnjvaasxrbmdn.supabase.co:5432/postgres"

# Run the migration
psql $DATABASE_URL -f migrations/add_audio_url_to_verses.sql
```

### Option 3: Using Supabase CLI

```bash
# Install Supabase CLI if you haven't
npm install -g supabase

# Login and link to your project
supabase login
supabase link --project-ref nkombdutnjvaasxrbmdn

# Run the migration
supabase db execute -f migrations/add_audio_url_to_verses.sql
```

## Available Migrations

### `add_audio_url_to_verses.sql`

**Purpose**: Adds `audio_url` column directly to `verses` and `verses_yousafzai` tables

**What it does**:
1. Adds `audio_url TEXT` column to both tables
2. Populates the column from existing `audio_mappings` table
3. Creates indexes for performance
4. Includes verification queries (commented out)

**Benefits**:
- Single query fetches both verse text and audio URL
- No need to join with `audio_mappings` table
- Faster API responses (1 query instead of 2)

**Verification**:

After running the migration, verify with:

```sql
-- Check verses coverage
SELECT
  COUNT(*) as total_verses,
  COUNT(audio_url) as verses_with_audio,
  ROUND(100.0 * COUNT(audio_url) / COUNT(*), 2) as coverage_percentage
FROM verses;

-- Check sample data
SELECT book, chapter, verse,
       LEFT(text, 50) as text_preview,
       LEFT(audio_url, 60) as audio_url_preview
FROM verses
WHERE audio_url IS NOT NULL
LIMIT 10;
```

## Migration Status

- [ ] `add_audio_url_to_verses.sql` - **READY TO RUN**

## Notes

- Always backup your database before running migrations
- Test migrations on a staging environment if possible
- The `audio_mappings` table can remain for reference after migration
- Rollback instructions are included at the bottom of each migration file
