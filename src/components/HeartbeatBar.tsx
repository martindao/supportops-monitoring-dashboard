import { useMemo } from 'react';

interface HeartbeatBarProps {
  services: { id: string; health: 'healthy' | 'degraded' | 'down' }[];
}

export function HeartbeatBar({ services }: HeartbeatBarProps) {
  const stats = useMemo(() => {
    const up = services.filter((s) => s.health === 'healthy').length;
    const degraded = services.filter((s) => s.health === 'degraded').length;
    const down = services.filter((s) => s.health === 'down').length;
    const total = services.length;
    return { up, degraded, down, total };
  }, [services]);

  // Generate 24 bars representing hourly heartbeat
  const bars = useMemo(() => {
    return Array.from({ length: 24 }, (_, i) => {
      // Simulate some variation in the heartbeat
      const hour = i;
      const isDegradedHour = hour === 15 || hour === 16; // Simulated incident

      if (isDegradedHour) {
        return { status: 'degraded' as const, hour };
      }
      return { status: 'up' as const, hour };
    });
  }, []);

return (
    <div
      className="heartbeat-container rounded-xl p-5"
      style={{
        background: 'var(--surface-800)'
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <span
            className="text-sm font-medium"
            style={{ color: 'var(--text-100)' }}
          >
            Heartbeat
          </span>
          <div className="flex items-center gap-4 text-xs">
            <span
              className="flex items-center gap-2"
              style={{ color: 'var(--text-300)' }}
            >
              <span
                className="w-2 h-2 rounded-sm"
                style={{ background: 'var(--accent-primary)' }}
              />
              {stats.up} Up
            </span>
            {stats.degraded > 0 && (
              <span
                className="flex items-center gap-2"
                style={{ color: 'var(--text-300)' }}
              >
                <span
                  className="w-2 h-2 rounded-sm"
                  style={{ background: 'var(--accent-secondary)' }}
                />
                {stats.degraded} Degraded
              </span>
            )}
            {stats.down > 0 && (
              <span
                className="flex items-center gap-2"
                style={{ color: 'var(--text-300)' }}
              >
                <span
                  className="w-2 h-2 rounded-sm"
                  style={{ background: 'var(--semantic-critical)' }}
                />
                {stats.down} Down
              </span>
            )}
          </div>
        </div>
        <span
          className="text-xs"
          style={{ color: 'var(--text-400)' }}
        >
          Last 24 hours
        </span>
      </div>

      {/* Heartbeat bars */}
      <div className="heartbeat-bars flex items-end">
        {bars.map((bar, index) => {
          const isLast = index === bars.length - 1;
          const heightPercent = isLast ? 100 : 60 + Math.random() * 40;
          const statusClass = bar.status === 'up'
            ? (isLast ? 'heartbeat-bar--now' : '')
            : bar.status === 'degraded'
            ? 'heartbeat-bar--degraded'
            : 'heartbeat-bar--down';

          return (
            <div
              key={index}
              className={`heartbeat-bar flex-1 ${statusClass}`}
              style={{
                height: `${heightPercent}%`,
                background: bar.status === 'up'
                  ? 'var(--accent-primary)'
                  : bar.status === 'degraded'
                  ? 'var(--accent-secondary)'
                  : 'var(--semantic-critical)'
              }}
              title={`Hour ${bar.hour}:00 - ${bar.status}`}
            />
          );
        })}
      </div>

      {/* Time labels */}
      <div
        className="flex justify-between mt-3 text-[10px]"
        style={{ color: 'var(--text-400)' }}
      >
        <span>24h ago</span>
        <span>12h ago</span>
        <span style={{ color: 'var(--accent-primary)', fontWeight: 500 }}>Now</span>
      </div>
    </div>
  );
}
