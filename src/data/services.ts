import type { Service } from '../types/monitoring';

// Generate mock response time history (24 data points for sparkline)
const generateResponseHistory = (baseTime: number, variance: number): number[] => {
  return Array.from({ length: 24 }, () => {
    const randomVariance = (Math.random() - 0.5) * variance * 2;
    return Math.max(10, Math.round(baseTime + randomVariance));
  });
};

export const services: Service[] = [
  {
    id: 'api-gateway',
    name: 'API Gateway',
    description: 'Main entry point for all API requests',
    health: 'healthy',
    metrics: {
      uptimePercent: 99.9,
      responseTimeP95: 45,
      errorRate: 0.1,
      avgResponseTime: 42,
    },
    responseTimeHistory: generateResponseHistory(42, 15),
    certificate: {
      expiryDate: '2025-06-15',
      daysUntilExpiry: 78,
      issuer: 'Let\'s Encrypt',
    },
    lastUpdated: '2026-03-28T10:30:00Z',
  },
  {
    id: 'user-service',
    name: 'User Service',
    description: 'Handles user authentication and profiles',
    health: 'healthy',
    metrics: {
      uptimePercent: 99.8,
      responseTimeP95: 120,
      errorRate: 0.2,
      avgResponseTime: 98,
    },
    responseTimeHistory: generateResponseHistory(98, 25),
    certificate: {
      expiryDate: '2025-05-20',
      daysUntilExpiry: 52,
      issuer: 'DigiCert',
    },
    lastUpdated: '2026-03-28T10:30:00Z',
  },
  {
    id: 'payment-service',
    name: 'Payment Service',
    description: 'Processes payments and transactions',
    health: 'degraded',
    metrics: {
      uptimePercent: 96.2,
      responseTimeP95: 380,
      errorRate: 2.1,
      avgResponseTime: 320,
    },
    responseTimeHistory: [
      ...generateResponseHistory(120, 20).slice(0, 12),
      ...generateResponseHistory(320, 60).slice(12),
    ],
    certificate: {
      expiryDate: '2025-04-10',
      daysUntilExpiry: 12,
      issuer: 'Let\'s Encrypt',
    },
    lastUpdated: '2026-03-28T10:30:00Z',
  },
  {
    id: 'notification-service',
    name: 'Notification Service',
    description: 'Sends email and push notifications',
    health: 'healthy',
    metrics: {
      uptimePercent: 99.7,
      responseTimeP95: 85,
      errorRate: 0.3,
      avgResponseTime: 72,
    },
    responseTimeHistory: generateResponseHistory(72, 18),
    certificate: {
      expiryDate: '2025-08-30',
      daysUntilExpiry: 154,
      issuer: 'Let\'s Encrypt',
    },
    lastUpdated: '2026-03-28T10:30:00Z',
  },
];
