
import { renderHook } from '@testing-library/react-hooks';
import { describe, test, expect, beforeEach } from 'vitest';
import { useSpeechFeedback } from '../../speech-feedback';
import { resetMocksWithDefaults } from './setup';
import { detectHesitations } from "@/utils/speech";

describe('useSpeechFeedback score calculation', () => {
  beforeEach(() => {
    resetMocksWithDefaults();
  });

  test('should calculate speech score correctly', () => {
    const { result } = renderHook(() => 
      useSpeechFeedback(false, '', 0)
    );
    
    // Calculate score with no feedback should return 0
    expect(result.current.calculateScore()).toBe(0);
    
    // Test perfect score
    const perfectFeedback = {
      speed: 150,
      duration: 10,
      fillerWords: [],
      wordCount: 100,
      pitchVariation: 50,
      volumeVariation: 20
    };
    expect(result.current.calculateScore(perfectFeedback)).toBe(10);
    
    // Test with too fast speech
    const tooFastFeedback = {
      ...perfectFeedback,
      speed: 200
    };
    expect(result.current.calculateScore(tooFastFeedback)).toBe(8);
    
    // Test with too slow speech
    const tooSlowFeedback = {
      ...perfectFeedback,
      speed: 110,
      duration: 10
    };
    expect(result.current.calculateScore(tooSlowFeedback)).toBe(9);
    
    // Test with filler words
    const fillerWordsFeedback = {
      ...perfectFeedback,
      fillerWords: ['um', 'uh', 'like']
    };
    expect(result.current.calculateScore(fillerWordsFeedback)).toBe(8.5);
    
    // Test with low pitch variation
    const lowPitchFeedback = {
      ...perfectFeedback,
      pitchVariation: 20,
      duration: 10
    };
    expect(result.current.calculateScore(lowPitchFeedback)).toBe(8);
  });
});
