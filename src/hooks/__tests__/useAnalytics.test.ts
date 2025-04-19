
import { renderHook } from '@testing-library/react-hooks';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { useAnalytics } from '../useAnalytics';
import { analyticsService } from '@/utils/analytics';

describe('useAnalytics', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should provide trackPageView function', () => {
    const gtagMock = vi.fn();
    const windowSpy = vi.spyOn(global, 'window', 'get');
    windowSpy.mockImplementation(() => ({
      gtag: gtagMock
    } as any));

    const { result } = renderHook(() => useAnalytics());

    result.current.trackPageView('/test-path', 'Test Page');

    expect(gtagMock).toHaveBeenCalledWith('config', 'GA_MEASUREMENT_ID', {
      page_path: '/test-path',
      page_title: 'Test Page'
    });
  });

  it('should provide trackEvent function that delegates to analyticsService', () => {
    const spy = vi.spyOn(analyticsService, 'event');
    const { result } = renderHook(() => useAnalytics());

    result.current.trackEvent('test_category', 'test_action', 'test_label', 123);

    expect(spy).toHaveBeenCalledWith({
      category: 'test_category',
      action: 'test_action',
      label: 'test_label',
      value: 123
    });
  });

  it('should track voice messages correctly', () => {
    const spy = vi.spyOn(analyticsService, 'event');
    const { result } = renderHook(() => useAnalytics());

    result.current.trackVoiceMessage();

    expect(spy).toHaveBeenCalledWith({
      category: 'Chat',
      action: 'voice_message',
      label: 'Voice Message Sent'
    });
  });

  it('should track theme changes correctly', () => {
    const spy = vi.spyOn(analyticsService, 'event');
    const { result } = renderHook(() => useAnalytics());

    result.current.trackThemeToggle('dark');

    expect(spy).toHaveBeenCalledWith({
      category: 'UI',
      action: 'theme_toggle',
      label: 'Theme changed to dark'
    });
  });
});
