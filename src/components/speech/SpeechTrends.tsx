
import React from "react";
import { TrendingUp } from "lucide-react";
import { SpeechFeedback } from "@/hooks/useVoiceRecognition";

interface SpeechTrendsProps {
  duration: number;
  feedback?: SpeechFeedback;
  metrics: {
    speed: number | null;
    wordCount: number;
    pitchVariation: number | null;
    fillerWordsCount: number;
  };
}

const SpeechTrends: React.FC<SpeechTrendsProps> = ({ duration, feedback, metrics }) => {
  if (duration <= 8 || !feedback) return null;
  
  return (
    <div className="p-3 border-t border-border/30">
      <div className="flex items-center mb-2">
        <TrendingUp className="h-4 w-4 mr-2 text-primary" />
        <span className="text-sm font-medium">Speech Trends</span>
      </div>
      
      <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-xs">
        <div className={`flex items-center ${metrics.speed && metrics.speed > 160 ? 'text-amber-500' : 'text-muted-foreground'}`}>
          <span className="w-3 h-3 rounded-full mr-1.5 bg-current opacity-70"></span>
          Pace: {metrics.speed ? (metrics.speed > 160 ? 'Fast' : metrics.speed < 120 ? 'Slow' : 'Good') : 'N/A'}
        </div>
        
        <div className={`flex items-center ${metrics.fillerWordsCount > 2 ? 'text-amber-500' : 'text-muted-foreground'}`}>
          <span className="w-3 h-3 rounded-full mr-1.5 bg-current opacity-70"></span>
          Fillers: {metrics.fillerWordsCount > 2 ? 'Many' : 'Few'}
        </div>
        
        <div className={`flex items-center ${feedback.pitchVariation < 20 ? 'text-amber-500' : 'text-muted-foreground'}`}>
          <span className="w-3 h-3 rounded-full mr-1.5 bg-current opacity-70"></span>
          Pitch: {feedback.pitchVariation < 20 ? 'Monotone' : 'Varied'}
        </div>
        
        <div className={`flex items-center ${feedback.volumeVariation < 15 ? 'text-amber-500' : 'text-muted-foreground'}`}>
          <span className="w-3 h-3 rounded-full mr-1.5 bg-current opacity-70"></span>
          Volume: {feedback.volumeVariation < 15 ? 'Flat' : 'Dynamic'}
        </div>
      </div>
    </div>
  );
};

export default SpeechTrends;
