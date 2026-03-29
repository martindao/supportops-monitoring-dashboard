interface MetricCardProps {
  label: string;
  value: string | number;
  unit?: string;
  trend?: 'up' | 'down' | 'neutral';
}

export function MetricCard({ label, value, unit, trend = 'neutral' }: MetricCardProps) {
  const trendColors = {
    up: 'text-emerald-500',
    down: 'text-rose-500',
    neutral: 'text-gray-400',
  };

  return (
    <div className="flex flex-col">
      <span className="text-xs text-gray-500 mb-1">{label}</span>
      <div className="flex items-baseline gap-1">
        <span className="text-lg font-semibold text-gray-100">{value}</span>
        {unit && <span className={`text-xs ${trendColors[trend]}`}>{unit}</span>}
      </div>
    </div>
  );
}
