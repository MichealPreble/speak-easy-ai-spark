
import { renderHook } from '@testing-library/react-hooks';
import { describe, test, expect, beforeEach } from 'vitest';
import { useSpeechFeedback } from '../../speech-feedback';
import { resetMocksWithDefaults } from './setup';

describe('useSpeechFeedback initialization', () => {
  beforeEach(() => {
    resetMocksWithDefaults();
  });

  test('should initialize with default values', () => {
    const { result } = renderHook(() => 
      useSpeechFeedback(false, '', 0)
    );
    
    expect(result.current.tips).toEqual([]);
    expect(result.current.metrics).toEqual({
      speed: null,
      wordCount: 0,
      pitchVariation: null,
      fillerWordsCount: 0
    });
    expect(result.current.metricsHistory).toEqual([]);
    expect(result.current.clarityAnalysis).toEqual({
      score: 0,
      rating: 'fair',
      suggestions: []
    });
  });
});
