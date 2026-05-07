import { useNavigate } from 'react-router-dom';
import { weatherAlerts, plants } from '../data/mockData';
import Icon from '../components/Icon';

export default function Weather() {
  const navigate = useNavigate();

  return (
    <div className="page">
      <div className="page-header">
        <button className="back-btn" onClick={() => navigate(-1)}>‹</button>
        <h1>天气预警</h1>
      </div>

      <div className="section" style={{ padding: '16px' }}>
        <div className="flex-center gap-12">
          <div className="cell-icon" style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#f0f9eb' }}>
            <Icon name="sun" size={24} color="#4d8c30" />
          </div>
          <div>
            <div style={{ fontSize: '16px', fontWeight: '500' }}>杭州 · 今日</div>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>32°C / 多云转晴 / 湿度 65%</div>
          </div>
        </div>
      </div>

      <div className="section">
        <div className="section-header">
          <span className="section-title">当前预警 ({weatherAlerts.length})</span>
        </div>
        {weatherAlerts.map(alert => {
          const affected = plants.filter(p => alert.affectedPlants.includes(p.id));
          return (
            <div key={alert.id} className="cell" style={{ flexDirection: 'column', alignItems: 'stretch', gap: '8px' }}>
              <div className="flex-between">
                <div className="flex-center gap-8">
                  <Icon name={alert.type.includes('高温') ? 'thermometer' : 'rain'} size={18} color="var(--orange)" />
                  <span style={{ fontWeight: '500' }}>{alert.type}</span>
                </div>
                <span className={`tag ${alert.level === '橙色' ? 'tag-orange' : 'tag-gray'}`}>{alert.level}</span>
              </div>
              <div style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                {alert.suggestion}
              </div>
              <div className="flex-center gap-8" style={{ flexWrap: 'wrap' }}>
                <span style={{ fontSize: '12px', color: 'var(--text-placeholder)' }}>受影响：</span>
                {affected.map(p => <span key={p.id} className="tag tag-orange">{p.nickname}</span>)}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-placeholder)' }}>{alert.time}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
