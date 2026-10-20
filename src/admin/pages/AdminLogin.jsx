import { useState } from 'react';
import { adminAuthFetch, setAdminToken } from '../hooks/useAdminApi';
import { ArrowLeft, ArrowRight, Eye, EyeOff, Lock, Mail, ShieldCheck } from 'lucide-react';

export default function AdminLogin({ onLogin }) {
  const [email, setEmail] = useState('admin@zevra.com');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!email.trim()) {
      setError('Email address is required.');
      return;
    }
    if (!password) {
      setError('Password is required.');
      return;
    }

    setError('');
    setLoading(true);
    try {
      const data = await adminAuthFetch('/login', { email: email.trim(), password });
      setAdminToken(data.token);
      onLogin(data.user);
    } catch (err) {
      setError(err.message || 'Authentication failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  }

  function handleUseDefaultCredentials(e) {
    e.preventDefault();
    setEmail('admin@zevra.com');
    setError('');
    const input = document.getElementById('admin-pw');
    if (input) input.focus();
  }

  return (
    <div className="admin-root admin-split">
      {/* ── Left Side: Visual & Editorial ── */}
      <div className="admin-split__visual">
        <div className="admin-split__visual-overlay" />
        
        <div className="admin-split__visual-content">
          <div className="admin-split__visual-top">
            <span className="admin-split__brand-tag">ZEVRA</span>
            <span className="admin-split__badge">CONSOLE</span>
          </div>

          <div className="admin-split__visual-bottom">
            <p className="admin-split__quote">
              &ldquo;Precision in every stitch. Control in every detail.&rdquo;
            </p>
            <div className="admin-split__meta">
              <span>Atelier Management System</span>
              <span className="admin-split__dot">&bull;</span>
              <span>Encrypted Session</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Right Side: Compact Centered Form ── */}
      <div className="admin-split__form-side">
        <a href="/" className="admin-split__back-link">
          <ArrowLeft size={14} />
          <span>Storefront</span>
        </a>

        <div className="admin-split__form-container">
          <div className="admin-split__header">
            <div className="admin-split__logo-wrap">
              <span className="admin-split__wordmark">ZEVRA</span>
            </div>
            <h1 className="admin-split__title">Admin Console</h1>
            <p className="admin-split__subtitle">Sign in to manage catalog, orders, and inventory.</p>
          </div>

          {error && (
            <div className="admin-split__error" role="alert">
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="admin-split__form">
            <div className="admin-split__group">
              <div className="admin-split__group-row">
                <label htmlFor="admin-email">Email address</label>
                <button
                  type="button"
                  onClick={handleUseDefaultCredentials}
                  className="admin-split__hint"
                >
                  Use admin email
                </button>
              </div>
              <div className="admin-split__input-box">
                <Mail size={15} className="admin-split__icon" />
                <input
                  id="admin-email"
                  type="email"
                  placeholder="admin@zevra.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError('');
                  }}
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            <div className="admin-split__group">
              <label htmlFor="admin-pw">Password</label>
              <div className="admin-split__input-box">
                <Lock size={15} className="admin-split__icon" />
                <input
                  id="admin-pw"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError('');
                  }}
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  className="admin-split__eye"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  aria-pressed={showPassword}
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="admin-split__btn"
              disabled={loading}
            >
              {loading ? (
                <span>Signing in…</span>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight size={15} />
                </>
              )}
            </button>
          </form>

          <div className="admin-split__secure-tag">
            <ShieldCheck size={13} />
            <span>Restricted terminal • 256-bit encryption</span>
          </div>

          <div className="admin-split__copyright">
            &copy; 2026 ZEVRA. All rights reserved.
          </div>
        </div>
      </div>
    </div>
  );
}
