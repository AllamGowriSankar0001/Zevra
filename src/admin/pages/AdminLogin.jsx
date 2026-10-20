import { useState } from 'react';
import { adminAuthFetch, setAdminToken } from '../hooks/useAdminApi';
import {
  ArrowLeft,
  ArrowRight,
  Boxes,
  CheckCircle2,
  Eye,
  EyeOff,
  Lock,
  Mail,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
} from 'lucide-react';

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
      setError(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  }

  function handleUseDefaultCredentials() {
    setEmail('admin@zevra.com');
    setError('');
    const pwInput = document.getElementById('admin-login-password');
    if (pwInput) pwInput.focus();
  }

  return (
    <div className="admin-split-page">
      {/* ── Left Side: Branded Editorial Showcase ── */}
      <div className="admin-split-showcase">
        <div className="admin-split-showcase__overlay" />

        <div className="admin-split-showcase__content">
          {/* Top badge */}
          <div className="admin-split-showcase__header">
            <div className="admin-showcase__brand-pill">
              <span className="admin-showcase__brand-name">ZEVRA</span>
              <span className="admin-showcase__brand-divider">/</span>
              <span className="admin-showcase__brand-label">ATELIER CONSOLE</span>
            </div>
            <div className="admin-showcase__status-pill">
              <span className="admin-showcase__status-dot" />
              <span>System Online</span>
            </div>
          </div>

          {/* Editorial Quote / Hero */}
          <div className="admin-split-showcase__editorial">
            <span className="admin-showcase__eyebrow">
              <Sparkles size={14} /> Luxury Menswear Operations
            </span>
            <h2 className="admin-showcase__heading">
              Crafted with intention. <br />
              <em>Governed with precision.</em>
            </h2>
            <p className="admin-showcase__description">
              The centralized atelier hub for real-time inventory management, bespoke catalog curation,
              order fulfillment, and customer intelligence.
            </p>

            {/* Feature Highlights */}
            <div className="admin-showcase__features">
              <div className="admin-showcase__feature-item">
                <div className="admin-showcase__feature-icon">
                  <Boxes size={18} />
                </div>
                <div>
                  <h4>Catalog & Inventory Control</h4>
                  <p>Manage raw denim, oxford weaves, sizes, and stock limits in real time.</p>
                </div>
              </div>

              <div className="admin-showcase__feature-item">
                <div className="admin-showcase__feature-icon">
                  <ShoppingBag size={18} />
                </div>
                <div>
                  <h4>Order Pipeline & Dispatch</h4>
                  <p>Orchestrate purchases, customer tracking, and dispatch timelines effortlessly.</p>
                </div>
              </div>

              <div className="admin-showcase__feature-item">
                <div className="admin-showcase__feature-icon">
                  <ShieldCheck size={18} />
                </div>
                <div>
                  <h4>Encrypted Enterprise Portal</h4>
                  <p>Role-governed data protection and verified administrative sessions.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Info */}
          <div className="admin-split-showcase__footer">
            <span>Enterprise Edition 2.0</span>
            <span className="admin-showcase__bullet">•</span>
            <span>256-bit Encrypted Session</span>
            <span className="admin-showcase__bullet">•</span>
            <span>Restricted Access</span>
          </div>
        </div>
      </div>

      {/* ── Right Side: Sign-In Form ── */}
      <div className="admin-split-form-pane">
        <div className="admin-split-form-pane__top">
          <a href="/" className="admin-split-back-link" title="Return to store">
            <ArrowLeft size={16} />
            <span>Return to Storefront</span>
          </a>
        </div>

        <div className="admin-split-form-wrapper">
          <div className="admin-split-form-header">
            <div className="admin-split-logo-wrap">
              <img src="/images/brand/logo.png" alt="ZEVRA" className="admin-split-logo" />
            </div>
            <span className="admin-split-subtag">ADMINISTRATION ACCESS</span>
            <h1 className="admin-split-title">Welcome to Console</h1>
            <p className="admin-split-subtitle">
              Sign in with your verified administrative credentials to enter the workspace.
            </p>
          </div>

          {error && (
            <div className="admin-split-error" role="alert">
              <div className="admin-split-error__icon">!</div>
              <div className="admin-split-error__msg">{error}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="admin-split-form" noValidate>
            <div className="admin-split-field">
              <label htmlFor="admin-login-email">Email Address</label>
              <div className="admin-split-input-wrap">
                <Mail size={17} className="admin-split-input-icon" />
                <input
                  id="admin-login-email"
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

            <div className="admin-split-field">
              <div className="admin-split-field__header">
                <label htmlFor="admin-login-password">Password</label>
                <button
                  type="button"
                  onClick={handleUseDefaultCredentials}
                  className="admin-split-field__hint-btn"
                >
                  Use default: admin@zevra.com
                </button>
              </div>
              <div className="admin-split-input-wrap">
                <Lock size={17} className="admin-split-input-icon" />
                <input
                  id="admin-login-password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your admin password"
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
                  className="admin-split-password-toggle"
                  onClick={() => setShowPassword((prev) => !prev)}
                  tabIndex={-1}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="admin-split-options">
              <label className="admin-split-checkbox">
                <input type="checkbox" defaultChecked />
                <span>Keep session active for 7 days</span>
              </label>
            </div>

            <button
              type="submit"
              className="admin-split-submit-btn"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="admin-split-spinner" />
                  <span>Verifying Session…</span>
                </>
              ) : (
                <>
                  <span>Sign In to Console</span>
                  <ArrowRight size={17} />
                </>
              )}
            </button>
          </form>

          <div className="admin-split-security-badge">
            <CheckCircle2 size={15} />
            <span>Authorized personnel only. All access attempts are recorded.</span>
          </div>

          <div className="admin-split-form-footer">
            <p>© 2026 ZEVRA. Luxury Menswear Management System.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
