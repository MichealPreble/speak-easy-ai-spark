
import { trackEvent } from '@/utils/analytics';

/**
 * A simple hook for tracking user events in the application.
 * This can be extended to use Google Analytics, Plausible, or other analytics providers.
 */
export function useAnalytics() {
  // Track page views
  const trackPageView = (path: string, title?: string) => {
    if (typeof window !== 'undefined' && 'gtag' in window) {
      // @ts-ignore - gtag isn't in window type definitions
      window.gtag('config', 'GA_MEASUREMENT_ID', {
        page_path: path,
        page_title: title
      });
    }
  };

  // Predefined tracking functions for common events
  const trackVoiceMessage = () => trackEvent('Chat', 'voice_message', 'Voice Message Sent');
  const trackThemeToggle = (theme: string) => trackEvent('UI', 'theme_toggle', `Theme changed to ${theme}`);
  const trackMessageSent = () => trackEvent('Chat', 'message_sent', 'Text Message Sent');
  const trackSummarize = () => trackEvent('Chat', 'summarize', 'Conversation Summarized');
  const trackClearChat = () => trackEvent('Chat', 'clear_chat', 'Chat Cleared');
  const trackSearchUsed = () => trackEvent('Chat', 'search', 'Search Messages');
  const trackTryItYourself = () => trackEvent('Hero', 'try_it_yourself', 'Clicked Try It Yourself Button');
  
  // Speech practice related events
  const trackSpeechPracticeStarted = (occasion: string) => 
    trackEvent('Practice', 'speech_practice_started', `Started practice for ${occasion}`);
  const trackSpeechOccasionSelected = (occasion: string) => 
    trackEvent('Practice', 'speech_occasion_selected', `Selected ${occasion}`);
  const trackSpeechFeedbackViewed = (occasion: string) => 
    trackEvent('Practice', 'speech_feedback_viewed', `Viewed feedback for ${occasion}`);

  // Add trackEvent to the returned object
  return {
    trackEvent,
    trackPageView,
    trackVoiceMessage,
    trackThemeToggle,
    trackMessageSent,
    trackSummarize,
    trackClearChat,
    trackSearchUsed,
    trackTryItYourself,
    trackSpeechPracticeStarted,
    trackSpeechOccasionSelected,
    trackSpeechFeedbackViewed
  };
}
