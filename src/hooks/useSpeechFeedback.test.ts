
import { renderHook, act } from '@testing-library/react-hooks';
import { useSpeechFeedback } from './useSpeechFeedback';
import { detectHesitations, analyzeSpokenCadence, analyzeSpeechClarity } from "@/utils/speech";

// Mock the speech analysis utilities
vi.mock('@/utils/speech', () => ({
  detectHesitations: vi.fn(),
  analyzeSpokenCadence: vi.fn(),
  analyzeSpeechClarity: vi.fn(),
}));

describe('useSpeechFeedback', () => {
  // Reset mocks before each test
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Set up default mock implementations
    (detectHesitations as Mock).mockReturnValue({ count: 0 });
    (analyzeSpokenCadence as Mock).mockReturnValue(8);
    (analyzeSpeechClarity as Mock).mockReturnValue({
      score: 7,
      rating: 'good',
      suggestions: []
    });
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
