
/**
 * Type definitions for speech analysis
 */

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
  timestamp?: number; // For caching purposes
  processingTimeMs?: number; // Optional performance metric
};

// Configuration for speech analysis with performance monitoring
export interface SpeechAnalysisConfig {
  logPerformance?: 'none' | 'basic' | 'detailed';
  skipClarity?: boolean;
  skipRhythm?: boolean;
  skipHesitations?: boolean;
  useCache?: boolean;
  cacheTimeMs?: number;
  async?: boolean; // Whether to use async analysis
}
