
/**
 * Validates speech analysis input parameters
 * @param text - The speech transcript to analyze
 * @param duration - The duration of the speech in seconds
 * @returns A validation result object indicating if the inputs are valid
 */
export function validateSpeechInput(
  text: string, 
  duration: number
): { 
  isValid: boolean; 
  error?: string;
} {
  if (!text || typeof text !== 'string') {
    return { isValid: false, error: 'Speech transcript must be a non-empty string' };
  }
  
  if (typeof duration !== 'number' || duration <= 0) {
    return { isValid: false, error: 'Duration must be a positive number' };
  }
  
  return { isValid: true };
}
