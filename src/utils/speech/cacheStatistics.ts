
import { analysisCache } from './analysisCache';

/**
 * Provides statistics about the speech analysis cache
 * @returns Object with cache stats including size, hit ratio, and age information
 */
export function getCacheStatistics(): {
  size: number;
  hitCount: number;
  hitRatio: number;
  oldestEntryAge: number;
  newestEntryAge: number;
  avgEntryAge: number;
  averageProcessingTime: number;
} {
  // Convert Map to array for easier processing
  const entries = Array.from(analysisCache.entries());
  const now = Date.now();
  
  const size = entries.length;
  // Count entries with timestamps as hit count (simplified metric)
  const hitCount = entries.filter(([_, value]) => value.timestamp).length;
  const hitRatio = size > 0 ? hitCount / size : 0;
  
  // Calculate age metrics
  let oldestEntryAge = 0;
  let newestEntryAge = Infinity;
  let totalAge = 0;
  let totalProcessingTime = 0;
  let processingTimeCount = 0;
  
  entries.forEach(([_, value]) => {
    if (value.timestamp) {
      const age = now - value.timestamp;
      oldestEntryAge = Math.max(oldestEntryAge, age);
      newestEntryAge = Math.min(newestEntryAge, age);
      totalAge += age;
      
      // If the entry has processing time metadata
      if (value.processingTimeMs) {
        totalProcessingTime += value.processingTimeMs;
        processingTimeCount++;
      }
    }
  });
  
  return {
    size,
    hitCount,
    hitRatio,
    oldestEntryAge: oldestEntryAge || 0,
    newestEntryAge: newestEntryAge === Infinity ? 0 : newestEntryAge,
    avgEntryAge: size > 0 ? totalAge / size : 0,
    averageProcessingTime: processingTimeCount > 0 ? totalProcessingTime / processingTimeCount : 0
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
