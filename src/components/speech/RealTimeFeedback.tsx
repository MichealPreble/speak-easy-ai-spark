
import React, { useState } from "react";
import { SpeechFeedback } from "@/hooks/useVoiceRecognition";
import { useSpeechFeedback } from "@/hooks/speech-feedback";
import FeedbackHeader from "./FeedbackHeader";
import FeedbackContent from "./FeedbackContent";
import { SpeechInsightsCard } from "./SpeechInsightsCard";
import { CadenceInsightsCard } from "./CadenceInsightsCard";
import { useSpeechInsights } from "@/hooks/speech/useSpeechInsights";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Info, AlertTriangle } from "lucide-react";

interface RealTimeFeedbackProps {
  isActive: boolean;
  transcript: string;
  duration: number;
  feedback?: SpeechFeedback;
  isBrowserSupported?: boolean;
  isPermissionGranted?: boolean | null;
}

const RealTimeFeedback: React.FC<RealTimeFeedbackProps> = ({
  isActive,
  transcript,
  duration,
  feedback,
  isBrowserSupported = true,
  isPermissionGranted = null
}) => {
  const [expanded, setExpanded] = useState(true);
  const { wpm, cadence } = useSpeechInsights(transcript, isActive);
  
  const {
    tips,
    metrics,
    clarityAnalysis,
    metricsHistory,
    hesitationAnalysis,
    calculateScore
  } = useSpeechFeedback(isActive, transcript, duration, feedback);

  if (!isActive && !isBrowserSupported) {
    return (
      <div className="fixed bottom-20 right-4 z-50 w-[95%] max-w-xs sm:max-w-sm md:max-w-md">
        <Alert variant="warning" className="bg-background/95 backdrop-blur-md border">
          <AlertTriangle className="h-5 w-5" />
          <AlertTitle>Browser Compatibility Issue</AlertTitle>
          <AlertDescription>
            Your browser doesn't fully support voice recognition. For the best experience, please use Chrome or Edge.
          </AlertDescription>
        </Alert>
      </div>
    );
  }
  
  if (!isActive && isPermissionGranted === false) {
    return (
      <div className="fixed bottom-20 right-4 z-50 w-[95%] max-w-xs sm:max-w-sm md:max-w-md">
        <Alert variant="destructive" className="bg-background/95 backdrop-blur-md border">
          <AlertTriangle className="h-5 w-5" />
          <AlertTitle>Microphone Access Required</AlertTitle>
          <AlertDescription>
            Please allow microphone access in your browser settings to use voice recognition features.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

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
        <>
          <div className="p-4 space-y-4">
            <SpeechInsightsCard wpm={wpm} />
            <CadenceInsightsCard cadence={cadence} />
          </div>
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
        </>
      )}
    </div>
  );
}

export default RealTimeFeedback;
