
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ConnectionStatusIndicator } from '../connection-status';
import { Wifi, WifiOff, AlertCircle } from 'lucide-react';

// Mock navigator.onLine
Object.defineProperty(window, 'navigator', {
  value: { onLine: true },
  writable: true,
});

// Mock window.addEventListener and removeEventListener
const addEventListenerMock = jest.fn();
const removeEventListenerMock = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();
  window.addEventListener = addEventListenerMock;
  window.removeEventListener = removeEventListenerMock;
  (navigator as any).onLine = true;
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe('ConnectionStatusIndicator', () => {
  it('renders online status initially when navigator.onLine is true', () => {
    render(<ConnectionStatusIndicator />);
    expect(screen.getByText('Online')).toBeInTheDocument();
    expect(screen.getByLabelText('Connection status: Online')).toHaveClass('bg-green-500');
    expect(screen.getByTestId('Wifi')).toBeInTheDocument();
  });

  it('renders offline status when navigator.onLine is false', () => {
    (navigator as any).onLine = false;
    render(<ConnectionStatusIndicator />);
    expect(screen.getByText('Offline')).toBeInTheDocument();
    expect(screen.getByLabelText('Connection status: Offline')).toHaveClass('bg-red-500');
    expect(screen.getByTestId('WifiOff')).toBeInTheDocument();
  });

  it('adds and removes online/offline event listeners', async () => {
    const { unmount } = render(<ConnectionStatusIndicator />);
    
    // Verify event listeners were added
    expect(addEventListenerMock).toHaveBeenCalledWith('online', expect.any(Function));
    expect(addEventListenerMock).toHaveBeenCalledWith('offline', expect.any(Function));
    
    // Store the event handler functions
    const onlineHandler = (addEventListenerMock as jest.Mock).mock.calls?.find(
      call => call[0] === 'online'
    )?.[1];
    const offlineHandler = (addEventListenerMock as jest.Mock).mock.calls?.find(
      call => call[0] === 'offline'
    )?.[1];

    // Simulate offline event
    if (offlineHandler) {
      (navigator as any).onLine = false;
      offlineHandler();
      await waitFor(() => {
        expect(screen.getByText('Offline')).toBeInTheDocument();
      });
    }

    // Unmount and verify listeners were removed
    unmount();
    expect(removeEventListenerMock).toHaveBeenCalledWith('online', onlineHandler);
    expect(removeEventListenerMock).toHaveBeenCalledWith('offline', offlineHandler);
  });

  it('shows tooltip on hover', async () => {
    render(<ConnectionStatusIndicator />);
    const badge = screen.getByLabelText('Connection status: Online');
    
    await userEvent.hover(badge);
    await waitFor(() => {
      expect(screen.getByText('You are connected to the internet')).toBeInTheDocument();
    });

    await userEvent.unhover(badge);
    await waitFor(() => {
      expect(screen.queryByText('You are connected to the internet')).not.toBeInTheDocument();
    });
  });

  it('updates to error status on failed ping', async () => {
    // Mock fetch to simulate failed ping
    jest.spyOn(global, 'fetch').mockRejectedValue(new Error('Network error'));
    
    render(<ConnectionStatusIndicator pingUrl="https://test.com/ping" />);
    
    await waitFor(() => {
      expect(screen.getByText('Connection Error')).toBeInTheDocument();
      expect(screen.getByLabelText('Connection status: Connection Error')).toHaveClass('bg-yellow-500');
      expect(screen.getByTestId('AlertCircle')).toBeInTheDocument();
    });

    global.fetch.mockRestore();
  });

  it('debounces status updates', async () => {
    const { unmount } = render(<ConnectionStatusIndicator debounceMs={100} />);
    
    const offlineHandler = (addEventListenerMock as jest.Mock).mock.calls?.find(
      call => call[0] === 'offline'
    )?.[1];

    if (offlineHandler) {
      (navigator as any).onLine = false;
      offlineHandler();
      // Status should not update immediately due to debounce
      expect(screen.getByText('Online')).toBeInTheDocument();
      
      await waitFor(() => {
        expect(screen.getByText('Offline')).toBeInTheDocument();
      }, { timeout: 200 });
    }

    unmount();
  });

  it('is accessible', () => {
    render(<ConnectionStatusIndicator />);
    const badge = screen.getByRole('status');
    expect(badge).toHaveAttribute('aria-live', 'polite');
    expect(badge).toHaveAttribute('aria-label', 'Connection status: Online');
  });
});

// Add data-testid to Lucide icons for testing
jest.mock('lucide-react', () => ({
  Wifi: (props: any) => <svg data-testid="Wifi" {...props} />,
  WifiOff: (props: any) => <svg data-testid="WifiOff" {...props} />,
  AlertCircle: (props: any) => <svg data-testid="AlertCircle" {...props} />,
}));
