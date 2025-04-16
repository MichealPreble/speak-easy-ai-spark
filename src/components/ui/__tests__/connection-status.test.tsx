
import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { vi } from 'vitest';
import { ConnectionStatusIndicator } from '../connection-status';

describe('ConnectionStatusIndicator', () => {
  const originalNavigator = { ...navigator };
  let mockOnline = true;

  beforeEach(() => {
    // Mock navigator.onLine
    Object.defineProperty(navigator, 'onLine', {
      configurable: true,
      get: () => mockOnline,
    });

    // Mock fetch
    global.fetch = vi.fn().mockImplementation(() => 
      Promise.resolve({ ok: true })
    );

    // Mock window event listeners
    window.addEventListener = vi.fn();
    window.removeEventListener = vi.fn();
  });

  afterEach(() => {
    // Restore original navigator
    Object.defineProperty(navigator, 'onLine', {
      get: () => originalNavigator.onLine,
    });

    vi.clearAllMocks();
  });

  test('renders online status when connected', () => {
    mockOnline = true;
    
    render(<ConnectionStatusIndicator />);
    
    expect(screen.getByTestId('connection-status-online')).toBeInTheDocument();
    expect(screen.getByText('Online')).toBeInTheDocument();
  });

  test('renders offline status when disconnected', () => {
    mockOnline = false;
    
    render(<ConnectionStatusIndicator />);
    
    expect(screen.getByTestId('connection-status-offline')).toBeInTheDocument();
    expect(screen.getByText('Offline')).toBeInTheDocument();
  });

  test('shows error status when fetch fails', async () => {
    mockOnline = true;
    
    // Mock failing fetch
    global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));
    
    render(<ConnectionStatusIndicator />);
    
    // Wait for the async operation to complete
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });
    
    expect(screen.getByTestId('connection-status-error')).toBeInTheDocument();
    expect(screen.getByText('Connection Error')).toBeInTheDocument();
  });

  test('registers event listeners for online/offline events', () => {
    render(<ConnectionStatusIndicator />);
    
    expect(window.addEventListener).toHaveBeenCalledWith('online', expect.any(Function));
    expect(window.addEventListener).toHaveBeenCalledWith('offline', expect.any(Function));
  });

  test('removes event listeners on unmount', () => {
    const { unmount } = render(<ConnectionStatusIndicator />);
    unmount();
    
    expect(window.removeEventListener).toHaveBeenCalledWith('online', expect.any(Function));
    expect(window.removeEventListener).toHaveBeenCalledWith('offline', expect.any(Function));
  });
});
