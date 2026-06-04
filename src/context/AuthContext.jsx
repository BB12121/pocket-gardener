import { useCallback, useEffect, useMemo, useState } from 'react';
import { AUTH_TOKEN_KEY, fetchMe, login as loginApi, register as registerApi, setAuthToken } from '../services/api';
import { AuthContext } from './authContextValue';

const DEMO_MODE_KEY = 'pocket-gardener-demo-mode';
const DEMO_USER = {
  id: 'demo-user',
  avatar: '芽',
  username: '演示用户',
  city: '本地演示',
  reputation: 100,
};
const MODE_CHANGE_EVENT = 'pocket-gardener-auth-state-change';

function notifyModeChange() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(MODE_CHANGE_EVENT));
  }
}

export function AuthProvider({ children }) {
  const initialDemoMode = localStorage.getItem(DEMO_MODE_KEY) === '1';
  const [demoMode, setDemoMode] = useState(initialDemoMode);
  const [token, setToken] = useState(() => localStorage.getItem(AUTH_TOKEN_KEY) || '');
  const [user, setUser] = useState(() => (initialDemoMode ? DEMO_USER : null));
  const [checking, setChecking] = useState(() => Boolean(localStorage.getItem(AUTH_TOKEN_KEY)) && !initialDemoMode);

  useEffect(() => {
    if (demoMode || !token) {
      setAuthToken('');
      return undefined;
    }

    setAuthToken(token);
    let active = true;
    async function loadUser() {
      try {
        const current = await fetchMe();
        if (active) setUser(current);
      } catch {
        localStorage.removeItem(AUTH_TOKEN_KEY);
        setAuthToken('');
        if (active) {
          setToken('');
          setUser(null);
        }
      } finally {
        if (active) setChecking(false);
      }
    }
    loadUser();
    return () => {
      active = false;
    };
  }, [demoMode, token]);

  const applyAuth = useCallback((response) => {
    localStorage.removeItem(DEMO_MODE_KEY);
    localStorage.setItem(AUTH_TOKEN_KEY, response.token);
    setDemoMode(false);
    setAuthToken(response.token);
    setToken(response.token);
    setUser(response.user);
    setChecking(false);
    notifyModeChange();
    return response.user;
  }, []);

  const enterDemoMode = useCallback(() => {
    localStorage.setItem(DEMO_MODE_KEY, '1');
    localStorage.removeItem(AUTH_TOKEN_KEY);
    setDemoMode(true);
    setAuthToken('');
    setToken('');
    setUser(DEMO_USER);
    setChecking(false);
    notifyModeChange();
    return DEMO_USER;
  }, []);

  const login = useCallback(async (payload) => {
    const response = await loginApi(payload);
    return applyAuth(response);
  }, [applyAuth]);

  const register = useCallback(async (payload) => {
    const response = await registerApi(payload);
    return applyAuth(response);
  }, [applyAuth]);

  const logout = useCallback(() => {
    localStorage.removeItem(DEMO_MODE_KEY);
    localStorage.removeItem(AUTH_TOKEN_KEY);
    setDemoMode(false);
    setAuthToken('');
    setToken('');
    setUser(null);
    setChecking(false);
    notifyModeChange();
  }, []);

  useEffect(() => {
    window.addEventListener('pocket-gardener-auth-expired', logout);
    return () => window.removeEventListener('pocket-gardener-auth-expired', logout);
  }, [logout]);

  const value = useMemo(() => ({
    checking,
    demoMode,
    isAuthenticated: Boolean(demoMode || (token && user)),
    token,
    user,
    login,
    register,
    enterDemoMode,
    logout,
  }), [checking, demoMode, enterDemoMode, login, logout, register, token, user]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
