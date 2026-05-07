import { Link } from 'react-router-dom';
import { plants, species, careTasks, weatherAlerts } from '../data/mockData';
import Icon, { getPlantIcon, getTaskIcon } from '../components/Icon';

export default function Home() {
  const pendingTasks = careTasks.filter(t => t.status === '待处理');
  const activeAlerts = weatherAlerts.length;

  return (
    <div className="page">
      <div className="section" style={{ padding: '16px' }}>
        <div className="flex-between">
          <div>
            <div style={{ fontSize: '20px', fontWeight: '500' }}>我的花园</div>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
              {pendingTasks.length} 个待办任务
            </div>
          </div>
          <Link to="/weather" style={{
            display: 'flex', alignItems: 'center', gap: '4px',
            fontSize: '13px', color: activeAlerts > 0 ? 'var(--orange)' : 'var(--text-secondary)'
          }}>
            {activeAlerts > 0 && <span className="badge-dot" style={{ background: 'var(--orange)' }} />}
            {activeAlerts}条预警 ›
          </Link>
        </div>
      </div>

      <div className="section">
        <div className="section-header">
          <span className="section-title">我的植物</span>
          <Link to="/add-plant" className="btn-text">添加</Link>
        </div>
        <div className="grid-2">
          {plants.map(plant => {
            const sp = species.find(s => s.id === plant.speciesId);
            const iconName = getPlantIcon(sp?.category);
            return (
              <Link to={`/plant/${plant.id}`} key={plant.id} className="plant-card">
                <div className="plant-card-img">
                  {plant.image ? (
                    <img src={plant.image} alt={plant.nickname} />
                  ) : (
                    <div className="plant-card-placeholder">
                      <Icon name={iconName} size={28} color="#4d8c30" />
                    </div>
                  )}
                  <span className={`tag ${plant.status === '健康' ? 'tag-green' : 'tag-orange'}`} style={{ position: 'absolute', top: '8px', right: '8px' }}>
                    {plant.status}
                  </span>
                </div>
                <div className="plant-card-info">
                  <div style={{ fontSize: '15px', fontWeight: '500' }}>{plant.nickname}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>{sp?.name}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-placeholder)', marginTop: '4px' }}>
                    {plant.location}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {pendingTasks.length > 0 && (
        <div className="section">
          <div className="section-header">
            <span className="section-title">今日待办</span>
            <Link to="/tasks" className="btn-text">查看全部</Link>
          </div>
          {pendingTasks.slice(0, 3).map(task => {
            const plant = plants.find(p => p.id === task.plantId);
            const typeColor = {
              '浇水': '#4facfe', '施肥': '#43e97b', '修剪': '#fa709a',
              '换盆': '#a18cd1', '病虫害观察': '#f6d365',
            };
            const barColor = typeColor[task.type] || 'var(--text-placeholder)';
            return (
              <div key={task.id} className="cell">
                <div style={{
                  width: '3px', height: '28px', borderRadius: '2px',
                  background: barColor, marginRight: '12px', flexShrink: 0
                }} />
                <div className="cell-content">
                  <div className="cell-title">{plant?.nickname} · {task.type}</div>
                  <div className="cell-desc">{task.planTime}</div>
                </div>
                <span className={`tag ${task.priority === '高' ? 'tag-red' : task.priority === '中' ? 'tag-orange' : 'tag-gray'}`}>
                  {task.priority}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
