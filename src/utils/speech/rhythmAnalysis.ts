
/**
 * Analyzes speech rhythm patterns based on pauses and speech bursts
 * @param transcript The speech transcript text
 * @param duration The duration of the speech in seconds
 * @returns Analysis of rhythm including pause frequency, speech bursts, and overall score
 */
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
