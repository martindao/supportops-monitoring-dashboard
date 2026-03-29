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
    <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-gray-100">Heartbeat</span>
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1.5 text-gray-400">
              <span className="w-2 h-2 bg-emerald-500 rounded-sm" />
              {stats.up} Up
            </span>
            {stats.degraded > 0 && (
              <span className="flex items-center gap-1.5 text-gray-400">
                <span className="w-2 h-2 bg-amber-500 rounded-sm" />
                {stats.degraded} Degraded
              </span>
            )}
            {stats.down > 0 && (
              <span className="flex items-center gap-1.5 text-gray-400">
                <span className="w-2 h-2 bg-rose-500 rounded-sm" />
                {stats.down} Down
              </span>
            )}
          </div>
        </div>
        <span className="text-xs text-gray-500">Last 24 hours</span>
      </div>

      {/* Heartbeat bars */}
      <div className="flex items-end gap-1 h-8">
        {bars.map((bar, index) => {
          const isLast = index === bars.length - 1;
          const heightPercent = isLast ? 100 : 60 + Math.random() * 40;

          return (
            <div
              key={index}
              className={`flex-1 rounded-sm transition-all duration-300 ${
                bar.status === 'up'
                  ? 'bg-emerald-500'
                  : bar.status === 'degraded'
                  ? 'bg-amber-500'
                  : 'bg-rose-500'
              } ${isLast ? 'animate-pulse' : ''}`}
              style={{ height: `${heightPercent}%` }}
              title={`Hour ${bar.hour}:00 - ${bar.status}`}
            />
          );
        })}
      </div>

      {/* Time labels */}
      <div className="flex justify-between mt-2 text-[10px] text-gray-500">
        <span>24h ago</span>
        <span>12h ago</span>
        <span>Now</span>
      </div>
    </div>
  );
}
