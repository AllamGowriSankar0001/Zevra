import { useState, useCallback } from 'react';

const API = 'http://localhost:4001/api/auth';

function getToken() {
  try { return localStorage.getItem('zevra_token'); } catch { return null; }
}
function saveToken(t) {
  try { localStorage.setItem('zevra_token', t); } catch {}
}
function clearToken() {
  try { localStorage.removeItem('zevra_token'); } catch {}
}

export function useAuth() {
  const [user, setUser]     = useState(() => {
    try { return JSON.parse(localStorage.getItem('zevra_user')); } catch { return null; }
  });
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');

  const signup = useCallback(async (name, email, password) => {
    setLoading(true); setError('');
    try {
      const res = await fetch(`${API}/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Signup failed.'); setLoading(false); return false; }
      saveToken(data.token);
      localStorage.setItem('zevra_user', JSON.stringify(data.user));
      setUser(data.user);
      setLoading(false);
      return true;
    } catch {
      setError('Cannot connect to server. Is the backend running?');
      setLoading(false);
      return false;
    }
  }, []);

  const login = useCallback(async (email, password) => {
    setLoading(true); setError('');
    try {
      const res = await fetch(`${API}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Login failed.'); setLoading(false); return false; }
      saveToken(data.token);
      localStorage.setItem('zevra_user', JSON.stringify(data.user));
      setUser(data.user);
      setLoading(false);
      return true;
    } catch {
      setError('Cannot connect to server. Is the backend running?');
      setLoading(false);
      return false;
    }
  }, []);

  const logout = useCallback(() => {
    clearToken();
    localStorage.removeItem('zevra_user');
    setUser(null);
  }, []);

  return { user, loading, error, signup, login, logout, setError };
}
