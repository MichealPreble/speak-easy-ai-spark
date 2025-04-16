
/**
 * Types for speech feedback functionality
 */

export interface SpeechMetrics {
  speed: number | null;
  wordCount: number;
  pitchVariation: number | null;
  fillerWordsCount: number;
}

export interface ClarityAnalysis {
  score: number;
  rating: 'excellent' | 'good' | 'fair' | 'needs improvement';
  suggestions: string[];
}

export interface HesitationAnalysis {
  count: number;
  percentage: number;
  patterns: string[];
}

export interface MetricHistoryPoint {
  pace?: number;
  clarity?: number;
  hesitations?: number;
  fillerWords?: number;
  timestamp?: number;
}

export interface SpeechFeedbackOptions {
  isActive: boolean;
  transcript: string;
  duration: number;
  feedback?: SpeechFeedback;
}

export interface SpeechFeedback {
  speed: number;
  duration: number;
  fillerWords: string[];
  wordCount: number;
  pitchVariation: number;
  volumeVariation: number;
}
