
// Import all speech analysis utilities first
import { SpeechFeedback } from "@/hooks/useVoiceRecognition";
import { processTranscript } from "./transcriptCore";
import { analyzeSpokenCadence } from "./cadenceAnalysis";
import { detectHesitations } from "./hesitationAnalysis";
import { analyzeRhythm } from "./rhythmAnalysis";
import { analyzeSpeechClarity } from "./speechClarity";

// Define types that can be exported from the speech module
export type ClarityScore = {
  score: number;
  rating: 'excellent' | 'good' | 'fair' | 'needs improvement';
  suggestions: string[];
};

export type SpeechAnalysisResult = {
  clarity: ClarityScore;
  pace: number;
  fillerWordCount: number;
  hesitationCount: number;
  rhythmScore: number;
};

// Re-export all the functions for backward compatibility
export { 
  processTranscript,
  analyzeSpokenCadence,
  detectHesitations,
  analyzeRhythm,
  analyzeSpeechClarity
};
