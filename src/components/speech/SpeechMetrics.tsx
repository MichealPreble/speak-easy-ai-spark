
import React from "react";
import { Clock, MessageCircle, Gauge, Activity } from "lucide-react";

interface SpeechMetricsProps {
  duration: number;
  speed: number | null;
  wordCount: number;
  fillerWordsCount: number;
}

const SpeechMetrics: React.FC<SpeechMetricsProps> = ({
  duration,
  speed,
  wordCount,
  fillerWordsCount
}) => {
  return (
    <div className="grid grid-cols-2 gap-2 p-3 bg-muted/30">
      <div className="flex items-center text-sm">
        <Clock className="h-4 w-4 mr-1.5 text-primary/70" />
        <span>Duration: {Math.round(duration)}s</span>
      </div>
      
      {speed !== null && (
        <div className="flex items-center text-sm">
          <Gauge className="h-4 w-4 mr-1.5 text-primary/70" />
          <span>Pace: {speed} wpm</span>
        </div>
      )}
      
      <div className="flex items-center text-sm">
        <MessageCircle className="h-4 w-4 mr-1.5 text-primary/70" />
        <span>Words: {wordCount}</span>
      </div>
      
      {fillerWordsCount > 0 && (
        <div className="flex items-center text-sm">
          <Activity className="h-4 w-4 mr-1.5 text-primary/70" />
          <span>Fillers: {fillerWordsCount}</span>
        </div>
      )}
    </div>
  );
};

export default SpeechMetrics;
