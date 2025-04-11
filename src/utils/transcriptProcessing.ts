
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

// Re-export all the functions and types for backward compatibility
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
