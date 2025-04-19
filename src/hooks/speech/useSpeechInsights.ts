
import { useSpeechRate } from './useSpeechRate';

export interface SpeechInsightsFeedback {
  text: string;
  color: string;
}

// WPM feedback calculation
export const getWpmFeedback = (wpm: number | null): SpeechInsightsFeedback => {
  if (wpm === null) return { text: "Not speaking", color: "text-muted-foreground" };
  if (wpm < 70) return { text: "Too slow", color: "text-destructive" };
  if (wpm <= 89) return { text: "Somewhat slow", color: "text-yellow-500" };
  if (wpm <= 130) return { text: "Well-paced", color: "text-green-600" };
  if (wpm <= 150) return { text: "Somewhat fast", color: "text-yellow-500" };
  return { text: "Too fast", color: "text-destructive" };
};

export interface CadenceMetrics {
  averagePauseMs: number | null;
  cadenceScore: number | null;
  feedback: SpeechInsightsFeedback;
}

export const getCadenceFeedback = (averagePauseMs: number | null): SpeechInsightsFeedback => {
  if (averagePauseMs === null) return { text: "No cadence data", color: "text-muted-foreground" };
  if (averagePauseMs < 300) return { text: "Too rushed", color: "text-destructive" };
  if (averagePauseMs < 500) return { text: "Somewhat fast", color: "text-yellow-500" };
  if (averagePauseMs <= 1500) return { text: "Natural rhythm", color: "text-green-600" };
  if (averagePauseMs <= 2000) return { text: "Somewhat slow", color: "text-yellow-500" };
  return { text: "Too choppy", color: "text-destructive" };
};

export const analyzeCadence = (timestamps: number[]): CadenceMetrics => {
  if (timestamps.length < 2) {
    return {
      averagePauseMs: null,
      cadenceScore: null,
      feedback: { text: "No cadence data", color: "text-muted-foreground" }
    };
  }

  const pauses = [];
  for (let i = 1; i < timestamps.length; i++) {
    const gap = timestamps[i] - timestamps[i - 1];
    if (gap > 500) pauses.push(gap);
  }

  const averagePauseMs = pauses.length > 0 
    ? pauses.reduce((a, b) => a + b, 0) / pauses.length 
    : null;

  let cadenceScore = null;
  if (averagePauseMs !== null) {
    // Normalize score: shorter pauses → lower score, ~750ms-1500ms = ideal
    const normalized = Math.max(0, Math.min(100, 100 - Math.abs(1000 - averagePauseMs) / 10));
    cadenceScore = Math.round(normalized);
  }

  const feedback = getCadenceFeedback(averagePauseMs);

  return { averagePauseMs, cadenceScore, feedback };
};

export interface SpeechInsights {
  wpm: number | null;
  feedback: SpeechInsightsFeedback;
  cadence: CadenceMetrics;
}

export function useSpeechInsights(
  transcript: string, 
  isSpeaking: boolean,
  speakingTimestamps: number[] = []
): SpeechInsights {
  const { wpm } = useSpeechRate(transcript, isSpeaking);
  const feedback = getWpmFeedback(wpm);
  const cadence = analyzeCadence(speakingTimestamps);

  return {
    wpm,
    feedback,
    cadence
  };
}
