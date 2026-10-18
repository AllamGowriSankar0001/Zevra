import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

export default function SignupPage({ onSuccess, onGoLogin }) {
  const { signup, loading, error, setError } = useAuth();
  const [name, setName]         = useState('');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm]   = useState('');
  const [show, setShow]         = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim())      { setError('Name is required.'); return; }
    if (!email.trim())     { setError('Email is required.'); return; }
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return; }
    if (password !== confirm) { setError('Passwords do not match.'); return; }
    const ok = await signup(name.trim(), email.trim(), password);
    if (ok) onSuccess?.();
  }

  return (
    <div className="auth-page">
      <div className="auth-page__card">
        <div className="auth-page__brand">
          <img src="/images/brand/logo.png" alt="ZEVRA" className="auth-page__logo" />
        </div>

        <h1 className="auth-page__title">Create account</h1>
        <p className="auth-page__sub">Join ZEVRA for a better shopping experience.</p>

        <form className="auth-page__form" onSubmit={handleSubmit} noValidate>
          <div className="auth-page__field">
            <label htmlFor="sp-name">Full name</label>
            <input id="sp-name" type="text" placeholder="Your name"
              value={name} onChange={e => { setName(e.target.value); setError(''); }}
              autoComplete="name" />
          </div>

          <div className="auth-page__field">
            <label htmlFor="sp-email">Email</label>
            <input id="sp-email" type="email" placeholder="you@example.com"
              value={email} onChange={e => { setEmail(e.target.value); setError(''); }}
              autoComplete="email" />
          </div>

          <div className="auth-page__field">
            <label htmlFor="sp-pw">Password</label>
            <div className="auth-page__pw-wrap">
              <input id="sp-pw" type={show ? 'text' : 'password'} placeholder="Min. 8 characters"
                value={password} onChange={e => { setPassword(e.target.value); setError(''); }}
                autoComplete="new-password" />
              <button type="button" className="auth-page__toggle" onClick={() => setShow(s => !s)}>
                {show ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          <div className="auth-page__field">
            <label htmlFor="sp-confirm">Confirm password</label>
            <input id="sp-confirm" type={show ? 'text' : 'password'} placeholder="Repeat password"
              value={confirm} onChange={e => { setConfirm(e.target.value); setError(''); }}
              autoComplete="new-password" />
          </div>

          {error && <p className="auth-page__error" role="alert">{error}</p>}

          <button type="submit" className="btn-primary auth-page__submit" disabled={loading}>
            {loading ? 'Creating account…' : 'Create Account'}
          </button>
        </form>

        <p className="auth-page__switch">
          Already have an account?{' '}
          <button className="auth-page__switch-btn" onClick={onGoLogin}>Log In</button>
        </p>
      </div>
    </div>
  );
}
