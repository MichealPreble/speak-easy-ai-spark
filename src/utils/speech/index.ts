
// Import all speech analysis utilities first
import { SpeechFeedback } from "@/hooks/useVoiceRecognition";
import { processTranscript } from "./transcriptCore";
import { analyzeSpokenCadence } from "./cadenceAnalysis";
import { detectHesitations } from "./hesitationAnalysis";
import { analyzeRhythm } from "./rhythmAnalysis";
import { analyzeSpeechClarity } from "./speechClarity";

// Define types that can be exported from the speech module
export type ClarityScore = {
  score: number;
  rating: 'excellent' | 'good' | 'fair' | 'needs improvement';
  suggestions: string[];
};

export type SpeechAnalysisResult = {
  clarity: ClarityScore;
  pace: number;
  fillerWordCount: number;
  hesitationCount: number;
  rhythmScore: number;
  timestamp?: number; // For caching purposes
};

// Configuration for speech analysis with performance monitoring
export interface SpeechAnalysisConfig {
  logPerformance?: 'none' | 'basic' | 'detailed';
  skipClarity?: boolean;
  skipRhythm?: boolean;
  skipHesitations?: boolean;
  useCache?: boolean;
  cacheTimeMs?: number;
}

// Cache for analysis results to improve performance
const analysisCache = new Map<string, SpeechAnalysisResult>();
const MAX_CACHE_SIZE = 10;

// New unified function to perform full speech analysis
export const analyzeFullSpeech = (
  transcript: string, 
  durationSeconds: number,
  audioAnalysis?: {
    pitchVariation?: number,
    volumeVariation?: number
  },
  config?: SpeechAnalysisConfig
): SpeechAnalysisResult => {
  const startTime = config?.logPerformance !== 'none' ? performance.now() : 0;
  
  // Use configuration with defaults
  const actualConfig = {
    logPerformance: config?.logPerformance || 'none',
    skipClarity: config?.skipClarity || false,
    skipRhythm: config?.skipRhythm || false,
    skipHesitations: config?.skipHesitations || false,
    useCache: config?.useCache || false,
    cacheTimeMs: config?.cacheTimeMs || 5000 // 5 seconds default cache time
  };

  // Generate cache key based on transcript and configuration
  const cacheKey = `${transcript.substring(0, 50)}-${durationSeconds}-${JSON.stringify(actualConfig)}`;
  
  // Check cache if enabled
  if (actualConfig.useCache && analysisCache.has(cacheKey)) {
    const cachedResult = analysisCache.get(cacheKey)!;
    const now = Date.now();
    
    // If cache is still valid based on time
    if (cachedResult.timestamp && (now - cachedResult.timestamp) < actualConfig.cacheTimeMs) {
      if (actualConfig.logPerformance !== 'none') {
        console.log(`Using cached speech analysis result (${(now - cachedResult.timestamp)}ms old)`);
      }
      return cachedResult;
    }
  }
  
  // Timing for each analysis component
  const timings: Record<string, number> = {};
  
  // Get clarity analysis
  let clarity = null;
  if (!actualConfig.skipClarity) {
    const clarityStartTime = performance.now();
    clarity = analyzeSpeechClarity(transcript);
    timings.clarity = performance.now() - clarityStartTime;
  }
  
  // Get pace (words per minute)
  const wordCount = transcript.split(/\s+/).filter(Boolean).length;
  const pace = durationSeconds > 0 ? Math.round((wordCount / durationSeconds) * 60) : 0;
  
  // Get hesitation analysis
  let hesitationAnalysis = { count: 0 };
  if (!actualConfig.skipHesitations) {
    const hesitationStartTime = performance.now();
    hesitationAnalysis = detectHesitations(transcript);
    timings.hesitations = performance.now() - hesitationStartTime;
  }
  
  // Get rhythm analysis - pass both transcript and duration
  let rhythmAnalysis = null;
  if (!actualConfig.skipRhythm) {
    const rhythmStartTime = performance.now();
    rhythmAnalysis = analyzeRhythm(transcript, durationSeconds);
    timings.rhythm = performance.now() - rhythmStartTime;
  }
  
  // Get filler word count
  const fillerWordRegex = /\b(um|uh|like|you know|actually|basically|literally|so|right|well|i mean|kind of|sort of|anyway|whatever|hmm|er)\b/gi;
  const matches = transcript.match(fillerWordRegex);
  const fillerWordCount = matches ? matches.length : 0;
  
  const result: SpeechAnalysisResult = {
    clarity: clarity || {
      score: 0,
      rating: 'needs improvement' as const,
      suggestions: []
    },
    pace,
    fillerWordCount,
    hesitationCount: hesitationAnalysis.count,
    rhythmScore: rhythmAnalysis?.rhythmScore || 0, // Extract just the rhythmScore from the object
    timestamp: Date.now() // Add timestamp for cache invalidation
  };
  
  // Store in cache if enabled
  if (actualConfig.useCache) {
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
  }
  
  // Log performance if enabled
  if (actualConfig.logPerformance !== 'none') {
    const endTime = performance.now();
    
    if (actualConfig.logPerformance === 'basic') {
      console.log(`Speech analysis completed in ${(endTime - startTime).toFixed(2)}ms`);
    } else if (actualConfig.logPerformance === 'detailed') {
      console.log({
        speechAnalysis: {
          totalTime: `${(endTime - startTime).toFixed(2)}ms`,
          transcript: transcript.length > 30 ? `${transcript.substring(0, 30)}...` : transcript,
          wordCount,
          components: {
            clarity: `${timings.clarity?.toFixed(2) || 'skipped'}ms`,
            hesitations: `${timings.hesitations?.toFixed(2) || 'skipped'}ms`,
            rhythm: `${timings.rhythm?.toFixed(2) || 'skipped'}ms`,
          }
        }
      });
    }
  }
  
  return result;
};

