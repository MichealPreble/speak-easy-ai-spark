
import React from "react";
import { SpeechFeedback } from "@/hooks/useVoiceRecognition";
import SpeechMetrics from "./SpeechMetrics";
import SpeechQualityScore from "./SpeechQualityScore";
import SpeechTrends from "./SpeechTrends";
import SpeechTips from "./SpeechTips";
import SpeechClarityFeedback from "./SpeechClarityFeedback";
import SpeechMetricsChart from "./SpeechMetricsChart";
import { TrendMetrics } from "@/hooks/useSpeechTrends";
import { useSpeechTips } from "@/hooks/useSpeechTips";

interface FeedbackContentProps {
  isActive: boolean;
  duration: number;
  feedback?: SpeechFeedback;
  tips: string[];
  metrics: TrendMetrics;
  clarityAnalysis: {
    score: number;
    rating: 'excellent' | 'good' | 'fair' | 'needs improvement';
    suggestions: string[];
  };
  hesitationAnalysis?: {
    count: number;
    percentage: number;
    patterns: string[];
  };
  metricsHistory: Array<{
    pace?: number;
    clarity?: number;
    hesitations?: number;
    fillerWords?: number;
    timestamp?: number;
  }>;
  speechScore: number;
}

const FeedbackContent: React.FC<FeedbackContentProps> = ({
  isActive,
  duration,
  feedback,
  tips,
  metrics,
  clarityAnalysis,
  hesitationAnalysis,
  metricsHistory,
  speechScore
}) => {
  const { hasTips, showPositiveFeedback } = useSpeechTips(tips, duration);
  
  if (!isActive) return null;
  
  return (
    <>
      <SpeechMetrics 
        duration={duration}
        speed={metrics.speed}
        wordCount={metrics.wordCount}
        fillerWordsCount={metrics.fillerWordsCount}
        hesitationsCount={hesitationAnalysis?.count}
        hesitationsPercentage={hesitationAnalysis?.percentage}
      />
      
      <div className="p-3 border-t border-border/30">
        <SpeechClarityFeedback 
          score={clarityAnalysis.score} 
          rating={clarityAnalysis.rating} 
          suggestions={clarityAnalysis.suggestions} 
        />
      </div>
      
      {hesitationAnalysis && hesitationAnalysis.patterns.length > 0 && (
        <div className="px-3 pb-3 pt-2 border-t border-border/30">
          <div className="text-xs font-medium mb-2">Detected Hesitation Patterns</div>
          <div className="text-xs text-muted-foreground max-h-[100px] overflow-y-auto pr-1">
            {hesitationAnalysis.patterns.slice(0, 3).map((pattern, index) => (
              <div key={index} className="bg-muted px-2 py-1.5 rounded mb-1.5 text-xs">{pattern}</div>
            ))}
            {hesitationAnalysis.patterns.length > 3 && (
              <div className="text-xs opacity-70 mt-1 text-center">+{hesitationAnalysis.patterns.length - 3} more patterns</div>
            )}
          </div>
        </div>
      )}
      
      {metricsHistory.length > 1 && (
        <div className="px-3 pt-1 pb-3 border-t border-border/30">
          <div className="text-xs font-medium mb-2">Real-time Metrics</div>
          <SpeechMetricsChart 
            data={metricsHistory} 
            height={80} 
            metricToShow="all"
          />
        </div>
      )}
      
      <SpeechQualityScore score={speechScore} duration={duration} />
      
      <SpeechTrends 
        duration={duration}
        feedback={feedback}
        metrics={metrics}
      />
      
      <SpeechTips tips={tips} duration={duration} />
    </>
  );
};

export default FeedbackContent;
