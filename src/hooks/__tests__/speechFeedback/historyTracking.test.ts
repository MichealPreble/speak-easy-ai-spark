
import { renderHook, act } from '@testing-library/react-hooks';
import { describe, test, expect, beforeEach, vi } from 'vitest';
import { useSpeechFeedback } from '../../speech-feedback';
import { resetMocksWithDefaults } from './setup';

describe('useSpeechFeedback history tracking', () => {
  beforeEach(() => {
    resetMocksWithDefaults();
  });

  test('should update metricsHistory when active', async () => {
    vi.useFakeTimers();
    
    const feedback = {
      speed: 150,
      duration: 10,
      fillerWords: [],
      wordCount: 100,
      pitchVariation: 40,
      volumeVariation: 15
    };
    
    const { result } = renderHook(() => 
      useSpeechFeedback(true, 'This is a test speech', 10, feedback)
    );
    
    // Fast-forward 3 seconds
    act(() => {
      vi.advanceTimersByTime(3000);
    });
    
    // Verify metrics history is updated
    expect(result.current.metricsHistory.length).toBe(1);
    expect(result.current.metricsHistory[0]).toHaveProperty('pace', 150);
    
    // Fast-forward another 3 seconds
    act(() => {
      vi.advanceTimersByTime(3000);
    });
    
    // Verify metrics history is updated again
    expect(result.current.metricsHistory.length).toBe(2);
    
    vi.useRealTimers();
  });

  test('should reset when not active', () => {
    // First with isActive=true
    const { result, rerender } = renderHook(
      ({ isActive }) => useSpeechFeedback(isActive, 'Test', 5, { 
        speed: 150, 
        duration: 5, 
        fillerWords: [], 
        wordCount: 10,
        pitchVariation: 40,
        volumeVariation: 15
      }),
      { initialProps: { isActive: true } }
    );
    
    // Verify metrics history exists
    expect(result.current.metricsHistory).toBeDefined();
    
    // Then rerender with isActive=false
    rerender({ isActive: false });
    
    // Verify history is reset
    expect(result.current.metricsHistory).toEqual([]);
    expect(result.current.tips).toEqual([]);
  });
});
