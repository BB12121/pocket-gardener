import { useState } from 'react';
import { localDateString } from '../utils/date';

export default function Heatmap({ activeDates, color = 'var(--green)', onDayClick }) {
  const [selected, setSelected] = useState(null);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dayOfWeek = today.getDay();

  const cellSize = 11;
  const gap = 2;
  const labelWidth = 18;
  const availableWidth = 380 - labelWidth;
  const weeks = Math.floor((availableWidth + gap) / (cellSize + gap));

  const startDate = new Date(today);
  startDate.setDate(startDate.getDate() - ((weeks - 1) * 7 + dayOfWeek));

  const totalDays = weeks * 7;
  const days = [];
  for (let i = 0; i < totalDays; i++) {
    const d = new Date(startDate);
    d.setDate(d.getDate() + i);
    days.push(d);
  }

  const countMap = {};
  activeDates.forEach(date => {
    countMap[date] = (countMap[date] || 0) + 1;
  });

  const handleClick = (dateStr) => {
    const newVal = selected === dateStr ? null : dateStr;
    setSelected(newVal);
    if (onDayClick) onDayClick(newVal);
  };

  const weekLabels = ['', '一', '', '三', '', '五', ''];

  const monthLabels = [];
  for (let w = 0; w < weeks; w++) {
    const weekStart = days[w * 7];
    const month = weekStart.getMonth() + 1;
    if (w === 0 || days[(w - 1) * 7].getMonth() !== weekStart.getMonth()) {
      monthLabels.push({ col: w, label: `${month}月` });
    }
  }

  const gridWidth = weeks * (cellSize + gap) - gap;

  return (
    <div style={{ padding: '0 16px 12px' }}>
      <div style={{ display: 'flex', marginLeft: labelWidth, marginBottom: 4, height: 14, width: gridWidth, position: 'relative' }}>
        {monthLabels.map(({ col, label }) => (
          <span
            key={col}
            style={{
              position: 'absolute',
              left: col * (cellSize + gap),
              fontSize: 10,
              color: 'var(--text-placeholder)',
              whiteSpace: 'nowrap',
            }}
          >
            {label}
          </span>
        ))}
      </div>

      <div style={{ display: 'flex' }}>
        <div style={{ width: labelWidth, flexShrink: 0 }}>
          {weekLabels.map((label, i) => (
            <div key={i} style={{ height: cellSize + gap, fontSize: 9, color: 'var(--text-placeholder)', lineHeight: `${cellSize}px`, display: 'flex', alignItems: 'center' }}>
              {label}
            </div>
          ))}
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${weeks}, ${cellSize}px)`,
          gridTemplateRows: `repeat(7, ${cellSize}px)`,
          gap: `${gap}px`,
          gridAutoFlow: 'column',
        }}>
          {days.map((date, idx) => {
            const dateStr = localDateString(date);
            const count = countMap[dateStr] || 0;
            const isFuture = date > today;
            const isSelected = selected === dateStr;

            let bg = '#ebedf0';
            let cellOpacity = 1;
            if (isFuture) {
              bg = '#ebedf0';
              cellOpacity = 0.4;
            } else if (count > 0) {
              bg = color;
              cellOpacity = count === 1 ? 0.4 : count === 2 ? 0.7 : 1;
            }

            return (
              <div
                key={idx}
                onClick={() => !isFuture && handleClick(dateStr)}
                title={`${dateStr}: ${count}条记录`}
                style={{
                  width: cellSize,
                  height: cellSize,
                  borderRadius: 2,
                  background: bg,
                  opacity: cellOpacity,
                  cursor: isFuture ? 'default' : 'pointer',
                  outline: isSelected ? `2px solid ${color}` : 'none',
                  outlineOffset: -1,
                  transition: 'outline 0.15s',
                }}
              />
            );
          })}
        </div>
      </div>

      {selected && (
        <div style={{ marginTop: 8, fontSize: 12, color: 'var(--text-secondary)', background: '#f6f8fa', borderRadius: 6, padding: '8px 10px' }}>
          <span style={{ fontWeight: 500 }}>{selected}</span>
          {countMap[selected] ? ` · ${countMap[selected]}条记录` : ' · 无记录'}
        </div>
      )}
    </div>
  );
}
