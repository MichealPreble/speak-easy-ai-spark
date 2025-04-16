
import React from 'react';
import { render, screen, waitFor, fireEvent, act } from '@testing-library/react';
import { ConnectionStatusIndicator } from '../connection-status';
import { Wifi, WifiOff, AlertCircle, RefreshCw } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

// Mock toast
jest.mock('@/hooks/use-toast', () => ({
  toast: jest.fn(),
  useToast: jest.fn().mockReturnValue({ toast: jest.fn() }),
}));

// Configurable test IDs to match component implementation
const TEST_IDS = {
  badge: 'connection-status',
  iconOnline: 'icon-wifi',
  iconOffline: 'icon-wifioff',
  iconError: 'icon-alertcircle',
  retryButton: 'retry-button',
};

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
    const badge = screen.getByTestId(TEST_IDS.badge);
    expect(badge).toHaveTextContent('Online');
    expect(badge).toHaveClass('bg-green-500');
    expect(screen.getByTestId(TEST_IDS.iconOnline)).toBeInTheDocument();
  });

  it('renders offline status when navigator.onLine is false', () => {
    (navigator as any).onLine = false;
    render(<ConnectionStatusIndicator />);
    const badge = screen.getByTestId(TEST_IDS.badge);
    expect(badge).toHaveTextContent('Offline');
    expect(badge).toHaveClass('bg-red-500');
    expect(screen.getByTestId(TEST_IDS.iconOffline)).toBeInTheDocument();
  });

  it('adds and removes online/offline event listeners', async () => {
    const { unmount } = render(<ConnectionStatusIndicator />);

    // Verify event listeners were added
    expect(addEventListenerMock).toHaveBeenCalledWith('online', expect.any(Function));
    expect(addEventListenerMock).toHaveBeenCalledWith('offline', expect.any(Function));

    // Extract event handlers safely
    const onlineHandler = (addEventListenerMock as jest.Mock).mock.calls?.find(
      (call) => call[0] === 'online'
    )?.[1];
    const offlineHandler = (addEventListenerMock as jest.Mock).mock.calls?.find(
      (call) => call[0] === 'offline'
    )?.[1];

    // Simulate offline event
    if (offlineHandler) {
      (navigator as any).onLine = false;
      offlineHandler();
      await waitFor(() => {
        expect(screen.getByTestId(TEST_IDS.badge)).toHaveTextContent('Offline');
      });
    } else {
      throw new Error('Offline handler not found');
    }

    // Verify cleanup on unmount
    unmount();
    expect(removeEventListenerMock).toHaveBeenCalledWith('online', onlineHandler);
    expect(removeEventListenerMock).toHaveBeenCalledWith('offline', offlineHandler);
  });

  it('shows tooltip on mouse enter and hides on mouse leave', async () => {
    // Using fireEvent for manual tooltip testing due to shadcn/ui Tooltip behavior
    render(<ConnectionStatusIndicator />);
    const badge = screen.getByTestId(TEST_IDS.badge);

    // Trigger tooltip with mouse enter
    fireEvent.mouseEnter(badge);
    await waitFor(() => {
      expect(screen.getByText('Active')).toBeInTheDocument();
    });

    // Hide tooltip with mouse leave
    fireEvent.mouseLeave(badge);
    await waitFor(() => {
      expect(screen.queryByText('Active')).not.toBeInTheDocument();
    }, { timeout: 1000 });
  });

  it('updates to error status on failed ping', async () => {
    // Mock fetch with proper restoration
    const fetchMock = jest.spyOn(global, 'fetch').mockRejectedValue(new Error('Network error'));

    render(<ConnectionStatusIndicator pingUrl="https://test.com/ping" />);

    await waitFor(() => {
      const badge = screen.getByTestId(TEST_IDS.badge);
      expect(badge).toHaveTextContent('Connection Error');
      expect(badge).toHaveClass('bg-yellow-500');
      expect(screen.getByTestId(TEST_IDS.iconError)).toBeInTheDocument();
      expect(screen.getByText('Problems')).toBeInTheDocument();
    }, { timeout: 6000 });

    fetchMock.mockRestore();
  });

  it('shows retry button in error state', async () => {
    const fetchMock = jest.spyOn(global, 'fetch').mockRejectedValue(new Error('Network error'));
    
    render(<ConnectionStatusIndicator pingUrl="https://test.com/ping" />);
    
    await waitFor(() => {
      expect(screen.getByTestId(TEST_IDS.retryButton)).toBeInTheDocument();
    }, { timeout: 6000 });
    
    fetchMock.mockRestore();
  });

  it('attempts reconnection when retry button is clicked', async () => {
    // First reject to trigger error state, then resolve on retry
    const fetchMock = jest.spyOn(global, 'fetch')
      .mockRejectedValueOnce(new Error('Network error'))
      .mockResolvedValueOnce(undefined);
    
    render(<ConnectionStatusIndicator pingUrl="https://test.com/ping" />);
    
    // Wait for error state
    await waitFor(() => {
      expect(screen.getByTestId(TEST_IDS.retryButton)).toBeInTheDocument();
    }, { timeout: 6000 });
    
    // Click retry button
    fireEvent.click(screen.getByTestId(TEST_IDS.retryButton));
    
    // Should show toast on successful reconnection
    await waitFor(() => {
      expect(toast).toHaveBeenCalledWith(expect.objectContaining({
        title: "Connection restored",
        description: "You're back online"
      }));
      expect(screen.getByTestId(TEST_IDS.badge)).toHaveTextContent('Online');
    });
    
    fetchMock.mockRestore();
  });

  it('shows loading state on retry button during retry attempt', async () => {
    // Mock fetch to delay resolution
    const fetchMock = jest.spyOn(global, 'fetch').mockImplementation(
      () => new Promise(resolve => setTimeout(() => resolve({} as Response), 500))
    );
    
    // Force initial error state through the component's state
    render(<ConnectionStatusIndicator pingUrl="https://test.com/ping" />);
    
    // Wait for error state to occur
    await waitFor(() => {
      expect(screen.getByTestId(TEST_IDS.retryButton)).toBeInTheDocument();
    }, { timeout: 6000 });
    
    // Click retry button
    fireEvent.click(screen.getByTestId(TEST_IDS.retryButton));
    
    // Button should be disabled during retry
    expect(screen.getByTestId(TEST_IDS.retryButton)).toBeDisabled();
    
    // Wait for retry to complete
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 600));
    });
    
    // Button should be enabled again
    expect(screen.getByTestId(TEST_IDS.retryButton)).not.toBeDisabled();
    
    fetchMock.mockRestore();
  });

  it('debounces status updates', async () => {
    const { unmount } = render(<ConnectionStatusIndicator debounceMs={100} />);

    const offlineHandler = (addEventListenerMock as jest.Mock).mock.calls?.find(
      (call) => call[0] === 'offline'
    )?.[1];

    if (offlineHandler) {
      (navigator as any).onLine = false;
      offlineHandler();
      // Status should not update immediately due to debounce
      expect(screen.getByTestId(TEST_IDS.badge)).toHaveTextContent('Online');

      await waitFor(() => {
        expect(screen.getByTestId(TEST_IDS.badge)).toHaveTextContent('Offline');
        expect(screen.getByText('Disconnected')).toBeInTheDocument();
      }, { timeout: 200 });
    } else {
      throw new Error('Offline handler not found');
    }

    unmount();
  });

  it('is accessible', () => {
    render(<ConnectionStatusIndicator />);
    const badge = screen.getByTestId(TEST_IDS.badge);
    expect(badge).toHaveAttribute('role', 'status');
    expect(badge).toHaveAttribute('aria-live', 'polite');
    expect(badge).toHaveAttribute('aria-label', 'Connection status: Online');
  });
});

// Mock Lucide icons with data-testid attributes
jest.mock('lucide-react', () => ({
  Wifi: (props: any) => <svg data-testid="icon-wifi" {...props} />,
  WifiOff: (props: any) => <svg data-testid="icon-wifioff" {...props} />,
  AlertCircle: (props: any) => <svg data-testid="icon-alertcircle" {...props} />,
  RefreshCw: (props: any) => <svg data-testid="refresh-icon" {...props} />,
}));
