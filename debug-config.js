// Debug configuration for Pashto Bible Search
// Add this to your environment or .env.local file

module.exports = {
  // Supabase Configuration
  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://nkombdutnjvaasxrbmdn.supabase.co',
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key-here'
  },

  // Debug settings
  debug: {
    enablePerformanceLogging: process.env.DEBUG_PERFORMANCE === 'true' || true,
    enableDatabaseLogging: process.env.DEBUG_DATABASE === 'true' || true,
    enableCacheLogging: process.env.DEBUG_CACHE === 'true' || true,
    logLevel: process.env.LOG_LEVEL || 'debug', // debug, info, warn, error
  },

  // Performance thresholds (in milliseconds)
  performance: {
    excellent: 100,
    good: 500,
    acceptable: 2000,
    poor: 5000,
  },

  // Database table names (make sure these match your Supabase setup)
  database: {
    tables: {
      verses: 'verses',
      wordIndex: 'word_index',
      searchIndex: 'search_index',
      lemmas: 'lemmas',
      wordForms: 'word_forms',
      phraseForms: 'phrase_forms',
      wordOccurrences: 'word_occurrences',
      phraseOccurrences: 'phrase_occurrences',
      lemmaRelations: 'lemma_relations',
    }
  },

  // Cache settings
  cache: {
    searchResults: {
      ttl: 4 * 60 * 60 * 1000, // 4 hours
      maxSize: 1000,
    },
    audioMap: {
      ttl: 60 * 60 * 1000, // 1 hour
    },
    lightweightData: {
      ttl: 2 * 60 * 60 * 1000, // 2 hours
    }
  }
};

// Helper function to check if environment is properly configured
function validateEnvironment() {
  const issues = [];

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    issues.push('Missing NEXT_PUBLIC_SUPABASE_URL');
  }

  if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    issues.push('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY');
  }

  if (issues.length > 0) {
    console.warn('⚠️ Environment configuration issues:', issues);
    return false;
  }

  console.log('✅ Environment configuration is valid');
  return true;
}

// Export validation function
module.exports.validateEnvironment = validateEnvironment;

// Debug helper functions
module.exports.debugHelpers = {
  // Test database connection
  async testDatabaseConnection() {
    try {
      const { createClient } = require('@supabase/supabase-js');
      const supabase = createClient(
        module.exports.supabase.url,
        module.exports.supabase.anonKey
      );

      const startTime = Date.now();
      const { data, error } = await supabase
        .from('verses')
        .select('count')
        .limit(1);

      const latency = Date.now() - startTime;

      if (error) {
        return { connected: false, latency, error: error.message };
      }

      return { connected: true, latency };
    } catch (error) {
      return {
        connected: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  },

  // Get cache statistics
  getCacheStats() {
    if (typeof window !== 'undefined') {
      // Client-side - would need to fetch from API
      return null;
    }

    // Server-side - access the cache directly
    try {
      const fs = require('fs');
      const path = require('path');

      // This would need to be adapted based on your caching implementation
      return {
        note: 'Cache stats would be available in the search API endpoint',
        endpoint: '/api/search (GET request)'
      };
    } catch (error) {
      return { error: 'Unable to access cache statistics' };
    }
  },

  // Performance analysis
  analyzePerformance(metrics) {
    if (!metrics || metrics.length === 0) {
      return { message: 'No performance data available' };
    }

    const times = metrics.map(m => m.searchTime);
    const avgTime = times.reduce((a, b) => a + b, 0) / times.length;
    const maxTime = Math.max(...times);
    const minTime = Math.min(...times);
    const cacheHits = metrics.filter(m => m.cacheHit).length;
    const cacheHitRate = (cacheHits / metrics.length) * 100;

    return {
      averageTime: Math.round(avgTime),
      maxTime: Math.round(maxTime),
      minTime: Math.round(minTime),
      cacheHitRate: Math.round(cacheHitRate * 100) / 100,
      totalSearches: metrics.length,
      performance: avgTime < 500 ? 'excellent' : avgTime < 2000 ? 'good' : avgTime < 5000 ? 'acceptable' : 'poor'
    };
  }
};

if (require.main === module) {
  // Run validation if called directly
  validateEnvironment();

  // Test database connection
  module.exports.debugHelpers.testDatabaseConnection()
    .then(result => {
      console.log('Database connection test:', result);
    })
    .catch(error => {
      console.error('Database connection test failed:', error);
    });
}
