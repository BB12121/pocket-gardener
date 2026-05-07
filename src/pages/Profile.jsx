import { useState } from 'react';
import { currentUser, plants, achievements, careLogs, checkinDays } from '../data/mockData';
import Icon from '../components/Icon';
import Heatmap from '../components/Heatmap';

export default function Profile() {
  const [expanded, setExpanded] = useState(false);
  const achieved = achievements.filter(a => a.achieved);
  const unachieved = achievements.filter(a => !a.achieved);
  const visibleAchievements = expanded
    ? achievements
    : achieved.slice(0, 2);
  const hasMore = achieved.length > 2 || unachieved.length > 0;

  return (
    <div className="page">
      <div className="section" style={{ padding: '24px 16px', textAlign: 'center' }}>
        <div className="avatar avatar-lg avatar-round" style={{ margin: '0 auto' }}>
          {currentUser.avatar}
        </div>
        <div style={{ fontSize: '18px', fontWeight: '500', marginTop: '12px' }}>{currentUser.username}</div>
        <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
          {currentUser.city} · 信誉分 {currentUser.reputation}
        </div>
      </div>

      <div className="section">
        <div className="grid-3">
          <div>
            <div className="stat-num">{plants.length}</div>
            <div className="stat-label">植物</div>
          </div>
          <div>
            <div className="stat-num">{careLogs.length}</div>
            <div className="stat-label">日志</div>
          </div>
          <div>
            <div className="stat-num">{achievements.filter(a => a.achieved).length}</div>
            <div className="stat-label">成就</div>
          </div>
        </div>
      </div>

      <div className="section">
        <div className="section-header">
          <span className="section-title">打卡记录</span>
          <span style={{ fontSize: '13px', color: 'var(--text-placeholder)' }}>连续 {getStreak(checkinDays)} 天</span>
        </div>
        <Heatmap
          activeDates={checkinDays}
          color="var(--orange)"
        />
      </div>

      <div className="section">
        <div className="section-header">
          <span className="section-title">成就</span>
        </div>
        {visibleAchievements.map(ach => (
          <div key={ach.id} className="cell">
            <div className="cell-icon" style={{
              background: ach.achieved ? '#fff7e6' : '#f5f5f5',
              borderRadius: '50%',
              opacity: ach.achieved ? 1 : 0.5
            }}>
              <Icon name={ach.achieved ? 'medal' : 'lock'} size={18} color={ach.achieved ? '#b37300' : 'var(--text-placeholder)'} />
            </div>
            <div className="cell-content">
              <div className="cell-title">{ach.name}</div>
              <div className="cell-desc">{ach.desc}</div>
              {!ach.achieved && (
                <div className="progress-bar" style={{ marginTop: '6px', width: '120px' }}>
                  <div className="progress-fill" style={{ width: `${(ach.progress / ach.target) * 100}%` }} />
                </div>
              )}
            </div>
            {ach.achieved ? (
              <span className="tag tag-green">已达成</span>
            ) : (
              <span style={{ fontSize: '12px', color: 'var(--text-placeholder)' }}>{ach.progress}/{ach.target}</span>
            )}
          </div>
        ))}
        {hasMore && (
          <div className="expand-row" onClick={() => setExpanded(!expanded)}>
            <span>{expanded ? '收起' : `展开更多 (${achievements.length - 2})`}</span>
            <Icon name={expanded ? 'chevron-up' : 'chevron-down'} size={14} color="var(--text-secondary)" />
          </div>
        )}
      </div>

      <div className="section">
        <div className="section-header">
          <span className="section-title">设置</span>
        </div>
        {['通知设置', '城市设置', '语言', '关于口袋园丁'].map(item => (
          <div key={item} className="cell">
            <div className="cell-content"><div className="cell-title">{item}</div></div>
            <span className="cell-arrow">›</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function getStreak(days) {
  const sorted = [...days].sort().reverse();
  let streak = 0;
  const today = new Date('2026-05-07');
  const check = new Date(today);
  for (let i = 0; i < 60; i++) {
    const dateStr = check.toISOString().split('T')[0];
    if (sorted.includes(dateStr)) {
      streak++;
    } else {
      break;
    }
    check.setDate(check.getDate() - 1);
  }
  return streak;
}
