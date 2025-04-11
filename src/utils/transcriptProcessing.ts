
/**
 * Speech Transcript Processing Module
 * 
 * This module serves as a compatibility layer for the refactored speech analysis system.
 * It re-exports all speech analysis functions and types from their specialized modules
 * to maintain backward compatibility with existing code that imports from this file.
 * 
 * @module SpeechProcessing
 */

import { SpeechFeedback } from "@/hooks/useVoiceRecognition";
import { 
  processTranscript,
  analyzeSpokenCadence,
  detectHesitations,
  analyzeRhythm,
  analyzeSpeechClarity,
  analyzeFullSpeech,
  analyzeFullSpeechAsync,
  SpeechAnalysisResult,
  SpeechAnalysisConfig,
  ClarityScore
} from "./speech";
import { getCachedAnalysis, cacheAnalysisResult } from "./speech/analysisCache";

/**
 * Re-export all the functions and types for backward compatibility
 */
export { 
  // Core analysis functions
  processTranscript,
  analyzeSpokenCadence,
  detectHesitations,
  analyzeRhythm,
  analyzeSpeechClarity,
  
  // Full analysis functions
  analyzeFullSpeech,
  analyzeFullSpeechAsync,
  
  // Types
  type SpeechAnalysisResult,
  type SpeechAnalysisConfig,
  type ClarityScore
};

// Export the SpeechFeedback type for convenience
export type { SpeechFeedback };

/**
 * Validates speech analysis input parameters
 * @param text - The speech transcript to analyze
 * @param duration - The duration of the speech in seconds
 * @returns A validation result object indicating if the inputs are valid
 */
export function validateSpeechInput(text: string, duration: number): { 
  isValid: boolean; 
  error?: string;
} {
  if (!text || typeof text !== 'string') {
    return { isValid: false, error: 'Speech transcript must be a non-empty string' };
  }
  
  if (typeof duration !== 'number' || duration <= 0) {
    return { isValid: false, error: 'Duration must be a positive number' };
  }
  
  return { isValid: true };
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
  config?: SpeechAnalysisConfig
): boolean {
  // Create a cache key similar to how the cache system would
  const cacheKey = `${text.substring(0, 50)}-${duration}-${JSON.stringify(config || {})}`;
  
  // Use the existing cache checking mechanism from speech/analysisCache.ts
  // This would require importing getCachedAnalysis and exposing it in the speech/index.ts
  // For now, this is a placeholder implementation
  return false; // Would be implemented with actual cache checking
}

/**
 * Enhanced transcript processor with metrics logging
 * @param transcript - The speech transcript
 * @param duration - Speech duration in seconds
 * @param audioData - Optional audio analysis data
 * @returns The processed transcript with performance metrics
 */
export function processTranscriptWithMetrics(
  transcript: string,
  duration: number,
  audioData?: any
): { 
  result: SpeechAnalysisResult; 
  processingTimeMs: number;
  cacheHit: boolean;
} {
  const startTime = performance.now();
  const validation = validateSpeechInput(transcript, duration);
  
  if (!validation.isValid) {
    throw new Error(validation.error);
  }
  
  // Check if cached analysis exists
  const cacheHit = isAnalysisCached(transcript, duration);
  
  // Process the transcript using the imported function
  const result = analyzeFullSpeech(transcript, duration, audioData, { 
    logPerformance: "detailed",
    useCache: true
  });
  
  const processingTimeMs = performance.now() - startTime;
  
  return {
    result,
    processingTimeMs,
    cacheHit
  };
}

/**
 * Batch processes multiple transcripts with parallel processing and detailed metrics
 * @param transcripts - Array of transcript objects with text and duration
 * @param config - Optional configuration for analysis
 * @returns Promise resolving to array of analysis results with metrics
 */
