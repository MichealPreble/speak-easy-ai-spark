
import { render, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import RealTimeFeedback from '../RealTimeFeedback';
import { useAnalytics } from '@/hooks/useAnalytics';
import { useSpeechFeedback } from '@/hooks/speech-feedback';

// Mock analytics hook
vi.mock('@/hooks/useAnalytics', () => ({
  useAnalytics: vi.fn(() => ({
    trackVoiceMessage: vi.fn(),
    trackSpeechPracticeStarted: vi.fn(),
    trackSpeechFeedbackViewed: vi.fn()
  }))
}));

// Mock speech feedback hook
vi.mock('@/hooks/speech-feedback', () => ({
  useSpeechFeedback: vi.fn(() => ({
    tips: ['Speak slower', 'Project your voice'],
    metrics: {
      speed: 150,
      wordCount: 100,
      fillerWordsCount: 5
    },
    clarityAnalysis: {
      score: 85,
      rating: 'Good',
      suggestions: ['Enunciate more clearly']
    },
    metricsHistory: [],
    hesitationAnalysis: {
      count: 3,
      percentage: 5,
      patterns: ['um', 'uh']
    },
    calculateScore: () => 80
  }))
}));

describe('RealTimeFeedback Component', () => {
  const mockTrackVoiceMessage = vi.fn();
  const mockTrackSpeechPracticeStarted = vi.fn();
  const mockTrackSpeechFeedbackViewed = vi.fn();
  
  beforeEach(() => {
    vi.clearAllMocks();
    (useAnalytics as jest.Mock).mockImplementation(() => ({
      trackVoiceMessage: mockTrackVoiceMessage,
      trackSpeechPracticeStarted: mockTrackSpeechPracticeStarted,
      trackSpeechFeedbackViewed: mockTrackSpeechFeedbackViewed
    }));
  });

  it('should track when real-time feedback begins', () => {
    render(
      <RealTimeFeedback
        isActive={true}
        transcript="Test speech"
        duration={10}
        feedback={{
          speed: 150,
          duration: 10,
          fillerWords: ['um', 'uh'],
          wordCount: 100,
          pitchVariation: 0.5,
          volumeVariation: 0.3,
          volume: 75,
          enunciation: 80,
          readabilityScore: 70,
          readabilityGrade: '8th Grade',
          complexWords: ['consequently', 'therefore']
        }}
      />
    );

    expect(mockTrackSpeechPracticeStarted).toHaveBeenCalledTimes(1);
  });

  it('should track when feedback is expanded/collapsed', () => {
    const { getByRole } = render(
      <RealTimeFeedback
        isActive={true}
        transcript="Test speech"
        duration={10}
        feedback={{
          speed: 150,
          duration: 10,
          fillerWords: ['um', 'uh'],
          wordCount: 100,
          pitchVariation: 0.5,
          volumeVariation: 0.3,
          volume: 75,
          enunciation: 80,
          readabilityScore: 70,
          readabilityGrade: '8th Grade',
          complexWords: ['consequently', 'therefore']
        }}
      />
    );

    const toggleButton = getByRole('button', { name: /toggle feedback/i });
    fireEvent.click(toggleButton);

    expect(mockTrackSpeechFeedbackViewed).toHaveBeenCalledTimes(1);
  });

  it('should not track anything when inactive', () => {
    render(
      <RealTimeFeedback
        isActive={false}
        transcript=""
        duration={0}
      />
    );

    expect(mockTrackVoiceMessage).not.toHaveBeenCalled();
    expect(mockTrackSpeechPracticeStarted).not.toHaveBeenCalled();
    expect(mockTrackSpeechFeedbackViewed).not.toHaveBeenCalled();
  });
});
