import { useCallback, useEffect, useMemo, useState } from 'react';
import { AUTH_TOKEN_KEY, fetchMe, login as loginApi, register as registerApi, setAuthToken } from '../services/api';
import { AuthContext } from './authContextValue';

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(AUTH_TOKEN_KEY) || '');
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(() => Boolean(localStorage.getItem(AUTH_TOKEN_KEY)));

  useEffect(() => {
    setAuthToken(token);
    if (!token) {
      return;
    }
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
  }, [token]);

  const applyAuth = useCallback((response) => {
    localStorage.setItem(AUTH_TOKEN_KEY, response.token);
    setAuthToken(response.token);
    setToken(response.token);
    setUser(response.user);
    return response.user;
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
    localStorage.removeItem(AUTH_TOKEN_KEY);
    setAuthToken('');
    setToken('');
    setUser(null);
    setChecking(false);
  }, []);

  useEffect(() => {
    window.addEventListener('pocket-gardener-auth-expired', logout);
    return () => window.removeEventListener('pocket-gardener-auth-expired', logout);
  }, [logout]);

  const value = useMemo(() => ({
    checking,
    isAuthenticated: Boolean(token && user),
    token,
    user,
    login,
    register,
    logout,
  }), [checking, login, logout, register, token, user]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