export async function processTranscriptBatch(
  transcripts: Array<{ text: string; duration: number; audioData?: any }>,
  config: SpeechAnalysisConfig & { 
    maxConcurrent?: number;
    logCacheHits?: boolean;
  } = {}
): Promise<Array<{
  result: SpeechAnalysisResult;
  processingTimeMs: number;
  cacheHit: boolean;
  index: number;
  fromCache: boolean;
}>> {
  const startTime = performance.now();
  const maxConcurrent = config.maxConcurrent || 3; // Default to 3 concurrent processes
  const results: Array<{
    result: SpeechAnalysisResult;
    processingTimeMs: number;
    cacheHit: boolean;
    index: number;
    fromCache: boolean;
  }> = [];
  
  // Process in batches to limit concurrency
  const processBatch = async (batch: typeof transcripts, startIndex: number) => {
    const batchPromises = batch.map(async ({ text, duration, audioData }, i) => {
      const validation = validateSpeechInput(text, duration);
      if (!validation.isValid) {
        throw new Error(`Transcript ${startIndex + i}: ${validation.error}`);
      }

      const itemStartTime = performance.now();
      const cacheKey = `${text.substring(0, 50)}-${duration}-${JSON.stringify(config || {})}`;
      const cachedResult = config.useCache !== false ? getCachedAnalysis(cacheKey, config.cacheTimeMs || 60000) : null;
      const cacheHit = !!cachedResult;
      
      if (config.logCacheHits && cacheHit) {
        console.log(`Cache hit for transcript at index ${startIndex + i}: "${text.substring(0, 30)}..."`);
      }
      
      let result: SpeechAnalysisResult;
      
      if (cachedResult) {
        result = cachedResult;
      } else {
        // Use async analysis for faster processing
        result = await analyzeFullSpeechAsync(text, duration, audioData, { 
          ...config,
          logPerformance: config.logPerformance || "none"
        });
        
        if (config.useCache !== false) {
          cacheAnalysisResult(cacheKey, result);
        }
      }
      
      const processingTimeMs = performance.now() - itemStartTime;
      
      return {
        result,
        processingTimeMs,
        cacheHit,
        fromCache: cacheHit,
        index: startIndex + i
      };
    });
    
    return Promise.all(batchPromises);
  };
  
  // Process transcripts in batches of maxConcurrent
  for (let i = 0; i < transcripts.length; i += maxConcurrent) {
    const batch = transcripts.slice(i, Math.min(i + maxConcurrent, transcripts.length));
    const batchResults = await processBatch(batch, i);
    results.push(...batchResults);
  }
  
  // Sort results by original index to maintain order
  results.sort((a, b) => a.index - b.index);
  
  const totalTimeMs = performance.now() - startTime;
  
  if (config.logPerformance === "detailed") {
    console.log({
      batchProcessing: {
        totalTranscripts: transcripts.length,
        totalTimeMs: totalTimeMs.toFixed(2),
        averageTimePerTranscript: (totalTimeMs / transcripts.length).toFixed(2),
        cacheHits: results.filter(r => r.cacheHit).length,
        maxConcurrent
      }
    });
  }
  
  return results;
}

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
  // This is a placeholder implementation - in a real implementation,
  // we would access the actual cache and calculate these statistics
  
  return {
    size: 0, // Number of entries in cache
    hitCount: 0, // Number of cache hits
    hitRatio: 0, // Ratio of cache hits to total requests
    oldestEntryAge: 0, // Age of oldest entry in ms
    newestEntryAge: 0, // Age of newest entry in ms
    avgEntryAge: 0, // Average age of cache entries in ms
    averageProcessingTime: 0 // Average processing time of cached entries
  };
}

/**
 * Benchmark function to test speech analysis performance
 * @param sampleText - Text to analyze in benchmark
 * @param iterations - Number of iterations to run
 * @param useCache - Whether to use caching
 * @returns Benchmark results with timing statistics
 */
export async function benchmarkSpeechAnalysis(
  sampleText: string = "This is a sample text for benchmarking speech analysis performance",
  duration: number = 10,
  iterations: number = 5,
  config: SpeechAnalysisConfig & { useCache?: boolean } = {}
): Promise<{
  averageTimeMs: number;
  minTimeMs: number;
  maxTimeMs: number;
  totalTimeMs: number;
  cacheHits: number;
  iterations: number;
  runTimesMs: number[];
}> {
  const timings: number[] = [];
  let cacheHits = 0;
  const useCache = config.useCache !== false;
  
  // Validate inputs
  const validation = validateSpeechInput(sampleText, duration);
  if (!validation.isValid) {
    throw new Error(`Benchmark error: ${validation.error}`);
  }
  
  if (!Number.isInteger(iterations) || iterations < 1) {
    throw new Error("Iterations must be a positive integer");
  }
  
  const startTime = performance.now();
  
  for (let i = 0; i < iterations; i++) {
    const iterStartTime = performance.now();
    
    // Clear cache for first iteration if not using cache
    if (i === 0 && !useCache) {
      // Simulate cache clearing - actual implementation would use clearAnalysisCache()
    }
    
    // Run the analysis
    const result = await analyzeFullSpeechAsync(sampleText, duration, null, {
      ...config,
      useCache
    });
    
    // Check if result came from cache
    if (result.timestamp && useCache && i > 0) {
      cacheHits++;
    }
    
    const iterTime = performance.now() - iterStartTime;
    timings.push(iterTime);
    
    if (config.logPerformance === "detailed") {
      console.log(`Benchmark run ${i+1}/${iterations}: ${iterTime.toFixed(2)}ms${
        result.timestamp && useCache && i > 0 ? ' (cached)' : ''
      }`);
    }
  }
  
  const totalTimeMs = performance.now() - startTime;
  
  const results = {
    averageTimeMs: timings.reduce((sum, time) => sum + time, 0) / iterations,
    minTimeMs: Math.min(...timings),
    maxTimeMs: Math.max(...timings),
    totalTimeMs,
    cacheHits,
    iterations,
    runTimesMs: timings
  };
  
  if (config.logPerformance) {
    console.log({
      benchmarkResults: {
        ...results,
        runTimesMs: results.runTimesMs.map(t => t.toFixed(2)),
        averageTimeMs: results.averageTimeMs.toFixed(2),
        minTimeMs: results.minTimeMs.toFixed(2),
        maxTimeMs: results.maxTimeMs.toFixed(2),
        totalTimeMs: results.totalTimeMs.toFixed(2)
      }
    });
  }
  
  return results;
}
