
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { analyticsService, trackEvent, type AnalyticsEventData } from '../analytics';

describe('analyticsService', () => {
  let gtagMock: any;

  beforeEach(() => {
    // Clear all mocks between tests
    vi.clearAllMocks();
    
    // Mock window.gtag
    gtagMock = vi.fn();
    const windowSpy = vi.spyOn(global, 'window', 'get');
    windowSpy.mockImplementation(() => ({
      gtag: gtagMock
    } as any));
  });

  describe('event()', () => {
    it('should call gtag with correct parameters', () => {
      const eventData: AnalyticsEventData = {
        category: 'test_category',
        action: 'test_action',
        label: 'test_label',
        value: 123
      };

      analyticsService.event(eventData);

      expect(gtagMock).toHaveBeenCalledWith('event', 'test_action', {
        event_category: 'test_category',
        event_label: 'test_label',
        value: 123
      });
    });

    it('should work without optional parameters', () => {
      const eventData: AnalyticsEventData = {
        category: 'test_category',
        action: 'test_action'
      };

      analyticsService.event(eventData);

      expect(gtagMock).toHaveBeenCalledWith('event', 'test_action', {
        event_category: 'test_category',
        event_label: undefined,
        value: undefined
      });
    });

    it('should log to console in development environment', () => {
      const consoleSpy = vi.spyOn(console, 'log');
      const originalNodeEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';

      const eventData: AnalyticsEventData = {
        category: 'test_category',
        action: 'test_action'
      };

      analyticsService.event(eventData);

      expect(consoleSpy).toHaveBeenCalledWith('Analytics Event:', eventData);

      // Restore original NODE_ENV
      process.env.NODE_ENV = originalNodeEnv;
    });
  });

  describe('trackEvent()', () => {
    it('should call analyticsService.event with correct parameters', () => {
      const spy = vi.spyOn(analyticsService, 'event');

      trackEvent('test_category', 'test_action', 'test_label', 123);

      expect(spy).toHaveBeenCalledWith({
        category: 'test_category',
        action: 'test_action',
        label: 'test_label',
        value: 123
      });
    });

    it('should work with only required parameters', () => {
      const spy = vi.spyOn(analyticsService, 'event');

      trackEvent('test_category', 'test_action');

      expect(spy).toHaveBeenCalledWith({
        category: 'test_category',
        action: 'test_action',
        label: undefined,
        value: undefined
      });
    });
  });
});
