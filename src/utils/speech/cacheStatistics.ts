import { analysisCache } from './analysisCache';
import { CacheStatistics } from './types';

// Track cache statistics beyond just the current state
let totalCacheHits = 0;
let totalCacheMisses = 0;
let totalEvictions = 0;

/**
 * Track a cache hit
 */
export function trackCacheHit() {
  totalCacheHits++;
}

/**
 * Track a cache miss
 */
export function trackCacheMiss() {
  totalCacheMisses++;
}

/**
 * Track a cache eviction
 */
export function trackCacheEviction() {
  totalEvictions++;
}

/**
 * Reset cache statistics counters
 */
export function resetCacheStatistics() {
  totalCacheHits = 0;
  totalCacheMisses = 0;
  totalEvictions = 0;
}

/**
 * Provides statistics about the speech analysis cache
 * @returns Object with cache stats including size, hit ratio, and age information
 */
export function getCacheStatistics(): CacheStatistics {
  // Convert Map to array for easier processing
  const entries = Array.from(analysisCache.entries());
  const now = Date.now();
  
  const size = entries.length;
  // Count entries with timestamps as hit count (simplified metric)
  const hitCount = totalCacheHits;
  const missCount = totalCacheMisses;
  const hitRatio = (hitCount + missCount) > 0 ? hitCount / (hitCount + missCount) : 0;
  
  // Calculate age metrics
  let oldestEntryAgeMs = 0;
  let newestEntryAgeMs = Infinity;
  let totalAgeMs = 0;
  let totalProcessingTime = 0;
  let processingTimeCount = 0;
  
  entries.forEach(([_, value]) => {
    if (value.timestamp) {
      const age = now - value.timestamp;
      oldestEntryAgeMs = Math.max(oldestEntryAgeMs, age);
      newestEntryAgeMs = Math.min(newestEntryAgeMs, age);
      totalAgeMs += age;
      
      // If the entry has processing time metadata
      if (value.metrics?.processingTimeMs) {
        totalProcessingTime += value.metrics.processingTimeMs;
        processingTimeCount++;
      }
    }
  });
  
  return {
    size,
    hitCount,
    missCount,
    hitRatio,
    oldestEntryAgeMs: oldestEntryAgeMs || 0,
    newestEntryAgeMs: newestEntryAgeMs === Infinity ? 0 : newestEntryAgeMs,
    averageEntryAgeMs: size > 0 ? totalAgeMs / size : 0,
    averageProcessingTimeMs: processingTimeCount > 0 ? totalProcessingTime / processingTimeCount : 0,
    evictionCount: totalEvictions
  };
}

/**
 * Checks if a speech analysis is likely to be cached
 * @param text - The speech transcript
 * @param duration - Speech duration in seconds
 * @param config - Optional analysis configuration
 * @returns Boolean indicating if the result would be served from cache
 */
export function isAnalysisCached(
  text: string, 
  duration: number, 
  config?: any
): boolean {
  // Create a cache key similar to how the cache system would
  const cacheKey = `${text.substring(0, 50)}-${duration}-${JSON.stringify(config || {})}`;
  
  // Check if this key exists in the cache
  return analysisCache.has(cacheKey);
}
