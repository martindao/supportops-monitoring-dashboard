import type { Service } from '../types/monitoring';

interface HealthBadgeProps {
  health: Service['health'];
}

const healthConfig = {
  healthy: {
    label: 'Healthy',
    bgColor: 'bg-emerald-500/10',
    textColor: 'text-emerald-500',
    borderColor: 'border-emerald-500/30',
    dotColor: 'bg-emerald-500',
  },
  degraded: {
    label: 'Degraded',
    bgColor: 'bg-amber-500/10',
    textColor: 'text-amber-500',
    borderColor: 'border-amber-500/30',
    dotColor: 'bg-amber-500',
  },
  down: {
    label: 'Down',
    bgColor: 'bg-rose-500/10',
    textColor: 'text-rose-500',
    borderColor: 'border-rose-500/30',
    dotColor: 'bg-rose-500',
  },
};

export function HealthBadge({ health }: HealthBadgeProps) {
  const config = healthConfig[health];

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${config.bgColor} ${config.textColor} ${config.borderColor}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dotColor}`} />
      {config.label}
    </span>
  );
}
