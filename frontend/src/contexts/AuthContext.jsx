import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { apiLogin, apiMe, getToken, setToken, clearToken } from '../lib/api';

const AuthContext = createContext({
  isAuthenticated: false,
  loading: true,
  login: async () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // On mount, verify any existing token
  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      if (!getToken()) {
        if (!cancelled) {
          setIsAuthenticated(false);
          setLoading(false);
        }
        return;
      }
      try {
        await apiMe();
        if (!cancelled) setIsAuthenticated(true);
      } catch {
        clearToken();
        if (!cancelled) setIsAuthenticated(false);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    run();
    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(async (password) => {
    const { token } = await apiLogin(password);
    setToken(token);
    setIsAuthenticated(true);
    return true;
  }, []);

  const logout = useCallback(() => {
    clearToken();
    setIsAuthenticated(false);
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
