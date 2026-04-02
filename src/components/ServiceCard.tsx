import type { Service } from '../types/monitoring';
import { HealthBadge } from './HealthBadge';
import { Sparkline } from './Sparkline';
import { Shield, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ServiceCardProps {
  service: Service;
  onClick?: () => void;
}

const healthColors = {
  healthy: 'var(--accent-primary)',
  degraded: 'var(--accent-secondary)',
  down: 'var(--semantic-critical)',
};

export function ServiceCard({ service, onClick }: ServiceCardProps) {
  const sparklineColor = healthColors[service.health];
  const certWarning = service.certificate && service.certificate.daysUntilExpiry <= 30;
  const isHealthy = service.health === 'healthy';
  const isDegraded = service.health === 'degraded';

  const getHealthGlow = () => {
    if (isHealthy) return '0 0 12px var(--accent-primary), 0 0 4px var(--accent-primary)';
    if (isDegraded) return '0 0 12px var(--accent-secondary), 0 0 4px var(--accent-secondary)';
    return '0 0 12px var(--semantic-critical), 0 0 4px var(--semantic-critical)';
  };

  return (
    <Card
      onClick={onClick}
      className="cursor-pointer group transition-all duration-200 hover:shadow-lg"
      style={{
        background: 'linear-gradient(145deg, var(--surface-800) 0%, rgba(31, 41, 55, 0.7) 100%)',
        border: '1px solid var(--border-subtle)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Subtle top accent line */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background: isHealthy
            ? 'linear-gradient(90deg, transparent 0%, var(--accent-primary) 50%, transparent 100%)'
            : isDegraded
            ? 'linear-gradient(90deg, transparent 0%, var(--accent-secondary) 50%, transparent 100%)'
            : 'linear-gradient(90deg, transparent 0%, var(--semantic-critical) 50%, transparent 100%)',
        }}
      />

      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2.5">
            <div
              className="w-2 h-2 rounded-full relative"
              style={{
                background: isHealthy
                  ? 'var(--accent-primary)'
                  : isDegraded
                  ? 'var(--accent-secondary)'
                  : 'var(--semantic-critical)',
                boxShadow: getHealthGlow(),
              }}
            />
            <CardTitle className="text-sm tracking-tight" style={{ color: 'var(--text-100)' }}>
              {service.name}
            </CardTitle>
          </div>
          <HealthBadge health={service.health} />
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Uptime % - Hero metric */}
        <div>
          <span
            className="text-3xl font-bold tracking-tight tabular-nums"
            style={{ color: 'var(--text-100)' }}
          >
            {service.metrics.uptimePercent}
            <span className="text-lg font-normal" style={{ color: 'var(--text-400)' }}>
              %
            </span>
          </span>
          <Badge variant="outline" className="ml-2 text-[10px] uppercase tracking-widest">
            uptime
          </Badge>
        </div>

        {/* Sparkline */}
        <Sparkline
          data={service.responseTimeHistory}
          width={200}
          height={40}
          color={sparklineColor}
          strokeWidth={2}
        />

        {/* Metrics row */}
        <div className="flex items-center gap-5">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" style={{ color: 'var(--text-500)' }} />
            <span
              className="text-xs font-medium tabular-nums"
              style={{ color: 'var(--text-300)' }}
            >
              {service.metrics.avgResponseTime}ms
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span
              className="text-[10px] uppercase tracking-widest font-medium"
              style={{ color: 'var(--text-500)' }}
            >
              P95
            </span>
            <span
              className="text-xs font-medium tabular-nums"
              style={{ color: 'var(--text-300)' }}
            >
              {service.metrics.responseTimeP95}ms
            </span>
          </div>
        </div>

        {/* Certificate Info */}
        {service.certificate && (
          <div
            className="flex items-center gap-2 text-xs pt-3"
            style={{
              color: certWarning ? 'var(--accent-secondary)' : 'var(--text-500)',
              borderTop: '1px solid var(--border-subtle)',
            }}
          >
            <Shield
              className="w-3.5 h-3.5"
              style={{ color: certWarning ? 'var(--accent-secondary)' : 'var(--text-500)' }}
            />
            <span className="font-medium">
              {certWarning
                ? `Cert expires in ${service.certificate.daysUntilExpiry} days`
                : `Cert valid for ${service.certificate.daysUntilExpiry} days`}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
