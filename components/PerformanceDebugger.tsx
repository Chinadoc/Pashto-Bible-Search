'use client';

import React, { useState, useEffect } from 'react';

interface PerformanceMetrics {
  searchTime: number;
  cacheHit: boolean;
  searchType: string;
  resultsCount: number;
  timestamp: string;
}

interface DatabaseStatus {
  connected: boolean;
  latency?: number;
  error?: string;
}

interface CacheStatus {
  cache: {
    searchResults: {
      size: number;
      maxSize: number;
      ttl: number;
      instantCacheSize: number;
    };
    performance: {
      hitRate: number;
      totalHits: number;
      totalMisses: number;
    };
    audioMap: {
      cached: boolean;
      ttl: number;
      age: number | null;
    };
    helperVariants: {
      size: number;
    };
  };
  database: DatabaseStatus;
  environment: {
    nodeEnv: string;
    vercel: boolean;
    hasSupabaseUrl: boolean;
    hasSupabaseKey: boolean;
  };
  timestamp: string;
}

export default function PerformanceDebugger() {
  const [isOpen, setIsOpen] = useState(false);
  const [metrics, setMetrics] = useState<PerformanceMetrics[]>([]);
  const [cacheStatus, setCacheStatus] = useState<CacheStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Track search performance
  useEffect(() => {
    const originalFetch = window.fetch;
    window.fetch = async function(input: RequestInfo | URL, init?: RequestInit) {
      const startTime = performance.now();
      const url = typeof input === 'string' ? input : input.toString();

      if (url.includes('/api/search') && init?.method === 'POST') {
        try {
          const response = await originalFetch(input, init);
          const endTime = performance.now();
          const searchTime = endTime - startTime;

          if (response.ok) {
            const data = await response.clone().json();
            const metric: PerformanceMetrics = {
              searchTime,
              cacheHit: data.cached || false,
              searchType: data.processed?.searchType || 'unknown',
              resultsCount: data.count || 0,
              timestamp: new Date().toISOString(),
            };
            setMetrics(prev => [metric, ...prev.slice(0, 9)]); // Keep last 10 searches
          }

          return response;
        } catch (error) {
          console.error('Error tracking search performance:', error);
          return originalFetch(input, init);
        }
      }

      return originalFetch(input, init);
    };

    return () => {
      window.fetch = originalFetch;
    };
  }, []);

  const loadCacheStatus = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/search');
      if (response.ok) {
        const status = await response.json();
        setCacheStatus(status);
      }
    } catch (error) {
      console.error('Error loading cache status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const clearCache = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/search?action=clear');
      if (response.ok) {
        await loadCacheStatus(); // Reload status after clearing
      }
    } catch (error) {
      console.error('Error clearing cache:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const warmCache = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/search?action=warm');
      if (response.ok) {
        await loadCacheStatus(); // Reload status after warming
      }
    } catch (error) {
      console.error('Error warming cache:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const averageSearchTime = metrics.length > 0
    ? metrics.reduce((sum, m) => sum + m.searchTime, 0) / metrics.length
    : 0;

  const cacheHitRate = metrics.length > 0
    ? (metrics.filter(m => m.cacheHit).length / metrics.length) * 100
    : 0;

  return (
    <>
      {/* Debug Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 z-50 bg-gray-800 text-white px-3 py-2 rounded-full shadow-lg hover:bg-gray-700 transition-colors text-sm font-mono"
        title="Performance Debugger"
      >
        🐛 {isOpen ? 'Hide' : 'Debug'}
      </button>

      {/* Debug Panel */}
      {isOpen && (
        <div className="fixed bottom-16 right-4 z-50 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-xl w-96 max-h-96 overflow-y-auto">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Performance Debugger
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                ✕
              </button>
            </div>

            {/* Cache Status */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900 dark:text-white">Cache Status</h4>
                <div className="space-x-2">
                  <button
                    onClick={loadCacheStatus}
                    disabled={isLoading}
                    className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                  >
                    Refresh
                  </button>
                  <button
                    onClick={warmCache}
                    disabled={isLoading}
                    className="px-2 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
                  >
                    Warm
                  </button>
                  <button
                    onClick={clearCache}
                    disabled={isLoading}
                    className="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
                  >
                    Clear
                  </button>
                </div>
              </div>

              {cacheStatus && (
                <div className="text-sm space-y-1">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Cache Hit Rate:</span>
                    <span className={`font-mono ${cacheStatus.cache.performance.hitRate > 50 ? 'text-green-600' : cacheStatus.cache.performance.hitRate > 20 ? 'text-yellow-600' : 'text-red-600'}`}>
                      {cacheStatus.cache.performance.hitRate.toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">DB Connected:</span>
                    <span className={`font-mono ${cacheStatus.database.connected ? 'text-green-600' : 'text-red-600'}`}>
                      {cacheStatus.database.connected ? '✓' : '✗'}
                      {cacheStatus.database.latency && ` (${cacheStatus.database.latency}ms)`}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Search Cache:</span>
                    <span className="font-mono">
                      {cacheStatus.cache.searchResults.size}/{cacheStatus.cache.searchResults.maxSize}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Total Hits:</span>
                    <span className="font-mono">
                      {cacheStatus.cache.performance.totalHits}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Total Misses:</span>
                    <span className="font-mono">
                      {cacheStatus.cache.performance.totalMisses}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Environment:</span>
                    <span className="font-mono text-xs">
                      {cacheStatus.environment.nodeEnv} {cacheStatus.environment.vercel ? '(Vercel)' : '(Local)'}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Search Performance */}
            <div className="mb-4">
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Recent Searches</h4>
              {metrics.length > 0 ? (
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Avg Time:</span>
                    <span className={`font-mono ${averageSearchTime < 500 ? 'text-green-600' : averageSearchTime < 2000 ? 'text-yellow-600' : 'text-red-600'}`}>
                      {averageSearchTime.toFixed(0)}ms
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Cache Hits:</span>
                    <span className={`font-mono ${cacheHitRate > 50 ? 'text-green-600' : cacheHitRate > 20 ? 'text-yellow-600' : 'text-red-600'}`}>
                      {cacheHitRate.toFixed(1)}%
                    </span>
                  </div>

                  <div className="max-h-32 overflow-y-auto space-y-1">
                    {metrics.map((metric, index) => (
                      <div key={index} className="text-xs bg-gray-50 dark:bg-gray-700 p-2 rounded">
                        <div className="flex justify-between">
                          <span className={`font-mono ${metric.searchTime < 500 ? 'text-green-600' : metric.searchTime < 2000 ? 'text-yellow-600' : 'text-red-600'}`}>
                            {metric.searchTime.toFixed(0)}ms
                          </span>
                          <span className={`font-mono ${metric.cacheHit ? 'text-green-600' : 'text-gray-500'}`}>
                            {metric.cacheHit ? '⚡' : '🔍'}
                          </span>
                        </div>
                        <div className="flex justify-between text-gray-600 dark:text-gray-400">
                          <span>{metric.searchType}</span>
                          <span>{metric.resultsCount} results</span>
                        </div>
                        <div className="text-gray-500 text-xs">
                          {new Date(metric.timestamp).toLocaleTimeString()}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  No searches tracked yet
                </div>
              )}
            </div>

            {/* Debug Actions */}
            <div className="text-xs space-y-1">
              <button
                onClick={() => {
                  const data = { metrics, cacheStatus, timestamp: new Date().toISOString() };
                  navigator.clipboard.writeText(JSON.stringify(data, null, 2));
                  alert('Debug data copied to clipboard!');
                }}
                className="w-full px-2 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 text-xs"
              >
                Copy Debug Data
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
