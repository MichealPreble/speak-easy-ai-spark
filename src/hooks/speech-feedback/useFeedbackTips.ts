
import { useState, useEffect } from "react";
import { SpeechFeedbackOptions } from "./types";
import { detectHesitations, analyzeSpokenCadence } from "@/utils/speech";

/**
 * Hook for generating feedback tips based on speech analysis
 */
export function useFeedbackTips({ isActive, transcript, duration, feedback }: SpeechFeedbackOptions) {
  const [tips, setTips] = useState<string[]>([]);
  
  // Update tips based on speech analysis
  useEffect(() => {
    if (!isActive || !transcript || transcript.length < 10) {
      setTips([]);
      return;
    }
    
    const newTips: string[] = [];
    
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
    
    // Add hesitation-specific tips
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

  return { tips };
}
