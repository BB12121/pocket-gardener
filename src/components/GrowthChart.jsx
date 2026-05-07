export default function GrowthChart({ data, unit = 'cm', color = 'var(--green)' }) {
  if (!data || data.length < 2) return null;

  const padding = { top: 16, right: 16, bottom: 28, left: 36 };
  const width = 340;
  const height = 140;
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;

  const values = data.map(d => d.value);
  const minV = Math.floor(Math.min(...values) * 0.85);
  const maxV = Math.ceil(Math.max(...values) * 1.1);
  const range = maxV - minV || 1;

  const points = data.map((d, i) => {
    const x = padding.left + (i / (data.length - 1)) * chartW;
    const y = padding.top + chartH - ((d.value - minV) / range) * chartH;
    return { x, y, ...d };
  });

  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ');
  const areaPath = linePath + ` L${points[points.length - 1].x},${padding.top + chartH} L${points[0].x},${padding.top + chartH} Z`;

  const yTicks = [minV, Math.round((minV + maxV) / 2), maxV];

  const gradientId = `chartGradient_${color.replace(/[^a-z0-9]/gi, '')}`;

  return (
    <div style={{ padding: '0 16px 12px', overflow: 'hidden' }}>
      <svg width="100%" viewBox={`0 0 ${width} ${height}`} style={{ display: 'block' }}>
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.3" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        {yTicks.map(tick => {
          const y = padding.top + chartH - ((tick - minV) / range) * chartH;
          return (
            <g key={tick}>
              <line x1={padding.left} y1={y} x2={width - padding.right} y2={y} stroke="#ebedf0" strokeWidth="0.5" />
              <text x={padding.left - 6} y={y + 3} textAnchor="end" fontSize="9" fill="#aeaeb2">{tick}</text>
            </g>
          );
        })}
        <path d={areaPath} fill={`url(#${gradientId})`} />
        <path d={linePath} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        {points.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="3" fill={color} stroke="#fff" strokeWidth="1.5" />
        ))}
        {points.map((p, i) => (
          <text key={`l-${i}`} x={p.x} y={padding.top + chartH + 14} textAnchor="middle" fontSize="8" fill="#aeaeb2">
            {p.date.slice(5)}
          </text>
        ))}
      </svg>
      <div style={{ textAlign: 'center', fontSize: '11px', color: 'var(--text-placeholder)', marginTop: '2px' }}>
        单位: {unit}
      </div>
    </div>
  );
}
