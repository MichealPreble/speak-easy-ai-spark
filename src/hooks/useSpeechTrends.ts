
import { useMemo } from "react";
import { SpeechFeedback } from "@/hooks/useVoiceRecognition";

export interface TrendMetrics {
  speed: number | null;
  wordCount: number;
  pitchVariation: number | null;
  fillerWordsCount: number;
}

export interface TrendStatus {
  pace: 'fast' | 'slow' | 'good' | 'n/a';
  fillers: 'many' | 'few';
  pitch: 'monotone' | 'varied';
  volume: 'flat' | 'dynamic';
}

export function useSpeechTrends(
  duration: number,
  feedback?: SpeechFeedback,
  metrics?: TrendMetrics
) {
  const shouldShow = duration > 8 && !!feedback;
  
  const trendStatus = useMemo<TrendStatus>(() => {
    if (!metrics || !feedback) {
      return {
        pace: 'n/a',
        fillers: 'few',
        pitch: 'varied',
        volume: 'dynamic'
      };
    }
    
    return {
      pace: metrics.speed ? (metrics.speed > 160 ? 'fast' : metrics.speed < 120 ? 'slow' : 'good') : 'n/a',
      fillers: metrics.fillerWordsCount > 2 ? 'many' : 'few',
      pitch: feedback.pitchVariation < 20 ? 'monotone' : 'varied',
      volume: feedback.volumeVariation < 15 ? 'flat' : 'dynamic'
    };
  }, [metrics, feedback]);
  
  const showWarnings = useMemo(() => {
    return {
      pace: metrics?.speed && metrics.speed > 160 || metrics?.speed && metrics.speed < 120,
      fillers: metrics?.fillerWordsCount && metrics.fillerWordsCount > 2,
      pitch: feedback?.pitchVariation && feedback.pitchVariation < 20,
      volume: feedback?.volumeVariation && feedback.volumeVariation < 15
    };
  }, [metrics, feedback]);
  
  return {
    shouldShow,
    trendStatus,
    showWarnings
  };
}
