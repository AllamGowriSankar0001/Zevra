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
    <div className="auth-page auth-page--customer">
      <div className="auth-page__layout">
        <aside className="auth-page__story" aria-label="ZEVRA collection">
          <div className="auth-page__story-copy">
            <p className="auth-page__eyebrow">The ZEVRA experience</p>
            <p className="auth-page__story-title">Considered style.<br />Made for every day.</p>
            <p className="auth-page__story-note">Discover timeless essentials, thoughtfully made.</p>
          </div>
        </aside>

        <section className="auth-page__panel" aria-labelledby="login-title">
          <div className="auth-page__card">
            <div className="auth-page__brand">
              <img src="/images/brand/logo.png" alt="ZEVRA" className="auth-page__logo" />
            </div>

            <p className="auth-page__eyebrow auth-page__eyebrow--form">Your wardrobe, waiting</p>
            <h1 className="auth-page__title" id="login-title">Welcome back</h1>
            <p className="auth-page__sub">Sign in to pick up where you left off.</p>

            <form className="auth-page__form" onSubmit={handleSubmit} noValidate>
              <div className="auth-page__field">
                <label htmlFor="lp-email">Email address</label>
                <input id="lp-email" type="email" placeholder="you@example.com"
                  value={email} onChange={e => { setEmail(e.target.value); setError(''); }}
                  autoComplete="email" />
              </div>

              <div className="auth-page__field">
                <label htmlFor="lp-pw">Password</label>
                <div className="auth-page__pw-wrap">
                  <input id="lp-pw" type={show ? 'text' : 'password'} placeholder="Enter your password"
                    value={password} onChange={e => { setPassword(e.target.value); setError(''); }}
                    autoComplete="current-password" />
                  <button type="button" className="auth-page__toggle" onClick={() => setShow(s => !s)}
                    aria-pressed={show} aria-label={show ? 'Hide password' : 'Show password'}>
                    {show ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>

              {error && <p className="auth-page__error" role="alert">{error}</p>}

              <button type="submit" className="btn-primary auth-page__submit" disabled={loading}>
                {loading ? 'Signing in…' : 'Sign In'}
              </button>
            </form>

            <p className="auth-page__switch">
              New to ZEVRA?{' '}
              <button type="button" className="auth-page__switch-btn" onClick={onGoSignup}>Create an account</button>
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
