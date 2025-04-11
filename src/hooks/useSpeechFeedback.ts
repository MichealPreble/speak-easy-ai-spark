
import { useState, useEffect } from "react";
import { SpeechFeedback } from "@/hooks/useVoiceRecognition";
import { detectHesitations, analyzeSpokenCadence, analyzeSpeechClarity } from "@/utils/speech";

export function useSpeechFeedback(isActive: boolean, transcript: string, duration: number, feedback?: SpeechFeedback) {
  const [tips, setTips] = useState<string[]>([]);
  const [metrics, setMetrics] = useState<{
    speed: number | null;
    wordCount: number;
    pitchVariation: number | null;
    fillerWordsCount: number;
  }>({
    speed: null,
    wordCount: 0,
    pitchVariation: null,
    fillerWordsCount: 0
  });
  
  const [clarityAnalysis, setClarityAnalysis] = useState<{
    score: number;
    rating: 'excellent' | 'good' | 'fair' | 'needs improvement';
    suggestions: string[];
  }>({
    score: 0,
    rating: 'fair',
    suggestions: []
  });
  
  const [metricsHistory, setMetricsHistory] = useState<Array<{
    pace?: number;
    clarity?: number;
    hesitations?: number;
    fillerWords?: number;
    timestamp?: number;
  }>>([]);
  
  const calculateScore = (feedbackData?: SpeechFeedback): number => {
    if (!feedbackData) return 0;
    
    let score = 10; // Start with perfect score
    
    // Deduct for too fast or too slow
    if (feedbackData.speed > 180) score -= 2;
    else if (feedbackData.speed < 120 && duration > 5) score -= 1;
    
    // Deduct for filler words
    score -= Math.min(3, feedbackData.fillerWords.length * 0.5);
    
    // Deduct for low pitch variation
    if (feedbackData.pitchVariation < 30 && duration > 5) score -= 2;
    
    // Deduct for hesitations
    const hesitations = detectHesitations(transcript);
    if (hesitations.count > 2) score -= hesitations.count * 0.5;
    
    // Ensure score is between 1-10
    return Math.max(1, Math.min(10, Math.round(score)));
  };
  
  // Track metrics history every 3 seconds
  useEffect(() => {
    if (!isActive) {
      setMetricsHistory([]);
      return;
    }
    
    const interval = setInterval(() => {
      if (duration > 2 && feedback) {
        setMetricsHistory(prev => {
          const newHistory = [...prev];
          if (newHistory.length >= 20) {
            newHistory.shift();
          }
          
          newHistory.push({
            pace: feedback.speed,
            clarity: clarityAnalysis.score,
            hesitations: detectHesitations(transcript).count,
            fillerWords: feedback.fillerWords.length,
            timestamp: Date.now()
          });
          
          return newHistory;
        });
      }
    }, 3000);
    
    return () => clearInterval(interval);
  }, [isActive, duration, feedback, clarityAnalysis.score, transcript]);
  
  // Update tips and metrics
  useEffect(() => {
    if (!isActive || !transcript || transcript.length < 10) {
      setTips([]);
      return;
    }
    
    const newTips: string[] = [];
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
    }
    
    if (feedback) {
      if (feedback.speed > 180) {
        newTips.push("Try slowing down a bit for better clarity");
      } else if (feedback.speed < 120 && duration > 5) {
        newTips.push("Consider speaking a bit faster to maintain engagement");
      }
      
      if (feedback.fillerWords.length > 0 && feedback.duration > 5) {
        newTips.push(`Watch for filler words like "${feedback.fillerWords.join('", "')}"`);
      }
      
      if (feedback.pitchVariation < 30 && duration > 8) {
        newTips.push("Try varying your pitch more to sound more engaging");
      }
      
      if (feedback.volumeVariation < 10 && duration > 8) {
        newTips.push("Add more volume variation for emphasis");
      }
    }
    
    const hesitations = detectHesitations(transcript);
    if (hesitations.count > 2) {
      newTips.push(`You've repeated words ${hesitations.count} times. Try to speak more fluidly.`);
    }
    
    const cadenceScore = analyzeSpokenCadence(transcript, duration);
    if (cadenceScore < 5 && duration > 10) {
      newTips.push("Your speech rhythm could be more balanced. Try varying sentence length.");
    }
    
    setTips(newTips.slice(0, 3));
  }, [isActive, transcript, duration, feedback]);

  return {
    tips,
    metrics,
    clarityAnalysis,
    metricsHistory,
    calculateScore
  };
}
