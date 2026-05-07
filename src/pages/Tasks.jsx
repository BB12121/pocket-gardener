import { useState } from 'react';
import { Link } from 'react-router-dom';
import { careTasks, plants, species } from '../data/mockData';
import Icon, { getTaskIcon } from '../components/Icon';
import SwipeCell from '../components/SwipeCell';

export default function Tasks() {
  const [tasks, setTasks] = useState(careTasks);
  const [showForm, setShowForm] = useState(false);
  const [sortBy, setSortBy] = useState('priority');
  const [newTask, setNewTask] = useState({ plantId: 'p1', type: '浇水', planTime: '', priority: '中' });

  const handleComplete = (taskId) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: '已完成' } : t));
  };

  const handlePostpone = (taskId) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: '已延期' } : t));
  };

  const handleIgnore = (taskId) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: '已忽略' } : t));
  };

  const handleAddTask = () => {
    if (!newTask.planTime) return;
    const task = {
      id: `t${Date.now()}`,
      ...newTask,
      status: '待处理',
      source: '手动创建',
    };
    setTasks(prev => [task, ...prev]);
    setShowForm(false);
    setNewTask({ plantId: 'p1', type: '浇水', planTime: '', priority: '中' });
  };

  const sortTasks = (list) => {
    return [...list].sort((a, b) => {
      if (sortBy === 'priority') {
        const w = { '高': 0, '中': 1, '低': 2 };
        return (w[a.priority] ?? 2) - (w[b.priority] ?? 2);
      }
      return a.planTime.localeCompare(b.planTime);
    });
  };

  const pending = sortTasks(tasks.filter(t => t.status === '待处理'));
  const postponed = sortTasks(tasks.filter(t => t.status === '已延期'));
  const done = sortTasks(tasks.filter(t => t.status === '已完成' || t.status === '已忽略'));

  const TaskItem = ({ task }) => {
    const plant = plants.find(p => p.id === task.plantId);
    const sp = species.find(s => s.id === plant?.speciesId);
    const iconName = getTaskIcon(task.type);

    const actions = [];
    if (task.status === '待处理') {
      actions.push(
        { label: '完成', color: 'var(--green)', icon: <Icon name="check" size={16} color="#fff" />, onClick: () => handleComplete(task.id) },
        { label: '延后', color: 'var(--orange)', icon: <Icon name="clock" size={16} color="#fff" />, onClick: () => handlePostpone(task.id) },
        { label: '忽略', color: '#c8c8c8', onClick: () => handleIgnore(task.id) },
      );
    } else if (task.status === '已延期') {
      actions.push(
        { label: '完成', color: 'var(--green)', icon: <Icon name="check" size={16} color="#fff" />, onClick: () => handleComplete(task.id) },
      );
    }

    const typeColor = {
      '浇水': '#4facfe',
      '施肥': '#43e97b',
      '修剪': '#fa709a',
      '换盆': '#a18cd1',
      '病虫害观察': '#f6d365',
    };
    const barColor = typeColor[task.type] || 'var(--text-placeholder)';

    return (
      <SwipeCell actions={actions}>
        <div className="cell" style={{ minHeight: '64px' }}>
          <div style={{
            width: '3px', height: '32px', borderRadius: '2px',
            background: barColor, marginRight: '12px', flexShrink: 0
          }} />
          <div className="cell-content">
            <div className="flex-between">
              <div>
                <div className="cell-title" style={{ fontWeight: '500' }}>{task.type}</div>
                <div className="cell-desc">
                  <Link to={`/plant/${task.plantId}`} style={{ color: 'var(--green)' }}>{plant?.nickname}</Link>
                  {' · '}{sp?.name}
                </div>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0, marginLeft: '8px' }}>
                <span className={`tag ${task.priority === '高' ? 'tag-red' : task.priority === '中' ? 'tag-orange' : 'tag-gray'}`}>
                  {task.priority}
                </span>
              </div>
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-placeholder)', marginTop: '4px' }}>
              {task.planTime} · {task.source}
            </div>
            {(task.status === '已完成' || task.status === '已忽略') && (
              <span className={`tag ${task.status === '已完成' ? 'tag-green' : 'tag-gray'}`} style={{ marginTop: '4px' }}>
                {task.status}
              </span>
            )}
            {task.status === '已延期' && (
              <span className="tag tag-orange" style={{ marginTop: '4px' }}>已延期</span>
            )}
          </div>
        </div>
      </SwipeCell>
    );
  };

  return (
    <div className="page" style={{ position: 'relative' }}>
      <div className="section" style={{ padding: '16px' }}>
        <div style={{ fontSize: '20px', fontWeight: '500' }}>养护任务</div>
        <div style={{ fontSize: '13px', color: 'var(--text-placeholder)', marginTop: '4px' }}>左滑任务可进行操作</div>
      </div>

      <div className="section" style={{ padding: '10px 16px' }}>
        <div className="flex gap-8">
          <button className={`btn btn-sm ${sortBy === 'priority' ? 'btn-primary' : 'btn-default'}`} onClick={() => setSortBy('priority')}>按优先级</button>
          <button className={`btn btn-sm ${sortBy === 'time' ? 'btn-primary' : 'btn-default'}`} onClick={() => setSortBy('time')}>按时间</button>
        </div>
      </div>

      {pending.length > 0 && (
        <div className="section">
          <div className="section-header">
            <span className="section-title" style={{ color: 'var(--red)' }}>待处理 ({pending.length})</span>
          </div>
          {pending.map(t => <TaskItem key={t.id} task={t} />)}
        </div>
      )}

      {postponed.length > 0 && (
        <div className="section">
          <div className="section-header">
            <span className="section-title" style={{ color: 'var(--orange)' }}>已延期 ({postponed.length})</span>
          </div>
          {postponed.map(t => <TaskItem key={t.id} task={t} />)}
        </div>
      )}

      {done.length > 0 && (
        <div className="section">
          <div className="section-header">
            <span className="section-title" style={{ color: 'var(--text-placeholder)' }}>已处理 ({done.length})</span>
          </div>
          {done.map(t => <TaskItem key={t.id} task={t} />)}
        </div>
      )}

      <button
        className="fab"
        onClick={() => setShowForm(true)}
        aria-label="添加任务"
      >
        <Icon name="plus" size={24} color="#fff" />
      </button>

      {showForm && (
        <div className="modal-mask" onClick={() => setShowForm(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div style={{ fontSize: '16px', fontWeight: '500', marginBottom: '16px' }}>新建养护任务</div>
            <div className="form-group">
              <div className="form-item">
                <span className="form-label">植物</span>
                <select
                  className="form-input"
                  value={newTask.plantId}
                  onChange={e => setNewTask(prev => ({ ...prev, plantId: e.target.value }))}
                  style={{ border: 'none' }}
                >
                  {plants.map(p => <option key={p.id} value={p.id}>{p.nickname}</option>)}
                </select>
              </div>
              <div className="form-item">
                <span className="form-label">类型</span>
                <select
                  className="form-input"
                  value={newTask.type}
                  onChange={e => setNewTask(prev => ({ ...prev, type: e.target.value }))}
                  style={{ border: 'none' }}
                >
                  {['浇水', '施肥', '修剪', '换盆', '病虫害观察', '其他'].map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div className="form-item">
                <span className="form-label">时间</span>
                <input
                  className="form-input"
                  type="datetime-local"
                  value={newTask.planTime}
                  onChange={e => setNewTask(prev => ({ ...prev, planTime: e.target.value }))}
                  style={{ border: 'none' }}
                />
              </div>
              <div className="form-item">
                <span className="form-label">优先级</span>
                <select
                  className="form-input"
                  value={newTask.priority}
                  onChange={e => setNewTask(prev => ({ ...prev, priority: e.target.value }))}
                  style={{ border: 'none' }}
                >
                  <option value="高">高</option>
                  <option value="中">中</option>
                  <option value="低">低</option>
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
              <button className="btn btn-default" style={{ flex: 1 }} onClick={() => setShowForm(false)}>取消</button>
              <button className="btn btn-primary" style={{ flex: 1 }} onClick={handleAddTask}>确认</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
