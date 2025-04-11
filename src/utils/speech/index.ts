
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

// Configuration for speech analysis with performance monitoring
export interface SpeechAnalysisConfig {
  logPerformance?: boolean;
  skipClarity?: boolean;
  skipRhythm?: boolean;
  skipHesitations?: boolean;
}

// New unified function to perform full speech analysis
export const analyzeFullSpeech = (
  transcript: string, 
  durationSeconds: number,
  audioAnalysis?: {
    pitchVariation?: number,
    volumeVariation?: number
  },
  config?: SpeechAnalysisConfig
): SpeechAnalysisResult => {
  const startTime = config?.logPerformance ? performance.now() : 0;
  
  // Get clarity analysis
  const clarity = config?.skipClarity ? null : analyzeSpeechClarity(transcript);
  
  // Get pace (words per minute)
  const wordCount = transcript.split(/\s+/).filter(Boolean).length;
  const pace = durationSeconds > 0 ? Math.round((wordCount / durationSeconds) * 60) : 0;
  
  // Get hesitation analysis
  const hesitationAnalysis = config?.skipHesitations ? { count: 0 } : detectHesitations(transcript);
  
  // Get rhythm analysis - pass both transcript and duration
  const rhythmAnalysis = config?.skipRhythm ? null : analyzeRhythm(transcript, durationSeconds);
  
  // Get filler word count
  const fillerWordRegex = /\b(um|uh|like|you know|actually|basically|literally|so|right|well|i mean|kind of|sort of|anyway|whatever|hmm|er)\b/gi;
  const matches = transcript.match(fillerWordRegex);
  const fillerWordCount = matches ? matches.length : 0;
  
  const result = {
    clarity: clarity || {
      score: 0,
      rating: 'needs improvement' as const,
      suggestions: []
    },
    pace,
    fillerWordCount,
    hesitationCount: hesitationAnalysis.count,
    rhythmScore: rhythmAnalysis?.rhythmScore || 0 // Extract just the rhythmScore from the object
  };
  
  // Log performance if enabled
  if (config?.logPerformance) {
    const endTime = performance.now();
    console.log(`Speech analysis completed in ${(endTime - startTime).toFixed(2)}ms`);
    
    // Detailed performance breakdown
    if (endTime - startTime > 100) {
      console.log('Performance warning: Speech analysis took longer than 100ms');
      console.log(`Speech length: ${transcript.length} chars, ${wordCount} words`);
      console.log(`Analysis components: clarity=${!config?.skipClarity}, rhythm=${!config?.skipRhythm}, hesitations=${!config?.skipHesitations}`);
    }
  }
  
  return result;
};

// Add an async version for complex analysis scenarios that might benefit from parallelization
export const analyzeFullSpeechAsync = async (
  transcript: string, 
  durationSeconds: number,
  audioAnalysis?: {
    pitchVariation?: number,
    volumeVariation?: number
  },
  config?: SpeechAnalysisConfig
): Promise<SpeechAnalysisResult> => {
  const startTime = config?.logPerformance ? performance.now() : 0;
  
  try {
    // Run heavy analyses in parallel
    const [clarityPromise, hesitationsPromise, rhythmPromise] = await Promise.all([
      config?.skipClarity ? Promise.resolve(null) : Promise.resolve(analyzeSpeechClarity(transcript)),
      config?.skipHesitations ? Promise.resolve({ count: 0 }) : Promise.resolve(detectHesitations(transcript)),
      config?.skipRhythm ? Promise.resolve(null) : Promise.resolve(analyzeRhythm(transcript, durationSeconds))
    ]);
    
    // Get pace (words per minute)
    const wordCount = transcript.split(/\s+/).filter(Boolean).length;
    const pace = durationSeconds > 0 ? Math.round((wordCount / durationSeconds) * 60) : 0;
    
    // Get filler word count
    const fillerWordRegex = /\b(um|uh|like|you know|actually|basically|literally|so|right|well|i mean|kind of|sort of|anyway|whatever|hmm|er)\b/gi;
    const matches = transcript.match(fillerWordRegex);
    const fillerWordCount = matches ? matches.length : 0;
    
    const result = {
      clarity: clarityPromise || {
        score: 0,
        rating: 'needs improvement' as const,
        suggestions: []
      },
      pace,
      fillerWordCount,
      hesitationCount: hesitationsPromise.count,
      rhythmScore: rhythmPromise?.rhythmScore || 0
    };
    
    // Log performance if enabled
    if (config?.logPerformance) {
      const endTime = performance.now();
      console.log(`Async speech analysis completed in ${(endTime - startTime).toFixed(2)}ms`);
    }
    
    return result;
  } catch (error) {
    console.error('Error during speech analysis:', error);
    throw new Error(`Speech analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

// Re-export all the functions for backward compatibility
export { 
  processTranscript,
  analyzeSpokenCadence,
  detectHesitations,
  analyzeRhythm,
  analyzeSpeechClarity
};
