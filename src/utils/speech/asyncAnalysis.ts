
import { SpeechAnalysisResult, SpeechAnalysisConfig } from './types';
import { analyzeSpeechClarity } from './speechClarity';
import { detectHesitations } from './hesitationAnalysis';
import { analyzeRhythm } from './rhythmAnalysis';
import { getCachedAnalysis, cacheAnalysisResult } from './analysisCache';

/**
 * Asynchronous function to perform full speech analysis
 */
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
      cacheAnalysisResult(cacheKey, result);
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
