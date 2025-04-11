
// Re-export all types and functions from the refactored files
import { SpeechFeedback } from "@/hooks/useVoiceRecognition";
import { processTranscript } from "./transcriptCore";
import { analyzeSpokenCadence } from "./cadenceAnalysis";
import { detectHesitations } from "./hesitationAnalysis";
import { analyzeRhythm } from "./rhythmAnalysis";
import { analyzeSpeechClarity } from "./speechClarity";
import { analyzeFullSpeech } from "./syncAnalysis";
import { analyzeFullSpeechAsync } from "./asyncAnalysis";
import { SpeechAnalysisResult, SpeechAnalysisConfig, ClarityScore } from "./types";
import { getCachedAnalysis, cacheAnalysisResult, clearAnalysisCache, getCacheSize } from "./analysisCache";
import { processTranscriptBatch } from "./batchProcessing";
import { benchmarkSpeechAnalysis } from "./benchmarking";
import { getCacheStatistics, isAnalysisCached } from "./cacheStatistics";
import { validateSpeechInput } from "./validation";

// Re-export all the types and functions
export type { 
  SpeechAnalysisResult, 
  SpeechAnalysisConfig, 
  ClarityScore,
  SpeechFeedback
};

export { 
  // Core speech analysis functions
  processTranscript,
  analyzeSpokenCadence,
  detectHesitations,
  analyzeRhythm,
  analyzeSpeechClarity,
  
  // Full analysis functions (both sync and async)
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
  validateSpeechInput
};
