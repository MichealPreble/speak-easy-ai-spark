
import React from 'react';
import { render, screen } from '@testing-library/react';
import { Timer } from 'lucide-react';
import { MetricCard } from '../MetricCard';

describe('MetricCard', () => {
  const mockProps = {
    icon: Timer,
    title: 'Duration',
    value: '1m 5s',
    description: 'Total speaking time'
  };

  it('renders all card elements correctly', () => {
    render(<MetricCard {...mockProps} />);
    
    expect(screen.getByText('Duration')).toBeInTheDocument();
    expect(screen.getByText('1m 5s')).toBeInTheDocument();
    expect(screen.getByText('Total speaking time')).toBeInTheDocument();
  });

  it('renders icon correctly', () => {
    render(<MetricCard {...mockProps} />);
    
    const icon = screen.getByTestId('metric-card-icon');
    expect(icon).toBeInTheDocument();
  });
});
