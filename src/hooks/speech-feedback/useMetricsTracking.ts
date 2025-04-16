
import { useState, useEffect } from "react";
import { SpeechMetrics, SpeechFeedbackOptions, MetricHistoryPoint } from "./types";
import { detectHesitations, analyzeSpeechClarity } from "@/utils/speech";

/**
 * Hook for tracking speech metrics and history
 */
export function useMetricsTracking({ isActive, transcript, duration, feedback }: SpeechFeedbackOptions) {
  const [metrics, setMetrics] = useState<SpeechMetrics>({
    speed: null,
    wordCount: 0,
    pitchVariation: null,
    fillerWordsCount: 0
  });
  
  const [metricsHistory, setMetricsHistory] = useState<MetricHistoryPoint[]>([]);
  
  const [clarityAnalysis, setClarityAnalysis] = useState<{
    score: number;
    rating: 'excellent' | 'good' | 'fair' | 'needs improvement';
    suggestions: string[];
  }>({
    score: 0,
    rating: 'fair',
    suggestions: []
  });
  
  const [hesitationAnalysis, setHesitationAnalysis] = useState<{
    count: number;
    percentage: number;
    patterns: string[];
  }>({
    count: 0,
    percentage: 0,
    patterns: []
  });
  
  // Track metrics history every 3 seconds
  useEffect(() => {
    if (!isActive) {
      setMetricsHistory([]);
      return;
    }
    
    const interval = setInterval(() => {
      if (duration > 2 && feedback) {
        // Get the latest hesitation analysis
        const currentHesitations = detectHesitations(transcript);
        
        setMetricsHistory(prev => {
          const newHistory = [...prev];
          if (newHistory.length >= 20) {
            newHistory.shift();
          }
          
          newHistory.push({
            pace: feedback.speed,
            clarity: clarityAnalysis.score,
            hesitations: currentHesitations.count,
            fillerWords: feedback.fillerWords.length,
            timestamp: Date.now()
          });
          
          return newHistory;
        });
      }
    }, 3000);
    
    return () => clearInterval(interval);
  }, [isActive, duration, feedback, clarityAnalysis.score, transcript]);
  
  // Update metrics based on feedback
  useEffect(() => {
    if (!isActive || !transcript || transcript.length < 10) {
      return;
    }
    
    const newMetrics = { 
      speed: feedback?.speed || null,
      wordCount: transcript.split(/\s+/).filter(Boolean).length,
      pitchVariation: feedback?.pitchVariation || null,
      fillerWordsCount: feedback?.fillerWords.length || 0
    };
    
    setMetrics(newMetrics);
    
    if (transcript.length > 20) {
      const clarity = analyzeSpeechClarity(transcript);
      setClarityAnalysis(clarity);
      
      // Analyze hesitations
      const hesitations = detectHesitations(transcript);
      setHesitationAnalysis(hesitations);
    }
  }, [isActive, transcript, duration, feedback]);

  return {
    metrics,
    metricsHistory,
    clarityAnalysis,
    hesitationAnalysis
  };
}
