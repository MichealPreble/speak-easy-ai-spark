import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { ConnectionStatusIndicator } from '../connection-status';
import { Wifi, WifiOff, AlertCircle } from 'lucide-react';

// Configurable test IDs to match component implementation
const TEST_IDS = {
  badge: 'connection-status',
  iconOnline: 'icon-wifi',
  iconOffline: 'icon-wifioff',
  iconError: 'icon-alertcircle',
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
    render(<ConnectionStatusIndicator />);
    const badge = screen.getByTestId(TEST_IDS.badge);

    fireEvent.mouseEnter(badge);
    await waitFor(() => {
      expect(screen.getByText('Connected')).toBeInTheDocument();
    });

    fireEvent.mouseLeave(badge);
    await waitFor(() => {
      expect(screen.queryByText('Connected')).not.toBeInTheDocument();
    }, { timeout: 1000 });
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
}));
