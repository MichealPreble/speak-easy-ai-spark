
import { SpeechAnalysisConfig } from './types';
import { analyzeFullSpeech } from './syncAnalysis';
import { analyzeFullSpeechAsync } from './asyncAnalysis';

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
  config: SpeechAnalysisConfig & { useCache?: boolean; async?: boolean } = {}
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
  const useAsync = config.async !== false;
  
  // Validate inputs
  if (!sampleText || typeof sampleText !== 'string') {
    throw new Error("Benchmark error: Sample text must be a non-empty string");
  }
  
  if (typeof duration !== 'number' || duration <= 0) {
    throw new Error("Benchmark error: Duration must be a positive number");
  }
  
  if (!Number.isInteger(iterations) || iterations < 1) {
    throw new Error("Benchmark error: Iterations must be a positive integer");
  }
  
  const startTime = performance.now();
  
  for (let i = 0; i < iterations; i++) {
    const iterStartTime = performance.now();
    
    // Run the analysis
    const result = await (useAsync ? 
      analyzeFullSpeechAsync(sampleText, duration, null, { ...config, useCache }) : 
      analyzeFullSpeech(sampleText, duration, null, { ...config, useCache }));
    
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
