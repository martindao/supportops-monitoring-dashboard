import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ServiceCard } from '../ServiceCard';
import type { Service } from '../../types/monitoring';

const mockService: Service = {
  id: 'test-service',
  name: 'Test Service',
  description: 'A test service for unit tests',
  health: 'healthy',
  metrics: {
    uptimePercent: 99.9,
    responseTimeP95: 45,
    errorRate: 0.1,
    avgResponseTime: 42,
  },
  responseTimeHistory: [40, 42, 38, 45, 41, 43, 39, 44, 42, 40],
  certificate: {
    expiryDate: '2025-06-15',
    daysUntilExpiry: 78,
    issuer: "Let's Encrypt",
  },
  lastUpdated: '2024-03-29T10:30:00Z',
};

describe('ServiceCard', () => {
  it('displays service name', () => {
    render(<ServiceCard service={mockService} />);
    expect(screen.getByText('Test Service')).toBeInTheDocument();
  });

  it('displays uptime percentage', () => {
    render(<ServiceCard service={mockService} />);
    // Text is split across elements: "99.9" + "%" 
    expect(screen.getByText('99.9')).toBeInTheDocument();
    expect(screen.getByText('%')).toBeInTheDocument();
  });

  it('displays average response time', () => {
    render(<ServiceCard service={mockService} />);
    // Text is split with whitespace: "42" + " " + "ms"
    expect(screen.getByText(/42\s*ms/)).toBeInTheDocument();
  });

  it('shows correct health badge', () => {
    render(<ServiceCard service={mockService} />);
    expect(screen.getByText('Healthy')).toBeInTheDocument();
  });

  it('shows certificate info', () => {
    render(<ServiceCard service={mockService} />);
    expect(screen.getByText('Cert valid for 78 days')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const onClick = vi.fn();
    render(<ServiceCard service={mockService} onClick={onClick} />);
    fireEvent.click(screen.getByText('Test Service'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
