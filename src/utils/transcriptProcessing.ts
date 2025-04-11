
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
