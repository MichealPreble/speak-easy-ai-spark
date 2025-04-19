
import { render } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Index from '../Index';
import { useAnalytics } from '@/hooks/useAnalytics';

// Mock the useAnalytics hook
vi.mock('@/hooks/useAnalytics', () => ({
  useAnalytics: vi.fn(() => ({
    trackPageView: vi.fn(),
    trackEvent: vi.fn(),
    trackVoiceMessage: vi.fn(),
    trackThemeToggle: vi.fn(),
  }))
}));

// Mock the components used in Index
vi.mock('@/components/landing/Hero', () => ({
  default: () => <div data-testid="mock-hero">Hero Component</div>
}));
vi.mock('@/components/landing/Features', () => ({
  default: () => <div data-testid="mock-features">Features Component</div>
}));
vi.mock('@/components/landing/HowItWorks', () => ({
  default: () => <div data-testid="mock-how-it-works">How It Works Component</div>
}));
vi.mock('@/components/landing/Pricing', () => ({
  default: () => <div data-testid="mock-pricing">Pricing Component</div>
}));
vi.mock('@/components/landing/ContactForm', () => ({
  default: () => <div data-testid="mock-contact-form">Contact Form Component</div>
}));
vi.mock('@/components/landing/Newsletter', () => ({
  default: () => <div data-testid="mock-newsletter">Newsletter Component</div>
}));
vi.mock('@/components/landing/Footer', () => ({
  default: () => <div data-testid="mock-footer">Footer Component</div>
}));
vi.mock('@/components/SEO', () => ({
  default: () => <div data-testid="mock-seo">SEO Component</div>
}));
vi.mock('@/components/ui/connection-status', () => ({
  ConnectionStatusIndicator: () => <div data-testid="mock-connection-status">Connection Status</div>
}));

describe('Index Page', () => {
  const mockTrackPageView = vi.fn();
  
  beforeEach(() => {
    vi.clearAllMocks();
    (useAnalytics as jest.Mock).mockImplementation(() => ({
      trackPageView: mockTrackPageView,
      trackEvent: vi.fn(),
      trackVoiceMessage: vi.fn(),
      trackThemeToggle: vi.fn(),
    }));
  });

  it('should trigger trackPageView on mount with correct path', () => {
    render(<Index />);
    expect(mockTrackPageView).toHaveBeenCalledTimes(1);
    expect(mockTrackPageView).toHaveBeenCalledWith('/');
  });

  it('should render all required landing page components', () => {
    const { getByTestId } = render(<Index />);
    
    expect(getByTestId('mock-hero')).toBeInTheDocument();
    expect(getByTestId('mock-features')).toBeInTheDocument();
    expect(getByTestId('mock-how-it-works')).toBeInTheDocument();
    expect(getByTestId('mock-pricing')).toBeInTheDocument();
    expect(getByTestId('mock-contact-form')).toBeInTheDocument();
    expect(getByTestId('mock-newsletter')).toBeInTheDocument();
    expect(getByTestId('mock-footer')).toBeInTheDocument();
    expect(getByTestId('mock-seo')).toBeInTheDocument();
    expect(getByTestId('mock-connection-status')).toBeInTheDocument();
  });
});
