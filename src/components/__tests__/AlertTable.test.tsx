import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { AlertTable } from '../AlertTable';
import type { Alert } from '../../types/monitoring';

const mockAlerts: Alert[] = [
  {
    id: 'ALT-001',
    serviceId: 'payment-service',
    severity: 'critical',
    title: 'Error Rate Critical',
    message: 'Error rate exceeded threshold',
    timestamp: new Date().toISOString(),
    status: 'active',
  },
  {
    id: 'ALT-002',
    serviceId: 'api-gateway',
    severity: 'warning',
    title: 'High Latency Warning',
    message: 'Response time above normal',
    timestamp: new Date().toISOString(),
    status: 'acknowledged',
  },
  {
    id: 'ALT-003',
    serviceId: 'user-service',
    severity: 'info',
    title: 'Maintenance Window',
    message: 'Scheduled maintenance upcoming',
    timestamp: new Date().toISOString(),
    status: 'resolved',
  },
];

describe('AlertTable', () => {
  it('renders all alerts', () => {
    render(<AlertTable alerts={mockAlerts} />);
    expect(screen.getByText('Error Rate Critical')).toBeInTheDocument();
    expect(screen.getByText('High Latency Warning')).toBeInTheDocument();
    expect(screen.getByText('Maintenance Window')).toBeInTheDocument();
  });

  it('shows correct severity badges', () => {
    render(<AlertTable alerts={mockAlerts} />);
    expect(screen.getByText('Critical')).toBeInTheDocument();
    expect(screen.getByText('Warning')).toBeInTheDocument();
    expect(screen.getByText('Info')).toBeInTheDocument();
  });

  it('shows correct status badges', () => {
    render(<AlertTable alerts={mockAlerts} />);
    expect(screen.getByText('Active')).toBeInTheDocument();
    expect(screen.getByText('Acknowledged')).toBeInTheDocument();
    expect(screen.getByText('Resolved')).toBeInTheDocument();
  });

  it('shows empty state when no alerts', () => {
    render(<AlertTable alerts={[]} />);
    expect(screen.getByText('No active alerts')).toBeInTheDocument();
  });

  it('displays alert messages', () => {
    render(<AlertTable alerts={mockAlerts} />);
    expect(screen.getByText('Error rate exceeded threshold')).toBeInTheDocument();
    expect(screen.getByText('Response time above normal')).toBeInTheDocument();
  });
});
