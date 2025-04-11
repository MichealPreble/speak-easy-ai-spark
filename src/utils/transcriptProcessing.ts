
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
  const fillerWordRegex = /\b(um|uh|like|you know|actually|basically|literally|so|right|well)\b/gi;
  const matches = transcript.match(fillerWordRegex);
  const fillerWords: string[] = matches ? matches.map(word => word.toLowerCase()) : [];
  
  // Calculate word density (words per minute)
  const wordDensity = speed;
  
  // Detect sentence complexity
  const sentences = transcript.split(/[.!?]+/).filter(Boolean);
  const avgWordsPerSentence = sentences.length > 0 
    ? Math.round(wordCount / sentences.length) 
    : wordCount;

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

// Add new analysis functions for more comprehensive speech assessment
export function analyzeSpokenCadence(transcript: string, duration: number): number {
  const sentences = transcript.split(/[.!?]+/).filter(Boolean);
  const avgSentenceLength = sentences.length > 0 ? duration / sentences.length : duration;
  
  // Return a 1-10 score for speech cadence (rhythm)
  return Math.min(10, Math.max(1, Math.round(10 - (Math.abs(avgSentenceLength - 4) * 1.5))));
}

export function detectHesitations(transcript: string): {count: number, percentage: number} {
  // Look for repeated words or stuttering patterns
  const repeatedWordsMatches = transcript.match(/\b(\w+)(\s+\1\b)+/gi);
  const hesitationCount = repeatedWordsMatches ? repeatedWordsMatches.length : 0;
  
  // Calculate as percentage of total words
  const wordCount = transcript.split(/\s+/).filter(Boolean).length;
  const percentage = wordCount > 0 ? Math.round((hesitationCount / wordCount) * 100) : 0;
  
  return { count: hesitationCount, percentage };
}
