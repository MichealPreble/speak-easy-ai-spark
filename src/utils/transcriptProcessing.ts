
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
  
  // Calculate word density (words per minute)
  const wordDensity = speed;
  
  // Detect sentence complexity
  const sentences = transcript.split(/[.!?]+/).filter(Boolean);
  const avgWordsPerSentence = sentences.length > 0 
    ? Math.round(wordCount / sentences.length) 
    : wordCount;

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

// Add new analysis functions for more comprehensive speech assessment
export function analyzeSpokenCadence(transcript: string, duration: number): number {
  const sentences = transcript.split(/[.!?]+/).filter(Boolean);
  const words = transcript.split(/\s+/).filter(Boolean);
  
  // Calculate average sentence length in words
  const avgSentenceLength = sentences.length > 0 ? words.length / sentences.length : words.length;
  
  // Calculate average estimated time per sentence
  const avgSentenceTime = sentences.length > 0 ? duration / sentences.length : duration;
  
  // Ideal cadence values
  const idealAvgSentenceLength = 15; // words
  const idealAvgSentenceTime = 4; // seconds
  
  // Calculate cadence score based on deviation from ideal values (1-10 scale)
  const lengthScore = 10 - Math.min(5, Math.abs(avgSentenceLength - idealAvgSentenceLength) / 3);
  const timeScore = 10 - Math.min(5, Math.abs(avgSentenceTime - idealAvgSentenceTime) * 1.2);
  
  // Weighted average of both scores
  return Math.min(10, Math.max(1, Math.round((lengthScore * 0.6) + (timeScore * 0.4))));
}

export function detectHesitations(transcript: string): {count: number, percentage: number, patterns: string[]} {
  // Look for repeated words or stuttering patterns
  const repeatedWordsMatches = transcript.match(/\b(\w+)(\s+\1\b)+/gi);
  const hesitationPatterns = repeatedWordsMatches ? Array.from(new Set(repeatedWordsMatches)) : [];
  const hesitationCount = hesitationPatterns.length;
  
  // Also detect partial word repetitions (stuttering)
  const stutterPattern = /\b(\w{1,2})-\1/g;
  const stutterMatches = transcript.match(stutterPattern);
  
  // Count stutters as hesitations too
  const totalHesitations = hesitationCount + (stutterMatches ? stutterMatches.length : 0);
  
  // Calculate as percentage of total words
  const wordCount = transcript.split(/\s+/).filter(Boolean).length;
  const percentage = wordCount > 0 ? Math.round((totalHesitations / wordCount) * 100) : 0;
  
  return { 
    count: totalHesitations, 
    percentage, 
    patterns: hesitationPatterns 
  };
}

// Add a new function to analyze speech rhythms
export function analyzeRhythm(transcript: string, duration: number): {
  pauseFrequency: number;
  speechBursts: number;
  rhythmScore: number;
} {
  // Identify potential pauses based on punctuation
  const pauseMarkers = transcript.match(/[,.;:!?]/g);
  const pauseCount = pauseMarkers ? pauseMarkers.length : 0;
  
  // Calculate pause frequency (pauses per minute)
  const pauseFrequency = duration > 0 ? (pauseCount / (duration / 60)) : 0;
  
  // Estimate speech bursts (continuous speaking segments)
  const segments = transcript.split(/[.!?]+/).filter(Boolean);
  const speechBursts = Math.max(1, segments.length);
  
  // Calculate rhythm score (1-10)
  // Ideal pause frequency around 4-8 per minute
  const idealPauseFrequency = 6;
  const pauseScore = 10 - Math.min(5, Math.abs(pauseFrequency - idealPauseFrequency));
  
  // Ideal speech burst count depends on duration
  const idealBurstCount = Math.max(2, Math.round(duration / 20));
  const burstScore = 10 - Math.min(5, Math.abs(speechBursts - idealBurstCount) * 1.5);
  
  // Combined rhythm score
  const rhythmScore = Math.min(10, Math.max(1, Math.round((pauseScore * 0.7) + (burstScore * 0.3))));
  
  return {
    pauseFrequency,
    speechBursts,
    rhythmScore
  };
}
