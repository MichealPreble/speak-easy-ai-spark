
/**
 * Mock analytics service for testing
 */

import { AnalyticsEventData } from '../analytics';

// Mocked analytics service
export const analyticsService = {
  event: jest.fn<void, [AnalyticsEventData]>()
};

// Helper function
export const trackEvent = jest.fn<void, [string, string, string | undefined, number | undefined]>();

// Mock the useAnalytics hook
export function useAnalytics() {
  return {
    trackEvent: jest.fn<void, [string, string, string | undefined, number | undefined]>(),
    trackPageView: jest.fn<void, [string, string | undefined]>(),
    trackVoiceMessage: jest.fn<void, []>(),
    trackThemeToggle: jest.fn<void, [string]>(),
    trackMessageSent: jest.fn<void, []>(),
    trackSummarize: jest.fn<void, []>(),
    trackClearChat: jest.fn<void, []>(),
    trackSearchUsed: jest.fn<void, []>(),
    trackTryItYourself: jest.fn<void, []>(),
    trackSpeechPracticeStarted: jest.fn<void, [string]>(),
    trackSpeechOccasionSelected: jest.fn<void, [string]>(),
    trackSpeechFeedbackViewed: jest.fn<void, [string]>()
  };
}
