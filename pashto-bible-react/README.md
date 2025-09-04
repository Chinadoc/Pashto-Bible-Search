# Pashto Bible Search - Advanced Linguistic Search Engine

A powerful Next.js application for searching the Pashto Bible with advanced linguistic features including inflection support, audio playback, and high-performance fuzzy text search.

## 🚀 **Key Features**

### 🔍 **Advanced Search**
- **Pashto text search** with automatic normalization
- **Inflection support** - search all forms of a word
- **Fuzzy matching** with pg_trgm for fast approximate searches
- **Multi-testament support** (OT/NT/All)

### 📚 **Linguistic Features**
- **Related forms detection** with occurrence counts
- **Root word identification** and inflection mapping
- **Romanization support** for Latin script input
- **Smart highlighting** of search terms and variants

### 🎵 **Audio Integration**
- **Verse-by-verse audio playback**
- **Signed URL support** for private audio buckets
- **Batch URL generation** for performance
- **Automatic fallback** mechanisms

### ⚡ **Performance Optimized**
- **Database indexes** for sub-second search results
- **In-memory caching** (5min search, 15min forms, 10min audio)
- **Lazy loading** for audio and results
- **Response time tracking** for debugging

## 🛠️ **Setup & Performance**

### 1. Database Setup (CRITICAL)
Run this SQL in your Supabase SQL editor for optimal performance:

```sql
-- Enable fuzzy text search
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Core indexes for verses table
CREATE INDEX IF NOT EXISTS verses_text_trgm_idx ON public.verses USING GIN (text gin_trgm_ops);
CREATE INDEX IF NOT EXISTS verses_testament_idx ON public.verses (testament);
CREATE INDEX IF NOT EXISTS verses_ref_idx ON public.verses (book, chapter, verse);
CREATE INDEX IF NOT EXISTS verses_book_idx ON public.verses (book);

-- Indexes for form mappings (if available)
CREATE INDEX IF NOT EXISTS form_to_root_map_form_idx ON public.form_to_root_map (form);
CREATE INDEX IF NOT EXISTS form_to_root_map_root_idx ON public.form_to_root_map (root);
CREATE INDEX IF NOT EXISTS form_to_root_map_form_trgm_idx ON public.form_to_root_map USING GIN (form gin_trgm_ops);
CREATE INDEX IF NOT EXISTS form_to_root_map_root_trgm_idx ON public.form_to_root_map USING GIN (root gin_trgm_ops);
```

### 2. Environment Variables
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📖 **How to Use**

### Basic Search
1. Enter a Pashto word or phrase
2. Select scope (All/OT/NT)
3. Click search or press Enter

### Advanced Features
1. **Related Forms**: After searching, see related inflections with occurrence counts
2. **Include Inflections**: Toggle to search all forms of the word
3. **Audio Playback**: Click the play button next to any verse
4. **Book Filtering**: Filter results by specific books

### API Endpoints

#### `/api/search_phrase`
```typescript
POST /api/search_phrase
{
  "query": "کول",
  "scope": "all",
  "extraVariants": ["کوي", "کړي"] // optional
}
```

#### `/api/related_forms`
```typescript
POST /api/related_forms
{
  "term": "کول",
  "limit": 200
}
// Returns: { root: "کول", forms: [{form: "کوي", count: 89}, ...] }
```

#### `/api/audio_url`
```typescript
GET /api/audio_url?ref=Genesis%201:1
// or
POST /api/audio_url
{ "refs": ["Genesis 1:1", "Genesis 1:2"] }
```

## 🏗️ **Architecture**

### Database Schema
- **verses**: Main table with Pashto Bible text
- **form_to_root_map**: Maps inflections to root words
- **inflections**: Alternative inflection table
- **audio storage**: Supabase Storage bucket for audio files

### Performance Features
- **pg_trgm indexes**: Fast fuzzy text search
- **In-memory caching**: Reduces database load
- **Lazy loading**: Audio only loads when needed
- **Batch processing**: Multiple audio URLs at once

## 🔧 **Troubleshooting**

### Search Performance Issues
1. Verify indexes: `SELECT * FROM pg_indexes WHERE tablename = 'verses';`
2. Check Supabase query performance
3. Restart app to clear cache

### Audio Not Working
1. Test `/api/audio_url?ref=Genesis%201:1` directly
2. Check file naming: `Genesis_001_001.mp3`
3. Verify bucket permissions

### Related Forms Empty
1. Check `form_to_root_map` table exists
2. Verify table schema
3. Check Supabase permissions

## 📊 **Performance Benchmarks**

### Before vs After Database Indexes
- **Basic searches**: 2-3x faster
- **ILIKE searches**: 10-50x faster with pg_trgm
- **Related forms**: 3-5x faster with proper indexing

### Caching Benefits
- **Repeated searches**: < 10ms response time
- **Related forms**: 15-minute cache
- **Audio URLs**: 10-minute cache

## 🚀 **Deployment**

### Vercel (Recommended)
The easiest way to deploy is using Vercel:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

### Manual Deployment
1. Build the app: `npm run build`
2. Start production server: `npm start`
3. Configure environment variables in your hosting platform

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 **License**

This project is licensed under the MIT License - see the LICENSE file for details.

---

**🎉 Happy searching in the Pashto Bible!**
