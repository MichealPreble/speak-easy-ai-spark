
/**
 * Type definitions for speech analysis
 */

export type ClarityScore = {
  score: number;
  rating: 'excellent' | 'good' | 'fair' | 'needs improvement';
  suggestions: string[];
};

export type ProcessingMetrics = {
  startTime?: number;
  endTime?: number;
  processingTimeMs?: number;
  cacheHit?: boolean;
  deviceInfo?: {
    platform?: string;
    browser?: string;
    isMobile?: boolean;
    connectionType?: string;
  };
};

export type SpeechAnalysisResult = {
  clarity: ClarityScore;
  pace: number;
  fillerWordCount: number;
  hesitationCount: number;
  rhythmScore: number;
  timestamp?: number; // For caching purposes
  metrics?: ProcessingMetrics; // Enhanced performance metrics
};

// Batch processing statistics for multiple analyses
export type BatchStatistics = {
  totalAnalyses: number;
  totalProcessingTimeMs: number;
  averageProcessingTimeMs: number;
  cacheHitCount: number;
  cacheHitRatio: number;
  slowestAnalysisMs: number;
  fastestAnalysisMs: number;
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
  collectDeviceInfo?: boolean; // Whether to collect device info
  batchSize?: number; // For batch processing
}

// For caching purposes with enhanced statistics
export interface CacheStatistics {
  size: number;
  hitCount: number;
  missCount: number;
  hitRatio: number;
  oldestEntryAgeMs: number;
  newestEntryAgeMs: number;
  averageEntryAgeMs: number;
  averageProcessingTimeMs: number;
  evictionCount: number;
}
