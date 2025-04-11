
import React from "react";
import { SpeechAnalysisResult } from "@/utils/speech/types";

interface StatsPanelProps {
  data: SpeechAnalysisResult[];
}

const StatsPanel: React.FC<StatsPanelProps> = ({ data }) => {
  if (data.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        No speech analysis data available for this timeframe.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <h3 className="text-lg font-medium mb-3">Speech Quality Statistics</h3>
        <div className="space-y-4">
          <div>
            <div className="text-sm font-medium mb-1">Average Clarity Score</div>
            <div className="text-2xl">
              {(data.reduce((sum, item) => sum + item.clarity.score, 0) / data.length).toFixed(1)}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              Out of 10 possible points
            </div>
          </div>
          <div>
            <div className="text-sm font-medium mb-1">Average Pace</div>
            <div className="text-2xl">
              {(data.reduce((sum, item) => sum + item.pace, 0) / data.length).toFixed(0)} WPM
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              Words per minute
            </div>
          </div>
          <div>
            <div className="text-sm font-medium mb-1">Average Rhythm Score</div>
            <div className="text-2xl">
              {(data.reduce((sum, item) => sum + item.rhythmScore, 0) / data.length).toFixed(1)}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              Out of 10 possible points
            </div>
          </div>
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-medium mb-3">Improvement Indicators</h3>
        <div className="space-y-4">
          <div>
            <div className="text-sm font-medium mb-1">Filler Word Reduction</div>
            {data.length >= 3 && (
              <>
                <div className="text-2xl">
                  {(() => {
                    // Calculate average of first 3 sessions vs last 3
                    const firstThree = data.slice(0, 3);
                    const lastThree = data.slice(-3);
                    const firstAvg = firstThree.reduce((sum, item) => sum + item.fillerWordCount, 0) / firstThree.length;
                    const lastAvg = lastThree.reduce((sum, item) => sum + item.fillerWordCount, 0) / lastThree.length;
                    const percentChange = ((firstAvg - lastAvg) / firstAvg) * 100;
                    
                    return percentChange > 0 
                      ? <span className="text-green-500">-{percentChange.toFixed(0)}%</span>
                      : <span className="text-red-500">+{Math.abs(percentChange).toFixed(0)}%</span>;
                  })()}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  Comparing first 3 to last 3 sessions
                </div>
              </>
            )}
          </div>
          
          <div>
            <div className="text-sm font-medium mb-1">Hesitation Reduction</div>
            {data.length >= 3 && (
              <>
                <div className="text-2xl">
                  {(() => {
                    // Calculate average of first 3 sessions vs last 3
                    const firstThree = data.slice(0, 3);
                    const lastThree = data.slice(-3);
                    const firstAvg = firstThree.reduce((sum, item) => sum + item.hesitationCount, 0) / firstThree.length;
                    const lastAvg = lastThree.reduce((sum, item) => sum + item.hesitationCount, 0) / lastThree.length;
                    const percentChange = ((firstAvg - lastAvg) / firstAvg) * 100;
                    
                    return percentChange > 0 
                      ? <span className="text-green-500">-{percentChange.toFixed(0)}%</span>
                      : <span className="text-red-500">+{Math.abs(percentChange).toFixed(0)}%</span>;
                  })()}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  Comparing first 3 to last 3 sessions
                </div>
              </>
            )}
          </div>
          
          <div>
            <div className="text-sm font-medium mb-1">Clarity Improvement</div>
            {data.length >= 3 && (
              <>
                <div className="text-2xl">
                  {(() => {
                    // Calculate average of first 3 sessions vs last 3
                    const firstThree = data.slice(0, 3);
                    const lastThree = data.slice(-3);
                    const firstAvg = firstThree.reduce((sum, item) => sum + item.clarity.score, 0) / firstThree.length;
                    const lastAvg = lastThree.reduce((sum, item) => sum + item.clarity.score, 0) / lastThree.length;
                    const percentChange = ((lastAvg - firstAvg) / firstAvg) * 100;
                    
                    return percentChange > 0 
                      ? <span className="text-green-500">+{percentChange.toFixed(0)}%</span>
                      : <span className="text-red-500">-{Math.abs(percentChange).toFixed(0)}%</span>;
                  })()}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  Comparing first 3 to last 3 sessions
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsPanel;
