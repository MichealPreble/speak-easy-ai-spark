
import React from "react";
import { SpeechFeedback } from "@/hooks/useVoiceRecognition";
import SpeechMetrics from "./SpeechMetrics";
import SpeechQualityScore from "./SpeechQualityScore";
import SpeechTrends from "./SpeechTrends";
import SpeechTips from "./SpeechTips";
import SpeechClarityFeedback from "./SpeechClarityFeedback";
import SpeechMetricsChart from "./SpeechMetricsChart";

interface FeedbackContentProps {
  isActive: boolean;
  duration: number;
  feedback?: SpeechFeedback;
  tips: string[];
  metrics: {
    speed: number | null;
    wordCount: number;
    pitchVariation: number | null;
    fillerWordsCount: number;
  };
  clarityAnalysis: {
    score: number;
    rating: 'excellent' | 'good' | 'fair' | 'needs improvement';
    suggestions: string[];
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
  metricsHistory,
  speechScore
}) => {
  if (!isActive) return null;
  
  return (
    <>
      <SpeechMetrics 
        duration={duration}
        speed={metrics.speed}
        wordCount={metrics.wordCount}
        fillerWordsCount={metrics.fillerWordsCount}
      />
      
      <div className="p-3 border-t border-border/30">
        <SpeechClarityFeedback 
          score={clarityAnalysis.score} 
          rating={clarityAnalysis.rating} 
          suggestions={clarityAnalysis.suggestions} 
        />
      </div>
      
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
