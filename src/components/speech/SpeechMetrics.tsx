
import React from "react";
import { Clock, Monitor, Activity, Volume2, Hash, PauseCircle } from "lucide-react";

interface SpeechMetricsProps {
  duration: number;
  speed: number | null;
  wordCount: number;
  fillerWordsCount: number;
  hesitationsCount?: number;
  hesitationsPercentage?: number;
}

const SpeechMetrics: React.FC<SpeechMetricsProps> = ({
  duration,
  speed,
  wordCount,
  fillerWordsCount,
  hesitationsCount,
  hesitationsPercentage
}) => {
  return (
    <div className="grid grid-cols-2 gap-2 p-3">
      <div className="flex items-center">
        <Clock className="w-4 h-4 mr-2 text-muted-foreground" />
        <div>
          <div className="text-xs font-medium">Duration</div>
          <div className="text-sm">{duration.toFixed(0)}s</div>
        </div>
      </div>
      
      <div className="flex items-center">
        <Activity className="w-4 h-4 mr-2 text-muted-foreground" />
        <div>
          <div className="text-xs font-medium">Pace</div>
          <div className="text-sm">{speed || 0} WPM</div>
        </div>
      </div>
      
      <div className="flex items-center">
        <Hash className="w-4 h-4 mr-2 text-muted-foreground" />
        <div>
          <div className="text-xs font-medium">Words</div>
          <div className="text-sm">{wordCount}</div>
        </div>
      </div>
      
      <div className="flex items-center">
        <Volume2 className="w-4 h-4 mr-2 text-muted-foreground" />
        <div>
          <div className="text-xs font-medium">Fillers</div>
          <div className="text-sm">{fillerWordsCount}</div>
        </div>
      </div>
      
      {hesitationsCount !== undefined && (
        <div className="flex items-center col-span-2">
          <PauseCircle className="w-4 h-4 mr-2 text-muted-foreground" />
          <div>
            <div className="text-xs font-medium">Hesitations</div>
            <div className="text-sm">
              {hesitationsCount} 
              {hesitationsPercentage !== undefined && hesitationsPercentage > 0 && 
                <span className="text-xs text-muted-foreground ml-1">
                  ({hesitationsPercentage}% of speech)
                </span>
              }
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SpeechMetrics;
