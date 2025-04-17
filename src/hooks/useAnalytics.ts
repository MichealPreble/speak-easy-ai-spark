
/**
 * A simple hook for tracking user events in the application.
 * This can be extended to use Google Analytics, Plausible, or other analytics providers.
 */

// Generic analytics event tracking function
export function trackEvent(
  action: string, 
  category: string, 
  label?: string, 
  value?: number
) {
  // Check if Google Analytics is available (window.gtag)
  if (typeof window !== 'undefined' && 'gtag' in window) {
    // @ts-ignore - gtag isn't in window type definitions
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value
    });
  }
}

// Hook for analytics
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
  const trackVoiceMessage = () => trackEvent('voice_message', 'Chat', 'Voice Message Sent');
  const trackThemeToggle = (theme: string) => trackEvent('theme_toggle', 'UI', `Theme changed to ${theme}`);
  const trackMessageSent = () => trackEvent('message_sent', 'Chat', 'Text Message Sent');
  const trackSummarize = () => trackEvent('summarize', 'Chat', 'Conversation Summarized');
  const trackClearChat = () => trackEvent('clear_chat', 'Chat', 'Chat Cleared');
  const trackSearchUsed = () => trackEvent('search', 'Chat', 'Search Messages');
  const trackTryItYourself = () => trackEvent('try_it_yourself', 'Hero', 'Clicked Try It Yourself Button');
  
  // Speech practice related events
  const trackSpeechPracticeStarted = (occasion: string) => 
    trackEvent('speech_practice_started', 'Practice', `Started practice for ${occasion}`);
  const trackSpeechOccasionSelected = (occasion: string) => 
    trackEvent('speech_occasion_selected', 'Practice', `Selected ${occasion}`);
  const trackSpeechFeedbackViewed = (occasion: string) => 
    trackEvent('speech_feedback_viewed', 'Practice', `Viewed feedback for ${occasion}`);

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
