
import { SpeechAnalysisResult, SpeechAnalysisConfig } from './types';
import { analyzeSpeechClarity } from './speechClarity';
import { detectHesitations } from './hesitationAnalysis';
import { analyzeRhythm } from './rhythmAnalysis';
import { getCachedAnalysis, cacheAnalysisResult } from './analysisCache';

/**
 * Synchronous function to perform full speech analysis
 */
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
  if (actualConfig.useCache) {
    const cachedResult = getCachedAnalysis(cacheKey, actualConfig.cacheTimeMs);
    if (cachedResult) {
      if (actualConfig.logPerformance !== 'none') {
        const now = Date.now();
        console.log(`Using cached speech analysis result (${(now - (cachedResult.timestamp || 0))}ms old)`);
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
    cacheAnalysisResult(cacheKey, result);
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
