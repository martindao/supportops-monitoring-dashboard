import type { Service } from '../types/monitoring';
import { HealthBadge } from './HealthBadge';
import { Sparkline } from './Sparkline';
import { Shield, Clock } from 'lucide-react';

interface ServiceCardProps {
  service: Service;
  onClick?: () => void;
}

const healthColors = {
  healthy: '#10b981',
  degraded: '#f59e0b',
  down: '#ef4444',
};

export function ServiceCard({ service, onClick }: ServiceCardProps) {
  const sparklineColor = healthColors[service.health];
  const certWarning = service.certificate && service.certificate.daysUntilExpiry <= 30;

  return (
    <div
      onClick={onClick}
      className="bg-gray-900/50 border border-gray-800 rounded-lg p-4 hover:border-gray-700 hover:shadow-lg hover:shadow-gray-900/50 transition-all cursor-pointer group"
    >
      {/* Header: Name + Status */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div
            className={`w-2.5 h-2.5 rounded-full ${
              service.health === 'healthy'
                ? 'bg-emerald-500'
                : service.health === 'degraded'
                ? 'bg-amber-500'
                : 'bg-rose-500'
            }`}
          />
          <h3 className="text-sm font-semibold text-gray-100">{service.name}</h3>
        </div>
        <HealthBadge health={service.health} />
      </div>

      {/* Uptime % */}
      <div className="mb-3">
        <span className="text-2xl font-bold text-gray-100">{service.metrics.uptimePercent}%</span>
        <span className="text-xs text-gray-500 ml-1">uptime</span>
      </div>

      {/* Sparkline */}
      <div className="mb-3">
        <Sparkline
          data={service.responseTimeHistory}
          width={200}
          height={40}
          color={sparklineColor}
          strokeWidth={2}
        />
      </div>

      {/* Avg Response Time */}
      <div className="flex items-center gap-2 mb-3">
        <Clock className="w-3.5 h-3.5 text-gray-500" />
        <span className="text-sm text-gray-400">
          {service.metrics.avgResponseTime}ms avg
        </span>
      </div>

      {/* Certificate Info */}
      {service.certificate && (
        <div
          className={`flex items-center gap-2 text-xs ${
            certWarning ? 'text-amber-400' : 'text-gray-500'
          }`}
        >
          <Shield className="w-3 h-3" />
          <span>
            {certWarning
              ? `Cert expires in ${service.certificate.daysUntilExpiry} days`
              : `Cert valid for ${service.certificate.daysUntilExpiry} days`}
          </span>
        </div>
      )}
    </div>
  );
}
