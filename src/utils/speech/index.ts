
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

// New unified function to perform full speech analysis
export const analyzeFullSpeech = (
  transcript: string, 
  durationSeconds: number,
  audioAnalysis?: {
    pitchVariation?: number,
    volumeVariation?: number
  }
): SpeechAnalysisResult => {
  // Get clarity analysis
  const clarity = analyzeSpeechClarity(transcript);
  
  // Get pace (words per minute)
  const wordCount = transcript.split(/\s+/).filter(Boolean).length;
  const pace = durationSeconds > 0 ? Math.round((wordCount / durationSeconds) * 60) : 0;
  
  // Get hesitation analysis
  const hesitationAnalysis = detectHesitations(transcript);
  
  // Get rhythm score
  const rhythmScore = analyzeRhythm(transcript);
  
  // Get filler word count
  const fillerWordRegex = /\b(um|uh|like|you know|actually|basically|literally|so|right|well|i mean|kind of|sort of|anyway|whatever|hmm|er)\b/gi;
  const matches = transcript.match(fillerWordRegex);
  const fillerWordCount = matches ? matches.length : 0;
  
  return {
    clarity,
    pace,
    fillerWordCount,
    hesitationCount: hesitationAnalysis.count,
    rhythmScore
  };
};

// Re-export all the functions for backward compatibility
export { 
  processTranscript,
  analyzeSpokenCadence,
  detectHesitations,
  analyzeRhythm,
  analyzeSpeechClarity
};
