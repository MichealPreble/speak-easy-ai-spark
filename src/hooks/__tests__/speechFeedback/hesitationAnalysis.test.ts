
import { renderHook } from '@testing-library/react-hooks';
import { describe, test, expect, beforeEach } from 'vitest';
import { useSpeechFeedback } from '../../speech-feedback';
import { resetMocksWithDefaults } from './setup';
import { detectHesitations } from "@/utils/speech";

describe('useSpeechFeedback hesitation analysis', () => {
  beforeEach(() => {
    resetMocksWithDefaults();
  });

  test('should detect hesitations in speech', async () => {
    // Mock the hesitation detection for this test
    (detectHesitations as Mock).mockReturnValue({ 
      count: 4, 
      percentage: 15, 
      patterns: ['um', 'like']
    });
    
    const transcript = 'This is um a test speech with like some hesitation um like patterns';
    
    const { result, waitForNextUpdate } = renderHook(() => 
      useSpeechFeedback(true, transcript, 10)
    );
    
    // Wait for effects to run
    await waitForNextUpdate();
    
    // Verify hesitation analysis is generated
    expect(result.current.hesitationAnalysis).toBeDefined();
    expect(result.current.hesitationAnalysis.count).toBe(4);
    expect(result.current.hesitationAnalysis.percentage).toBe(15);
    expect(result.current.hesitationAnalysis.patterns).toContain('um');
    expect(result.current.hesitationAnalysis.patterns).toContain('like');
  });

  test('should not run hesitation analysis when inactive', () => {
    const transcript = 'This is a test speech with some hesitation';
    
    const { result } = renderHook(() => 
      useSpeechFeedback(false, transcript, 10)
    );
    
    // Since isActive is false, detectHesitations should not be called
    expect(detectHesitations).not.toHaveBeenCalled();
    
    // Verify hesitation analysis is not populated
    expect(result.current.hesitationAnalysis).toBeUndefined();
  });

  test('should provide empty hesitation analysis for clear speech', async () => {
    // Mock the hesitation detection for this test - no hesitations
    (detectHesitations as Mock).mockReturnValue({ 
      count: 0, 
      percentage: 0, 
      patterns: []
    });
    
    const transcript = 'This is a perfectly clear speech without any hesitation';
    
    const { result, waitForNextUpdate } = renderHook(() => 
      useSpeechFeedback(true, transcript, 10)
    );
    
    // Wait for effects to run
    await waitForNextUpdate();
    
    // Verify hesitation analysis shows no issues
    expect(result.current.hesitationAnalysis.count).toBe(0);
    expect(result.current.hesitationAnalysis.percentage).toBe(0);
    expect(result.current.hesitationAnalysis.patterns).toEqual([]);
  });
});
