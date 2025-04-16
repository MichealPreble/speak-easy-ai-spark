
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

    // Mock setTimeout and clearTimeout
    vi.useFakeTimers();
  });

  afterEach(() => {
    // Restore original navigator
    Object.defineProperty(navigator, 'onLine', {
      get: () => originalNavigator.onLine,
    });

    vi.clearAllMocks();
    vi.useRealTimers();
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
    
    render(<ConnectionStatusIndicator pingUrl="/api/ping" />);
    
    // Wait for the async operation to complete
    await act(async () => {
      await vi.runAllTimersAsync();
    });
    
    expect(screen.getByTestId('connection-status-error')).toBeInTheDocument();
    expect(screen.getByText('Connection Error')).toBeInTheDocument();
  });

  test('debounces status changes', async () => {
    mockOnline = true;
    
    render(<ConnectionStatusIndicator debounceMs={1000} />);
    
    // Initially online
    expect(screen.getByTestId('connection-status-online')).toBeInTheDocument();
    
    // Change to offline
    mockOnline = false;
    const offlineHandler = window.addEventListener.mock.calls.find(
      call => call[0] === 'offline'
    )[1];
    
    act(() => {
      offlineHandler();
    });
    
    // Status should still be online before debounce time
    expect(screen.getByTestId('connection-status-online')).toBeInTheDocument();
    
    // Advance timer past debounce period
    await act(async () => {
      await vi.advanceTimersByTimeAsync(1001);
    });
    
    // Now status should be offline
    expect(screen.getByTestId('connection-status-offline')).toBeInTheDocument();
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
