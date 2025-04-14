
import React, { useState } from "react";
import { SpeechFeedback } from "@/hooks/useVoiceRecognition";
import { useSpeechFeedback } from "@/hooks/useSpeechFeedback";
import FeedbackHeader from "./FeedbackHeader";
import FeedbackContent from "./FeedbackContent";

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
  const [expanded, setExpanded] = useState(true);
  
  const {
    tips,
    metrics,
    clarityAnalysis,
    metricsHistory,
    hesitationAnalysis,
    calculateScore
  } = useSpeechFeedback(isActive, transcript, duration, feedback);

  if (!isActive) return null;

  const speechScore = calculateScore(feedback);

  return (
    <div className="fixed bottom-20 right-4 z-50 w-[95%] max-w-xs sm:max-w-sm md:max-w-md bg-background/95 backdrop-blur-md border rounded-lg shadow-lg overflow-hidden dark:bg-black/90 sm:w-80">
      <FeedbackHeader 
        isActive={isActive}
        expanded={expanded}
        toggleExpanded={() => setExpanded(!expanded)}
      />
      
      {expanded && (
        <FeedbackContent 
          isActive={isActive}
          duration={duration}
          feedback={feedback}
          tips={tips}
          metrics={metrics}
          clarityAnalysis={clarityAnalysis}
          hesitationAnalysis={hesitationAnalysis}
          metricsHistory={metricsHistory}
          speechScore={speechScore}
        />
      )}
    </div>
  );
};

export default RealTimeFeedback;
