interface SparklineProps {
  data: number[];
  width?: number;
  height?: number;
  color?: string;
  strokeWidth?: number;
}

export function Sparkline({
  data,
  width = 120,
  height = 30,
  color = '#10b981',
  strokeWidth = 2,
}: SparklineProps) {
  if (!data || data.length === 0) return null;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  // Create points for the sparkline
  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * width;
    const y = height - ((value - min) / range) * height;
    return `${x},${y}`;
  });

  // Create area path for fill
  const areaPath = `M0,${height} L${points.join(' L')} L${width},${height} Z`;

  // Create line path
  const linePath = `M${points.join(' L')}`;

  return (
    <svg width={width} height={height} className="overflow-visible sparkline-enhanced" style={{ color }}>
      {/* Gradient definition */}
      <defs>
        <linearGradient id={`sparkline-gradient-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Area fill */}
      <path
        d={areaPath}
        fill={`url(#sparkline-gradient-${color.replace('#', '')})`}
        stroke="none"
      />

      {/* Line */}
      <path
        d={linePath}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Last point dot */}
      <circle
        cx={width}
        cy={height - ((data[data.length - 1] - min) / range) * height}
        r={4}
        fill={color}
      />
    </svg>
  );
}
