
/**
 * Analytics utility for tracking user events in the application
 */

// Define the event data structure expected by our analytics
export interface AnalyticsEventData {
  category: string;
  action: string;
  label?: string;
  value?: number;
}

// Main analytics service with properly typed event method
export const analyticsService = {
  /**
   * Track an analytics event
   * @param eventData Object containing event details
   */
  event: (eventData: AnalyticsEventData): void => {
    // Track event with Google Analytics if available
    if (typeof window !== 'undefined' && 'gtag' in window) {
      // @ts-ignore - gtag isn't in window type definitions
      window.gtag('event', eventData.action, {
        event_category: eventData.category,
        event_label: eventData.label,
        value: eventData.value
      });
    }
    
    // Log event to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log('Analytics Event:', eventData);
    }
  }
};

// Helper functions for common event types
export const trackEvent = (
  category: string, 
  action: string, 
  label?: string, 
  value?: number
): void => {
  analyticsService.event({ category, action, label, value });
};

// Export hooks and utilities
export * from '@/hooks/useAnalytics';
