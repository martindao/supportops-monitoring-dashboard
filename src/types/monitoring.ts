export interface Service {
  id: string;
  name: string;
  description: string;
  health: 'healthy' | 'degraded' | 'down';
  metrics: {
    uptimePercent: number;
    responseTimeP95: number;
    errorRate: number;
    avgResponseTime: number;
  };
  responseTimeHistory: number[];
  certificate?: {
    expiryDate: string;
    daysUntilExpiry: number;
    issuer: string;
  };
  lastUpdated: string;
}

export interface Alert {
  id: string;
  serviceId: string;
  severity: 'critical' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: string;
  status: 'active' | 'acknowledged' | 'resolved';
}

export interface Incident {
  id: string;
  title: string;
  serviceId: string;
  status: 'open' | 'investigating' | 'identified' | 'resolved';
  severity: 'critical' | 'warning' | 'info';
  createdAt: string;
  updatedAt: string;
  timeline: {
    timestamp: string;
    type: string;
    message: string;
    author?: string;
  }[];
  relatedAlerts: string[];
}
