
import { renderHook } from '@testing-library/react-hooks';
import { describe, test, expect, beforeEach } from 'vitest';
import { useSpeechFeedback } from '../../useSpeechFeedback';
import { resetMocksWithDefaults } from './setup';
import { detectHesitations } from "@/utils/speech";

describe('useSpeechFeedback tips generation', () => {
  beforeEach(() => {
    resetMocksWithDefaults();
  });

  test('should update tips based on feedback', async () => {
    // Mock hesitation detection for this test
    (detectHesitations as Mock).mockReturnValue({ count: 3 });
    
    const feedback = {
      speed: 190,
      duration: 10,
      fillerWords: ['um', 'uh'],
      wordCount: 100,
      pitchVariation: 25,
      volumeVariation: 5
    };
    
    const { result, waitForNextUpdate } = renderHook(() => 
      useSpeechFeedback(true, 'This is a test speech with some hesitation um um', 10, feedback)
    );
    
    // Wait for effects to run
    await waitForNextUpdate();
    
    // Verify tips are generated
    expect(result.current.tips.length).toBeGreaterThan(0);
    expect(result.current.tips).toContain("Try slowing down a bit for better clarity");
    expect(result.current.tips).toContain('Watch for filler words like "um", "uh"');
    expect(result.current.tips).toContain("You've repeated words 3 times. Try to speak more fluidly.");
  });
});
