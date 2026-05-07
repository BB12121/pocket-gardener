import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { plants, species, careLogs, careTasks, aiSuggestions, plantGrowthData } from '../data/mockData';
import Icon, { getPlantIcon, getTaskIcon } from '../components/Icon';
import Heatmap from '../components/Heatmap';
import GrowthChart from '../components/GrowthChart';

export default function PlantDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const plant = plants.find(p => p.id === id);
  const sp = species.find(s => s.id === plant?.speciesId);
  const logs = careLogs.filter(l => l.plantId === id);
  const tasks = careTasks.filter(t => t.plantId === id && t.status === '待处理');
  const suggestions = aiSuggestions.filter(a => a.plantId === id);
  const growthData = plantGrowthData[id] || {};

  const [speciesExpanded, setSpeciesExpanded] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [chartType, setChartType] = useState('height');

  if (!plant) return <div className="page"><div className="empty">植物不存在</div></div>;

  const iconName = getPlantIcon(sp?.category);
  const logDates = logs.map(l => l.time.split(' ')[0]);
  const selectedLogs = selectedDate ? logs.filter(l => l.time.startsWith(selectedDate)) : [];

  const chartOptions = [
    { key: 'height', label: '高度', unit: 'cm', color: '#07c160' },
    { key: 'leaves', label: '叶片数', unit: '片', color: '#10aeff' },
    { key: 'health', label: '健康度', unit: '分', color: '#fa9d3b' },
  ];
  const currentChart = chartOptions.find(c => c.key === chartType);
  const currentData = growthData[chartType] || [];
  const hasGrowthData = currentData.length >= 2;

  return (
    <div className="page">
      <div className="page-header">
        <button className="back-btn" onClick={() => navigate(-1)}>‹</button>
        <h1>{plant.nickname}</h1>
      </div>

      <div className="section" style={{ padding: '24px 16px', textAlign: 'center' }}>
        {plant.image ? (
          <img src={plant.image} alt={plant.nickname} style={{
            width: '80px', height: '80px', borderRadius: '16px', objectFit: 'cover', margin: '0 auto', display: 'block'
          }} />
        ) : (
          <div className="avatar avatar-lg" style={{ margin: '0 auto', borderRadius: '16px', background: 'var(--green-bg)' }}>
            <Icon name={iconName} size={32} color="#4d8c30" />
          </div>
        )}
        <div style={{ fontSize: '18px', fontWeight: '500', marginTop: '12px' }}>{plant.nickname}</div>
        <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
          {sp?.name} · {sp?.latin}
        </div>
        <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'center', gap: '6px', flexWrap: 'wrap' }}>
          <span className={`tag ${plant.status === '健康' ? 'tag-green' : 'tag-orange'}`}>{plant.status}</span>
          {plant.tags.map(t => <span key={t} className="tag tag-gray">{t}</span>)}
        </div>
        <div style={{ fontSize: '12px', color: 'var(--text-placeholder)', marginTop: '8px' }}>
          {plant.location} · 建档 {plant.createDate}
        </div>
      </div>

      <div className="section" style={{ padding: '12px 16px' }}>
        <div className="flex gap-8">
          <Link to={`/plant/${id}/log`} className="btn btn-primary" style={{ flex: 1 }}>记录养护</Link>
          <Link to={`/ai/${id}`} className="btn btn-default" style={{ flex: 1 }}>AI建议</Link>
        </div>
      </div>

      <div className="section">
        <div className="section-header">
          <span className="section-title">品种信息</span>
        </div>
        <div className="cell">
          <div className="cell-content"><div className="cell-title">浇水周期</div></div>
          <span className="cell-extra">{sp?.waterCycle}天</span>
        </div>
        <div className="cell">
          <div className="cell-content"><div className="cell-title">施肥周期</div></div>
          <span className="cell-extra">{sp?.fertCycle}天</span>
        </div>
        {speciesExpanded && (
          <>
            <div className="cell">
              <div className="cell-content"><div className="cell-title">光照需求</div></div>
              <span className="cell-extra">{sp?.light}</span>
            </div>
            <div className="cell">
              <div className="cell-content"><div className="cell-title">类别</div></div>
              <span className="cell-extra">{sp?.category}</span>
            </div>
          </>
        )}
        <div className="expand-row" onClick={() => setSpeciesExpanded(!speciesExpanded)}>
          <span>{speciesExpanded ? '收起' : '展开更多'}</span>
          <Icon name={speciesExpanded ? 'chevron-up' : 'chevron-down'} size={14} color="var(--text-secondary)" />
        </div>
      </div>

      {tasks.length > 0 && (
        <div className="section">
          <div className="section-header">
            <span className="section-title">待办任务</span>
          </div>
          {tasks.map(task => (
            <div key={task.id} className="cell">
              <div className="cell-content">
                <div className="cell-title">{task.type}</div>
                <div className="cell-desc">{task.planTime}</div>
              </div>
              <span className={`tag ${task.priority === '高' ? 'tag-red' : 'tag-orange'}`}>{task.priority}</span>
            </div>
          ))}
        </div>
      )}

      <div className="section">
        <div className="section-header">
          <span className="section-title">养护日志</span>
          <span style={{ fontSize: '13px', color: 'var(--text-placeholder)' }}>{logs.length}条</span>
        </div>
        <Heatmap
          activeDates={logDates}
          color="var(--green)"
          onDayClick={(date) => setSelectedDate(date)}
        />
        {selectedDate && selectedLogs.length > 0 && (
          <div style={{ padding: '0 16px 12px' }}>
            {selectedLogs.map(log => (
              <div key={log.id} className="cell" style={{ alignItems: 'flex-start' }}>
                <div className="cell-icon" style={{ background: '#f5f5f5', borderRadius: '50%', width: '32px', height: '32px' }}>
                  <Icon name={getTaskIcon(log.type)} size={16} color="var(--text-secondary)" />
                </div>
                <div className="cell-content">
                  <div className="cell-title">{log.type}</div>
                  <div className="cell-desc">{log.note}</div>
                </div>
                <span style={{ fontSize: '12px', color: 'var(--text-placeholder)', whiteSpace: 'nowrap' }}>
                  {log.time.split(' ')[1]}
                </span>
              </div>
            ))}
          </div>
        )}
        {selectedDate && selectedLogs.length === 0 && (
          <div style={{ padding: '0 16px 12px', fontSize: '13px', color: 'var(--text-placeholder)' }}>
            {selectedDate} 无养护记录
          </div>
        )}
      </div>

      {(hasGrowthData || growthData.height?.length >= 2) && (
        <div className="section">
          <div className="section-header">
            <span className="section-title">生长数据</span>
            <div className="flex gap-8">
              {chartOptions.map(opt => (
                <button
                  key={opt.key}
                  className={`btn btn-sm ${chartType === opt.key ? 'btn-primary' : 'btn-default'}`}
                  style={chartType === opt.key ? { background: opt.color, boxShadow: 'none' } : {}}
                  onClick={() => setChartType(opt.key)}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
          {hasGrowthData && (
            <GrowthChart data={currentData} unit={currentChart.unit} color={currentChart.color} />
          )}
          {!hasGrowthData && (
            <div style={{ padding: '16px', fontSize: '13px', color: 'var(--text-placeholder)', textAlign: 'center' }}>
              暂无{currentChart.label}数据
            </div>
          )}
        </div>
      )}

      {suggestions.length > 0 && (
        <div className="section">
          <div className="section-header">
            <span className="section-title">AI建议</span>
          </div>
          {suggestions.map(s => (
            <div key={s.id} className="cell" style={{ alignItems: 'flex-start' }}>
              <div className="cell-content">
                <div className="cell-title">{s.summary}</div>
                <div className="cell-desc" style={{ marginTop: '4px' }}>{s.time}</div>
              </div>
              <span className={`tag ${s.risk === '中' ? 'tag-orange' : 'tag-green'}`}>{s.risk}风险</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
