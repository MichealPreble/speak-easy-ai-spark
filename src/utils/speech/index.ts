
// Import all speech analysis utilities first
import { SpeechFeedback } from "@/hooks/useVoiceRecognition";
import { processTranscript } from "./transcriptCore";
import { analyzeSpokenCadence } from "./cadenceAnalysis";
import { detectHesitations } from "./hesitationAnalysis";
import { analyzeRhythm } from "./rhythmAnalysis";
import { analyzeSpeechClarity } from "./speechClarity";

// Re-export all the functions for backward compatibility
export { 
  processTranscript,
  analyzeSpokenCadence,
  detectHesitations,
  analyzeRhythm,
  analyzeSpeechClarity
};
