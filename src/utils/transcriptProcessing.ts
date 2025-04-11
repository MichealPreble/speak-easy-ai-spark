
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
import { getCachedAnalysis, cacheAnalysisResult, clearAnalysisCache, getCacheSize } from "./speech/analysisCache";
import { processTranscriptBatch } from "./speech/batchProcessing";
import { benchmarkSpeechAnalysis } from "./speech/benchmarking";
import { getCacheStatistics, isAnalysisCached } from "./speech/cacheStatistics";
import { validateSpeechInput } from "./speech/validation";

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
  
  // Cache management
  getCachedAnalysis,
  cacheAnalysisResult,
  clearAnalysisCache,
  getCacheSize,
  
  // Batch processing
  processTranscriptBatch,
  
  // Benchmarking
  benchmarkSpeechAnalysis,
  
  // Cache statistics
  getCacheStatistics,
  isAnalysisCached,
  
  // Validation
  validateSpeechInput,
  
  // Types
  type SpeechAnalysisResult,
  type SpeechAnalysisConfig,
  type ClarityScore
};

// Export the SpeechFeedback type for convenience
export type { SpeechFeedback };

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
