
import React from "react";
import { TrendingUp } from "lucide-react";
import { SpeechFeedback } from "@/hooks/useVoiceRecognition";
import { useSpeechTrends, TrendMetrics } from "@/hooks/useSpeechTrends";
import TrendIndicator from "./TrendIndicator";

interface SpeechTrendsProps {
  duration: number;
  feedback?: SpeechFeedback;
  metrics: TrendMetrics;
}

const SpeechTrends: React.FC<SpeechTrendsProps> = ({ duration, feedback, metrics }) => {
  const { shouldShow, trendStatus, showWarnings } = useSpeechTrends(duration, feedback, metrics);
  
  if (!shouldShow) return null;
  
  return (
    <div className="p-3 border-t border-border/30">
      <div className="flex items-center mb-2">
        <TrendingUp className="h-4 w-4 mr-2 text-primary" />
        <span className="text-sm font-medium">Speech Trends</span>
      </div>
      
      <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-xs">
        <TrendIndicator 
          label="Pace"
          value={trendStatus.pace}
          showWarning={showWarnings.pace}
        />
        
        <TrendIndicator 
          label="Fillers"
          value={trendStatus.fillers}
          showWarning={showWarnings.fillers}
        />
        
        <TrendIndicator 
          label="Pitch"
          value={trendStatus.pitch}
          showWarning={showWarnings.pitch}
        />
        
        <TrendIndicator 
          label="Volume"
          value={trendStatus.volume}
          showWarning={showWarnings.volume}
        />
      </div>
    </div>
  );
};

export default SpeechTrends;
