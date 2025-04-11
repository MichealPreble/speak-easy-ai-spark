import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { SpeechFeedback } from "@/hooks/useVoiceRecognition";
import { Mic, Volume2, AlertTriangle, CheckCircle } from "lucide-react";
import { detectHesitations, analyzeSpokenCadence } from "@/utils/transcriptProcessing";

interface RealTimeFeedbackProps {
  isActive: boolean;
  transcript: string;
  duration: number;
  feedback?: SpeechFeedback;
}

const RealTimeFeedback: React.FC<RealTimeFeedbackProps> = ({
  isActive,
  transcript,
  duration,
  feedback
}) => {
  const [tips, setTips] = useState<string[]>([]);
  
  useEffect(() => {
    if (!isActive || !transcript || transcript.length < 10) return;
    
    const newTips: string[] = [];
    
    // Analyze speech in real-time and provide feedback
    if (feedback) {
      // Check speaking speed
      if (feedback.speed > 180) {
        newTips.push("Try slowing down a bit for better clarity");
      } else if (feedback.speed < 120 && duration > 5) {
        newTips.push("Consider speaking a bit faster to maintain engagement");
      }
      
      // Check for filler words
      if (feedback.fillerWords.length > 0 && feedback.duration > 5) {
        newTips.push(`Watch for filler words like "${feedback.fillerWords.join('", "')}"`);
      }
      
      // Check pitch variation
      if (feedback.pitchVariation < 30 && duration > 8) {
        newTips.push("Try varying your pitch more to sound more engaging");
      }
      
      // Check volume variation
      if (feedback.volumeVariation < 10 && duration > 8) {
        newTips.push("Add more volume variation for emphasis");
      }
    }
    
    // Analyze hesitations
    const hesitations = detectHesitations(transcript);
    if (hesitations.count > 2) {
      newTips.push(`You've repeated words ${hesitations.count} times. Try to speak more fluidly.`);
    }
    
    // Analyze cadence
    const cadenceScore = analyzeSpokenCadence(transcript, duration);
    if (cadenceScore < 5 && duration > 10) {
      newTips.push("Your speech rhythm could be more balanced. Try varying sentence length.");
    }
    
    // Only keep the most recent 3 tips to avoid overwhelming the user
    setTips(newTips.slice(0, 3));
  }, [isActive, transcript, duration, feedback]);

  if (!isActive || tips.length === 0) return null;

  return (
    <div className="fixed bottom-20 right-4 z-50 w-80 bg-background/80 backdrop-blur-md border rounded-lg shadow-lg p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <Mic className="h-5 w-5 text-primary mr-2" />
          <h3 className="font-medium">Real-time Feedback</h3>
        </div>
        <div className="flex space-x-1">
          {isActive && (
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
            </span>
          )}
        </div>
      </div>
      
      <AnimatePresence>
        <ul className="space-y-2">
          {tips.map((tip, index) => (
            <motion.li
              key={`${tip.substring(0, 10)}-${index}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="flex items-start text-sm"
            >
              <AlertTriangle className="h-4 w-4 text-amber-500 mr-2 mt-0.5 flex-shrink-0" />
              <span>{tip}</span>
            </motion.li>
          ))}
        </ul>
      </AnimatePresence>
    </div>
  );
};

export default RealTimeFeedback;
