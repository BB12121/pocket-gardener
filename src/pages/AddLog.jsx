import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Icon from '../components/Icon';
import { useGardenData } from '../context/useGardenData';

export default function AddLog() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { plants, addLog, refresh } = useGardenData();
  const plant = plants.find(p => p.id === id);
  const [logType, setLogType] = useState('浇水');
  const [note, setNote] = useState('');
  const [status, setStatus] = useState('正常');
  const [submitted, setSubmitted] = useState(false);

  const logTypes = ['浇水', '施肥', '修剪', '换盆', '病虫害', '其他'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addLog({ plantId: id, type: logType, note, status });
    await refresh();
    setSubmitted(true);
    setTimeout(() => navigate(-1), 1500);
  };

  if (!plant) return <div className="page"><div className="empty">植物不存在</div></div>;

  return (
    <div className="page">
      <div className="page-header">
        <button className="back-btn" onClick={() => navigate(-1)}>‹</button>
        <h1>记录养护</h1>
      </div>

      {submitted ? (
        <div className="section" style={{ padding: '48px 16px', textAlign: 'center' }}>
          <Icon name="check" size={48} color="var(--green)" />
          <div style={{ fontSize: '16px', fontWeight: '500', marginTop: '12px' }}>记录成功</div>
          <div style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            已更新 {plant.nickname} 的养护状态
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="section">
            <div className="cell">
              <div className="cell-content">
                <div className="cell-desc">目标植物</div>
                <div className="cell-title" style={{ fontWeight: '500' }}>{plant.nickname}</div>
              </div>
            </div>
          </div>

          <div className="section" style={{ padding: '16px' }}>
            <div style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '10px' }}>养护类型</div>
            <div className="flex gap-8" style={{ flexWrap: 'wrap' }}>
              {logTypes.map(type => (
                <button
                  key={type}
                  type="button"
                  className={`btn btn-sm ${logType === type ? 'btn-primary' : 'btn-default'}`}
                  onClick={() => setLogType(type)}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div className="section">
            <div className="form-group">
              <textarea
                className="form-textarea"
                value={note}
                onChange={e => setNote(e.target.value)}
                placeholder="记录本次养护的详细情况..."
                style={{ padding: '14px 16px' }}
              />
            </div>
          </div>

          <div className="section">
            <div className="form-group">
              <div className="form-item">
                <span className="form-label">状态</span>
                <select className="form-input" value={status} onChange={e => setStatus(e.target.value)} style={{ border: 'none' }}>
                  <option>正常</option>
                  <option>轻微异常</option>
                  <option>黄叶</option>
                  <option>病虫害</option>
                  <option>生长旺盛</option>
                </select>
              </div>
            </div>
          </div>

          <div className="section" style={{ padding: '16px' }}>
            <div style={{
              border: '0.5px dashed var(--border)', borderRadius: '4px',
              padding: '24px', textAlign: 'center', color: 'var(--text-placeholder)'
            }}>
              <Icon name="camera" size={24} color="var(--text-placeholder)" />
              <div style={{ fontSize: '13px', marginTop: '4px' }}>添加照片</div>
            </div>
          </div>

          <div style={{ padding: '16px' }}>
            <button type="submit" className="btn btn-primary btn-block">确认记录</button>
          </div>
        </form>
      )}
    </div>
  );
}
