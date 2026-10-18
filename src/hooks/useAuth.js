import { useState, useCallback, useEffect } from 'react';
import { authApi } from '../services/api';

export function useAuth() {
  const [user,    setUser]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');

  // Restore session on mount
  useEffect(() => {
    authApi.me()
      .then(data => setUser(data.data.user || null))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const register = useCallback(async (fullName, email, password, phone) => {
    setLoading(true); setError('');
    try {
      const data = await authApi.register({ fullName, email, password, phone });
      setUser(data.data.user);
      return true;
    } catch (err) {
      setError(err.message || 'Registration failed.');
      return false;
    } finally { setLoading(false); }
  }, []);

  const login = useCallback(async (email, password) => {
    setLoading(true); setError('');
    try {
      const data = await authApi.login({ email, password });
      setUser(data.data.user);
      return true;
    } catch (err) {
      setError(err.message || 'Login failed.');
      return false;
    } finally { setLoading(false); }
  }, []);

  const logout = useCallback(async () => {
    try { await authApi.logout(); } catch { /* ignore */ }
    setUser(null);
  }, []);

  return { user, loading, error, register, login, logout, setError, setUser };
}
