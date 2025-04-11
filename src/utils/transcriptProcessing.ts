
import { SpeechFeedback } from "@/hooks/useVoiceRecognition";

export function processTranscript(
  transcript: string, 
  duration: number,
  analysis: {
    pitchVariation: number,
    volumeVariation: number
  }
): {
  transcript: string,
  feedback: SpeechFeedback
} {
  const wordCount = transcript.split(/\s+/).filter(Boolean).length;
  const speed = duration > 0 ? Math.round((wordCount / duration) * 60) : 0;
  const fillerWordRegex = /\b(um|uh|like|you know|actually|basically|literally|so|right|well)\b/gi;
  const matches = transcript.match(fillerWordRegex);
  const fillerWords: string[] = matches ? matches.map(word => word.toLowerCase()) : [];

  const feedback: SpeechFeedback = {
    speed,
    duration: Math.round(duration),
    fillerWords: [...new Set(fillerWords)],
    wordCount,
    pitchVariation: Math.round(analysis.pitchVariation),
    volumeVariation: Math.round(analysis.volumeVariation),
  };

  return {
    transcript,
    feedback
  };
}
