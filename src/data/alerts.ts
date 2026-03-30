import type { Alert } from '../types/monitoring';

export const alerts: Alert[] = [
  {
    id: 'ALT-001',
    serviceId: 'payment-service',
    severity: 'critical',
    title: 'Payment Service Error Rate Critical',
    message: 'Error rate exceeded 2% threshold (current: 2.1%)',
    timestamp: '2026-03-28T09:45:00Z',
    status: 'active',
  },
  {
    id: 'ALT-002',
    serviceId: 'payment-service',
    severity: 'warning',
    title: 'Payment Service Response Time Degraded',
    message: 'Response time degraded (380ms > 200ms threshold)',
    timestamp: '2026-03-28T09:30:00Z',
    status: 'active',
  },
];
