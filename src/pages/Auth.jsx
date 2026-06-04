import { useState } from 'react';
import { useAuth } from '../context/useAuth';

export default function Auth() {
  const { login, register, enterDemoMode, demoMode } = useAuth();
  const [mode, setMode] = useState('login');
  const [loginName, setLoginName] = useState('demo');
  const [password, setPassword] = useState('123456');
  const [username, setUsername] = useState('');
  const [city, setCity] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const isRegister = mode === 'register';

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      if (isRegister) {
        await register({ loginName, password, username, city });
      } else {
        await login({ loginName, password });
      }
    } catch (err) {
      setError(err.message || '操作失败，请稍后重试');
    } finally {
      setSubmitting(false);
    }
  }

  function switchMode(nextMode) {
    setMode(nextMode);
    setError('');
    if (nextMode === 'login') {
      setLoginName('demo');
      setPassword('123456');
    } else {
      setLoginName('');
      setPassword('');
      setUsername('');
      setCity('');
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-hero">
        <div className="auth-mark">芽</div>
        <div>
          <h1>口袋园丁</h1>
          <p>登录后管理你的植物档案、养护任务和社区互动。</p>
        </div>
      </div>

      <form className="auth-panel" onSubmit={handleSubmit}>
        <div className="auth-tabs" aria-label="认证方式">
          <button type="button" className={mode === 'login' ? 'active' : ''} onClick={() => switchMode('login')}>登录</button>
          <button type="button" className={mode === 'register' ? 'active' : ''} onClick={() => switchMode('register')}>注册</button>
        </div>

        {isRegister && (
          <label className="auth-field">
            <span>昵称</span>
            <input value={username} onChange={e => setUsername(e.target.value)} placeholder="例如：阳台园丁" required />
          </label>
        )}

        <label className="auth-field">
          <span>账号</span>
          <input value={loginName} onChange={e => setLoginName(e.target.value)} placeholder="请输入账号" required />
        </label>

        <label className="auth-field">
          <span>密码</span>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="至少 6 位" required minLength={6} />
        </label>

        {isRegister && (
          <label className="auth-field">
            <span>城市</span>
            <input value={city} onChange={e => setCity(e.target.value)} placeholder="例如：杭州" />
          </label>
        )}

        {error && <div className="auth-error">{error}</div>}

        <button className="btn btn-primary btn-block" type="submit" disabled={submitting}>
          {submitting ? '处理中...' : isRegister ? '创建账号' : '进入花园'}
        </button>

        <button
          type="button"
          className="btn btn-default btn-block"
          onClick={enterDemoMode}
          style={{ marginTop: '10px' }}
        >
          进入演示模式
        </button>

        {!isRegister && (
          <div className="auth-demo">
            演示账号 demo，密码 123456 · 也可以直接进入演示模式
          </div>
        )}

        {demoMode && (
          <div className="auth-demo" style={{ marginTop: '8px', color: 'var(--green)' }}>
            当前处于演示模式
          </div>
        )}
      </form>
    </div>
  );
}
