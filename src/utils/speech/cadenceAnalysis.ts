
/**
 * Analyzes the spoken cadence based on transcript and duration
 * @param transcript The speech transcript text
 * @param duration The duration of the speech in seconds
 * @returns A score from 1-10 rating the cadence quality
 */
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
