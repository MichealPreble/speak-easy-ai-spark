
import { SpeechFeedback } from "@/hooks/useVoiceRecognition";
import { processTranscript } from "./speech/transcriptCore";
import { analyzeSpokenCadence } from "./speech/cadenceAnalysis";
import { detectHesitations } from "./speech/hesitationAnalysis";
import { analyzeRhythm } from "./speech/rhythmAnalysis";
import { analyzeSpeechClarity } from "./speech/speechClarity";

// Re-export all the functions for backward compatibility
export { 
  processTranscript,
  analyzeSpokenCadence,
  detectHesitations,
  analyzeRhythm,
  analyzeSpeechClarity
};
