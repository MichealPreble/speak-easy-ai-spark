
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

// Re-export all the types and functions
export type { 
  SpeechAnalysisResult, 
  SpeechAnalysisConfig, 
  ClarityScore 
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
  analyzeFullSpeechAsync
};
