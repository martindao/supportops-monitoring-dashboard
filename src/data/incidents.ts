import type { Incident } from '../types/monitoring';

export const incidents: Incident[] = [
  {
    id: 'INC-2026-001',
    title: 'Payment Processing Degradation',
    serviceId: 'payment-service',
    status: 'investigating',
    severity: 'critical',
    createdAt: '2026-03-28T09:15:00Z',
    updatedAt: '2026-03-28T10:30:00Z',
    timeline: [
      {
        timestamp: '2026-03-28T09:15:00Z',
        type: 'incident_created',
        message: 'Incident created: Payment Processing Degradation',
        author: 'System',
      },
      {
        timestamp: '2026-03-28T09:20:00Z',
        type: 'alert_triggered',
        message: 'Alert triggered: Response time above threshold',
        author: 'Monitoring',
      },
      {
        timestamp: '2026-03-28T09:45:00Z',
        type: 'alert_triggered',
        message: 'Alert triggered: Error rate exceeded 2%',
        author: 'Monitoring',
      },
      {
        timestamp: '2026-03-28T10:30:00Z',
        type: 'status_update',
        message: 'Engineering team investigating root cause',
        author: 'Sarah Chen',
      },
    ],
    relatedAlerts: ['ALT-001', 'ALT-002'],
  },
];
