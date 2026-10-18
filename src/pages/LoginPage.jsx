import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

export default function LoginPage({ onSuccess, onGoSignup }) {
  const { login, loading, error, setError } = useAuth();
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow]         = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!email.trim()) { setError('Email is required.'); return; }
    if (!password)     { setError('Password is required.'); return; }
    const ok = await login(email.trim(), password);
    if (ok) onSuccess?.();
  }

  return (
    <div className="auth-page">
      <div className="auth-page__card">
        <div className="auth-page__brand">
          <img src="/images/brand/logo.png" alt="ZEVRA" className="auth-page__logo" />
        </div>

        <h1 className="auth-page__title">Welcome back</h1>
        <p className="auth-page__sub">Log in to your ZEVRA account.</p>

        <form className="auth-page__form" onSubmit={handleSubmit} noValidate>
          <div className="auth-page__field">
            <label htmlFor="lp-email">Email</label>
            <input id="lp-email" type="email" placeholder="you@example.com"
              value={email} onChange={e => { setEmail(e.target.value); setError(''); }}
              autoComplete="email" />
          </div>

          <div className="auth-page__field">
            <label htmlFor="lp-pw">Password</label>
            <div className="auth-page__pw-wrap">
              <input id="lp-pw" type={show ? 'text' : 'password'} placeholder="••••••••"
                value={password} onChange={e => { setPassword(e.target.value); setError(''); }}
                autoComplete="current-password" />
              <button type="button" className="auth-page__toggle" onClick={() => setShow(s => !s)}>
                {show ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          {error && <p className="auth-page__error" role="alert">{error}</p>}

          <button type="submit" className="btn-primary auth-page__submit" disabled={loading}>
            {loading ? 'Logging in…' : 'Log In'}
          </button>
        </form>

        <p className="auth-page__switch">
          Don't have an account?{' '}
          <button className="auth-page__switch-btn" onClick={onGoSignup}>Sign Up</button>
        </p>
      </div>
    </div>
  );
}
