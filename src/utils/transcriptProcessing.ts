
/**
 * Speech Transcript Processing Module
 * 
 * This module serves as a compatibility layer for the refactored speech analysis system.
 * It re-exports all speech analysis functions and types from their specialized modules
 * to maintain backward compatibility with existing code that imports from this file.
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
