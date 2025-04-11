
import React from "react";
import { Headphones, Clock, Volume2, PauseCircle } from "lucide-react";

interface ChartInsightsProps {
  insights: {
    avgClarity: string;
    avgPace: string;
    avgRhythm: string;
    totalFillerWords: number;
    totalHesitations: number;
    clarityTrend: number;
    paceTrend: number;
    sessions: number;
  } | null;
}

const ChartInsights: React.FC<ChartInsightsProps> = ({ insights }) => {
  if (!insights) return null;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 mt-4 gap-2 text-center">
      <div className="bg-primary/5 rounded-md p-2">
        <div className="text-xs text-muted-foreground mb-1 flex items-center justify-center">
          <Headphones className="h-3 w-3 mr-1" /> Clarity
        </div>
        <div className="font-medium">{insights.avgClarity}</div>
      </div>
      <div className="bg-primary/5 rounded-md p-2">
        <div className="text-xs text-muted-foreground mb-1 flex items-center justify-center">
          <Clock className="h-3 w-3 mr-1" /> Pace
        </div>
        <div className="font-medium">{insights.avgPace} WPM</div>
      </div>
      <div className="bg-primary/5 rounded-md p-2">
        <div className="text-xs text-muted-foreground mb-1 flex items-center justify-center">
          <Volume2 className="h-3 w-3 mr-1" /> Rhythm
        </div>
        <div className="font-medium">{insights.avgRhythm}</div>
      </div>
      <div className="bg-primary/5 rounded-md p-2">
        <div className="text-xs text-muted-foreground mb-1 flex items-center justify-center">
          <PauseCircle className="h-3 w-3 mr-1" /> Hesitations
        </div>
        <div className="font-medium">{insights.totalHesitations}</div>
      </div>
    </div>
  );
};

export default ChartInsights;
