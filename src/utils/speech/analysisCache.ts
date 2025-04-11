
import { SpeechAnalysisResult } from './types';

// Cache for analysis results to improve performance
const analysisCache = new Map<string, SpeechAnalysisResult>();
const MAX_CACHE_SIZE = 10;

/**
 * Get a cached analysis result if available
 */
export const getCachedAnalysis = (
  cacheKey: string, 
  cacheTimeMs: number
): SpeechAnalysisResult | null => {
  if (analysisCache.has(cacheKey)) {
    const cachedResult = analysisCache.get(cacheKey)!;
    const now = Date.now();
    
    // If cache is still valid based on time
    if (cachedResult.timestamp && (now - cachedResult.timestamp) < cacheTimeMs) {
      return cachedResult;
    }
  }
  
  return null;
};

/**
 * Store an analysis result in the cache
 */
export const cacheAnalysisResult = (
  cacheKey: string, 
  result: SpeechAnalysisResult
): void => {
  // Manage cache size by removing oldest entries if needed
  if (analysisCache.size >= MAX_CACHE_SIZE) {
    // Find the oldest cache entry
    let oldestKey = '';
    let oldestTime = Infinity;
    
    for (const [key, value] of analysisCache.entries()) {
      if (value.timestamp && value.timestamp < oldestTime) {
        oldestTime = value.timestamp;
        oldestKey = key;
      }
    }
    
    // Remove the oldest entry
    if (oldestKey) {
      analysisCache.delete(oldestKey);
    }
  }
  
  // Add the new result to cache
  analysisCache.set(cacheKey, result);
};
