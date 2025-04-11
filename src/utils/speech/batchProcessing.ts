
import { SpeechAnalysisResult, SpeechAnalysisConfig, BatchStatistics } from './types';
import { analyzeFullSpeech } from './syncAnalysis';
import { analyzeFullSpeechAsync } from './asyncAnalysis';
import { getCachedAnalysis, cacheAnalysisResult } from './analysisCache';

/**
 * Processes multiple transcripts in batch with performance tracking and cache integration.
 * @param transcripts - Array of transcript objects with text and duration
 * @param config - Optional configuration with batch-specific options
 * @returns Promise resolving to array of analysis results with timings and cache status
 */
export async function processTranscriptBatch(
  transcripts: Array<{ text: string; duration: number; audioData?: any }>,
  config: SpeechAnalysisConfig & { 
    maxConcurrent?: number;
    logCacheHits?: boolean;
  } = {}
): Promise<{
  results: Array<{
    result: SpeechAnalysisResult;
    fromCache: boolean;
    index: number;
  }>;
  statistics: BatchStatistics;
}> {
  const startTime = performance.now();
  const maxConcurrent = config.maxConcurrent || 3; // Default to 3 concurrent processes
  const logCacheHits = config.logCacheHits || false;
  const results: Array<{
    result: SpeechAnalysisResult;
    fromCache: boolean;
    index: number;
  }> = [];
  
  // Process in batches to limit concurrency
  const processBatch = async (batch: typeof transcripts, startIndex: number) => {
    const batchPromises = batch.map(async ({ text, duration, audioData }, i) => {
      if (!text || typeof text !== 'string' || typeof duration !== 'number' || duration <= 0) {
        throw new Error(`Invalid input for transcript ${startIndex + i}: Text must be a non-empty string, duration must be a positive number`);
      }

      const itemStartTime = performance.now();
      const cacheKey = `${text.substring(0, 50)}-${duration}-${JSON.stringify(config || {})}`;
      const cachedResult = config.useCache !== false ? getCachedAnalysis(cacheKey, config.cacheTimeMs || 60000) : null;
      const fromCache = !!cachedResult;
      
      if (logCacheHits && fromCache) {
        console.log(`Cache hit for transcript at index ${startIndex + i}: "${text.substring(0, 30)}..."`);
      }
      
      let result: SpeechAnalysisResult;
      
      if (cachedResult) {
        result = cachedResult;
      } else {
        // Use async analysis for faster processing
        result = await (config.async === false ? 
          analyzeFullSpeech(text, duration, audioData, config) : 
          analyzeFullSpeechAsync(text, duration, audioData, config));
        
        if (config.useCache !== false) {
          cacheAnalysisResult(cacheKey, result);
        }
      }
      
      const processingTimeMs = result.metrics?.processingTimeMs || 
                               (performance.now() - itemStartTime);
      
      // Ensure metrics are present
      if (!result.metrics) {
        result.metrics = {
          startTime: itemStartTime,
          endTime: performance.now(),
          processingTimeMs,
          cacheHit: fromCache
        };
      }
      
      return {
        result,
        fromCache,
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
  const cachedCount = results.filter(r => r.fromCache).length;
  
  // Calculate batch statistics
  const processingTimes = results.map(r => r.result.metrics?.processingTimeMs || 0).filter(t => t > 0);
  
  const statistics: BatchStatistics = {
    totalAnalyses: transcripts.length,
    totalProcessingTimeMs: totalTimeMs,
    averageProcessingTimeMs: totalTimeMs / transcripts.length,
    cacheHitCount: cachedCount,
    cacheHitRatio: cachedCount / transcripts.length,
    slowestAnalysisMs: processingTimes.length > 0 ? Math.max(...processingTimes) : 0,
    fastestAnalysisMs: processingTimes.length > 0 ? Math.min(...processingTimes) : 0
  };
  
  if (config.logPerformance) {
    console.log({
      batchProcessing: {
        totalTranscripts: transcripts.length,
        totalTimeMs: totalTimeMs.toFixed(2),
        averageTimePerTranscript: (totalTimeMs / transcripts.length).toFixed(2),
        cacheHits: cachedCount,
        maxConcurrent,
        statistics
      }
    });
  }
  
  return { results, statistics };
}
