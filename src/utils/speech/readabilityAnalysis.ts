
/**
 * Text readability analysis utilities
 * Calculates readability metrics for speech transcripts
 */

// Common complex words that increase reading level
const COMPLEX_WORDS = [
  'consequently', 'furthermore', 'nevertheless', 'approximately',
  'fundamental', 'subsequently', 'comprehensive', 'specifically',
  'alternatively', 'significantly', 'differentiate', 'implementation',
  'methodology', 'perspective', 'nonetheless', 'demonstrate',
  'accordingly', 'furthermore', 'integration', 'prerequisite',
  'substantial', 'therefore', 'throughout', 'underlying'
];

// Grade level mapping based on Flesch-Kincaid Grade Level
const GRADE_LEVEL_MAP: Record<number, string> = {
  1: '1st Grade',
  2: '2nd Grade',
  3: '3rd Grade',
  4: '4th Grade',
  5: '5th Grade',
  6: '6th Grade',
  7: '7th Grade',
  8: '8th Grade',
  9: '9th Grade',
  10: '10th Grade',
  11: '11th Grade',
  12: '12th Grade',
  13: 'College Freshman',
  14: 'College Sophomore',
  15: 'College Junior',
  16: 'College Senior',
  17: 'Graduate Level'
};

interface ReadabilityResult {
  score: number;          // 0-100 score (higher is more readable)
  gradeLevel: string;     // Grade level as string
  complexWords: string[]; // List of complex words used
  statistics: {
    wordCount: number;
    sentenceCount: number;
    syllableCount: number;
    avgWordLength: number;
    avgSentenceLength: number;
    avgSyllablesPerWord: number;
  };
}

/**
 * Count syllables in a word
 * This is a simplified approximation
 */
function countSyllables(word: string): number {
  word = word.toLowerCase().replace(/[^a-z]/g, '');
  
  // Words of length 3 or less are typically 1 syllable
  if (word.length <= 3) {
    return 1;
  }
  
  // Adjust for silent e
  word = word.replace(/e$/, '');
  
  // Count vowel groups
  const vowelGroups = word.match(/[aeiouy]+/g);
  return vowelGroups ? vowelGroups.length : 1;
}

/**
 * Extract sentences from text
 */
function extractSentences(text: string): string[] {
  // Split by common sentence terminators
  const sentences = text.split(/[.!?]+/)
    .map(s => s.trim())
    .filter(s => s.length > 0);
  
  return sentences.length > 0 ? sentences : [text];
}

/**
 * Calculate Flesch-Kincaid Grade Level
 * Higher score = higher grade level
 */
function calculateFleschKincaidGradeLevel(text: string): number {
  const words = text.split(/\s+/).filter(word => word.length > 0);
  const sentences = extractSentences(text);
  
  if (words.length === 0 || sentences.length === 0) {
    return 5; // Default to 5th grade if no valid text
  }
  
  // Count syllables
  const syllables = words.reduce((total, word) => total + countSyllables(word), 0);
  
  // Calculate metrics
  const avgSentenceLength = words.length / sentences.length;
  const avgSyllablesPerWord = syllables / words.length;
  
  // Flesch-Kincaid formula: 0.39 * (words/sentences) + 11.8 * (syllables/words) - 15.59
  const gradeLevel = 0.39 * avgSentenceLength + 11.8 * avgSyllablesPerWord - 15.59;
  
  // Clamp between 1-17
  return Math.max(1, Math.min(17, Math.round(gradeLevel)));
}

/**
 * Find complex words used in text
 */
function findComplexWords(text: string): string[] {
  const words = text.toLowerCase().split(/\s+/);
  const unique = new Set<string>();
  
  // Look for complex words in the text
  for (const word of words) {
    const cleaned = word.replace(/[^\w]/g, '');
    if (cleaned.length > 0 && COMPLEX_WORDS.includes(cleaned)) {
      unique.add(cleaned);
    }
    
    // Also consider words with many syllables as complex
    if (cleaned.length >= 8 && countSyllables(cleaned) >= 4) {
      unique.add(cleaned);
    }
  }
  
  return Array.from(unique);
}

/**
 * Calculate general readability score (0-100)
 * Higher = more readable (opposite of grade level)
 */
function calculateReadabilityScore(gradeLevel: number): number {
  // Convert grade level to readability score (inversely related)
  // Grade 1-5 = 90-100, Grade 6-8 = 80-90, Grade 9-12 = 60-80, College+ = 0-60
  if (gradeLevel <= 5) {
    return 100 - ((gradeLevel - 1) * 2);
  } else if (gradeLevel <= 8) {
    return 90 - ((gradeLevel - 5) * 3.33);
  } else if (gradeLevel <= 12) {
    return 80 - ((gradeLevel - 8) * 5);
  } else {
    return Math.max(0, 60 - ((gradeLevel - 12) * 15));
  }
}

/**
 * Analyze text readability
 */
export function analyzeTextReadability(text: string): ReadabilityResult {
  // Default values for very short texts
  if (!text || text.length < 20) {
    return {
      score: 90,
      gradeLevel: '5th Grade',
      complexWords: [],
      statistics: {
        wordCount: 0,
        sentenceCount: 0,
        syllableCount: 0,
        avgWordLength: 0,
        avgSentenceLength: 0,
        avgSyllablesPerWord: 0
      }
    };
  }
  
  const words = text.split(/\s+/).filter(word => word.length > 0);
  const sentences = extractSentences(text);
  const syllables = words.reduce((total, word) => total + countSyllables(word), 0);
  const complexWords = findComplexWords(text);
  
  // Calculate grade level
  const gradeLevel = calculateFleschKincaidGradeLevel(text);
  const gradeLevelString = GRADE_LEVEL_MAP[gradeLevel] || '8th Grade';
  
  // Calculate readability score
  const readabilityScore = calculateReadabilityScore(gradeLevel);
  
  return {
    score: readabilityScore,
    gradeLevel: gradeLevelString,
    complexWords: complexWords,
    statistics: {
      wordCount: words.length,
      sentenceCount: sentences.length,
      syllableCount: syllables,
      avgWordLength: words.length > 0 
        ? words.join('').length / words.length 
        : 0,
      avgSentenceLength: sentences.length > 0 
        ? words.length / sentences.length 
        : 0,
      avgSyllablesPerWord: words.length > 0 
        ? syllables / words.length 
        : 0
    }
  };
}
