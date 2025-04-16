
import { useMetricsTracking } from "./useMetricsTracking";
import { useFeedbackTips } from "./useFeedbackTips";
import { useScoreCalculation } from "./useScoreCalculation";
import { SpeechFeedback } from "./types";

export type { SpeechFeedback } from "./types";
export type { SpeechMetrics, ClarityAnalysis, HesitationAnalysis, MetricHistoryPoint } from "./types";

/**
 * Main hook for speech feedback functionality
 * Composes the specialized hooks for metrics tracking, tips generation, and score calculation
 */
export function useSpeechFeedback(isActive: boolean, transcript: string, duration: number, feedback?: SpeechFeedback) {
  const options = { isActive, transcript, duration, feedback };
  
  // Compose the specialized hooks
  const { metrics, metricsHistory, clarityAnalysis, hesitationAnalysis } = useMetricsTracking(options);
  const { tips } = useFeedbackTips(options);
  const { calculateScore } = useScoreCalculation();

  return {
    tips,
    metrics,
    clarityAnalysis,
    hesitationAnalysis,
    metricsHistory,
    calculateScore
  };
}
