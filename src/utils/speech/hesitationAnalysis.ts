
/**
 * Detects hesitations in speech based on repeated words and stuttering patterns
 * @param transcript The speech transcript text
 * @returns Analysis of hesitations including count, percentage, and patterns
 */
export function detectHesitations(transcript: string): {
  count: number;
  percentage: number;
  patterns: string[];
} {
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
