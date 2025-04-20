
import React from 'react';
import { render, screen } from '@testing-library/react';
import { SessionSummaryPanel } from '../SessionSummaryPanel';

describe('SessionSummaryPanel', () => {
  const mockProps = {
    isActive: false,
    duration: 65,  // 1m 5s
    wordCount: 132,
    wpm: 120,
    cadenceMetrics: {
      averagePauseMs: 750,
      cadenceScore: 85
    }
  };

  it('renders when not speaking', () => {
    render(<SessionSummaryPanel {...mockProps} />);
    
    expect(screen.getByText('Session Summary')).toBeInTheDocument();
    expect(screen.getByText('1m 5s')).toBeInTheDocument();
    expect(screen.getByText('132')).toBeInTheDocument();
    expect(screen.getByText('120 WPM')).toBeInTheDocument();
    expect(screen.getByText('85/100')).toBeInTheDocument();
  });

  it('does not render when speaking', () => {
    const { container } = render(
      <SessionSummaryPanel {...{...mockProps, isActive: true}} />
    );
    
    expect(container.firstChild).toBeNull();
  });

  it('handles null metrics gracefully', () => {
    const incompleteProps = {
      ...mockProps,
      wpm: null,
      cadenceMetrics: {
        averagePauseMs: null,
        cadenceScore: null
      }
    };

    render(<SessionSummaryPanel {...incompleteProps} />);
    
    expect(screen.getByText('—')).toBeInTheDocument();
  });
});
