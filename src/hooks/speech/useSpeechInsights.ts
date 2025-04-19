
import { useSpeechRate } from './useSpeechRate';

export interface SpeechInsightsFeedback {
  text: string;
  color: string;
}

export const getWpmFeedback = (wpm: number | null): SpeechInsightsFeedback => {
  if (wpm === null) return { text: "Not speaking", color: "text-muted-foreground" };
  if (wpm < 70) return { text: "Too slow", color: "text-destructive" };
  if (wpm <= 89) return { text: "Somewhat slow", color: "text-yellow-500" };
  if (wpm <= 130) return { text: "Well-paced", color: "text-green-600" };
  if (wpm <= 150) return { text: "Somewhat fast", color: "text-yellow-500" };
  return { text: "Too fast", color: "text-destructive" };
};

export interface SpeechInsights {
  wpm: number | null;
  feedback: SpeechInsightsFeedback;
  // Future fields for cadence, clarity, etc.
  // cadence?: CadenceMetrics;
  // clarity?: ClarityMetrics;
}

export function useSpeechInsights(transcript: string, isSpeaking: boolean): SpeechInsights {
  const { wpm } = useSpeechRate(transcript, isSpeaking);
  const feedback = getWpmFeedback(wpm);

  return {
    wpm,
    feedback
  };
}
