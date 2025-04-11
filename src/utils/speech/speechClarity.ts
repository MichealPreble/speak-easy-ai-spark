
/**
 * Analyzes speech clarity based on word pronunciation and articulation patterns
 * @param transcript The speech transcript text
 * @returns Analysis of speech clarity including score and improvement suggestions
 */
export function analyzeSpeechClarity(transcript: string): {
  score: number;
  rating: 'excellent' | 'good' | 'fair' | 'needs improvement';
  suggestions: string[];
} {
  // Base clarity score starts at 10
  let clarityScore = 10;
  const suggestions: string[] = [];

  // Check for run-on sentences (poor articulation indicator)
  const sentences = transcript.split(/[.!?]+/).filter(Boolean);
  const longSentences = sentences.filter(s => {
    const words = s.trim().split(/\s+/).filter(Boolean);
    return words.length > 20;
  });
  
  if (longSentences.length > 0) {
    clarityScore -= Math.min(3, longSentences.length);
    suggestions.push("Break long sentences into shorter ones for better clarity");
  }

  // Check for mumbled words (words with apostrophes indicating contractions)
  const mumblePattern = /\b\w+'\w+\b/g;
  const mumbleMatches = transcript.match(mumblePattern);
  const mumbleCount = mumbleMatches ? mumbleMatches.length : 0;
  
  if (mumbleCount > 2) {
    clarityScore -= Math.min(2, Math.floor(mumbleCount / 2));
    suggestions.push("Be mindful of word contractions and articulate fully");
  }

  // Check for complex vocabulary that might be difficult to articulate clearly
  const complexWords = transcript.match(/\b\w{12,}\b/g);
  if (complexWords && complexWords.length > 2) {
    clarityScore -= Math.min(2, complexWords.length - 1);
    suggestions.push("Consider simpler word choices for clearer delivery");
  }

  // Check for repeated phrases which can indicate unclear speech
  const repeatedPhrasePattern = /\b(\w+\s+\w+\s+\w+)(?=.*\1)/g;
  const repeatedPhrases = transcript.match(repeatedPhrasePattern);
  if (repeatedPhrases && repeatedPhrases.length > 1) {
    clarityScore -= Math.min(2, repeatedPhrases.length);
    suggestions.push("Avoid repeating the same phrases multiple times");
  }

  // Ensure the score is within bounds
  clarityScore = Math.max(1, Math.min(10, clarityScore));

  // Determine rating based on score
  let rating: 'excellent' | 'good' | 'fair' | 'needs improvement';
  if (clarityScore >= 9) {
    rating = 'excellent';
  } else if (clarityScore >= 7) {
    rating = 'good';
  } else if (clarityScore >= 5) {
    rating = 'fair';
  } else {
    rating = 'needs improvement';
  }

  // If no specific issues found but score isn't perfect, add a general suggestion
  if (suggestions.length === 0 && clarityScore < 9) {
    suggestions.push("Focus on clear articulation and proper pronunciation");
  }

  return {
    score: clarityScore,
    rating,
    suggestions
  };
}