// Add an async version for complex analysis scenarios that might benefit from parallelization
export const analyzeFullSpeechAsync = async (
  transcript: string, 
  durationSeconds: number,
  audioAnalysis?: {
    pitchVariation?: number,
    volumeVariation?: number
  },
  config?: SpeechAnalysisConfig
): Promise<SpeechAnalysisResult> => {
  const startTime = config?.logPerformance !== 'none' ? performance.now() : 0;
  
  // Use configuration with defaults
  const actualConfig = {
    logPerformance: config?.logPerformance || 'none',
    skipClarity: config?.skipClarity || false,
    skipRhythm: config?.skipRhythm || false,
    skipHesitations: config?.skipHesitations || false,
    useCache: config?.useCache || false,
    cacheTimeMs: config?.cacheTimeMs || 5000 // 5 seconds default cache time
  };

  // Generate cache key based on transcript and configuration
  const cacheKey = `${transcript.substring(0, 50)}-${durationSeconds}-${JSON.stringify(actualConfig)}`;
  
  // Check cache if enabled
  if (actualConfig.useCache && analysisCache.has(cacheKey)) {
    const cachedResult = analysisCache.get(cacheKey)!;
    const now = Date.now();
    
    // If cache is still valid based on time
    if (cachedResult.timestamp && (now - cachedResult.timestamp) < actualConfig.cacheTimeMs) {
      if (actualConfig.logPerformance !== 'none') {
        console.log(`Using cached speech analysis result (${(now - cachedResult.timestamp)}ms old)`);
      }
      return cachedResult;
    }
  }
  
  try {
    // Run heavy analyses in parallel for better performance
    const timingPromises = {
      clarity: {time: 0, result: null as any},
      hesitations: {time: 0, result: null as any},
      rhythm: {time: 0, result: null as any}
    };
    
    const promises = [];
    
    // Clarity analysis
    if (!actualConfig.skipClarity) {
      const clarityPromise = (async () => {
        const start = performance.now();
        const result = analyzeSpeechClarity(transcript);
        timingPromises.clarity = {
          time: performance.now() - start,
          result
        };
        return result;
      })();
      promises.push(clarityPromise);
    } else {
      promises.push(Promise.resolve(null));
    }
    
    // Hesitation analysis
    if (!actualConfig.skipHesitations) {
      const hesitationsPromise = (async () => {
        const start = performance.now();
        const result = detectHesitations(transcript);
        timingPromises.hesitations = {
          time: performance.now() - start,
          result
        };
        return result;
      })();
      promises.push(hesitationsPromise);
    } else {
      promises.push(Promise.resolve({count: 0}));
    }
    
    // Rhythm analysis
    if (!actualConfig.skipRhythm) {
      const rhythmPromise = (async () => {
        const start = performance.now();
        const result = analyzeRhythm(transcript, durationSeconds);
        timingPromises.rhythm = {
          time: performance.now() - start,
          result
        };
        return result;
      })();
      promises.push(rhythmPromise);
    } else {
      promises.push(Promise.resolve(null));
    }
    
    const [clarityResult, hesitationsResult, rhythmResult] = await Promise.all(promises);
    
    // Get pace (words per minute)
    const wordCount = transcript.split(/\s+/).filter(Boolean).length;
    const pace = durationSeconds > 0 ? Math.round((wordCount / durationSeconds) * 60) : 0;
    
    // Get filler word count
    const fillerWordRegex = /\b(um|uh|like|you know|actually|basically|literally|so|right|well|i mean|kind of|sort of|anyway|whatever|hmm|er)\b/gi;
    const matches = transcript.match(fillerWordRegex);
    const fillerWordCount = matches ? matches.length : 0;
    
    const result: SpeechAnalysisResult = {
      clarity: clarityResult || {
        score: 0,
        rating: 'needs improvement' as const,
        suggestions: []
      },
      pace,
      fillerWordCount,
      hesitationCount: hesitationsResult.count,
      rhythmScore: rhythmResult?.rhythmScore || 0,
      timestamp: Date.now() // Add timestamp for cache invalidation
    };
    
    // Store in cache if enabled
    if (actualConfig.useCache) {
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
    }
    
    // Log performance if enabled
    if (actualConfig.logPerformance !== 'none') {
      const endTime = performance.now();
      
      if (actualConfig.logPerformance === 'basic') {
        console.log(`Async speech analysis completed in ${(endTime - startTime).toFixed(2)}ms`);
      } else if (actualConfig.logPerformance === 'detailed') {
        console.log({
          asyncSpeechAnalysis: {
            totalTime: `${(endTime - startTime).toFixed(2)}ms`,
            transcript: transcript.length > 30 ? `${transcript.substring(0, 30)}...` : transcript,
            wordCount,
            components: {
              clarity: `${timingPromises.clarity.time.toFixed(2) || 'skipped'}ms`,
              hesitations: `${timingPromises.hesitations.time.toFixed(2) || 'skipped'}ms`,
              rhythm: `${timingPromises.rhythm.time.toFixed(2) || 'skipped'}ms`,
            },
            parallelGain: 'Enabled'
          }
        });
      }
    }
    
    return result;
  } catch (error) {
    console.error('Error during speech analysis:', error);
    throw new Error(`Speech analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

// Re-export all the functions for backward compatibility
export { 
  processTranscript,
  analyzeSpokenCadence,
  detectHesitations,
  analyzeRhythm,
  analyzeSpeechClarity
};
