
import { renderHook } from '@testing-library/react-hooks';
import { describe, test, expect, beforeEach } from 'vitest';
import { useSpeechFeedback } from '../../speech-feedback';
import { resetMocksWithDefaults } from './setup';

describe('useSpeechFeedback metrics updates', () => {
  beforeEach(() => {
    resetMocksWithDefaults();
  });

  test('should update metrics with values from feedback', async () => {
    const feedback = {
      speed: 150,
      duration: 10,
      fillerWords: ['um'],
      wordCount: 100,
      pitchVariation: 40,
      volumeVariation: 15
    };
    
    const { result, waitForNextUpdate } = renderHook(() => 
      useSpeechFeedback(true, 'This is a test speech', 10, feedback)
    );
    
    // Wait for effects to run
    await waitForNextUpdate();
    
    // Verify metrics are updated
    expect(result.current.metrics).toEqual({
      speed: 150,
      wordCount: 5, // "This is a test speech" has 5 words
      pitchVariation: 40,
      fillerWordsCount: 1
    });
  });
});
