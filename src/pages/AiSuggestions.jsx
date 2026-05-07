import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { plants, species, aiSuggestions, careLogs } from '../data/mockData';

export default function AiSuggestions() {
  const { id } = useParams();
  const navigate = useNavigate();
  const plant = plants.find(p => p.id === id);
  const sp = species.find(s => s.id === plant?.speciesId);
  const suggestions = aiSuggestions.filter(a => a.plantId === id);
  const logs = careLogs.filter(l => l.plantId === id);
  const [generating, setGenerating] = useState(false);
  const [newSuggestion, setNewSuggestion] = useState(null);

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => {
      setNewSuggestion({
        id: 'new',
        time: new Date().toLocaleString('zh-CN'),
        risk: '低',
        model: 'GPT-4o',
        summary: `${plant.nickname}当前状态良好，建议保持现有养护频率`,
        detail: `基于最近${logs.length}条养护记录分析：浇水频率适中，建议继续保持${sp?.waterCycle}天一次的节奏。近期气温升高，可适当增加通风时间。`
      });
      setGenerating(false);
    }, 2000);
  };

  if (!plant) return <div className="page"><div className="empty">植物不存在</div></div>;

  return (
    <div className="page">
      <div className="page-header">
        <button className="back-btn" onClick={() => navigate(-1)}>‹</button>
        <h1>AI建议</h1>
      </div>

      <div className="section" style={{ padding: '20px 16px', textAlign: 'center' }}>
        <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
          {plant.nickname} · {sp?.name}
        </div>
        <div style={{ fontSize: '13px', color: 'var(--text-placeholder)', marginTop: '4px' }}>
          {logs.length} 条日志 · {suggestions.length} 条历史建议
        </div>
        <button
          className="btn btn-primary btn-block"
          onClick={handleGenerate}
          disabled={generating}
          style={{ marginTop: '16px' }}
        >
          {generating ? '分析中...' : '生成养护建议'}
        </button>
      </div>

      {newSuggestion && (
        <div className="section" style={{ borderLeft: '3px solid var(--green)' }}>
          <div className="section-header">
            <span className="section-title">最新建议</span>
            <span style={{ fontSize: '12px', color: 'var(--text-placeholder)' }}>{newSuggestion.time}</span>
          </div>
          <div style={{ padding: '0 16px 16px' }}>
            <div style={{ fontSize: '15px', fontWeight: '500', marginBottom: '8px' }}>{newSuggestion.summary}</div>
            <div style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>{newSuggestion.detail}</div>
          </div>
        </div>
      )}

      {suggestions.length > 0 && (
        <div className="section">
          <div className="section-header">
            <span className="section-title">历史建议</span>
          </div>
          {suggestions.map(s => (
            <div key={s.id} className="cell" style={{ flexDirection: 'column', alignItems: 'stretch', gap: '6px' }}>
              <div className="flex-between">
                <span style={{ fontWeight: '500', fontSize: '15px' }}>{s.summary}</span>
                <span className={`tag ${s.risk === '中' ? 'tag-orange' : 'tag-green'}`}>{s.risk}风险</span>
              </div>
              <div style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>{s.detail}</div>
              <div style={{ fontSize: '12px', color: 'var(--text-placeholder)' }}>{s.time} · {s.model}</div>
            </div>
          ))}
        </div>
      )}

      {suggestions.length === 0 && !newSuggestion && (
        <div className="section">
          <div className="empty">暂无历史建议，点击上方按钮生成</div>
        </div>
      )}
    </div>
  );
}
