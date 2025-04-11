
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
  
  // Enhanced filler word detection with more comprehensive patterns
  const fillerWordRegex = /\b(um|uh|like|you know|actually|basically|literally|so|right|well|i mean|kind of|sort of|anyway|whatever|hmm|er)\b/gi;
  const matches = transcript.match(fillerWordRegex);
  const fillerWords: string[] = matches ? [...new Set(matches.map(word => word.toLowerCase()))] : [];
  
  // Enhanced pitch and volume analysis 
  const enhancedPitchVariation = analysis.pitchVariation * (1 + (duration > 30 ? 0.2 : 0));
  const enhancedVolumeVariation = analysis.volumeVariation * (1 + (wordCount > 50 ? 0.15 : 0));

  const feedback: SpeechFeedback = {
    speed,
    duration: Math.round(duration),
    fillerWords,
    wordCount,
    pitchVariation: Math.round(enhancedPitchVariation),
    volumeVariation: Math.round(enhancedVolumeVariation),
  };

  return {
    transcript,
    feedback
  };
}
