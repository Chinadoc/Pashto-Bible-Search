# Pashto Bible Search - Debugging and Performance Guide

This guide explains how to use the debugging tools and optimize performance for the Pashto Bible Search application.

## 🐛 Performance Issues Identified

The search for "وهل" (wahul - "to hit") took about a minute, indicating several performance bottlenecks:

1. **Dictionary Data Loading**: Loading `full_dictionary_enriched.json` and related data files
2. **Multiple Search Strategies**: The app tries several search methods sequentially
3. **Cache Misses**: If not properly cached, searches are slow
4. **Database Connection**: Potential latency in Supabase queries

## 🛠️ Debugging Tools Added

### 1. Enhanced Search API Logging (`app/api/search/route.ts`)

The search API now includes comprehensive performance logging:

- **Request timing**: Total request time and breakdown by phase
- **Cache performance**: Hit/miss rates and cache statistics
- **Database connection**: Connection latency and status
- **Search strategy**: Which search method was used and how long it took
- **Dictionary lookup**: Romanized text conversion and dictionary matching

### 2. Frontend Performance Debugger (`components/PerformanceDebugger.tsx`)

A React component that provides real-time performance monitoring:

- **Search timing**: Track individual search performance
- **Cache statistics**: Monitor cache hit rates and sizes
- **Database status**: Real-time database connection monitoring
- **Performance metrics**: Average search times, cache hit rates
- **Debug actions**: Cache warming, clearing, and data export

### 3. Database Setup Script (`setup_supabase_tables.sql`)

SQL script to set up the required tables in Supabase:

```sql
-- Run this in your Supabase SQL editor:
-- https://supabase.com/dashboard/project/nkombdutnjvaasxrbmdn/database/tables
```

The script creates:
- `verses` - Main Bible verses table
- `word_index` - Ultra-fast word lookup (for common words)
- `search_index` - Fallback search index (for less common words)
- `lemmas`, `word_forms`, `phrase_forms` - Dictionary and morphology tables
- Performance indexes and search functions

### 4. Debug Configuration (`debug-config.js`)

Configuration file with performance thresholds and debugging settings:

```javascript
// Performance thresholds
performance: {
  excellent: 100,    // < 100ms
  good: 500,        // < 500ms
  acceptable: 2000, // < 2s
  poor: 5000,       // > 5s
}
```

## 🚀 Performance Optimization Strategies

### 1. Enable the Performance Debugger

Add the PerformanceDebugger component to your main layout:

```typescript
// In your layout or page component
import PerformanceDebugger from '@/components/PerformanceDebugger';

export default function Layout({ children }) {
  return (
    <>
      {children}
      <PerformanceDebugger />
    </>
  );
}
```

### 2. Check Database Connection

Visit `/api/search` (GET request) to see cache and database status:

```bash
curl https://your-domain.vercel.app/api/search
```

Look for:
- `database.connected: true`
- `database.latency: < 100ms`
- `cache.performance.hitRate: > 50%`

### 3. Warm Up Caches

Preload common searches and data:

```bash
curl "https://your-domain.vercel.app/api/search?action=warm"
```

### 4. Monitor Search Performance

The debugger will show:
- **Search times**: Should be < 500ms for cached results, < 2s for new searches
- **Cache hit rate**: Should be > 50% for good performance
- **Database latency**: Should be < 100ms

### 5. Set Up Database Indexes

Run the SQL setup script in Supabase to create the optimized indexes:

1. Go to [Supabase Dashboard](https://supabase.com/dashboard/project/nkombdutnjvaasxrbmdn/database/tables)
2. Click "SQL Editor"
3. Copy and paste the contents of `setup_supabase_tables.sql`
4. Run the script

## 📊 Performance Monitoring

### Key Metrics to Monitor

1. **Search Response Time**
   - Excellent: < 100ms (cached)
   - Good: < 500ms (fast search)
   - Acceptable: < 2s (full search)
   - Poor: > 5s (needs optimization)

2. **Cache Hit Rate**
   - Excellent: > 80%
   - Good: > 50%
   - Poor: < 20%

3. **Database Connection**
   - Should be < 100ms latency
   - Should be 100% reliable

4. **Memory Usage**
   - Monitor for memory leaks in long-running searches

### Common Performance Issues

1. **Cold Cache**: First few searches will be slow until cache warms up
2. **Database Connection**: Network latency to Supabase
3. **Dictionary Loading**: Large JSON files taking time to parse
4. **Multiple Search Strategies**: App trying several methods sequentially

## 🔧 Environment Configuration

Make sure your environment variables are set:

```env
NEXT_PUBLIC_SUPABASE_URL=https://nkombdutnjvaasxrbmdn.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
DEBUG_PERFORMANCE=true
DEBUG_DATABASE=true
DEBUG_CACHE=true
```

## 📈 Performance Testing

### Test Search Performance

1. **Enable debugger** in your browser
2. **Search for common words**: "خدا", "عیسی", "محبت"
3. **Check response times**: Should be < 500ms
4. **Verify cache hits**: Look for ⚡ (cache) vs 🔍 (live search)

### Database Performance Test

```bash
# Test database connection
curl -X GET "https://your-domain.vercel.app/api/search" | jq '.database'

# Should return:
# {
#   "connected": true,
#   "latency": 45
# }
```

### Cache Performance Test

```bash
# Check cache statistics
curl -X GET "https://your-domain.vercel.app/api/search" | jq '.cache'

# Look for high hit rates and reasonable cache sizes
```

## 🚨 Troubleshooting

### If searches are slow:

1. **Check database connection**: Visit `/api/search` and verify database status
2. **Warm up caches**: Run cache warming script
3. **Check Supabase performance**: Verify database indexes are created
4. **Monitor search strategies**: Look for which search method is being used

### If cache hit rate is low:

1. **Warm caches**: Run the warm cache endpoint
2. **Check cache TTL**: Make sure cache isn't expiring too quickly
3. **Verify search normalization**: Similar searches should use same cache key

### If database connection fails:

1. **Verify environment variables**: Check Supabase URL and key
2. **Test connection**: Use the debug helpers in `debug-config.js`
3. **Check Supabase status**: Verify your project is active

## 📝 Next Steps

1. **Set up database tables** using the provided SQL script
2. **Enable performance debugger** in your frontend
3. **Monitor performance** for a few days to establish baseline
4. **Optimize bottlenecks** based on the debugging data
5. **Set up monitoring** for production performance

## 🔗 Useful Links

- **Supabase Dashboard**: https://supabase.com/dashboard/project/nkombdutnjvaasxrbmdn/database/tables
- **Production Site**: https://pashto-bible-search.vercel.app/
- **Search API**: https://pashto-bible-search.vercel.app/api/search

---

This debugging setup will help you identify and resolve performance issues in your Pashto Bible Search application. The comprehensive logging will show exactly where time is being spent and help optimize the search experience.
