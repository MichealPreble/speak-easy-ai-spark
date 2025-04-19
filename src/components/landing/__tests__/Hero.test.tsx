
import { render, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Hero from '../Hero';
import { useAnalytics } from '@/hooks/useAnalytics';
import { useThemeMode } from '@/hooks/useThemeMode';

// Mock the useAnalytics hook
vi.mock('@/hooks/useAnalytics', () => ({
  useAnalytics: vi.fn(() => ({
    trackPageView: vi.fn(),
    trackEvent: vi.fn(),
    trackVoiceMessage: vi.fn(),
    trackThemeToggle: vi.fn(),
  }))
}));

// Mock the useThemeMode hook
vi.mock('@/hooks/useThemeMode', () => ({
  useThemeMode: vi.fn(() => ({
    isDarkMode: false,
    toggleDarkMode: vi.fn(),
  }))
}));

// Mock child components
vi.mock('@/components/landing/HeroHeader', () => ({
  default: () => <div data-testid="mock-hero-header">Hero Header</div>
}));
vi.mock('@/components/landing/HeroDescription', () => ({
  default: () => <div data-testid="mock-hero-description">Hero Description</div>
}));
vi.mock('@/components/landing/HeroButtons', () => ({
  default: () => <div data-testid="mock-hero-buttons">Hero Buttons</div>
}));
vi.mock('@/components/landing/HeroFeatures', () => ({
  default: () => <div data-testid="mock-hero-features">Hero Features</div>
}));
vi.mock('@/components/landing/HeroPreview', () => ({
  default: () => <div data-testid="mock-hero-preview">Hero Preview</div>
}));
vi.mock('@/components/landing/HeroTestimonials', () => ({
  default: () => <div data-testid="mock-hero-testimonials">Hero Testimonials</div>
}));
vi.mock('@/components/landing/SpeechTypeVisual', () => ({
  default: () => <div data-testid="mock-speech-type-visual">Speech Type Visual</div>
}));

describe('Hero Component', () => {
  const mockTrackThemeToggle = vi.fn();
  const mockToggleDarkMode = vi.fn();
  
  beforeEach(() => {
    vi.clearAllMocks();
    (useAnalytics as jest.Mock).mockImplementation(() => ({
      trackPageView: vi.fn(),
      trackEvent: vi.fn(),
      trackVoiceMessage: vi.fn(),
      trackThemeToggle: mockTrackThemeToggle,
    }));
    (useThemeMode as jest.Mock).mockImplementation(() => ({
      isDarkMode: false,
      toggleDarkMode: mockToggleDarkMode,
    }));
  });

  it('should render all hero section components', () => {
    const { getByTestId } = render(<Hero />);
    
    expect(getByTestId('mock-hero-header')).toBeInTheDocument();
    expect(getByTestId('mock-hero-description')).toBeInTheDocument();
    expect(getByTestId('mock-hero-buttons')).toBeInTheDocument();
    expect(getByTestId('mock-hero-features')).toBeInTheDocument();
    expect(getByTestId('mock-hero-preview')).toBeInTheDocument();
    expect(getByTestId('mock-hero-testimonials')).toBeInTheDocument();
    expect(getByTestId('mock-speech-type-visual')).toBeInTheDocument();
  });

  it('should track theme toggle when clicking theme button', () => {
    const { getByRole } = render(<Hero />);
    const themeToggleButton = getByRole('button', { name: /Switch to dark mode/i });
    
    fireEvent.click(themeToggleButton);
    
    expect(mockToggleDarkMode).toHaveBeenCalledTimes(1);
    expect(mockTrackThemeToggle).toHaveBeenCalledTimes(1);
    expect(mockTrackThemeToggle).toHaveBeenCalledWith('dark');
  });

  it('should track theme toggle with correct theme when already in dark mode', () => {
    (useThemeMode as jest.Mock).mockImplementation(() => ({
      isDarkMode: true,
      toggleDarkMode: mockToggleDarkMode,
    }));

    const { getByRole } = render(<Hero />);
    const themeToggleButton = getByRole('button', { name: /Switch to light mode/i });
    
    fireEvent.click(themeToggleButton);
    
    expect(mockToggleDarkMode).toHaveBeenCalledTimes(1);
    expect(mockTrackThemeToggle).toHaveBeenCalledTimes(1);
    expect(mockTrackThemeToggle).toHaveBeenCalledWith('light');
  });
});
