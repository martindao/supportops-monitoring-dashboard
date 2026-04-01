import type { Service } from '../types/monitoring';
import { HealthBadge } from './HealthBadge';
import { Sparkline } from './Sparkline';
import { Shield, Clock } from 'lucide-react';

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

  return (
    <div
      onClick={onClick}
      className="service-card rounded-xl p-5 cursor-pointer group transition-all duration-200"
      style={{
        background: 'linear-gradient(145deg, var(--surface-800) 0%, rgba(31, 41, 55, 0.7) 100%)',
        border: '1px solid var(--border-subtle)',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.03), var(--shadow-sm)'
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
              : 'linear-gradient(90deg, transparent 0%, var(--semantic-critical) 50%, transparent 100%)'
        }}
      />

      {/* Noise texture overlay for premium feel */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.015]"
        style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")'
        }}
      />

      {/* Header: Name + Status */}
      <div className="flex items-start justify-between mb-4 relative z-10">
        <div className="flex items-center gap-2.5">
          <div
            className="w-2 h-2 rounded-full relative"
            style={{
              background: isHealthy
                ? 'var(--accent-primary)'
                : isDegraded
                  ? 'var(--accent-secondary)'
                  : 'var(--semantic-critical)',
              boxShadow: isHealthy
                ? '0 0 12px var(--accent-primary), 0 0 4px var(--accent-primary)'
                : isDegraded
                  ? '0 0 12px var(--accent-secondary), 0 0 4px var(--accent-secondary)'
                  : '0 0 12px var(--semantic-critical), 0 0 4px var(--semantic-critical)'
            }}
          />
          <h3
            className="text-sm font-semibold tracking-tight"
            style={{ color: 'var(--text-100)' }}
          >
            {service.name}
          </h3>
        </div>
        <HealthBadge health={service.health} />
      </div>

      {/* Uptime % - Hero metric */}
      <div className="mb-3 relative z-10">
        <span
          className="text-3xl font-bold tracking-tight tabular-nums"
          style={{ color: 'var(--text-100)' }}
        >
          {service.metrics.uptimePercent}
          <span className="text-lg font-normal" style={{ color: 'var(--text-400)' }}>%</span>
        </span>
        <span
          className="text-[10px] ml-2 uppercase tracking-widest font-medium"
          style={{ color: 'var(--text-500)' }}
        >
          uptime
        </span>
      </div>

      {/* Sparkline */}
      <div className="mb-4 relative z-10">
        <Sparkline
          data={service.responseTimeHistory}
          width={200}
          height={40}
          color={sparklineColor}
          strokeWidth={2}
        />
      </div>

      {/* Metrics row */}
      <div className="flex items-center gap-5 mb-3 relative z-10">
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
          className="flex items-center gap-2 text-xs pt-3 relative z-10"
          style={{
            color: certWarning ? 'var(--accent-secondary)' : 'var(--text-500)',
            borderTop: '1px solid var(--border-subtle)'
          }}
        >
          <Shield className="w-3.5 h-3.5" style={{ color: certWarning ? 'var(--accent-secondary)' : 'var(--text-500)' }} />
          <span className="font-medium">
            {certWarning
              ? `Cert expires in ${service.certificate.daysUntilExpiry} days`
              : `Cert valid for ${service.certificate.daysUntilExpiry} days`}
          </span>
        </div>
      )}
    </div>
  );
}
