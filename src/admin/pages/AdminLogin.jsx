import { useState } from 'react';
import { adminAuthFetch, setAdminToken } from '../hooks/useAdminApi';

export default function AdminLogin({ onLogin }) {
  const [email,    setEmail]    = useState('admin@zevra.com');
  const [password, setPassword] = useState('');
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const data = await adminAuthFetch('/login', { email: email.trim(), password });
      setAdminToken(data.token);
      onLogin(data.user);
    } catch (err) {
      setError(err.message || 'Login failed.');
    } finally { setLoading(false); }
  }

  return (
    <div className="admin-root admin-login">
      <div className="admin-login__card">
        <div className="admin-login__logo">
          <img src="/images/brand/logo.png" alt="ZEVRA" />
        </div>
        <h1 className="admin-login__title">Admin Panel</h1>
        <p className="admin-login__sub">Sign in with your administrator account.</p>
        {error && <div className="admin-error">{error}</div>}
        <form onSubmit={handleSubmit} className="admin-form">
          <div className="admin-field">
            <label>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div className="admin-field">
            <label>Password</label>
            <input type="password" placeholder="••••••••" value={password}
              onChange={e => setPassword(e.target.value)} required />
          </div>
          <button type="submit" className="a-btn a-btn--primary" disabled={loading}
            style={{ width:'100%', height:40, marginTop:4 }}>
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
