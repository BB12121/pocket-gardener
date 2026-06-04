import { useState } from 'react';
import { useAuth } from '../context/useAuth';
import { getApiBase, resetApiBase, saveApiBase } from '../services/api';

export default function Auth() {
  const { login, register, enterDemoMode, showcaseMode } = useAuth();
  const [mode, setMode] = useState('login');
  const [loginName, setLoginName] = useState('demo');
  const [password, setPassword] = useState('123456');
  const [username, setUsername] = useState('');
  const [city, setCity] = useState('');
  const [error, setError] = useState('');
  const [serverPanelOpen, setServerPanelOpen] = useState(false);
  const [serverInput, setServerInput] = useState(() => getApiBase());
  const [serverMessage, setServerMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const isRegister = mode === 'register';

  if (showcaseMode) {
    return (
      <div className="auth-page">
        <div className="auth-hero">
          <div className="auth-mark">芽</div>
          <div>
            <h1>口袋园丁</h1>
            <p>前端展示版</p>
          </div>
        </div>

        <div className="auth-panel">
          <div style={{ marginBottom: '14px' }}>
            <div style={{ fontSize: '17px', fontWeight: 700 }}>本地展示</div>
            <div style={{ marginTop: '6px', fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              使用内置演示数据预览应用界面。
            </div>
          </div>
          <button className="btn btn-primary btn-block" type="button" onClick={enterDemoMode}>
            进入本地展示
          </button>
        </div>
      </div>
    );
  }

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

  function openServerPanel() {
    setServerInput(getApiBase());
    setServerMessage('');
    setServerPanelOpen(true);
  }

  function handleSaveServer(event) {
    event.preventDefault();
    try {
      const nextApiBase = saveApiBase(serverInput);
      setServerInput(nextApiBase);
      setServerMessage('已保存，下一次登录会使用这个地址');
      setError('');
    } catch (err) {
      setServerMessage(err.message || '服务器地址格式不正确');
    }
  }

  function handleResetServer() {
    const defaultApiBase = resetApiBase();
    setServerInput(defaultApiBase);
    setServerMessage('已恢复默认服务器地址');
    setError('');
  }

  return (
    <div className="auth-page">
      <div className="auth-hero">
        <div className="auth-mark">芽</div>
        <div>
          <h1>口袋园丁</h1>
          <p>登录后管理你的植物档案、养护任务和社区互动。</p>
        </div>
        <button className="auth-settings-button" type="button" onClick={openServerPanel} aria-label="设置服务器地址" title="设置服务器地址">
          ⚙
        </button>
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

        {!isRegister && (
          <div className="auth-demo">
            演示账号 demo，密码 123456
          </div>
        )}
      </form>

      {serverPanelOpen && (
        <div className="auth-config-overlay" role="presentation" onClick={() => setServerPanelOpen(false)}>
          <form className="auth-config-sheet" onSubmit={handleSaveServer} onClick={event => event.stopPropagation()}>
            <div className="auth-config-head">
              <div>
                <h2>服务器地址</h2>
                <p>手机和电脑在同一网络时，填写电脑的后端地址。</p>
              </div>
              <button type="button" className="auth-config-close" onClick={() => setServerPanelOpen(false)} aria-label="关闭">
                ×
              </button>
            </div>

            <label className="auth-field">
              <span>后端 API 地址</span>
              <input
                value={serverInput}
                onChange={event => {
                  setServerInput(event.target.value);
                  setServerMessage('');
                }}
                placeholder="http://10.29.91.238:8080/api"
                inputMode="url"
                autoCapitalize="none"
                autoCorrect="off"
              />
            </label>

            <div className="auth-config-hint">
              例如填写 <span>http://10.29.91.238:8080/api</span>。如果只填到端口，系统会自动补上 /api。
            </div>

            {serverMessage && <div className="auth-config-message">{serverMessage}</div>}

            <div className="auth-config-actions">
              <button className="btn btn-default" type="button" onClick={handleResetServer}>
                恢复默认
              </button>
              <button className="btn btn-primary" type="submit">
                保存
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
